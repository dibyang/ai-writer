import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const repo = process.cwd();
const base = path.resolve('acceptance/20261018-governance-a/native-delivery-check');
const fixture = path.resolve('acceptance/20261018-governance-a/migration-matrix-v9/schema-1');
const work = path.join(base, '最终交付确认作品');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const write = (name, value) => fs.writeFileSync(path.join(base, name), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
function inventory(root, protectedMode = false) {
  const files = {};
  function walk(dir) {
    for (const name of fs.readdirSync(dir).sort()) {
      if (name === '.git') continue;
      const file = path.join(dir, name);
      if (protectedMode && (file === base || (path.dirname(file) === path.resolve('acceptance/20261018-governance-a/commands') && name.startsWith('native-five-')))) continue;
      const rel = path.relative(root, file).replaceAll('\\', '/');
      const stat = fs.lstatSync(file);
      if (stat.isSymbolicLink()) files[rel] = { symlink: fs.readlinkSync(file), mtime_ms: stat.mtimeMs };
      else if (stat.isDirectory()) walk(file);
      else if (stat.isFile()) files[rel] = { bytes: stat.size, sha256: sha(fs.readFileSync(file)), mtime_ms: stat.mtimeMs };
    }
  }
  walk(root);
  return { root, count: Object.keys(files).length, digest: sha(JSON.stringify(files)), files };
}
const [action, name, arg] = process.argv.slice(2);
if (action === 'snapshot') {
  const roots = arg === 'fixture' ? [fixture] : arg === 'work' ? [work] : arg === 'protected' ? [repo, 'D:\\work\\小说\\dzkxqxx'] : [];
  if (!roots.length || !/^[a-z0-9-]+$/.test(name)) throw Error('Invalid snapshot arguments');
  const result = { at: new Date().toISOString(), group: arg, roots: roots.map(root => inventory(root, arg === 'protected')), note: 'All regular files include byte hashes, sizes and mtimes; .git excluded. Protected inventory excludes only this stage and native-five command evidence.' };
  write(name + '.json', result);
  console.log(JSON.stringify({ name, roots: result.roots.map(({ root, count, digest }) => ({ root, count, digest })) }));
} else if (action === 'compare') {
  const before = JSON.parse(fs.readFileSync(path.join(base, name + '.json')));
  const after = JSON.parse(fs.readFileSync(path.join(base, arg + '.json')));
  const differences = [];
  for (const a of before.roots) {
    const b = after.roots.find(x => x.root === a.root);
    for (const file of new Set([...Object.keys(a.files), ...Object.keys(b?.files ?? {})])) {
      if (JSON.stringify(a.files[file]) !== JSON.stringify(b?.files[file])) differences.push({ root: a.root, file, before: a.files[file] ?? null, after: b?.files[file] ?? null });
    }
  }
  const result = { before: name + '.json', after: arg + '.json', unchanged: differences.length === 0, differences };
  write(name + '-comparison.json', result);
  console.log(JSON.stringify(result));
  if (differences.length) process.exitCode = 1;
} else throw Error('Unknown audit action');
