import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {isDeepStrictEqual} from 'node:util';
import {stage,work,read,write,hash} from './revise.mjs';
const root='D:/work/other/ai-writer';
const s=read(path.join(work,'.writer/state.json')),a=read(path.join(stage,'audit.json')),m=read(path.join(stage,'export/manifest.json'));
const failures=[];const check=(ok,n)=>{if(!ok)failures.push(n);};
check(a.ok,'audit ok');check(m.revision===s.revision&&s.revision===26,'manifest final revision');
check(isDeepStrictEqual(m.included_units,Array.from({length:12},(_,i)=>i+1)),'export exact 1..12');
check(m.excluded_drafts.length===0&&m.warnings.length===0,'export no exclusions warnings');
const text=s.units.map(u=>fs.readFileSync(path.join(work,u.draft),'utf8').trim()).join('\n\n---\n\n')+'\n';
const exported=fs.readFileSync(path.join(stage,'export/manuscript.md'));
check(exported.equals(Buffer.from(text)),'export exact merged final drafts');check(hash(exported)===m.sha256,'export hash');
check(isDeepStrictEqual(m.units,s.units.map(u=>({unit:u.unit,draft:u.draft,sha256:u.sha256,source_hashes:u.source_hashes}))),'export all unit and source hashes');
const reviewRef=JSON.parse(fs.readFileSync(path.join(stage,'cli/012-review-final.stdout'),'utf8')).ref;
const rv=read(path.join(work,reviewRef));check(rv.report_sha256===hash(fs.readFileSync(path.join(work,rv.report))),'review report hash');
check(rv.units.every(r=>hash(fs.readFileSync(path.join(work,r.draft)))===r.sha256),'review final body hashes');
const finalStatus=JSON.parse(fs.readFileSync(path.join(stage,'cli/013-status-final.stdout'),'utf8'));
const finalCheck=JSON.parse(fs.readFileSync(path.join(stage,'cli/014-check-final.stdout'),'utf8'));
const doctor=JSON.parse(fs.readFileSync(path.join(stage,'cli/015-doctor-final.stdout'),'utf8'));
check(finalStatus.ok&&finalStatus.stale_units.length===0&&finalStatus.changed_sources.length===0&&finalStatus.draft_inventory.unregistered.length===0,'status clean');
check(finalCheck.ok&&finalCheck.findings.length===0&&finalCheck.rolling_review.pending_windows.length===0&&finalCheck.rolling_review.stale_without_current_coverage===0,'check clean coverage');
check(doctor.ok&&doctor.errors.length===0&&doctor.warnings.length===0,'doctor clean');
const commands=[];for(const f of fs.readdirSync(path.join(stage,'cli')).filter(x=>x.endsWith('.json')).sort()){
 const r=read(path.join(stage,'cli',f));check(r.exit_code===0,'CLI exit '+f);check(fs.readFileSync(path.join(stage,'cli',f.replace(/\.json$/,'.stdout')),'utf8')===r.stdout,'stdout '+f);check(fs.readFileSync(path.join(stage,'cli',f.replace(/\.json$/,'.stderr')),'utf8')===r.stderr,'stderr '+f);
 commands.push({label:f.slice(0,-5),...r});
}
write(path.join(stage,'cli-index.json'),commands);
for(const [label,args]of [['git-final-status',['status','--short']],['git-product-diff',['diff','--exit-code','--','lib','bin','tests','.agents','package.json','package-lock.json']]]){
 const started=new Date().toISOString();const r=spawnSync('git',args,{cwd:root,encoding:'utf8'});
 const log={started,ended:new Date().toISOString(),cwd:root,executable:'git',argv:args,exit_code:r.status,stdout:r.stdout,stderr:r.stderr};
 write(path.join(stage,'script-logs',label+'.json'),log);fs.writeFileSync(path.join(stage,'script-logs',label+'.stdout'),r.stdout);fs.writeFileSync(path.join(stage,'script-logs',label+'.stderr'),r.stderr);check(r.status===0,label);
 if(label==='git-final-status')check(!r.stdout.split(/\r?\n/).filter(Boolean).some(x=>!['?? .idea/','?? acceptance/20261016-expanded/'].includes(x)),'unexpected repository status');
}
check(!fs.existsSync(path.join(root,'revision-a')),'no root revision-a');
const old=read(path.join(stage,'before/work/.writer/state.json'));
let diffMd='# 逐章正文改前改后\n\n修前原文件和哈希均见 before/work 与 before-manifest.json。本表保留整行原句，只比较现行正文，不改历史记录。\n\n';
const lineDiff=[];
for(const u of s.units){const o=old.units[u.unit-1];const b=fs.readFileSync(path.join(stage,'before/work',o.draft),'utf8');const n=fs.readFileSync(path.join(work,u.draft),'utf8');const bl=b.split('\n'),nl=n.split('\n');check(bl.length===nl.length,'line alignment '+u.unit);const changed=[];for(let i=0;i<Math.max(bl.length,nl.length);i++)if(bl[i]!==nl[i])changed.push({line:i+1,before:bl[i],after:nl[i]});lineDiff.push({unit:u.unit,before_draft:o.draft,draft:u.draft,before_sha256:hash(b),sha256:hash(n),changed});diffMd+=`## 第${u.unit}章\n\n原路径：${o.draft}；现路径：${u.draft}。${changed.length?'':'原字节保留。'}\n\n`;for(const d of changed)diffMd+=`第${d.line}行\n\n> 修前：${d.before}\n\n> 修后：${d.after}\n\n`;}
write(path.join(stage,'manuscript-line-diff.json'),lineDiff);fs.writeFileSync(path.join(stage,'manuscript-diff.md'),diffMd);
const summary={ok:failures.length===0,revision:s.revision,registered_units:s.units.length,ledger_count:a.ledger_count,evidence_count:a.evidence_count,source_count:a.source_count,han_min:Math.min(...a.units.map(x=>x.han)),han_max:Math.max(...a.units.map(x=>x.han)),rolling_review:finalCheck.rolling_review,export_sha256:m.sha256,export_manifest_sha256:hash(fs.readFileSync(path.join(stage,'export/manifest.json'))),review_ref:reviewRef,report_sha256:rv.report_sha256,cli_count:commands.length,cli_nonzero:commands.filter(x=>x.exit_code!==0).length,failures};
write(path.join(stage,'delivery-verification.json'),summary);
const descriptions={1:'原字节保留；因第1章已消费权威规则而重登。',2:'牌面改西埠四号泊位，童年旧名联想到海湾西侧；东侧发现位置和箱外标签保留。',3:'标题、文件名及唯一原钥匙两处标识改蓝棉绳；未添加换绳事件，旧路径不在现行账本。',4:'原字节保留；灯语未核、原带交接/准备/短听/停机完整。',5:'向周砚首次完整告知的牌面和复述同步。其他红印保留。',6:'通知改西埠线；补足旧名带西、现路向东的查问因果，仍按现路寻找信息，不宣称到旧址。',7:'向唐穗首次完整告知的牌面及询旧址称呼同步，原行程保留。',8:'旧地名与询问同步；保留现六号寄存，去掉旧牌与现厅同为六的数字联想，改为想沿编号找到四号。',9:'【实读发现修复】14:40后原“还有二十来分钟”改为明确15:20以后才约、算上走路仍来得及。15:00出发与17分钟路程不改。',10:'维修图与查访方向同步西埠；一至六泊位示意仍六处，不替广播定年。',11:'牌面口述及图示转述同步；【实读发现修复】第3日客户“前天”改“昨天”，不补造第1日帮工。',12:'原字节保留；主线partial/due12及所有来源缺口、尚未发生约定保留。'};
let result=`# 第一轮旧章修订与真实Codex恢复验证结果\n\n${summary.ok?'本轮完成':'仍有异常'}。作品：\`acceptance/20261016-expanded/works/潮汐信号\`。本次在真实Codex主会话中实读旧稿、执行实际CLI并恢复追踪；未调用子代理，未伪造CLI输出。\n\n初次status实得revision **13**、已登记**1–12**、next 13、无漂移或未登记稿。权威规则含旧牌面/绳色，第1章source_hashes已经消费它，故正式执行\`rewind --from 1 --expected-revision 13\`，真实回退**1–12**，revision 14；按章plan/context/record-template/record后最终revision **26**。没有复用旧revision或source_hashes，没有手改state/journal。\n\n## 逐章正文\n\n|章|改动|最终汉字数|\n|---|---|---|\n`;
for(const u of a.units)result+=`|${u.unit}|${descriptions[u.unit]}|${u.han}|\n`;
result+='\n第1、4、12章逐字节一致；全部12章在回退范围内完整重读、取得新context/template、顺序重登，完成后再次按1–12连读最终稿。完整原句对照见[manuscript-diff.md](manuscript-diff.md)，路径与哈希见[manuscript-line-diff.json](manuscript-line-diff.json)。每章均满足1500–2000汉字。\n\n';
result+='## 证据、来源及账本\n\n20个ID、113条证据、119项消费来源哈希核验成功；每章原新增ledger字段、人物所知和同章证据逐项对齐，所有原新增证据数量一致。原引文仅按授权标识和第6章因果变化更换同章文本，其余引文逐条保留。全账本语义表和字段改前改后见[ledger-diff.md](ledger-diff.md)，机器明细见[audit.json](audit.json)。比较按字段和值，不按对象键顺序。\n\nT_PRIVATE intentional-open、原4条证据和后续人物未知边界保留，无author_truth。T_LAMP pending/due9；T_SIGNAL partial/due12，尚缺声音连续来源、班次、剪者与消息接收证据；T_TAPE partial/due18和P_TAPE active/due18保持。物件实际交接及未交接边界完整，没有把第4日看箱/对单约定登记为已经发生。\n\n## 审查与导出\n\n';
result+=`当前全稿报告保存在作品[审查/revision-a-0001-0012-全稿知情复核-r26.md](../works/潮汐信号/审查/revision-a-0001-0012-全稿知情复核-r26.md)，真实review引用\`${reviewRef}\`，覆盖1–12。四个窗口1–3、1–6、4–9、7–12全部覆盖：valid 1、旧stale 5但均有当前覆盖、pending_windows空。旧报告及review均原样保留。报告性质为模型知情自检。\n\n最终status/check/doctor均退出0；无漂移、无未登记稿、check findings空、doctor errors/warnings空。\n\n导出：[export/manuscript.md](export/manuscript.md)；[export/manifest.json](export/manifest.json)。恰好1–12，manifest绑定revision **26**，excluded_drafts与warnings均空。已按最终正文顺序重建合订文本逐字节比对导出并校验所有单元/来源哈希。合订稿SHA-256：\`${m.sha256}\`。导出仍是草稿。\n\n`;
result+=`## 证据留存与错误记录\n\n修前作品、state、全部journal、已消费设定/卷纲/章纲、审查报告/review、原始session-a/b/c登记输入及日志，共685文件，保存在[before/](before/)，哈希清单[before-manifest.json](before-manifest.json)。旧字样在历史日志、输入和备份中保留。原journal、旧review、旧报告和作品内工具逐个核验未改。\n\n真实产品CLI共**${commands.length}**次，全部退出0；完整executable、argv、cwd、开始结束时间、退出码、stdout、stderr均在[cli-index.json](cli-index.json)及[cli/](cli/)中。工具显示输出截断不影响落盘原始日志。辅助审计曾因把T_PRIVATE正文哈希变化当语义变化退出1，失败证据保存在attempts/；修正阶段脚本后完整核验退出0。详见[errors.md](errors.md)和[script-logs/](script-logs/)。\n\n章纲均通过plan落盘；除授权字样/地名因果外，第4章起点明确为等电扇继续检查，第12章把旧计划“页号在照片外”对齐正文实际可见纸边缺角无页号。未改变正文事件。\n\n最终交付核验：[delivery-verification.json](delivery-verification.json)。未改产品，git产品差异检查退出0；保留初始已有.idea/和acceptance目录状态。未提交、推送或发布，未写第13章，所有本轮辅助文件/日志/备份/导出均使用完整acceptance/20261016-expanded/revision-a路径，根目录不存在revision-a。\n`;
fs.writeFileSync(path.join(stage,'result.md'),result);
console.log(JSON.stringify(summary,null,2));if(failures.length)process.exitCode=1;
