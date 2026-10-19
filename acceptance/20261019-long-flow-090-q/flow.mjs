import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {spawnSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),config=JSON.parse(fs.readFileSync(path.join(base,'scenario-config.json'))),{root,work}=config,capture=path.join(base,'run.mjs');
const source=JSON.parse(fs.readFileSync(path.join(base,'zip-verification.json'))).extracted,cli=path.join(source,'bin/ai-writer.mjs');
const [action,nText,templateRef]=process.argv.slice(2),n=Number(nText);
const state=()=>JSON.parse(fs.readFileSync(path.join(work,'.writer/state.json')));
function input(name,value){const dir=path.join(base,'inputs');fs.mkdirSync(dir,{recursive:true});const file=path.join(dir,name+'.json');fs.writeFileSync(file,JSON.stringify(value,null,2)+'\n',{flag:'wx'});return file;}
function run(label,args,expected=0){const r=spawnSync(process.execPath,[capture,label,process.execPath,cli,...args,'--project',work],{cwd:root,encoding:'utf8',windowsHide:true,timeout:120000});assert.equal(r.status,expected,r.stdout+'\n'+r.stderr);return JSON.parse(fs.readFileSync(path.join(base,'commands',label,expected===0?'stdout.raw.txt':'stderr.raw.txt')));}
if(action==='prepare'){
  assert.equal(state().units.length,n-1);
  if(n>=4)run('plan-'+n,['plan','--input',input('plan-'+n,config.plans[n-1])]);
  run('context-'+n,['context','--unit',nText,'--max-chars','100000','--out',`.writer/drafts/context-${n}-current.json`]);
  run('template-'+n,['record-template','--unit',nText,'--draft',`正文/${String(n).padStart(4,'0')}.md`,'--out',`.writer/drafts/record-${n}-current.json`]);
}else if(action==='record'){
  assert.equal(state().units.length,n-1);const template=JSON.parse(fs.readFileSync(path.join(work,templateRef??`.writer/drafts/record-${n}-current.json`))),details=JSON.parse(fs.readFileSync(path.join(base,'record-details-'+n+'.json')));
  const value={...template,...details};
  if(n===1){const old=JSON.parse(fs.readFileSync(path.join(work,'.writer/drafts/record-1.json'))),before=fs.readFileSync(path.join(work,'.writer/state.json'));const stale=run('record-1-old-template',['record','--input',input('record-1-stale',{...old,...details})],2);assert.match(stale.error,/上下文来源已变化/);assert.deepEqual(fs.readFileSync(path.join(work,'.writer/state.json')),before);}
  if(n===6){const old=JSON.parse(fs.readFileSync(path.join(work,'.writer/drafts/record-6-current.json'))),before=fs.readFileSync(path.join(work,'.writer/state.json'));const stale=run('record-6-old-template',['record','--input',input('record-6-stale',{...old,...details})],2);assert.match(stale.error,/追踪修订号已变化/);assert.deepEqual(fs.readFileSync(path.join(work,'.writer/state.json')),before);}
  const ref=input('record-'+n,value);assert.equal(run('preview-'+n,['record-preview','--input',ref]).ok,true);assert.equal(run('record-'+n,['record','--input',ref]).ok,true);assert.equal(run('check-'+n,['check']).ok,true);
}else if(action==='update'){
  const p=run('tool-update-plan',['tool','update-plan','--input',input('tool-update-plan',{source})]);assert.equal(p.can_update,true);
  const author_evidence={...config.evidence,quote:'允许修复该验证作品及工具在实跑中暴露的问题',recorded_by:'Codex Q agent-within-authorized-scope'};
  run('tool-update',['tool','update','--input',input('tool-update',{...p.request,author_evidence})]);
  const id=run('tool-identify-after',['tool','identify']);assert.equal(id.tool_version,'0.9.0');assert.equal(id.observed_content_id,JSON.parse(fs.readFileSync(path.join(base,'candidate/release-manifest.json'))).content_id);
}else throw Error('prepare N | record N | update');
console.log(JSON.stringify({ok:true,action,n:n||null,revision:state().revision,units:state().units.length}));
