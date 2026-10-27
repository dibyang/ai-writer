"use strict";

const fs = require("fs");
const path = require("path");
const { assert, listFiles, pluginRoot, readJson, requireFields, runCli } = require("./lib");

function reportFiles(target) {
  const root = pluginRoot();
  const full = path.resolve(root, target || path.join("examples", "expected-reports"));
  if (!fs.existsSync(full)) return [];
  const stat = fs.statSync(full);
  if (stat.isFile()) return [full];
  return listFiles(full, file => file.endsWith(".json"));
}

function validateOneReport(report, schema, label, errors) {
  requireFields(report, schema.required_top_level_fields, label, errors);
  assert(schema.allowed_modes.includes(report.mode), `${label} unsupported mode: ${report.mode}`, errors);
  assert(schema.allowed_verdicts.includes(report.verdict), `${label} unsupported verdict: ${report.verdict}`, errors);
  assert(Array.isArray(report.target_refs) && report.target_refs.length > 0, `${label} target_refs must be non-empty`, errors);
  assert(Array.isArray(report.source_refs) && report.source_refs.length > 0, `${label} source_refs must be non-empty`, errors);
  assert(Array.isArray(report.findings), `${label} findings must be an array`, errors);

  for (const [index, finding] of (report.findings || []).entries()) {
    const prefix = `${label}.findings[${index}]`;
    requireFields(finding, schema.required_finding_fields, prefix, errors);
    assert(schema.allowed_severity.includes(finding.severity), `${prefix} unsupported severity: ${finding.severity}`, errors);
    assert(Array.isArray(finding.source_refs) && finding.source_refs.length > 0, `${prefix} source_refs must be non-empty`, errors);
  }
}

function validateReports(target) {
  const errors = [];
  const schema = readJson(path.join(pluginRoot(), "references", "report.schema.json"));
  const files = reportFiles(target);
  assert(files.length > 0, `no report JSON files found at ${target || "examples/expected-reports"}`, errors);
  for (const file of files) {
    validateOneReport(readJson(file), schema, path.relative(pluginRoot(), file), errors);
  }
  return errors;
}

if (require.main === module) {
  runCli("QG-003 report schema", () => validateReports(process.argv[2]));
}

module.exports = { validateOneReport, validateReports };
