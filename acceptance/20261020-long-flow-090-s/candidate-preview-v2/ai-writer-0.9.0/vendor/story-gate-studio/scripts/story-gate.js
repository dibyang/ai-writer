"use strict";

const fs = require("fs");
const path = require("path");
const { audit } = require("./story-gate-audit");
const { auditVisualAssets } = require("./visual-asset-audit");
const { evaluateBlindReadGate, loadBlindReadInput } = require("./blind-read-gate");
const { evaluateChapterGate, loadChapterGateInput } = require("./chapter-gate");
const { run: runBuildPrivatePackage } = require("./build-private-package");
const { run: runBuildReleaseArchive } = require("./build-release-archive");
const { run: runChapterBatchMetrics } = require("./chapter-batch-metrics");
const { validateCommercialReadiness } = require("./commercial-readiness-check");
const { run: runCustomerPilot } = require("./customer-pilot");
const { run: runReviewScorecard } = require("./review-scorecard");
const { run: runHostAdapter } = require("./host-adapter");
const { checkProjectRulePack } = require("./project-rule-pack-check");
const { run: runInitProjectRulePack } = require("./init-project-rule-pack");
const { run: runCustomerInstallSmoke } = require("./customer-install-smoke");
const { run: runInstallLocal } = require("./install-local");
const { run: runReleaseCheck } = require("./release-check");
const { run: runSupportBundle } = require("./support-bundle");
const { validatePrivatePackage } = require("./private-package-check");
const { pluginRoot, readJson } = require("./lib");

function printHelp() {
  console.log(`Story Gate Studio CLI

Usage:
  node scripts/story-gate.js --help
  node scripts/story-gate.js tasks
  node scripts/story-gate.js validate
  node scripts/story-gate.js blind-read-gate <fixture-or-input.json>
  node scripts/story-gate.js chapter-gate <fixture-or-input.json>
  node scripts/story-gate.js chapter-batch-metrics <chapter.md...> [--rule-pack name@version] [--out report.json]
  node scripts/story-gate.js review-scorecard <chapter.md...> [--rule-pack name@version] [--out report.json]
  node scripts/story-gate.js host-run <host-request.json>
  node scripts/story-gate.js project-rule-check <rule-pack.json>
  node scripts/story-gate.js init-project-rule-pack --out directory --name project-slug [--mode novel] [--force]
  node scripts/story-gate.js customer-pilot [--project directory] [--out report.json] [--support-out directory]
  node scripts/story-gate.js support-bundle --project directory [--out directory | --dry-run] [--force]
  node scripts/story-gate.js private-package-check
  node scripts/story-gate.js commercial-readiness-check
  node scripts/story-gate.js build-private-package [--out directory]
  node scripts/story-gate.js build-release-archive [--package-dir directory] [--out-dir directory] [--force]
  node scripts/story-gate.js release-check [--checksums file]
  node scripts/story-gate.js customer-install-smoke [--full] [--zip file --extract-to directory]
  node scripts/story-gate.js install-local --project directory [--name project-slug] [--mode novel] [--force]
  node scripts/story-gate.js visual-selected <fixture-or-directory>
  node scripts/story-gate.js release-audit <directory>

Commands:
  tasks             Print the v0.1 task registry.
  validate          Run all plugin quality gates.
  blind-read-gate   Evaluate single-chapter or continuous blind-read tickets.
  chapter-gate      Evaluate a chapter opening gate and print StoryGateReport JSON.
  chapter-batch-metrics
                    Inspect chapter batch density and live-pressure metrics.
  review-scorecard Inspect cold-read risk, clarity, market pull, and emotion landing.
  host-run         Run a host-neutral JSON request for agent/container/CI integration.
  project-rule-check
                    Validate an external project rule pack without bundling it into the plugin.
  init-project-rule-pack
                    Create an external customer project rule-pack template.
  customer-pilot   Run the anonymous customer pilot workflow end to end.
  support-bundle   Build or dry-run a support diagnostics bundle without manuscript prose.
  private-package-check
                    Validate the private commercial trial package manifest and smoke commands.
  commercial-readiness-check
                    Validate license, trial, privacy, support, and commercial-claim boundaries.
  build-private-package
                    Build a manifest-curated private commercial trial package directory.
  build-release-archive
                    Build a zip archive and SHA256SUMS.txt for a validated package directory.
  release-check     Validate release version metadata, notes, archive name, and rollback fields.
  customer-install-smoke
                    Validate an extracted package or zip as a customer would.
  install-local      Install this plugin into another local Codex project and write marketplace config.
  visual-selected   Audit selected visual asset records and print StoryGateReport JSON.
  release-audit     Scan release targets for obvious residue markers.
`);
}

function printJson(value) {
  console.log(JSON.stringify(value, null, 2));
}

