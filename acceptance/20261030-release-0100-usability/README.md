# 0.10.0 发布前易用性验证：进行中

范围：在不修改真实作品、不提交、不推送的前提下，检查发布缺口并实跑“续写一章”和“旧章修订后重登尾段”。两条主路径均尚未执行，不能称为通过。

隔离基线来自 AO 已封存的 122 章合成副本。`bootstrap.mjs` 检查 AO 封存清单哈希后，逐项检查并复制 21,748 个作品文件，复制后再次核对哈希；`bootstrap-verification.json` 记录 542,246,830 字节、revision 489、122 章。原 AO 未修改。

`session-a-prompt.md` 保存实际测试授权和两路径任务。首次本地 Codex CLI 启动失败：现有用户配置 `features` 类型不兼容，原始 stderr 和退出码保存在 `session-a-stderr.txt`、`session-a-exit.txt`。第二次以 `--ignore-user-config` 启动，受沙箱限制无法访问网络及写入 Codex 会话目录，未创建会话，原始 stderr 和退出码保存在 `session-b-stderr.txt`、`session-b-exit.txt`。随后对访问本机会话目录及网络服务的权限提升请求被自动审批拒绝：该操作会将合成副本及上下文发送至外部模型服务，审批认为未明确授权数据出境及本机会话目录的高权限访问。未绕过限制，未运行创作步骤。

已核对 `CHANGELOG.md`、`RELEASE_NOTES.md` 和 `docs/next-development.md`：自动多步任务、完整分段发现、量化减负尚未完成；最终候选构建、跨平台 CI、两条主路径与遗留复核事项的发布判定尚未完成。AO 的 5 条 needs-recheck 和 4 个旧审查欠窗须分别判断，不能直接认定已解决或均为发布阻塞。旧版 CI 不可冒充 0.10.0 最终构建验收。

独立执行 `node bin/ai-writer.mjs doctor` 返回 0 且 `ok=true`、errors/warnings 为空。另起 `npm test` 并将原始输出保存为 `npm-test.stdout.txt`、`npm-test.stderr.txt`；当前运行状态和后续 doctor 结果以 `preflight-exits.json` 是否存在及其内容为准，不能将未结束测试计为通过。

## 继续实跑与修复

作者明确授权访问会话目录及将合成副本发送至 Codex 服务后，旧 CLI 的默认模型不受账号支持，失败事件保留在 `session-c-events.jsonl`；桌面新版 CLI 参数首试不兼容，保留 `session-d-stderr.txt`；修正参数后嵌套会话完成但其工具层报告只读及调用被策略拒绝，未写任何正文，见 `session-e-events.jsonl`。之后由当前 Codex 会话在已授权的隔离副本直接运行产品流程，没有把嵌套失败说成成功。

初始任务视图为 revision 489、next 123、旧修订授权。实际实读121、122正文及近期规划，原生设置本轮规划与有限写作授权，建立 V20 和123细纲。首次 context 被 `DRAFT_DIRECTORY_REQUIRED` 拒绝（产品退出2，状态不变）；使用空 mapping 预览并扩展未来目录后，context、模板、预览及 record 成功。第123章为新创作的流程候选，共 992 汉字（包含标题），保留正文及模型实读回对，不称文学定稿。

随后将授权改为122—123，原生 begin/rewind 创建独立候选，只将122一处“问出口，她没把它换成写得清不清，葛也没急着答喜欢”改为“话一出口，她没有改问写得清不清楚，葛也没急着说喜不喜欢”。122逐条复核10个账本引文，122、123各进行 replay-input、六项报告、preview、record，完整连读尾段并登记模型 review。prepare 展示16项变更，正文仅122一项；commit 发布到隔离主稿 revision 495，不是 Git 提交。之后 check 成功、findings空，仍有8个滚动审查欠窗，覆盖统计不等于文学通过。所有产品命令的输入、原始双流、产品退出码、前后state及运行构建观测保存在 `commands/`；统计见 [实跑摘要](run-summary.json)。共26条捕获命令，其中 p-006 是前述一次目录契约拒绝；p-026 是候选包 doctor。最初一次未包装的只读任务视图查询未计入捕获命令，随后 p-001 已完整捕获相同基线。

发现并修复：任务视图在已经有章纲且新章超出稳定目录范围时，之前仍建议 context，后者必然拒绝。现在主稿任务视图先给 `extend-draft-directory`、阻断码和预览入口，复用原有保护，不自动改契约或扩大授权。补充快速入门与手册，新增迁移后缺目录和扩展后恢复测试。第一次专项测试运行时手册被并发修改，原工具更新保护返回 `TOOL_SOURCE_CHANGED`；保存失败结果，文件稳定后重跑5项全部通过。

上次沙箱完整测试256项中240通过、14失败、2跳过，失败包括硬链接EPERM和Git查询超时；真实文件系统硬链接探测成功，迁移专项16/16、发行专项3/3通过。真实环境旧源码串行完整测试255通过、1跳过、0失败（`npm-test-real.stdout.txt`），不是本次修改后的结果。修复后新候选包已构建，content ID `f7e9bce10c691f005a36dcb02362aea31381fd8b3c0ecd133632e93c27539933`，zip SHA-256 `ff3bf3f93623e3abc4914b8b308c839763324c17d3e755e3416d5e85779daa2f`，来源标记dirty，候选包doctor成功；未发布。最终修改后的完整串行回归正在进行，其结果以 `npm-test-final-exit.txt` 和原始输出为准，尚不能称已通过；跨平台CI未运行。

最终回归已结束：257项、256通过、1跳过、0失败，测试和随后 `npm run doctor` 退出均为0，源码doctor `ok=true`、errors/warnings均为空；完整日志与退出码见 `npm-test-final.stdout.txt`、`npm-test-final.stderr.txt`、`npm-test-final-exit.txt`、`doctor-final.stdout.txt`、`doctor-final.stderr.txt`、`doctor-final-exit.txt`。包内doctor与源码doctor的content ID均为上述 `f7e9...9933`；候选zip、清单、发行说明的三项校验和复核通过，见 [候选校验](candidate-sums-verification.json)。前段“正在进行”描述的是当时状态。

本次没有取得修改前后同规模对照和真实新用户样本，不能宣称填写或纠错成本降低30%。两路径实跑使用修复前随包构建；修复后的缺目录提示通过真实迁移/目录扩展专项回归和最终源码完整测试，但未重新进行整部作品两路径文学实跑。候选包来自未提交工作树，未推送、未运行跨平台CI，仍不是正式发布验收；5条历史 needs-recheck 和8个滚动审查欠窗仍需按实际任务判断。

收口后增加 `p-027` 只读任务状态：主稿 revision 495、next 124、无活动修订会话与阻塞，needs-recheck 仍为5；与此前 `run-summary.json` 中26次命令相比，捕获命令总数现为27。`git diff --check` 通过，未提交、未推送。
