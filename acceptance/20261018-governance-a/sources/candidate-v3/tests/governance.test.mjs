import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { ROOT, initProject, main } from '../lib/workspace.mjs';
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const CLI = path.join(ROOT, 'bin/ai-writer.mjs');
function raw(root, args, script = CLI) { return spawnSync(process.execPath, [script, ...args, '--project', root], { encoding: 'utf8', windowsHide: true }); }
function cli(root, args, script) { const r = raw(root, args, script); assert.equal(r.status, 0, r.stderr); return JSON.parse(r.stdout); }
function denied(root, args, code) { const r = raw(root, args); assert.equal(r.status, 2, r.stderr); const e = JSON.parse(r.stderr); if (code) assert.equal(e.code, code, e.error); return e; }
function state(root) { return fs.readFileSync(path.join(root, '.writer/state.json')); }
function file(root, ref, body) { fs.mkdirSync(path.dirname(path.join(root, ref)), { recursive: true }); fs.writeFileSync(path.join(root, ref), typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body)); }
function fixture(t, legacy = false, kind = 'novel') {
  const tmp = path.join(ROOT, '.tmp'); fs.mkdirSync(tmp, { recursive: true }); const dir = fs.mkdtempSync(path.join(tmp, 'governance-')), root = path.join(dir, '中文 空格作品');
  t.after(() => { assert.equal(path.dirname(fs.realpathSync(dir)), fs.realpathSync(tmp)); fs.rmSync(dir, { recursive: true, force: true }); });
  if (legacy) initProject(root, kind, '兼容测试', { legacy: true });
  else { const r = spawnSync(process.execPath, [CLI, 'init', '--path', root, '--kind', kind, '--title', '治理测试'], { encoding: 'utf8' }); assert.equal(r.status, 0, r.stderr); }
  file(root, '研究/作者要求.md', '作者测试指令：只按逐项选择；允许试写第一至六章，之后暂停正文，先讨论总纲；青岚宗方向，炼器先行，小盾只是推荐尚未选。允许在测试作品显式迁移。');
  return { root, dir };
}
let serial = 0;
function input(root, payload) {
  const body = fs.readFileSync(path.join(root, '研究/作者要求.md'));
  return { expected_revision: JSON.parse(state(root)).revision, operation_id: `test-${++serial}`, author_evidence: { quote: '只按逐项选择', local_source: '研究/作者要求.md', source_sha256: sha(body), locator: '测试夹具第1行；不是真实作者会话', recorded_by: 'automated-test' }, ...payload };
}
function submit(root, command, value) { const ref = `.writer/test-input-${serial}.json`; file(root, ref, value); return cli(root, [command, 'set', '--input', path.join(root, ref)]); }
function authorize(root, { stage = 'trial', from = 1, to = 6, actions = ['discuss', 'plan', 'draft'], revise = null } = {}) {
  const w = cli(root, ['workflow', 'show']).governance; delete w.enabled; delete w.decisions; delete w.note;
  w.stage = stage; w.task = stage === 'structure' ? '暂停正文，先讨论总纲' : '有限试写，范围结束复盘';
  w.authorization = { allowed_actions: actions, draft_range: actions.includes('draft') ? { from, to } : null, revise_range: revise, stop_conditions: ['到试写末章暂停并复盘'] };
  return submit(root, 'workflow', input(root, { workflow: w }));
}
function chapter(root, unit) {
  const plan = path.join(root, '.writer/test-plan.json'); file(root, '.writer/test-plan.json', { unit, title: `试写${unit}`, goal: '核对送信安排', change: `得到第${unit}项新信息`, beats: ['核对'] });
  cli(root, ['plan', '--input', plan]); const item = cli(root, ['record-template', '--unit', String(unit), '--draft', `正文/${String(unit).padStart(4, '0')}.md`]);
  file(root, item.draft, `# 第${unit}章\n\n阿禾核对第${unit}张收据后收好纸页。\n`); item.summary = `核对第${unit}张收据`; item.changes.timeline_append = [`第${unit}日核对`];
  file(root, '.writer/test-record.json', item); return cli(root, ['record', '--input', path.join(root, '.writer/test-record.json')]);
}
function d(id, topic, status, adopted_items, unresolved_items = []) { return { id, topic, status, options: ['候选方向，仅供讨论'], adopted_items, excluded_items: [], unresolved_items, effective_range: { from: 1, to: null } }; }

