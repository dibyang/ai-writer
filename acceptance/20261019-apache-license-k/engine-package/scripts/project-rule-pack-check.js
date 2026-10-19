"use strict";

const fs = require("fs");
const path = require("path");
const { validateRulePack } = require("./validate-rule-pack");
const { printResult } = require("./lib");

function checkProjectRulePack(target) {
  if (!target) {
    return ["missing project rule pack path"];
  }
  const resolved = path.isAbsolute(target) ? target : path.resolve(process.cwd(), target);
  if (!fs.existsSync(resolved)) {
    return [`project rule pack path not found: ${target}`];
  }
  const rulePackPath = fs.statSync(resolved).isDirectory()
    ? path.join(resolved, "rule-pack.json")
    : resolved;
  if (!fs.existsSync(rulePackPath)) {
    return [`project rule pack file not found: ${path.relative(process.cwd(), rulePackPath)}`];
  }
  return validateRulePack(rulePackPath);
}

if (require.main === module) {
  const target = process.argv[2];
  const errors = checkProjectRulePack(target);
  const ok = printResult("Project rule pack", errors);
  process.exitCode = ok ? 0 : 1;
}

module.exports = { checkProjectRulePack };
