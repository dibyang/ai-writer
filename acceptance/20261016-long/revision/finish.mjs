import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {project,revision,read,write,sha,files,cli} from './session-tools.mjs';
const state=read(path.join(project,'.writer/state.json')), before=read(path.join(revision,'before/.writer/state.json'));
const status=cli(['status'],'final/status.json'), check=cli(['check'],'final/check.json');
assert.equal(status.revision,19); assert.equal(status.next_unit,9); assert.deepEqual(status.stale_units,[]); assert.deepEqual(status.changed_sources,[]);
assert.deepEqual(check.findings,[]); assert.deepEqual(check.rolling_review,{valid:1,stale:4,pending_windows:[],nature:'coverage-only-not-literary-pass'});
const exp=read(path.join(revision,'export/manifest.json'));
assert.deepEqual(exp.included_units,[1,2,3,4,5,6,7,8]); assert.deepEqual(exp.excluded_drafts,[]); assert.deepEqual(exp.warnings,[]);
const exported=fs.readFileSync(path.join(revision,'export/manuscript.md'),'utf8');
assert(!/七号|7号柜|七號/.test(exported)); assert.equal(sha(path.join(revision,'export/manuscript.md')),exp.sha256);
assert.equal((exported.match(/^# 第.+章 /gm)||[]).length,8);
for(const u of state.units)assert(exported.includes(fs.readFileSync(path.join(project,u.draft),'utf8').trim()));
const audit=read(path.join(revision,'audit.json'));
const report='审查/1-8修订连读-20261016.md';
const review=read(path.join(revision,'review-result.json'));
const records=Array.from({length:7},(_,i)=>{const n=i+2,id=String(n).padStart(2,'0');return {unit:n,expected_revision:read(path.join(revision,`chapters/${id}/template.json`)).expected_revision,result:read(path.join(revision,`chapters/${id}/record-result.json`)),context_sha256:sha(path.join(revision,`chapters/${id}/context.json`)),template_sha256:sha(path.join(revision,`chapters/${id}/template.json`)),input_sha256:sha(path.join(revision,`chapters/${id}/record-input.json`))};});
write(path.join(revision,'final/record-provenance.json'),records);
const active=['.writer/state.json',...state.units.flatMap(u=>[u.draft,u.journal]),...audit.consumed_plan_and_setting_files,report,review.ref];
write(path.join(revision,'final/manifest.json'),[...new Set(active)].map(rel=>({path:rel,sha256:sha(path.join(project,rel))})));
const log=fs.readFileSync(path.join(revision,'cli-session.jsonl'),'utf8').trim().split('\n').map(JSON.parse);
const errors=log.filter(e=>e.exit!==0);
write(path.join(revision,'errors.md'),'# 本次调用错误原始记录\n\n以下为调用参数／编排错误；修正后真实CLI继续完成。没有修改产品或手改state/journal。\n\n首个工具编排调用在尝试从functions工具列表寻址FastCtx时失败，尚未进行任何作品修改：\n\n```text\nScript failed\nScript error:\nTypeError: tools[(intermediate value)] is not a function\n    at exec_main.mjs:3:302\n    at Array.map (<anonymous>)\n    at exec_main.mjs:3:221\n```\n\n随后改用直接FastCtx调用。CLI非零退出共'+errors.length+'次；原始argv、stdout与stderr另存cli-session.jsonl：\n\n'+errors.map(e=>'```json\n'+JSON.stringify(e,null,2)+'\n```\n').join('\n')+'\nrecord-template不支持--max-chars；删除该额外参数后重新取模板，未复用失败模板或旧哈希。\n');
const hashes=audit.actual_text_changes.map(d=>`| ${d.unit} | ${d.changed?'修订':'保留原文'} | ${d.before_sha256} | ${d.after_sha256} |`).join('\n');
const history=audit.reviews.current.filter(r=>!r.valid).map(r=>`| ${r.ref} | ${r.from}–${r.to} | ${r.reasons.join('; ')} |`).join('\n');
const sourceChanges=['0002.json：change及第2个beat中的柜号','0003.json：禁止陆衡提前知情条款中的柜号','0006.json：第1个beat的目录柜号'];
const rows=records.map(r=>`| ${r.unit} | ${r.expected_revision} | ${r.result.revision} | ${r.result.sha256} |`).join('\n');
const firstTime=log[0].time,lastTime=log.at(-1).time;
const elapsed=((Date.parse(lastTime)-Date.parse(firstTime))/60000).toFixed(1);
write(path.join(revision,'result.md'),`# 雨线档案：旧章修订与连续性恢复结果

日期：2026-10-16。完成范围为第1–8章既有文本修订与恢复登记；没有写第9章。语义结论为本主会话知情模型审查，不是真人盲读或正式验收。

作品：acceptance/20261016-long/works/雨线档案。证据目录为同阶段revision/。产品代码和其他阶段输出未改；未读其他阶段聊天事件/请求作剧情依据；未使用子代理，未提交、推送、发布或外部上传。

## 实际修订与保留

这是作者改写旧版本：纸签首次出现即为九号柜，不是人物记错后纠正。副页待核、半月缺口、黑垢及原有基本事件保留。正文共6处必要替换，未按字数扩写：

| 位置 | 改前 | 改后 |
| --- | --- | --- |
| 第2章纸签 | “七号柜”“副页待核” | “九号柜”“副页待核” |
| 第5章林岚告知 | ‘七号柜’，‘副页待核’ | ‘九号柜’，‘副页待核’ |
| 第5章陆衡追问 | 七号，是纸签写的？ | 九号，是纸签写的？ |
| 第6章目录 | 七号柜那一行 | 九号柜那一行 |
| 第6章末 | 铜钥匙也仍在她内袋里。 | 铜钥匙也仍在林岚包内袋里。 |
| 第7章批件 | 准查七号柜旧泵房维护档案 | 准查九号柜旧泵房维护档案 |

第1、3、4、8章正文原字节保留。第1章完整登记索引、journal及O_KEY观察未变；第3、4、8章虽未改字，也完整重读并通过record重新建立追踪。细纲仅${sourceChanges.join('；')}同步，共4处柜号替换；由真实plan命令落盘。其余细纲、全书大纲、三卷契约和设定未改。

## 回退、重新登记与版本

修改前before/已冻结54个来源/状态/审查/检查文件，另有manifest.json（55个文件总计）；备份全部哈希已回读验证。含实际1–8正文、state、当前journal、4条审查登记及审查正文、计划/设定、历史登记输入。before/status.json与before/check.json绑定revision11。旧记录仅作历史证据，不采用其过期revision/source_hashes。

正式命令：node bin/ai-writer.mjs rewind --project acceptance/20261016-long/works/雨线档案 --from 2 --expected-revision 11。结果revision12，失效2–8共7章，全部旧正文保留，仅第1章仍登记。CLI原生备份为${read(path.join(revision,'after-rewind/rewind.json')).backup}。回退后的status/check/state及0有效／4过期结果在after-rewind/。

O_LABEL在回退后的账本中不存在；本轮record2才重新建立“九号柜／副页待核／无日期签名”的观察，introduced_unit=2。未在保留旧观察时逆改不可变字段。各章先核对受影响细纲，再独立取得新context与写前template，完整读最终章稿后填写摘要与changes，顺序登记；从历史输入仅取已按实际正文复核的语义候选，所有expected_revision和source_hashes均来自本轮模板。未手改state或journal。

| 章 | 写前revision | record后revision | 实际最终正文SHA-256 |
| --- | --- | --- | --- |
${rows}

最终state revision：19。state文件SHA-256：${sha(path.join(project,'.writer/state.json'))}。修前state SHA-256：${sha(path.join(revision,'before/.writer/state.json'))}。回退state SHA-256：${sha(path.join(revision,'after-rewind/state.json'))}。完整最终状态副本为final/state.json，原件仍以作品.writer/state.json为权威。

| 章 | 正文处理 | 修前SHA-256 | 修后SHA-256 |
| --- | --- | --- | --- |
${hashes}

## 跨章复核与当前恢复点

修改前完整实读1–8章及相关计划/账本；逐章重登时完整复读2–8；最后再次顺读1–8最终稿。最终阅读副本为final-reread.tmp.md，SHA-256 ${sha(path.join(revision,'final-reread.tmp.md'))}。逐章context、template、输入、record结果、state前后副本及check在chapters/02至08/，哈希汇总在final/record-provenance.json。

当前正文、state及15份已消费计划/设定无旧柜号残留，52条当前账本引文的正文哈希、行号和实句均匹配。audit.json记录只读机械核对；语义复核记录在作品${report}，其SHA-256为${sha(path.join(project,report))}。

钥匙：陈师傅→林岚（第1章）→陆衡（第7章）；第5–6章始终林岚包内袋，第6章只是消歧，没有交许澄。最终在陆衡双肩包小拉链袋内透明袋，袋口未开，未试锁、未复制、未证实匹配。封套：许澄→林岚（第2章）→陆衡（第4章14:20）→许澄（第5章），最终仍许澄上锁干燥抽屉，签封未拆。无物件凭空回到前保管人。

知情：林岚和读者第2章亲见九号柜与副页待核；陆衡最早第5章实际听述，许澄同章随后获告知；两人仍未亲见内签。目录、批件与环境签字不等于副页已找到。第8章末档案柜未开，铜钥匙未出袋，维护册与副页未取得或比对。T_COPY=partial、due_unit=6继续到期挂账，第6–8章写前context持续召回due；T_MISSED=intentional-open，私人原因未定不补。V3仅为未来计划，本次没有unit9细纲、正文或record。

## 审查有效性

| 时点 | 有效 | 过期 | 待审窗口 |
| --- | --- | --- | --- |
| 修前revision11 | 3 | 1 | 无 |
| rewind后revision12 | 0 | 4 | 尚只登记第1章，无到期窗口 |
| 2–8重登完、登记新审查前 | 0 | 4 | 1–3、1–6 |
| 最终revision19 | 1（本次新报告） | 4（旧登记） | 无 |

新review真实登记${review.ref}，覆盖[1,8]，包含1–6有效滚动连读；没有为了填数量重复登记报告。旧4条的失效原因保留如下，旧报告/旧日志中的原柜号不清除：

| 旧审查登记 | 范围 | 最终失效原因 |
| --- | --- | --- |
${history}

final/check.json：ok=true、8章、revision19、findings=[]、未登记稿=[]。final/status.json：next_unit=9、stale_units=[]、changed_sources=[]。CLI审查状态仅表示覆盖与哈希有效，不宣称文学质量通过。

## 导出与交接

真实export输出revision/export/，included_units恰好[1,2,3,4,5,6,7,8]，excluded_drafts=[]、warnings=[]。manuscript.md SHA-256：${exp.sha256}。导出全文逐章核对包含实际最终正文，只有8个章标题，无旧柜号。export/manifest.json保留全部正文与来源哈希。状态为draft-export，未发布。

下一会话先运行node bin/ai-writer.mjs status --project acceptance/20261016-long/works/雨线档案；读本结果、作品state与本次审查报告，再按实际授权行动。新写前必须重取context/template，不复用chapters/中的历史写前包；next_unit=9只是恢复点，不是本次续写授权。无须重跑finish.mjs或export覆盖已交付目录。

## 错误与范围限制

共保留1次非零CLI调用：record-template误带--max-chars，报“无效、重复或缺值参数：--max-chars”；修正参数后成功，无登记数据损失。另一次FastCtx寻址编排TypeError也保存在errors.md。原始CLI argv、退出码、stdout/stderr在cli-session.jsonl；没有用手改JSON绕过校验，也没有认定为产品缺陷或改产品。

本次CLI证据日志起止${firstTime}至${lastTime}，该日志跨度约${elapsed}分钟，不包含最初读取技能/正文的时间。未作真人盲读、市场验证、现实档案专业验收或第9–12章结果验证。产品源码未修改，因此未运行产品npm测试；实际执行的是本轮作品status/check、哈希证据核验、review和export。
`);
console.log(JSON.stringify({revision:state.revision,state_sha256:sha(path.join(project,'.writer/state.json')),review:check.rolling_review,export:exp.included_units,result:path.join(revision,'result.md'),cli_errors:errors.length},null,2));
