import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {main} from '../lib/workspace.mjs';
import {ROOT,fixture,file,state,sha,call,evidence,workflow,begin,rewindBranch,review,prepare,commit} from './protection-fixture.mjs';

const consumed=['人物/主角.md','架构/世界.md'];
function record(root,token,suffix='',extra=[]){
  call(root,'plan',null,{unit:1,title:'合成交接',goal:'交接',change:'核实',beats:['交接'],cast:['阿禾'],setting_refs:[...consumed,...extra],research_refs:[]},token);
  const input=main(['record-template','--project',root,'--unit','1','--draft','正文/0001.md']);
  file(root,input.draft,'# 合成接口测试\n\n阿禾接过铜片。'+suffix+'\n');input.summary='合成交接'+suffix;input.changes.characters={阿禾:'保管铜片'};input.changes.timeline_append=['交接'+suffix];
  call(root,'record',null,input,token);
}
function setup(t,planning=false){
  const {root}=fixture(t,0);for(const ref of consumed)file(root,ref,'# 合成来源\n原姓名。\n');
  file(root,'人物/未消费.md','# 合成来源\n原姓名。\n');file(root,'研究/未计划.md','# 合成来源\n原姓名。\n');
  if(planning){file(root,'人物/规划伴随.md','# 仅规划引用，不是已写章来源\n');const w=call(root,'workflow','show').workflow;w.planning.structure={status:'adopted',refs:['人物/规划伴随.md'],unresolved_ids:[],reason:''};call(root,'workflow','set',{expected_revision:state(root).revision,operation_id:'dependency-planning',author_evidence:evidence(root),workflow:w});}
  record(root);workflow(root,true);const before=fs.readFileSync(path.join(root,'.writer/state.json'));const branch=begin(root);return {root,branch,before};
}
function ready(t){const x=setup(t);rewindBranch(x.branch);for(const ref of consumed)file(x.branch.workspace,ref,'# 合成来源\n新姓名。\n');record(x.branch.workspace,x.branch.token,'新姓名');review(x.branch);x.prepared=prepare(x.root,x.branch);return x;}
function interrupt(x,partial=false){
  const input=file(x.root,'.writer/commit-test.json',{id:x.branch.id,token:x.branch.token});
  const r=spawnSync(process.execPath,[path.join(ROOT,'bin/ai-writer.mjs'),'revision','commit','--project',x.root,'--input',input],{encoding:'utf8',env:{...process.env,AI_WRITER_TEST_FAULT:'1',AI_WRITER_TEST_STOP_PHASE:partial?'':'transaction-prepared',AI_WRITER_TEST_STOP_AFTER:partial?String(x.prepared.changes.length-1):''}});
  assert.equal(r.status,partial?91:93,r.stderr);const dir=path.join(x.root,'.writer/transactions'),ids=fs.readdirSync(dir);assert.equal(ids.length,1);x.txFile=path.join(dir,ids[0],'transaction.json');x.tx=JSON.parse(fs.readFileSync(x.txFile));
  x.recovery={transaction_id:x.tx.id,token:x.branch.token,direction:'complete',lock_sha256:sha(fs.readFileSync(path.join(x.root,'.writer/write.lock'))),author_evidence:evidence(x.root)};return x;
}

