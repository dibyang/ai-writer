import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const b='acceptance/20261016-hundred',cp=`${b}/checkpoints/session-04/files`,state=JSON.parse(fs.readFileSync(`${cp}/.writer/state.json`)),old=JSON.parse(fs.readFileSync(`${b}/session-04/revision-r1/before/state.json`));
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');const rows=[];
for(const label of ['at45','at47','at48'])for(const row of JSON.parse(fs.readFileSync(`${b}/parent-reading-copies/${label}/manifest.json`)).rows){
 const after=`${cp}/${state.units.find(u=>u.unit===row.unit).draft}`,before=fs.readFileSync(row.file,'utf8'),text=fs.readFileSync(after,'utf8');
 const lines=before.split(/\r?\n/),newLines=text.split(/\r?\n/),diff=[];assert.equal(lines.length,newLines.length,'Unexpected newline changes');for(let n=0;n<lines.length;n++)if(lines[n]!==newLines[n])diff.push({line:n+1,before:lines[n],after:newLines[n]});
 if(row.unit>=45)assert.equal(sha(after),row.sha256);else assert.equal(diff.length,1);
 rows.push({unit:row.unit,before_sha256:row.sha256,after_sha256:sha(after),han:(text.replace(/^#.*\r?\n/,'').match(/\p{Script=Han}/gu)||[]).length,diff});
}
assert.deepEqual(state.baseline,old.baseline);assert.deepEqual(state.units.slice(0,42),old.units.slice(0,42));
const anchors=s=>Object.entries(s.snapshot.ledger).flatMap(([id,e])=>(e.evidence??[]).map(x=>({id,...x}))),after=anchors(state),missing=anchors(old).filter(e=>!after.some(n=>n.id===e.id&&n.unit===e.unit&&n.quote===e.quote));
const result={at:new Date().toISOString(),before_revision:old.revision,after_revision:state.revision,first42_registrations_unchanged:true,unchanged_bodies_45_to48:true,rows,old_quotes_not_retained:missing};
fs.writeFileSync(`${b}/session-04/parent-repair-proof.json`,JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({revision:state.revision,rows:rows.map(({unit,han,diff})=>({unit,han,changed_lines:diff.length})),old_quotes_not_retained:missing.length}));
