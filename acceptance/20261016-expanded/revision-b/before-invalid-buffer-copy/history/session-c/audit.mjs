import fs from 'node:fs';
import crypto from 'node:crypto';
const b='acceptance/20261016-expanded/session-c',p='acceptance/20261016-expanded/works/潮汐信号';
const sha=v=>crypto.createHash('sha256').update(v).digest('hex');
const raw=fs.readFileSync(p+'/.writer/state.json'),s=JSON.parse(raw),before=JSON.parse(fs.readFileSync(b+'/recovery-sources.json','utf8'));
const problems=[],units=[],evidence=[];
for(const u of s.units){
 const bytes=fs.readFileSync(p+'/'+u.draft),text=bytes.toString('utf8'),hash=sha(bytes),han=(text.split('\n').slice(1).join('\n').match(/\p{Script=Han}/gu)||[]).length;
 units.push({unit:u.unit,draft:u.draft,sha256:hash,han,lines:text.split('\n').length});
 if(hash!==u.sha256)problems.push('draft hash '+u.unit);
 if(han<1500||han>2000)problems.push('han '+u.unit);
}
if(JSON.stringify(units.map(u=>u.unit))!==JSON.stringify(Array.from({length:12},(_,i)=>i+1)))problems.push('range');
for(const [id,e] of Object.entries(s.snapshot.ledger))for(const v of e.evidence??[]){
 const bytes=fs.readFileSync(p+'/'+v.draft),lines=bytes.toString('utf8').split(/\r?\n/);
 const ok=sha(bytes)===v.sha256&&(lines[v.line-1]??'').includes(v.quote);
 evidence.push({id,unit:v.unit,draft:v.draft,line:v.line,sha256:v.sha256,quote:v.quote,ok});if(!ok)problems.push('evidence '+id+' '+v.unit);
}
const retention=[];
for(const [id,old] of Object.entries(before.ledger)){
 const now=s.snapshot.ledger[id];
 const r={id,exists:!!now,old_evidence_preserved:(old.evidence??[]).every(v=>(now?.evidence??[]).some(x=>JSON.stringify(v)===JSON.stringify(x))),character_keys_preserved:Object.keys(old.character_known??{}).every(k=>Object.hasOwn(now?.character_known??{},k)),due_unchanged:old.due_unit===now?.due_unit,observation_unchanged:old.type!=='observation'||(old.statement===now?.statement&&old.author_truth===now?.author_truth)};
 retention.push(r);if(Object.values(r).some(v=>v===false))problems.push('retention '+id);
}
const unchanged=Object.entries(before.sources).filter(([q])=>q!=='.writer/state.json').map(([q,h])=>({path:q,ok:sha(fs.readFileSync(p+'/'+q))===h}));
if(unchanged.some(x=>!x.ok))problems.push('baseline sources changed');
const contexts=[9,10,11,12].map(u=>{const c=JSON.parse(fs.readFileSync(`${b}/context-${String(u).padStart(4,'0')}-meta.json`,'utf8'));return {unit:u,revision:c.revision,recall:c.recall};});
if(contexts.some(x=>x.recall.omitted_ids.length))problems.push('omitted recall IDs require audit');
const cli=fs.readdirSync(b+'/cli').filter(n=>n.endsWith('.json')).map(n=>({log:n,...JSON.parse(fs.readFileSync(b+'/cli/'+n,'utf8'))}));
const result={revision:s.revision,state_sha256:sha(raw),units,evidence_count:evidence.length,evidence,retention,unchanged,contexts,cli_count:cli.length,nonzero_cli:cli.filter(x=>x.exit_code!==0),ledger_count:Object.keys(s.snapshot.ledger).length,ledger:s.snapshot.ledger,characters:s.snapshot.characters,problems};
fs.writeFileSync(b+'/audit.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({revision:result.revision,state_sha256:result.state_sha256,units,ledger_count:result.ledger_count,evidence_count:result.evidence_count,retention,cli_count:result.cli_count,nonzero_cli:result.nonzero_cli,problems,characters:result.characters,ledger:Object.fromEntries(Object.entries(result.ledger).map(([id,e])=>[id,{type:e.type,status:e.status,due_unit:e.due_unit,custody:e.custody,reader_known:e.reader_known}]))},null,2));
process.exitCode=problems.length?1:0;
