import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url)), audit=JSON.parse(fs.readFileSync(path.join(root,'session-b-final-audit.json'))), c=audit.checkpoint;
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const first=ref=>JSON.parse(fs.readFileSync(path.join(root,ref),'utf8').split(/\r?\n/)[0]);
const a=first('session-a.jsonl'), b=first('session-b.jsonl');
if(a.thread_id===b.thread_id || b.thread_id!==process.env.CODEX_THREAD_ID) throw Error('Independent session evidence mismatch');
const identity={observed_at:new Date().toISOString(),a_thread_id:a.thread_id,b_thread_id:b.thread_id,current_env_thread_id:process.env.CODEX_THREAD_ID,independent_threads:true,logs:['session-a.jsonl','session-b.jsonl'],active_log_not_sealed:true};
fs.writeFileSync(path.join(root,'session-b/session-identity.json'),JSON.stringify(identity,null,2)+'\n',{flag:'wx'});
const rows=audit.drafts.filter(d=>[116,117,118,119,120].includes(d.unit));
const report=`# AN 长篇实跑：独立会话 B 交接报告

本会话已完成约定的前半回放，并主动停在118登记后。119、120在会话A已成稿登记，本次没有重复创作它们；B在全新独立修订区选择并落实116、120两处局部语言修正，116—118逐章context/replay-input/六项实读审查/preview/record。119正文同原稿、120修句候选均留在区内，二者尚未重登。禁止prepare/commit，本会话没有调用它们。此处是知情Codex自检及原生流程证据，不是文学验收、真人盲读、作者定稿或发布。

## 真实会话与授权

- A thread：${a.thread_id}；B thread：${b.thread_id}。session-a.jsonl、session-b.jsonl首行thread.started不同，B与本进程CODEX_THREAD_ID一致。原生CLI每条为新Node进程，不能把“每条CLI新进程”冒充跨Codex会话。B确实从A报告和实时状态恢复；本次新修订的跨会话resume尚待C执行，不在B内假造下一独立会话。
- 已读项目及work的AGENTS、writer-project/novel/review技能，project long-form、review general/natural-language/concrete-language模块、work随附版本修订/审查登记手册及相关命令参数。根README读至130行；没有凭根README的默认schema描述改动此副本实际schema7。
- 已读AN README、session-a-report.md、会话A真实用户原话，保存本轮真实用户消息到work/研究/AN会话B真实用户授权.md，SHA256 2829b39993f83c9679282d1a15aea28e51a7ed022f0333f04723e3885e3d70df。真实消息逐字录入，无消息ID而不编造；workflow的quote、local_source、哈希和locator绑定此来源。原话被冻结不代表程序认证作者身份。
- b-001确认revision480/schema7/120章/next121，无漂移/未登记稿/活跃修订；全部旧修订保持原终态。119/120原SHA与A报告一致。当前工具0.10.0/generation13、内容ID33b3e95b7e04d77b186353171d81c284e0821486bdec701f6f0ab24b3f0f3faa未变；运行守卫a1975b4561f7a4edc12adccc9bc08f74508941454988bdc9ec55ba2262623815。
- b-003原生workflow set把阶段定为revision，allowed_actions为discuss/revise，draft_range=null，revise_range=116—120；保留旧planning为草案，不称作者逐项采纳，不扩大到121。任务及stop_conditions明确本会话只回放116—118，禁止prepare/commit。自然语言授权先于输入，不为过门改原话。

## 原修订恢复凭据与检查点

|项目|实值|
|---|---|
|id|${c.id}|
|owner|AN-session-b-independent-116-120-partial-replay|
|workspace|work/.writer/revisions/${c.id}/workspace|
|scope|116—120，through为当前主稿末章120|
|base_revision|481|
|base.json SHA256|${c.base_sha256}|
|base-state.json SHA256|${c.base_state_sha256}|
|主副本最终|revision481，120登记章，next121|
|主副本state SHA256|${c.main_state_sha256}|
|候选最终|revision485，118登记章，next119；editing|
|候选state SHA256|${c.candidate_state_sha256}|
|最终session.json SHA256|${c.session_sha256}|

本地令牌位于session-b/owner-recovery.json，另有只含原id/token的session-b/resume-next-session.json；不在公开报告抄令牌。commands/b-004-revision-begin/stdout.raw.txt保留最初返回。session-b/initial-base.json、initial-base-state.json、initial-session.json保留创建时字节。session.json由原生命令从created推进editing，SHA会变化；base及base-state未变，不把会话元数据更新当刷新基线。没有复用AL已提交修订ID或token，没有transfer/parallel_candidate/新基线替换。

本轮主副本业务revision只因workflow从480到481；begin不推进主业务revision。候选从481原生rewind116到482，再按116/117/118分别record到483/484/485。rewind备份是候选.writer/rewind-481-5e9f45a5-d149-472e-b8dd-6e702c90d38d.json；正文没有被回退命令删除。

## 两处修订与文学判断边界

1. 116原句：她回这一条也记了，今天不用替自己换别的打开。候选：她回这一条也记了，今天不必换播放器。相邻56行已有“她打了可以换播放器，没发”，95行“不要求对方先换成她惯用的软件”，原句把播放器宾语省成“别的”，再接“打开”需读者猜补。动宾拆分和当面复述同时暴露对象/搭配问题；文字节奏模拟复读后不必补对象，具体行动仍不换工具。没有给顾新增实际换软件动作，未把局部听取变全听。
2. 120顾语音原句：那个先拧小，得放开前头。我早上顺手就做了，嘴里没讲。候选将“得放开前头”改为“得放在前头”。前后明确在说先调低音量的句子应排到开机前，“放开”会给出松手/放开的错误动作，动宾搭配与具体落地均不通；“在”修正位置关系，保留顾的口气和自己漏讲的责任，不改变26秒补录、步骤顺序、操作方向和人物所知。

这两处是有具体阅读代价的局部可读性修正，不是为了测试而随意换同义词；没有据两处修句宣称整章文学质量提升。117、118、119无改字，不为制造收益强行润色。120修后全文尚未在候选中重新完整读一遍；本次是原稿全文实读后改句及邻文核查，下一会话必须完整读当前候选120再登记。

|章|候选正文汉字（去标题）|本会话候选状态|主稿SHA256|候选SHA256|
|---|---:|---|---|---|
${rows.map(d=>`|${d.unit}|${d.han_without_title}|${d.registered_in_candidate?'已重登':'待重登'}|${d.main_sha256}|${d.candidate_sha256}|`).join('\n')}

汉字计Unicode Script=Han，去首行Markdown标题。119仍4262、120仍4226，本轮没有以改字填充篇幅。主副本120章正文全不变；候选只116、120字节变化。

## 真实阅读、跨卷回收与未变边界

本会话完整实读主副本103、107、109、111、112、115—120，共11章；候选116—118另逐章全文复读。其余章节不称完整重读。session-b/read-coverage.json列当前路径和SHA；session-b-final-audit.json给全部120份主/候选正文哈希，但哈希盘点不是全书实读。context只阅读当前细纲/来源、当下角色段、相关账本和召回遗漏类别，未读完所有旧角色历史串、全部旧证据正文；一次过大context提取输出被截断，改为窄选具体字段并回到正文，不把被截内容计作实读。

- V15 107完成自用说明并留用三段试声，不由留用段数推录制尝试总数；原声车盖字、另录清楚声和处理声分开。109在自用例价240旁明确交听辨意见，不是交改好声音；顾当场试用举例用途，不是下单，不能补成收240。原107/109相对日措辞仍保留，其旧needs-recheck没有在本次伪称修复。
- V18 115末只问顾明早十分钟，116早上才获答；9:40初版三份实际发送，顾截屏/消息只证点开区分及从头到车声处，不等整份听过。原声A/意见A修后版留沈自测，顾没收。119来问新素材时，不能把旧修后版答复当本次需求。相关稳定ID P_WORK_SCOPE_107、I_PRICE_EXAMPLE_109、T_REMOTE_EXAMPLE72_115、P_GU_SAMPLE72_116、P_SAMPLE_REVISIONS72_116、I_REMOTE_RESULT72_116已核正文；b-008原生recall输出完整保存并读相关项，不以recall摘要代替全文。
- V19 119顾提出本人收音机口述，沈现场听2:43，顾按实物重录3:19并补13秒；实际约一段160、预收80，非将109例价降售。120新26秒补录与上午源分开；16:47整听/对机是顾电话口述，沈不隔空亲见。16:55收短自身停顿2秒后交付，顾再消息称全听并实付尾80，本单160齐；后续同声改名版只确知收到，不能又推一次亲见整听。顾向外地转发、寄出/收到机器、收件人学会使用均无证；另一机本次不添，长期订单无证。
- 跨生活线：111“专门留的，最后专门倒”为葛口述的前日经历，111本日已吃完，118选鱼尾/吃临放块不当首次吃完或永久习惯改善。112蓝衫在家未穿，117由本人确认当日穿来，118两照留葛手机、交回手机不等沈取得照片。115扶伞不知修成，118只口述给葛未给桥页。118余米冷藏→119炒热透吃净洗盒→120新煮饭；没有重置食材。118葛离楼口仅见至街角，不补到家。
- V15/V18/V19合约均是计划，特别V19 A19b 121—122无细纲无正文；当前next121或目录覆盖122不等创作授权。旧原带、旧站史料、私人纸稿不借本单扩大使用。未知男声/钟声/剪者/日期、罗私人原因、旧费用和其他未证事项均不强结。
- related_unchanged_ledger每次preview最多8项只是线索。116预览的私人页/桥页/何回话与鞋等未变项按115、当前章和历史时点区分；117/118候选反复出现的116版本条目均依前章已核事实保留，未因本章实吃就改为顾已收修后版。省略ID中的旧站/钥匙/船班/费用/客户旧工程不被两处修句推进；不宣称逐条重读了147个遗漏ID全部原文。

## 重登与机械审计

三章原生replay原件在候选.writer/drafts/AN-b-replay-0116/0117/0118-raw.json；填后输入分别在session-b/record-0116-v1.json、record-0117-v1.json、record-0118-v1.json。完整六项报告在候选审查/AN-b-0116/0117/0118-重登六项实读.md。summary、characters、timeline、ledger、evidence、downstream逐项实读核对，报告绑定新稿及报告哈希。原summary/changes复核后保持，不把自动带出当无变化结论。每个preview与record输入SHA相同，_replay身份及原生source_hashes没有手改或写后刷新。

三份报告SHA分别：

${audit.replayChecks.map(r=>`- ${r.unit}：${r.report_sha256}`).join('\n')}

审计使用现有journal.mjs的纯applyDelta逆向读取原119/120 journal，还原原基线118事实；候选118快照与原118相比，只15条116本章证据SHA随正文修句而更新，角色整段、时间线、账本其他字段全部深相等。38条原observation整条深相等。1—115登记元数据深相等；主120条登记和事实快照与A结束时完全深相等。这证明限定字节/数据差异，不证明模型文学判断正确。

session-b/initial-work-manifest.json在新授权原文保存后、workflow之前生成，盘点18502文件；当前逐项核18501不变，仅.writer/state.json因workflow变化，无缺失。新授权文件是本轮新增，已在该盘点前写入；不谎称它来自A。新修订目录与新对象/报告在基线盘点后新增，没有覆盖任何旧封存文件。全部旧工具及复制在work内的旧修订字节均在不变集合。此次只核AN内当前副本，不宣称重新扫描了AN外全部旧封存。

b-019 check为ok=true、mechanical-only、literary_quality=unreviewed；仅两条UNREGISTERED_DRAFT warning指119/120，正是预定留点，不是删除建议。stale_units/changed_sources/impact_pending均空，b-023 source list entry_differences/pending_edits/impact_pending均空。rolling valid24/stale123，pending97—102、100—105、103—108、106—111、109—114及因本次116重登新增待覆盖112—117。没有删报告清待办、没有把历史5项needs-recheck标为已修复。整个116—120最终候选尾段连读及原生review尚未完成，不能prepare。

## 全部产品命令与失败记录

每条串行且只通过AN/capture.mjs。b-command.mjs仅加载本地原token再调用capture，不另起未捕获的产品CLI；捕获原exe/args/cwd、双流、实际产品exit、输入字节及前后state。所有23条exit0、stderr0字节、runtime_files_stable=true；按主/候选两个project分组的状态链均连续。下表不是外层PowerShell码替代产品码。

|标签|产品exit|耗时ms|
|---|---:|---:|
${audit.commands.map(x=>`|${x.label}|${x.exit_code}|${x.elapsed_ms}|`).join('\n')}

本次未发现产品失败，未触发修改工具。辅助失误如实保留：开场试图从functions.ALL_TOOLS动态找FastCtx时为空，读取undefined.name报TypeError，未执行嵌套读写或产品命令，随后改直接FastCtx；尝试读inputs/a-workflow-draft.json不存在，随后读commands/a-007-workflow-draft/input.raw.json正确副本；一次过宽context字段输出被截，改窄选并实读正文。均在本会话JSONL/工具返回中保留，不伪称产品缺陷或覆盖成成功。没有失败的产品result需要重试或清理。A的两次产品失败、引文辅助失败及全部a-标签保持原字节，不篡改A报告。

## 下一独立会话的恢复顺序

1. 先读本报告、session-b/checkpoint.json、实际用户新消息、session-a-report.md和当前work状态。主稿仍120章/next121，候选118章/next119，不能选错目录。保持原工具构建，不能因根README版本描述而升级活跃分支。
2. 在AN/work使用新的c-唯一标签，经../capture.mjs运行status及revision list，核id=${c.id}、base_revision481、base/base-state SHA与本报告一致、editing状态及主state未变。有变化立即保护双方、诊断，不刷新旧base或重新begin代替resume。
3. 同一主入口调用revision resume --project . --input ../session-b/resume-next-session.json，仍经capture新标签。它含本地原id/token；不要打印或外传。原生返回必须为同一workspace和基线。这一步在B没有提前执行，必须由下个独立Codex会话真实完成。
4. 候选没有随附tool，使用AN/work/.writer/tool/bin/ai-writer.mjs绝对入口，将--project指向本报告workspace。context119→全文读候选119/118及相关107/109/116，revision replay-input119→据当前来源核六项报告和draft_review→preview→record；写命令带原revision-token。不要复用A record输入，也不要写后刷新哈希。119当前未改字，原稿保留。
5. 同样context120→完整读当前修句候选及相关跨卷原文→replay-input/六项审查/preview/record。候选120已把放开改放在，不再次套替换，也不拿A分段或合章初稿覆盖它。当前修句SHA7264c00a0a3d505fe0afef5f08a1536285cd3de994959f4fe0152bafc69bf0fa。
6. 重登至120后，实际按顺序完整连读最终116—120尾段，写新报告并原生review绑定当前字节及依赖。若处理新增112—117滚动欠审，须另读113、114等实际未读原文，不能拼接B零散结果冒充一次完整六章阅读。历史97—114欠审、5项needs-recheck保留真实状态。
7. 执行check/source list/status及必要的限定审计，写session-c-report.md继续交接。未有用户明确新阶段授权仍禁止prepare/commit，不写121/122、不Git提交/推送。b-command.mjs故意只收b-标签及前半会话允许命令，并拒resume/prepare/commit；C须使用新的c-捕获入口，不能误复用该B守卫造成假失败。

## 写入边界与最终状态

只写acceptance/20261028-long-0100-an内：授权、捕获记录、原生候选、输入、报告、辅助脚本与审计。没有手改state、修改journal/旧hash、创建旧路径影子、移动已登记正文或变更工具；没有访问真实作品、Git、旧封存外部目录进行写入，没有提交/推送/上传/付费/导出/发布。没有工具变更，故未跑无关npm测试。session-b.jsonl仍由当前Codex会话追加，不对活动日志做最终seal或宣称日志已封存。

检查点已完成：候选116—118重登；119—120未重登；原id/token/base保留；主副本120章未改；未prepare、未commit。后半回放、同ID跨会话resume与尾段最终review均为后续未完成项。
`;
fs.writeFileSync(path.join(root,'session-b-report.md'),report,{flag:'wx'});
console.log(JSON.stringify({report:'session-b-report.md',bytes:Buffer.byteLength(report),sha256:sha(Buffer.from(report)),identity,checkpoint:c}));
