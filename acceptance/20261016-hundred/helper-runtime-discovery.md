# 逐句差异阅读辅助的运行环境

系统命令`python --version`首次发现失败：exec_command返回exit1、ResourceUnavailable，WindowsApps的python.exe别名无法访问。该次只有工具合并回包，未捕获独立stdout/stderr原始字节；不能补造分流日志。这不是产品故障。

随后通过Codex现有工作区依赖定位到已安装的Python：`C:/Users/admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe`。没有安装Python、没有新增主工具依赖或修改全局配置。

render-revision-diff.py只读实际逐单元对照JSON，用标准库difflib生成句级阅读材料及每处对应的精确单元/字段；不写作品权威状态、不自动给语义批准。第一次真实运行argv、退出码和原始分流输出在parent-commands/render-revision-a-diff/。

对已有A数据321个变化单元格，原窗口稿186023字节/70661字符/616行；新稿57997字节/25681字符/2425行，每行包到120字符以避免长行截断。体积减少属于辅助阅读材料，不代表小说、工具性能或语义验收通过。原始完整before/after对照与窗口稿都保留。

只抽读新展示前120行核对格式及绑定；A此前已有独立语义复核，不能将本次格式核对写成重读全部新差异。后续B/C仍须逐项复核正文、改后知识与应改未改的内容，机械差异不会发现所有语义陈旧。
