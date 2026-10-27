# 实际失败、保护拒绝和恢复索引

总索引为command-audit-final.json：1023条产品调用（含1条未启动子进程）、19条实际产品非零、28段原生执行（4条已观察非零、1条中断退出未知），另逐项保留本地检查和43条原生命令非零。外层PowerShell退出与实际产品子进程退出分别记录，不能互换。原始双流/输入/state及公开事件均留存；下表是分类，不覆盖原证据。

| 类别 | 原记录与处置 |
| --- | --- |
| 预期保护拒绝 | a-u61预算1000/下界、r-resume1-u54预算；r-resume1-main-guard占用；g9/g9-v2/g9-v5来源前缀阻断、v2/v5卷ID碰撞；vc-revision-begin动作范围拒绝；fcl的67双入口范围拒绝。均state不变。最终v5保护探测与final-issues-boundary-root-verification通过。 |
| 输入/命令错误 | plan-entry用sources/revisions/issues错误顶层名，后按help用正式单数/子命令；a-resume-63-assemble缺实际path/SHA、preview把previous_holder放入custody内，按真实结构修正输入后完成登记，未刷来源。A阶段a-complete及最终66当前覆盖保存成功链。 |
| 修订中的预期非就绪 | r-stop-check、r-resume1-recovery-stop-main-check在来源影响尚待正式事务时非零；r-final-root-commit-verification和最终fcl双区check已通过。未把中间状态当发布完成。 |
| 原生容量/网络 | final-first、final-tail-resume、final-tail-recovery实际exit1；同ID恢复完整读取未完章节，排除不完整页，final-close exit0及462页当前覆盖核验通过。language-baseline网络失败后按守卫取消actual4294967295，baseline-retry与updated正常完成；不称原失败读过样本。 |
| 已中断且退出未知 | r-resume1及historical-prefix两个本地运行保持unknown，run-closure核其独立中断观察记录及恢复引用。不得伪造旧exit0；后续恢复/最终构建有各自实际成功结果。 |
| 根辅助断言/路径 | a-date62旧路径假定、a61预算字段假定、b65回执label、volume-complete误用state.ledger、final-writer-transaction误把新增review当历史改变，均保留exit1后修正核验逻辑并以新label成功，不改产品数据迎合脚本。详ROOT-CONTROLLER及ROOT-FINAL-TRANSACTION-REVIEW。 |
| 构建过程 | historical-prefix-before和volume-id-case-before为修复前复现，后v5实际包探测通过。旧Expand-Archive失败后用.NET解压；v3第三方来源哈希测试失败，恢复原引入文件、把新增规则独立维护后v5主235项和包引擎29项通过，旧包仍保留。 |
| 原生辅助错误 | vc缺input在CLI启动前失败，有实际wrapper1而product exit=null；fcl三次非法日志标签、retained派生context_changed断言、负例stderr读取错误均留原件。P1首轮Python应用别名不可用、恢复轮清单括号语法错误，均执行前失败，后用Node成功核验；输入/稿件/规则不受影响。其他patch匹配、元数据字段/输出展示错误保留在各交接和43项命令索引中。 |

当前闭环证据：final-close-root-verification.json、volume-complete-root-verification.json、language-rewrite-eval/root-verification.json、build-parity-final-g9.json、git-boundary-verification.json。所有未决文学观察继续保留，不在此归类为已经修复。Windows合章符号链接测试跳过也未冒称通过，须后续Linux/macOS CI验证。
