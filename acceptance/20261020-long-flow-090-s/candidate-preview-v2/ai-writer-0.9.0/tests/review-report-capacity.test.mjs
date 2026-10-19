import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fixture,state,file,workflow,call,begin,rewindBranch,sha} from './protection-fixture.mjs';
import {main} from '../lib/workspace.mjs';
const LIMIT=1024*1024;
const LONG='# 合成容量边界测试\n\n只测试报告字节、冻结和状态保护，不代表模型实读或文学判断。\n'+ '合成报告容量条目，不作为文学结论。\n'.repeat(1600);
let seq=0;
const raw=root=>fs.readFileSync(path.join(root,'.writer/state.json'));
function input(root,report,structured=true){
 const s=state(root),value={from:1,to:s.units.length,kind:'model-self-review',report,source_hashes:Object.fromEntries(s.units.map(u=>[u.draft,u.sha256]))};
 if(!structured)return value;
 return {...value,expected_revision:s.revision,operation_id:`report-capacity-${++seq}`,chapter_functions:s.units.map(u=>({unit:u.unit,...Object.fromEntries(['goal','obstacle','choice','consequence','relationship_change'].map(k=>[k,{status:'unknown',reason:'合成接口数据，不声明已作文学判断'}]))})),comparison:{similar_structures:[],distinct_gains:[],preserve:[],optional_adjustments:[],limits:'仅测试容量与绑定，非文学验收'},issues:[]};
}
test('结构化长篇报告超过20k仍完整冻结，报告变化仍使审查失效',t=>{
 const {root}=fixture(t,2),report='审查/完整长报告.md';assert.ok(LONG.length>20000&&Buffer.byteLength(LONG)<LIMIT);file(root,report,LONG);
 const before=state(root).revision,saved=call(root,'review',null,input(root,report)),record=JSON.parse(fs.readFileSync(path.join(root,saved.ref)));
 assert.equal(state(root).revision,before+1);assert.equal(record.report_sha256,sha(Buffer.from(LONG)));assert.deepEqual(fs.readFileSync(path.join(root,record.frozen_report)),Buffer.from(LONG));assert.equal(record.chapter_functions.length,2);
 file(root,report,LONG+'\n改动报告\n');assert.ok(call(root,'check').rolling_review.stale>=1);assert.deepEqual(fs.readFileSync(path.join(root,record.frozen_report)),Buffer.from(LONG));
});
test('兼容审查入口支持同一长报告且保持原有不推进业务revision行为',t=>{
 const {root}=fixture(t,2),report='审查/兼容长报告.md';file(root,report,LONG);const before=raw(root),saved=call(root,'review',null,input(root,report,false)),record=JSON.parse(fs.readFileSync(path.join(root,saved.ref)));
 assert.deepEqual(raw(root),before);assert.equal(record.report_sha256,sha(Buffer.from(LONG)));assert.deepEqual(saved.coverage,[1,2]);
});
test('报告严格按UTF8一MiB边界、非空保护，普通比较字段仍保持20k',t=>{
 const {root}=fixture(t,1),report='审查/边界报告.md',exact='核'.repeat(Math.floor(LIMIT/3))+'X';assert.equal(Buffer.byteLength(exact),LIMIT);file(root,report,exact);const saved=call(root,'review',null,input(root,report)),record=JSON.parse(fs.readFileSync(path.join(root,saved.ref)));assert.equal(fs.statSync(path.join(root,record.frozen_report)).size,LIMIT);
 const before=raw(root),objects=fs.readdirSync(path.join(root,'.writer/objects')).sort();
 for(const [body,expected] of [[exact+'X',/超过 1 MiB/],[' \n\t',/审查报告.*非空/]]){file(root,report,body);assert.throws(()=>call(root,'review',null,input(root,report)),expected);assert.deepEqual(raw(root),before);assert.deepEqual(fs.readdirSync(path.join(root,'.writer/objects')).sort(),objects);}
 file(root,report,LONG);const ordinary=input(root,report);ordinary.comparison.limits='a'.repeat(20001);assert.throws(()=>call(root,'review',null,ordinary),/comparison.limits.*20000/);assert.deepEqual(raw(root),before);
});
test('历史重登大报告完整冻结、预览只读，超文件上限仍在写入前拒绝',t=>{
 const {root}=fixture(t,2),original=state(root).snapshot;workflow(root,true);const branch=begin(root);rewindBranch(branch);
 for(let n=1;n<=2;n++){
   const value=main(['revision','replay-input','--project',branch.workspace,'--unit',String(n),'--revision-token',branch.token]),report=`审查/长重登${n}.md`;file(branch.workspace,report,LONG);value.replay_review={reviewer:'synthetic-capacity-test',report,draft_sha256:value._replay.draft_sha256,checked_fields:['summary','characters','timeline','ledger','evidence','downstream']};
   const before=raw(branch.workspace);
   if(n===1){file(branch.workspace,report,'核'.repeat(Math.floor(LIMIT/3))+'XX');const rejected=call(branch.workspace,'record-preview',null,value,branch.token);assert.equal(rejected.ok,false);assert.ok(rejected.findings.some(f=>f.message.includes('超过 1 MiB')));assert.deepEqual(raw(branch.workspace),before);file(branch.workspace,report,LONG);}
   assert.equal(call(branch.workspace,'record-preview',null,value,branch.token).ok,true);assert.deepEqual(raw(branch.workspace),before);call(branch.workspace,'record',null,value,branch.token);const stored=state(branch.workspace).units.at(-1).replay_review;assert.deepEqual(fs.readFileSync(path.join(branch.workspace,stored.frozen_ref)),Buffer.from(LONG));
 }
 assert.deepEqual(state(branch.workspace).snapshot,original);
});
