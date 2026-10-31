import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { main } from '../lib/workspace.mjs';
import { fixture, state, file, call, evidence, workflow, begin, edit, prepare, commit, freeze, publishInput, unit } from './protection-fixture.mjs';

test('提交清单对象的哈希继续受保护，不能只验证账本和正文', t => {
  const { root } = fixture(t); workflow(root, true); const branch = begin(root); edit(branch); prepare(root, branch); commit(root, branch);
  const binding = state(root).committed_revisions[0]; file(root, binding.ref, { scope: { from: 999, through: 999 }, fake: true });
  assert.throws(() => main(['check', '--project', root]), e => e.code === 'SOURCE_CORRUPT');
});
test('已发生的锁外主稿修改可经明确授权保守收纳，原追踪及候选分别保留', t => {
  const { root } = fixture(t); workflow(root, true); const ref = '正文/0001.md'; fs.appendFileSync(path.join(root, ref), '已发生的外部编辑。\n');
  const before = fs.readFileSync(path.join(root, ref)), tracked = state(root);
  assert.throws(() => begin(root), e => e.code === 'CONTEXT_CHANGED');
  const branch = call(root, 'revision', 'begin', { expected_revision: tracked.revision, owner: 'explicit-dirty-adoption', from: 1, through: 2, adopt_existing_changes: true, author_evidence: evidence(root) });
  assert.deepEqual(fs.readFileSync(path.join(root, ref)), before); assert.deepEqual(state(root), tracked); assert.deepEqual(fs.readFileSync(path.join(branch.workspace, ref)), before);
  assert.ok(branch.existing_changes.stale_units.includes(1)); edit(branch, '显式收纳后重核'); prepare(root, branch); commit(root, branch); assert.equal(main(['check', '--project', root]).ok, true);
});
test('内部协作目录不能成为正式细纲消费来源，分支路径不发布为作品依赖', t => {
  const { root } = fixture(t, 0), ref = '.writer/transactions/notes.md'; file(root, ref, '内部协作材料');
  assert.throws(() => call(root, 'plan', null, { unit: 1, title: '非法来源', goal: '测试', change: '测试', beats: ['测试'], setting_refs: [ref], research_refs: [], cast: [] }), e => e.code === 'REVISION_PRIVATE_REFERENCE');
});
test('已发布未来版本的入口差异不能误标为未发布编辑', t => {
  const { root } = fixture(t); freeze(root, 'OLD'); call(root, 'source', 'publish', publishInput(root, 'OLD')); file(root, '设定/权威规则.md', '第三章起的新规则'); freeze(root, 'FUTURE'); call(root, 'source', 'publish', publishInput(root, 'FUTURE', 3, 'future'));
  const view = main(['source', 'list', '--project', root, '--unit', '2']); assert.equal(view.pending_edits.length, 0); assert.equal(view.entry_differences[0].status, 'matches-published-version'); assert.equal(view.entry_differences[0].selected_version, 'OLD');
});
test('收纳已有来源漂移必须覆盖最早消费者，不能用新字节追认旧章', t => {
  const { root } = fixture(t); workflow(root, true); const old = state(root), ref = '设定/权威规则.md'; file(root, ref, '已经在锁外改动的规则。');
  const request = { expected_revision: old.revision, owner: 'source-drift', from: 2, through: 2, adopt_existing_changes: true, author_evidence: evidence(root) };
  assert.throws(() => call(root, 'revision', 'begin', request), e => e.code === 'REVISION_SCOPE_INVALID');
  request.from = 1; const branch = call(root, 'revision', 'begin', request); assert.equal(branch.existing_changes.changed_sources[0].unit, 1);
  const base = JSON.parse(fs.readFileSync(path.join(root, `.writer/revisions/${branch.id}/base-state.json`))); assert.deepEqual(base.units.map(u => u.source_hashes), old.units.map(u => u.source_hashes));
  edit(branch, '保守重核全部消费者'); prepare(root, branch); commit(root, branch); assert.notEqual(state(root).units[0].source_hashes[ref], old.units[0].source_hashes[ref]); assert.equal(main(['check', '--project', root]).ok, true);
});
test('声明修订会话范围不得借更宽作者授权越界回退', t => {
  const { root } = fixture(t); workflow(root, true); const branch = call(root, 'revision', 'begin', { expected_revision: state(root).revision, owner: 'narrow-session', from: 2, through: 2 });
  const before = fs.readFileSync(path.join(branch.workspace, '.writer/state.json'));
  assert.throws(() => main(['rewind', '--project', branch.workspace, '--from', '1', '--expected-revision', String(state(branch.workspace).revision), '--revision-token', branch.token]), e => e.code === 'REVISION_SCOPE_INVALID');
  assert.deepEqual(fs.readFileSync(path.join(branch.workspace, '.writer/state.json')), before);
});
test('prepare后随附工具字节漂移也产生可定位冲突，不只检查业务revision', t => {
  const { root } = fixture(t); workflow(root, true); const branch = begin(root); edit(branch); prepare(root, branch); fs.appendFileSync(path.join(root, '.writer/tool/lib/help.mjs'), '\n// outside update\n');
  assert.throws(() => commit(root, branch), e => e.code === 'BASELINE_CONFLICT' && e.conflicts.some(c => c.file === '.writer/tool/lib/help.mjs') && Boolean(e.recovery.conflict_ref));
});
test('历史生效起点与回读前缀分开：从第2章发布不强迫回退已固定的第1章', t => {
  const { root } = fixture(t, 3); freeze(root, 'PRECISE_OLD'); call(root, 'source', 'publish', publishInput(root, 'PRECISE_OLD')); const prefix = structuredClone(state(root).units[0]);
  file(root, '研究/精确新版.md', '第二章起采用新桥规。'); call(root, 'source', 'freeze', { expected_revision: state(root).revision, operation_id: 'precise-freeze', ref: '设定/权威规则.md', file: '研究/精确新版.md', version_id: 'PRECISE_NEW', previous: 'PRECISE_OLD' }); workflow(root, true);
  const w = call(root, 'workflow', 'show').workflow; w.authorization.revise_range = { from: 2, to: 3 }; call(root, 'workflow', 'set', { expected_revision: state(root).revision, operation_id: 'precise-scope', author_evidence: evidence(root), workflow: w });
  const staged = call(root, 'source', 'stage', publishInput(root, 'PRECISE_NEW', 2, 'historical')); assert.equal(staged.blocked_range.from, 2);
  const branch = call(root, 'revision', 'begin', { expected_revision: state(root).revision, owner: 'precise', from: 2, through: 3 });
  main(['rewind', '--project', branch.workspace, '--from', '2', '--expected-revision', String(state(branch.workspace).revision), '--revision-token', branch.token]);
  call(branch.workspace, 'source', 'publish', { expected_revision: state(branch.workspace).revision, operation_id: 'precise-publish', impact_id: staged.impact_id, author_evidence: evidence(branch.workspace) }, branch.token);
  for (let n = 2; n <= 3; n++) {
    // Genuine template and delta registration; unchanged prefix is never replayed.
    const draft = `正文/${String(n).padStart(4, '0')}.md`, template = main(['record-template', '--project', branch.workspace, '--unit', String(n), '--draft', draft]);
    template.summary = `精确范围重核${n}`; template.changes.characters = { 阿禾: `位于第${n}处桥头` }; template.changes.timeline_append = [`交接${n}`]; call(branch.workspace, 'record', null, template, branch.token);
  }
  const report = '审查/精确尾段.md'; file(branch.workspace, report, '# 合成接口复核\n不冒充模型实读。\n'); call(branch.workspace, 'review', null, { from: 2, to: 3, kind: 'model-self-review', report, source_hashes: Object.fromEntries(state(branch.workspace).units.slice(1).map(u => [u.draft, u.sha256])) }, branch.token);
  prepare(root, branch); commit(root, branch); assert.deepEqual(state(root).units[0], prefix); assert.equal(main(['check', '--project', root]).ok, true);
});
test('已消费作者决策保留当时确认依据，撤回后仍有效，消费哈希损坏须拒绝', t => {
  const { root } = fixture(t, 0), decision = { id: 'D_CONSUMED', topic: '旧计划依据', status: 'confirmed', options: ['旧方案'], adopted_items: ['旧方案'], excluded_items: [], unresolved_items: [], effective_range: { from: 1, to: 10 } };
  call(root, 'decision', 'set', { expected_revision: state(root).revision, operation_id: 'consume-confirm', author_evidence: evidence(root), decision }); unit(root, 1);
  const bound = structuredClone(state(root).units[0].decision_bindings); assert.equal(bound[0].id, decision.id);
  call(root, 'decision', 'set', { expected_revision: state(root).revision, operation_id: 'consume-withdraw', author_evidence: evidence(root), decision: { ...decision, status: 'withdrawn', adopted_items: [] } });
  assert.equal(main(['check', '--project', root]).ok, true); assert.deepEqual(state(root).units[0].decision_bindings, bound);
  const corrupt = state(root); corrupt.units[0].decision_bindings[0].event_sha256 = '0'.repeat(64); file(root, '.writer/state.json', corrupt);
  assert.throws(() => main(['check', '--project', root]), e => e.code === 'SOURCE_CORRUPT');
});
test('登记的历史授权事件哈希必须校验，不能只校验当前阶段', t => {
  const { root } = fixture(t, 1), corrupt = state(root); corrupt.units[0].authorization.event.sha256 = '0'.repeat(64); file(root, '.writer/state.json', corrupt);
  assert.throws(() => main(['check', '--project', root]), e => e.code === 'SOURCE_CORRUPT');
});
