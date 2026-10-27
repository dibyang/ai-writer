import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {ROOT,fixture,state,file,workflow,evidence,call,begin,edit,prepare,commit,unit,sha,rewindBranch,review as reviewBranch} from './protection-fixture.mjs';
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
test('实际旧0.5可读schema4，显式启用5后拒绝；旧事实和消费绑定完全保留',t=>{
  const {root}=fixture(t,2),s=state(root);delete s.review_workflow;s.schema_version=4;file(root,'.writer/state.json',s);
  const old=path.join(ROOT,'tests/fixtures/tool-0.5/bin/ai-writer.mjs');const before=rawState(root),oldRead=spawnSync(process.execPath,[old,'status','--project',root],{encoding:'utf8'});assert.equal(oldRead.status,0,oldRead.stderr);
  assert.equal(cli(root,'review-workflow','preview').already_enabled,false);assert.deepEqual(rawState(root),before);
  const enabled=cli(root,'review-workflow','enable',{expected_revision:s.revision,author_evidence:evidence(root)});assert.equal(enabled.schema_version,5);assert.deepEqual(fs.readFileSync(path.join(root,enabled.backup)),before);assert.deepEqual(state(root).units,s.units);assert.deepEqual(state(root).snapshot,s.snapshot);
  const after=rawState(root),rejected=spawnSync(process.execPath,[old,'status','--project',root],{encoding:'utf8'});assert.equal(rejected.status,2);assert.deepEqual(rawState(root),after);
  const manifest=JSON.parse(fs.readFileSync(path.join(ROOT,'tests/fixtures/tool-0.5/source-manifest.json')));for(const r of manifest.files)assert.equal(sha(fs.readFileSync(path.join(ROOT,'tests/fixtures/tool-0.5',r.file))),r.sha256);
});
test('重登草案在正文改字后拒绝旧绑定；新稿引文失效仍要求实际修正',t=>{
  const {root}=fixture(t,1);workflow(root,true);const branch=begin(root);main(['rewind','--project',branch.workspace,'--from','1','--expected-revision',String(state(branch.workspace).revision),'--revision-token',branch.token]);
  const input=main(['revision','replay-input','--project',branch.workspace,'--unit','1','--revision-token',branch.token]);file(branch.workspace,input.draft,'# 改稿\n\n林衡把铜片交给阿禾。\n新增一句。\n');const report='审查/真实核对.md';file(branch.workspace,report,'# 合成核对\n仅接口用例。');input.replay_review={reviewer:'synthetic',report,draft_sha256:input._replay.draft_sha256,checked_fields:['summary','characters','timeline','ledger','evidence','downstream']};
  const stale=cli(branch.workspace,'record-preview',null,input,branch.token,1);assert.equal(stale.findings[0].code,'REPLAY_INPUT_STALE');
  file(branch.workspace,input.draft,'# 改稿\n\n没有原铜片交接引文。\n');const next=main(['revision','replay-input','--project',branch.workspace,'--unit','1','--revision-token',branch.token]);next.replay_review={...input.replay_review,draft_sha256:next._replay.draft_sha256};assert.equal(cli(branch.workspace,'record-preview',null,next,branch.token,1).ok,false);
});
test('等价重登没有对应原文修改，不能把采用意见标为applied',t=>{
  const {root}=fixture(t,1);cli(root,'review',null,reviewInput(root));workflow(root,true);resolve(root,'I_CHECK');const branch=begin(root);edit(branch,'');prepare(root,branch);commit(root,branch);
  const s=state(root),record=JSON.parse(fs.readFileSync(path.join(root,s.committed_revisions.at(-1).ref))),before=rawState(root);
  const rejected=cli(root,'review-issues','apply',{...op(root),id:'I_CHECK',commit_id:record.id,reason:'只是重登不是实改'},undefined,2);assert.equal(rejected.code,'REVIEW_CHANGE_REQUIRED');assert.deepEqual(rawState(root),before);
});
test('按稳定意见ID直接展开取舍历史，普通原型名称不被误当既有操作',t=>{
  const {root}=fixture(t,1);const input=reviewInput(root);input.operation_id='toString';cli(root,'review',null,input);resolve(root,'I_STYLE','retained');resolve(root,'I_STYLE','deferred');
  const result=main(['review-issues','list','--project',root,'--id','I_STYLE']);assert.equal(result.issues.length,1);assert.equal(result.issues[0].history_events.length,2);assert.equal(result.issues[0].history_events[1].issue.status,'retained');assert.equal(result.issues[0].effective_status,'deferred');
});
test('结构化功能表在旧章实改后失效，冻结原文和原判断仍可核',t=>{
  const {root}=fixture(t,2),input=reviewInput(root,false),first=cli(root,'review',null,input),saved=fs.readFileSync(path.join(root,first.ref)),oldFacts=structuredClone(state(root).snapshot);workflow(root,true);const branch=begin(root);edit(branch,'新版语句');prepare(root,branch);commit(root,branch);
  assert.deepEqual(fs.readFileSync(path.join(root,first.ref)),saved);
  const factual=snapshot=>JSON.parse(JSON.stringify(snapshot,(key,value)=>key==='sha256'?undefined:value));assert.deepEqual(factual(state(root).snapshot),factual(oldFacts));
  assert.equal(state(root).snapshot.ledger.O_COPPER.evidence[0].sha256,state(root).units[0].sha256);
  const checked=cli(root,'check');assert.ok(checked.rolling_review.stale>=1);const record=JSON.parse(saved);for(const u of record.units)assert.equal(sha(fs.readFileSync(path.join(root,u.frozen_ref))),u.sha256);
});

