import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const summary = read(path.join(dir, 'campaign-summary-final.json'));
const validation = read(path.join(dir, 'validation-verified.json'));
if (!summary.ok || validation.commands.some(x => x.exit_code !== 0) || validation.changed_since_candidate.length) throw Error('Complete campaign and final regression first');
const finalState = path.join(dir, 'works/潮汐信号/.writer/state.json');
if (hash(finalState) !== summary.phases.at(-1).state_sha256) throw Error('Final state changed after native audit');
for (const row of summary.phases) {
  const source = path.join(dir, row.phase, 'stderr.log'), target = path.join(dir, row.phase, 'stderr.raw.txt');
  if (fs.existsSync(target)) throw Error(`Preserve existing raw stderr copy: ${target}`);
  fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL);
  if (hash(source) !== hash(target)) throw Error('Raw stderr copy differs');
}
const files = [];
function walk(directory) {
  for (const item of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const file = path.join(directory, item.name);
    if (item.isSymbolicLink()) throw Error(`Unexpected symlink in evidence: ${file}`);
    if (item.isDirectory()) walk(file);
    else if (item.isFile()) files.push({ file: path.relative(dir, file).replaceAll('\\', '/'), bytes: fs.statSync(file).size, sha256: hash(file) });
  }
}
const output = path.join(dir, 'evidence-manifest.json');
if (fs.existsSync(output)) throw Error('Evidence already sealed; do not overwrite history');
walk(dir);
const manifest = { created_at: new Date().toISOString(), scope: 'All current campaign files except this manifest itself; no claim of missing historical raw bytes being recovered',
  stderr_note: 'stderr.raw.txt is byte-identical to stderr.log, retained under a non-ignored extension for later explicit local staging',
  files, file_count: files.length, total_bytes: files.reduce((n, x) => n + x.bytes, 0) };
fs.writeFileSync(output, JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ files: manifest.file_count, bytes: manifest.total_bytes, manifest_sha256: hash(output) }));
