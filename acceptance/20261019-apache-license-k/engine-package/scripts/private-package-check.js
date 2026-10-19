"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { getBlockedTerms } = require("./commercial-release-check");
const { assert, listFiles, pluginRoot, readJson, runCli } = require("./lib");

const TEXT_EXTENSIONS = new Set([".md", ".json", ".js", ".txt", ".yml", ".yaml"]);

function isTextFile(file) {
  return TEXT_EXTENSIONS.has(path.extname(file).toLowerCase());
}

function collectPackageFiles(root, manifest) {
  const files = new Set();
  for (const relative of manifest.include_files || []) {
    files.add(path.join(root, relative));
  }
  for (const relativeRoot of manifest.include_roots || []) {
    const absoluteRoot = path.join(root, relativeRoot);
    for (const file of listFiles(absoluteRoot, isTextFile)) {
      files.add(file);
    }
  }
  return [...files];
}

function runSmokeCommand(root, command) {
  const result = spawnSync(process.execPath, command, {
    cwd: root,
    encoding: "utf8"
  });
  return {
    command: `node ${command.join(" ")}`,
    status: result.status,
    stderr: result.stderr || "",
    stdout: result.stdout || ""
  };
}

function validatePrivatePackage(root = pluginRoot()) {
  const errors = [];
  const manifestPath = path.join(root, "references", "private-package-manifest.json");
  assert(fs.existsSync(manifestPath), "missing references/private-package-manifest.json", errors);
  if (!fs.existsSync(manifestPath)) return errors;

  const manifest = readJson(manifestPath);
  assert(manifest.profile === "private-commercial-trial@0.1.0", "unexpected private package profile", errors);

  for (const relative of manifest.include_files || []) {
    assert(fs.existsSync(path.join(root, relative)), `package include file missing: ${relative}`, errors);
  }
  for (const relative of manifest.include_roots || []) {
    assert(fs.existsSync(path.join(root, relative)), `package include root missing: ${relative}`, errors);
  }
  for (const relative of manifest.required_docs || []) {
    assert(fs.existsSync(path.join(root, relative)), `required package doc missing: ${relative}`, errors);
  }
  for (const relative of manifest.exclude_paths || []) {
    assert(!fs.existsSync(path.join(root, relative)), `excluded path exists in package root: ${relative}`, errors);
  }

  const blocklist = readJson(path.join(root, "references", "private-content-blocklist.json"));
  const blockedTerms = getBlockedTerms(blocklist);
  for (const file of collectPackageFiles(root, manifest)) {
    if (!fs.existsSync(file) || !isTextFile(file)) continue;
    const text = fs.readFileSync(file, "utf8");
    const relative = path.relative(root, file).replace(/\\/g, "/");
    for (const term of blockedTerms) {
      assert(!text.includes(term), `${relative} contains private marker`, errors);
    }
  }

  for (const command of manifest.required_smoke_commands || []) {
    const result = runSmokeCommand(root, command);
    assert(result.status === 0, `smoke command failed: ${result.command}: ${result.stderr || result.stdout}`, errors);
  }

  return errors;
}

if (require.main === module) {
  runCli("BIZ-QG private package checks", () => validatePrivatePackage());
}

module.exports = { validatePrivatePackage };
