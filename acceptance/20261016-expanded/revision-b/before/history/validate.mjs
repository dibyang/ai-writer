import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const directory = path.dirname(fileURLToPath(import.meta.url)), root = path.resolve(directory, '../..');
const label = process.argv[2] ?? 'final';
if (!/^[a-z0-9-]+$/.test(label)) throw new Error('Invalid label');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const commands = [];
for (const [name, command] of [['tests', 'npm test'], ['doctor', 'npm run doctor'], ['engine', 'npm run test:engine']]) {
  const file = path.join(directory, `${name}-${label}.txt`);
  if (fs.existsSync(file)) throw new Error(`Preserve existing log: ${file}`);
  const started = Date.now();
  const run = spawnSync('cmd.exe', ['/d', '/s', '/c', command], { cwd: root, encoding: 'utf8', timeout: 180000, windowsHide: true, maxBuffer: 4 * 1024 * 1024 });
  fs.writeFileSync(file, run.stdout + run.stderr, { flag: 'wx', encoding: 'utf8' });
  const row = { command, exit_code: run.status, elapsed_ms: Date.now() - started, file: path.relative(root, file), sha256: hash(file), error: run.error?.message };
  commands.push(row); console.log(JSON.stringify(row));
}
const candidateName = process.argv[3] ?? 'candidate-before.json';
if (!/^candidate-[a-z0-9-]+\.json$/.test(candidateName)) throw new Error('Invalid candidate manifest name');
const candidate = JSON.parse(fs.readFileSync(path.join(directory, candidateName), 'utf8'));
const changed = candidate.files.filter(row => hash(path.join(root, row.file)) !== row.sha256);
const result = { version: JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).version, node: process.version, platform: process.platform, commands, changed_since_candidate: changed, candidate_manifest: candidateName, candidate_manifest_sha256: hash(path.join(directory, candidateName)) };
fs.writeFileSync(path.join(directory, `validation-${label}.json`), JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
process.exitCode = commands.some(row => row.exit_code !== 0) || changed.length ? 1 : 0;
