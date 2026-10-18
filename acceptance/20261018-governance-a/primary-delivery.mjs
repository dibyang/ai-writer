import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
const name = process.argv[2] ?? 'primary-delivery'; if (!/^[a-z0-9-]+$/.test(name)) throw Error('unique delivery name');
const base = path.resolve('acceptance/20261018-governance-a'), dir = path.join(base, name), work = path.join(dir, '交付确认作品');
if (fs.existsSync(dir)) throw Error('Never overwrite delivery evidence'); fs.mkdirSync(dir);
const sha = b => crypto.createHash('sha256').update(b).digest('hex'), calls = [];
function input(name, value) { const file = path.join(dir, name + '.json'); fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' }); return file; }
function run(name, args, expected = 0) {
  const label = path.basename(dir) + '-' + name.replaceAll('_', '-'), r = spawnSync(process.execPath, [path.join(base, 'capture.mjs'), label, process.execPath, 'bin/ai-writer.mjs', ...args], { maxBuffer: 20 * 1024 * 1024, windowsHide: true });
  assert.equal(r.status, expected, r.stderr?.toString()); const folder = path.join(base, 'commands', label), value = JSON.parse(fs.readFileSync(path.join(folder, expected === 2 ? 'stderr.raw.txt' : 'stdout.raw.txt')));
  const meta = JSON.parse(fs.readFileSync(path.join(folder, 'result.json'))); calls.push({ label, exit_code: r.status, before: meta.before_state_sha256, after: meta.after_state_sha256 }); return value;
}
const params = ['--project', work];
run('init', ['init', '--path', work, '--kind', 'novel', '--title', '最终源码交付确认']);
const quote = '主Codex会话的合成验收指令：在这个新测试作品里复用已读的许桥修提手原稿，地点旧渡口已选，纸签与铜铃尚未选。仅授权第1章，远期骨架可暂缓，登记后先讨论总纲再暂停全部创作动作。只验证最终源码文件流程，不新增文学创作。';
const source = '研究/本主会话验收指令.txt'; fs.writeFileSync(path.join(work, source), quote);
const evidence = { quote, local_source: source, source_sha256: sha(Buffer.from(quote)), locator: '本主会话合成验收夹具第1行；不是真实小说作者采纳记录', recorded_by: 'primary Codex delivery CLI replay' };
const current = run('initial-workflow', ['workflow', 'show', ...params]);
const badFile = input('invalid-id', { expected_revision: current.revision, operation_id: 'prototype', author_evidence: evidence, workflow: current.workflow });
assert.equal(run('invalid-id', ['workflow', 'set', ...params, '--input', badFile], 2).code, 'INVALID_INPUT');
assert.equal(run('after-invalid-readable', ['status', ...params]).revision, 0);
const w = current.workflow; w.stage = 'trial'; w.task = '仅重放一章后复盘'; w.authorization = { allowed_actions: ['discuss', 'plan', 'draft'], draft_range: { from: 1, to: 1 }, revise_range: null, stop_conditions: ['完成第一章后讨论，再全部暂停'] }; w.planning.structure = { status: 'deferred', refs: [], unresolved_ids: ['远期'], reason: '仅限本轮单章合成重放' };
const trialFile = input('trial', { expected_revision: 0, operation_id: 'toString', author_evidence: evidence, workflow: w });
run('trial', ['workflow', 'set', ...params, '--input', trialFile]); assert.equal(run('trial-idempotent', ['workflow', 'set', ...params, '--input', trialFile]).unchanged, true);
let revision = 1;
for (const [id, topic, status, adopted_items, options, unresolved_items] of [['D_PLACE', '地点', 'confirmed', ['旧渡口'], ['旧渡口'], []], ['D_GIFT', '赠物', 'candidate', [], ['纸签', '铜铃'], ['尚未选赠物']]]) {
  const file = input(id.toLowerCase(), { expected_revision: revision, operation_id: id.toLowerCase(), author_evidence: evidence,
    decision: { id, topic, status, adopted_items, options, unresolved_items, excluded_items: [], effective_range: { from: 1, to: null } } });
  revision = run(id.toLowerCase(), ['decision', 'set', ...params, '--input', file]).revision;
}
const plan = input('plan', { unit: 1, title: '提手', goal: '给老人修好提手', change: '试提后交还纸灯', beats: ['查看断线', '重绑并试提', '交还老人'], cast: ['许桥', '老人'] });
run('plan', ['plan', ...params, '--input', plan]); const packet = run('context', ['context', ...params, '--unit', '1']);
const tx = run('template', ['record-template', ...params, '--unit', '1', '--draft', '正文/0001-交付重放.md']); assert.deepEqual(packet.source_hashes, tx.source_hashes);
const oldRoot = path.join(base, 'native-final-check/最终回归微型作品'), oldState = JSON.parse(fs.readFileSync(path.join(oldRoot, '.writer/state.json'))), original = fs.readFileSync(path.join(oldRoot, oldState.units[0].draft));
const beforeOriginal = sha(original); fs.writeFileSync(path.join(work, tx.draft), original, { flag: 'wx' });
tx.summary = '许桥在旧渡口重绑纸灯提手，试提后交还老人；赠物未定且未在正文采用。'; tx.changes = { characters: { 许桥: '旧渡口；重绑并试提纸灯', 老人: '已拿回纸灯' }, timeline_append: ['许桥重绑提手并试提后交还纸灯'], ledger: {} };
const recordFile = input('record', tx); run('record', ['record', ...params, '--input', recordFile]); assert.equal(run('check', ['check', ...params]).ok, true);
const afterRecord = run('after-record-workflow', ['workflow', 'show', ...params]);
w.stage = 'structure'; w.task = '只讨论总纲，保留远期暂缓'; w.authorization = { allowed_actions: ['discuss', 'plan'], draft_range: null, revise_range: null, stop_conditions: [] };
const structure = input('structure', { expected_revision: afterRecord.revision, operation_id: 'structure', author_evidence: evidence, workflow: w }); run('structure', ['workflow', 'set', ...params, '--input', structure]);
assert.equal(run('discussion', ['context', ...params, '--purpose', 'discussion']).governance.planning.structure.status, 'deferred'); assert.equal(run('draft-denied', ['context', ...params, '--unit', '2'], 2).code, 'ACTION_OUT_OF_SCOPE');
const beforePause = run('before-pause-workflow', ['workflow', 'show', ...params]); w.stage = 'paused'; w.task = '全部创作动作暂停，仅查看任务'; w.authorization = { allowed_actions: [], draft_range: null, revise_range: null, stop_conditions: [] };
const pauseFile = input('paused', { expected_revision: beforePause.revision, operation_id: 'paused', author_evidence: evidence, workflow: w }); run('paused', ['workflow', 'set', ...params, '--input', pauseFile]);
const s = run('status', ['status', ...params]); assert.match(s.next.command, /workflow show/); run('suggestion', ['workflow', 'show', ...params]);
const closed = run('discussion-denied', ['context', ...params, '--purpose', 'discussion'], 2); assert.match(closed.next_action, /暂停/); assert.doesNotMatch(closed.next_action, /继续讨论|继续.*规划/);
assert.equal(run('doctor', ['doctor', ...params]).ok, true); const compare = run('compare', ['tool', 'compare', ...params, '--other', process.cwd()]); assert.equal(compare.same_content, true);
assert.equal(sha(fs.readFileSync(path.join(oldRoot, oldState.units[0].draft))), beforeOriginal);
const result = { ok: true, scope: 'Primary Codex session final-source real CLI replay; not a sixth native model session or new literary writing', calls: calls.length, command_results: calls,
  build: { content: compare.left.observed_content_id, runtime: compare.left.runtime_id, matches_main: true }, copied_body_sha256: beforeOriginal, new_literary_han: 0,
  units: 1, stage: s.governance.stage, deferred_preserved: s.governance.planning.structure.status === 'deferred', candidate_preserved: s.governance.decisions.candidates.length === 1,
  rejected_requests_state_unchanged: calls.filter(x => x.exit_code === 2).every(x => x.before === x.after) };
input('summary', result); console.log(JSON.stringify(result));