function replayTracking(branch,mode){
  const root=branch.workspace,count=state(root).units.length;rewindBranch(branch);
  for(let n=1;n<=count;n++){
    const input=main(['revision','replay-input','--project',root,'--unit',String(n),'--revision-token',branch.token]);
    if(n===1&&mode==='summary')input.summary+='；合成摘要澄清当日交接';
    if(n===1&&mode==='timeline')input.changes.timeline_append=['合成时间锚澄清：当日交接1'];
    const report=`审查/追踪重登-${++seq}.md`;file(root,report,'# 合成接口用例\n\n核验追踪变更协议，不冒充实际模型阅读或文学结论。\n');
    input.replay_review={reviewer:'synthetic-interface-test',report,draft_sha256:input._replay.draft_sha256,checked_fields:['summary','characters','timeline','ledger','evidence','downstream']};
    cli(root,'record-preview',null,input,branch.token);cli(root,'record',null,input,branch.token);
  }
  reviewBranch(branch);
}
function trackingCommit(root,mode){const b=begin(root);replayTracking(b,mode);prepare(root,b);commit(root,b);return JSON.parse(fs.readFileSync(path.join(root,state(root).committed_revisions.at(-1).ref)));}
for(const mode of ['summary','timeline'])test(`仅${mode}实际修正可用tracking闭环，正文默认门槛不变，后改须重核`,t=>{
  const {root}=fixture(t,2);cli(root,'review',null,reviewInput(root));workflow(root,true);resolve(root,'I_CHECK');const before=state(root),bodies=before.units.map(u=>fs.readFileSync(path.join(root,u.draft))),record=trackingCommit(root,mode);
  for(const [i,u]of state(root).units.entries())assert.deepEqual(fs.readFileSync(path.join(root,u.draft)),bodies[i]);const unchanged=rawState(root);
  assert.equal(cli(root,'review-issues','apply',{...op(root),id:'I_CHECK',commit_id:record.id,reason:'默认仍只认正文修改'},undefined,2).code,'REVIEW_CHANGE_REQUIRED');assert.deepEqual(rawState(root),unchanged);
  const input={...op(root),id:'I_CHECK',commit_id:record.id,change_scope:'tracking',reason:'只绑定已提交的实际登记追踪变化'},applied=cli(root,'review-issues','apply',input);assert.equal(applied.status,'applied');assert.equal(cli(root,'review-issues','apply',input).unchanged,true);
  const application=state(root).review_workflow.issues.I_CHECK.application;assert.equal(application.change_scope,'tracking');assert.ok(application.tracking_changes.some(c=>c[mode==='summary'?'summary_changed':'snapshot_changed']));assert.ok(application.changes.every(c=>c.before===c.after));
  const reviewed=cli(root,'review',null,reviewInput(root,false));cli(root,'review-issues','verify',{...op(root),id:'I_CHECK',review_ref:reviewed.ref,reviewer:'synthetic-interface-test',conclusion:'resolved',reason:'接口核验，不是文学验收'});assert.equal(cli(root,'review-issues','list').issues.find(i=>i.id==='I_CHECK').effective_status,'verified');
  const history=state(root).review_workflow.events.slice();trackingCommit(root,mode==='summary'?'timeline':'summary');assert.equal(cli(root,'review-issues','list').issues.find(i=>i.id==='I_CHECK').effective_status,'needs-recheck');assert.deepEqual(state(root).review_workflow.events.slice(0,history.length),history);
});
test('tracking不把等价重登的新来源、报告及journal引用算作实际修改',t=>{
  const {root}=fixture(t,2);cli(root,'review',null,reviewInput(root));workflow(root,true);resolve(root,'I_CHECK');const before=state(root),record=trackingCommit(root,'none'),after=state(root);assert.deepEqual(after.snapshot,before.snapshot);assert.deepEqual(after.units.map(u=>u.summary),before.units.map(u=>u.summary));assert.notEqual(after.units[0].journal,before.units[0].journal);assert.notDeepEqual(after.units[0].source_hashes,before.units[0].source_hashes);const unchanged=rawState(root),objects=fs.readdirSync(path.join(root,'.writer/objects')).sort();
  assert.equal(cli(root,'review-issues','apply',{...op(root),id:'I_CHECK',commit_id:record.id,change_scope:'tracking',reason:'无实际追踪变化'},undefined,2).code,'REVIEW_CHANGE_REQUIRED');assert.deepEqual(rawState(root),unchanged);assert.deepEqual(fs.readdirSync(path.join(root,'.writer/objects')).sort(),objects);
});
test('tracking不能把提交后才采用的新登记当成修改前基线',t=>{
  const {root}=fixture(t,1);cli(root,'review',null,reviewInput(root));workflow(root,true);const record=trackingCommit(root,'summary');resolve(root,'I_CHECK');const unchanged=rawState(root);assert.equal(cli(root,'review-issues','apply',{...op(root),id:'I_CHECK',commit_id:record.id,change_scope:'tracking',reason:'采用基线已是修改后'},undefined,2).code,'REVIEW_PUBLICATION_MISMATCH');assert.deepEqual(rawState(root),unchanged);
});
test('tracking模式与事务归档须真实有效，错误模式及篡改旧状态不写入',t=>{
  const {root}=fixture(t,1);cli(root,'review',null,reviewInput(root));workflow(root,true);resolve(root,'I_CHECK');const record=trackingCommit(root,'summary'),unchanged=rawState(root),objects=fs.readdirSync(path.join(root,'.writer/objects')).sort();
  for(const change_scope of [null,'unknown',{},['tracking']]){assert.equal(cli(root,'review-issues','apply',{...op(root),id:'I_CHECK',commit_id:record.id,change_scope,reason:'错误模式'},undefined,2).code,'REVIEW_INPUT_INVALID');assert.deepEqual(rawState(root),unchanged);}
  const session=JSON.parse(fs.readFileSync(path.join(root,`.writer/revisions/${record.session_id}/session.json`))),tx=JSON.parse(fs.readFileSync(path.join(root,`.writer/transactions/${session.transaction_id}/transaction.json`))),row=tx.plan.find(r=>r.file==='.writer/state.json');file(root,row.old_ref,'破坏已发布事务的旧登记归档');assert.equal(cli(root,'review-issues','apply',{...op(root),id:'I_CHECK',commit_id:record.id,change_scope:'tracking',reason:'不能追认坏归档'},undefined,2).code,'TRANSACTION_CORRUPT');assert.deepEqual(rawState(root),unchanged);assert.deepEqual(fs.readdirSync(path.join(root,'.writer/objects')).sort(),objects);
});

