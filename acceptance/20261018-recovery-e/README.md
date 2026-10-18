# E轮：更新恢复再中断与完整包身份验证

2026-10-18，Windows本机，Node v24.15.0。交付为 **0.7.1本地候选**；没有提交、推送或正式发布，不升级实际作品。最终状态由 `final-verification.json`、`evidence-manifest.json` 及目录外封存复核回执共同确认。

本轮承接已完成的A—D八项设计，选择补强恢复可靠性与使用说明，不扩大到自动合并、跨机锁或文学自动评分。D原档案保持封存，已再次完整核验；A/B/C及百章原记录未改写。本文没有把D的历史测试计为本轮新通过。

## 本轮修改

- 修复0.7随附包丢失清单会降为旧无清单包的问题。现在identify缺manifest、doctor失败、更新计划阻断、随附写入拒绝。0.1–0.6真实旧无清单副本继续按原规则观察。
- 修复只核运行模块身份的问题。已安装包同时核完整source_content_id；资源改变后重建清单，仍不能追认安装事实。identify可如实报告当前包自洽，doctor、更新预览和写入另外核对安装记录。
- 快速入门、手册补充恢复途中再次中断、包损坏与安装身份不符的处理，删除使用手册“尚无安全更新/恢复命令”的过期矛盾。
- longform测试清理临时目录遇到Windows EPERM，复用已有fixture的精确路径核验和有限异步重试。没有修改产品删除行为，不进行无限重试。

详细边界见 [实现说明](../../docs/recovery-hardening-e.md)。冻结交付包61文件，content ID：

`da84d3333ead0d33189feefa3f693fdf7e3324ad9e7f4ef9376b1f24bf4b7f5b`

运行模块ID：`75de26e51259b204fb7c97eb7821d8714750070e97783f163b1782d976fec170`。实际来源提交、dirty及逐文件哈希见 `source-build.json`；这不是供应链签名。`sources/package/`是实测完整轻量包，最终源码/测试快照见`sources/final-source/`和`final-audit/source-files.json`。

## 最终验证与证据

| 验证 | 结果与位置 |
| --- | --- |
| npm test | 最终147项：146通过、0失败、1环境跳过；`commands/final-tests/` |
| npm run doctor | 通过；`commands/doctor/` |
| Git差异检查 | 通过；`commands/final-diff-check/` |
| 缺清单/重建清单两条回归 | 修复前2失败，修复后连同四文体便携初始化3通过；`regression-before.txt`、`regression-after-v2.txt` |
| 回滚再中断矩阵 | 22场景、121次产品CLI；`rollback-v2/summary.json`、`commands/rollback-v2-*` |
| 实际Codex | 新会话按文件恢复并完整读六章，34次产品CLI；`native-recovery/process-result.json`、`results.json`及`REPORT.md` |
| 独立最终对账 | `final-audit/verification.json`、`final-verification.json` |
| D原档复核 | 全树原封存校验通过；`commands/prior-d-seal/` |

矩阵使用真实0.7.0包到冻结0.7.1包的10行事务：先全部正向写入但不落终态，逐行中断回滚，再分别complete/rollback，20场景逐文件比对旧/新哈希，核事实及终态同向幂等。另2场景在回滚中断后改第三方工具文件或正文，两种方向均拒绝，外部字节与state保留。不是把首次正向中断后选择rollback称作“回滚途中再中断”。

实际Codex使用D轮六章《渡口旧箱》的独立复制（初始1167文件逐字节比对），操作原事务：prepared退出97 → complete在11/11行新字节后退出95 → rollback在第5行后退出95 → complete成功。11行比机械夹具多一份新冻结作者依据。期间普通入口持续pending，备份完整；同向终态重试unchanged，终态反向回填拒绝。新随附入口help/doctor/status/discussion context/check实际通过。

随后在该可丢弃副本模拟缺清单及资源变化，再公开重建清单，分别实测只读识别、doctor、写入及更新预览，最后精确还原包原字节，重新doctor/check。实际输入、stdout/stderr、环境覆盖、退出码、前后state、事务逐行观察都在`native-recovery/`。最终schema6、revision45、generation3；六章正文、units、snapshot、作者决策、原治理暂停范围和根定制保持原字节/结构，仅正常工具更新推进revision及tool_control。没有第七章，也未伪造正文修订或文学复核登记。

## 保留的失败与边界

1. 初次回归复现两个产品缺口；第一次修复后回归因把doctor的ok=false退出码误写为2而失败（实际1），修正测试期望后通过，原记录保留。
2. 首次全套为145通过、1清理失败、1环境跳过。longform收尾EPERM的原始堆栈保留；修复测试清理后才取得最终全套绿灯。
3. `rollback-v1`原变体从0.6补齐全包，包装器300秒超时，只有部分过程记录，**不算完整矩阵通过**。规范prepared/pending副本、已产生的原始命令及残留临时材料快照保留（见`final-audit/abandoned-scratch.json`）。最终`rollback-v2`针对本轮补丁包的全部10个位置；0.6全包补齐的完整正向矩阵以D轮记录为准。
4. 实际Codex记录helper首次缺commands父目录，尚未运行产品CLI即失败；另一次最终汇总发现主项目新增`docs/recovery-hardening-e.md`而停止。该维护说明由主会话在实跑期间新增，属于冻结61文件包之外；原有主项目文件及冻结包保持不变。保留原断言和完整清单差异，不把“全目录相等”改报为通过。Codex自身只报告观察，不替它猜测来源。
5. 单个文件符号链接用例因环境权限跳过；不计作通过。未改内置引擎，未额外宣称引擎回归、Linux/跨机/共享盘或断电验收。
6. 仅六章模型实读及恢复验证，不是百章新写、百章完整重读、真人盲读或文学/市场验收。本轮未操作真实作品目录；不因隔离副本验证而自动更新它们。

原始记录先保留，最终核验再封存。封存后不向此目录补写结果；复核回执放在目录外 `../20261018-recovery-e-seal-verification.json`。
