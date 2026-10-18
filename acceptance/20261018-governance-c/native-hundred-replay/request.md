这是本批 C 的第四个独立 Codex CLI 实跑。只操作 acceptance/20261018-governance-c/scale-hundred/work 这个已复制的百章验收副本，以及本阶段 native-hundred-replay/ 内新建短篇和报告。既有作品、原 acceptance/20261016-hundred、旧 A/B 封存、旧工具对照副本、主源码/技能/手册一律只读；不 Git 提交推送，不联网发布，不子代理或发送会话消息。

先读 AGENTS、writer-project/novel/review 技能、当前 review-and-registration、revision-and-sources、long-form 文档、本批 capture.mjs、scale-hundred/handoff.json、hundred-c-prepare/summary.json、scale-hundred/old05-comparison.json 和必要的原始结果。所有产品调用用主 bin/ai-writer.mjs 并通过本批 capture.mjs，唯一 native-four-* 标签，留下原始输入输出、前后 state 与构建。不要调用副本中的 0.3 工具修改任何状态；只能只读 doctor/tool compare 以确认兼容提示，不能自动更新。

目标是百章规模登记回放与最近六章真实复核，不是重写百章或宣称通读全书。该副本来自原 schema2/revision371 的 598 文件；主工具已经显式迁移到 schema5 并授权仅 revise100–100，准备阶段 revision375。实际核实现状，不把这些提示当作证据，不手改 state、日志、哈希或索引。记录开头的完整 state 和所有100正文 SHA；对照 scale-hundred/before-native-state.json。当前事实内容与原始 snapshot 应完全相同，前99章完整登记对象应保持到最后。

模拟验收作者范围（另存研究/百章C模拟授权.md，注明合成验收，不是真实作品作者决策）：仅允许第100章等价登记回放，正文一个字也不改，不加101章，不改变任何事实或未来设定。真实完整阅读95–100章、100章细纲与原登记增量和必要设定；长行可生成保留全部字符的换行阅读视图，不能只扫摘要就称读完。1–94章仅机器完整性核验与按需回查，不称模型通读。

执行 revision begin100–100、独立区 rewind100。在同一分支仍登记99章的同一状态，分别做3次独立 CLI record-template100 和3次 revision replay-input100（用正确 token），逐次留证，不覆盖。与 scale-hundred/old05-comparison.json 中真实0.5旧工具3次 template 对照：旧工具本来就会自动填路径和哈希、已有增量账本，不把已有能力算本轮新增；只统计当前恢复的 summary、真实 changes 语义字段、字符数/字节数、人物/时间/ledger/引文数量以及必须人工复核的六项字段。可列单次进程耗时和中位数，但仅观察不同协议的本机启动+IO，不得冒充人工填表时间节省或性能提升。报告清楚哪些已自动恢复、哪些仍必须实际阅读确认。

用生成但未填写 replay_review 的原始回放输入做一次 record-preview，预期拒绝、state 不变。实际读取原100章正文、old changes、现有设定与前后连接，填写真实审查报告（checked_fields 为 summary/characters/timeline/ledger/evidence/downstream）并填写 replay_review；不要照抄六项名字当已检查。正文/事实/摘要/增量内容均等价保留，仅当前哈希、token、来源绑定和回放复核证据应变化。正常 preview/record，必须通过旧引文与证据校验。若实际失败，保留调用与最小复现，不能修改事实以绕过。

登记后真实连读95–100，使用 review-template，逐章 goal/obstacle/choice/consequence/relationship_change 给出实际引文或真实 unknown/none 理由；comparison 区分重复表面流程和实际不同收益，保留需保留的内容与判断不确定性。issues 可空，无需为验收发明文学错误；修订范围仅100，禁止在分支登记95–99的新意见或处置其意见。登记当前六章结构复核并执行 prepare/commit；主 revision 从实际 base 只加1，重复 commit 不再变。暂停到 discuss/plan，取消正文与修订范围，不写101。

最终 check、status、主 doctor、tool compare；必要导出到本阶段新目录，核 source SHA、included/excluded 和合订实际文本/总SHA。原导出 trim 章首尾空白，不称合订原字节。逐字节核100正文与原副本清单一致，前99完整登记对象不变、snapshot 原始SHA不变、账本条目及每个引文锚点真实统计。新 replay_review 冻结对象和 current95–100复核有效；旧报告 stale/uncovered 如实保留，不能把尾段复核说成百章文学通过。

百章流程完成后，须补一个最终源码从零起步的完整短篇流程，避免把最初 V1 的六章创作误说成 V2 从零创作。只在本阶段 fresh-work 新建虚构作品《关门以前》：两章，每章700–1000个正文汉字，人物最多3人，一个具体归还/借物日常事件，有目标、选择、代价与有限关系变化；不借用真实作品或之前测试正文，不套失败—解释—再试—查验。它是短篇合成验收，不称长篇规模创作。新入口必须是当前0.6/V2，init --mode long 仅验证长篇登记入口，建立骨架、一卷两章契约、逐章计划、上下文、record-template、record-preview、record，两章实际完整创作/实读与逐章登记。不要先批量写再伪装顺序消费。

在第2章人为植入一处简单、明确的重复字作为受控样本，并在其 ledger 引文中保留该完整原句。写完暂停，只讨论/审查。使用 review-template，完整实读两章，填真实五项功能和 comparison、报告与两条意见：FRESH_C_TYPO 为该受控重复字；FRESH_C_STYLE 为第1章一个可选表达偏好，必须 suggestion，原句语义正确，不编成硬伤。单列控制样本与判断边界。

保存模拟作者新原话：“采用第2章重复字，只删这一字；第1章可选表达原样保留。只授权 revise2–2，正文不续写第三章，不改变事实或人物声音；真实提交及当前版本复核后暂停。”按照真实 author_evidence 登记范围与采用/保留。再独立修订第2章，rewind2/replay-input，实际阅读核对新正文、旧增量与引文，修正旧完整引文并填写六项真实 replay_review；preview/record、实读尾段review、prepare/commit、重复commit核幂等。第1章正文与完整登记不变，事实内容不变，证据新版本单列。实际 commit 后 apply 对应意见，重新完整读两章形成当前 report，再 verify 同一已应用项，保留项不称已修复。最终暂停，仅 discuss/plan、两个范围null，无第三章，check/doctor与新目录export验证正常。

将从零短篇的初始/最终正文、第一章保留证据、修订实际一字差异、事实语义与证据版本区分、作者取舍与原真实commit/application/最终有效报告、当前V2构建观察，保存为 fresh-report.md、fresh-verification.json、fresh-handoff.json 并汇入总报告。只写授权这两章，不扩写到更多章，不修主工具或其他作品。如果百章或短篇出现产品问题，保留最小复现并报告，父流程负责源码修复，不绕过保护。

交付本阶段 report.md、handoff.json、verification.json、field-comparison.json、command-index.json、真实读稿及五项功能表，以及上述 fresh-* 材料。报告准确列操作数、预期拒绝、修订提交与幂等、作者范围、100章/实际读取6章/最终源码新写2章的区别、旧0.5与新0.6的字段恢复及成本边界；所有原始记录留存。完成后停止，不做额外作者创作。
