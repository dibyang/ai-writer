import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import crypto from 'node:crypto';
const base=path.dirname(new URL(import.meta.url).pathname.replace(/^\/(?:([A-Za-z]):)/,'$1:'));
const project=JSON.parse(fs.readFileSync(path.join(base,'project.json'))).project;
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
for(const [label,args] of [['ff-entry-check',['check']],['ff-entry-doctor',['doctor']],['ff-entry-sources',['source','list']],['ff-entry-revisions',['revision','list']],['ff-entry-issues',['review-issues','list']]]) {
 const r=spawnSync(process.execPath,[path.join(base,'cli.mjs'),label,...args,'--project',project],{encoding:'utf8',maxBuffer:32*1024*1024,windowsHide:true});
 console.log(JSON.stringify({label,exit_code:r.status,stdout_chars:r.stdout.length,stderr:r.stderr}));
 if(r.status!==0){process.exitCode=r.status||1;break;}
}
const stateFile=path.join(project,'.writer/state.json'),b=fs.readFileSync(stateFile),s=JSON.parse(b);
console.log(JSON.stringify({state_sha256:sha(b),revision:s.revision,keys:Object.keys(s),unit_count:s.units?.length,unit_sample:s.units?.[0],tool:s.tool},null,2));
for(const label of ['ff-entry-status','ff-entry-check','ff-entry-doctor','ff-entry-sources','ff-entry-revisions','ff-entry-issues']) {
 const f=path.join(base,'cli-logs',label,'stdout.txt');if(!fs.existsSync(f))continue;
 const x=JSON.parse(fs.readFileSync(f));
 if(label.endsWith('status'))console.log(JSON.stringify({label,ok:x.ok,revision:x.revision,stale_units:x.stale_units,changed_sources:x.changed_sources,impact_pending:x.impact_pending,revisions:x.revisions?.sessions?.map(y=>({id:y.id,status:y.status})),transactions:x.transactions,tool:x.tool,issues:x.review_issues,inventory:x.draft_inventory?.unregistered?.length},null,2));
 else if(label.endsWith('sources'))console.log(JSON.stringify({label,keys:Object.keys(x),...x},null,2));
 else if(label.endsWith('issues'))console.log(JSON.stringify({label,...x},null,2));
 else console.log(JSON.stringify({label,...x},null,2));
}
