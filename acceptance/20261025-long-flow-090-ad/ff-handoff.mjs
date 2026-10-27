import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import crypto from 'node:crypto';import {spawnSync} from 'node:child_process';import assert from 'node:assert/strict';
const base=path.dirname(fileURLToPath(import.meta.url)),r=JSON.parse(fs.readFileSync(path.join(base,'f-first-reading.json'))),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const checkpoint=path.join(base,'checkpoint-f-first.json'),checkpointState=path.join(base,'checkpoint-f-first-state.json');
let checkpointResult;
if(fs.existsSync(checkpoint)||fs.existsSync(checkpointState))checkpointResult={created:false,reason:'Same-name exists; not overwritten',path:checkpoint,state_path:checkpointState};
else{const x=spawnSync(process.execPath,[path.join(base,'checkpoint.mjs'),'f-first','60'],{encoding:'utf8',maxBuffer:16*1024*1024,windowsHide:true});assert.equal(x.status,0,x.stderr);checkpointResult={created:true,path:checkpoint,state_path:checkpointState,stdout:JSON.parse(x.stdout)};}
const state=fs.readFileSync(path.join(r.project,'.writer/state.json'));assert.equal(sha(state),r.state_sha256);
const table=r.first30.map(x=>`| ${x.unit} | ${x.draft} | ${x.sha256} | 1—${x.pages} / 0—${x.total_utf16} |`).join('\n');
const lines=[
'# AD F首停交接：当前1—30完整阅读，等待同ID恢复31—60',
'',
`原生thread：${r.thread_id}。这是E正式发布后全新thread，与E的01a1723a-0b10-7d13-bb86-eabb701c7e89不同。之后必须同此F thread恢复，不另开原生会话/子代理。`,
'',
`主state r${r.revision}/60，SHA ${r.state_sha256}。generation7，CID ${r.tool.content_id}，RID ${r.tool.runtime_id}。主state与入场字节相同；checkpoint-f-entry的986项文件hash/字节零差异；60当前正文SHA全匹配。`,
'',
'## 真实完成与阅读版本',
'',
'已逐章完整读当前1—30共143页，每页1800 UTF-16字符、每次至多两页，同章两页也是顺序执行；各章所有页完整返回后才下一章。没有跨章Promise.all/并发，没有正文截断/Warning批次。21完整读完后额外完整回查9p4一页；原公共事件实际顺序须根独立核，不用排序的页清单冒证。',
'',
'逐页from/to、页输出SHA、存盘页SHA及完整语义笔记指向：f-first-reading.json。正文与SHA来自主state，不读旧分段/旧候选代当前。逐章目标—阻力—选择—后果—关系、知情、物/钱/时、伏笔在f-first-notes.md（1—12）和f-first-notes/13.md至30.md。汇总报告f-first-report.md；新问题f-first-findings.md。',
'',
'| 章 | 当前draft | 当前SHA256 | 全部页 / UTF-16字符区间 |',
'| --- | --- | --- | --- |',table,
'',
'## CLI与来源/意见收据',
'',
'入场ff-entry-status/check/doctor/sources/revisions/issues与停止前ff-stop-*六类均通过AD/cli.mjs真实捕获，退出0、before/after state同SHA。status无stale/changed_sources/impact_pending；13个revision session均committed，20个事务均completed；doctor安装构建完整匹配。36历史未登记稿保留不删除。ff-stop-audit.json记录完整核验；它与f-first-reading.json仅验证本地字节，不代根公开事件阅读审计。',
'',
'32来源冻结对象/31range、24消费绑定真实object_ref按SHA核对；CR33_RECALL_ID_V2冻结bbc56b1c15e97bb9d22895d04979687543f7a5b93b710ebf36d8df02b6b95858及33消费绑定保持。0033活动入口c90f旧内容仍editing-entry-only-not-published；本程只定位未读33正文。O_BOX_PAINT原statement/author_truth与1/3本程完整原文相容，不变观察不改。',
'',
'当前8历史意见仍needs-recheck，13optional仍open。check pending_windows仍40—45/43—48/46—51，14旧报告stale_without_current_coverage。原origin/application/commit整state原字节保持，本程未resolve/apply/verify。最终当前60报告后才闭环，不二次采用或改已正确正文。',
'',
'## 实际新问题与非问题',
'',
'F_PRE_DISTANCE_09_21（continuity/minor/high）：9p4“面摊只隔两家门面”，21p2待送廖凳“送过去只隔两条街”，同一梁家铺/面摊未有搬迁；9p4已额外完整回查，准确上下文/SHA见findings。仅列证据，不建revision或issue，待31—60再核是否存在搬迁证据与根安排。',
'',
'没有新增高置信真人语言硬问题。边界解释密度、膝笑、焦蛋及30课后旁白只可选，不升必改。21—22书签原大白纸/借者小条与30电话纸分别明确，不能武断认瞬移。80/35/81/84与29厘米和19:00—20:40/100分钟前30已原文核。',
'',
'## 恢复必须继续的范围',
'',
'31—60全篇尚未读；all_current_units的后30SHA只是文件完整性，不是阅读覆盖。先核本交接/当前主state/首停checkpoint与同thread，再31→60严格每章完整两页小批返回，必要跨章回查按实际证据进行。F全书结论必须来自本次两程实际完整阅读；旧E尾段/AC报告仅定位。',
'',
'重点后半：33 CR33 V2；AC14元册/工40料10总50/三宽条及分吃；51何师傅、58沈成林问老板怎么说；E48砂纸一粗两细总三、54新灯72付100找28=20+5+三枚1、55工46料16总62未收、56交70=50+20找8=五元纸币+三张一元纸币/净62、60仅回述已付62。56纸币已根接受，原硬币建议非作者固定选择，不为匹配建议改正确正文。当前后半仅按交接/metadata定位，均不得说本程已读。',
'',
'完整60之后才正式review与逐条verify旧8/旧窗；新问题按真实证据与根授权处理。本程不扩workflow、不改source、不刷新基线/消费hash、无61。后续61负例/export等属于根既定后续，本程没有做，不能记已完成。',
'',
'## 首停与耗时',
'',
`checkpoint情况：${JSON.stringify(checkpointResult)}。绝不覆盖既有wx材料。`,
'',
`启动时间${r.started_at}；本交接保存前elapsed_ms=${Date.now()-Date.parse(r.started_at)}，仅为Date.now实时值。当前native仍在写最终交接，实际exit与elapsed_ms必须等native/f-first/result.json返回后由根确认，不能预填exit0。`,
'',
'接下来正常返回即真实首停；不自动继续31—60，不另起子进程写正文。不修改真实作品、旧封存、工具源码、Git或外部服务。',
'',
'## 过程显示限制',
'',
'入场大status及ff-checks辅助元数据展示曾截断，完整原CLI双流已捕获，随后分别按精确字段完整显示并核准入。它们不含任何正文阅读批次，不计阅读覆盖；143正文页全部足预算完整返回。一次architecture-continuity.md手册路径不存在，按工具提示改读当前architecture-continuity-review.md；不是产品故障。无正文失败或掩盖原日志。',
''];
const handoff=path.join(base,'交接-F首停.md');fs.writeFileSync(handoff,lines.join('\n'),{flag:'wx'});
const receipt={ok:true,at:new Date().toISOString(),thread_id:r.thread_id,state_sha256:r.state_sha256,checkpoint:checkpointResult,handoff:{path:handoff,sha256:sha(fs.readFileSync(handoff))},report:{ref:'f-first-report.md',sha256:sha(fs.readFileSync(path.join(base,'f-first-report.md')))},reading:{ref:'f-first-reading.json',sha256:sha(fs.readFileSync(path.join(base,'f-first-reading.json')))},elapsed_ms_at_handoff:Date.now()-Date.parse(r.started_at),native_exit_pending:true};
fs.writeFileSync(path.join(base,'ff-handoff-receipt.json'),JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(receipt,null,2));
