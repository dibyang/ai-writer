# 最小首批 A：新 Codex 会话仅凭作品文件恢复

你是一个全新的独立验收会话。用户已授权本轮最小首批 A 的实跑，当前只验证现有功能，不写产品代码，不迁移/更新真实小说，不启用子代理，不提交或推送。禁止写入 D:/work/小说/dzkxqxx、旧 acceptance 或产品源文件。

只使用当前主项目技能、docs 手册和独立作品 `acceptance/20261018-governance-a/works/纸灯札记` 的文件。不要读取前一个 native-create 的 request/final/events 或其他测试的预期答案；从作品正式状态、决策、原话证据恢复本轮任务。

## 必做

1. 读 writer-project 技能；用新主项目 CLI 和随附 CLI 各运行 status。准确报告已登记范围、next_unit、当前 stage/task/允许动作/范围、下一步，列已确认/候选/未决项。原始决策与原话绑定需实际核查，不能凭题材常识填答案。
2. 实际读取 `context --purpose discussion`。确认当前是讨论还是写作；若未授权下一章，绝对不要写第7章、不要建立第7章细纲。
3. 对新主项目和随附入口实际请求下一单元 draft context、record-template；另准备一个 unit=下一单元的最小伪登记输入交 record。若为越权请求应拒绝，保存真实 stderr/退出码，以及前后 state 和正文清单的哈希；不要为通过测试扩大授权。
4. 用 tool identify/compare 只读比较主项目与副本，核对版本、受管内容指纹、profile/模块差异与初始化清单。不能把 profile 有意省略的完整引擎当缺陷。核对期间所有作品字节保持原样（本阶段输入/报告放 native-recover 目录，不写作品）。
5. 读取范围内全部六章正文以及相关追踪与报告，以模型复读的身份给出简短连续性/重复结构/体验反馈；你可以指出真正问题，但不得改正文或把审查当作者定稿/真人盲读。状态不支持的能力不要声称通过。

## 最终构建的另建微型作品

为证明最终构建从初始化到暂停都实际走通，请在完成上面六章作品的只读恢复后，另用当前主工具创建 `native-recover/最终微型作品`（不得把它当旧六章工具更新）。这是本验收任务的另一条明确作者指令，原样保存并作本地原话证据：

> 在独立微型验收小说中，地点已选河埠；结尾道具仍未选，雨伞和铜铃都只是候选。只授权试写第1章300–500正文汉字，写陈岑在雨后河埠替老人点亮一盏纸灯，动作具体，不强加阴谋。完成自检和正式登记后暂停全部创作动作，仅查看状态，不再讨论或写作。请逐项记录选择与未决项。

实际 init、workflow set、decision set（一个已确认地点/一个未决道具）、plan、context、record-template、写本章、record、check，再 workflow set 为 paused 且 allowed_actions=[]、两个范围=null。仅需短篇差量协议，不必分卷。把相关 CLI 同样经包装器保存，标签用 native-two-final- 开头。最终 status 的建议命令应是可执行的只读 workflow show，不能指向已禁止的 discussion；实际执行建议及一次 discussion 拒绝并保留哈希。

六章旧测试作品和该微型新作品分别核对构建；只读说明差异，不升级任何工具。微型作品的正文和状态写入都在本阶段已授权新目录，不能写回六章作品。

## 记录与限制

产品命令使用 `node acceptance/20261018-governance-a/capture.mjs native-two-唯一标签 node bin/ai-writer.mjs ...`；随附入口相应替换为作品 `.writer/tool/bin/ai-writer.mjs`，每个标签唯一。包装器保留真实退出码和全量输出。可用一次性 Node 脚本只读盘点/生成本阶段伪登记输入及报告，不能导入 lib 函数代替实际 CLI。

若需修复发现的问题，仅在 native-recover 报告说明证据和复现路径，留给主会话修复；本会话不改源代码、不批量重绑哈希、不改 state。写完整报告和 JSON 观察摘要到 native-recover，明确实际做过/拒绝/未覆盖项，完成后停止。
