# C 会话辅助失败与记录边界

全部产品命令均经capture.mjs且各用唯一c-标签。14条实际产品命令exit0；c-003未启动产品，无产品退出码，不能伪称产品exit1。下列辅助失败保留原脚本/目录与当前会话工具响应；标为事后摘录的文字不是原进程双流。

1. 开场functions.exec批量FastCtx调用失败：TypeError: tools.mcp__fastctx__read is not a function。其后发现ALL_TOOLS内没有FastCtx可调用项，改直接FastCtx。没有相关文件或产品状态写入。
2. 首次辅助读取session-b.jsonl末七行时直接JSON.parse，遇B最后一行截断，SyntaxError: Unterminated string in JSON at position 10269 (line 1 column 10270)，Node v24.15.0、外层exit1。随后c-preflight.mjs逐行独立解析，252行中251有效/末行无效，保留原session-b.jsonl（未补尾/未截删）及session-c/b-last-events.json。初次堆栈输出含截断的B报告工具响应，不作为实际B报告文件存在的证明。
3. c-003-resume的capture预读输入失败，外层exit1：ENOENT，试图打开AN/acceptance/20261028-long-0100-an/session-b/resume-next-session.json。原因是c-command工作目录为AN，调用端错传仓库相对路径。commands/c-003-resume空目录保留，无result.json/输入/双流，因为错误发生在capture启动产品之前；原始堆栈在当前Codex工具返回，本页为事后摘录，不编造缺失的产品结果。c-004使用session-b/resume-next-session.json、原ID/token成功。
4. c-build119.mjs首次exit1，错误地要求原生replay changes与A原始输入深相等。发现仅四处规范化结构差异：同持有人previous_holder省略、三条tags空数组。原脚本保留；随后明确执行同一无写入失败脚本一次作完整双流复现，保存在aux-build119-v1-reproduction.stdout/stderr.txt（复现不是第一次的原捕获）。replay-original-structural-diff.json给全部四条路径；c-build119-v2.mjs只修辅助比较逻辑，不修改原生replay输入，成功双流另存。
5. 两次过宽context/recall及一次preview辅助提取的工具显示输出被截断。磁盘原始stdout完整；改成按字段/ID窄选读取，不将截断内容计作全文实读。九章小说的FastCtx读取均到Complete。
6. 最终回读119已冻结审查报告发现一处无依据时长表述“20多分钟到店”。正文9:50出门、10:20到店，是30分钟；本章固定160不是小时计价。另存session-c/119-review-errata.md绑定原报告SHA纠正，只修报告声明，不改变正文/summary/changes/state、不替换冻结报告或刷新哈希。主时间线明确的10:20、11:12、12:10等未变。

没有产品错误、自动审批拒绝或工具代码修复；没有清理失败目录。原A/B记录及失败仍保留，C未补写session-b-report.md，也未借B最后工具响应中出现的报告文字当成已落盘报告。
