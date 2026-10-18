import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { RUNTIME_FILES } from '../../lib/tool-build.mjs';
const base = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(base, '../..');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const raw = ref => fs.readFileSync(path.join(base, ref));
const json = ref => JSON.parse(raw(ref));
const checks = [];
function check(name, fn) { const result = fn(); checks.push({ name, result: result ?? true }); return result; }
function assertBodies(project, rows) { for (const row of rows) assert.equal(sha(fs.readFileSync(path.join(project, row.draft))), row.sha256, row.draft); return rows.length; }
function evidence(project, state) {
  let count = 0;
  for (const item of Object.values(state.snapshot.ledger)) for (const e of item.evidence ?? []) {
    const bytes = fs.readFileSync(path.join(project, e.draft));
    assert.equal(sha(bytes), e.sha256, e.draft);
    const line = bytes.toString('utf8').split(/\r?\n/)[e.line - 1];
    assert.ok(line?.includes(e.quote), `${e.draft}:${e.line} ${e.quote}`); count++;
  }
  return count;
}
const finalManifest = json('sources/final-delivery/source-manifest.json');
check('final source exactly matches tested frozen candidate', () => {
  assert.deepEqual(finalManifest.files, json('sources/candidate-final/source-manifest.json').files);
  for (const row of finalManifest.files) {
    assert.equal(sha(fs.readFileSync(path.join(root, row.file))), row.sha256, row.file);
    assert.equal(sha(raw(`sources/final-delivery/${row.file}`)), row.sha256, row.file);
  }
  return { files: finalManifest.files.length, manifest_sha256: sha(raw('sources/final-delivery/source-manifest.json')) };
});
const runtimeGuard = sha(JSON.stringify(RUNTIME_FILES.map(ref => [ref, sha(fs.readFileSync(path.join(root, ref)))])));
assert.equal(runtimeGuard, 'fd93a368c02475da18c9ea8baf1b5836d28e330edf817d47cbca15e969f79acb');
const finalRuns = ['final-regression', 'final-doctor', 'final-smoke', 'final-boundaries', 'exhaustive-final-run', 'matrix-final-run', 'disjoint-final-run', 'skills-final-validate'];
check('final checks successful', () => { for (const label of finalRuns) assert.equal(json(`commands/${label}/result.json`).exit_code, 0, label); const log = raw('commands/final-regression/stdout.raw.txt').toString(); assert.match(log, /tests 112/); assert.match(log, /pass 112/); assert.match(log, /fail 0/); assert.match(log, /skipped 0/); return finalRuns; });
check('final real CLI matrices', () => {
  const result = {};
  for (const [label, calls] of [['exhaustive-final-run',378],['matrix-final-run',182],['disjoint-final-run',30]]) {
    const out = JSON.parse(raw(`commands/${label}/stdout.raw.txt`).toString().trim()); assert.equal(out.ok, true); assert.equal(out.calls, calls); result[label] = out;
  }
  assert.equal(result['exhaustive-final-run'].cases, 23); assert.equal(result['exhaustive-final-run'].published_file_boundaries, 8); return result;
});
const phases = ['native-create', 'native-revise-partial', 'native-resume-commit', 'native-hundred-final'];
check('four independent actual Codex processes completed', () => {
  const out = phases.map(phase => {
    const p = json(`${phase}/process-result.json`); assert.equal(p.exit_code, 0, phase);
    const events = raw(`${phase}/events.jsonl`).toString('utf8').trim().split('\n').map(x => JSON.parse(x));
    const id = events.find(x => x.type === 'thread.started')?.thread_id; assert.ok(id); assert.ok(events.some(x => x.type === 'turn.completed'));
    return { phase, thread_id: id, elapsed_s: p.elapsed_s, events: p.events, command_events: p.commands, codex_version: p.codex_version };
  }); assert.equal(new Set(out.map(x => x.thread_id)).size, 4); return out;
});
const novel = path.join(base, 'works/铜桥来信'), ns = JSON.parse(fs.readFileSync(path.join(novel, '.writer/state.json')));
check('six chapters, actual interrupted session and resumed transaction', () => {
  const first = json('handoff.json'), partial = json('native-revise-partial/handoff.json'), complete = json('native-revise-complete/summary.json'), v = json('native-revise-complete/verification.json');
  assert.equal(first.registered_count, 6); assert.equal(first.total_body_han, 3936);
  assert.equal(partial.next_unit, 4); assert.equal(partial.branch_revision, 39); assert.equal(partial.base_revision, 28);
  assert.equal(partial.id, complete.session_id); assert.equal(complete.base_revision,28); assert.equal(complete.commit_revision,29); assert.equal(complete.final_revision,30); assert.equal(complete.branch_revision,45); assert.equal(complete.total_body_han,4051);
  assert.equal(v.main_unchanged_until_commit,true); assert.equal(v.commit_idempotence.repeated_state_byte_unchanged,true);
  assert.equal(ns.revision,30); assert.equal(ns.units.length,6); assert.equal(sha(fs.readFileSync(path.join(novel,'.writer/state.json'))),complete.state_sha256);
  assertBodies(novel,complete.units); assert.equal(ns.units[0].sha256,first.units[0].sha256); assert.equal(ns.units[3].sha256,first.units[3].sha256);
  assert.equal(ns.units[0].source_bindings['设定/权威规则.md'].version_id,'RULES_V1'); for (const u of ns.units.slice(1)) assert.equal(u.source_bindings['设定/权威规则.md'].version_id,'RULES_V3_FROM2');
  assert.equal(Object.keys(ns.impact_pending).length,0); assert.equal(ns.governance.stage,'structure'); assert.ok(!ns.governance.authorization.allowed_actions.includes('draft'));
  const original = first.key_ledger_ids.OBS_NOTCH, current = ns.snapshot.ledger.OBS_NOTCH;
  assert.equal(current.statement,original.statement); assert.match(current.character_known['周叔'],/亲自操作原印复验/); assert.ok(current.evidence.some(x=>x.unit===3)); assert.ok(current.evidence.some(x=>x.unit===5));
  return { chapters:6, body_han:4051, revision:ns.revision, session_id:complete.session_id, evidence_anchors:evidence(novel,ns), actual_reading:'six chapters in native phases 1, 2, 3; final source subsequently rechecks data, no claim of final-source new six-chapter drafting' };
});
const hundred = path.join(base,'scale-hundred/work'), hs = JSON.parse(fs.readFileSync(path.join(hundred,'.writer/state.json')));
check('100 chapter frozen-copy final-source equivalence and precise scope', () => {
  const before = json('native-hundred-final/before-main-state.json'), old = json('scale-hundred/handoff-v2.json'), copy = json('scale-hundred/copy-manifest.json');
  assert.equal(copy.file_count,598); assert.equal(copy.bytes,11256809); assert.equal(hs.units.length,100); assert.deepEqual(hs.units.slice(0,99),before.units.slice(0,99)); assert.deepEqual(hs.snapshot,before.snapshot); assert.equal(sha(JSON.stringify(hs.snapshot)),old.original_snapshot_sha256);
  assertBodies(hundred,old.before_bodies); assert.equal(hs.units[99].tool_build_id,runtimeGuard); assert.equal(Object.keys(hs.impact_pending).length,0);
  const ranges=hs.source_ranges.filter(x=>x.ref==='设定/权威规则.md'); assert.deepEqual(ranges.map(x=>[x.from,x.to]),[[1,99],[100,null]]); assert.equal(ranges[1].version_id,'HUNDRED_RULES_NATIVE_FOUR_100');
  const last=hs.committed_revisions.at(-1); const commit=JSON.parse(fs.readFileSync(path.join(hundred,last.ref))); assert.equal(sha(fs.readFileSync(path.join(hundred,last.ref))),last.sha256);
  const begin=json('native-four/session.json'); assert.equal(begin.scope.from,100); assert.equal(begin.scope.through,100);
  assert.equal(hs.revision,381); assert.equal(json('native-four/post-commit.json').revision,380); assert.equal(begin.base_revision,379);
  return { chapters:100,preserved_prefix_rows:99,preserved_body_files:100,preserved_fact_snapshot:true,source_ranges:ranges,scope:begin.scope,base_revision:379,commit_revision:380,paused_revision:381,evidence_anchors:evidence(hundred,hs),actual_literary_reading:[95,100],not_new_100_chapter_writing:true };
});
check('no protected existing work files changed', () => { const p=json('protected-comparison.json'); assert.equal(p.before_files,516); assert.equal(p.after_files,516); assert.deepEqual(p.differences,[]); return p; });
check('native export text correct; byte-exact archive separately identified', () => {
  const summary=json('native-four/summary.json'), exp=summary.export;
  assert.equal(exp.native_is_raw_byte_exact,false); assert.equal(exp.manifest_hashes_match_original,true);
  const expected=hs.units.map(u=>fs.readFileSync(path.join(hundred,u.draft),'utf8').trim()).join('\n\n---\n\n')+'\n';
  const actual=fs.readFileSync(path.join(exp.native_directory,'manuscript.md')); assert.equal(actual.toString('utf8'),expected); assert.equal(sha(actual),exp.native_manuscript_hash);
  assert.equal(exp.supplemental_byte_preserved_count,100);
  return {native_normalization:'per chapter trim; existing consolidated export behavior, not byte-exact',native_manuscript_sha256:sha(actual),supplemental_archive:'native-four/export-byte-preserved; campaign helper output, not new product feature'};
});
check('old actual 0.4 source fixture preserved', () => {
  const fixture=json('fixtures/tool-0.4/source-manifest.json');
  for (const row of fixture) { assert.equal(sha(raw(`fixtures/tool-0.4/${row.file}`)),row.sha256); assert.equal(sha(fs.readFileSync(path.join(root,'tests/fixtures/tool-0.4',row.file))),row.sha256); }
  return { files:fixture.length,source_head:'80c74f6ac725ea164c54bf42c361a053f58af903' };
});
check('recorded command inputs and process observations intact', () => {
  const counts={}, rows=[];
  for (const label of fs.readdirSync(path.join(base,'commands')).sort()) {
    const ref=`commands/${label}/result.json`; if (!fs.existsSync(path.join(base,ref))) continue;
    const meta=json(ref); for (const stream of ['stdout.raw.txt','stderr.raw.txt']) assert.ok(fs.existsSync(path.join(base,'commands',label,stream)),label);
    if(meta.input) assert.equal(sha(raw(`commands/${label}/input.raw.json`)),meta.input.sha256,label);
    if(meta.build_before) { assert.equal(meta.runtime_files_stable,true,label); assert.equal(meta.build_before.runtime_guard_id,meta.build_after.runtime_guard_id,label); }
    counts[meta.exit_code]=(counts[meta.exit_code]??0)+1;
    rows.push({ label,exit_code:meta.exit_code,args:meta.args,started_at:meta.started_at,elapsed_ms:meta.elapsed_ms,input_sha256:meta.input?.sha256??null,before_state_sha256:meta.before_state_sha256,after_state_sha256:meta.after_state_sha256,runtime_guard_id:meta.build_before?.runtime_guard_id??null });
  }
  fs.writeFileSync(path.join(base,'command-index-final.json'),JSON.stringify({scope:'root commands only; copied phase duplicates excluded; expected rejection and historical failed reproductions intentionally retained',counts,rows},null,2)+'\n',{flag:'wx'});
  return { calls:rows.length,exit_counts:counts,notes:'Some earlier recorder versions have no build observation; no retroactive claim. Old source snapshots retained.' };
});
check('git changes remain local and unstaged', () => { const git=args=>execFileSync('git',args,{cwd:root,encoding:'utf8'}).trim(); const head=git(['rev-parse','HEAD']); assert.equal(head,'80c74f6ac725ea164c54bf42c361a053f58af903'); assert.equal(git(['diff','--cached','--name-only']),''); git(['diff','--check']); return {head,status:git(['status','--short']),no_commit:true,no_push:true}; });
const output={ok:true,at:new Date().toISOString(),source_version:'0.5.0',runtime_guard_id:runtimeGuard,checks,limits:['Windows local filesystem only','Model informed reading, not independent human or market acceptance','100 chapters are an unchanged frozen-copy structural test; only 95–100 reread here','Remaining stale uncovered whole-book reviews are retained, not literary acceptance','No engine change, engine tests not claimed','No automatic migration or tool update of original works']};
fs.writeFileSync(path.join(base,'final-verification.json'),JSON.stringify(output,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:true,checks:checks.length,runtime_guard_id:runtimeGuard}));
