import fs from 'node:fs';
import crypto from 'node:crypto';
const b='acceptance/20261016-expanded/session-b';
const p='acceptance/20261016-expanded/works/潮汐信号';
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const stateBytes=fs.readFileSync(`${p}/.writer/state.json`);
const s=JSON.parse(stateBytes);
const initial=JSON.parse(fs.readFileSync(`${b}/initial-evidence.json`,'utf8'));
const findings=[];
const units=s.units.map(u=>{
 const bytes=fs.readFileSync(`${p}/${u.draft}`),t=bytes.toString('utf8');
 const actual=hash(bytes),han=(t.replace(/^#.*\r?\n/u,'').match(/\p{Script=Han}/gu)||[]).length;
 if(actual!==u.sha256)findings.push(`draft hash mismatch: ${u.unit}`);
 if(u.unit<=4&&initial.files[u.draft]!==actual)findings.push(`initial draft changed: ${u.unit}`);
 if(u.unit>=5&&(han<1500||han>2000))findings.push(`length out of scope: ${u.unit}`);
 return {unit:u.unit,draft:u.draft,sha256:actual,han,lines:t.split(/\r?\n/).length,recorded_revision:u.unit>=5?JSON.parse(fs.readFileSync(`${b}/record-template-${String(u.unit).padStart(4,'0')}.json`,'utf8')).expected_revision+1:null};
});
let anchors=0;
for(const [id,e] of Object.entries(s.snapshot.ledger))for(const v of e.evidence||[]){
 anchors++;
 const bytes=fs.readFileSync(`${p}/${v.draft}`),lines=bytes.toString('utf8').split(/\r?\n/);
 if(hash(bytes)!==v.sha256||!lines[v.line-1]?.includes(v.quote))findings.push(`anchor mismatch: ${id}/${v.unit}/${v.line}`);
}
const preservation=[];
for(const [id,e] of Object.entries(initial.ledger)){
 const n=s.snapshot.ledger[id];
 const row={id,exists:!!n,evidence_preserved:(e.evidence||[]).every(v=>(n?.evidence||[]).some(w=>JSON.stringify(v)===JSON.stringify(w))),known_people_preserved:Object.keys(e.character_known||{}).every(k=>Object.hasOwn(n?.character_known||{},k)),due_unchanged:e.due_unit===n?.due_unit,observation_statement_unchanged:e.type!=='observation'||e.statement===n?.statement};
 preservation.push(row);
 if(Object.values(row).some(v=>v===false))findings.push(`initial ledger preservation mismatch: ${id}`);
}
const prewrites=[];
for(let unit=5;unit<=8;unit++){
 const key=String(unit).padStart(4,'0'),template=JSON.parse(fs.readFileSync(`${b}/record-template-${key}.json`,'utf8')),record=JSON.parse(fs.readFileSync(`${b}/record-${key}.json`,'utf8')),context=JSON.parse(fs.readFileSync(`${b}/context-${key}.json`,'utf8'));
 const row={unit,revision:template.expected_revision,state_sha256:template.source_hashes['.writer/state.json'],record_kept_template_sources:JSON.stringify(template.source_hashes)===JSON.stringify(record.source_hashes),context_matches_template:JSON.stringify(context.source_hashes)===JSON.stringify(template.source_hashes),omitted_ids:context.continuity.recall.omitted_ids};
 prewrites.push(row);if(!row.record_kept_template_sources||!row.context_matches_template)findings.push(`prewrite mismatch: ${unit}`);
}
const sourceRefs=[...new Set(s.units.flatMap(u=>Object.keys(u.source_hashes)).filter(r=>r!=='.writer/state.json'))];
const sources=Object.fromEntries(sourceRefs.map(r=>[r,hash(fs.readFileSync(`${p}/${r}`))]));
const result={time:new Date().toISOString(),revision:s.revision,state_sha256:hash(stateBytes),units,ledger_count:Object.keys(s.snapshot.ledger).length,anchors_checked:anchors,preservation,prewrites,sources,findings,scope:'mechanical evidence audit; does not replace full reading'};
fs.writeFileSync(`${b}/audit.json`,JSON.stringify(result,null,2)+'\n');
fs.writeFileSync(`${b}/current-ledger.jsonl`,Object.entries(s.snapshot.ledger).map(([id,entry])=>JSON.stringify({id,entry})).join('\n')+'\n');
fs.writeFileSync(`${b}/current-characters.json`,JSON.stringify(s.snapshot.characters,null,2)+'\n');
console.log(JSON.stringify({revision:s.revision,units:units.map(({unit,han,recorded_revision})=>({unit,han,recorded_revision})),ledger_count:result.ledger_count,anchors_checked:anchors,findings}));
if(findings.length)process.exitCode=1;