function existingRepairFixture(t){
  const {root}=fixture(t,2),input=reviewInput(root,false),quotes=state(root).units.map(u=>({unit:u.unit,quote:fs.readFileSync(path.join(root,u.draft),'utf8').split(/\r?\n/).find(l=>l.includes('铜片'))}));
  input.issues=[{id:'I_ACK',type:'continuity',severity:'minor',confidence:'high',statement:'合成：第一章仅作参考，第二章有待修措辞',suggestion:'仅修第二章，保留第一章参考证据',evidence:quotes},{id:'I_ACK_STYLE',type:'optional_style',severity:'suggestion',confidence:'high',statement:'合成可选表达',suggestion:'不能自动采纳',evidence:quotes},{id:'I_ACK_AUTHOR',type:'correctness',severity:'minor',confidence:'high',statement:'合成作者保留项',suggestion:'保留取舍',evidence:[quotes[1]]}];
  cli(root,'review',null,input);workflow(root,true);return {root};
}
function narrowToSecond(root){const w=structuredClone(state(root).governance);w.authorization.revise_range={from:2,to:2};call(root,'workflow','set',{...op(root),author_evidence:evidence(root),workflow:w});}
function repairSecond(root,suffix='实际修复第二章措辞'){
  const b=call(root,'revision','begin',{expected_revision:state(root).revision,owner:'synthetic-existing-repair',from:2,through:2});
  main(['rewind','--project',b.workspace,'--from','2','--expected-revision',String(state(b.workspace).revision),'--revision-token',b.token]);unit(b.workspace,2,b.token,suffix);reviewBranch(b);prepare(root,b);commit(root,b);
  return JSON.parse(fs.readFileSync(path.join(root,state(root).committed_revisions.at(-1).ref)));
}
const acknowledgement=(root,record,extra={})=>({...op(root),id:'I_ACK',commit_id:record.id,target_units:[2],reason:'现在接受已发生的合成修复，不追认为事前采用',decision_actor:'agent-within-authorized-scope',authorization:state(root).governance_binding,...extra});
function assertNoReviewWrite(root,input,code){const raw=rawState(root),objects=fs.readdirSync(path.join(root,'.writer/objects')).sort();const result=cli(root,'review-issues','acknowledge',input,undefined,2);assert.equal(result.code,code);assert.deepEqual(rawState(root),raw);assert.deepEqual(fs.readdirSync(path.join(root,'.writer/objects')).sort(),objects);}

