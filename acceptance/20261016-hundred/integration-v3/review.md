# v3已合入主版本（90章静止检查点）

sequence的session-11原生正常结束，独立audit子进程也已退出0、外层session27593完成，90r275静止后才替换工具。按candidate-v3-origin/source逐一核对246源文件和仅2项候选差异，备份主lib/longform.mjs、tests/longform.test.mjs及作品内置longform，合入并同步内置版本。

主npm test实际60/60、fail0/skip0，doctor0；原始命令/完整输出见parent-commands/integrated-v3-test和integrated-v3-doctor，不用隔离候选测试代替主版本。主帮助/恢复v2保留，未改引擎代码。权威90state SHA始终245c8c4e9c9d3ec46d093b4a1ec47578998dd0c4654fe442c57b87dbc21d26c3，不通过编辑state规避校验。

active-candidate切至source-baseline-v3.json，246文件范围比v2的72精选来源更全，数量增加不算多写章节或多语义通过。隔离候选与原始v2/失败日志均保留。后续原生作者C及91—100使用该代码；当前只完成主合入与本机测试，百章及最终验收仍待完成。CLI帮助中参数范围/审查示例的计划更新尚未做，不误计本次合入。
