import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const base = 'acceptance/20261016-expanded/session-b';
const project = 'acceptance/20261016-expanded/works/潮汐信号';
const tool = `${project}/.writer/tool/bin/ai-writer.mjs`;
const args = process.argv.slice(2);
const serial = fs.existsSync(`${base}/cli-index.json`) ? JSON.parse(fs.readFileSync(`${base}/cli-index.json`, 'utf8')).length + 1 : 1;
const prefix = `${base}/logs/${String(serial).padStart(3, '0')}-${args[0] || 'help'}`;
fs.mkdirSync(path.dirname(prefix), {recursive: true});
const argv = [tool, ...args, '--project', project];
const start = new Date().toISOString();
const result = spawnSync(process.execPath, argv, {cwd: process.cwd(), encoding: null, maxBuffer: 32 * 1024 * 1024});
fs.writeFileSync(`${prefix}.stdout`, result.stdout || Buffer.alloc(0));
fs.writeFileSync(`${prefix}.stderr`, result.stderr || Buffer.alloc(0));
const meta = { executable: process.execPath, argv, cwd: process.cwd(), start, end: new Date().toISOString(), exit_code: result.status, signal: result.signal, error: result.error ? String(result.error) : null, stdout: `${prefix}.stdout`, stderr: `${prefix}.stderr` };
fs.writeFileSync(`${prefix}.json`, JSON.stringify(meta, null, 2) + '\n');
const index = fs.existsSync(`${base}/cli-index.json`) ? JSON.parse(fs.readFileSync(`${base}/cli-index.json`, 'utf8')) : [];
index.push(meta);
fs.writeFileSync(`${base}/cli-index.json`, JSON.stringify(index, null, 2) + '\n');
if (result.status === 0 && ['record-template', 'context'].includes(args[0])) {
  const unit = args[args.indexOf('--unit') + 1];
  const target = `${base}/${args[0]}-${String(unit).padStart(4, '0')}.json`;
  if (!fs.existsSync(target)) fs.writeFileSync(target, result.stdout);
}
process.stdout.write(result.stdout || Buffer.alloc(0));
process.stderr.write(result.stderr || Buffer.alloc(0));
process.stdout.write(`\n[raw logs: ${prefix}; exit=${result.status}]\n`);
process.exitCode = result.status ?? 1;
