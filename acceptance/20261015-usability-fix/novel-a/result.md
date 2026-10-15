# 《雨后失物》旧稿建档阶段结果

本阶段已完成：另建指定作品、补充定位/声音/规则、启用长篇、建立第 1—3 章分卷规划、冻结两章、完整读并登记第一章、仅提取第二章、检查并导出第一章草稿。**未完整导入两章，未开始续写，未润色原文。**

- 工作目录：`D:/work/other/ai-writer`；全部实际作品 CLI 都从此处调用主项目入口，并显式传指定作品路径（init 使用 --path，其他作品命令使用 --project）。
- 作品：`acceptance/20261015-usability-fix/works/雨后失物`，标题《雨后失物》，kind=novel。
- 本阶段：`acceptance/20261015-usability-fix/novel-a`。执行开始约 22:10，哈希核对完成于 2026-10-15 22:16:59（Asia/Shanghai）。
- 已先读 docs/quickstart.md、docs/user-guide.md、writer-project、writer-novel，以及 long-form 与 suspense-continuity 指引；另核对了 workflow 与现有参数实现。
- 权利依据：用户明确说明这两章是本次自行制作、有权使用的流程验证文本。

## 当前范围与断点

| 项目 | 真实结果 |
| --- | --- |
| 状态 | schema_version=2，revision=2，next_unit=2 |
| 已登记 | 仅第 1 章《蓝袋子》，正文/0001-导入.md；2 位人物、7 条 ledger、3 条时间线追加 |
| 已读 | 第一章原稿及导入副本全文，第 1—18 行；导出第一章也已核读 |
| 未登记正文 | 正文/0002-导入.md；已提取但未阅读内容、未作章纲/摘要/context/template/record |
| 导入进度 | total=2，registered_units=[1]，unread_or_unregistered=[2]，baseline_registered_through=1 |
| 继续能力 | can_continue=true，phase=ready，blockers=[]；是主动保留断点，不是工具阻断 |
| 来源 | stale_units=[]，changed_sources=[]，changed_copies=[]，changed_originals=[] |
| 审查状态 | mechanical-only；literary_quality=unreviewed；quality_review=required |
| 滚动连读 | valid=0，stale=0，pending_windows=[]；尚未到三章窗口，不代表文学质量过线 |
| 第三章 | 无正文、无单元细纲、无登记；只在卷契约里保留未来承接边界 |

第一章记录不把“找到登记、伸手拿钥匙”升级为已开柜或已交接；父亲两次交代的缘由保持待核。第一卷 V1《雨后核验》覆盖 1—3 章：A1 覆盖 1—2，A2 覆盖 3。对未读第二章不编造内容，第三章等两章基线完整登记后再细化。全书总卷数、终局与具体父亲处境未擅自设定。

设定和规划在作品的 `设定/`、`大纲/全书大纲.md`、`大纲/分卷/V1.json`；详细实际阅读覆盖见[作品内记录](../works/雨后失物/审查/旧稿建档阅读覆盖.md)。

## 导出交付

- [manuscript.md](export/manuscript.md)：仅第一章原文，是当前已登记范围的可用草稿。
- [manifest.json](export/manifest.json)：status=draft-export，revision=2，included_units=[1]。
- excluded_drafts 仅 `正文/0002-导入.md`，reason=`unregistered`，并保留 UNREGISTERED_DRAFT 警告。这是本次要求的排除，不做登记绕过它。
- 第三章尚未创作，因此没有可合并内容，也不出现在未登记稿排除清单。定位、规则、规划、追踪、冻结原稿副本和报告均不合并进 manuscript；清单只保存纳入第一章的来源哈希。完整恢复须保留整个作品目录，不能只留导出稿。

## 真实 CLI 记录

所有命令实际执行，没有模拟成功输出。主流程用本阶段的 [run-cli.mjs](run-cli.mjs) 启动 `node bin/ai-writer.mjs` 子进程，只负责保留原始结果和校验路径，不更改 CLI 或追踪逻辑。

[commands.jsonl](commands.jsonl) 保存 16 次主流程命令的准确 argv、cwd、起止时间、退出码、stdout、stderr；均 exit=0：

