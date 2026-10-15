import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const campaign = path.dirname(fileURLToPath(import.meta.url)), root = path.resolve(campaign, '../..');
const original = path.join(campaign, 'works/雨线档案'), destination = path.join(campaign, 'guard-probes');
if (fs.existsSync(destination)) throw new Error('Preserve previous probe evidence; use a new run directory.');
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const write = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', { flag: 'wx', encoding: 'utf8' });
function inventory(dir) {
  const files = {};
  function walk(at) { for (const entry of fs.readdirSync(at, { withFileTypes: true })) {
    const file = path.join(at, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Unexpected link: ${file}`);
    if (entry.isDirectory()) walk(file); else files[path.relative(dir, file)] = sha(file);
  } }
  walk(dir); return files;
}
const protectedBefore = inventory(original), initial = read(path.join(original, '.writer/state.json'));
assert.equal(initial.units.length, 8, 'Run after session-b and before revision.');
fs.mkdirSync(destination); const calls = [], cases = []; let sequence = 0;
function clone(name) { const dir = path.join(destination, name); fs.cpSync(original, dir, { recursive: true, errorOnExist: true, force: false }); return dir; }
function cli(work, command, args = [], expected = 0) {
  const argv = [path.join(root, 'bin/ai-writer.mjs'), command, '--project', work, ...args];
  const result = spawnSync(process.execPath, argv, { cwd: root, encoding: 'utf8', timeout: 30000 });
  const data = { sequence: ++sequence, command, argv, exit_code: result.status, stdout: result.stdout, stderr: result.stderr, error: result.error?.message };
  calls.push(data); write(path.join(destination, `${String(sequence).padStart(3, '0')}-${command}.json`), data);
  assert.equal(result.status, expected, `${command}: ${result.stderr || result.stdout}`);
  return JSON.parse(result.stdout || result.stderr);
}
function stateHash(work) { return sha(path.join(work, '.writer/state.json')); }
function attempt(name, action) { try { action(); cases.push({ name, ok: true }); } catch (error) { cases.push({ name, ok: false, error: error.stack }); } }
attempt('registered-chapter-drift-blocks-context-export-and-invalidates-review', () => {
  const work = clone('body-drift'), before = stateHash(work), second = path.join(work, initial.units[1].draft);
  fs.appendFileSync(second, '\n仅用于隔离异常注入，不能用于正式稿。\n');
  const status = cli(work, 'status'); assert.ok(status.stale_units.includes(2));
  const check = cli(work, 'check', [], 1); assert.ok(check.rolling_review.stale > 0);
  assert.match(cli(work, 'context', ['--unit', '9'], 2).error, /正文已变化或缺失/);
  const out = path.join(destination, 'blocked-export'); cli(work, 'export', ['--out', out], 2);
  assert.equal(fs.existsSync(out), false); assert.equal(stateHash(work), before);
});
attempt('consumed-volume-edit-refused-and-external-volume-drift-visible', () => {
  const work = clone('volume-drift'), before = stateHash(work), ref = '大纲/分卷/V1.json', file = path.join(work, ref), oldHash = sha(file), volume = read(file);
  volume.title += '（隔离探针）'; const input = path.join(destination, 'changed-volume.json'); write(input, volume);
  assert.match(cli(work, 'volume', ['--input', input], 2).error, /已用于正文/); assert.equal(sha(file), oldHash);
  fs.writeFileSync(file, JSON.stringify(volume, null, 2) + '\n');
  const status = cli(work, 'status'); assert.ok(status.changed_sources.some(row => row.ref === ref && row.unit === 1));
  cli(work, 'context', ['--unit', '9'], 2); assert.equal(stateHash(work), before);
});
attempt('invalid-custody-observation-and-quote-rejected-without-state-write', () => {
  const work = clone('ledger-rejections'), before = stateHash(work), plan = { unit: 9, title: '隔离检查', goal: '验证保护', change: '不登记', beats: ['隔离检查'], cast: ['林岚'], recall_ids: ['P_KEY', 'O_LABEL'] };
  const planInput = path.join(destination, 'probe-plan.json'); write(planInput, plan); cli(work, 'plan', ['--input', planInput]);
  const packet = cli(work, 'context', ['--unit', '9']);
  assert.equal(packet.outline.volume.id, 'V3');
  assert.ok(packet.continuity.recall.selected.T_COPY.includes('due'));
  assert.ok(['pending', 'partial'].includes(packet.continuity.author.T_COPY.status));
  const tx = cli(work, 'record-template', ['--unit', '9', '--draft', '正文/0009-隔离探针.md']);
  fs.writeFileSync(path.join(work, tx.draft), '# 隔离检查\n\n异常接收人接过铜钥匙。\n'); tx.summary = '仅用于预期失败的隔离检查';
  const evidence = [{ unit: 9, quote: '异常接收人接过铜钥匙。' }];
  const payloads = [
    { name: 'wrong-holder', expected: /previous_holder/, ledger: { P_KEY: { previous_holder: '不存在的旧保管人', custody: { holder: '异常接收人', location: '隔离探针', condition: '不改原稿' }, evidence } } },
    { name: 'immutable-observation', expected: /观察不可改写/, ledger: { O_LABEL: { statement: '覆盖原来的观察', evidence } } },
    { name: 'fabricated-quote', expected: /找不到证据引文/, ledger: { PROBE: { type: 'thread', statement: '测试', status: 'pending', evidence: [{ unit: 9, quote: '正文不存在的证据原句' }] } } }
  ];
  for (const payload of payloads) { const input = path.join(destination, payload.name + '.json'); write(input, { ...tx, changes: { ledger: payload.ledger } }); assert.match(cli(work, 'record', ['--input', input], 2).error, payload.expected); assert.equal(stateHash(work), before); }
  const changedPlan = path.join(destination, 'new-plan.json'); write(changedPlan, { ...plan, goal: '来源已更新，不应接受旧写前模板' }); cli(work, 'plan', ['--input', changedPlan]);
  const stale = path.join(destination, 'stale-template.json'); write(stale, { ...tx, changes: {} }); assert.match(cli(work, 'record', ['--input', stale], 2).error, /上下文来源已变化/); assert.equal(stateHash(work), before);
});
attempt('rewind-preserves-first-unit-and-text-but-invalidates-later-tracking-and-reviews', () => {
  const work = clone('rewind'), before = read(path.join(work, '.writer/state.json'));
  cli(work, 'rewind', ['--from', '2', '--expected-revision', String(before.revision)]);
  const after = read(path.join(work, '.writer/state.json')); assert.equal(after.revision, before.revision + 1); assert.deepEqual(after.units, before.units.slice(0, 1));
  for (const unit of before.units) assert.equal(sha(path.join(work, unit.draft)), unit.sha256);
  const status = cli(work, 'status'); assert.equal(status.next_unit, 2); assert.equal(status.draft_inventory.unregistered.length, 7);
  const check = cli(work, 'check'); assert.ok(check.rolling_review.stale > 0);
  assert.equal(after.snapshot.ledger?.O_LABEL, undefined); assert.ok(after.snapshot.ledger.O_KEY);
  const stateBeforeBadRetry = stateHash(work); cli(work, 'rewind', ['--from', '2', '--expected-revision', String(before.revision)], 2); assert.equal(stateHash(work), stateBeforeBadRetry);
});
assert.deepEqual(inventory(original), protectedBefore, 'Primary work must remain untouched.');
const result = { ok: cases.every(row => row.ok), scope: 'isolated-copies-mechanical-guards', original_units: initial.units.length, original_revision: initial.revision, original_unchanged: true, cases, cli_count: calls.length };
write(path.join(destination, 'result.json'), result); console.log(JSON.stringify(result, null, 2)); process.exitCode = result.ok ? 0 : 1;
