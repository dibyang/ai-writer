# S轮：0.9.0长篇扩规模实跑记录

日期：2026-10-20（Asia/Shanghai）。基线提交9c741af4a78270e66edb303aa24d652bbc131c65。当前18章流程及最终当前稿复核已完成；这是Windows本地、知情模型实跑证据，不是真人盲读、市场验证、百章文学或跨平台CI验收。0.9.0仍为开发版本，未提交、推送或发布。

## 实际规模与结果

- 从Q轮独立样例六章副本续至18章、六个测试分卷；新增12章54322汉字，当前全稿69112汉字。标题和标点不计入Han字数；继承前六章包含短章，未假称全18章达到新篇幅门槛。
- 新普通章3535—4056汉字，三段；第7章8412汉字、第13章8237汉字，各五段。真实退出后同ID恢复续段，最终所有当前分段逐字拼装一致。
- A、B、C、D及最终新会话凭文件恢复；A、C和R1有真实同IDresume。13章中断期间工具从generation2更新至3，已写两段/已有事实不变，重新取context/template；旧13及15输入真实被拒且状态未改。会话和每次失败见下表及command-audit.json。
- 跨卷按原承诺有限兑现：T_NEIGHBOR_TELLING在17章完成本人可纠正的有限口述，T_CURTAIN_RETURN在18章实际亲交、收柜，T_SITE_RETURN含凳夹各归原主。旧片全史、旧信转手年份仍未知；公开/复制许可没有被自动扩大。
- 正式修订R1—R6覆盖旧4/8/10、后续登记11—12、14读者总览、15措辞及16—18连续性。完整尾段实读、六字段复核、prepare/commit和版本化分段均留痕；旧输入、旧段及拒绝日志保留。最终新会话完整读当前1—18并绑定读取前后哈希，原生工具返回原文覆盖由native-final-read-coverage.json独立核对。
- 最终revision54，暂停且仅允许讨论，19章正文及模板未创建；真实越界请求被拒、state不变。check/doctor、无活动修订/待决事务、草稿导出18章均通过。

## 本轮产品修复

1. 稀疏重放保留人物级character_known差量，避免旧登记完整快照覆盖上游已修正的知情；复用原保管人及previous_holder保护。旧实现回归用例实际失败，新实现及最终版本通过。
2. record-preview增加相关但本次未变账本候选，按近期证据排序，最多8项及每项8个人名并报告省略数量，辅助人工复核，不自动判定或写入文学结论。
3. 长章修订文档明确旧分段/交接不是当前稿：保留历史、派生新版本段、精确拼装，避免把修前段拼回已修正文。快速入门、手册、技能参考及版本说明同步。
4. 发布显式清单纳入两项新测试，最终真实解压包重新完整回归；中间候选漏测试的记录保留。

正文问题均只在本轮验证副本修正，未修改作者现有作品。模型判断发现并修正了空间/知情来源、读者许可总览遗漏、开门措辞、鞋盒重复归位和门口动作问题；机械绿灯不能替代实读。跨章“问许可—再确认—收还”有重复风险，具体可选改进见最终模型报告，未把润色建议自动变成必改。

## 最终交付版本与验证

当前唯一最终工具内容ID：`730a9e3eaffd691e1ef902722513ba548821ce9f077b35a4ff43bb52e0dbfecc`。源冻结source-frozen-delivery.json共321项；ZIP实际校验322个载荷、323项（含清单），见zip-delivery-verification.json。候选入口candidate-delivery-v4/；delivery-current.json及current-tool-update-verification.json指向generation3。

源码与实际ZIP解压交付包各176项测试：175通过、0失败、1项因Windows环境不允许创建符号链接而跳过；两端doctor通过。日志为commands/delivery-source-tests、delivery-package-tests、delivery-source-doctor、delivery-package-doctor。内置引擎未改，本轮没有另跑test:engine，不声明新Linux/macOS或跨平台CI结果。

旧candidate/、candidate-final/、v2/v3、final-build-verification.json、final-tool-update-verification.json、delivery-switch.json等“final”字样是过程历史，不能替代上述V4/current入口。product-delivery/和product-delivery-diff.patch保存最终12个产品文件原件/差异。

## 记录索引

