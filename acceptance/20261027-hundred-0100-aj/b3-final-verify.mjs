import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
const parent = path.dirname(fileURLToPath(import.meta.url));
const baseline = JSON.parse(fs.readFileSync(path.join(parent, 'b3-baseline.json')));
const { root, candidate, id } = baseline;
const sha = x => crypto.createHash('sha256').update(x).digest('hex');
const bytes = p => fs.readFileSync(p);
const json = p => JSON.parse(bytes(p));
const mainBytes = bytes(path.join(root, '.writer/state.json'));
const candidateBytes = bytes(path.join(candidate, '.writer/state.json'));
const main = JSON.parse(mainBytes), state = JSON.parse(candidateBytes);
assert.equal(sha(mainBytes), baseline.main.state_sha256);
assert.equal(main.revision, 459);
assert.equal(state.revision, 461);
assert.equal(state.units.length, 108);
const sessionPath = path.join(root, '.writer/revisions', id, 'session.json');
const session = json(sessionPath);
assert.deepEqual(session, baseline.session);
const baseBytes = bytes(path.join(root, '.writer/revisions', id, 'base.json'));
assert.equal(sha(baseBytes), baseline.session.base_sha256);
const sessionBase = JSON.parse(baseBytes);
const inputPath = path.join(candidate, '.writer/drafts/b3-replay108-reviewed.json');
const inputBytes = bytes(inputPath), input = JSON.parse(inputBytes);
const unit = state.units.find(u => u.unit === 108);
assert.equal(unit.sha256, input._replay.draft_sha256);
assert.deepEqual(unit.replay_review.checked_fields, ['summary', 'characters', 'timeline', 'ledger', 'evidence', 'downstream']);
assert.equal(unit.replay_review.base.session_id, id);
assert.equal(unit.replay_review.base.old_unit_sha256, input._replay.old_unit_sha256);
assert.equal(unit.replay_review.base.old_journal_sha256, input._replay.old_journal_sha256);
assert.equal(sha(bytes(path.join(candidate, unit.replay_review.frozen_ref))), unit.replay_review.report_sha256);
const reportBytes = bytes(path.join(candidate, input.replay_review.report));
assert.equal(sha(reportBytes), unit.replay_review.report_sha256);
assert.equal(sha(bytes(path.join(candidate, unit.journal))), unit.journal_sha256);
const changed = [], retainedTail = [];
for (const original of baseline.main.units) {
  const mainHash = sha(bytes(path.join(root, original.draft)));
  const currentHash = sha(bytes(path.join(candidate, original.draft)));
  assert.equal(mainHash, original.draft_sha256);
  if (original.unit === 108) { assert.equal(currentHash, unit.sha256); changed.push(original.unit); }
  else assert.equal(currentHash, original.draft_sha256);
  if (original.unit > 108) {
    assert(!state.units.some(u => u.unit === original.unit));
    retainedTail.push({ unit: original.unit, draft: original.draft, sha256: currentHash, registered: false });
  } else assert.equal(state.units.find(u => u.unit === original.unit).sha256, currentHash);
}
const commands = fs.readdirSync(path.join(parent, 'commands')).filter(label => label.startsWith('b3-')).sort().map(label => {
  const dir = path.join(parent, 'commands', label), r = json(path.join(dir, 'result.json'));
  const stderr = bytes(path.join(dir, 'stderr.raw.txt'));
  assert.equal(r.exit_code, 0); assert.equal(stderr.length, 0); assert.equal(r.runtime_files_stable, true);
  return { label, exit_code: r.exit_code, stderr_bytes: stderr.length, elapsed_ms: r.elapsed_ms, before_state_sha256: r.before_state_sha256, after_state_sha256: r.after_state_sha256, input_sha256: r.input?.sha256 ?? null };
});
const status = json(path.join(parent, 'commands/b3-status-checkpoint/stdout.raw.txt'));
const check = json(path.join(parent, 'commands/b3-check-checkpoint/stdout.raw.txt'));
assert.equal(status.next_unit, 109); assert.equal(status.drafts.unregistered_count, 4);
assert.equal(check.ok, true); assert.equal(check.scope, 'mechanical-only');
assert.deepEqual(check.findings.map(f => f.code), Array(4).fill('UNREGISTERED_DRAFT'));
const result = {
  ok: true, scope: 'synthetic-checkpoint-only', id, owner: session.owner,
  base_revision: 459, base_file_sha256: sha(baseBytes), base_keys: Object.keys(sessionBase), session_sha256: sha(bytes(sessionPath)), session_unchanged: true,
  main_revision: main.revision, main_state_sha256: sha(mainBytes), main_all_112_drafts_unchanged: true,
  candidate_revision: state.revision, candidate_state_sha256: sha(candidateBytes), registered_through: 108, next_unit: status.next_unit, changed_draft_units: changed,
  unit108: { draft: unit.draft, old_sha256: input._replay.old_unit_sha256, current_sha256: unit.sha256, input_sha256: sha(inputBytes), journal: unit.journal, journal_sha256: unit.journal_sha256, report: input.replay_review.report, report_sha256: sha(reportBytes), frozen_replay_review: unit.replay_review.frozen_ref, fingerprint: unit.fingerprint },
  retained_unregistered_tail: retainedTail, review_counts: status.review_counts, rolling_review: check.rolling_review,
  capture_results: commands, resume_input: 'revision-resume-input.json', workspace: candidate,
  not_performed: ['edit110', 'record109-112', 'prepare', 'commit', 'new113-or-later', 'push', 'publish'],
  note: 'Hashes and record checks establish this checkpoint only; semantic findings are in the authored report.'
};
fs.writeFileSync(path.join(parent, 'b3-final-verification.json'), JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify(result, null, 2));
