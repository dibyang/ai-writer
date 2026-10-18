七步实跑完成，共 34 次实际 CLI 调用，未发现本轮产品失败。

| 步骤 | 实际结果 |
|---|---|
| 1 | 外部诊断成功，冻结来源计划无阻断 |
| 2 | prepared 注入退出 97，status 报 pending |
| 3 | 11/11 行为新字节后退出 95，仍 pending |
| 4 | rollback 第 5 行后退出 95，5 旧/6 新，备份完整 |
| 5 | 原事务完成；同输入 unchanged；终态反向恢复拒绝 |
| 6 | 缺清单、重建清单后均正确保护；精确还原后 doctor/check 成功 |
| 7 | 六章、事实、治理、决定及根定制均与 baseline 一致 |

最终为 **0.7.1/schema6，revision 45、generation 3**；state 仅 revision/tool_control 变化。已完整读完六章，未新增第七章、未改写正文或登记新文学审查，暂停范围保留。

- [汇总及每步结果 JSON](D:/work/other/ai-writer/acceptance/20261018-recovery-e/native-recovery/results.json)
- [原始 CLI 记录索引](D:/work/other/ai-writer/acceptance/20261018-recovery-e/native-recovery/command-results.json)
- [六章实读报告](D:/work/other/ai-writer/acceptance/20261018-recovery-e/native-recovery/six-chapter-reading-report.md)
- [完整报告与异常说明](D:/work/other/ai-writer/acceptance/20261018-recovery-e/native-recovery/REPORT.md)

另观测到主项目新增 `docs/recovery-hardening-e.md`，本轮未写入或处理该文件。结论仅限本机隔离副本，不代表真实作品或正式发布验收。