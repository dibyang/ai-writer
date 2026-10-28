# E轮普通沙箱启动失败

首次 exec_command 为只读 Get-Location，在运行产品前失败：
`CreateProcess Rejected: Failed to create unified exec process: helper_unknown_error: setup refresh had errors`。

该次未运行产品、未产生 capture 产品结果。后续按用户本轮明示授权，每条合成目录命令单独申请 require_escalated 自动审查；没有关闭或绕过审批。
