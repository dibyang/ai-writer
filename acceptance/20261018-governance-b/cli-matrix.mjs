import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const base = path.dirname(fileURLToPath(import.meta.url)), phase = process.argv[2];
if (!/^[a-z][a-z0-9-]*$/.test(phase ?? '')) throw Error('unique phase label required');
const dest = path.join(base, phase); fs.mkdirSync(dest, { recursive: true }); if (fs.existsSync(path.join(dest, 'summary.json'))) throw Error('Do not overwrite');
const sha = b => crypto.createHash('sha256').update(b).digest('hex'), rows = []; let seq = 0;
function write(file, value) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, typeof value === 'string' || Buffer.isBuffer(value) ? value : JSON.stringify(value, null, 2) + '\n'); return file; }
const current = root => JSON.parse(fs.readFileSync(path.join(root, '.writer/state.json')));
function invoke(root, command, { action, input, flags = [], code = 0, env = {} } = {}) {
  const label = `${phase}-${++seq}-${command.replaceAll(/[^a-z0-9-]/g, '-')}`, args = [path.join(base, 'capture.mjs'), label, process.execPath, 'bin/ai-writer.mjs', command, ...(action ? [action] : []), '--project', root];
  if (input) args.push('--input', write(path.join(dest, 'inputs', `${label}.json`), input)); args.push(...flags);
  const r = spawnSync(process.execPath, args, { encoding: 'utf8', env: { ...process.env, ...env }, windowsHide: true, timeout: 120000 });
  const meta = JSON.parse(fs.readFileSync(path.join(base, 'commands', label, 'result.json'))); assert.equal(meta.exit_code, code, `${label}: ${fs.readFileSync(path.join(base, 'commands', label, 'stderr.raw.txt'), 'utf8')}`);
  const stdout = fs.readFileSync(path.join(base, 'commands', label, 'stdout.raw.txt'), 'utf8'), stderr = fs.readFileSync(path.join(base, 'commands', label, 'stderr.raw.txt'), 'utf8');
  const result = (code === 0 || code === 1) && stdout.trim() ? JSON.parse(stdout) : stderr.trim() ? JSON.parse(stderr) : null;
  rows.push({ label, command, action, exit_code: meta.exit_code, expected_exit_code: code, result_code: result?.code ?? null, injected_fault: env }); return result;
}
function evidence(root) { const ref = '研究/验证授权.md'; return { local_source: ref, source_sha256: sha(fs.readFileSync(path.join(root, ref))), quote: '允许本独立合成夹具的版本、修订及明确中断恢复。', locator: 'synthetic-fixture-only', recorded_by: 'CLI-matrix' }; }
function setup(name, kind = 'novel') {
  const root = path.join(dest, name, 'work'), label = `${phase}-${++seq}-init`;
  const r = spawnSync(process.execPath, [path.join(base, 'capture.mjs'), label, process.execPath, 'bin/ai-writer.mjs', 'init', '--path', root, '--kind', kind, '--title', `机械夹具-${name}`], { encoding: 'utf8', timeout: 120000 }); assert.equal(r.status, 0, r.stderr); rows.push({ label, command: 'init', exit_code: 0, expected_exit_code: 0 });
  write(path.join(root, '研究/验证授权.md'), '允许本独立合成夹具的版本、修订及明确中断恢复。\n不是实际作品或文学验收。\n');
  workflow(root, false); for (let n = 1; n <= 2; n++) recordUnit(root, n, '', kind); return root;
}
function workflow(root, revise) {
  const w = invoke(root, 'workflow', { action: 'show' }).workflow; w.stage = revise ? 'revision' : 'trial'; w.task = '合成CLI流程夹具'; w.authorization = { allowed_actions: ['discuss', 'plan', revise ? 'revise' : 'draft'], draft_range: revise ? null : { from: 1, to: 3 }, revise_range: revise ? { from: 1, to: 2 } : null, stop_conditions: ['到范围停止'] };
  return invoke(root, 'workflow', { action: 'set', input: { expected_revision: current(root).revision, operation_id: `workflow-${seq}`, author_evidence: evidence(root), workflow: w } });
}
function recordUnit(root, n, token, kind = 'novel', suffix = '') {
  const flags = token ? ['--revision-token', token] : [], draft = `正文/000${n}.md`, research = [];
  if (kind === 'history') { const ref = '研究/合成事实.json'; write(path.join(root, ref), { status: 'verified', claims: [{ type: 'direct', statement: '纯合成', boundary: '不是史实', source_dependency: 'synthetic', sources: [{ title: '合成', locator: '1', excerpt: '合成', checked_at: '2026-10-18' }] }] }); research.push(ref); }
  invoke(root, 'plan', { flags, input: { unit: n, title: `合成${n}`, goal: '验证接口', change: '推进', beats: ['核验'], cast: [], setting_refs: [], research_refs: research } });
  const input = invoke(root, 'record-template', { flags: ['--unit', String(n), '--draft', draft] }); write(path.join(root, draft), `# 合成${n}\n\n这是机械接口夹具。${suffix}\n`); input.summary = `合成登记${n}${suffix}`; input.changes.timeline_append = [`合成${n}`]; invoke(root, 'record', { flags, input });
}
function branch(root, parallel = false) { return invoke(root, 'revision', { action: 'begin', input: { expected_revision: current(root).revision, owner: 'CLI-matrix', from: 1, through: 2, parallel_candidate: parallel } }); }
function edit(b, suffix) {
  invoke(b.workspace, 'rewind', { flags: ['--from', '1', '--expected-revision', String(current(b.workspace).revision), '--revision-token', b.token] }); for (let n = 1; n <= 2; n++) recordUnit(b.workspace, n, b.token, 'novel', suffix);
  const report = '审查/合成复核.md'; write(path.join(b.workspace, report), '# 机械流程夹具\n仅核接口，非实际模型连读。\n'); invoke(b.workspace, 'review', { flags: ['--revision-token', b.token], input: { from: 1, to: 2, kind: 'model-self-review', report, source_hashes: Object.fromEntries(current(b.workspace).units.map(u => [u.draft, u.sha256])) } });
}
function prepare(root, b) { return invoke(root, 'revision', { action: 'prepare', input: { id: b.id, token: b.token } }); }
function commit(root, b, options = {}) { return invoke(root, 'revision', { action: 'commit', input: { id: b.id, token: b.token }, ...options }); }

