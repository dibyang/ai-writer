# 真实 CLI 命令与原始输出

所有 invocation.json 的 entry 均为用户指定冻结包入口；cwd 为本 phase。result.json 中 CLI 退出码由 Node spawnSync 原值记录，预期拒绝为 2；外层 PowerShell 在该环境中报告 1，不替换原始 CLI 退出码。原始 stdout/stderr 分别保存，不合并、不覆盖。

| 标签 | 参数 | CLI 退出码 | stdout | stderr |
| --- | --- | ---: | --- | --- |
| check | `check --project ./work` | 0 | [原始输出](evidence/check/stdout.txt) | [原始错误](evidence/check/stderr.txt) |
| decision-author-direction | `decision set --project ./work --input ./work/.writer/method-direction-input.json` | 0 | [原始输出](evidence/decision-author-direction/stdout.txt) | [原始错误](evidence/decision-author-direction/stderr.txt) |
| decision-current | `decision current --project ./work` | 0 | [原始输出](evidence/decision-current/stdout.txt) | [原始错误](evidence/decision-current/stderr.txt) |
| decision-stage-candidate | `decision set --project ./work --input ./work/.writer/method-candidate-input.json` | 0 | [原始输出](evidence/decision-stage-candidate/stdout.txt) | [原始错误](evidence/decision-stage-candidate/stderr.txt) |
| deny-draft-context | `context --project ./work --purpose draft --unit 1` | 2 | [原始输出](evidence/deny-draft-context/stdout.txt) | [原始错误](evidence/deny-draft-context/stderr.txt) |
| deny-record-template | `record-template --project ./work --unit 1 --draft 正文/0001-拒绝测试.md` | 2 | [原始输出](evidence/deny-record-template/stdout.txt) | [原始错误](evidence/deny-record-template/stderr.txt) |
| discussion-context | `context --project ./work --purpose discussion` | 0 | [原始输出](evidence/discussion-context/stdout.txt) | [原始错误](evidence/discussion-context/stderr.txt) |
| doctor | `doctor --project ./work` | 0 | [原始输出](evidence/doctor/stdout.txt) | [原始错误](evidence/doctor/stderr.txt) |
| help-context | `context --help` | 0 | [原始输出](evidence/help-context/stdout.txt) | [原始错误](evidence/help-context/stderr.txt) |
| help-doctor | `doctor --help` | 0 | [原始输出](evidence/help-doctor/stdout.txt) | [原始错误](evidence/help-doctor/stderr.txt) |
| help-init | `init --help` | 0 | [原始输出](evidence/help-init/stdout.txt) | [原始错误](evidence/help-init/stderr.txt) |
| help-plan | `plan --help` | 0 | [原始输出](evidence/help-plan/stdout.txt) | [原始错误](evidence/help-plan/stderr.txt) |
| help-volume | `volume --help` | 0 | [原始输出](evidence/help-volume/stdout.txt) | [原始错误](evidence/help-volume/stderr.txt) |
| help-workflow | `workflow set --help` | 0 | [原始输出](evidence/help-workflow/stdout.txt) | [原始错误](evidence/help-workflow/stderr.txt) |
| init | `init --path ./work --kind novel --title 补帆人 --mode long` | 0 | [原始输出](evidence/init/stdout.txt) | [原始错误](evidence/init/stderr.txt) |
| plan-1 | `plan --project ./work --input ./work/.writer/method-plan-1.json` | 0 | [原始输出](evidence/plan-1/stdout.txt) | [原始错误](evidence/plan-1/stderr.txt) |
| plan-2 | `plan --project ./work --input ./work/.writer/method-plan-2.json` | 0 | [原始输出](evidence/plan-2/stdout.txt) | [原始错误](evidence/plan-2/stderr.txt) |
| plan-3 | `plan --project ./work --input ./work/.writer/method-plan-3.json` | 0 | [原始输出](evidence/plan-3/stdout.txt) | [原始错误](evidence/plan-3/stderr.txt) |
| status-after-denial | `status --project ./work` | 0 | [原始输出](evidence/status-after-denial/stdout.txt) | [原始错误](evidence/status-after-denial/stderr.txt) |
| status-before-denial | `status --project ./work` | 0 | [原始输出](evidence/status-before-denial/stdout.txt) | [原始错误](evidence/status-before-denial/stderr.txt) |
| status-initial | `status --project ./work` | 0 | [原始输出](evidence/status-initial/stdout.txt) | [原始错误](evidence/status-initial/stderr.txt) |
| volume-v1 | `volume --project ./work --input ./work/.writer/method-volume-v1.json` | 0 | [原始输出](evidence/volume-v1/stdout.txt) | [原始错误](evidence/volume-v1/stderr.txt) |
| volume-v2 | `volume --project ./work --input ./work/.writer/method-volume-v2.json` | 0 | [原始输出](evidence/volume-v2/stdout.txt) | [原始错误](evidence/volume-v2/stderr.txt) |
| workflow-restored | `workflow show --project ./work` | 0 | [原始输出](evidence/workflow-restored/stdout.txt) | [原始错误](evidence/workflow-restored/stderr.txt) |
| workflow-set | `workflow set --project ./work --input ./work/.writer/method-workflow-input.json` | 0 | [原始输出](evidence/workflow-set/stdout.txt) | [原始错误](evidence/workflow-set/stderr.txt) |
