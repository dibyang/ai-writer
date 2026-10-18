import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { main } from '../lib/workspace.mjs';
import { fixture, state, file, call, evidence, workflow, unit, freeze, publishInput, sourceInput, begin, edit, prepare, commit, rewindBranch, review, sha, ROOT } from './protection-fixture.mjs';
const fails = (fn, code) => assert.throws(fn, e => e.code === code);

test('默认schema4且真实旧0.4解析器拒绝，原状态不变', t => {
  const { root } = fixture(t, 0), before = fs.readFileSync(path.join(root, '.writer/state.json')); assert.equal(state(root).schema_version, 4);
  const old = path.join(ROOT, 'acceptance/20261018-governance-b/fixtures/tool-0.4/bin/ai-writer.mjs');
  const r = spawnSync(process.execPath, [old, 'status', '--project', root], { encoding: 'utf8' }); assert.equal(r.status, 2); assert.deepEqual(fs.readFileSync(path.join(root, '.writer/state.json')), before);
});
test('固定旧版本后未来新增不废旧章，下一章消费新版本及冻结输入', t => {
  const { root } = fixture(t, 2), oldHashes = state(root).units.map(u => u.source_hashes);
  freeze(root, 'RULE1'); call(root, 'source', 'publish', publishInput(root, 'RULE1'));
  const oldBinding = state(root).units[0].source_bindings['设定/权威规则.md'];
  file(root, '设定/权威规则.md', '# 权威规则\n\n第三章起可使用桥亭。\n'); freeze(root, 'RULE2'); const input = publishInput(root, 'RULE2', 3, 'future'); call(root, 'source', 'publish', input);
  assert.equal(main(['check', '--project', root]).ok, true); assert.deepEqual(state(root).units.map(u => u.source_hashes), oldHashes);
  assert.equal(state(root).units[0].source_bindings['设定/权威规则.md'].version_id, oldBinding.version_id);
  unit(root, 3); assert.equal(state(root).units[2].source_bindings['设定/权威规则.md'].version_id, 'RULE2');
  const object = state(root).source_versions.RULE1.object_ref; file(root, object, '篡改冻结对象'); fails(() => main(['check', '--project', root]), 'SOURCE_CORRUPT');
});
test('不能将当前变化的来源追认为旧输入，旧未绑定消费者仍阻断', t => {
  const { root } = fixture(t), old = state(root).units[0].source_hashes['设定/权威规则.md'];
  file(root, '设定/权威规则.md', '新的规则'); freeze(root, 'CHANGED');
  fails(() => call(root, 'source', 'publish', publishInput(root, 'CHANGED')), 'SOURCE_BIND_MISMATCH');
  fails(() => call(root, 'source', 'publish', publishInput(root, 'CHANGED', 3, 'future')), 'SOURCE_UNBOUND_CONSUMERS');
  assert.equal(state(root).units[0].source_hashes['设定/权威规则.md'], old); assert.equal(main(['check', '--project', root]).ok, false);
});
test('从真实旧字节补绑保留原哈希，影响预览只读且过期/未决报告不发布', t => {
  const { root } = fixture(t); freeze(root, 'V1'); const input = publishInput(root, 'V1'); const before = fs.readFileSync(path.join(root, '.writer/state.json'));
  call(root, 'source', 'impact', { version_id: 'V1', from: 1, mode: 'baseline' }); assert.deepEqual(fs.readFileSync(path.join(root, '.writer/state.json')), before);
  const unresolved = structuredClone(input); unresolved.review.unresolved = ['需重读']; fails(() => call(root, 'source', 'publish', unresolved), 'IMPACT_UNRESOLVED');
  workflow(root); fails(() => call(root, 'source', 'publish', { ...input, expected_revision: state(root).revision }), 'IMPACT_STALE');
});
test('会话隔离、旁路写拒绝、错误所有者拒绝；命令恢复不刷新基线', t => {
  const { root } = fixture(t); workflow(root, true); const before = fs.readFileSync(path.join(root, '.writer/state.json')), branch = begin(root);
  fails(() => begin(root), 'REVISION_OCCUPIED'); fails(() => workflow(root), 'REVISION_OCCUPIED');
  fails(() => call(branch.workspace, 'workflow', 'set', {}), 'REVISION_OWNER_REQUIRED');
  fails(() => call(root, 'revision', 'resume', { id: branch.id, token: 'wrong' }), 'REVISION_OWNER_REQUIRED');
  assert.equal(call(root, 'revision', 'resume', { id: branch.id, token: branch.token }).base_revision, state(root).revision);
  edit(branch); assert.deepEqual(fs.readFileSync(path.join(root, '.writer/state.json')), before); assert.notEqual(state(branch.workspace).units[0].sha256, state(root).units[0].sha256);
  prepare(root, branch); const r = commit(root, branch); assert.equal(r.revision, JSON.parse(before).revision + 1); assert.equal(state(root).snapshot.ledger.O_COPPER.custody.holder, '阿禾'); assert.equal(main(['check', '--project', root]).ok, true);
  assert.equal(commit(root, branch).unchanged, true);
});
test('并行候选A提交后B全局CAS冲突，双方稿件保留', t => {
  const { root } = fixture(t); workflow(root, true); const a = begin(root), b = begin(root, true); edit(a, '甲候选'); edit(b, '乙候选'); prepare(root, a); prepare(root, b); commit(root, a);
  fails(() => commit(root, b), 'BASELINE_CONFLICT'); assert.match(fs.readFileSync(path.join(root, '正文/0001.md'), 'utf8'), /甲候选/); assert.match(fs.readFileSync(path.join(b.workspace, '正文/0001.md'), 'utf8'), /乙候选/);
  call(root, 'revision', 'abort', { id: b.id, token: b.token, reason: '保留冲突候选另建会话' }); assert.equal(main(['check', '--project', root]).ok, true);
});
test('prepare后锁外改候选被拒绝；主稿第三方字节冲突不覆盖', t => {
  const { root } = fixture(t); workflow(root, true); const branch = begin(root); edit(branch); prepare(root, branch); file(branch.workspace, '正文/0001.md', '准备后外部修改'); fails(() => commit(root, branch), 'REVISION_CANDIDATE_CHANGED');
  file(root, '正文/0001.md', '主稿外部修改'); fails(() => commit(root, branch), 'BASELINE_CONFLICT'); assert.equal(fs.readFileSync(path.join(root, '正文/0001.md'), 'utf8'), '主稿外部修改');
});
test('历史影响stage持久阻断，取消保留版本及历史，不伪造已修复', t => {
  const { root } = fixture(t); freeze(root, 'OLD'); call(root, 'source', 'publish', publishInput(root, 'OLD')); file(root, '设定/权威规则.md', '第二章起修订桥规'); freeze(root, 'NEW'); workflow(root, true);
  const staged = call(root, 'source', 'stage', publishInput(root, 'NEW', 2, 'historical'));
  assert.equal(main(['check', '--project', root]).ok, false); fails(() => main(['export', '--project', root, '--out', path.join(path.dirname(root), 'out')]), 'IMPACT_PENDING');
  assert.equal(call(root, 'source', 'list').impact_pending.length, 1);
  call(root, 'source', 'cancel', sourceInput(root, { impact_id: staged.impact_id, reason: '合成测试取消未生效方案', author_evidence: evidence(root) }));
  assert.equal(state(root).source_ranges.length, 1); assert.ok(state(root).source_versions.NEW); assert.equal(main(['check', '--project', root]).ok, true);
});
test('实际进程提交中断：普通读写拒绝，明确授权处理遗留锁后完整恢复', t => {
  const { root } = fixture(t); workflow(root, true); const branch = begin(root); edit(branch); prepare(root, branch);
  const input = file(root, '.writer/crash-input.json', { id: branch.id, token: branch.token });
  const r = spawnSync(process.execPath, [path.join(ROOT, 'bin/ai-writer.mjs'), 'revision', 'commit', '--project', root, '--input', input], { env: { ...process.env, AI_WRITER_TEST_FAULT: '1', AI_WRITER_TEST_STOP_AFTER: '1' }, encoding: 'utf8' }); assert.equal(r.status, 91);
  fails(() => main(['status', '--project', root]), 'TRANSACTION_PENDING'); const tx = call(root, 'revision', 'list').transactions.find(x => x.status === 'applying'); assert.ok(tx);
  fails(() => call(root, 'revision', 'recover', { transaction_id: tx.id, token: branch.token, direction: 'complete' }), 'RECOVERY_LOCK_AUTH_REQUIRED');
  const recovered = call(root, 'revision', 'recover', { transaction_id: tx.id, token: branch.token, direction: 'complete', lock_sha256: sha(fs.readFileSync(path.join(root, '.writer/write.lock'))), author_evidence: evidence(root) });
  assert.equal(recovered.status, 'completed'); assert.equal(main(['check', '--project', root]).ok, true);
});
test('中断恢复遇第三方字节保留三方，并可在未改目标时回滚原集', t => {
  const { root } = fixture(t); workflow(root, true); const original = fs.readFileSync(path.join(root, '.writer/state.json')), branch = begin(root); edit(branch); prepare(root, branch);
  const input = file(root, '.writer/crash-input.json', { id: branch.id, token: branch.token });
  assert.equal(spawnSync(process.execPath, [path.join(ROOT, 'bin/ai-writer.mjs'), 'revision', 'commit', '--project', root, '--input', input], { env: { ...process.env, AI_WRITER_TEST_FAULT: '1', AI_WRITER_TEST_STOP_AFTER: '1' } }).status, 91);
  const tx = call(root, 'revision', 'list').transactions[0], txPath = path.join(root, `.writer/transactions/${tx.id}/transaction.json`), plan = JSON.parse(fs.readFileSync(txPath)).plan, victim = plan.find(x => x.file.startsWith('正文/'));
  const previous = fs.readFileSync(path.join(root, victim.file)); file(root, victim.file, '第三方新稿');
  const request = { transaction_id: tx.id, token: branch.token, direction: 'rollback', lock_sha256: sha(fs.readFileSync(path.join(root, '.writer/write.lock'))), author_evidence: evidence(root) };
  fails(() => call(root, 'revision', 'recover', request), 'TRANSACTION_EXTERNAL_CONFLICT'); assert.equal(fs.readFileSync(path.join(root, victim.file), 'utf8'), '第三方新稿');
  const conflict = JSON.parse(fs.readFileSync(txPath)).conflicts[0]; assert.equal(fs.readFileSync(path.join(root, conflict.external_ref), 'utf8'), '第三方新稿');
  fs.writeFileSync(path.join(root, victim.file), previous); call(root, 'revision', 'recover', { transaction_id: tx.id, token: branch.token, direction: 'rollback' }); assert.deepEqual(fs.readFileSync(path.join(root, '.writer/state.json')), original);
});
test('历史版本在隔离区发布并完整重登：旧章前缀仍旧版，模型复核后一次业务提交', t => {
  const { root } = fixture(t, 3); freeze(root, 'RULE1'); call(root, 'source', 'publish', publishInput(root, 'RULE1'));
  file(root, '设定/权威规则.md', '第二章起采用三枚押钱。'); freeze(root, 'RULE2'); workflow(root, true);
  const staged = call(root, 'source', 'stage', publishInput(root, 'RULE2', 2, 'historical')), before = state(root), branch = begin(root);
  rewindBranch(branch); call(branch.workspace, 'source', 'publish', sourceInput(branch.workspace, { impact_id: staged.impact_id, author_evidence: evidence(branch.workspace) }), branch.token);
  for (let n = 1; n <= 3; n++) unit(branch.workspace, n, branch.token, '修订后');
  fails(() => prepare(root, branch), 'REVISION_REVIEW_REQUIRED'); review(branch); prepare(root, branch); commit(root, branch);
  assert.equal(state(root).revision, before.revision + 1); assert.equal(state(root).units[0].source_bindings['设定/权威规则.md'].version_id, 'RULE1'); assert.equal(state(root).units[1].source_bindings['设定/权威规则.md'].version_id, 'RULE2');
  assert.equal(Object.keys(state(root).impact_pending).length, 0); assert.equal(main(['check', '--project', root]).ok, true);
});
test('已冻结的细纲从版本读取，活动入口删除不伪造来源漂移', t => {
  const { root } = fixture(t, 0), planRef = '大纲/单元/0001.json';
  call(root, 'plan', null, { unit: 1, title: '原细纲', goal: '保留旧目标', change: '推进', beats: ['核实'], cast: [], setting_refs: [], research_refs: [] });
  freeze(root, 'PLAN1', planRef); call(root, 'source', 'publish', publishInput(root, 'PLAN1'));
  fs.unlinkSync(path.join(root, planRef)); const packet = main(['context', '--project', root, '--unit', '1']); assert.equal(packet.plan.title, '原细纲'); assert.equal(packet.source_bindings[planRef].version_id, 'PLAN1');
});
test('显式移交只改协作元数据，不制造主基线漂移；旧所有者令牌失效', t => {
  const { root } = fixture(t); workflow(root, true); const branch = begin(root), proofRef = `.writer/revisions/${branch.id}/移交授权.md`;
  file(root, proofRef, '明确移交给新所有者，保留原候选和基线。'); const proof = { quote: '明确移交给新所有者', local_source: proofRef, source_sha256: sha(fs.readFileSync(path.join(root, proofRef))), locator: '合成移交测试', recorded_by: 'test-fixture' };
  const listed = call(root, 'revision', 'list').sessions.find(x => x.id === branch.id), next = call(root, 'revision', 'transfer', { id: branch.id, expected_session_sha256: listed.session_sha256, owner: '新会话', author_evidence: proof, reason: '验证显式移交' });
  fails(() => call(root, 'revision', 'resume', { id: branch.id, token: branch.token }), 'REVISION_OWNER_REQUIRED');
  branch.token = next.token; edit(branch); prepare(root, branch); commit(root, branch); assert.equal(main(['check', '--project', root]).ok, true);
});
