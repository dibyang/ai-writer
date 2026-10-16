import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { replaySnapshots } from './rebuild-utils.mjs';
const base='acceptance/20261016-hundred',[phase,fromText,toText,beforeLabel]=process.argv.slice(2),from=Number(fromText),to=Number(toText),read=p=>JSON.parse(fs.readFileSync(p,'utf8')),hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
assert(/^[a-z0-9-]+$/.test(phase??'')&&/^[a-z0-9-]+$/.test(beforeLabel??''));assert(Number.isInteger(from)&&Number.isInteger(to)&&from>0&&to>=from);
const root=`${base}/checkpoints/${phase}/files`,stage=`${base}/${phase}`,state=read(`${root}/.writer/state.json`),beforeRoot=`${base}/checkpoints/${beforeLabel}/files`,before=read(`${beforeRoot}/.writer/state.json`),audit=read(`${base}/audits/${phase}.json`),out=`${base}/input-bindings/${phase}`;
assert(audit.ok&&state.units.length>=to);assert.equal(read(`${stage}/process-result.json`).exit_code,0);assert(!fs.existsSync(out));
const snapshots=replaySnapshots(root,state),prior=replaySnapshots(beforeRoot,before);assert.deepEqual(state.baseline,before.baseline);assert.deepEqual(state.units.slice(0,from-1),before.units.slice(0,from-1));for(let n=0;n<from;n++)assert.deepEqual(snapshots[n],prior[n],`Unchanged prefix snapshot ${n}`);
for(const[id,old]of Object.entries(before.snapshot.ledger??{})){const current=state.snapshot.ledger[id];assert(current,id);for(const k of ['type','introduced_unit','due_unit'])assert.deepEqual(current[k],old[k],id+'.'+k);if(old.type==='observation'){assert.equal(current.statement,old.statement);assert.deepEqual(current.author_truth,old.author_truth);assert.equal(Object.hasOwn(current,'author_truth'),Object.hasOwn(old,'author_truth'));}}
const index=fs.readFileSync(`${stage}/commands/index.jsonl`,'utf8').trim().split(/\r?\n/).map(JSON.parse),commands=index.filter(x=>x.exit_code===0&&x.argv?.[0]?.replaceAll('\\','/').endsWith('bin/ai-writer.mjs')&&x.argv.includes('record')&&x.argv.includes('--input')),rows=[],copies=[];
for(let n=from;n<=to;n++){
 const unit=state.units[n-1],snapshot=snapshots[n];let chosen;
 for(const command of commands.toReversed()){
  const inputPath=path.resolve(command.cwd,command.argv[command.argv.indexOf('--input')+1]);if(!fs.existsSync(inputPath))continue;const input=read(inputPath);if(input.unit!==n||input.summary!==unit.summary)continue;if(JSON.stringify(input.source_hashes)!==JSON.stringify(unit.source_hashes))continue;const result=read(command.files.stdout);if(!result.ok||result.revision!==input.expected_revision+1)continue;chosen={command,inputPath,input,result};break;
 }
 assert(chosen,'No actual successful matching current input '+n);const{command,inputPath,input,result}=chosen,c=input.changes;assert(c);assert.deepEqual(input.source_hashes,unit.source_hashes);assert.equal(input.draft,unit.draft);assert.equal(hash(`${root}/${unit.draft}`),unit.sha256);
 for(const[name,text]of Object.entries(c.characters??{}))assert.equal(snapshot.characters[name],text,`${n}/${name}`);for(const name of c.retire_characters??[])assert(!Object.hasOwn(snapshot.characters,name));
 assert.deepEqual(snapshot.timeline,[...snapshots[n-1].timeline,...(c.timeline_append??[])]);if(Object.hasOwn(c,'threads'))assert.deepEqual(snapshot.threads,c.threads);
 let fields=0,anchors=0;for(const[id,delta]of Object.entries(c.ledger??{})){const actual=snapshot.ledger[id];assert(actual,id);for(const[key,value]of Object.entries(delta)){
  if(key==='previous_holder')continue;
  if(key==='evidence'){for(const e of value){assert(actual.evidence.some(a=>a.unit===e.unit&&a.quote===e.quote&&a.sha256===state.units[e.unit-1].sha256));anchors++;}}
  else if(key==='character_known'){for(const[name,text]of Object.entries(value)){assert.equal(actual.character_known[name],text,`${n}/${id}/${name}`);fields++;}}
  else{assert.deepEqual(actual[key],value,`${n}/${id}/${key}`);fields++;}
 }}
 rows.push({unit:n,input:inputPath,input_sha256:hash(inputPath),body_sha256:unit.sha256,actual_cli_metadata:command.files.metadata,record_revision:result.revision,expected_revision:input.expected_revision,characters_bound:Object.keys(c.characters??{}).length,ledger_fields_bound:fields,anchors_bound:anchors});copies.push({unit:n,bytes:fs.readFileSync(inputPath)});
}
fs.mkdirSync(out,{recursive:true});for(const row of copies)fs.writeFileSync(`${out}/input-${row.unit}.json`,row.bytes,{flag:'wx'});
let repair95=null;if(phase==='session-12'){
 const proof=read(`${base}/intermediate-proofs/repair-at95/actual96-input-binding.json`);assert.deepEqual(state.units[94],proof.unit95);assert.deepEqual(state.units[95],proof.unit96);assert.deepEqual(snapshots[95],read(`${base}/intermediate-proofs/repair-at95/actual-after-snapshot95.json`));assert.equal(state.units[95].source_hashes['.writer/state.json'],proof.consumed_state_sha256);repair95={ok:true,actual96_consumed_repaired_r345:true,final_checkpoint_units95_96_exact:true};
}
const result={at:new Date().toISOString(),ok:true,scope:'Actual successful current native inputs/raw CLI/journal binding and exact unchanged prefix; semantic additions require separate actual reading',phase,before:beforeLabel,revision:state.revision,prefix:from-1,original_ids_preserved:Object.keys(before.snapshot.ledger??{}).length,repair95,rows};fs.writeFileSync(`${out}/proof.json`,JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({ok:true,phase,inputs:rows.length,prefix:from-1,characters:rows.reduce((a,r)=>a+r.characters_bound,0),ledger_fields:rows.reduce((a,r)=>a+r.ledger_fields_bound,0),anchors:rows.reduce((a,r)=>a+r.anchors_bound,0),repair95}));
