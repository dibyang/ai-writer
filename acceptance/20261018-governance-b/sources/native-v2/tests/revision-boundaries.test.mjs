import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { main } from '../lib/workspace.mjs';
import { fixture, state, file, call, evidence, workflow, begin, edit, prepare, commit, freeze, publishInput } from './protection-fixture.mjs';

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
