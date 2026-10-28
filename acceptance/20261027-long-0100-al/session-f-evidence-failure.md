# F轮证据核对失败：已停止后续产品写入

命令：`node ../f-evidence.mjs preview-check 118 f-010-preview118`

运行目录：本轮合成work。产品preview本身成功；以下是随后独立证据脚本的原始stderr与退出码，不冒称产品prepare失败。

exit_code：1

```text
node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:

  assert.ok(equal(normalize(v.changes),patch(main,m.units[n-1])))

    at file:///D:/work/other/ai-writer/acceptance/20261027-long-0100-al/f-evidence.mjs:44:173
    at ModuleJob.run (node:internal/modules/esm/module_job:437:25)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
  generatedMessage: true,
  code: 'ERR_ASSERTION',
  actual: false,
  expected: true,
  operator: '==',
  diff: 'simple'
}

Node.js v24.15.0
```

完整原始工具返回另存 `session-f-failure-tool-result.json`。

按本轮明确指令停止，不运行118 record、正式rolling review、revision prepare或revision commit；不修改断言迎合结果。后续仅只读定位并保存父目录证据与结案报告。
