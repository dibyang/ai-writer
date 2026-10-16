// Parent executes this only after fully reading the final chapters and writing parent-review.md.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url)), root = path.resolve(dir, '../..');
const phase = process.argv[2];
if (!/^[a-z][a-z0-9-]*$/.test(phase ?? '')) throw Error('close-review <finished phase>');
const stage = path.join(dir, phase), work = path.join(dir, 'works/潮汐信号');
if (JSON.parse(fs.readFileSync(path.join(stage, 'process-result.json'))).exit_code !== 0) throw Error('Wait for native process completion');
const out = path.join(stage, 'parent-postlude'); if (fs.existsSync(out)) throw Error('Preserve previous postlude');
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const statePath = path.join(work, '.writer/state.json'), before = hash(statePath), state = JSON.parse(fs.readFileSync(statePath));
const report = `审查/主会话-${phase}-全稿.md`, target = path.join(work, report);
fs.mkdirSync(path.dirname(target), { recursive: true }); fs.copyFileSync(path.join(stage, 'parent-review.md'), target, fs.constants.COPYFILE_EXCL);
fs.mkdirSync(out);
const input = { from: 1, to: state.units.length, kind: 'model-self-review', report, source_hashes: Object.fromEntries(state.units.map(u => [u.draft, u.sha256])) };
const inputPath = path.join(out, 'review-input.json'); fs.writeFileSync(inputPath, JSON.stringify(input, null, 2));
const commands = [];
function run(command, args = []) {
  const argv = [path.join(work, '.writer/tool/bin/ai-writer.mjs'), command, '--project', work, ...args];
  const r = spawnSync(process.execPath, argv, { cwd: root, encoding: 'utf8', timeout: 30000 });
  commands.push({ argv, exit_code: r.status, stdout: r.stdout, stderr: r.stderr });
  fs.writeFileSync(path.join(out, 'commands.json'), JSON.stringify(commands, null, 2));
  if (r.status !== 0) throw Error(r.stderr || r.stdout);
  return JSON.parse(r.stdout);
}
run('review', ['--input', inputPath]);
const checked = run('check'), exported = run('export', ['--out', path.join(out, 'export')]);
const original = JSON.parse(fs.readFileSync(path.join(stage, 'export/manifest.json')));
const ok = before === hash(statePath) && !checked.rolling_review.pending_windows.length && original.sha256 === exported.sha256;
fs.writeFileSync(path.join(out, 'result.json'), JSON.stringify({ ok, actor: 'parent Codex session, not the native child', reason: 'Report path was already within authorized work scope; close unnecessary permission gap without changing native history.', state_unchanged: before === hash(statePath), original_export_sha256: original.sha256, export_sha256: exported.sha256, rolling_review: checked.rolling_review }, null, 2));
console.log(JSON.stringify({ ok, state_unchanged: before === hash(statePath), rolling_review: checked.rolling_review }));
process.exitCode = ok ? 0 : 1;
