# read-d 实际命令

产品命令均经 capture.mjs，唯一 read-d-* 标签。帮助按纯文本读取；其他业务输出均实际 JSON.parse。各输入/输出/退出码/state原字节见 commands/<标签>/。无失败产品调用；未重复工具更新。

- `read-d-context-help`：`node acceptance/20261019-hundred-h/capture.mjs read-d-context-help node acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs help context`；exit=0
- `read-d-final-check`：`node acceptance/20261019-hundred-h/capture.mjs read-d-final-check node acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs check --project acceptance/20261019-hundred-h/work`；exit=0
- `read-d-final-status`：`node acceptance/20261019-hundred-h/capture.mjs read-d-final-status node acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs status --project acceptance/20261019-hundred-h/work`；exit=0
- `read-d-final-tool-updates`：`node acceptance/20261019-hundred-h/capture.mjs read-d-final-tool-updates node acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs tool updates --project acceptance/20261019-hundred-h/work`；exit=0
- `read-d-initial-help`：`node acceptance/20261019-hundred-h/capture.mjs read-d-initial-help node acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs help`；exit=0
- `read-d-outline-105`：`node acceptance/20261019-hundred-h/capture.mjs read-d-outline-105 node acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs outline --unit 105 --project acceptance/20261019-hundred-h/work`；exit=0
- `read-d-outline-79`：`node acceptance/20261019-hundred-h/capture.mjs read-d-outline-79 node acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs outline --unit 79 --project acceptance/20261019-hundred-h/work`；exit=0
- `read-d-outline-83`：`node acceptance/20261019-hundred-h/capture.mjs read-d-outline-83 node acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs outline --unit 83 --project acceptance/20261019-hundred-h/work`；exit=0
- `read-d-restore-compare`：`node acceptance/20261019-hundred-h/capture.mjs read-d-restore-compare node acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs tool compare --project acceptance/20261019-hundred-h/work --other acceptance/20261019-hundred-h/sources/package-v2`；exit=0
- `read-d-restore-context`：`node acceptance/20261019-hundred-h/capture.mjs read-d-restore-context node acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs context --purpose discussion --project acceptance/20261019-hundred-h/work`；exit=0
- `read-d-restore-doctor`：`node acceptance/20261019-hundred-h/capture.mjs read-d-restore-doctor node acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs doctor --project acceptance/20261019-hundred-h/work`；exit=0
- `read-d-restore-identify`：`node acceptance/20261019-hundred-h/capture.mjs read-d-restore-identify node acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs tool identify --project acceptance/20261019-hundred-h/work`；exit=0
- `read-d-restore-status`：`node acceptance/20261019-hundred-h/capture.mjs read-d-restore-status node acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs status --project acceptance/20261019-hundred-h/work`；exit=0
- `read-d-restore-workflow`：`node acceptance/20261019-hundred-h/capture.mjs read-d-restore-workflow node acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs workflow show --project acceptance/20261019-hundred-h/work`；exit=0
- `read-d-workflow-stage`：`node acceptance/20261019-hundred-h/capture.mjs read-d-workflow-stage node acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs workflow set --project acceptance/20261019-hundred-h/work --input acceptance/20261019-hundred-h/read-d/workflow-input.json`；exit=0

## 实际逐行阅读

