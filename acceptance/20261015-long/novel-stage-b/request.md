这是一次全新 Codex 会话。请只靠当前作品目录中的文件恢复《末班寄存柜》，不要引用前一会话的聊天或另开代理。用户授权继续实际完善并验证 ai-writer。不得提交、推送、发布或调用付费服务；不得修改随附工具/技能；发现明确工具问题保留现场并写 .writer/stage-b-issues.md，报告阻塞。

先读本地 AGENTS.md、writer-project/writer-novel/writer-review 及长篇流程，从 status 和已有文件确定下一章。调用当前 .writer/tool/bin/ai-writer.mjs 的 doctor/check、outline、context、recall，实际读前三章和相关证据。不要直接把 state 全量内容当正文提示，也不要用未来纲替代事实。

按现有定位、文风、权威规则和两卷契约，实际完成第4–6章，每章约450–650汉字，保留自然叙述、人情和物证因果。若旧角色卡/章纲与正文矛盾，先以已发生事实核实；核心选择需要改动才报告，普通细节直接落实。第五章需回查已有 pending 线索，不能只因到期自动标 resolved。展示人物知识通过真实行动/对白变化，不能越过未知边界。物件交接用 custody/previous_holder，并给准确正文引文证据。

逐章按 plan/context/record-template→正文→自检→真实 summary/changes→record/check 执行。每次只推进一章，禁止手改追踪。第四章开始前实际 recall 一条早期线索，将需要的真实 ID 放入章纲 recall_ids，实读证据原章。最后实际连读1–6章，用 model-self-review 报告与真实哈希登记覆盖，检查 pending 窗口和过期报告。

遇到正文真正的问题直接按授权修订：已登记稿先 rewind，再重读重登影响区间，不为测试制造正文错误或无收益改稿。已消费来源不能偷改后刷新哈希绕过保护。阶段性未解问题可保留 pending/intentional-open，清楚说明边界。

导出草稿到作品目录的同级新目录“末班寄存柜-v1”（必要时用新的不覆盖名称）。最后在作品内 .writer/stage-b-result.md 记录恢复依据、实际工具调用、字数、跨卷承接、物证/信息边界、实读覆盖、失败和未覆盖。只把这称为六章样稿与文件恢复验证，不能声称完整长篇/真人/市场验收。
