import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRunner} from '../command-runner.mjs';
export const runner=createRunner('acceptance/20261016-hundred/session-12');
export const project='acceptance/20261016-hundred/works/潮汐信号';
export const stage='acceptance/20261016-hundred/session-12';
export const hash=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
export const cli=(label,args)=>runner.run(process.execPath,['bin/ai-writer.mjs',...args,'--project',project],label);
const [mode,...args]=process.argv.slice(2);
if(mode==='batch')for(const job of JSON.parse(fs.readFileSync(args[0],'utf8'))){const r=cli(job.label,job.args); console.log(JSON.stringify({label:r.label,exit_code:r.exit_code,files:r.files}));}
if(mode==='show'){const r=runner.last(args[0]);console.log(r.stdout);console.error(r.stderr);}
if(mode==='reading'){
 const spec=JSON.parse(fs.readFileSync(args[0],'utf8'));
 for(const x of spec){const f=path.join(project,x.path);const t=fs.readFileSync(f,'utf8');fs.appendFileSync(stage+'/reading.jsonl',JSON.stringify({at:new Date().toISOString(),path:x.path,sha256:hash(f),range:x.range??`full:1-${t.split(/\r?\n/).length}`,purpose:x.purpose,method:'actual full text inspection in model context; hash recorded after reading'})+'\n');}
 console.log(JSON.stringify({recorded:spec.length,elapsed_s:(Date.now()-Date.parse(JSON.parse(fs.readFileSync(stage+'/start.json')).started_at))/1000}));
}
if(mode==='keys'){const s=runner.json(args[0]);console.log(JSON.stringify({keys:Object.keys(s),current_keys:Object.keys(s.current??{}),snapshot_keys:Object.keys(s.snapshot??{})}));}
if(mode==='ledger'){const s=runner.json(args[0]);const current=s.current??s.snapshot; console.log(JSON.stringify(current,null,2));}
if(mode==='active'){
 const s=runner.json(args[0]);const ledger=s.snapshot.ledger;const out={};
 for(const [id,x] of Object.entries(ledger))if(x.status!=='resolved')out[id]={type:x.type,status:x.status,due:x.due_unit,statement:x.statement,reader_known:x.reader_known,character_known:Object.fromEntries(Object.entries(x.character_known??{}).map(([k,v])=>[k,v.split('；历史有效信息')[0]])),custody:x.custody,evidence:x.evidence?.map(e=>({unit:e.unit,draft:e.draft,quote:e.quote}))};
 fs.writeFileSync(stage+'/active-ledger-recovery.json',JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify(out,null,2));
}
if(mode==='table'){
 const s=runner.json(args[0]);console.log(JSON.stringify(Object.entries(s.snapshot.ledger).filter(([id,x])=>x.status!=='resolved').map(([id,x])=>({id,status:x.status,due:x.due_unit,statement:x.statement,current:x.reader_known,custody:x.custody})),null,2));
}
if(mode==='anchors')for(const label of args){const s=runner.json(label); console.log(JSON.stringify({label,query:s.query,total:s.total,matches:s.matches.map(m=>({id:m.id,kind:m.kind,statement:m.entry?.statement,reader_known:m.entry?.reader_known,custody:m.entry?.custody,evidence:m.entry?.evidence,unit:m.unit,draft:m.draft,summary:m.summary}))},null,2));}
if(mode==='recovery'){
 const rows=fs.readFileSync(stage+'/reading.jsonl','utf8').trim().split('\n').map(JSON.parse);
 const state=project+'/.writer/state.json';
 let body=fs.readFileSync(stage+'/recovery-body.md','utf8');
 body+='\n## 恢复版本与来源哈希\n\n当前状态SHA256：`'+hash(state)+'`；revision338。CLI初始输出见commands索引精确label status-initial/check-initial/outline-91/status-full-recovery。\n\n|实读来源|SHA256|范围|\n|---|---|---|\n'+rows.map(x=>`|${x.path}|${x.sha256}|${x.range}|`).join('\n')+'\n';
 fs.writeFileSync(stage+'/recovery.md',body);fs.copyFileSync(state,stage+'/state-initial.json');
 console.log(JSON.stringify({recovery_sha256:hash(stage+'/recovery.md'),state_sha256:hash(state),elapsed_s:(Date.now()-Date.parse(JSON.parse(fs.readFileSync(stage+'/start.json')).started_at))/1000}));
}
if(mode==='context-digest'){
 const c=runner.json(`context-${args[0]}-cli`);
 const slim=v=>{if(typeof v==='string')return v.split(/；(?:历史有效|保留至|截至第|此前知情)/)[0];if(Array.isArray(v))return v.map(slim);if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,slim(x)]));return v;};
 console.log(JSON.stringify(slim({...c,settings:Object.keys(c.settings??{}),source_hashes:c.source_hashes}),null,2));
}
if(mode==='count')for(const unit of args){const p=JSON.parse(fs.readFileSync(stage+`/plan-${unit}.json`));const f=project+'/'+p.draft;const t=fs.readFileSync(f,'utf8');const han=(t.replace(/^\s*#+.*$/gm,'').match(/\p{Script=Han}/gu)??[]).length;console.log(JSON.stringify({unit:Number(unit),draft:p.draft,han,sha256:hash(f)}));}
if(mode==='context-brief'){
 const c=runner.json(args[1]??`context-${args[0]}-cli`);const ck=c.continuity;
 const trim=v=>typeof v==='string'?v.split(/；(?:历史有效|保留至|截至第|此前知情)/)[0]:v;
 console.log(JSON.stringify({unit:c.unit,revision:c.revision,cast:c.plan.cast,characters:Object.fromEntries(Object.entries(c.snapshot.characters).map(([k,v])=>[k,trim(v)])),selected:Object.keys(ck.author),reader:ck.reader,known:Object.fromEntries(Object.entries(ck.characters).map(([n,x])=>[n,Object.fromEntries(Object.entries(x).map(([k,v])=>[k,trim(v)]))])),omitted_ids:ck.recall.omitted_ids,source_hashes:c.source_hashes},null,2));
}
if(mode==='replay-context-proof'){
 const before=JSON.parse(fs.readFileSync(stage+'/repair-95/context-96-invalidated.json'));const after=JSON.parse(fs.readFileSync(stage+'/context-96.json'));
 console.log(JSON.stringify({before_revision:before.revision,current_revision:after.revision,source_hashes:after.source_hashes,corrected_reader:after.continuity.reader.P_QIU_SINGLE_27,corrected_shen:after.continuity.characters['沈禾'].P_QIU_SINGLE_27}));
}
