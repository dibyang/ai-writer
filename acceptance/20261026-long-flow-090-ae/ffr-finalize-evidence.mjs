import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import{fileURLToPath}from'node:url';
const A=path.dirname(fileURLToPath(import.meta.url)),P=JSON.parse(fs.readFileSync(path.join(A,'project.json'))).project,sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const audit=JSON.parse(fs.readFileSync(path.join(A,'final-first-entry-audit.json'))),s=JSON.parse(fs.readFileSync(path.join(P,'.writer/state.json'))),note=path.join(P,'审查/AE-final-first-语义笔记.md');
assert.equal(s.revision,396);assert.equal(s.units.length,66);assert.equal(s.tool_control.generation,9);
let notes=fs.readFileSync(note,'utf8');
notes=notes.replace(/^## (\d+) ([^\n]+)$/gm,(line,id)=>+id<=24&&!line.includes('SHA')?line.slice(0,-1)+'；SHA '+audit.units.find(u=>u.unit===+id).sha256+'）':line);
notes=notes.replace('引句：“这里他接了，让她去吃面”。（此为转述定位，逐字原文：“说这里他接了，让她去吃面，别又只和人说要走。”）','引句：“说这里他接了，让她去吃面，别又只和人说要走。”');
fs.writeFileSync(note,notes);
const units=[];let pageCount=0;
for(const u of audit.units){assert.equal(sha(fs.readFileSync(u.path)),u.sha256);assert.equal(s.units.find(v=>v.unit===u.unit).sha256,u.sha256);if(u.unit>36)continue;
 const body=fs.readFileSync(u.path,'utf8'),proofs=[];assert(notes.includes('## '+u.unit+' '));
 for(let pg=1;pg<=u.pages;pg++){
  const label=(u.unit<=24?'final-first':'ffr')+'-u'+u.unit+'-p'+String(pg).padStart(2,'0'),ref='read-pages/'+label+'.json',raw=fs.readFileSync(path.join(A,ref)),r=JSON.parse(raw),{output_sha256,...returned}=r;
  assert.equal(r.file,u.path);assert.equal(r.sha256,u.sha256);assert.equal(r.page,pg);assert.equal(r.pages,u.pages);assert.equal(r.total_chars,body.length);assert.equal(r.from,(pg-1)*1800);assert.equal(r.to,Math.min(pg*1800,body.length));assert.equal(r.text,body.slice(r.from,r.to));assert.equal(output_sha256,sha(JSON.stringify(returned,null,2)+'\n'));
  proofs.push({page:pg,evidence:ref,evidence_sha256:sha(raw),output_sha256,utf16_chars:r.text.length});pageCount++;
 }
 units.push({...u,segment:u.unit<=24?'original-capacity-failed-segment':'same-id-recovery-segment',complete:true,proofs});
}
assert.equal(pageCount,181);assert.equal(units.length,36);
const extra=['ffr-u24-p05-resume','ffr-u24-p06-resume'].map(x=>({evidence:'read-pages/'+x+'.json',sha256:sha(fs.readFileSync(path.join(A,'read-pages/'+x+'.json')))}));
const manifest={at:new Date().toISOString(),native_id:'01a176d2-2255-7e80-9c37-d825387a4fef',scope:'Full author review remains 1-66. Actual first-stage reading 1-36 only.',page_size_utf16:1800,max_pages_per_batch_same_chapter:2,complete_units:36,counted_complete_pages:pageCount,original_complete_pages:105,recovery_complete_pages:76,units,resume_re_read_24:extra,excluded_partial_original_25:[1,2,3,4].map(n=>'read-pages/final-first-u25-p'+String(n).padStart(2,'0')+'.json'),unread_prose:[37,66],all_66_current_draft_sha_verified:true,semantic_notes:{ref:'审查/AE-final-first-语义笔记.md',sha256:sha(fs.readFileSync(note))},boundary:'Byte coverage validates saved returned pages only; literary reading and judgments are documented separately. Original partial25 never counted complete; no A/B/R page evidence reused.'};
fs.writeFileSync(path.join(A,'final-first-reading-manifest.json'),JSON.stringify(manifest,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:true,units:units.length,counted_complete_pages:pageCount,recovery_complete_pages:76,semantic_note_sha256:manifest.semantic_notes.sha256}));
