import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import test from 'node:test';
import {spawnSync} from 'node:child_process';
import {main} from '../lib/workspace.mjs';
import {writeBuildManifest} from '../lib/tool-build.mjs';
import {fixture,ROOT,file,state,sha,call,evidence,review,workflow,begin,rewindBranch,prepare,commit} from './protection-fixture.mjs';
function spec(root){return {mapping:state(root).units.map(u=>({unit:u.unit,from:u.draft,to:`正文/V1-旧卷/${path.basename(u.draft)}`,sha256:u.sha256})),directories:[{volume_id:'V1',directory:'正文/V1-旧卷',from:1,to:10}]};}
function request(root){return {...call(root,'draft','relocate-plan',spec(root)).request,author_evidence:evidence(root)};}
function fault(root,input,env){const f=file(root,'.writer/relocation-input.json',input);return spawnSync(process.execPath,[path.join(ROOT,'bin/ai-writer.mjs'),'draft','relocate','--project',root,'--input',f],{encoding:'utf8',windowsHide:true,env:{...process.env,AI_WRITER_TEST_FAULT:'1',...env}});}
test('规划正文旧引用在迁移后可读，原引用不变，旧地址遮蔽拒绝',t=>{
  const {root}=fixture(t,3),before=state(root),w=call(root,'workflow','show').workflow;
  w.planning.structure={status:'adopted',refs:before.units.map(u=>u.draft),unresolved_ids:[]};
  call(root,'workflow','set',{expected_revision:before.revision,operation_id:'planning-draft-refs',author_evidence:evidence(root),workflow:w});
  const oldRefs=state(root).governance.planning.structure.refs;
  call(root,'draft','relocate',request(root));
  assert.deepEqual(call(root,'workflow','show').workflow.planning.structure.refs,oldRefs);
  assert.doesNotThrow(()=>main(['status','--project',root]));
  assert.equal(main(['check','--project',root]).ok,true);
  call(root,'source','list');
  const bad=structuredClone(call(root,'workflow','show').workflow);bad.planning.structure.refs=['../outside.md'];
  assert.throws(()=>call(root,'workflow','set',{expected_revision:state(root).revision,operation_id:'unsafe-planning-ref',author_evidence:evidence(root),workflow:bad}));
  assert.deepEqual(call(root,'workflow','show').workflow.planning.structure.refs,oldRefs);
  file(root,oldRefs[0],'占用旧路径');
  assert.throws(()=>main(['status','--project',root]),e=>e.code==='RELOCATION_ALIAS_SHADOW');
});
test('纯移动保持历史消费、差量与审查覆盖，重复执行幂等，稳定目录延续',t=>{
  const {root}=fixture(t,3);review({workspace:root});const before=state(root),reviews=main(['check','--project',root]).rolling_review;
  const input=request(root),result=call(root,'draft','relocate',input);assert.equal(result.body_copies,0);assert.equal(state(root).schema_version,7);
  for(const [i,u]of state(root).units.entries()){assert.equal(sha(fs.readFileSync(path.join(root,u.draft))),before.units[i].sha256);assert.equal(fs.existsSync(path.join(root,before.units[i].draft)),false);assert.deepEqual(u.source_hashes,before.units[i].source_hashes);assert.equal(u.journal_sha256,before.units[i].journal_sha256);}
  assert.equal(main(['check','--project',root]).ok,true);assert.equal(call(root,'draft','relocate',input).unchanged,true);
  assert.deepEqual(main(['check','--project',root]).rolling_review,reviews);
  call(root,'plan',null,{unit:4,title:'下一章',goal:'继续',change:'核对',beats:['核对']});assert.ok(main(['context','--project',root,'--unit','4']).draft_path.startsWith('正文/V1-旧卷/'));
});
for(const direction of ['complete','rollback'])test(`正文移动中断可 ${direction}，原文不复制`,t=>{
  const {root}=fixture(t,3),before=state(root),input=request(root),r=fault(root,input,{AI_WRITER_TEST_RELOCATE_STOP_AFTER:'1'});assert.equal(r.status,94,r.stderr);
  assert.throws(()=>main(['check','--project',root]),e=>e.code==='TRANSACTION_PENDING');const tx=call(root,'draft','relocations').transactions[0];
  const out=call(root,'draft','relocate-recover',{transaction_id:tx.id,direction,lock_sha256:tx.lock_sha256,author_evidence:evidence(root)});assert.equal(out.status,direction==='complete'?'completed':'rolled-back');assert.equal(main(['check','--project',root]).ok,true);if(direction==='rollback')assert.deepEqual(state(root),before);
});
test('目标占用、坏哈希、错误卷、过期预览不写业务状态；第三方修改不覆盖',t=>{
  const {root}=fixture(t,2),before=state(root),s=spec(root);s.mapping[0].sha256='0'.repeat(64);assert.throws(()=>call(root,'draft','relocate-plan',s));assert.deepEqual(state(root),before);
  const wrong=spec(root);wrong.mapping[0].to='正文/另一卷/a.md';assert.throws(()=>call(root,'draft','relocate-plan',wrong),e=>e.code==='RELOCATION_VOLUME_MISMATCH');
  const input=request(root);assert.throws(()=>call(root,'draft','relocate',{...input,expected_revision:input.expected_revision-1}),e=>e.code==='RELOCATION_PLAN_CHANGED');assert.deepEqual(state(root),before);
  const r=fault(root,input,{AI_WRITER_TEST_RELOCATE_STOP_AFTER:'1'});assert.equal(r.status,94,r.stderr);file(root,input.mapping[1].from,'第三方版本');const tx=call(root,'draft','relocations').transactions[0];assert.throws(()=>call(root,'draft','relocate-recover',{transaction_id:tx.id,direction:'complete',lock_sha256:tx.lock_sha256,author_evidence:evidence(root)}),e=>e.code==='RELOCATION_EXTERNAL_CONFLICT');assert.equal(fs.readFileSync(path.join(root,input.mapping[1].from),'utf8'),'第三方版本');assert.deepEqual(state(root),before);
});
test('原地只读验证的工具更新不在验证目录复制正文',t=>{
  const {root}=fixture(t,2),before=state(root),p=call(root,'tool','update-plan',{source:ROOT,validation_mode:'in-place-readonly'});
  const r=call(root,'tool','update',{...p.request,author_evidence:evidence(root)});assert.equal(r.ok,true);assert.equal(main(['check','--project',root]).ok,true);
  const folder=path.join(root,'.writer/tool-updates',r.transaction_id,'validation/正文');assert.deepEqual(fs.readdirSync(folder),[]);assert.deepEqual(state(root).units,before.units);
});
test('迁移预览拒绝目标覆盖、路径别名、保留名与硬链接',t=>{
  const {root}=fixture(t,2),before=state(root);
  const occupied=spec(root);file(root,occupied.mapping[0].to,'外部文件');assert.throws(()=>call(root,'draft','relocate-plan',occupied),e=>e.code==='RELOCATION_TARGET_EXISTS');
  for(const target of ['正文/V1-旧卷/CON.md','正文/../outside.md','正文/V1-旧卷/0002.md']){const x=spec(root);x.mapping[0].to=target;assert.throws(()=>call(root,'draft','relocate-plan',x));}
  const original=path.join(root,before.units[0].draft),link=path.join(root,'研究/hard-link.md');fs.linkSync(original,link);assert.throws(()=>call(root,'draft','relocate-plan',spec(root)),e=>e.code==='RELOCATION_UNSAFE_PATH');assert.deepEqual(state(root),before);
});
for(const direction of ['complete','rollback'])test(`状态发布后中断仍可 ${direction}`,t=>{
  const {root}=fixture(t,2),before=state(root),r=fault(root,request(root),{AI_WRITER_TEST_RELOCATE_STOP_PHASE:'state'});assert.equal(r.status,93,r.stderr);const tx=call(root,'draft','relocations').transactions[0];
  call(root,'draft','relocate-recover',{transaction_id:tx.id,direction,lock_sha256:tx.lock_sha256,author_evidence:evidence(root)});assert.equal(main(['check','--project',root]).ok,true);if(direction==='rollback')assert.deepEqual(state(root),before);
});
for(const direction of ['complete','rollback'])test(`独占目标占位后中断可 ${direction}，只允许事务自己的同 inode 双路径`,t=>{
  const {root}=fixture(t,2),before=state(root),input=request(root),r=fault(root,input,{AI_WRITER_TEST_RELOCATE_STOP_LINK:'1'});assert.equal(r.status,90,r.stderr);
  const m=input.mapping[0],a=fs.statSync(path.join(root,m.from)),b=fs.statSync(path.join(root,m.to));assert.equal(a.ino,b.ino);assert.equal(a.nlink,2);
  const tx=call(root,'draft','relocations').transactions[0];call(root,'draft','relocate-recover',{transaction_id:tx.id,direction,lock_sha256:tx.lock_sha256,author_evidence:evidence(root)});
  assert.equal(main(['check','--project',root]).ok,true);assert.equal(fs.statSync(path.join(root,direction==='complete'?m.to:m.from)).nlink,1);if(direction==='rollback')assert.deepEqual(state(root),before);
});
test('稳定目录到界拒绝默认回退，可显式扩展未来范围且不再移动正文',t=>{
  const {root}=fixture(t,2),s=spec(root);s.directories[0].to=2;const p=call(root,'draft','relocate-plan',s);call(root,'draft','relocate',{...p.request,author_evidence:evidence(root)});
  call(root,'plan',null,{unit:3,title:'后续',goal:'核对',change:'继续',beats:['核对']});assert.throws(()=>main(['context','--project',root,'--unit','3']),e=>e.code==='DRAFT_DIRECTORY_REQUIRED');
  const next=call(root,'draft','relocate-plan',{mapping:[],directories:[{...s.directories[0],to:4}]});assert.equal(call(root,'draft','relocate',{...next.request,author_evidence:evidence(root)}).moved,0);assert.ok(main(['context','--project',root,'--unit','3']).draft_path.startsWith('正文/V1-旧卷/'));
});
for(const direction of ['complete','rollback'])test(`不复制正文的工具更新中断可 ${direction}`,t=>{
  const {root}=fixture(t,2),before=state(root),p=call(root,'tool','update-plan',{source:ROOT,validation_mode:'in-place-readonly'}),input=file(root,'.writer/nocopy-update.json',{...p.request,author_evidence:evidence(root)});
  const r=spawnSync(process.execPath,[path.join(ROOT,'bin/ai-writer.mjs'),'tool','update','--project',root,'--input',input],{encoding:'utf8',windowsHide:true,env:{...process.env,AI_WRITER_TEST_FAULT:'1',AI_WRITER_TEST_TOOL_STOP_PHASE:'prepared'}});assert.equal(r.status,97,r.stderr);
  const tx=call(root,'tool','updates').transactions.find(t=>t.status==='prepared');assert.deepEqual(fs.readdirSync(path.join(root,'.writer/tool-updates',tx.id,'validation/正文')),[]);
  call(root,'tool','recover',{transaction_id:tx.id,direction,lock_sha256:sha(fs.readFileSync(path.join(root,'.writer/write.lock'))),author_evidence:evidence(root)});assert.equal(main(['check','--project',root]).ok,true);assert.deepEqual(state(root).units,before.units);if(direction==='rollback')assert.deepEqual(state(root),before);
});
test('意见先采用再迁移修订，提交后再次迁移，仍按真实变更完成 apply 与 acknowledge',t=>{
  const {root}=fixture(t,2);let sequence=0;
  function structured(issues){const s=state(root),report=`审查/迁移结构-${++sequence}.md`;file(root,report,'# 合成接口复核\n仅验证路径与真实修订绑定，不声明文学质量。');return call(root,'review',null,{expected_revision:s.revision,operation_id:`relocation-review-${sequence}`,from:1,to:2,kind:'model-self-review',report,source_hashes:Object.fromEntries(s.units.map(u=>[u.draft,u.sha256])),chapter_functions:s.units.map(u=>({unit:u.unit,...Object.fromEntries(['goal','obstacle','choice','consequence','relationship_change'].map(k=>[k,{status:'unknown',reason:'合成接口样本不作文学判断'}]))})),comparison:{similar_structures:[],distinct_gains:['编号不同'],preserve:['物件事实'],optional_adjustments:[],limits:'合成样本'},issues});}
  structured([{id:'I_MOVE',type:'continuity',severity:'minor',confidence:'high',statement:'合成第一章核对意见',suggestion:'增加核对动作',evidence:[{unit:1,quote:'林衡把铜片交给阿禾。'}]},{id:'I_ACK',type:'continuity',severity:'minor',confidence:'high',statement:'合成第二章核对意见',suggestion:'增加核对动作',evidence:[{unit:2,quote:'阿禾带着铜片走到第2处桥头。'}]}]);
  workflow(root,true);call(root,'review-issues','resolve',{expected_revision:state(root).revision,operation_id:'move-adopt',id:'I_MOVE',disposition:'adopted',reason:'合成修订授权',decision_actor:'agent-within-authorized-scope',authorization:state(root).governance_binding});
  call(root,'draft','relocate',request(root));const original=state(root),b=begin(root);rewindBranch(b);
  for(let n=1;n<=2;n++){const draft=original.units[n-1].draft;fs.appendFileSync(path.join(b.workspace,draft),'\n阿禾再次核对了交接编号。\n');const x=main(['revision','replay-input','--project',b.workspace,'--unit',String(n),'--revision-token',b.token]),report=`审查/重登迁移-${n}.md`;file(b.workspace,report,'# 合成复核\n核对六项登记与后续承接，不声明文学验收。');x.replay_review={reviewer:'synthetic',report,draft_sha256:sha(fs.readFileSync(path.join(b.workspace,draft))),checked_fields:['summary','characters','timeline','ledger','evidence','downstream']};call(b.workspace,'record',null,x,b.token);}
  review(b);prepare(root,b);commit(root,b);const proof=JSON.parse(fs.readFileSync(path.join(root,state(root).committed_revisions.at(-1).ref)));
  const p=call(root,'draft','relocate-plan',{mapping:state(root).units.map(u=>({unit:u.unit,from:u.draft,to:`正文/V1-定名/${path.basename(u.draft)}`,sha256:u.sha256})),directories:[{volume_id:'V1',directory:'正文/V1-定名',from:1,to:10}]});call(root,'draft','relocate',{...p.request,author_evidence:evidence(root)});
  call(root,'review-issues','apply',{expected_revision:state(root).revision,operation_id:'move-apply',id:'I_MOVE',commit_id:proof.id,reason:'按真实提交应用'});
  call(root,'review-issues','acknowledge',{expected_revision:state(root).revision,operation_id:'move-ack',id:'I_ACK',commit_id:proof.id,target_units:[2],reason:'合成补登记',decision_actor:'agent-within-authorized-scope',authorization:state(root).governance_binding});
  const r=structured([]);for(const id of ['I_MOVE','I_ACK'])call(root,'review-issues','verify',{expected_revision:state(root).revision,operation_id:`move-verify-${id}`,id,review_ref:r.ref,reviewer:'synthetic',conclusion:'resolved',reason:'合成流程复核'});
  assert.equal(call(root,'review-issues','list').counts.verified,2);assert.equal(main(['check','--project',root]).ok,true);
});
test('迁移不追认手工替换后的安装构建，恢复拒绝中断期间工具改动',t=>{
  const {root}=fixture(t,2),p=call(root,'tool','update-plan',{source:ROOT,validation_mode:'in-place-readonly'});call(root,'tool','update',{...p.request,author_evidence:evidence(root)});
  const target=path.join(root,'.writer/tool/docs/user-guide.md'),original=fs.readFileSync(target),manifest=path.join(root,'.writer/tool/build-manifest.json'),saved=fs.readFileSync(manifest);
  fs.appendFileSync(target,'\n合成篡改用例。\n');fs.unlinkSync(manifest);writeBuildManifest(path.join(root,'.writer/tool'));assert.throws(()=>call(root,'draft','relocate-plan',spec(root)),e=>e.code==='RELOCATION_INSTALLED_BUILD_MISMATCH');fs.writeFileSync(target,original);fs.writeFileSync(manifest,saved);
  const before=state(root),r=fault(root,request(root),{AI_WRITER_TEST_RELOCATE_STOP_AFTER:'1'});assert.equal(r.status,94,r.stderr);fs.appendFileSync(target,'\n中断期间第三方改动。\n');const tx=call(root,'draft','relocations').transactions[0];
  assert.throws(()=>call(root,'draft','relocate-recover',{transaction_id:tx.id,direction:'complete',lock_sha256:tx.lock_sha256,author_evidence:evidence(root)}),e=>e.code==='RELOCATION_EXTERNAL_CONFLICT');assert.deepEqual(state(root),before);assert.ok(fs.readFileSync(target,'utf8').includes('第三方改动'));
});
