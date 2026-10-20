"use strict";

const fs = require("fs");
const path = require("path");
const { defaultRulePackId } = require("./lib");
const { listFiles, pluginRoot } = require("./lib");

function repeatedLines(target = path.join(pluginRoot(), "examples", "fixtures")) {
  const root = path.resolve(target);
  const counts = new Map();
  const files = fs.existsSync(root) && fs.statSync(root).isDirectory()
    ? listFiles(root, file => [".md", ".txt"].includes(path.extname(file).toLowerCase()))
    : [];
  for (const file of files) {
    const lines = fs.readFileSync(file, "utf8").split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 12);
    for (const line of lines) counts.set(line, (counts.get(line) || 0) + 1);
  }
  const findings = [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([line, count]) => ({
      rule_id: "SGM-GATE-001-R001",
      severity: "medium",
      location: "multiple files",
      recommendation: `Repeated line appears ${count} times: ${line.slice(0, 80)}`,
      source_refs: ["docs/traceability.md#SGM-GATE-002"]
    }));
  return {
    report_id: "sgm-script-template-scan",
    module_id: "SGM-GATE-002",
    mode: "novel",
    rule_pack: defaultRulePackId(),
    target_refs: [path.relative(pluginRoot(), root)],
    source_refs: ["docs/traceability.md#SGM-GATE-002"],
    verdict: findings.length > 0 ? "needs_polish" : "pass",
    findings
  };
}

if (require.main === module) {
  console.log(JSON.stringify(repeatedLines(process.argv[2]), null, 2));
}

module.exports = { repeatedLines };
