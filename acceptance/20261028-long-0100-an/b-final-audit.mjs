import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {applyDelta} from './work/.writer/tool/lib/journal.mjs';
const root=path.dirname(fileURLToPath(import.meta.url)), work=path.join(root,'work');
const read=ref=>JSON.parse(fs.readFileSync(path.join(root,ref)));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const put=(ref,data)=>fs.writeFileSync(path.join(root,ref),JSON.stringify(data,null,2)+'\n',{flag:'wx'});
const recovery=read('session-b/owner-recovery.json'), candidate=recovery.workspace;
const initial=read('session-b/initial-state.json'), base=read('session-b/initial-base-state.json');
const main=read('work/.writer/state.json'), current=JSON.parse(fs.readFileSync(path.join(candidate,'.writer/state.json')));
assert.equal(initial.revision,480);assert.equal(main.revision,481);assert.equal(current.revision,485);
assert.equal(main.units.length,120);assert.equal(current.units.length,118);
assert.deepEqual(main.units,initial.units);assert.deepEqual(main.snapshot,initial.snapshot);
assert.deepEqual(current.units.slice(0,115),base.units.slice(0,115));
for(const name of ['base.json','base-state.json']) assert.equal(sha(fs.readFileSync(path.join(path.dirname(candidate),name))),recovery.baseline[name]);
const manifest=read('session-b/initial-work-manifest.json');
const existingChanges=[],missing=[];
for(const f of manifest.files) {
 const target=path.join(work,f.ref);
 if(!fs.existsSync(target))missing.push(f.ref);
 else if(sha(fs.readFileSync(target))!==f.sha256)existingChanges.push(f.ref);
}
assert.deepEqual(missing,[]);assert.deepEqual(existingChanges,['.writer/state.json']);
const edits={116:['今天不用替自己换别的打开','今天不必换播放器'],120:['得放开前头','得放在前头']};
const drafts=[];
for(const u of main.units) {
 const before=fs.readFileSync(path.join(work,u.draft)),after=fs.readFileSync(path.join(candidate,u.draft));
 assert.equal(sha(before),u.sha256);
 if(edits[u.unit]) {const [a,b]=edits[u.unit],t=before.toString('utf8');assert.equal(t.split(a).length-1,1);assert.equal(after.toString('utf8'),t.replace(a,b));}
 else assert.equal(sha(after),sha(before));
 drafts.push({unit:u.unit,draft:u.draft,main_sha256:sha(before),candidate_sha256:sha(after),changed:sha(before)!==sha(after),registered_in_candidate:u.unit<=118,han_without_title:[...after.toString('utf8').replace(/^#[^\n]*\r?\n/,'').matchAll(/\p{Script=Han}/gu)].length});
}
let old118=structuredClone(base.snapshot);
for(const u of [...base.units].reverse()) if(u.unit>=119) {
 assert(/^\.writer\/journal\/[a-f0-9-]+\.json$/.test(u.journal));
 const bytes=fs.readFileSync(path.join(work,u.journal));assert.equal(sha(bytes),u.journal_sha256);
 old118=applyDelta(old118,JSON.parse(bytes).patch,true);
}
const normalized=structuredClone(old118), changedEvidence=[];
const before116=drafts.find(d=>d.unit===116).main_sha256,after116=drafts.find(d=>d.unit===116).candidate_sha256;
for(const [id,e] of Object.entries(normalized.ledger)) for(const anchor of e.evidence??[]) if(anchor.unit===116&&anchor.sha256===before116) {anchor.sha256=after116;changedEvidence.push({id,unit:116,quote:anchor.quote});}
assert.deepEqual(current.snapshot,normalized);
let observations=0;for(const [id,e] of Object.entries(old118.ledger)) if(e.type==='observation') {assert.deepEqual(current.snapshot.ledger[id],e);observations++;}
const replayChecks=[];
for(const unit of [116,117,118]) {
 const serial=String(unit).padStart(4,'0'),input=read(`session-b/record-${serial}-v1.json`),raw=JSON.parse(fs.readFileSync(path.join(candidate,`.writer/drafts/AN-b-replay-${serial}-raw.json`)));
 assert.deepEqual(input.summary,raw.summary);assert.deepEqual(input.changes,raw.changes);assert.deepEqual(input.source_hashes,raw.source_hashes);assert.deepEqual(input._replay,raw._replay);
 const report=fs.readFileSync(path.join(candidate,input.draft_review.report));assert.equal(sha(report),input.draft_review.report_sha256);
 replayChecks.push({unit,summary_changes_preserved:true,source_hashes_preserved_from_native_replay:true,replay_identity_preserved:true,report:input.draft_review.report,report_sha256:sha(report)});
}
const commands=[];const heads=new Map();
for(const name of fs.readdirSync(path.join(root,'commands')).filter(n=>n.startsWith('b-')).sort()) {
 const ref='commands/'+name,m=read(ref+'/result.json');assert.equal(m.exit_code,0);assert.equal(m.runtime_files_stable,true);
 for(const stream of ['stdout.raw.txt','stderr.raw.txt','before-state.json','after-state.json'])assert(fs.existsSync(path.join(root,ref,stream)));
 const project=m.args[m.args.indexOf('--project')+1],abs=path.resolve(m.cwd,project);
 if(heads.has(abs))assert.equal(m.before_state_sha256,heads.get(abs));heads.set(abs,m.after_state_sha256);
 if(m.input) assert.equal(sha(fs.readFileSync(path.join(root,ref,'input.raw.json'))),m.input.sha256);
 assert.equal(m.args.includes('prepare'),false);assert.equal(m.args.includes('commit'),false);
 commands.push({label:name,exit_code:m.exit_code,elapsed_ms:m.elapsed_ms,input_sha256:m.input?.sha256??null,before_state_sha256:m.before_state_sha256,after_state_sha256:m.after_state_sha256,runtime_files_stable:m.runtime_files_stable,stdout_bytes:fs.statSync(path.join(root,ref,'stdout.raw.txt')).size,stderr_bytes:fs.statSync(path.join(root,ref,'stderr.raw.txt')).size});
}
for(const [a,b] of [['b-009-preview116','b-010-record116'],['b-013-preview117','b-014-record117'],['b-017-preview118','b-018-record118']])assert.equal(read('commands/'+a+'/result.json').input.sha256,read('commands/'+b+'/result.json').input.sha256);
const status=read('commands/b-020-candidate-status/stdout.raw.txt'), check=read('commands/b-019-candidate-check/stdout.raw.txt'), sources=read('commands/b-023-candidate-sources/stdout.raw.txt');
assert.equal(status.next_unit,119);assert.deepEqual(status.stale_units,[]);assert.deepEqual(status.changed_sources,[]);assert.deepEqual(status.impact_pending,[]);
assert.equal(check.ok,true);assert(check.findings.every(f=>f.code==='UNREGISTERED_DRAFT'&&f.severity==='warning'));
const checkpoint={id:recovery.id,parent:work,workspace:candidate,base_revision:481,main_revision:481,candidate_revision:485,next_replay_unit:119,registered_replay_units:[116,117,118],remaining_replay_units:[119,120],scope:recovery.scope,base_sha256:recovery.baseline['base.json'],base_state_sha256:recovery.baseline['base-state.json'],main_state_sha256:sha(fs.readFileSync(path.join(work,'.writer/state.json'))),candidate_state_sha256:sha(fs.readFileSync(path.join(candidate,'.writer/state.json'))),session_sha256:sha(fs.readFileSync(path.join(path.dirname(candidate),'session.json'))),token_location:'session-b/owner-recovery.json (local only)',status:'editing',prepared:false,committed:false};
const report={at:new Date().toISOString(),scope:'mechanical-audit-not-literary-acceptance',checkpoint,baseline_inventory:{checked:manifest.count,unchanged:manifest.count-1,changed:existingChanges,missing},main_units_deep_unchanged:true,main_snapshot_deep_unchanged:true,candidate_prefix_1_115_deep_unchanged:true,candidate_snapshot_equals_original_118_except_116_evidence_hashes:true,updated_evidence_hash_count:changedEvidence.length,unchanged_observations:observations,base_files_unchanged:true,drafts,replayChecks,commands,check,sources};
put('session-b-final-audit.json',report);put('session-b/checkpoint.json',checkpoint);
put('session-b/read-coverage.json',{nature:'Codex-informed-full-text-reading-declaration-not-blind-review',full_original_units:[103,107,109,111,112,115,116,117,118,119,120],full_candidate_units:[116,117,118],candidate120:'original full text read; patched sentence and adjacent source checked; full revised 120 reread deferred to next independent session',files:drafts.filter(d=>[103,107,109,111,112,115,116,117,118,119,120].includes(d.unit)),unread:'Other complete chapters not reread in session B; selective context/recall fields inspected, not the entirety of all historical source texts'});
fs.writeFileSync(path.join(root,'session-b/resume-next-session.json'),JSON.stringify({id:recovery.id,token:recovery.token},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({checkpoint,baseline_inventory:report.baseline_inventory,command_count:commands.length,updated_evidence_hash_count:changedEvidence.length,unchanged_observations:observations,changed_draft_units:drafts.filter(d=>d.changed).map(d=>d.unit),candidate_check_warnings:check.findings.map(f=>f.code),sources_keys:Object.keys(sources)}));
