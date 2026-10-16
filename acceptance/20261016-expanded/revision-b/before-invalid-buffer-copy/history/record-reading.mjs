// Invoke only after actually reading the complete current chapter in the parent session.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const [phase, number, note] = process.argv.slice(2);
const unit = Number(number);
if (!phase || !Number.isInteger(unit) || !note) throw Error('record-reading <phase> <unit> <actual reading note>');
const work = path.join(dir, 'works/潮汐信号');
const state = JSON.parse(fs.readFileSync(path.join(work, '.writer/state.json')));
const row = state.units.find(u => u.unit === unit);
if (!row) throw Error('Chapter is not registered');
const file = path.join(work, row.draft), sha256 = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
if (sha256 !== row.sha256) throw Error('Unregistered chapter change; wait for final registration');
fs.appendFileSync(path.join(dir, 'parent-reading.jsonl'), JSON.stringify({ phase, unit, file, sha256, read_at: new Date().toISOString(), scope: 'complete current manuscript read by parent model', note }) + '\n');
console.log(JSON.stringify({ unit, sha256 }));
