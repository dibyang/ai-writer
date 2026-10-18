import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const [label] = process.argv.slice(2), base = 'acceptance/20261018-governance-a';
if (!/^[a-z][a-z0-9-]*$/.test(label ?? '')) throw Error('label');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
function inventory(root, exclude = []) {
  const files = [], links = [];
  function walk(ref = '') { for (const name of fs.readdirSync(path.join(root, ref)).sort()) {
    if (!ref && exclude.includes(name)) continue;
    const next = ref ? `${ref}/${name}` : name, file = path.join(root, next), stat = fs.lstatSync(file);
    if (stat.isSymbolicLink()) links.push(next); else if (stat.isDirectory()) walk(next); else if (stat.isFile()) files.push({ file: next, bytes: stat.size, sha256: sha(fs.readFileSync(file)) });
  } }
  walk(); return { root, excluded: exclude, files, links };
}
if (label === 'protected-before' || label === 'protected-after') {
  const value = inventory('D:/work/小说/dzkxqxx');
  const output = `${base}/${label}.json`; fs.writeFileSync(output, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
  if (label === 'protected-after') {
    const before = JSON.parse(fs.readFileSync(`${base}/protected-before.json`));
    if (JSON.stringify(value) !== JSON.stringify(before)) throw Error('Protected project differs; inspect evidence, never overwrite');
  }
  console.log(JSON.stringify({ ok: true, label, files: value.files.length, links: value.links.length }));
} else {
  const output = `${base}/sources/${label}`; fs.mkdirSync(output, { recursive: false }); const files = [];
  for (const dir of ['bin', 'lib', 'tests', 'docs', '.agents/skills', 'scripts']) for (const row of inventory(dir).files) {
    const ref = `${dir}/${row.file}`, target = path.join(output, ref); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.copyFileSync(ref, target); files.push({ file: ref, sha256: row.sha256 });
  }
  for (const ref of ['README.md', 'package.json']) { fs.copyFileSync(ref, path.join(output, ref)); files.push({ file: ref, sha256: sha(fs.readFileSync(ref)) }); }
  fs.writeFileSync(`${output}/source-manifest.json`, JSON.stringify({ label, at: new Date().toISOString(), files }, null, 2) + '\n', { flag: 'wx' });
  console.log(JSON.stringify({ ok: true, label, files: files.length }));
}
