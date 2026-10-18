import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {call,read,write,dir,work,state,sha} from './helpers.mjs';
const s=read(path.join(dir,'session-access.json')), before=read(path.join(work,'.writer/revisions',s.id,'base-state.json')), branch=state(s.workspace);
for(let i=0;i<5;i++){assert.deepEqual(branch.units[i],before.units[i]);assert.equal(sha(fs.readFileSync(path.join(work,before.units[i].draft))),before.units[i].sha256);}
const noEvidence=v=>Array.isArray(v)?v.map(noEvidence):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).filter(([k])=>k!=='evidence').map(([k,x])=>[k,noEvidence(x)])):v;
assert.deepEqual(noEvidence(before.snapshot),noEvidence(branch.snapshot));
const report='审查/native-three-6最终尾段连读.md';
write(path.join(s.workspace,report),'# 第6章最终完整尾段连读\n\n2026-10-18，第三独立原生Codex知情模型自检。完成v2重登后，再从首行到第44行完整实读候选第6章，尾段范围6–6，另已完整读当前1–6及第5章承接。\n\n唯一改字为免得句中又→再，是同一个预防再次卡住的意图，不增加事件。签单、钥匙实际递接、两人搬箱、周梅钥匙圈位置、旧伞承认、周梅没全忘、缠柄、吃面及有条件看摊均原样。第5章钥匙暂存和本章交接顺序一致。没有第7章及新知识，原未决不收束。\n\n候选1–5完整登记对象逐字段相等，正文逐字节相同；第6章summary/changes保持原事实，本章9条引文文字和行号不变，只绑定新全文SHA。原journal使用patch结构，详见v2核读报告，不把changes与patch当同形对象。\n\n真人语言别扭句：真人语言硬问题：没有。四项核读未发现新增硬问题；第1章原句与3/5/6作者取舍保留。控制变化不是文学优化。此review仅证明本次模型声明已完整读尾段，不是文学定稿、真人盲读或产品验收。\n');
const r=call('native-three-28-tail-review',['review','--revision-token',s.token],{project:s.workspace,input:{from:6,to:6,kind:'model-self-review',report,source_hashes:{[branch.units[5].draft]:branch.units[5].sha256}}});
write(path.join(dir,'tail-review-result.json'),r);
const base=read(path.join(work,'.writer/revisions',s.id,'base.json'));
write(path.join(dir,'precommit-main-state.json'),fs.readFileSync(path.join(work,'.writer/state.json'),'utf8'));
assert.deepEqual(state(),before);
write(path.join(dir,'precommit-verification.json'),{main_revision:state().revision,branch_revision:branch.revision,main_state_matches_begin_base:true,main_bodies_unchanged:before.units.map(u=>({unit:u.unit,sha256:sha(fs.readFileSync(path.join(work,u.draft))),expected:u.sha256})),prefix_objects_equal:true,fact_content_without_evidence_equal:true,base});
const p=call('native-three-29-prepare',['revision','prepare'],{input:{id:s.id,token:s.token}});write(path.join(dir,'prepare-result.json'),p);
console.log(JSON.stringify(p,null,2));
