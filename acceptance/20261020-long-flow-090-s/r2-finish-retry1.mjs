import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {base, work, read, state, input, run, sha} from './common.mjs';

// Continue only the missing old-input/check tail; do not repeat committed wx phases.
const j = ref => JSON.parse(fs.readFileSync(path.join(base, ref)));
const committed = j('commands/r2-commit/stdout.raw.txt');
assert.equal(committed.status, 'completed');
assert.equal(state().revision, 34);
const before = read('.writer/state.json');
const originalRef = 'inputs/b-record-12-retry1.json';
const oldInput = input('r2-old-twelve-retry1', j(originalRef));
const refused = run('r2-old-twelve-refused-retry1', ['record', '--input', oldInput], 2);
assert.match(refused.error, /追踪修订号已变化/);
assert.deepEqual(read('.writer/state.json'), before);
const check = run('r2-final-check-retry1', ['check']);
const status = run('r2-final-status-retry1', ['status']);
const revisions = run('r2-final-revisions-retry1', ['revision', 'list']);
assert.equal(check.ok, true);
assert.equal(status.governance.stage, 'trial');
assert.equal(status.next_unit, 13);
assert.equal(status.draft_inventory.registered_count, 12);
assert.deepEqual(status.stale_units, []);
assert.deepEqual(status.changed_sources, []);
assert.deepEqual(status.impact_pending, []);
assert.equal(revisions.sessions.find(x => x.id === committed.session_id).status, 'committed');
assert.equal(revisions.transactions.find(x => x.id === committed.transaction_id).status, 'completed');
const initial = j('r2-client-before-assets.json');
const changedOldAssets = Object.entries(initial).filter(([ref, h]) => sha(read(ref)) !== h).map(([ref]) => ref);
assert.deepEqual(changedOldAssets, ['正文/0010.md']);
const operations = j('r2-edit-operations.json');
assert.equal(operations.length, 2);
const session = j('r2-session.json');
let text = fs.readFileSync(path.join(session.workspace, '留稿/S-R2-修前/0010.md'), 'utf8');
for (const op of operations) { assert.equal(op.unit, 10); assert.equal(text.split(op.before).length, 2); text = text.replace(op.before, op.after); }
assert.equal(text, read('正文/0010.md').toString('utf8'));
const verification = {
  ok: true, at: new Date().toISOString(), main: work,
  session_id: committed.session_id, transaction_id: committed.transaction_id,
  transaction_status: 'completed', commit_revision: committed.revision,
  main_revision: state().revision, registered: state().units.length, next_unit: status.next_unit,
  workflow: status.governance.stage, old_input_ref: originalRef,
  old_input_sha256: sha(fs.readFileSync(path.join(base, originalRef))),
  old_input_refused: refused.error, old_input_state_unchanged: true,
  check, changed_old_assets: changedOldAssets,
  body: state().units.map(u => ({unit: u.unit, ref: u.draft, sha256: sha(read(u.draft))})),
  segment_derivation: 'not performed; parent session follow-up',
  finish_failure: {phase: 'after commit and workflow restore, before old-input rejection', error: 'ENOENT inputs/record-12.json', correction: originalRef},
  note: 'Local work transaction committed. Mechanical/process checks are not literary acceptance.'
};
fs.writeFileSync(path.join(base, 'r2-final-verification-retry1.json'), JSON.stringify(verification, null, 2) + '\n', {flag: 'wx'});
console.log(JSON.stringify({ok: true, main_revision: verification.main_revision, registered: 12, next_unit: 13, transaction: committed.transaction_id, changed_old_assets: changedOldAssets, check: check.ok, old_input_refused: true}));
