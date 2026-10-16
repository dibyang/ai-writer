import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {replaySnapshots} from './rebuild-utils.mjs';
const base='acceptance/20261016-hundred',read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const beforeRoot=`${base}/checkpoints/session-08/files`,afterRoot=`${base}/checkpoints/repair-at72/files`;
const before=read(`${beforeRoot}/.writer/state.json`),after=read(`${afterRoot}/.writer/state.json`);
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const beforeHash=sha(`${beforeRoot}/.writer/state.json`),afterHash=sha(`${afterRoot}/.writer/state.json`);
assert.equal(before.units.length,72);assert.equal(after.units.length,72);assert.equal(after.revision,247);
assert.equal(sha(`${base}/session-09/metadata-repair/before/work/.writer/state.json`),beforeHash);
assert.deepEqual(before.units.slice(0,31),after.units.slice(0,31));
const strip=snapshot=>{const s=structuredClone(snapshot);for(const e of Object.values(s.ledger??{}))delete e.evidence;return s;};
function corrected(snapshot){
 const s=strip(snapshot);
 if(s.timeline[45])s.timeline[45]=s.timeline[45].replace('换缺轮椅','换轮缘缺角的五脚椅');
 if(s.ledger?.O_ROOM_TONE)s.ledger.O_ROOM_TONE.statement=s.ledger.O_ROOM_TONE.statement.replace('无人动缺轮椅','无人移动那把轮缘缺角的五脚椅');
 const e=s.ledger?.T_SOUND_CONTEXT;
 if(e?.reader_known)e.reader_known=e.reader_known.replaceAll('缺轮','轮缘缺角');
 if(e?.character_known?.顾遥)e.character_known.顾遥=e.character_known.顾遥.replaceAll('缺轮','轮缘缺角');
 return s;
}
const beforeSnaps=replaySnapshots(beforeRoot,before),afterSnaps=replaySnapshots(afterRoot,after);
for(let unit=0;unit<=72;unit++)assert.deepEqual(strip(afterSnaps[unit]),corrected(beforeSnaps[unit]),'Unexpected non-evidence snapshot change at '+unit);
for(const u of before.units.slice(0,71)){assert.equal(u.sha256,after.units[u.unit-1].sha256);assert.equal(sha(`${afterRoot}/${u.draft}`),u.sha256);}
const oldBody=fs.readFileSync(`${beforeRoot}/${before.units[71].draft}`,'utf8'),newBody=fs.readFileSync(`${afterRoot}/${after.units[71].draft}`,'utf8');
assert(oldBody.includes('至少今天回来没要你送'));
assert.equal(newBody,oldBody.replace('至少今天回来没要你送','今天我能自己走回去，不用你送'));
const physical=fs.readFileSync(`${afterRoot}/${after.units[31].draft}`,'utf8');assert(physical.includes('五个脚轮，有一个轮缘缺了一小角'));
let retained=0,rebound72=0;
for(const[id,e]of Object.entries(before.snapshot.ledger)){
 const current=after.snapshot.ledger[id];assert(current);assert.equal(current.type,e.type);assert.equal(current.introduced_unit,e.introduced_unit);assert.equal(current.due_unit,e.due_unit);
 for(const a of e.evidence??[]){const u=after.units[a.unit-1],body=fs.readFileSync(`${afterRoot}/${u.draft}`,'utf8'),at=body.indexOf(a.quote);assert(at>=0);assert(current.evidence.some(n=>n.unit===a.unit&&n.quote===a.quote&&n.sha256===u.sha256&&n.line===body.slice(0,at).split(/\r?\n/).length));retained++;if(a.unit===72)rebound72++;}
}
const exportRoot=`${base}/session-09/metadata-repair/export`,manifest=read(`${exportRoot}/manifest.json`);
assert.equal(manifest.revision,after.revision);assert.deepEqual(manifest.included_units,Array.from({length:72},(_,i)=>i+1));
const expected=after.units.map(u=>fs.readFileSync(`${afterRoot}/${u.draft}`,'utf8').replace(/^\uFEFF/,'').trim()).join('\n\n---\n\n')+'\n';
assert.equal(fs.readFileSync(`${exportRoot}/manuscript.md`,'utf8'),expected);assert.equal(sha(`${exportRoot}/manuscript.md`),manifest.sha256);
const han=after.units.map(u=>({unit:u.unit,han:(fs.readFileSync(`${afterRoot}/${u.draft}`,'utf8').replace(/^#.*\r?\n/,'').match(/\p{Script=Han}/gu)??[]).length}));
const result={at:new Date().toISOString(),ok:true,scope:'Independent intermediate72 mechanics and exact bounded snapshot changes; final78 provenance binding remains separate',before_revision:before.revision,after_revision:after.revision,before_state_sha256:beforeHash,after_state_sha256:afterHash,prefix_registrations_unchanged:31,body_hashes_unchanged_through:71,changed_body_units:[72],checked_snapshots:73,anchors_retained:retained,chapter72_anchors_rebound:rebound72,total_han:han.reduce((n,r)=>n+r.han,0),han,export_sha256:manifest.sha256};
fs.mkdirSync(`${base}/intermediate-proofs`,{recursive:true});fs.writeFileSync(`${base}/intermediate-proofs/repair-at72.json`,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:true,revision:after.revision,checked_snapshots:73,anchors_retained:retained,rebound72,total_han:result.total_han}));
