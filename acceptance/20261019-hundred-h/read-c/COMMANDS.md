# read-c 实际产品命令

均经H轮capture.mjs，输入/输出/退出码/state原字节见commands/<标签>/。两次参数错误保留，未修改工具。整读命令每次2章，由session-io保存版本；完整shell/工具事件另在events.jsonl。

- `read-c-context-corrected`：`node acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs context --project acceptance/20261019-hundred-h/work --purpose discussion --max-chars 60000`；exit=0
- `read-c-discussion-context`：`node acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs discussion context --project acceptance/20261019-hundred-h/work`；exit=2
- `read-c-doctor`：`node acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs doctor --project acceptance/20261019-hundred-h/work`；exit=0
- `read-c-final-check`：`node acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs check --project acceptance/20261019-hundred-h/work`；exit=0
- `read-c-final-status`：`node acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs status --project acceptance/20261019-hundred-h/work`；exit=0
- `read-c-final-workflow`：`node acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs workflow show --project acceptance/20261019-hundred-h/work`；exit=0
- `read-c-help`：`node acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs help --project acceptance/20261019-hundred-h/work`；exit=2
- `read-c-help-context`：`node acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs help context`；exit=0
- `read-c-help-corrected`：`node acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs help`；exit=0
- `read-c-help-workflow`：`node acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs help workflow`；exit=0
- `read-c-identify`：`node acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs tool identify --project acceptance/20261019-hundred-h/work`；exit=0
- `read-c-status`：`node acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs status --project acceptance/20261019-hundred-h/work`；exit=0
- `read-c-workflow-set`：`node acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs workflow set --project acceptance/20261019-hundred-h/work --input acceptance/20261019-hundred-h/read-c/workflow-input.json`；exit=0
- `read-c-workflow-show`：`node acceptance/20261019-hundred-h/work/.writer/tool/bin/ai-writer.mjs workflow show --project acceptance/20261019-hundred-h/work`；exit=0

- `node acceptance/20261019-hundred-h/session-io.mjs read-c read acceptance/20261019-hundred-h/work 50 51 baseline-reading`；exit=0，实际完整编号输出。
- `node acceptance/20261019-hundred-h/session-io.mjs read-c read acceptance/20261019-hundred-h/work 52 53 baseline-reading`；exit=0，实际完整编号输出。
- `node acceptance/20261019-hundred-h/session-io.mjs read-c read acceptance/20261019-hundred-h/work 54 55 baseline-reading`；exit=0，实际完整编号输出。
- `node acceptance/20261019-hundred-h/session-io.mjs read-c read acceptance/20261019-hundred-h/work 56 57 baseline-reading`；exit=0，实际完整编号输出。
- `node acceptance/20261019-hundred-h/session-io.mjs read-c read acceptance/20261019-hundred-h/work 58 59 baseline-reading`；exit=0，实际完整编号输出。
- `node acceptance/20261019-hundred-h/session-io.mjs read-c read acceptance/20261019-hundred-h/work 60 61 baseline-reading`；exit=0，实际完整编号输出。
- `node acceptance/20261019-hundred-h/session-io.mjs read-c read acceptance/20261019-hundred-h/work 62 63 baseline-reading`；exit=0，实际完整编号输出。
- `node acceptance/20261019-hundred-h/session-io.mjs read-c read acceptance/20261019-hundred-h/work 64 65 baseline-reading`；exit=0，实际完整编号输出。
- `node acceptance/20261019-hundred-h/session-io.mjs read-c read acceptance/20261019-hundred-h/work 66 67 baseline-reading`；exit=0，实际完整编号输出。
- `node acceptance/20261019-hundred-h/session-io.mjs read-c read acceptance/20261019-hundred-h/work 68 69 baseline-reading`；exit=0，实际完整编号输出。
- `node acceptance/20261019-hundred-h/session-io.mjs read-c read acceptance/20261019-hundred-h/work 70 71 baseline-reading`；exit=0，实际完整编号输出。
- `node acceptance/20261019-hundred-h/session-io.mjs read-c read acceptance/20261019-hundred-h/work 72 73 baseline-reading`；exit=0，实际完整编号输出。
- `node acceptance/20261019-hundred-h/session-io.mjs read-c read acceptance/20261019-hundred-h/work 74 75 baseline-reading`；exit=0，实际完整编号输出。
- `node acceptance/20261019-hundred-h/session-io.mjs read-c read acceptance/20261019-hundred-h/work 76 77 baseline-reading`；exit=0，实际完整编号输出。
- `node acceptance/20261019-hundred-h/session-io.mjs read-c read acceptance/20261019-hundred-h/work 78 79 baseline-reading`；exit=0，实际完整编号输出。
- `node acceptance/20261019-hundred-h/session-io.mjs read-c read acceptance/20261019-hundred-h/work 80 81 baseline-reading`；exit=0，实际完整编号输出。
