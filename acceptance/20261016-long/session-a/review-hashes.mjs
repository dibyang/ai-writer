import { readFileSync, writeFileSync, appendFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
const session = 'acceptance/20261016-long/session-a';
const project = 'acceptance/20261016-long/works/雨线档案';
const started_at = new Date().toISOString();
let exit_code = 0, stdout = '', stderr = '';
try {
  const files = readdirSync(`${project}/正文`).filter(x => /^000[123]-.*\.md$/.test(x)).sort();
  if (files.length !== 3) throw new Error('Expected exactly three rolling review sources');
  const source_hashes = Object.fromEntries(files.map(x => [`正文/${x}`, createHash('sha256').update(readFileSync(`${project}/正文/${x}`)).digest('hex')]));
  const report = '审查/1-3连读-20261016.md';
  const text = readFileSync(`${project}/${report}`, 'utf8');
  const table = '| 已实读源文件 | SHA-256 |\n| --- | --- |\n' + Object.entries(source_hashes).map(([p,h])=>`| ${p} | ${h} |`).join('\n');
  if (!text.includes('<!-- hashes -->')) throw new Error('Hash placeholder missing; never overwrite registered review');
  writeFileSync(`${project}/${report}`, text.replace('<!-- hashes -->', table), 'utf8');
  const input = { from:1, to:3, kind:'model-self-review', report, source_hashes };
  writeFileSync(`${session}/review-01-03.json`, JSON.stringify(input, null, 2) + '\n', 'utf8');
  stdout = JSON.stringify(input, null, 2) + '\n';
} catch (error) { exit_code = 1; stderr = String(error.stack) + '\n'; }
appendFileSync(`${session}/commands.jsonl`, JSON.stringify({started_at, ended_at:new Date().toISOString(), cwd:process.cwd(), executable:process.execPath, argv:process.argv.slice(1), exit_code, stdout, stderr}) + '\n', 'utf8');
process.stdout.write(stdout); process.stderr.write(stderr); process.exitCode=exit_code;
