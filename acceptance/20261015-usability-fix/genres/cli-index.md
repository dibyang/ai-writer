# 实际 CLI 调用索引

全部从 `D:/work/other/ai-writer` 启动真实 Node 进程。记录含 argv、cwd、时间、stdout、stderr、退出码；审修由本会话按技能实读完成。入口说明阶段另调用主 CLI 的 init/plan/record/export 帮助与 doctor，输出在会话工具记录中。以下为建档后完整落盘的 62 次调用。

| 序号 | 命令 | CLI | 退出码 | 原始证据 |
| --- | --- | --- | --- | --- |
| 1 | init | 主项目 | 0 | [日志](cli/001-init-screenplay.json) |
| 2 | init | 主项目 | 0 | [日志](cli/002-init-history.json) |
| 3 | plan | 主项目 | 0 | [日志](cli/003-plan-screenplay.json) |
| 4 | plan | 主项目 | 0 | [日志](cli/004-plan-history.json) |
| 5 | context | 主项目 | 0 | [日志](cli/005-context-screenplay-baseline.json) |
| 6 | context | 主项目 | 0 | [日志](cli/006-context-history-baseline.json) |
| 7 | record-template | 主项目 | 0 | [日志](cli/007-template-screenplay-baseline.json) |
| 8 | record-template | 主项目 | 0 | [日志](cli/008-template-history-baseline.json) |
| 9 | record | 主项目 | 0 | [日志](cli/009-record-screenplay-baseline.json) |
| 10 | record | 主项目 | 0 | [日志](cli/010-record-history-baseline.json) |
| 11 | status | 主项目 | 0 | [日志](cli/011-status-screenplay-baseline.json) |
| 12 | status | 主项目 | 0 | [日志](cli/012-status-history-baseline.json) |
| 13 | style-scan | 主项目 | 0 | [日志](cli/013-scan-screenplay-before.json) |
| 14 | style-scan | 主项目 | 0 | [日志](cli/014-scan-history-before.json) |
| 15 | check | 主项目 | 0 | [日志](cli/015-check-screenplay-baseline.json) |
| 16 | check | 主项目 | 0 | [日志](cli/016-check-history-baseline.json) |
| 17 | rewind | 主项目 | 0 | [日志](cli/017-rewind-screenplay.json) |
| 18 | rewind | 主项目 | 0 | [日志](cli/018-rewind-history.json) |
| 19 | status | 主项目 | 0 | [日志](cli/019-status-screenplay-rewound.json) |
| 20 | status | 主项目 | 0 | [日志](cli/020-status-history-rewound.json) |
| 21 | context | 主项目 | 0 | [日志](cli/021-context-screenplay-final.json) |
| 22 | context | 主项目 | 0 | [日志](cli/022-context-history-final.json) |
| 23 | record-template | 主项目 | 0 | [日志](cli/023-template-screenplay-final.json) |
| 24 | record-template | 主项目 | 0 | [日志](cli/024-template-history-final.json) |
| 25 | style-scan | 主项目 | 0 | [日志](cli/025-scan-screenplay-after.json) |
| 26 | style-scan | 主项目 | 0 | [日志](cli/026-scan-history-after.json) |
| 27 | record | 主项目 | 0 | [日志](cli/027-record-screenplay-final.json) |
| 28 | record | 主项目 | 0 | [日志](cli/028-record-history-final.json) |
| 29 | check | 主项目 | 0 | [日志](cli/029-check-screenplay-final.json) |
| 30 | check | 主项目 | 0 | [日志](cli/030-check-history-final.json) |
| 31 | status | 主项目 | 0 | [日志](cli/031-status-screenplay-final.json) |
| 32 | status | 主项目 | 0 | [日志](cli/032-status-history-final.json) |
| 33 | export | 主项目 | 0 | [日志](cli/033-export-screenplay.json) |
| 34 | export | 主项目 | 0 | [日志](cli/034-export-history.json) |
| 35 | doctor | 随附剧本 | 0 | [日志](cli/bundled-screenplay-doctor.json) |
| 36 | status | 随附剧本 | 0 | [日志](cli/bundled-screenplay-status.json) |
| 37 | init --help | 随附剧本 | 2 | [日志](cli/bundled-screenplay-init-help.json) |
| 38 | plan --help | 随附剧本 | 0 | [日志](cli/bundled-screenplay-plan-help.json) |
| 39 | context --help | 随附剧本 | 0 | [日志](cli/bundled-screenplay-context-help.json) |
| 40 | record-template --help | 随附剧本 | 0 | [日志](cli/bundled-screenplay-record-template-help.json) |
| 41 | record --help | 随附剧本 | 0 | [日志](cli/bundled-screenplay-record-help.json) |
| 42 | rewind --help | 随附剧本 | 0 | [日志](cli/bundled-screenplay-rewind-help.json) |
| 43 | style-scan --help | 随附剧本 | 0 | [日志](cli/bundled-screenplay-style-scan-help.json) |
| 44 | check --help | 随附剧本 | 0 | [日志](cli/bundled-screenplay-check-help.json) |
| 45 | export --help | 随附剧本 | 0 | [日志](cli/bundled-screenplay-export-help.json) |
| 46 | status --help | 随附剧本 | 0 | [日志](cli/bundled-screenplay-status-help.json) |
| 47 | doctor --help | 随附剧本 | 0 | [日志](cli/bundled-screenplay-doctor-help.json) |
| 48 | doctor | 随附历史 | 0 | [日志](cli/bundled-history-doctor.json) |
| 49 | status | 随附历史 | 0 | [日志](cli/bundled-history-status.json) |
| 50 | init --help | 随附历史 | 2 | [日志](cli/bundled-history-init-help.json) |
| 51 | plan --help | 随附历史 | 0 | [日志](cli/bundled-history-plan-help.json) |
| 52 | context --help | 随附历史 | 0 | [日志](cli/bundled-history-context-help.json) |
| 53 | record-template --help | 随附历史 | 0 | [日志](cli/bundled-history-record-template-help.json) |
| 54 | record --help | 随附历史 | 0 | [日志](cli/bundled-history-record-help.json) |
| 55 | rewind --help | 随附历史 | 0 | [日志](cli/bundled-history-rewind-help.json) |
| 56 | style-scan --help | 随附历史 | 0 | [日志](cli/bundled-history-style-scan-help.json) |
| 57 | check --help | 随附历史 | 0 | [日志](cli/bundled-history-check-help.json) |
| 58 | export --help | 随附历史 | 0 | [日志](cli/bundled-history-export-help.json) |
| 59 | status --help | 随附历史 | 0 | [日志](cli/bundled-history-status-help.json) |
| 60 | doctor --help | 随附历史 | 0 | [日志](cli/bundled-history-doctor-help.json) |
| 61 | init --help | 随附剧本 | 0 | [日志](cli/bundled-screenplay-init-help-corrected.json) |
| 62 | init --help | 随附历史 | 0 | [日志](cli/bundled-history-init-help-corrected.json) |

两次 init 帮助退出 2 是验收脚本误传不适用的 --project，原日志保留；最后两条改用正确 init --help，均退出 0。不得将两次拒绝计为有效帮助通过，也不将其称为产品功能故障。
