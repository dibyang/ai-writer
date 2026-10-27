# AD 0.9.0 独立长篇扩大实跑：完成记录

核验完成时间：2026-10-25T16:34:14.532Z。本轮48→60章、正文542,804汉字，新增49—60共161,066汉字；普通新章≥12,000，52/56/60章≥16,000。最终主区r351/generation8。验证结果见[verification.json](verification.json)，全部原始命令、公开事件、分段、失败、旧稿、checkpoints、报告与哈希保留。本轮不修改现有真实作品，不提交、推送或发布。

## 已完成的真实流程

1. 先实读规划，再以四组三章写作49—60；50/53/56/59各在写前模板与前两段后真实退出、同ID恢复。原片段在首次完整稿各一次有序合入。后续合法旧章修订不强行保持最早片段文本。
2. A称谓、D第58章说话人发现后正式修订；E有意修改48/54/55/56/60章，六份来源按版本、区间和影响分析处理；同一修订在51、56后两次正常退出和同ID恢复，最后48—60共121页在最终登记后返回，主区/候选一致。32来源、31区间、24消费绑定保持真实；冻结观察O_BOX_PAINT不改。
3. F新会话全书复读发现21章“送过去只隔两条街”与既有近邻冲突，仅将该处改为“两家门面”，实际21—60尾部40单元重登。最终登记后21—60共304页严格返回，正式事务完成；169个发布目标与2份旧备份核验通过。49购书回忆补核15章后确认为误判，正式retained，没有49正文修改或应用绑定。
4. F原距离意见采用证据9/21/42，而真实修改仅21。旧工具把未改参考9也强制纳入21—60提交，触发真实REVIEW_PUBLICATION_MISMATCH。已修复：校验归档前后及当前参考完全未变，真实范围内记录匹配发布，仍要求实际正文变化；不增加必填参数、不删除证据、不重做采用、不使用acknowledge绕过。
5. 新源码实际npm test 229项：227通过、0失败、2项Windows符号链接权限跳过；新根doctor通过。旧代码复现red及5项针对回归保留。新ZIP真实解压，327源码/发布文件和66安装受管文件匹配；显式更新独立副本至generation8，60单元/正文、snapshot、来源、旧意见及提交不变，39未选本地文件保持，11更新目标和10旧备份一致。
6. G使用作品随附generation8入口，新会话完整读1—30章143页并正常退出；实际同ID恢复核23,615文件与151冻结对象后，再完整读31—60章244页。当前全书387页覆盖及整章先后顺序核验通过。新全书报告绑定当前60章，原距离意见成功apply/verify：reference_units=[9]、target_units=[21]、after_units=[9,21,42]；旧8意见仅再verify，原采用/应用/提交保留，13条optional保持原状。
7. 有效drafting阶段允许draft，范围1—60，61计划在G入口前已存在且未消费；context61与record-template61各真实退出2/ACTION_OUT_OF_SCOPE，状态字节不变，无61正文。不是用paused或缺计划错误替代范围拒绝。
8. 实际导出当前60章草稿，逐字节核manuscript、manifest与正文；36份未登记历史变体留在原处并按预期排除，保留导出警告。最终六个产品命令通过，旧六组45,716文件按原封存只读复核通过。

## 缺陷修复和构建

新包仍为未发布的0.9.0候选：[ZIP](reference-evidence-fixed/ai-writer-0.9.0.zip)，SHA256 0e4ca99dc86cc8d5c794dc3072aac22394227c61bca1d3dcdfffe75dd13ec48b。content_id 91a5eb61844e85102cd61fede4ddba142191a879e1722e92e42db323cf09612c；runtime_id 819a50b3d460176db6d36a05e1cb2f161a34ac61ee2a5705bb81bc9d032ae652。快速入门、使用手册、审查登记说明、CLI帮助及开发发行说明已补齐。旧gen7包和active-tool.json保留作历史；G入口配置为active-tool-generation8.json/cli-g8.mjs。

