import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url)), root = path.resolve(dir, '../..');
const label = process.argv[2] ?? 'final';
if (!/^[a-z0-9-]+$/.test(label)) throw Error('Invalid candidate label');
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const baseline = read(path.join(dir, 'source-baseline.json'));
const documentation = new Set(['docs/long-form.md', 'docs/user-guide.md', 'docs/quickstart.md', 'docs/verification.md']);
const files = baseline.files.map(row => ({ file: row.file, sha256: hash(path.join(root, row.file)) }));
const changes = files.filter((row, i) => row.sha256 !== baseline.files[i].sha256).map(row => ({ ...row, before_sha256: baseline.files.find(x => x.file === row.file).sha256 }));
if (changes.some(row => !documentation.has(row.file))) throw Error('Runtime/skill/source change requires a new native final-version validation');
const commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
if (commit !== baseline.commit) throw Error('Unexpected commit change');
const stateFile = path.join(dir, 'works/潮汐信号/.writer/state.json');
const finalCheckpointState = path.join(dir, 'checkpoints/repair-final/files/.writer/state.json');
if (hash(stateFile) !== hash(finalCheckpointState)) throw Error('Work changed after repair-final artifact audit');
fs.writeFileSync(path.join(dir, `candidate-${label}.json`), JSON.stringify({ commit, created_at: new Date().toISOString(), files }, null, 2) + '\n', { flag: 'wx' });
const proof = { ok: true, documentation_only_changes: changes, unchanged_product_files: files.length - changes.length,
  native_runtime_and_skills_unchanged: true, work_state_sha256: hash(stateFile),
  note: 'Native sessions ran the final runtime and skills. These documentation clarifications were added after the run; the frozen final candidate is used for final regression.' };
fs.writeFileSync(path.join(dir, label === 'final' ? 'final-version-proof.json' : `final-version-proof-${label}.json`), JSON.stringify(proof, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify(proof));