test('既有修复补登记区分参考章和目标章，真实窄修订后仍需当前复核且不伪造事前采纳',t=>{
  const {root}=existingRepairFixture(t);narrowToSecond(root);const raw=rawState(root);assert.equal(cli(root,'review-issues','resolve',{...op(root),id:'I_ACK',disposition:'adopted',reason:'旧采纳仍保守检查全部证据',decision_actor:'agent-within-authorized-scope',authorization:state(root).governance_binding},undefined,2).code,'ACTION_OUT_OF_SCOPE');assert.deepEqual(rawState(root),raw);
  const first=state(root).units[0],record=repairSecond(root),input=acknowledgement(root,record),saved=cli(root,'review-issues','acknowledge',input);assert.equal(saved.status,'applied');assert.equal(cli(root,'review-issues','acknowledge',input).unchanged,true);assert.deepEqual(state(root).units[0],first);
  const issue=state(root).review_workflow.issues.I_ACK;assert.equal(issue.evidence.length,2);assert.equal(issue.resolution.phase,'after-actual-repair');assert.equal(issue.resolution.prior_adoption_recorded,false);assert.equal(issue.resolution.decision_actor,'agent-within-authorized-scope');assert.deepEqual(issue.application.reference_units,[1]);assert.deepEqual(issue.application.target_units,[2]);assert.equal(issue.application.changes.length,1);assert.equal(issue.application.after_units.length,2);
  const stale=cli(root,'review-issues','verify',{...op(root),id:'I_ACK',review_ref:issue.origin.review_ref,reviewer:'synthetic',conclusion:'resolved',reason:'旧报告不算当前阅读'},undefined,2);assert.equal(stale.code,'REVIEW_CURRENT_READING_REQUIRED');const current=cli(root,'review',null,reviewInput(root,false));cli(root,'review-issues','verify',{...op(root),id:'I_ACK',review_ref:current.ref,reviewer:'synthetic-interface-only',conclusion:'resolved',reason:'仅验证状态机，非文学验收'});assert.equal(cli(root,'review-issues','list').issues.find(x=>x.id==='I_ACK').effective_status,'verified');
  assertNoReviewWrite(root,{...input,reason:'同ID换内容'},'OPERATION_CONFLICT');assertNoReviewWrite(root,{...input,operation_id:'stale-acknowledgement'},'REVISION_CHANGED');
});
test('既有修复补登记拒绝坏目标、越权、伪作者、可选项及作者保留，拒绝不留对象或状态',t=>{
  const {root}=existingRepairFixture(t);narrowToSecond(root);const record=repairSecond(root);
  for(const target_units of [[],[2,2],[2,1],[3],[0],['2'],null])assertNoReviewWrite(root,acknowledgement(root,record,{target_units}),'REVIEW_TARGETS_INVALID');
  assertNoReviewWrite(root,acknowledgement(root,record,{target_units:[1,2]}),'ACTION_OUT_OF_SCOPE');assertNoReviewWrite(root,acknowledgement(root,record,{authorization:null}),'REVIEW_AUTHORIZATION_MISMATCH');assertNoReviewWrite(root,acknowledgement(root,record,{decision_actor:'author'}),'REVIEW_AUTHORIZATION_MISMATCH');assertNoReviewWrite(root,acknowledgement(root,record,{id:'I_ACK_STYLE'}),'REVIEW_ACKNOWLEDGEMENT_INVALID');
  cli(root,'review-issues','resolve',{...op(root),id:'I_ACK_AUTHOR',disposition:'retained',reason:'合成作者明确保留',decision_actor:'author',author_evidence:evidence(root)});assertNoReviewWrite(root,acknowledgement(root,record,{id:'I_ACK_AUTHOR'}),'REVIEW_ACKNOWLEDGEMENT_INVALID');
  cli(root,'review-issues','resolve',{...op(root),id:'I_ACK_AUTHOR',disposition:'deferred',reason:'合成作者明确延期',decision_actor:'author',author_evidence:evidence(root)});assertNoReviewWrite(root,acknowledgement(root,record,{id:'I_ACK_AUTHOR'}),'REVIEW_ACKNOWLEDGEMENT_INVALID');
});
test('既有修复补登记不把等价重登、未知提交或改后的新意见伪造成原修复',t=>{
  const {root}=existingRepairFixture(t);narrowToSecond(root);const record=repairSecond(root,'');assertNoReviewWrite(root,acknowledgement(root,record),'REVIEW_CHANGE_REQUIRED');assertNoReviewWrite(root,acknowledgement(root,{id:'00000000-0000-4000-8000-000000000000'}),'REVISION_PUBLICATION_UNKNOWN');
  const actual=repairSecond(root);const newer=reviewInput(root,false);newer.issues=[{id:'I_ACK_NEW',type:'continuity',severity:'minor',confidence:'high',statement:'合成修后新问题不能借旧提交',suggestion:'重新核实',evidence:[{unit:2,quote:'阿禾带着铜片走到第2处桥头。'}]}];cli(root,'review',null,newer);assertNoReviewWrite(root,acknowledgement(root,actual,{id:'I_ACK_NEW'}),'REVIEW_PUBLICATION_MISMATCH');
});
test('既有修复补登记拒绝修订顺带改动参考章或当前已经再次重登的目标',t=>{
  const {root}=existingRepairFixture(t),both=begin(root);edit(both,'两个章节均修改');prepare(root,both);commit(root,both);const broad=JSON.parse(fs.readFileSync(path.join(root,state(root).committed_revisions.at(-1).ref)));narrowToSecond(root);assertNoReviewWrite(root,acknowledgement(root,broad),'REVIEW_CONTEXT_CHANGED');
  const other=existingRepairFixture(t).root;narrowToSecond(other);const first=repairSecond(other);repairSecond(other,'第二次实际修改');assertNoReviewWrite(other,acknowledgement(other,first),'REVIEW_PUBLICATION_MISMATCH');
});
test('既有修复补登记拒绝分支调用及损坏的真实事务归档',t=>{
  const {root}=existingRepairFixture(t);narrowToSecond(root);const b=call(root,'revision','begin',{expected_revision:state(root).revision,owner:'synthetic-ack-branch',from:2,through:2}),raw=rawState(b.workspace);const blocked=cli(b.workspace,'review-issues','acknowledge',acknowledgement(b.workspace,{id:'00000000-0000-4000-8000-000000000000'},{id:'I_ACK_AUTHOR'}),b.token,2);assert.equal(blocked.code,'REVIEW_PUBLICATION_REQUIRED');assert.deepEqual(rawState(b.workspace),raw);call(root,'revision','abort',{id:b.id,token:b.token,reason:'合成分支拒绝后结束占用'});
  const record=repairSecond(root),session=JSON.parse(fs.readFileSync(path.join(root,`.writer/revisions/${record.session_id}/session.json`))),tx=JSON.parse(fs.readFileSync(path.join(root,`.writer/transactions/${session.transaction_id}/transaction.json`))),row=tx.plan.find(x=>x.file==='.writer/state.json');file(root,row.old_ref,'损坏归档');assertNoReviewWrite(root,acknowledgement(root,record),'TRANSACTION_CORRUPT');
});
test('既有修复补登记接受代理延期但保留历史，已采纳后再延期不能洗掉原流程',t=>{
  const {root}=existingRepairFixture(t);narrowToSecond(root);const record=repairSecond(root);resolve(root,'I_ACK','deferred');const history=structuredClone(state(root).review_workflow.issues.I_ACK.history),deferredBinding=state(root).review_workflow.issues.I_ACK.binding;cli(root,'review-issues','acknowledge',acknowledgement(root,record));const current=state(root).review_workflow.issues.I_ACK;assert.deepEqual(current.history.slice(0,history.length),history);assert.deepEqual(current.history.at(-1),deferredBinding);assert.equal(current.resolution.prior_adoption_recorded,false);assert.equal(current.status,'applied');
  const other=existingRepairFixture(t).root;resolve(other,'I_ACK');narrowToSecond(other);const second=repairSecond(other);resolve(other,'I_ACK','deferred');assertNoReviewWrite(other,acknowledgement(other,second),'REVIEW_ACKNOWLEDGEMENT_INVALID');
});

