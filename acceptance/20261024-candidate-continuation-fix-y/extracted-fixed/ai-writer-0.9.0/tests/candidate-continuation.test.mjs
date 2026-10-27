import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {main} from '../lib/workspace.mjs';
import {fixture,state,file,call,evidence,workflow,begin,sha} from './protection-fixture.mjs';

function prepared(t){
  const {root,dir}=fixture(t,6);assert.equal(state(root).units.some(u=>Object.hasOwn(u.source_hashes,'大纲/全书大纲.md')),false);fs.unlinkSync(path.join(root,'大纲/全书大纲.md'));workflow(root,true); const old=begin(root), candidate=old.workspace;
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
