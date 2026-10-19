import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const here=import.meta.dirname,root=path.resolve(here,'../..'),work=path.join(here,'update-work-v2');
const source=path.join(here,'sources/package-0.8.0-v2'),entry=path.join(source,'bin/ai-writer.mjs');
const old=path.join(root,'acceptance/20261019-dependency-recovery-i/sources/repair-0.7.6/bin/ai-writer.mjs');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const state=()=>JSON.parse(fs.readFileSync(path.join(work,'.writer/state.json')));
let n=0;
function run(label,tool,args,input,expected=0){
  if(input){const f=path.join(work,`.writer/drafts/update-smoke-${++n}.json`);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,JSON.stringify(input,null,2)+'\n',{flag:'wx'});args=[...args,'--input',f];}
  const r=spawnSync(process.execPath,[path.join(here,'capture.mjs'),'upgrade-v2-'+label,process.execPath,tool,...args],{cwd:root,encoding:'utf8',windowsHide:true,timeout:240000,maxBuffer:2**20});
  assert.equal(r.status,expected,r.stderr+'\n'+r.stdout);
  const dir=path.join(here,'commands','upgrade-v2-'+label),result=JSON.parse(fs.readFileSync(path.join(dir,expected===0?'stdout.raw.txt':'stderr.raw.txt')));console.log(label+' OK');return result;
}
const args=['--project',work];
run('init-old',old,['init','--path',work,'--kind','novel','--title','方法更新隔离验证','--mode','long']);
const oldIdentify=run('identify-old',old,['tool','identify',...args]);
assert.equal(oldIdentify.tool_version??oldIdentify.build?.tool_version,'0.7.6');
const author='研究/工具更新验证授权.md',quote='仅允许此隔离测试作品正式更新工具，保留根作者技能和手册；不允许正文写作。';
fs.writeFileSync(path.join(work,author),quote+'\n',{flag:'wx'});
const author_evidence={local_source:author,source_sha256:sha(fs.readFileSync(path.join(work,author))),quote,locator:'synthetic-test-only',recorded_by:'parent-verification'};
const skill=path.join(work,'.agents/skills/writer-novel/SKILL.md'),guide=path.join(work,'docs/user-guide.md');
fs.appendFileSync(skill,'\n作者本地约定：保留缓慢的合作关系。\n');fs.appendFileSync(guide,'\n作者笔记：只规划，不自动续写。\n');
const custom={skill:sha(fs.readFileSync(skill)),guide:sha(fs.readFileSync(guide))},before=state();
const oldStateSha=sha(fs.readFileSync(path.join(work,'.writer/state.json')));
const plan=run('plan',entry,['tool','update-plan',...args],{source,documents:['docs/quickstart.md','docs/long-form.md']});assert.equal(plan.can_update,true,JSON.stringify(plan));
const input={...plan.request,author_evidence};
const update=run('apply',entry,['tool','update',...args],input);assert.equal(update.status,'completed');
const after=state();assert.equal(after.schema_version,before.schema_version);assert.deepEqual(after.units,before.units);assert.deepEqual(after.snapshot,before.snapshot);assert.equal(after.revision,before.revision+1);assert.equal(after.tool_control.generation,before.tool_control.generation+1);
assert.equal(sha(fs.readFileSync(skill)),custom.skill);assert.equal(sha(fs.readFileSync(guide)),custom.guide);
const installed=path.join(work,'.writer/tool/bin/ai-writer.mjs');
const doctor=run('doctor',installed,['doctor',...args]);assert.equal(doctor.ok,true,JSON.stringify(doctor));assert.equal(doctor.tool_version,'0.8.0');assert.equal(doctor.skill_root,path.join(work,'.writer/tool/.agents/skills'));
for(const name of ['story-development.md','scene-connections.md']){const p=path.join(doctor.skill_root,'writer-novel/references',name);assert.equal(sha(fs.readFileSync(p)),sha(fs.readFileSync(path.join(source,'.agents/skills/writer-novel/references',name))));}
const helpResult=spawnSync(process.execPath,[installed,'--help'],{encoding:'utf8',windowsHide:true});assert.equal(helpResult.status,0);assert.ok(helpResult.stdout.includes(path.join(work,'.writer/tool/docs/user-guide.md')));fs.writeFileSync(path.join(here,'updated-help-v2.txt'),helpResult.stdout,{flag:'wx'});
const refused=run('internal-entry-refused',installed,['tool','update',...args],input,2);assert.equal(refused.code,'TOOL_EXTERNAL_ENTRY_REQUIRED');assert.deepEqual(state(),after);
for(const name of ['quickstart.md','long-form.md']){const file=path.join(work,'docs',name);assert.equal(sha(fs.readFileSync(file)),sha(fs.readFileSync(path.join(source,'docs',name))));for(const match of fs.readFileSync(file,'utf8').matchAll(/\[[^\]]+\]\(([^)]+)\)/g)){if(!/^(https?:|#)/.test(match[1]))assert.ok(fs.existsSync(path.resolve(path.dirname(file),match[1].split('#')[0])),match[1]);}}
const repeat=run('repeat',entry,['tool','update',...args],input);assert.equal(repeat.unchanged,true);assert.deepEqual(state(),after);
assert.equal(run('check',installed,['check',...args]).ok,true);
fs.writeFileSync(path.join(here,'update-verification-v2.json'),JSON.stringify({ok:true,scope:'isolated real CLI update, not literature',old_version:'0.7.6',new_version:'0.8.0',old_state_sha256:oldStateSha,revision_before:before.revision,revision_after:after.revision,generation_before:before.tool_control.generation,generation_after:after.tool_control.generation,author_customizations_preserved:true,new_references_current_package:true,idempotent:true},null,2)+'\n',{flag:'wx'});
