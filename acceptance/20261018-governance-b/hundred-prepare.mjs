import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { isDeepStrictEqual as same } from 'node:util';
import { applyDelta } from '../../lib/journal.mjs';
import { runner, BASE, readState, write, sha } from './cli-support.mjs';
const r = runner(process.argv[2]), root = path.join(BASE, 'scale-hundred/work'), original = readState(root), copy = JSON.parse(fs.readFileSync(path.join(BASE, 'scale-hundred/copy-manifest.json')));
assert.equal(original.schema_version, 2); assert.equal(original.units.length, 100); assert.equal(sha(fs.readFileSync(path.join(root, '.writer/state.json'))), copy.state_sha256);
const bodies = () => original.units.map(u => ({ unit: u.unit, draft: u.draft, sha256: sha(fs.readFileSync(path.join(root, u.draft))) })); const beforeBodies = bodies();
function size(dir) { let bytes = 0, files = 0; for (const name of fs.readdirSync(dir)) { const file = path.join(dir, name), stat = fs.lstatSync(file); assert.equal(stat.isSymbolicLink(), false); if (stat.isDirectory()) { const next = size(file); bytes += next.bytes; files += next.files; } else if (stat.isFile()) { bytes += stat.size; files++; } } return { bytes, files }; }
const treeBefore = size(root); r.authorFile(root);
// Unconsumed diagnostic plans only; no chapter101 body is created or counted as writing.
r.run(root, ['volume'], { id: 'B_DIAGNOSTIC', title: '上下文成本测量占位', start: 101, end: 101, promises: ['仅诊断，不新增剧情'], constraints: [], reserved: [], arcs: [{ id: 'B101', start: 101, end: 101, goal: '测量上下文', payoff: '记录成本', forbidden: [] }] });
r.run(root, ['plan'], { unit: 101, title: '诊断占位', goal: '只读取上下文不写正文', change: '无已发生事实变化', beats: ['诊断'], cast: [], setting_refs: [], research_refs: [], recall_ids: [] });
function samples(label) { const rows = []; for (let i = 0; i < 3; i++) { const status = r.run(root, ['status']); const context = r.run(root, ['context', '--unit', '101', '--max-chars', '200000']); rows.push({ sample: i + 1, status_ms: r.rows.at(-2).elapsed_ms, context_ms: r.rows.at(-1).elapsed_ms, status_chars: JSON.stringify(status).length, context_chars: JSON.stringify(context).length, state_bytes: fs.statSync(path.join(root, '.writer/state.json')).size }); } return { label, rows }; }
const oldProtocol = samples('same-0.5-runtime-on-schema2');
r.run(root, ['governance', 'preview']); r.run(root, ['governance', 'migrate'], { expected_revision: readState(root).revision, operation_id: 'hundred-governance', author_evidence: r.evidence(root) });
r.run(root, ['protection', 'preview']); r.run(root, ['protection', 'enable'], { expected_revision: readState(root).revision, author_evidence: r.evidence(root) });
assert.deepEqual(readState(root).snapshot, original.snapshot); assert.deepEqual(readState(root).units, original.units); assert.deepEqual(bodies(), beforeBodies);
const ref = '设定/权威规则.md'; r.run(root, ['source', 'freeze'], { expected_revision: readState(root).revision, operation_id: 'hundred-freeze', ref, version_id: 'HUNDRED_RULES_BASE' });
const impact = r.run(root, ['source', 'impact'], { version_id: 'HUNDRED_RULES_BASE', from: 1, mode: 'baseline' }).impact;
const report = '审查/B-百章基线机械等价.md'; write(path.join(root, report), '# 基线字节等价验证\n与封存来源逐字节相同，旧消费哈希完全等价。这里是机械测试声明，不声称重新模型实读百章或完成新文学验收。\n');
r.run(root, ['source', 'publish'], { expected_revision: readState(root).revision, operation_id: 'hundred-publish', author_evidence: r.evidence(root), impact, review: { report, report_sha256: sha(fs.readFileSync(path.join(root, report))), readings: impact.required_readings, conclusion: '仅基线字节等价；无新语义或事实结论', unresolved: [] } });
assert.deepEqual(readState(root).snapshot, original.snapshot); for (let i = 0; i < 100; i++) assert.deepEqual(readState(root).units[i].source_hashes, original.units[i].source_hashes);
r.workflow(root, true, 100, 100, { from: 101, to: 101 }); const newProtocol = samples('same-runtime-on-schema4-with-100-bindings'); assert.equal(r.run(root, ['check']).ok, true);
const b = r.begin(root, 100, 100), parentBefore = fs.readFileSync(path.join(root, '.writer/state.json'));
r.run(b.workspace, ['rewind', '--from', '100', '--expected-revision', String(readState(b.workspace).revision), '--revision-token', b.token]);
const before100 = readState(b.workspace).snapshot, after100 = original.snapshot, row = original.units[99], template = r.run(b.workspace, ['record-template', '--unit', '100', '--draft', row.draft]);
// Reuse the original validated delta to check our derived changes; never write state directly.
const patch = JSON.parse(fs.readFileSync(path.join(b.workspace, row.journal))).patch; assert.deepEqual(applyDelta(before100, patch), after100);
const changes = { characters: {}, retire_characters: [], timeline_append: [], ledger: {} };
for (const [name, value] of Object.entries(after100.characters)) if (before100.characters[name] !== value) changes.characters[name] = value;
for (const name of Object.keys(before100.characters)) if (!Object.hasOwn(after100.characters, name)) changes.retire_characters.push(name);
assert.deepEqual(after100.timeline.slice(0, before100.timeline.length), before100.timeline); changes.timeline_append = after100.timeline.slice(before100.timeline.length);
if (!same(before100.threads, after100.threads)) changes.threads = after100.threads;
const allowed = ['type', 'statement', 'status', 'cast', 'tags', 'due_unit', 'pinned', 'author_truth', 'reader_known', 'character_known', 'custody', 'previous_holder'];
for (const [id, next] of Object.entries(after100.ledger ?? {})) if (!same(before100.ledger?.[id], next)) {
  const value = Object.fromEntries(allowed.filter(k => Object.hasOwn(next, k)).map(k => [k, next[k]])); value.evidence = next.evidence.filter(e => e.unit === 100).map(({ unit, quote }) => ({ unit, quote })); assert.ok(value.evidence.length, `No current evidence: ${id}`);
  if (next.type === 'object' && before100.ledger?.[id]?.custody && before100.ledger[id].custody.holder !== next.custody.holder) value.previous_holder = before100.ledger[id].custody.holder;
  changes.ledger[id] = value;
}
template.summary = row.summary; template.changes = changes; r.run(b.workspace, ['record', '--revision-token', b.token], template); assert.deepEqual(readState(b.workspace).snapshot, original.snapshot);
r.review(b, 100, 100); const prepare = r.prepare(root, b); assert.deepEqual(fs.readFileSync(path.join(root, '.writer/state.json')), parentBefore); assert.deepEqual(bodies(), beforeBodies);
write(path.join(BASE, 'scale-hundred/handoff.json'), { root, branch: b, parent_state_sha256: sha(parentBefore), original_state_sha256: copy.state_sha256, original_revision: original.revision, original_snapshot_sha256: sha(JSON.stringify(original.snapshot)), baseline_revision: readState(root).revision, before_bodies: beforeBodies,
  note: '100章正文未改；仅第100章等价重登，事实终态完全相同。先前复核是合成字段测试，下一原生会话须实际实读95–100，resume后写真实报告再prepare/commit；不写第101章。' });
const result = r.summary({ units: 100, old_protocol: oldProtocol, new_protocol: newProtocol, tree_before: treeBefore, tree_after_prepared: size(root), original_snapshot_unchanged: true, original_body_hashes_unchanged: true, prepare_changed_files: prepare.changes.length,
  prepare_ms: r.rows.at(-1).elapsed_ms, new_body_units: 0, input_field_count: Object.keys(template).length, changes_field_count: Object.keys(changes).length,
  caveat: 'Three observational samples per protocol, one prepare; no performance improvement claim or new 100chapter literary acceptance' });
console.log(JSON.stringify({ ok: true, calls: result.calls, units: 100, body_changes: 0, fact_changes: 0, prepared_changes: result.prepare_changed_files, prepare_ms: result.prepare_ms }));
