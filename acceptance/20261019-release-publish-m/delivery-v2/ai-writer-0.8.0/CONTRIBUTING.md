# 贡献说明

[English](docs/en/CONTRIBUTING.md)

普通问题按[反馈指南](docs/bug-reporting.md)提交到GitHub Issues；安全问题见[SECURITY.md](SECURITY.md)。先检索已有问题，提供版本、构建身份、入口和匿名复现。不要上传真实作品或未经授权的规则、参考原文和资料。

修改前说明问题与预期行为。工具代码在bin/、lib/、tests/；技能在.agents/skills/。作品状态与历史封存不能手工改写以绕过保护；新增回归请使用独立匿名夹具。

修改工具后运行npm test和npm run doctor；涉及内置引擎另跑npm run test:engine。发行变更还需构建、解压并验证最终ZIP。请区分程序检查、模型阅读和真人验收，勿扩大验证结论。

提交贡献即按项目Apache-2.0许可提供对应自有贡献，除非事先明确另行约定。第三方内容必须具备可分发许可并保留署名；作品、研究资料和第三方引文不会自动获得本项目许可。
