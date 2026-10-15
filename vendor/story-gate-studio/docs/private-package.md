# Story Gate Studio 私有商业包交付说明

## 交付定位

`story-gate-studio` v0.1 私有商业包用于付费试用、工作室内部交付或客户评估。第一版按 Codex 本地插件交付，不依赖公开插件市场，也不绑定任何单一小说项目。

## 交付内容

交付包以 `references/private-package-manifest.json` 为准，至少包含：

- `.codex-plugin/plugin.json`
- `skills/`
- `references/`
- `scripts/`
- `tests/`
- `examples/`
- `docs/quickstart.md`
- `docs/help.md`
- `docs/private-package.md`
- `docs/traceability.md`
- `README.md`
- `LICENSE.md`
- `marketplace.private.example.json`
- `package.json`

## 不交付内容

私有商业包不得包含：

- 源项目正文、卷纲、人物表、案名、物证链或终局设定
- 源项目视觉资产、短剧成片、未授权图片或提示词原稿
- 客户稿件、第三方审稿原文或未脱敏反馈
- `node_modules/`、`.tmp-pydeps/`、`dist/` 等临时构建或依赖目录
- `story-gate-projects/` 这类项目私有规则包目录

项目私有规则只能作为外部 `project_rule_pack` 使用，不得写入通用 `references/rule-pack.json`。

## 安装后验收

在插件目录运行：

```powershell
node scripts/story-gate.js private-package-check
node scripts/story-gate.js release-check
node scripts/story-gate.js build-private-package --out ../../story-gate-deliverables/story-gate-studio-private-commercial-trial
node scripts/story-gate.js build-release-archive --package-dir ../../story-gate-deliverables/story-gate-studio-private-commercial-trial --out-dir ../../story-gate-deliverables --force
node scripts/story-gate.js release-check --checksums ../../story-gate-deliverables/SHA256SUMS.txt
node scripts/story-gate.js validate
node --test tests/*.test.js
```

影响 manifest、skills 或 marketplace 时，还需要运行 Codex 插件校验器：

```powershell
python validate_plugin.py <plugin-path>
```

验收全部通过后，才可以把该目录压缩、放入私有 Git 仓库，或通过私有 marketplace 交付。

`build-private-package` 默认拒绝把产物写入插件根目录内部，避免 `dist/`、临时依赖或构建输出污染下一次交付验收。

归档交付时同时发送：

- `story-gate-studio-v0.1.0-private-commercial-trial.zip`
- `SHA256SUMS.txt`

购买者或试用客户可用 `SHA256SUMS.txt` 核对 zip 和包内文件是否与交付版本一致。P4 起归档名必须与 `references/release-manifest.json` 一致。

## 销售边界

可以销售的是写作工作流、规则结构、门禁脚本、匿名 fixture、安装说明和质量保证体系。不得销售源项目素材、未授权第三方反馈、平台官方背书或爆款保证。
