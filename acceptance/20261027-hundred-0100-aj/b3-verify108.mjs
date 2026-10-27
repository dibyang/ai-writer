import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
const parent = path.dirname(fileURLToPath(import.meta.url));
const baseline = JSON.parse(fs.readFileSync(path.join(parent, 'b3-baseline.json')));
const { root, candidate } = baseline;
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const read = ref => fs.readFileSync(ref);
const state = JSON.parse(read(path.join(root, '.writer/state.json')));
const oldUnit = state.units.find(u => u.unit === 108);
const oldBytes = read(path.join(root, oldUnit.draft));
const newBytes = read(path.join(candidate, oldUnit.draft));
const oldText = oldBytes.toString('utf8'), newText = newBytes.toString('utf8');
const before = '沈重新梳好，小包里放手机和钥匙，走到门边又回头，取了几张纸巾。窄夹留在架上。';
const after = '沈重新梳好，将手机和钥匙放进小包，走到门边又回头，取了几张纸巾。窄夹留在架上。';
assert.equal(oldText.split(before).length, 2);
assert.equal(newText, oldText.replace(before, after));
assert.equal(sha(oldBytes), oldUnit.sha256);
const generated = JSON.parse(read(path.join(candidate, '.writer/drafts/b3-replay108-generated.json')));
const context = JSON.parse(read(path.join(parent, 'commands/b3-context-108-before-edit/stdout.raw.txt')));
assert.deepEqual(generated.source_hashes, context.source_hashes);
assert.equal(generated.expected_revision, 460);
assert.equal(generated._replay.draft_sha256, sha(newBytes));
assert.equal(generated.summary, oldUnit.summary);
const journalBytes = read(path.join(root, oldUnit.journal));
assert.equal(sha(journalBytes), oldUnit.journal_sha256);
const journal = JSON.parse(journalBytes);
const normalized = v => {
  if (Array.isArray(v)) return v.map(normalized);
  if (!v || typeof v !== 'object') return v;
  return Object.fromEntries(Object.entries(v).filter(([k]) => !['draft', 'sha256', 'line', 'introduced_unit', 'updated_unit'].includes(k)).map(([k, val]) => [k, normalized(val)]));
};
const originalChanges = { characters: {}, timeline_append: [], ledger: {} };
for (const p of journal.patch) {
  if (p.at[0] === 'characters') originalChanges.characters[p.at[1]] = p.after;
  if (p.at[0] === 'timeline') originalChanges.timeline_append = p.append;
  if (p.at[0] !== 'ledger') continue;
  const id = p.at[1];
  if (p.at.length === 2) { originalChanges.ledger[id] = normalized(p.after); continue; }
  if (p.at[2] === 'updated_unit') continue;
  let target = originalChanges.ledger[id] ??= {};
  for (const key of p.at.slice(2, -1)) target = target[key] ??= {};
  target[p.at.at(-1)] = normalized(p.append ?? p.after);
}
// A journal omits unchanged custody fields; replay deliberately emits full custody.
const rewoundState = JSON.parse(read(path.join(candidate, '.writer/state.json')));
for (const [id, entry] of Object.entries(originalChanges.ledger)) {
  if (entry.custody && !Object.hasOwn(entry.custody, 'holder')) {
    const retainedHolder = rewoundState.snapshot.ledger[id].custody.holder;
    assert.equal(retainedHolder, generated.changes.ledger[id].custody.holder);
    entry.custody.holder = retainedHolder;
  }
}
assert.deepEqual(generated.changes, originalChanges);
const quotes = [];
function collect(v) {
  if (!v || typeof v !== 'object') return;
  if (v.unit === 108 && typeof v.quote === 'string') quotes.push(v.quote);
  Object.values(v).forEach(collect);
}
collect(state);
const evidence = [...new Set(quotes)].map(quote => {
  assert(oldText.includes(quote)); assert(newText.includes(quote));
  const oldLine = oldText.slice(0, oldText.indexOf(quote)).split('\n').length;
  const newLine = newText.slice(0, newText.indexOf(quote)).split('\n').length;
  assert.equal(oldLine, newLine);
  return { quote, old_line: oldLine, new_line: newLine, unchanged: true };
});
const inventory = baseline.main.units.map(u => {
  const mainHash = sha(read(path.join(root, u.draft)));
  const candidateHash = sha(read(path.join(candidate, u.draft)));
  assert.equal(mainHash, u.draft_sha256);
  if (u.unit !== 108) assert.equal(candidateHash, u.draft_sha256);
  return { unit: u.unit, draft: u.draft, baseline_sha256: u.draft_sha256, main_sha256: mainHash, candidate_sha256: candidateHash, candidate_changed: candidateHash !== u.draft_sha256 };
});
assert.equal(sha(read(path.join(root, '.writer/state.json'))), baseline.main.state_sha256);
const result = { ok: true, kind: 'mechanical evidence only; semantic review is in the authored report', old_draft_sha256: sha(oldBytes), new_draft_sha256: sha(newBytes), before, after, changed_line: 15, exact_single_replacement: true, source_hashes_equal_to_pre_edit_context: true, original_summary_and_changes_equal: true, old_journal_sha256: sha(journalBytes), evidence, main_state_unchanged: true, main_all_112_drafts_unchanged: true, candidate_only_108_changed: true, inventory };
fs.writeFileSync(path.join(parent, 'b3-pre-record-audit.json'), JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ ...result, inventory: undefined }, null, 2));
