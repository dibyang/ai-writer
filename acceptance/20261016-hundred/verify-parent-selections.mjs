import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const [phase,...unitTexts]=process.argv.slice(2),base='acceptance/20261016-hundred';
assert(/^[a-z][a-z0-9-]*$/.test(phase??'')&&unitTexts.length,'phase and explicitly read units required');
const audit=JSON.parse(fs.readFileSync(`${base}/audits/${phase}.json`));
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const rows=unitTexts.map(text=>{
 const unit=Number(text),draft=audit.drafts.find(r=>r.unit===unit);assert(draft,'Unknown chapter '+text);
 const matches=[];
 for(const label of fs.readdirSync(`${base}/parent-reading-copies`)){
  const dir=`${base}/parent-reading-copies/${label}`,manifest=`${dir}/manifest.json`,notes=`${dir}/reading.md`;
  if(!fs.existsSync(manifest)||!fs.existsSync(notes))continue;
  const item=JSON.parse(fs.readFileSync(manifest)).rows.find(r=>r.unit===unit&&r.sha256===draft.sha256);
  if(!item)continue;
  assert.equal(sha(item.file),draft.sha256);
  matches.push({file:item.file,manifest,notes});
 }
 assert(matches.length,'No documented same-version reading for '+unit);
 assert.equal(sha(`${base}/checkpoints/${phase}/files/${draft.draft}`),draft.sha256);
 return {unit,sha256:draft.sha256,matches};
});
fs.writeFileSync(`${base}/${phase}/parent-selected-reading-version-proof.json`,JSON.stringify({at:new Date().toISOString(),scope:'Identity of explicitly documented selected readings; hashes are not proof of reading or of unlisted chapters',phase,rows},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:true,phase,matched:rows.length,units:rows.map(r=>r.unit)}));
