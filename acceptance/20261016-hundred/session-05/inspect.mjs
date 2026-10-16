import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRunner} from '../command-runner.mjs';
const stage='acceptance/20261016-hundred/session-05';
const project='acceptance/20261016-hundred/works/潮汐信号';
const runner=createRunner(stage);
const hash=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const [op,...args]=process.argv.slice(2);
if(op==='ledger'){
 const s=runner.json('status-current-full').snapshot;
 const now=t=>typeof t==='string'?t.split(/；(?:截至|保留至|历史有效|此前|补入)/)[0]:t;
 const items=Object.entries(s.ledger).filter(([,v])=>v.status!=='resolved').map(([id,v])=>({id,...v,character_known:Object.fromEntries(Object.entries(v.character_known??{}).map(([k,t])=>[k,now(t)])),evidence:v.evidence?.map(e=>({unit:e.unit,draft:e.draft,sha256:e.sha256,quote:e.quote}))}));
 const view={boundary:'Current active/unsettled ledger; current clause of character knowledge, historical knowledge remains in authoritative state and is recalled before use.',characters:Object.fromEntries(Object.entries(s.characters).map(([k,t])=>[k,now(t)])),ledger:items};
 fs.writeFileSync(stage+'/active-ledger.json',JSON.stringify(view,null,2)+'\n');
 console.log(JSON.stringify({file:stage+'/active-ledger.json',items:items.length,sha256:hash(stage+'/active-ledger.json')}));
}else if(op==='ledger-slice'){
 const v=JSON.parse(fs.readFileSync(stage+'/active-ledger.json','utf8'));
 const start=Number(args[0]),end=Number(args[1]);
 for(const item of v.ledger.slice(start,end)){const {evidence,...fields}=item;console.log(JSON.stringify({...fields,evidence_units:[...new Set(evidence?.map(x=>x.unit))]}));}
}else if(op==='mark'){
 const [purpose,...files]=args;
 for(const rel of files){const f=path.resolve(project,rel);if(!f.startsWith(path.resolve(project)+path.sep))throw Error('Outside project');const text=fs.readFileSync(f,'utf8');fs.appendFileSync(stage+'/reading.jsonl',JSON.stringify({at:new Date().toISOString(),path:f,sha256:hash(f),range:'1-'+text.split(/\r?\n/).length,purpose,method:'FastCtx full text read by model; hash recorded afterwards',full_text_read:true})+'\n');}
 console.log(JSON.stringify({marked:files,purpose}));
}else if(op==='mark-support'){
 const [purpose,...files]=args;
 for(const rel of files){if(!rel.startsWith('.agents/skills/')&&rel!=='acceptance/20261016-hundred/command-runner.mjs')throw Error('Outside authorized support');const f=path.resolve(rel),t=fs.readFileSync(f,'utf8');fs.appendFileSync(stage+'/reading.jsonl',JSON.stringify({at:new Date().toISOString(),path:f,sha256:hash(f),range:'1-'+t.split(/\r?\n/).length,purpose,method:'FastCtx full text read by model; hash recorded afterwards',full_text_read:true})+'\n');}console.log(JSON.stringify({marked:files,purpose}));
}else if(op==='hash'){
 console.log(JSON.stringify(Object.fromEntries(args.map(rel=>[rel,hash(path.resolve(project,rel))])),null,2));
}else if(op==='count'){
 for(const rel of args){const t=fs.readFileSync(path.resolve(project,rel),'utf8');console.log(JSON.stringify({path:rel,han:(t.replace(/^#+[^\n]*(?:\n|$)/gm,'').match(/\p{Script=Han}/gu)??[]).length,sha256:hash(path.resolve(project,rel))}));}
}else throw Error('Unknown operation');
