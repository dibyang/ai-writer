import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const [phase,start,end]=process.argv.slice(2),b='acceptance/20261016-hundred',cp=`${b}/checkpoints/${phase}/files`,audit=JSON.parse(fs.readFileSync(`${b}/audits/${phase}.json`));
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),rows=[];
for(let unit=Number(start);unit<=Number(end);unit++){
 const draft=audit.drafts.find(r=>r.unit===unit);assert(draft);let candidate;
 for(const name of fs.readdirSync(`${b}/parent-reading-copies`)){
  const mf=`${b}/parent-reading-copies/${name}/manifest.json`;if(!fs.existsSync(mf))continue;
  const hit=JSON.parse(fs.readFileSync(mf)).rows.find(r=>r.unit===unit&&r.sha256===draft.sha256);
  if(hit&&fs.existsSync(path.join(path.dirname(mf),'reading.md'))){candidate={...hit,manifest:mf,reading_notes:path.join(path.dirname(mf),'reading.md')};break;}
 }
 assert(candidate,'No same-version parent full-reading record for unit '+unit);assert.equal(sha(candidate.file),draft.sha256);assert.equal(sha(`${cp}/${draft.draft}`),draft.sha256);
 rows.push({unit,sha256:draft.sha256,frozen_read_file:candidate.file,manifest:candidate.manifest,reading_notes:candidate.reading_notes});
}
fs.writeFileSync(`${b}/${phase}/parent-reading-version-proof.json`,JSON.stringify({at:new Date().toISOString(),scope:'Verifies identity of files reported read in notes, not an automated proof of human or model reading',phase,rows},null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({phase,matched:rows.length}));