新增章节创作和F距离正文修订实际发生于gen7；gen8验证的是显式工具更新、新会话全书实读、同ID恢复、原意见闭环、范围保护和导出，不能冒称gen8重新写了60章。无内置引擎源码变化，未重复跑engine套件；本轮没有Linux/macOS CI或正式发布验收。

## 失败和纠正保留

命令审计收录853次产品CLI、18次原生进程；非零不抹除，包含预期拒绝、普通参数/路径或辅助脚本错误和环境失败，按原始事件及交接区分。F续程真实容量失败exit1后，完整checkpoint及无未完命令核验，再同ID恢复；没有改写为正常退出。E基线387页覆盖通过，但额外严格返回顺序未过，不能列作严格顺序通过；后续E尾部121/F尾部304/G全书387另有通过证据。

文学判断的误判也保留：49回忆不应按后来另一次书店行程理解；正确课堂为18/24/30/38/48/57，第三课在30，31是周四回顾。F2及根旧报告的31定位错误已在g-course-location-root-correction.md撤回，没有反向修改正确正文。E56登记曾实际成功却漏把已收2改8，之后在同一修订正式回退重登纠正，原成功错误输入仍在。

根辅助脚本的Copy-Item前版保存失败后继续、事务修订号327误写328、Node -e多余括号导致备份未生成，以及容量退出后短暂错误报活跃等，均在对应控制器/处置文档如实记录，不伪造前版或成功证据。详见ROOT-CONTROLLER.md、ROOT-F-CONTINUATION.md、ROOT-G-CONTINUATION.md、f-capacity-recovery-disposition.md、harness-history/20261025-f-transaction/disposition.md。

G报告准备的第8章标题词定位失败、辅助元数据括号错误及外层exit1/产品exit2一度混淆，均保留并纠正，见交接-G完成.md。根最终汇总另错误假定测试汇总以TAP的“#”开头，实际为spec的“ℹ”；原脚本已先保存，改为兼容两种行首且仍严格核229/227/0/2及原stdout SHA，实际重跑汇总成功。见harness-history/finalizer-reporter-format/disposition.md；没有改写测试输出或重做虚假测试。

G续程真实进程已退出0，耗时4,236,255ms（70分36秒），由根实际result确认；末态完整checkpoint为23,629文件/151冻结对象。根后续六命令、来源消费、意见、正文事实、构建和导出核验全部通过，并生成verification.json；原交接中“根仍须核验”是进程退出前的边界说明，由当前完成记录覆盖。

## 验收边界与记录入口

这是模型知情自检和独立工具流程验证，不是认知阅读证明、真人盲读、市场验证、作者定稿或出版。草稿导出保留quality_review要求；历史变体警告是预期行为。未运行百章新扩展：本轮从48扩大到60章，不能写成已完成100章。正式发布验收为false。

当前stale_units/changed_sources/impact_pending均为空；来源列表仍保留大纲/单元/0033.json这一份editing-entry-only-not-published入口差异，selected_version仍为CR33_RECALL_ID_V2、matched_published_ranges为空，不能说全部来源编辑差异为零。滚动审查旧59份stale均有当前覆盖，未覆盖stale与pending_windows为0，不删除旧报告“清零”。

- [全部门禁结果](verification.json)
- [完整命令审计](command-audit-final.json)
- [新构建最终一致性](build-parity-g-final.json)
- [原9条意见闭环](g-root-final-commands-verification.json)
- [全书返回覆盖](read-proof-g-final-current1-60.json) / [章节顺序](read-order-g-final-current1-60.json)
- [有效61范围拒绝](g-scope-negative-verification.json)
- [最终草稿字节核验](g-current60-draft-export-byte-verification.json)
- [旧六组封存复核](prior-seals-final-verification.json)

AD文件清单封存与独立复核在本文保存后进行，以目录内evidence-manifest.json及目录旁-seal-receipt.json为准；本文不预填封存文件数量或SHA。封存后不再向AD写入。
