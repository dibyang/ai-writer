"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const { evaluateBatch } = require("../scripts/chapter-batch-metrics");
const { evaluateBlindReadGate } = require("../scripts/blind-read-gate");
const { evaluateChapterGate } = require("../scripts/chapter-gate");
const { evaluateReviewScorecard } = require("../scripts/review-scorecard");
const { runHostAdapter, validateRequest } = require("../scripts/host-adapter");
const { buildPrivatePackage } = require("../scripts/build-private-package");
const { buildReleaseArchive } = require("../scripts/build-release-archive");
const { validateCustomerInstall } = require("../scripts/customer-install-smoke");
const { runCustomerPilot } = require("../scripts/customer-pilot");
const { validateCommercialRelease } = require("../scripts/commercial-release-check");
const { validateCommercialReadiness } = require("../scripts/commercial-readiness-check");
const { initProjectRulePack } = require("../scripts/init-project-rule-pack");
const { installLocal } = require("../scripts/install-local");
const { checkProjectRulePack } = require("../scripts/project-rule-pack-check");
const { createSupportBundle } = require("../scripts/support-bundle");
const { validateReleaseMetadata } = require("../scripts/release-check");
const { validateFixtures } = require("../scripts/validate-fixtures");
const { validatePrivatePackage } = require("../scripts/private-package-check");
const { validateReports } = require("../scripts/validate-report");
const { validateRulePack } = require("../scripts/validate-rule-pack");
const { validateStructure } = require("../scripts/validate-plugin-structure");
const { validateDesignContracts } = require("../scripts/validate-design-contracts");
const { validateTaskRegistry } = require("../scripts/validate-task-registry");
const { validateEncoding, validateScriptSmoke } = require("../scripts/run-quality-gates");

const ROOT = path.resolve(__dirname, "..");

function runNode(args) {
  return spawnSync(process.execPath, args, {
    cwd: ROOT,
    encoding: "utf8"
  });
}

test("QG-001 plugin structure passes", () => {
  assert.deepEqual(validateStructure(), []);
});

test("QG-002 rule pack schema passes", () => {
  assert.deepEqual(validateRulePack(), []);
});

test("QG-003 report schema passes", () => {
  assert.deepEqual(validateReports(), []);
});

test("QG-004 fixture regression and QG-006 mode isolation pass", () => {
  assert.deepEqual(validateFixtures(), []);
});

