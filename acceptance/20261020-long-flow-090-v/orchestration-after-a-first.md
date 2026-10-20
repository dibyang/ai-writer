# V根会话编排检查点：A首停后

本轮目标与边界以README及各实际stdin为准：U当前三章逐字节复制到V/scenario/东岸末班船-扩展验证，扩到12章/5卷/至少52965正文汉字；不写U/T/既有作品，不派协作子代理，不提交或推送。产品源码本轮尚未改变，固定U最终包ff6cde0f…；U封存SHA4bac4375…已核。T基线提交0c6d27ab保持，U/V及既有15个产品文件改动仍未提交，.idea不动。

## 已执行

- bootstrap核349份复制文件同字节，初始revision13/3章/paused，基线与产品冻结文件保存。
- 原生A首停commands/codex-a-first正常退出0，1203295ms。thread=01a15880-13ce-7fe0-adf7-78a1110f6bb2。首停两段1151/1158汉字，主revision17/3章。根parent-a-first-verification.json通过，原三章及observation不变。
- 原生同ID A恢复正在commands/codex-a-resume运行，实际stdin为prompt-a-resume-v2.md（其明确要求先读原prompt-a-resume.md），外层exec工具session99564。约09:10 UTC开始，准确开始/耗时待result.json产生。当前运行使用run.mjs的1小时异步期限；不得在尚活跃时启动第二个写者。如真的触发期限，保留实际退出/现场，核无残留写者后同thread新label恢复未完部分，不能冒称正常完成。
- A恢复已识别原提示“source_hashes相同”的state例外，正式更新到trial范围4—6/revision18，再取写前模板；原17模板和01/02未覆盖。根自己的表述问题保存在a-resume-source-boundary-note.md，未改原stdin。
- 最近观测：第4章5820汉字已登记r19，第5章3845已登记r20，共23630；第6尚未登记。阶段文学自检曾在4登记前纠正8元应由沈禾收款的差量归属，原输入保留，不算产品缺陷。

## 后续顺序（一次只运行一个原生写者）

使用 `node V/progress.mjs 标签` 查询done、实际thread、最新消息和主状态，原始JSONL在commands/标签/stdout.raw.txt，CLI完整记录器是v-log.mjs、目录cli-logs。终端外层码可能1，内部产品实际码以独立result.exit_code为准。每60秒内中文进度反馈，睡眠≤45秒。

1. A恢复退出后：`node V/run.mjs parent-a-resume node V/verify-checkpoint.mjs a-resume`，再`node V/guard-probe.mjs after-a`。前者要求6章、章4/6≥5000、5≥3500，原三章/两首停片段/观察不变；后者实际context7应ACTION_OUT_OF_SCOPE/码2/作品全文件字节不变。
2. 新鲜B：**run-long.mjs**，label codex-b-first，实际stdin **prompt-b-first-v2.md**，exec --json --sandbox workspace-write -C ROOT -o V/codex-b-first-last.md -。只7—8，正式范围7—9，包含低1000字符预算诊断与显式恢复，8兑现第一线索。
3. B首停正常退出，根verify-checkpoint b-first要求8章；同实际B thread resume，label codex-b-resume、stdin **prompt-b-resume-v2.md**，只9、范围9—9。结束根phase b-resume要求9。
4. 新鲜C：label codex-c-first、stdin **prompt-c-first-v2.md**，10—12；11/12兑其余线索。实际读完7—12后选择7/9各一普通事实合理追溯改动，正式revision7—12，独立区重登7后首停。根phase c-first要求主12，然后guard-probe occupied须REVISION_OCCUPIED/码2/全W字节不变。保存当前主12原稿作之后机械改前对比，绝不动U。
5. 同实际C thread resume：label codex-c-resume、stdin **prompt-c-resume-v2.md**。同R ID/token重登8—12，完整尾段review后prepare/commit，成功后正式更新当前task除去旧首停命令；根phase c-resume。再独立比较C首停主稿与提交后：1—6和所有immutable观察不变，7/9实际修改及下游一致，保存机械差异而非文学结论。
6. 新鲜F：label codex-f、stdin **prompt-f.md**。真实同版本边界read-boundary.mjs pass1 before→FastCtx≤100行按序全文1—12→after；真实全文报告review登记，正式paused仅discuss，13两次拒绝，草稿导出export-final-current-12。任何硬修复须正规独立区且新pass2全文重读，不拼散读。
7. F正常退出，根phase final、verify-native-reading.mjs、guard-probe final；根实际CLI check/revision list/doctor，完整范围/当前SHA/冻结报告、无占用事务、12导出与manifest/排除稿/字节核验。最终全稿阅读算法已处理真实末尾换行空项，仍逐正文行比对，不能把机械覆盖当文学理解。

后续原生命令使用run-long.mjs（复制旧记录器，仅异步期限改2小时）避免较长阶段使用旧1小时上限。它不表示阻塞等待2小时，根仍45秒内轮询及进度。exe=C:/Users/admin/AppData/Local/OpenAI/Codex/bin/896a0166b774037a/codex.exe，已记录0.163.0-alpha.10.2；不指定模型/努力覆盖，沿用宿主默认。外层exec需获批状态库访问，内层保持workspace-write。resume语法沿A实际成功：`exe exec --json --sandbox workspace-write -C ROOT resume --json -o 输出实际路径 THREAD -`。

## 最终结项尚未执行

最终状态/导出/正式修订差异独立脚本、命令与原生事件全库存、失败归类、README当前状态、verification、封存脚本及目录外回执都需最后完成，不得在部分写作结束就宣称V完成。可参考只读U已封存的verify-final-state、audit-evidence-v4、close-verification、seal脚本，适配V的12章和统一cli-logs；别改U。所有非零实际/预期/辅助/环境错误如实分类；初次大写日志标签在记录器spawn前被拒，原生事件保留且有明确复现，不能拿复现冒充初次完整双流。

最终引用U冻结回归结果（源码与ZIP194项192通过/2Windows链接权限跳过，doctor两处通过，engine29）须明确本轮核版本字节不变、没有重跑；如果修产品则另建最终包、更新隔离作品运行包与完整回归，不沿用旧绿灯。Linux/macOS/其他Node与60/100章增量、真人无指导新手/盲读/市场/正式发布均仍暂缓。U/V本轮记录和源码暂不提交，不推送。封存后不再写目录内；目录外保存seal verify回执。不得自动写memories。
