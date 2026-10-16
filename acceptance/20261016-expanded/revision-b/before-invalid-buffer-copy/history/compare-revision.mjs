import fs from 'node:fs';
import path from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import { fileURLToPath } from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const [beforeLabel, afterLabel, allowedText = ''] = process.argv.slice(2);
if (![beforeLabel, afterLabel].every(x => /^[a-z][a-z0-9-]*$/.test(x ?? ''))) throw Error('compare-revision <before checkpoint> <after checkpoint> [allowed observation IDs comma-separated]');
const output = path.join(dir, 'revision-comparisons', `${beforeLabel}--${afterLabel}.json`);
if (fs.existsSync(output)) throw Error('Preserve prior comparison');
const checkpoint = label => path.join(dir, 'checkpoints', label, 'files');
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const before = read(path.join(checkpoint(beforeLabel), '.writer/state.json')), after = read(path.join(checkpoint(afterLabel), '.writer/state.json'));
const allowed = new Set(allowedText.split(',').filter(Boolean)), missing = [], rewrittenQuotes = [], unexpectedObservations = [], changedDeadlines = [], ledgerChanges = [];
for (const [id, old] of Object.entries(before.snapshot.ledger ?? {})) {
  const current = after.snapshot.ledger?.[id];
  if (!current) { missing.push({ id, reason: 'whole ledger entry missing' }); continue; }
  if (old.type === 'observation' && !allowed.has(id) && (!isDeepStrictEqual(old.statement, current.statement) || !isDeepStrictEqual(old.author_truth, current.author_truth))) unexpectedObservations.push(id);
  if (old.due_unit !== current.due_unit) changedDeadlines.push({ id, before: old.due_unit, after: current.due_unit });
  for (const anchor of old.evidence ?? []) {
    const unit = after.units[anchor.unit - 1];
    if (!unit) { missing.push({ id, unit: anchor.unit, reason: 'chapter no longer registered' }); continue; }
    const body = fs.readFileSync(path.join(checkpoint(afterLabel), unit.draft), 'utf8');
    if (!body.includes(anchor.quote)) { rewrittenQuotes.push({ id, unit: anchor.unit, quote: anchor.quote, reason: 'original quote changed: requires actual semantic review of replacement' }); continue; }
    if (!(current.evidence ?? []).some(e => e.unit === anchor.unit && e.quote === anchor.quote && e.sha256 === unit.sha256)) missing.push({ id, unit: anchor.unit, quote: anchor.quote, reason: 'unchanged quote dropped or not rebound to current chapter' });
  }
  const changes = [];
  for (const key of new Set([...Object.keys(old), ...Object.keys(current)])) {
    if (['evidence', 'updated_unit'].includes(key)) continue;
    if (!isDeepStrictEqual(old[key], current[key])) changes.push({ field: key, before: old[key], after: current[key] });
  }
  if (changes.length) ledgerChanges.push({ id, changes });
}
const changedChapters = before.units.filter((u, i) => u.sha256 !== after.units[i]?.sha256).map(u => ({ unit: u.unit, draft: u.draft, before: u.sha256, after: after.units[u.unit - 1]?.sha256 }));
const result = { ok: !missing.length && !unexpectedObservations.length && !changedDeadlines.length, scope: 'evidence-retention-and-diff-not-semantic-approval', before: beforeLabel, after: afterLabel, before_revision: before.revision, after_revision: after.revision, allowed_observations: [...allowed], missing, unexpected_observations: unexpectedObservations, changed_deadlines: changedDeadlines, changed_chapters: changedChapters, rewritten_quotes_requiring_review: rewrittenQuotes, ledger_changes_requiring_review: ledgerChanges };
fs.mkdirSync(path.dirname(output), { recursive: true }); fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ ok: result.ok, missing, unexpectedObservations, changedDeadlines, changed_chapters: changedChapters.map(x => x.unit), rewritten_quotes: rewrittenQuotes.length, changed_ledger_entries: ledgerChanges.length }));
process.exitCode = result.ok ? 0 : 1;
