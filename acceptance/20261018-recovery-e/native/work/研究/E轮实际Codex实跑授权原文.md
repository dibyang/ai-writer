# E轮实际Codex实跑：六章副本、恢复再中断与完整构建保护

这是用户已授权“继续推进”的工具维护验证。只操作 `D:/work/other/ai-writer/acceptance/20261018-recovery-e/native/work` 和本阶段 `native-recovery`。不操作任何真实作品、原A/B/C/D封存档案，不提交、推送、联网研究或派生其他代理。主项目与冻结来源只读。

从文件恢复，不依赖会话记忆。读取作品AGENTS、当前阶段/决策、完整六章正文与当前手册。目标仍是暂停正文、仅讨论/规划；不要写第七章或修改现有六章。现有旧章阅读只证明实际读到的六章版本，不宣称新文学创作或百章重读。

主入口 `D:/work/other/ai-writer/bin/ai-writer.mjs`；最终可信本地来源 `D:/work/other/ai-writer/acceptance/20261018-recovery-e/sources/package`（0.7.1）。副本当前0.7.0/schema6，原作者根规则/技能/手册笔记应保留。已有事务历史不要清理。

本任务对该隔离副本的明确授权原话为：“允许在E轮六章隔离副本中更新工具、注入恢复中断、按原事务完成或回滚、模拟包资源损坏并精确还原；保留正文、事实、作者选择、暂停范围及根定制，不写新章。”将本请求原文复制到副本研究目录作为此次工具操作依据，不冒充真实作品作者作了逐项选择。工具输入引用实际原话/本地SHA。进入操作前保存精确baseline（六章正文、units、snapshot、governance、decisions、根AGENTS/技能/手册；state全字节另存）。

顺序执行并完整保存每次CLI输入、stdout、stderr、退出码、前后state和环境：

1. 外部入口doctor、tool identify、status、discussion context，确认当前构建和暂停范围。只读plan指向冻结来源，按真实request补author_evidence，不改state迁移数字。
2. 外部tool update加环境 `AI_WRITER_TEST_FAULT=1, AI_WRITER_TEST_TOOL_STOP_PHASE=prepared`，预期97，保留实际事务和锁。status应报TOOL_UPDATE_PENDING。
3. 新进程外部tool recover complete，用实际事务ID、实际锁SHA、真实恢复依据；设置 `AI_WRITER_TEST_TOOL_STOP_AFTER=实际plan长度`，预期95，全部行已是新字节但事务仍pending。不要直接运行混包旧入口，不删除锁。
4. 再开新命令，外部recover rollback，在plan中间位置再次STOP_AFTER，预期95。再核普通status仍pending、备份仍在。未完成事务不能当成成功。
5. 新命令外部recover complete（不注入故障），保留原事务，最后成功。复用原输入同方向再恢复，预期unchanged且revision/generation不再增加。已终态的rollback应拒绝且state不变。实际从新随附入口执行help、doctor、status、discussion context/check，核0.7.1和安装完整身份。
6. 在这个可丢弃验证副本中，保存原包清单和包内quickstart的精确字节，再模拟损坏：删除清单并追加一行测试字样。用最终新入口doctor、写命令plan（准备合法输入但不扩权）确认失败；外部identify应ok=false、missing含manifest，外部update-plan应阻断。随后调用公开writeBuildManifest为变化后的测试包重建清单，验证identify本身虽可通过，doctor/随附写入/外部update-plan仍根据已安装完整身份拒绝。不要修改state指纹；最后精确恢复最初包文件与清单字节并实际重跑doctor/check。
7. 比较最终六章正文、units、snapshot、governance、decisions及根定制与baseline。允许state仅正常更新revision/tool_control；不能把治理变化当正文变化。无第七章、范围不扩大。完整连续读六章后的报告单独保存；不重新登记旧文学审查或伪造修改。

可编写验证helper，但不能代替实际执行。测试helpers仅写本阶段目录；不要重写产品实现。如发现问题，保留证据并向本任务报告，不擅自绕过保护。不要把预期注入退出码当产品缺陷；其他失败完整保留并解释。最终输出实际结论、边界、原始记录位置和每步结果JSON，确认是否读完六章、未新增/改写正文。
