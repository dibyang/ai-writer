"use strict";

const fs = require("fs");
const path = require("path");
const { validatePrivatePackage } = require("./private-package-check");
const { listFiles, pluginRoot, readJson } = require("./lib");

function normalizeRef(ref) {
  return ref.replace(/\\/g, "/").replace(/^\/+/, "");
}

function parseArgs(argv) {
  const args = { out: null, verify: true };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--out") {
      args.out = argv[++i];
    } else if (arg === "--no-verify") {
      args.verify = false;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function defaultOutputDir(root) {
  return path.resolve(root, "..", "..", "story-gate-deliverables", "story-gate-studio-private-commercial-trial");
}

function isInside(parent, child) {
  const relative = path.relative(parent, child);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function isExcluded(relative, manifest) {
  const normalized = normalizeRef(relative);
  return (manifest.exclude_paths || []).some(excluded => {
    const normalizedExcluded = normalizeRef(excluded);
    return normalized === normalizedExcluded || normalized.startsWith(`${normalizedExcluded}/`);
  });
}

function collectPackageRefs(root, manifest) {
  const refs = new Set();
  for (const relative of manifest.include_files || []) {
    refs.add(normalizeRef(relative));
  }
  for (const relativeRoot of manifest.include_roots || []) {
    const absoluteRoot = path.join(root, relativeRoot);
    for (const file of listFiles(absoluteRoot)) {
      const relative = normalizeRef(path.relative(root, file));
      if (!isExcluded(relative, manifest)) refs.add(relative);
    }
  }
  return [...refs].sort();
}

function copyFile(root, outRoot, relative) {
  const source = path.join(root, relative);
  const target = path.join(outRoot, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

function buildPrivatePackage(options = {}) {
  const root = options.root || pluginRoot();
  const manifestPath = path.join(root, "references", "private-package-manifest.json");
  const manifest = readJson(manifestPath);
  const outRoot = path.resolve(options.out || defaultOutputDir(root));

  if (isInside(root, outRoot)) {
    throw new Error("Refusing to build private package inside the plugin root.");
  }
  if (fs.existsSync(outRoot)) {
    throw new Error(`Output directory already exists: ${outRoot}`);
  }

  const refs = collectPackageRefs(root, manifest);
  for (const relative of refs) {
    if (!fs.existsSync(path.join(root, relative))) {
      throw new Error(`Package source file does not exist: ${relative}`);
    }
  }

  fs.mkdirSync(outRoot, { recursive: true });
  for (const relative of refs) {
    copyFile(root, outRoot, relative);
  }

  const errors = options.verify === false ? [] : validatePrivatePackage(outRoot);
  return {
    verdict: errors.length === 0 ? "pass" : "blocked",
    profile: manifest.profile,
    output: outRoot,
    file_count: refs.length,
    errors
  };
}

function run(argv = process.argv.slice(2)) {
  try {
    const args = parseArgs(argv);
    const report = buildPrivatePackage(args);
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

module.exports = { buildPrivatePackage, collectPackageRefs, run };
