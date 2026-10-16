# 辅助工具异常原始观察

作品CLI的两次非零结果由cli.mjs在调用当时捕获原始stdout/stderr/子进程退出码，未覆盖日志。辅助工具异常另外保留在本次对话原始工具记录，此处只列观察，不伪造未单独捕获的流。

1. 初次尝试functions批量调用FastCtx，工具接口不存在，抛出TypeError: tools.mcp__fastctx__read is not a function；随后改用真实FastCtx接口，未读到禁读资料、未写文件。
2. 第13章辅助prepare-record首次退出1：Error: Han out of range: 1444；准备在填模板前中止，原文件仍空摘要。随后record空摘要失败真实子进程退出2，见cli/u13-record.*。原始辅助错误来自exec_command，stdout/stderr未在当时分流落盘，原合并工具输出在本次对话；不声称存在当时未捕获的独立raw流。
3. 第10–15章报告补丁首次失败：apply_patch verification failed: invalid patch: The last line of the patch must be '*** End Patch'。未写文件，修正格式后写入成功。

早期commentary按外层exec工具的exit_code1报告作品CLI失败；最终审计使用调用当时spawnSync捕获的作品CLI实际退出2，两个值各自保留，没有将失败改为0。
