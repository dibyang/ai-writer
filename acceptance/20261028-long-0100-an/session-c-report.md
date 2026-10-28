# AN 长篇实跑：独立恢复会话 C 交接报告

已用B原ID/token/workspace/base原生resume，独立完整实读候选116—120及旧章103/107/109/115，以原生context/replay-input、六项报告、record-preview/record重登119，严格停在next120。候选revision486、119登记章；主稿revision481、120登记章原字节未变。120候选保留，未重登；未prepare/commit、未新建基线、未修改真实作品/旧封存/工具或Git。这是知情模型实读和机械核验，不是文学或真人验收。

## 恢复与真实独立性

- A thread：01a18048-1168-7161-af65-f3b810f7ea46；B thread：01a18071-3eac-74a2-83ea-a23874bc062a；C thread：01a1808e-a5a4-75f3-9ef1-e17ffdb7e2c8。A/B来自各jsonl首行，C来自本次CODEX_THREAD_ID，三者不同。未使用子代理，不把每次Node进程当独立Codex会话。
- 已读根README、项目/作品AGENTS、writer-project/novel/review及适用long-form、general-review、natural-language-authenticity、concrete-language-review、审查登记手册；已读作品定位/文风/权威规则、真实context中119章纲与V19契约、A报告、B审计及B实际落盘报告、B原生恢复凭据和磁盘状态。
- B最后日志共252行：前251行可解析，末行是item129工具响应中断，内容出现B报告回读文本但JSON字符串未闭合。上一条有效agent_message称“交接报告已写好”。实际磁盘session-b-report.md存在，C开场preflight的report_exists已经为true；C最初漏看该字段，误沿用用户提示的不存在描述，现纠正。该报告已完整实读，SHA256 4d68184af72bade0307075ba574a57b198fe1ad68e5bbc043e5ef2588a12a0c6，ID/base/停点与审计及磁盘一致。保留B文件及截断日志，不补写、覆盖或修复。session-c/b-last-events.json保存最后六个有效事件、坏行说明及原日志哈希。
- C开场先核120份主/候选正文及main/candidate/base/base-state/session的SHA均与B审计相等。初始五份原生文件按原字节另存session-c/initial-*.json。c-004-resume返回fe5fe68c-ef72-4ad8-9554-075db8d08f5f、editing、base481及同一workspace，并明确不刷新基线或授权。
- 本次用户原话逐字存session-c/author-evidence.md，SHA256 c63415cdf3e86f948608d7f0417c36a9c4a6b2753d8c135412cbbd594e7e2b35。旧governance的revise_range116—120与“下个独立会话resume后119—120”覆盖本轮；当前用户将C停点收窄至119后，不需改主稿workflow来扩大授权。候选沿用原生B治理事件，没有手改state。

## 当前恢复检查点

|项目|当前值|
|---|---|
|修订ID|fe5fe68c-ef72-4ad8-9554-075db8d08f5f|
|scope|116—120|
|parent|acceptance/20261028-long-0100-an/work|
|workspace|work/.writer/revisions/fe5fe68c-ef72-4ad8-9554-075db8d08f5f/workspace|
|base / main|revision481 / revision481|
|candidate|revision486，119登记章，next120|
|status|editing；prepared=false；committed=false|
|base.json SHA256|673479b5ba06dd606ae2eb469809cc46c1a31bee6517e0fbde34a431316d667f|
|base-state / main state SHA256|c1f806b08dd3698e5eb388cef4caa23da52f7f725b068e4bf9e152c9f74479e9|
|candidate state SHA256|c5f76dc6a3e4c93e6d1223c1576a8188604e3517771f1a9dddee2e645d6cacbd|
|session.json SHA256|cdfb8f36846e17bdb49d525f4e70c79d5d0a59af0dbc5bb6ab96444d1f02f9ce|

令牌只读自session-b/owner-recovery.json；原resume输入session-b/resume-next-session.json仍可用。公开叙述不抄token。原owner未transfer，base、base-state、session本轮均未改变。结构化检查点为session-c/checkpoint.json。

## 119实读、来源与事实差量