test("chapter gate executable returns pass and blocked verdicts", () => {
  const pass = evaluateChapterGate({
    chapter_goal: "Reveal a partial witness record before the suspect leaves town.",
    main_event: "The witness record is opened in front of two opposing stakeholders.",
    worsening: "Speaking early exposes the witness; waiting lets the suspect destroy evidence.",
    reader_mainline: "A witness record can save one person but expose another.",
    physical_operability: "The record is folded inside a sealed folder; only the top witness line is visible until the second flap is opened under a desk lamp.",
    next_pursuit: "Who benefits if the route ledger disappears tonight?"
  });
  assert.equal(pass.verdict, "pass");

  const blocked = evaluateChapterGate({
    chapter_goal: "The protagonist reviews background files.",
    main_event: "Research notes are checked.",
    worsening: "",
    reader_mainline: "",
    next_pursuit: "Maybe the truth is hidden somewhere."
  });
  assert.equal(blocked.verdict, "blocked");
  assert.equal(blocked.findings[0].rule_id, "SGM-CHAP-001-R001");

  const physicalBlocked = evaluateChapterGate({
    chapter_goal: "Reveal a partial witness record before the suspect leaves town.",
    main_event: "The witness record is opened in front of two opposing stakeholders.",
    worsening: "Speaking early exposes the witness; waiting lets the suspect destroy evidence.",
    reader_mainline: "A witness record can save one person but expose another.",
    next_pursuit: "Who benefits if the route ledger disappears tonight?"
  });
  assert.equal(physicalBlocked.verdict, "blocked");
  assert.equal(physicalBlocked.findings[0].rule_id, "SGM-PHY-001-R001");

  const physicalVagueBlocked = evaluateChapterGate({
    chapter_goal: "Reveal a partial witness record before the suspect leaves town.",
    main_event: "The witness record is opened in front of two opposing stakeholders.",
    worsening: "Speaking early exposes the witness; waiting lets the suspect destroy evidence.",
    reader_mainline: "A witness record can save one person but expose another.",
    physical_operability: "The reveal is physically reasonable and works in the scene.",
    next_pursuit: "Who benefits if the route ledger disappears tonight?"
  });
  assert.equal(physicalVagueBlocked.verdict, "blocked");
  assert.equal(physicalVagueBlocked.findings[0].rule_id, "SGM-PHY-001-R002");

  const smallObjectActionBlocked = evaluateChapterGate({
    chapter_goal: "Preserve a small paper corner before the suspect leaves town.",
    main_event: "The paper corner is revealed beside the sealed witness record.",
    worsening: "Mishandling it loses the only trace connecting the record to the route ledger.",
    reader_mainline: "A tiny paper corner can prove the witness record was opened.",
    physical_operability: "The paper corner stays under the folder edge beside the desk lamp, visible only from the left angle.",
    next_pursuit: "Who opened the folder before the official review?"
  });
  assert.equal(smallObjectActionBlocked.verdict, "blocked");
  assert.equal(smallObjectActionBlocked.findings[0].rule_id, "SGM-PHY-001-R003");

  const objectContinuityBlocked = evaluateChapterGate({
    chapter_goal: "Preserve a wet paper corner before the suspect leaves town.",
    main_event: "The wet paper corner is shown beside the sealed witness record.",
    worsening: "Mishandling it loses the only trace connecting the record to the route ledger.",
    reader_mainline: "A wet paper corner can prove the witness record was opened.",
    physical_operability: "The wet paper corner is supported on cloth under the desk lamp, then pinched by the edge with bare fingers and carried as a large bundle.",
    next_pursuit: "Who opened the folder before the official review?"
  });
  assert.equal(objectContinuityBlocked.verdict, "blocked");
  assert.equal(objectContinuityBlocked.findings[0].rule_id, "SGM-PHY-001-R004");

  const dualBodyBlocked = evaluateChapterGate({
    chapter_goal: "The investigator must use a sleep trigger to return to the historical body before the sealed record is moved.",
    main_event: "She wakes in the historical body beside the sealed folder and opens the witness flap before the guard arrives.",
    worsening: "If she waits, the folder leaves the archive; if she speaks, the sleeping modern body becomes suspicious to the monitor.",
    reader_mainline: "A body switch can save the record but creates a second unattended body risk.",
    physical_operability: "The record is folded inside a sealed folder; the visible line appears only after the second flap is opened under the desk lamp at the archive table.",
    next_pursuit: "Who moved the historical body while the modern body was asleep?"
  });
  assert.equal(dualBodyBlocked.verdict, "blocked");
  assert.equal(dualBodyBlocked.findings[0].rule_id, "SGM-DUAL-001-R001");

  const observedFactBlocked = evaluateChapterGate({
    chapter_goal: "The investigator must compare an archived seal photo with the current evidence record.",
    main_event: "A photographed and archived seal record is reopened after the suspect's confession.",
    worsening: "If the seal is unreliable, every earlier witness statement becomes contestable.",
    reader_mainline: "A recorded seal can expose a cover story only if the record itself stays trustworthy.",
    physical_operability: "The seal record lies inside a numbered folder on the table; under side light, the edge layer and pressure mark are visible, but new words appeared in the archived photo after the past action.",
    next_pursuit: "Who benefits if the archive can be treated as unstable?"
  });
  assert.equal(observedFactBlocked.verdict, "blocked");
  assert.equal(observedFactBlocked.findings[0].rule_id, "SGM-DUAL-001-R002");

  const crossArtifactBlocked = evaluateChapterGate({
    chapter_goal: "The investigator must decide whether to use a surgical knife to preserve a sealed layer.",
    main_event: "A modern surgical knife is brought into the past and used on the sealed evidence layer.",
    worsening: "If the cut fails, the whole record looks contaminated; if it succeeds, the modern source becomes dangerous.",
    reader_mainline: "A modern tool can only matter if its source and cost are traceable.",
    physical_operability: "The surgical knife presses against the seal edge on a flat table; the cut direction follows the layer line under side light with controlled pressure.",
    next_pursuit: "What does the tool's source cost in the present?"
  });
  assert.equal(crossArtifactBlocked.verdict, "blocked");
  assert.equal(crossArtifactBlocked.findings[0].rule_id, "SGM-DUAL-001-R003");
});

