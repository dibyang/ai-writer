const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const b=__dirname,p=path.resolve(b,'../works/潮汐信号'),hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const old=JSON.parse(fs.readFileSync(path.join(b,'baseline-state-r59.json'))),raw=fs.readFileSync(path.join(p,'.writer/state.json')),s=JSON.parse(raw);
const failures=[],diff=[],allEvidence=[];
for(const[id,o]of Object.entries(old.snapshot.ledger)){
 const e=s.snapshot.ledger[id];if(!e){failures.push('missing '+id);continue;}
 const missing=o.evidence.filter(x=>!e.evidence.some(y=>JSON.stringify(x)===JSON.stringify(y)));
 const lostKnown=Object.entries(o.character_known||{}).filter(([n,v])=>!e.character_known?.[n]?.includes(v)).map(([n])=>n);
 if(missing.length||lostKnown.length||o.statement!==e.statement||o.due_unit!==e.due_unit)failures.push('ledger preservation '+id);
 diff.push({id,old_status:o.status,new_status:e.status,old_evidence:o.evidence.length,new_evidence:e.evidence.length,missing_old_evidence:missing,lost_character_known:lostKnown,statement_unchanged:o.statement===e.statement,due_unchanged:o.due_unit===e.due_unit,old_custody:o.custody,new_custody:e.custody});
}
for(const[n,v]of Object.entries(old.snapshot.characters))if(!s.snapshot.characters[n]?.includes(v))failures.push('character lost '+n);
for(const[id,e]of Object.entries(s.snapshot.ledger))for(const v of e.evidence){const buf=fs.readFileSync(path.join(p,v.draft)),text=buf.toString('utf8'),line=text.split(/\r?\n/)[v.line-1];const ok=hash(buf)===v.sha256&&line?.includes(v.quote);if(!ok)failures.push('evidence '+id+' '+v.unit+' '+v.line);allEvidence.push({id,...v,valid:ok});}
const counts=s.units.map(u=>{const buf=fs.readFileSync(path.join(p,u.draft)),t=buf.toString('utf8');return {unit:u.unit,draft:u.draft,sha256:hash(buf),han:(t.split(/\r?\n/).slice(1).join('\n').match(/\p{Script=Han}/gu)||[]).length};});
for(const c of counts.filter(c=>c.unit>=21))if(c.han<1500||c.han>2000)failures.push('han '+c.unit);
for(let n=21;n<=24;n++){const t=JSON.parse(fs.readFileSync(path.join(b,`cli/template-${n}.stdout.txt`))),c=JSON.parse(fs.readFileSync(path.join(b,`cli/context-${n}.stdout.txt`))),r=JSON.parse(fs.readFileSync(path.join(b,`record-${n}.json`)));if(JSON.stringify(t.source_hashes)!==JSON.stringify(r.source_hashes)||JSON.stringify(t.source_hashes)!==JSON.stringify(c.source_hashes)||t.expected_revision!==c.revision||r.expected_revision!==t.expected_revision)failures.push('write provenance '+n);}
const result={scope:'mechanical-evidence-and-preservation-only',revision:s.revision,state_sha256:hash(raw),baseline_state_sha256:hash(fs.readFileSync(path.join(b,'baseline-state-r59.json'))),old_ledger_count:Object.keys(old.snapshot.ledger).length,current_ledger_count:Object.keys(s.snapshot.ledger).length,evidence_count:allEvidence.length,all_evidence_valid:allEvidence.every(x=>x.valid),baseline_units_unchanged:old.units.every((u,i)=>u.sha256===s.units[i].sha256),failures,counts,diff};
fs.writeFileSync(path.join(b,'audit-current.json'),JSON.stringify(result,null,2)+'\n');fs.writeFileSync(path.join(b,'evidence-current.json'),JSON.stringify(allEvidence,null,2)+'\n');fs.writeFileSync(path.join(b,'final-state-r'+s.revision+'.json'),raw);
console.log(JSON.stringify({...result,counts:counts.filter(c=>c.unit>=21),diff:undefined},null,2));if(failures.length)process.exitCode=1;
