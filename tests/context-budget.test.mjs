import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {ROOT,initProject,savePlan,context,recordTemplate,recordPreview,record,check} from '../lib/workspace.mjs';
function fixture(t,legacy=true){
  const tmp=path.join(ROOT,'.tmp');fs.mkdirSync(tmp,{recursive:true});const base=fs.mkdtempSync(path.join(tmp,'budget-')),root=path.join(base,'中文 空格作品');
  t.after(async()=>{assert.ok(fs.realpathSync(base).startsWith(fs.realpathSync(tmp)+path.sep));await fs.promises.rm(base,{recursive:true,force:true,maxRetries:12,retryDelay:150});});
  initProject(root,'novel','预算验证',{legacy});return root;
}
test('上下文超限给出精确总量与大项，边界重试完整保留来源和禁揭内容',t=>{
  const root=fixture(t),style=path.join(root,'设定/文风.md');fs.writeFileSync(style,'特定文风😀\n'.repeat(400));
  savePlan(root,{unit:1,title:'交接',goal:'找到收据',change:'确认保管人',beats:['询问保管人'],forbidden:['不揭幕后原因']});
  const before=fs.readFileSync(path.join(root,'.writer/state.json')),full=context(root,1,100000),required=JSON.stringify(full).length;
  assert.throws(()=>context(root,1,1000),e=>{assert.equal(e.code,'CONTEXT_BUDGET_EXCEEDED');assert.equal(e.context_budget.required_chars,required);assert.equal(e.context_budget.over_by_chars,required-1000);assert.equal(e.context_budget.sections[0].section,'settings');assert.equal(e.context_budget.largest_sources[0].ref,'设定/文风.md');assert.ok(!JSON.stringify(e.context_budget).includes('特定文风'));return true;});
  assert.deepEqual(context(root,1,required),full);assert.equal(full.settings.find(x=>x.ref==='设定/文风.md').text,fs.readFileSync(style,'utf8'));assert.deepEqual(full.plan.forbidden,['不揭幕后原因']);assert.deepEqual(fs.readFileSync(path.join(root,'.writer/state.json')),before);
});
test('CLI超限不生成out，不改变状态，恢复提示保留保护边界',t=>{
  const root=fixture(t);savePlan(root,{unit:1,title:'留信',goal:'等人',change:'留下一封信',beats:['留信']});
  const before=fs.readFileSync(path.join(root,'.writer/state.json')),out='.writer/drafts/blocked-context.json';
  const r=spawnSync(process.execPath,[path.join(ROOT,'bin/ai-writer.mjs'),'context','--project',root,'--unit','1','--max-chars','1000','--out',out],{encoding:'utf8'});
  assert.equal(r.status,2);const e=JSON.parse(r.stderr);assert.equal(e.code,'CONTEXT_BUDGET_EXCEEDED');assert.ok(e.context_budget.required_chars>1000);assert.match(e.next_action,/影响分析/);assert.equal(fs.existsSync(path.join(root,out)),false);assert.deepEqual(fs.readFileSync(path.join(root,'.writer/state.json')),before);
});
test('讨论上下文同样报告预算，低预算不会绕过未授权正文门禁',t=>{
  const root=fixture(t,false),full=context(root,undefined,100000,'discussion');assert.ok(JSON.stringify(full).length>1000);
  assert.throws(()=>context(root,undefined,1000,'discussion'),e=>e.code==='CONTEXT_BUDGET_EXCEEDED'&&e.context_budget.required_chars===JSON.stringify(full).length);
  let original;try{context(root,1,100000);}catch(e){original=e.code;}
  assert.ok(original&&original!=='CONTEXT_BUDGET_EXCEEDED');assert.throws(()=>context(root,1,1000),e=>e.code===original);
});
test('大量研究引用超限时明细有界，遗漏数可追溯且不输出来源正文',t=>{
  const root=fixture(t),refs=[];for(let i=0;i<14;i++){const ref=`研究/资料-${i}.md`;fs.writeFileSync(path.join(root,ref),'只用于预算的来源正文。'.repeat(30));refs.push(ref);}
  savePlan(root,{unit:1,title:'查阅',goal:'核实',change:'确认来源',beats:['查阅记录'],research_refs:refs});
  assert.throws(()=>context(root,1,1000),e=>{assert.equal(e.code,'CONTEXT_BUDGET_EXCEEDED');assert.equal(e.context_budget.largest_sources.length,10);assert.equal(e.context_budget.omitted_source_count,7);assert.ok(!JSON.stringify(e.context_budget).includes('只用于预算的来源正文'));return true;});
});

test('合法上下文扩容超过百万字符后仍可取模板及登记，来源漂移保护继续生效',t=>{
  const root=fixture(t);
  for(const name of ['作品定位','文风','权威规则'])fs.writeFileSync(path.join(root,'设定',name+'.md'),'# Synthetic size probe\n'+'x'.repeat(350000));
  savePlan(root,{unit:1,title:'归还',goal:'归还杯子',change:'杯子回到桌上',beats:['归还杯子']});
  assert.throws(()=>context(root,1),e=>e.code==='CONTEXT_BUDGET_EXCEEDED');
  const full=context(root,1,2000000);assert.ok(JSON.stringify(full).length>1000000);
  const input=recordTemplate(root,1,'正文/0001.md');assert.deepEqual(input.source_hashes,full.source_hashes);
  fs.writeFileSync(path.join(root,input.draft),'# 归还\n\n林照把杯子放回桌上。\n');input.summary='林照把杯子放回桌上。';
  const before=fs.readFileSync(path.join(root,'.writer/state.json'));
  assert.throws(()=>record(root,{...input,source_hashes:{...input.source_hashes,'设定/文风.md':'0'.repeat(64)}}),/上下文来源已变化/);
  assert.deepEqual(fs.readFileSync(path.join(root,'.writer/state.json')),before);
  assert.equal(recordPreview(root,input).ok,true);assert.equal(record(root,input).ok,true);assert.equal(check(root).ok,true);
});
