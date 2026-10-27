# 0.10.0 无副本更新预算窄修：固定候选与接管参数

状态：Windows 本地合成场景验收通过；这是 0.10.0 **开发候选**，不是新正式发行。原 ai6 包未改写，真实作品未读取正文、未修改、未更新。本轮没有提交、推送、打标签或发布。百章文学实读与修订是另一项仍在进行的验证，不作为本窄修验收的前提。

原问题为内部 `context --purpose discussion` 使用默认 40000 字符：真实作品的失败记录显示需要 50558，治理和修订历史占用较多。原调用返回 `CONTEXT_BUDGET_EXCEEDED`，外层返回 `TOOL_VALIDATION_FAILED`；不能删决策、截断状态或改哈希绕过。

## 固定制品

- ZIP：`D:/work/other/ai-writer/dist/0.10.0-budget-aj1/ai-writer-0.10.0.zip`
- ZIP SHA-256：`3ab39a3a4de3775c8f5ae95f9ec591ca0247e681fd363204b6b57ff7d8fca3fe`
- 包内容 ID：`32892e88325e6b2b67b712bd9623f352c603ee8c29b948911d3a21c272606f9b`
- 已核验的解压来源：`D:/work/other/ai-writer/.tmp/budget-aj1/ai-writer-0.10.0`
- 来源提交 `ea3f155589bd776599f80a74c8eeee6f944c5894` 加本轮未提交修改；manifest 如实标记 `dirty: true`。
- `budget-package-verification.json` 核对 335 个来源文件、336 个解压载荷文件；`fixed-package-manifest.json` 和 `fixed-package-SHA256SUMS.txt` 保存固定清单。

## 实际更新选项与检查

从上述固定包的 **外部入口** 运行 `tool update-plan`，输入实际作品路径和以下计划选项：

```json
{
  "source": "D:/work/other/ai-writer/.tmp/budget-aj1/ai-writer-0.10.0",
  "validation_mode": "in-place-readonly"
}
```

例如入口为 `node D:/work/other/ai-writer/.tmp/budget-aj1/ai-writer-0.10.0/bin/ai-writer.mjs`；调用时按现场提供 `--project` 和保存的 `--input`。计划应显示 `validation_context_max_chars: 240000`；该固定策略进入 `plan_sha256`，没有新增可由用户填错的预算选项。它只用于机械检查完整讨论上下文，不改变写作时的模型预算，也不截断。

对方会话在作品安全暂停后，以实时状态重新 plan：核对当前 revision、generation、目标安装内容 ID、来源内容 ID、定制文件和 blockers。此前报告的 r520/schema6/generation1 与正式 0.9.0 目标 ID `8bff9af21fba84e32d798f4cef969d5a0e4ff0f904089f85047877d16e403131` 是现场报告，不代替执行时重读。随后使用计划返回的完整 `request`，补入该会话已确认的真实作者依据，从固定包外部入口执行 `tool update`。不得沿用旧 ai6 计划、手改安装哈希或刷新过期计划。

原失败留下的材料和无正文复制原则继续保留。若现场出现新阻断或超过 240000，保留状态、完整错误和候选；检查 `checks` 中的 `CONTEXT_BUDGET_EXCEEDED`，不要删除作者决策或默认扩大范围。工具更新完成后才按单独的迁移计划处理目录；本报告不代执行真实迁移。

## 验证结果

- 解压包 `npm test -- --test-concurrency=4`：255 项，254 通过、0 失败、1 项 Windows 符号链接权限条件跳过；`npm run doctor` 通过。
- 合成作品从正式 0.9.0 更新，包含两次已关闭历史修订和大治理状态：默认讨论预算需要 **56336** 字符，固定包无正文复制更新在准备阶段中断后 complete，第二次正常更新成功；正文和登记保持。大状态超限样本需要 **316793** 字符，按 240000 明确拒绝，状态与正文不变。记录见 `budget-live-verification.json` 和 `commands/budget-live-*`。
- 百章独立副本的 schema 7 作品从已验收 ai6 更新到本固定包，112 章原始 SHA 和登记、追踪快照与此前基线一致；本次更新的验证目录无正文文件，见 `migration-verification.json` 与 `commands/fixed-update-*`。
- 测试覆盖过期计划拒绝、无副本准备中断与恢复、上限拒绝；原 ai6 轮已有无副本部分替换和状态发布后的 complete/rollback 回归，记录保留。全量回归还包含原工具更新和迁移保护。

测试素材为合成作品，本结果不代表对真实书稿的文学审查、跨平台 CI 或正式发布验收。
