import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {main} from '../lib/workspace.mjs';
import {fixture,state,file,call,evidence,workflow,begin,sha,freeze,publishInput} from './protection-fixture.mjs';

function prepared(t,versionedPlan=false){
  const {root,dir}=fixture(t,6);assert.equal(state(root).units.some(u=>Object.hasOwn(u.source_hashes,'大纲/全书大纲.md')),false);fs.unlinkSync(path.join(root,'大纲/全书大纲.md'));
  call(root,'plan',null,{unit:7,title:'继承的未登记计划',goal:'旧计划目标',change:'尚未写入',beats:['未来计划'],cast:[],setting_refs:[],research_refs:[]});if(versionedPlan){freeze(root,'PLAN7_VERSION','大纲/单元/0007.json');call(root,'source','publish',publishInput(root,'PLAN7_VERSION'));}workflow(root,true); const old=begin(root), candidate=old.workspace;
  const draft='.writer/drafts/pending/0007.md', privateRef='.writer/drafts/pending/outline.md';
  file(candidate,draft,'# 第七章\n\n阿禾没有再试铜片的旧锁。他把第六处桥头的回执交给守桥人，约好明日核账。\n');
  file(candidate,privateRef,'写前准备附件，不作为正式细纲来源。');file(candidate,'大纲/第七章依据.md','交回执，约定明日核账。');
  const refs=['writer.json','正文/0006.md','研究/验证授权.md','大纲/第七章依据.md',privateRef];
  const manifest={nature:'pending-draft-source-manifest-not-official-record-template',revision:state(candidate).revision,source_hashes:Object.fromEntries(refs.map(ref=>[ref,sha(fs.readFileSync(path.join(candidate,ref)))]))};
  const manifestRef='.writer/drafts/prewriting.json';file(root,manifestRef,manifest);
  const input={expected_revision:state(candidate).revision,expected_state_sha256:sha(fs.readFileSync(path.join(candidate,'.writer/state.json'))),expected_session_sha256:sha(fs.readFileSync(path.join(root,`.writer/revisions/${old.id}/session.json`))),token:old.token,target:path.join(dir,'continuation'),owner:'continuation-test',unit:7,author_evidence:evidence(candidate),draft,draft_sha256:sha(fs.readFileSync(path.join(candidate,draft))),manifest:{root:'parent',ref:manifestRef,sha256:sha(fs.readFileSync(path.join(root,manifestRef))),audit_only_refs:[privateRef]}};
  return {root,old,candidate,input,dir};
}
function plan(branch,unit=7,setting_refs=[]){return call(branch.workspace,'plan',null,{unit,title:'交回执',goal:'核账',change:'约定明日',beats:['交回执'],cast:['阿禾'],setting_refs,research_refs:['大纲/第七章依据.md']},branch.token);}

