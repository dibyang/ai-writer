"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { validatePrivatePackage } = require("./private-package-check");
const { listFiles, pluginRoot } = require("./lib");
const { archiveBaseNameFor } = require("./release-check");

const DEFAULT_PACKAGE_NAME = "story-gate-studio-private-commercial-trial";

function parseArgs(argv) {
  const args = { packageDir: null, outDir: null, name: null, force: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--package-dir") {
      args.packageDir = argv[++i];
    } else if (arg === "--out-dir") {
      args.outDir = argv[++i];
    } else if (arg === "--name") {
      args.name = argv[++i];
    } else if (arg === "--force") {
      args.force = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function defaultDeliverablesDir(root) {
  return path.resolve(root, "..", "..", "story-gate-deliverables");
}

function defaultPackageDir(root) {
  return path.join(defaultDeliverablesDir(root), DEFAULT_PACKAGE_NAME);
}

function isInside(parent, child) {
  const relative = path.relative(parent, child);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

const CRC_TABLE = (() => {
  const table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function dosDateTime() {
  const year = 2026;
  const month = 1;
  const day = 1;
  const hour = 0;
  const minute = 0;
  const second = 0;
  return {
    time: (hour << 11) | (minute << 5) | Math.floor(second / 2),
    date: ((year - 1980) << 9) | (month << 5) | day
  };
}

function listPackageFiles(packageDir) {
  return listFiles(packageDir, file => fs.statSync(file).isFile())
    .map(file => ({
      absolute: file,
      relative: path.relative(packageDir, file).replace(/\\/g, "/")
    }))
    .sort((a, b) => a.relative.localeCompare(b.relative));
}

function createZipArchive(packageDir, archivePath, rootName = path.basename(packageDir)) {
  const files = listPackageFiles(packageDir);
  const { time, date } = dosDateTime();
  const chunks = [];
  const central = [];
  let offset = 0;

  for (const file of files) {
    const data = fs.readFileSync(file.absolute);
    const zipPath = `${rootName}/${file.relative}`;
    const nameBuffer = Buffer.from(zipPath, "utf8");
    const crc = crc32(data);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0, 6);
    local.writeUInt16LE(0, 8);
    local.writeUInt16LE(time, 10);
    local.writeUInt16LE(date, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(data.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBuffer.length, 26);
    local.writeUInt16LE(0, 28);
    chunks.push(local, nameBuffer, data);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0, 8);
    centralHeader.writeUInt16LE(0, 10);
    centralHeader.writeUInt16LE(time, 12);
    centralHeader.writeUInt16LE(date, 14);
    centralHeader.writeUInt32LE(crc, 16);
    centralHeader.writeUInt32LE(data.length, 20);
    centralHeader.writeUInt32LE(data.length, 24);
    centralHeader.writeUInt16LE(nameBuffer.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42);
    central.push(centralHeader, nameBuffer);

    offset += local.length + nameBuffer.length + data.length;
  }

  const centralOffset = offset;
  const centralSize = central.reduce((sum, item) => sum + item.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(centralSize, 12);
  end.writeUInt32LE(centralOffset, 16);
  end.writeUInt16LE(0, 20);

  fs.mkdirSync(path.dirname(archivePath), { recursive: true });
  fs.writeFileSync(archivePath, Buffer.concat([...chunks, ...central, end]));
  return files;
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function writeChecksumFile(packageDir, archivePath, checksumPath, archiveName) {
  const lines = [];
  lines.push(`${sha256(archivePath)}  ${archiveName}`);
  for (const file of listPackageFiles(packageDir)) {
    lines.push(`${sha256(file.absolute)}  ${path.basename(packageDir)}/${file.relative}`);
  }
  fs.writeFileSync(checksumPath, `${lines.join("\n")}\n`, "utf8");
  return lines.length;
}

function buildReleaseArchive(options = {}) {
  const root = options.root || pluginRoot();
  const packageDir = path.resolve(options.packageDir || defaultPackageDir(root));
  const outDir = path.resolve(options.outDir || path.dirname(packageDir));
  const name = options.name || archiveBaseNameFor(root);
  const archivePath = path.join(outDir, `${name}.zip`);
  const checksumPath = path.join(outDir, "SHA256SUMS.txt");

  if (!fs.existsSync(packageDir)) {
    throw new Error(`Package directory not found: ${packageDir}`);
  }
  if (isInside(root, outDir)) {
    throw new Error("Refusing to write release archive inside the plugin root.");
  }
  if (!options.force && (fs.existsSync(archivePath) || fs.existsSync(checksumPath))) {
    throw new Error("Archive or SHA256SUMS.txt already exists; use --force to replace them.");
  }

  const errors = validatePrivatePackage(packageDir);
  if (errors.length > 0) {
    return { verdict: "blocked", package_dir: packageDir, errors };
  }

  fs.mkdirSync(outDir, { recursive: true });
  if (options.force) {
    if (fs.existsSync(archivePath)) fs.unlinkSync(archivePath);
    if (fs.existsSync(checksumPath)) fs.unlinkSync(checksumPath);
  }

  const files = createZipArchive(packageDir, archivePath, path.basename(packageDir));
  const checksum_count = writeChecksumFile(packageDir, archivePath, checksumPath, path.basename(archivePath));
  return {
    verdict: "pass",
    package_dir: packageDir,
    archive: archivePath,
    checksums: checksumPath,
    file_count: files.length,
    checksum_count,
    archive_sha256: sha256(archivePath),
    errors: []
  };
}

function run(argv = process.argv.slice(2)) {
  try {
    const args = parseArgs(argv);
    const report = buildReleaseArchive(args);
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

module.exports = { buildReleaseArchive, createZipArchive, crc32, run };
