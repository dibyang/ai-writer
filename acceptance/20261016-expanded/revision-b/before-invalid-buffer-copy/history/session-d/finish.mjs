import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {base,project,read,save,state,hash,metrics} from './files.mjs';
const s=state(),ms=metrics(),manifest=read(base+'/export/manifest.json'),ex=read(base+'/cli/final-export.stdout');
const book=readFileSync(base+'/export/manuscript.md','utf8');
const expected=Array.from({length:16},(_,i)=>i+1);const errors=[];
if(JSON.stringify(ex.included_units)!==JSON.stringify(expected))errors.push('included units');
if(ex.excluded_drafts.length||ex.warnings.length)errors.push('excluded/warnings');
let cursor=-1;const chapters=s.units.map(u=>{const txt=readFileSync(project+'/'+u.draft,'utf8').trim();const index=book.indexOf(txt);const occurrences=book.split(txt).length-1;if(index<=cursor||occurrences!==1)errors.push('chapter '+u.unit);cursor=index;return {unit:u.unit,draft:u.draft,sha256:hash(project+'/'+u.draft),occurrences,index};});
if((book.match(/^# 第.+章 /gm)||[]).length!==16)errors.push('heading count');
if(hash(base+'/export/manuscript.md')!==ex.sha256)errors.push('export hash');
const manifestUnits=manifest.units??[];
for(const u of s.units){const m=manifestUnits.find(v=>v.unit===u.unit);if(!m||m.sha256!==u.sha256)errors.push('manifest '+u.unit);}
const verify={created:new Date().toISOString(),revision:s.revision,included_units:ex.included_units,excluded_drafts:ex.excluded_drafts,warnings:ex.warnings,manuscript_sha256:hash(base+'/export/manuscript.md'),manifest_sha256:hash(base+'/export/manifest.json'),state_sha256:hash(project+'/.writer/state.json'),chapters,errors};
save(base+'/export-verification.json',verify);save(base+'/final-metrics.json',ms);
const sourceRefs=['writer.json','.writer/state.json','设定/作品定位.md','设定/文风.md','设定/权威规则.md','设定/角色卡.md','大纲/全书大纲.md',...readdirSync(project+'/大纲/分卷').map(f=>'大纲/分卷/'+f),...s.units.flatMap(u=>[u.draft,`大纲/单元/${String(u.unit).padStart(4,'0')}.json`]),'审查/session-d-0010-0015连读.md','审查/session-d-0001-0016模型知情复核.md'];
save(base+'/final-sources.json',{revision:s.revision,files:Object.fromEntries(sourceRefs.map(r=>[r,hash(project+'/'+r)])),journal_refs:s.units.map(u=>({unit:u.unit,journal:u.journal,sha256:u.journal_sha256}))});
const logs=readFileSync(base+'/cli-index.jsonl','utf8').trim().split(/\r?\n/).map(JSON.parse);const broken=[];
for(const l of logs){for(const ext of ['stdout','stderr','meta.json']){const p=base+'/cli/'+l.label+'.'+ext;try{readFileSync(p);}catch{broken.push(p);}}}
save(base+'/cli-log-verification.json',{commands:logs.length,missing_files:broken,nonzero:logs.filter(l=>l.exit_code!==0).map(l=>({label:l.label,exit_code:l.exit_code,argv:l.argv})),files:logs.map(l=>({label:l.label,stdout_sha256:hash(base+'/cli/'+l.label+'.stdout'),stderr_sha256:hash(base+'/cli/'+l.label+'.stderr'),meta_sha256:hash(base+'/cli/'+l.label+'.meta.json')}))});
if(broken.length)errors.push('missing CLI log');
const table=ms.map(u=>{const first=u.unit>=13?read(base+`/cli/u${u.unit}-record${u.unit===13?'-retry':''}.stdout`).revision:'原26基线';const rr=u.unit>=13?read(base+`/cli/u${u.unit}-rerecord.stdout`).revision:'未重登';return `|${u.unit}|${u.draft}|${u.han}|${first}|${rr}|${u.sha256}|`;}).join('\n');
const result=`# 潮汐信号 session-d 实跑结果

2026-10-16。作品：acceptance/20261016-expanded/works/潮汐信号。仓库cwd：D:/work/other/ai-writer。本阶段只写该作品及acceptance/20261016-expanded/session-d/，没有子代理、产品修改、手改state/journal、提交、推送、上传或发布。交付性质为创作草稿与模型知情自检，不是文学定稿、真人盲读、市场验证或产品发布验收。

## 完成与实际范围

由初始revision26、next13独立恢复；status/check/outline后完整实读当前1–12，读设定、全书大纲、当前state和当前有效r26报告；未沿当前报告链接读历史旧状态、旧正文、其他阶段请求/聊天/结果或测试README补剧情。前12章纲只作哈希盘点，剧情判断用实际正文；四卷契约均实读，13–16章纲由本会话逐章制定。

创作13–16并逐章plan/context/record-template、保存写前revision和来源、全文读回自检、record与check；第15章后及时完整连读10–15并review。第16章后按1至16全文顺序读回，另核26条账本及四卷契约。之后仅修复登记知情字段、正文全字节不变，全稿报告绑定相同当前哈希与最终revision35，已review登记。O_CURRENT补召回后又全文读第8章。恢复记录见recovery.md；最终知情报告在作品审查/session-d-0001-0016模型知情复核.md。

## 字数、修订与正文哈希

计数表达式为Unicode Script=Han，剔除首行标题；空白、标点、阿拉伯数字不计。13–16分别1566、1568、1568、1569，共6271汉字，均1500–2000。

|章|正文文件|正文汉字|首次成功登记revision|最终重登revision|SHA-256|
|---|---|---|---|---|---|
${table}

## 知情、保管、回收边界

铜牌固定为西埠四号泊位、右下两短线、正反无日期；第2章沈独见，第5周、第7唐、第11顾才获口述，第14唐首次亲见且沈唐各拍当次照，不倒补第1日照片。周顾仍未亲见。牌仍随唯一原箱，沈负责顾店顶架，旧标签保留新胶带复封；没有第三次交接，归属待核，收费到第6日早。现厅六号仍行李寄存、另接驳登船，蓝箭头朝东；不以旧牌四号套窗口。

原铜钥匙三角磨痕蓝棉绳未变。第16章唐首次得交接来处并亲见，原钥在唐罗在场、获准下实际试开现矮柜锁，另建I_KEY_USE，只证现时可开，不证唯一原配或谁锁过；锁回后原袋回沈内侧拉链袋。唐开小库用自钥，灯门铁丝、箱搭扣无锁。原带仍沈前层硬袋原盒，未重播、未倒带；第11章只是店试机带异响，不能据此认原带安全。

灯号在13章用门背实物核对、15章罗对照片改口、16章检查页提供有限旁证，产生费用接收责任、留下整理及罗愿同行的行动后果。13现场沈唐许，15罗顾只看照/旁听，唐只电话获改口，周未获新证据。黄两短只规定岸端暂停，不能证明船在等。T_LAMP仍partial/due9，具体亮灯、船况和完整年代未知，报价、接收地、实际拆存尚未完成。

新检查簿原件唐管旧站窗边另一干筐连硬衬，沈只持封面和可展页工作照；只见2010年8月例检页，不借年月给声音配班，不把签名认沈岚，也不认目录续页。通知原页唐原筐，维修复印纸许匣，周抄件自持。T_SIGNAL partial/due12仍缺声音连续来源、剪者、日期班次及消息给谁/是否接收证据；T_TAPE partial/P_TAPE active due18未收；T_PRIVATE intentional-open无私因作者答案。T_MAP/T_INDEX/T_EAST仍partial。第5日日单未交，检查簿收取单不能顶替当日单。

## 错误与修复

- 首次recall误带不支持的--max-chars，作品CLI子进程实际退出2，原始stdout/stderr及argv保留；随后按帮助逐ID查询成功。外层exec工具当时报告exit_code1，未用它覆盖子进程实际值。
- 第13章初稿1444汉字，辅助脚本拒绝准备；随后空摘要record被拒，作品CLI子进程退出2，日志原样保留。未改变revision。补实际费用协商后为1566，再完整核查登记。辅助脚本错误及外层工具结果记录于tool-errors.md。
- 第15章登记前将第5日回指第2日的“前天”改“大前天”，第16章登记前补清照片与取放顺序。没有对已登记正文直接补改。
- 最终语义复核发现部分人物所知被过度摘要，保存pre-rewind-r30-state.json和全账本，正式rewind13（30→31），逐章重登13/14/15/16（32/33/34/35）。重登输入重新取得真实context/template，原写前模板保留。最新内容置前、截至前章的完整已知历史保留。回退前后26条ledger逐项核对，148条证据完全一致；人物原知情文本全部保留，其他事实字段/状态/到期/custody/读者所知均无变化。前12章正文也未改。详见rewind-comparison.md/json。
- 一次辅助批量工具接口名称错误、一次报告补丁格式错误被工具拒绝，均无文件变化，改正后完成；没有当作产品成功结果。

## context遗漏项与召回

13无omitted_ids；14遗漏T_PRIVATE，已显式recall并全文回读第3章，后续私因不删不解释；15遗漏O_CURRENT，本章未用现厅作新结论，最终又显式recall并全文回读第8章，现厅/旧地理边界保留；16无遗漏。恢复与各章另实际recall主要ID，包含T_LAMP、O_PLATE/P_BOX、O_KEY/P_KEY、P_TAPE/T_TAPE、T_SIGNAL、T_PRIVATE、T_KEY_CABINET。原始结果在cli/，不把召回当全文阅读。

## 最终检查与导出

作品内自带工具版本0.3.0，Node v24.15.0。最终status：revision35/next17，16章已登记，无stale_units、changed_sources、unregistered。check：findings空、pending_windows空；3个有效报告，5个历史过期报告均有当前覆盖，过期报告没有删除。doctor：errors/warnings空。这些只证明工具追踪一致。

export实际输出到acceptance/20261016-expanded/session-d/export，included_units恰好1–16，excluded_drafts及warnings为空。另实际核对合稿16个章标题、每章当前全文恰好出现一次且顺序一致、清单逐章哈希相同，无遗漏或多章。导出验证错误数：${errors.length}。

- 当前state SHA-256：${verify.state_sha256}
- 初始state SHA-256：94a5ba30bd3bf8ae48b3f7dd08eafb1859fc2b78ae8a5ec5280f4af8a2a098ad
- export/manuscript.md SHA-256：${verify.manuscript_sha256}
- export/manifest.json SHA-256：${verify.manifest_sha256}
- 作品CLI实际调用${logs.length}次，2次非零结果原样保留；每次有.meta.json（真实executable/argv/cwd/exit_code）、原始.stdout和.stderr。CLI文件完整性见cli-log-verification.json，缺失${broken.length}个。

来源哈希完整清单final-sources.json；写前输入u13–u16-record-template.json、首次changes/record与重登rerecord-template/rerecord均保留。全账本证据逐条实际行/当前哈希核验在final-audit.json，旧20个ID及113条证据全部保留，当前26个ID、148条证据。导出验证export-verification.json，字数final-metrics.json，阅读绑定final-reading/manifest.json。

未做npm产品测试，因为本次未改产品。未写17–24，V3与全书未结束；仅交付本次授权13–16草稿及1–16当前合稿。
`;
writeFileSync(base+'/result.md',result,'utf8');
console.log(JSON.stringify({revision:s.revision,chapters:chapters.length,han_13_16:ms.filter(u=>u.unit>=13).map(u=>u.han),state_sha256:verify.state_sha256,manuscript_sha256:verify.manuscript_sha256,manifest_sha256:verify.manifest_sha256,cli_commands:logs.length,errors},null,2));if(errors.length)process.exitCode=1;
