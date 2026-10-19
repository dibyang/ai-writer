# 0.7.3既有事务兼容恢复交接（已验证，可由源会话执行）

2026-10-19。仅处理本次目录外固定依赖缺陷；没有在真实小说执行恢复、替换工具或改正文，没有Git提交或推送。真实恢复由arch会话按既有用户授权执行。本交接不要求等待H轮百章后续实跑。

## 冻结入口及指纹

入口：`D:/work/other/ai-writer/acceptance/20261019-dependency-recovery-i/sources/repair-0.7.6/bin/ai-writer.mjs`

|字段|实际值|
|---|---|
|版本|0.7.6|
|受管资源|61|
|content_id|d286519332c6c0e6b5a93860a2f238433aae5e675f6509af6adea0697a87ac14|
|runtime_id|55485270a860f9ad9a8066c6937708f6c1e2e1df638b20ffa9e8d0136d25f89b|
|RUNTIME_FILES顺序守卫|84d2b34eb04da5e67de6d8715e5e766b5599de838fe47f3b5c33e84d14dbb22e|
|入口文件SHA256|23c9d66254bceec377c348dcaa3e0c12160526d44771ef9302318fc1b3a4986b|
|输入生成器SHA256|c0b40bec2c96be789d522116462d4929796aa7a444097a213939a6a1c286905c|

全资源清单：[source-build.json](source-build.json)。核整个目录内容，不只核小入口文件。可只读运行`node 冻结入口 tool identify`，不要加project来代替冻结来源识别。runtime_id、内容ID和旧会话build_id不是同一命名空间；不得把新ID写入旧会话或state。

## 已实际验证

- 旧0.7.3真实完整副本，complete/rollback都复现TRANSACTION_CORRUPT，63目标均保持before；legacy案例的ok表示成功复现预期拒绝，非恢复成功。
- 同一原prepared事务，从外部冻结0.7.6入口complete：r67、6章、session committed、transaction completed，全部63目标为after，重复同输入unchanged。
- 另完整副本rollback：r66、6章、session interrupted、transaction rolled-back，全部63目标为before，重复同输入unchanged。
- 两个副本在前62目标已替换、state尚未替换时实际进程中断，再以死PID/锁SHA/明确副本测试授权分别complete、rollback，结果均正确且幂等。
- 四个修复副本保留原0.7.3工具62文件、base/prepare/plan指纹及全部旧新备份；旧随附0.7.3的check均通过。没有安装或升级目标工具，generation仍1、schema仍6。
- 正常提交及规划引用复制、未固定新来源拒绝、非消费同目录文件/未准备受管文件/工具保留区/重复含Windows大小写别名目标拒绝均由回归覆盖。
- npm test：162项，161通过、0失败、1项当前Windows无法创建符号链接而跳过；npm run doctor通过。测试后主源码与冻结61资源完全一致。

结果：[verification.json](verification.json)、[input-helper-verification.json](input-helper-verification.json)。实稿副本和含令牌原始输入只在本机被Git忽略的private-copies；公开摘要不含令牌。2026-10-19 05:34 UTC核真实源仍r66/prepared、全部63目标before，原工具/基线/准备/事务未变；执行前仍应重新核现场。

## 当前事务边界

作品：`D:/work/小说/dzkxqxx`

会话：`6780be6f-bc03-46da-bcf9-03318cd8687d`

事务：`3e07940c-1cd7-4a49-82a9-b3e68cb800eb`

|原固定证据|SHA256|
|---|---|
|base.json|b380544843d7291968949c69d7fa3bd9a586d832391ccb9583af6aa377da17de|
|prepared.json|6bb84eec177d0a750750a6c393bebe514ca1b59db400412c9f9dfdd1171f1c48|
|JSON.stringify(tx.plan)|e6d0e115ae0381ce146ba2cfec7dbdff0ec17a7718bc8f6f6e78da5e1761aa21|

本修复按原base-state中真实消费/规划引用且base.extra/files已固定的文件授权目录外目标，并核原prepared.changes/target_state和备份。人物/陆承安.md、架构/00-世界架构总纲.md因此可按原63目标恢复；没有开放整目录或给旧事务追加三份未固定的伴随人物卡。

## 推荐complete：继续本次已授权改名

下面由持有令牌的源会话执行。本会话未在真实路径运行这些写入。输入生成器只新建本次drafts下的JSON，验证原证据、全部目标/备份/旧工具及无遗留锁，不恢复、不改清单、不打印令牌；已有同名输入不会覆盖。生成器已在完整副本实际验证两种方向。

```powershell
$repairEntry = 'D:/work/other/ai-writer/acceptance/20261019-dependency-recovery-i/sources/repair-0.7.6/bin/ai-writer.mjs'
$requestMaker = 'D:/work/other/ai-writer/acceptance/20261019-dependency-recovery-i/make-recovery-request.mjs'
$bookPath = 'D:/work/小说/dzkxqxx'
$requestFile = Join-Path $bookPath '.writer/drafts/rename-yang-20261019/recover-compatible-complete-076.json'
node $repairEntry tool identify
if ($LASTEXITCODE -ne 0) { throw '冻结入口识别失败，停止' }
node $repairEntry revision list --project $bookPath
if ($LASTEXITCODE -ne 0) { throw '事务只读盘点失败，停止' }
node $requestMaker $bookPath complete $requestFile
if ($LASTEXITCODE -ne 0) { throw '现场证据不符或有锁，停止，不改基线/清单' }
node $repairEntry revision recover --project $bookPath --input $requestFile
if ($LASTEXITCODE -ne 0) { throw '恢复未完成，保留现场，不转用旧入口或手动覆盖' }
node $repairEntry revision recover --project $bookPath --input $requestFile
if ($LASTEXITCODE -ne 0) { throw '幂等复核失败，停止后续同步' }
node "$bookPath/.writer/tool/bin/ai-writer.mjs" check --project $bookPath
```

再核实际r67/6章、completed/committed、每个发布目标after、全部当前source_hashes与六章正文匹配，原工具仍0.7.3/generation1；结合原六章姓名映射和连读报告继续核对。这些步骤没有第七章写作授权。

## 如明确选择rollback

与complete二选一，不要按顺序执行两方向；终态禁止反向回填。生成新文件后使用同一冻结入口：

```powershell
$rollbackFile = Join-Path $bookPath '.writer/drafts/rename-yang-20261019/recover-compatible-rollback-076.json'
node $requestMaker $bookPath rollback $rollbackFile
if ($LASTEXITCODE -ne 0) { throw '现场证据不符或有锁，停止' }
node $repairEntry revision recover --project $bookPath --input $rollbackFile
if ($LASTEXITCODE -ne 0) { throw '回滚未完成，保留现场' }
node $repairEntry revision recover --project $bookPath --input $rollbackFile
```

预期r66/6章、全部目标before、rolled-back/interrupted；候选、旧新备份保留。不要用新构建对旧绑定会话resume/prepare/commit来重基线。

## 限制与后续核对

输入生成器遇write.lock、第三方字节、证据或旧工具变化会停止。存在真实遗留锁时须另核原PID、实际锁SHA和作者明确恢复依据，按原recover协议准备附加字段，不盲删锁或关闭保护。

本入口只恢复原63目标。三份伴随人物卡和AGENTS等后续同步由源会话按已备份的姓名映射及作者范围核查，不通过改旧plan强行追加。旧随附0.7.3仍保留，未来使用修复版工具须另按正式更新流程和授权处理；本次兼容恢复没有自动安装。未验证共享盘、断电或真人文学质量，不把副本字节/流程检查当作已完成真实作品发布或六章独立文学审稿。
