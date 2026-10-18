import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {ROOT,fixture,state,file,workflow,evidence,call,begin,edit,prepare,commit,unit,sha} from './protection-fixture.mjs';
import {initProject,main} from '../lib/workspace.mjs';
let seq=0;
function cli(root,command,action,input,token,expected=0){
  const args=[path.join(ROOT,'bin/ai-writer.mjs'),command,...(action?[action]:[]),'--project',root];
  if(input)args.push('--input',file(root,`.writer/review-test-${++seq}.json`,input));if(token)args.push('--revision-token',token);
  const p=spawnSync(process.execPath,args,{encoding:'utf8',windowsHide:true,maxBuffer:8*1024*1024});assert.equal(p.status,expected,`${args.join(' ')}\n${p.stdout}\n${p.stderr}`);
  return JSON.parse(expected===2?p.stderr:p.stdout);
}
const op=root=>({expected_revision:state(root).revision,operation_id:`review-${++seq}`});
function reviewInput(root,issues=true){
  const s=state(root),from=1,to=s.units.length,quotes=s.units.map(u=>fs.readFileSync(path.join(root,u.draft),'utf8').split(/\r?\n/).find(l=>l.includes('铜片')));
  const report=`审查/结构测试-${++seq}.md`;file(root,report,'# 合成接口验证\n\n仅用于字段、绑定与状态机测试，不是实际模型阅读或文学结论。\n');
  const fields=['goal','obstacle','choice','consequence','relationship_change'];
  return {...op(root),from,to,kind:'model-self-review',report,source_hashes:Object.fromEntries(s.units.map(u=>[u.draft,u.sha256])),
    chapter_functions:s.units.map((u,i)=>({unit:u.unit,...Object.fromEntries(fields.map(k=>[k,k==='relationship_change'?{status:'unknown',reason:'合成材料不提供充分关系变化证据'}:{status:'observed',text:`合成${k}字段`,evidence:[{unit:u.unit,quote:quotes[i]}]}]))})),
    comparison:{similar_structures:s.units.length>1?[{units:[1,2],judgment:'仅验证比较结构',differences:'地点和人物行为有差别，语义由实读者判断',preserve:'保留不同的因果',optional_adjustments:[],uncertainty:'合成接口用例不是文学复核',evidence:[{unit:1,quote:quotes[0]},{unit:2,quote:quotes[1]}]}]:[],distinct_gains:['合成差异'],preserve:['原人物与交接'],optional_adjustments:[],limits:'脚本不能证明文学判断'},
    issues:issues?[{id:'I_CHECK',type:'continuity',severity:'minor',confidence:'high',statement:'合成意见用于事务绑定',suggestion:'核查交接表达',evidence:[{unit:1,quote:quotes[0]}]},{id:'I_STYLE',type:'optional_style',severity:'suggestion',confidence:'medium',statement:'合成可选措辞',suggestion:'可保留原句',evidence:[{unit:1,quote:quotes[0]}]},{id:'I_WAIT',type:'readability',severity:'minor',confidence:'low',statement:'合成待核意见',suggestion:'后续再读',evidence:[{unit:to,quote:quotes.at(-1)}]}]:[]};
}
function resolve(root,id,disposition='adopted'){return cli(root,'review-issues','resolve',{...op(root),id,disposition,reason:'合成流程验证，不冒充作者逐条采用',decision_actor:'agent-within-authorized-scope',authorization:state(root).governance_binding});}
function rawState(root){return fs.readFileSync(path.join(root,'.writer/state.json'));}

