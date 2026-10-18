import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
const name = process.argv[2] ?? 'cli-matrix'; if (!/^[a-z0-9-]+$/.test(name)) throw Error('unique matrix name');
const root = process.cwd(), base = path.resolve('acceptance/20261018-governance-a'), dir = path.join(base, name);
if (fs.existsSync(dir)) throw Error('Preserve previous matrix; never overwrite'); fs.mkdirSync(dir);
const sha = b => crypto.createHash('sha256').update(b).digest('hex'), cli = path.join(root, 'bin/ai-writer.mjs');
const calls = [];
function put(file, value) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, typeof value === 'string' || Buffer.isBuffer(value) ? value : JSON.stringify(value, null, 2) + '\n', { flag: 'wx' }); }
function bytes(file) { return fs.existsSync(file) ? fs.readFileSync(file) : null; }
function run(label, args, work, expected = 0, script = cli) {
  const output = path.join(dir, 'commands', label); fs.mkdirSync(output, { recursive: true });
  const before = work ? bytes(path.join(work, '.writer/state.json')) : null, start = Date.now();
  const r = spawnSync(process.execPath, [script, ...args], { windowsHide: true, maxBuffer: 20 * 1024 * 1024 });
  const after = work ? bytes(path.join(work, '.writer/state.json')) : null;
  put(path.join(output, 'stdout.raw.txt'), r.stdout ?? Buffer.alloc(0)); put(path.join(output, 'stderr.raw.txt'), r.stderr ?? Buffer.alloc(0));
  if (before) put(path.join(output, 'before-state.json'), before); if (after) put(path.join(output, 'after-state.json'), after);
  const result = { script, args, started_at: new Date(start).toISOString(), elapsed_ms: Date.now() - start, exit_code: r.status, expected_exit: expected, error: r.error?.message,
    before_state_sha256: before && sha(before), after_state_sha256: after && sha(after) };
  put(path.join(output, 'result.json'), result); calls.push(result); assert.equal(r.status, expected, `${label}: ${r.stderr}`);
  return JSON.parse((r.status === 2 ? r.stderr : r.stdout).toString('utf8'));
}
function input(label, object) { const file = path.join(dir, 'inputs', label + '.json'); put(file, object); return file; }
function evidence(work) { const file = path.join(work, '研究/接口夹具要求.md'); const body = '这是自动接口验收夹具，不是真实作者会话。允许在独立作品试写第1章并暂停复盘；允许显式治理迁移。'; if (!fs.existsSync(file)) put(file, body); return { quote: body, local_source: '研究/接口夹具要求.md', source_sha256: sha(fs.readFileSync(file)), locator: '自动测试夹具完整第1行', recorded_by: 'cli-matrix synthetic fixture' }; }
const reports = [];
for (const kind of ['novel', 'screenplay', 'essay', 'history']) {
  const work = path.join(dir, kind), init = run(`${kind}-init`, ['init', '--path', work, '--kind', kind, '--title', `接口测试-${kind}`], work);
  assert.equal(init.schema_version, 3);
  const w = run(`${kind}-workflow-read`, ['workflow', 'show', '--project', work], work), a = evidence(work);
  w.workflow.stage = 'trial'; w.workflow.task = '仅试写第1章，结束后复盘'; w.workflow.authorization = { allowed_actions: ['discuss', 'plan', 'draft'], draft_range: { from: 1, to: 1 }, revise_range: null, stop_conditions: ['第一单元完成后暂停'] };
  run(`${kind}-authorize`, ['workflow', 'set', '--project', work, '--input', input(`${kind}-workflow`, { expected_revision: w.revision, operation_id: `${kind}-trial`, author_evidence: a, workflow: w.workflow })], work);
  const plan = { unit: 1, title: '接口夹具', goal: '验证文体边界', change: '完成一次登记', beats: ['读取测试材料'], research_refs: [] };
  if (kind === 'history') {
    const ref = '研究/合成事实卡.json'; put(path.join(work, ref), { status: 'verified', claims: [{ type: 'direct', statement: '仅用于接口结构的合成测试材料，不是史实', boundary: '不能用于真实历史创作', source_dependency: '单一合成夹具', sources: [{ title: '接口夹具', locator: '本测试代码', excerpt: 'synthetic fixture', checked_at: '2026-10-18' }] }] }); plan.research_refs = [ref];
  }
  run(`${kind}-plan`, ['plan', '--project', work, '--input', input(`${kind}-plan`, plan)], work);
  const packet = run(`${kind}-context`, ['context', '--project', work, '--unit', '1'], work);
  const tx = run(`${kind}-template`, ['record-template', '--project', work, '--unit', '1', '--draft', '正文/0001-接口夹具.md'], work);
  assert.deepEqual(tx.source_hashes, packet.source_hashes); assert.ok(tx.changes); assert.equal(tx.snapshot, undefined);
  put(path.join(work, tx.draft), '# 接口夹具\n\n本段仅用于程序验证，不能当作真实历史或文学验收。\n'); tx.summary = '完成一次独立夹具登记';
  run(`${kind}-record`, ['record', '--project', work, '--input', input(`${kind}-record`, tx)], work);
  const status = run(`${kind}-status`, ['status', '--project', work], work); assert.equal(status.next_unit, 2); assert.match(status.next.action, /复盘/);
  assert.equal(run(`${kind}-scope-denied`, ['context', '--project', work, '--unit', '2'], work, 2).code, 'ACTION_OUT_OF_SCOPE');
  const old = path.join(root, 'tests/fixtures/tool-0.3/bin/ai-writer.mjs'); run(`${kind}-old-parser-rejects`, ['status', '--project', work], work, 2, old);
  const check = run(`${kind}-check`, ['check', '--project', work], work); assert.equal(check.ok, true);
  const exp = path.join(dir, `${kind}-export`); run(`${kind}-export`, ['export', '--project', work, '--out', exp], work);
  reports.push({ kind, schema: 3, units: 1, source_hashes_verified: true, old_parser_rejected: true, export_sha256: sha(fs.readFileSync(path.join(exp, 'manuscript.md'))) });
}
// Two complete comparable 0.3 fixtures, one deliberate module delta; no actual book is read or changed.
for (const name of ['legacy-a', 'legacy-b']) {
  const work = path.join(dir, name); fs.mkdirSync(path.join(work, '.writer'), { recursive: true }); put(path.join(work, 'writer.json'), { schema_version: 1, title: name, kind: 'novel', language: 'zh-CN' });
  fs.cpSync(path.join(root, 'tests/fixtures/tool-0.3'), path.join(work, '.writer/tool'), { recursive: true });
  fs.cpSync(path.join(root, 'docs'), path.join(work, 'docs'), { recursive: true }); fs.cpSync(path.join(root, '.agents/skills'), path.join(work, '.agents/skills'), { recursive: true }); fs.copyFileSync(path.join(root, 'LICENSE.md'), path.join(work, 'LICENSE.md'));
}
fs.appendFileSync(path.join(dir, 'legacy-b/.writer/tool/lib/help.mjs'), '\n// Deliberate isolated legacy build difference for T24.\n');
const comparison = run('same-version-different-content', ['tool', 'compare', '--project', path.join(dir, 'legacy-a'), '--other', path.join(dir, 'legacy-b')]);
assert.equal(comparison.same_version, true); assert.equal(comparison.same_content, false); assert.equal(comparison.left.ok, true); assert.equal(comparison.right.ok, true); assert.equal(comparison.left.tool_version, '0.3.0'); assert.deepEqual(comparison.differences.map(x => x.file), ['lib/help.mjs']);
const summary = { ok: true, scope: 'real CLI and synthetic fixtures, not literary or historical validation', calls: calls.length, genres: reports, same_version_fixture: { version: '0.3.0', differences: comparison.differences },
  state_preserving_reads_and_rejects: calls.filter(x => /read|context|template|status|denied|rejects|check/.test(x.args.join(' ')) && x.before_state_sha256 === x.after_state_sha256).length };
put(path.join(dir, 'summary.json'), summary); console.log(JSON.stringify(summary));