- `node acceptance/20261019-hundred-h/session-io.mjs read-d read acceptance/20261019-hundred-h/work 77 78 baseline-reading`；exit=0。
- `node acceptance/20261019-hundred-h/session-io.mjs read-d read acceptance/20261019-hundred-h/work 79 80 baseline-reading`；exit=0。
- `node acceptance/20261019-hundred-h/session-io.mjs read-d read acceptance/20261019-hundred-h/work 81 82 baseline-reading`；exit=0。
- `node acceptance/20261019-hundred-h/session-io.mjs read-d read acceptance/20261019-hundred-h/work 83 84 baseline-reading`；exit=0。
- `node acceptance/20261019-hundred-h/session-io.mjs read-d read acceptance/20261019-hundred-h/work 85 86 baseline-reading`；exit=0。
- `node acceptance/20261019-hundred-h/session-io.mjs read-d read acceptance/20261019-hundred-h/work 87 88 baseline-reading`；exit=0。
- `node acceptance/20261019-hundred-h/session-io.mjs read-d read acceptance/20261019-hundred-h/work 89 90 baseline-reading`；exit=0。
- `node acceptance/20261019-hundred-h/session-io.mjs read-d read acceptance/20261019-hundred-h/work 91 92 baseline-reading`；exit=0。
- `node acceptance/20261019-hundred-h/session-io.mjs read-d read acceptance/20261019-hundred-h/work 93 94 baseline-reading`；exit=0。
- `node acceptance/20261019-hundred-h/session-io.mjs read-d read acceptance/20261019-hundred-h/work 95 96 baseline-reading`；exit=0。
- `node acceptance/20261019-hundred-h/session-io.mjs read-d read acceptance/20261019-hundred-h/work 97 98 baseline-reading`；exit=0。
- `node acceptance/20261019-hundred-h/session-io.mjs read-d read acceptance/20261019-hundred-h/work 99 100 baseline-reading`；exit=0。
- `node acceptance/20261019-hundred-h/session-io.mjs read-d read acceptance/20261019-hundred-h/work 101 102 baseline-reading`；exit=0。
- `node acceptance/20261019-hundred-h/session-io.mjs read-d read acceptance/20261019-hundred-h/work 103 104 baseline-reading`；exit=0。
- `node acceptance/20261019-hundred-h/session-io.mjs read-d read acceptance/20261019-hundred-h/work 105 106 baseline-reading`；exit=0。
- `node acceptance/20261019-hundred-h/session-io.mjs read-d read acceptance/20261019-hundred-h/work 70 71 candidate-and-payoff-supplement`；exit=0。
- `node acceptance/20261019-hundred-h/session-io.mjs read-d read acceptance/20261019-hundred-h/work 72 73 candidate-and-payoff-supplement`；exit=0。
- `node acceptance/20261019-hundred-h/session-io.mjs read-d read acceptance/20261019-hundred-h/work 74 75 candidate-and-payoff-supplement`；exit=0。
- `node acceptance/20261019-hundred-h/session-io.mjs read-d read acceptance/20261019-hundred-h/work 76 76 candidate-and-payoff-supplement`；exit=0。
- `node acceptance/20261019-hundred-h/session-io.mjs read-d read acceptance/20261019-hundred-h/work 2 3 object-chain-supplement`；exit=0。
- `node acceptance/20261019-hundred-h/session-io.mjs read-d read acceptance/20261019-hundred-h/work 4 4 object-chain-supplement`；exit=0。
- `node acceptance/20261019-hundred-h/session-io.mjs read-d read acceptance/20261019-hundred-h/work 12 12 signal-chain-supplement`；exit=0。
- `node acceptance/20261019-hundred-h/session-io.mjs read-d read acceptance/20261019-hundred-h/work 24 24 signal-and-custody-supplement`；exit=0。
- `node acceptance/20261019-hundred-h/session-io.mjs read-d read acceptance/20261019-hundred-h/work 27 27 paper-and-permission-supplement`；exit=0。
- `node acceptance/20261019-hundred-h/session-io.mjs read-d read acceptance/20261019-hundred-h/work 36 36 initial-brick-observation-supplement`；exit=0。
- `node acceptance/20261019-hundred-h/session-io.mjs read-d read acceptance/20261019-hundred-h/work 1 1 signal-seed-supplement`；exit=0。
- `node acceptance/20261019-hundred-h/session-io.mjs read-d read acceptance/20261019-hundred-h/work 30 30 seat-seed-supplement`；exit=0。

以上27次读取每次1–2章；资源/报告的FastCtx读取及支持脚本见本进程events.jsonl。read-d/evidence.mjs、build-candidates.mjs、verify.mjs、local-exposure-check.mjs及deliver.mjs只处理证据，未导入业务API。父独立退出/审计须另做。
