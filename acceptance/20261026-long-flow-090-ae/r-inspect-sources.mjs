import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const A=path.dirname(fileURLToPath(import.meta.url));
const P=JSON.parse(fs.readFileSync(path.join(A,'project.json'))).project;
const bytes=fs.readFileSync(path.join(P,'.writer/state.json')),s=JSON.parse(bytes),sha=b=>crypto.createHash('sha256').update(b).digest('hex'),refs={};
for(const u of s.units)for(const [ref,h]of Object.entries(u.source_hashes??{})){
 if(!/^(设定|大纲|研究)\//.test(ref))continue;
 const a=refs[ref]??={ref,consumers:[],versions:Object.values(s.source_versions).filter(v=>v.ref===ref)};
 a.consumers.push({unit:u.unit,hash:h,binding:u.source_bindings?.[ref]??null});
}
const out={at:new Date().toISOString(),state_sha256:sha(bytes),refs:Object.values(refs).map(a=>({...a,live_sha256:sha(fs.readFileSync(path.join(P,a.ref))),hits:fs.readFileSync(path.join(P,a.ref),'utf8').split(/\r?\n/).map((text,i)=>({line:i+1,text})).filter(x=>/七十二|净72|灯72|72新灯|100找28|晚15|迟15|16:45|半小时|一刻|immutable|不可变|锁定/.test(x.text))}))};
fs.writeFileSync(path.join(A,'r-source-consumers-entry.json'),JSON.stringify(out,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({snapshot_keys:Object.keys(s.snapshot),baseline_keys:Object.keys(s.baseline),relevant:out.refs.filter(x=>x.hits.length).map(x=>({ref:x.ref,live_sha256:x.live_sha256,consumers:x.consumers.map(y=>y.unit),versions:x.versions.map(v=>v.id),hits:x.hits})),observations:s.snapshot.evidence},null,2));
