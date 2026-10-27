import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),repo=path.resolve(base,'../..'),prefix=process.argv[3]??'copyfree',source=path.resolve(process.argv[2]??path.join(repo,'.tmp/relocation-ai5/ai-writer-0.10.0')),old=path.join(repo,'.tmp/release090-01df-final/ai-writer-0.9.0'),results=[];
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
for(const [kind,direction,env,exit]of [['partial','complete',{AI_WRITER_TEST_TOOL_STOP_AFTER:'1'},95],['validated','rollback',{AI_WRITER_TEST_TOOL_STOP_PHASE:'validated'},96],['validated','complete',{AI_WRITER_TEST_TOOL_STOP_PHASE:'validated'},96]]){
  const label=`${prefix}-${kind}-${direction}`,root=path.join(base,'scenario',label);let seq=0,cli=path.join(old,'bin/ai-writer.mjs');const state=()=>JSON.parse(fs.readFileSync(path.join(root,'.writer/state.json')));
  function write(f,v){fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,typeof v==='string'?v:JSON.stringify(v,null,2)+'\n',{flag:'wx'});return f;}
  function run(name,args,expected=0,fault={}){const id=`${label}-${String(++seq).padStart(3,'0')}-${name}`,r=spawnSync(process.execPath,[path.join(base,'capture.mjs'),id,process.execPath,cli,...args],{encoding:'utf8',windowsHide:true,env:{...process.env,...fault}});assert.equal(r.status,expected,r.stderr||r.stdout);return expected===0?JSON.parse(fs.readFileSync(path.join(base,'commands',id,'stdout.raw.txt'),'utf8')):null;}
  function call(name,cmd,action,input,extra=[],expected=0,fault={}){const args=[cmd,...(action?[action]:[]),'--project',root];if(input)args.push('--input',write(path.join(base,'inputs',label+'-'+(seq+1)+'.json'),input));return run(name,[...args,...extra],expected,fault);}
  run('init',['init','--path',root,'--kind','novel','--title','合成原地更新恢复']);const quote='合成接口验证允许一章试写和原地工具更新、明确的中断恢复。';write(path.join(root,'研究/授权.md'),quote);const evidence={local_source:'研究/授权.md',source_sha256:sha(quote),quote,locator:'synthetic fixture',recorded_by:'Codex'};
  const w=call('workflow','workflow','show').workflow;w.stage='trial';w.task='仅合成验证';w.authorization={allowed_actions:['discuss','plan','draft'],draft_range:{from:1,to:1},revise_range:null,stop_conditions:['一章结束']};call('authorize','workflow','set',{expected_revision:state().revision,operation_id:label+'-auth',workflow:w,author_evidence:evidence});call('plan','plan',null,{unit:1,title:'登记',goal:'核对',change:'完成',beats:['核对']});const x=call('template','record-template',null,null,['--unit','1','--draft','正文/0001.md']);write(path.join(root,x.draft),'# 合成样本\n\n木匣留在柜上，阿禾记下编号。\n');x.summary='核对编号';call('record','record',null,x);
  const before=state(),body=fs.readFileSync(path.join(root,x.draft));cli=path.join(source,'bin/ai-writer.mjs');const p=call('update-plan','tool','update-plan',{source,validation_mode:'in-place-readonly'});call('update-fault','tool','update',{...p.request,author_evidence:evidence},[],exit,{AI_WRITER_TEST_FAULT:'1',...env});
  const tx=call('updates','tool','updates').transactions.find(t=>!['completed','rolled-back'].includes(t.status));assert.deepEqual(fs.readdirSync(path.join(root,'.writer/tool-updates',tx.id,'validation/正文')),[]);
  call('recover','tool','recover',{transaction_id:tx.id,direction,lock_sha256:sha(fs.readFileSync(path.join(root,'.writer/write.lock'))),author_evidence:evidence});assert.deepEqual(fs.readFileSync(path.join(root,x.draft)),body);assert.deepEqual(state().units,before.units);if(direction==='rollback')assert.deepEqual(state(),before);assert.equal(call('check','check').ok,true);assert.equal(call('doctor','doctor').ok,true);
  results.push({kind,direction,ok:true,body_unchanged:true,validation_body_files:0});
}
fs.writeFileSync(path.join(base,(prefix==='copyfree'?'copyfree-recovery':prefix)+'-verification.json'),JSON.stringify({ok:true,source,results},null,2)+'\n',{flag:'wx'});
