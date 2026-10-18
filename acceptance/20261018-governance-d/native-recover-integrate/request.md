这是D批第二次独立原生Codex会话。只凭文件恢复，实际执行；源码/技能/手册只读。所有写入仅D:/work/other/ai-writer/acceptance/20261018-governance-d，不改原C封存或真实作品，不Git提交推送、不联网发布，不创建会话/子代理或发消息。主cwd保持ai-writer根目录。

先读AGENTS、writer-project、writer-novel、writer-review和docs/tool-updates.md、revision-and-sources.md、review-and-registration.md，再读final-integration/session-one/handoff.json及report.md（首会话实际交付位置）。对象final-integration/work是C六章独立副本，第一会话刻意留下prepared工具事务；不能先用普通status强行读作品，更不能手改state/锁/清单。复制来的旧C历史候选含旧绝对路径，只当证据，不恢复那些旧路径。

从外部主入口tool updates核现场、事务、实际锁SHA和作者恢复依据。核对第一会话故障命令已退出、PID不存活，按第一会话的真实合成授权选择complete，执行tool recover；不抢活锁，第三方字节若冲突必须停下并报告。完成后实际从新随附.writer/tool/bin/ai-writer.mjs运行--help、doctor、status、context --purpose discussion、check，记录完整原始结果。验证schema6、generation1、更新只推进一次revision；旧六章/units/事实及根三处定制仍与第一会话handoff相同。相同恢复输入重试幂等，不反向回填。

第一会话完成后主会话通过真实CLI复现并修复了“正文漂移但更新计划显示可更新”：执行保护一直有效，现在plan也提前列业务就绪阻断，并修正各专项手册的默认协议说明。因此当前主项目与已准备包是同版本不同构建，两个候选各自有冻结源码/日志，不改首会话候选或报告。恢复必须按原事务冻结的旧候选完成，不能刷新事务或换新备份；随后按下列新增合成授权再更新到最终本地包。

另存研究/D批最终构建更新授权.md：“允许D批副本先按第一会话的冻结事务完成恢复，再从D:/work/other/ai-writer这份本地主项目检查构建差异，显式更新到修复预览问题后的最终0.7候选。保留原恢复记录、两轮备份和根定制；不改正文、原units或事实，不把同版本当同构建。”用真实证据重新tool update-plan/update；此次无需enable，generation应从1到2，revision再增一次。核对最终随附内容ID与当前主项目受管内容相同，再继续下面创作治理集成。记录两轮而不是把第二轮覆盖为第一轮。

实际完整读当前六章和相关冻结来源，恢复人物所知、箱/钥匙/纸样保管、候选与未决选择。明确未来from7备忘没有改变过去事实。所有本次阅读记录精确文件SHA；不把读过旧报告等同于实读正文。

接着执行下列合成作者原话，另存研究/D批修订授权原话.md并绑定真实SHA/quote，注明synthetic acceptance：
“只在D批验证副本继续做工程回归，不写第七章，不扩充故事或改变任何事实、人物所知、物件保管和未决选择。允许把第三章一处现有保管动作做极小的等价澄清，用于检验更新后的旧章修订和连续性；将它明确标为工程控制变化，不冒充已证明的文学优化。是否值得润色仍是可选意见，不能升级成必改。修订范围只覆盖3至6章，后面三章原则上原字节保留，但都要实读承接、顺序重登。可以建立两个独立候选验证并行CAS：只提交A，B在A提交后须因旧基线拒绝，保留并明确中止B。把所采用的可选意见与实际提交、复核结果闭环；旧的保留/延期选择继续保留。必要时对受影响的既有验证意见重核。完成后正文暂停，只讨论规划。”

先用review-template及真实报告登记第三章这一可选澄清意见，稳定ID D_OPTIONAL_CLARITY_01，optional_style/suggestion，准确引文与原稿SHA，明确不确定性/工程控制性质；不能编造高置信硬伤。按上述实际有限代理授权resolve adopted，不能冒充作者逐字确认。允许在发现不等价时换用同章更安全的一处等价措辞，但仍只改一处并记录理由。

登记覆盖3–6的有限revise_range与任务，draft_range为空；先adopted再建立A和显式parallel_candidate的B，均在D副本新建。A独立区用外部新主入口、revision-token正式rewind --from 3，实际修改第三章一处，后3章原字节不改；逐章用revision replay-input/--out取得旧summary/changes草案，实读本次新稿、旧引文及下游，填写真实replay_review和checked_fields，再record-preview、record。不能只刷新SHA，也不能手改旧账本。完整连读3–6最终稿，review后prepare/commit A。检查1–2原登记、4–6正文、所有事实与知识边界保持；第3变化仅控制措辞。

A提交后才对旧B尝试prepare，预期基线冲突且A主稿不变；保留B候选并明确abort，不刷新基线或合并。随后review-issues apply将D_OPTIONAL_CLARITY_01绑定真实A提交与前后稿，真实阅读当前版本后verify。旧重复字意见若因新整段依赖失效，应按当前实际阅读重新verify；保留/延期意见不自动转为修复或采纳。先用review-issues list判断当前闭环，不自行把脚本通过称文学验收。

最终正式登记paused、仅discuss/plan、正文/修订范围均null。实测第7章context或record-template越权拒绝，state不变，不生成第7正文。使用新随附入口复查status/check/doctor；未来候选保留未定。

所有产品CLI均通过本批capture.mjs唯一native-d-two-*标签。包括新随附工具调用时entry实际换成副本.writer/tool/bin/ai-writer.mjs，保存运行文件观测。每次原始输入、stdout/stderr、前后state及所有失败保留；错误用新标签重试，不覆盖旧输入。不得修改工具源码修复问题，非预期产品阻断请保留现场写清问题并停止依赖步骤，主会话会处理。

交付本阶段report.md、handoff.json、command-index.json、readings.json、before-after.json、closure.json：恢复事务/备份/锁依据与新包ID、根定制SHA、六章实际阅读、唯一控制改句对照、A/B新会话和提交/冲突结果、各章正文与登记保持情况、意见真实处置/应用/验证、当前未来设定和未决项、最后暂停授权、机械检查边界。不宣称真人盲读或全书文学验收。
