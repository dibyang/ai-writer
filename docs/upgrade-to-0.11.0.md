# 已有小说、剧本安全升级到 0.11.0

适用对象：已有 `writer.json`、`.writer/state.json` 和随附工具的作品。小说与剧本使用同一套升级事务，升级不会自动填写人物卡、改写正文、补写场次或重新登记历史事实。

本文只提供操作步骤。当前“先不要修改现有作品”的要求不构成执行升级、迁移或恢复的授权；下述写入步骤须等作者明确指定作品目录并授权后执行。本指南未改动正式版标签或附件。

## 1. 先确定三个对象

每次只处理一个作品，使用绝对路径，串行操作。

| 对象 | 用途 |
| --- | --- |
| 原作品 `$Work` | 作者正在使用的小说或剧本根目录，不能误选工具源码库或其上级目录 |
| 固定新包 `$NewRoot` | 0.11.0 专用 ZIP 的独立解压目录，必须在原作品和被替换的 `.writer/tool` 之外；建议也放在任何 Git 仓库之外 |
| 备份、演练、审计目录 | 三者分别独立、全新，均在原作品之外；备份保持不动，演练只能操作另复制出的副本 |

下载 [v0.11.0 正式发行](https://github.com/dibyang/ai-writer/releases/tag/v0.11.0) 中的 `ai-writer-0.11.0.zip` 和 `SHA256SUMS.txt`。不要用 GitHub 自动生成的 Source code 归档替代专用 ZIP，不需要 clone 仓库、创建 worktree 或安装 npm 依赖。

本次正式包的身份：

- ZIP SHA256：`887897280c66bcb4a916474adbc7e81936420c845ff5e93b4a3bba5005923b09`
- 来源提交：`e6cb9694ca15e4d323e6c5919a6c1de3285a908a`，dirty=false。
- 受管内容 ID：`40bdb0e12028e9af339366610a669a441b6e2c3a9e9b1303c400253bd8231821`。

先用 `Get-FileHash -Algorithm SHA256 -LiteralPath <ZIP完整路径>` 核对，再解压到新目录。解压目录内应直接有 `package.json`、`build-manifest.json`、`RELEASE-MANIFEST.json` 和 `bin/`。需要 Node.js 20 或更高版本。

```powershell
# 示例路径，执行前逐项替换；不是对这些目录的实际操作授权。
$Work = 'D:/写作/某作品'
$NewRoot = 'D:/写作工具/ai-writer-0.11.0'
$Audit = 'E:/写作升级记录/某作品-本次升级'
$Backup = 'E:/写作备份/某作品-本次升级前'
$Trial = 'E:/写作演练/某作品-本次试升'
$NewEntry = Join-Path $NewRoot 'bin/ai-writer.mjs'
$OldEntry = Join-Path $Work '.writer/tool/bin/ai-writer.mjs'
Set-Location -LiteralPath $NewRoot

node --version
node $NewEntry --help
node $NewEntry doctor
node $NewEntry tool identify --project $NewRoot
```

确认新包完整、版本和身份正确。后续升级、恢复一直使用这个固定的外部 `$NewEntry`；不要在被替换的工具目录内执行更新。

命令示例应逐条执行并检查 `$LASTEXITCODE`，非零时先停止核查；PowerShell不会因为原生命令返回非零就自动终止整段脚本。不要把检查和写入拼成无条件执行的批处理。

## 2. 停止写入，做升级前只读检查

暂停该作品的其他 Codex 写作任务、脚本、编辑器自动保存和可能改动文件的同步任务。保存未落盘的稿件。不要为升级重新打开一个 Codex 项目或启用新的 Git 监视。

在作品外的审计目录保存每条命令、stdout、stderr 和退出码：

```powershell
node $NewEntry tool identify --project $Work
node $NewEntry tool updates --project $Work
node $NewEntry revision list --project $Work
node $OldEntry doctor --project $Work
node $OldEntry status --project $Work
node $OldEntry check --project $Work
```

若旧入口损坏、缺失或命令不受支持，停止并记录，不能用新版文件直接盖上去。可用固定外部入口继续只读诊断；旧版修订恢复的兼容边界见 [修订手册](revision-and-sources.md)。

通过标准：

- 确定这是主作品，不是 `.writer/revisions/.../workspace` 候选。
- 无活跃修订，无未完成的工具、修订或正文迁移事务，无来源漂移和工具身份损坏。
- 当前授权允许工具规划所需的 `plan` 操作；不擅自放宽正文或修订范围。
- 记录旧工具版本、状态 schema、业务 revision、tool generation、章节/场次登记数、当前阶段、未登记草稿和已有审查状态。

活跃修订应由原会话按作者选择完成或结束；不要自动 abort，不要换掉它绑定的旧包。发现遗留锁不能只凭“时间久了”或“PID查不到”就删锁。原有错误先记录、专项处理，不能为升级批量重登、刷新来源哈希或补成虚假的审查通过。

## 3. 完整备份，并确认能读回来

优先使用文件系统快照；普通文件复制也须在暂停写入后进行。备份至少完整保留：

- 正文、分卷目录、未登记草稿、大纲、设定、人物卡、研究和审查，以及自定义资料目录。
- `writer.json`、根 `AGENTS.md`、根 `.agents/`、作者定制手册和其他作品配置。
- **整个 `.writer/`**，包括旧工具、state、journal、来源对象、版本、修订区、事务、备份及恢复材料；不能只备份 `state.json`。
- 如需保留 Git 历史，一并备份实际版本库；若 `.git` 是指向外部位置的文件，普通目录复制不会连同外部版本库备份。升级不需要运行 Git。

备份目的地必须在原作品之外且不存在，不使用 `/MIR`、覆盖旧备份或清理命令。复制时包含隐藏文件。先检查链接/目录联接；发现后先确定其实际内容和备份方式，不能静默跳过后宣称完整。

可以使用文末的 Windows 备份示例。它会：核对作品标识、拒绝链接、记录所有文件的相对路径/长度/SHA256、复制到新目录，再比较“复制前源目录、备份、复制后源目录”三份清单。不启动 Git。清单和日志放在作品外；备份空间还应容纳演练副本和升级事务备份。

在备份的另一份副本上确认：隐藏目录齐全、旧工具可启动、旧状态可读取，正文和登记哈希一致。不要在唯一备份上直接试升，不把备份或副本加入新的 Codex 项目。不能成功读回时，先解决备份或可迁移性问题。

## 4. 在新副本演练，再为原作品单独规划

把已核验备份另复制为 `$Trial`，仍放在原作品和备份之外。以下先以 `$Trial` 为目标；原作品保持不动。不要修改副本中的 project_id、来源哈希或历史绑定来让检查通过。

计划选项 JSON 保存于 `$Audit`，替换 `source` 为新包的实际绝对路径：

```json
{
  "source": "D:/写作工具/ai-writer-0.11.0",
  "documents": [],
  "legacy_target_acknowledged": false,
  "validation_mode": "in-place-readonly"
}
```

```powershell
node $NewEntry tool update-plan --project $Trial --input "$Audit/trial-options.json"
```

这是只读计划。保存其完整 JSON，核对 `source.version`、来源内容 ID、目标版本、`blockers`、`local_content`、协议与验证模式。根 AGENTS、根技能和定制手册默认保留；首次安全升级保持 `documents: []`，不要顺便合并作者定制。

`in-place-readonly` 让升级验证读取原位置作品，不另复制正文到事务验证目录；它**不等于整个升级只读，也不能代替独立全量备份**。更新本身仍替换随附工具并写入受控状态和事务。内部讨论上下文验证上限固定为240000字符，超限会阻断，不能靠删除作者决策或截断追踪绕过。

### 按 schema 分流

| 当前状态 | 操作 |
| --- | --- |
| 6 | 无其他阻断时直接准备工具更新，不执行 enable |
| 7 | 保持7及原稳定卷目录；不再迁移正文目录、不降为6 |
| 5 | 另行明确授权 `tool enable`，先启用6，再重新生成更新计划 |
| 1–4 | 先制定并演练原有分步迁移：1/2→治理3→来源/修订保护4→review-workflow 5→tool enable 6；逐步备份、核验，不直接执行本节的更新 |

旧状态迁移是独立的写入操作，不能用这次工具版本升级暗中代办。原迁移说明见 [来源与修订](revision-and-sources.md) 和 [复核与登记](review-and-registration.md)。无清单旧包也要核实真实旧基线并另行明确接受；0.7.1起应有的清单丢失属于损坏，不能改成 `legacy_target_acknowledged: true` 绕过。

schema5计划允许出现预期的 `TOOL_PROTOCOL_REQUIRED`；除此以外的阻断须先处理。`tool enable` 输入用实际计划值准备：`expected_revision`、稳定且唯一的 `operation_id`、`source`、`expected_source_build_id`、`expected_target_build_id`、必要的旧基线接受选项及 `author_evidence`。明确授权并准备真实输入后，仅schema5执行 `node $NewEntry tool enable --project $Trial --input "$Audit/trial-enable.json"`。启用只改变协议保护，不安装新工具；保留 enable_id 和状态备份，之后必须重新 plan。

### 作者依据和实际更新

等作者明确授权后，Codex将真实授权原话保存到该目标作品内一个**全新的、未被旧章消费的本地来源文件**，不改已有设定或授权原件。先保留修改前备份，再记录这次新增文件和更新前基线，随后重新 plan。副本与原作品分别使用适用于各自范围的授权。

`author_evidence` 字段为：`quote`、`local_source`、`source_sha256`、`locator`、`recorded_by`。原话必须真的存在于该本地文件中，SHA256从实际字节读取；本页及当前“不要修改”的请求不能被当作升级许可。

从最终 `can_update: true` 的计划返回值中原样取 `request`，只补充真实 `author_evidence`，保存为UTF-8 JSON，再执行：

```powershell
node $NewEntry tool update --project $Trial --input "$Audit/trial-update.json"
```

不要手工猜测 revision、两端内容ID或 `plan_sha256`；不要修改 request 已生成的 operation_id，保留整份输入供同输入幂等重试。Windows PowerShell 5.1 默认UTF-8输出可能带BOM，JSON建议用无BOM编码保存，例如：

```powershell
[System.IO.File]::WriteAllText($JsonPath, $JsonText, [System.Text.UTF8Encoding]::new($false))
```

出现非零退出码时停止后续操作，先走第6节。不要反复生成新 operation_id 尝试撞过错误。

副本验证全部满足第5节后，才安排原作品升级窗口。再次停止原目录写入，确认其当前状态，再做新的完整备份/基线；在实际原目录重新 plan、准备独立输入并执行。**不要复用副本的请求，不要把试升后的 `.writer/` 或 state 复制回原作品。**

## 5. 验证通过后再恢复使用

对刚升级的目标，启动新命令进程，从它自己的随附入口检查：

```powershell
# 演练时 Target=Trial；原作品正式升级时才使用 Work。
$Target = $Trial
$InstalledEntry = Join-Path $Target '.writer/tool/bin/ai-writer.mjs'
node $InstalledEntry --help
node $InstalledEntry doctor --project $Target
node $InstalledEntry status --project $Target
node $InstalledEntry check --project $Target
node $InstalledEntry context --project $Target --purpose discussion --max-chars 240000
node $NewEntry tool updates --project $Target
node $NewEntry revision list --project $Target
node $InstalledEntry export --project $Target --out "$Audit/export-after"
```

导出目标必须是作品外的新目录。导出只覆盖已登记稿件，不代表未登记草稿也已经验证。上述检查不用 `record`、`review` 登记、重新授权或续写正文。

逐项核验并写报告到 `$Audit`：

1. 实装版本为0.11.0，doctor有效，工具及受管资源身份一致；无pending、冲突或仍持有的更新锁。
2. 对原schema6/7的工具更新，schema不变、原有登记 units 和事实 snapshot 不变；正文与未登记草稿的实际文件SHA256不变，旧source_hashes/消费绑定不被追认或重写。协议迁移另按其预期新增元数据核验，不能混为字节完全不变。
3. 以“启用/迁移完毕、紧邻工具更新前”的基线比较，成功更新只推进一次业务revision和tool generation；不要求整个state文件SHA不变，因为它正常记录了工具更新事件。
4. 根AGENTS、根`.agents/skills`、作者定制手册、人物/架构资料和原稳定章节/场次路径保持。新技能和手册从doctor返回的`skill_root`、`content_root`读取；这些通常在`.writer/tool`内。
5. Codex实际读取新工具的writer-project，再按文体读取writer-novel或writer-screenplay，以及writer-review；核对人物底色、关系、知情/物品/伤情/承诺等既有材料仍能进入讨论上下文。完整性校验不等于模型已经读过技能。
6. 若原授权及既有计划允许，只读获取原定下一章/场的context，检查承接；不为测试新增计划或扩大正文授权。没有下一单元计划/授权时明确记为未覆盖，在下一次实际获授权创作时再验证。
7. 在原授权内抽查代表章节或相邻场次，将审查意见写在外部审计目录；不注册新的业务审查记录来制造通过。可做升级前后两次导出比对，已登记正文应相同，工具版本等说明性元数据可能不同。

升级后旧context、旧record输入已经过期，应重新获取；不能继续用升级前模板写入。旧根技能/手册因保护作者定制可能保持旧版，不能只看文件在就认为读到了0.11.0。

通过的是这一个作品的升级。小说与剧本分别备份、演练、验收，不把一个项目成功当作另一个也已完成。

## 6. 失败时如何处理

### A. 计划阶段阻断或验证未通过

停止，不覆盖工具、不改state，不自动删除备份或失败候选。常见阻断：活跃修订、未完成事务、来源漂移、授权不符、工具模块定制/损坏、选中的手册被定制或已被章节消费、旧协议尚未启用、讨论上下文超限。

先保存错误码、双流和计划，核对原状态及文件身份。按实际原因处理；不能刷新哈希、重建清单或扩大授权来消除报错。对定制工具需要专门评估合并方式，不强行安装。

### B. `tool updates` 显示 `pre-transaction-candidate`

说明候选已建立但工具更新事务尚未正式发布，不等于工具已升级。核对旧工具/状态仍为原字节，保留候选。如果仅遗留写锁，在核实原进程已结束、实际锁SHA和明确恢复依据后，按既有 `revision unlock` 流程处理，再重新 plan；有活跃修订时还需原id/token。不要虚构事务ID调用 recover，也不要直接删锁。

### C. 已有未完成 `tool-update` 事务

从固定外部0.11.0入口检查：

```powershell
node $NewEntry tool updates --project $Target
node $NewEntry tool recover --project $Target --input "$Audit/recovery.json"
```

由Codex从真实记录准备 `recovery.json`：`transaction_id`（工具更新事务ID）、`direction`（`complete`继续完成或`rollback`退回该次更新前）、真实 `author_evidence`。存在遗留锁时另填真实 `lock_sha256`，并核实原进程已结束；不能仅凭PID缺失/超时强行处理。执行哪个方向由作者明确选择，不能把选项写死为无条件回滚。

恢复遇到第三方修改会停止并保留旧、新和外部版本。不要用备份覆盖这些新字节；先做三方核对。恢复再次中断时，仍按同一事务、当前实际锁和明确方向继续，不需重新enable或重新计划更新。终态同方向重试可幂等，不能反向回填。

rollback只退回**该次工具更新前**。若前面另做过schema5→6启用，回滚不会顺便恢复成5，旧0.6入口可能仍读不了；此时用外部入口检查。`tool undo-enable`只在精确等于启用后原状态、generation仍为0且没有后续业务写入等条件下适用，须另行授权，不能手改schema。

修订事务、正文迁移事务分别使用它们自己的 `revision recover`、`draft relocate-recover`，不能用 `tool recover`混着恢复。

### D. 更新已成功，但想撤销或已出现新稿

已完成的更新不能再调用 `tool recover rollback`。可以另行规划兼容的工具更新，只有旧来源支持当前状态且计划无阻断时才可执行；不保证0.11.0能够直接降到0.10.0，不混装文件绕过移除/协议保护。

若必须用全量备份恢复：先封存当前故障目录，确认所有新增稿件、设定、审查和追踪已另存，再在作者授权下以完整备份恢复到原绝对路径；不要在原目录上叠加覆盖出新旧混包。恢复到不同路径还要单独核查路径绑定。已有新稿时不能只回填旧state或简单把正文贴回去，需另行制定稿件与追踪的保留/合并方案。恢复后重新执行第5节检查，保留原故障目录和备份。

## 7. 最后保存什么

至少保留：正式ZIP及SHA清单；原工具与状态身份；全量备份、三份文件清单；副本/原目录各自的计划与原输入、作者依据；迁移和enable记录；更新/恢复事务ID；命令双流与退出码；前后正文、追踪、作者定制比较；最终检查/导出及未覆盖项。令牌等恢复材料按作品私有资料保存，不自动上传。

不要在作品或大型工具源码库中运行全套npm测试、Git全量状态扫描或故障注入。产品发布验证不能替代本作品验收，本作品升级验收也不等于文学定稿。

## 附：Windows普通文件备份示例

只在原作品已暂停写入、路径已核对且将来获得备份授权后执行。此例不保留ACL等系统级权限快照；需要这些时使用相应文件系统备份。清单中的链接会停止复制，先人工明确备份方式。

```powershell
$ErrorActionPreference = 'Stop'
# Work、Audit、Backup用前文核对后的绝对路径；Backup必须全新。
if (!(Test-Path -LiteralPath (Join-Path $Work 'writer.json')) -or
    !(Test-Path -LiteralPath (Join-Path $Work '.writer/state.json'))) {
  throw '目标不是已核实的作品目录。'
}
if (Test-Path -LiteralPath $Backup) { throw '不覆盖已有备份。' }

function Test-Inside([string]$Base, [string]$Candidate) {
  $b = [IO.Path]::GetFullPath($Base).TrimEnd([char[]]'\/')
  $c = [IO.Path]::GetFullPath($Candidate).TrimEnd([char[]]'\/')
  return $c.Equals($b, [StringComparison]::OrdinalIgnoreCase) -or
    $c.StartsWith($b + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)
}
foreach ($outside in @($Backup, $Audit)) {
  if ((Test-Inside $Work $outside) -or (Test-Inside $outside $Work)) {
    throw '作品、备份和审计路径不得相互包含。'
  }
}
if ((Test-Inside $Backup $Audit) -or (Test-Inside $Audit $Backup)) {
  throw '备份与审计路径也不得相互包含。'
}
# 目的地的现有祖先目录也应人工确认没有目录联接或重定向。
$BackupAudit = Join-Path $Audit 'backup-check'
if (Test-Path -LiteralPath $BackupAudit) { throw '本次备份清单目录已存在，不覆盖。' }
if (!(Test-Path -LiteralPath $Audit)) { New-Item -ItemType Directory -Path $Audit | Out-Null }
New-Item -ItemType Directory -Path $BackupAudit | Out-Null

function Get-BackupInventory([string]$Root) {
  $base = (Get-Item -Force -LiteralPath $Root).FullName.TrimEnd([char[]]'\/')
  $stack = [Collections.Generic.Stack[string]]::new()
  $rows = [Collections.Generic.List[object]]::new()
  $stack.Push($base)
  while ($stack.Count -gt 0) {
    $dir = $stack.Pop()
    if ((Get-Item -Force -LiteralPath $dir).Attributes -band [IO.FileAttributes]::ReparsePoint) {
      throw "先核查链接目录：$dir"
    }
    foreach ($entry in Get-ChildItem -Force -LiteralPath $dir) {
      if ($entry.Attributes -band [IO.FileAttributes]::ReparsePoint) { throw "先核查链接：$($entry.FullName)" }
      if ($entry.PSIsContainer) { $stack.Push($entry.FullName); continue }
      $rows.Add([pscustomobject]@{
        path = $entry.FullName.Substring($base.Length + 1)
        bytes = $entry.Length
        sha256 = (Get-FileHash -LiteralPath $entry.FullName -Algorithm SHA256).Hash.ToLowerInvariant()
      })
    }
  }
  return $rows | Sort-Object path
}

$before = @(Get-BackupInventory $Work)
robocopy $Work $Backup /E /COPY:DAT /DCOPY:DAT /XJ /R:1 /W:1 /NP "/LOG:$BackupAudit/backup-copy.log"
$copyExit = $LASTEXITCODE
if ($copyExit -lt 0 -or $copyExit -ge 8) { throw "复制失败，保留候选和日志，退出码：$copyExit" }
$backupRows = @(Get-BackupInventory $Backup)
$after = @(Get-BackupInventory $Work)
$utf8 = [Text.UTF8Encoding]::new($false)
foreach ($item in @(@('source-before', $before), @('backup', $backupRows), @('source-after', $after))) {
  [IO.File]::WriteAllText((Join-Path $BackupAudit ($item[0] + '.json')), ($item[1] | ConvertTo-Json -Depth 8), $utf8)
}
if (@(Compare-Object $before $backupRows -Property path,bytes,sha256).Count -gt 0 -or
    @(Compare-Object $before $after -Property path,bytes,sha256).Count -gt 0) {
  throw '备份不一致或源目录在复制期间有变化：停止，不删除失败材料。'
}
Write-Output "备份文件校验通过：$($before.Count)个文件；随后在另一副本验证旧入口和状态。"
```

普通复制和哈希比较不能提供原子快照保证；持续写入的项目应先真正静止或使用文件系统快照。备份示例不执行任何升级。