function adoptedReferenceFixture(t){const {root}=existingRepairFixture(t);resolve(root,'I_ACK');const adopted=structuredClone(state(root).review_workflow.issues.I_ACK);narrowToSecond(root);return {root,adopted};}
function applyReference(root,record){return {...op(root),id:'I_ACK',commit_id:record.id,reason:'已事前采用，第一章只是保持不变的对照，只实际修复第二章'};}
function assertNoApplyWrite(root,input,code){const raw=rawState(root),objects=fs.readdirSync(path.join(root,'.writer/objects')).sort();assert.equal(cli(root,'review-issues','apply',input,undefined,2).code,code);assert.deepEqual(rawState(root),raw);assert.deepEqual(fs.readdirSync(path.join(root,'.writer/objects')).sort(),objects);}
function replayReference(root,firstSuffix,secondSuffix){workflow(root,true);const b=begin(root);rewindBranch(b);unit(b.workspace,1,b.token,firstSuffix);unit(b.workspace,2,b.token,secondSuffix);reviewBranch(b);prepare(root,b);commit(root,b);}

test('事前采用跨章意见后可仅提交目标章，范围外参考须保持且复核仍覆盖参考',t=>{
  const {root,adopted}=adoptedReferenceFixture(t),first=structuredClone(state(root).units[0]),record=repairSecond(root),input=applyReference(root,record);
  assert.equal(cli(root,'review-issues','apply',input).status,'applied');assert.equal(cli(root,'review-issues','apply',input).unchanged,true);
  const issue=state(root).review_workflow.issues.I_ACK;assert.deepEqual(issue.origin,adopted.origin);assert.deepEqual(issue.resolution,adopted.resolution);assert.deepEqual(state(root).units[0],first);assert.deepEqual(issue.application.reference_units,[1]);assert.deepEqual(issue.application.target_units,[2]);assert.deepEqual(issue.application.after_units.map(u=>u.unit),[1,2]);assert.deepEqual(issue.application.changes.map(u=>u.unit),[2]);assert.notEqual(issue.application.changes[0].before,issue.application.changes[0].after);
  const partial=reviewInput(root,false);partial.from=2;partial.chapter_functions=partial.chapter_functions.slice(1);partial.source_hashes=Object.fromEntries(Object.entries(partial.source_hashes).filter(([ref])=>ref===state(root).units[1].draft));partial.comparison.similar_structures=[];const short=cli(root,'review',null,partial),raw=rawState(root);
  assert.equal(cli(root,'review-issues','verify',{...op(root),id:'I_ACK',review_ref:short.ref,reviewer:'synthetic-interface-only',conclusion:'resolved',reason:'缺参考章的报告不能闭环'},undefined,2).code,'REVIEW_CURRENT_READING_REQUIRED');assert.deepEqual(rawState(root),raw);
  const current=cli(root,'review',null,reviewInput(root,false));cli(root,'review-issues','verify',{...op(root),id:'I_ACK',review_ref:current.ref,reviewer:'synthetic-interface-only',conclusion:'resolved',reason:'仅合成接口，不是文学验收'});assert.equal(cli(root,'review-issues','list').issues.find(x=>x.id==='I_ACK').effective_status,'verified');
  const application=structuredClone(state(root).review_workflow.issues.I_ACK.application);replayReference(root,'参考章后来确实变化','实际修复第二章措辞');assert.equal(cli(root,'review-issues','list').issues.find(x=>x.id==='I_ACK').effective_status,'needs-recheck');assert.deepEqual(state(root).review_workflow.issues.I_ACK.application,application);
});
test('跨章已采纳意见不能借无实改或无关提交闭环',t=>{
  const {root}=adoptedReferenceFixture(t),noop=repairSecond(root,'');assertNoApplyWrite(root,applyReference(root,noop),'REVIEW_CHANGE_REQUIRED');
  const unrelated=fixture(t,2).root;cli(unrelated,'review',null,reviewInput(unrelated));workflow(unrelated,true);resolve(unrelated,'I_CHECK');narrowToSecond(unrelated);const record=repairSecond(unrelated);assertNoApplyWrite(unrelated,{...op(unrelated),id:'I_CHECK',commit_id:record.id,reason:'第一章意见不能借第二章修改冒充修复'},'REVIEW_CHANGE_REQUIRED');
});
test('跨章已采纳意见拒绝参考章在采用后、提交前或提交后发生变化',t=>{
  const before=adoptedReferenceFixture(t).root;replayReference(before,'参考章在目标提交前改变','');narrowToSecond(before);const record=repairSecond(before);assertNoApplyWrite(before,applyReference(before,record),'REVIEW_PUBLICATION_MISMATCH');
  const after=adoptedReferenceFixture(t).root,actual=repairSecond(after);replayReference(after,'参考章在目标提交后改变','实际修复第二章措辞');assertNoApplyWrite(after,applyReference(after,actual),'REVIEW_CONTEXT_CHANGED');
});
test('跨章已采纳意见的参考登记重登或事务归档损坏仍拒绝且不写状态',t=>{
  const replayed=adoptedReferenceFixture(t).root,record=repairSecond(replayed);replayReference(replayed,'','实际修复第二章措辞');assertNoApplyWrite(replayed,applyReference(replayed,record),'REVIEW_CONTEXT_CHANGED');
  const corrupt=adoptedReferenceFixture(t).root,actual=repairSecond(corrupt),session=JSON.parse(fs.readFileSync(path.join(corrupt,`.writer/revisions/${actual.session_id}/session.json`))),tx=JSON.parse(fs.readFileSync(path.join(corrupt,`.writer/transactions/${session.transaction_id}/transaction.json`))),row=tx.plan.find(x=>x.file==='.writer/state.json');file(corrupt,row.old_ref,'破坏真实提交前登记归档');assertNoApplyWrite(corrupt,applyReference(corrupt,actual),'TRANSACTION_CORRUPT');
});

