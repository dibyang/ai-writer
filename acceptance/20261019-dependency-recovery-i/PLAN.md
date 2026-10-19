# I轮：目录外固定依赖提交及0.7.3既有事务恢复最小修复

状态：本缺陷的工具修复、程序回归和完整副本验证已完成，见[README](README.md)与[verification.json](verification.json)。本计划保留原设计；最新用户要求本地Git提交本轮修改及记录，不推送。真实作品恢复仍由源会话负责。

授权来自源会话arch（01a1404a-8bcf-7532-9e37-f2970c8fe27c）的真实用户回复：“允许仅修复此缺陷，再完成改名”。问题是六章姓名修订的prepare允许实际消费的人物/架构来源，commit及recover却以固定目录拒绝同一目标。源会话负责真实恢复；本会话仅维护工具并用合成作品/真实作品副本验证，不改D:/work/小说/dzkxqxx任何文件，不提交或推送，不推进其他功能。

H轮保留：主r440/112原字节，session79205b65-a787-466f-a5d9-39906315aafc已prepared，分支r489。最终41章实读、正式报告与prepare原生进程1055秒exit0，父核验通过。原包package-v2、基线/准备与所有记录保留；修复期间不resume或改候选。

## 边界设计

1. begin在已消费source_hashes之外复制治理planning.refs的明确文件，固定实际SHA；只复制明确引用，不能遍历放开整个人物/架构目录。
2. 事务保留现有managed-tree范围；目录外例外仅限原base-state真实消费/规划引用且同时在base.extra和base.files固定的安全文件。工具内部、版本库等保留区不因extra授权写入。新目录外来源若没在基线固定，prepare应明确拒绝，不能漏发后生成失效追踪。
3. validateTx校验原session/base/base-state/prepared身份与指纹，目标顺序及before/after须对应原prepared.changes、state目标须对应prepared.target_state；备份仍逐项检查，不把自校验plan_sha当任意路径授权。兼容0.7.3原prepared事务，既有完成/回滚及session-finalized中断也须可重复恢复。
4. 不修改既有事务plan或旧源包，不刷新原基线或生成替代待发清单。外部冻结修复入口只对既有事务执行recover；不能用新构建对旧绑定会话resume/prepare/commit绕过构建保护。真实作品恢复交源会话。

## 验证

- 先保存旧源/状态/基线/事务及H检查点的指纹，只读复制真实作品（排除.git）并核字节；实稿副本及带令牌原始输入仅保留本机private-copies，不混入通用工具源码。
- 原0.7.3入口在副本complete和rollback均复现TRANSACTION_CORRUPT，目标/state不变。
- 合成回归：规划引用复制、两种目录外依赖正常提交/幂等、prepared及部分发布的complete/rollback、非消费同目录文件/重复及保留区路径拒绝，失败不替换目标。
- 新外部入口在真实完整副本执行既有prepared complete与rollback，保留旧工具/基线/计划/备份；核63目标、正文/源文件/状态、session/事务状态、check与幂等。必要的锁恢复使用真实合成测试授权和死进程证据，不关闭保护。
- npm test、npm run doctor；内置引擎不变，不声称真人/市场/真实作品发布验收。
- 冻结修复包、版本/内容/运行指纹，交付恢复步骤及明确的未覆盖项。H后续仍用原绑定入口提交，关闭后才可正式更新新包，不在prepared期间替换其工具。
