import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRunner} from '../command-runner.mjs';
const stage='acceptance/20261016-hundred/session-03',project='acceptance/20261016-hundred/works/潮汐信号';
const r=createRunner(stage),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const [action,narg]=process.argv.slice(2),n=Number(narg);
function cli(label,cmd,args=[]){const x=r.run(process.execPath,['bin/ai-writer.mjs',cmd,'--project',project,...args],label);if(x.exit_code!==0){console.log(x.stdout);console.error(x.stderr);throw Error(label+' failed; preserved '+x.files.metadata);}return JSON.parse(x.stdout);}
if(action==='prepare'){
 const input=`${stage}/plan-${n}.json`;cli(`plan-${n}`,'plan',['--input',input]);
 const c=cli(`context-${n}`,'context',['--unit',String(n),'--max-chars','240000']);
 fs.writeFileSync(`${stage}/context-${n}.json`,JSON.stringify(c,null,2)+'\n');
 const plan=JSON.parse(fs.readFileSync(input,'utf8'));
 const t=cli(`template-${n}`,'record-template',['--unit',String(n),'--draft',`正文/${String(n).padStart(4,'0')}-${plan.title}.md`]);
 fs.writeFileSync(`${stage}/template-${n}.json`,JSON.stringify(t,null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify({context_keys:Object.keys(c),template:t,context_revision:c.revision,omitted:c.omitted_ids??c.ledger?.omitted_ids??null,elapsed_minutes:((Date.now()-Date.parse(JSON.parse(fs.readFileSync(`${stage}/start.json`)).started_at))/60000).toFixed(1)},null,2));
}
if(action==='record'){
 const t=JSON.parse(fs.readFileSync(`${stage}/template-${n}.json`,'utf8'));
 const x=JSON.parse(fs.readFileSync(`${stage}/changes-${n}.json`,'utf8'));
 const status=cli(`status-pre-record-${n}`,'status',['--view','full']);
 for(const [id,entry] of Object.entries(x.changes.ledger??{})){
  for(const [person,now] of Object.entries(entry.character_known??{})){
   const old=status.snapshot.ledger[id]?.character_known?.[person];
   if(old)entry.character_known[person]=now+`；保留至第${n-1}章的有效历史知情（以下为各原章时点）：`+old;
  }
 }
 for(const [person,now] of Object.entries(x.changes.characters??{})){
  const old=status.snapshot.characters[person];if(old)x.changes.characters[person]=now+`；保留至第${n-1}章的有效历史状态（以下按原章时点，非当前位置）：`+old;
 }
 const input={...t,...x};delete input.ok;
 const draft=path.join(project,input.draft),body=fs.readFileSync(draft,'utf8').replace(/^#.*(?:\r?\n|$)/gm,'');
 const han=[...body.matchAll(/\p{Script=Han}/gu)].length;
 if(han<2400||han>3200)throw Error('Han out of range '+han);
 fs.writeFileSync(`${stage}/record-${n}.json`,JSON.stringify(input,null,2)+'\n',{flag:'wx'});
 console.log('Han',han,'draft_sha256',sha(draft));console.log(cli(`record-${n}`,'record',['--input',`${stage}/record-${n}.json`]));console.log(cli(`check-${n}`,'check'));
}
if(action==='readlog'){
 const list=JSON.parse(fs.readFileSync(`${stage}/reads-to-log.json`,'utf8'));
 for(const x of list){const p=x.root==='stage'?stage:x.root==='repo'?'.':project;const file=path.join(p,x.path);const txt=fs.readFileSync(file,'utf8');fs.appendFileSync(`${stage}/reading.jsonl`,JSON.stringify({path:path.resolve(file).replaceAll('\\','/'),sha256:sha(file),range:x.range??`full; lines 1-${txt.split(/\r?\n/).length}`,purpose:x.purpose,read_method:'model full text inspection via FastCtx; hash captured after completed reading',logged_at:new Date().toISOString()})+'\n');}
 console.log('Recorded actual reads',list.length);
}
if(action==='audit'){
 const s=r.json('status-initial');
 const reads=fs.readFileSync(`${stage}/reading.jsonl`,'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
 fs.writeFileSync(`${stage}/recovery-sources.json`,JSON.stringify({revision:s.revision,current_state_sha256:sha(`${project}/.writer/state.json`),source_reads:reads},null,2)+'\n');
 const x=r.run('git',['status','--short'],'git-status-initial');console.log(x.stdout);console.log('Recovery sources',reads.length);
}
if(action==='count'){
 const files=fs.readdirSync(`${project}/正文`).filter(f=>Number(f.slice(0,4))>=37).map(f=>{const b=fs.readFileSync(`${project}/正文/${f}`,'utf8');return {file:f,han:[...b.replace(/^#.*(?:\r?\n|$)/gm,'').matchAll(/\p{Script=Han}/gu)].length,sha256:sha(`${project}/正文/${f}`)};});console.log(files);
}
