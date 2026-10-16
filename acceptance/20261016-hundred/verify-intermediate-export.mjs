import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const base='acceptance/20261016-hundred',[label,exportRoot,countText]=process.argv.slice(2),count=Number(countText);assert(/^[a-z][a-z0-9-]*$/.test(label??''));assert(Number.isInteger(count)&&count>0&&count<=100);
const root=`${base}/checkpoints/${label}/files`,state=JSON.parse(fs.readFileSync(`${root}/.writer/state.json`)),manifest=JSON.parse(fs.readFileSync(`${exportRoot}/manifest.json`));
assert.equal(state.units.length,count);assert.equal(manifest.revision,state.revision);assert.equal(manifest.status,'draft-export');assert.equal(manifest.quality_review,'required');assert.deepEqual(manifest.included_units,Array.from({length:count},(_,i)=>i+1));
const expected=state.units.map(u=>fs.readFileSync(`${root}/${u.draft}`,'utf8').replace(/^\uFEFF/,'').trim()).join('\n\n---\n\n')+'\n',actual=fs.readFileSync(`${exportRoot}/manuscript.md`,'utf8');assert.equal(actual,expected);
const sha256=crypto.createHash('sha256').update(fs.readFileSync(`${exportRoot}/manuscript.md`)).digest('hex');assert.equal(manifest.sha256,sha256);
const result={at:new Date().toISOString(),ok:true,label,revision:state.revision,units:count,exact_order_and_text:true,export_sha256:sha256,scope:'Exact draft export identity, not literary approval'};fs.writeFileSync(`${base}/intermediate-proofs/${label}-export-proof.json`,JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(result));