test("story-gate CLI exposes tasks and chapter-gate command", () => {
  const tasks = runNode(["scripts/story-gate.js", "tasks"]);
  assert.equal(tasks.status, 0);
  assert.match(tasks.stdout, /TASK-CHAP-GATE/);

  const pass = runNode(["scripts/story-gate.js", "chapter-gate", "examples/fixtures/chapter-gate-pass.json"]);
  assert.equal(pass.status, 0);
  assert.match(pass.stdout, /"verdict": "pass"/);

  const blocked = runNode(["scripts/story-gate.js", "chapter-gate", "examples/fixtures/chapter-gate-block.json"]);
  assert.equal(blocked.status, 1);
  assert.match(blocked.stdout, /"verdict": "blocked"/);

  const physicalBlocked = runNode(["scripts/story-gate.js", "chapter-gate", "examples/fixtures/chapter-gate-physical-block.json"]);
  assert.equal(physicalBlocked.status, 1);
  assert.match(physicalBlocked.stdout, /"rule_id": "SGM-PHY-001-R001"/);

  const physicalVagueBlocked = runNode(["scripts/story-gate.js", "chapter-gate", "examples/fixtures/chapter-gate-physical-vague-block.json"]);
  assert.equal(physicalVagueBlocked.status, 1);
  assert.match(physicalVagueBlocked.stdout, /"rule_id": "SGM-PHY-001-R002"/);

  const smallObjectActionBlocked = runNode(["scripts/story-gate.js", "chapter-gate", "examples/fixtures/chapter-gate-small-object-action-block.json"]);
  assert.equal(smallObjectActionBlocked.status, 1);
  assert.match(smallObjectActionBlocked.stdout, /"rule_id": "SGM-PHY-001-R003"/);

  const objectContinuityBlocked = runNode(["scripts/story-gate.js", "chapter-gate", "examples/fixtures/chapter-gate-object-continuity-block.json"]);
  assert.equal(objectContinuityBlocked.status, 1);
  assert.match(objectContinuityBlocked.stdout, /"rule_id": "SGM-PHY-001-R004"/);

  const dualBodyBlocked = runNode(["scripts/story-gate.js", "chapter-gate", "examples/fixtures/chapter-gate-dual-body-continuity-block.json"]);
  assert.equal(dualBodyBlocked.status, 1);
  assert.match(dualBodyBlocked.stdout, /"rule_id": "SGM-DUAL-001-R001"/);

  const observedFactBlocked = runNode(["scripts/story-gate.js", "chapter-gate", "examples/fixtures/chapter-gate-observed-fact-rewrite-block.json"]);
  assert.equal(observedFactBlocked.status, 1);
  assert.match(observedFactBlocked.stdout, /"rule_id": "SGM-DUAL-001-R002"/);

  const crossArtifactBlocked = runNode(["scripts/story-gate.js", "chapter-gate", "examples/fixtures/chapter-gate-cross-artifact-lifecycle-block.json"]);
  assert.equal(crossArtifactBlocked.status, 1);
  assert.match(crossArtifactBlocked.stdout, /"rule_id": "SGM-DUAL-001-R003"/);
});

