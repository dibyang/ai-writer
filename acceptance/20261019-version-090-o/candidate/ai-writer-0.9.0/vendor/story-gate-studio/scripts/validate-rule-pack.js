"use strict";

const path = require("path");
const { assert, pluginRoot, readJson, requireFields, runCli } = require("./lib");

function validateRulePack(rulePackPath = path.join(pluginRoot(), "references", "rule-pack.json")) {
  const errors = [];
  const root = pluginRoot();
  const schema = readJson(path.join(root, "references", "rule-pack.schema.json"));
  const rulePack = readJson(path.resolve(root, rulePackPath));

  requireFields(rulePack, schema.required_top_level_fields, "rule_pack", errors);
  assert(Array.isArray(rulePack.modules), "rule_pack.modules must be an array", errors);
  assert(Array.isArray(rulePack.rules), "rule_pack.rules must be an array", errors);

  const moduleIds = new Set();
  for (const [index, module] of (rulePack.modules || []).entries()) {
    requireFields(module, schema.required_module_fields, `modules[${index}]`, errors);
    assert(schema.allowed_modes.includes(module.mode), `modules[${index}] has unsupported mode: ${module.mode}`, errors);
    assert(!moduleIds.has(module.module_id), `duplicate module_id: ${module.module_id}`, errors);
    moduleIds.add(module.module_id);
    assert(Array.isArray(module.source_refs) && module.source_refs.length > 0, `modules[${index}] source_refs must be non-empty`, errors);
  }

  const ruleIds = new Set();
  for (const [index, rule] of (rulePack.rules || []).entries()) {
    requireFields(rule, schema.required_rule_fields, `rules[${index}]`, errors);
    assert(schema.allowed_severity.includes(rule.severity), `rules[${index}] has unsupported severity: ${rule.severity}`, errors);
    assert(moduleIds.has(rule.module_id), `rules[${index}] references unknown module_id: ${rule.module_id}`, errors);
    assert(!ruleIds.has(rule.rule_id), `duplicate rule_id: ${rule.rule_id}`, errors);
    ruleIds.add(rule.rule_id);
    assert(Array.isArray(rule.source_refs) && rule.source_refs.length > 0, `rules[${index}] source_refs must be non-empty`, errors);
  }

  return errors;
}

if (require.main === module) {
  runCli("QG-002 rule pack schema", () => validateRulePack(process.argv[2] || undefined));
}

module.exports = { validateRulePack };
