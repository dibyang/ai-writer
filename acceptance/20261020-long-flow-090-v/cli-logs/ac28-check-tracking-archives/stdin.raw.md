import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const v='D:/work/other/ai-writer/acceptance/20261020-long-flow-090-v';
const w=path.join(v,'scenario','东岸末班船-扩展验证');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const listed=JSON.parse(fs.readFileSync(path.join(v,'cli-logs/ac25-applied-issue/stdout.raw.txt'),'utf8'));
const findIssue=x=>{if(x&&typeof x==='object'){if(x.id==='V_A_U5_TIME_METADATA'&&x.application)return x;for(const z of Object.values(x)){const r=findIssue(z);if(r)return r;}}};
const issue=findIssue(listed);if(!issue)throw Error('No applied issue');
const a=issue.application;
if(a.change_scope!=='tracking'||a.commit_id!=='3ec56fe0-3fbc-4bfe-9cb1-2253bdf0db68')throw Error('Wrong tracking binding');
const states={};for(const key of ['before','after']){const ref=a.tracking_state_refs[key],raw=fs.readFileSync(path.join(w,ref.ref));if(sha(raw)!==ref.sha256)throw Error('Archive SHA mismatch '+key);states[key]=JSON.parse(raw.toString('utf8'));}
const time_changes=[4,5,6].map(n=>({unit:n,before_summary:states.before.units.find(x=>x.unit===n).summary,after_summary:states.after.units.find(x=>x.unit===n).summary}));
const oldTimeline=states.before.snapshot.timeline,newTimeline=states.after.snapshot.timeline;
const timeline_changes=oldTimeline.map((text,i)=>({index:i,before:text,after:newTimeline[i]})).filter(x=>x.before!==x.after);
const result={transaction_id:a.transaction_id,commit_id:a.commit_id,refs:a.tracking_state_refs,time_changes,timeline_changes,body_changes:a.changes.filter(x=>x.before!==x.after)};
if(result.body_changes.length||timeline_changes.length!==2)throw Error('Unexpected archive difference');
fs.writeFileSync(path.join(v,'ac-tracking-archive-check.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(result,null,2));
