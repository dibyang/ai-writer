import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const phase = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(phase, '../../..');
const mode = process.argv[2];
if (!['before', 'after'].includes(mode)) throw new Error('before or after required');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const files = {};
function visit(file) {
  if (!fs.existsSync(file) || path.resolve(file) === path.resolve(phase)) return;
  const info = fs.lstatSync(file);
  if (info.isSymbolicLink()) { files[path.relative(repo, file).replaceAll('\\', '/')] = { symlink: fs.readlinkSync(file) }; return; }
  if (info.isDirectory()) { for (const name of fs.readdirSync(file).sort()) visit(path.join(file, name)); }
  else files[path.relative(repo, file).replaceAll('\\', '/')] = { bytes: info.size, sha256: hash(file) };
}
for (const item of ['bin', 'lib', 'tests', '.agents', 'docs', 'works', 'package.json', 'package-lock.json', 'acceptance/20261019-webnovel-reference-j']) visit(path.join(repo, item));
const result = { at: new Date().toISOString(), scope: 'Existing J acceptance tree excluding method-smoke; repository bin/lib/tests/.agents/docs/works/package files', file_count: Object.keys(files).length, files };
fs.writeFileSync(path.join(phase, `boundary-${mode}.json`), JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
if (mode === 'after') {
  const baseline = JSON.parse(fs.readFileSync(path.join(phase, 'boundary-before.json'), 'utf8'));
  const keys = new Set([...Object.keys(files), ...Object.keys(baseline.files)]);
  const changes = [...keys].filter(key => JSON.stringify(files[key]) !== JSON.stringify(baseline.files[key]));
  fs.writeFileSync(path.join(phase, 'boundary-comparison.json'), JSON.stringify({ compared_files: keys.size, changes, unchanged: changes.length === 0 }, null, 2) + '\n', { flag: 'wx' });
  process.stdout.write(JSON.stringify({ compared_files: keys.size, changes, unchanged: changes.length === 0 }) + '\n');
  process.exitCode = changes.length ? 1 : 0;
} else process.stdout.write(JSON.stringify({ file_count: result.file_count }) + '\n');
