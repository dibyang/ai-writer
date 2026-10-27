import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import test from 'node:test';
import {spawnSync} from 'node:child_process';
import {main} from '../lib/workspace.mjs';
import {fixture,ROOT,file,state,sha,call,workflow,evidence,begin,rewindBranch,unit,review,prepare} from './protection-fixture.mjs';
function inventory(root){const rows={};function walk(dir,ref=''){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=ref?ref+'/'+e.name:e.name;if(e.isDirectory())walk(path.join(dir,e.name),p);else rows[p]=sha(fs.readFileSync(path.join(dir,e.name)));}}walk(root);return rows;}
function task(root){const before=inventory(root);const value=main(['status','--project',root,'--view','task']);assert.equal(value.read_only,true);assert.deepEqual(inventory(root),before);return value;}
test('任务视图只读恢复候选正文，暂停不转成续写授权，规划与正文范围分开',t=>{
  const {root}=fixture(t,0);assert.equal(task(root).next.code,'prepare-plan');
  call(root,'plan',null,{unit:1,title:'开篇',goal:'核对',change:'有所发现',beats:['见面']});
  file(root,'正文/0001-分段草稿.md','# 未完成草稿\n\n保留原稿。\n');
  let v=task(root);assert.equal(v.next.code,'inspect-existing-draft');assert.equal(v.drafts.candidates.length,1);assert.deepEqual(task(root),v);
  assert.ok(main(['status','--project',root]).task_view_command.includes('--view'));
  const w=call(root,'workflow','show').workflow;w.stage='paused';w.task='暂停正文讨论';w.authorization={allowed_actions:['discuss'],draft_range:null,revise_range:null,stop_conditions:['作者决定前不写']};
  call(root,'workflow','set',{expected_revision:state(root).revision,operation_id:'pause-task',workflow:w,author_evidence:evidence(root)});
  assert.equal(task(root).next.code,'confirm-scope');assert.throws(()=>main(['context','--project',root,'--unit','1']),e=>e.code==='ACTION_OUT_OF_SCOPE');
  const frozen=inventory(root);assert.throws(()=>main(['status','--project',root,'--view','unknown']));assert.deepEqual(inventory(root),frozen);
});
test('只规划阶段指导真实计划，不要求提前开放正文',t=>{
  const {root}=fixture(t,0);const w=call(root,'workflow','show').workflow;w.stage='outline';w.authorization={allowed_actions:['discuss','plan'],draft_range:null,revise_range:null,stop_conditions:['先讨论规划']};
  call(root,'workflow','set',{expected_revision:state(root).revision,operation_id:'plan-task',workflow:w,author_evidence:evidence(root)});
  assert.equal(task(root).next.code,'plan-only');assert.throws(()=>main(['context','--project',root,'--unit','1']),e=>e.code==='ACTION_OUT_OF_SCOPE');
});
test('任务视图覆盖修订恢复、旧输入拒绝、真实提交中断和已结束候选',t=>{
  const {root}=fixture(t,2);workflow(root,true);assert.equal(task(root).next.code,'begin-revision');
  const narrow=call(root,'workflow','show').workflow;narrow.authorization.revise_range.to=1;
  call(root,'workflow','set',{expected_revision:state(root).revision,operation_id:'narrow-tail',workflow:narrow,author_evidence:evidence(root)});
  assert.equal(task(root).next.code,'confirm-revision-tail');workflow(root,true);
  const b=begin(root);assert.equal(task(root).next.code,'inspect-candidate');const initial=task(b.workspace);assert.equal(initial.next.code,'start-revision');assert.equal(initial.next.defaults.from,1);assert.ok(!JSON.stringify(initial).includes(b.token));
  rewindBranch(b);const resumed=task(b.workspace);assert.equal(resumed.next.code,'resume-replay');assert.ok(resumed.input_template_requires.some(x=>x.includes('--revision-token')));assert.ok(resumed.input_template_requires.some(x=>x.includes('replay_review')));
  const old=main(['record-template','--project',b.workspace,'--unit','1','--draft','正文/0001.md']);old.summary='旧输入不能重放';
  unit(b.workspace,1,b.token,'修订');const input=file(b.workspace,'.writer/stale-task-input.json',old),before=inventory(b.workspace);
  assert.throws(()=>main(['record','--project',b.workspace,'--input',input,'--revision-token',b.token]));assert.deepEqual(inventory(b.workspace),before);assert.equal(task(b.workspace).next.defaults.unit,2);
  unit(b.workspace,2,b.token,'修订');assert.equal(task(b.workspace).next.code,'review-revision');review(b);prepare(root,b);
  const request=file(root,'.writer/task-commit.json',{id:b.id,token:b.token});
  const r=spawnSync(process.execPath,[path.join(ROOT,'bin/ai-writer.mjs'),'revision','commit','--project',root,'--input',request],{encoding:'utf8',windowsHide:true,env:{...process.env,AI_WRITER_TEST_FAULT:'1',AI_WRITER_TEST_STOP_AFTER:'1'}});assert.equal(r.status,91,r.stderr);
  assert.throws(()=>main(['status','--project',root]),e=>e.code==='TRANSACTION_PENDING');
  const recovery=task(root);assert.equal(recovery.recovery_only,true);assert.equal(recovery.next.code,'recover-transaction');assert.equal(recovery.blockers[0].transactions.length,1);
  const tx=call(root,'revision','list').transactions.find(x=>x.status==='applying');
  call(root,'revision','recover',{transaction_id:tx.id,token:b.token,direction:'complete',lock_sha256:sha(fs.readFileSync(path.join(root,'.writer/write.lock'))),author_evidence:evidence(root)});
  assert.equal(task(b.workspace).next.code,'closed-candidate');assert.equal(main(['check','--project',root]).ok,true);
});
test('工具更新中断仅显示恢复指引，不读取或修改普通业务状态',t=>{
  const {root}=fixture(t,0),p=call(root,'tool','update-plan',{source:ROOT});
  const input=file(root,'.writer/task-update.json',{...p.request,author_evidence:evidence(root)});
  const r=spawnSync(process.execPath,[path.join(ROOT,'bin/ai-writer.mjs'),'tool','update','--project',root,'--input',input],{encoding:'utf8',windowsHide:true,env:{...process.env,AI_WRITER_TEST_FAULT:'1',AI_WRITER_TEST_TOOL_STOP_PHASE:'prepared'}});assert.equal(r.status,97,r.stderr);
  const v=task(root);assert.equal(v.recovery_only,true);assert.equal(v.can_write,false);assert.equal(v.blockers[0].code,'TOOL_UPDATE_PENDING');
  assert.throws(()=>main(['status','--project',root]),e=>e.code==='TOOL_UPDATE_PENDING');
  const tx=call(root,'tool','updates').transactions.find(x=>x.status==='prepared');
  call(root,'tool','recover',{transaction_id:tx.id,direction:'rollback',lock_sha256:sha(fs.readFileSync(path.join(root,'.writer/write.lock'))),author_evidence:evidence(root)});
  assert.equal(task(root).recovery_only,undefined);
});
