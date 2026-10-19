import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const phase = path.dirname(fileURLToPath(import.meta.url));
const work = path.join(phase, 'work');
const mode = process.argv[2];
if (!['before', 'after'].includes(mode)) throw new Error('before or after required');
const files = {};
function visit(dir) {
  for (const name of fs.readdirSync(dir).sort()) {
    const file = path.join(dir, name);
    if (fs.statSync(file).isDirectory()) visit(file);
    else files[path.relative(work, file).replaceAll('\\', '/')] = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  }
}
visit(work);
fs.writeFileSync(path.join(phase, `denial-work-${mode}.json`), JSON.stringify(files, null, 2) + '\n', { flag: 'wx' });
if (mode === 'after') {
  const before = JSON.parse(fs.readFileSync(path.join(phase, 'denial-work-before.json'), 'utf8'));
  const keys = new Set([...Object.keys(before), ...Object.keys(files)]);
  const changes = [...keys].filter(key => before[key] !== files[key]);
  const result = { file_count: keys.size, changes, unchanged: changes.length === 0, state_sha256_before: before['.writer/state.json'], state_sha256_after: files['.writer/state.json'] };
  fs.writeFileSync(path.join(phase, 'denial-comparison.json'), JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
  process.exitCode = changes.length ? 1 : 0;
} else process.stdout.write(JSON.stringify({ file_count: Object.keys(files).length }) + '\n');
