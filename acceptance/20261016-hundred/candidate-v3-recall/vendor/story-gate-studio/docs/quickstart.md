# Story Gate Studio 快速入门

## 最简单安装方式

在拿到插件目录或解压后的交付包后，可以用一条命令把插件安装到另一个 Codex 项目：

```powershell
cd /d <插件目录>
node scripts/story-gate.js install-local --project D:\work\小说\new-project --name new-project
```

如果在 Windows `cmd.exe` 里从 `C:` 盘切到 `D:` 盘，必须使用 `cd /d`。也可以不切目录，直接使用绝对路径：

```powershell
node D:\work\小说\cayyl\story-gate-deliverables\story-gate-studio-private-commercial-trial\scripts\story-gate.js install-local --project D:\work\小说\new-project --name new-project
```

这条命令会自动完成：

- 复制插件到 `<新项目>\plugins\story-gate-studio`
- 创建或更新 `<新项目>\.agents\plugins\marketplace.json`
- 初始化 `<新项目>\story-gate-projects\<项目名>\rule-pack.json`
- 运行基础安装 smoke，确认插件能启动

如果目标项目已经安装过插件，命令会拒绝覆盖；确认要替换时再加：

```powershell
node scripts/story-gate.js install-local --project D:\work\小说\new-project --name new-project --force
```

只安装插件、不初始化项目规则包：

```powershell
node scripts/story-gate.js install-local --project D:\work\小说\new-project --skip-rule-pack
```

安装完成后，在 Codex 插件界面选择该项目的 `.agents/plugins/marketplace.json`，安装 `story-gate-studio` 即可。

## 适用范围

第一版面向 Codex 本地插件试用。插件代码、文档、fixture、测试和质量门禁都独立放在 `plugins/story-gate-studio/`，不依赖当前小说正文，也不会把当前小说的私有设定打包进插件。

## 安装方式

仓库已经提供本地 marketplace 索引：

```text
.agents/plugins/marketplace.json
```

索引指向：

```text
./plugins/story-gate-studio
```

在 Codex 插件界面中选择这个 marketplace 后，即可安装 `story-gate-studio`。如果只想先验证命令行能力，可以直接进入插件目录运行脚本。

## 命令行冒烟

```powershell
cd plugins/story-gate-studio
node scripts/story-gate.js --help
node scripts/story-gate.js tasks
node scripts/story-gate.js validate
node scripts/story-gate.js release-check
node scripts/story-gate.js private-package-check
node scripts/story-gate.js commercial-readiness-check
node scripts/story-gate.js customer-pilot --project examples/customer-pilot
node scripts/story-gate.js support-bundle --project examples/customer-pilot --dry-run
node scripts/story-gate.js chapter-gate examples/fixtures/chapter-gate-pass.json
node scripts/story-gate.js chapter-gate examples/fixtures/chapter-gate-block.json
node scripts/story-gate.js chapter-gate examples/fixtures/chapter-gate-physical-block.json
node scripts/story-gate.js chapter-gate examples/fixtures/chapter-gate-physical-vague-block.json
node scripts/story-gate.js chapter-gate examples/fixtures/chapter-gate-small-object-action-block.json
node scripts/story-gate.js chapter-gate examples/fixtures/chapter-gate-object-continuity-block.json
node scripts/story-gate.js chapter-gate examples/fixtures/chapter-gate-dual-body-continuity-block.json
node scripts/story-gate.js chapter-gate examples/fixtures/chapter-gate-observed-fact-rewrite-block.json
node scripts/story-gate.js chapter-gate examples/fixtures/chapter-gate-cross-artifact-lifecycle-block.json
node scripts/story-gate.js blind-read-gate examples/fixtures/blind-read-pass.json
node scripts/story-gate.js blind-read-gate examples/fixtures/blind-read-isolation-block.json
node scripts/story-gate.js blind-read-gate examples/fixtures/blind-read-context-leak-block.json
node scripts/story-gate.js blind-read-gate examples/fixtures/blind-read-average-mask-block.json
node scripts/story-gate.js blind-read-gate examples/fixtures/blind-read-continuous-block.json
node scripts/story-gate.js review-scorecard examples/fixtures/review-scorecard-pass.md
node scripts/story-gate.js host-run examples/host-adapter/review-scorecard-request.json
node scripts/story-gate.js visual-selected examples/fixtures/visual-selected-block.json
```

