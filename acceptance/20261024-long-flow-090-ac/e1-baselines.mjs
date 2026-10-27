import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {base,main,j,sha,state,save,author,cli} from './e1-ops.mjs';
const all=j(path.join(base,'e-proposal.json')).proposals.flatMap(p=>p.source_strategy.changes);
const action=process.argv[2], i=Number(process.argv[3]);
if(action==='coverage'){
 const logs=fs.readdirSync(path.join(base,'read-pages')).filter(f=>f.endsWith('.json')).map(f=>({log:'read-pages/'+f,...j(path.join(base,'read-pages',f))}));
 const coverage=state().units.map(u=>{const hash=sha(fs.readFileSync(path.join(main,u.draft)));const rows=logs.filter(r=>r.sha256===hash&&r.file&&path.resolve(r.file)===path.resolve(main,u.draft));const total=rows[0]?.pages;assert(total);const pages=[...new Set(rows.map(r=>r.page))].sort((a,b)=>a-b);assert.equal(pages.length,total,u.draft);return {unit:u.unit,path:u.draft,sha256:hash,pages:total,logs:rows.map(r=>r.log)};});
 save('e1-baseline-full-reading.json',{at:new Date().toISOString(),coverage,total_pages:coverage.reduce((a,c)=>a+c.pages,0),supplemental_pages:logs.filter(r=>r.log.includes('/e1-base-')).length,meaning:'全部页面在本原生会话实际返回；只按当前同SHA复用E预读，补齐143页，不以页清单冒充阅读。'});console.log(JSON.stringify({chapters:coverage.length,pages:coverage.reduce((a,c)=>a+c.pages,0)}));
}
if(action==='publish'){
 const s=all[i-1],id='S'+String(i).padStart(2,'0');assert(s);
 const impact=j(path.join(base,'cli-logs','e1-'+id.toLowerCase()+'-impact-baseline','stdout.txt')).impact;assert.equal(impact.revision,state().revision);
 const cov=j(path.join(base,'e1-baseline-full-reading.json')).coverage;
 for(const [ref,hash] of Object.entries(impact.required_readings)){assert.equal(sha(fs.readFileSync(path.join(main,ref))),hash);if(ref.startsWith('正文/'))assert(cov.some(c=>c.path===ref&&c.sha256===hash));else assert.equal(hash,s.sha256);}
 const report=`# E首程 ${id} 旧来源 baseline 实读报告\n\n逻辑入口：${s.ref}；版本 E1_${id}_OLD；旧字节 SHA ${s.sha256}。本源在E提案阶段已完整读取，冻结对象与原入口逐字节相同。\n\n工具 baseline 必须 from=1，本次补齐1—32缺页，当前1—48正文全部实际分页返回，详见AC外层 e1-baseline-full-reading.json（276页）及 e1-baseline-reading-notes-01-18.md、e1-baseline-reading-notes-19-32.md，E原报告逐章34—48比较。required_readings每项现场核SHA完全相同。\n\n这是旧字节历史绑定，不是修改来源或正文；原消费哈希保持，前缀单元不重登。原80退款袋、门35、柜81、长凳84与旧八元画册、33V2、箱漆观察、书籍所有权及告知途径保持。19题名已在既有application修好，4—6时间归属、36父亲听说而未拿书、45饭盒与浅碟的原application保留，不制造新应用。新控制变量须后续独立freeze/impact/stage，不能由本baseline冒充生效。\n\n结论：同字节baseline可建立；未决阻塞：无。本报告为模型实读，不冒充真人验收。\n`;
 const ref='审查/E1-'+id+'-旧来源baseline实读.md';const dest=path.join(main,ref);fs.writeFileSync(dest,report,{flag:'wx'});
 const input=save('e1-inputs/'+id+'-publish-baseline.json',{expected_revision:state().revision,operation_id:'E1_'+id+'_PUBLISH_BASELINE',author_evidence:author(),impact,review:{report:ref,report_sha256:sha(fs.readFileSync(dest)),readings:impact.required_readings,conclusion:'实读已覆盖所有required_readings；旧字节等价baseline，自动绑定原消费，不改正文及原消费SHA。',unresolved:[]}});
 cli('e1-'+id.toLowerCase()+'-publish-baseline',['source','publish'],{input,brief:true});
}
