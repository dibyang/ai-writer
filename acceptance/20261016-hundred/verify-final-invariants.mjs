import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {replaySnapshots} from './rebuild-utils.mjs';
const base=path.resolve('acceptance/20261016-hundred');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
function load(label){const root=path.join(base,'checkpoints',label,'files'),state=read(path.join(root,'.writer/state.json'));return{root,state,snapshots:replaySnapshots(root,state)};}
const target=path.join(base,'final-invariants-proof.json');assert(!fs.existsSync(target));
assert.equal(read(path.join(base,'final-review/process-result.json')).exit_code,0);
assert(read(path.join(base,'audits/final-review.json')).ok);
const a=load('session-13'),b=load('final-review');
const live=path.join(base,'works/潮汐信号');
assert.equal(sha(path.join(live,'.writer/state.json')),sha(path.join(b.root,'.writer/state.json')),'Final authority differs from audited checkpoint');
assert.equal(a.state.units.length,100);assert.equal(b.state.units.length,100);
assert.deepEqual(b.state.baseline,a.state.baseline);
assert.deepEqual(b.state.units.slice(0,24),a.state.units.slice(0,24));
for(let n=0;n<=24;n++)assert.deepEqual(b.snapshots[n],a.snapshots[n]);
const timeline=a.snapshots[24].timeline;
const bodies=new Map(b.state.units.map(u=>[u.unit,fs.readFileSync(path.join(b.root,u.draft),'utf8')]));
let idsChecked=0,observationsChecked=0,anchorsChecked=0;
const addedIds=[],anchorDeviations=[],changedQuotes=new Map();
for(let n=0;n<=100;n++){
 const old=a.snapshots[n],current=b.snapshots[n];
 if(n>=24)assert.deepEqual(current.timeline.slice(0,timeline.length),timeline,`Original timeline at ${n}`);
 for(const id of Object.keys(current.ledger??{}))if(!Object.hasOwn(old.ledger??{},id))addedIds.push({snapshot:n,id});
 for(const[id,entry]of Object.entries(old.ledger??{})){
  const now=current.ledger?.[id];assert(now,`${n}/${id}`);idsChecked++;
  for(const key of ['type','introduced_unit','due_unit']){assert.equal(Object.hasOwn(now,key),Object.hasOwn(entry,key),`${n}/${id}/${key} presence`);assert.deepEqual(now[key],entry[key],`${n}/${id}/${key}`);}
  if(entry.type==='observation')for(const key of ['statement','author_truth']){assert.equal(Object.hasOwn(now,key),Object.hasOwn(entry,key),`${n}/${id}/${key} presence`);assert.deepEqual(now[key],entry[key],`${n}/${id}/${key}`);observationsChecked++;}
  for(const e of entry.evidence??[]){
   const unit=b.state.units[e.unit-1];assert(unit,`${n}/${id}: missing cited unit`);
   if(!bodies.get(e.unit).includes(e.quote)){const key=JSON.stringify([id,e.unit,e.quote]);if(!changedQuotes.has(key))changedQuotes.set(key,{id,unit:e.unit,old_quote:e.quote,snapshots:[]});changedQuotes.get(key).snapshots.push(n);continue;}
   anchorsChecked++;
   if(!(now.evidence??[]).some(x=>x.unit===e.unit&&x.quote===e.quote&&x.draft===unit.draft&&x.sha256===unit.sha256))anchorDeviations.push({snapshot:n,id,unit:e.unit,quote:e.quote});
  }
 }
}
// Portable product assets are fixed after v4 activation; only fiction and
// authorized tracking/report artifacts should change during native review.
const frozenBefore=path.join(base,'final-review/before/work');
function assets(root,prefix){const dir=path.join(root,prefix),rows=[];for(const e of fs.readdirSync(dir,{withFileTypes:true})){const rel=path.join(prefix,e.name);if(e.isDirectory())rows.push(...assets(root,rel));else{assert(e.isFile(),rel);rows.push({file:rel.replaceAll('\\','/'),sha256:sha(path.join(root,rel))});}}return rows.sort((x,y)=>x.file<y.file?-1:x.file>y.file?1:0);}
const portable=[];for(const prefix of ['.agents','.writer/tool']){const before=assets(frozenBefore,prefix),after=assets(live,prefix);assert.deepEqual(after,before,prefix+' changed');portable.push({prefix,files:after.length});}
const result={at:new Date().toISOString(),ok:anchorDeviations.length===0,scope:'All 101 actual journal snapshots: old ID identity/due, immutable observations, fixed original prefix, unchanged valid citation preservation; changed quotes and added IDs require separate semantic review. Portable v4 assets must stay identical.',revision:b.state.revision,units:100,snapshots:101,ids_checked:idsChecked,observation_fields_checked:observationsChecked,unchanged_anchors_checked:anchorsChecked,unchanged_anchor_deviations:anchorDeviations,changed_quotes_requiring_semantic_review:[...changedQuotes.values()],new_ids_requiring_semantic_review:addedIds,portable_assets:portable};
fs.writeFileSync(target,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:result.ok,snapshots:101,ids_checked:idsChecked,observation_fields_checked:observationsChecked,anchors_checked:anchorsChecked,anchor_deviations:anchorDeviations.length,changed_quotes:changedQuotes.size,new_id_occurrences:addedIds.length,portable}));process.exitCode=result.ok?0:1;
