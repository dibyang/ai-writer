import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {base,work,save,input,run,sha,read,state} from './common.mjs';
const b=JSON.parse(fs.readFileSync(path.join(base,'r1-session.json'),'utf8'));
save('r1-resume-result.json',run('r1-resume',['revision','resume','--input',input('r1-resume',{id:b.id,token:b.token})]));
const changes=JSON.parse(fs.readFileSync(path.join(base,'r1-text-edits.json'),'utf8')),proof=[];
for(const unit of [...new Set(changes.map(x=>x.unit))]){
 const ref=`正文/${String(unit).padStart(4,'0')}.md`,p=path.join(b.workspace,ref),old=fs.readFileSync(p),text=old.toString('utf8');let next=text;
 assert.equal(sha(old),sha(read(ref)));
 for(const edit of changes.filter(x=>x.unit===unit)){assert.equal(next.split(edit.old).length-1,1,JSON.stringify(edit)); next=next.replace(edit.old,edit.new);}
 fs.writeFileSync(p,next,'utf8');proof.push({unit,ref,old_sha256:sha(old),new_sha256:sha(Buffer.from(next)),old_bytes:old.length,new_bytes:Buffer.byteLength(next)});
}
save('r1-text-sha-proof.json',proof);
const before=JSON.parse(fs.readFileSync(path.join(base,'r1-entry-reading-before.json'),'utf8'));
save('r1-main-text-preservation-after-edits.json',before.files.map(f=>({...f,actual_sha256:sha(read(f.ref)),unchanged:f.sha256===sha(read(f.ref))})));
assert.ok(before.files.every(f=>f.sha256===sha(read(f.ref))));
console.log(JSON.stringify({ok:true,workspace:b.workspace,changed:proof.map(p=>p.unit),main_revision:state().revision}));
