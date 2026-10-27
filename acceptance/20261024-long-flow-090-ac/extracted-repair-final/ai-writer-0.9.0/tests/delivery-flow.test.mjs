import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {main,assemble,record,recordPreview} from '../lib/workspace.mjs';
import {fixture,file,state,sha,workflow,begin,evidence,ROOT} from './protection-fixture.mjs';

function parts(root){
  file(root,'分段/第一章 空格/01.md','# 第一章\r\n\r\n阿禾推开门。\r\n');
  file(root,'分段/第一章 空格/02.md','林衡把铜片放在桌上。\n');
  return {unit:1,expected_revision:state(root).revision,draft:'正文/0001 中文.md',parts:['分段/第一章 空格/01.md','分段/第一章 空格/02.md'].map(ref=>({path:ref,sha256:sha(fs.readFileSync(path.join(root,ref)))})),separator:'\n\n'};
}
const snapshot=root=>({state:fs.readFileSync(path.join(root,'.writer/state.json')),journal:fs.existsSync(path.join(root,'.writer/journal'))?fs.readdirSync(path.join(root,'.writer/journal')).sort():[],objects:fs.existsSync(path.join(root,'.writer/objects'))?fs.readdirSync(path.join(root,'.writer/objects')).sort():[]});
function input(root){
  main(['plan','--project',root,'--input',file(root,'.writer/plan-u.json',{unit:1,title:'铜片',goal:'交接',change:'铜片移交',beats:['交接'],cast:[],setting_refs:[],research_refs:[]})]);
  const v=main(['record-template','--project',root,'--unit','1','--draft','正文/0001.md']);
  file(root,v.draft,'# 铜片\n\n林衡把铜片交给阿禾。\n');v.summary='林衡把铜片交给阿禾';
  file(root,'审查/完整章.md','# 合成绑定测试\n只验证报告保存及哈希，不声明实际审稿。\n');
  v.draft_review={reviewer:'synthetic-test',report:'审查/完整章.md',draft_sha256:sha(fs.readFileSync(path.join(root,v.draft))),report_sha256:sha(fs.readFileSync(path.join(root,'审查/完整章.md')))};
  return v;
}

