import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
const phase = path.dirname(fileURLToPath(import.meta.url));
const work = path.join(phase, 'work');
const frozen = path.resolve(phase, '../sources/package-0.7.7');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const read = file => fs.readFileSync(path.join(phase, file), 'utf8');
const json = file => JSON.parse(read(file));
const output = label => json(`evidence/${label}/stdout.txt`);
const methods = [
  ['.agents/skills/writer-project/SKILL.md', 52, '隔离初始化、正式workflow、discussion、决策与事实边界'],
  ['.agents/skills/writer-novel/SKILL.md', 40, '滚动近期三章、人物行动与计划边界'],
  ['.agents/skills/writer-review/SKILL.md', 46, '仅审查、版本绑定和知情自检边界'],
  ['.agents/skills/writer-novel/references/story-development.md', 28, '两个不同阶段、结果改变选择、供给与缩短、卷计划不入事实'],
  ['.agents/skills/writer-novel/references/scene-connections.md', 45, 'A身体限制、B承诺与转场、C合作对白和余韵'],
  ['.agents/skills/writer-review/references/general-review.md', 125, '小说常规审查；按短样本与作者温和日常范围使用'],
  ['.agents/skills/writer-review/references/natural-language-authenticity.md', 95, '四项语言检查，硬问题与偏好分离'],
  ['.agents/skills/writer-project/references/long-form.md', 97, '新作long、卷契约和计划/事实分离'],
  ['.agents/skills/writer-review/references/physical-logic-operability.md', 40, 'A伤情、重物与操作条件'],
  ['docs/workflow.md', 274, '正式JSON、原话证据、CAS与动作范围'],
  ['docs/long-form.md', 94, '长篇规划、恢复、零章机械核验边界']
].map(([file, last_line_read, use]) => ({ file, read_range: `1-${last_line_read}`, complete: true, sha256: hash(fs.readFileSync(path.join(frozen, file))), use }));
const commands = fs.readdirSync(path.join(phase, 'evidence')).sort().map(label => {
  const invocation = json(`evidence/${label}/invocation.json`);
  const result = json(`evidence/${label}/result.json`);
  assert.equal(path.resolve(invocation.entry), path.join(frozen, 'bin/ai-writer.mjs'));
  const expected = label.startsWith('deny-') ? 2 : 0;
  assert.equal(result.exit_code, expected, `Unexpected CLI result: ${label}`);
  assert.equal(result.spawn_error, null);
  if (label.startsWith('deny-')) {
    assert.equal(json(`evidence/${label}/stderr.txt`).code, 'ACTION_OUT_OF_SCOPE');
    assert.equal(read(`evidence/${label}/stdout.txt`), '');
    assert.equal(result.state_sha256_before, result.state_sha256_after);
  }
  return { label, args: invocation.args, start: result.start, cli_exit_code: result.exit_code, state_unchanged: result.state_sha256_before === result.state_sha256_after, stdout: `evidence/${label}/stdout.txt`, stderr: `evidence/${label}/stderr.txt` };
});
assert.equal(output('init').schema_version, 6);
assert.equal(output('init').mode, 'long');
const status = output('status-after-denial');
const before = output('status-before-denial');
assert.deepEqual(before, status);
assert.equal(status.revision, 3);
assert.equal(status.draft_inventory.registered_count, 0);
assert.deepEqual(status.draft_inventory.unregistered, []);
assert.equal(status.current.character_count, 0);
assert.equal(status.current.ledger_count, 0);
assert.deepEqual(status.current.timeline_tail, []);
assert.deepEqual(status.stale_units, []);
assert.deepEqual(status.changed_sources, []);
assert.deepEqual(status.impact_pending, []);
assert.deepEqual(status.revisions.sessions, []);
const workflow = output('workflow-restored');
assert.deepEqual(workflow.workflow, json('work/.writer/method-workflow-input.json').workflow);
assert.deepEqual(workflow.workflow.authorization.allowed_actions, ['discuss', 'plan']);
assert.equal(workflow.workflow.authorization.draft_range, null);
assert.equal(workflow.workflow.authorization.revise_range, null);
const discussion = output('discussion-context');
assert.equal(discussion.purpose, 'discussion');
assert.deepEqual(discussion.governance, status.governance);
const decisions = output('decision-current').decisions;
assert.equal(decisions.current.length, 1);
assert.equal(decisions.current[0].id, 'D_AUTHOR_DIRECTION');
assert.equal(decisions.candidates.length, 1);
assert.deepEqual(decisions.candidates[0].adopted_items, []);
const check = output('check');
assert.equal(check.ok, true);
assert.equal(check.units, 0);
assert.equal(check.scope, 'mechanical-only');
assert.equal(check.literary_quality, 'unreviewed');
const doctor = output('doctor');
assert.equal(doctor.ok, true);
assert.equal(doctor.tool_version, '0.7.7');
assert.deepEqual(doctor.errors, []);
assert.deepEqual(doctor.warnings, []);
assert.deepEqual(doctor.build.missing, []);
assert.deepEqual(doctor.build.mismatches, []);
const state = json('work/.writer/state.json');
assert.deepEqual(state.units, []);
assert.deepEqual(state.snapshot.characters, {});
assert.deepEqual(state.snapshot.timeline, []);
assert.deepEqual(state.snapshot.threads, []);
assert.equal(Object.keys(state.snapshot.ledger ?? {}).length, 0);
assert.deepEqual(fs.readdirSync(path.join(work, '正文')), []);
assert.deepEqual(fs.readdirSync(path.join(work, '大纲/单元')).sort(), ['0001.json', '0002.json', '0003.json']);
const samples = json('sample-originals.json');
const sampleChecks = Object.entries(samples).map(([id, sample]) => {
  const bytes = fs.readFileSync(path.join(work, sample.file));
  assert.equal(bytes.length, sample.bytes);
  assert.equal(hash(bytes), sample.sha256);
  assert.equal(bytes.toString('utf8'), sample.text);
  return { id, file: sample.file, bytes: bytes.length, sha256: hash(bytes), unchanged: true };
});
const denial = json('denial-comparison.json');
assert.equal(denial.unchanged, true);
const boundary = json('boundary-comparison.json');
assert.equal(boundary.unchanged, true);
const review = fs.readFileSync(path.join(work, '审查/原创测试段落-20261019.md'));
const result = { ok: true, scope: 'Finite isolated method/CLI smoke only; no literary acceptance', work, frozen_entry: path.join(frozen, 'bin/ai-writer.mjs'), revision: status.revision, units: 0, allowed_actions: status.governance.authorization.allowed_actions, state_sha256: hash(fs.readFileSync(path.join(work, '.writer/state.json'))), denial, boundary, samples: sampleChecks, check: { scope: check.scope, literary_quality: check.literary_quality }, doctor: { ok: doctor.ok, tool_version: doctor.tool_version, observed_content_id: doctor.build.observed_content_id, runtime_id: doctor.build.runtime_id, engine: doctor.engine }, review: { file: 'work/审查/原创测试段落-20261019.md', sha256: hash(review), reviewer: 'same-model-informed-self-review' }, methods, commands, unexpected_cli_failures: [], unproved: ['human blind reading', 'market validation', 'whole-chapter literary acceptance', '100-chapter supply', 'actual boat repair procedures', 'next-volume payoff', 'publication readiness'] };
fs.writeFileSync(path.join(phase, 'verification.json'), JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
fs.writeFileSync(path.join(phase, 'methods-read.json'), JSON.stringify({ basis: 'Actual FastCtx full text reads in this session; hashes identify bytes, do not independently prove reading', files: methods }, null, 2) + '\n', { flag: 'wx' });
fs.writeFileSync(path.join(phase, 'commands.md'), '# 真实 CLI 命令与原始输出\n\n所有 invocation.json 的 entry 均为用户指定冻结包入口；cwd 为本 phase。result.json 中 CLI 退出码由 Node spawnSync 原值记录，预期拒绝为 2；外层 PowerShell 在该环境中报告 1，不替换原始 CLI 退出码。原始 stdout/stderr 分别保存，不合并、不覆盖。\n\n| 标签 | 参数 | CLI 退出码 | stdout | stderr |\n| --- | --- | ---: | --- | --- |\n' + commands.map(command => `| ${command.label} | \`${command.args.join(' ')}\` | ${command.cli_exit_code} | [原始输出](${command.stdout}) | [原始错误](${command.stderr}) |`).join('\n') + '\n', { flag: 'wx' });
process.stdout.write(JSON.stringify({ ok: result.ok, command_count: commands.length, method_count: methods.length, revision: result.revision, units: result.units, samples_unchanged: sampleChecks.length, denial_files_unchanged: denial.file_count, existing_files_unchanged: boundary.compared_files, unexpected_cli_failures: [] }, null, 2) + '\n');