test('完整六章消费链派生、显式采纳第七章并保留原候选，下一章及发布拒绝',t=>{
  const f=prepared(t), before=fs.readFileSync(path.join(f.candidate,'.writer/state.json')), sessionBefore=fs.readFileSync(path.join(f.root,`.writer/revisions/${f.old.id}/session.json`)), mainBefore=fs.readFileSync(path.join(f.root,'.writer/state.json'));
  const branch=call(f.candidate,'revision','continue',f.input); const root=branch.workspace;
  assert.deepEqual(state(root).units,state(f.candidate).units);assert.deepEqual(state(root).snapshot,state(f.candidate).snapshot);
  assert.deepEqual(state(root).baseline,state(f.candidate).baseline);assert.deepEqual(state(root).governance_events.slice(0,-1),state(f.candidate).governance_events);
  assert.equal(fs.existsSync(path.join(root,'大纲/全书大纲.md')),false,'不重新引入原候选已删除的初始化占位文件');
  assert.throws(()=>plan(branch,8),e=>['REVISION_SCOPE_INVALID','CONTINUATION_SCOPE_INVALID'].includes(e.code));
  assert.throws(()=>plan(branch,7,['.writer/drafts/pending/outline.md']),e=>e.code==='REVISION_PRIVATE_REFERENCE');
  file(root,'研究/后来补的来源.md','后来补的材料不能追认成动笔前来源');assert.throws(()=>plan(branch,7,['研究/后来补的来源.md']),e=>e.code==='ADOPTION_SOURCE_NOT_DECLARED');
  plan(branch);
  assert.equal(main(['context','--project',root,'--unit','7']).unit,7);
  assert.throws(()=>main(['record-template','--project',root,'--unit','7','--draft','正文/0007.md']),e=>e.code==='DRAFT_ADOPTION_REQUIRED');
  assert.throws(()=>call(root,'revision','adopt',{unit:7,expected_revision:state(root).revision,draft:'正文/0007.md'}),e=>e.code==='REVISION_OWNER_REQUIRED');
  const input=call(root,'revision','adopt',{unit:7,expected_revision:state(root).revision,draft:'正文/0007.md'},branch.token);
  assert.equal(input.registered,false);assert.equal(input._replay,undefined);
  const receipt=JSON.parse(fs.readFileSync(path.join(root,input._adoption.ref))); assert.equal(receipt.manifest_sha256,f.input.manifest.sha256);
  input.summary='阿禾交回执并约定明日核账。'; input.changes.timeline_append=['第七章：交回执并约定明日核账'];
  const report='审查/已有稿采纳.md';file(root,report,'# 合成接口复核\n只验证绑定，不冒充文学实读。'); input.draft_review={reviewer:'synthetic-test',report,draft_sha256:f.input.draft_sha256,report_sha256:sha(fs.readFileSync(path.join(root,report)))};
  assert.throws(()=>call(root,'record',null,{...input,_adoption:undefined},branch.token),e=>e.code==='DRAFT_ADOPTION_REQUIRED');
  assert.equal(call(root,'record-preview',null,input).ok,true);assert.equal(call(root,'record',null,input,branch.token).unit,7);
  assert.equal(call(root,'record',null,input,branch.token).unchanged,true);
  assert.equal(main(['check','--project',root]).ok,true);assert.deepEqual(state(root).units.slice(0,6),state(f.candidate).units);
  assert.equal(call(root,'review',null,{from:1,to:7,kind:'model-self-review',report,source_hashes:Object.fromEntries(state(root).units.map(u=>[u.draft,u.sha256]))},branch.token).ok,true);
  assert.equal(main(['style-scan','--project',root,'--draft','正文/0007.md','--out','审查/七章扫描.json','--revision-token',branch.token]).ok,true);
  const registeredPlan=fs.readFileSync(path.join(root,'大纲/单元/0007.json'));fs.appendFileSync(path.join(root,'大纲/单元/0007.json'),'\n');assert.throws(()=>main(['style-scan','--project',root,'--draft','正文/0007.md','--out','审查/不得保存.json','--revision-token',branch.token]),e=>e.code==='CONTINUATION_PREFIX_CHANGED');fs.writeFileSync(path.join(root,'大纲/单元/0007.json'),registeredPlan);
  assert.throws(()=>call(root,'revision','prepare',{id:branch.id,token:branch.token}),e=>e.code==='ENOENT');
  for(const command of ['prepare','commit'])assert.throws(()=>call(branch.parent,'revision',command,{id:branch.id,token:branch.token}),e=>e.code==='CONTINUATION_PUBLICATION_BLOCKED');
  assert.throws(()=>main(['rewind','--project',root,'--from','1','--expected-revision',String(state(root).revision),'--revision-token',branch.token]),e=>e.code==='CONTINUATION_ACTION_BLOCKED');
  const w=call(root,'workflow','show').workflow;w.authorization.draft_range.to=8;
  assert.throws(()=>call(root,'workflow','set',{expected_revision:state(root).revision,operation_id:'bad-expand',author_evidence:evidence(root),workflow:w},branch.token),e=>e.code==='CONTINUATION_SCOPE_INVALID');
  assert.deepEqual(fs.readFileSync(path.join(f.candidate,'.writer/state.json')),before);assert.deepEqual(fs.readFileSync(path.join(f.root,'.writer/state.json')),mainBefore);assert.deepEqual(fs.readFileSync(path.join(f.root,`.writer/revisions/${f.old.id}/session.json`)),sessionBefore);
  file(root,input._adoption.ref,{fake:true});assert.throws(()=>main(['check','--project',root]),e=>e.code==='DRAFT_ADOPTION_CORRUPT');
});

