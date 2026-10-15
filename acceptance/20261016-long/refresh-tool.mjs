import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const campaign = path.dirname(fileURLToPath(import.meta.url)), root = path.resolve(campaign, '../..');
const work = path.join(campaign, 'works/雨线档案'), out = path.join(campaign, 'tool-refresh');
if (fs.existsSync(path.join(out, 'result.json'))) throw new Error('Preserve earlier completed refresh evidence');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const state = JSON.parse(fs.readFileSync(path.join(work, '.writer/state.json')));
const protectedRefs = ['.writer/state.json', ...state.units.flatMap(u => [u.draft, u.journal])];
const before = protectedRefs.map(file => ({ file, sha256: hash(path.join(work, file)) }));
fs.mkdirSync(out, { recursive: true });
const changes = [];
for (const file of ['lib/longform.mjs', 'docs/long-form.md']) {
  const target = path.join(work, file.startsWith('docs/') ? '' : '.writer/tool', file), previous = path.join(out, 'previous', file);
  fs.mkdirSync(path.dirname(previous), { recursive: true });
  if (!fs.existsSync(previous)) fs.copyFileSync(target, previous);
  fs.copyFileSync(path.join(root, file), target);
  changes.push({ file, before: hash(previous), after: hash(target) });
}
const unchanged = before.every(row => hash(path.join(work, row.file)) === row.sha256 && hash(path.join(campaign, 'checkpoints/revision/files', row.file)) === row.sha256);
const argv = [path.join(work, '.writer/tool/bin/ai-writer.mjs'), 'check', '--project', work];
const checked = spawnSync(process.execPath, argv, { encoding: 'utf8', cwd: root });
fs.writeFileSync(path.join(out, 'result.json'), JSON.stringify({ unchanged, before, changes, argv, exit_code: checked.status, stdout: checked.stdout, stderr: checked.stderr }, null, 2));
if (!unchanged || checked.status !== 0) throw new Error('Refresh validation failed');
const baseline = JSON.parse(fs.readFileSync(path.join(campaign, 'source-baseline.json')));
const candidate = { base_commit: baseline.commit, version: JSON.parse(fs.readFileSync(path.join(root, 'package.json'))).version,
  created_at: new Date().toISOString(), files: baseline.files.map(row => ({ file: row.file, sha256: hash(path.join(root, row.file)) })) };
fs.writeFileSync(path.join(campaign, 'candidate-final.json'), JSON.stringify(candidate, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ unchanged, changes, rolling_review: JSON.parse(checked.stdout).rolling_review, candidate_files: candidate.files.length }));
