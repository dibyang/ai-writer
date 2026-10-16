"use strict";

const fs = require("fs");
const path = require("path");
const { evaluateBatch } = require("./chapter-batch-metrics");
const { evaluateChapterGate, loadChapterGateInput } = require("./chapter-gate");
const { getBlockedTerms } = require("./commercial-release-check");
const { runHostAdapter } = require("./host-adapter");
const { checkProjectRulePack } = require("./project-rule-pack-check");
const { evaluateReviewScorecard } = require("./review-scorecard");
const { createSupportBundle } = require("./support-bundle");
const { listFiles, pluginRoot, readJson } = require("./lib");

function parseArgs(argv) {
  const args = { project: null, out: null, supportOut: null };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--project") {
      args.project = argv[++i];
    } else if (arg === "--out") {
      args.out = argv[++i];
    } else if (arg === "--support-out") {
      args.supportOut = argv[++i];
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  if (!args.project) args.project = "examples/customer-pilot";
  return args;
}

function relative(file, root = pluginRoot()) {
  return path.relative(root, file).replace(/\\/g, "/");
}

function chapterFiles(projectRoot) {
  const chaptersRoot = path.join(projectRoot, "chapters");
  if (!fs.existsSync(chaptersRoot)) return [];
  return listFiles(chaptersRoot, file => [".md", ".txt"].includes(path.extname(file).toLowerCase())).sort();
}

function scanPrivateMarkers(projectRoot, root = pluginRoot()) {
  const blocklist = readJson(path.join(root, "references", "private-content-blocklist.json"));
  const terms = getBlockedTerms(blocklist);
  const hits = [];
  for (const file of listFiles(projectRoot, item => [".md", ".json", ".txt"].includes(path.extname(item).toLowerCase()))) {
    if (file.endsWith(path.join("references", "private-content-blocklist.json"))) continue;
    const text = fs.readFileSync(file, "utf8");
    for (const term of terms) {
      if (text.includes(term)) hits.push(`${relative(file, root)} contains private marker`);
    }
  }
  return hits;
}

function runCustomerPilot(options = {}) {
  const root = options.root || pluginRoot();
  const projectRoot = path.resolve(root, options.project || "examples/customer-pilot");
  const errors = [];

  if (!fs.existsSync(projectRoot)) {
    errors.push(`customer pilot project not found: ${options.project}`);
  }
  const rulePackPath = path.join(projectRoot, "rule-pack.json");
  const chapterGatePath = path.join(projectRoot, "chapter-gate.json");
  const hostRequestPath = path.join(projectRoot, "host-request.json");
  const chapters = fs.existsSync(projectRoot) ? chapterFiles(projectRoot) : [];

  if (errors.length === 0) {
    if (!fs.existsSync(rulePackPath)) errors.push("missing customer pilot rule-pack.json");
    if (!fs.existsSync(chapterGatePath)) errors.push("missing customer pilot chapter-gate.json");
    if (!fs.existsSync(hostRequestPath)) errors.push("missing customer pilot host-request.json");
    if (chapters.length === 0) errors.push("missing customer pilot chapter fixtures");
  }

  let rulePackErrors = [];
  let reviewReport = null;
  let batchReport = null;
  let chapterGateReport = null;
  let hostResponse = null;
  let supportReport = null;

  if (errors.length === 0) {
    rulePackErrors = checkProjectRulePack(rulePackPath);
    errors.push(...rulePackErrors.map(error => `rule pack: ${error}`));
    errors.push(...scanPrivateMarkers(projectRoot, root));

    reviewReport = evaluateReviewScorecard(chapters, { rulePack: "anonymous-customer-pilot@0.1.0" });
    if (reviewReport.verdict !== "pass") errors.push(`review-scorecard verdict: ${reviewReport.verdict}`);

    batchReport = evaluateBatch(chapters, { rulePack: "anonymous-customer-pilot@0.1.0" });
    if (batchReport.verdict !== "pass") errors.push(`chapter-batch-metrics verdict: ${batchReport.verdict}`);

    const gateInput = loadChapterGateInput(chapterGatePath);
    chapterGateReport = evaluateChapterGate(gateInput.input, gateInput);
    if (chapterGateReport.verdict !== "pass") errors.push(`chapter-gate verdict: ${chapterGateReport.verdict}`);

    hostResponse = runHostAdapter(relative(hostRequestPath, root), root);
    if (hostResponse.exit_code !== 0) errors.push(`host-run exit code: ${hostResponse.exit_code}`);

    supportReport = createSupportBundle({
      root,
      project: relative(projectRoot, root),
      out: options.supportOut,
      dryRun: !options.supportOut,
      force: true
    });
    if (supportReport.verdict !== "pass") errors.push(...supportReport.errors.map(error => `support bundle: ${error}`));
  }

  const report = {
    report_id: "sgm-customer-pilot",
    module_id: "SGM-PILOT-001",
    mode: "novel",
    target_refs: [relative(projectRoot, root)],
    source_refs: [
      "docs/customer-pilot.md",
      "docs/support-playbook.md",
      "docs/phased-roadmap.md#P9"
    ],
    verdict: errors.length === 0 ? "pass" : "blocked",
    findings: errors.map(error => ({
      rule_id: "SGM-PILOT-001-R001",
      severity: "blocker",
      location: relative(projectRoot, root),
      recommendation: error,
      source_refs: ["docs/customer-pilot.md#Acceptance"]
    })),
    checks: {
      rule_pack: rulePackErrors.length === 0 ? "pass" : "blocked",
      review_scorecard: reviewReport ? reviewReport.verdict : "not_run",
      chapter_batch_metrics: batchReport ? batchReport.verdict : "not_run",
      chapter_gate: chapterGateReport ? chapterGateReport.verdict : "not_run",
      host_run: hostResponse ? hostResponse.status : "not_run",
      support_bundle: supportReport ? supportReport.verdict : "not_run"
    },
    reports: {
      review_scorecard: reviewReport,
      chapter_batch_metrics: batchReport,
      chapter_gate: chapterGateReport,
      host_run: hostResponse,
      support_bundle: supportReport
    }
  };

  if (options.out) {
    const out = path.isAbsolute(options.out) ? options.out : path.resolve(process.cwd(), options.out);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  }

  return report;
}

function run(argv = process.argv.slice(2)) {
  try {
    const args = parseArgs(argv);
    const report = runCustomerPilot(args);
    console.log(JSON.stringify(report, null, 2));
    return report.verdict === "pass" ? 0 : 1;
  } catch (error) {
    console.error(error.message || String(error));
    return 2;
  }
}

if (require.main === module) {
  process.exitCode = run();
}

module.exports = { run, runCustomerPilot, scanPrivateMarkers };
