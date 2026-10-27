import fs from 'node:fs';import path from 'node:path';import{spawnSync}from'node:child_process';import assert from'node:assert/strict';import{fileURLToPath}from'node:url';
const A=path.dirname(fileURLToPath(import.meta.url)),rows=[];
for(const kind of ['doctor','status','check','sources','revisions','issues']){
 const before=JSON.parse(fs.readFileSync(path.join(A,'cli-logs','final-first-entry-'+kind,'result.json')));
 const label='ffr-final-'+kind,r=spawnSync(process.execPath,[path.join(A,'cli-g9.mjs'),label,...before.args],{encoding:'utf8',windowsHide:true,maxBuffer:32*1024*1024});
 const result=JSON.parse(fs.readFileSync(path.join(A,'cli-logs',label,'result.json')));assert.equal(r.status,0,kind);assert.equal(result.before_state_sha256,result.after_state_sha256,kind);
 const current=JSON.parse(r.stdout),entry=JSON.parse(fs.readFileSync(path.join(A,'cli-logs','final-first-entry-'+kind,'stdout.txt'),'utf8'));
 rows.push({kind,label,result,product:current,entry_product_equal:JSON.stringify(current)===JSON.stringify(entry)});
 console.log(JSON.stringify({kind,exit:r.status,state_unchanged:true,entry_product_equal:rows.at(-1).entry_product_equal,keys:Object.keys(current)}));
}
fs.writeFileSync(path.join(A,'final-first-exit-six-state.json'),JSON.stringify({at:new Date().toISOString(),rows},null,2)+'\n',{flag:'wx'});
