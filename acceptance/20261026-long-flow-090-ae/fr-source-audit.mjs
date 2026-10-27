import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const A=path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'));
const P=path.join(A,'scenario','东岸末班船-66章独立验证');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const s=JSON.parse(fs.readFileSync(path.join(P,'.writer/state.json'),'utf8'));
const units=s.units.filter(u=>[2,3,19,48,60].includes(u.unit)).map(u=>({unit:u.unit,draft:u.draft,sha256:u.sha256,authorization:u.authorization,decision_bindings:u.decision_bindings,sources:Object.entries(u.source_hashes).filter(([ref])=>ref!=='.writer/state.json').map(([ref,sha])=>{const b=u.source_bindings?.[ref];const effective_ref=b?.object_ref??ref;const actual=hash(fs.readFileSync(path.join(P,effective_ref)));return {ref,expected_sha256:sha,effective_ref,version_id:b?.version_id??null,effective_sha256:actual,match:actual===sha,entry_sha256:hash(fs.readFileSync(path.join(P,ref)))};})}));
const draftUnits=new Map(s.units.map(u=>[u.draft,u.unit]));
const edges=s.units.flatMap(u=>Object.keys(u.source_hashes).filter(r=>draftUnits.has(r)).map(ref=>({from:draftUnits.get(ref),to:u.unit,ref,sha256:u.source_hashes[ref]})));
function closure(start){const seen=new Set([start]);let change=true;while(change){change=false;for(const e of edges)if(seen.has(e.from)&&!seen.has(e.to)){seen.add(e.to);change=true;}}return [...seen].sort((a,b)=>a-b);}
const observations=[];
function visit(v,loc){if(!v||typeof v!=='object')return;if(v.id==='O_BOX_PAINT'||v.type==='observation'||v.author_truth!==undefined)observations.push({location:loc,value:v});for(const[k,c]of Object.entries(v))if(c&&typeof c==='object')visit(c,loc+'.'+k);}
visit(s.baseline,'baseline');visit(s.snapshot,'snapshot');
const result={created_at:new Date().toISOString(),native_id:process.env.CODEX_THREAD_ID,state_sha256:hash(fs.readFileSync(path.join(P,'.writer/state.json'))),revision:s.revision,unit_count:s.units.length,units,edges,closures:Object.fromEntries([3,48,60].map(n=>[n,closure(n)])),observations,governance:s.governance,decisions:s.decisions,note:'Read-only static dependency/effective-object audit. Not a product revision preview, literary review, or source publication. Full governance dump in earlier inspection was truncated and is not evidence of reading its omitted fields.'};
fs.writeFileSync(path.join(A,'fr-effective-source-impact.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({revision:s.revision,all_effective_sources_match:units.every(u=>u.sources.every(x=>x.match)),closures:result.closures,observation_count:observations.length,governance:s.governance,observation_locks:observations.map(o=>({location:o.location,id:o.value.id,type:o.value.type,statement:o.value.statement,author_truth:o.value.author_truth})),saved:'fr-effective-source-impact.json'},null,2));
