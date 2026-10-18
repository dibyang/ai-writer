import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {phase,root,project,branch,id,token,json,sha,put,state,fingerprint} from './session.mjs';
const out=label=>json(path.join(root,'commands','native-three-'+label,'stdout.raw.txt'));
const s=state(),before=json(path.join(phase,'main-before-state.raw.json')),committed=json(path.join(phase,'main-after-commit-state.raw.json'));
const status=out('main-status-paused'),check=out('main-check-paused'),cmp=out('tool-compare-copy');
const txid=out('revision-commit').transaction_id,tx=json(path.join(project,'.writer/transactions',txid,'transaction.json'));
function allFiles(dir,prefix=''){let rows=[];for(const e of fs.readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){const f=path.join(dir,e.name),ref=(prefix?prefix+'/':'')+e.name;if(e.isSymbolicLink())throw Error('Unexpected link '+f);if(e.isDirectory())rows.push(...allFiles(f,ref));else if(e.isFile()){const b=fs.readFileSync(f);rows.push({ref,bytes:b.length,sha256:sha(b)});}}return rows;}
const backups=tx.plan.map(e=>({file:e.file,before:e.before,after:e.after,old_ref:e.old_ref,new_ref:e.new_ref,old_valid:e.before===null?e.old_ref===null:sha(fs.readFileSync(path.join(project,e.old_ref)))===e.before,new_valid:sha(fs.readFileSync(path.join(project,e.new_ref)))===e.after}));
assert(backups.every(e=>e.old_valid&&e.new_valid));
const versions=Object.values(before.source_versions).map(v=>({id:v.id,sha256:v.sha256,unchanged:JSON.stringify(s.source_versions[v.id])===JSON.stringify(v),bytes_valid:sha(fs.readFileSync(path.join(project,v.object_ref)))===v.sha256}));
assert(versions.every(v=>v.unchanged&&v.bytes_valid));
const oldEventsPreserved=before.source_events.every(e=>s.source_events.some(n=>JSON.stringify(e)===JSON.stringify(n)));
assert(oldEventsPreserved);
const units=s.units.map(u=>{const b=fs.readFileSync(path.join(project,u.draft));return{...u,actual_sha256:sha(b),body_han:[...b.toString('utf8').replace(/^#[^\n]*\r?\n/,'')].filter(c=>/\p{Script=Han}/u.test(c)).length};});
assert(units.every(u=>u.actual_sha256===u.sha256));
assert.deepEqual(units.map(u=>u.unit),[1,2,3,4,5,6]);
assert.equal(units[0].sha256,before.units[0].sha256);
for(const u of units)assert.equal(u.source_bindings['设定/权威规则.md'].version_id,u.unit===1?'RULES_V1':'RULES_V3_FROM2');
const exp=json(path.join(phase,'export-six/manifest.json')),manuscript=fs.readFileSync(path.join(phase,'export-six/manuscript.md'),'utf8');
assert.deepEqual(exp.included_units,[1,2,3,4,5,6]);assert.deepEqual(exp.excluded_drafts,[]);assert.deepEqual(exp.warnings,[]);assert.equal(sha(Buffer.from(manuscript)),exp.sha256);
const exportBody=units.map(u=>({unit:u.unit,full_text_present:manuscript.includes(fs.readFileSync(path.join(project,u.draft),'utf8').trim())}));assert(exportBody.every(u=>u.full_text_present));
const denials=['resume-wrong-token','main-bypass-style-scan','denied-context7','denied-template7'].map(label=>{const d=path.join(root,'commands','native-three-'+label),m=json(path.join(d,'result.json')),err=json(path.join(d,'stderr.raw.txt'));return{label:'native-three-'+label,exit:m.exit_code,code:err.code,state_unchanged:m.before_state_sha256===m.after_state_sha256,state_sha256:m.before_state_sha256};});assert(denials.every(d=>d.state_unchanged&&d.exit===2));
const commandDirs=fs.readdirSync(path.join(root,'commands')).filter(n=>n.startsWith('native-three-')).sort();
const calls=commandDirs.map(label=>{const d=path.join(root,'commands',label),m=json(path.join(d,'result.json'));const raw=fs.readFileSync(path.join(d,m.exit_code===0?'stdout.raw.txt':'stderr.raw.txt'),'utf8');const o=JSON.parse(raw);return{label,...m,product:{ok:o.ok,code:o.code,revision:o.revision,status:o.status,unchanged:o.unchanged},stdout_ref:'commands/'+label+'/stdout.raw.txt',stderr_ref:'commands/'+label+'/stderr.raw.txt'};});
assert(calls.every(c=>[0,2].includes(c.exit_code)));
assert.equal(calls.filter(c=>c.exit_code!==0).length,4);
const stateBytes=fs.readFileSync(path.join(project,'.writer/state.json'));
const proofs={schema_version:s.schema_version,base_revision:28,commit_revision:committed.revision,final_revision:s.revision,branch_revision:state(branch).revision,
 main_unchanged_until_commit:json(path.join(phase,'pre-prepare-verification.json')).main_state_unchanged,commit_idempotence:json(path.join(phase,'commit-invariance.json')),
 final_state_sha256:sha(stateBytes),pending_removed:Object.keys(s.impact_pending).length===0,first_chapter_unchanged:units[0].sha256===before.units[0].sha256,
 final_rule_bindings:units.map(u=>({unit:u.unit,version:u.source_bindings['设定/权威规则.md'].version_id})),old_versions:versions,old_source_events_preserved:oldEventsPreserved,
 post_pause_units_unchanged:JSON.stringify(committed.units)===JSON.stringify(s.units),post_pause_snapshot_unchanged:JSON.stringify(committed.snapshot)===JSON.stringify(s.snapshot),
 rolling_review_before_pause:out('main-check-committed').rolling_review,rolling_review_after_pause:check.rolling_review,denials,
 next_unit:status.next_unit,stage:status.governance.stage,authorization:status.governance.authorization,no_chapter7_file:!fs.readdirSync(path.join(project,'正文')).some(f=>/^0007/.test(f)),no_chapter7_plan:!fs.existsSync(path.join(project,'大纲/单元/0007.json')),
 export:{directory:path.join(phase,'export-six'),included_units:exp.included_units,excluded_drafts:exp.excluded_drafts,warnings:exp.warnings,status:exp.status,sha256:exp.sha256,full_text_checks:exportBody,files:allFiles(path.join(phase,'export-six'))},
 transaction:{id:txid,status:tx.status,backups},branch_retained:fs.existsSync(path.join(branch,'.writer/state.json')),
 base_unchanged:sha(fs.readFileSync(path.join(phase,'session-before/base.json')))===sha(fs.readFileSync(path.join(project,'.writer/revisions',id,'base.json'))),
 copy_comparison:{same_version:cmp.same_version,same_content:cmp.same_content,differences:cmp.differences,copy_content_id:cmp.left.observed_content_id,main_content_id:cmp.right.observed_content_id,copy_manifest_clean:cmp.left.missing.length===0&&cmp.left.mismatches.length===0},
 cli_calls:calls.length,exit_counts:Object.fromEntries([0,2].map(n=>[n,calls.filter(c=>c.exit_code===n).length])),recorded_build_guards:[...new Set(calls.map(c=>c.build_before.runtime_guard_id))],all_process_runtime_files_stable:calls.every(c=>c.runtime_files_stable)};
assert.equal(s.revision,30);assert.equal(committed.revision,29);assert.equal(check.rolling_review.valid,1);assert.deepEqual(check.rolling_review.pending_windows,[]);
assert(proofs.base_unchanged&&proofs.post_pause_units_unchanged&&proofs.post_pause_snapshot_unchanged&&proofs.pending_removed&&proofs.no_chapter7_file&&proofs.no_chapter7_plan);
put(path.join(phase,'verification.json'),proofs);
put(path.join(phase,'command-index.json'),calls);
put(path.join(phase,'final-state.raw.json'),stateBytes);
put(path.join(phase,'final-units-and-inputs.json'),units);
put(path.join(phase,'final-source-history.json'),{versions:s.source_versions,ranges:s.source_ranges,events:s.source_events});
put(path.join(phase,'final-ledger.json'),s.snapshot);
put(path.join(phase,'transaction-manifest.raw.json'),fs.readFileSync(path.join(project,'.writer/transactions',txid,'transaction.json')));
put(path.join(phase,'final-work-hashes.json'),{project,files:allFiles(project)});
const refs=[...new Set(['writer.json','研究/第二会话-合成作者修订原话.md',...units.flatMap(u=>Object.keys(u.source_hashes)).filter(r=>r!=='.writer/state.json'),...Object.values(s.source_versions).map(v=>v.object_ref)])];
put(path.join(phase,'final-input-hashes.json'),refs.map(ref=>({ref,sha256:sha(fs.readFileSync(path.join(project,ref)))})));
for(const label of commandDirs){const target=path.join(phase,'commands',label);fs.cpSync(path.join(root,'commands',label),target,{recursive:true,errorOnExist:true,force:false});}
put(path.join(phase,'summary.json'),{validation_session:'native-three-independent-codex-session',synthetic_authorization:true,status:'completed-revision-transaction-and-paused',project,phase_directory:phase,session_id:id,transaction_id:txid,base_revision:28,commit_revision:29,final_revision:30,branch_revision:45,next_unit:7,chapter7_written:false,registered_count:6,total_body_han:units.reduce((n,u)=>n+u.body_han,0),state_sha256:sha(stateBytes),units:units.map(u=>({unit:u.unit,draft:u.draft,sha256:u.sha256,body_han:u.body_han,rule_version:u.source_bindings['设定/权威规则.md'].version_id})),calls:proofs.cli_calls,exit_counts:proofs.exit_counts,product_defects_found:[],helper_errors:[{file:'read-more.mjs',error:'TypeError from helper using s.sources.versions instead of actual s.source_versions',product_invoked:false,product_state_affected:false}],verification:'verification.json',model_review:'model-review-final.md',command_index:'command-index.json',export:proofs.export,limits:['同会话知情模型实读，不是独立盲读或真人验收','check和review覆盖字段仅为机械/流程证据','未验证跨机共享盘、断电/中断恢复、市场或平台发布','随附工具保留原副本，只比较不升级']});
put(path.join(phase,'handoff.json'),{session_id:id,token,workspace:branch,status:'committed',transaction_id:txid,project,base_revision:28,commit_revision:29,final_revision:30,main_state_sha256:sha(stateBytes),branch_revision:45,phase:'structure',next_unit:7,allowed_actions:['discuss','plan'],draft_range:null,revise_range:null,stop:'暂停正文；第七章须新的有限作者授权',evidence:'研究/第二会话-合成作者修订原话.md',evidence_sha256:sha(fs.readFileSync(path.join(project,'研究/第二会话-合成作者修订原话.md'))),unresolved:['第7章以后具体剧情和新借验是否出现尚未选择'],files:{summary:'summary.json',verification:'verification.json',model_review:'model-review-final.md',ledger:'final-ledger.json',hashes:'final-work-hashes.json',inputs:'final-input-hashes.json',commands:'command-index.json',export:'export-six/manifest.json'}});
console.log(JSON.stringify({calls:proofs.cli_calls,exit_counts:proofs.exit_counts,state_sha256:proofs.final_state_sha256,main_revision:s.revision,commit_revision:committed.revision,work_files:allFiles(project).length,total_body_han:units.reduce((n,u)=>n+u.body_han,0),backups:backups.length,old_versions:versions.length,build_guards:proofs.recorded_build_guards,copy_differences:cmp.differences.length,export_checks:exportBody}));
