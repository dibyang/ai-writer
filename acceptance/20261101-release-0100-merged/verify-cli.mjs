import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),cli=path.join(base,'unpacked/ai-writer-0.10.0/bin/ai-writer.mjs'),project=path.join(base,'work');
const jobs=[['status','status','--project',project,'--view','task'],['check','check','--project',project],['revisions','revision','list','--project',project]];
const result=[];
for(const [name,...args] of jobs){const r=spawnSync(process.execPath,[cli,...args],{encoding:'utf8',windowsHide:true,maxBuffer:16*1024*1024});fs.writeFileSync(path.join(base,`cli-${name}.stdout.json`),r.stdout??'',{flag:'wx'});fs.writeFileSync(path.join(base,`cli-${name}.stderr.txt`),r.stderr??'',{flag:'wx'});let value;try{value=JSON.parse(r.stdout)}catch{}result.push({name,exit:r.status,error:r.error?.message??null,ok:value?.ok??null,blockers:value?.blockers??null,findings:value?.findings??null});}
fs.writeFileSync(path.join(base,'cli-audit.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(result));if(result.some(x=>x.exit!==0||x.ok!==true))process.exitCode=1;
