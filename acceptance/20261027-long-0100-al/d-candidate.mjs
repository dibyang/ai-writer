import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const base=path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1')),root=path.join(base,'work');
const session=JSON.parse(fs.readFileSync(path.join(base,'commands/d-005-begin/stdout.raw.txt')));
if(!session.ok||session.base_revision!==473)throw Error('begin not successful');
const write=(f,v)=>fs.writeFileSync(f,typeof v==='string'||Buffer.isBuffer(v)?v:JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const s=JSON.parse(fs.readFileSync(path.join(root,'.writer/state.json')));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
write(path.join(base,'session-d-recovery.json'),{...session,original_root:root,resume_input:{id:session.id,token:session.token},rewind_input:{from:110,expected_revision:473},stop_next:113});
write(path.join(base,'d-resume-input.json'),{id:session.id,token:session.token});
const archive=path.join(base,'session-d-originals');fs.mkdirSync(archive);
const rows=[];
for(const u of s.units){const b=fs.readFileSync(path.join(root,u.draft));if(sha(b)!==u.sha256)throw Error('drift');if(u.unit>=107){write(path.join(archive,`${u.unit}.md`),b);if(u.unit>=110)write(path.join(archive,`${u.unit}-journal.json`),fs.readFileSync(path.join(root,u.journal)));}rows.push({unit:u.unit,draft:u.draft,sha256:sha(b),journal:u.journal,journal_sha256:u.journal_sha256});}
write(path.join(base,'session-d-original-manifest.json'),{state_sha256:sha(fs.readFileSync(path.join(root,'.writer/state.json'))),revision:s.revision,units:rows});
write(path.join(base,'session-d-old-deltas.json'),s.units.filter(x=>x.unit>=110&&x.unit<=112).map(u=>({unit:u.unit,summary:u.summary,journal:JSON.parse(fs.readFileSync(path.join(root,u.journal)))})));
console.log(JSON.stringify({id:session.id,base_revision:session.base_revision,workspace:session.workspace,archive_count:12}));
