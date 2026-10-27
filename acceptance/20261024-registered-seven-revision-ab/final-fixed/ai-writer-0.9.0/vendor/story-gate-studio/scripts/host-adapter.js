"use strict";

const fs = require("fs");
const path = require("path");
const { evaluateBlindReadGate, loadBlindReadInput } = require("./blind-read-gate");
const { evaluateChapterGate, loadChapterGateInput } = require("./chapter-gate");
const { evaluateReviewScorecard } = require("./review-scorecard");
const { checkProjectRulePack } = require("./project-rule-pack-check");
const { pluginRoot, readJson } = require("./lib");

const ADAPTER_VERSION = "story-gate-host-adapter@0.1.0";

function resolveTarget(target, root = pluginRoot()) {
  return path.isAbsolute(target) ? target : path.resolve(root, target);
}

function validateRequest(request, root = pluginRoot()) {
  const schema = readJson(path.join(root, "references", "host-adapter.schema.json"));
  const errors = [];
  for (const field of schema.required_fields) {
    if (!Object.prototype.hasOwnProperty.call(request, field)) {
      errors.push(`missing required field: ${field}`);
    }
  }
  if (request.adapter_version !== schema.adapter_version) {
    errors.push(`unsupported adapter_version: ${request.adapter_version}`);
  }
  if (!schema.allowed_hosts.includes(request.host)) {
    errors.push(`unsupported host: ${request.host}`);
  }
  if (!schema.allowed_tasks.includes(request.task)) {
    errors.push(`unsupported task: ${request.task}`);
  }
  if (!schema.allowed_modes.includes(request.mode)) {
    errors.push(`unsupported mode: ${request.mode}`);
  }
  if (!Array.isArray(request.target_refs) || request.target_refs.length === 0) {
    errors.push("target_refs must be a non-empty array");
  }
  return errors;
}

function adapterResponse(request, status, exitCode, report, errors = []) {
  return {
    adapter_version: ADAPTER_VERSION,
    host: request.host || "unknown",
    task: request.task || "unknown",
    status,
    exit_code: exitCode,
    report,
    errors
  };
}

function runTask(request, root = pluginRoot()) {
  if (request.task === "review_scorecard") {
    const files = request.target_refs.map(target => resolveTarget(target, root));
    const report = evaluateReviewScorecard(files, { rulePack: request.rule_pack });
    return adapterResponse(request, report.verdict, report.verdict === "pass" ? 0 : 1, report);
  }
  if (request.task === "chapter_gate") {
    const target = resolveTarget(request.target_refs[0], root);
    const input = loadChapterGateInput(target);
    const report = evaluateChapterGate(input.input, { ...input, rulePack: request.rule_pack });
    return adapterResponse(request, report.verdict, report.verdict === "pass" ? 0 : 1, report);
  }
  if (request.task === "blind_read_gate") {
    const target = resolveTarget(request.target_refs[0], root);
    const input = loadBlindReadInput(target);
    const report = evaluateBlindReadGate(input.input, { ...input, rulePack: request.rule_pack });
    return adapterResponse(request, report.verdict, report.verdict === "pass" ? 0 : 1, report);
  }
  if (request.task === "project_rule_pack_check") {
    const target = resolveTarget(request.target_refs[0], root);
    const errors = checkProjectRulePack(target);
    const status = errors.length === 0 ? "pass" : "blocked";
    return adapterResponse(request, status, errors.length === 0 ? 0 : 1, { verdict: status, target }, errors);
  }
  return adapterResponse(request, "error", 2, null, [`unsupported task: ${request.task}`]);
}

function runHostAdapter(requestPath, root = pluginRoot()) {
  if (!requestPath) {
    return adapterResponse({}, "error", 2, null, ["missing host adapter request path"]);
  }
  const full = resolveTarget(requestPath, root);
  if (!fs.existsSync(full)) {
    return adapterResponse({}, "error", 2, null, [`host adapter request not found: ${requestPath}`]);
  }
  const request = readJson(full);
  const errors = validateRequest(request, root);
  if (errors.length > 0) {
    return adapterResponse(request, "error", 2, null, errors);
  }
  return runTask(request, root);
}

function run(argv = process.argv.slice(2)) {
  const response = runHostAdapter(argv[0]);
  console.log(JSON.stringify(response, null, 2));
  return response.exit_code;
}

if (require.main === module) {
  process.exitCode = run();
}

module.exports = {
  ADAPTER_VERSION,
  run,
  runHostAdapter,
  validateRequest
};
