import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { root, batch, stage, work, load, put, inventory, sha } from './helpers.mjs';
const backup = path.join(stage, 'before/work');
if (fs.existsSync(backup)) throw Error('backup exists');
fs.cpSync(work, backup, { recursive: true, errorOnExist: true, force: false });
put(path.join(stage, 'before/inventory.json'), inventory(backup));
const compare = load(path.join(batch, 'commands/native-two-03-compare/stdout.raw.txt'));
put(path.join(stage, 'tool-comparison.json'), compare);
for (const d of compare.differences) {
  const left = path.join(work, '.writer', d.group === 'skills' ? 'never' : 'tool', d.file);
  const right = path.join(root, d.file);
  const res = spawnSync('git', ['diff', '--no-index', '--', left, right], { encoding: 'utf8', windowsHide: true });
  put(path.join(stage, 'source-diffs', d.file + '.diff.txt'), res.stdout + res.stderr);
}
const protectedRefs = ['AGENTS.md','package.json','bin/ai-writer.mjs', ...fs.readdirSync(path.join(root,'lib')).filter(x=>x.endsWith('.mjs')).map(x=>'lib/'+x), ...fs.readdirSync(path.join(root,'docs')).filter(x=>x.endsWith('.md')).map(x=>'docs/'+x)];
for (const dir of ['.agents/skills']) {
  const inv = inventory(path.join(root,dir)); protectedRefs.push(...Object.keys(inv).map(x=>dir+'/'+x));
}
const protectedBytes = {};
for (const ref of protectedRefs) { const b = fs.readFileSync(path.join(root,ref)); protectedBytes[ref] = { bytes:b.length,sha256:sha(b) }; put(path.join(stage,'source-observation',ref), b.toString('utf8')); }
put(path.join(stage,'source-observation-index.json'), protectedBytes);
console.log(JSON.stringify({ backup, files:Object.keys(inventory(backup)).length, source_files:protectedRefs.length, differences:compare.differences },null,2));
