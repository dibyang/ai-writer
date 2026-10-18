import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
const label = process.argv[2]; if (!/^[a-z0-9-]+$/.test(label ?? '')) throw Error('unique label');
const base = path.resolve('acceptance/20261018-governance-a'), dir = path.join(base, label), work = path.join(dir, '作品'); fs.mkdirSync(dir, { recursive: false });
function run(name, args) { const r = spawnSync(process.execPath, [path.join(base, 'capture.mjs'), `${label}-${name}`, process.execPath, 'bin/ai-writer.mjs', ...args], { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }); const file = path.join(base, 'commands', `${label}-${name}`, r.status === 2 ? 'stderr.raw.txt' : 'stdout.raw.txt'); return { exit_code: r.status, value: JSON.parse(fs.readFileSync(file)) }; }
run('init', ['init', '--path', work, '--kind', 'essay', '--title', '保留键异常测试']);
const original = run('show', ['workflow', 'show', '--project', work]).value;
const quote = '合成异常验收，只修改独立测试作品的阶段登记。'; fs.writeFileSync(path.join(work, '研究/作者要求.md'), quote);
const input = { expected_revision: original.revision, operation_id: 'prototype', author_evidence: { quote, local_source: '研究/作者要求.md', source_sha256: crypto.createHash('sha256').update(quote).digest('hex'), locator: '合成夹具第1行', recorded_by: 'probe' }, workflow: original.workflow };
const file = path.join(dir, 'input.json'); fs.writeFileSync(file, JSON.stringify(input));
const attempted = run('set', ['workflow', 'set', '--project', work, '--input', file]);
const status = run('status', ['status', '--project', work]); const result = { attempted, status };
fs.writeFileSync(path.join(dir, 'result.json'), JSON.stringify(result, null, 2) + '\n', { flag: 'wx' }); console.log(JSON.stringify(result));
