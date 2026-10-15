import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const evidence = path.resolve(root, 'acceptance/20261015-usability-fix/genres');
const [label, cli, ...args] = process.argv.slice(2);
if (!label || !cli) throw new Error('usage: run-cli.mjs label cli args...');
fs.mkdirSync(path.join(evidence, 'cli'), { recursive: true });
const target = path.join(evidence, 'cli', `${label}.json`);
if (fs.existsSync(target)) throw new Error(`evidence already exists: ${target}`);
const started = new Date().toISOString();
const result = spawnSync(process.execPath, [cli, ...args], { cwd: root, encoding: 'utf8' });
const entry = { started_at: started, finished_at: new Date().toISOString(), cwd: root,
  executable: process.execPath, argv: [cli, ...args], exit_code: result.status,
  stdout: result.stdout, stderr: result.stderr, error: result.error?.message ?? null };
fs.writeFileSync(target, JSON.stringify(entry, null, 2) + '\n', { flag: 'wx' });
fs.appendFileSync(path.join(evidence, 'cli-executions.jsonl'), JSON.stringify(entry) + '\n');
process.stdout.write(result.stdout ?? '');
process.stderr.write(result.stderr ?? '');
if (result.error) process.stderr.write(result.error.message + '\n');
process.exitCode = result.status ?? 1;
