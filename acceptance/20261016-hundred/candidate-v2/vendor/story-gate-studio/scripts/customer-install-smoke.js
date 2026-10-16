"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { pluginRoot } = require("./lib");

function parseArgs(argv) {
  const args = { packageDir: null, zip: null, extractTo: null, full: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--package-dir") {
      args.packageDir = argv[++i];
    } else if (arg === "--zip") {
      args.zip = argv[++i];
    } else if (arg === "--extract-to") {
      args.extractTo = argv[++i];
    } else if (arg === "--full") {
      args.full = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function assertSafeZipPath(relative) {
  const normalized = relative.replace(/\\/g, "/");
  if (!normalized || normalized.startsWith("/") || normalized.includes("../") || normalized === "..") {
    throw new Error(`Unsafe zip entry path: ${relative}`);
  }
  return normalized;
}

function extractStoredZip(zipPath, outDir) {
  const buffer = fs.readFileSync(zipPath);
  const roots = new Set();
  let offset = 0;
  fs.mkdirSync(outDir, { recursive: true });

  while (offset + 4 <= buffer.length) {
    const signature = buffer.readUInt32LE(offset);
    if (signature === 0x02014b50 || signature === 0x06054b50) break;
    if (signature !== 0x04034b50) {
      throw new Error(`Unsupported zip structure at offset ${offset}`);
    }

    const method = buffer.readUInt16LE(offset + 8);
    const compressedSize = buffer.readUInt32LE(offset + 18);
    const fileNameLength = buffer.readUInt16LE(offset + 26);
    const extraLength = buffer.readUInt16LE(offset + 28);
    const nameStart = offset + 30;
    const nameEnd = nameStart + fileNameLength;
    const dataStart = nameEnd + extraLength;
    const dataEnd = dataStart + compressedSize;
    const relative = assertSafeZipPath(buffer.subarray(nameStart, nameEnd).toString("utf8"));

    if (method !== 0) {
      throw new Error(`Unsupported compressed zip entry: ${relative}`);
    }
    if (dataEnd > buffer.length) {
      throw new Error(`Truncated zip entry: ${relative}`);
    }

    const target = path.resolve(outDir, relative);
    const outRoot = path.resolve(outDir);
    if (!target.startsWith(outRoot + path.sep)) {
      throw new Error(`Zip entry escapes output directory: ${relative}`);
    }

    const parts = relative.split("/");
    if (parts[0]) roots.add(parts[0]);
    if (!relative.endsWith("/")) {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, buffer.subarray(dataStart, dataEnd));
    }

    offset = dataEnd;
  }

  if (roots.size !== 1) {
    throw new Error(`Expected exactly one package root in zip, found ${roots.size}`);
  }
  return path.join(outDir, [...roots][0]);
}

function runNode(packageDir, args) {
  const result = spawnSync(process.execPath, args, {
    cwd: packageDir,
    encoding: "utf8"
  });
  return {
    command: `node ${args.join(" ")}`,
    status: result.status,
    stdout: result.stdout || "",
    stderr: result.stderr || ""
  };
}

function requireFile(packageDir, relative, errors) {
  if (!fs.existsSync(path.join(packageDir, relative))) {
    errors.push(`missing required customer install file: ${relative}`);
  }
}

function validateCustomerInstall(packageDir, options = {}) {
  const errors = [];
  requireFile(packageDir, ".codex-plugin/plugin.json", errors);
  requireFile(packageDir, "docs/customer-install.md", errors);
  requireFile(packageDir, "scripts/story-gate.js", errors);
  requireFile(packageDir, "examples/customer-smoke/README.md", errors);

  const smokeCommands = [
    ["scripts/story-gate.js", "--help"],
    ["scripts/story-gate.js", "tasks"],
    ["scripts/story-gate.js", "chapter-gate", "examples/fixtures/chapter-gate-pass.json"],
    ["scripts/story-gate.js", "chapter-batch-metrics", "examples/final-arc-live-cost/chapter-01.md", "examples/final-arc-live-cost/chapter-02.md", "examples/final-arc-live-cost/chapter-03.md"]
  ];
  if (options.full) {
    smokeCommands.push(["scripts/story-gate.js", "private-package-check"]);
    smokeCommands.push(["scripts/story-gate.js", "validate"]);
  }

  for (const command of smokeCommands) {
    const result = runNode(packageDir, command);
    if (result.status !== 0) {
      errors.push(`customer smoke command failed: ${result.command}: ${result.stderr || result.stdout}`);
    }
  }

  if (options.full) {
    const tests = runNode(packageDir, ["--test", "tests/*.test.js"]);
    if (tests.status !== 0) {
      errors.push(`customer smoke tests failed: ${tests.stderr || tests.stdout}`);
    }
  }

  return errors;
}

function run(argv = process.argv.slice(2)) {
  try {
    const args = parseArgs(argv);
    let packageDir = args.packageDir ? path.resolve(args.packageDir) : pluginRoot();
    if (args.zip) {
      if (!args.extractTo) throw new Error("--extract-to is required when --zip is provided");
      packageDir = extractStoredZip(path.resolve(args.zip), path.resolve(args.extractTo));
    }
    const errors = validateCustomerInstall(packageDir, { full: args.full });
    const report = {
      verdict: errors.length === 0 ? "pass" : "blocked",
      package_dir: packageDir,
      mode: args.zip ? "zip_extract" : "package_dir",
      full: args.full,
      errors
    };
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

module.exports = { extractStoredZip, run, validateCustomerInstall };
