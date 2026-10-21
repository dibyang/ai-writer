import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
const W=path.dirname(new URL(import.meta.url).pathname.replace(/^\/(?:([A-Za-z]:))/,'$1')),P=path.join(W,'scenario/东岸末班船-规模验证');
const raw=fs.readFileSync(path.join(P,'.writer/state.json')),s=JSON.parse(raw),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
fs.writeFileSync(path.join(W,'b-start-state.json'),raw,{flag:'wx'});
const files={};function scan(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())scan(p);else if(e.isFile())files[path.relative(P,p).replaceAll('\\','/')]=sha(fs.readFileSync(p));}}scan(P);
fs.writeFileSync(path.join(W,'b-start-files.json'),JSON.stringify(files,null,2),{flag:'wx'});
const out={revision:s.revision,units:s.units.map(u=>({unit:u.unit,draft:u.draft,sha256:sha(fs.readFileSync(path.join(P,u.draft)))})),snapshot:s.snapshot??s.current,keys:Object.keys(s)};
fs.writeFileSync(path.join(W,'b-start-readable.json'),JSON.stringify(out,null,2),{flag:'wx'});console.log(JSON.stringify({revision:s.revision,units:out.units,keys:out.keys,state_sha256:sha(raw)}));