test('合章保持有序原字节、只创建新稿，不登记或改变状态',t=>{
  const {root}=fixture(t,0),v=parts(root),before=snapshot(root),expected=Buffer.concat([fs.readFileSync(path.join(root,v.parts[0].path)),Buffer.from(v.separator),fs.readFileSync(path.join(root,v.parts[1].path))]);
  const r=assemble(root,v);assert.equal(r.registered,false);assert.equal(r.state_changed,false);assert.equal(r.sha256,sha(expected));assert.deepEqual(fs.readFileSync(path.join(root,v.draft)),expected);assert.deepEqual(snapshot(root),before);
  assert.throws(()=>assemble(root,v),/不覆盖/);assert.deepEqual(fs.readFileSync(path.join(root,v.draft)),expected);
});
test('合章所有输入先预检，缺段、空段、错哈希、重复、越界和旧revision不留下目标',t=>{
  const {root}=fixture(t,0),v=parts(root),before=snapshot(root);
  for(const change of [x=>x.parts[1].path='分段/不存在.md',x=>x.parts[1].sha256='0'.repeat(64),x=>x.parts[1]=x.parts[0],x=>x.parts[1].path='分段/../正文/0001.md',x=>x.parts[1].path='正文/0001.md',x=>x.expected_revision--,x=>x.unit=2,x=>x.separator='误加剧情',x=>x.parts[1].extra=true]){
    const bad=structuredClone(v);change(bad);assert.throws(()=>assemble(root,bad));assert.equal(fs.existsSync(path.join(root,v.draft)),false);assert.deepEqual(snapshot(root),before);
  }
  file(root,v.parts[1].path,'  \n');assert.throws(()=>assemble(root,v),/为空/);assert.equal(fs.existsSync(path.join(root,v.draft)),false);
  fs.writeFileSync(path.join(root,v.parts[1].path),Buffer.from([0xff,0xfe,0]));assert.throws(()=>assemble(root,v),/UTF-8/);assert.equal(fs.existsSync(path.join(root,v.draft)),false);
});
test('合章遵守阶段授权和活跃修订占用，不旁路父稿',t=>{
  const {root}=fixture(t,0),v=parts(root),w=main(['workflow','show','--project',root]).workflow;
  w.stage='paused';w.authorization={allowed_actions:['discuss'],draft_range:null,revise_range:null,stop_conditions:['暂停']};
  const auth=evidence(root);
  main(['workflow','set','--project',root,'--input',file(root,'.writer/pause-u.json',{expected_revision:state(root).revision,operation_id:'pause-u',author_evidence:auth,workflow:w})]);
  assert.throws(()=>assemble(root,{...v,expected_revision:state(root).revision}),e=>e.code==='ACTION_OUT_OF_SCOPE');assert.equal(fs.existsSync(path.join(root,v.draft)),false);
  workflow(root);const i=input(root);record(root,i);workflow(root,true);begin(root);
  const next={...v,unit:2,expected_revision:state(root).revision,draft:'正文/0002.md'};
  assert.throws(()=>assemble(root,next),e=>e.code==='REVISION_OCCUPIED');assert.equal(fs.existsSync(path.join(root,next.draft)),false);
});
test('合章拒绝符号链接分段和目标目录', {skip:process.platform==='win32'?'Windows测试账户未承诺symlink权限，Linux/macOS CI执行':false},t=>{
  const {root}=fixture(t,0),v=parts(root);fs.symlinkSync(path.join(root,v.parts[0].path),path.join(root,'分段/link.md'));
  assert.throws(()=>assemble(root,{...v,parts:[v.parts[0],{path:'分段/link.md',sha256:v.parts[0].sha256}]}),/符号链接/);
  fs.mkdirSync(path.join(root,'候选'));fs.symlinkSync(path.join(root,'候选'),path.join(root,'正文/link'));
  assert.throws(()=>assemble(root,{...v,draft:'正文/link/0001.md'}),/符号链接/);assert.equal(fs.readdirSync(path.join(root,'候选')).length,0);
});
test('报告缺失、为空、错稿或已变先于状态和对象写入拒绝；正确绑定冻结且幂等',t=>{
  const {root}=fixture(t,0),v=input(root),before=snapshot(root);
  for(const change of [x=>x.draft_review.report='审查/missing.md',x=>x.draft_review.draft_sha256='0'.repeat(64),x=>x.draft_review.report_sha256='0'.repeat(64),x=>delete x.draft_review.reviewer,x=>x.draft_review.extra=true]){
    const bad=structuredClone(v);change(bad);const preview=recordPreview(root,bad);assert.equal(preview.ok,false);assert.equal(preview.findings[0].code,'DRAFT_REVIEW_INVALID');assert.throws(()=>record(root,bad),e=>e.code==='DRAFT_REVIEW_INVALID');assert.deepEqual(snapshot(root),before);
  }
  const bytes=fs.readFileSync(path.join(root,v.draft_review.report));file(root,v.draft_review.report,' \n');const empty=structuredClone(v);empty.draft_review.report_sha256=sha(Buffer.from(' \n'));assert.throws(()=>record(root,empty),e=>e.code==='DRAFT_REVIEW_INVALID');assert.deepEqual(snapshot(root),before);fs.writeFileSync(path.join(root,v.draft_review.report),bytes);
  assert.equal(recordPreview(root,v).ok,true);record(root,v);const row=state(root).units[0];assert.equal(sha(fs.readFileSync(path.join(root,row.draft_review.frozen_ref))),v.draft_review.report_sha256);assert.equal(record(root,v).unchanged,true);
});
test('preview退出1、record退出2，保留同一明确字段和允许状态；原文件不变',t=>{
  const {root}=fixture(t,0),v=input(root);v.changes.ledger={T:{type:'thread',statement:'铜片交接',status:'open',evidence:[{unit:1,quote:'林衡把铜片交给阿禾。'}]}};
  const f=file(root,'.writer/bad-u.json',v),before=snapshot(root);
  for(const [cmd,exit,stream] of [['record-preview',1,'stdout'],['record',2,'stderr']]){
    const r=spawnSync(process.execPath,[path.join(ROOT,'bin/ai-writer.mjs'),cmd,'--project',root,'--input',f],{encoding:'utf8'});assert.equal(r.status,exit,r.stderr);const out=JSON.parse(r[stream]),error=cmd==='record-preview'?out.findings[0]:out;assert.equal(error.code,'LEDGER_VALUE_INVALID');assert.equal(error.field,'changes.ledger.T.status');assert.ok(error.allowed_values.includes('active'));assert.deepEqual(snapshot(root),before);
  }
  v.changes.ledger.T.status='active';v.changes.ledger.T.type='clue';const p=recordPreview(root,v);assert.equal(p.findings[0].field,'changes.ledger.T.type');assert.ok(p.findings[0].allowed_values.includes('thread'));
});

test('登记后冻结报告损坏必须被只读诊断拒绝，原业务状态不变',t=>{
  const {root}=fixture(t,0),v=input(root);record(root,v);const before=fs.readFileSync(path.join(root,'.writer/state.json')),r=state(root).units[0].draft_review;
  file(root,r.frozen_ref,'篡改冻结报告');assert.throws(()=>main(['check','--project',root]),e=>e.code==='DRAFT_REVIEW_CORRUPT');assert.deepEqual(fs.readFileSync(path.join(root,'.writer/state.json')),before);
});
test('报告在验证与冻结之间发生锁外变化时，写入前拒绝，不冻结错误字节',t=>{
  const {root}=fixture(t,0),v=input(root),before=snapshot(root),report=path.join(root,v.draft_review.report),read=fs.readFileSync;let count=0;
  fs.readFileSync=function(f,...args){if(String(f)===report&&++count===3)return Buffer.from('锁外变化后的不同报告');return read.call(fs,f,...args);};
  try{assert.throws(()=>record(root,v),e=>e.code==='DRAFT_REVIEW_INVALID');}finally{fs.readFileSync=read;}
  assert.deepEqual(snapshot(root),before);
});
