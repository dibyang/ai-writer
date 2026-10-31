import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import test from 'node:test';
import {spawnSync} from 'node:child_process';
import {main} from '../lib/workspace.mjs';
import {fixture,ROOT,file,state,sha,call,evidence,workflow,begin} from './protection-fixture.mjs';

test('无正文副本更新支持较大治理与历史修订，超出固定上限时保留原状态',t=>{
  const {root}=fixture(t,1);workflow(root,true);
  for(let i=0;i<2;i++){const b=begin(root);call(root,'revision','abort',{id:b.id,token:b.token,reason:'合成历史修订会话'});}
  const author_evidence=evidence(root);
  function decision(id,text){return call(root,'decision','set',{expected_revision:state(root).revision,operation_id:`budget-${id}`,author_evidence,decision:{id,topic:`合成决策 ${id}`,status:'confirmed',options:[],adopted_items:[text],excluded_items:[],unresolved_items:[],effective_range:{from:1,to:null}}});}
  for(let i=0;i<12;i++)decision(`D${i}`,`合成授权事项${i}：`+'a'.repeat(4200));
  let originalError;try{main(['context','--project',root,'--purpose','discussion']);}catch(e){originalError=e;}
  assert.equal(originalError?.code,'CONTEXT_BUDGET_EXCEEDED');assert.ok(originalError.context_budget.required_chars>50000);assert.ok(originalError.context_budget.required_chars<240000);
  assert.equal(main(['context','--project',root,'--purpose','discussion','--max-chars','240000']).ok,true);
  const body=fs.readFileSync(path.join(root,'正文/0001.md')),before=state(root),plan=call(root,'tool','update-plan',{source:ROOT,validation_mode:'in-place-readonly'});
  assert.equal(plan.validation_context_max_chars,240000);assert.equal(plan.can_update,true);assert.ok(plan.plan_sha256);
  assert.throws(()=>call(root,'tool','update',{...plan.request,plan_sha256:'0'.repeat(64),author_evidence}),e=>e.code==='TOOL_PLAN_CHANGED');assert.deepEqual(state(root),before);
  const input=file(root,'.writer/budget-update.json',{...plan.request,author_evidence});
  const r=spawnSync(process.execPath,[path.join(ROOT,'bin/ai-writer.mjs'),'tool','update','--project',root,'--input',input],{encoding:'utf8',windowsHide:true,env:{...process.env,AI_WRITER_TEST_FAULT:'1',AI_WRITER_TEST_TOOL_STOP_PHASE:'prepared'}});assert.equal(r.status,97,r.stderr);
  const tx=call(root,'tool','updates').transactions.find(x=>x.status==='prepared');assert.deepEqual(fs.readdirSync(path.join(root,'.writer/tool-updates',tx.id,'validation/正文')),[]);
  const recovery=call(root,'tool','recover',{transaction_id:tx.id,direction:'complete',lock_sha256:sha(fs.readFileSync(path.join(root,'.writer/write.lock'))),author_evidence});assert.equal(recovery.status,'completed');assert.deepEqual(fs.readFileSync(path.join(root,'正文/0001.md')),body);assert.deepEqual(state(root).units,before.units);
  const next=call(root,'tool','update-plan',{source:ROOT,validation_mode:'in-place-readonly'});assert.equal(call(root,'tool','update',{...next.request,author_evidence}).status,'completed');
  decision('OVER','z'.repeat(260000));const over=state(root),refusedPlan=call(root,'tool','update-plan',{source:ROOT,validation_mode:'in-place-readonly'});let caught;
  try{call(root,'tool','update',{...refusedPlan.request,author_evidence});}catch(e){caught=e;}
  assert.equal(caught?.code,'TOOL_VALIDATION_FAILED');const context=caught.checks.find(x=>x.args[0]==='context');assert.ok(context);const error=JSON.parse(context.stderr);assert.equal(error.code,'CONTEXT_BUDGET_EXCEEDED');assert.equal(error.context_budget.limit_chars,240000);assert.ok(error.context_budget.required_chars>240000);assert.deepEqual(state(root),over);assert.deepEqual(fs.readFileSync(path.join(root,'正文/0001.md')),body);
});
