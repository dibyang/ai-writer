import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import { identifyBuild } from '../../lib/tool-build.mjs';
const [label, exe, ...args] = process.argv.slice(2);
if (!/^[a-z][a-z0-9-]*$/.test(label ?? '') || !exe) throw Error('capture <unique label> <exe> <args...>');
const dir = path.resolve('acceptance/20261018-governance-a/commands', label);
fs.mkdirSync(dir, { recursive: true });
if (fs.existsSync(path.join(dir, 'result.json'))) throw Error('Never overwrite evidence');
const started = Date.now();
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const product = /bin[\\/]ai-writer\.mjs$/.test(args[0] ?? '');
const inputIndex = product ? args.indexOf('--input') : -1;
let input = null, beforeState = null, stateFile = null, build = null;
if (inputIndex >= 0) { const file = path.resolve(args[inputIndex + 1]); try { const bytes = fs.readFileSync(file); fs.writeFileSync(path.join(dir, 'input.raw.json'), bytes, { flag: 'wx' }); input = { file, sha256: sha(bytes) }; } catch (error) { input = { file, read_error: error.message }; } }
if (product) {
  const projectIndex = args.indexOf('--project'), initIndex = args.indexOf('--path');
  const work = projectIndex >= 0 ? args[projectIndex + 1] : initIndex >= 0 ? args[initIndex + 1] : null;
  if (work) { stateFile = path.resolve(work, '.writer/state.json'); if (fs.existsSync(stateFile)) { beforeState = fs.readFileSync(stateFile); fs.writeFileSync(path.join(dir, 'before-state.json'), beforeState, { flag: 'wx' }); } }
  try { const observed = identifyBuild(path.dirname(path.dirname(path.resolve(args[0])))); build = { observed_content_id: observed.observed_content_id, runtime_id: observed.runtime_id, version: observed.tool_version, profile: observed.profile }; } catch (error) { build = { observation_error: error.message }; }
}
const isNpm = exe === 'npm.cmd';
if (isNpm && args.some(x => !/^[A-Za-z0-9:_-]+$/.test(x))) throw Error('Only simple npm script arguments are supported');
const actualExe = isNpm ? process.env.ComSpec : exe, actualArgs = isNpm ? ['/d', '/c', 'npm.cmd', ...args] : args;
const r = spawnSync(actualExe, actualArgs, { cwd: process.cwd(), windowsHide: true, timeout: 300000, maxBuffer: 100 * 1024 * 1024 });
fs.writeFileSync(path.join(dir, 'stdout.raw.txt'), r.stdout ?? Buffer.alloc(0));
fs.writeFileSync(path.join(dir, 'stderr.raw.txt'), r.stderr ?? Buffer.alloc(0));
const afterState = stateFile && fs.existsSync(stateFile) ? fs.readFileSync(stateFile) : null;
if (afterState) fs.writeFileSync(path.join(dir, 'after-state.json'), afterState, { flag: 'wx' });
const result = { exe, argv: args, actual_exe: actualExe, actual_argv: actualArgs, cwd: process.cwd(), started_at: new Date(started).toISOString(), elapsed_ms: Date.now() - started,
  exit_code: r.status, signal: r.signal, error: r.error?.message, input, build, before_state_sha256: beforeState && sha(beforeState), after_state_sha256: afterState && sha(afterState) };
fs.writeFileSync(path.join(dir, 'result.json'), JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
if (r.stdout?.length) process.stdout.write(r.stdout);
if (r.stderr?.length) process.stderr.write(r.stderr);
console.log(JSON.stringify(result)); process.exitCode = r.status ?? 1;
