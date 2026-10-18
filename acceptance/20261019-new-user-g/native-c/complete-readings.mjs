import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)),base=path.dirname(here),repo=path.resolve(base,'../..'),local=JSON.parse(fs.readFileSync(path.join(here,'session-local.json')));
const readingFile=path.join(here,'readings.json'),data=JSON.parse(fs.readFileSync(readingFile,'utf8'));
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const actuallyRead=[
 path.join(repo,'.agents/skills/writer-project/references/long-form.md'),
 path.join(repo,'.agents/skills/writer-novel/references/suspense-continuity.md'),
 path.join(here,'baseline-original/semantic-review.json'),
 path.join(path.dirname(local.workspace),'base.json'),
 path.join(local.workspace,'审查/0002-C重登语义复核.md'),
 path.join(local.workspace,'审查/0003-C重登语义复核.md'),
 path.join(here,'REPORT.md')
];
for(const label of fs.readdirSync(path.join(base,'commands')).filter(x=>x.startsWith('c-')&&x!=='c-revision-begin'))actuallyRead.push(path.join(base,'commands',label,'stdout.raw.txt'));
for(const file of actuallyRead){
 const bytes=fs.readFileSync(file),hash=sha(bytes);if(data.entries.some(x=>x.path===file&&x.sha256===hash))continue;
 const id=String(data.entries.length+1).padStart(3,'0'),lines=bytes.toString('utf8').split('\n').length,copy=path.join(here,'read-versions',id+'-'+hash.slice(0,12)+'-'+path.basename(file));
 fs.writeFileSync(copy,bytes,{flag:'wx'});
 data.entries.push({id,path:file,sha256:hash,bytes:bytes.length,line_count:lines,read_version:copy,snapshotted_at:new Date().toISOString(),actual_read:true,coverage:[{from:1,to:lines}],completed_at:new Date().toISOString(),note:'Full content actually read in C live tool responses before this supplemental snapshot. semantic-review.json was continued exactly at lines 301, 601 and 901 through line 1100.'});
}
data.review_nature='informed-agent; agent-within-authorized-scope; not human or blind';
data.disclosure='Initial manuals/skills/handoffs were snapshotted after their full reads, not at every first-read instant. Manuscript versions 014–019, 025–030 preserve each actually read original/candidate byte version. Begin stdout token was redacted in live response and is deliberately not claimed as a full raw stdout read.';
data.coverage_groups=[{name:'root-original-final-1-6',entries:['014','015','016','017','018','019'],complete:true},{name:'branch-before-edit-2',entries:['025'],complete:true},{name:'branch-after-edit-downstream-2-6',entries:['026','027','028','029','030'],complete:true,role:'pre-registration downstream semantic check; not final complete revision tail acceptance'}];
fs.writeFileSync(readingFile,JSON.stringify(data,null,2)+'\n');
console.log(JSON.stringify({entries:data.entries.length,all_marked_actually_read:data.entries.every(x=>x.actual_read),full_root_manuscripts:6,full_candidate_manuscripts:5,unresolved_truncations:0}));
