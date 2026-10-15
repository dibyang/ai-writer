import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const [label, ...args] = process.argv.slice(2);
if (!/^[a-z0-9-]+$/.test(label || '')) throw new Error('A unique log label is required');
const started = new Date().toISOString();
const result = spawnSync(process.execPath, ['bin/ai-writer.mjs', ...args], { encoding: 'utf8', cwd: fileURLToPath(new URL('../../../', import.meta.url)) });
let output;
try { output = JSON.parse(result.stdout); } catch { output = result.stdout; }
const log = { started, finished: new Date().toISOString(), args, exit_code: result.status, output, stderr: result.stderr, error: result.error?.message };
writeFileSync(new URL(`${label}.json`, import.meta.url), JSON.stringify(log, null, 2) + '\n', { encoding: 'utf8', flag: 'wx' });
process.stdout.write(result.stdout || '');
if (result.stderr) process.stderr.write(result.stderr);
process.exitCode = result.status ?? 2;
