import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const a=path.dirname(fileURLToPath(import.meta.url));
const read=n=>JSON.parse(fs.readFileSync(path.join(a,n),'utf8'));
const c=read('fvr1-private-ownership.json'),w=c.workspace,p=path.join(a,'scenario','东岸末班船-66章独立验证');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const state=JSON.parse(fs.readFileSync(path.join(w,'.writer/state.json')));
assert.equal(state.revision,514);
const manifests=['fvt1','fvt2','fvt3','fvt4','fvc'].map(n=>({name:n,chapters:read(n+'-reading-manifest.json').chapters}));
const first=read('read-proof-final-first-partial.json');
const oldNotes=['AE-final-first-语义笔记.md','AE-final-read-语义笔记.md'].map(n=>fs.readFileSync(path.join(w,'审查',n),'utf8')).join('\n');
const blocks=oldNotes.split(/(?=^## \d+ )/m);
const rows=[];const invalid=[];
for(const u of state.units){
 const body=fs.readFileSync(path.join(w,u.draft),'utf8');assert.equal(sha(Buffer.from(body)),u.sha256);
 let found=u.unit<=2?{name:'final-first',row:first.files.find(x=>x.unit===u.unit)}:null;
 for(const m of manifests){const row=m.chapters.find(x=>x.unit===u.unit&&x.sha256===u.sha256);if(row)found={name:m.name,row};}
 assert(found,'current reading '+u.unit);
 const proof=found.row.actual_pages??found.row.proof??found.row.returns;
 assert.equal(proof.length,Math.ceil(body.length/1800));
 if(u.unit>2)for(const q of proof){let raw=fs.readFileSync(path.join(a,q.ref));let j=JSON.parse(raw);assert.equal(j.text,body.slice((q.page-1)*1800,q.page*1800));assert.equal(j.sha256,u.sha256);}
 const block=blocks.find(x=>new RegExp('^## '+u.unit+' ').test(x));assert(block);
 const functions={};
 for(const [cn,en] of [['目标','goal'],['选择','choice'],['后果','consequence'],['关系','relationship_change']]){
  const line=block.split('\n').find(s=>s.startsWith('- '+cn+'：'));assert(line,'function '+u.unit+cn);
  const m=line.match(/引句：[“「]([^”」]+)[”」]/);assert(m,'quote '+u.unit+cn);
  const quote=m[1];if(!body.includes(quote))invalid.push({unit:u.unit,field:en,quote,text:line});
  functions[en]={status:'observed',text:line.slice(2).split('引句：')[0],evidence:[{unit:u.unit,quote}]};
 }
 let note=u.unit<=2?{original:block}:read(`${found.name==='fvc'?'fvc':found.name}-notes/u${String(u.unit).padStart(found.name==='fvc'?1:2,'0')}.json`);
 if(found.name==='fvc')note={...read(`${u.unit<=36?'fvt1':u.unit<=59?'fvt3':'fvt4'}-notes/u${String(u.unit).padStart(2,'0')}.json`),final_amendment:note};
 functions.obstacle={status:'unknown',reason:'本章多线的具体阻力与限制见本章因果/连续性笔记；本表没有为其另补一个独立统一阻碍或新增原文证据。'+(note.causality??functions.goal.text)};
 rows.push({unit:u.unit,draft:u.draft,sha256:u.sha256,utf16:body.length,pages:proof.length,run:found.name,proof,functions,semantic:note,initial_function_note:block.split('\n').filter(s=>/^\- (目标|选择|后果|关系)：/.test(s))});
}
fs.writeFileSync(path.join(a,'fcl-report-draft-index.json'),JSON.stringify({at:new Date().toISOString(),native_id:'01a176d2-2255-7e80-9c37-d825387a4fef',rows,invalid},null,2),{flag:'wx'});
console.log(JSON.stringify({chapters:rows.length,pages:rows.reduce((n,x)=>n+x.pages,0),invalid},null,2));
