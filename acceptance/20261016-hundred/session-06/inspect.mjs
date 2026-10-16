import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRunner} from '../command-runner.mjs';
const stage='acceptance/20261016-hundred/session-06';
const project='acceptance/20261016-hundred/works/潮汐信号';
const runner=createRunner(stage),action=process.argv[2];
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
if(action==='overview'){
 const s=runner.json('status-full-initial').snapshot;
 console.log(JSON.stringify(Object.fromEntries(Object.entries(s.ledger).filter(([,v])=>v.status!=='resolved').map(([k,v])=>[k,{status:v.status,due:v.due_unit,statement:v.statement,custody:v.custody}])),null,2));
}
if(action==='ledger'){
 const full=runner.json('status-full-initial'),s=full.snapshot;
 console.log(JSON.stringify({keys:Object.keys(s),characters:Object.fromEntries(Object.entries(s.characters).map(([k,v])=>[k,v.split('；保留')[0].split('；历史')[0].split('；截至')[0]])),ledger:Object.fromEntries(Object.entries(s.ledger).filter(([,v])=>v.status!=='resolved').slice(Number(process.argv[3]??0),Number(process.argv[3]??0)+20).map(([k,v])=>[k,{type:v.type,status:v.status,due_unit:v.due_unit,statement:v.statement,custody:v.custody,first:v.evidence?.[0],latest:v.evidence?.at(-1)}]))},null,2));
}
if(action==='audit'){
 const input=JSON.parse(fs.readFileSync(process.argv[3],'utf8'));
 for(const e of input){const f=path.resolve(project,e.path),b=fs.readFileSync(f);fs.appendFileSync(path.join(stage,'reading.jsonl'),JSON.stringify({at:new Date().toISOString(),path:f,sha256:sha(b),range:e.range??'全文',purpose:e.purpose,method:e.method??'FastCtx read 完整输出后确认',full_text_read:true})+'\n');}
 console.log(JSON.stringify({acknowledged:input.length}));
}
if(action==='recall-batch')for(const id of process.argv.slice(3)){const r=runner.run(process.execPath,['bin/ai-writer.mjs','recall','--project',project,'--query',id,'--limit','5'],'recall-'+id);console.log(r.stdout);if(r.exit_code)process.exitCode=r.exit_code;}
if(action==='recall-select')for(const id of process.argv.slice(3)){
 const r=runner.run(process.execPath,['bin/ai-writer.mjs','recall','--project',project,'--query',id,'--limit','100'],'recall-'+id);
 if(r.exit_code){console.log(r);process.exitCode=r.exit_code;continue;}
 const data=JSON.parse(r.stdout),entry=data.matches.find(x=>x.kind==='ledger'&&x.id===id)?.entry;
 console.log(JSON.stringify({id,total:data.total,entry:entry&&{type:entry.type,status:entry.status,statement:entry.statement,due_unit:entry.due_unit,custody:entry.custody,reader_known:entry.reader_known,character_known:Object.fromEntries(Object.entries(entry.character_known??{}).map(([k,v])=>[k,v.split('；保留')[0].split('；历史')[0].split('；截至')[0]])),evidence:entry.evidence}},null,2));
}
