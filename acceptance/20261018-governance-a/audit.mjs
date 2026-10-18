import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { identifyBuild, compareBuilds } from '../../lib/tool-build.mjs';
const base = path.resolve('acceptance/20261018-governance-a'), book = path.join(base, 'works/纸灯札记');
const mode = process.argv[2], sha = b => crypto.createHash('sha256').update(b).digest('hex');
const load = file => JSON.parse(fs.readFileSync(path.join(base, file)));
function inventory(root) {
  const rows = [];
  function walk(ref = '') { for (const name of fs.readdirSync(path.join(root, ref)).sort()) { const next = ref ? `${ref}/${name}` : name, file = path.join(root, next), stat = fs.lstatSync(file); assert.equal(stat.isSymbolicLink(), false, next); if (stat.isDirectory()) walk(next); else if (stat.isFile()) rows.push({ file: next, bytes: stat.size, sha256: sha(fs.readFileSync(file)) }); } }
  walk(); return rows;
}
function put(file, value) { fs.writeFileSync(path.join(base, file), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' }); }
if (mode === 'before-recover') {
  assert.equal(load('native-create/process-result.json').exit_code, 0); const files = inventory(book); put('book-before-recover.json', { root: book, files }); console.log(JSON.stringify({ ok: true, mode, files: files.length }));
} else if (mode === 'final') {
  const source = load('sources/final-delivery/source-manifest.json'), testedSource = load('sources/candidate-delivery/source-manifest.json');
  for (const row of source.files) assert.equal(sha(fs.readFileSync(row.file)), row.sha256, row.file);
  const testedMap = new Map(testedSource.files.map(x => [x.file, x.sha256]));
  for (const row of source.files) assert.equal(row.sha256, testedMap.get(row.file), 'Final handoff must match the tested source exactly');
  const npm = fs.readFileSync(path.join(base, 'commands/delivery-regression/stdout.raw.txt'), 'utf8'); assert.match(npm, /ℹ tests 81/); assert.match(npm, /ℹ pass 81/); assert.match(npm, /ℹ fail 0/); assert.match(npm, /ℹ skipped 0/);
  assert.equal(load('commands/delivery-regression/result.json').exit_code, 0); assert.equal(load('commands/delivery-doctor/result.json').exit_code, 0); assert.equal(load('commands/delivery-smoke/result.json').exit_code, 0);
  const doctorText = fs.readFileSync(path.join(base, 'commands/delivery-doctor/stdout.raw.txt'), 'utf8'), doctor = JSON.parse(doctorText.slice(doctorText.indexOf('{'))); assert.equal(doctor.ok, true);
  const phases = ['native-create', 'native-recover', 'native-final-check', 'native-reserved-check', 'native-delivery-check'].map(phase => {
    const process = load(`${phase}/process-result.json`); assert.equal(process.exit_code, 0);
    const events = fs.readFileSync(path.join(base, phase, 'events.jsonl'), 'utf8').trim().split('\n').map(x => JSON.parse(x));
    const thread = events.find(x => x.type === 'thread.started')?.thread_id; assert.ok(thread);
    return { phase, thread_id: thread, process, command_events: events.filter(x => x.type === 'item.completed' && x.item?.type === 'command_execution').length,
      command_failures: events.filter(x => x.type === 'item.completed' && x.item?.type === 'command_execution' && x.item.exit_code !== 0).map(x => ({ command: x.item.command, exit_code: x.item.exit_code })),
      failed_file_changes: events.filter(x => x.type === 'item.completed' && x.item?.type === 'file_change' && x.item.status === 'failed').length };
  }); assert.equal(new Set(phases.map(x => x.thread_id)).size, 5);
  const previous = load('book-before-recover.json'); assert.deepEqual(inventory(book), previous.files, 'six-chapter work must be read-only throughout recovery');
  const state = JSON.parse(fs.readFileSync(path.join(book, '.writer/state.json'))); assert.equal(state.schema_version, 3); assert.equal(state.units.length, 6); assert.equal(state.governance.stage, 'structure');
  assert.deepEqual(state.governance.authorization.allowed_actions, ['discuss', 'plan']); assert.equal(state.governance.authorization.draft_range, null); assert.equal(state.governance.authorization.revise_range, null);
  const chapters = state.units.map(row => { const bytes = fs.readFileSync(path.join(book, row.draft)); assert.equal(sha(bytes), row.sha256); const han = (bytes.toString('utf8').replace(/^# .*\r?\n/, '').match(/\p{Script=Han}/gu) ?? []).length; assert.ok(han >= 400 && han <= 700); return { unit: row.unit, draft: row.draft, han, sha256: row.sha256 }; });
  const confirmed = Object.values(state.decisions).filter(x => x.status === 'confirmed'), candidates = Object.values(state.decisions).filter(x => x.status === 'candidate');
  assert.equal(confirmed.length, 2); assert.equal(candidates.length, 1); assert.ok(confirmed.some(x => x.adopted_items.some(s => s.includes('青岚宗')))); assert.ok(confirmed.some(x => x.adopted_items.some(s => s.includes('炼器')))); assert.ok(candidates.some(x => !x.adopted_items.length));
  assert.equal(fs.existsSync(path.join(book, '大纲/单元/0007.json')), false); assert.equal(state.units.some(x => x.unit === 7), false);
  const priorMini = path.join(base, 'native-recover/最终微型作品'), priorState = JSON.parse(fs.readFileSync(path.join(priorMini, '.writer/state.json'))); assert.equal(priorState.units.length, 1); assert.equal(priorState.governance.stage, 'paused');
  const thirdMini = path.join(base, 'native-final-check/最终回归微型作品'), thirdState = JSON.parse(fs.readFileSync(path.join(thirdMini, '.writer/state.json')));
  const mini = path.join(base, 'primary-delivery-r2/交付确认作品'), ms = JSON.parse(fs.readFileSync(path.join(mini, '.writer/state.json'))); assert.equal(ms.units.length, 1); assert.equal(ms.governance.stage, 'paused'); assert.deepEqual(ms.governance.authorization.allowed_actions, []); assert.equal(ms.governance.planning.structure.status, 'deferred');
  const mainBuild = identifyBuild(process.cwd()), miniBuild = identifyBuild(mini); assert.equal(mainBuild.observed_content_id, miniBuild.observed_content_id); assert.equal(miniBuild.ok, true); assert.equal(mainBuild.observed_content_id, doctor.build.observed_content_id);
  const miniBody = fs.readFileSync(path.join(mini, ms.units[0].draft)); assert.equal(sha(miniBody), ms.units[0].sha256); const miniHan = (miniBody.toString('utf8').replace(/^# .*\r?\n/, '').match(/\p{Script=Han}/gu) ?? []).length; assert.ok(miniHan >= 300 && miniHan <= 450);
  assert.equal(ms.units[0].sha256, thirdState.units[0].sha256, 'Final delivery replays the original chapter without new literary writing');
  const primary = load('primary-delivery-r2/summary.json'); assert.equal(primary.ok, true); assert.equal(primary.calls, 24); assert.equal(primary.build.content, mainBuild.observed_content_id); assert.equal(primary.rejected_requests_state_unchanged, true);
  const product = [];
  for (const label of fs.readdirSync(path.join(base, 'commands')).sort()) {
    const folder = path.join(base, 'commands', label); if (!fs.existsSync(path.join(folder, 'result.json'))) continue;
    const meta = JSON.parse(fs.readFileSync(path.join(folder, 'result.json')));
    if (!/^(native-(one|two|three|four|five)-|primary-delivery-r2-)/.test(label) || !meta.argv?.some(x => /bin[\\/]ai-writer\.mjs$/.test(x))) continue;
    const stdout = fs.readFileSync(path.join(folder, 'stdout.raw.txt')), stderr = fs.readFileSync(path.join(folder, 'stderr.raw.txt'));
    let code = null, error = null; if (meta.exit_code === 2) { error = JSON.parse(stderr.toString()); code = error.code; }
    const row = { label, exit_code: meta.exit_code, code, next_action: error?.next_action ?? null, stdout_sha256: sha(stdout), stderr_sha256: sha(stderr), argv: meta.argv };
    const at = meta.argv.indexOf('--input'); if (at >= 0) { const file = path.resolve(meta.argv[at + 1]); assert.ok(file.startsWith(base + path.sep)); row.input_file = path.relative(base, file);
      if (meta.input?.sha256) { row.input_sha256 = sha(fs.readFileSync(path.join(folder, 'input.raw.json'))); assert.equal(row.input_sha256, meta.input.sha256); row.input_binding = 'captured raw bytes'; }
      else { row.input_sha256 = sha(fs.readFileSync(file)); row.input_binding = 'retained step-specific input (early wrapper)'; }
    }
    if (/^(native-(three|four|five)-|primary-delivery-r2-)/.test(label) && code === 'ACTION_OUT_OF_SCOPE' && error.scope.authorization.allowed_actions.length === 0) { assert.match(error.next_action, /暂停/); assert.doesNotMatch(error.next_action, /继续讨论|继续.*规划/); }
    product.push(row);
  }
  assert.ok(product.filter(x => x.label.startsWith('native-one-') && x.code === 'ACTION_OUT_OF_SCOPE').length >= 3);
  assert.ok(product.filter(x => x.label.startsWith('native-two-') && x.code === 'ACTION_OUT_OF_SCOPE').length >= 4);
  assert.ok(product.filter(x => x.label.startsWith('native-three-') && x.code === 'ACTION_OUT_OF_SCOPE').length >= 3);
  assert.ok(product.filter(x => x.label.startsWith('native-four-') && x.code === 'INVALID_INPUT').length >= 6);
  assert.ok(product.filter(x => x.label.startsWith('native-five-') && x.exit_code === 1).length >= 1);
  const protectedBefore = load('protected-before.json'), protectedAfter = load('protected-after.json'), protectedDiff = load('protected-differences.json');
  const content = value => value.files.filter(x => !x.file.startsWith('.git/')); assert.deepEqual(content(protectedAfter), content(protectedBefore));
  assert.equal(protectedDiff.changed.length, 0); assert.equal(protectedDiff.added.length, 1); assert.equal(protectedDiff.removed.length, 1);
  for (const row of [...protectedDiff.added, ...protectedDiff.removed]) assert.ok(row.file.startsWith('.git/refs/codex/turn-diffs/checkpoints/'));
  assert.equal(protectedDiff.added[0].sha256, protectedDiff.removed[0].sha256);
  const matrix = load('cli-matrix-delivery/summary.json'), migrations = load('migration-matrix-delivery/summary.json'); assert.equal(matrix.ok, true); assert.equal(matrix.calls, 49); assert.equal(migrations.ok, true); assert.equal(migrations.calls, 38);
  const head = spawnSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }); assert.equal(head.stdout.trim(), '36bd9c27797a43dd958e74b4e4b8f5b9713e140a');
  const stage = spawnSync('git', ['diff', '--cached', '--quiet']); assert.equal(stage.status, 0);
  const result = { ok: true, scope: 'Minimal A candidate; mechanical regressions, five native Codex model workflows and final primary Codex CLI replay; not human acceptance', version: '0.4.0', source_candidate: 'candidate-delivery / identical final-delivery; final runtime v9 plus legacy0.2 module-profile correction and developer-script adaptation', source_files: source.files.length,
    build: { observed_content_id: mainBuild.observed_content_id, runtime_id: mainBuild.runtime_id, profile: mainBuild.profile }, regressions: { tests: 81, pass: 81, fail: 0, skipped: 0 }, doctor_ok: true, smoke_ok: true,
    native: phases, chapters, total_han: chapters.reduce((n, x) => n + x.han, 0), previous_mini: { units: 1, build: identifyBuild(priorMini).observed_content_id, preservation: 'kept as the candidate-v6 observation; not upgraded' }, mini: { units: 1, han: miniHan, final_build_matches_main: true, paused_all: true, deferred_preserved: true },
    recovery_book_files_unchanged: previous.files.length, protected_project_content_files_unchanged: content(protectedBefore).length, protected_project_path_and_bytes_unchanged: protectedDiff.unchanged_files,
    protected_codex_checkpoint_path_change: protectedDiff, cli_matrix_calls: matrix.calls, migration_matrix_calls: migrations.calls, primary_delivery: primary,
    native_product_calls: product.filter(x => x.label.startsWith('native-')).length, product_calls: product, retained_testbook_build_difference: compareBuilds(book, process.cwd()).differences,
    limitations: ['B/C/D features not implemented', 'No automatic natural-language authorization inference or author identity authentication', 'No source version publishing, long revision session, transaction update, or tool safe update', 'Five native sessions span fixes; last legacy0.2 metadata/developer-script corrections are covered by final primary Codex 24-call full replay and final regression/matrices', 'Old test copies preserved; current main and final primary copy share final build', 'No engine change; engine tests not rerun', 'Actual work content unchanged; one Codex Git checkpoint ref changed path with identical bytes, attribution not inferred', 'No real old work migrated or updated; no commit or push'] };
  put('final-verification.json', result); console.log(JSON.stringify({ ok: result.ok, chapters: chapters.length, total_han: result.total_han, replay_han: miniHan, product_calls: product.length, protected_content_files: content(protectedBefore).length }));
} else throw Error('audit before-recover|final');
