# 长篇工具用法

完整命令、分卷 JSON、增量登记、证据、滚动审查与旧作导入示例保存在随作品复制的 [长篇流程](../.agents/skills/writer-project/references/long-form.md)。作者任务入口见 [使用手册](user-guide.md)，具体命令帮助支持 `命令 --help`。

已有作品先运行 `node bin/ai-writer.mjs status --project 目录`，再 `long-enable --expected-revision 当前号`，工具保留旧状态备份。schema 1 仍兼容。schema 2 增加分卷和差量 journal；不要手改 `.writer/state.json` 或删除 journal。

`outline --unit` 与 `context --unit` 自动取当前卷/剧情单元；`recall --query` 用来定位早期线索及正文；`record-template` 返回 changes 格式。`check` 同时校验差量链并报告滚动审查欠覆盖。所有导出仍是草稿。

分卷范围是全部文体通用的连续单元号；小说一般按章，剧本可按场/集，历史散文按章。物证/人物知识账本按任务需要使用，不强迫散文采用小说结构。历史事实仍必须经过原来的 research_refs 事实卡流程，ledger 不替代史料核验。

当前卷纲哈希按整文件保护，已消费卷纲的任何修改都需核实影响后回退；未来章纲可滚动细化，尚无卷内未来arc免回退的细粒度修订。旧稿输入只支持明确排序的UTF-8分章文件，合订本先保留原文并拆章。修订报告建议另存带修订号的新文件，保留原报告，旧覆盖不会自动升级为新稿结论。

Windows 本机既有实跑中，Codex CLI 以嵌套作品目录为 cwd 时曾遇到 helper 启动失败；从 ai-writer 根目录启动并显式传作品路径后完成恢复续写。遇到同类错误时使用根目录入口，不修改全局安全设置。独立作品的 Node 轻量工具可用于诊断；具体历史证据保存在主项目 acceptance/20261015-long/。

旧稿移动后看 import-status 的 can_continue/blockers，用 [import-relink](workflow.md) 绑定同一冻结内容的新位置。正文目录内的未登记稿由 status/check 主动列出；导出时核对 excluded_drafts。
