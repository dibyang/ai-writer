# 初始失败与边界

- Git add默认沙箱无法创建.git/index.lock；按明确本地提交授权提权完成，未推送。
- T原始记录按.gitattributes `* -text` 保留CRLF等字节。全暂存diff --check退出非0，34,646条诊断全部在T目录；产品文件检查退出0，详见原始输出及分类JSON。没有为消除格式诊断改封存内容。
- 首次delivery-flow六测试：4通过/1失败/1 Windows symlink权限跳过。失败为第一项正向合章，fs.linkSync在当前沙箱返回EPERM；尚未创建正式正文、临时文件已清理。改为完整临时文件+COPYFILE_EXCL，保留独占不覆盖。独占复制不承诺断电原子性，中断后须按receipt/片段重新核字节，发现残稿保留并另存新路径，不自动覆盖。
- WSL存在可执行文件，但wsl --list --quiet退出1，Wsl/E_ACCESSDENIED；未安装或启用环境、未改全局权限，不将它当Linux测试通过。
- 第一轮测试命令直接由终端工具返回，未使用本轮后续capture日志包装；本页保留原失败摘要，不能宣称所有初始命令都有独立stdout文件。
