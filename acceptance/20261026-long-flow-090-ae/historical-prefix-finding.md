# 历史来源变更的旧前缀回放保护

## 实际问题

在独立三章诊断作品中，旧来源已 freeze 并 bind 到1—3章，但未发布 baseline 原区间；将活动入口改为新版，再 stage 从第2章生效的历史变更。旧实现允许在正式修订区 rewind 到第1章之前并发布新版，而第1章模板回退读取 live 入口，实际取到新版 SHA。旧章的等价消费绑定本身没有成为未来回放的发布区间。

复现脚本为 probe-historical-prefix.mjs，修复前版本另存 originals/historical-prefix-guard/。local-checks/historical-prefix-before 的真实退出为1，保留断言、stdout、stderr、三章诊断目录及原模板。它是明确标注的合成 API 反例，不计入小说实跑章节或文学验收。

## 修复与已完成的验证

lib/sources.mjs 在历史 stage 冻结审查报告之前检查保留前缀的发布区间；缺失则 SOURCE_BASELINE_REQUIRED，并列出章次。旧构建已接受的 pending 在新发布处理器中也重新检查。修订覆盖该来源全部旧消费者时不强加 baseline；已有合法发布区间继续复用，不将后来版本追认为原消费。

- historical-prefix-after：修复后拒绝同一入口，状态字节不变，实际exit0。
- historical-prefix-legacy-publish：对修复前实际 pending 使用新库发布处理器，拒绝并保持独立区状态；实际exit0。该项是API诊断，未声称旧会话可跨构建提交。
- historical-prefix-focused：两项新增集成回归实际通过。一项验证拒绝不新增冻结对象、真实旧版baseline后回放并提交，第1章仍用旧版、第2章用新版；另一项验证从第1章覆盖全部消费者无需额外baseline。
- 全量 npm test 与 doctor 的实际结果见同名 historical-prefix-full-tests / historical-prefix-doctor 记录；完成前不预填测试数量或通过结论。

## 与正在进行的66章修订的关系

r-staged-prefix-safety.json逐一核对8项真实 staged 来源，均没有 requested_from 之前需要保留的同ref消费者。当前受保护R会话继续原gen8绑定；源码补丁不改变该会话运行工具。R提交后才生成并安装新构建，最终完整长篇阅读、恢复与CLI反例必须针对新交付构建另验。现有作品和历史封存均未修改。