// Four real product flows remain separately identified as mechanical, not literary writing.
for (const kind of ['novel', 'screenplay', 'history', 'essay']) {
  const root = setup(`kind-${kind}`, kind); assert.equal(invoke(root, 'check').ok, true); invoke(root, 'export', { flags: ['--out', path.join(dest, `export-${kind}`)] });
}
const outcomes = [];
for (const scenario of ['complete', 'rollback', 'external-conflict', 'finalize-complete']) {
  const root = setup(scenario); workflow(root, true); const before = fs.readFileSync(path.join(root, '.writer/state.json')), b = branch(root); edit(b, scenario); const prepared = prepare(root, b);
  const finalize = scenario === 'finalize-complete'; commit(root, b, { code: finalize ? 92 : 91, env: finalize ? { AI_WRITER_TEST_FAULT: '1', AI_WRITER_TEST_STOP_PHASE: 'session-finalized' } : { AI_WRITER_TEST_FAULT: '1', AI_WRITER_TEST_STOP_AFTER: '1' } });
  assert.equal(invoke(root, 'status', { code: 2 }).code, 'TRANSACTION_PENDING');
  const tx = invoke(root, 'revision', { action: 'list' }).transactions.find(x => x.status === 'applying'); assert.ok(tx);
  const direction = scenario === 'rollback' || scenario === 'external-conflict' ? 'rollback' : 'complete';
  const recover = { transaction_id: tx.id, token: b.token, direction, lock_sha256: sha(fs.readFileSync(path.join(root, '.writer/write.lock'))), author_evidence: evidence(root) };
  let external = null;
  if (scenario === 'external-conflict') {
    const victim = prepared.changes.find(x => x.file.startsWith('正文/')); external = { file: victim.file, old: fs.readFileSync(path.join(root, victim.file)) }; write(path.join(root, victim.file), '第三方字节，禁止覆盖。\n');
    assert.equal(invoke(root, 'revision', { action: 'recover', input: recover, code: 2 }).code, 'TRANSACTION_EXTERNAL_CONFLICT');
    assert.equal(fs.readFileSync(path.join(root, victim.file), 'utf8'), '第三方字节，禁止覆盖。\n');
    write(path.join(dest, scenario, 'external-original.txt'), '第三方字节，禁止覆盖。\n'); fs.writeFileSync(path.join(root, victim.file), external.old); delete recover.lock_sha256; delete recover.author_evidence;
  }
  const result = invoke(root, 'revision', { action: 'recover', input: recover });
  if (direction === 'rollback') assert.deepEqual(fs.readFileSync(path.join(root, '.writer/state.json')), before);
  else assert.equal(current(root).revision, JSON.parse(before).revision + 1);
  assert.equal(invoke(root, 'check').ok, true); outcomes.push({ scenario, result, scope: 'actual-process-fault-mechanical-fixture' });
}
const conflictRoot = setup('parallel'); workflow(conflictRoot, true); const a = branch(conflictRoot), b = branch(conflictRoot, true); edit(a, '甲'); edit(b, '乙'); prepare(conflictRoot, a); prepare(conflictRoot, b); commit(conflictRoot, a);
assert.equal(commit(conflictRoot, b, { code: 2 }).code, 'BASELINE_CONFLICT'); assert.match(fs.readFileSync(path.join(b.workspace, '正文/0001.md'), 'utf8'), /乙/);
write(path.join(dest, 'summary.json'), { ok: true, calls: rows.length, rows, outcomes, protocol: 4, caveat: 'Synthetic fixtures and declared review fields are not literary or historical acceptance' });
console.log(JSON.stringify({ ok: true, calls: rows.length, fault_scenarios: outcomes.length, parallel_conflict: true }));
