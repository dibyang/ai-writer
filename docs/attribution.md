# 授权、来源与随作品保留的许可

自2026-10-19起，ai-writer的自有代码、技能、通用规则、文档及原创示例，包括本仓库随附的自研story-gate-studio，采用Apache License 2.0。完整条款见[LICENSE.md](../LICENSE.md)，版权与范围说明见[NOTICE](../NOTICE)。可依许可使用、修改、商业使用和再分发，需随分发保留许可、相关署名及必要的修改声明。`package.json`中的`private: true`只防止误发npm，不限制开源许可。

本次授权也覆盖本仓库历史快照与验证归档中的自有内容；其中旧内部/私有许可说明保留历史证据含义，本次分发时自有内容适用当前Apache-2.0授权。第三方原许可不变。已有作品不会因工具许可切换而自动改稿、升级或重新授权；作品正文、私有研究、作者专属材料和第三方引文仍按各自权利与约定处理。

正式0.8.0（资源配置`apache-2.0-v1`）、此前内部0.8.1候选及当前0.9.0开发候选的新作品，在作品根和`.writer/tool/`内均携带许可与NOTICE；更新旧作品时，新的受管包携带当前许可，作品根旧副本和作者定制默认保留。分发更新后的工具应使用完整受管包，并查阅其中当前的本说明和NOTICE。轻量工具不包含story-gate-studio引擎；单独分发引擎时须保留引擎自身的LICENSE.md和NOTICE。

新作品除了工具、技能和使用手册，还保存以下资料，离开 ai-writer 主项目后仍可查看。

- [Apache-2.0完整许可](../LICENSE.md)和[NOTICE](../NOTICE)：工具许可与作品正文权利分别处理。许可迁移前后的自有导入文件哈希见`docs/license-transition.json`，原始导入清单不被覆盖。
- [初始来源清单](source-manifest.json)和[后续参考盘点](oh-story-audit-manifest.json)：记录主项目吸收来源、固定版本和内容哈希。这两份是历史来源清单，包含主项目才有的文件，不表示整个清单已复制进作品；不要把未随附的质量引擎当成已安装。
- [本轮去味来源清单](usability-sources.json)：其中列出的专题原文与 MIT 许可均按原路径随作品保存，可直接重新计算 SHA-256 核对。
- 上游许可全文：[初始快照](../vendor/oh-story-reference/LICENSE)、[后续快照](../vendor/oh-story-reference-20261015/LICENSE)、[去味专题](../vendor/oh-story-deslop-reference/LICENSE)。这些 MIT 许可只适用于对应上游资料，不能推导整个工具项目的许可。

上游原文用于溯源，里面的命令、技能指令和跨文件链接不是本作品的操作入口。日常写作继续使用随附的 writer-project、文体技能和本套手册。随附轻量工具不包含 story-gate-studio 引擎。

保留整个作品目录即可一并保留这些资料。既有作品不会自动升级；完整升级随附工具和资料前先备份，之后运行 doctor 核对。

## 新增方法参考：Chinese-WebNovel-Skill

2026-10-19核对[Tomsawyerhu/Chinese-WebNovel-Skill固定版本](https://github.com/Tomsawyerhu/Chinese-WebNovel-Skill/tree/96709f477f4b59be856ebb10bec052dd0452b846)，默认分支v2，commit为96709f477f4b59be856ebb10bec052dd0452b846。本次完整目录中未发现许可证文件，GitHub许可字段为空；未复制其教程、例文、小说语料、脚本或演示作品。方法文件的读取范围、原文SHA-256、吸收与不采纳项记录在随附[来源清单](usability-sources.json)的method_references中，原文未随作品分发。

ai-writer以独立表达和原创例子补充长篇推进与阶段兑现、开篇/转场/对白/章末承接的按需诊断，并与原有分卷、登记、意见和修订流程衔接。未引入固定开篇字数、强制范例检索或所有章节强冲突等规则；不把参考方法的有效性当成市场或真人验收结论。

## 后续开发参考：三个长篇项目

2026-10-19固定核对以下来源；实际部分读取范围、文件哈希和取舍保存在随附`usability-sources.json`的method_references中。未复制上游源码、提示词、例文或作品，原文阅读缓存不随工具分发。

- [Openwrite](https://github.com/LiPu-jpg/Openwrite)：main固定c662440f351436e666b6f996d3bdb3274f351b31，native-core固定4af1f24c2c8dc2751574495fac5da8d5b452c694，根许可为Apache-2.0。借鉴上下文保护与占用诊断、非事实性短程候选；已有状态、审查覆盖和修订机制继续复用。
- [novel-creator-skill](https://github.com/leenbj/novel-creator-skill/tree/a327428ea26962163f823ad74001243f91bc7738)：README声明MIT License，但该提交未找到根目录完整许可文本。本轮只独立表达长章分步展开和阶段兑现方法；部分规范标注“规划中”，不据此声称上游能力经过实测。
- [Long-Novel-GPT](https://github.com/MaoXiaoYuZ/Long-Novel-GPT/tree/107c31e54686947a6d00404e332475a60b66e630)：该提交未找到根许可证或README授权声明。本轮只借鉴分层创作、纲文对应和局部编辑的抽象思路；不复制实现，不自动补齐正文缺证的对应关系。

新方法用于小说的按需章节参考；其他文体不套小说节拍。上下文诊断为独立实现，文学对应关系仍由模型实读并标范围，不引入固定悬念、禁词替换、额外宿主、向量库或付费模型依赖。是否已发布以正式标签及发行说明为准，当前开发目录的内容ID可能不同。
