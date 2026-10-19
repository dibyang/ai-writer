"use strict";

const fs = require("fs");
const path = require("path");
const { hasReplacementChar, listFiles, pluginRoot, printResult } = require("./lib");
const { validateCommercialRelease } = require("./commercial-release-check");
const { validateCommercialReadiness } = require("./commercial-readiness-check");
const { validateFixtures } = require("./validate-fixtures");
const { validatePrivatePackage } = require("./private-package-check");
const { validateReleaseMetadata } = require("./release-check");
const { validateReports } = require("./validate-report");
const { validateRulePack } = require("./validate-rule-pack");
const { validateStructure } = require("./validate-plugin-structure");
const { validateDesignContracts } = require("./validate-design-contracts");
const { validateTaskRegistry } = require("./validate-task-registry");

function validateEncoding(root = pluginRoot()) {
  const errors = [];
  const targets = [
    "README.md",
    "docs",
    "skills",
    "references",
    "examples",
    "tests"
  ];
  const files = [];
  for (const target of targets) {
    const full = path.join(root, target);
    if (!fs.existsSync(full)) continue;
    const stat = fs.statSync(full);
    if (stat.isFile()) files.push(full);
    else files.push(...listFiles(full, file => [".md", ".json", ".js"].includes(path.extname(file).toLowerCase())));
  }
  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    if (hasReplacementChar(text)) {
      errors.push(`${path.relative(root, file)} contains replacement or mojibake marker`);
    }
  }
  return errors;
}

function validateScriptSmoke(root = pluginRoot()) {
  const errors = [];
  const required = [
    "story-gate.js",
    "blind-read-gate.js",
    "build-private-package.js",
    "build-release-archive.js",
    "chapter-gate.js",
    "chapter-batch-metrics.js",
    "commercial-readiness-check.js",
    "customer-pilot.js",
    "host-adapter.js",
    "init-project-rule-pack.js",
    "project-rule-pack-check.js",
    "review-scorecard.js",
    "story-gate-audit.js",
    "story-template-scan.js",
    "story-index.js",
    "visual-asset-audit.js",
    "validate-plugin-structure.js",
    "validate-rule-pack.js",
    "validate-report.js",
    "validate-fixtures.js",
    "commercial-release-check.js",
    "customer-install-smoke.js",
    "support-bundle.js",
    "release-check.js",
    "private-package-check.js",
    "validate-design-contracts.js",
    "validate-task-registry.js",
    "run-quality-gates.js"
  ];
  for (const name of required) {
    const file = path.join(root, "scripts", name);
    if (!fs.existsSync(file)) {
      errors.push(`missing script: scripts/${name}`);
      continue;
    }
    try {
      require(file);
    } catch (error) {
      errors.push(`script cannot be loaded: scripts/${name}: ${error.message}`);
    }
  }
  return errors;
}

function runQualityGates() {
  const gates = [
    ["QG-001 plugin structure", validateStructure],
    ["QG-002 rule pack schema", validateRulePack],
    ["QG-003 report schema", validateReports],
    ["QG-004 fixture regression and QG-006 mode isolation", validateFixtures],
    ["QG-008 script smoke", validateScriptSmoke],
    ["QG-009 encoding", validateEncoding],
    ["QG-011 design contracts", validateDesignContracts],
    ["QG-012 task registry", validateTaskRegistry],
    ["QG-013 release metadata", validateReleaseMetadata],
    ["BIZ-QG commercial release checks", validateCommercialRelease],
    ["BIZ-QG commercial readiness", validateCommercialReadiness],
    ["BIZ-QG private package checks", validatePrivatePackage]
  ];

  let failed = false;
  for (const [name, fn] of gates) {
    const errors = fn();
    const ok = printResult(name, errors);
    failed = failed || !ok;
  }
  return failed ? 1 : 0;
}

if (require.main === module) {
  process.exitCode = runQualityGates();
}

module.exports = { runQualityGates, validateEncoding, validateScriptSmoke };
