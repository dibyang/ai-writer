import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {applyDelta} from './work/.writer/tool/lib/journal.mjs';
const root=path.dirname(fileURLToPath(import.meta.url));
const read=r=>JSON.parse(fs.readFileSync(path.join(root,r)));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const put=(ref,data)=>fs.writeFileSync(path.join(root,ref),JSON.stringify(data,null,2)+'\n',{flag:'wx'});
const recovery=read('session-b/owner-recovery.json'),work=recovery.parent,candidate=recovery.workspace;
const initial=read('session-c/initial-candidate-state.json'),base=read('session-c/initial-base-state.json');
const main=JSON.parse(fs.readFileSync(path.join(work,'.writer/state.json'))),current=JSON.parse(fs.readFileSync(path.join(candidate,'.writer/state.json')));
assert.equal(current.revision,486);assert.equal(current.units.length,119);assert.equal(main.revision,481);assert.equal(main.units.length,120);
assert.equal(sha(fs.readFileSync(path.join(work,'.writer/state.json'))),sha(fs.readFileSync(path.join(root,'session-c/initial-main-state.json'))));
assert.deepEqual(main,base);assert.deepEqual(current.units.slice(0,118),initial.units);
for(const [name,ref] of [['base','base.json'],['base-state','base-state.json'],['session','session.json']])assert.equal(sha(fs.readFileSync(path.join(path.dirname(candidate),ref))),sha(fs.readFileSync(path.join(root,`session-c/initial-${name}.json`))));
const manifest=read('session-b/initial-work-manifest.json'),changes=[],missing=[];
for(const f of manifest.files){const target=path.join(work,f.ref);if(!fs.existsSync(target))missing.push(f.ref);else if(sha(fs.readFileSync(target))!==f.sha256)changes.push(f.ref);}
assert.deepEqual(missing,[]);assert.deepEqual(changes,['.writer/state.json']);
const bd=read('session-b-final-audit.json').drafts;
const drafts=bd.map(d=>{const mb=fs.readFileSync(path.join(work,d.draft)),cb=fs.readFileSync(path.join(candidate,d.draft));assert.equal(sha(mb),d.main_sha256);assert.equal(sha(cb),d.candidate_sha256);const u=current.units.find(x=>x.unit===d.unit);if(u)assert.equal(u.sha256,sha(cb));return{...d,registered_in_candidate:!!u,c_session_draft_changed:false};});
let old119=structuredClone(base.snapshot);
const old120=base.units.find(u=>u.unit===120),jb=fs.readFileSync(path.join(work,old120.journal));assert.equal(sha(jb),old120.journal_sha256);
old119=applyDelta(old119,JSON.parse(jb).patch,true);
const normalized=structuredClone(old119),changedEvidence=[];
const before116=drafts.find(d=>d.unit===116).main_sha256,after116=drafts.find(d=>d.unit===116).candidate_sha256;
for(const [id,e] of Object.entries(normalized.ledger))for(const a of e.evidence??[])if(a.unit===116&&a.sha256===before116){a.sha256=after116;changedEvidence.push({id,unit:116,quote:a.quote});}
assert.deepEqual(current.snapshot,normalized);
let observations=0;for(const [id,e] of Object.entries(old119.ledger))if(e.type==='observation'){assert.deepEqual(current.snapshot.ledger[id],e);observations++;}
const newUnit=current.units.at(-1),journalBytes=fs.readFileSync(path.join(candidate,newUnit.journal));assert.equal(sha(journalBytes),newUnit.journal_sha256);
assert.deepEqual(applyDelta(initial.snapshot,JSON.parse(journalBytes).patch),current.snapshot);
const raw=JSON.parse(fs.readFileSync(path.join(candidate,'.writer/drafts/AN-c-replay-0119-raw.json'))),input=read('session-c/record-0119-v1.json');
for(const key of ['summary','changes','source_hashes','source_bindings','_replay'])assert.deepEqual(input[key],raw[key]);
assert.equal(newUnit.summary,input.summary);assert.deepEqual(newUnit.source_hashes,input.source_hashes);
const reportBytes=fs.readFileSync(path.join(candidate,input.draft_review.report));assert.equal(sha(reportBytes),input.draft_review.report_sha256);
const quotes=[];for(const [id,e] of Object.entries(current.snapshot.ledger))for(const a of e.evidence??[])if(a.unit===119){const u=current.units.find(x=>x.unit===119),b=fs.readFileSync(path.join(candidate,u.draft)),lines=b.toString('utf8').split(/\r?\n/);assert.equal(sha(b),a.sha256);assert(lines[a.line-1]?.includes(a.quote),a.quote);quotes.push({id,...a});}
assert.equal(quotes.length,8);
const commands=[],heads=new Map(),incomplete=[];
for(const label of fs.readdirSync(path.join(root,'commands')).filter(x=>x.startsWith('c-')).sort()){
 const ref='commands/'+label;if(!fs.existsSync(path.join(root,ref,'result.json'))){incomplete.push({label,classification:'capture-prelaunch-input-path-error',product_started:false,product_exit_code:null});continue;}
 const m=read(ref+'/result.json');assert.equal(m.exit_code,0);assert.equal(m.runtime_files_stable,true);
 for(const f of ['stdout.raw.txt','stderr.raw.txt','before-state.json','after-state.json'])assert(fs.existsSync(path.join(root,ref,f)));
 const target=path.resolve(m.cwd,m.args[m.args.indexOf('--project')+1]);
 if(heads.has(target))assert.equal(m.before_state_sha256,heads.get(target));heads.set(target,m.after_state_sha256);
 if(m.input)assert.equal(sha(fs.readFileSync(path.join(root,ref,'input.raw.json'))),m.input.sha256);
 assert(!m.args.some(x=>['prepare','commit','begin','rewind','transfer','recover'].includes(x)));
 commands.push({label,project:target,exit_code:m.exit_code,elapsed_ms:m.elapsed_ms,before_state_sha256:m.before_state_sha256,after_state_sha256:m.after_state_sha256,input_sha256:m.input?.sha256??null,runtime_files_stable:m.runtime_files_stable,stdout_bytes:fs.statSync(path.join(root,ref,'stdout.raw.txt')).size,stderr_bytes:fs.statSync(path.join(root,ref,'stderr.raw.txt')).size});
}
assert.deepEqual(incomplete.map(x=>x.label),['c-003-resume']);assert.equal(commands.length,14);
assert.equal(read('commands/c-009-preview119/result.json').input.sha256,read('commands/c-010-record119/result.json').input.sha256);
const resume=read('commands/c-004-resume/stdout.raw.txt');assert.equal(resume.id,recovery.id);assert.equal(resume.workspace,candidate);assert.equal(resume.base_revision,481);
const status=read('commands/c-013-candidate-status/stdout.raw.txt'),check=read('commands/c-011-candidate-check/stdout.raw.txt'),sources=read('commands/c-012-candidate-sources/stdout.raw.txt');
assert.equal(status.next_unit,120);for(const k of ['stale_units','changed_sources','impact_pending'])assert.deepEqual(status[k],[]);
assert.equal(check.ok,true);assert.equal(check.findings.length,1);assert.equal(check.findings[0].code,'UNREGISTERED_DRAFT');assert.equal(check.draft_inventory.unregistered[0].possible_unit,120);
for(const k of ['entry_differences','pending_edits','impact_pending'])assert.deepEqual(sources[k],[]);
const session=JSON.parse(fs.readFileSync(path.join(path.dirname(candidate),'session.json')));assert.equal(session.status,'editing');
const checkpoint={at:new Date().toISOString(),session:'C',thread:read('session-c/preflight.json').thread,id:recovery.id,token_location:'session-b/owner-recovery.json (local only)',resume_input:'session-b/resume-next-session.json',parent:work,workspace:candidate,scope:recovery.scope,base_revision:481,main_revision:481,candidate_revision:486,next_replay_unit:120,registered_replay_units:[116,117,118,119],remaining_replay_units:[120],base_sha256:sha(fs.readFileSync(path.join(path.dirname(candidate),'base.json'))),base_state_sha256:sha(fs.readFileSync(path.join(path.dirname(candidate),'base-state.json'))),main_state_sha256:sha(fs.readFileSync(path.join(work,'.writer/state.json'))),candidate_state_sha256:sha(fs.readFileSync(path.join(candidate,'.writer/state.json'))),session_sha256:sha(fs.readFileSync(path.join(path.dirname(candidate),'session.json'))),status:session.status,prepared:false,committed:false,next_session_requires_native_resume:true,stop:'next120; do not register120 in C; no prepare/commit',candidate120:drafts.find(d=>d.unit===120),check_warning:'UNREGISTERED_DRAFT only120',deferred:{rolling_review:check.rolling_review,old_needs_recheck:['H107_RETAINED_VOICE_COUNT_CANDIDATE','H109_RELATIVE_DAY_DRIFT','H72_REPEATED_KNOWLEDGE','H79_SINGLE_BRICK_REFERENCE','H83_REPEATED_PHONE_EXCLUSION']}};
put('session-c/checkpoint.json',checkpoint);
const audit={at:new Date().toISOString(),scope:'mechanical-audit-plus-version-bound-model-reading-not-literary-acceptance',checkpoint,main_state_byte_unchanged_since_C_start:true,main_state_equals_original_base:true,base_and_session_byte_unchanged:true,main_baseline_inventory:{checked:manifest.files.length,unchanged:manifest.files.length-1,changed_since_B_preworkflow:changes,missing},candidate_previous_118_records_deep_unchanged:true,candidate_snapshot_equals_original_119_except_116_evidence_hashes:true,updated_116_evidence_hash_count:changedEvidence.length,unchanged_observations:observations,new119_native_journal_reconstructs_snapshot:true,replay_summary_changes_sources_identity_unchanged:true,original119_structural_difference:read('session-c/replay-original-structural-diff.json'),new119_quote_count:quotes.length,new119_quotes:quotes,report:{ref:input.draft_review.report,sha256:sha(reportBytes)},drafts,commands,incomplete_capture_attempts:incomplete,check,sources};
put('session-c-final-audit.json',audit);
put('session-c/read-coverage.json',{nature:'independent-Codex-session-informed-model-full-text-reading-not-human-or-blind-acceptance',candidate_full_units_in_order:[116,117,118,119,120],older_full_units:[103,107,109,115],files:drafts.filter(d=>[103,107,109,115,116,117,118,119,120].includes(d.unit)),not_claimed:'No full book reread; no fresh final rolling review registration; original evidence outside these chapters not fully reread; no human or market validation.'});
console.log(JSON.stringify({checkpoint,command_count:commands.length,capture_prelaunch_failures:incomplete,inventory:audit.main_baseline_inventory,updated_116_evidence_hash_count:changedEvidence.length,unchanged_observations:observations,new119_quote_count:quotes.length}));
