import fs from 'node:fs';
import path from 'node:path';
import {isDeepStrictEqual as same} from 'node:util';
import {applyDelta} from '../../lib/journal.mjs';

// Read-only reconstruction. Callers save desired snapshots outside the authority,
// read the real drafts, and submit changes through a fresh CLI record-template.
export function replaySnapshots(work,state){
 const snapshots=[structuredClone(state.baseline)];
 for(const unit of state.units){const journal=JSON.parse(fs.readFileSync(path.join(work,unit.journal),'utf8'));snapshots.push(applyDelta(structuredClone(snapshots.at(-1)),journal.patch));}
 if(!same(snapshots.at(-1),state.snapshot))throw Error('Journal reconstruction differs from authority');
 return snapshots;
}
export function changesBetween(before,after,unit){
 if(!same(before.timeline,after.timeline.slice(0,before.timeline.length)))throw Error(`Historical timeline changed within unit ${unit}; correct desired snapshots consistently, never overwrite authority`);
 const changes={characters:{},timeline_append:after.timeline.slice(before.timeline.length),ledger:{}};
 for(const [name,value] of Object.entries(after.characters))if(!same(before.characters[name],value))changes.characters[name]=value;
 const retired=Object.keys(before.characters).filter(x=>!Object.hasOwn(after.characters,x));if(retired.length)changes.retire_characters=retired;
 if(!same(before.threads,after.threads))changes.threads=after.threads;
 for(const id of Object.keys(before.ledger??{}))if(!Object.hasOwn(after.ledger??{},id))throw Error(`Ledger removed: ${id}`);
 for(const [id,value] of Object.entries(after.ledger??{})){
  const previous=before.ledger?.[id]??{},delta={};
  for(const name of Object.keys(previous.character_known??{}))if(!Object.hasOwn(value.character_known??{},name))throw Error(`Knowledge field removed: ${id}.${name}`);
  for(const [key,item] of Object.entries(value)){
   if(['evidence','introduced_unit','updated_unit'].includes(key)||same(previous[key],item))continue;
   if(key==='character_known')delta[key]=Object.fromEntries(Object.entries(item).filter(([name,text])=>!same(previous[key]?.[name],text)));
   else delta[key]=structuredClone(item);
  }
  const anchors=(value.evidence??[]).filter(e=>e.unit===unit).map(e=>({unit:e.unit,quote:e.quote}));
  if(anchors.length)delta.evidence=anchors;
  if(Object.keys(delta).length){
   if(!anchors.length)throw Error(`Changed ledger has no current-unit evidence: ${unit}:${id}`);
   if(delta.custody&&previous.custody&&delta.custody.holder!==previous.custody.holder)delta.previous_holder=previous.custody.holder;
   changes.ledger[id]=delta;
  }
 }
 return changes;
}
