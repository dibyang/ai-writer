import fs from 'node:fs';
import path from 'node:path';
import {stage,work,read,write,hash} from './revise.mjs';
const entries=[];
function walk(dir){for(const d of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,d.name);if(d.isDirectory())walk(p);else if(d.isFile()){const rel=path.relative(stage,p).replaceAll('\\','/');if(rel==='artifact-manifest.json'||rel.startsWith('script-logs/artifact-manifest.'))continue;const b=fs.readFileSync(p);entries.push({path:rel,bytes:b.length,sha256:hash(b)});}else throw new Error('unsafe '+p);}}
walk(stage);entries.sort((a,b)=>a.path.localeCompare(b.path));
const s=read(path.join(work,'.writer/state.json'));
const current=[{path:'.writer/state.json',sha256:hash(fs.readFileSync(path.join(work,'.writer/state.json')))},...s.units.map(u=>({path:u.draft,sha256:u.sha256}))];
const rv=read(path.join(work,read(path.join(stage,'delivery-verification.json')).review_ref));current.push({path:rv.report,sha256:rv.report_sha256});
write(path.join(stage,'artifact-manifest.json'),{revision:s.revision,time:new Date().toISOString(),scope:'all phase artifacts except this manifest and its own runtime log',entries,current_work:current});
console.log(JSON.stringify({ok:true,revision:s.revision,artifact_files:entries.length,current_work_files:current.length,result:'acceptance/20261016-expanded/revision-a/result.md'}));
