import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const base = path.dirname(fileURLToPath(import.meta.url));
const [label, exe, ...args] = process.argv.slice(2);
if (!/^[a-z][a-z0-9-]*$/.test(label ?? '') || !exe) throw Error('unique-label exe args');
const dir = path.join(base, 'commands', label); fs.mkdirSync(dir, { recursive: true });
if (fs.existsSync(path.join(dir, 'result.json'))) throw Error('Never overwrite evidence');
const sha = x => crypto.createHash('sha256').update(x).digest('hex');
let input = null; const at = args.indexOf('--input');
if (at >= 0) { const file = path.resolve(args[at + 1]); const bytes = fs.readFileSync(file); fs.writeFileSync(path.join(dir, 'input.raw.json'), bytes, { flag: 'wx' }); input = { file, sha256: sha(bytes) }; }
const projectAt = args.indexOf('--project'), stateFile = projectAt < 0 ? null : path.resolve(args[projectAt + 1], '.writer/state.json');
function snap(name) { if (!stateFile || !fs.existsSync(stateFile)) return null; const bytes = fs.readFileSync(stateFile); fs.writeFileSync(path.join(dir, name), bytes, { flag: 'wx' }); return sha(bytes); }
const before = snap('before-state.json'), start = Date.now();
if (exe === 'npm.cmd' && args.some(x => !/^[A-Za-z0-9:_-]+$/.test(x))) throw Error('Unsafe npm arguments');
const actualExe = exe === 'npm.cmd' ? process.env.ComSpec : exe;
const actualArgs = exe === 'npm.cmd' ? ['/d', '/c', 'npm.cmd', ...args] : args;
const result = spawnSync(actualExe, actualArgs, { windowsHide: true, timeout: 300000, maxBuffer: 64 * 1024 * 1024 });
fs.writeFileSync(path.join(dir, 'stdout.raw.txt'), result.stdout ?? Buffer.alloc(0));
fs.writeFileSync(path.join(dir, 'stderr.raw.txt'), result.stderr ?? Buffer.alloc(0));
const meta = { exe, args, cwd: process.cwd(), started_at: new Date(start).toISOString(), elapsed_ms: Date.now() - start, exit_code: result.status, signal: result.signal, error: result.error?.message, input, before_state_sha256: before, after_state_sha256: snap('after-state.json') };
fs.writeFileSync(path.join(dir, 'result.json'), JSON.stringify(meta, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify(meta)); process.exitCode = result.status ?? 1;
