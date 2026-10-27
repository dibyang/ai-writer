# 最终核验汇总脚本的报告格式断言错误

2026-10-25T16:33Z左右，完整命令审计成功生成853条CLI/18次原生进程；随后finalize-verification错误假定npm test为TAP的“# tests 229”汇总，而本机Node默认spec报告实际用“ℹ tests 229”。因此汇总断言失败，verification.json尚未生成，产品、正文和状态未变。实际原始测试exit0且计数仍229/227/0/2，stdout哈希未变。

保留原脚本before.mjs后仅改辅助正则，接受行首spec的ℹ或TAP的#，仍要求完整固定计数229 tests /227 pass /0 fail /2 skipped，并比对原stdout SHA和成功exit，不能放宽为只认退出码或重写测试输出。原失败工具输出仍保留；无需重跑已通过的产品测试。
