# 最终 A 候选：修复后的原生 Codex 回归

用户已授权实现最小首批 A 并通过 Codex 实跑、修复问题。前轮在全部暂停时发现 ACTION_OUT_OF_SCOPE 的 next_action 仍建议继续讨论/规划，主会话现已修复。你运行最终候选实际回归，不改实现、不创建子代理、不提交/推送、不迁移或更新真实作品。

只写本阶段 `acceptance/20261018-governance-a/native-final-check` 与本轮 commands 中 `native-three-` 标签的记录。原六章作品、前一微型作品和 D:/work/小说/dzkxqxx 均不得写。不要用改 state、改哈希或旧工具升级来让测试通过。

先读当前 writer-project 技能、快速入门和使用手册。只读恢复 `works/纸灯札记` 的正式任务，实际确认六章后仍 next_unit=7 且只讨论；用最终主 CLI 取 discussion，实际请求 unit7 draft context 并验证拒绝提示只列当前允许动作，不诱导越权。

随后使用最终主工具 init 创建本阶段 `最终回归微型作品`。以下是本测试作者的完整新指令，请真实保存原话并按正式命令绑定，不编造消息 ID：

> 在这部独立验收小说中，主角叫许桥，地点已选河边旧渡口；结尾的赠物仍未定，纸签和铜铃只是候选。允许远期全书骨架暂缓，先有限试写第1章300–450正文汉字，写许桥替老人修好纸灯的提手，动作具体、人物温和，不加阴谋。第1章登记并检查后，先转为只讨论总纲，保留远期暂缓及原因；确认讨论上下文可用且下一章不得写，再暂停全部创作动作，仅可查看任务。两次转阶段都应正式登记。

用 workflow show 的 workflow 字段构造新输入。有限 trial 写入实际范围与复盘条件；planning.structure=deferred、原因与未决项如实。分别保存已确认地点、未决赠物，两者不混入事实 ledger。依序 plan/context/record-template、实际写稿自检、record/check。短篇只用 schema 3 changes，无需分卷。

按指令先 structure + discuss/plan、两个范围 null，保留 deferred，不伪造 adopted；正式讨论 context 成功，下一章拒绝。再 paused + allowed_actions=[]、两个范围 null，status 应推荐可执行的 workflow show；实际执行该建议成功，再请求 discussion，实际拒绝且 next_action 必须如实说全部暂停/只读查看，不能建议未授权讨论或规划。用 before/after state 和正文哈希证明拒绝未修改作品。

用 tool identify/compare 核对新副本与当前主项目的公共受管内容一致，保存完整 observed_content_id/runtime_id。两个版本为0.4.0仍不等于内容相同，旧副本差异只报告不更新。明确所有命令都调用当前最终主入口或新副本，不用前轮旧副本代替最终构建。

每条产品 CLI 均用：`node acceptance/20261018-governance-a/capture.mjs native-three-唯一标签 node bin/ai-writer.mjs ...实际参数...`。它保存 raw stdout/stderr/退出码、输入快照与状态哈希；不要导入 lib 代替 CLI。负向测试退出码2如实保留，不用伪输出。一次性 Node 脚本只用于新目录写资料/输入或只读盘点。

写过程报告与 JSON 摘要到本阶段，列出实际完成、拒绝、字符数、构建、保留的候选、未覆盖项和输入错误/重试。发现新问题只报告主会话，不改代码。模型自检不写成真人验收；本轮目标是 A 的流程和保护，完成后停止。
