"use strict";

const fs = require("fs");
const path = require("path");

function pluginRoot() {
  return path.resolve(__dirname, "..");
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
}

function defaultRulePackId() {
  const rulePack = readJson(path.join(pluginRoot(), "references", "rule-pack.json"));
  return `${rulePack.rule_pack}@${rulePack.version}`;
}

function listFiles(root, predicate = () => true) {
  const out = [];
  if (!fs.existsSync(root)) return out;
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const full = path.join(root, entry.name);
    if (entry.isDirectory()) {
      out.push(...listFiles(full, predicate));
    } else if (predicate(full)) {
      out.push(full);
    }
  }
  return out;
}

function assert(condition, message, errors) {
  if (!condition) errors.push(message);
}

function requireFields(object, fields, prefix, errors) {
  for (const field of fields) {
    assert(
      Object.prototype.hasOwnProperty.call(object, field) && object[field] !== undefined && object[field] !== null && object[field] !== "",
      `${prefix} missing required field: ${field}`,
      errors
    );
  }
}

function hasReplacementChar(text) {
  const mojibakeMarker = ["\u951F", "\u65A4", "\u62F7"].join("");
  return text.includes("\uFFFD") || text.includes(mojibakeMarker);
}

function printResult(name, errors) {
  if (errors.length > 0) {
    console.error(`[FAIL] ${name}`);
    for (const error of errors) console.error(`- ${error}`);
    return false;
  }
  console.log(`[PASS] ${name}`);
  return true;
}

function runCli(name, fn) {
  try {
    const errors = fn();
    const ok = printResult(name, errors);
    process.exitCode = ok ? 0 : 1;
  } catch (error) {
    console.error(`[FAIL] ${name}`);
    console.error(error.stack || String(error));
    process.exitCode = 1;
  }
}

module.exports = {
  assert,
  defaultRulePackId,
  hasReplacementChar,
  listFiles,
  pluginRoot,
  printResult,
  readJson,
  requireFields,
  runCli
};
