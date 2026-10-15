import { readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import path from 'node:path';
const session = 'acceptance/20261016-long/session-a';
const project = 'acceptance/20261016-long/works/雨线档案';
const unit = Number(process.argv[2]);
const n = String(unit).padStart(2, '0');
const started_at = new Date().toISOString();
let exit_code = 0, stdout = '', stderr = '';
try {
  const template = JSON.parse(readFileSync(`${session}/template-${n}.json`, 'utf8'));
  const additions = JSON.parse(readFileSync(`${session}/changes-${n}.json`, 'utf8'));
  const record = { ...template, ...additions };
  const target = `${project}/.writer/record-${n}.json`;
  writeFileSync(target, JSON.stringify(record, null, 2) + '\n', 'utf8');
  const text = readFileSync(path.join(project, template.draft), 'utf8');
  const body = text.replace(/^# .*\r?\n/, '');
  stdout = JSON.stringify({ unit, input: target, han_body: [...body.matchAll(/\p{Script=Han}/gu)].length, source_hashes_preserved: JSON.stringify(template.source_hashes) === JSON.stringify(record.source_hashes) }, null, 2) + '\n';
} catch (error) { exit_code = 1; stderr = String(error.stack) + '\n'; }
appendFileSync(`${session}/commands.jsonl`, JSON.stringify({started_at, ended_at:new Date().toISOString(), cwd:process.cwd(), executable:process.execPath, argv:process.argv.slice(1), exit_code, stdout, stderr}) + '\n', 'utf8');
process.stdout.write(stdout); process.stderr.write(stderr); process.exitCode = exit_code;
