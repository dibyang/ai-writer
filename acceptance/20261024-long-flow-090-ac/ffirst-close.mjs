import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url));
const json=f=>JSON.parse(fs.readFileSync(path.join(base,f),'utf8'));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const checkpoint=json('checkpoint-f-entry.json'),entry=json('ffirst-entry-audit.json');
const root=checkpoint.project,stateBytes=fs.readFileSync(path.join(root,'.writer/state.json')),state=JSON.parse(stateBytes);
const status=json('cli-logs/ffirst-stop-status/stdout.txt'),check=json('cli-logs/ffirst-stop-check/stdout.txt'),doctor=json('cli-logs/ffirst-stop-doctor/stdout.txt');
const changed=[];
for(const [ref,x]of Object.entries(checkpoint.files)){
 const b=fs.readFileSync(path.join(root,ref));
 if(b.length!==x.bytes||sha(b)!==x.sha256)changed.push(ref);
}
assert.equal(changed.length,0);assert.equal(sha(stateBytes),checkpoint.state_sha256);assert.equal(state.revision,254);assert.equal(state.units.length,48);
assert(status.ok&&check.ok&&doctor.ok);assert.deepEqual(status.changed_sources,[]);assert.deepEqual(status.stale_units,[]);assert.deepEqual(status.impact_pending,[]);
assert(status.revisions.sessions.every(x=>x.status==='committed'||x.status==='abandoned'));
assert(status.revisions.transactions.every(x=>x.status==='completed'||x.status==='rolled-back'));
const chapters=[];let previousTime=0,total=0;
for(const u of state.units.filter(x=>x.unit<=24)){
 const current=fs.readFileSync(path.join(root,u.draft)),pages=Math.ceil(current.toString('utf8').length/1800),labels=[];
 assert.equal(sha(current),u.sha256);
 for(let page=1;page<=pages;page++){
  const label='ffirst-u'+String(u.unit).padStart(2,'0')+'-p'+String(page).padStart(2,'0');
  const file=path.join(base,'read-pages',label+'.json'),r=JSON.parse(fs.readFileSync(file,'utf8')),time=fs.statSync(file).mtimeMs;
  assert.equal(r.file,path.join(root,u.draft));assert.equal(r.sha256,u.sha256);assert.equal(r.page,page);assert.equal(r.pages,pages);
  assert.equal(r.text,current.toString('utf8').slice((page-1)*1800,page*1800));assert(time>=previousTime);previousTime=time;
  labels.push(label);total++;
 }
 chapters.push({unit:u.unit,draft:u.draft,sha256:u.sha256,pages,read_labels:labels});
}
assert.equal(total,105);assert.equal(chapters.length,24);
assert.equal(fs.readdirSync(path.join(base,'read-pages')).filter(x=>/^ffirst-u\d+-p\d+\.json$/.test(x)).length,total);
const tracking=state.units.filter(x=>x.unit>=4&&x.unit<=6).map(u=>{
 const j=JSON.parse(fs.readFileSync(path.join(root,u.journal),'utf8'));
 return {unit:u.unit,sha256:u.sha256,summary:u.summary,timeline_patch:j.patch.filter(x=>JSON.stringify(x.path??x).includes('timeline'))};
});
fs.writeFileSync(path.join(base,'ffirst-time-4-6.json'),JSON.stringify(tracking,null,2)+'\n',{flag:'wx'});
const report={at:new Date().toISOString(),nature:'Codex informed model reading, not blind/human/market/author-final',whole_task:{from:1,to:48,complete:false},actual:{from:1,to:24,pages:total,next_unit:25},revision:state.revision,state_sha256:sha(stateBytes),generation:checkpoint.generation,content_id:doctor.build.observed_content_id,checkpoint_files_compared:Object.keys(checkpoint.files).length,changed_files:changed,commands:['ffirst-entry-status','ffirst-entry-1','ffirst-entry-2','ffirst-entry-3','ffirst-stop-status','ffirst-stop-check','ffirst-stop-doctor'],mechanical:{status_ok:status.ok,check_ok:check.ok,doctor_ok:doctor.ok,changed_sources:status.changed_sources,stale_units:status.stale_units,impact_pending:status.impact_pending,pending_windows:check.rolling_review.pending_windows,warnings:check.findings.length,review_counts:status.review_workflow.counts},chapters,notes_sha256:sha(fs.readFileSync(path.join(base,'F首程阅读笔记.md'))),auxiliary_errors:['functions.exec input SyntaxError before execution while saving chapter15; corrected, no file/state write','node -e extra closing brace in time extraction; exit1, no evidence file/state write; replaced by this separate script'],no_project_mutations:true,no_chapter_25_48_full_text_read_in_this_process:true};
fs.writeFileSync(path.join(base,'ffirst-stop-audit.json'),JSON.stringify(report,null,2)+'\n',{flag:'wx'});
const lines=['# 交接 F 首停','','本程已完成当前登记第1—24章连续分页实读，105页；整体当前1—48全读仍未完成，下一章25。未读25—48正文，不冒称全书完成。本轮为同一Codex模型知情阅读，不是盲读、人类阅读、市场验证、作者定稿或出版验收。','',
'## 状态与保全','',
'真实入口和首停status/check/doctor均退出0且ok=true：r254、48登记章；E修订会话46029167-c62a-44f9-b591-e053ddc01bbb已committed，fd097e82-0720-4632-8b92-57f8a7e48bcf已completed。无活跃修订/待恢复事务，无stale_units/changed_sources/impact_pending；pending_windows空。25条旧稿警告、6 needs-recheck与13 optional open保持。',
'generation 7；content_id '+report.content_id+'；state SHA '+report.state_sha256+'。checkpoint-f-entry.json的680项字节数和SHA由脚本逐项比较，入口/首停均零差异；不向模型逐哈希展开清单。未修改正文、来源、workflow、权威state、真实作品、旧封存包或产品源码，未提交推送发布/外发/子代理/额外会话/后台写稿。',
'',
'## 阅读证据','',
'F首程阅读笔记.md逐章记录已发生事实、人物所知、款物、种下预期、结构与不同收益，并列未核查边界。read-pages/ffirst-uNN-pNN.json保存每页1800字符的实际返回和当前SHA，逐章逐页串行读取，包括短末页；ffirst-stop-audit.json校验105页连续覆盖、页文本/当前登记SHA相同及顺序。脚本只是覆盖证明，不替代本次实际实读。ffirst-page.mjs只负责从当前登记定位1—24章并调用read.mjs，禁止越到25。',
'',
'|章|当前登记文件|实读页数|当前SHA-256|','|---|---|---:|---|',
...chapters.map(u=>'|'+u.unit+'|'+u.draft+'|'+u.pages+'|'+u.sha256+'|'),
'',
'## 已核、未核与下一步','',
'1. 已实读4—6停航首日正文，并提取当前summary及journal时间线到ffirst-time-4-6.json，日期应按同日视点切换理解；19正文题名为“提前的一个半钟头”，14:30对16:00为90分钟，历史文件名未改。本轮不重新apply或verify这些旧意见，须全48读完再按稳定ID正式核。',
'2. 本程未确认新的高置信必改问题，未启动修订。余四条旧问题涉及36/42/45，E受控花册14、门料10/总50、豆干三宽条等只从交接获知，尚未在本程后半实核，不能认定全书连续性已通过。所有六条原application保持历史，不能为闭环制造第二次假修改。',
'3. 下一进程从第25章当前登记版本开始，恢复status/check/doctor及构建/断点字节比较，顺序完整分页25—48；必要时recall并实读原来源。先读后报告/正式覆盖，整体完成后再逐ID verify。若发现确认问题，精确页/引文/SHA取证交根，再依原授权进入正式独立修订；不锁外改稿。',
'4. 重点承接：工装24仅课堂/家中短试，硬角/针眼/深色保留，真正工作与洗后感受待核；父伤脚/袋局部平边与承重点/毛点不混，凳宽29未削、经营位置仍会有摩擦；原画册与原全空白书签（24移夹下一页）、新练布/补片/余布/针盒/女记事簿各自身份保护；旧闪灯/第二幅窗帘/外流旧图/复航仍未闭合。',
'5. 重复结构暂为可选节奏风险：收手/少接/慢吃/收物/锁门确多，但20实际少卖四份且老板闷、23女对母独吃空落/父女急话、21凳雨天挤路等代价给了不同收益。不按词频改句，不把知情阅读当陌生读者或市场判断。',
'',
'## 辅助错误与断点','',
'两次辅助错误均已说明并纠正：第15笔记保存调用在functions.exec语法解析即拒（未执行）；node -e时间线提取多括号退出1（未写文件），改独立ffirst-close.mjs。公开工具命令及105页正文读取均成功。早期口头总页数手算107后纠为105，正式逐章清单/原页记录一致。无产品故障结论。',
'',
'保存本交接后停止。本进程最后实读文本为24章末女在自己记事簿歪篮背面画小方角；25章正文未读。全书阅读首停是进程断点，1—48整体任务未完成。',''];
fs.writeFileSync(path.join(base,'交接-F首停.md'),lines.join('\n'),{flag:'wx'});
console.log(JSON.stringify({ok:true,revision:state.revision,registered_units:state.units.length,read_chapters:chapters.length,read_pages:total,next_unit:25,compared_files:Object.keys(checkpoint.files).length,changed_files:changed,tracking},null,2));
