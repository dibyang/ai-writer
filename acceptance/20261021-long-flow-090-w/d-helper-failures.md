# D 辅助脚本失败

入口保护快照脚本首次运行 exit 1：误假定 state.current.ledger，真实 schema6 当前快照为 state.snapshot.ledger。TypeError: Cannot read properties of undefined (reading 'ledger')。失败发生于任何文件写入前，未调用产品、未修改 state。依据真实 state 顶层结构修正辅助脚本，保留本记录；不属产品缺陷。