test('派生前令牌、授权、CAS、清单和私有来源错误全部拒绝且不创建目标',t=>{
  const f=prepared(t);
  for(const [patch,code] of [[{token:'wrong'},'REVISION_OWNER_REQUIRED'],[{expected_revision:-1},'REVISION_CHANGED'],[{expected_state_sha256:'0'.repeat(64)},'REVISION_CHANGED'],[{expected_session_sha256:'0'.repeat(64)},'REVISION_CHANGED'],[{author_evidence:undefined},'REVISION_INPUT_INVALID'],[{author_evidence:{...f.input.author_evidence,quote:'并不存在的授权'}},'AUTHOR_EVIDENCE_MISMATCH'],[{unit:8},'CONTINUATION_SCOPE_INVALID'],[{draft_sha256:'0'.repeat(64)},'DRAFT_ADOPTION_MISMATCH'],[{manifest:{...f.input.manifest,audit_only_refs:[]}},'PRIVATE_SOURCE_REJECTED']]){
    assert.throws(()=>call(f.candidate,'revision','continue',{...f.input,...patch}),e=>e.code===code);assert.equal(fs.existsSync(f.input.target),false);
  }
  const emptyRef='.writer/drafts/empty-manifest.json';file(f.root,emptyRef,{revision:f.input.expected_revision,source_hashes:{}});assert.throws(()=>call(f.candidate,'revision','continue',{...f.input,manifest:{root:'parent',ref:emptyRef,sha256:sha(fs.readFileSync(path.join(f.root,emptyRef))),audit_only_refs:[]}}),e=>e.code==='SOURCE_MANIFEST_MISMATCH');
  file(f.candidate,'大纲/第七章依据.md','发生来源漂移');assert.throws(()=>call(f.candidate,'revision','continue',f.input),e=>e.code==='SOURCE_MANIFEST_MISMATCH');assert.equal(fs.existsSync(f.input.target),false);
});

test('重复目标保留、旧来源漂移阻止后续写入',t=>{
  const f=prepared(t),branch=call(f.candidate,'revision','continue',f.input);
  assert.throws(()=>call(f.candidate,'revision','continue',f.input),e=>e.code==='CONTINUATION_TARGET_EXISTS');
  file(branch.workspace,'正文/0001.md','锁外改变旧章');assert.throws(()=>plan(branch),e=>e.code==='CONTINUATION_PREFIX_CHANGED');
});

test('并发锁保留、正文哈希与采纳对象篡改被拒绝',t=>{
  const f=prepared(t),lock='.writer/write.lock';file(f.candidate,lock,'另一会话持有');
  assert.throws(()=>call(f.candidate,'revision','continue',f.input),/作品正在写入/);assert.equal(fs.readFileSync(path.join(f.candidate,lock),'utf8'),'另一会话持有');assert.equal(fs.existsSync(f.input.target),false);
  fs.unlinkSync(path.join(f.candidate,lock));const branch=call(f.candidate,'revision','continue',f.input);plan(branch);
  file(branch.workspace,'正文/0007.md','不同稿件');assert.throws(()=>call(branch.workspace,'revision','adopt',{unit:7,expected_revision:state(branch.workspace).revision,draft:'正文/0007.md'},branch.token),e=>e.code==='DRAFT_ADOPTION_MISMATCH');
  fs.unlinkSync(path.join(branch.workspace,'正文/0007.md'));const input=call(branch.workspace,'revision','adopt',{unit:7,expected_revision:state(branch.workspace).revision,draft:'正文/0007.md'},branch.token);
  input.summary='采纳测试';file(branch.workspace,input._adoption.ref,{fake:true});assert.throws(()=>call(branch.workspace,'record',null,input,branch.token),e=>e.code==='DRAFT_ADOPTION_REQUIRED');
});