function commandTasks() {
  printJson(readJson(path.join(pluginRoot(), "references", "task-registry.json")));
  return 0;
}

function commandChapterGate(target) {
  if (!target) {
    console.error("Missing target. Usage: node scripts/story-gate.js chapter-gate <fixture-or-input.json>");
    return 2;
  }
  const request = loadChapterGateInput(target);
  const report = evaluateChapterGate(request.input, request);
  printJson(report);
  return report.verdict === "blocked" ? 1 : 0;
}

function commandBlindReadGate(target) {
  if (!target) {
    console.error("Missing target. Usage: node scripts/story-gate.js blind-read-gate <fixture-or-input.json>");
    return 2;
  }
  const request = loadBlindReadInput(target);
  const report = evaluateBlindReadGate(request.input, request);
  printJson(report);
  return report.verdict === "blocked" ? 1 : 0;
}

function commandVisualSelected(target) {
  if (!target) {
    console.error("Missing target. Usage: node scripts/story-gate.js visual-selected <fixture-or-directory>");
    return 2;
  }
  const resolved = path.isAbsolute(target) ? target : path.resolve(pluginRoot(), target);
  if (!fs.existsSync(resolved)) {
    console.error(`Target not found: ${target}`);
    return 2;
  }
  const report = auditVisualAssets(resolved);
  printJson(report);
  return report.verdict === "blocked" ? 1 : 0;
}

function commandReleaseAudit(target) {
  if (!target) {
    console.error("Missing target. Usage: node scripts/story-gate.js release-audit <directory>");
    return 2;
  }
  const report = audit(target);
  printJson(report);
  return report.verdict === "blocked" ? 1 : 0;
}

function commandProjectRuleCheck(target) {
  if (!target) {
    console.error("Missing target. Usage: node scripts/story-gate.js project-rule-check <rule-pack.json>");
    return 2;
  }
  const errors = checkProjectRulePack(target);
  if (errors.length > 0) {
    for (const error of errors) console.error(`- ${error}`);
    return 1;
  }
  console.log(JSON.stringify({ verdict: "pass", target }, null, 2));
  return 0;
}

function commandPrivatePackageCheck() {
  const errors = validatePrivatePackage();
  if (errors.length > 0) {
    for (const error of errors) console.error(`- ${error}`);
    return 1;
  }
  console.log(JSON.stringify({ verdict: "pass", profile: "private-commercial-trial@0.1.0" }, null, 2));
  return 0;
}

function commandCommercialReadinessCheck() {
  const errors = validateCommercialReadiness();
  if (errors.length > 0) {
    for (const error of errors) console.error(`- ${error}`);
    return 1;
  }
  console.log(JSON.stringify({ verdict: "pass", profile: "commercial-readiness@0.1.0" }, null, 2));
  return 0;
}

function main(argv = process.argv.slice(2)) {
  const command = argv[0];
  if (!command || command === "--help" || command === "-h" || command === "help") {
    printHelp();
    return 0;
  }
  if (command === "tasks") return commandTasks();
  if (command === "validate") {
    const { runQualityGates } = require("./run-quality-gates");
    return runQualityGates();
  }
  if (command === "blind-read-gate") return commandBlindReadGate(argv[1]);
  if (command === "chapter-gate") return commandChapterGate(argv[1]);
  if (command === "chapter-batch-metrics") return runChapterBatchMetrics(argv.slice(1));
  if (command === "review-scorecard") return runReviewScorecard(argv.slice(1));
  if (command === "host-run") return runHostAdapter(argv.slice(1));
  if (command === "project-rule-check") return commandProjectRuleCheck(argv[1]);
  if (command === "init-project-rule-pack") return runInitProjectRulePack(argv.slice(1));
  if (command === "customer-pilot") return runCustomerPilot(argv.slice(1));
  if (command === "support-bundle") return runSupportBundle(argv.slice(1));
  if (command === "private-package-check") return commandPrivatePackageCheck();
  if (command === "commercial-readiness-check") return commandCommercialReadinessCheck();
  if (command === "build-private-package") return runBuildPrivatePackage(argv.slice(1));
  if (command === "build-release-archive") return runBuildReleaseArchive(argv.slice(1));
  if (command === "release-check") return runReleaseCheck(argv.slice(1));
  if (command === "customer-install-smoke") return runCustomerInstallSmoke(argv.slice(1));
  if (command === "install-local") return runInstallLocal(argv.slice(1));
  if (command === "visual-selected") return commandVisualSelected(argv[1]);
  if (command === "release-audit") return commandReleaseAudit(argv[1]);

  console.error(`Unknown command: ${command}`);
  printHelp();
  return 2;
}

if (require.main === module) {
  process.exitCode = main();
}

module.exports = { main };
