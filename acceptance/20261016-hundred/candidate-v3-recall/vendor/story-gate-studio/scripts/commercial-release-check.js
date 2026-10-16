"use strict";

const fs = require("fs");
const path = require("path");
const { assert, hasReplacementChar, listFiles, pluginRoot, readJson, runCli } = require("./lib");

const TEXT_EXTENSIONS = new Set([".md", ".json", ".js", ".txt", ".yml", ".yaml"]);

function isTextFile(file) {
  return TEXT_EXTENSIONS.has(path.extname(file).toLowerCase());
}

function getBlockedTerms(blocklist) {
  return [
    ...(blocklist.blocked_terms || []),
    ...(blocklist.blocked_term_codepoints || []).map(codepoints => String.fromCodePoint(...codepoints)),
    ...(blocklist.blocked_term_segments || []).map(segments => segments.join(""))
  ];
}

function validateCommercialRelease(root = pluginRoot()) {
  const errors = [];
  const blocklist = readJson(path.join(root, "references", "private-content-blocklist.json"));
  const allowed = new Set((blocklist.allowed_files || []).map(file => path.normalize(file)));
  const blockedTerms = getBlockedTerms(blocklist);

  assert(fs.existsSync(path.join(root, "LICENSE.md")), "missing LICENSE.md", errors);
  assert(fs.existsSync(path.join(root, "marketplace.private.example.json")), "missing marketplace.private.example.json", errors);

  for (const scanRoot of blocklist.scan_roots || []) {
    const absoluteRoot = path.join(root, scanRoot);
    if (!fs.existsSync(absoluteRoot)) continue;
    for (const file of listFiles(absoluteRoot, isTextFile)) {
      const relative = path.normalize(path.relative(root, file));
      if (allowed.has(relative)) continue;
      const text = fs.readFileSync(file, "utf8");
      for (const term of blockedTerms) {
        assert(!text.includes(term), `${relative} contains private marker: ${term}`, errors);
      }
    }
  }

  const docs = listFiles(path.join(root, "docs"), isTextFile);
  for (const file of docs) {
    const text = fs.readFileSync(file, "utf8");
    assert(!hasReplacementChar(text), `${path.relative(root, file)} contains replacement or mojibake marker`, errors);
  }

  const commercialDocPath = path.join(root, "docs", "commercialization.md");
  const packageDocPath = path.join(root, "docs", "private-package.md");
  assert(
    fs.existsSync(commercialDocPath) || fs.existsSync(packageDocPath),
    "missing docs/commercialization.md or docs/private-package.md",
    errors
  );
  const commercialDoc = fs.existsSync(commercialDocPath)
    ? fs.readFileSync(commercialDocPath, "utf8")
    : fs.readFileSync(packageDocPath, "utf8");
  assert(
    commercialDoc.includes("本地") || commercialDoc.includes("私有"),
    "commercial or package doc must state private/local operation boundary",
    errors
  );
  assert(
    commercialDoc.includes("不得销售") || commercialDoc.includes("不承诺爆款"),
    "commercial or package doc must forbid selling source material or viral-success guarantees",
    errors
  );
  assert(
    commercialDoc.includes("平台") || commercialDoc.includes("交付边界"),
    "commercial or package doc must require platform or delivery-boundary review",
    errors
  );

  return errors;
}

if (require.main === module) {
  runCli("BIZ-QG commercial release checks", () => validateCommercialRelease());
}

module.exports = { getBlockedTerms, validateCommercialRelease };
