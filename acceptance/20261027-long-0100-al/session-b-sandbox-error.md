# 本轮普通沙箱启动错误

发生在b-001以前；尝试的非产品只读命令为Get-Location。工具原始错误：

```text
exec_command failed: CreateProcess { message: "Rejected(\"Failed to create unified exec process: helper_unknown_error: setup refresh had errors\")" }
```

没有启动capture或产品CLI，没有相应result.json。之后按用户明确允许，为本合成目录的单条命令逐条请求require_escalated审查执行，没有绕过审批。
