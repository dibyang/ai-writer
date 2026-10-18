# 最终 A 交付：协议诊断与完整流程复验

用户已授权本轮最小首批 A 开发、真实 Codex 实跑及发现问题直接修复。前轮基本流程和保留键防护已通过，最后又修复了“旧随附工具不声明支持 schema 3 时 doctor 仍报正常”的诊断。请使用当前最终主入口实跑，不改源代码、不启用子代理、不联网、不提交推送。

只写本阶段 `acceptance/20261018-governance-a/native-delivery-check` 及 commands 下 native-five- 标签。真实小说、原六章、前三个微型/重放作品及迁移测试夹具全部只读，不升级其工具，不编辑任何 state。

1. 读当前技能、快速入门/手册中迁移与 doctor 说明。从主入口实际 doctor 指向 `acceptance/20261018-governance-a/migration-matrix-v9/schema-1`：其随附实际0.3工具文件完整，state已由本轮独立迁移测试升为3，预期 doctor 退出1并明确报告协议不匹配。随后新主 check 应成功，旧随附入口 status 应退出2。三次请求前后所有该夹具文件须保持不变；不能为了得到绿灯改包或改state。
2. 另用最终主工具 init 本阶段 `最终交付确认作品`。保存以下指令为本地测试作者证据：

> 仅在这部新验收作品中复用第三轮 `native-final-check/最终回归微型作品` 第1章原文字节，不改原稿，不算新增创作篇幅。先完整读原章；地点沿用旧渡口，纸签和铜铃仍未选。允许远期骨架暂缓，仅授权本测试作品第1章；正式登记后先讨论总纲并保留 deferred，再暂停全部创作动作，只读查看任务。

3. 初始仅讨论/规划。用一份完整合法 workflow 输入故意传 operation_id=prototype，实际拒绝 INVALID_INPUT且state仍可读；随后用合法稳定ID正式登记 trial 1–1/复盘条件与 deferred。分别登记已选地点/候选赠物，不把未决项塞入事实ledger。
4. 正式 plan/context/record-template，读完第三轮原章后复制原文字节到本新作品；填实际 summary/changes，record/check。不要复制旧 state/旧source_hashes。保存复制源/目标哈希，必须一致；重放不计新文学字数。
5. 正式 structure（discuss/plan，范围null，deferred保留），讨论成功、unit2 draft拒绝；再正式 paused（动作空，两个范围null）。实际执行 status 的 workflow show 建议，再尝试 discussion 拒绝，检查next_action只读提示与state/正文哈希不变。核对手册FAQ与实际提示一致。
6. 新随附入口 doctor/status 实际通过；tool identify/compare 比较本新副本与主项目的 observed_content_id/runtime_id须一致。只报告旧副本差异，不更新它们。

所有产品命令经 `node acceptance/20261018-governance-a/capture.mjs native-five-唯一标签 node bin/ai-writer.mjs ...实际参数...`，旧/新随附入口相应替换。预期非零退出如实保留。可用一次性 Node 脚本生成输入、复制本新稿、只读盘点，但不得导入 lib 代替 CLI。

保存本阶段 report.md、summary.json、每个负向请求前后哈希和源稿复制证据。分别列 doctor不兼容、旧parser拒绝、非法ID拒绝、授权拒绝与真正意外错误；不把预期拒绝当产品失败，也不隐藏失败/重试。完成后停止，不再自行扩充验收范围。不是新增文学创作、真人盲读或正式发布验收。
