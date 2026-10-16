// This checks recorded reading hashes only; it cannot prove a model understood prose.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const label = process.argv[2];
if (!/^[a-z][a-z0-9-]*$/.test(label ?? '')) throw Error('reading-coverage <checkpoint label>');
const state = JSON.parse(fs.readFileSync(path.join(dir, 'checkpoints', label, 'files/.writer/state.json')));
const rows = fs.readFileSync(path.join(dir, 'parent-reading.jsonl'), 'utf8').trim().split(/\r?\n/).map(JSON.parse);
const units = state.units.map(u => ({ unit: u.unit, draft: u.draft, sha256: u.sha256, matching_reading_records: rows.flatMap((r, i) => (r.unit ?? r.chapter) === u.unit && r.sha256 === u.sha256 ? [i + 1] : []) }));
const missing = units.filter(u => !u.matching_reading_records.length);
const result = { ok: !missing.length, scope: 'reading-log-version-coverage-only-not-literary-proof', checkpoint: label, revision: state.revision, units, missing };
fs.mkdirSync(path.join(dir, 'reading-coverage'), { recursive: true });
fs.writeFileSync(path.join(dir, 'reading-coverage', `${label}.json`), JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ ok: result.ok, units: units.length, missing }));
process.exitCode = result.ok ? 0 : 1;