test('跨章已采纳意见的tracking闭环保留参考，默认正文门槛不变',t=>{
  const {root}=adoptedReferenceFixture(t),before=state(root),b=call(root,'revision','begin',{expected_revision:before.revision,owner:'synthetic-cross-reference-tracking',from:2,through:2});
  main(['rewind','--project',b.workspace,'--from','2','--expected-revision',String(state(b.workspace).revision),'--revision-token',b.token]);const input=main(['revision','replay-input','--project',b.workspace,'--unit','2','--revision-token',b.token]);input.summary+='；只澄清交接摘要';const report='审查/第二章追踪核对.md';file(b.workspace,report,'# 合成协议测试\n不是文学验收。');input.replay_review={reviewer:'synthetic',report,draft_sha256:input._replay.draft_sha256,checked_fields:['summary','characters','timeline','ledger','evidence','downstream']};cli(b.workspace,'record-preview',null,input,b.token);cli(b.workspace,'record',null,input,b.token);reviewBranch(b);prepare(root,b);commit(root,b);
  const record=JSON.parse(fs.readFileSync(path.join(root,state(root).committed_revisions.at(-1).ref)));assertNoApplyWrite(root,applyReference(root,record),'REVIEW_CHANGE_REQUIRED');cli(root,'review-issues','apply',{...applyReference(root,record),change_scope:'tracking'});const application=state(root).review_workflow.issues.I_ACK.application;assert.deepEqual(application.reference_units,[1]);assert.deepEqual(application.target_units,[2]);assert(application.tracking_changes.find(x=>x.unit===2).summary_changed);assert(application.changes.every(x=>x.before===x.after));assert.deepEqual(state(root).units.map(x=>x.sha256),before.units.map(x=>x.sha256));
});
