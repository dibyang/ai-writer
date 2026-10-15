import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, appendFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const stage = path.dirname(fileURLToPath(import.meta.url));
const project = path.resolve(stage, '../works/末班寄存柜');
const argv = process.argv.slice(2);
let save;
if (argv[0] === '--save-template') {
  argv.shift(); save = argv.shift();
  if (!/^\.writer\/record-000[1-3]\.json$/.test(save)) throw new Error('模板保存位置越界');
}
const evidence = path.join(stage, 'evidence');
mkdirSync(evidence, { recursive: true });
const index = readdirSync(evidence).filter(n => /^\d{3}-.*\.stdout\.txt$/.test(n)).length + 1;
const stem = `${String(index).padStart(3, '0')}-${argv[0]}`;
const started = new Date().toISOString();
const out = spawnSync(process.execPath, ['.writer/tool/bin/ai-writer.mjs', ...argv], {cwd: project, encoding: 'utf8', windowsHide: true});
writeFileSync(path.join(evidence, `${stem}.stdout.txt`), out.stdout ?? '', 'utf8');
writeFileSync(path.join(evidence, `${stem}.stderr.txt`), out.stderr ?? '', 'utf8');
appendFileSync(path.join(stage, 'commands.jsonl'), JSON.stringify({started, finished: new Date().toISOString(), cwd: project, argv: [process.execPath, '.writer/tool/bin/ai-writer.mjs', ...argv], exit_code: out.status, error: out.error?.message, stdout: `evidence/${stem}.stdout.txt`, stderr: `evidence/${stem}.stderr.txt`, ...(save ? {saved_template:save} : {})}) + '\n', 'utf8');
if (save && out.status === 0) writeFileSync(path.join(project, save), out.stdout, 'utf8');
process.stdout.write(out.stdout ?? ''); process.stderr.write(out.stderr ?? '');
if (out.error) process.stderr.write(out.error.message);
process.exitCode = out.status ?? 2;
