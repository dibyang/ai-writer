import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
export const BASE = path.dirname(fileURLToPath(import.meta.url));
export const sha = b => crypto.createHash('sha256').update(b).digest('hex');
export const readState = root => JSON.parse(fs.readFileSync(path.join(root, '.writer/state.json')));
export function write(file, value) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, typeof value === 'string' || Buffer.isBuffer(value) ? value : JSON.stringify(value, null, 2) + '\n'); return file; }
export function runner(phase) {
  if (!/^[a-z][a-z0-9-]*$/.test(phase)) throw Error('Unique phase required');
  const dest = path.join(BASE, phase); if (fs.existsSync(dest)) throw Error('Do not overwrite phase'); fs.mkdirSync(dest, { recursive: true }); const rows = []; let sequence = 0;
  function run(root, args, input = null, expected = 0, env = {}) {
    const label = `${phase}-${++sequence}-${args[0]}`, argv = [path.join(BASE, 'capture.mjs'), label, process.execPath, 'bin/ai-writer.mjs', ...args];
    if (root) argv.push('--project', root); if (input) argv.push('--input', write(path.join(dest, 'inputs', `${label}.json`), input));
    const r = spawnSync(process.execPath, argv, { env: { ...process.env, ...env }, encoding: 'utf8', windowsHide: true, timeout: 120000 });
    const meta = JSON.parse(fs.readFileSync(path.join(BASE, 'commands', label, 'result.json'))), stderr = fs.readFileSync(path.join(BASE, 'commands', label, 'stderr.raw.txt'), 'utf8'), stdout = fs.readFileSync(path.join(BASE, 'commands', label, 'stdout.raw.txt'), 'utf8');
    assert.equal(meta.exit_code, expected, `${label}: ${stderr}\n${r.stderr}`); const value = stdout.trim() ? JSON.parse(stdout) : stderr.trim() ? JSON.parse(stderr) : null;
    rows.push({ label, args, root, expected_exit_code: expected, exit_code: meta.exit_code, elapsed_ms: meta.elapsed_ms, environment: env, code: value?.code ?? null }); return value;
  }
  function evidence(root) { const ref = '研究/验证授权.md'; return { local_source: ref, source_sha256: sha(fs.readFileSync(path.join(root, ref))), quote: '允许独立验证副本的版本、修订、收纳已有修改和明确恢复。', locator: 'synthetic-mechanical-fixture', recorded_by: phase }; }
  function authorFile(root) { write(path.join(root, '研究/验证授权.md'), '允许独立验证副本的版本、修订、收纳已有修改和明确恢复。\n这不是实际作品的作者决定，不计文学验收。\n'); }
  function workflow(root, revise, from = 1, through = 2, draftRange = null) {
    const w = run(root, ['workflow', 'show']).workflow; w.stage = revise ? 'revision' : 'trial'; w.task = '独立机械验证';
    w.authorization = { allowed_actions: ['discuss', 'plan', ...(revise ? ['revise'] : ['draft']), ...(draftRange && revise ? ['draft'] : [])], draft_range: revise ? draftRange : { from, to: through }, revise_range: revise ? { from, to: through } : null, stop_conditions: ['范围末尾停止'] };
    if (draftRange && revise) w.stage = 'drafting';
    return run(root, ['workflow', 'set'], { expected_revision: readState(root).revision, operation_id: `${phase}-workflow-${sequence}`, author_evidence: evidence(root), workflow: w });
  }
  function unit(root, n, token = null, suffix = '') {
    const flags = token ? ['--revision-token', token] : [], draft = `正文/000${n}.md`;
    run(root, ['plan', ...flags], { unit: n, title: `合成${n}`, goal: '校验接口', change: '推进行动', beats: ['核验'], cast: [], setting_refs: [], research_refs: [] });
    const input = run(root, ['record-template', '--unit', String(n), '--draft', draft]); write(path.join(root, draft), `# 合成${n}\n\n机械夹具，非文学创作。${suffix}\n`); input.summary = `机械${n}${suffix}`; input.changes.timeline_append = [`机械${n}`]; run(root, ['record', ...flags], input);
  }
  function setup(root) { run(null, ['init', '--path', root, '--kind', 'novel', '--title', '机械断点验证']); authorFile(root); workflow(root, false); unit(root, 1); unit(root, 2); workflow(root, true); }
  function begin(root, from = 1, through = 2, extra = {}) { return run(root, ['revision', 'begin'], { expected_revision: readState(root).revision, owner: phase, from, through, ...extra }); }
  function review(b, from = 1, through = 2) {
    const report = `审查/${phase}-mechanical.md`; write(path.join(b.workspace, report), '# 合成流程字段\n本报告只测试流程和绑定，不冒充模型实读。\n');
    return run(b.workspace, ['review', '--revision-token', b.token], { from, to: through, kind: 'model-self-review', report, source_hashes: Object.fromEntries(readState(b.workspace).units.filter(u => u.unit >= from && u.unit <= through).map(u => [u.draft, u.sha256])) });
  }
  function edit(b, suffix) { run(b.workspace, ['rewind', '--from', '1', '--expected-revision', String(readState(b.workspace).revision), '--revision-token', b.token]); unit(b.workspace, 1, b.token, suffix); unit(b.workspace, 2, b.token, suffix); review(b); }
  function prepare(root, b) { return run(root, ['revision', 'prepare'], { id: b.id, token: b.token }); }
  function commit(root, b, expected = 0, env = {}) { return run(root, ['revision', 'commit'], { id: b.id, token: b.token }, expected, env); }
  function summary(extra) { const value = { ok: true, calls: rows.length, rows, ...extra }; write(path.join(dest, 'summary.json'), value); return value; }
  return { dest, rows, run, evidence, authorFile, workflow, unit, setup, begin, edit, review, prepare, commit, summary };
}
