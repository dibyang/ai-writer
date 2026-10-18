import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
const root = process.cwd(), base = path.resolve('acceptance/20261018-governance-a'), dir = path.join(base, 'migration-matrix');
if (fs.existsSync(dir)) throw Error('Preserve migration evidence'); fs.mkdirSync(dir);
const sha = b => crypto.createHash('sha256').update(b).digest('hex'), main = path.join(root, 'bin/ai-writer.mjs');
const host = path.join(dir, 'frozen-0.3-host'); fs.cpSync('tests/fixtures/tool-0.3', host, { recursive: true });
for (const ref of ['docs', '.agents/skills']) fs.cpSync(ref, path.join(host, ref), { recursive: true });
for (const ref of ['LICENSE.md', 'vendor/oh-story-reference/LICENSE', 'vendor/oh-story-reference-20261015/LICENSE', 'vendor/oh-story-deslop-reference/LICENSE', 'vendor/oh-story-deslop-reference/how-to-remove-ai-flavor-from-web-fiction.md']) { fs.mkdirSync(path.dirname(path.join(host, ref)), { recursive: true }); fs.copyFileSync(ref, path.join(host, ref)); }
const old = path.join(host, 'bin/ai-writer.mjs'), calls = [];
function put(file, data) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, typeof data === 'string' || Buffer.isBuffer(data) ? data : JSON.stringify(data, null, 2) + '\n', { flag: 'wx' }); }
function run(label, script, args, work, expected = 0) {
  const out = path.join(dir, 'commands', label); fs.mkdirSync(out, { recursive: true });
  const sf = path.join(work, '.writer/state.json'), before = fs.existsSync(sf) ? fs.readFileSync(sf) : null;
  const inputAt = args.indexOf('--input'); if (inputAt >= 0) put(path.join(out, 'input.json'), fs.readFileSync(args[inputAt + 1]));
  const started = Date.now(), r = spawnSync(process.execPath, [script, ...args], { maxBuffer: 10 * 1024 * 1024, windowsHide: true });
  const after = fs.existsSync(sf) ? fs.readFileSync(sf) : null;
  put(path.join(out, 'stdout.raw.txt'), r.stdout ?? Buffer.alloc(0)); put(path.join(out, 'stderr.raw.txt'), r.stderr ?? Buffer.alloc(0));
  if (before) put(path.join(out, 'before-state.json'), before); if (after) put(path.join(out, 'after-state.json'), after);
  const result = { script, args, started_at: new Date(started).toISOString(), elapsed_ms: Date.now() - started, exit_code: r.status, before_sha256: before && sha(before), after_sha256: after && sha(after) }; put(path.join(out, 'result.json'), result); calls.push(result);
  assert.equal(r.status, expected, `${label}: ${r.stderr}`); return JSON.parse((r.status === 2 ? r.stderr : r.stdout).toString());
}
const reports = [];
for (const schema of [1, 2]) {
  const work = path.join(dir, `schema-${schema}`), prefix = `s${schema}`, params = ['--project', work];
  run(prefix + '-old-init', old, ['init', '--path', work, '--kind', 'novel', '--title', `合成旧协议${schema}`], work);
  if (schema === 2) {
    run(prefix + '-old-long', old, ['long-enable', ...params, '--expected-revision', '0'], work);
    const vf = path.join(dir, prefix + '-volume.json'); put(vf, { id: 'V1', title: '收据', start: 1, end: 2, promises: [], constraints: [], reserved: [], arcs: [{ id: 'A1', start: 1, end: 2, goal: '核查', payoff: '核清', forbidden: [] }] });
    run(prefix + '-old-volume', old, ['volume', ...params, '--input', vf], work);
  }
  const pf = path.join(dir, prefix + '-plan1.json'); put(pf, { unit: 1, title: '收据', goal: '核查', change: '收好原件', beats: ['收起原件'] });
  run(prefix + '-old-plan', old, ['plan', ...params, '--input', pf], work);
  const tx = run(prefix + '-old-template', old, ['record-template', ...params, '--unit', '1', '--draft', '正文/0001.md'], work); put(path.join(work, tx.draft), '她把原件放回盒中。\n'); tx.summary = '原件入盒';
  if (schema === 1) tx.snapshot = { characters: { 阿禾: '保管原件' }, threads: ['待核'], timeline: ['原件入盒'] }; else tx.changes = { characters: { 阿禾: '保管原件' }, timeline_append: ['原件入盒'], ledger: {} };
  const rf = path.join(dir, prefix + '-record1.json'); put(rf, tx); run(prefix + '-old-record', old, ['record', ...params, '--input', rf], work);
  const before = JSON.parse(fs.readFileSync(path.join(work, '.writer/state.json'))), body = fs.readFileSync(path.join(work, tx.draft));
  run(prefix + '-preview', main, ['governance', 'preview', ...params], work);
  const quote = '合成迁移夹具：允许对本测试副本显式迁移，并仅续写第2章后暂停。'; const source = '研究/作者要求.md'; put(path.join(work, source), quote);
  const evidence = { quote, local_source: source, source_sha256: sha(Buffer.from(quote)), locator: '自动验收夹具第1行', recorded_by: 'migration-matrix' };
  const mf = path.join(dir, prefix + '-migration.json'); put(mf, { expected_revision: before.revision, operation_id: prefix + '-migrate', author_evidence: evidence });
  const migration = run(prefix + '-migrate', main, ['governance', 'migrate', ...params, '--input', mf], work);
  const after = JSON.parse(fs.readFileSync(path.join(work, '.writer/state.json')));
  assert.deepEqual(after.snapshot, before.snapshot); assert.equal(after.units[0].sha256, before.units[0].sha256); assert.deepEqual(after.units[0].source_hashes, before.units[0].source_hashes); assert.deepEqual(fs.readFileSync(path.join(work, tx.draft)), body);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(work, migration.backup))), before);
  run(prefix + '-old-rejected', old, ['status', ...params], work, 2); assert.equal(run(prefix + '-new-check', main, ['check', ...params], work).ok, true);
  const w = run(prefix + '-workflow', main, ['workflow', 'show', ...params], work); w.workflow.stage = 'trial'; w.workflow.task = '仅续写第2章'; w.workflow.authorization = { allowed_actions: ['discuss', 'plan', 'draft'], draft_range: { from: 2, to: 2 }, revise_range: null, stop_conditions: ['第2章后暂停'] };
  const wf = path.join(dir, prefix + '-workflow.json'); put(wf, { expected_revision: w.revision, operation_id: prefix + '-authorize', author_evidence: evidence, workflow: w.workflow }); run(prefix + '-authorize', main, ['workflow', 'set', ...params, '--input', wf], work);
  const p2 = path.join(dir, prefix + '-plan2.json'); put(p2, { unit: 2, title: '核对', goal: '核查', change: '留下待核记录', beats: ['记下待核项'] }); run(prefix + '-plan2', main, ['plan', ...params, '--input', p2], work);
  const t2 = run(prefix + '-template2', main, ['record-template', ...params, '--unit', '2', '--draft', '正文/0002.md'], work); put(path.join(work, t2.draft), '次日，她在盒旁留下待核清单。\n'); t2.summary = '保留待核清单'; t2.changes.timeline_append = ['次日留下清单'];
  const r2 = path.join(dir, prefix + '-record2.json'); put(r2, t2); run(prefix + '-record2', main, ['record', ...params, '--input', r2], work); assert.equal(run(prefix + '-final-check', main, ['check', ...params], work).units, 2);
  reports.push({ original_schema: schema, migrated_schema: 3, units_before: 1, units_after: 2, original_body_sha256: sha(body), first_unit_sources_preserved: true, facts_at_migration_preserved: true, old_tool_rejected: true, backup: migration.backup });
}
const result = { ok: true, calls: calls.length, scope: 'Actual frozen 0.3 CLI creates and records legacy fixtures, final A CLI migrates and continues; no actual user work changed', reports }; put(path.join(dir, 'summary.json'), result); console.log(JSON.stringify(result));
