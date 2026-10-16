import fs from 'node:fs';
import crypto from 'node:crypto';
const base='acceptance/20261016-hundred',label=process.argv[2];
if(!/^[a-z0-9-]+$/.test(label??''))throw Error('summarize <unique snapshot label>');
const state=JSON.parse(fs.readFileSync(`${base}/works/潮汐信号/.writer/state.json`));
const phases=[];
for(const name of fs.readdirSync(base)){
 const p=`${base}/${name}/process-result.json`;if(!fs.existsSync(p))continue;
 const process=JSON.parse(fs.readFileSync(p));
 const events=fs.readFileSync(`${base}/${name}/events.jsonl`,'utf8').split(/\r?\n/).filter(Boolean).flatMap(s=>{try{return[JSON.parse(s)]}catch{return[]}});
 const auditFile=`${base}/audits/${name}.json`,audit=fs.existsSync(auditFile)?JSON.parse(fs.readFileSync(auditFile)):null;
 phases.push({phase:name,thread_id:events.find(x=>x.type==='thread.started')?.thread_id??null,completed_turn:events.some(x=>x.type==='turn.completed'),usage:events.findLast(x=>x.type==='turn.completed')?.usage??null,process,audit:audit?{ok:audit.ok,revision:audit.revision,units:audit.units,han:audit.han,checks:audit.check_count,evidence:audit.evidence_count}:null});
}
const drafts=state.units.map(u=>{const bytes=fs.readFileSync(`${base}/works/潮汐信号/${u.draft}`),text=bytes.toString('utf8').replace(/^\uFEFF/,'').replace(/^#.*\r?\n/,'');return{unit:u.unit,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),han:(text.match(/\p{Script=Han}/gu)??[]).length}});
const completed=phases.filter(x=>x.process.exit_code===0&&x.completed_turn),threads=completed.map(x=>x.thread_id),newDrafts=drafts.filter(x=>x.unit>24);
const summary={generated_at:new Date().toISOString(),scope:'Current checkpoint, not final acceptance until all planned work is done',revision:state.revision,units:state.units.length,total_han:drafts.reduce((n,x)=>n+x.han,0),new_units:newDrafts.length,new_han:newDrafts.reduce((n,x)=>n+x.han,0),new_min_han:Math.min(...newDrafts.map(x=>x.han)),new_max_han:Math.max(...newDrafts.map(x=>x.han)),completed_native_processes:completed.length,unique_threads:new Set(threads).size,native_elapsed_s:completed.reduce((n,x)=>n+x.process.elapsed_s,0),failed_native_processes:phases.filter(x=>x.process.exit_code!==0).map(x=>x.phase),phases,drafts};
fs.writeFileSync(`${base}/summary-${label}.json`,JSON.stringify(summary,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({label,revision:summary.revision,units:summary.units,han:summary.total_han,new_han:summary.new_han,completed:completed.length,threads:summary.unique_threads,failed:summary.failed_native_processes}));
