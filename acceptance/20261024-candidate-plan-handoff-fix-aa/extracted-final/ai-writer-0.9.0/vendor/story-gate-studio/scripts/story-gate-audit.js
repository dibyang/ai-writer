"use strict";

const fs = require("fs");
const { defaultRulePackId } = require("./lib");
const path = require("path");
const { listFiles, pluginRoot, runCli } = require("./lib");

function scanFile(file, root) {
  const text = fs.readFileSync(file, "utf8");
  const findings = [];
  const checks = [
    ["TODO", "SGM-GATE-001-R001", "blocker"],
    ["[PLACEHOLDER]", "SGM-GATE-001-R001", "blocker"],
    ["上一章", "SGM-GATE-001-R001", "medium"],
    ["本章", "SGM-GATE-001-R001", "medium"]
  ];
  for (const [term, ruleId, severity] of checks) {
    if (text.includes(term)) {
      findings.push({
        rule_id: ruleId,
        severity,
        location: path.relative(root, file),
        recommendation: `Remove release residue marker: ${term}`,
        source_refs: ["docs/traceability.md#SGM-GATE-001"]
      });
    }
  }
  return findings;
}

function audit(target = path.join(pluginRoot(), "examples", "fixtures")) {
  const root = path.resolve(target);
  const files = fs.existsSync(root) && fs.statSync(root).isDirectory()
    ? listFiles(root, file => [".md", ".txt", ".json"].includes(path.extname(file).toLowerCase()))
    : [];
  const findings = files.flatMap(file => scanFile(file, root));
  return {
    report_id: "sgm-script-story-gate-audit",
    module_id: "SGM-GATE-001",
    mode: "novel",
    rule_pack: defaultRulePackId(),
    target_refs: [path.relative(pluginRoot(), root)],
    source_refs: ["docs/traceability.md#SGM-GATE-001"],
    verdict: findings.some(item => item.severity === "blocker") ? "blocked" : "pass",
    findings
  };
}

if (require.main === module) {
  const report = audit(process.argv[2]);
  console.log(JSON.stringify(report, null, 2));
  process.exitCode = 0;
}

module.exports = { audit };
