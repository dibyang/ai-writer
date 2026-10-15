import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const campaign = path.dirname(fileURLToPath(import.meta.url)), work = path.join(campaign, 'works/雨线档案');
const label = process.argv[2];
if (!/^[a-z][a-z0-9-]*$/.test(label ?? '')) throw new Error('Provide a new checkpoint label.');
const target = path.join(campaign, 'checkpoints', label);
if (fs.existsSync(target)) throw new Error('Checkpoint already exists; preserve original evidence.');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const stateFile = path.join(work, '.writer/state.json'), state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
const refs = new Set(['writer.json', '.writer/state.json', ...state.units.map(row => row.draft), ...state.units.flatMap(row => Object.keys(row.source_hashes)), ...state.units.map(row => row.journal).filter(Boolean)]);
const records = [];
for (const ref of refs) {
  const file = path.join(work, ref), out = path.join(target, 'files', ref), relative = path.relative(work, file);
  if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('Invalid source path.');
  fs.mkdirSync(path.dirname(out), { recursive: true }); fs.copyFileSync(file, out, fs.constants.COPYFILE_EXCL);
  records.push({ file: ref, sha256: hash(out) });
}
const value = { label, revision: state.revision, units: state.units.length, files: records };
fs.writeFileSync(path.join(target, 'manifest.json'), JSON.stringify(value, null, 2) + '\n', { flag: 'wx', encoding: 'utf8' });
console.log(JSON.stringify({ label, revision: state.revision, units: state.units.length, files: records.length }));
