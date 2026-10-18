import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const base = path.resolve('acceptance/20261018-governance-a'), boundary = fs.realpathSync('.tmp') + path.sep;
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const raw = fs.readFileSync(path.join(base, 'commands/final-smoke/stdout.raw.txt'), 'utf8'); const smoke = JSON.parse(raw.slice(raw.indexOf('{')));
const capacity = JSON.parse(fs.readFileSync(path.join(base, 'capacity-entry.json')));
function inventory(root) { const files = []; function walk(ref = '') { for (const name of fs.readdirSync(path.join(root, ref)).sort()) { const next = ref ? `${ref}/${name}` : name, file = path.join(root, next), stat = fs.lstatSync(file); assert.equal(stat.isSymbolicLink(), false); if (stat.isDirectory()) walk(next); else if (stat.isFile()) files.push({ file: next, sha256: sha(fs.readFileSync(file)), bytes: stat.size }); } } walk(); return files; }
const result = [];
for (const [label, source] of [['smoke', path.dirname(smoke.project)], ['capacity-entry', capacity.root]]) {
  const resolved = fs.realpathSync(source); assert.ok(resolved.startsWith(boundary)); const target = path.join(base, 'developer-fixtures', label); assert.equal(fs.existsSync(target), false);
  const files = inventory(resolved); fs.cpSync(resolved, target, { recursive: true, force: false, errorOnExist: true }); assert.deepEqual(inventory(target), files);
  result.push({ label, original_temp_path: resolved, archived_path: path.relative(base, target), files });
}
fs.writeFileSync(path.join(base, 'developer-fixtures.json'), JSON.stringify({ ok: true, scope: 'Preserved exact developer smoke and schema1/2 compatibility fixtures; no performance improvement claim', result }, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ ok: true, archived: result.map(x => ({ label: x.label, files: x.files.length })) }));
