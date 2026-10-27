import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url));
const project=path.join(base,'scenario/东岸末班船-48章独立验证');
const json=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const save=(f,v)=>fs.writeFileSync(f,typeof v==='string'?v:JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const cp=json(path.join(base,'checkpoint-f-first.json'));
const stateBytes=fs.readFileSync(path.join(project,'.writer/state.json'));
const state=JSON.parse(stateBytes);
assert.equal(state.revision,254); assert.equal(state.units.length,48); assert.equal(sha(stateBytes),cp.state_sha256);
let compared=0;for(const [ref,entry]of Object.entries(cp.files)){const b=fs.readFileSync(path.join(project,ref));assert.equal(b.length,entry.bytes,ref);assert.equal(sha(b),entry.sha256,ref);compared++;}
const firstProof=json(path.join(base,'ffirst-final-report-proof.json'));
for(const [ref,entry]of Object.entries(firstProof.reports)){const b=fs.readFileSync(path.join(base,ref));assert.equal(sha(b),entry.sha256,ref);assert.equal(b.length,entry.bytes,ref);}
const rows=json(path.join(base,'f-model-chapter-functions.json'));
assert.deepEqual(rows.map(x=>x[0]),Array.from({length:48},(_,i)=>i+1));
const chapters=[],functions=[],fields=['goal','obstacle','choice','consequence','relationship_change'];
for(const unit of state.units){
 const bytes=fs.readFileSync(path.join(project,unit.draft)),body=bytes.toString('utf8'),pages=Math.ceil(body.length/1800),prefix=unit.unit<=24?'ffirst':'fresume';
 assert.equal(sha(bytes),unit.sha256); const logs=[];
 for(let p=1;p<=pages;p++){const ref=`read-pages/${prefix}-u${String(unit.unit).padStart(2,'0')}-p${String(p).padStart(2,'0')}.json`;const r=json(path.join(base,ref));assert.equal(r.sha256,unit.sha256);assert.equal(r.pages,pages);assert.equal(r.page,p);assert.equal(r.from,(p-1)*1800);assert.equal(r.to,Math.min(p*1800,body.length));assert.equal(r.text,body.slice(r.from,r.to));assert.equal(path.resolve(r.file),path.resolve(project,unit.draft));logs.push(ref);}
 const row=rows[unit.unit-1],quotes=row[6].map(needle=>{assert(body.includes(needle),`quote ${unit.unit}: ${needle}`);return {unit:unit.unit,quote:needle};});
 const entry={unit:unit.unit}; fields.forEach((field,i)=>entry[field]={status:'observed',text:row[i+1],evidence:quotes});functions.push(entry);
 chapters.push({unit:unit.unit,draft:unit.draft,sha256:unit.sha256,pages,chars:body.length,read_page_logs:logs});
}
const comparison=json(path.join(base,'f-model-comparison.json'));
for(const g of comparison.similar_structures)g.evidence=g.units.map(n=>({unit:n,quote:rows[n-1][6][0]}));
const template=json(path.join(project,'.writer/drafts/f-current-review-1-48.json'));
assert.equal(template.expected_revision,254);assert.equal(Object.keys(template.source_hashes).length,48);
for(const u of state.units)assert.equal(template.source_hashes[u.draft],u.sha256);
const reportRef='审查/F-当前全书1-48阅读报告.md';
let report=fs.readFileSync(path.join(base,'f-full-report-body.md'),'utf8');
report+='\n## 逐章功能表\n\n|章|目标|障碍|选择|后果|关系变化|已读原文短引（可回原页）|\n|---|---|---|---|---|---|---|\n';
for(const r of rows)report+=`|${r[0]}|${r.slice(1,6).map(x=>x.replaceAll('|','/')).join('|')}|${r[6].join('；')}|\n`;
report+='\n## 当前正文与实际页数\n\n|章|当前登记路径|SHA-256|实读页数|\n|---|---|---|---:|\n';
for(const c of chapters)report+=`|${c.unit}|${c.draft}|${c.sha256}|${c.pages}|\n`;
report+='\n合计48章、276页（105+171）；再召回核读47 p7/48 p4两页另记，不重复计入276。所有SHA由脚本逐项比较，模型没有逐哈希作文学判断。完整源页/事件定位保留read-proof-root-f-current.json与read-order-f-current.json，F自校保留f-current-reading-audit.json。\n';
save(path.join(project,reportRef),report);save(path.join(base,'F当前全书阅读报告.md'),report);
const input={from:1,to:48,kind:'model-self-review',expected_revision:254,operation_id:'f-current-whole-book-r254',report:reportRef,source_hashes:template.source_hashes,chapter_functions:functions,comparison,issues:[]};
save(path.join(base,'f-current-review-input.json'),input);
const audit={ok:true,at:new Date().toISOString(),baseline_revision:254,state_sha256:sha(stateBytes),registered_units:48,pages:chapters.reduce((n,c)=>n+c.pages,0),first_pages:chapters.filter(c=>c.unit<=24).reduce((n,c)=>n+c.pages,0),resume_pages:chapters.filter(c=>c.unit>=25).reduce((n,c)=>n+c.pages,0),checkpoint_files_compared:compared,first_reports_unchanged:true,all_page_text_matches_current_bytes:true,chapters,review_report:{ref:reportRef,sha256:sha(report),bytes:Buffer.byteLength(report)},review_input_sha256:sha(fs.readFileSync(path.join(base,'f-current-review-input.json'))),limitation:'Page/hash checks do not perform semantic reading; chapter functions and comparisons were written by the model after actual pages.'};
save(path.join(base,'f-current-reading-audit.json'),audit);
process.stdout.write(JSON.stringify({ok:true,revision:254,chapters:48,pages:audit.pages,first_pages:audit.first_pages,resume_pages:audit.resume_pages,checkpoint_files_compared:compared,report:reportRef,report_sha256:audit.review_report.sha256,input:'f-current-review-input.json'},null,2)+'\n');
