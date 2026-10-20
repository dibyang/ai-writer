# 报告冻结补充故障验证

初版新增draft_review能力的两个补充测试均失败（详见commands/report-integrity-before完整回包）：

1. 正常登记后，改写冻结报告对象，check未拒绝。修复：作品加载核每个已有绑定的冻结对象路径、正文登记版本和报告SHA；缺失/改写返回DRAFT_REVIEW_CORRUPT，不改业务状态。不因原报告路径后来正常编辑而重写冻结副本。
2. 用受控fs.readFileSync注入模拟验证与冻结间锁外修改，初版仍登记并冻结了不同字节。修复：正式冻结前再核本次读到的字节与输入report_sha256，不符DRAFT_REVIEW_INVALID且先于任何对象/状态/journal写入拒绝。注入只发生在合成隔离测试，不是实际用户报告损坏。

原候选a278及其ZIP、测试与首个原生A进程保留为初测。源码中途变化后，正在进行的source-tests-retry也仅属中间回归，不冒充最终版本。修复后另建candidate-final/ZIP和全新scenario-final测试作品；最终完整流程从新包新建，不复用初测片段、状态或规划文件。
