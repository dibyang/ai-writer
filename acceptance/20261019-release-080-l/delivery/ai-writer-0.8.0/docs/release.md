# 首次正式发行：0.8.0

本页是维护者的本地准备流程，不自动创建标签、推送或发布。用户批准具体产物后，再执行对应Git和GitHub动作。

## 首发版本身份

首个正式版本按作者要求统一为0.8.0。历史0.8.0和0.8.1候选保持封存记录；正式包通过`package.json`中的`aiWriter.resourceProfile=apache-2.0-v1`识别65项受管资源。版本号相同不表示内容相同，比较以内容ID、资源配置与清单为准。

## 构建与验证

```powershell
npm run release:build -- --out dist/0.8.0
```

输出目录必须不存在。构建器按`release/distribution.json`的明确文件清单复制，拒绝不安全路径、重复路径、符号链接和覆盖已有产物；根README使用`release/README.md`作为下载包入口。不会扫描或打包作品、验收目录、.git、.idea或临时目录。失败时保留临时构建目录供诊断，不自动删除或覆盖。

产物包括`ai-writer-0.8.0.zip`、`SHA256SUMS.txt`、`release-manifest.json`、`RELEASE_NOTES.md`和便于检查的展开目录。ZIP使用固定条目时间；同一输入、同一来源状态下可复现。清单记录实际来源Git提交与dirty状态，不把未提交目录称为已打标签源码。包内`build-manifest.json`绑定受管资源；`RELEASE-MANIFEST.json`记录载荷哈希，外部SHA绑定最终ZIP。

以最终ZIP解压到新目录后，运行npm test、npm run doctor、npm run test:engine和真实CLI流程；核对隐藏技能、中文路径、来源许可、旧候选更新、幂等及暂停门禁。验证数据放在包外，保持下载资产原始哈希。Windows环境跳过不能算通过，也不能代替未取得结果的跨系统CI。

## 正式发布前最后一步

核对具体提交、发布说明、ZIP SHA及对应验证记录；完成用户授权的提交后，从选定提交重新构建并核验产物来源，再创建v0.8.0标签、上传附件和发布。不要移动已有标签，不覆盖同名发布资产。准备时没有已存在的正式标签。

建议先保存GitHub Release草稿并附齐ZIP、SHA和发布说明，再在授权后发布为正式版本；不勾选预发布。GitHub生成的Source code归档来自整个标签树，可能包含历史验收记录，用户下载应优先选择专门的ai-writer ZIP。GitHub流程依据见[官方发行文档](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository)。
