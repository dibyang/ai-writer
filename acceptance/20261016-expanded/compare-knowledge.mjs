import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';
const dir = path.dirname(fileURLToPath(import.meta.url));
const [beforeLabel, afterLabel, prefixText] = process.argv.slice(2);
if (![beforeLabel, afterLabel].every(x => /^[a-z][a-z0-9-]*$/.test(x ?? ''))) throw Error('Use two frozen checkpoint labels');
const state = label => JSON.parse(fs.readFileSync(path.join(dir, 'checkpoints', label, 'files/.writer/state.json'), 'utf8'));
const beforeState = state(beforeLabel), afterState = state(afterLabel);
const before = beforeState.snapshot, after = afterState.snapshot, missing = [], requireReading = [], retained = [];
const prefixCount = prefixText === undefined ? beforeState.units.length : Number(prefixText);
if (!Number.isInteger(prefixCount) || prefixCount < 0 || prefixCount > beforeState.units.length) throw Error('Invalid expected unchanged prefix');
const prefixUnchanged = isDeepStrictEqual(beforeState.units.slice(0, prefixCount), afterState.units.slice(0, prefixCount));
function compare(field, old, current) {
  if (current === undefined) missing.push({ field, before: old });
  else if (JSON.stringify(old) === JSON.stringify(current)) retained.push({ field, method: 'identical' });
  else if (typeof old === 'string' && typeof current === 'string' && current.includes(old)) retained.push({ field, method: 'old-text-present-not-a-semantic-approval' });
  else requireReading.push({ field, before: old, after: current });
}
for (const [name, old] of Object.entries(before.characters ?? {})) compare(`characters.${name}`, old, after.characters?.[name]);
for (const [id, old] of Object.entries(before.ledger ?? {})) {
  for (const [name, value] of Object.entries(old.character_known ?? {})) compare(`ledger.${id}.character_known.${name}`, value, after.ledger?.[id]?.character_known?.[name]);
  if (old.reader_known !== undefined) compare(`ledger.${id}.reader_known`, old.reader_known, after.ledger?.[id]?.reader_known);
}
const report = { scope: 'Detect dropped fields and list rewritten knowledge for actual semantic reading; text inclusion alone cannot prove current knowledge or non-contradiction',
  before: beforeLabel, after: afterLabel, prefix_units_checked: prefixCount, prefix_registrations_unchanged: prefixUnchanged,
  missing, retained, rewritten_fields_requiring_reading: requireReading };
fs.writeFileSync(path.join(dir, 'revision-comparisons', `${beforeLabel}--${afterLabel}-knowledge.json`), JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ prefix_registrations_unchanged: prefixUnchanged, missing: missing.length, retained: retained.length, rewritten_fields: requireReading.map(x => x.field) }));
process.exitCode = missing.length || !prefixUnchanged ? 1 : 0;
