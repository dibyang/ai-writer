import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { ROOT } from '../lib/workspace.mjs';

const tempRoot = path.join(ROOT, '.tmp');
fs.mkdirSync(tempRoot, { recursive: true });
const runRoot = fs.mkdtempSync(path.join(tempRoot, 'smoke-'));
const work = path.join(runRoot, '匿名作品');
const cli = path.join(ROOT, 'bin/ai-writer.mjs');
function run(args) {
  const result = spawnSync(process.execPath, [cli, ...args], { cwd: ROOT, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout);
  return JSON.parse(result.stdout);
}
function write(file, value) { fs.writeFileSync(file, JSON.stringify(value, null, 2), 'utf8'); }
run(['init', '--path', work, '--kind', 'novel', '--title', '没寄出的信']);
const planFile = path.join(work, '.writer/plan-input.json');
write(planFile, { unit: 1, title: '没寄出的信', goal: '阿禾查父亲信件的寄件人', change: '多封信编号相同，出现尚未寄出的第三封',
  beats: ['女儿出示父亲死亡证明', '两封信编号重复', '第三封没有邮戳'], cast: ['阿禾', '值班员'], forbidden: ['不揭露真正寄件人'] });
run(['plan', '--project', work, '--input', planFile]);
const packet = run(['context', '--project', work, '--unit', '1']);
fs.copyFileSync(path.join(ROOT, 'examples/novel-opening.md'), path.join(work, '正文/0001-没寄出的信.md'));
const recordFile = path.join(work, '.writer/record-input.json');
write(recordFile, { unit: 1, expected_revision: packet.revision, source_hashes: packet.source_hashes, draft: '正文/0001-没寄出的信.md',
  summary: '阿禾查已故父亲寄来的信，值班员取出同编号的第二封和没有邮戳的第三封。',
  snapshot: { characters: { 阿禾: '在邮局；知道多封信编号重复，不知道寄件人', 值班员: '在邮局；持有第三封信，未说明来源' },
    threads: ['相同编号的原因', '第三封信的寄件人和去向'], timeline: ['第一夜：阿禾在末班车后抵达邮局'] } });
const recorded = run(['record', '--project', work, '--input', recordFile]);
const mechanical = run(['check', '--project', work]);
const exported = run(['export', '--project', work, '--out', path.join(runRoot, '导出')]);
console.log(JSON.stringify({ ok: true, workflow: 'real CLI: init-plan-context-record-check-export', project: work,
  recorded, mechanical, exported, literary_review: 'unreviewed; 匿名示例只验证文件流程' }, null, 2));
