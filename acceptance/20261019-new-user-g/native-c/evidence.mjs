import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const repo=path.resolve(here,'../../..');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const file=path.join(here,'readings.json');
const data=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):{schema_version:1,process:'native-c',reviewer_kind:'informed-agent-reading',entries:[]};
const [mode,...paths]=process.argv.slice(2);
fs.mkdirSync(path.join(here,'read-versions'),{recursive:true});
if(mode==='save') for(const ref of paths){
 const abs=path.resolve(repo,ref),bytes=fs.readFileSync(abs),hash=sha(bytes);
 const existing=data.entries.find(x=>x.path===abs&&x.sha256===hash);
 if(existing){console.log(JSON.stringify(existing));continue;}
 const id=String(data.entries.length+1).padStart(3,'0');
 const frozen=path.join(here,'read-versions',id+'-'+hash.slice(0,12)+'-'+path.basename(abs));
 fs.writeFileSync(frozen,bytes,{flag:'wx'});
 const lines=bytes.toString('utf8').split('\n').length;
 const row={id,path:abs,sha256:hash,bytes:bytes.length,line_count:lines,read_version:frozen,snapshotted_at:new Date().toISOString(),actual_read:false,coverage:[],note:'Snapshot only until complete read is confirmed.'};
 data.entries.push(row);console.log(JSON.stringify(row));
}
else if(mode==='confirm') for(const id of paths){
 const row=data.entries.find(x=>x.id===id);if(!row) throw Error(id);
 row.actual_read=true;row.coverage=[{from:1,to:row.line_count}];row.completed_at=new Date().toISOString();row.note='Full file actually read in C tool outputs; no unresolved truncation.';
}
else throw Error('save/confirm');
fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');