test("blind-read gate enforces isolated single and continuous ticket rules", () => {
  const passInput = JSON.parse(fs.readFileSync(path.join(ROOT, "examples", "fixtures", "blind-read-pass.json"), "utf8")).input;
  const isolationInput = JSON.parse(fs.readFileSync(path.join(ROOT, "examples", "fixtures", "blind-read-isolation-block.json"), "utf8")).input;
  const averageInput = JSON.parse(fs.readFileSync(path.join(ROOT, "examples", "fixtures", "blind-read-average-mask-block.json"), "utf8")).input;
  const continuousInput = JSON.parse(fs.readFileSync(path.join(ROOT, "examples", "fixtures", "blind-read-continuous-block.json"), "utf8")).input;
  const contextLeakInput = JSON.parse(fs.readFileSync(path.join(ROOT, "examples", "fixtures", "blind-read-context-leak-block.json"), "utf8")).input;
  const clone = value => JSON.parse(JSON.stringify(value));
  const ruleIds = report => report.findings.map(item => item.rule_id);

  assert.equal(evaluateBlindReadGate(passInput).verdict, "pass");

  const missingLock = clone(passInput);
  delete missingLock.version_lock;
  assert.ok(ruleIds(evaluateBlindReadGate(missingLock)).includes("SGM-BLIND-001-R001"));

  const isolation = evaluateBlindReadGate(isolationInput);
  assert.ok(ruleIds(isolation).includes("SGM-BLIND-001-R002"));
  assert.ok(ruleIds(isolation).includes("SGM-BLIND-001-R003"));

  const oldVotes = clone(passInput);
  oldVotes.revision = { substantive_after_lock: true, reused_prior_votes: true };
  assert.ok(ruleIds(evaluateBlindReadGate(oldVotes)).includes("SGM-BLIND-001-R004"));

  const oneTicket = clone(passInput);
  oneTicket.readers = [oneTicket.readers[0]];
  assert.ok(ruleIds(evaluateBlindReadGate(oneTicket)).includes("SGM-BLIND-001-R005"));

  const substituted = clone(passInput);
  substituted.review_scope = "single";
  substituted.claim = "continuous_basic";
  assert.ok(ruleIds(evaluateBlindReadGate(substituted)).includes("SGM-BLIND-001-R006"));

  const mergedScore = clone(passInput);
  mergedScore.merged_quality_and_page_turner_score = true;
  assert.ok(ruleIds(evaluateBlindReadGate(mergedScore)).includes("SGM-BLIND-001-R007"));

  assert.ok(ruleIds(evaluateBlindReadGate(averageInput)).includes("SGM-BLIND-001-R008"));

  const weakStrongSingle = clone(averageInput);
  weakStrongSingle.claim = "single_page_turner";
  weakStrongSingle.readers[0].character_closeness = 3;
  weakStrongSingle.readers[0].scene_pressure = 4;
  weakStrongSingle.readers[0].pursuit_reason = { concrete_character: false };
  weakStrongSingle.readers[1].retell_accurate = true;
  weakStrongSingle.readers[1].critical_misread = false;
  weakStrongSingle.readers[1].continue_score = 4;
  weakStrongSingle.readers[1].immediate_continue = true;
  weakStrongSingle.readers[1].character_closeness = 4;
  weakStrongSingle.readers[1].scene_pressure = 4;
  weakStrongSingle.readers[1].pursuit_reason = { concrete_character: true };
  assert.ok(ruleIds(evaluateBlindReadGate(weakStrongSingle)).includes("SGM-BLIND-001-R009"));

  const continuous = evaluateBlindReadGate(continuousInput);
  assert.ok(ruleIds(continuous).includes("SGM-BLIND-001-R010"));
  assert.ok(ruleIds(continuous).includes("SGM-BLIND-001-R012"));

  const formalQuality = clone(passInput);
  formalQuality.claim = "formal_quality";
  formalQuality.readers[0].quality_score = 89;
  assert.ok(ruleIds(evaluateBlindReadGate(formalQuality)).includes("SGM-BLIND-001-R011"));

  assert.ok(ruleIds(evaluateBlindReadGate(contextLeakInput)).includes("SGM-BLIND-001-R013"));
});

