# Story Gate Studio 客户安装与验收说明

## 阶段设计

P3 的目标是验证客户拿到版本化 zip 后，不依赖源仓库上下文，也能完成解压、自检和基础命令验收。P4 起当前 zip 名称为 `story-gate-studio-v0.1.0-private-commercial-trial.zip`。

| 项目 | 设计 |
| --- | --- |
| 阶段 | P3 外部安装验收 |
| 输入 | `story-gate-studio-v0.1.0-private-commercial-trial.zip`、`SHA256SUMS.txt` |
| 安装对象 | Codex 本地插件目录或客户指定试用目录 |
| 验收入口 | `node scripts/story-gate.js customer-install-smoke` |
| 核心约束 | 不读取源仓库、不依赖项目私有规则包、不写入插件目录外的客户稿件 |
| 成功标准 | 解压后的插件目录能运行 `private-package-check`、`validate` 和基础 CLI smoke |

## 非目标

- 不自动点击 Codex UI 安装按钮。
- 不写入客户全局 marketplace。
- 不要求客户提供真实小说正文。
- 不测试付费授权服务器或公开插件市场。

## 客户安装步骤

推荐使用一键安装命令。先解压 `story-gate-studio-v0.1.0-private-commercial-trial.zip`，进入解压后的插件目录，然后运行：

```powershell
cd /d D:\work\小说\cayyl\story-gate-deliverables\story-gate-studio-private-commercial-trial
node scripts/story-gate.js install-local --project D:\work\小说\new-project --name new-project
```

Windows `cmd.exe` 从 `C:` 盘进入 `D:` 盘目录时要使用 `cd /d`；如果仍在 `C:\Users\admin>`，说明当前盘符没有切过去。

命令会把插件安装到目标项目的 `plugins/story-gate-studio/`，创建 `.agents/plugins/marketplace.json`，并初始化 `story-gate-projects/new-project/rule-pack.json`。如果目标项目已有安装，需要确认覆盖时再加 `--force`。

1. 解压 `story-gate-studio-v0.1.0-private-commercial-trial.zip`。
2. 进入解压后的 `story-gate-studio-private-commercial-trial/` 目录。
3. 运行：

```powershell
node scripts/story-gate.js customer-install-smoke --full
```

基础 smoke 通过后，再运行完整门禁：

```powershell
node scripts/story-gate.js validate
node --test tests/*.test.js
```

## 从 zip 直接验收

如果客户希望先在临时目录验证 zip，可以从任意目录运行：

```powershell
node <extracted-or-source>/scripts/customer-install-smoke.js --zip story-gate-studio-v0.1.0-private-commercial-trial.zip --extract-to ./tmp-story-gate-check --full
```

该命令会：

1. 解压 zip 到 `--extract-to` 指定目录。
2. 自动定位解压后的插件根目录。
3. 检查 `.codex-plugin/plugin.json`、`docs/customer-install.md` 和 `scripts/story-gate.js`。
4. 运行基础 CLI smoke。
5. 在 `--full` 模式下运行 `private-package-check`、`validate` 和 `node --test tests/*.test.js`。

## 失败处理

| 失败位置 | 处理方式 |
| --- | --- |
| zip 无法打开 | 重新下载交付包，并用 `SHA256SUMS.txt` 校验 zip |
| 找不到 `plugin.json` | 确认解压后保留了顶层目录，不要只复制部分文件 |
| `private-package-check` 失败 | 说明交付包内容被改动或缺文件，重新使用原始 zip |
| `validate` 失败 | 保留终端输出，作为售后定位依据 |
| `node --test` 失败 | 不要继续安装到正式工作环境，先反馈测试输出 |

## 验收记录模板

| 字段 | 填写 |
| --- | --- |
| 客户/试用方 | 待填写 |
| zip 文件 | `story-gate-studio-v0.1.0-private-commercial-trial.zip` |
| zip SHA256 | 从 `SHA256SUMS.txt` 复制 |
| 安装目录 | 待填写 |
| `customer-install-smoke` | pass / fail |
| `validate` | pass / fail |
| `node --test` | pass / fail |
| 问题记录 | 待填写 |
