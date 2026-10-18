import fs from 'node:fs';
const base = 'acceptance/20261018-governance-a/';
const before = JSON.parse(fs.readFileSync(base + 'protected-before.json'));
const after = JSON.parse(fs.readFileSync(base + 'protected-after.json'));
const map = new Map(before.files.map(x => [x.file, x])), changed = [], added = [];
for (const row of after.files) {
  const old = map.get(row.file);
  if (!old) added.push(row); else if (old.sha256 !== row.sha256) changed.push({ file: row.file, before: old, after: row });
  map.delete(row.file);
}
const result = { before_files: before.files.length, after_files: after.files.length, unchanged_files: before.files.length - changed.length - map.size,
  changed, added, removed: [...map.values()], note: 'Observed external-directory differences. No restoration or writes to protected directory. Hash comparison alone cannot attribute authorship.' };
fs.writeFileSync(base + 'protected-differences.json', JSON.stringify(result, null, 2) + '\n', { flag: 'wx' }); console.log(JSON.stringify(result));
