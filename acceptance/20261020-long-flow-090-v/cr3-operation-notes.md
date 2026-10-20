# C恢复实际调用说明

- 本轮产品CLI的唯一非零调用：`cli-logs/cr3-entry-identify`。将正确的`tool identify`误写成裸`identify`，真实CLI退出2/COMMAND_FAILED（包装器进程退出1），主state前后同为5296f9cc044870e8ecba1940b788d89dca2eafe9c9028ad568e4be4c0654bce0。随后读当前手册，`cr3-identify-main`与`cr3-identify-candidate`使用正确命令均0，不清旧日志。此为调用拼写错误，不是产品身份功能失败。
- 两次FastCtx路径探读失败：猜错旧9报告名，随后从真实br2-record-9.json取得`审查/V-B恢复-0009完整章自检.md`并全文读；旧10报告名漏一个连字符，按工具给出的实际路径`审查/V-C3-0010-完整章自检.md`全文读。均未写作品。
- 8的首次preview0后发现T_EARLY_BATCH旧整段会淡化7零钱知识，在真正record8前补保留两卷准备/备用卷使用，重新bind及preview-v2均0，最后输入已冻结在record日志。首次预览与输入快照保留，不掩盖迭代。
- 第9重登后check实际出现4—9窗口，暂停10，从4全文顺读到9再正式review。先前取得的10 replay-input（r55）未登记；review后通过真实replay-input-v2重新取得r56当前context，再据已读新9/10/下游同步语义，不手改state或旧消费SHA。两份原草案均保留。
- 所有重登/正式review/prepare/commit/合并后workflow和最终核对均使用真实父CLI和显式project；独立区写命令均R与原token。辅助脚本只组织已经写出的语义输入、报告和必要范围的字节核对；不改state，不代替模型阅读或文学判断。
- 不重新做整树文件/产品/工具清单库存。根保存主12原稿和最终命令库存。本C仅保存必要12章、前6登记、observation和正式事务变化文件的比对证据，不负责最终根封存。
