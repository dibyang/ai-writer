# history接口夹具

推荐在 ai-writer 主项目的 Codex 会话提供本作品的当前完整路径，说“先恢复这个作品的状态，再根据设定规划并写下一章/场/篇，完成检查和登记”。

也可在 Codex 中直接打开本目录使用随附技能。若本机出现 helper 初始化失败，返回 ai-writer 主项目目录启动会话，并明确提供作品路径；不要反复切换入口或修改全局安全设置。

[快速入门](docs/quickstart.md) · [使用手册](docs/user-guide.md) · [命令说明](docs/workflow.md) · [去 AI 味](docs/deslop.md)

正文保存在 正文/，细纲在 大纲/单元/，事实卡在 研究/，审查在 审查/。
.writer/state.json 是唯一结构化追踪状态，由工具登记；正文文件已保存与追踪已登记是两种状态。导出前查看未登记正文和排除清单。
在本目录运行 node .writer/tool/bin/ai-writer.mjs status 可查看下一步；各命令支持 --help。登记表示草稿已保存，不代表作者验收。