| 顺序 | CLI | 关键结果 |
| --- | --- | --- |
| 1 | init | novel，empty |
| 2 | status | revision=0，schema=1，无正文 |
| 3 | long-enable --expected-revision 0 | schema=2，revision=1，自动生成 pre-long 备份 |
| 4 | volume | V1，plan-only |
| 5 | import-index | 按 0001.md、0002.md 顺序冻结 2 章 |
| 6 | import-status | 可继续，尚无登记 |
| 7 | import-next | 第 1 章提取到正文 |
| 8 | plan | 第一章反向细纲 |
| 9 | context | 第一章真实上下文、修订号及来源哈希 |
| 10 | record-template | 自动带入 expected_revision=1 和完整来源哈希 |
| 11 | record | 第 1 章登记，revision=2，draft-recorded |
| 12 | import-next | 第 2 章提取到正文，未读取内容 |
| 13—15 | status / import-status / check | 登记仅 [1]，断点 2；check 有预期未登记警告 |
| 16 | export | 仅导出 [1]，明确排除第二章 |

原样保存了 [.writer/record-0001-template.json](../works/雨后失物/.writer/record-0001-template.json)，填写的输入在同目录 record-0001-input.json。未手工编辑 state.json、import.json 或日志来消除校验。

最终输出快照：[status.json](status.json)、[import-status.json](import-status.json)、[check.json](check.json)。并发的是最后三项只读检查；所有作品写入命令顺序执行。

## 遇到的问题及处理

1. 首次 `doctor --project 指定作品路径` 被 CLI 拒绝，原始错误为 `无效、重复或缺值参数：--project`，退出码 1。核对现有实现后确认 doctor 是全局命令且 flags=[]，不能接收作品参数。为遵守本次显式作品路径的限制，没有另跑无作品参数的 doctor，因此本报告不声称 doctor 成功。
2. 首次 import-index、import-next、record-template、volume 的 `--help --project 指定作品路径` 均报 `无效、重复或缺值参数：--help`，退出码 1。现有帮助入口只在子命令后唯一参数为 --help 时成立。本阶段读取手册与参数定义后继续正式命令，没有改 CLI。单独 --help 未验证，不把这个组合限制报告成帮助完全不可用。
3. 初次写入设定的补丁同时对同一文件使用 delete/add，被 apply_patch 整体拒绝：`invalid patch: multiple operations target .../设定/作品定位.md`。这是本次操作方式错误，非产品故障；无内容生效，后改用 Update File 成功。
4. check 和 export 的 UNREGISTERED_DRAFT 是作者要求的第二章断点，保留 warning 并在清单排除，没有为追求全绿而登记未读章节。

前 5 次 CLI 失败的完整原始结果见 [initial-cli-results.jsonl](initial-cli-results.jsonl)。未修改产品实现、技能或手册来处理问题。

## 文件一致性与边界

[verification.json](verification.json) 记录 10 项全部通过的文件/状态核对（由本阶段 verify.mjs 执行，并非产品测试或文学验收）：

| 单元 | 原稿 / 冻结副本 / 正文 SHA-256 |
| --- | --- |
| 1 | 992c03096d803bbfe6937385fd13a697713076c6ecc8e9ce3a9451dae1f9e83f |
| 2 | 616fbc76d16d5ae921d7f7d6abb3d16e1cdc6dcaf63c3110de806ec49ee25e47 |

第一章导出 SHA-256 也为 `992c03096d803bbfe6937385fd13a697713076c6ecc8e9ce3a9451dae1f9e83f`，与原稿逐字节一致。第二章只通过程序计算字节哈希，没有展示或分析其正文。

本轮持久写入仅在指定作品和 novel-a 阶段目录。init 使用 CLI 自带的同父目录临时 staging 并重命名为目标作品，未留下额外作品。没有写入其他验收目录；保留了已有 request/events 文件。主项目起始就有未提交改动；结束 Git 状态条目与开始所见一致，记录在 [git-status-final.txt](git-status-final.txt)，未将既有改动归入本次成果。

未修改产品工具，因此未运行 npm test 或 test:engine。没有启动额外代理或付费服务，没有上传、提交、推送或发布。导出仍为草稿，未经过文学审查、真人盲读或作者定稿。

本阶段工作到此结束，恢复点为第二章的完整阅读与正式登记；本轮不执行该下一阶段。

