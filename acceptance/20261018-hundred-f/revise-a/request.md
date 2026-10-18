# F轮受保护修订A：四处旧稿、48–62重登

承接补充：开始重登前额外完整实读43–47五章，连到48–62，覆盖最早修订处之前的滚动六章边界。只读前缀不扩展修改/意见处置范围；本段最终review可如实43–62，意见只限授权48–106。报告区分43–47复读与48–62重登，43–47正文/登记原样保持。

补充：先读findings/parent-101-interim.md/观察快照及draft-f对E最终句的复核。若101仍写“看见自己刚才留着没买的大包”，实读确认后只在本正式48–106分支澄清为看到家里半包、想起店里未买的大包，不新增购买或钱款；若E已修复不重复改。这是一处本轮新章候选，须保存before/after与真实证据，与原百章四处修改分开计数；最终准备/提交会话据真实清单核查，不预填只有四个正文变动。可在本阶段修改该句而把101重登留末阶段，主稿仍不变。

先读campaign的REQUEST.md、COVERAGE.md、source-build-v2.json、draft-f/handoff.md/json及最终报告、read-d/scenario-plan.md/json、findings/brick-wording-group.json、docs/revision-and-sources.md与docs/review-and-registration.md。作品仅 `D:/work/other/ai-writer/acceptance/20261018-hundred-f/work`，其下本轮新建独立修订区可写；阶段记录revise-a。按writer-project/writer-review/writer-novel及长篇连续性参考执行。其他真实作品、原百章、A—E档案、主源码及冻结包均只读，不提交git、不推送、不启动子代理/其他会话。

本用户当前授权覆盖本验收副本的多处旧章修订及全部下游核查。代理采用四处已实读发现的小型可读性修正：48、54、66、71各唯一的“同两块”改为“那两块”。这是同一组指代澄清，非四种剧情硬伤，也不为数量增加无必要润色。原当日天气、通行/围挡、在场者/转述、砖缺口方向和各次物件流转均保留。不能把代理执行选择写成作者逐项原话。原始发现记录保留。

所有产品命令通过统一session-support.mjs。根用session('revise-a')并实际embedded入口；branch另用session('revise-a-branch',{project:实际workspace,token:真实token})，branch必须main入口（独立区不带工具）。原始CLI输入/结果/前后状态完整捕获。脚本只能盘点与保存真实模型结论，不能自动逐章盖语义通过。

1. 实际doctor/status/check/workflow/revision list恢复0.7.2/gen3及106章，读真实101–106交接，不照旧379基线。按真实F原话正式workflow revise，范围48–106，仅讨论规划修订，draft_range=null；root授权事件保留。首尾必须48和106，因为最早48且末章106，不能只回退四章或缩窄尾段。可将C46–75实读报告原样复制到作品审查、注册四条minor readability意见（原文和SHA核对），agent-within-authorized-scope采用，保持原话与代理选择区别；若操作复杂需先查CLI/help，不捏造作者采用。
2. revision begin from48 through106 owner本轮明确唯一标识；将id/token/base_revision/真实workspace写独立交接文件。begin不刷新主稿业务基线。新分支doctor应正确复用父包，核build_matches=true。保存主稿state和全部正文基线SHA。全文实读48/54/66/71（含实际原句），核findings原SHA；只在分支各做一次同两块→那两块，其他字节不动。核四个字替换、正文未改变事实，不改主稿。
3. 独立区rewind48，然后本阶段只逐章48–62真实实读重登。每章都先完整读正文与原changes/必要旧下游，不靠摘要充当读稿；context、revision replay-input恢复原摘要/增量变化、当前来源绑定。逐章真实判断summary、characters、timeline、ledger、evidence、downstream：引文涉及改字则按实际新句修正；没有影响也解释核了什么。只改真实必要输入，原观察author_truth/statement不追认新含义、不抄全snapshot、不手改state。replay_review必须包括reviewer、审查/下真实报告、draft_sha256和精确六项checked_fields，先record-preview再record。报告可按阶段每章一行/一节，但由模型依据原文写，不能循环自动写“已核通过”。下游至106尚未在本进程读到就明确待下一会话，末轮还要完整尾段实读。
4. 重登到62即停止，不写63登记、不prepare/commit。实际check/status/当前branch tail，并对58–62承接给下一会话明确边界。可注册本段真实范围review，不能声称全59章已核。branch内部新增报告可，root治理/配置/决策不能变。核主稿仍106章原state/raw正文全相同，四处改字仅候选分支。
5. handoff.md/json保存id/token/base/currentrootrevision、branchrevision、build、stateSHA、四处before/after SHA与逐字差异、已重登48–62、原事实/人物知情/物件保持项、尚待63–106和最终完整48–106复核。完整保留失败/重试；发现工具问题报主任务，不绕保护、不改冻结包。每60秒内报告重登进度/耗时/下一检查点，预计15–25分钟。