test("story-gate CLI exposes blind-read-gate command", () => {
  const pass = runNode(["scripts/story-gate.js", "blind-read-gate", "examples/fixtures/blind-read-pass.json"]);
  assert.equal(pass.status, 0, pass.stderr || pass.stdout);
  assert.match(pass.stdout, /"verdict": "pass"/);

  const blocked = runNode(["scripts/story-gate.js", "blind-read-gate", "examples/fixtures/blind-read-average-mask-block.json"]);
  assert.equal(blocked.status, 1);
  assert.match(blocked.stdout, /"rule_id": "SGM-BLIND-001-R008"/);

  const contextBlocked = runNode(["scripts/story-gate.js", "blind-read-gate", "examples/fixtures/blind-read-context-leak-block.json"]);
  assert.equal(contextBlocked.status, 1);
  assert.match(contextBlocked.stdout, /"rule_id": "SGM-BLIND-001-R013"/);
});

test("chapter batch metrics returns a traceable report", () => {
  const report = evaluateBatch([
    path.join(ROOT, "examples", "fixtures", "chapter-batch-metrics-sample.md")
  ]);
  assert.equal(report.module_id, "SGM-MKT-001");
  assert.equal(report.mode, "novel");
  assert.equal(report.metrics.length, 1);
  assert.match(report.target_refs[0], /chapter-batch-metrics-sample\.md/);
});

test("P6 review scorecard separates cold-read and market risks", () => {
  const passReport = evaluateReviewScorecard([
    path.join(ROOT, "examples", "fixtures", "review-scorecard-pass.md")
  ]);
  assert.equal(passReport.verdict, "pass");
  assert.equal(passReport.scorecard.length, 1);
  assert.ok(passReport.scorecard[0].clarity_score >= 70);
  assert.ok(passReport.scorecard[0].market_pull_score >= 60);

  const polishReport = evaluateReviewScorecard([
    path.join(ROOT, "examples", "fixtures", "review-scorecard-needs-polish.md")
  ]);
  assert.equal(polishReport.verdict, "needs_polish");
  assert.ok(polishReport.findings.some(item => item.rule_id === "SGM-REV-001-R002"));
  assert.ok(polishReport.findings.some(item => item.rule_id === "SGM-EMO-001-R001"));

  const passCli = runNode(["scripts/story-gate.js", "review-scorecard", "examples/fixtures/review-scorecard-pass.md"]);
  assert.equal(passCli.status, 0, passCli.stderr || passCli.stdout);
  assert.match(passCli.stdout, /"verdict": "pass"/);

  const polishCli = runNode(["scripts/story-gate.js", "review-scorecard", "examples/fixtures/review-scorecard-needs-polish.md"]);
  assert.equal(polishCli.status, 1, polishCli.stderr || polishCli.stdout);
  assert.match(polishCli.stdout, /"verdict": "needs_polish"/);
});

test("P7 host adapter returns stable JSON responses", () => {
  const review = runHostAdapter("examples/host-adapter/review-scorecard-request.json");
  assert.equal(review.adapter_version, "story-gate-host-adapter@0.1.0");
  assert.equal(review.host, "container");
  assert.equal(review.task, "review_scorecard");
  assert.equal(review.status, "pass");
  assert.equal(review.exit_code, 0);
  assert.equal(review.report.verdict, "pass");

  const chapter = runHostAdapter("examples/host-adapter/chapter-gate-request.json");
  assert.equal(chapter.host, "ci");
  assert.equal(chapter.status, "pass");
  assert.equal(chapter.exit_code, 0);

  const blindRead = runHostAdapter("examples/host-adapter/blind-read-gate-request.json");
  assert.equal(blindRead.host, "ci");
  assert.equal(blindRead.task, "blind_read_gate");
  assert.equal(blindRead.status, "pass");
  assert.equal(blindRead.exit_code, 0);

  assert.deepEqual(validateRequest({
    adapter_version: "story-gate-host-adapter@0.1.0",
    host: "ci",
    task: "review_scorecard",
    mode: "novel",
    target_refs: ["examples/fixtures/review-scorecard-pass.md"]
  }), []);

  const checked = runNode(["scripts/story-gate.js", "host-run", "examples/host-adapter/review-scorecard-request.json"]);
  assert.equal(checked.status, 0, checked.stderr || checked.stdout);
  assert.match(checked.stdout, /"status": "pass"/);
  assert.match(checked.stdout, /"task": "review_scorecard"/);
});

