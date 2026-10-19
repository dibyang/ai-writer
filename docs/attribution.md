# 随作品保留的来源与许可

新作品除了工具、技能和使用手册，还保存以下资料，离开 ai-writer 主项目后仍可查看。

- [项目使用与分发状态](../LICENSE.md)：ai-writer 尚未指定整体对外分发许可；作品正文的权利与作者选择独立于工具许可。
- [初始来源清单](source-manifest.json)和[后续参考盘点](oh-story-audit-manifest.json)：记录主项目吸收来源、固定版本和内容哈希。这两份是历史来源清单，包含主项目才有的文件，不表示整个清单已复制进作品；不要把未随附的质量引擎当成已安装。
- [本轮去味来源清单](usability-sources.json)：其中列出的专题原文与 MIT 许可均按原路径随作品保存，可直接重新计算 SHA-256 核对。
- 上游许可全文：[初始快照](../vendor/oh-story-reference/LICENSE)、[后续快照](../vendor/oh-story-reference-20261015/LICENSE)、[去味专题](../vendor/oh-story-deslop-reference/LICENSE)。这些 MIT 许可只适用于对应上游资料，不能推导整个工具项目的许可。

上游原文用于溯源，里面的命令、技能指令和跨文件链接不是本作品的操作入口。日常写作继续使用随附的 writer-project、文体技能和本套手册。随附轻量工具不包含 story-gate-studio 引擎。

保留整个作品目录即可一并保留这些资料。既有作品不会自动升级；完整升级随附工具和资料前先备份，之后运行 doctor 核对。

## 新增方法参考：Chinese-WebNovel-Skill

2026-10-19核对[Tomsawyerhu/Chinese-WebNovel-Skill固定版本](https://github.com/Tomsawyerhu/Chinese-WebNovel-Skill/tree/96709f477f4b59be856ebb10bec052dd0452b846)，默认分支v2，commit为96709f477f4b59be856ebb10bec052dd0452b846。本次完整目录中未发现许可证文件，GitHub许可字段为空；未复制其教程、例文、小说语料、脚本或演示作品。方法文件的读取范围、原文SHA-256、吸收与不采纳项记录在随附[来源清单](usability-sources.json)的method_references中，原文未随作品分发。

ai-writer以独立表达和原创例子补充长篇推进与阶段兑现、开篇/转场/对白/章末承接的按需诊断，并与原有分卷、登记、意见和修订流程衔接。未引入固定开篇字数、强制范例检索或所有章节强冲突等规则；不把参考方法的有效性当成市场或真人验收结论。
