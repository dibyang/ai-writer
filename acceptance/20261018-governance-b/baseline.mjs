import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const base = path.dirname(fileURLToPath(import.meta.url)), root = 'D:/work/小说/dzkxqxx';
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const files = []; function walk(dir, ref = '') { for (const name of fs.readdirSync(dir).sort()) { const file = path.join(dir, name), next = ref ? `${ref}/${name}` : name, stat = fs.lstatSync(file); if (stat.isSymbolicLink()) throw Error(`No symlinks: ${next}`); if (stat.isDirectory()) walk(file, next); else if (stat.isFile()) files.push({ file: next, bytes: stat.size, sha256: sha(fs.readFileSync(file)) }); } }
walk(root);
const mode = process.argv[2] ?? 'before', out = path.join(base, `protected-${mode}.json`);
fs.writeFileSync(out, JSON.stringify({ root, files }, null, 2) + '\n', { flag: 'wx' });
if (mode === 'before') {
  fs.writeFileSync(path.join(base, 'environment.json'), JSON.stringify({ client_date: '2026-10-18', timezone: 'Asia/Shanghai', platform: process.platform, node: process.version, head: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), initial_status: execFileSync('git', ['status', '--short'], { encoding: 'utf8' }) }, null, 2) + '\n', { flag: 'wx' });
  const oldFiles = ['package.json', 'bin/ai-writer.mjs', ...['workspace', 'journal', 'longform', 'help', 'style', 'governance', 'tool-build'].map(x => `lib/${x}.mjs`)];
  const manifest = [];
  for (const ref of oldFiles) { const bytes = execFileSync('git', ['show', `HEAD:${ref}`]); const target = path.join(base, 'fixtures/tool-0.4', ref); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, bytes, { flag: 'wx' }); manifest.push({ file: ref, sha256: sha(bytes) }); }
  fs.writeFileSync(path.join(base, 'fixtures/tool-0.4/source-manifest.json'), JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx' });
}
console.log(JSON.stringify({ mode, protected_files: files.length, out }));