test('修订复制明确规划引用的目录外伴随文件，首次回退无需手补',t=>{
  const x=setup(t,true);assert.deepEqual(fs.readFileSync(path.join(x.branch.workspace,'人物/规划伴随.md')),fs.readFileSync(path.join(x.root,'人物/规划伴随.md')));
  assert.equal(fs.existsSync(path.join(x.branch.workspace,'人物/未消费.md')),false);rewindBranch(x.branch);assert.equal(state(x.branch.workspace).units.length,0);
});
test('已固定的人物/架构依赖随正常修订提交，保留未消费文件并幂等',t=>{
  const x=ready(t),untouched=fs.readFileSync(path.join(x.root,'人物/未消费.md'));assert.equal(commit(x.root,x.branch).status,'completed');
  for(const ref of consumed)assert.equal(fs.readFileSync(path.join(x.root,ref),'utf8'),'# 合成来源\n新姓名。\n');
  const after=fs.readFileSync(path.join(x.root,'.writer/state.json'));assert.equal(commit(x.root,x.branch).unchanged,true);assert.deepEqual(fs.readFileSync(path.join(x.root,'.writer/state.json')),after);assert.deepEqual(fs.readFileSync(path.join(x.root,'人物/未消费.md')),untouched);
});
test('新增目录外来源未固定时prepare明确拒绝，保留候选而不漏发依赖',t=>{
  const x=setup(t);rewindBranch(x.branch);file(x.branch.workspace,'人物/新增.md','# 合成新增来源\n');record(x.branch.workspace,x.branch.token,'新来源',['人物/新增.md']);review(x.branch);
  assert.throws(()=>prepare(x.root,x.branch),error=>error.code==='REVISION_SCOPE_INVALID');assert.deepEqual(fs.readFileSync(path.join(x.root,'.writer/state.json')),x.before);
});
test('目录外依赖的prepared事务可完成并幂等，旧基线/计划不改',t=>{
  const x=interrupt(ready(t)),plan=JSON.stringify(x.tx.plan),base=fs.readFileSync(path.join(x.root,`.writer/revisions/${x.branch.id}/base.json`));
  assert.equal(call(x.root,'revision','recover',x.recovery).status,'completed');assert.equal(call(x.root,'revision','recover',x.recovery).unchanged,true);
  assert.equal(JSON.stringify(JSON.parse(fs.readFileSync(x.txFile)).plan),plan);assert.deepEqual(fs.readFileSync(path.join(x.root,`.writer/revisions/${x.branch.id}/base.json`)),base);
  for(const ref of consumed)assert.match(fs.readFileSync(path.join(x.root,ref),'utf8'),/新姓名/);
});
test('已部分替换目录外依赖的事务可回滚，恢复原状态和来源',t=>{
  const x=interrupt(ready(t),true);for(const ref of consumed)assert.match(fs.readFileSync(path.join(x.root,ref),'utf8'),/新姓名/);
  assert.equal(call(x.root,'revision','recover',{...x.recovery,direction:'rollback'}).status,'rolled-back');
  assert.deepEqual(fs.readFileSync(path.join(x.root,'.writer/state.json')),x.before);for(const ref of consumed)assert.match(fs.readFileSync(path.join(x.root,ref),'utf8'),/原姓名/);
  assert.equal(call(x.root,'revision','recover',{...x.recovery,direction:'rollback'}).unchanged,true);
});
test('自校验清单不能授权非消费同目录文件、保留区、未准备的受管文件或重复目标',t=>{
  const x=interrupt(ready(t)),original=fs.readFileSync(x.txFile),before=fs.readFileSync(path.join(x.root,'.writer/state.json')),index=x.tx.plan.findIndex(row=>row.file===consumed[0]);assert.ok(index>=0);
  for(const target of ['人物/未消费.md','研究/未计划.md','.writer/tool/package.json','duplicate','duplicate-case']){
    const tx=JSON.parse(original);if(target.startsWith('duplicate')){const row=target==='duplicate'?tx.plan[index]:tx.plan.find(row=>row.file.startsWith('.writer/journal/'));const duplicate={...row};if(target==='duplicate-case')duplicate.file=duplicate.file.slice(0,duplicate.file.lastIndexOf('/')+1)+path.basename(duplicate.file).toUpperCase();tx.plan.splice(tx.plan.length-1,0,duplicate);}else tx.plan[index].file=target;
    tx.plan_sha256=sha(JSON.stringify(tx.plan));fs.writeFileSync(x.txFile,JSON.stringify(tx,null,2)+'\n');
    assert.throws(()=>call(x.root,'revision','recover',x.recovery),error=>error.code==='TRANSACTION_CORRUPT',target);
    assert.deepEqual(fs.readFileSync(path.join(x.root,'.writer/state.json')),before);assert.equal(JSON.parse(fs.readFileSync(x.txFile)).status,'prepared');
  }
});
