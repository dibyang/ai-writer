"use strict";

const fs = require("fs");
const path = require("path");
const { assert, pluginRoot, readJson, requireFields, runCli } = require("./lib");

function validateTaskRegistry(root = pluginRoot()) {
  const errors = [];
  const schema = readJson(path.join(root, "references", "task-registry.schema.json"));
  const registry = readJson(path.join(root, "references", "task-registry.json"));

  requireFields(registry, schema.required_top_level_fields, "task-registry", errors);
  assert(Array.isArray(registry.tasks), "task-registry.tasks must be an array", errors);

  const taskIds = new Set();
  for (const [index, task] of (registry.tasks || []).entries()) {
    const prefix = `tasks[${index}]`;
    requireFields(task, schema.required_task_fields, prefix, errors);
    assert(!taskIds.has(task.task_id), `duplicate task_id: ${task.task_id}`, errors);
    taskIds.add(task.task_id);
    assert(schema.allowed_modes.includes(task.mode), `${prefix} unsupported mode: ${task.mode}`, errors);
    assert(schema.allowed_write_policy.includes(task.write_policy), `${prefix} unsupported write_policy: ${task.write_policy}`, errors);
    assert(fs.existsSync(path.join(root, "skills", task.skill, "SKILL.md")), `${prefix} references missing skill: ${task.skill}`, errors);
    assert(Array.isArray(task.module_ids) && task.module_ids.length > 0, `${prefix} module_ids must be non-empty`, errors);
    assert(Array.isArray(task.tests) && task.tests.length > 0, `${prefix} tests must be non-empty`, errors);
    assert(Array.isArray(task.done_when) && task.done_when.length > 0, `${prefix} done_when must be non-empty`, errors);
  }

  const expectedTasks = [
    "project_bible",
    "chapter_gate",
    "third_party_review",
    "release_gate",
    "market_readability_review",
    "visual_selected_gate",
    "short_drama_trial_pack"
  ];
  for (const task of expectedTasks) {
    assert((registry.tasks || []).some(item => item.task === task), `missing expected task: ${task}`, errors);
  }

  return errors;
}

if (require.main === module) {
  runCli("QG-012 task registry", () => validateTaskRegistry());
}

module.exports = { validateTaskRegistry };