- verification.json、current-manuscript-verification.json：本轮最终结果及逐章字数、当前正文/分段SHA。
- scenario/雨棚后的灯/交接/S-最终当前入口.md：暂停状态、最新各章段映射与下一步授权边界。
- scenario/雨棚后的灯/审查/S-完整当前稿-0001-0018.md：最终当前稿模型实读结论；final-read-binding.json、native-final-read-coverage.json为绑定与原始读取覆盖；final-report-reading-note.md澄清报告中“想问全名”的缩写、EOF行数口径及继承历史分段误选的验证脚本纠错。
- r1—r6相关json、保护区/备份和原生JSONL：正式修订、连续性检查、失败及重试全过程。r6-read-after.json是父会话真实读13—18，不能替代最终新会话1—18。
- budget-7/13/16-verification.json：上下文预算诊断；纲文回对及登记输入见作品内审查和commands。
- export-current-18/：18章草稿导出，不是出版稿。
- commands/：原始参数、输入、stdout/stderr、退出码、耗时及可取得的state前后哈希。427个外层捕获命令，13次原生进程；内层失败另计，不能按外层exit0宣称无失败。
- local-status-verification.json及commands/q-seal-after：原HEAD未改、暂存区空、原Q封存未变；无关.idea/保留。
- evidence-manifest.json：完成后封存本目录除清单本身的全部文件；外置20261020-long-flow-090-s-seal-verification.json记录独立复核，不回写封存。

## 原生客户端执行

| 捕获标签 | 真实thread ID | 外层退出码 | 内层命令非零 |
| --- | --- | --- | --- |
| codex-a-first | 未启动 | 1 | 0 |
| codex-a-native | 01a154ef-0bd0-7fd3-ab2b-033308d9b4eb | 0 | 0 |
| codex-a-resume | 01a154ef-0bd0-7fd3-ab2b-033308d9b4eb | 0 | 1 |
| codex-b | 01a1552a-33b9-72e3-ab8f-a3a268faeabf | 0 | 2 |
| codex-c-first | 01a15556-0cb4-7823-a277-367ce8b8f139 | 0 | 0 |
| codex-c-resume | 01a15556-0cb4-7823-a277-367ce8b8f139 | 0 | 2 |
| codex-c-resume-after-r4 | 01a15556-0cb4-7823-a277-367ce8b8f139 | 0 | 0 |
| codex-d | 01a155a7-fb2a-7da1-a70a-70e318638fd8 | 0 | 2 |
| codex-final-read | 01a155ce-f6b7-78d2-b851-f8432b026c95 | 0 | 0 |
| codex-r1-first | 01a15512-b0ca-7850-9cfc-8fb20e68aedd | 0 | 1 |
| codex-r1-resume | 01a15512-b0ca-7850-9cfc-8fb20e68aedd | 0 | 0 |
| codex-r2 | 01a15544-1b38-7c40-8b96-7ca85dfe23a0 | 0 | 5 |
| codex-r3 | 01a15565-62c8-7853-bdbd-1b9df9546cfd | 0 | 1 |

## 失败、纠错与证据边界

原始失败均未覆盖：初始客户端受外层沙箱限制无法写会话库，重试仍保留子workspace-write；ZIP路径/清单集合辅助断言错误；发布清单漏新增测试；旧模板与并发/授权保护的预期拒绝；来源/保管人不全导致preview拒绝；CLI帮助文本被辅助脚本误当JSON、exit1软错误与exit2抛错通道差异；稀疏重放旧实现的实际失败；模型中间报告发现的正文问题及随后R4—R6。完整外层/内层命令失败与MCP错误见command-audit.json。原生stderr还保留本机若干用户技能的YAML/frontmatter及图标配置告警；未改全局技能或配置，未将它们计作本产品修复。

8章父读取与客户端修订时间交叠的初始笔记已用parent-read-snapshots/0008-initial-notes-erratum.md纠正；不能把已不存在的旧句再称当前缺陷。D前缀真实读10—15覆盖1009个非EOF行；旧报告1015含六个末尾空字段，口径见line-count-method-note.md。最终覆盖同样以当前原文逐行比对，不据行数推断理解能力。

不触碰真实作品、不改全局配置、不上传、不自动Git提交/推送/打标签。尚未开展百章新增正文、真人盲读、商业追读验证及本轮跨平台CI。