function parentAddition(f){
  const ref='大纲/第七章细纲候选-Candidate.md',manifest_ref=f.input.manifest.audit_only_refs[0],bytes=fs.readFileSync(path.join(f.candidate,manifest_ref));
  file(f.root,ref,bytes.toString('utf8'));return {ref,sha256:sha(bytes),manifest_ref};
}
test('主稿仅增未消费规划：显式逐项审计后采纳7和普通审查，旧基线及新增原件不变',t=>{
  const f=prepared(t),item=parentAddition(f),mainBefore=fs.readFileSync(path.join(f.root,'.writer/state.json')),baseRef=`.writer/revisions/${f.old.id}/base.json`,baseBefore=fs.readFileSync(path.join(f.root,baseRef)),sessionBefore=fs.readFileSync(path.join(f.root,`.writer/revisions/${f.old.id}/session.json`)),candidateBefore=fs.readFileSync(path.join(f.candidate,'.writer/state.json'));
  assert.throws(()=>call(f.candidate,'revision','continue',f.input),e=>e.code==='BASELINE_CONFLICT');
  const branch=call(f.candidate,'revision','continue',{...f.input,acknowledged_parent_additions:[item]});plan(branch);
  const nextBase=JSON.parse(fs.readFileSync(path.join(branch.parent,`.writer/revisions/${branch.id}/base.json`))),binding=nextBase.continuation.parent_inventory_acknowledgment,audit=JSON.parse(fs.readFileSync(path.join(branch.workspace,binding.ref)));
  assert.equal(audit.acknowledged_additions[0].manifest_ref,item.manifest_ref);assert.equal(sha(fs.readFileSync(path.join(branch.workspace,audit.acknowledged_additions[0].frozen_ref))),item.sha256);
  assert.equal(fs.existsSync(path.join(branch.workspace,item.ref)),false,'主稿新增只审计保留，不自动挂入候选公开来源');
  const input=call(branch.workspace,'revision','adopt',{unit:7,expected_revision:state(branch.workspace).revision,draft:'正文/0007.md'},branch.token),report='审查/新增规划兼容.md';file(branch.workspace,report,'合成兼容报告，不冒充文学实读。');input.summary='阿禾交回执并约定明日核账。';input.draft_review={reviewer:'synthetic-fixture',report,draft_sha256:f.input.draft_sha256,report_sha256:sha(fs.readFileSync(path.join(branch.workspace,report)))};
  call(branch.workspace,'record',null,input,branch.token);assert.equal(call(branch.workspace,'review',null,{from:1,to:7,kind:'model-self-review',report,source_hashes:Object.fromEntries(state(branch.workspace).units.map(u=>[u.draft,u.sha256]))},branch.token).ok,true);
  assert.throws(()=>plan(branch,8),e=>['REVISION_SCOPE_INVALID','CONTINUATION_SCOPE_INVALID'].includes(e.code));
  for(const action of ['prepare','commit'])assert.throws(()=>call(branch.parent,'revision',action,{id:branch.id,token:branch.token}),e=>e.code==='CONTINUATION_PUBLICATION_BLOCKED');
  for(const [root,ref,before] of [[f.root,'.writer/state.json',mainBefore],[f.root,baseRef,baseBefore],[f.root,`.writer/revisions/${f.old.id}/session.json`,sessionBefore],[f.candidate,'.writer/state.json',candidateBefore]])assert.deepEqual(fs.readFileSync(path.join(root,ref)),before);
  assert.equal(sha(fs.readFileSync(path.join(f.root,item.ref))),item.sha256);assert.deepEqual(state(branch.workspace).units.slice(0,6),state(f.candidate).units);
});
test('规划新增逐项承认不能覆盖错误哈希、未列明新增、旧文件修改或删除、state变化',t=>{
  const f=prepared(t),item=parentAddition(f),input={...f.input,acknowledged_parent_additions:[item]};
  for(const patch of [{...item,sha256:'0'.repeat(64)},{...item,ref:'正文/新增.md'}])assert.throws(()=>call(f.candidate,'revision','continue',{...input,acknowledged_parent_additions:[patch]}),e=>e.code==='PARENT_ADDITIONS_INVALID');
  assert.throws(()=>call(f.candidate,'revision','continue',{...input,acknowledged_parent_additions:[{...item,manifest_ref:'大纲/第七章依据.md'}]}),e=>e.code==='PARENT_ADDITION_EVIDENCE_MISMATCH');
  file(f.root,'大纲/未列明.md','未列明');assert.throws(()=>call(f.candidate,'revision','continue',input),e=>e.code==='BASELINE_CONFLICT');fs.unlinkSync(path.join(f.root,'大纲/未列明.md'));
  for(const ref of ['正文/0001.md','.writer/state.json']){const old=fs.readFileSync(path.join(f.root,ref));fs.appendFileSync(path.join(f.root,ref),'\n');assert.throws(()=>call(f.candidate,'revision','continue',input),e=>e.code==='BASELINE_CONFLICT');fs.writeFileSync(path.join(f.root,ref),old);}
  const ref='正文/0001.md',old=fs.readFileSync(path.join(f.root,ref));fs.unlinkSync(path.join(f.root,ref));assert.throws(()=>call(f.candidate,'revision','continue',input),e=>e.code==='BASELINE_CONFLICT');fs.writeFileSync(path.join(f.root,ref),old);
  assert.equal(fs.existsSync(input.target),false);
});

