"use strict";

const fs = require("fs");
const path = require("path");
const { assert, listFiles, pluginRoot, readJson, runCli } = require("./lib");

const TEXT_EXTENSIONS = new Set([".md", ".json", ".txt"]);

function isTextFile(file) {
  return TEXT_EXTENSIONS.has(path.extname(file).toLowerCase());
}

function loadCommercialText(root, manifest) {
  const parts = [];
  for (const relative of manifest.required_docs || []) {
    const full = path.join(root, relative);
    if (fs.existsSync(full) && isTextFile(full)) {
      parts.push(fs.readFileSync(full, "utf8"));
    }
  }
  return parts.join("\n");
}

function validateCommercialReadiness(root = pluginRoot()) {
  const errors = [];
  const manifestPath = path.join(root, "references", "commercial-readiness.json");
  assert(fs.existsSync(manifestPath), "missing references/commercial-readiness.json", errors);
  if (!fs.existsSync(manifestPath)) return errors;

  const manifest = readJson(manifestPath);
  for (const relative of manifest.required_docs || []) {
    assert(fs.existsSync(path.join(root, relative)), `missing commercial readiness doc: ${relative}`, errors);
  }

  const combined = loadCommercialText(root, manifest);
  for (const statement of manifest.required_statements || []) {
    assert(combined.includes(statement), `commercial readiness docs missing statement: ${statement}`, errors);
  }

  const scanTargets = [
    "README.md",
    "CHANGELOG.md",
    "RELEASE.md",
    "docs"
  ];
  const files = [];
  for (const target of scanTargets) {
    const full = path.join(root, target);
    if (!fs.existsSync(full)) continue;
    const stat = fs.statSync(full);
    if (stat.isFile() && isTextFile(full)) files.push(full);
    if (stat.isDirectory()) files.push(...listFiles(full, isTextFile));
  }

  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    const relative = path.relative(root, file).replace(/\\/g, "/");
    for (const claim of manifest.prohibited_claims || []) {
      assert(!text.includes(claim), `${relative} contains prohibited commercial claim: ${claim}`, errors);
    }
  }

  return errors;
}

if (require.main === module) {
  runCli("BIZ-QG commercial readiness", () => validateCommercialReadiness());
}

module.exports = { validateCommercialReadiness };
