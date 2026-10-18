import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { isDeepStrictEqual as same } from 'node:util';
import { root, batch, stage, work, load, state, put, sha, inventory } from './helpers.mjs';
const old=load(path.join(stage,'before/work/.writer/state.json')), now=state();
const access=load(path.join(stage,'session-access.json'));
const rel=p=>path.relative(root,p).replaceAll('\\','/');
const info=p=>{const b=fs.readFileSync(p);return {path:p.replaceAll('\\','/'),bytes:b.length,sha256:sha(b)};};
const jsonSha=x=>sha(JSON.stringify(x));
const commandNames=fs.readdirSync(path.join(batch,'commands')).filter(n=>n.startsWith('native-two-')).sort();
assert.equal(commandNames.length,32);
const commands=commandNames.map(label=>{
 const d=path.join(batch,'commands',label),meta=load(path.join(d,'result.json'));
 assert.equal(meta.cwd,root);assert.equal(meta.args[0],'bin/ai-writer.mjs');
 assert.ok(meta.runtime_files_stable);assert.equal(meta.build_before.runtime_guard_id,'c9c6ca170c19b518a26782e6aae044c27c84f4ca0c5d88830aba1a44ddc7e0ec');
 if(meta.input)assert.equal(info(path.join(d,'input.raw.json')).sha256,meta.input.sha256);
 return {label,...meta,files:Object.fromEntries(fs.readdirSync(d).map(n=>[n,info(path.join(d,n))]))};
});
put(path.join(stage,'command-index.json'),{nature:'actual capture records; stdout/stderr are product output; result.json is recorder metadata',entry:path.join(root,'bin/ai-writer.mjs'),cwd:root,count:commands.length,commands});
const get=label=>load(path.join(batch,'commands',label,'stdout.raw.txt'));
const check=get('native-two-29-final-check'),status=get('native-two-30-final-status'),issues=get('native-two-28-issues-applied');
const identify0=get('native-two-01-identify'),identify1=get('native-two-32-identify-final');
assert.equal(identify0.observed_content_id,identify1.observed_content_id);assert.deepEqual(identify0.files,identify1.files);
const originalInventory=load(path.join(stage,'before/inventory.json'));
const changedOriginal=[],unchangedOriginal=[],missingOriginal=[];
for(const [ref,item] of Object.entries(originalInventory)){
 const p=path.join(work,ref);
 if(!fs.existsSync(p)){missingOriginal.push(ref);continue;}
 const current=info(p);(current.sha256===item.sha256?unchangedOriginal:changedOriginal).push(ref);
}
assert.deepEqual(missingOriginal,[]);
assert.deepEqual(changedOriginal.sort(),['.writer/state.json','大纲/单元/0005.json','正文/0005-抽屉留条缝.md'].sort());
const sourceBefore=load(path.join(stage,'source-observation-index.json'));
const sourceDrift=Object.entries(sourceBefore).filter(([ref,item])=>info(path.join(root,ref)).sha256!==item.sha256).map(([ref])=>ref);
assert.deepEqual(sourceDrift,[]);
const units=now.units.map((u,i)=>{
 const b=old.units[i], before=fs.readFileSync(path.join(stage,'before/work',b.draft)),after=fs.readFileSync(path.join(work,u.draft));
 const row={unit:u.unit,draft:u.draft,before:{bytes:before.length,sha256:sha(before)},after:{bytes:after.length,sha256:sha(after)},body_unchanged:before.equals(after),complete_registration_object_unchanged:same(b,u),old_unit_object_sha256_json_stringify:jsonSha(b),new_unit_object_sha256_json_stringify:jsonSha(u),old_journal:info(path.join(work,b.journal)),current_journal:info(path.join(work,u.journal)),old_summary:b.summary,new_summary:u.summary,old_source_hashes:b.source_hashes,new_source_hashes:u.source_hashes,replay_review:u.replay_review??null,body_han_count:(after.toString('utf8').split(/\r?\n/).slice(1).join('\n').match(/\p{Script=Han}/gu)||[]).length};
 if(i!==4)assert.equal(row.body_unchanged,true);
 if(i<4)assert.equal(row.complete_registration_object_unchanged,true);
 else assert.ok(row.replay_review);
 assert.equal(row.old_journal.sha256,b.journal_sha256);assert.equal(row.current_journal.sha256,u.journal_sha256);
 return row;
});
const original5=fs.readFileSync(path.join(stage,'before/work',old.units[4].draft),'utf8'),new5=fs.readFileSync(path.join(work,now.units[4].draft),'utf8');
assert.equal(new5,original5.replace('布袋里里','布袋里'));
assert.equal((original5.match(/布袋里里/g)||[]).length,1);assert.equal((new5.match(/布袋里里/g)||[]).length,0);
const facts=s=>{const x=structuredClone(s);for(const e of Object.values(x.ledger))delete e.evidence;return x;};
assert.deepEqual(facts(old.snapshot),facts(now.snapshot));
const ledger=Object.entries(old.snapshot.ledger).map(([id,e])=>{const n=now.snapshot.ledger[id],{evidence:be,...bf}=e,{evidence:ae,...af}=n;return {id,fact_content_unchanged:same(bf,af),before_fact_sha256_json_stringify:jsonSha(bf),after_fact_sha256_json_stringify:jsonSha(af),before_evidence_count:be.length,after_evidence_count:ae.length};});
const evidence=load(path.join(stage,'evidence-version-diff.json'));
const previewLabels=['native-two-14-preview-5-unfinished-denied','native-two-15-preview-5-reviewed','native-two-18-preview-6-reviewed'];
const previews=previewLabels.map(label=>{const c=commands.find(c=>c.label===label);assert.equal(c.before_state_sha256,c.after_state_sha256);return {label,exit_code:c.exit_code,state_sha256_before:c.before_state_sha256,state_sha256_after:c.after_state_sha256,state_unchanged:true,product:get(label)};});
assert.equal(previews[0].exit_code,1);assert.equal(previews[0].product.ok,false);assert.ok(previews[0].product.findings.some(f=>f.message.includes('正文找不到证据引文')));
const repeat=commands.find(c=>c.label==='native-two-24-commit-idempotent');assert.equal(repeat.before_state_sha256,repeat.after_state_sha256);
const commit=load(path.join(work,now.committed_revisions.at(-1).ref));
const commitResult=load(path.join(stage,'commit-result.json'));
const txref=`.writer/transactions/${commitResult.transaction_id}/transaction.json`,tx=load(path.join(work,txref));
assert.equal(tx.status,'completed');assert.equal(commit.base_revision,13);assert.equal(commit.branch_revision,16);assert.equal(load(path.join(stage,'after-commit-state.json')).revision,14);
const originalFunctionRef=Object.keys(old.review_workflow.reports)[0];
assert.equal(info(path.join(work,originalFunctionRef)).sha256,old.review_workflow.reports[originalFunctionRef]);
assert.equal(check.rolling_review.stale,1);assert.deepEqual(check.rolling_review.pending_windows,[{from:1,to:6}]);
assert.equal(now.revision,16);assert.equal(now.governance.stage,'paused');assert.deepEqual(now.governance.authorization.allowed_actions,['discuss','plan']);assert.equal(now.governance.authorization.draft_range,null);assert.equal(now.governance.authorization.revise_range,null);
assert.deepEqual(issues.counts,{applied:1,retained:1,deferred:1});
for(const issue of Object.values(now.review_workflow.issues)){assert.equal(issue.verification,null);assert.equal(issue.resolution.decision_actor,'author');assert.equal(issue.resolution.author_evidence.source_sha256,load(path.join(stage,'author-evidence.json')).source_sha256);}
assert.ok(!commands.some(c=>c.args.includes('verify')));
const seventh=fs.readdirSync(path.join(work,'正文')).filter(n=>/^(?:0007|第0*7)/.test(n));assert.deepEqual(seventh,[]);
const verification={
 nature:'mechanical evidence and native model reading declarations; not human/market/product release acceptance',generated_at:new Date().toISOString(),project:work.replaceAll('\\','/'),schema_version:now.schema_version,
 revisions:{initial:old.revision,after_workflow:10,after_three_author_choices:13,branch_after_rewind:14,branch_after_record5:15,branch_after_record6_and_basic_review:16,main_after_commit:14,main_after_apply:15,main_after_pause:16,commit_advanced_main_once:true,repeat_commit_state_unchanged:true},
 units,only_body_difference:{unit:5,line:25,before:'林禾把钥匙放回布袋里里，收紧袋口，搁进自己柜台下的抽屉。',after:'林禾把钥匙放回布袋里，收紧袋口，搁进自己柜台下的抽屉。',removed:'里',utf8_bytes_removed:3,entire_other_bytes_equal:true},
 facts:{snapshot_before_sha256_json_stringify:jsonSha(old.snapshot),snapshot_after_sha256_json_stringify:jsonSha(now.snapshot),content_without_evidence_equal:true,content_before_sha256_json_stringify:jsonSha(facts(old.snapshot)),content_after_sha256_json_stringify:jsonSha(facts(now.snapshot)),characters_unchanged:same(old.snapshot.characters,now.snapshot.characters),timeline_unchanged:same(old.snapshot.timeline,now.snapshot.timeline),ledger,versioned_evidence_changes:evidence.evidence_changes},
 first_four:{all_complete_registration_objects_equal:true,all_bodies_equal:true,all_old_journals_preserved:true,object_hash_algorithm:'SHA256(JSON.stringify(complete units[i] object)); original state raw bytes also preserved in before/work'},
 original_files:{count:Object.keys(originalInventory).length,missing:missingOriginal,changed:changedOriginal,unchanged:unchangedOriginal,tool_copy_unchanged:unchangedOriginal.filter(r=>r.startsWith('.writer/tool/')).length,global_settings_and_volume_unchanged:true,old_frozen_objects_and_reports_preserved:true},
 previews,precommit_main_baseline:load(path.join(stage,'precommit-main-baseline-verification.json')),
 review:{final_tail_result:load(path.join(stage,'final-tail-review-result.json')),final_tail_record:info(path.join(work,load(path.join(stage,'final-tail-review-result.json')).ref)),old_function_table:{ref:originalFunctionRef,sha256:old.review_workflow.reports[originalFunctionRef],retained:true,current_valid:false},rolling_review:check.rolling_review,new_full_six_review_completed:false},
 issues:issues.issues.map(i=>({id:i.id,status:i.status,effective_status:i.effective_status,context_changed:i.context_changed,author_choice:i.resolution.author_choice,application:i.application,verification:i.verification})),
 transaction:{session_id:access.id,commit_id:commit.id,transaction_id:tx.id,status:tx.status,session:info(path.join(work,`.writer/revisions/${access.id}/session.json`)),commit:info(path.join(work,now.committed_revisions.at(-1).ref)),transaction:info(path.join(work,txref)),branch_preserved:true,backup_preserved:true},
 build:{main_identify_first:{content_id:identify0.observed_content_id,runtime_id:identify0.runtime_id},main_identify_final:{content_id:identify1.observed_content_id,runtime_id:identify1.runtime_id},same_files:true,all_command_guards:[...new Set(commands.map(c=>c.build_before.runtime_guard_id))],each_command_runtime_files_stable:true,source_files_checked:Object.keys(sourceBefore).length,source_drift:sourceDrift,tool_compare:load(path.join(stage,'tool-comparison.json')).differences,note:'capture/session build guard and tool identify runtime/content use different constructions; disk observation is not a signature or loaded-module attestation'},
 current:{state:info(path.join(work,'.writer/state.json')),stage:now.governance.stage,task:now.governance.task,authorization:now.governance.authorization,next_unit:status.next_unit,next:status.next,stale_units:status.stale_units,changed_sources:status.changed_sources,impact_pending:status.impact_pending,seventh_body_exists:false,check},
 command_count:commands.length,failures:commands.filter(c=>c.exit_code!==0).map(c=>({label:c.label,exit_code:c.exit_code,stdout:c.files['stdout.raw.txt'],stderr:c.files['stderr.raw.txt']})),auxiliary_errors:[],no_verify:true,no_git_commit_or_push:true,no_subagents_or_other_session_messages:true,no_tool_update:true,no_product_source_changes:true
};
put(path.join(stage,'verification.json'),verification);
put(path.join(stage,'reading-coverage.json'),{reader:'native-two independent Codex; informed model reread, not blind/human',initial_recovery:{units:units.map(u=>({unit:u.unit,draft:u.draft,sha256:u.before.sha256,lines:{1:46,2:50,3:44,4:38,5:34,6:44}[u.unit],method:'FastCtx entire file to EOF, sequential 1 to 6'}))},final_tail:{after_records:true,range:[5,6],reads:units.slice(4).map(u=>({unit:u.unit,draft:u.draft,sha256:u.after.sha256,lines:u.unit===5?[1,34]:[1,44],method:'FastCtx entire file to EOF in order 5 then 6, before formal review'})),review_ref:verification.review.final_tail_result.ref},limits:['No formal current full 1–6 reread in this phase','No review-issues verify','No human blind reading or market acceptance']});
const handoff={nature:'synthetic-acceptance; phase 2 completed through applied, formally paused',project:verification.project,title:'渡口旧箱',entry:path.join(root,'bin/ai-writer.mjs').replaceAll('\\','/'),cwd:root.replaceAll('\\','/'),state:verification.current.state,schema_version:5,revision:now.revision,stage:now.governance.stage,authorization:now.governance.authorization,task:now.governance.task,author_evidence:load(path.join(stage,'author-evidence.json')),issues:verification.issues,revision_session:{...access,workspace:access.workspace.replaceAll('\\','/'),status:'committed',branch_revision:16,main_commit_revision:14,commit_id:commit.id,transaction_id:tx.id,token_note:'local ownership token from actual begin; retained for evidence, committed terminal session cannot resume'},body_hashes:units.map(u=>({unit:u.unit,draft:u.draft,before:u.before,after:u.after})),first_four_registration:verification.first_four,facts:verification.facts,review:verification.review,next_phase:{current_full_six_review_required:true,review_issues_verify_performed:false,read_in_order:['AGENTS.md and current skills/manuals','native-revise-apply/report.md, handoff.json, verification.json, command-index.json','current status/workflow and original author choices','all six actual current bodies in order, facts/ledger/old evidence and full old function table'],start_commands:['node acceptance/20261018-governance-c/capture.mjs UNIQUE_NATIVE_LABEL node bin/ai-writer.mjs status --project acceptance/20261018-governance-c/native-create-review/work','node acceptance/20261018-governance-c/capture.mjs UNIQUE_NATIVE_LABEL node bin/ai-writer.mjs context --project acceptance/20261018-governance-c/native-create-review/work --purpose discussion'],requirements:['Next independent native Codex process must actually reread current full 1–6 and register one current report; 5–6 tail report does not replace it','Only after an appropriate next-stage task may bind actual review to the applied issue; retain original real commit/application','Preserve retained and deferred choices; no chapter7 or further revision authorization','Keep old stale function table, original opinions/reports, branch, before backup and transaction backups']},files:{report:rel(path.join(stage,'report.md')),verification:rel(path.join(stage,'verification.json')),commands:rel(path.join(stage,'command-index.json')),reading_coverage:rel(path.join(stage,'reading-coverage.json'))},scope_limits:['No changes to product source/skills/manuals or embedded tool','No real works, older sealed acceptance or global settings modified','No Git commit/push, child agents, cross-session messages, upload/publication','Not human blind review, market validation, full six-chapter current verification or product-wide release acceptance']};
put(path.join(stage,'handoff.json'),handoff);
console.log(JSON.stringify({state:verification.current.state,commands:commands.length,revisions:verification.revisions,body_hashes:units.map(u=>({unit:u.unit,before:u.before.sha256,after:u.after.sha256,body_unchanged:u.body_unchanged})),old_file_changes:changedOriginal,facts_unchanged:true,evidence_version_changes:evidence.evidence_changes.length,source_drift:sourceDrift,issue_counts:issues.counts,rolling_review:check.rolling_review,session_id:access.id,commit_id:commit.id,transaction_id:tx.id},null,2));