test('候选旧章已经消费新增规划时不得承认为未消费，即使主稿尚未消费',t=>{
  const f=prepared(t),item=parentAddition(f);file(f.candidate,item.ref,fs.readFileSync(path.join(f.root,item.ref)).toString('utf8'));
  main(['rewind','--project',f.candidate,'--from','1','--expected-revision',String(state(f.candidate).revision),'--revision-token',f.old.token]);
  for(let n=1;n<=6;n++){
    call(f.candidate,'plan',null,{unit:n,title:'引用规划复核',goal:'核对',change:'核对',beats:['交接'],cast:[],setting_refs:[process.platform==='win32'?item.ref.toLowerCase():item.ref],research_refs:[]},f.old.token);
    const draft=`正文/${String(n).padStart(4,'0')}.md`,input=main(['record-template','--project',f.candidate,'--unit',String(n),'--draft',draft]);input.summary='合成测试：旧章已消费规划';call(f.candidate,'record',null,input,f.old.token);
  }
  assert.throws(()=>call(f.candidate,'revision','continue',{...f.input,expected_revision:state(f.candidate).revision,expected_state_sha256:sha(fs.readFileSync(path.join(f.candidate,'.writer/state.json'))),expected_session_sha256:sha(fs.readFileSync(path.join(f.root,`.writer/revisions/${f.old.id}/session.json`))),acknowledged_parent_additions:[item]}),e=>e.code==='PARENT_ADDITION_CONSUMED');
  assert.equal(fs.existsSync(f.input.target),false);
});

