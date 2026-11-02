# 发行准备与已发布版本

0.8.0已于2026-10-19[正式发布](https://github.com/dibyang/ai-writer/releases/tag/v0.8.0)，标签绑定`27a20edd`；完整执行与验证的 M 轮原始记录保存在维护者本地 acceptance 目录，不随下载包分发。下文保留维护者操作流程；发布后补交的记录不移动标签，也不覆盖已验证资产。

本页是维护者的本地准备流程，不自动创建标签、推送或发布。用户批准具体产物后，再执行对应Git和GitHub动作。

0.9.0最终提交及资产核验见[发布记录](release-090-verification.md)。以下构建步骤针对当前package.json版本；正式发行状态以项目 Release 为准。0.8.0、0.9.0的发行记录、标签和资产保持原身份。

## 首发版本身份

首个正式版本按作者要求统一为0.8.0。历史0.8.0和0.8.1候选保持封存记录；正式包通过`package.json`中的`aiWriter.resourceProfile=apache-2.0-v1`识别65项受管资源。版本号相同不表示内容相同，比较以内容ID、资源配置与清单为准。

## 构建与验证

```powershell
npm run release:build -- --out dist/0.11.0
```

输出目录必须不存在。构建器按`release/distribution.json`的明确文件清单复制，拒绝不安全路径、重复路径、符号链接和覆盖已有产物；根README使用`release/README.md`作为下载包入口。不会扫描或打包作品、验收目录、.git、.idea或临时目录。失败时保留临时构建目录供诊断，不自动删除或覆盖。

历史来源审计索引以`docs/oh-story-reference-inventory.json`镜像随源码包携带，只包含公开参考仓库的文件元数据，与原审计清单的SHA一致；回归不依赖未分发的验收目录。Git来源只在当前目录确为仓库根时记录，不借用父仓库；暂时读取失败会停止构建，不把不确定状态悄悄写成另一份成功产物。

产物包括`ai-writer-0.11.0.zip`、`SHA256SUMS.txt`、`release-manifest.json`、`RELEASE_NOTES.md`和便于检查的展开目录；默认输出为`dist/<package.json版本>`。ZIP使用固定条目时间；同一输入、同一来源状态下可复现。清单记录实际来源Git提交与dirty状态，不把开发候选称为已发布版本。包内`build-manifest.json`绑定受管资源；`RELEASE-MANIFEST.json`记录载荷哈希，外部SHA绑定最终ZIP。

以最终ZIP解压到新目录后，运行npm test、npm run doctor、npm run test:engine和真实CLI流程；核对隐藏技能、中文路径、来源许可、旧候选更新、幂等及暂停门禁。验证数据放在包外，保持下载资产原始哈希。Windows环境跳过不能算通过，也不能代替未取得结果的跨系统CI。

## 正式发布前最后一步

每个正式版本必须先做实际升级试验。至少从上一正式发行的原始ZIP建立已有登记正文的合成作品，更新到本轮最终候选包；本轮涉及的旧协议、目录迁移或状态格式另纳入矩阵。不要只用新版初始化空作品、改版本号或手改state模拟升级，也不要在真实作品上试验。

记录旧版标签/资产SHA256、新版提交/包SHA256、当前状态协议与工具代次，验证升级前后正文和事实等价、作者根AGENTS/技能/定制文档保留、来源和过期输入保护、升级后的讨论/续写/审查/导出。实际执行必要的失败阻断与中断complete/rollback恢复，确认状态和工具身份一致；未支持的降级/迁移明确记录。最终候选变化后重测受影响路径，不能用旧候选证据替代最终包。

升级矩阵、命令双流/退出码和版本绑定结果随发布验证记录保留；有未解决兼容问题或关键升级路径缺证时不得正式发布。Windows跳过不记通过，自动化回归是补充证据，不能替代已发布旧包到新包的实际升级。

执行入口为 `node scripts/verify-upgrade.mjs --old <旧版解压根> --new <新版解压根> --out <全新证据目录>`。两个输入必须是实际发行包，输出必须在包外且不存在；脚本只新建合成作品，不接受现有作品作为发行包输入。当前矩阵覆盖小说、剧本、历史散文、散文，schema 6 与显式重定位后的 schema 7、作者定制保护、过期模板、更新重试、活跃修订阻断，以及升级事务中断后的完成和回退。

`.github/workflows/checks.yml` 的标签发布任务等待三系统、两种 Node 版本回归，通过后下载上一正式版ZIP并校验公开SHA256，从当前标签构建最终包，在其解压目录再次执行完整检查及上述真实升级。失败停止发布，合成升级命令和结果保存为 Actions artifact（包含合成目录的隐藏状态文件）；成功才创建正式Release，附 `upgrade-verification.json` 和完整 `upgrade-evidence.zip`，两者也纳入外部SHA清单。完整合成记录以附件留存，不把大量验证作品加入Git。发布新版本时必须复核矩阵是否覆盖本轮新增的兼容风险，不能把固定八例当作永远充分的证明。

核对具体提交、发布说明、ZIP SHA及对应验证记录；完成用户授权的提交后，从选定提交重新构建并核验产物来源，更新开发说明为正式发行说明，再按授权创建对应版本标签、上传附件和发布。不要移动已有v0.8.0标签或覆盖资产；0.9.0 已于 2026-10-27 发布，标签绑定 01df489d9；后续记录提交不移动标签或覆盖资产。

建议先保存GitHub Release草稿并附齐ZIP、SHA和发布说明，再在授权后发布为正式版本；不勾选预发布。GitHub生成的Source code归档来自整个标签树，可能包含历史验收记录，用户下载应优先选择专门的ai-writer ZIP。GitHub流程依据见[官方发行文档](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository)。

Windows完整历史树含aux等保留路径，常规源码检出或自动Source code归档解压可能失败；维护者按[稀疏检出说明](https://github.com/dibyang/ai-writer/blob/codex/initial/docs/source-checkout.md)获取产品输入。CI使用同一排除范围，源码测试不依赖历史acceptance目录。
