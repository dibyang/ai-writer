import fs from 'node:fs';import path from 'node:path';import {fileURLToPath}from'node:url';import{spawnSync}from'node:child_process';import assert from'node:assert/strict';
const a=path.dirname(fileURLToPath(import.meta.url)),rows=[];
const commands={doctor:['doctor'],status:['status'],check:['check'],sources:['source','list'],revisions:['revision','list'],issues:['review-issues','list']};
for(const mode of ['main','work'])for(const[kind,args]of Object.entries(commands)){
 const label=`fvt4-end-${mode}-${kind}`;
 const r=spawnSync(process.execPath,[path.join(a,'fvt4-cli.mjs'),mode,label,...args],{encoding:'utf8',windowsHide:true,timeout:150000,maxBuffer:64*1024*1024});
 assert.equal(r.status,0,`${label}: ${r.stderr}`);
 const result=JSON.parse(fs.readFileSync(path.join(a,'cli-logs',label,'result.json'),'utf8'));
 assert.equal(result.before_state_sha256,result.after_state_sha256,label+' changed state');
 rows.push({mode,kind,label,exit_code:r.status,product:JSON.parse(r.stdout),before_state_sha256:result.before_state_sha256,after_state_sha256:result.after_state_sha256});
 console.log(JSON.stringify({label,exit_code:r.status,state_unchanged:true}));
}
fs.writeFileSync(path.join(a,'fvt4-two-area-six-state.json'),JSON.stringify({at:new Date().toISOString(),rows,mechanical_not_literary_acceptance:true},null,2)+'\n',{flag:'wx'});
for(const mode of ['main','work']){
 const q=k=>rows.find(r=>r.mode===mode&&r.kind===k).product,s=q('status'),c=q('check'),d=q('doctor');
 console.log(JSON.stringify({mode,revision:s.revision,next_unit:s.next_unit,changed_sources:s.changed_sources,stale_units:s.stale_units,impact_pending:s.impact_pending,doctor_ok:d.ok,content_id:d.build.observed_content_id,runtime_id:d.build.runtime_id,check_ok:c.ok,literary_quality:c.literary_quality,issue_counts:q('issues').counts}));
}
