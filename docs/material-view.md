# 只读材料准备

`task materials --project P --unit N [--mode draft|replay] [--max-chars 40000]` 将上下文与原生登记输入组合为一个 JSON 返回。replay 使用原 `--revision-token`。支持四种文体，原授权、修订会话、来源与预算检查仍执行。

这个入口不接受 `--out`，不创建目录、锁或 complete.json，不执行创作、登记、备份或升级。返回后的材料可能过期；完整实读后填写 record_input，仍依次使用原 record-preview 和 record。JSON 中不输出修订令牌。文件清点和前后比较不构成原子快照。

如需落盘，写入方仍须处理路径安全；shell 重定向不代表安全问题已解决。现有 context、record-template 和原输出路径限制保持不变。本入口与原设计中的外部 task prepare 文件包不同，不能作为其完成证据。

0.12.0 只集成只读材料增量。完整备份、自动升级准备未完成；tool prepare-update 明确返回 UPGRADE_PREPARATION_UNAVAILABLE。本入口不依赖协调器实验；验收以实际最终制品的独立记录为准，历史实验结果不能替代。
