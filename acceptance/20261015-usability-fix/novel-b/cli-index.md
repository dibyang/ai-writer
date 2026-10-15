# 真实 CLI 记录

所有命令从 ai-writer 根目录运行；每项 json 保留命令参数、cwd、UTC 起止时间、exit、stdout、stderr，txt 保留原始输出。

| 记录 | exit | 命令 |
| --- | --- | --- |
| [001-status.json](cli/001-status.json) | 0 | node bin/ai-writer.mjs status --project acceptance/20261015-usability-fix/works/雨后失物 |
| [002-import-status.json](cli/002-import-status.json) | 1 | node bin/ai-writer.mjs import-status --project acceptance/20261015-usability-fix/works/雨后失物 |
| [003-import-relink-help.json](cli/003-import-relink-help.json) | 0 | node bin/ai-writer.mjs import-relink --project acceptance/20261015-usability-fix/works/雨后失物 --help |
| [004-bundled-doctor.json](cli/004-bundled-doctor.json) | 0 | node acceptance/20261015-usability-fix/works/雨后失物/.writer/tool/bin/ai-writer.mjs doctor --project acceptance/20261015-usability-fix/works/雨后失物 |
| [005-bundled-record-help.json](cli/005-bundled-record-help.json) | 0 | node acceptance/20261015-usability-fix/works/雨后失物/.writer/tool/bin/ai-writer.mjs record --project acceptance/20261015-usability-fix/works/雨后失物 --help |
| [006-import-relink.json](cli/006-import-relink.json) | 0 | node bin/ai-writer.mjs import-relink --project acceptance/20261015-usability-fix/works/雨后失物 --input acceptance/20261015-usability-fix/novel-b/relink-input.json --expected-revision 2 |
| [007-import-status.json](cli/007-import-status.json) | 0 | node bin/ai-writer.mjs import-status --project acceptance/20261015-usability-fix/works/雨后失物 |
| [008-import-next.json](cli/008-import-next.json) | 0 | node bin/ai-writer.mjs import-next --project acceptance/20261015-usability-fix/works/雨后失物 |
| [009-status.json](cli/009-status.json) | 0 | node bin/ai-writer.mjs status --project acceptance/20261015-usability-fix/works/雨后失物 --view full |
| [010-plan.json](cli/010-plan.json) | 0 | node bin/ai-writer.mjs plan --project acceptance/20261015-usability-fix/works/雨后失物 --input acceptance/20261015-usability-fix/works/雨后失物/.writer/novel-b-plan-0002.json |
| [011-context.json](cli/011-context.json) | 0 | node bin/ai-writer.mjs context --project acceptance/20261015-usability-fix/works/雨后失物 --unit 2 |
| [012-record-template.json](cli/012-record-template.json) | 0 | node bin/ai-writer.mjs record-template --project acceptance/20261015-usability-fix/works/雨后失物 --unit 2 --draft 正文/0002-导入.md |
| [013-record.json](cli/013-record.json) | 0 | node bin/ai-writer.mjs record --project acceptance/20261015-usability-fix/works/雨后失物 --input acceptance/20261015-usability-fix/works/雨后失物/.writer/novel-b-record-baseline-0002.json |
| [014-import-status.json](cli/014-import-status.json) | 0 | node bin/ai-writer.mjs import-status --project acceptance/20261015-usability-fix/works/雨后失物 |
| [015-plan.json](cli/015-plan.json) | 0 | node bin/ai-writer.mjs plan --project acceptance/20261015-usability-fix/works/雨后失物 --input acceptance/20261015-usability-fix/works/雨后失物/.writer/novel-b-plan-0003.json |
| [016-context.json](cli/016-context.json) | 0 | node bin/ai-writer.mjs context --project acceptance/20261015-usability-fix/works/雨后失物 --unit 3 |
| [017-record-template.json](cli/017-record-template.json) | 0 | node bin/ai-writer.mjs record-template --project acceptance/20261015-usability-fix/works/雨后失物 --unit 3 --draft 正文/0003-盒盖里面.md |
| [018-record.json](cli/018-record.json) | 0 | node bin/ai-writer.mjs record --project acceptance/20261015-usability-fix/works/雨后失物 --input acceptance/20261015-usability-fix/works/雨后失物/.writer/novel-b-record-baseline-0003.json |
| [019-status.json](cli/019-status.json) | 0 | node bin/ai-writer.mjs status --project acceptance/20261015-usability-fix/works/雨后失物 |
| [020-style-scan.json](cli/020-style-scan.json) | 0 | node bin/ai-writer.mjs style-scan --project acceptance/20261015-usability-fix/works/雨后失物 --draft 正文/0001-导入.md |
| [021-style-scan.json](cli/021-style-scan.json) | 0 | node bin/ai-writer.mjs style-scan --project acceptance/20261015-usability-fix/works/雨后失物 --draft 正文/0002-导入.md |
| [022-style-scan.json](cli/022-style-scan.json) | 0 | node bin/ai-writer.mjs style-scan --project acceptance/20261015-usability-fix/works/雨后失物 --draft 正文/0003-盒盖里面.md |
| [023-rewind-help.json](cli/023-rewind-help.json) | 0 | node bin/ai-writer.mjs rewind --project acceptance/20261015-usability-fix/works/雨后失物 --help |
| [024-review-help.json](cli/024-review-help.json) | 0 | node bin/ai-writer.mjs review --project acceptance/20261015-usability-fix/works/雨后失物 --help |
| [025-export-help.json](cli/025-export-help.json) | 0 | node bin/ai-writer.mjs export --project acceptance/20261015-usability-fix/works/雨后失物 --help |
| [026-rewind.json](cli/026-rewind.json) | 0 | node bin/ai-writer.mjs rewind --project acceptance/20261015-usability-fix/works/雨后失物 --from 1 --expected-revision 4 |
| [027-status.json](cli/027-status.json) | 0 | node bin/ai-writer.mjs status --project acceptance/20261015-usability-fix/works/雨后失物 |
| [028-context.json](cli/028-context.json) | 0 | node bin/ai-writer.mjs context --project acceptance/20261015-usability-fix/works/雨后失物 --unit 1 |
| [029-record-template.json](cli/029-record-template.json) | 0 | node bin/ai-writer.mjs record-template --project acceptance/20261015-usability-fix/works/雨后失物 --unit 1 --draft 正文/0001-导入.md |
| [030-record.json](cli/030-record.json) | 0 | node bin/ai-writer.mjs record --project acceptance/20261015-usability-fix/works/雨后失物 --input acceptance/20261015-usability-fix/works/雨后失物/.writer/novel-b-record-final-0001.json |
| [031-context.json](cli/031-context.json) | 0 | node bin/ai-writer.mjs context --project acceptance/20261015-usability-fix/works/雨后失物 --unit 2 |
| [032-record-template.json](cli/032-record-template.json) | 0 | node bin/ai-writer.mjs record-template --project acceptance/20261015-usability-fix/works/雨后失物 --unit 2 --draft 正文/0002-导入.md |
| [033-record.json](cli/033-record.json) | 0 | node bin/ai-writer.mjs record --project acceptance/20261015-usability-fix/works/雨后失物 --input acceptance/20261015-usability-fix/works/雨后失物/.writer/novel-b-record-final-0002.json |
| [034-context.json](cli/034-context.json) | 0 | node bin/ai-writer.mjs context --project acceptance/20261015-usability-fix/works/雨后失物 --unit 3 |
| [035-record-template.json](cli/035-record-template.json) | 0 | node bin/ai-writer.mjs record-template --project acceptance/20261015-usability-fix/works/雨后失物 --unit 3 --draft 正文/0003-盒盖里面.md |
| [036-record.json](cli/036-record.json) | 0 | node bin/ai-writer.mjs record --project acceptance/20261015-usability-fix/works/雨后失物 --input acceptance/20261015-usability-fix/works/雨后失物/.writer/novel-b-record-final-0003.json |
| [037-style-scan.json](cli/037-style-scan.json) | 0 | node bin/ai-writer.mjs style-scan --project acceptance/20261015-usability-fix/works/雨后失物 --draft 正文/0001-导入.md |
| [038-style-scan.json](cli/038-style-scan.json) | 0 | node bin/ai-writer.mjs style-scan --project acceptance/20261015-usability-fix/works/雨后失物 --draft 正文/0002-导入.md |
| [039-style-scan.json](cli/039-style-scan.json) | 0 | node bin/ai-writer.mjs style-scan --project acceptance/20261015-usability-fix/works/雨后失物 --draft 正文/0003-盒盖里面.md |
| [040-import-status.json](cli/040-import-status.json) | 0 | node bin/ai-writer.mjs import-status --project acceptance/20261015-usability-fix/works/雨后失物 |
| [041-status.json](cli/041-status.json) | 0 | node bin/ai-writer.mjs status --project acceptance/20261015-usability-fix/works/雨后失物 |
| [042-rewind.json](cli/042-rewind.json) | 0 | node bin/ai-writer.mjs rewind --project acceptance/20261015-usability-fix/works/雨后失物 --from 3 --expected-revision 8 |
| [043-context.json](cli/043-context.json) | 0 | node bin/ai-writer.mjs context --project acceptance/20261015-usability-fix/works/雨后失物 --unit 3 |
| [044-record-template.json](cli/044-record-template.json) | 0 | node bin/ai-writer.mjs record-template --project acceptance/20261015-usability-fix/works/雨后失物 --unit 3 --draft 正文/0003-盒盖里面.md |
| [045-record.json](cli/045-record.json) | 0 | node bin/ai-writer.mjs record --project acceptance/20261015-usability-fix/works/雨后失物 --input acceptance/20261015-usability-fix/works/雨后失物/.writer/novel-b-record-final-0003-r10.json |
| [046-status.json](cli/046-status.json) | 0 | node bin/ai-writer.mjs status --project acceptance/20261015-usability-fix/works/雨后失物 --view full |
| [047-style-scan.json](cli/047-style-scan.json) | 0 | node bin/ai-writer.mjs style-scan --project acceptance/20261015-usability-fix/works/雨后失物 --draft 正文/0003-盒盖里面.md |
| [048-rewind.json](cli/048-rewind.json) | 0 | node bin/ai-writer.mjs rewind --project acceptance/20261015-usability-fix/works/雨后失物 --from 3 --expected-revision 10 |
| [049-context.json](cli/049-context.json) | 0 | node bin/ai-writer.mjs context --project acceptance/20261015-usability-fix/works/雨后失物 --unit 3 |
| [050-record-template.json](cli/050-record-template.json) | 0 | node bin/ai-writer.mjs record-template --project acceptance/20261015-usability-fix/works/雨后失物 --unit 3 --draft 正文/0003-盒盖里面.md |
| [051-record.json](cli/051-record.json) | 0 | node bin/ai-writer.mjs record --project acceptance/20261015-usability-fix/works/雨后失物 --input acceptance/20261015-usability-fix/works/雨后失物/.writer/novel-b-record-final-0003-r12.json |
| [052-review.json](cli/052-review.json) | 0 | node bin/ai-writer.mjs review --project acceptance/20261015-usability-fix/works/雨后失物 --input acceptance/20261015-usability-fix/works/雨后失物/.writer/novel-b-review-final.json |
| [053-check.json](cli/053-check.json) | 0 | node bin/ai-writer.mjs check --project acceptance/20261015-usability-fix/works/雨后失物 |
| [054-export.json](cli/054-export.json) | 0 | node bin/ai-writer.mjs export --project acceptance/20261015-usability-fix/works/雨后失物 --out acceptance/20261015-usability-fix/novel-b/export |
| [055-status.json](cli/055-status.json) | 0 | node bin/ai-writer.mjs status --project acceptance/20261015-usability-fix/works/雨后失物 |
| [056-import-status.json](cli/056-import-status.json) | 0 | node bin/ai-writer.mjs import-status --project acceptance/20261015-usability-fix/works/雨后失物 |
| [057-bundled-doctor.json](cli/057-bundled-doctor.json) | 0 | node acceptance/20261015-usability-fix/works/雨后失物/.writer/tool/bin/ai-writer.mjs doctor --project acceptance/20261015-usability-fix/works/雨后失物 |
