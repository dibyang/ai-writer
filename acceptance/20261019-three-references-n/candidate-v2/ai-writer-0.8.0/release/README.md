# ai-writer 0.8.0

面向Codex的中文创作工具，支持小说、剧本、历史散文、散文与一般非虚构。作品保存在本地，支持长篇分卷、跨会话恢复、设定版本、保护修订、意见闭环和草稿导出。

## 开始使用

需要Codex和Node.js 20或更高版本，无须安装npm依赖。解压到新目录，在Codex中打开本目录，先运行：

```powershell
node bin/ai-writer.mjs doctor
```

然后直接说：

> 创建小说 works/雨夜来信，计划十二章、两卷。先确定定位、人物和全书骨架，只细化近期前三章；本轮只试写第一章，完成审查、登记和检查后暂停。

[快速入门](docs/quickstart.md)介绍完整第一章流程，[使用手册](docs/user-guide.md)提供日常任务入口。长篇见[长篇流程](docs/long-form.md)，版本与修订见[专项手册](docs/revision-and-sources.md)，更新旧作品见[工具更新](docs/tool-updates.md)。

## 版本与更新

这是首发0.8.0下载包，资源配置为`apache-2.0-v1`；`build-manifest.json`记录受管内容ID，`RELEASE-MANIFEST.json`记录包内文件哈希。历史内部0.8.0和0.8.1候选可能与本包内容不同。更新已有作品前先备份、比较构建、生成更新计划，保留作者规则与定制；不要覆盖作品目录。

[发行说明](RELEASE_NOTES.md)和[更新记录](CHANGELOG.md)介绍能力与边界。原0.8.0、0.8.1仅为内部候选；本包是否正式公开，以源码仓库的标签及Releases状态为准。机械检查不代替实读、真人阅读或作者定稿；导出仍为草稿。

## 反馈与许可

普通问题见[反馈指南](docs/bug-reporting.md)，贡献见[CONTRIBUTING.md](CONTRIBUTING.md)，安全问题见[SECURITY.md](SECURITY.md)。不要在公开反馈中上传正文、作者私有规则或令牌。

自有部分采用[Apache License 2.0](LICENSE.md)，版权及第三方范围见[NOTICE](NOTICE)和[来源说明](docs/attribution.md)。工具许可与作者作品权利分别处理。

本包包含运行代码、七项技能、内置引擎、手册和回归测试，不包含用户作品、验收作品及本机配置。源码及完整历史验证记录见[项目仓库](https://github.com/dibyang/ai-writer)。
