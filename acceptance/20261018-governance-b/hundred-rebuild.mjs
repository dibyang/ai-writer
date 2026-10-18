import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { runner, BASE, readState, write, sha } from './cli-support.mjs';
const r = runner(process.argv[2]), original = JSON.parse(fs.readFileSync(path.join(BASE, 'scale-hundred/handoff.json'))), root = original.root;
const before = fs.readFileSync(path.join(root, '.writer/state.json'));
const refusal = r.commit(root, original.branch, 2); assert.equal(refusal.code, 'BASELINE_CONFLICT'); assert.deepEqual(fs.readFileSync(path.join(root, '.writer/state.json')), before);
r.run(root, ['revision', 'abort'], { id: original.branch.id, token: original.branch.token, reason: '主项目修复构建已改变，原候选/准备记录保留；按新构建新建等价尾段修订' });
const oldSummary = JSON.parse(fs.readFileSync(path.join(BASE, 'hundred-prepare-v1/summary.json'))), oldRecord = oldSummary.rows.find(row => row.root === original.branch.workspace && row.args[0] === 'record'); assert.ok(oldRecord);
const oldInput = JSON.parse(fs.readFileSync(path.join(BASE, `hundred-prepare-v1/inputs/${oldRecord.label}.json`)));
const branch = r.begin(root, 100, 100); r.run(branch.workspace, ['rewind', '--from', '100', '--expected-revision', String(readState(branch.workspace).revision), '--revision-token', branch.token]);
const row = original.before_bodies[99], input = r.run(branch.workspace, ['record-template', '--unit', '100', '--draft', row.draft]);
assert.equal(sha(fs.readFileSync(path.join(branch.workspace, row.draft))), row.sha256); input.summary = oldInput.summary; input.changes = oldInput.changes;
r.run(branch.workspace, ['record', '--revision-token', branch.token], input); assert.equal(sha(JSON.stringify(readState(branch.workspace).snapshot)), original.original_snapshot_sha256);
r.review(branch, 100, 100); const prepared = r.prepare(root, branch); assert.deepEqual(fs.readFileSync(path.join(root, '.writer/state.json')), before);
write(path.join(BASE, 'scale-hundred/handoff-v2.json'), { ...original, previous_branch: original.branch, branch, parent_state_sha256: sha(before), baseline_revision: readState(root).revision,
  build_change_refusal: refusal, note: '先前构建候选明确拒绝并保留；新候选由正式命令重新建立基线及等价重登。需原生模型实际连读95–100，再resume/真实review/prepare/commit，不新增剧情或第101章。' });
const result = r.summary({ old_build_refused: true, previous_candidate_preserved: fs.existsSync(original.branch.workspace), parent_state_unchanged: true, body_changes: 0, fact_changes: 0, prepared_changes: prepared.changes.length, prepare_ms: r.rows.at(-1).elapsed_ms });
console.log(JSON.stringify({ ok: true, calls: result.calls, old_build_refused: true, prepared_changes: prepared.changes.length, prepare_ms: result.prepare_ms }));
