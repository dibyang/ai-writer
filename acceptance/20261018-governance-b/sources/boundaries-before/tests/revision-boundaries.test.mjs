import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { main } from '../lib/workspace.mjs';
import { fixture, state, file, call, evidence, workflow, begin, edit, prepare, commit } from './protection-fixture.mjs';

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
