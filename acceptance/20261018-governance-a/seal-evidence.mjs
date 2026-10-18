import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const base = path.dirname(fileURLToPath(import.meta.url)), file = path.join(base, 'evidence-manifest.json'), mode = process.argv[2];
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
function inventory() {
  const rows = [];
  function walk(ref = '') {
    for (const name of fs.readdirSync(path.join(base, ref)).sort()) {
      const next = ref ? `${ref}/${name}` : name; if (next === 'evidence-manifest.json') continue;
      const target = path.join(base, next), stat = fs.lstatSync(target);
      if (stat.isSymbolicLink()) throw Error(`Do not seal symlinks: ${next}`);
      if (stat.isDirectory()) walk(next); else if (stat.isFile()) rows.push({ file: next, bytes: stat.size, sha256: sha(fs.readFileSync(target)) });
    }
  }
  walk(); return rows;
}
if (mode === 'seal') {
  if (fs.existsSync(file)) throw Error('Existing seal is immutable; inspect before any new seal');
  const final = JSON.parse(fs.readFileSync(path.join(base, 'final-verification.json'))); if (!final.ok) throw Error('Final verification not successful');
  const files = inventory(), manifest = { schema_version: 1, generated_at: new Date().toISOString(), scope: 'Complete minimal A implementation/CLI/native Codex validation record, including failed attempts and historical candidates',
    excluded: ['evidence-manifest.json (this file)'], final_verification_sha256: sha(fs.readFileSync(path.join(base, 'final-verification.json'))),
    file_count: files.length, total_bytes: files.reduce((n, x) => n + x.bytes, 0), files };
  fs.writeFileSync(file, JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx' });
  console.log(JSON.stringify({ ok: true, mode, files: files.length, bytes: manifest.total_bytes, manifest_sha256: sha(fs.readFileSync(file)) }));
} else if (mode === 'verify') {
  const expected = JSON.parse(fs.readFileSync(file)), actual = inventory();
  if (JSON.stringify(expected.files) !== JSON.stringify(actual) || expected.file_count !== actual.length || expected.total_bytes !== actual.reduce((n, x) => n + x.bytes, 0) || expected.final_verification_sha256 !== sha(fs.readFileSync(path.join(base, 'final-verification.json')))) throw Error('Evidence differs from seal');
  console.log(JSON.stringify({ ok: true, mode, files: actual.length, bytes: expected.total_bytes, manifest_sha256: sha(fs.readFileSync(file)) }));
} else throw Error('seal-evidence seal|verify');
