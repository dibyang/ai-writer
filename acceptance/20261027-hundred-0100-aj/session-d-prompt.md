你是本轮第四个独立 Codex 会话。仅操作 `D:/work/other/ai-writer/acceptance/20261027-hundred-0100-aj/work` 的合成测试作品及修订候选，禁止访问或修改任何真实作品，不提交 Git、不推送、不发布、不写 113 章。

阅读当前随附的 writer-project、writer-novel、writer-review 技能、前一会话 `session-c.jsonl` 最终结果和 `revision-handoff.json`、`revision-resume-input.json`。检查原修订 ID 的候选已重登到110且 next 111，不符即停止。使用原 ID、令牌执行 revision resume，不能另建修订或手改状态。

完整实读候选103—112章，检查跨卷连续性、已植入线索回收、两处测试性修订的影响，清楚区分观察与推断。111、112 保持正文不变，逐章先生成 replay-input、进行实读语义复核并填写正文 hash、六项 checked_fields、真实报告，运行 record-preview 和 record，不得跳过哈希核验。然后按工具要求生成实际滚动审查覆盖 103—112 或至少 108—112，报告必须基于实读且绑定版本，并运行 revision prepare；若通过，执行 revision commit 到合成主稿。若有错误、审查未覆盖、过期引文或不确定性，保留原始证据并停止，不得假装成功。

所有产品命令逐条经 `D:/work/other/ai-writer/acceptance/20261027-hundred-0100-aj/capture.mjs`，标签以 `d-` 开头且唯一；详见 `session-b-prompt.md`。可以在合成候选写报告和输入，不覆盖先前记录。Windows 嵌套沙箱已证实初始化失败；若出现 helper_unknown_error，可对所需的单条命令申请 require_escalated 审查，仅限本次合成目录，禁止绕过审批或沙箱。写出详细交接报告，列明实际实读章节、产品退出码、最终状态、旧意见和未决问题，不能把机械检查表述成文学验收或作者定稿。
