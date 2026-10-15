# 本地候选验证记录

当前0.2.0候选的40项工具回归、长篇跨会话续写、断点导入、剧本/历史散文实跑与最终文件核对见 [20261015-long报告](../acceptance/20261015-long/README.md)。下文保留0.1.0阶段的原始记录，不作为0.2.0最终覆盖范围。

日期：2026-10-15；交付目录：D:\work\other\ai-writer。

本次使用 Windows 与 Node.js v24.15.0，在最终交付目录运行：

| 检查 | 结果 | 证据 |
| --- | --- | --- |
| 作品工具最终回归 | 24/24 通过，无跳过；含100单元容量与合法HTTPS回归 | acceptance/20261015/workspace-tests.txt |
| 内置 story-gate-studio 回归 | 29/29 通过，无跳过 | 本轮工具输出；原verification-engine.log保留为初始证据 |
| doctor | 7 个技能与内置引擎可用 | acceptance/20261015/doctor.txt |
| 小说真实Codex流程 | 2章，2150正文汉字；13条归档流程命令成功 | acceptance/20261015/novel-live及novel-create |
| 剧本真实Codex流程 | 3场，1262正文汉字；37次留档CLI调用成功；回退重登完成 | acceptance/20261015/screenplay-live |
| 历史散文真实Codex流程 | 2章，1570正文汉字；当前主会话15次CLI调用成功；实际核读古籍原文 | acceptance/20261015/history-live |
| 最终产物与版本核对 | 3/3作品，7单元；正文、登记、审查、导出哈希一致，携带工具为最终候选 | acceptance/20261015/artifact-verification.json及final-tool-sync.json |
| 技能创建器 quick_validate.py | 初始7/7；本轮改动writer-project及writer-review另验有效 | 本轮工具输出；格式校验不证明行为质量 |
| 复制来源完整性 | 160 个文件的 SHA-256 一致 | workspace 测试及 source-manifest.json |

原匿名示例examples/novel-opening.md与verification-smoke.log仍保留，不能冒充本轮从零创作。新三文体样稿、原始请求、失败/恢复、知情实读报告与导出统一在acceptance/20261015；原小说工作区没有增加或修改本轮文件。

四文体测试验证文件生命周期、编码、状态、上下文、登记和导出。tests中的history事实卡仍是明确标注的结构夹具；真实历史样稿另用实际读过的《梦溪笔谈》卷十八活版条。verified字段、脚本通过和来源哈希都不能证明历史结论正确。100单元测试生成1701095字节状态并生成第101单元context，只验证机械容量，不等于长篇文学连续性。

尚未验收：essay真实创作、新独立history进程启动、完整长篇的跨章语义连续性、独立真人阅读、真实排演与成片时长、历史影印底本/正式页码/第二史源、Linux与其他Node版本。CI已配置但尚未在线运行。未启用额外付费生成或另行上传、发布作品。完整证据和吸收边界见acceptance/20261015/README.md及sources.md。

项目已初始化为独立本地 Git 仓库；未提交、未配置远端、未推送。