test('承认规划新增后复制期间又有库存变化，最终CAS拒绝且不注册活跃候选',t=>{
  const f=prepared(t),item=parentAddition(f),originalCopy=fs.copyFileSync;let injected=false;
  fs.copyFileSync=function(source,target,...args){const result=originalCopy.call(this,source,target,...args);if(!injected&&String(target).includes('.ai-writer-init-')&&String(target).endsWith('revisions.mjs')){injected=true;file(f.root,'大纲/复制期间新增.md','模拟锁外并发新增');}return result;};
  try{assert.throws(()=>call(f.candidate,'revision','continue',{...f.input,acknowledged_parent_additions:[item]}),e=>e.code==='BASELINE_CONFLICT');}finally{fs.copyFileSync=originalCopy;}
  assert.equal(injected,true);assert.equal(fs.existsSync(path.join(f.root,'.writer/write.lock')),false);assert.equal(fs.existsSync(path.join(f.candidate,'.writer/write.lock')),false);
  const sessions=path.join(f.input.target,'.writer/revisions');assert.equal(fs.readdirSync(sessions).some(id=>fs.existsSync(path.join(sessions,id,'session.json'))),false);
});

function repairInput(branch,target){
  return {token:branch.token,expected_revision:state(branch.workspace).revision,expected_state_sha256:sha(fs.readFileSync(path.join(branch.workspace,'.writer/state.json'))),expected_session_sha256:sha(fs.readFileSync(path.join(branch.parent,`.writer/revisions/${branch.id}/session.json`))),expected_base_sha256:sha(fs.readFileSync(path.join(branch.parent,`.writer/revisions/${branch.id}/base.json`))),expected_plan_sha256:sha(fs.readFileSync(path.join(branch.workspace,'大纲/单元/0007.json'))),target,owner:'protected-plan-handoff',reason:'官方plan/context后的独立接管验证'};
}
test('写前清单已消费7号计划时，官方plan也须在写入前拒绝',t=>{
  const f=prepared(t),ref='大纲/单元/0007.json',manifestRef=f.input.manifest.ref,manifest=JSON.parse(fs.readFileSync(path.join(f.root,manifestRef)));manifest.source_hashes[ref]=sha(fs.readFileSync(path.join(f.candidate,ref)));file(f.root,manifestRef,manifest);f.input.manifest.sha256=sha(fs.readFileSync(path.join(f.root,manifestRef)));
  const branch=call(f.candidate,'revision','continue',f.input),before=fs.readFileSync(path.join(branch.workspace,ref));assert.throws(()=>plan(branch),e=>e.code==='CONTINUATION_PLAN_SOURCE_LOCKED');assert.deepEqual(fs.readFileSync(path.join(branch.workspace,ref)),before);
});
test('现有派生plan7/context后安全接管，保留原派生及旧计划审计，再采纳登记和审查',t=>{
  const f=prepared(t),source=call(f.candidate,'revision','continue',f.input);plan(source);assert.equal(main(['context','--project',source.workspace,'--unit','7']).unit,7);
  const before=fs.readFileSync(path.join(source.workspace,'.writer/state.json')),sessionBefore=fs.readFileSync(path.join(source.parent,`.writer/revisions/${source.id}/session.json`)),baseBefore=fs.readFileSync(path.join(source.parent,`.writer/revisions/${source.id}/base.json`)),planBefore=fs.readFileSync(path.join(source.workspace,'大纲/单元/0007.json'));
  const branch=call(source.workspace,'revision','continue-repair',repairInput(source,path.join(f.dir,'repaired'))),root=branch.workspace;assert.deepEqual(state(root).units,state(source.workspace).units);assert.deepEqual(fs.readFileSync(path.join(root,'大纲/单元/0007.json')),planBefore);
  const handoff=JSON.parse(fs.readFileSync(path.join(root,branch.handoff.ref)));assert.notEqual(handoff.plan.old_sha256,handoff.plan.current_sha256);assert.equal(sha(fs.readFileSync(path.join(root,handoff.plan.frozen_old_ref))),handoff.plan.old_sha256);
  assert.equal(main(['context','--project',root,'--unit','7']).unit,7);const input=call(root,'revision','adopt',{unit:7,expected_revision:state(root).revision,draft:'正文/0007.md'},branch.token),report='审查/接管流程.md';file(root,report,'合成接口报告，不证明文学质量。');input.summary='阿禾交回执并约定明日核账';input.draft_review={reviewer:'synthetic-fixture',report,draft_sha256:f.input.draft_sha256,report_sha256:sha(fs.readFileSync(path.join(root,report)))};
  const receipt=JSON.parse(fs.readFileSync(path.join(root,input._adoption.ref)));assert.deepEqual(receipt.continuation_handoff,branch.handoff);assert.equal(call(root,'record-preview',null,input).ok,true);call(root,'record',null,input,branch.token);
  assert.equal(call(root,'review',null,{from:1,to:7,kind:'model-self-review',report,source_hashes:Object.fromEntries(state(root).units.map(u=>[u.draft,u.sha256]))},branch.token).ok,true);assert.equal(main(['check','--project',root]).ok,true);
  assert.throws(()=>main(['context','--project',root,'--unit','8']),e=>e.code==='ACTION_OUT_OF_SCOPE');for(const action of ['prepare','commit'])assert.throws(()=>call(branch.parent,'revision',action,{id:branch.id,token:branch.token}),e=>e.code==='CONTINUATION_PUBLICATION_BLOCKED');
  for(const [dir,ref,bytes]of [[source.workspace,'.writer/state.json',before],[source.workspace,'大纲/单元/0007.json',planBefore],[source.parent,`.writer/revisions/${source.id}/session.json`,sessionBefore],[source.parent,`.writer/revisions/${source.id}/base.json`,baseBefore]])assert.deepEqual(fs.readFileSync(path.join(dir,ref)),bytes);
});
test('接管拒绝错误所有者和各项CAS、额外正文及旧前缀改动，不覆盖原派生',t=>{
  const f=prepared(t),source=call(f.candidate,'revision','continue',f.input);plan(source);const input=repairInput(source,path.join(f.dir,'repair-rejected'));
  for(const patch of [{token:'wrong'},{expected_revision:-1},{expected_state_sha256:'0'.repeat(64)},{expected_session_sha256:'0'.repeat(64)},{expected_base_sha256:'0'.repeat(64)},{expected_plan_sha256:'0'.repeat(64)}]){assert.throws(()=>call(source.workspace,'revision','continue-repair',{...input,...patch}),e=>['REVISION_OWNER_REQUIRED','REVISION_CHANGED'].includes(e.code));assert.equal(fs.existsSync(input.target),false);}
  file(source.workspace,'正文/0008.md','未授权新正文');assert.throws(()=>call(source.workspace,'revision','continue-repair',input),e=>e.code==='CONTINUATION_REPAIR_SCOPE');fs.unlinkSync(path.join(source.workspace,'正文/0008.md'));
  const ref='正文/0001.md',before=fs.readFileSync(path.join(source.workspace,ref));fs.appendFileSync(path.join(source.workspace,ref),'旧章漂移');assert.throws(()=>call(source.workspace,'revision','continue-repair',input),e=>e.code==='CONTINUATION_PREFIX_CHANGED');fs.writeFileSync(path.join(source.workspace,ref),before);
  const workflow=call(source.workspace,'workflow','show').workflow;workflow.task='状态已变化不在本接管范围';call(source.workspace,'workflow','set',{expected_revision:state(source.workspace).revision,operation_id:'handoff-state-change',author_evidence:evidence(source.workspace),workflow},source.token);
  assert.throws(()=>call(source.workspace,'revision','continue-repair',repairInput(source,input.target)),e=>e.code==='CONTINUATION_REPAIR_SCOPE');assert.equal(fs.existsSync(input.target),false);
});

