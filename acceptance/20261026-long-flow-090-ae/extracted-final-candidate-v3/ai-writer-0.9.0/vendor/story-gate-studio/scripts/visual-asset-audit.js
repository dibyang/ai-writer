"use strict";

const fs = require("fs");
const path = require("path");
const { defaultRulePackId } = require("./lib");
const { listFiles, pluginRoot } = require("./lib");

function auditVisualAssets(target = path.join(pluginRoot(), "examples", "fixtures")) {
  const root = path.resolve(target);
  const files = fs.existsSync(root) && fs.statSync(root).isDirectory()
    ? listFiles(root, file => file.endsWith(".json"))
    : fs.existsSync(root) && root.endsWith(".json")
      ? [root]
      : [];
  const findings = [];
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    const input = data.input || {};
    if (data.mode === "visual" && (!input.prompt_record || !input.selection_basis)) {
      findings.push({
        rule_id: "SGM-VIS-001-R001",
        severity: "high",
        location: path.relative(pluginRoot(), file).replace(/\\/g, "/"),
        recommendation: "Add prompt record and selection basis before selected entry.",
        source_refs: ["docs/traceability.md#SGM-VIS-001"]
      });
    }
  }
  return {
    report_id: "sgm-script-visual-asset-audit",
    module_id: "SGM-VIS-001",
    mode: "visual",
    rule_pack: defaultRulePackId(),
    target_refs: [path.relative(pluginRoot(), root).replace(/\\/g, "/")],
    source_refs: ["docs/traceability.md#SGM-VIS-001"],
    verdict: findings.length > 0 ? "blocked" : "pass",
    findings
  };
}

if (require.main === module) {
  console.log(JSON.stringify(auditVisualAssets(process.argv[2]), null, 2));
}

module.exports = { auditVisualAssets };
