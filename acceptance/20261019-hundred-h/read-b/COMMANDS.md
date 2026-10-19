# read-b 实际产品命令

所有产品调用经capture，原输入/输出/退出码在对应commands目录。shell命令以JSON argv保留精确参数，避免引用歧义。

## read-b-draft-107-denied

```json
{
  "exe": "node",
  "args": [
    "acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs",
    "context",
    "--project",
    "acceptance/20261019-hundred-h/work",
    "--purpose",
    "draft",
    "--unit",
    "107"
  ],
  "exit_code": 2
}
```

## read-b-final-check

```json
{
  "exe": "node",
  "args": [
    "acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs",
    "check",
    "--project",
    "acceptance/20261019-hundred-h/work"
  ],
  "exit_code": 0
}
```

## read-b-final-context

```json
{
  "exe": "node",
  "args": [
    "acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs",
    "context",
    "--project",
    "acceptance/20261019-hundred-h/work",
    "--purpose",
    "discussion"
  ],
  "exit_code": 0
}
```

## read-b-final-identify

```json
{
  "exe": "node",
  "args": [
    "acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs",
    "tool",
    "identify",
    "--project",
    "acceptance/20261019-hundred-h/work"
  ],
  "exit_code": 0
}
```

## read-b-final-status

```json
{
  "exe": "node",
  "args": [
    "acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs",
    "status",
    "--project",
    "acceptance/20261019-hundred-h/work"
  ],
  "exit_code": 0
}
```

## read-b-final-updates

```json
{
  "exe": "node",
  "args": [
    "acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs",
    "tool",
    "updates",
    "--project",
    "acceptance/20261019-hundred-h/work"
  ],
  "exit_code": 0
}
```

## read-b-new-compare

```json
{
  "exe": "node",
  "args": [
    "acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs",
    "tool",
    "compare",
    "--project",
    "acceptance/20261019-hundred-h/work",
    "--other",
    "acceptance/20261019-hundred-h/sources/package-v2"
  ],
  "exit_code": 0
}
```

## read-b-new-context

```json
{
  "exe": "node",
  "args": [
    "acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs",
    "context",
    "--project",
    "acceptance/20261019-hundred-h/work",
    "--purpose",
    "discussion"
  ],
  "exit_code": 0
}
```

## read-b-new-doctor

```json
{
  "exe": "node",
  "args": [
    "acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs",
    "doctor",
    "--project",
    "acceptance/20261019-hundred-h/work"
  ],
  "exit_code": 0
}
```

## read-b-new-help

```json
{
  "exe": "node",
  "args": [
    "acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs",
    "help"
  ],
  "exit_code": 0
}
```

## read-b-new-status

```json
{
  "exe": "node",
  "args": [
    "acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs",
    "status",
    "--project",
    "acceptance/20261019-hundred-h/work"
  ],
  "exit_code": 0
}
```

## read-b-new-workflow

```json
{
  "exe": "node",
  "args": [
    "acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs",
    "workflow",
    "show",
    "--project",
    "acceptance/20261019-hundred-h/work"
  ],
  "exit_code": 0
}
```

## read-b-old-context

```json
{
  "exe": "node",
  "args": [
    "acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs",
    "context",
    "--project",
    "acceptance/20261019-hundred-h/work",
    "--purpose",
    "discussion"
  ],
  "exit_code": 0
}
```

## read-b-old-doctor

```json
{
  "exe": "node",
  "args": [
    "acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs",
    "doctor",
    "--project",
    "acceptance/20261019-hundred-h/work"
  ],
  "exit_code": 0
}
```

## read-b-old-help

```json
{
  "exe": "node",
  "args": [
    "acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs",
    "help",
    "--project",
    "acceptance/20261019-hundred-h/work"
  ],
  "exit_code": 2
}
```

## read-b-old-help-corrected

```json
{
  "exe": "node",
  "args": [
    "acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs",
    "help"
  ],
  "exit_code": 0
}
```

