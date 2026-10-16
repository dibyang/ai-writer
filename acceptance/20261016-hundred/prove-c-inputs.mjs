import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { replaySnapshots } from './rebuild-utils.mjs';
const base='acceptance/20261016-hundred',phase=`${base}/revision-c`,root=`${base}/checkpoints/revision-c/files`,read=p=>JSON.parse(fs.readFileSync(p,'utf8')),hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const state=read(`${root}/.writer/state.json`),snapshots=replaySnapshots(root,state),transitions=read(`${phase}/final-transitions.json`),index=fs.readFileSync(`${phase}/commands/index.jsonl`,'utf8').trim().split(/\r?\n/).map(JSON.parse),rows=[];
assert.equal(read(`${phase}/process-result.json`).exit_code,0);assert.equal(state.units.length,90);assert.equal(transitions.length,50);
for(let n=41;n<=90;n++){
 const source=`${phase}/inputs/${n}.json`,input=read(source),unit=state.units[n-1],snapshot=snapshots[n],c=input.changes,t=transitions.find(x=>x.unit===n);assert(c&&t);
 assert.equal(input.unit,n);assert.equal(input.draft,unit.draft);assert.equal(input.summary,unit.summary);assert.deepEqual(input.source_hashes,unit.source_hashes);assert.equal(hash(source),t.input_sha256);assert.equal(hash(`${root}/${unit.draft}`),unit.sha256);
 for(const[name,text]of Object.entries(c.characters??{}))assert.equal(snapshot.characters[name],text,`${n}/${name}`);
 for(const name of c.retire_characters??[])assert(!Object.hasOwn(snapshot.characters,name));
 assert.deepEqual(snapshot.timeline,[...snapshots[n-1].timeline,...(c.timeline_append??[])]);if(Object.hasOwn(c,'threads'))assert.deepEqual(snapshot.threads,c.threads);
 let fields=0,anchors=0;
 for(const[id,delta]of Object.entries(c.ledger??{})){const actual=snapshot.ledger[id];assert(actual,id);for(const[key,value]of Object.entries(delta)){
  if(key==='previous_holder')continue;
  if(key==='evidence'){for(const e of value){assert(actual.evidence.some(a=>a.unit===e.unit&&a.quote===e.quote&&a.sha256===state.units[e.unit-1].sha256));anchors++;}}
  else if(key==='character_known'){for(const[name,text]of Object.entries(value)){assert.equal(actual.character_known[name],text,`${n}/${id}/${name}`);fields++;}}
  else{assert.deepEqual(actual[key],value,`${n}/${id}/${key}`);fields++;}
 }}
 const command=index.findLast(x=>x.exit_code===0&&x.argv?.[0]?.replaceAll('\\','/').endsWith('bin/ai-writer.mjs')&&x.argv.includes('record')&&x.argv.some(a=>a.replaceAll('\\','/').endsWith(`/revision-c/inputs/${n}.json`)));assert(command,`Actual CLI missing ${n}`);
 const output=read(command.files.stdout);assert(output.ok);assert.equal(output.revision,input.expected_revision+1);assert.equal(output.revision,t.revision);assert.equal(input.expected_revision,t.expected_revision);
 rows.push({unit:n,input:source,input_sha256:hash(source),body_sha256:unit.sha256,metadata:command.files.metadata,revision:output.revision,characters_bound:Object.keys(c.characters??{}).length,ledger_fields_bound:fields,anchors_bound:anchors});
}
const result={ok:true,scope:'Independent final 50 actual successful native record inputs, raw CLI results and per-unit journal field binding; not a literary pass',revision:state.revision,rows};fs.writeFileSync(`${base}/revision-c-parent-reading/input-proof.json`,JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({ok:true,inputs:rows.length,characters:rows.reduce((a,r)=>a+r.characters_bound,0),fields:rows.reduce((a,r)=>a+r.ledger_fields_bound,0),anchors:rows.reduce((a,r)=>a+r.anchors_bound,0)}));