test('新作品默认治理：讨论无需细纲，正文/模板/登记未授权不能写', t => {
  const { root } = fixture(t); assert.equal(JSON.parse(state(root)).schema_version, 3);
  const before = state(root), discussion = cli(root, ['context', '--purpose', 'discussion']); assert.equal(discussion.next_unit, 1); assert.equal(discussion.governance.enabled, true);
  denied(root, ['context', '--unit', '1'], 'ACTION_OUT_OF_SCOPE'); denied(root, ['record-template', '--unit', '1', '--draft', '正文/0001.md'], 'ACTION_OUT_OF_SCOPE');
  file(root, '.writer/no-record.json', { unit: 1 }); denied(root, ['record', '--input', path.join(root, '.writer/no-record.json')], 'ACTION_OUT_OF_SCOPE'); assert.deepEqual(state(root), before);
});
test('六章后暂停：compact/full均保留next_unit=7，行动转总纲，讨论不需第七章细纲', t => {
  const { root } = fixture(t); authorize(root); for (let unit = 1; unit <= 6; unit++) chapter(root, unit);
  authorize(root, { stage: 'structure', actions: ['discuss', 'plan'] }); const before = state(root);
  for (const view of ['compact', 'full']) { const s = cli(root, ['status', '--view', view]); assert.equal(s.next_unit, 7); assert.match(s.next.action, /暂停正文.*总纲/); assert.doesNotMatch(s.next.command, /--unit/); }
  const c = cli(root, ['context', '--purpose', 'discussion']); assert.equal(c.next_unit, 7); assert.match(c.instruction, /未授权正文时不写/);
  denied(root, ['context', '--unit', '7'], 'ACTION_OUT_OF_SCOPE'); file(root, '.writer/no-record.json', { unit: 7 }); denied(root, ['record', '--input', path.join(root, '.writer/no-record.json')], 'ACTION_OUT_OF_SCOPE');
  assert.deepEqual(state(root), before); assert.equal(fs.existsSync(path.join(root, '大纲/单元/0007.json')), false);
});
test('有限试写完成后复盘；deferred须有范围与条件；空大纲不等于采纳', t => {
  const { root } = fixture(t); authorize(root, { to: 1 }); chapter(root, 1); assert.match(cli(root, ['status']).next.action, /复盘/);
  const w = cli(root, ['workflow', 'show']).governance; delete w.enabled; delete w.decisions; delete w.note;
  w.authorization.draft_range = null; const value = input(root, { workflow: w }); file(root, '.writer/invalid.json', value);
  const before = state(root); denied(root, ['workflow', 'set', '--input', path.join(root, '.writer/invalid.json')], 'INVALID_INPUT'); assert.deepEqual(state(root), before);
  denied(root, ['context', '--unit', '2'], 'ACTION_OUT_OF_SCOPE');
});
test('规划中仅授权修订：回退与重登不能借机续写', t => {
  const { root } = fixture(t); authorize(root, { to: 1 }); chapter(root, 1);
  authorize(root, { stage: 'structure', actions: ['discuss', 'plan', 'revise'], revise: { from: 1, to: 1 } }); const revision = JSON.parse(state(root)).revision;
  cli(root, ['rewind', '--from', '1', '--expected-revision', String(revision)]);
  chapter(root, 1); denied(root, ['context', '--unit', '2'], 'ACTION_OUT_OF_SCOPE');
});
test('逐项采纳和新会话恢复：宗门/炼器已选，小盾与附带数字仍未决', t => {
  const { root } = fixture(t);
  submit(root, 'decision', input(root, { decision: d('D_SECT', '宗门方向', 'confirmed', ['青岚宗方向'], ['经名', '住舍人数', '作息数字']) }));
  submit(root, 'decision', input(root, { decision: d('D_ART', '技艺路线', 'confirmed', ['炼器先行']) }));
  submit(root, 'decision', input(root, { decision: d('D_OBJECT', '首件法器', 'candidate', [], ['小盾仅推荐，尚未选']) }));
  const c = cli(root, ['context', '--purpose', 'discussion']); assert.equal(c.governance.decisions.current.length, 2); assert.equal(c.governance.decisions.candidates.length, 1);
  assert.deepEqual(c.governance.decisions.current.find(x => x.id === 'D_SECT').adopted_items, ['青岚宗方向']);
  assert.equal(c.governance.decisions.candidates[0].status, 'candidate'); assert.match(JSON.stringify(c.governance.decisions.candidates), /尚未选/);
  file(root, '设定/当前选择.md', '小盾已经选定（刻意错误的派生视图）'); assert.deepEqual(cli(root, ['decision', 'current']).decisions, c.governance.decisions);
});
test('取代保留历史；悬空/自环/双重确认被拒绝，原话对象可核', t => {
  const { root } = fixture(t), old = d('D_OLD', '宗门方向', 'confirmed', ['旧方向']); submit(root, 'decision', input(root, { decision: old }));
  const fresh = { ...d('D_NEW', '宗门方向', 'confirmed', ['青岚宗方向']), supersedes: 'D_OLD' }; submit(root, 'decision', input(root, { decision: fresh }));
  const all = cli(root, ['decision', 'list']); assert.equal(all.decisions.D_OLD.status, 'superseded'); assert.equal(cli(root, ['decision', 'current']).decisions.current[0].id, 'D_NEW');
  const event = JSON.parse(fs.readFileSync(path.join(root, all.decisions.D_NEW.event_ref))); assert.equal(sha(fs.readFileSync(path.join(root, event.evidence.frozen_ref))), event.evidence.source_sha256);
  for (const bad of [{ ...fresh, id: 'D_LOOP', supersedes: 'D_LOOP' }, { ...fresh, id: 'D_MISSING', supersedes: 'MISSING' }, d('D_DUP', '宗门方向', 'confirmed', ['另一个方向'])]) {
    const v = input(root, { decision: bad }); file(root, '.writer/bad.json', v); const before = state(root); denied(root, ['decision', 'set', '--input', path.join(root, '.writer/bad.json')], 'DECISION_CONFLICT'); assert.deepEqual(state(root), before);
  }
});
test('原话与哈希必须匹配；不存在的会话ID和未知字段不能伪造', t => {
  const { root } = fixture(t); const v = input(root, { decision: d('D1', '选择', 'confirmed', ['方向']) }); v.author_evidence.quote = '文件中不存在的原话';
  file(root, '.writer/bad.json', v); const before = state(root); denied(root, ['decision', 'set', '--input', path.join(root, '.writer/bad.json')], 'AUTHOR_EVIDENCE_MISMATCH');
  v.author_evidence.quote = '只按逐项选择'; v.author_evidence.message_id = 'made-up'; file(root, '.writer/bad.json', v); denied(root, ['decision', 'set', '--input', path.join(root, '.writer/bad.json')], 'INVALID_INPUT'); assert.deepEqual(state(root), before);
});
test('作者证据冻结后入口可追加；冻结对象损坏不能悄悄接受', t => {
  const { root } = fixture(t); const v = input(root, { decision: d('D1', '选择', 'confirmed', ['方向']) }); submit(root, 'decision', v);
  fs.appendFileSync(path.join(root, '研究/作者要求.md'), '\n后来讨论'); assert.equal(cli(root, ['status']).governance.enabled, true);
  const binding = JSON.parse(state(root)).governance_events[0], event = JSON.parse(fs.readFileSync(path.join(root, binding.ref))); file(root, event.evidence.frozen_ref, '破坏原话'); denied(root, ['status'], 'GOVERNANCE_CORRUPT');
});
test('阶段/决策CAS及幂等重放：旧模板不能在授权变化后登记', t => {
  const { root } = fixture(t); authorize(root, { to: 1 }); const v = input(root, { decision: d('D1', '选择', 'confirmed', ['方向']) });
  const r = submit(root, 'decision', v), before = state(root); assert.equal(submit(root, 'decision', v).unchanged, true); assert.deepEqual(state(root), before);
  v.decision.adopted_items = ['不同方向']; file(root, '.writer/reused.json', v); denied(root, ['decision', 'set', '--input', path.join(root, '.writer/reused.json')], 'OPERATION_CONFLICT'); assert.equal(JSON.parse(state(root)).revision, r.revision);
  file(root, '.writer/plan.json', { unit: 1, title: '收据', goal: '核对', change: '有进展', beats: ['核对'] }); cli(root, ['plan', '--input', path.join(root, '.writer/plan.json')]);
  const pending = cli(root, ['record-template', '--unit', '1', '--draft', '正文/0001.md']); file(root, pending.draft, '她核对了收据。'); pending.summary = '核对收据';
  submit(root, 'decision', input(root, { decision: d('D2', '另一选择', 'candidate', [], ['待选']) }));
  file(root, '.writer/pending.json', pending); const staleBefore = state(root); const error = denied(root, ['record', '--input', path.join(root, '.writer/pending.json')]); assert.match(error.error, /修订号/); assert.deepEqual(state(root), staleBefore);
});
for (const legacySchema of [1, 2]) test(`schema ${legacySchema}迁移预览只读，应用保留事实、备份与旧来源`, t => {
  const { root } = fixture(t, true); if (legacySchema === 2) main(['long-enable', '--project', root, '--expected-revision', '0']);
  const before = state(root); assert.equal(cli(root, ['governance', 'preview']).schema_version, legacySchema); assert.deepEqual(state(root), before);
  const v = input(root, {}); file(root, '.writer/migrate.json', v); const r = cli(root, ['governance', 'migrate', '--input', path.join(root, '.writer/migrate.json')]);
  assert.deepEqual(fs.readFileSync(path.join(root, r.backup)), Buffer.from(JSON.stringify(JSON.parse(before), null, 2) + '\n'));
  const after = JSON.parse(state(root)); assert.equal(after.schema_version, 3); assert.deepEqual(after.snapshot, JSON.parse(before).snapshot); assert.deepEqual(after.units, []);
  assert.equal(cli(root, ['governance', 'migrate', '--input', path.join(root, '.writer/migrate.json')]).unchanged, true);
});
for (const legacySchema of [1, 2]) test(`非空schema ${legacySchema}迁移保留原章及事实，之后可正式续写`, t => {
  const { root } = fixture(t, true);
  if (legacySchema === 2) {
    main(['long-enable', '--project', root, '--expected-revision', '0']); file(root, '.writer/volume.json', { id: 'V1', title: '测试', start: 1, end: 2, promises: [], constraints: [], reserved: [], arcs: [{ id: 'A1', start: 1, end: 2, goal: '核对', payoff: '有进展', forbidden: [] }] }); cli(root, ['volume', '--input', path.join(root, '.writer/volume.json')]);
  }
  file(root, '.writer/plan.json', { unit: 1, title: '收据', goal: '核对', change: '有进展', beats: ['核对'] }); cli(root, ['plan', '--input', path.join(root, '.writer/plan.json')]);
  const item = cli(root, ['record-template', '--unit', '1', '--draft', '正文/0001.md']); file(root, item.draft, '她收好了原件。'); item.summary = '原件收妥';
  if (legacySchema === 1) item.snapshot = { characters: { 阿禾: '保管原件' }, threads: ['待查'], timeline: ['第一天收好原件'] }; else item.changes = { characters: { 阿禾: '保管原件' }, timeline_append: ['第一天收好原件'], ledger: {} };
  file(root, '.writer/record.json', item); cli(root, ['record', '--input', path.join(root, '.writer/record.json')]); const before = JSON.parse(state(root)), body = fs.readFileSync(path.join(root, item.draft));
  const migration = input(root, {}); file(root, '.writer/migrate.json', migration); cli(root, ['governance', 'migrate', '--input', path.join(root, '.writer/migrate.json')]);
  const after = JSON.parse(state(root)); assert.deepEqual(after.snapshot, before.snapshot); assert.deepEqual(after.units[0].source_hashes, before.units[0].source_hashes); assert.equal(after.units[0].sha256, before.units[0].sha256); assert.deepEqual(fs.readFileSync(path.join(root, item.draft)), body); assert.equal(cli(root, ['check']).ok, true);
  authorize(root, { from: 2, to: 2 }); chapter(root, 2); assert.equal(cli(root, ['check']).units, 2);
});
test('旧工具夹具逐字节来自冻结清单，兼容测试不依赖浅克隆历史', () => {
  const dir = path.join(ROOT, 'tests/fixtures/tool-0.3'), m = JSON.parse(fs.readFileSync(path.join(dir, 'source-manifest.json')));
  for (const row of m.files) assert.equal(sha(fs.readFileSync(path.join(dir, row.file))), row.sha256);
});
test('只读构建：同版本不同模块可见，重复识别稳定，副本完整性与profile可核', t => {
  const { root } = fixture(t); const before = state(root), first = cli(root, ['tool', 'identify']), second = cli(root, ['tool', 'identify']);
  assert.equal(first.ok, true); assert.equal(first.observed_content_id, second.observed_content_id); assert.equal(first.profile, 'workspace-copy');
  fs.appendFileSync(path.join(root, '.writer/tool/lib/help.mjs'), '\n// local customization\n');
  const compare = cli(root, ['tool', 'compare', '--other', ROOT]); assert.equal(compare.same_version, true); assert.equal(compare.same_content, false); assert.match(compare.conclusion, /版本号相同.*构建内容不同/); assert.ok(compare.differences.some(x => x.file === 'lib/help.mjs'));
  assert.equal(compare.left.ok, false); assert.deepEqual(state(root), before);
});
test('随附新工具可独立恢复schema3，旧0.3解析器明确拒绝且不改状态', t => {
  const { root, dir } = fixture(t); const embedded = path.join(root, '.writer/tool/bin/ai-writer.mjs'); assert.equal(cli(root, ['status'], embedded).schema_version, 3);
  // Run the actual checked-in old module chain from the last delivered commit, not a mock rejection.
  const old = path.join(dir, 'old-tool'); fs.cpSync(path.join(ROOT, 'tests/fixtures/tool-0.3'), old, { recursive: true });
  const before = state(root), r = raw(root, ['status'], path.join(old, 'bin/ai-writer.mjs')); assert.equal(r.status, 2); assert.match(r.stderr, /追踪状态损坏/); assert.deepEqual(state(root), before);
});
