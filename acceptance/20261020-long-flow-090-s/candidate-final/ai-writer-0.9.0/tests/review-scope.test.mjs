import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {main} from '../lib/workspace.mjs';
import {fixture,file,call,state,workflow,sha,begin,edit,prepare,commit} from './protection-fixture.mjs';
function input(root,id='I_PREFIX'){
  const s=state(root),report=`审查/${id}.md`;file(root,report,'# 合成范围测试\n只验证接口，不是模型实读。\n');
  return {expected_revision:s.revision,operation_id:`review-${id}`,from:1,to:2,kind:'model-self-review',report,source_hashes:Object.fromEntries(s.units.map(u=>[u.draft,u.sha256])),issues:[{id,type:'optional_style',severity:'suggestion',confidence:'medium',statement:'合成范围意见',suggestion:'保留待议',evidence:[{unit:1,quote:'林衡把铜片交给阿禾。'}]}]};
}
function branch(root){workflow(root,true);return call(root,'revision','begin',{expected_revision:state(root).revision,owner:'scope-test',from:2,through:2});}
test('修订分支不能在更宽讨论授权下处置声明范围外的旧意见',t=>{
  const {root}=fixture(t,2);call(root,'review',null,input(root));const b=branch(root),before=fs.readFileSync(path.join(b.workspace,'.writer/state.json'));
  assert.throws(()=>call(b.workspace,'review-issues','resolve',{expected_revision:state(b.workspace).revision,operation_id:'retain-outside-session',id:'I_PREFIX',disposition:'retained',reason:'更宽讨论许可不扩大分支范围',decision_actor:'agent-within-authorized-scope',authorization:state(b.workspace).governance_binding},b.token),e=>e.code==='REVISION_SCOPE_INVALID');
  assert.deepEqual(fs.readFileSync(path.join(b.workspace,'.writer/state.json')),before);
});
test('可在分支扩展连读范围，但不能借该报告新增范围外意见',t=>{
  const {root}=fixture(t,2),b=branch(root),value=input(b.workspace,'I_OUTSIDE'),before=fs.readFileSync(path.join(b.workspace,'.writer/state.json'));
  assert.throws(()=>call(b.workspace,'review',null,value,b.token),e=>e.code==='REVISION_SCOPE_INVALID');assert.deepEqual(fs.readFileSync(path.join(b.workspace,'.writer/state.json')),before);
  value.issues=[];value.operation_id='read-prefix-without-disposition';assert.equal(call(b.workspace,'review',null,value,b.token).ok,true);
});
test('登记预览在空摘要时也先呈现当前暂停范围，不诱导越权补写下一章',t=>{
  const {root}=fixture(t,2),w=call(root,'workflow','show').workflow;w.stage='paused';w.task='只讨论，不写第三章';w.authorization={allowed_actions:['discuss','plan'],draft_range:null,revise_range:null,stop_conditions:[]};
  const proof='研究/暂停原话.md';file(root,proof,'只讨论，不写第三章');call(root,'workflow','set',{expected_revision:state(root).revision,operation_id:'pause-before-preview',author_evidence:{quote:'只讨论，不写第三章',local_source:proof,source_sha256:sha(fs.readFileSync(path.join(root,proof))),locator:'synthetic',recorded_by:'test'},workflow:w});
  const before=fs.readFileSync(path.join(root,'.writer/state.json')),r=main(['record-preview','--project',root,'--input',file(root,'.writer/empty-next.json',{unit:3,expected_revision:state(root).revision,draft:'正文/0003.md',summary:'',source_hashes:{},changes:{}})]);
  assert.equal(r.ok,false);assert.ok(r.findings.some(f=>f.code==='ACTION_OUT_OF_SCOPE'));assert.deepEqual(fs.readFileSync(path.join(root,'.writer/state.json')),before);
});
test('结构化审查state发布失败留下的孤儿记录不能计作已完成覆盖',t=>{
  const {root}=fixture(t,3),s=state(root),report='审查/模拟写入失败.md';file(root,report,'# 合成故障注入\n不代表模型阅读。\n');const value={expected_revision:s.revision,operation_id:'orphan-review-fault',from:1,to:3,kind:'model-self-review',report,source_hashes:Object.fromEntries(s.units.map(u=>[u.draft,u.sha256])),issues:[]};
  const before=fs.readFileSync(path.join(root,'.writer/state.json')),rename=fs.renameSync;
  fs.renameSync=(source,target)=>{if(path.resolve(target)===path.resolve(root,'.writer/state.json')){const e=new Error('injected ENOSPC before authority publication');e.code='ENOSPC';throw e;}return rename(source,target);};
  try{assert.throws(()=>call(root,'review',null,value),e=>e.code==='ENOSPC');}finally{fs.renameSync=rename;}
  assert.deepEqual(fs.readFileSync(path.join(root,'.writer/state.json')),before);assert.equal(Object.keys(state(root).review_workflow.reports).length,0);
  const checked=call(root,'check');assert.equal(checked.rolling_review.valid,0);assert.deepEqual(checked.rolling_review.pending_windows,[{from:1,to:3}]);assert.equal(checked.rolling_review.unpublished_records.length,1);
});
test('作者明确保留不能被代理同名重记后借一般润色授权改成采用',t=>{
  const {root}=fixture(t,2);call(root,'review',null,input(root));workflow(root,true);const proof='研究/作者保留.md';file(root,proof,'保留I_PREFIX原句，不采用可选删句。');
  call(root,'review-issues','resolve',{expected_revision:state(root).revision,operation_id:'author-retains-style',id:'I_PREFIX',disposition:'retained',reason:'合成作者明确保留',decision_actor:'author',author_evidence:{quote:'保留I_PREFIX原句，不采用可选删句。',local_source:proof,source_sha256:sha(fs.readFileSync(path.join(root,proof))),locator:'synthetic',recorded_by:'test'}});
  call(root,'review-issues','resolve',{expected_revision:state(root).revision,operation_id:'agent-records-same-choice',id:'I_PREFIX',disposition:'retained',reason:'沿用作者选择，不改成代理自行选择',decision_actor:'agent-within-authorized-scope',authorization:state(root).governance_binding});const before=fs.readFileSync(path.join(root,'.writer/state.json'));
  assert.throws(()=>call(root,'review-issues','resolve',{expected_revision:state(root).revision,operation_id:'agent-cannot-replace-author-choice',id:'I_PREFIX',disposition:'adopted',reason:'一般润色许可不取代作者逐条保留',decision_actor:'agent-within-authorized-scope',authorization:state(root).governance_binding}),e=>e.code==='REVIEW_AUTHOR_CHOICE_REQUIRED');
  assert.deepEqual(fs.readFileSync(path.join(root,'.writer/state.json')),before);assert.equal(state(root).review_workflow.issues.I_PREFIX.resolution.author_choice.disposition,'retained');
  const changed='研究/作者新取舍.md';file(root,changed,'现在采用I_PREFIX的最小修改。');call(root,'review-issues','resolve',{expected_revision:state(root).revision,operation_id:'author-may-replace-own-choice',id:'I_PREFIX',disposition:'adopted',reason:'新的明确合成作者选择',decision_actor:'author',author_evidence:{quote:'现在采用I_PREFIX的最小修改。',local_source:changed,source_sha256:sha(fs.readFileSync(path.join(root,changed))),locator:'synthetic',recorded_by:'test'}});
  call(root,'review-issues','resolve',{expected_revision:state(root).revision,operation_id:'agent-may-continue-adopted-choice',id:'I_PREFIX',disposition:'adopted',reason:'沿用已确认采用，不重复要求作者确认',decision_actor:'agent-within-authorized-scope',authorization:state(root).governance_binding});assert.equal(state(root).review_workflow.issues.I_PREFIX.resolution.author_choice.disposition,'adopted');
});
test('新版本实读可重新复核已修复意见，不为登记闭环再制造一次正文改动',t=>{
  const {root}=fixture(t,2);call(root,'review',null,input(root));workflow(root,true);call(root,'review-issues','resolve',{expected_revision:state(root).revision,operation_id:'adopt-for-recheck',id:'I_PREFIX',disposition:'adopted',reason:'合成采用',decision_actor:'agent-within-authorized-scope',authorization:state(root).governance_binding});
  const a=begin(root);edit(a,'实际修改A');prepare(root,a);commit(root,a);const record=JSON.parse(fs.readFileSync(path.join(root,state(root).committed_revisions.at(-1).ref)));
  call(root,'review-issues','apply',{expected_revision:state(root).revision,operation_id:'apply-A',id:'I_PREFIX',commit_id:record.id,reason:'已有实际修改提交'});
  function rereadAndVerify(label){const s=state(root),report=`审查/${label}.md`;file(root,report,'# 合成当前版本复核\n只测试证据绑定，不是模型实读。\n');const current=call(root,'review',null,{from:1,to:2,kind:'model-self-review',report,source_hashes:Object.fromEntries(s.units.map(u=>[u.draft,u.sha256]))});return call(root,'review-issues','verify',{expected_revision:state(root).revision,operation_id:`verify-${label}`,id:'I_PREFIX',review_ref:current.ref,reviewer:'synthetic-test',conclusion:'resolved',reason:'当前版本重新核对，不虚构再次修复'});}
  rereadAndVerify('A');
  const b=begin(root);edit(b,'无关措辞修改B');prepare(root,b);commit(root,b);assert.equal(call(root,'review-issues','list').issues[0].effective_status,'needs-recheck');
  rereadAndVerify('B');const issue=call(root,'review-issues','list').issues[0];assert.equal(issue.effective_status,'verified');assert.equal(issue.application.commit_id,record.id);assert.equal(issue.verification.rechecked_context,true);assert.ok(issue.history.length>=4);
});