候选119：正文/V19-交到别人手里的东西/0119-这回要的是一段声音.md，SHA256 0271f23e2be3108d07584e71788bfcf4817605702a8cc962f3ae15bdaf5e62a5，去标题Unicode Script=Han 4262字，仍与A主稿相同；C未改正文。

c-006获取当前context119，c-007原生revision replay-input生成候选.writer/drafts/AN-c-replay-0119-raw.json，expected_revision485。summary、characters、timeline、ledger、evidence、downstream六项在实读后填写，本次报告审查/AN-c-0119-重登六项实读.md，SHA256 e42a3e0db459bd5cbfbcb5c9cef7bb56fa48bd715eccaf4baa05fc8558f53658；最终回读一处旁支时长表述勘误另存session-c/119-review-errata.md，冻结原报告与原输入不覆盖。六项checked_fields不是语义证明。

session-c/record-0119-v1.json只在原生草案上填replay_review及draft_review。summary/changes/source_hashes/source_bindings/_replay与原生草案深相等；9项来源逐项实查SHA一致，8条本章引文及登记后的行号/正文SHA全部核对。原始A输入与原生replay仅有四处结构规范化差异（详replay-original-structural-diff.json），不能误称完全同结构，也没有事实差异。

本章实际变化只有沈/顾当前状态、73日开工时间线、余米吃净洗盒，以及新单/新素材/预付三条ledger：固定160但本章只实收80；初剪/尾款未完成；三份新声2:43/3:19/13秒分开，机器留顾。新旧240/480/未接720分开。preview实际列11个差量位置、32角色与180账本未变、findings空，来源matched-current-context。record与preview输入SHA均为e73222c547bd97bfa06e293b077fc01d9c8b3edfd12ce9dc6af6e7b5788a04d9，485→486。

preview列出的8项未变账本另逐项核：桥事仅口述、照片葛自持、蓝衫按当日可见、晚饭本次完成、旧手机试送局部、顾初版副本、沈自测修后、107自用说明。P_WORK_SCOPE_107的“无新单款”仍在116自用例的历史时点/对象范围，不作119全局收入结论；本章新单另有明确新ID及80实收。173条关联候选中省略165不代表全无问题，context省略历史ID也不宣称全原文已读。

## 连续性与跨卷边界

完整实读候选116—120依章序完成，回查103/107/109/115全文，共9章版本见session-c/read-coverage.json。119三份素材、118冷藏余米→119炒热透吃净/洗盒→120新煮饭、116原名初版/沈自测修后与119顾本人新单均连续。107自录例和109用途/听辨边界、116文件前缀与终端困难，在V19变成新劳动选择；103已实收480说明119并非首次有偿工作。

120候选已完整实读，保留B“得放开前头→得放在前头”的单字修正，SHA256 7264c00a0a3d505fe0afef5f08a1536285cd3de994959f4fe0152bafc69bf0fa，去标题汉字4226。本轮没有重复替换或拿A分段重合章覆盖。120实际初剪/补26秒/16:47电话口述对机/16:55短停顿交付及尾80已收只作为下游核查，不提前入119事实。最后同声改名只知收到，不能再推亲见整听。外地转发、寄出/收到、收件人会操作、长期订单均未知；另一机本次不添。葛照片未外传、私人桥页和旧站旧带不用于新单。

V19及121—122职责仍为计划，无本轮121细纲或正文。旧余带男声/钟声/剪者/日期、罗私人原因、旧款等无新证不收束。五条旧needs-recheck保留，不把107录制次数或109相对日旧问题称已解决。119无必要新增润色；累计“想解释/求认可—克制—家务收工”结构和120剪辑密度仍是风格风险，不能从流程通过推出文学优秀。

## 最终审计与保护边界

session-c-final-audit.json核定：main state与C开场字节完全相同、与原base-state深相等；120份主稿及候选正文全与B审计相同（只有B既有116/120候选与主稿不同）。候选原118条登记深相等。对原base逆向应用120旧journal得到原119快照，候选119只15条116证据SHA改为候选116哈希，其他角色/时间线/ledger事实全部深相等；38条observation整条不变。新119原生journal也能从初始候选118快照重建当前事实，8条119引文位置/SHA正确。

