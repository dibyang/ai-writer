import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const campaign = path.dirname(fileURLToPath(import.meta.url)), root = path.resolve(campaign, '../..');
const phase = path.join(campaign, 'continuity-fix');
if (JSON.parse(fs.readFileSync(path.join(phase, 'process-result.json'))).exit_code !== 0) throw new Error('Wait for native session completion');
const source = path.resolve(root, 'continuity-fix'), target = path.resolve(phase, 'artifacts');
if (fs.realpathSync(source) !== source || !source.startsWith(root + path.sep) || !target.startsWith(root + path.sep) || fs.existsSync(target)) throw new Error('Unexpected archive paths');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
function inventory(directory, relative = '') {
  return fs.readdirSync(path.join(directory, relative), { withFileTypes: true }).flatMap(entry => {
    if (entry.isSymbolicLink()) throw new Error('Unexpected symlink');
    const file = path.join(relative, entry.name);
    return entry.isDirectory() ? inventory(directory, file) : [{ file, sha256: hash(path.join(directory, file)) }];
  });
}
const before = inventory(source);
fs.renameSync(source, target);
const unchanged = before.every(row => hash(path.join(target, row.file)) === row.sha256);
fs.writeFileSync(path.join(phase, 'relocation.json'), JSON.stringify({ source, target, unchanged, reason: 'The relative evidence directory in the native request was interpreted from repository cwd; archive all bytes under the campaign after session completion. Original logs and their historical paths remain unchanged.', files: before }, null, 2), { flag: 'wx' });
console.log(JSON.stringify({ source, target, unchanged, files: before.length }));
if (!unchanged) process.exitCode = 1;
