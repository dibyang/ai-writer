# 独立会话：文件恢复、历史影响与修订前半程

这是产品真实 Codex 实跑的第二个独立会话。仅操作本轮 `acceptance/20261018-governance-b/` 内新建的《铜桥来信》及本阶段报告/输入；不要修改真实作品、源码、技能、Git 或其他轮次。主项目为 cwd，所有产品命令明确 --project；不派代理，不发消息，不提交推送。

先读 writer-project、必要小说技能和 docs/revision-and-sources.md，再从本轮根目录 handoff.json、report.md（第一会话的实际输出位置）及作品文件恢复，不能把交接摘要当已读正文。核对6章真实字节、2卷、旧押钱2枚、第7章起3枚的版本区间、铜片保管与缺角印回收、作者任务和未决项。实际完整连读六章和将改动的旧输入。

本验证场景的模拟作者新指令，保存原话并注明合成测试授权：

> 本次修改仅限独立作品《铜桥来信》：从第二章开始，押钱改为三枚，第五章退回三枚，核对所有提及和后果；第一章仍保留当时旧规则。授权从实际最早影响章至第六章建立独立修订区，处理人物所知、铜片和缺角印的连续性，保持核心情节、人物声音和原有伏笔回收，不加新阴谋。本次会话只完成修订前半程，到第三章登记后停止并交接；主稿保留到下一会话完成全部尾段复核与事务提交。完成整轮修订后暂停正文，不写第七章。

产品命令使用记录器，每个标签唯一：

```
node acceptance/20261018-governance-b/capture.mjs native-two-标签 node bin/ai-writer.mjs 命令 ...
```

实际 JSON 结果位于 commands/标签/stdout.raw.txt 或 stderr.raw.txt，元数据非产品结果。可写本阶段 Node 辅助脚本准备输入和调用真实 CLI，不得修改 state/会话基线规避检查；作者证据必须字节可核。保留每一步输入与预期非零拒绝。

顺序：

1. 只读核对并保存主稿六章起始哈希与原 source_hashes/版本；报告放本阶段目录，不往主作品随意写资料造成基线漂移。
2. 实际复读后，准备候选权威规则文件，保留有效旧规则入口及旧冻结对象，写历史影响报告。根据读到的消费关系登记 revise_range，覆盖最早影响至6，允许 plan/revise/discuss，不允许新正文。把新的作者证据、候选和影响报告在 begin **之前**准备到主作品适当目录。
3. freeze 候选（ref 指向实际权威规则，file 指向独立候选），impact mode=historical/from=2。准确核对 replaced_ranges，包括原本第7章的未来安排；这次从2章持续生效的新三枚规则替代原未来安排，原提案/事件保留，不能误称第1章也用了新版。真实实读 required_readings 并填写范围、结论、未决项，source stage 启用持久 pending。
4. 验证 pending 会使 check/导出或续写入口拒绝，旧审查依赖待复核；保存失败输出和状态未变证据。不要取消 pending 绕过。
5. revision begin，保存返回的 id、token、workspace、base_revision。主业务 revision 不因 begin 前进；先核对复制隔离。此后所有正文/章纲/账本写入只在 workspace，带 --revision-token。
6. 在独立区 rewind 最早影响章，再用 staged impact_id 在区内 publish（from=2），逐章实读、必要最小修改、生成新模板和重登，**只登记至第3章就停止**。第1章不擅自改已发生事实，仍用旧设定版本；2、3章根据新三枚规则处理。后半程4–6尚未重登，不伪造完成，不 prepare/commit。
7. 主稿6章正文及正式追踪依然保留原版本，pending 仍存在。保存 parent-before/after-body-fingerprints.json、branch-status、当前 ledger 和完整交接 handoff.json（id/token/路径/base_revision/主state哈希/分支revision/已重登范围/下一章/需要修改的原文位置/版本区间/未完成任务）。交接和阶段报告放 native-revise-partial 目录，不额外写主作品以免改变 CAS 基线。
8. report.md 如实列实读范围、实际改动、未完成范围、原始证据、问题和边界。保留原读稿与改后稿，不能说文学或真人验收通过。发现工具缺陷保留最小复现并报告，不改源码、不手改协议字段。

完成前半程即停止，供第三个真正独立会话从文件恢复。不要为了使检查绿色补登4–6，不要更新随附工具或重置基线。
