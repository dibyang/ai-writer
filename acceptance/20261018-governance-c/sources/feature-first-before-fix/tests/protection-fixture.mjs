import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { ROOT, initProject, main } from '../lib/workspace.mjs';
export { ROOT };
export const sha = x => crypto.createHash('sha256').update(x).digest('hex');
export const state = root => JSON.parse(fs.readFileSync(path.join(root, '.writer/state.json')));
export function file(root, ref, content) { const target = path.join(root, ref); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, typeof content === 'string' ? content : JSON.stringify(content, null, 2) + '\n'); return target; }
let sequence = 0;
export function call(root, command, action, input, token) {
  const argv = [command, ...(action ? [action] : []), '--project', root];
  if (input) argv.push('--input', file(root, `.writer/test-input-${++sequence}.json`, input));
  if (token) argv.push('--revision-token', token); return main(argv);
}
export function evidence(root) { const local_source = '研究/验证授权.md'; return { local_source, source_sha256: sha(fs.readFileSync(path.join(root, local_source))), quote: '允许独立验证作品在规定范围内试写、修订、版本发布和中断恢复。', locator: 'synthetic-test-only', recorded_by: 'test-fixture' }; }
export function workflow(root, revise = false) {
  const w = call(root, 'workflow', 'show').workflow;
  w.stage = revise ? 'revision' : 'trial'; w.task = revise ? '验证专用尾段修订' : '验证专用有限试写';
  w.authorization = { allowed_actions: ['discuss', 'plan', revise ? 'revise' : 'draft'], draft_range: revise ? null : { from: 1, to: 10 }, revise_range: revise ? { from: 1, to: Math.max(1, state(root).units.length) } : null, stop_conditions: ['到范围末尾停止'] };
  return call(root, 'workflow', 'set', { expected_revision: state(root).revision, operation_id: `workflow-${++sequence}`, author_evidence: evidence(root), workflow: w });
}
export function unit(root, n, token, suffix = '') {
  const draft = `正文/${String(n).padStart(4, '0')}.md`;
  call(root, 'plan', null, { unit: n, title: `第${n}章`, goal: '核实交接', change: '更新行动', beats: ['交接铜片'], cast: ['阿禾'], setting_refs: [], research_refs: [] }, token);
  const template = main(['record-template', '--project', root, '--unit', String(n), '--draft', draft]);
  file(root, draft, `# 第${n}章\n\n${n === 1 ? '林衡把铜片交给阿禾。' : `阿禾带着铜片走到第${n}处桥头。`}\n${suffix}\n`);
  template.summary = `阿禾完成第${n}次交接核实${suffix}`; template.changes.characters = { 阿禾: `位于第${n}处桥头` }; template.changes.timeline_append = [`交接${n}`];
  if (n === 1) template.changes.ledger = { O_COPPER: { type: 'object', statement: '铜片由阿禾保管', status: 'active', custody: { holder: '阿禾', location: '布包', condition: '完好' }, cast: ['阿禾'], tags: ['铜片'], evidence: [{ unit: 1, quote: '林衡把铜片交给阿禾。' }] } };
  return call(root, 'record', null, template, token);
}
export function fixture(t, units = 2, kind = 'novel') {
  const tmp = path.join(ROOT, '.tmp'); fs.mkdirSync(tmp, { recursive: true }); const dir = fs.mkdtempSync(path.join(tmp, 'protection-')), root = path.join(dir, 'work');
  t.after(() => { assert.equal(path.dirname(fs.realpathSync(dir)), fs.realpathSync(tmp)); fs.rmSync(dir, { recursive: true, force: true }); });
  initProject(root, kind, '独立验证'); file(root, '研究/验证授权.md', '允许独立验证作品在规定范围内试写、修订、版本发布和中断恢复。\n这是合成测试材料，不冒充实际作者逐条确认。\n'); workflow(root);
  for (let n = 1; n <= units; n++) unit(root, n); return { root, dir };
}
export function sourceInput(root, extra) { return { expected_revision: state(root).revision, operation_id: `source-${++sequence}`, ...extra }; }
export function freeze(root, version_id, ref = '设定/权威规则.md', token) { return call(root, 'source', 'freeze', sourceInput(root, { ref, version_id }), token); }
export function publishInput(root, id, from = 1, mode = 'baseline') {
  const impact = call(root, 'source', 'impact', { version_id: id, from, mode }).impact;
  const report = `审查/影响-${++sequence}.md`; file(root, report, '# 合成接口测试报告\n\n仅验证哈希、依赖和流程，不代表模型实读或文学验收。\n');
  return sourceInput(root, { author_evidence: evidence(root), impact, review: { report, report_sha256: sha(fs.readFileSync(path.join(root, report))), readings: impact.required_readings, conclusion: '合成测试声明，仅用于结构校验', unresolved: [] } });
}
export function begin(root, parallel = false) { return call(root, 'revision', 'begin', { expected_revision: state(root).revision, owner: `test-${++sequence}`, from: 1, through: state(root).units.length, parallel_candidate: parallel }); }
export function rewindBranch(branch) { return main(['rewind', '--project', branch.workspace, '--from', '1', '--expected-revision', String(state(branch.workspace).revision), '--revision-token', branch.token]); }
export function review(branch) {
  const s = state(branch.workspace), report = `审查/尾段-${++sequence}.md`; file(branch.workspace, report, '# 合成流程复核\n\n仅测试最终正文和依赖绑定，不冒充实际模型阅读。\n');
  return call(branch.workspace, 'review', null, { from: 1, to: s.units.length, kind: 'model-self-review', report, source_hashes: Object.fromEntries(s.units.map(u => [u.draft, u.sha256])) }, branch.token);
}
export function edit(branch, suffix = '候选修改') { const count = state(branch.workspace).units.length; rewindBranch(branch); for (let n = 1; n <= count; n++) unit(branch.workspace, n, branch.token, suffix); review(branch); }
export function prepare(root, branch) { return call(root, 'revision', 'prepare', { id: branch.id, token: branch.token }); }
export function commit(root, branch) { return call(root, 'revision', 'commit', { id: branch.id, token: branch.token }); }
