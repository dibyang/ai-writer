"use strict";

const fs = require("fs");
const path = require("path");
const { assert, pluginRoot, readJson, requireFields, runCli } = require("./lib");

const REQUIRED_DIRS = [
  ".codex-plugin",
  "docs",
  "skills",
  "references",
  "scripts",
  "tests",
  "examples",
  "examples/fixtures",
  "examples/expected-reports",
  "reports",
  "reports/quality-gates"
];

const REQUIRED_SKILLS = [
  "story-architect",
  "chapter-workbench",
  "third-party-review",
  "feedback-triage",
  "release-gate",
  "blockbuster-review",
  "visual-asset-manager",
  "screenplay-adapter"
];

function validateStructure(root = pluginRoot()) {
  const errors = [];
  for (const dir of REQUIRED_DIRS) {
    assert(fs.existsSync(path.join(root, dir)), `missing directory: ${dir}`, errors);
  }

  const manifestPath = path.join(root, ".codex-plugin", "plugin.json");
  assert(fs.existsSync(manifestPath), "missing .codex-plugin/plugin.json", errors);
  if (fs.existsSync(manifestPath)) {
    const manifest = readJson(manifestPath);
    requireFields(manifest, ["name", "version", "description", "author", "interface", "skills"], "plugin.json", errors);
    assert(manifest.name === "story-gate-studio", "plugin.json name must be story-gate-studio", errors);
    assert(/^\d+\.\d+\.\d+$/.test(manifest.version), "plugin.json version must be semver", errors);
    requireFields(manifest.author || {}, ["name"], "plugin.json.author", errors);
    requireFields(manifest.interface || {}, ["displayName", "shortDescription", "longDescription", "developerName", "category"], "plugin.json.interface", errors);
  }

  for (const skill of REQUIRED_SKILLS) {
    const skillPath = path.join(root, "skills", skill, "SKILL.md");
    assert(fs.existsSync(skillPath), `missing skill entry: skills/${skill}/SKILL.md`, errors);
    if (fs.existsSync(skillPath)) {
      const text = fs.readFileSync(skillPath, "utf8");
      assert(text.includes("Required Output"), `skill missing Required Output section: ${skill}`, errors);
      assert(!text.includes("[TODO:"), `skill contains TODO placeholder: ${skill}`, errors);
    }
  }

  return errors;
}

if (require.main === module) {
  runCli("QG-001 plugin structure", () => validateStructure());
}

module.exports = { validateStructure };
