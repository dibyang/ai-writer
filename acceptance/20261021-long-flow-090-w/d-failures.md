# W-D全部失败记录

产品CLI非零共1次：d-authorize-draft的输入把尚未创建的0022.json列进planning.refs，产品以ENOENT拒绝（真实子进程exit 2，wrapper shell exit 1）。该次前后state一致，未写入事件。原始输入、双流、result及前后state都在cli-logs/d-authorize-draft。改成引用真实存在的执行细纲后，以新操作ID和新唯一标签d-authorize-draft-v2通过；没有手改产品或哈希。此为本次输入准备错误，不宣称产品缺陷。

辅助脚本另一次失败见d-helper-failures.md：误用state.current.ledger，真实结构为snapshot；发生在任何写入前。修正只涉及W内辅助脚本。

其余48次D产品CLI均exit 0；每次完整输入、stdout/stderr、子码及前后state在唯一标签日志目录。未发生其它产品拒绝、事务失败或重试。未复现需报根修复的产品缺陷；不据此宣称全产品验收。
