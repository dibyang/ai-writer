# 终版独立 Codex：百章副本、精确生效范围与等价提交

仅操作 `acceptance/20261018-governance-b/scale-hundred/work` 这个明确复制出的独立副本，以及本阶段输入/报告。不得改 `acceptance/20261016-hundred`、真实小说或其他现有作品，不改源码/技能/Git，不派代理、不发消息、不提交推送。使用主项目 cwd 和新主项目 bin/ai-writer.mjs；原随附旧0.3工具不能处理新schema，不自动更新。

先读当前 writer-project、必要小说/审查技能、docs/revision-and-sources.md、本阶段资料。原百章封存作品仅复制598份必要文件约11.3MB，全部源/正文哈希已核；没有搬整个档案，没有新增百章创作。scale-hundred/copy-manifest.json、hundred-prepare-v1/summary.json、hundred-rebuild-v2/summary.json、scale-hundred/handoff-v2.json 是恢复入口。保留原记录，不能覆盖。

本场景模拟作者授权：允许在这个独立百章副本做工具版本/修订验证，只对第100章进行**字节和事实等价**重登；不写第101章，不改变既有剧情或前99章。允许把原权威规则同样字节冻结成第100章起的新版本，实读相关输入后执行历史影响流程，验证读稿前缀与回退起点分开。准备101的细纲/卷纲只是诊断占位，不代表有新正文。作者证据可使用副本已有“研究/验证授权.md”，注明模拟验证而非实际作者逐项选择。

每次产品调用必须通过本轮 capture.mjs，唯一标签 native-four-*。完整产品JSON读取 commands/标签/stdout.raw.txt 或 stderr.raw.txt；元数据不是产品返回。

任务：

1. 核主稿100章、schema4、当前revision、原snapshot hash、100篇body哈希，以及handoff-v2指向的旧 prepared 候选。旧候选绑定边界修复前构建；用当前新主项目 commit，应 BASELINE_CONFLICT，主state/正文不变，完整冲突引用保留。随后持令牌明确 abort 该旧会话，保留其目录，不手改build/base/state来绕过。
2. 实际读取95–100六章、其相关设定、卷契约、人物所知/物件/线索和旧登记草案，保证工具输出完整可读，不能把截断输出当已读。可以使用 recall 定位证据，不需要也不得伪称重读了1–94。若看见文学疑问，报告即可，本场景不授权改动百章正文。
3. 新主项目 source freeze 原权威规则**原样字节**为新版本（唯一version_id，previous指原基线版本），source impact mode=historical/from=100。核当前API把 revision_from=100，与 review_from/retained_prefix_consumers 分开；前99章旧输入保留。required_readings 应包括旧/新规则和必要承接原文，按真实字节读完并写实际模型影响报告，准确说明这是同字节版本安排、无事实变化，不是机器已证明文学通过。
4. 当前 revise_range 应仅100–100，允许plan；若任务需更新阶段，只依本场景模拟授权登记100–100，不能扩到1–100。所有作者证据、影响报告在 begin **前**写入主副本。source stage 应接受，blocked_range应100–100；check/导出应被pending阻断，旧报告依赖待核。这一步专门验证实跑发现的过宽回退问题已修正。
5. begin从100到100，保存新id/token。独立区 rewind100，再用impact_id发布，实际新context/record-template后等价重登100。可从 hundred-prepare-v1 或 hundred-rebuild-v2 的原输入恢复实际summary/changes草案，须逐项核当前正文/原证据；不能把旧expected_revision/source_hashes照抄，也不能写原state。正文100字节不动，snapshot必须与copy/handoff原事实完全相同，前99登记逐项保持。
6. 在独立区写真实95–100连读报告并review，明确只实读这6章；报告可覆盖修订尾段100，不可伪造整百章复读。先前机械报告不算模型阅读。如旧全书报告因此过期而未被本范围完整覆盖，如实记录范围，不为清空欠审伪造读稿或删报告。
7. prepare/commit，主revision只在此提交比新base+1；新版本从100生效，1–99旧绑定/source_hashes/正文不变，100正文和所有事实同原副本。保留事务及所有旧分支，check机械通过。重复commit幂等不再加revision。记录滚动报告有效/过期/未覆盖真实数量，不宣称本轮全百章文学验收。
8. 在主副本按授权把任务改为暂停不写101，核workflow变更不让未变正文的新实读报告全部失效。主项目doctor正常；指定副本doctor若报告旧0.3工具不兼容是预期结果，单列，不自动更新。导出到新目录核100篇原字节与清单，没有新增正文。
9. report.md、summary.json、handoff.json（包括新会话/事务/版本/实际阅读范围、100篇最终哈希及原事实hash）写本阶段目录。记录每步失败及修复/重试，不改其他阶段证据。发现产品缺陷保留最小复现报告，不修改源码或协议文件，主会话会处理。

本阶段是最终构建真实模型恢复、局部阅读和百章结构保护验证；不是新增100章、真人盲读或正式发布验收。
