# 本轮实际发现与处理记录

## 带上下文的帮助与目标作品诊断

第一段真实 Codex 运行自然使用了 `doctor --project 作品目录`、`命令 --project 作品目录 --help`。初版实现只支持无参数 doctor 和单独的命令 --help，因而出现输入错误。这是实际使用揭示的接口缺口，失败输出保留在 novel-a 的命令日志和 events.jsonl。

修复后 doctor 可检查指定作品的随附模块、技能和手册；帮助可与该命令的合法参数组合，仍拒绝未知参数、重复参数和缺值参数。旧版本作品给版本提示，避免把旧版缺少新手册直接说成正文损坏。单元测试覆盖主项目与独立作品；novel-b 已真实调用并确认两种用法成功。

两个修改过的随附模块在 novel-a 退出后才同步到测试作品；旧副本保存在 tool-refresh/previous，tool-refresh.json 记录前后哈希，状态文件哈希保持不变。

## Windows 目录重命名的间歇失败

最终回归曾在初始化临时目录转为作品目录时出现 EPERM。本机权限下也出现同类错误，因此不能把它确定归因为沙箱。具体占用进程未定位；不将其归因于杀毒软件或 Codex 的某个组件。

证据：tests-final-v2.txt、tests-native-final.txt。30 次独立初始化诊断均成功，见 rename-baseline.json，说明这次诊断没有重现该间歇问题，不能拿 30/30 掩盖既有失败。

新增 Windows 故障注入测试，确定性模拟短暂拒绝、持续拒绝和重试时目标被其他任务创建，另覆盖导出目录。修复前的失败保存在 rename-before-fix.txt。novel-b 退出后才修改冻结的运行版本：初始化和导出目录对 EPERM/EACCES/EBUSY 最多尝试六次，等待合计 620ms；每次先检查目标是否出现，持续失败仍报错，不替换现有目录、不改为非原子复制。

四个专项测试全部通过，最终 candidate-v3.json 的完整回归为 53/53、0 skip，doctor 通过，引擎 29/29。日志见 validation-final-v3.json。这证明既定短暂拒绝可以恢复及异常边界成立，不宣称已定位所有系统占用原因或永不失败。随附工具同步保存旧副本及状态前后哈希，见 tool-refresh-v3/；最终版再次导出小说到 final-runtime/novel-export，与 novel-b 导出稿哈希完全相同。

## 验证环境与非产品错误

- WindowsApps 的 python 别名无法启动；应用自带 Python 默认 GBK 读取中文技能失败。改用应用自带 Python 的 `-X utf8` 参数后，七个技能结构校验通过；未改系统 Python 或全局编码设置。
- novel-a 的一个文件补丁把删除与新增同一文件放在一起，被工具拒绝。Codex 改用更新补丁后继续。这属于本次操作错误，原始日志保留。
- genres 的帮助检查误给 init 传入不支持的 --project，两次调用被拒且未修改状态；应按 init 的实际参数补验，不能为了让测试通过而放宽未知参数校验。
- 实读 genres 报告后确认，init 帮助的通用尾注会给出“可省略 --project”的歧义提示。final-recheck 结束后进一步修正 help：init 明示 --path 且不接受 --project；doctor 明示默认检查当前工具，其余有作品参数的命令才显示省略规则。输入保护不放宽。此文案变更为 candidate-v5.json，测试新增相应断言，旧 help 副本与状态哈希见 tool-refresh-v5/；最终自动化和主会话真实 CLI 核对另存，未把 candidate-v4 的子会话记录改写成 v5。
- genres 的末尾检查发现随附作品缺少许可和来源资料。主会话最初把它理解为检查路径假设，进一步确认独立迁走后确实缺少溯源资料，已修正判断并修复 init：随作品复制整体许可说明、三份来源清单、三份上游许可和去味原文，另附 attribution.md 解释历史清单与实际随附组件的区别；doctor 检查缺失项。新增缺许可诊断测试，候选 v4 全部 54 项通过。副本同步保留旧工具和 state 哈希，见 tool-refresh-v4/。不把整个项目宣称为 MIT。
- genres 记录的三个范围外验收文件变化及 manual-verification.md 新增，均来自主会话整理证据：README.md、defects.md、verify-artifacts.mjs；不是该实跑进程修改产品。保留它当时观察到的差异，不改写旧报告为“全工作区零变化”。
- 历史的 helper 嵌套 cwd 问题没有被宣称修复；本轮入口采用已验证的主项目 cwd 和明确作品路径，独立作品的 Node 工具另行运行。

所有阶段只保存真实输出；原始失败日志、旧候选快照和历史验收材料不覆盖。
