# 《补帆人》隔离方法实跑报告

日期：2026-10-19。任务性质：ai-writer 工具维护中的有限方法与 CLI 实跑，非真实作品创作。

结论：已用用户指定冻结 0.7.7 入口初始化 novel/long 隔离作品，完成两个阶段的规划讨论、仅近期三章方向、A/B/C 局部审查，以及正式 workflow 恢复与越权拒绝验证。零章正文、三个原样本未改；正文、人物事件、维修结果及下一卷兑现均未登记。有限隔离断言通过；共享工作区发生外部字节变化，不能宣称整个工作区不变。

## 路径与写入范围

- 作品：`D:/work/other/ai-writer/acceptance/20261019-webnovel-reference-j/method-smoke/work`。
- 固定执行入口：`D:/work/other/ai-writer/acceptance/20261019-webnovel-reference-j/sources/package-0.7.7/bin/ai-writer.mjs`。所有25次 CLI 调用的 invocation.json 均记录此路径；未改用当前主树或0.8.0入口。
- 详细审查：[原创测试段落报告](work/审查/原创测试段落-20261019.md)；原文在 `work/研究/原创测试段落-{A,B,C}.txt`。
- 交接：[HANDOFF.md](HANDOFF.md)。命令和原始输出入口：[commands.md](commands.md)；机器核验：[verification.json](verification.json)。

本执行只在 method-smoke 内创建新作品、输入、证据脚本和报告；原有 request.md、request.raw.md、events.jsonl 未由本执行改写。没有 Git 提交或推送，没有联网、子代理、协作消息、付费生成或上传。没有修改工具源码、技能、H轮prepared或任何真实作品。初始化按产品行为在新work内复制的技能、工具、来源与许可证未另行修改。

## 实际阅读的方法

先完整读取冻结包三份 SKILL.md，再按任务完整读取必需参考。下面的范围是本会话 FastCtx 实际显示并读过的完整行范围；没有依靠“文件已保存”认定读完，没有截断未补读。哈希与用途另见 [methods-read.json](methods-read.json)。

| 冻结包内路径 | 实读范围 | 本任务用途 |
| --- | --- | --- |
| .agents/skills/writer-project/SKILL.md | 1–52 | 初始化、正式workflow、决策与事实边界 |
| .agents/skills/writer-novel/SKILL.md | 1–40 | 长篇定位、近期滚动、合作场景 |
| .agents/skills/writer-review/SKILL.md | 1–46 | 仅审查、源版本与知情自检 |
| .agents/skills/writer-novel/references/story-development.md | 1–28 | 两阶段供给、结果改变选择、兑现与缩短 |
| .agents/skills/writer-novel/references/scene-connections.md | 1–45 | 身体限制、未完承诺、合作对白与余韵 |
| .agents/skills/writer-review/references/general-review.md | 1–125 | 常规小说审查；不将短样本冒充整章 |
| .agents/skills/writer-review/references/natural-language-authenticity.md | 1–95 | 四项语言测试与确定问题/偏好分离 |
| .agents/skills/writer-project/references/long-form.md | 1–97 | long、卷契约、计划不入事实 |
| .agents/skills/writer-review/references/physical-logic-operability.md | 1–40 | A的伤情、负重与操作条件 |
| docs/workflow.md | 1–274 | 真实原话证据、CAS、workflow/decision输入 |
| docs/long-form.md | 1–94 | 长篇恢复、有限规划与机械核验边界 |

另读了新work的 AGENTS.md、writer.json、默认三份设定和全书大纲，以及三个保存后的研究样本。未加载悬疑、仙侠、穿越、双时空、发布评分、商业追读、去AI味专项或外部对标材料。init自动复制其他资源、doctor列出其他资源哈希，不代表模型阅读了那些方法。

## 规划讨论的结果

规划主文件沿用初始化产生的 [全书大纲](work/大纲/全书大纲.md)，卷契约由真实 volume 保存到 `大纲/分卷/V1.json`、`V2.json`，近期方向由真实 plan 保存到 `大纲/单元/0001.json` 至 `0003.json`。没有另造事实权威文件。

第一阶段候选是把一项有限维修做完：学徒与朋友核清能力、时间和分工，只作能够承担的承诺；拟在本阶段给维修及其检验一个有限结果。这个局部结果不等于船坞已经获救。

第二阶段依赖前一阶段实际完成后才可能成立：交付可能留下复查责任、占用工时，也可能带来新的询问。原先“怎样争取第一项活”于是变成“怎样安排已有责任与朋友各自的时间”。候选选择在多接活、延后接活与协作分担之间展开，新增收益应是合作方式与生活安排改变，不只是再换一条漏水的船。下一卷拟让一次安排真正运行，仍只是计划；没有登记“已经同意”“已经交付”或“经营稳定”。

一次修漏并交还可以支撑完整短篇；长篇则需要每个结果继续改变资源、责任或关系。大纲指出换船主反复修同一问题、总让朋友善后、同一种饭桌安慰反复出现的风险；无新增收益就合并。保留“首项维修兑现后收束短篇”和“两个阶段运行一次安排后收束中篇”的选项及其代价，不以阴谋、敌人或强危机拉长。

全书远期仅留能否形成可持续生活与主要合作关系的骨架；产权、经济规模、师傅状况、终局、是否共同经营等未选。两卷连续范围1–6与7–12是可调的工具占位，不是作者决定全书十二章，也没有预制第4–12章情节。

仅近期三章方向是“先看这条船”“把工时留出来”“一起吃顿饭”：从有限承诺、实际分工商量，推进到相互照看与生活节奏。后章只可承接前章成稿确实留下的进度，不能凭计划声称前章已完成交付。安静过场可保留，不强制每章事故或强悬念。

