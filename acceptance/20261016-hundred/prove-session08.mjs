import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {isDeepStrictEqual as same} from 'node:util';
import {applyDelta} from '../../lib/journal.mjs';
const base='acceptance/20261016-hundred',phase=`${base}/session-08`,backup=`${phase}/repair-0072-complete-before`,cp=`${base}/checkpoints/session-08/files`;
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const manifest=read(`${backup}/manifest.json`);for(const row of manifest.files)assert.equal(sha(row.copy),row.sha256);
const before=read(`${backup}/.writer__state.json`),after=read(`${cp}/.writer/state.json`);
assert.equal(before.revision,203);assert.equal(after.revision,205);assert.equal(before.units.length,72);assert.equal(after.units.length,72);
assert.deepEqual(before.units.slice(0,71),after.units.slice(0,71));assert.deepEqual(before.baseline,after.baseline);
let replay=structuredClone(before.baseline);
for(const unit of before.units){const suffix='/'+unit.journal,row=manifest.files.find(r=>r.source.endsWith(suffix));assert(row,'Missing backed-up journal '+unit.unit);replay=applyDelta(replay,read(row.copy).patch);}
assert.deepEqual(replay,before.snapshot);
const oldBody=fs.readFileSync(`${backup}/正文__0072-把空出来的地方留着.md`,'utf8'),newBody=fs.readFileSync(`${cp}/${after.units[71].draft}`,'utf8');
assert.equal(crypto.createHash('sha256').update(oldBody).digest('hex'),before.units[71].sha256);
const oldLines=oldBody.split(/\r?\n/),newLines=newBody.split(/\r?\n/);assert.equal(oldLines.length,newLines.length);
const changed=oldLines.flatMap((text,index)=>text===newLines[index]?[]:[{line:index+1,before:text,after:newLines[index]}]);assert.deepEqual(changed.map(r=>r.line),[47,51]);
assert(changed[0].after.startsWith('门合上，桌上只留下何那只杯子的一圈水印。'));
assert(changed[1].before.includes('昨晚晾的枕套')&&changed[1].after.includes('昨天上午晾的枕套'));
let anchors=0,rebound72=0;
for(const[id,entry]of Object.entries(before.snapshot.ledger)){
 const current=after.snapshot.ledger[id];assert(current);assert.equal(current.type,entry.type);assert.equal(current.due_unit,entry.due_unit);assert.equal(current.introduced_unit,entry.introduced_unit);
 for(const e of entry.evidence??[]){anchors++;const unit=after.units[e.unit-1],body=fs.readFileSync(`${cp}/${unit.draft}`,'utf8'),at=body.indexOf(e.quote);assert(at>=0);assert(current.evidence.some(n=>n.unit===e.unit&&n.quote===e.quote&&n.sha256===unit.sha256&&n.line===body.slice(0,at).split(/\r?\n/).length));if(e.unit===72)rebound72++;}
}
const strip=snapshot=>{const value=structuredClone(snapshot);for(const entry of Object.values(value.ledger))delete entry.evidence;return value;};
const noSemanticSnapshotChange=same(strip(before.snapshot),strip(after.snapshot));assert(noSemanticSnapshotChange,'Review unexpected non-evidence snapshot difference');
const result={at:new Date().toISOString(),ok:true,scope:'Independent revision203-to205 repair proof, not literary approval',before_revision:203,after_revision:205,backed_up_files:manifest.files.length,backed_up_current_journals:before.units.length,prefix_registrations_unchanged:71,changed,anchors_retained:anchors,chapter72_anchors_rebound:rebound72,non_evidence_snapshot_equal:noSemanticSnapshotChange};
fs.writeFileSync(`${phase}/parent-repair-proof.json`,JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({ok:true,backed_up_files:result.backed_up_files,prefix:71,changed_lines:[47,51],anchors,rebound72,noSemanticSnapshotChange}));
