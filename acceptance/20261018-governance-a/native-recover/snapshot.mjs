import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

// Acceptance evidence only. No product modules are imported and the target is read-only.
const [target, output, baseline] = process.argv.slice(2);
const root = path.resolve(target);
const digest = value => crypto.createHash('sha256').update(value).digest('hex');
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name);
    if (entry.isSymbolicLink()) throw Error(`Unexpected symbolic link: ${file}`);
    return entry.isDirectory() ? walk(file) : [{
      path: path.relative(root, file).split(path.sep).join('/'),
      bytes: fs.statSync(file).size,
      sha256: digest(fs.readFileSync(file))
    }];
  }).sort((a, b) => a.path.localeCompare(b.path, 'en'));
}
const files = walk(root);
const drafts = files.filter(file => file.path.startsWith('正文/'));
const state = files.find(file => file.path === '.writer/state.json');
const result = { root, files, state, drafts,
  inventory_sha256: digest(JSON.stringify(files)),
  draft_inventory_sha256: digest(JSON.stringify(drafts)) };
if (baseline) {
  const before = JSON.parse(fs.readFileSync(baseline, 'utf8'));
  const previous = new Map(before.files.map(file => [file.path, file]));
  result.added = files.filter(file => !previous.has(file.path));
  result.changed = files.filter(file => previous.has(file.path) && previous.get(file.path).sha256 !== file.sha256);
  const current = new Set(files.map(file => file.path));
  result.removed = before.files.filter(file => !current.has(file.path));
  result.all_bytes_unchanged = result.added.length + result.changed.length + result.removed.length === 0;
}
fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ files: files.length, state, drafts,
  inventory_sha256: result.inventory_sha256, draft_inventory_sha256: result.draft_inventory_sha256,
  all_bytes_unchanged: result.all_bytes_unchanged }, null, 2));
