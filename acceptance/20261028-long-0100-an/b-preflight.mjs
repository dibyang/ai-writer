import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url)), work=path.join(root,'work');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const put=(ref,x)=>fs.writeFileSync(path.join(root,ref),JSON.stringify(x,null,2)+'\n',{flag:'wx'});
const files=[];
function walk(dir,rel='') { for(const ent of fs.readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))) {
  const ref=rel?rel+'/'+ent.name:ent.name;
  if(ent.name==='.git') throw Error('Git directory excluded from this task; unexpected nested Git');
  if(ent.isSymbolicLink()) throw Error('Unexpected symlink '+ref);
  if(ent.isDirectory()) walk(path.join(dir,ent.name),ref);
  else { const bytes=fs.readFileSync(path.join(dir,ent.name));files.push({ref,bytes:bytes.length,sha256:sha(bytes)}); }
}}
walk(work);
const stateBytes=fs.readFileSync(path.join(work,'.writer/state.json')), state=JSON.parse(stateBytes);
fs.mkdirSync(path.join(root,'session-b'),{recursive:true});
fs.writeFileSync(path.join(root,'session-b','initial-state.json'),stateBytes,{flag:'wx'});
put('session-b/initial-work-manifest.json',{at:new Date().toISOString(),state_sha256:sha(stateBytes),revision:state.revision,count:files.length,total_bytes:files.reduce((n,f)=>n+f.bytes,0),files});
console.log(JSON.stringify({revision:state.revision,count:files.length,state_sha256:sha(stateBytes)}));
