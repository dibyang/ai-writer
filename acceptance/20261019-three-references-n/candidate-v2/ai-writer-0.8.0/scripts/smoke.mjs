import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
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
const author = '合成 smoke 验证指令：只允许本测试副本试写第1章，完成后停止并复盘；样例仅验证文件流程，不代表真实作者定稿。';
fs.writeFileSync(path.join(work, '.writer/smoke-author.txt'), author, 'utf8');
const current = run(['workflow', 'show', '--project', work]);
current.workflow.stage = 'trial'; current.workflow.task = '仅重放本测试副本第1章，完成后复盘';
current.workflow.authorization = { allowed_actions: ['discuss', 'plan', 'draft'], draft_range: { from: 1, to: 1 }, revise_range: null, stop_conditions: ['第一章完成后复盘'] };
const workflowFile = path.join(work, '.writer/smoke-workflow.json');
write(workflowFile, { expected_revision: current.revision, operation_id: 'smoke-trial', workflow: current.workflow,
  author_evidence: { quote: author, local_source: '.writer/smoke-author.txt', source_sha256: crypto.createHash('sha256').update(author).digest('hex'), locator: '本 smoke 合成测试指令第1行', recorded_by: 'smoke synthetic fixture' } });
run(['workflow', 'set', '--project', work, '--input', workflowFile]);
const planFile = path.join(work, '.writer/plan-input.json');
write(planFile, { unit: 1, title: '没寄出的信', goal: '阿禾查父亲信件的寄件人', change: '多封信编号相同，出现尚未寄出的第三封',
  beats: ['女儿出示父亲死亡证明', '两封信编号重复', '第三封没有邮戳'], cast: ['阿禾', '值班员'], forbidden: ['不揭露真正寄件人'] });
run(['plan', '--project', work, '--input', planFile]);
const packet = run(['context', '--project', work, '--unit', '1']);
const template = run(['record-template', '--project', work, '--unit', '1', '--draft', '正文/0001-没寄出的信.md']);
if (JSON.stringify(packet.source_hashes) !== JSON.stringify(template.source_hashes)) throw new Error('template/context sources differ');
fs.copyFileSync(path.join(ROOT, 'examples/novel-opening.md'), path.join(work, '正文/0001-没寄出的信.md'));
const recordFile = path.join(work, '.writer/record-input.json');
write(recordFile, { ...template,
  summary: '阿禾查已故父亲寄来的信，值班员取出同编号的第二封和没有邮戳的第三封。',
  changes: { characters: { 阿禾: '在邮局；知道多封信编号重复，不知道寄件人', 值班员: '在邮局；持有第三封信，未说明来源' },
    threads: ['相同编号的原因', '第三封信的寄件人和去向'], timeline_append: ['第一夜：阿禾在末班车后抵达邮局'], ledger: {} } });
const recorded = run(['record', '--project', work, '--input', recordFile]);
const mechanical = run(['check', '--project', work]);
const exported = run(['export', '--project', work, '--out', path.join(runRoot, '导出')]);
console.log(JSON.stringify({ ok: true, workflow: 'real CLI: init-workflow-plan-context-template-changes-record-check-export', project: work,
  recorded, mechanical, exported, literary_review: 'unreviewed; 匿名示例只验证文件流程' }, null, 2));
