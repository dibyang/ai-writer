import fs from 'node:fs';import path from 'node:path';import {spawnSync}from'node:child_process';import assert from'node:assert/strict';import{fileURLToPath}from'node:url';
const A=path.dirname(fileURLToPath(import.meta.url)),P=JSON.parse(fs.readFileSync(path.join(A,'project.json'),'utf8')).project,rows=[];
for(const[kind,args]of[['doctor',['doctor']],['status',['status']],['check',['check']],['sources',['source','list']],['revisions',['revision','list']],['issues',['review-issues','list']]]){
 const label='fr-final-'+kind,run=spawnSync(process.execPath,[path.join(A,'cli-g9.mjs'),label,...args,'--project',P],{encoding:'utf8',windowsHide:true,maxBuffer:32*1024*1024});
 const result=JSON.parse(fs.readFileSync(path.join(A,'cli-logs',label,'result.json'),'utf8'));
 assert.equal(run.status,0,kind);assert.equal(result.before_state_sha256,result.after_state_sha256,kind);
 const product=JSON.parse(fs.readFileSync(path.join(A,'cli-logs',label,'stdout.txt'),'utf8'));
 const earlier=JSON.parse(fs.readFileSync(path.join(A,'cli-logs','ffr-final-'+kind,'stdout.txt'),'utf8'));
 rows.push({kind,label,result,product,product_equal_to_first_stop:JSON.stringify(product)===JSON.stringify(earlier)});
 console.log(JSON.stringify({kind,label,exit:run.status,state_unchanged:true,product_equal_to_first_stop:rows.at(-1).product_equal_to_first_stop,keys:Object.keys(product)}));
}
fs.writeFileSync(path.join(A,'fr-exit-six-state.json'),JSON.stringify({at:new Date().toISOString(),native_id:process.env.CODEX_THREAD_ID,rows},null,2)+'\n',{flag:'wx'});
