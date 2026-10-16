# 启动与日志边界

本阶段所有 CLI 和辅助子进程经 run-cli.mjs 调用共享 createRunner，保存真实 executable、argv、退出码和分流原始输出。最外层工具启动回包可能合并 stdout/stderr；该回包仅作展示，不冒充子进程原始输出。FastCtx 实读和 apply_patch 文件操作是工具调用，不是 CLI 子进程；实际剧情全文阅读另记 reading.jsonl。