## read-b-old-status

```json
{
  "exe": "node",
  "args": [
    "acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs",
    "status",
    "--project",
    "acceptance/20261019-hundred-h/work"
  ],
  "exit_code": 0
}
```

## read-b-old-updates

```json
{
  "exe": "node",
  "args": [
    "acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs",
    "tool",
    "updates",
    "--project",
    "acceptance/20261019-hundred-h/work"
  ],
  "exit_code": 0
}
```

## read-b-old-workflow

```json
{
  "exe": "node",
  "args": [
    "acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs",
    "workflow",
    "show",
    "--project",
    "acceptance/20261019-hundred-h/work"
  ],
  "exit_code": 0
}
```

## read-b-source-compare

```json
{
  "exe": "node",
  "args": [
    "acceptance/20261019-hundred-h/sources/package-v2/bin/ai-writer.mjs",
    "tool",
    "compare",
    "--project",
    "acceptance/20261019-hundred-h/work",
    "--other",
    "acceptance/20261019-hundred-h/sources/package-v2"
  ],
  "exit_code": 0
}
```

## read-b-source-identify

```json
{
  "exe": "node",
  "args": [
    "acceptance/20261019-hundred-h/sources/package-v2/bin/ai-writer.mjs",
    "tool",
    "identify",
    "--project",
    "acceptance/20261019-hundred-h/work"
  ],
  "exit_code": 0
}
```

## read-b-source-plan

```json
{
  "exe": "node",
  "args": [
    "acceptance/20261019-hundred-h/sources/package-v2/bin/ai-writer.mjs",
    "tool",
    "update-plan",
    "--project",
    "acceptance/20261019-hundred-h/work",
    "--source",
    "acceptance/20261019-hundred-h/sources/package-v2"
  ],
  "exit_code": 0
}
```

## read-b-source-tool-help

```json
{
  "exe": "node",
  "args": [
    "acceptance/20261019-hundred-h/sources/package-v2/bin/ai-writer.mjs",
    "help",
    "tool"
  ],
  "exit_code": 0
}
```

## read-b-template-107-denied

```json
{
  "exe": "node",
  "args": [
    "acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs",
    "record-template",
    "--project",
    "acceptance/20261019-hundred-h/work",
    "--unit",
    "107",
    "--draft",
    "正文/0107-未授权.md"
  ],
  "exit_code": 2
}
```

## read-b-update-execute

```json
{
  "exe": "node",
  "args": [
    "acceptance/20261019-hundred-h/sources/package-v2/bin/ai-writer.mjs",
    "tool",
    "update",
    "--project",
    "acceptance/20261019-hundred-h/work",
    "--input",
    "acceptance/20261019-hundred-h/read-b/update-input.json"
  ],
  "exit_code": 0
}
```

## read-b-update-retry

```json
{
  "exe": "node",
  "args": [
    "acceptance/20261019-hundred-h/sources/package-v2/bin/ai-writer.mjs",
    "tool",
    "update",
    "--project",
    "acceptance/20261019-hundred-h/work",
    "--input",
    "acceptance/20261019-hundred-h/read-b/update-input.json"
  ],
  "exit_code": 0
}
```

## read-b-workflow-help

```json
{
  "exe": "node",
  "args": [
    "acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs",
    "help",
    "workflow"
  ],
  "exit_code": 0
}
```

## read-b-workflow-set

```json
{
  "exe": "node",
  "args": [
    "acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs",
    "workflow",
    "set",
    "--project",
    "acceptance/20261019-hundred-h/work",
    "--input",
    "acceptance/20261019-hundred-h/read-b/workflow-input.json"
  ],
  "exit_code": 0
}
```

另有16次统一session-io读稿调用（23–24至53–54），完整argv见command-inventory.json。辅助脚本只处理快照、哈希与报告，不导入产品API。FastCtx文件读取见实际events。