test("P9 customer pilot completes anonymous customer workflow", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "story-gate-pilot-"));
  const supportOut = path.join(tempRoot, "support");
  const report = runCustomerPilot({
    project: "examples/customer-pilot",
    supportOut
  });
  assert.equal(report.verdict, "pass");
  assert.equal(report.checks.rule_pack, "pass");
  assert.equal(report.checks.review_scorecard, "pass");
  assert.equal(report.checks.chapter_batch_metrics, "pass");
  assert.equal(report.checks.chapter_gate, "pass");
  assert.equal(report.checks.host_run, "pass");
  assert.equal(report.checks.support_bundle, "pass");
  assert.ok(fs.existsSync(path.join(supportOut, "support-bundle.json")));

  const checked = runNode(["scripts/story-gate.js", "customer-pilot", "--project", "examples/customer-pilot"]);
  assert.equal(checked.status, 0, checked.stderr || checked.stdout);
  assert.match(checked.stdout, /"verdict": "pass"/);
});

test("P9 support bundle excludes manuscript prose", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "story-gate-support-"));
  const out = path.join(tempRoot, "bundle");
  const report = createSupportBundle({
    project: "examples/customer-pilot",
    out
  });
  assert.equal(report.verdict, "pass");
  assert.ok(report.diagnostics.excluded_manuscripts.includes("chapters/opening-page.md"));
  assert.ok(fs.existsSync(path.join(out, "support-bundle.json")));

  const bundleText = fs.readFileSync(path.join(out, "support-bundle.json"), "utf8");
  assert.equal(bundleText.includes("If I sign this"), false);
  assert.equal(bundleText.includes("The witness keeps one hand"), false);

  const dryRun = runNode(["scripts/story-gate.js", "support-bundle", "--project", "examples/customer-pilot", "--dry-run"]);
  assert.equal(dryRun.status, 0, dryRun.stderr || dryRun.stdout);
  assert.match(dryRun.stdout, /"verdict": "pass"/);
  assert.match(dryRun.stdout, /excluded_manuscripts/);
});

test("final arc live-cost fixture stays commercial-safe and measurable", () => {
  const fixtureDir = path.join(ROOT, "examples", "final-arc-live-cost");
  const files = ["chapter-01.md", "chapter-02.md", "chapter-03.md"].map(name => path.join(fixtureDir, name));
  const report = evaluateBatch(files);
  assert.equal(report.module_id, "SGM-MKT-001");
  assert.equal(report.mode, "novel");
  assert.equal(report.verdict, "pass");
  assert.equal(report.metrics.length, 3);
  assert.ok(report.target_refs.every(ref => ref.includes("examples/final-arc-live-cost/")));

  const combined = [
    fs.readFileSync(path.join(fixtureDir, "README.md"), "utf8"),
    ...files.map(file => fs.readFileSync(file, "utf8"))
  ].join("\n");
  assert.match(combined, /commercial-safe/);
  const privateMarkers = [
    "\u6797\u665a",
    "\u674e\u7384",
    "\u97e9\u781a",
    "\u95fb\u9752",
    "\u5362\u9690\u5a18",
    "\u5b8b\u7167\u6c34",
    "\u957f\u5b89\u591c\u9a8c\u5f55",
    "\u957f\u5b89\u9a8c\u5c38\u5f55",
    ["LW", "07"].join("-"),
    "\u5979\u5c31\u662f\u5386\u53f2"
  ];
  for (const privateMarker of privateMarkers) {
    assert.equal(combined.includes(privateMarker), false, `private marker leaked: ${privateMarker}`);
  }
});

test("story-gate CLI validates external project rule pack", () => {
  const checked = runNode(["scripts/story-gate.js", "project-rule-check", "examples/project-rule-packs/sample-project-rule-pack.json"]);
  assert.equal(checked.status, 0);
  assert.match(checked.stdout, /"verdict": "pass"/);
});

