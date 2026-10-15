import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { applyDelta } from '../../lib/journal.mjs';
const campaign = path.dirname(fileURLToPath(import.meta.url)), root = path.resolve(campaign, '../..');
const work = path.join(campaign, 'works/雨线档案'), reportPath = path.join(campaign, 'verification-final.json');
if (fs.existsSync(reportPath)) throw new Error('Preserve previous verification.');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const text = file => fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
const checks = [], cli = [], phases = [], exports = [], drafts = [], timeline = [];
const check = (ok, name, detail) => checks.push({ name, ok: Boolean(ok), ...(detail === undefined ? {} : { detail }) });
function run(command, args = []) {
  const argv = [path.join(work, '.writer/tool/bin/ai-writer.mjs'), command, '--project', work, ...args];
  const result = spawnSync(process.execPath, argv, { cwd: root, encoding: 'utf8', timeout: 30000 });
  cli.push({ argv, exit_code: result.status, stdout: result.stdout, stderr: result.stderr });
  check(result.status === 0, `CLI ${command}`, result.stderr);
  return JSON.parse(result.stdout || result.stderr);
}
const current = read(path.join(work, '.writer/state.json'));
check(current.units.length === 12 && current.schema_version === 2, 'Twelve units in long-form state');
const expectedCounts = { 'session-a': 4, 'session-b': 8, revision: 8, 'session-c': 12, 'continuity-fix': 12 };
for (const [phase, count] of Object.entries(expectedCounts)) {
  const processResult = read(path.join(campaign, phase, 'process-result.json'));
  const eventsPath = path.join(campaign, phase, 'events.jsonl');
  const events = text(eventsPath).trim().split(/\r?\n/).map(JSON.parse);
  const thread = events.find(e => e.type === 'thread.started')?.thread_id;
  check(Boolean(thread) && events.some(e => e.type === 'turn.completed'), `Codex ${phase} native session evidence`);
  phases.push({ phase, thread_id: thread, events_sha256: hash(eventsPath), exit_code: processResult.exit_code, elapsed_s: processResult.elapsed_s, command_events: processResult.commands });
  check(processResult.exit_code === 0, `Codex ${phase} completed`);
  const directory = path.join(campaign, phase, ...(phase === 'continuity-fix' ? ['artifacts'] : []), 'export'), manifest = read(path.join(directory, 'manifest.json'));
  check(manifest.units.length === count && manifest.included_units.length === count, `${phase} export range`);
  if (phase === 'continuity-fix') check(manifest.revision === current.revision, 'Corrected native export uses the final state revision');
  check(!manifest.excluded_drafts.length && !manifest.warnings.length, `${phase} export excludes nothing`);
  check(hash(path.join(directory, 'manuscript.md')) === manifest.sha256, `${phase} export hash`);
  exports.push({ phase, count, revision: manifest.revision, sha256: manifest.sha256 });
}
check(new Set(phases.map(p => p.thread_id)).size === 5, 'Five distinct fresh Codex sessions');
const b = read(path.join(campaign, 'checkpoints/b/files/.writer/state.json'));
const revised = read(path.join(campaign, 'checkpoints/revision/files/.writer/state.json'));
const beforeFix = read(path.join(campaign, 'checkpoints/c/files/.writer/state.json'));
check(JSON.stringify(b.units[0]) === JSON.stringify(revised.units[0]) && JSON.stringify(b.units[0]) === JSON.stringify(current.units[0]), 'First chapter registration unchanged across revision');
check(revised.units.every((u, i) => isDeepStrictEqual(u, current.units[i])), 'Final continuation preserves all eight revised registrations');
check(b.snapshot.ledger.O_LABEL.statement.includes('七号柜'), 'Old observation recorded original label');
check(revised.snapshot.ledger.O_LABEL.statement.includes('九号柜') && current.snapshot.ledger.O_LABEL.statement.includes('九号柜'), 'Revised and final observation use new label');
check(b.snapshot.ledger.O_KEY.statement === current.snapshot.ledger.O_KEY.statement, 'Unchanged key observation survives');
check(b.snapshot.ledger.T_COPY.due_unit === 6 && revised.snapshot.ledger.T_COPY.due_unit === 6, 'Deadline was not postponed during revision');
check(['pending', 'partial'].includes(b.snapshot.ledger.T_COPY.status) && ['pending', 'partial'].includes(revised.snapshot.ledger.T_COPY.status), 'Unfulfilled setup remains open through eight chapters');
check(current.snapshot.ledger.T_COPY.status === 'resolved', 'Main setup resolved only in final volume');
check(b.snapshot.ledger.T_MISSED.status === 'intentional-open' && current.snapshot.ledger.T_MISSED.status === 'intentional-open', 'Intentional private uncertainty remains explicitly open');
check(beforeFix.snapshot.ledger.T_MISSED.evidence.every(old => current.snapshot.ledger.T_MISSED.evidence.some(now => isDeepStrictEqual(old, now))), 'Unchanged private-thread evidence survives corrective re-registration');
check(!JSON.stringify(current.snapshot).includes('七号柜'), 'Current tracking does not revive obsolete label');
check(current.units[1].sha256 !== b.units[1].sha256, 'Chapter two really changed');
let sourceCount = 0, evidenceCount = 0;
let replay = structuredClone(current.baseline);
for (const unit of current.units) {
  const file = path.join(work, unit.draft), body = text(file), han = (body.replace(/^#.*\n/, '').match(/\p{Script=Han}/gu) ?? []).length;
  check(hash(file) === unit.sha256, `Registered manuscript ${unit.unit}`);
  check(han >= 450 && han <= 700, `Chapter ${unit.unit} requested compact length`, han);
  check(!body.includes('七号柜'), `Chapter ${unit.unit} has no obsolete label`);
  for (const [ref, expected] of Object.entries(unit.source_hashes)) {
    if (ref === '.writer/state.json') continue;
    sourceCount++; check(hash(path.join(work, ref)) === expected, `Consumed source ${unit.unit}:${ref}`);
  }
  drafts.push({ unit: unit.unit, draft: unit.draft, sha256: unit.sha256, han });
  replay = applyDelta(replay, read(path.join(work, unit.journal)).patch);
  const ledger = replay.ledger ?? {};
  timeline.push({ unit: unit.unit, key_holder: ledger.P_KEY?.custody?.holder, envelope_holder: ledger.P_ENVELOPE?.custody?.holder,
    lu_knows_label: ledger.O_LABEL?.character_known?.['陆衡'] ?? null, xu_knows_label: ledger.O_LABEL?.character_known?.['许澄'] ?? null,
    copy_status: ledger.T_COPY?.status, copy_due: ledger.T_COPY?.due_unit });
}
check(isDeepStrictEqual(replay, current.snapshot), 'Replay reproduces current tracking snapshot');
check(timeline.slice(0, 8).every(row => row.copy_status !== 'resolved') && timeline.slice(8).some(row => row.copy_status === 'resolved'), 'Main setup not prematurely resolved in earlier volumes');
check(timeline[5].copy_due === 6 && timeline[7].copy_due === 6, 'Overdue item remains due instead of postponing its deadline');
check(timeline[0].key_holder === '林岚' && timeline[5].key_holder === '林岚' && timeline[6].key_holder === '陆衡' && timeline[7].key_holder === '陆衡', 'Key custody follows real early handoffs');
check(timeline[3].envelope_holder === '陆衡' && timeline[4].envelope_holder === '许澄' && timeline[7].envelope_holder === '许澄', 'Envelope custody follows real early handoffs');
for (const [id, entry] of Object.entries(current.snapshot.ledger)) for (const anchor of entry.evidence) {
  evidenceCount++; const unit = current.units[anchor.unit - 1], body = text(path.join(work, anchor.draft)), at = body.indexOf(anchor.quote);
  check(unit?.draft === anchor.draft && unit?.sha256 === anchor.sha256 && at >= 0 && body.slice(0, at).split(/\r?\n/).length === anchor.line, `Evidence ${id}:${anchor.unit}:${anchor.line}`);
}
const status = run('status'), checked = run('check'); run('doctor');
check(!status.stale_units.length && !status.changed_sources.length && !status.draft_inventory.unregistered.length, 'Current work clean and fully registered');
check(!checked.rolling_review.pending_windows.length && checked.rolling_review.valid >= 1, 'Rolling reviews cover current twelve chapters');
check(checked.rolling_review.stale >= 1, 'Historical stale review retained rather than silently reused');
check(checked.rolling_review.stale_with_current_coverage === checked.rolling_review.stale && checked.rolling_review.stale_without_current_coverage === 0, 'Current full reread covers historical stale ranges without revalidating old reports');
for (const [unit, volume] of [[4, 'V1'], [5, 'V2'], [8, 'V2'], [9, 'V3'], [12, 'V3']]) check(run('outline', ['--unit', String(unit)]).volume.id === volume, `Volume boundary at ${unit}`);
run('recall', ['--query', 'T_COPY']);
const result = run('export', ['--out', path.join(campaign, 'final-export')]);
check(result.sha256 === exports.find(row => row.phase === 'continuity-fix').sha256 && result.units.length === 12, 'Final embedded tool reproduces corrected final export');
const candidate = read(path.join(campaign, 'candidate-final.json'));
for (const row of candidate.files) check(hash(path.join(root, row.file)) === row.sha256, `Final candidate ${row.file}`);
for (const ref of ['bin/ai-writer.mjs', 'lib/workspace.mjs', 'lib/longform.mjs', 'lib/journal.mjs', 'lib/help.mjs', 'lib/style.mjs', 'package.json']) check(hash(path.join(root, ref)) === hash(path.join(work, '.writer/tool', ref)), `Embedded parity ${ref}`);
const guards = read(path.join(campaign, 'guard-probes/result.json')); check(guards.ok && guards.original_unchanged, 'Isolated guard probes pass without changing primary work');
const rewindReview = read(path.join(campaign, 'parent-audit/rewind-review-status.json'));
const rewindStatus = JSON.parse(rewindReview.stdout);
check(rewindReview.exit_code === 0 && rewindStatus.revision === 24 && rewindStatus.rolling_review.stale_with_current_coverage === 4 && rewindStatus.rolling_review.stale_without_current_coverage === 3, 'Final tool distinguishes restored and not-yet-restored coverage during real rewind');
const archive = read(path.join(campaign, 'continuity-fix/relocation.json'));
check(archive.unchanged && archive.files.every(row => hash(path.join(campaign, 'continuity-fix/artifacts', row.file)) === row.sha256), 'Native fix evidence archived without byte changes');
const reading = read(path.join(campaign, 'parent-audit/final-reading-hashes.json'));
check(reading.reading_sha256 === hash(path.join(campaign, 'parent-audit/final-reading.md')) && reading.files.length === 12 && reading.files.every(row => hash(path.join(work, row.file)) === row.sha256), 'Parent full reading remains bound to all twelve delivered chapters');
const payload = { ok: checks.every(row => row.ok), scope: 'mechanical-artifact-verification-not-literary-acceptance', failures: checks.filter(row => !row.ok), check_count: checks.length, source_count: sourceCount, evidence_count: evidenceCount, revision: current.revision, phases, drafts, exports, timeline, rolling_review: checked.rolling_review, cli, checks };
fs.writeFileSync(reportPath, JSON.stringify(payload, null, 2) + '\n', { flag: 'wx', encoding: 'utf8' });
console.log(JSON.stringify({ ok: payload.ok, failures: payload.failures, checks: checks.length, sources: sourceCount, evidence: evidenceCount, revision: current.revision, phases, drafts, rolling_review: checked.rolling_review }, null, 2));
process.exitCode = payload.ok ? 0 : 1;
