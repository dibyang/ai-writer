import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
const a=path.dirname(fileURLToPath(import.meta.url)), rows=[];
const commands={doctor:['doctor'],status:['status'],check:['check'],sources:['source','list'],revisions:['revision','list'],issues:['review-issues','list']};
for(const mode of ['main','work']) for(const [kind,args] of Object.entries(commands)) {
 const label=`fvt1-end-${mode}-${kind}`;
 const r=spawnSync(process.execPath,[path.join(a,'fvt1-cli.mjs'),mode,label,...args],{encoding:'utf8',windowsHide:true,timeout:150000,maxBuffer:64*1024*1024});
 assert.equal(r.status,0,`${label}: ${r.stderr}`);
 const result=JSON.parse(fs.readFileSync(path.join(a,'cli-logs',label,'result.json'),'utf8'));
 assert.equal(result.before_state_sha256,result.after_state_sha256,label+' changed state');
 rows.push({mode,kind,label,exit_code:r.status,product:JSON.parse(r.stdout),before_state_sha256:result.before_state_sha256,after_state_sha256:result.after_state_sha256});
 console.log(JSON.stringify({label,exit_code:r.status,state_unchanged:true}));
}
fs.writeFileSync(path.join(a,'fvt1-two-area-six-state.json'),JSON.stringify({at:new Date().toISOString(),rows,mechanical_not_literary_acceptance:true},null,2)+'\n',{flag:'wx'});
for(const mode of ['main','work']) {
 const q=k=>rows.find(r=>r.mode===mode&&r.kind===k).product;
 console.log(JSON.stringify({mode,status:q('status'),check:{ok:q('check').ok,literary_quality:q('check').literary_quality,findings_by_code:q('check').findings.reduce((o,x)=>(o[x.code]=(o[x.code]??0)+1,o),{}),rolling_review:q('check').rolling_review},doctor_build:q('doctor').build,sources:{versions:Object.keys(q('sources').versions??{}).length,ranges:q('sources').ranges?.length,impact_pending:q('sources').impact_pending,entry_differences:q('sources').entry_differences?.length,pending_edits:q('sources').pending_edits?.length},issues:q('issues').counts,revisions:q('revisions')},null,2));
}
