import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const A=path.dirname(fileURLToPath(import.meta.url)), P=path.join(A,'scenario','东岸末班船-60章独立验证');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const json=f=>JSON.parse(fs.readFileSync(path.join(A,f),'utf8'));
const save=(f,o)=>fs.writeFileSync(path.join(A,f),JSON.stringify(o,null,2)+'\n',{flag:'wx'});
const stateBytes=fs.readFileSync(path.join(P,'.writer/state.json')), s=JSON.parse(stateBytes);
const first=json('g-first-reading.json'), manifest=json('g-resume-current-manifest.json');
const rows=fs.readFileSync(path.join(A,'g-functions.tsv'),'utf8').trim().split(/\r?\n/).map(l=>l.split('\t'));
assert.equal(rows.length,60); assert.equal(s.units.length,60); assert.equal(s.revision,339);
const chapters=[], texts=new Map(), missing=[];
for(const u of s.units){
 const bytes=fs.readFileSync(path.join(P,u.draft)), body=bytes.toString('utf8'); assert.equal(hash(bytes),u.sha256);
 const pages=Math.ceil(body.length/1800), entries=[]; let returned='';
 for(let p=1;p<=pages;p++){
  const label=u.unit<=30?`g-u${String(u.unit).padStart(2,'0')}-p${p}`:`g-r-u${u.unit}-p${p}`;
  const evidence=`read-pages/${label}.json`, raw=fs.readFileSync(path.join(A,evidence)), j=JSON.parse(raw);
  assert.equal(j.sha256,u.sha256); assert.equal(j.file,path.join(P,u.draft)); assert.equal(j.page,p);
  assert.equal(j.pages,pages); assert.equal(j.total_chars,body.length); assert.equal(j.from,(p-1)*1800); assert.equal(j.to,Math.min(p*1800,body.length));
  assert.equal(j.text,body.slice(j.from,j.to)); const {output_sha256,...out}=j; assert.equal(hash(JSON.stringify(out,null,2)+'\n'),output_sha256);
  returned+=j.text; entries.push({label,page:p,from:j.from,to:j.to,output_sha256,evidence,evidence_sha256:hash(raw)});
 }
 assert.equal(returned,body); texts.set(u.unit,returned);
 if(u.unit<=30){const old=first.chapters.find(x=>x.unit===u.unit);assert.equal(old.sha256,u.sha256);assert.deepEqual(old.pages,entries);}
 const notes=`${u.unit<=30?'g-first-notes':'g-resume-notes'}/${String(u.unit).padStart(2,'0')}.md`;
 const row=rows[u.unit-1]; assert.equal(Number(row[0]),u.unit); assert.equal(row.length,7);
 let at=body.indexOf(row[6]); if(at<0){missing.push({unit:u.unit,needle:row[6]});at=body.indexOf('\n\n')+2;}
 const start=Math.max(0,body.lastIndexOf('\n\n',at)+2), end=body.indexOf('\n\n',at);
 const quote=body.slice(start,end<0?Math.min(body.length,start+240):Math.min(end,start+240)).trim();
 assert(quote&&body.includes(quote));
 const functions=Object.fromEntries(['goal','obstacle','choice','consequence','relationship_change'].map((k,i)=>[k,{status:'observed',text:row[i+1],evidence:[{unit:u.unit,quote}]}]));
 chapters.push({unit:u.unit,draft:u.draft,sha256:u.sha256,chars:body.length,pages:entries,complete:true,read_process:u.unit<=30?'g-first (same native thread, previous process)':'g-resume (current process)',notes,notes_sha256:hash(fs.readFileSync(path.join(A,notes))),functions});
}
const out={at:new Date().toISOString(),native_thread_id:'01a17384-9035-7833-9acc-311b647abef1',launch:manifest.launch,elapsed_ms:Date.now()-Date.parse(manifest.launch.started_at),project:P,main_revision:s.revision,state_sha256:hash(stateBytes),generation:8,content_id:manifest.resources.cid,runtime_id:manifest.resources.rid,read_scope:{from:1,to:60,chapters:60,pages:chapters.reduce((n,c)=>n+c.pages.length,0),first_process:{from:1,to:30,pages:143},resume_process:{from:31,to:60,pages:244},page_size_utf16:1800,max_same_chapter_pages_per_batch:2,body_warning_or_truncated_batches:[],model_full_returns_checked:true,mechanical_page_checks_are_not_semantic_proof:true},restoration:{receipt:'reading-resume-g-resume-verification.json',checkpoint:'checkpoint-g-first.json',first_reading:'g-first-reading.json',first_reading_sha256:hash(fs.readFileSync(path.join(A,'g-first-reading.json')))},chapters,semantic_limits:['1—30为同ID首程实读恢复，不声称本进程重读','31—60为本次严格串行逐章实读','非盲读、真人、市场验证或作者定稿','原60章写作及21—60修订形成于gen7，本次未改正文'],quote_anchor_missing:missing};
assert.equal(out.read_scope.pages,387);assert.equal(out.chapters.slice(30).reduce((n,c)=>n+c.pages.length,0),244);
save('g-current60-reading.json',out);
console.log(JSON.stringify({at:out.at,elapsed_ms:out.elapsed_ms,main_revision:s.revision,state_sha256:out.state_sha256,chapters:60,pages:387,first:143,resume:244,missing,quotes:chapters.map(c=>({unit:c.unit,quote:c.functions.goal.evidence[0].quote}))},null,2));
