# 收尾辅助校验失败及核因

final-b-stop-audit.mjs实际退出1，stderr为“Error: Audit mismatch; stop and inspect final-b-stop-audit.json”，栈位置为该文件第15行。报告先落盘后断言失败；立即停止依赖步骤，没有写交接或执行产品下游操作。

实际唯一差异：U/commands/final-codex-b-first/stdout.raw.txt。本进程未写该路径；它是正在记录本次根执行的外层日志。初版辅助校验把这份持续增长的外层日志也当成了冻结只读材料。主稿state与三章、修订来源、不可变观察、产品CLI均无失败或差异。

不改初版清单/报告/失败脚本，也不追认新日志字节为原快照。新的v2辅助校验将用初版SHA定位该文件的真实原前缀，只有能证明原前缀完整保留且仅追加时才单列为外层动态日志；其他受保护文件仍按原SHA逐项比较。若前缀不匹配则继续停止核查。