`chapter-gate-pass.json` 应输出 `verdict: "pass"`；`chapter-gate-block.json` 应输出 `verdict: "blocked"` 并返回非零退出码，方便 CI 或脚本拦截。

## 在 Codex 中使用

安装后可以直接触发对应 skill：

```text
使用 story-gate-studio 的 chapter-workbench，帮我检查这一章开写前是否通过门禁。
```

```text
使用 story-gate-studio 的 release-gate，按发布前门禁审核这些章节。
```

```text
使用 story-gate-studio 的 third-party-review，按盲读规则审核这轮单章/连续盲读票据是否有效。
```

```text
使用 story-gate-studio 的 visual-asset-manager，检查这个视觉资产能否进入 selected。
```

## 第一版能力

- 小说架构：`story-architect`
- 章节开写门禁：`chapter-workbench` + `scripts/chapter-gate.js`
- 第三方冷读审核：`third-party-review`
- 单章/连续盲读审核：`blind-read-gate`
- 外部意见裁决：`feedback-triage`
- 发布门禁：`release-gate`
- 爆款追读复审：`blockbuster-review`
- 核心审核评分卡：`review-scorecard`
- 多 host JSON 入口：`host-run`
- 商业就绪门禁：`commercial-readiness-check`
- 客户试点闭环：`customer-pilot`
- 售后诊断包：`support-bundle`
- 视觉资产入库门禁：`visual-asset-manager`
- 短剧试制包：`screenplay-adapter`

## 质量保证

每次改动至少运行：

```powershell
node scripts/run-quality-gates.js
node --test tests/*.test.js
```

影响 manifest、skills 或 marketplace 时，还需要运行 Codex 插件校验器 `validate_plugin.py`。

准备交付给外部试用或客户评估时，还必须运行：

```powershell
node scripts/story-gate.js private-package-check
node scripts/story-gate.js release-check
node scripts/story-gate.js customer-install-smoke --full
node scripts/story-gate.js build-private-package --out ../../story-gate-deliverables/story-gate-studio-private-commercial-trial
node scripts/story-gate.js build-release-archive --package-dir ../../story-gate-deliverables/story-gate-studio-private-commercial-trial --out-dir ../../story-gate-deliverables --force
node scripts/story-gate.js release-check --checksums ../../story-gate-deliverables/SHA256SUMS.txt
```

`private-package-check` 会读取 `references/private-package-manifest.json`，检查交付文件清单、禁止目录、私有标记扫描和安装后 smoke 命令。`build-private-package` 会按同一份清单复制可交付文件，并在产物目录内立即执行验收。`build-release-archive` 会先验收交付目录，再生成 zip 与 `SHA256SUMS.txt`。

P4 起默认 zip 名称为 `story-gate-studio-v0.1.0-private-commercial-trial.zip`，版本号由 `references/release-manifest.json` 约束。客户拿到 zip 后，可参考 `docs/customer-install.md`，或直接运行 `customer-install-smoke --zip <zip> --extract-to <dir> --full` 做解压自检。

## 私有项目规则包

通用插件不打包具体小说设定。项目私有规则应放在插件外，例如本仓库的：

```text
story-gate-projects/cayyl/rule-pack.json
```

校验方式：

```powershell
node scripts/story-gate.js project-rule-check ../../story-gate-projects/cayyl/rule-pack.json
```

初始化新客户项目规则包：

```powershell
node scripts/story-gate.js init-project-rule-pack --out ../../story-gate-projects/sample-customer --name sample-customer
node scripts/story-gate.js project-rule-check ../../story-gate-projects/sample-customer
```

初始化命令会拒绝把客户规则包写进插件根目录，避免私有设定污染通用商业包。

匿名示例校验：

```powershell
node scripts/story-gate.js project-rule-check examples/project-rule-packs/sample-project-rule-pack.json
node scripts/story-gate.js chapter-batch-metrics examples/fixtures/chapter-batch-metrics-sample.md
```

匿名终局活人代价样例校验：

```powershell
node scripts/story-gate.js chapter-batch-metrics examples/final-arc-live-cost/chapter-01.md examples/final-arc-live-cost/chapter-02.md examples/final-arc-live-cost/chapter-03.md
```

该样例只保留“证据可救一人但会伤及活人”“责任位置代替私有姓名”“终局必须改变主角权限或下一步行动”等可复用结构，不包含当前小说的人名、案名、物证链或终局设定。