B原始work清单18502项本次复核18501不变，仅.writer/state.json相对B写workflow之前变化；该state自C开场没有变化。无缺失。此清单涵盖AN内复制的旧工具/旧修订/封存字节，不声称重新扫描AN外封存或真实作品。新候选对象/报告不覆盖旧文件。没有Git操作、提交、推送、上传、导出、prepare或commit。未改产品工具，未跑无关npm回归。

c-011 check：ok=true/mechanical-only/literary_quality=unreviewed，唯一UNREGISTERED_DRAFT是120的预定停点，不能删除。c-012 source list的entry_differences/pending_edits/impact_pending均空；c-013 status为next120，stale_units/changed_sources/impact_pending均空；c-014主稿仍481。rolling valid24/stale123、欠审97—102、100—105、103—108、106—111、109—114、112—117均保留。本轮完整读了116—120，但未另登记最终尾段原生rolling review，不伪称所有滚动窗口已清零。

## 命令及失败

14条实际产品命令经capture唯一c-标签，产品exit0、stderr0、runtime_files_stable=true；前后state按project分组连续。命令元数据包含exe/args/cwd、时长、输入原字节/哈希、双流、产品退出码与前后state。c-003是capture启动前路径错误，无产品退出码；原目录保留。另有FastCtx动态调用失败、B截断JSON辅助解析失败、辅助深相等断言失败及宽输出截断，全部说明及证据位置在session-c/auxiliary-failures.md；失败v1不覆盖为v2。本轮未发现产品错误，未修改工具。最终交付辅助核验曾因错误断言B报告不存在而exit1；纠正过程、B报告存在的开场证据和原C报告v1均保留，详session-c/report-presence-correction.json。

|标签|产品exit|耗时ms|
|---|---:|---:|
|c-001-main-status|0|6732|
|c-002-revision-list|0|177|
|c-004-resume|0|309|
|c-005-candidate-status|0|17646|
|c-006-context119|0|14074|
|c-007-replay119|0|8575|
|c-008-recall-work|0|2542|
|c-009-preview119|0|6290|
|c-010-record119|0|6226|
|c-011-candidate-check|0|5424|
|c-012-candidate-sources|0|693|
|c-013-candidate-status|0|5629|
|c-014-main-status|0|5085|
|c-015-revision-list|0|185|
|c-003-resume|未启动产品|捕获输入路径错误，外层exit1|

## 下一独立会话

1. 读本报告、session-c/checkpoint.json、C审计、当前新用户指令及原生状态；不要依赖仍反映A停点的旧AN README，不补写B报告。只选同一候选workspace，主稿next121不是续写授权。
2. 用新的d-唯一标签，经AN/capture.mjs只读status/revision list，核本报告main/base/candidate/session哈希及editing。用原session-b/resume-next-session.json原生revision resume恢复同ID；不要begin/rewind/transfer或刷新base替代恢复。C的c-command只允许c-，下会话另建薄封装或直接调用capture，不覆盖任何c-记录。
3. 使用AN/work/.writer/tool/bin/ai-writer.mjs入口，project指向候选；候选不自带tool。context --unit120 --purpose revision，完整重读当前120及119/相关旧原文，原生revision replay-input --unit120另存新raw入口，不复用A/B输入或写后刷新来源；六项实读审查、preview、record，写命令仍带原token。
4. 120仍是B已修句候选，只需按当前字节审查重登，不再重复替换、不拿A分段覆盖。120登记后再按实际新授权完成最终尾段完整连读及原生review；历史欠审如要处理须实读相应缺章，不能拼旧报告冒充本会话连读。
5. 更后续跨会话/多处旧章修订验证尚未完成；不得将本轮单章成功当整项验收。除非用户以后明确改变范围，继续禁止prepare/commit、主稿/真实作品/旧封存修改及Git提交推送。出现产品或哈希冲突保留现场诊断，不手改state/哈希。

本报告已实际回读，并核检查点/哈希；修正前版本保留session-c/session-c-report-v1.md。活动C会话日志若由外层输出，仍可能正在写入，不在本轮伪封存活动JSONL。完整原始B日志保持不变。
