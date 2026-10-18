这是D批百章规模的真实原生Codex验证。实际完成，所有写入仅限D:/work/other/ai-writer/acceptance/20261018-governance-d，源码/技能/手册只读；不得改原百章封存、C封存或真实作品，不Git提交推送、不联网发布、不创建会话/子代理或发消息。

对象scale-hundred/work：从20261016-hundred百章封存显式复制当前正文、输入、journal、审查和工具，不复制旧分支历史。copy-manifest.json记录原始逐字节哈希；hundred-prepare-v1和scale-hundred/handoff.json记录从2到3/4/5的显式迁移、有限授权及全部原章节/事实保持结果。当前仍有100章，没有101，本次不得增加章节。原工具可能较旧且无清单，不能按版本号假定未定制。

先读AGENTS、writer-project、writer-novel、writer-review、docs/tool-updates.md和handoff。只凭文件恢复，实际完整阅读95–100章当前正文并核实跨卷兑现、物件保管、人物所知及未决计划；FastCtx长行截断要补读，报告精确版本。仅称六章抽样实读，不能称重新读完百章或新写百章。已有早期报告是历史材料，不代替本次阅读。

本次合成作者原话，另存研究/D批百章工具更新授权.md并注明synthetic acceptance：
“只在D批百章验证副本检查和更新随附工具，不改任何正文，不新增第101章，也不改事实或原章节消费来源。允许从D:/work/other/ai-writer这份本地0.7来源更新，先核清当前旧包每个文件、根定制与差异。若旧包无可信清单，明确接受当前精确观察到的旧基线用于本次隔离验证，并完整备份；这不表示证明旧包没有定制。允许显式启用schema6再重新计划更新，根AGENTS/技能/手册保留。完成后正文暂停，保留所有验证材料。”

先保存当前state原始字节、100个正文与journal哈希、units和snapshot比较基线，实际从主入口status/check、只读tool identify/compare/update-plan检查。无清单时只在上述授权范围输入legacy_target_acknowledged=true；未知工具文件/受管代码差异不能跳过，遇阻保留日志报告，不手改state或补清单规避。真实旧包只读启动若不支持当前schema5，记录拒绝而不降级状态。

源码/状态原始字节使用fs.copyFileSync或fs.writeFileSync(Buffer)保存并立即比较SHA；不要经通用JSON写入函数序列化Buffer。若归档自检失败，保留失败产物，另建正确副本；本次不允许更改产品源码来迎合记录。

按新手册从外部主入口tool enable 5→6（保留原state、作者依据和enable_id），随后重新tool update-plan并执行tool update。documents默认空，不修改根定制。记录来源/目标ID、计划SHA、完整请求、事务及备份，验证revision仅按实际操作推进、generation只增一次。相同更新输入重试必须幂等，不能再增代次。

完成后实际用作品.writer/tool/bin/ai-writer.mjs运行--help、doctor、status、context --purpose discussion、check与outline/recall，确认新入口独立可用和仍按有限授权停止。对status可各记录三次新进程耗时、输出字符和state大小，只描述观测，不宣称加速；本任务有其他并行I/O。核对所有100章原字节、journal、原units/消费来源和事实snapshot不变，新增仅为协议/工具治理与本次证据。不要为了通过check刷新旧哈希。

本次末尾登记正文暂停、只讨论/规划、draft_range/revise_range均null，按真实原话，不写101。核实context/record-template第101章越权拒绝且state不变，不创建正文。

所有产品CLI经本批capture.mjs唯一native-d-hundred-*标签，记录器实际结果在stdout.raw.txt/stderr.raw.txt，保留所有预期拒绝和错误；新标签重试，不覆盖旧输入。交付本阶段report.md、handoff.json、command-index.json、readings.json、hundred-preservation.json与timings.json：实际阅读95–100版本/覆盖、观察到的跨卷连续性及不确定性、全部100章保持证据、协议/构建/事务/代次、更新后独立入口命令和授权停止状态。不得把机械检查或抽样模型阅读称全书文学验收。
