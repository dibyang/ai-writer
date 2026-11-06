import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { main, context, recordTemplate, materialView, initProject, recordPreview } from '../lib/workspace.mjs';
import { inventoryProject } from '../lib/project-backup.mjs';
import { createMaterialView } from '../lib/task-preparation.mjs';
import { fixture, ROOT, file, workflow, begin, rewindBranch } from './protection-fixture.mjs';

function plan(root) {
  const ref='研究/合成事实.json';file(root,ref,{status:'verified',claims:[{type:'direct',statement:'合成材料中的杯子已归还',boundary:'仅接口测试，无史实主张',source_dependency:'合成记录',sources:[{title:'合成记录',locator:'第1行',excerpt:'杯子已归还',checked_at:'2026-11-04'}]}]});
  main(['plan','--project',root,'--input',file(root,'研究/下一章.json',{unit:1,title:'归还',goal:'归还杯子',change:'杯子回到桌上',beats:['归还杯子'],research_refs:[ref],forbidden:['不揭幕后原因']})]);
}
function cli(root,args) { const r=spawnSync(process.execPath,[path.join(ROOT,'bin/ai-writer.mjs'),'task','materials','--project',root,...args],{encoding:'utf8',windowsHide:true,timeout:120000});return {...r,value:JSON.parse(r.stdout||r.stderr)}; }
for(const kind of ['novel','screenplay','history','essay']) test(`${kind}材料返回原生内容，来源和正文路径一致，完整文件清单不变`,t=>{
  const {root}=fixture(t,0,kind);plan(root);const before=inventoryProject(root);
  for(const guide of ['material-view.md','backup-boundary.md'])assert.equal(fs.existsSync(path.join(root,'.writer/tool/docs',guide)),true,'新指南必须随附工具携带');
  const r=cli(root,['--unit','1']);assert.equal(r.status,0,r.stderr);assert.equal(r.stderr,'');
  assert.equal(r.value.format,'ai-writer-material-view@1');assert.deepEqual(r.value.context,context(root,1));
  assert.deepEqual(r.value.record_input,recordTemplate(root,1));assert.match(r.value.basis.state_sha256,/^[a-f0-9]{64}$/);
  assert.deepEqual(inventoryProject(root),before);assert.ok(!JSON.stringify(r.value).includes('revision-token'));
});
test('未授权、预算、错误参数、out和现有写锁拒绝，输出不产生成功JSON',t=>{
  const {root,dir}=fixture(t,0);plan(root);
  for(const args of [['--unit','0'],['--unit','1','--mode','other'],['--unit','1','--out',path.join(dir,'out')],['--unit','1','--max-chars','1000'],['--unit','1','--unit','1']]){
    const before=inventoryProject(root),r=cli(root,args);assert.equal(r.status,2);assert.equal(r.stdout,'');assert.deepEqual(inventoryProject(root),before);
  }
  file(root,'.writer/write.lock','测试保留锁');const before=inventoryProject(root),busy=cli(root,['--unit','1']);assert.equal(busy.value.code,'MATERIAL_SOURCE_BUSY');assert.deepEqual(inventoryProject(root),before);
  const fresh=path.join(dir,'unauthorized');initProject(fresh,'novel','未授权');const denied=cli(fresh,['--unit','1']);assert.equal(denied.status,2);assert.equal(denied.stdout,'');
});
test('replay保留原令牌门禁，不输出令牌，主稿和修订区完整清单不变',t=>{
  const {root}=fixture(t,1);workflow(root,true);const b=begin(root);rewindBranch(b);
  const before=inventoryProject(root),branch=inventoryProject(b.workspace);
  for(const token of [undefined,'invalid']){const r=cli(b.workspace,['--unit','1','--mode','replay',...(token?['--revision-token',token]:[])]);assert.equal(r.status,2);assert.equal(r.stdout,'');}
  const r=cli(b.workspace,['--unit','1','--mode','replay','--revision-token',b.token]);assert.equal(r.status,0,r.stderr);assert.equal(r.value.mode,'replay');assert.ok(!JSON.stringify(r.value).includes(b.token));
  assert.deepEqual(inventoryProject(root),before);assert.deepEqual(inventoryProject(b.workspace),branch);
});
test('后续来源变化仍由原登记预览拒绝，不更新旧输入',t=>{
  const {root}=fixture(t,0);plan(root);const input=materialView(root,1).record_input;
  file(root,input.draft,'# 归还\n\n林照把杯子放回桌上。\n');input.summary='林照归还杯子。';fs.appendFileSync(path.join(root,'设定/文风.md'),'\n新的要求。');
  const r=recordPreview(root,input);assert.equal(r.ok,false);assert.match(JSON.stringify(r.findings),/上下文来源已变化/);
});
test('确定性组合反例拒绝基线、来源和revision不一致',()=>{
  const p={revision:1,source_hashes:{a:'1'}},i={expected_revision:1,source_hashes:{a:'1'}};
  for(const mismatch of ['basis','sources','revision']){
    let count=0;const view=createMaterialView({capture:()=>({basis:++count===2&&mismatch==='basis'?2:1}),context:()=>p,recordTemplate:()=>({...i,...(mismatch==='sources'?{source_hashes:{a:'2'}}:{}),...(mismatch==='revision'?{expected_revision:2}:{})})});
    assert.throws(()=>view('.',1),e=>e.code==='MATERIAL_VIEW_CHANGED');
  }
});
test('自动升级准备保持阻断，不生成备份或输出',t=>{
  const {root}=fixture(t,0),before=inventoryProject(root);
  assert.throws(()=>main(['tool','prepare-update','--project',root]),e=>e.code==='UPGRADE_PREPARATION_UNAVAILABLE');assert.deepEqual(inventoryProject(root),before);
});
test('真实组合路径不调用常用同步写接口或可写open',t=>{
  const {root}=fixture(t,0);plan(root);const before=inventoryProject(root);
  const names=['writeFileSync','appendFileSync','mkdirSync','renameSync','unlinkSync','rmSync','copyFileSync','truncateSync'],saved=Object.fromEntries(names.map(n=>[n,fs[n]])),open=fs.openSync;
  for(const n of names)fs[n]=()=>{throw new Error('unexpected write '+n);};
  fs.openSync=(p,flags,...args)=>{if(!(flags==='r'||(typeof flags==='number'&&!(flags&(fs.constants.O_WRONLY|fs.constants.O_RDWR|fs.constants.O_CREAT|fs.constants.O_TRUNC|fs.constants.O_APPEND)))))throw new Error('unexpected writable open');return open(p,flags,...args);};
  try{assert.equal(materialView(root,1).ok,true);}finally{Object.assign(fs,saved);fs.openSync=open;}
  assert.deepEqual(inventoryProject(root),before);
});
