import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
const root = 'D:/work/other/ai-writer';
const project = root + '/acceptance/20261015-usability-fix/works/雨后失物';
const args = process.argv.slice(2);
const pathFlag = args[0] === 'init' ? '--path' : '--project';
const at = args.indexOf(pathFlag);
if (at < 0 || path.resolve(args[at+1] || '') !== path.resolve(project)) throw new Error('必须显式传指定作品路径');
if (path.resolve(process.cwd()) !== path.resolve(root)) throw new Error('必须从主项目根目录执行');
const started_at = new Date().toISOString();
const result = spawnSync(process.execPath, ['bin/ai-writer.mjs', ...args], {cwd:root, encoding:'utf8'});
const entry = {started_at, finished_at:new Date().toISOString(), cwd:root, executable:process.execPath, argv:['bin/ai-writer.mjs',...args], status:result.status, signal:result.signal, stdout:result.stdout, stderr:result.stderr, error:result.error ? String(result.error) : null};
fs.appendFileSync(new URL('./commands.jsonl',import.meta.url), JSON.stringify(entry)+'\n', 'utf8');
process.stdout.write(result.stdout || '');
process.stderr.write(result.stderr || '');
process.exitCode = result.status ?? 1;

