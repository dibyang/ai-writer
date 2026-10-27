import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const base=path.dirname(new URL(import.meta.url).pathname.replace(/^\/(?=[A-Za-z]:)/,''));
const root=JSON.parse(fs.readFileSync(path.join(base,'project.json'))).project;
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const mode=process.argv[2];
const inventory=()=>{const items=[];const walk=d=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){const f=path.join(d,e.name);assert(!e.isSymbolicLink(),f);if(e.isDirectory())walk(f);else {const b=fs.readFileSync(f);items.push({ref:path.relative(root,f).replaceAll('\\','/'),bytes:b.length,sha256:sha(b)});}}};walk(root);return items;};
if(mode==='entry'){
 const state=fs.readFileSync(path.join(root,'.writer/state.json'));const s=JSON.parse(state);
 const files=inventory();const out={at:new Date().toISOString(),root,state_sha256:sha(state),revision:s.revision,registered_units:s.units.length,files};
 fs.writeFileSync(path.join(base,'epr-entry-inventory.json'),JSON.stringify(out,null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify({at:out.at,state_sha256:out.state_sha256,revision:s.revision,registered_units:s.units.length,files:files.length,keys:Object.keys(s),units:s.units.filter(x=>[48,54,55,56,57,58,59,60].includes(x.unit)).map(x=>({unit:x.unit,draft:x.draft,draft_sha256:x.draft_sha256,keys:Object.keys(x)})),snapshot_keys:Object.keys(s.snapshot)},null,2));
}else if(mode==='exit'){
 const entry=JSON.parse(fs.readFileSync(path.join(base,'epr-entry-inventory.json'))),files=inventory(),m=new Map(files.map(x=>[x.ref,x]));
 const changes=entry.files.filter(x=>!m.has(x.ref)||m.get(x.ref).sha256!==x.sha256);const old=new Set(entry.files.map(x=>x.ref));const added=files.filter(x=>!old.has(x.ref));
 const result={at:new Date().toISOString(),entry_state_sha256:entry.state_sha256,exit_state_sha256:sha(fs.readFileSync(path.join(root,'.writer/state.json'))),entry_files:entry.files.length,exit_files:files.length,changes,added,ok:!changes.length&&!added.length};
 fs.writeFileSync(path.join(base,'epr-exit-inventory-proof.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(result,null,2));assert(result.ok);
}else throw Error('entry or exit');
