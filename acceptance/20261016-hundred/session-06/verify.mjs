import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {createRunner} from '../command-runner.mjs';
const stage='acceptance/20261016-hundred/session-06',project='acceptance/20261016-hundred/works/潮汐信号',r=createRunner(stage);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const write=(file,data)=>fs.writeFileSync(path.join(stage,file),JSON.stringify(data,null,2)+'\n',{flag:'wx'});
const initial=r.json('status-full-initial'),final=r.json('status-full-final'),status=r.json('status-final'),check=r.json('check-final'),doctor=r.json('doctor-final'),exp=r.json('export-final');
assert.equal(r.last('status-final').label,'status-final');
assert.equal(status.revision,159);assert.equal(status.next_unit,61);assert.equal(status.draft_inventory.registered_count,60);assert.deepEqual(status.stale_units,[]);assert.deepEqual(status.changed_sources,[]);assert.deepEqual(check.rolling_review.pending_windows,[]);assert.equal(doctor.ok,true);
assert.deepEqual(exp.included_units,Array.from({length:60},(_,i)=>i+1));assert.deepEqual(exp.excluded_drafts,[]);assert.deepEqual(exp.warnings,[]);
const manuscript=fs.readFileSync(path.join(stage,'export/manuscript.md')),manifest=JSON.parse(fs.readFileSync(path.join(stage,'export/manifest.json'),'utf8'));
assert.equal(sha(manuscript),exp.sha256);assert.deepEqual(manifest.included_units,exp.included_units);
for(const unit of exp.units)assert.equal(sha(fs.readFileSync(path.join(project,unit.draft))),unit.sha256);
const A=initial.snapshot,B=final.snapshot,problems=[],oldDrafts=new Map();
let evidence_count=0,knowledge_count=0,observation_count=0,due_count=0;
const identity=e=>JSON.stringify([e.unit,e.quote,e.sha256,e.draft]);
for(const [id,a] of Object.entries(A.ledger)){
 const b=B.ledger[id];if(!b){problems.push('missing:'+id);continue;}
 if(a.type==='observation'){observation_count++;if(a.statement!==b.statement||JSON.stringify(a.author_truth)!==JSON.stringify(b.author_truth))problems.push('observation:'+id);}
 if(a.due_unit!==undefined){due_count++;if(a.due_unit!==b.due_unit)problems.push('due:'+id);}
 const counts=new Map();for(const e of b.evidence??[]){const key=identity(e);counts.set(key,(counts.get(key)??0)+1);}
 for(const e of a.evidence??[]){evidence_count++;const key=identity(e),c=counts.get(key)??0;if(c<1)problems.push('evidence:'+id+':'+key);else counts.set(key,c-1);if(e.draft&&e.sha256)oldDrafts.set(e.draft,e.sha256);}
 for(const [name,known] of Object.entries(a.character_known??{})){knowledge_count++;if(!b.character_known?.[name]?.includes(known))problems.push('knowledge:'+id+':'+name);}
}
for(const [name,known] of Object.entries(A.characters))if(!B.characters[name]?.includes(known))problems.push('character:'+name);
for(const [p,h] of oldDrafts)if(sha(fs.readFileSync(path.join(project,p)))!==h)problems.push('old-draft:'+p);
for(const id of ['T_SIGNAL','T_TAPE','T_HANDOVER','T_LAMP'])assert.equal(B.ledger[id].status,'resolved');
assert.equal(B.ledger.T_PRIVATE.status,'intentional-open');assert.equal(B.ledger.T_PRIVATE.author_truth,undefined);
assert.equal(B.ledger.T_HE_OLD_PAY.due_unit,56);assert.equal(B.ledger.T_KEEPER_SHARE.due_unit,56);
const chapters=[];
for(let unit=55;unit<=60;unit++){
 const rec=r.json('record-'+unit),template=JSON.parse(fs.readFileSync(path.join(stage,`template-${unit}.json`),'utf8')),input=JSON.parse(fs.readFileSync(path.join(stage,`record-${unit}.json`),'utf8'));
 const draft=template.draft,b=fs.readFileSync(path.join(project,draft)),body=b.toString('utf8').replace(/^\s*#{1,6}[^\n]*(?:\n|$)/gm,''),han=(body.match(/\p{Script=Han}/gu)??[]).length;
 assert.ok(han>=2400&&han<=3200,`${unit}: Han ${han}`);assert.equal(sha(b),rec.sha256);assert.deepEqual(template.source_hashes,input.source_hashes);assert.equal(template.expected_revision,input.expected_revision);
 chapters.push({unit,draft,han,expected_revision:template.expected_revision,revision:rec.revision,sha256:sha(b),source_hashes:template.source_hashes,record_input_sha256:sha(fs.readFileSync(path.join(stage,`record-${unit}.json`)))});
}
assert.deepEqual(problems,[]);
const related=new Set(Array.from({length:6},(_,i)=>JSON.parse(fs.readFileSync(path.join(stage,`plan-${55+i}.json`),'utf8')).recall_ids).flat());
const disposition=Object.fromEntries(Array.from({length:6},(_,i)=>{const unit=55+i,c=JSON.parse(fs.readFileSync(path.join(stage,`context-${unit}.json`),'utf8'));return [unit,(c.continuity?.recall?.omitted_ids??[]).map(id=>({id,disposition:related.has(id)?'本章未调用；本批相关章另有显式召回，旧正文见reading.jsonl':A.ledger[id]?.status==='resolved'?'已结旧项；本章不重开，原记录保留':'当前章不调用此物/观察/旧支线，不移物不加知情；保留现行记录'}))];}));
write('context-omitted-disposition.json',{nature:'逐项相关性处置记录；分类脚本不替代正文语义阅读',units:disposition});
const audit={ok:true,scope:'mechanical-preservation-and-export-only',revision:status.revision,state_sha256:sha(fs.readFileSync(path.join(project,'.writer/state.json'))),chapters,export:{directory:exp.output,included_units:exp.included_units,count:exp.included_units.length,excluded_drafts:exp.excluded_drafts,warnings:exp.warnings,sha256:sha(manuscript),manifest_sha256:sha(fs.readFileSync(path.join(stage,'export/manifest.json')))},preservation:{initial_ledger_count:Object.keys(A.ledger).length,final_ledger_count:Object.keys(B.ledger).length,old_evidence_occurrences:evidence_count,old_character_known_fields:knowledge_count,old_character_states:Object.keys(A.characters).length,immutable_observations:observation_count,unchanged_due_fields:due_count,old_draft_hash_coverage:oldDrafts.size,problems},check,doctor,exact_status_label:r.last('status-final').label,git_status:r.last('git-status-final').stdout};
write('audit-final.json',audit);
console.log(JSON.stringify({ok:audit.ok,revision:audit.revision,state_sha256:audit.state_sha256,chapters:chapters.map(({unit,han,revision,sha256})=>({unit,han,revision,sha256})),preservation:audit.preservation,export:audit.export,exact_status_label:audit.exact_status_label},null,2));
