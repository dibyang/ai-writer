import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const here=import.meta.dirname,root=path.resolve(here,'../..'),source=path.join(root,'.tmp/首发解压 验证-L/ai-writer-0.8.0'),entry=path.join(source,'bin/ai-writer.mjs');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),read=ref=>JSON.parse(fs.readFileSync(path.join(here,ref))),results=[];
function call(label,tool,args,input,exit=0){
  if(input){const file=path.join(here,label+'.input.json');fs.writeFileSync(file,JSON.stringify(input,null,2)+'\n',{flag:'wx'});args=[...args,'--input',file];}
  const r=spawnSync(process.execPath,[path.join(here,'capture.mjs'),label,process.execPath,tool,...args],{cwd:root,encoding:'utf8',windowsHide:true,timeout:240000,maxBuffer:2**20});assert.equal(r.status,exit,r.stderr+'\n'+r.stdout);
  console.log(label+' OK');return read('commands/'+label+'/'+(exit===0?'stdout.raw.txt':'stderr.raw.txt'));
}
// Resume the actual completed same-version update; do not reinitialize or edit state.
{
  const work=path.join(here,'work-old080'),args=['--project',work],installed=path.join(work,'.writer/tool/bin/ai-writer.mjs'),bytes=()=>fs.readFileSync(path.join(work,'.writer/state.json'));
  const after=read('commands/old080-apply/after-state.json'),before=read('commands/old080-apply/before-state.json');assert.deepEqual(JSON.parse(bytes()),after);
  const oldSource=path.join(root,'acceptance/20261019-webnovel-reference-j/sources/package-0.8.0-v2'),plan=read('commands/old080-plan/stdout.raw.txt');
  const kept={
    'AGENTS.md':plan.local_content.find(row=>row.file==='AGENTS.md').current_sha256,
    '.agents/skills/writer-novel/SKILL.md':sha(Buffer.concat([fs.readFileSync(path.join(oldSource,'.agents/skills/writer-novel/SKILL.md')),Buffer.from('\n作者技能定制保留。\n')])),
    'docs/user-guide.md':sha(fs.readFileSync(path.join(oldSource,'docs/user-guide.md'))),
    'LICENSE.md':sha(fs.readFileSync(path.join(oldSource,'LICENSE.md')))
  };
  for(const [ref,hash] of Object.entries(kept))assert.equal(sha(fs.readFileSync(path.join(work,ref))),hash,ref);
  for(const key of ['schema_version','units','snapshot','governance','decisions'])assert.deepEqual(after[key],before[key],key);
  assert.equal(call('old080-v2-template',installed,['record-template',...args,'--unit','1','--draft','正文/0001-门禁验证.md'],null,2).code,'ACTION_OUT_OF_SCOPE');assert.deepEqual(JSON.parse(bytes()),after);
  assert.equal(call('old080-v2-check',installed,['check',...args]).ok,true);
  const current=call('old080-v2-identify',installed,['tool','identify',...args]);assert.equal(current.resource_profile,'apache-2.0-v1');
  assert.equal(read('commands/old080-repeat/stdout.raw.txt').unchanged,true);assert.equal(read('commands/old080-gate-context/stderr.raw.txt').code,'ACTION_OUT_OF_SCOPE');
  results.push({old_version:'0.8.0',old_content_id:'3593faa0ea76085a63d788109f3ffbb1bbdf89565f7a012bde32cce437eaf40c',new_version:current.tool_version,new_content_id:current.observed_content_id,resource_profile:current.resource_profile,generation_before:before.tool_control.generation,generation_after:after.tool_control.generation,state_sha256:sha(bytes()),root_customizations_preserved:kept,idempotent:true,planning_only_gates_refused:true,resumed_actual_update:'commands/old080-apply'});
}
{
  const oldSource=path.join(root,'acceptance/20261019-apache-license-k/source-0.8.1'),work=path.join(here,'work-old081-v2'),args=['--project',work],bytes=()=>fs.readFileSync(path.join(work,'.writer/state.json'));
  call('old081-v2-init',path.join(oldSource,'bin/ai-writer.mjs'),['init','--path',work,'--kind','essay','--title','内部许可候选转首发验证']);
  const old=call('old081-v2-identify',entry,['tool','identify',...args]);assert.equal(old.observed_content_id,'efbdf6f4055979e21eb7a3339adf0b88f9c058d5d8137c09b122259f4ad94618');assert.equal(old.tool_version,'0.8.1');
  assert.equal(call('old081-v2-old-doctor',entry,['doctor',...args]).ok,true);
  const quote='允许此隔离副本从内部0.8.1候选更新到首发0.8.0，仅刷新快速入门，保留作者定制；不允许正文写作。',local='研究/授权.md';fs.writeFileSync(path.join(work,local),quote+'\n');
  const author_evidence={local_source:local,source_sha256:sha(fs.readFileSync(path.join(work,local))),quote,locator:'synthetic release CLI validation',recorded_by:'parent-verification'};
  fs.appendFileSync(path.join(work,'AGENTS.md'),'\n作者定制：只做工具更新。\n');const refs=['AGENTS.md','.agents/skills/writer-essay/SKILL.md','docs/user-guide.md','LICENSE.md'],kept=Object.fromEntries(refs.map(ref=>[ref,sha(fs.readFileSync(path.join(work,ref)))])),before=JSON.parse(bytes());
  const plan=call('old081-v2-plan',entry,['tool','update-plan',...args],{source,documents:['docs/quickstart.md']});assert.equal(plan.can_update,true);const input={...plan.request,author_evidence};assert.equal(call('old081-v2-apply',entry,['tool','update',...args],input).status,'completed');const after=JSON.parse(bytes());
  for(const key of ['schema_version','units','snapshot','governance','decisions'])assert.deepEqual(after[key],before[key],key);for(const [ref,hash] of Object.entries(kept))assert.equal(sha(fs.readFileSync(path.join(work,ref))),hash,ref);
  const installed=path.join(work,'.writer/tool/bin/ai-writer.mjs'),now=call('old081-v2-new-identify',installed,['tool','identify',...args]);assert.equal(now.tool_version,'0.8.0');assert.equal(now.resource_profile,'apache-2.0-v1');assert.equal(now.files.length,65);
  assert.equal(call('old081-v2-doctor',installed,['doctor',...args]).ok,true);assert.equal(call('old081-v2-repeat',entry,['tool','update',...args],input).unchanged,true);
  for(const command of ['context','record-template'])assert.equal(call('old081-v2-gate-'+command,installed,[command,...args,'--unit','1',...(command==='record-template'?['--draft','正文/0001-门禁验证.md']:[])],null,2).code,'ACTION_OUT_OF_SCOPE');assert.deepEqual(JSON.parse(bytes()),after);
  assert.equal(call('old081-v2-check',installed,['check',...args]).ok,true);
  results.push({old_version:'0.8.1',old_content_id:old.observed_content_id,new_version:now.tool_version,new_content_id:now.observed_content_id,resource_profile:now.resource_profile,generation_before:before.tool_control.generation,generation_after:after.tool_control.generation,state_sha256:sha(bytes()),root_customizations_preserved:kept,idempotent:true,planning_only_gates_refused:true});
}
fs.writeFileSync(path.join(here,'upgrade-verification-v2.json'),JSON.stringify({ok:true,scope:'Actual extracted-release CLI; isolated works only; v1 missing-draft harness failure preserved',results},null,2)+'\n',{flag:'wx'});
