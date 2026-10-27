import fs from'node:fs';import path from'node:path';import{spawnSync}from'node:child_process';import{fileURLToPath}from'node:url';
const a=path.dirname(fileURLToPath(import.meta.url)),rows=[];
for(const mode of ['main','work'])for(const [name,...args]of [['status','status'],['check','check'],['sources','source','list'],['revisions','revision','list'],['issues','review-issues','list'],['doctor','doctor']]){
 const label=`fcl-end-${mode}-${name}`,z=spawnSync(process.execPath,[path.join(a,'fcl-cli.mjs'),mode,label,...args],{encoding:'utf8',maxBuffer:32*1024*1024,timeout:60000});
 const folder=path.join(a,'cli-logs',label),r=JSON.parse(fs.readFileSync(path.join(folder,'result.json')));let j;try{j=JSON.parse(fs.readFileSync(path.join(folder,'stdout.txt'),'utf8'));}catch{}
 const row={mode,name,label,exit_code:r.exit_code,before_state_sha256:r.before_state_sha256,after_state_sha256:r.after_state_sha256,ok:j?.ok,revision:j?.revision,counts:j?.counts,rolling_review:j?.rolling_review,changed_sources:j?.changed_sources,stale_units:j?.stale_units,impact_pending:j?.impact_pending,report:folder};rows.push(row);console.log(JSON.stringify(row));
}
fs.writeFileSync(path.join(a,'fcl-two-area-six-state.json'),JSON.stringify({at:new Date().toISOString(),rows},null,2)+'\n',{flag:'wx'});
