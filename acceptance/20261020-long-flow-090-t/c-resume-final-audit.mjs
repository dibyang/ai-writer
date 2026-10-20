import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {base,work,read,sha,state,save} from './common.mjs';
const tj=ref=>JSON.parse(fs.readFileSync(path.join(base,ref),'utf8'));
const sj=ref=>JSON.parse(read(ref));
const s=state(), entry=tj('c-resume-entry-state.json'), cp=tj('checkpoint-c-first.json');
const content='682bc8215bf28cdfbe6d11ac98ceed0e9c5a74e591209624f4b05948c295aea9';
assert.equal(s.units.length,27);assert.equal(s.revision,69);assert.equal(s.tool_control.generation,5);
assert.equal(s.tool_control.installed.source_content_id,content);
assert.deepEqual(s.tool_control,entry.tool_control);assert.deepEqual(s.governance,entry.governance);
assert.deepEqual(s.units.slice(0,24),entry.units);
assert.deepEqual(s.snapshot.timeline.slice(0,entry.snapshot.timeline.length),entry.snapshot.timeline);
const oldLedger=Object.entries(entry.snapshot.ledger).map(([id,old])=>{
  const current=s.snapshot.ledger[id];assert.ok(current,id);
  for(const key of ['type','statement','author_truth','truth'])assert.deepEqual(current[key],old[key],id+'.'+key);
  return {id,immutable_fields_preserved:true};
});
const units=s.units.map(u=>{const actual=sha(read(u.draft));assert.equal(actual,u.sha256,u.draft);return{unit:u.unit,draft:u.draft,sha256:actual,registration_sha256:sha(Buffer.from(JSON.stringify(u))),entry_registration_unchanged:u.unit<=24?true:null};});
const archives=tj('c-resume-plan-archive-verification.json');
for(const p of archives.plans)assert.equal(sha(fs.readFileSync(path.join(base,p.archive))),p.sha256);
const prefix=cp.parts.map(p=>{
  const archive='分段/0025-before-r1/'+path.basename(p.ref);
  assert.equal(sha(read(p.ref)),p.sha256);assert.equal(sha(read(archive)),p.sha256);
  return{ref:p.ref,archive,sha256:p.sha256,bytes:read(p.ref).length,unchanged:true};
});
for(const item of [cp.context,cp.template])assert.equal(sha(read(item.ref)),item.sha256);
const sources=[];
function source(scope,ref){
  const dir=scope==='T'?base:work,b=fs.readFileSync(path.join(dir,ref));
  const item={scope,ref,path:path.join(dir,ref),bytes:b.length,sha256:sha(b)};sources.push(item);return item;
}
const chapters=[];
for(const n of [25,26,27]){
  const pad=String(n).padStart(4,'0'),contextRef='.writer/drafts/t-context-'+n+'-c-resume-r1.json',templateRef='.writer/drafts/t-record-'+n+'-c-resume-r1.json';
  const context=sj(contextRef),template=sj(templateRef),details=sj('交接/T-登记-'+pad+'.json');
  assert.equal(context.revision,n+41);assert.equal(template.expected_revision,context.revision);
  assert.deepEqual(template.source_hashes,context.source_hashes);assert.deepEqual(template.source_bindings,context.source_bindings);
  assert.deepEqual(s.units[n-1].source_hashes,context.source_hashes);
  assert.deepEqual(Object.keys(details).sort(),['changes','summary']);assert.ok(details.summary.trim());
  const bindings=Object.entries(context.source_hashes).map(([ref,hash])=>{
    const actual=ref==='.writer/state.json'
      ?sha(fs.readFileSync(path.join(base,'commands/context-'+n+'-c-resume-r1/before-state.json')))
      :sha(read(ref));
    assert.equal(actual,hash,ref);
    return{ref,sha256:hash,actual_sha256:actual,binding:ref==='.writer/state.json'?'actual-state-at-prepare-command':'current-file-still-matches-prepare'};
  });
  const parts=fs.readdirSync(path.join(work,'分段',pad)).filter(f=>/^part-\d+\.md$/.test(f)).sort().map(f=>source('work','分段/'+pad+'/'+f));
  assert.equal(parts.length,n===25?6:4);
  const body=read('正文/'+pad+'.md').toString('utf8');
  assert.equal(parts.map(p=>read(p.ref).toString('utf8')).join('\n\n'),body);
  assert.equal((body.match(/^# /gm)||[]).length,1);
  const han=[...body.replace(/^#.*$/gm,'').matchAll(/\p{Script=Han}/gu)].length;
  assert.ok(han>=(n===25?10500:5000)&&han<=(n===25?12500:6500));
  for(const p of parts){const t=read(p.ref).toString('utf8');p.han=[...t.replace(/^#.*$/gm,'').matchAll(/\p{Script=Han}/gu)].length;p.eof_line=t.split('\n').length;}
  const bodySource=source('work','正文/'+pad+'.md'),metrics=tj('chapter-'+n+'-c-resume-r1-metrics.json');
  assert.equal(metrics.sha256,bodySource.sha256);assert.equal(metrics.han,han);
  const report=source('work','审查/T-'+pad+'-纲文回对.md');
  assert.equal(metrics.pre_record_review.sha256,report.sha256);
  assert.ok(read(report.ref).toString('utf8').includes(bodySource.sha256));
  const record=tj('commands/record-'+n+'-c-resume-r1/result.json');
  assert.equal(record.exit_code,0);
  assert.ok(fs.statSync(path.join(work,report.ref)).mtimeMs<=Date.parse(record.started_at),'report modified after record '+n);
  source('work','交接/T-细纲-'+pad+'.json');source('work','大纲/单元/'+pad+'.json');
  source('work','交接/T-登记-'+pad+'.json');source('work','审查/T-'+pad+'-未变候选判断.md');
  const contextSource=source('work',contextRef),templateSource=source('work',templateRef);
  source('T','chapter-'+n+'-c-resume-r1-metrics.json');
  for(const label of ['plan','context','template','preview','record','check']){
    source('T','commands/'+label+'-'+n+'-c-resume-r1/result.json');
  }
  chapters.push({unit:n,han,body:bodySource,parts,context:contextSource,template:templateSource,source_hashes_verified:bindings,pre_record_report:report,record_started_at:record.started_at});
}
const before=tj('c-resume-22-27-read-before.json'),after=tj('c-resume-22-27-read-after.json');
assert.deepEqual(before.files,after.files);assert.equal(before.state_sha256,after.state_sha256);
assert.equal(after.state_sha256,sha(read('.writer/state.json')));
const readRanges={22:[[1,90],[91,167]],23:[[1,85],[86,159]],24:[[1,85],[86,153]],25:[[1,115],[116,225],[226,329]],26:[[1,110],[111,211]],27:[[1,169]]};
for(const f of after.files)source('work',f.ref);
const help=tj('c-resume-help-verification.json'),helpRecord=tj('c-resume-help-record-verification.json');
for(const p of [help,helpRecord]){assert.equal(p.ok,true);assert.equal(p.state_before,p.state_after);assert.equal(typeof p.text,'string');assert.ok(p.text.length>0);}
const oldProbe=tj('c-resume-25-old-template-reject-verification.json');
assert.equal(oldProbe.expected_exit,2);assert.equal(oldProbe.result.ok,false);assert.equal(oldProbe.state_before,oldProbe.state_after);
assert.match(oldProbe.result.error,/追踪修订号已变化/);assert.equal(oldProbe.result.code,'COMMAND_FAILED');
const probe=JSON.parse(fs.readFileSync(oldProbe.input,'utf8')),oldTemplate=sj(cp.template.ref);
for(const key of ['expected_revision','source_hashes','source_bindings'])assert.deepEqual(probe[key],oldTemplate[key]);
assert.ok(probe.summary.trim());assert.equal(oldProbe.valid_current_draft_sha256,units[24].sha256);
const oldR=tj('c-resume-old-r-identity-verification.json'),rSession=tj('r1-session.json');
assert.equal(oldR.expected_exit,1);assert.equal(oldR.result.ok,false);assert.ok(oldR.result.revision_context);
assert.ok(!JSON.stringify(oldR.result).includes('ENOENT'));
assert.equal(oldR.main_before,oldR.main_after);assert.equal(oldR.candidate_before,oldR.candidate_after);
assert.equal(sha(fs.readFileSync(path.join(rSession.workspace,'.writer/state.json'))),oldR.candidate_after);
assert.ok(!fs.existsSync(path.join(rSession.workspace,'.writer/tool')));
const check=tj('c-resume-post-review-check.json'),doctor=tj('c-resume-final-doctor.json'),identify=tj('c-resume-final-identify.json'),status=tj('c-resume-final-status.json'),workflow=tj('c-resume-final-workflow-show.json'),revisions=tj('c-resume-final-revisions.json');
for(const r of [check,doctor,identify,status,workflow,revisions])assert.equal(r.ok,true);
assert.deepEqual(check.findings,[]);assert.deepEqual(doctor.errors,[]);assert.deepEqual(doctor.warnings,[]);
assert.deepEqual(identify.missing,[]);assert.deepEqual(identify.mismatches,[]);assert.equal(identify.observed_content_id,content);
assert.deepEqual(status.stale_units,[]);assert.deepEqual(status.changed_sources,[]);assert.deepEqual(status.impact_pending,[]);assert.equal(status.next_unit,28);
assert.ok(revisions.sessions.every(r=>!['active','open','draft'].includes(r.status)));
assert.ok(revisions.transactions.every(r=>r.status==='completed'));
const commandLabels=['c-resume-help','c-resume-help-record','c-resume-old-r-identity','c-resume-25-old-template-record-reject','review-27','c-resume-post-review-check','c-resume-final-doctor','c-resume-final-identify','c-resume-final-status','c-resume-final-workflow-show','c-resume-final-revisions'];
const commands=commandLabels.map(label=>{
  const r=tj('commands/'+label+'/result.json');
  assert.equal(r.before_state_sha256,r.after_state_sha256,label);
  source('T','commands/'+label+'/result.json');source('T','commands/'+label+'/stdout.raw.txt');source('T','commands/'+label+'/stderr.raw.txt');
  return{label,exit_code:r.exit_code,before_state_sha256:r.before_state_sha256,after_state_sha256:r.after_state_sha256};
});
const failureLabels=['c-resume-25-old-template-reject','c-resume-26-preflight-preview','c-resume-final-workflow'];
const retainedFailures=failureLabels.map(label=>{
  const r=tj('commands/'+label+'/result.json');assert.equal(r.before_state_sha256,r.after_state_sha256);
  for(const ref of ['result.json','stdout.raw.txt','stderr.raw.txt'])source('T','commands/'+label+'/'+ref);
  return{label,actual_cli_exit:r.exit_code,state_unchanged:true};
});
for(const ref of [
 'execution-guide.md','checkpoint-c-first.json','r1-publish-verification.json','final-tool-update-verification.json','delivery-current.json','final-build-verification.json','r1-session.json','c25-prefix-archive.json',
 'c-resume-entry-state.json','c-resume-source-comparison.json','c-resume-plan-archive-verification.json',
 'c-resume-help-verification.json','c-resume-help-record-verification.json','c-resume-old-r-identity-verification.json','c-resume-25-old-template-reject-verification.json','c-resume-25-preview-exit-mismatch.json',
 'c-resume-26-patch-failure.md','c-resume-registered-issue-27-h1.json','c-resume-22-27-read-before.json','c-resume-22-27-read-after.json',
 'c-resume-post-review-check.json','c-resume-final-doctor.json','c-resume-final-identify.json','c-resume-final-status.json','c-resume-final-workflow-show.json','c-resume-final-revisions.json',
 'inputs/c-resume-25-old-template-record-probe.json'
])source('T',ref);
for(const ref of ['交接/T-C-中断0025.md','交接/T-R1-正式提交.md','审查/T-R1-0015-0024.md','审查/T-C-resume-来源影响核对.md','审查/T-0022-0027.md','审查/T-C-已登记问题-0027-H1.md','交接/T-C-完成0027.md',cp.context.ref,cp.template.ref])source('work',ref);
for(const p of archives.plans)source('T',p.archive);
for(const p of prefix)source('work',p.archive);
assert.ok(!fs.existsSync(path.join(work,'正文/0028.md')));assert.ok(!fs.existsSync(path.join(work,'分段/0028')));
assert.ok(!fs.existsSync(path.join(work,'.writer/drafts/t-context-28-c-resume-r1.json')));
const issue=tj('c-resume-registered-issue-27-h1.json');
for(const e of issue.evidence){assert.equal(sha(read(e.ref)),e.sha256);assert.ok(read(e.ref).toString('utf8').includes(e.quote));}
const report=read('审查/T-0022-0027.md').toString('utf8');assert.ok(report.includes('C27-H1'));
save('c-resume-verification.json',{
  ok:true,scope:'authorized-C-resume-through-27-with-one-reported-registered-story-defect',literary_all_pass:false,
  current:{registered_count:27,revision:s.revision,state_sha256:sha(read('.writer/state.json')),generation:5,content_id:content,runtime_id:s.tool_control.installed.runtime_id,next_unit:28,active_revisions:[],pending_transactions:[]},
  entry:{registered_count:24,revision:entry.revision,state_sha256:sha(fs.readFileSync(path.join(base,'c-resume-entry-state.json'))),generation:entry.tool_control.generation},
  prior_24_bodies_and_registrations_preserved:true,units,old_ledger_immutable_fields:oldLedger,original_prefix:prefix,
  old_context_template_preserved:true,original_plans_preserved:archives.plans,chapters,
  complete_final_read:{order:[22,23,24,25,26,27],read_ranges:readRanges,eof_included:true,before_after_files_equal:true,state_unchanged:true,total_han:after.files.reduce((sum,f)=>sum+f.han,0)},
  help_actual_plain_text_success:true,old_r_identity_expected_rejection:{expected_exit:1,not_enoent:true,candidate_state_unchanged:true,candidate_without_runtime:true},
  valid_draft_old_template_rejected:{expected_exit:2,actual_error:oldProbe.result.error,actual_code:oldProbe.result.code,state_unchanged:true,template_fields_unchanged:true},
  commands,retained_failures:retainedFailures,non_command_patch_failure:'c-resume-26-patch-failure.md',
  story_issues:[issue],metadata_explanation:'O_RACK_PATTERN.reader_known historical24day sentence; current25day custody/evidence controls; report M1, original observation not rewritten',
  unverified:['historical review coverage windows10-15 and13-18','future recycler arrival/weight/price/exchange','rice cooker diagnosis/repair/cost','unseen morning delivery and Xu home actions except spoken/SMS reports','long-term wheel and household fabric durability','wholeT30 and human/market acceptance'],
  stop:{after:27,no_chapter28_body_parts_or_tagged_context:true,no_commit_push_seal:true,no_agents_network_product_or_global_writes:true},
  parent_extended_tests:'Read final-build-verification.json only; not rerun by C',sources
});
process.stdout.write(JSON.stringify({ok:true,registered:27,revision:s.revision,state_sha256:sha(read('.writer/state.json')),prior24_unchanged:true,source_count:sources.length,body_han:chapters.map(c=>c.han),registered_story_issues:['C27-H1'],verification_sha256:sha(fs.readFileSync(path.join(base,'c-resume-verification.json')))},null,2));
