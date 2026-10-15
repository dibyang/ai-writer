import { spawnSync } from 'node:child_process';
import { appendFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const session = path.resolve('acceptance/20261016-long/session-a');
const project = 'acceptance/20261016-long/works/雨线档案';
mkdirSync(session, { recursive: true });
const args = process.argv.slice(2);
const captureIndex = args.indexOf('--capture');
const capture = captureIndex < 0 ? null : args.splice(captureIndex, 2)[1];
const argv = ['bin/ai-writer.mjs', ...args];
if (args[0] === 'init') argv.push('--path', project);
else argv.push('--project', project);
const started_at = new Date().toISOString();
const result = spawnSync(process.execPath, argv, { cwd: root, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
const entry = { started_at, ended_at: new Date().toISOString(), cwd: root, executable: process.execPath, argv, exit_code: result.status, signal: result.signal, stdout: result.stdout ?? '', stderr: result.stderr ?? '', error: result.error?.message ?? null };
appendFileSync(path.join(session, 'commands.jsonl'), JSON.stringify(entry) + '\n', 'utf8');
if (capture && result.status === 0) {
  const { writeFileSync } = await import('node:fs');
  writeFileSync(path.resolve(capture), entry.stdout, 'utf8');
}
process.stdout.write(entry.stdout);
process.stderr.write(entry.stderr);
process.stdout.write(`\n[logged exit_code=${entry.exit_code}; argv=${JSON.stringify(argv)}]\n`);
process.exitCode = result.status ?? 1;
