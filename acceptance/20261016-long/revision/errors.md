# 本次调用错误原始记录

以下为调用参数／编排错误；修正后真实CLI继续完成。没有修改产品或手改state/journal。

首个工具编排调用在尝试从functions工具列表寻址FastCtx时失败，尚未进行任何作品修改：

```text
Script failed
Script error:
TypeError: tools[(intermediate value)] is not a function
    at exec_main.mjs:3:302
    at Array.map (<anonymous>)
    at exec_main.mjs:3:221
```

随后改用直接FastCtx调用。CLI非零退出共1次；原始argv、stdout与stderr另存cli-session.jsonl：

```json
{
  "time": "2026-10-15T16:39:57.003Z",
  "argv": [
    "C:\\Program Files\\nodejs\\node.exe",
    "bin/ai-writer.mjs",
    "record-template",
    "--project",
    "D:\\work\\other\\ai-writer\\acceptance\\20261016-long\\works\\雨线档案",
    "--unit",
    "2",
    "--draft",
    "正文/0002-封套里面.md",
    "--max-chars",
    "60000"
  ],
  "exit": 2,
  "stdout": "",
  "stderr": "{\n  \"ok\": false,\n  \"error\": \"无效、重复或缺值参数：--max-chars\",\n  \"code\": \"COMMAND_FAILED\",\n  \"next_action\": \"按报错核对输入，查看本命令帮助。\",\n  \"help_command\": \"node 'D:\\\\work\\\\other\\\\ai-writer\\\\bin\\\\ai-writer.mjs' record-template '--help'\"\n}\n"
}
```

record-template不支持--max-chars；删除该额外参数后重新取模板，未复用失败模板或旧哈希。
