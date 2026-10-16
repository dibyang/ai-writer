import fs from 'node:fs';
import crypto from 'node:crypto';
import {createRunner} from '../command-runner.mjs';
const stage='acceptance/20261016-hundred/session-13', project='acceptance/20261016-hundred/works/潮汐信号';
const r=createRunner(stage), hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const a=read(stage+'/baseline/state-initial.json'),b=read(project+'/.writer/state.json');
const rows=fs.readFileSync(r.index,'utf8').trim().split('\n').map(JSON.parse);
const statusMeta=r.last('status-final');
if(statusMeta.label!=='status-final'||statusMeta.executable!=='node'||statusMeta.argv[0]!=='bin/ai-writer.mjs'||statusMeta.argv[1]!=='status')throw Error('status identity');
const status=r.json('status-final'),check=r.json('check-final'),doctor=r.json('doctor-final'),exp=r.json('export-final');
if(!status.ok||status.revision!==350||status.next_unit!==101||status.draft_inventory.registered_count!==100||status.changed_sources.length||status.stale_units.length||check.findings.length||check.rolling_review.pending_windows.length||!doctor.ok)throw Error('final CLI checks');
if(exp.included_units.length!==100||exp.included_units.some((x,i)=>x!==i+1)||exp.excluded_drafts.length||exp.warnings.length)throw Error('export inventory');
const manifest=read(stage+'/export/manifest.json'),manuscript=fs.readFileSync(stage+'/export/manuscript.md');
if(hash(manuscript)!==exp.sha256)throw Error('export hash');
let previousUnitsUnchanged=true;
for(const [id,u]of Object.entries(a.units)){if(JSON.stringify(u)!==JSON.stringify(b.units[id]))previousUnitsUnchanged=false;}
const lostEvidence=[],changedDue=[],lostOldKnowledge=[];
const evidenceKey=(id,x)=>JSON.stringify([id,x.unit,x.quote,x.sha256,x.draft]);
for(const [id,old]of Object.entries(a.snapshot.ledger)){
 const cur=b.snapshot.ledger[id];if(!cur)throw Error('missing ledger '+id);
 if(old.due_unit!==cur.due_unit)changedDue.push(id);
 const now=new Set((cur.evidence??[]).map(x=>evidenceKey(id,x)));
 for(const e of old.evidence??[])if(!now.has(evidenceKey(id,e)))lostEvidence.push({id,e});
 for(const [name,k]of Object.entries(old.character_known??{}))if(!cur.character_known?.[name]?.includes(k))lostOldKnowledge.push({id,name});
}
if(!previousUnitsUnchanged||lostEvidence.length||changedDue.length||lostOldKnowledge.length)throw Error('historical preservation invariant');
const chapters=[];
for(let n=97;n<=100;n++){
 const entry=Object.values(b.units).find(x=>x.unit===n)??b.units[String(n)];
 const template=read(stage+'/'+(n===98?'template-98-cast-before.json':`template-${n}-before.json`));
 const rec=read(stage+`/record-${n}.json`),buf=fs.readFileSync(project+'/'+rec.draft);
 const han=(buf.toString('utf8').replace(/^#.*$/gm,'').match(/\p{Script=Han}/gu)??[]).length;
 if(han<2400||han>3200)throw Error('Han '+n);
 const ej=exp.units.find(x=>x.unit===n);if(ej.sha256!==hash(buf))throw Error('chapter export hash '+n);
 if(JSON.stringify(template.source_hashes)!==JSON.stringify(rec.source_hashes)||rec.expected_revision!==template.expected_revision)throw Error('template preservation');
 chapters.push({unit:n,draft:rec.draft,han,sha256:hash(buf),before_revision:template.expected_revision,after_revision:template.expected_revision+1,source_hashes:template.source_hashes,template_sha256:hash(fs.readFileSync(stage+'/'+(n===98?'template-98-cast-before.json':`template-${n}-before.json`))),record_sha256:hash(fs.readFileSync(stage+`/record-${n}.json`)),registered:entry});
}
for(const u of exp.units)if(hash(fs.readFileSync(project+'/'+u.draft))!==u.sha256)throw Error('source export mismatch '+u.unit);
const reading=fs.readFileSync(stage+'/reading.jsonl','utf8').trim().split('\n').map(JSON.parse);
const contexts=[];
for(let n=97;n<=100;n++){
 const label=n===98?'context-98-cast':`context-${n}`;
 const j=r.json(label);contexts.push({unit:n,label,keys:Object.keys(j),continuity_keys:Object.keys(j.continuity??{}),continuity:j.continuity});
}
const out={started_at:read(stage+'/start.json').iso??read(stage+'/start.json').started_at,verified_at:new Date().toISOString(),elapsed_s:(Date.now()-read(stage+'/start.json').epoch_ms)/1000,initial_revision:a.revision,revision:b.revision,initial_state_sha256:hash(fs.readFileSync(stage+'/baseline/state-initial.json')),final_state_sha256:hash(fs.readFileSync(project+'/.writer/state.json')),status,check,doctor,final_command_metadata:{status:statusMeta,check:r.last('check-final'),doctor:r.last('doctor-final'),export:r.last('export-final')},chapters,preservation:{previous_units_1_96_unchanged:previousUnitsUnchanged,lost_evidence:lostEvidence,changed_due:changedDue,lost_old_character_known:lostOldKnowledge,method:'evidence identity = ID+unit+quote+version hash+draft, not line'},export:{count:exp.included_units.length,included_units:exp.included_units,excluded_drafts:exp.excluded_drafts,warnings:exp.warnings,manuscript_sha256:hash(manuscript),manifest_sha256:hash(fs.readFileSync(stage+'/export/manifest.json')),manifest_keys:Object.keys(manifest)},reading:{events:reading.length,unique_paths:[...new Set(reading.map(x=>x.path))],unique_versions:[...new Set(reading.map(x=>x.path+' '+x.sha256))].length},failed_commands:rows.filter(x=>x.exit_code!==0),command_count_before_audit:rows.length,contexts};
for(const x of Object.values(out.final_command_metadata)){delete x.stdout;delete x.stderr;}
fs.writeFileSync(stage+'/final-audit.json',JSON.stringify(out,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({...out,contexts:contexts.map(({continuity,...x})=>({...x,continuity_counts:Object.fromEntries(Object.entries(continuity??{}).map(([k,v])=>[k,Array.isArray(v)?v.length:typeof v]))})),chapters:chapters.map(({registered,source_hashes,...x})=>({...x,journal:registered?.journal})),final_command_metadata:undefined},null,2));
