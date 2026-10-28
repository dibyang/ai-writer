# G 会话普通命令启动失败

2026-10-27，本轮普通 exec_command 的 Get-Location 在产品运行前报错：
`Failed to create unified exec process: helper_unknown_error: setup refresh had errors`。
随后误发的一条空命令也在启动前收到相同错误，无产品运行。
后续执行只对本授权合成目录的单条命令请求 require_escalated 自动审查，不修改安全设置，不复用批准为批量操作。
