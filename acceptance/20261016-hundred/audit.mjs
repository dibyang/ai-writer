import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { isDeepStrictEqual } from 'node:util';
import { fileURLToPath } from 'node:url';
import { applyDelta } from '../../lib/journal.mjs';
const dir = path.dirname(fileURLToPath(import.meta.url)), root = path.resolve(dir, '../..');
const [label, countText, candidate = 'source-baseline.json', exportName = 'export'] = process.argv.slice(2), count = Number(countText);
if (!/^[a-z][a-z0-9-]*$/.test(label ?? '') || !Number.isInteger(count) || count < 1 || !/^[a-z][a-z0-9-]*$/.test(exportName)) throw Error('audit <phase> <expected units> [candidate manifest] [actual export subdirectory]');
const work = path.join(dir, 'works/潮汐信号'), out = path.join(dir, 'audits', `${label}.json`), checkpoint = path.join(dir, 'checkpoints', label);
if (fs.existsSync(out) || fs.existsSync(checkpoint)) throw Error('Preserve previous evidence, use a new label');
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const checks = [], commands = [], drafts = [], timeline = [], files = new Set(['writer.json', '.writer/state.json']);
const check = (ok, name, detail) => checks.push({ ok: Boolean(ok), name, ...(detail === undefined ? {} : { detail }) });
const stateFile = path.join(work, '.writer/state.json'), stateHash = hash(stateFile), state = read(stateFile);
const originState = read(path.join(root, 'acceptance/20261016-expanded/works/潮汐信号/.writer/state.json'));
check(isDeepStrictEqual(originState.units, state.units.slice(0, 24)), 'Original 24 chapter registrations preserved');
for (const [id, old] of Object.entries(originState.snapshot.ledger ?? {})) {
  const current = state.snapshot.ledger?.[id];
  check(Boolean(current), `Original ledger ID retained ${id}`);
  check(old.due_unit === current?.due_unit, `Original due retained ${id}`);
  if(old.type === 'observation') check(isDeepStrictEqual(old.statement,current?.statement) && isDeepStrictEqual(old.author_truth,current?.author_truth), `Original observation immutable ${id}`);
  for (const e of old.evidence ?? []) check((current?.evidence ?? []).some(n => isDeepStrictEqual(e,n)), `Original anchor retained ${id}:${e.unit}:${e.line}`);
}
function cli(command, args = []) {
  const argv = [path.join(work, '.writer/tool/bin/ai-writer.mjs'), command, '--project', work, ...args];
  const r = spawnSync(process.execPath, argv, { cwd: root, encoding: 'utf8', timeout: 30000 });
  commands.push({ argv, exit_code: r.status, stdout: r.stdout, stderr: r.stderr });
  check(r.status === 0, `CLI ${command}`);
  return JSON.parse(r.stdout || r.stderr);
}
check(state.schema_version === 2 && state.units.length === count, 'Expected registered long-form range');
let replay = structuredClone(state.baseline), evidenceCount = 0, sourceCount = 0;
for (const [index, unit] of state.units.entries()) {
  check(unit.unit === index + 1, `Sequential unit ${unit.unit}`);
  files.add(unit.draft); files.add(unit.journal);
  const file = path.join(work, unit.draft), body = fs.readFileSync(file, 'utf8'), han = (body.replace(/^#.*\r?\n/, '').match(/\p{Script=Han}/gu) ?? []).length;
  check(hash(file) === unit.sha256, `Body hash ${unit.unit}`);
  check(unit.unit <= 24 ? han >= 1500 && han <= 2000 : han >= 2400 && han <= 3200, `Chapter length ${unit.unit}`, han);
  drafts.push({ unit: unit.unit, draft: unit.draft, sha256: unit.sha256, han });
  for (const [ref, expected] of Object.entries(unit.source_hashes)) {
    if (ref === '.writer/state.json') continue;
    files.add(ref); sourceCount++; check(hash(path.join(work, ref)) === expected, `Source ${unit.unit}:${ref}`);
  }
  replay = applyDelta(replay, read(path.join(work, unit.journal)).patch);
  timeline.push({ unit: unit.unit, ledger: Object.fromEntries(Object.entries(replay.ledger ?? {}).map(([id, e]) => [id, { type: e.type, status: e.status, due_unit: e.due_unit, statement: e.statement, custody: e.custody, character_known: e.character_known }])) });
}
check(isDeepStrictEqual(replay, state.snapshot), 'Journal replay matches authority');
for (const [id, entry] of Object.entries(state.snapshot.ledger ?? {})) for (const anchor of entry.evidence ?? []) {
  evidenceCount++; const unit = state.units[anchor.unit - 1], body = fs.readFileSync(path.join(work, anchor.draft), 'utf8').replace(/^\uFEFF/, ''), at = body.indexOf(anchor.quote);
  check(unit?.draft === anchor.draft && unit?.sha256 === anchor.sha256 && at >= 0 && body.slice(0, at).split(/\r?\n/).length === anchor.line, `Evidence ${id}:${anchor.unit}:${anchor.line}`);
}
const status = cli('status'), checked = cli('check'); cli('doctor');
check(checked.ok && !(checked.findings ?? []).length, 'Mechanical manuscript checks have no findings');
check(!status.stale_units.length && !status.changed_sources.length && !status.draft_inventory.unregistered.length, 'No manuscript/source drift or unregistered draft');
check(!checked.rolling_review.pending_windows.length, 'Required rolling reading covered');
const exportDir = path.join(dir, label, exportName), manifest = read(path.join(exportDir, 'manifest.json'));
check(manifest.revision === state.revision && manifest.units.length === count && manifest.included_units.length === count, 'Native export binds current complete range');
check(isDeepStrictEqual(manifest.included_units, Array.from({ length: count }, (_, i) => i + 1)), 'Export includes each chapter exactly once in order');
check(!manifest.excluded_drafts.length && !manifest.warnings.length && hash(path.join(exportDir, 'manuscript.md')) === manifest.sha256, 'Export complete and hash bound');
const expectedManuscript = state.units.map(u => fs.readFileSync(path.join(work,u.draft),'utf8').replace(/^\uFEFF/,'').trim()).join('\n\n---\n\n')+'\n';
check(fs.readFileSync(path.join(exportDir,'manuscript.md'),'utf8') === expectedManuscript, 'Every exported chapter exactly matches source text with documented separators and edge trimming');
const processResult = read(path.join(dir, label, 'process-result.json'));
const events = fs.readFileSync(path.join(dir, label, 'events.jsonl'), 'utf8').trim().split(/\r?\n/).map(JSON.parse);
const thread = events.find(e => e.type === 'thread.started')?.thread_id;
check(processResult.exit_code === 0 && thread && events.some(e => e.type === 'turn.completed'), 'Native Codex session completed');
for (const row of read(path.join(dir, candidate)).files) check(hash(path.join(root, row.file)) === row.sha256, `Candidate ${row.file}`);
for (const ref of ['bin/ai-writer.mjs', 'lib/workspace.mjs', 'lib/longform.mjs', 'lib/journal.mjs', 'lib/help.mjs', 'lib/style.mjs', 'package.json']) check(hash(path.join(root, ref)) === hash(path.join(work, '.writer/tool', ref)), `Embedded tool parity ${ref}`);
const reviewsDir = path.join(work, '.writer/reviews');
if (fs.existsSync(reviewsDir)) for (const name of fs.readdirSync(reviewsDir).filter(x => x.endsWith('.json'))) {
  const ref = `.writer/reviews/${name}`; files.add(ref); files.add(read(path.join(work, ref)).report);
}
fs.mkdirSync(checkpoint, { recursive: true });
const captured = [];
for (const ref of [...files].sort()) {
  const target = path.join(checkpoint, 'files', ref); fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(path.join(work, ref), target); captured.push({ file: ref, sha256: hash(target) });
}
check(stateHash === hash(stateFile), 'Audit and snapshot do not modify authority');
fs.writeFileSync(path.join(checkpoint, 'manifest.json'), JSON.stringify({ revision: state.revision, units: count, files: captured }, null, 2));
const payload = { ok: checks.every(x => x.ok), scope: 'artifact-mechanics-not-literary-acceptance', label, export_directory: exportDir, thread_id: thread, revision: state.revision, units: count, han: drafts.reduce((n, x) => n + x.han, 0), source_count: sourceCount, evidence_count: evidenceCount, check_count: checks.length, failures: checks.filter(x => !x.ok), export_sha256: manifest.sha256, rolling_review: checked.rolling_review, drafts, timeline, commands, checks };
fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, JSON.stringify(payload, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ ok: payload.ok, failures: payload.failures, label, thread_id: thread, revision: state.revision, units: count, han: payload.han, checks: checks.length, evidence: evidenceCount, snapshot_files: captured.length, rolling_review: checked.rolling_review }));
process.exitCode = payload.ok ? 0 : 1;
