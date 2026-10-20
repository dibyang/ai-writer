# 收尾审计边界与一次辅助断言纠正

所有原生客户端和此前捕获的命令结束后，直接运行audit-commands.mjs（没有用run.mjs包装，避免把自己的未完成receipt算成活动命令）。其cut-off为454个完整result，29个非零、9个原生进程/6个真实线程。后续分类、写最终记录和seal是直接执行的收尾工序，不新增commands目录；它们不冒充已经列入454条。原始root工具输出属于本会话记录，辅助源码、结果与本说明一并封存。

第一次直接执行classify-native-failures.mjs退出1，AssertionError actual9/expected0。11个内部失败命令当时均已按实际itemID找到，但辅助脚本错误假设启动notice为空；未生成native-failure-classification.json，未seal。原脚本保留classify-native-failures-before-startup-notice-fix.mjs，不归为产品缺陷或新增CLI失败。

父逐条读取9条notice，均为每个客户端item_0相同文字“Under-development features enabled: respect_system_proxy.”开头的开发中功能警告。虽然CLI以item.type=error发出，内容是启动警告；不因此删除原文，也不改C:/Users/admin/.codex/config.toml抑制警告。改后的分类器严格要求每客户端恰一条、item_0、文字完全相同且匹配这个精确前缀；实际进程退出0、模型读取/状态/导出成功由各自独立证据证明，不是据警告分类推断成功。新分类结果列9条原文和性质。

apply_patch格式失败另有C保存的具体诊断c-resume-26-patch-failure.md，但C的--json记录未暴露匹配的失败patch事件；所以emitted_failed_file_changes=0不等于没有格式错误。D Buffer错误和F投影视图错误命令也退出0，分别保留异常产物/旧视图。最终记录同时给这些边界，不把454个receipt、0个MCP协议错误或正常客户端退出包装成全部过程零问题。
