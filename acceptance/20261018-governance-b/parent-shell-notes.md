# 父会话辅助命令诊断

本页为工具回包的人工整理，不冒充 capture 自动生成的原始 stdout。

- 新增消费引用异常用例时，命令中的 `--test-name-pattern=已消费作者决策|登记的历史授权` 未加引号，PowerShell 将竖线解释为管道，报“登记的历史授权不是可识别命令”。
- 随后 Test-Path 核对 `commands/consumed-trace-before` 返回 False。记录器在调用产品前必先创建该目录，因此产品测试未启动；没有使用无文件参数的 Node 自动发现去执行历史目录测试。
- 辅助的 Get-CimInstance 进程查询被本机 CIM 权限拒绝；该只读查询未执行变更，也没有因此提高权限或终止其他进程。
- 正确引用筛选参数后以新标签 `consumed-trace-before-quoted` 保存真实回归结果。原生小说修订由另一独立进程运行，未受这条命令控制。
- 最后汇总时，一次只读辅助命令把记录器输出文件误写成 `stdout.log`，读取 `final-doctor` 后报 ENOENT。实际文件是 `stdout.raw.txt`，更正后读取成功；没有重跑或改写测试结果，也未发生产品调用或作品变更。
- 总报告首次链接检查把本次正在生成的result.json也列为必须已存在，产生自引用顺序错误。完整失败在commands/final-report-links中；链接入口改为记录器预先建立的目录后以新标签重试，不改写第一次结果或产品。
