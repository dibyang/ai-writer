import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const here=import.meta.dirname,root=path.resolve(here,'../..'),source=path.join(root,'.tmp/首发解压 验证-L/ai-writer-0.8.0'),entry=path.join(source,'bin/ai-writer.mjs');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const results=[];
for(const [label,oldSource,version,contentId] of [
  ['old080',path.join(root,'acceptance/20261019-webnovel-reference-j/sources/package-0.8.0-v2'),'0.8.0','3593faa0ea76085a63d788109f3ffbb1bbdf89565f7a012bde32cce437eaf40c'],
  ['old081',path.join(root,'acceptance/20261019-apache-license-k/source-0.8.1'),'0.8.1','efbdf6f4055979e21eb7a3339adf0b88f9c058d5d8137c09b122259f4ad94618']
]){
  const work=path.join(here,'work-'+label),args=['--project',work],stateBytes=()=>fs.readFileSync(path.join(work,'.writer/state.json')),state=()=>JSON.parse(stateBytes());let n=0;
  function run(name,tool,args,input,exit=0){
    if(input){const file=path.join(here,`${label}-${++n}-${name}.input.json`);fs.writeFileSync(file,JSON.stringify(input,null,2)+'\n',{flag:'wx'});args=[...args,'--input',file];}
    const r=spawnSync(process.execPath,[path.join(here,'capture.mjs'),label+'-'+name,process.execPath,tool,...args],{cwd:root,encoding:'utf8',windowsHide:true,timeout:240000,maxBuffer:2**20});assert.equal(r.status,exit,r.stderr+'\n'+r.stdout);
    console.log(label+' '+name+' OK');return JSON.parse(fs.readFileSync(path.join(here,'commands',label+'-'+name,exit===0?'stdout.raw.txt':'stderr.raw.txt')));
  }
  run('init',path.join(oldSource,'bin/ai-writer.mjs'),['init','--path',work,'--kind','novel','--title','首发更新隔离验证']);
  const old=run('identify',entry,['tool','identify',...args]);assert.equal(old.ok,true);assert.equal(old.tool_version,version);assert.equal(old.observed_content_id,contentId);
  assert.equal(run('old-doctor',entry,['doctor',...args]).ok,true);
  const compare=run('compare',entry,['tool','compare',...args,'--other',source]);assert.equal(compare.same_version,version==='0.8.0');assert.equal(compare.same_content,false);
  const author='研究/本轮授权.md',quote='允许这个隔离副本更新至首个正式版0.8.0工具包，仅刷新快速入门；保留作者规则、技能和其余文档，不授权正文写作。';fs.writeFileSync(path.join(work,author),quote+'\n',{flag:'wx'});
  const author_evidence={local_source:author,source_sha256:sha(fs.readFileSync(path.join(work,author))),quote,locator:'synthetic release CLI test',recorded_by:'parent-verification'};
  const keep=['AGENTS.md','.agents/skills/writer-novel/SKILL.md','docs/user-guide.md','LICENSE.md'];fs.appendFileSync(path.join(work,'AGENTS.md'),'\n本地规则：本轮只更新工具。\n');
  fs.appendFileSync(path.join(work,'.agents/skills/writer-novel/SKILL.md'),'\n作者技能定制保留。\n');const kept=Object.fromEntries(keep.map(ref=>[ref,sha(fs.readFileSync(path.join(work,ref)))])),before=state();
  const plan=run('plan',entry,['tool','update-plan',...args],{source,documents:['docs/quickstart.md']});assert.equal(plan.can_update,true,JSON.stringify(plan));
  const input={...plan.request,author_evidence};assert.equal(run('apply',entry,['tool','update',...args],input).status,'completed');const after=state();
  assert.equal(after.revision,before.revision+1);assert.equal(after.tool_control.generation,before.tool_control.generation+1);for(const key of ['schema_version','units','snapshot','governance','decisions'])assert.deepEqual(after[key],before[key],key);
  for(const [ref,hash] of Object.entries(kept))assert.equal(sha(fs.readFileSync(path.join(work,ref))),hash,ref);
  const installed=path.join(work,'.writer/tool/bin/ai-writer.mjs'),now=run('new-identify',installed,['tool','identify',...args]);assert.equal(now.tool_version,'0.8.0');assert.equal(now.resource_profile,'apache-2.0-v1');assert.equal(now.files.length,65);
  for(const ref of ['NOTICE','LICENSE.md','docs/license-transition.json'])assert.deepEqual(fs.readFileSync(path.join(work,'.writer/tool',ref)),fs.readFileSync(path.join(source,ref)),ref);
  assert.equal(run('new-doctor',installed,['doctor',...args]).ok,true);assert.equal(run('repeat',entry,['tool','update',...args],input).unchanged,true);assert.deepEqual(state(),after);
  assert.equal(run('gate-context',installed,['context',...args,'--unit','1'],null,2).code,'ACTION_OUT_OF_SCOPE');assert.equal(run('gate-template',installed,['record-template',...args,'--unit','1'],null,2).code,'ACTION_OUT_OF_SCOPE');assert.deepEqual(state(),after);
  assert.equal(run('check',installed,['check',...args]).ok,true);
  results.push({old_version:version,old_content_id:contentId,new_version:now.tool_version,new_content_id:now.observed_content_id,resource_profile:now.resource_profile,generation_before:before.tool_control.generation,generation_after:after.tool_control.generation,state_sha256:sha(stateBytes()),root_customizations_preserved:kept,idempotent:true,planning_only_gates_refused:true});
}
fs.writeFileSync(path.join(here,'upgrade-verification.json'),JSON.stringify({ok:true,scope:'Actual extracted-release CLI; isolated empty works, not literary acceptance',results},null,2)+'\n',{flag:'wx'});