正式 `D_AUTHOR_DIRECTION` 只确认用户本轮原话已给出的温和现实合作方向及排除项；`D_STAGE_CANDIDATES` 状态为 candidate，adopted_items 为空。人名林遥、余青、暂用视角、阶段办法、卷界与缩短选项均为可撤回工作候选，没有确认新的作者核心选择。冻结原话来源为 `研究/作者原始任务.md`，SHA-256 为 `7f17a83005cf5745c4188fcc269802317dcd89dcc515735a8b85744f06ef85f1`；locator引用真实本地行号，不编造消息ID。

## 原样本审查的结果

三段都从真实请求原字节切片保存为 UTF-8，无BOM、不追加换行，设为只读。最终内容比对与 [sample-originals.json](sample-originals.json) 一致。审查为同一模型的知情自检，完整范围仅三段；样本人物没有被当成本书人物或事实。

| 样本 | 确定判断 | 缺证边界与保留项 |
| --- | --- | --- |
| A | 明确不能负重的右臂，与次日独自搬沉柜上楼之间缺可行承接 | 不作医学推断；尚缺工具、能力、限制持续与相邻解释。保留伤情、时间和搬柜任务；报告给“请人搬”的最小候选，未应用 |
| B | 天亮接父亲的承诺未交代结果，便跳到一周后的比赛 | 不推断已接到或已失约；先查相邻原文。报告候选保留“待确定”槽位，不填接人结果；保留正常时间跳跃与比赛任务 |
| C | 局部范围没有需要修改的确定问题 | 保留熟人合作、照顾、饭盒动作与风吹热气的余韵，不因无危险加危机。不能由短段证明全章或全书人物塑造 |

报告已逐项进行当面说话/叙述声音、动宾拆分、具体落地、朗读节奏检查，并在“真人语言硬问题”下写“没有”。A/B独立的连续性问题没有被混作措辞错误。“第二天”“一周后”、普通描写与合作对白本身均未判错。没有修改原样本，也没有生成正文或可登记的章节候选。

## 正式命令验证

完整参数、时间、入口、退出码与原始输出各自保存在 evidence 下；以下是关键结果。所有治理变化均通过真实CLI，没有手改state。

| 操作 | 实际结果 |
| --- | --- |
| init --path ./work --kind novel --title 补帆人 --mode long | schema6、novel、long；初始化无正文 |
| decision set 两次 | 原方向确认后revision1；阶段候选登记后revision2 |
| volume 两次、plan 三次 | 卷契约返回plan-only；只保存第1–3章方向，未形成正文事实 |
| workflow set | revision3，stage=structure；allowed_actions=[discuss,plan]；draft_range、revise_range均null |
| workflow show / context --purpose discussion | 独立CLI进程从文件恢复相同任务、范围、确认与候选项 |
| status | revision3；next_unit1只是登记顺序；next指向discussion；无登记稿、未登记稿、漂移或活跃修订 |
| check | ok=true、units=0、scope=mechanical-only、literary_quality=unreviewed；不构成文学通过 |
| doctor --project ./work | ok=true、0.7.7、errors/warnings为空；随附资源missing/mismatches为空，轻量包引擎为optional-in-workspace-copy |
| context --purpose draft --unit 1 | CLI退出码2，ACTION_OUT_OF_SCOPE，原始stderr保留 |
| record-template --unit 1 --draft 正文/0001-拒绝测试.md | CLI退出码2，同样拒绝；路径只是命令参数，没有创建该文件或模板 |

拒绝前已有第1章规划，因此本次证明的是授权门禁，不是缺细纲错误。两次拒绝前后，作品全部143个当时存在文件逐个比对均不变；`.writer/state.json` SHA-256前后均为 `a2def0991073dac2e46412e068bb09695931a17c928adee166faacd9ce5d279e`。status前后对象也一致，正文目录为空，人物、时间线、线索与账本为空。详见 [denial-comparison.json](denial-comparison.json)。CLI原始退出码由Node记录为2；外层PowerShell该环境报告1，两者未混同。

## 审计异常与更正

大范围前后快照并集546个文件，观察到phase外10个既有文件变化、337个新增文件。因此 boundary-audit after 返回非零，v1核验脚本对“整个共享工作区不变”的断言失败。源工具文件、package.json和J轮其他验收资料的同期变化不在本执行的写入调用中；未覆盖、还原或归因这些文件。

原始快照、比较文件、v1脚本和失败复现输出均保留，具体见 [audit-failure-note.md](audit-failure-note.md) 和 [verification-attempt-1-reproduced.json](verification-attempt-1-reproduced.json)。另建v2，只将共享目录变化记录为观察限制，保留本作品和CLI的断言，并单独核对冻结0.7.7包：63个文件与基线逐个一致。更正后的结果见 [verification-attempt-2-result.json](verification-attempt-2-result.json)。这不把“全共享目录不变”升级为通过，也不是产品缺陷修复或授权扩大。

## 验证边界

本次完成的是有限规划方法、局部审查、正式恢复与拒绝保护的实跑。没有修改工具，故没有触发工具修改后的npm test/doctor/engine整套维护流程；实际doctor针对新work运行。没有制造待登记稿、章节哈希或零章连读报告。

原样本审查并非真人盲读；阶段推演并非市场或百章供给证明；零章check不是文学通过。真实修船操作未联网核实，下一卷未写、兑现未发生；不宣称可发布、作者定稿、真实作品验收或主产品全量验收。
