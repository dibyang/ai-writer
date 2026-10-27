"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { checkProjectRulePack } = require("./project-rule-pack-check");
const { listFiles, pluginRoot } = require("./lib");

const MANUSCRIPT_DIRS = new Set(["chapters", "chapter", "drafts", "draft", "manuscripts", "manuscript", "正文"]);
const REPORT_EXTENSIONS = new Set([".json"]);

function parseArgs(argv) {
  const args = { project: null, out: null, force: false, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--project") {
      args.project = argv[++i];
    } else if (arg === "--out") {
      args.out = argv[++i];
    } else if (arg === "--force") {
      args.force = true;
    } else if (arg === "--dry-run") {
      args.dryRun = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  if (!args.project) throw new Error("Missing --project <directory>");
  if (!args.dryRun && !args.out) throw new Error("Missing --out <directory> unless --dry-run is used");
  return args;
}

function normalizeRef(file, root) {
  return path.relative(root, file).replace(/\\/g, "/");
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function isManuscriptPath(relative) {
  return relative.split("/").some(part => MANUSCRIPT_DIRS.has(part.toLowerCase()));
}

function collectProjectDiagnostics(projectRoot) {
  const files = listFiles(projectRoot);
  const includedReports = [];
  const excludedManuscripts = [];
  const considered = [];

  for (const file of files) {
    const relative = normalizeRef(file, projectRoot);
    considered.push(relative);
    if (isManuscriptPath(relative)) {
      excludedManuscripts.push(relative);
      continue;
    }
    if (relative.startsWith("reports/") && REPORT_EXTENSIONS.has(path.extname(file).toLowerCase())) {
      includedReports.push({
        path: relative,
        sha256: sha256(file),
        bytes: fs.statSync(file).size
      });
    }
  }

  const rulePackPath = path.join(projectRoot, "rule-pack.json");
  const rulePack = fs.existsSync(rulePackPath)
    ? {
        path: "rule-pack.json",
        sha256: sha256(rulePackPath),
        bytes: fs.statSync(rulePackPath).size
      }
    : null;

  return {
    considered_files: considered.sort(),
    excluded_manuscripts: excludedManuscripts.sort(),
    included_reports: includedReports.sort((a, b) => a.path.localeCompare(b.path)),
    rule_pack: rulePack
  };
}

function createSupportBundle(options = {}) {
  const root = options.root || pluginRoot();
  const projectRoot = path.resolve(root, options.project);
  const errors = [];

  if (!fs.existsSync(projectRoot)) {
    errors.push(`project directory not found: ${options.project}`);
  } else if (!fs.statSync(projectRoot).isDirectory()) {
    errors.push(`project path is not a directory: ${options.project}`);
  }

  let diagnostics = {
    considered_files: [],
    excluded_manuscripts: [],
    included_reports: [],
    rule_pack: null
  };

  if (errors.length === 0) {
    diagnostics = collectProjectDiagnostics(projectRoot);
    errors.push(...checkProjectRulePack(path.join(projectRoot, "rule-pack.json")));
    if (diagnostics.excluded_manuscripts.length === 0) {
      errors.push("support bundle must prove manuscript files are excluded");
    }
  }

  const manifest = {
    schema_version: "story-gate-support-bundle@0.1.0",
    verdict: errors.length === 0 ? "pass" : "blocked",
    privacy_boundary: "No manuscript text, chapter draft, visual asset, or customer private prose is copied into this support bundle.",
    project_label: path.basename(projectRoot),
    diagnostics,
    errors
  };

  if (!options.dryRun && errors.length === 0) {
    const outRoot = path.resolve(root, options.out);
    if (fs.existsSync(outRoot) && !options.force) {
      throw new Error(`Support bundle output already exists: ${outRoot}`);
    }
    fs.mkdirSync(outRoot, { recursive: true });
    fs.writeFileSync(path.join(outRoot, "support-bundle.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
    manifest.output = outRoot;
  }

  return manifest;
}

function run(argv = process.argv.slice(2)) {
  try {
    const args = parseArgs(argv);
    const report = createSupportBundle(args);
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

module.exports = { createSupportBundle, isManuscriptPath, run };
