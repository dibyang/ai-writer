import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {replaySnapshots} from './rebuild-utils.mjs';
const b='acceptance/20261016-hundred',phase=`${b}/session-10`,root=`${b}/checkpoints/session-10/files`,read=p=>JSON.parse(fs.readFileSync(p,'utf8')),hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const state=read(`${root}/.writer/state.json`),audit=read(`${b}/audits/session-10.json`);assert(audit.ok&&audit.units===84&&state.units.length===84);assert.equal(read(`${phase}/process-result.json`).exit_code,0);
const snapshots=replaySnapshots(root,state),index=fs.readFileSync(`${phase}/commands/index.jsonl`,'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse),rows=[],copies=[];
for(let n=79;n<=84;n++){
 const source=`${phase}/input-${n}.json`,bytes=fs.readFileSync(source),input=JSON.parse(bytes),unit=state.units[n-1],snapshot=snapshots[n],c=input.changes;assert(c);
 assert.equal(input.unit,n);assert.equal(input.draft,unit.draft);assert.equal(input.summary,unit.summary);assert.deepEqual(input.source_hashes,unit.source_hashes);
 const body=fs.readFileSync(`${root}/${unit.draft}`);assert.equal(hash(body),unit.sha256);
 for(const[name,value]of Object.entries(c.characters??{}))assert.equal(snapshot.characters[name],value,`Actual character differs: ${n}/${name}`);
 for(const name of c.retire_characters??[])assert(!Object.hasOwn(snapshot.characters,name));
 assert.deepEqual(snapshot.timeline,[...snapshots[n-1].timeline,...(c.timeline_append??[])]);
 if(Object.hasOwn(c,'threads'))assert.deepEqual(snapshot.threads,c.threads);
 let ledgerFields=0,anchors=0;
 for(const[id,delta]of Object.entries(c.ledger??{})){const actual=snapshot.ledger[id];assert(actual);for(const[key,value]of Object.entries(delta)){
  if(key==='previous_holder')continue;
  if(key==='evidence'){for(const e of value){assert(actual.evidence.some(x=>x.unit===e.unit&&x.quote===e.quote&&x.sha256===state.units[e.unit-1].sha256));anchors++;}}
  else if(key==='character_known'){for(const[name,text]of Object.entries(value)){assert.equal(actual.character_known[name],text,`Actual knowledge differs: ${n}/${id}/${name}`);ledgerFields++;}}
  else{assert.deepEqual(actual[key],value,`Actual ledger field differs: ${n}/${id}/${key}`);ledgerFields++;}
 }}
 const command=index.findLast(x=>x.exit_code===0&&x.argv?.[0]?.replaceAll('\\','/').endsWith('bin/ai-writer.mjs')&&x.argv.includes('record')&&x.argv.some(a=>a.replaceAll('\\','/').endsWith(`/input-${n}.json`)));assert(command,`No actual successful CLI record ${n}`);
 const output=read(command.files.stdout);assert(output.ok);assert.equal(output.revision,input.expected_revision+1);
 if(n>=83){const draft=read(`${phase}/changes-${n}.json`);for(const[name,text]of Object.entries(draft.changes.characters))assert(snapshot.characters[name].startsWith(text),'Current field prefix differs from the exact draft the parent read');for(const[id,delta]of Object.entries(draft.changes.ledger)){const actual=snapshot.ledger[id];for(const[key,value]of Object.entries(delta)){if(key==='evidence'){for(const e of value)assert(actual.evidence.some(x=>x.unit===e.unit&&x.quote===e.quote));}else if(key==='character_known'){for(const[name,text]of Object.entries(value))assert(actual.character_known[name].startsWith(text));}else assert.deepEqual(actual[key],value,`Exact parent-read draft differs: ${n}/${id}/${key}`);}}}
 rows.push({unit:n,input:source,input_sha256:hash(bytes),body_sha256:unit.sha256,successful_record_metadata:command.files.metadata,record_revision:output.revision,characters_bound:Object.keys(c.characters??{}).length,ledger_fields_bound:ledgerFields,evidence_bound:anchors});copies.push({name:`input-${n}.json`,bytes});
}
const dir=`${b}/input-bindings/session-10`;assert(!fs.existsSync(dir));fs.mkdirSync(dir,{recursive:true});for(const c of copies)fs.writeFileSync(`${dir}/${c.name}`,c.bytes,{flag:'wx'});
const result={at:new Date().toISOString(),ok:true,scope:'Actual successful native CLI input and per-unit journal binding, not semantic or literary approval',revision:state.revision,units:84,rows};fs.writeFileSync(`${dir}/proof.json`,JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({ok:true,inputs:rows.length,characters:rows.reduce((a,r)=>a+r.characters_bound,0),ledger_fields:rows.reduce((a,r)=>a+r.ledger_fields_bound,0),anchors:rows.reduce((a,r)=>a+r.evidence_bound,0)}));
