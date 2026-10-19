# H轮后续原稿阅读进程约定

本版补充当前包内技能定位。新随附doctor的skill_root/content_root是实际校验目录，project_skill_root是作者保留目录；按help列出的“当前工具流程技能”或doctor返回的skill_root实际完整读取writer-project、所需文体/审查技能，保存路径、SHA和原版本。不能只读根旧技能就声称已读新版。根AGENTS与作者定制依然遵守，新包参考不覆盖作者要求；不要自动替换根技能或改变技能发现配置。read-b先升级再做这个检查，其他进程在恢复时实际核当前路径。父流程对主仓库的修复见PARENT-ACTIVITY.json及fixes/skill-entry，不归因给原恢复会话，也不改其历史报告。

适用于read-b/c/d。每个都是新的实际Codex CLI进程。先读本轮PLAN、当前主项目AGENTS、work/AGENTS及当前冻结包对应技能/手册。只允许写入本轮H目录；不改任何旧验收档案、主源码/技能或真实作品，不提交/推送/联网/发布、不用子代理。不得resume复制来的历史revision。CLI user角色请求是父执行者的验证安排，不伪称新的人类文学选择。

PROJECT为D:/work/other/ai-writer/acceptance/20261019-hundred-h/work。目标新版为0.7.5，冻结SOURCE为本轮sources/package-v2；read-b先恢复0.7.4交接并按本阶段要求真实升级，read-c/d须核0.7.5已安装。先从上一阶段的handoff、实际parent-verification通过记录和RUN-STATE恢复；原始基线有106章。用新随附CLI的status、workflow show、discussion context、tool identify/必要compare核路径、revision/schema/generation/内容ID、允许动作、活跃会话/待恢复事务、未登记稿，保存原结果；不靠上一段聊天记忆。比较读取前后state字节，恢复本身不得写state。

确认无阻断后可按本次阶段任务正式更新仅讨论/规划的workflow任务说明，author_evidence绑定H原始用户任务及代理测试范围，当前allowed_actions仍为discuss/plan。不能因next_unit=107写正文。所有106章、原units/snapshot/来源版本保持，既有文件不覆盖。原定位中的24章/只写1–4为旧任务文字，保留其被消费的原字节，在任务交接说明新旧范围，不手改来源或刷新哈希。

产品操作全部经capture.mjs，唯一标签以当前阶段名加短横线开头（read-b-*、read-c-*、read-d-*），使用实际项目路径和随附入口：

node acceptance/20261019-hundred-h/capture.mjs read-b-unique node "PROJECT/.writer/tool/bin/ai-writer.mjs" status --project "PROJECT"

先help再准备不熟悉的真实输入，失败保留原件并换新标签/输入纠正；不直接import业务API，不改state/journal/期望哈希。保存command-inventory.json、真实前后检查和范围说明。不要写或修改父级总审计/共享读取助手。

正文按实际阶段范围逐行整读，可用统一助手（替换阶段名、PROJECT、起止章）：

node acceptance/20261019-hundred-h/session-io.mjs read-b read PROJECT 23 24 baseline-reading

每次1–2章、最多3章，给足实际输出预算。助手显示前存原字节/SHA并输出JSON头+编号原文；截断要续读或按更小范围重读，不能只看前后段/摘要。readings.json不是单独的理解证明，父模型按真实事件与SHA逐行核验覆盖。历史章人物只能知道当时已亲见/获告的内容，当前106章snapshot不能倒灌给早期人物。summary/ledger是回查入口，不是相关原文的替身。

每章记录主要新增行动/信息/关系/代价与未兑承诺；比较跨章重复和真正不同的收益，保留必要过渡与人物声音。重要物件/原件/副本/持有与知情来源、音频处理边界、钱款应收/实收和私人与公共授权分别核实。报告按writer-review要求列具体问题、证据/位置、分类/置信和应保留项；无硬问题写没有，不凑数量。语言硬问题须经两项以上语言检验与实际阅读代价支撑；可选风格保持可选。本轮只是知情模型审阅，不是真人盲读或市场验收。

结束保存当前阶段REPORT.md（逐章结果、实际覆盖、卡点/失败/纠正、候选修改和保留资产）、handoff.md/json及results.json。交接至少含project、实际revision/schema/generation/content_id、read_range、readings文件及SHA、当前state SHA、allowed_actions、待回查/未知/私人边界、各报告路径和下一阶段。可以补读必要相关旧文，但分别列范围；不得把前阶段阅读或未读后文算本人完整阅读。阅读阶段不改正文、不创建新章/细纲/卷契约、不登记新情节事实；只在报告给候选与建议，待完整梳理后再走正式创作/修订。

预计每进程20–35分钟，至少每60秒报告已实际读到的章号、当前处理内容及剩余预估。结束简报实际范围、恢复结果、正文/登记未变及下一步，不能只说完成。
