# 首次正式发行：0.8.0

0.8.0已于2026-10-19[正式发布](https://github.com/dibyang/ai-writer/releases/tag/v0.8.0)，标签绑定`27a20edd`，完整执行与验证见[M轮记录](../acceptance/20261019-release-publish-m/README.md)。下文保留维护者操作流程；发布后补交的记录不移动标签，也不覆盖已验证资产。

本页是维护者的本地准备流程，不自动创建标签、推送或发布。用户批准具体产物后，再执行对应Git和GitHub动作。

## 首发版本身份

首个正式版本按作者要求统一为0.8.0。历史0.8.0和0.8.1候选保持封存记录；正式包通过`package.json`中的`aiWriter.resourceProfile=apache-2.0-v1`识别65项受管资源。版本号相同不表示内容相同，比较以内容ID、资源配置与清单为准。

## 构建与验证

```powershell
npm run release:build -- --out dist/0.8.0
```

输出目录必须不存在。构建器按`release/distribution.json`的明确文件清单复制，拒绝不安全路径、重复路径、符号链接和覆盖已有产物；根README使用`release/README.md`作为下载包入口。不会扫描或打包作品、验收目录、.git、.idea或临时目录。失败时保留临时构建目录供诊断，不自动删除或覆盖。

历史来源审计索引以`docs/oh-story-reference-inventory.json`镜像随源码包携带，只包含公开参考仓库的文件元数据，与原审计清单的SHA一致；回归不依赖未分发的验收目录。Git来源只在当前目录确为仓库根时记录，不借用父仓库；暂时读取失败会停止构建，不把不确定状态悄悄写成另一份成功产物。

产物包括`ai-writer-0.8.0.zip`、`SHA256SUMS.txt`、`release-manifest.json`、`RELEASE_NOTES.md`和便于检查的展开目录。ZIP使用固定条目时间；同一输入、同一来源状态下可复现。清单记录实际来源Git提交与dirty状态，不把未提交目录称为已打标签源码。包内`build-manifest.json`绑定受管资源；`RELEASE-MANIFEST.json`记录载荷哈希，外部SHA绑定最终ZIP。

以最终ZIP解压到新目录后，运行npm test、npm run doctor、npm run test:engine和真实CLI流程；核对隐藏技能、中文路径、来源许可、旧候选更新、幂等及暂停门禁。验证数据放在包外，保持下载资产原始哈希。Windows环境跳过不能算通过，也不能代替未取得结果的跨系统CI。

## 正式发布前最后一步

核对具体提交、发布说明、ZIP SHA及对应验证记录；完成用户授权的提交后，从选定提交重新构建并核验产物来源，再创建v0.8.0标签、上传附件和发布。不要移动已有标签，不覆盖同名发布资产。准备时没有已存在的正式标签。

建议先保存GitHub Release草稿并附齐ZIP、SHA和发布说明，再在授权后发布为正式版本；不勾选预发布。GitHub生成的Source code归档来自整个标签树，可能包含历史验收记录，用户下载应优先选择专门的ai-writer ZIP。GitHub流程依据见[官方发行文档](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository)。

Windows完整历史树含aux等保留路径，常规源码检出或自动Source code归档解压可能失败；维护者按[稀疏检出说明](https://github.com/dibyang/ai-writer/blob/codex/initial/docs/source-checkout.md)获取产品输入。CI使用同一排除范围，源码测试不依赖历史acceptance目录。