test('旧六章消费了7号计划时不因写前清单未列而放宽',t=>{
  const f=prepared(t),ref='大纲/单元/0007.json';main(['rewind','--project',f.candidate,'--from','1','--expected-revision',String(state(f.candidate).revision),'--revision-token',f.old.token]);
  for(let n=1;n<=6;n++){call(f.candidate,'plan',null,{unit:n,title:'依赖保护验证',goal:'核对',change:'核对',beats:['核对'],cast:[],setting_refs:[],research_refs:[ref]},f.old.token);const draft=`正文/${String(n).padStart(4,'0')}.md`,input=main(['record-template','--project',f.candidate,'--unit',String(n),'--draft',draft]);input.summary='旧章依赖计划的合成保护测试';call(f.candidate,'record',null,input,f.old.token);}
  const manifest=JSON.parse(fs.readFileSync(path.join(f.root,f.input.manifest.ref)));manifest.revision=state(f.candidate).revision;file(f.root,f.input.manifest.ref,manifest);
  const branch=call(f.candidate,'revision','continue',{...f.input,expected_revision:state(f.candidate).revision,expected_state_sha256:sha(fs.readFileSync(path.join(f.candidate,'.writer/state.json'))),expected_session_sha256:sha(fs.readFileSync(path.join(f.root,`.writer/revisions/${f.old.id}/session.json`))),manifest:{...f.input.manifest,sha256:sha(fs.readFileSync(path.join(f.root,f.input.manifest.ref)))}}),before=fs.readFileSync(path.join(branch.workspace,ref));
  assert.throws(()=>plan(branch),e=>e.code==='CONTINUATION_PLAN_SOURCE_LOCKED');assert.deepEqual(fs.readFileSync(path.join(branch.workspace,ref)),before);
});
test('接管复制后源计划并发变化，最终CAS拒绝且不注册新会话',t=>{
  const f=prepared(t),source=call(f.candidate,'revision','continue',f.input);plan(source);const input=repairInput(source,path.join(f.dir,'repair-cas-failed')),originalRename=fs.renameSync;let injected=false,stateWrites=0;
  fs.renameSync=function(from,to,...args){const result=originalRename.call(this,from,to,...args);if(path.resolve(String(to))===path.join(input.target,'.writer/state.json'))stateWrites++;if(!injected&&stateWrites===2){injected=true;fs.appendFileSync(path.join(source.workspace,'大纲/单元/0007.json'),'\n');}return result;};
  try{assert.throws(()=>call(source.workspace,'revision','continue-repair',input),e=>e.code==='BASELINE_CONFLICT');}finally{fs.renameSync=originalRename;}
  assert.equal(injected,true);const sessions=path.join(input.target,'.writer/revisions');assert.equal(fs.readdirSync(sessions).some(id=>fs.existsSync(path.join(sessions,id,'session.json'))),false);assert.equal(fs.existsSync(path.join(source.workspace,'.writer/write.lock')),false);assert.equal(fs.existsSync(path.join(source.parent,'.writer/write.lock')),false);
});

test('新章消费冻结计划时保护实际冻结版本，不误判不同的活动计划入口',t=>{
  const f=prepared(t,true),branch=call(f.candidate,'revision','continue',f.input);plan(branch);const root=branch.workspace,input=call(root,'revision','adopt',{unit:7,expected_revision:state(root).revision,draft:'正文/0007.md'},branch.token),ref='大纲/单元/0007.json',report='审查/冻结计划兼容.md';
  assert.equal(input.source_bindings[ref].version_id,'PLAN7_VERSION');assert.notEqual(input.source_hashes[ref],sha(fs.readFileSync(path.join(root,ref))));file(root,report,'合成版本绑定检查，不作文学验收。');input.summary='冻结计划绑定的合成登记';input.draft_review={reviewer:'synthetic-fixture',report,draft_sha256:f.input.draft_sha256,report_sha256:sha(fs.readFileSync(path.join(root,report)))};call(root,'record',null,input,branch.token);
  assert.equal(call(root,'review',null,{from:1,to:7,kind:'model-self-review',report,source_hashes:Object.fromEntries(state(root).units.map(u=>[u.draft,u.sha256]))},branch.token).ok,true);assert.equal(main(['check','--project',root]).ok,true);
});
