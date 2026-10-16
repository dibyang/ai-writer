# 启动日志边界

首条exec启动时提交给PowerShell的cmd为：

```text
node --input-type=module -e "import {createRunner} from './acceptance/20261016-hundred/command-runner.mjs'; const r=createRunner('acceptance/20261016-hundred/session-10'); console.log(await r.run(process.execPath,['--version'],'bootstrap-node'));"
```

这是提交的shell命令文本，不伪称OS重新采集的外层argv。该exec工具回包只暴露合并output、exit_code=0、wall_time_seconds=0.3649228、chunk_id=a09305；未获得外层stdout/stderr原字节，未补造分流文件。其真正子进程node --version的executable/argv、退出码0、分流原始stdout/stderr和66ms耗时由共享runner原生保存于commands/index.jsonl的bootstrap-node精确标签。起点取该原生记录的2026-10-16T10:40:05.481Z。

后续CLI和辅助子进程均经本阶段薄包装/共享runner捕获，绝不将结果摘要或JSON解析字段冒充CLI原始输出。非CLI apply_patch失败另记tool-errors.jsonl，不捏造其原生退出码或分流字节。
