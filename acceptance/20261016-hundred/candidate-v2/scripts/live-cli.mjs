import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { ROOT } from '../lib/workspace.mjs';
const [phase, ...args] = process.argv.slice(2);
if (!/^root-(screenplay|history)$/.test(phase ?? '')) throw new Error('explicit local acceptance phase required');
let savedOutput;
if (args[0] === '--save-output') { args.shift(); savedOutput = path.resolve(args.shift()); }
const projectAt = args.indexOf('--project');
const script = projectAt >= 0 ? path.resolve(args[projectAt + 1], '.writer/tool/bin/ai-writer.mjs') : path.join(ROOT, 'bin/ai-writer.mjs');
const started = Date.now(), result = spawnSync(process.execPath, [script, ...args], { cwd: ROOT, encoding: 'utf8', timeout: 30000, maxBuffer: 4 * 1024 * 1024, windowsHide: true });
const directory = path.join(ROOT, 'acceptance/20261015-long', phase); fs.mkdirSync(directory, { recursive: true });
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const tool = path.dirname(path.dirname(script));
const log = { nature: 'current-Codex-session-real-CLI', at: new Date().toISOString(), args, script, exit_code: result.status, elapsed_ms: Date.now() - started,
  input_sha256: args.includes('--input') ? hash(args[args.indexOf('--input') + 1]) : null,
  tool_sha256: Object.fromEntries(['bin/ai-writer.mjs', 'lib/workspace.mjs', 'lib/journal.mjs', 'lib/longform.mjs'].map(ref => [ref, hash(path.join(tool, ref))])),
  stdout: result.stdout, stderr: result.stderr, error: result.error?.message ?? null };
fs.writeFileSync(path.join(directory, `${Date.now()}-${crypto.randomUUID()}.json`), JSON.stringify(log, null, 2) + '\n', { flag: 'wx', encoding: 'utf8' });
if (savedOutput && result.status === 0) fs.writeFileSync(savedOutput, result.stdout, { flag: 'wx', encoding: 'utf8' });
process.stdout.write(result.stdout ?? ''); process.stderr.write(result.stderr ?? ''); process.exitCode = result.status ?? 1;