test("P5 project rule pack template initializes outside plugin root", () => {
  const universalBefore = fs.readFileSync(path.join(ROOT, "references", "rule-pack.json"), "utf8");
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "story-gate-project-rule-"));
  const out = path.join(tempRoot, "sample-customer");

  const report = initProjectRulePack({
    out,
    name: "sample-customer",
    mode: "novel"
  });
  assert.equal(report.verdict, "pass");
  assert.ok(fs.existsSync(path.join(out, "rule-pack.json")));
  assert.ok(fs.existsSync(path.join(out, "README.md")));
  assert.deepEqual(checkProjectRulePack(out), []);

  const generated = JSON.parse(fs.readFileSync(path.join(out, "rule-pack.json"), "utf8"));
  assert.equal(generated.rule_pack, "sample-customer");
  assert.equal(generated.modules[0].mode, "novel");
  assert.equal(generated.rules[0].module_id, generated.modules[0].module_id);
  assert.equal(fs.readFileSync(path.join(ROOT, "references", "rule-pack.json"), "utf8"), universalBefore);

  const checked = runNode([
    "scripts/story-gate.js",
    "init-project-rule-pack",
    "--out",
    path.join(tempRoot, "cli-customer"),
    "--name",
    "cli-customer"
  ]);
  assert.equal(checked.status, 0, checked.stderr || checked.stdout);
  assert.match(checked.stdout, /"verdict": "pass"/);
});

test("private package check passes and is exposed by CLI", () => {
  assert.deepEqual(validatePrivatePackage(), []);

  const checked = runNode(["scripts/story-gate.js", "private-package-check"]);
  assert.equal(checked.status, 0);
  assert.match(checked.stdout, /"verdict": "pass"/);
  assert.match(checked.stdout, /private-commercial-trial@0\.1\.0/);
});

test("private package build creates a self-validating package directory", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "story-gate-package-"));
  const out = path.join(tempRoot, "story-gate-studio");
  const report = buildPrivatePackage({ out });
  assert.equal(report.verdict, "pass");
  assert.equal(report.profile, "private-commercial-trial@0.1.0");
  assert.ok(report.file_count > 0);
  assert.ok(fs.existsSync(path.join(out, ".codex-plugin", "plugin.json")));
  assert.ok(fs.existsSync(path.join(out, "skills", "chapter-workbench", "SKILL.md")));
  assert.ok(fs.existsSync(path.join(out, "scripts", "story-gate.js")));
  assert.ok(fs.existsSync(path.join(out, "docs", "private-package.md")));
  assert.equal(fs.existsSync(path.join(out, "story-gate-projects")), false);
  assert.equal(fs.existsSync(path.join(out, ".tmp-pydeps")), false);
  assert.equal(fs.existsSync(path.join(out, "dist")), false);

  const packageCheck = spawnSync(process.execPath, ["scripts/story-gate.js", "private-package-check"], {
    cwd: out,
    encoding: "utf8"
  });
  assert.equal(packageCheck.status, 0, packageCheck.stderr || packageCheck.stdout);

  const validate = spawnSync(process.execPath, ["scripts/story-gate.js", "validate"], {
    cwd: out,
    encoding: "utf8"
  });
  assert.equal(validate.status, 0, validate.stderr || validate.stdout);
});

test("release archive build creates zip and SHA256SUMS", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "story-gate-archive-"));
  const packageDir = path.join(tempRoot, "story-gate-studio-private-commercial-trial");
  const archiveDir = path.join(tempRoot, "release");
  buildPrivatePackage({ out: packageDir });

  const report = buildReleaseArchive({ packageDir, outDir: archiveDir });
  assert.equal(report.verdict, "pass");
  assert.ok(fs.existsSync(report.archive));
  assert.ok(fs.existsSync(report.checksums));
  assert.ok(report.file_count > 0);
  assert.equal(report.checksum_count, report.file_count + 1);

  const magic = fs.readFileSync(report.archive).subarray(0, 4).toString("hex");
  assert.equal(magic, "504b0304");

  const archiveHash = crypto.createHash("sha256").update(fs.readFileSync(report.archive)).digest("hex");
  assert.equal(report.archive_sha256, archiveHash);
  const sums = fs.readFileSync(report.checksums, "utf8");
  assert.match(sums, new RegExp(`${archiveHash}  story-gate-studio-v0\\.1\\.0-private-commercial-trial\\.zip`));
  assert.match(sums, /story-gate-studio-private-commercial-trial\/\.codex-plugin\/plugin\.json/);
});

