"use strict";

const fs = require("fs");
const path = require("path");
const { assert, pluginRoot, readJson, runCli } = require("./lib");

const ALLOWED_STATUSES = new Set(["draft", "release_candidate", "private_trial", "withdrawn"]);

function readTextIfExists(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function requiredEvidence() {
  return [
    "node scripts/story-gate.js validate",
    "node --test tests/*.test.js",
    "node scripts/story-gate.js private-package-check",
    "node scripts/story-gate.js build-release-archive",
    "node scripts/story-gate.js customer-install-smoke --full",
    "Codex validate_plugin.py"
  ];
}

function archiveNameFor(root = pluginRoot()) {
  const manifest = readJson(path.join(root, "references", "release-manifest.json"));
  return manifest.archive_name;
}

function archiveBaseNameFor(root = pluginRoot()) {
  return archiveNameFor(root).replace(/\.zip$/i, "");
}

function validateReleaseMetadata(root = pluginRoot(), options = {}) {
  const errors = [];
  const manifestPath = path.join(root, "references", "release-manifest.json");
  assert(fs.existsSync(manifestPath), "missing references/release-manifest.json", errors);
  if (!fs.existsSync(manifestPath)) return errors;

  const manifest = readJson(manifestPath);
  const packageJson = readJson(path.join(root, "package.json"));
  const pluginJson = readJson(path.join(root, ".codex-plugin", "plugin.json"));
  const privatePackageManifest = readJson(path.join(root, "references", "private-package-manifest.json"));

  for (const field of [
    "release_id",
    "release_status",
    "plugin_name",
    "plugin_version",
    "package_profile",
    "package_dir_name",
    "archive_name",
    "release_notes",
    "changelog",
    "quality_evidence",
    "rollback"
  ]) {
    assert(Object.prototype.hasOwnProperty.call(manifest, field), `release manifest missing field: ${field}`, errors);
  }

  assert(ALLOWED_STATUSES.has(manifest.release_status), `invalid release status: ${manifest.release_status}`, errors);
  assert(manifest.plugin_name === packageJson.name, "release manifest plugin_name must match package.json", errors);
  assert(manifest.plugin_name === pluginJson.name, "release manifest plugin_name must match plugin.json", errors);
  assert(manifest.plugin_version === packageJson.version, "release manifest plugin_version must match package.json", errors);
  assert(manifest.plugin_version === pluginJson.version, "release manifest plugin_version must match plugin.json", errors);
  assert(manifest.package_profile === privatePackageManifest.profile, "release manifest package_profile must match private package manifest", errors);
  assert(
    manifest.release_id === `${manifest.plugin_name}@${manifest.plugin_version}-private-commercial-trial.1`,
    "release_id must follow story-gate-studio@version-private-commercial-trial.1",
    errors
  );
  assert(
    manifest.archive_name === `${manifest.plugin_name}-v${manifest.plugin_version}-private-commercial-trial.zip`,
    "archive_name must be versioned",
    errors
  );
  assert(manifest.package_dir_name === "story-gate-studio-private-commercial-trial", "unexpected package_dir_name", errors);
  assert(Array.isArray(manifest.quality_evidence), "quality_evidence must be an array", errors);
  for (const evidence of requiredEvidence()) {
    assert(manifest.quality_evidence.includes(evidence), `quality_evidence missing: ${evidence}`, errors);
  }
  assert(manifest.rollback && manifest.rollback.strategy, "rollback.strategy is required", errors);

  const releaseNotesPath = path.join(root, manifest.release_notes || "");
  const changelogPath = path.join(root, manifest.changelog || "");
  assert(fs.existsSync(releaseNotesPath), `missing release notes: ${manifest.release_notes}`, errors);
  assert(fs.existsSync(changelogPath), `missing changelog: ${manifest.changelog}`, errors);

  const releaseNotes = readTextIfExists(releaseNotesPath);
  const changelog = readTextIfExists(changelogPath);
  for (const textCheck of [
    ["release notes", releaseNotes],
    ["changelog", changelog]
  ]) {
    const [label, text] = textCheck;
    for (const required of [
      manifest.release_id,
      manifest.release_status,
      manifest.plugin_version,
      manifest.archive_name,
      "customer-install-smoke",
      "validate_plugin.py",
      "Rollback"
    ]) {
      assert(text.includes(required), `${label} missing ${required}`, errors);
    }
  }

  if (options.checksumPath) {
    const checksumPath = path.resolve(root, options.checksumPath);
    assert(fs.existsSync(checksumPath), `checksum file not found: ${options.checksumPath}`, errors);
    const checksumText = readTextIfExists(checksumPath);
    assert(checksumText.includes(manifest.archive_name), `checksum file missing archive: ${manifest.archive_name}`, errors);
  }

  return errors;
}

function parseArgs(argv) {
  const args = { checksumPath: null };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--checksums") {
      args.checksumPath = argv[++i];
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function run(argv = process.argv.slice(2)) {
  try {
    const args = parseArgs(argv);
    const errors = validateReleaseMetadata(pluginRoot(), args);
    if (errors.length > 0) {
      for (const error of errors) console.error(`- ${error}`);
      return 1;
    }
    console.log(JSON.stringify({ verdict: "pass", archive_name: archiveNameFor(pluginRoot()) }, null, 2));
    return 0;
  } catch (error) {
    console.error(error.message || String(error));
    return 2;
  }
}

if (require.main === module) {
  process.exitCode = run();
}

module.exports = {
  archiveBaseNameFor,
  archiveNameFor,
  requiredEvidence,
  run,
  validateReleaseMetadata
};