test('功能比较绑定全部实读章节和引文，保留未知与差异，结构化记录不可被覆盖',t=>{
  const {root}=fixture(t,2),input=reviewInput(root),before=rawState(root);const saved=cli(root,'review',null,input);
  assert.equal(state(root).revision,JSON.parse(before).revision+1);const r=JSON.parse(fs.readFileSync(path.join(root,saved.ref)));assert.equal(r.chapter_functions.length,2);assert.equal(r.comparison.similar_structures[0].evidence.length,2);assert.equal(r.chapter_functions[0].relationship_change.status,'unknown');assert.equal(r.literary_judgment,'model-reported-not-script-acceptance');
  const retry=cli(root,'review',null,input);assert.equal(retry.unchanged,true);
  file(root,saved.ref,{...r,comparison:{...r.comparison,limits:'伪改结论'}});assert.throws(()=>call(root,'status'),/结构化审查记录损坏/);
});
test('缺功能行、假引文、错误哈希和可选建议升级硬问题均拒绝且不发布状态',t=>{
  const {root}=fixture(t,2),good=reviewInput(root),before=rawState(root);
  for(const mutate of [x=>x.chapter_functions.pop(),x=>x.chapter_functions[0].goal.evidence[0].quote='不存在的原句',x=>x.source_hashes[Object.keys(x.source_hashes)[0]]='0'.repeat(64),x=>x.issues[1].severity='major',x=>x.comparison.similar_structures[0].units.push(3)]){
    const x=structuredClone(good);mutate(x);cli(root,'review',null,x,undefined,2);assert.deepEqual(rawState(root),before);
  }
});
test('只有审查或试写授权不能借采用意见获得修订权，保留和延期不冒充修复',t=>{
  const {root}=fixture(t,2);cli(root,'review',null,reviewInput(root));const before=rawState(root);
  const rejected=cli(root,'review-issues','resolve',{...op(root),id:'I_CHECK',disposition:'adopted',reason:'没有修订授权',decision_actor:'agent-within-authorized-scope',authorization:state(root).governance_binding},undefined,2);assert.equal(rejected.code,'ACTION_OUT_OF_SCOPE');assert.deepEqual(rawState(root),before);
  resolve(root,'I_STYLE','retained');resolve(root,'I_WAIT','deferred');const result=cli(root,'review-issues','list');assert.equal(result.counts.retained,1);assert.equal(result.counts.deferred,1);assert.equal(result.counts.verified,undefined);
  const fake=cli(root,'review-issues','resolve',{...op(root),id:'I_CHECK',disposition:'adopted',reason:'伪称作者采用',decision_actor:'author'},undefined,2);assert.equal(fake.ok,false);
});
test('采用、实际修改、当前版本复核分开，重改后旧verified显示needs-recheck且保留历史',t=>{
  const {root}=fixture(t,2);cli(root,'review',null,reviewInput(root));workflow(root,true);resolve(root,'I_CHECK');
  const early=cli(root,'review-issues','apply',{...op(root),id:'I_CHECK',commit_id:'00000000-0000-4000-8000-000000000000',reason:'未提交'},undefined,2);assert.equal(early.code,'REVISION_PUBLICATION_UNKNOWN');
  const branch=begin(root);edit(branch,'第一轮实际候选字节变化');prepare(root,branch);commit(root,branch);
  const s=state(root),record=JSON.parse(fs.readFileSync(path.join(root,s.committed_revisions.at(-1).ref)));
  cli(root,'review-issues','apply',{...op(root),id:'I_CHECK',commit_id:record.id,reason:'实际事务前后正文哈希已绑定'});
  const afterReview=cli(root,'review',null,reviewInput(root,false));
  cli(root,'review-issues','verify',{...op(root),id:'I_CHECK',review_ref:afterReview.ref,reviewer:'synthetic-interface-test',conclusion:'resolved',reason:'只验证状态流，不是文学通过'});
  assert.equal(cli(root,'review-issues','list').issues.find(i=>i.id==='I_CHECK').effective_status,'verified');
  const history=state(root).review_workflow.events.slice();const again=begin(root);edit(again,'第二轮重新改稿');prepare(root,again);commit(root,again);
  assert.equal(cli(root,'review-issues','list').issues.find(i=>i.id==='I_CHECK').effective_status,'needs-recheck');assert.deepEqual(state(root).review_workflow.events.slice(0,history.length),history);
});
test('意见处置CAS、操作ID和复核范围保护不能由重复请求绕过',t=>{
  const {root}=fixture(t,2);cli(root,'review',null,reviewInput(root));const input={...op(root),id:'I_STYLE',disposition:'retained',reason:'保留原声',decision_actor:'author',author_evidence:evidence(root)};
  const first=cli(root,'review-issues','resolve',input);assert.equal(cli(root,'review-issues','resolve',input).unchanged,true);
  assert.equal(cli(root,'review-issues','resolve',{...input,reason:'另一理由'},undefined,2).code,'OPERATION_CONFLICT');
  assert.equal(cli(root,'review-issues','resolve',{...input,operation_id:'stale-cas'},undefined,2).code,'REVISION_CHANGED');assert.equal(state(root).revision,first.revision);
  assert.equal(cli(root,'review-issues','verify',{...op(root),id:'I_STYLE',review_ref:'审查/假报告.md',reviewer:'test',conclusion:'resolved',reason:'保留不是修复'},undefined,2).code,'REVIEW_TRANSITION_INVALID');
});
test('record-preview共用正式校验但不写状态，不替空摘要或坏证据补值',t=>{
  const {root}=fixture(t,0);call(root,'plan',null,{unit:1,title:'桥',goal:'核查',change:'有结果',beats:['核查'],cast:[],setting_refs:[],research_refs:[]});file(root,'正文/0001.md','# 桥\n\n铜片留在布包。\n');const input=main(['record-template','--project',root,'--unit','1','--draft','正文/0001.md']),before=rawState(root);
  assert.equal(cli(root,'record-preview',null,input,undefined,1).findings.some(f=>f.field==='summary'),true);input.summary='实际登记摘要';input.changes.ledger={OBS:{type:'observation',statement:'看到铜片',status:'active',evidence:[{unit:1,quote:'不在正文的引文'}]}};
  assert.equal(cli(root,'record-preview',null,input,undefined,1).ok,false);assert.deepEqual(rawState(root),before);input.changes.ledger={};assert.equal(cli(root,'record-preview',null,input).ok,true);assert.deepEqual(rawState(root),before);cli(root,'record',null,input);assert.equal(state(root).units.length,1);
});
test('重登草案恢复真实changes，强制核查报告，正文变更后不能只抄旧哈希',t=>{
  const {root}=fixture(t,2);workflow(root,true);const original=state(root),branch=begin(root);main(['rewind','--project',branch.workspace,'--from','1','--expected-revision',String(state(branch.workspace).revision),'--revision-token',branch.token]);
  for(let n=1;n<=2;n++){
    const input=main(['revision','replay-input','--project',branch.workspace,'--unit',String(n),'--revision-token',branch.token]);assert.equal(input.summary,original.units[n-1].summary);assert.equal(input.expected_revision,state(branch.workspace).revision);
    assert.equal(cli(branch.workspace,'record-preview',null,input,branch.token,1).findings[0].code,'REPLAY_REVIEW_REQUIRED');
    const report=`审查/重登${n}.md`;file(branch.workspace,report,'# 合成重登复核\n\n字段验证，不冒充模型阅读。\n');input.replay_review={reviewer:'synthetic-test',report,draft_sha256:input._replay.draft_sha256,checked_fields:['summary','characters','timeline','ledger','evidence','downstream']};
    assert.equal(cli(branch.workspace,'record-preview',null,input,branch.token).ok,true);cli(branch.workspace,'record',null,input,branch.token);
  }
  assert.deepEqual(state(branch.workspace).snapshot,original.snapshot);assert.ok(state(branch.workspace).units.every(u=>u.replay_review));
  const bad=state(branch.workspace).units[0].replay_review.frozen_ref;file(branch.workspace,bad,'破坏冻结复核');assert.throws(()=>call(branch.workspace,'status'),/重登实读依据/);
});
test('内部可读入口不覆盖、不推进业务revision、不作为正式设定来源并受会话占用保护',t=>{
  const {root}=fixture(t,1),before=rawState(root);const args=['context','--project',root,'--purpose','discussion','--out','.writer/drafts/context-read.json'];main(args);assert.deepEqual(rawState(root),before);assert.throws(()=>main(args),/不覆盖/);
  assert.throws(()=>main(['context','--project',root,'--purpose','discussion','--out','../escape.json']),/只能/);
  workflow(root,true);const b=begin(root);assert.throws(()=>main(['context','--project',root,'--purpose','discussion','--out','.writer/drafts/blocked.json']),/活跃修订/);assert.ok(b.workspace);
});
test('长篇迁移预览只读，schema1实际迁移保持事实及正文原字节',t=>{
  const {dir}=fixture(t,0),root=path.join(dir,'legacy');initProject(root,'novel','旧协议预览',{legacy:true});call(root,'plan',null,{unit:1,title:'桥',goal:'交接',change:'交接完成',beats:['交接'],cast:[],setting_refs:[],research_refs:[]});file(root,'正文/0001.md','# 桥\n\n保留原文。\n');const input=main(['record-template','--project',root,'--unit','1','--draft','正文/0001.md']);input.summary='原稿事实';input.snapshot.timeline.push('交接完成');call(root,'record',null,input);const before=state(root),body=fs.readFileSync(path.join(root,'正文/0001.md')),raw=rawState(root);
  const p=cli(root,'long-enable-preview');assert.equal(p.scope,'read-only-migration-preview');assert.ok(p.estimated_new_journal_bytes>0);assert.deepEqual(rawState(root),raw);main(['long-enable','--project',root,'--expected-revision',String(before.revision)]);assert.deepEqual(state(root).snapshot,before.snapshot);assert.deepEqual(fs.readFileSync(path.join(root,'正文/0001.md')),body);
});