test("P4 release metadata is version-consistent and exposed by CLI", () => {
  assert.deepEqual(validateReleaseMetadata(), []);

  const checked = runNode(["scripts/story-gate.js", "release-check"]);
  assert.equal(checked.status, 0, checked.stderr || checked.stdout);
  assert.match(checked.stdout, /"verdict": "pass"/);
  assert.match(checked.stdout, /story-gate-studio-v0\.1\.0-private-commercial-trial\.zip/);
});

test("customer install smoke validates package directory and zip extraction", () => {
  assert.deepEqual(validateCustomerInstall(ROOT), []);

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "story-gate-customer-"));
  const packageDir = path.join(tempRoot, "story-gate-studio-private-commercial-trial");
  const archiveDir = path.join(tempRoot, "release");
  const extractTo = path.join(tempRoot, "extract");
  buildPrivatePackage({ out: packageDir });
  const archive = buildReleaseArchive({ packageDir, outDir: archiveDir });

  const checked = spawnSync(process.execPath, [
    path.join(ROOT, "scripts", "customer-install-smoke.js"),
    "--zip",
    archive.archive,
    "--extract-to",
    extractTo,
    "--full"
  ], {
    cwd: ROOT,
    encoding: "utf8"
  });
  assert.equal(checked.status, 0, checked.stderr || checked.stdout);
  assert.match(checked.stdout, /"verdict": "pass"/);
});

test("P14 install-local creates one-command project installation", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "story-gate-install-"));
  const project = path.join(tempRoot, "sample-customer-project");

  const report = installLocal({
    project,
    name: "sample-customer",
    mode: "novel"
  });
  assert.equal(report.verdict, "pass");
  assert.ok(fs.existsSync(path.join(project, "plugins", "story-gate-studio", ".codex-plugin", "plugin.json")));
  assert.ok(fs.existsSync(path.join(project, ".agents", "plugins", "marketplace.json")));
  assert.ok(fs.existsSync(path.join(project, "story-gate-projects", "sample-customer", "rule-pack.json")));

  const marketplace = JSON.parse(fs.readFileSync(path.join(project, ".agents", "plugins", "marketplace.json"), "utf8"));
  assert.equal(marketplace.plugins.length, 1);
  assert.equal(marketplace.plugins[0].name, "story-gate-studio");
  assert.equal(marketplace.plugins[0].source.path, "./plugins/story-gate-studio");

  assert.throws(() => installLocal({
    project,
    name: "sample-customer",
    mode: "novel"
  }), /Plugin already installed/);

  const checked = runNode([
    "scripts/story-gate.js",
    "install-local",
    "--project",
    path.join(tempRoot, "cli-customer-project"),
    "--name",
    "cli-customer",
    "--skip-smoke"
  ]);
  assert.equal(checked.status, 0, checked.stderr || checked.stdout);
  assert.match(checked.stdout, /"verdict": "pass"/);
});

test("QG-008 scripts load", () => {
  assert.deepEqual(validateScriptSmoke(), []);
});

test("QG-009 encoding scan passes", () => {
  assert.deepEqual(validateEncoding(), []);
});

test("QG-011 design contracts pass", () => {
  assert.deepEqual(validateDesignContracts(), []);
});

test("QG-012 task registry passes", () => {
  assert.deepEqual(validateTaskRegistry(), []);
});

test("QG-013 release metadata passes", () => {
  assert.deepEqual(validateReleaseMetadata(), []);
});

test("BIZ-QG commercial release checks pass", () => {
  assert.deepEqual(validateCommercialRelease(), []);
});

test("P8 commercial readiness checks pass", () => {
  assert.deepEqual(validateCommercialReadiness(), []);

  const checked = runNode(["scripts/story-gate.js", "commercial-readiness-check"]);
  assert.equal(checked.status, 0, checked.stderr || checked.stdout);
  assert.match(checked.stdout, /"verdict": "pass"/);
});
