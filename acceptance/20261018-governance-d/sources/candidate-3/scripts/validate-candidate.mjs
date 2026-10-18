import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { ROOT } from '../lib/workspace.mjs';

const output = path.join(ROOT, 'acceptance/20261015-long');
const label = process.argv[2] ?? '';
if (label && !/^[a-z0-9-]+$/.test(label)) throw new Error('invalid candidate label');
const results = [];
for (const [name, args] of [['workspace-tests', ['test']], ['doctor', ['run', 'doctor']]]) {
  const file = path.join(output, `${name}-final${label ? `-${label}` : ''}.txt`), fd = fs.openSync(file, 'wx');
  const started = Date.now();
  const command = process.platform === 'win32' ? (process.env.ComSpec ?? 'cmd.exe') : 'npm';
  const argv = process.platform === 'win32' ? ['/d', '/s', '/c', `npm.cmd ${args.join(' ')}`] : args;
  const child = spawn(command, argv, { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
  child.stdout.on('data', chunk => fs.writeSync(fd, chunk)); child.stderr.on('data', chunk => fs.writeSync(fd, chunk));
  const code = await new Promise((resolve, reject) => { child.once('close', resolve); child.once('error', reject); }); fs.closeSync(fd);
  results.push({ command: `npm ${args.join(' ')}`, exit_code: code, elapsed_ms: Date.now() - started, file: path.relative(ROOT, file), sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
  console.log(JSON.stringify(results.at(-1)));
  if (code !== 0) throw new Error('candidate validation failed; preserve log');
}
const files = ['package.json', 'bin/ai-writer.mjs', ...fs.readdirSync(path.join(ROOT, 'lib')).filter(x => x.endsWith('.mjs')).map(x => `lib/${x}`),
  ...fs.readdirSync(path.join(ROOT, '.agents/skills')).map(x => `.agents/skills/${x}/SKILL.md`), '.agents/skills/writer-project/references/long-form.md'];
const candidate = { version: JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).version, node: process.version, platform: process.platform, results,
  files: files.map(ref => ({ file: ref, sha256: crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT, ref))).digest('hex') })) };
fs.writeFileSync(path.join(output, `candidate-validation${label ? `-${label}` : ''}.json`), JSON.stringify(candidate, null, 2) + '\n', { flag: 'wx', encoding: 'utf8' });
