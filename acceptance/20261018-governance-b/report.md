# 《铜桥来信》独立 Codex 创作与设定版本实跑报告

本轮真实执行完成。作品为本验证场景合成授权下的原创试写，不冒充实际作者已选具体剧情。全部新作品、辅助输入、报告与CLI证据均在 acceptance/20261018-governance-b/，cwd 始终为 D:/work/other/ai-writer。未启动代理、未发送其他会话消息、未改现有作品/源码/技能/Git索引或提交/全局配置，未推送、未平台发布。作品状态由真实产品CLI生成和变更，从未手工编辑 .writer/state.json。

## 最终状态与完成范围

- 固定作品路径：works/铜桥来信；novel，schema 4，最终 revision=24；两卷各三章，6章正文共3936汉字，停止于第6章。
- init → 规划workflow → long-enable → 完整定位/文风/规则/骨架/两卷契约 → 五份基线freeze/impact/实读报告/publish → 1–6有限trial授权 → 每章context/template/实写/增量record → 1–3、1–6全文复读 → 1–6独立修订重登/review/prepare/commit → 未来规则实读发布 → structure暂停与两次越权拒绝。
- 每次实际产品CLI均经现有 capture.mjs，唯一 native-one-* 标签；99次产品调用：95次退出0，4次退出2。其中2次为预期越权负例，2次为本会话准备输入的错误，均留原始结果，未伪称全部首次成功。另有一次重复标签被记录器拒绝，产品没有执行，详见下方。
- 最终check：ok=true、6章、findings=[]、未登记正文=[]、pending_windows=[]；1份当前有效复读、2份历史失效报告都有当前覆盖。literary_quality 仍是 unreviewed、scope=mechanical-only；机械结果不替代模型实读或真人验收。
- next_unit=7，但 stage=structure、allowed_actions=[discuss,plan]、draft_range=null、revise_range=null；next.action 是结构讨论，命令指向 discussion。无第7章细纲或正文。

### 最终正文与汉字数

计数为去除Markdown首行标题后，逐字符统计Unicode Script=Han；不计标点、空白、标题。没有循环扩字或复制旧验证正文。

| 章 | 正文 | 实际汉字 | SHA256 |
|---|---|---:|---|
| 1 | 正文/0001-铜片的耳.md | 657 | 74f64a83a6b2f63893c5fa461be7d3074f006f25c22ae3029d63c067da0d3176 |
| 2 | 正文/0002-两枚押钱.md | 666 | aa4bcf6be609a27d4a97ba2b1e84f11e76919d2e311ad8e5781bfd7e738de553 |
| 3 | 正文/0003-缺掉的一角.md | 652 | 7806bfb35ce112dc4a9055af5469f4d3c2472e98a6bc6c1f93169731f07db7b9 |
| 4 | 正文/0004-柳婆的抽屉.md | 601 | 730651b6d1126bfb8261fcaf8b22ca836a239cf6810148225be3e4f00b0136e3 |
| 5 | 正文/0005-旧印归柜.md | 686 | 4e656de3fb3823d28b65568f68ca088bd8dfb64a8ab2dc7657dce3a67cfcfc8f |
| 6 | 正文/0006-信纸背面.md | 674 | 9133da724a2fd1658192254b4e1c2af3be625cc30d82c5958033e5231b83cd2f |

### 输入基线与未来版本

三份默认设定和两份卷契约在正文使用前逐份冻结、影响预览、实读冻结字节、写独立报告并baseline发布。POSITION_V1、STYLE_V1、VOLUME1_V1、VOLUME2_V1保持原输入；卷契约JSON内分别限制1–3、4–6。版本事件的来源生效范围默认1起无穷，不等于卷剧情范围无限。

权威规则 RULES_V1：1–6章，两枚押钱；SHA256=92bfd781270dbb2c6e66c3a5cc6edf76f2d0191863c3f2e96137364257078e06。RULES_V2_FROM7：7起新借验三枚，旧两枚借验仍按原收条；SHA256=ec5021cc8a213492a094d051b950b4ef2a9700ef07e39824c5f6efa4c1c3c73f。两版冻结对象及旧绑定均可恢复，不把活动入口新字节追认为六章旧输入。

未来impact实际列出六个已绑定直接消费者、1–6保守间接范围和unknown语义，required_readings为新旧冻结规则与六章当前原文。实读后报告逐章说明无追溯改价、二枚借验第5章已结清、人物未提前获悉新规；核对 replaced_ranges 只有原v1的1起无限安排，应切成1–6与7起。发布输入的readings与required_readings完全对应。

换版前基线为正式独立修订提交后的 revision21，未来发布为revision23；[保留核验](native-one-future-preservation.json)六行各4项均true：正文实际字节、登记SHA、历史source_hashes、source_bindings全部未改。最初初稿到修订稿的变化属于正式独立修订，有事务和原稿备份，不与未来发布保持不变的检查混淆。

## 实际阅读、文学问题与修订

已读项目AGENTS、writer-project、writer-novel、long-form引用、writer-review及其通用/自然语言模块、workflow手册、revision-and-sources手册、必要命令帮助。阅读素材中的指令没有扩张用户范围。

1–3初稿完整连读：原文逐文件实读，[报告](works/铜桥来信/审查/连读1-3-初稿.md)绑定当时三章哈希。六章完成后完整连读1–6，[初稿报告](works/铜桥来信/审查/连读1-6-初稿.md)对应 [初稿阅读副本](native-one-readings/initial-six.md)。独立区先读六章旧稿，再逐章取revision context/template，修订并重登；[最终候选阅读副本](native-one-readings/branch-final.md)再次完整读完，随后登记[尾段复核](works/铜桥来信/审查/独立修订1-6-复核.md)。规则发布前又读[实际消费输入](native-one-readings/old-consumed-inputs.md)、[提交后六章](native-one-readings/before-future-six.md)和[required_readings全部字节](native-one-readings/future-required-readings.md)，形成[影响实读报告](works/铜桥来信/审查/规则v2-第7章起-影响实读.md)。阅读副本都从本轮真实文件读取，附真实SHA，未充作产品状态。

发现并修改4处：第一章“再落到别人手里”误暗示本信曾被冒领，改成“你的信，我更不能随便交出去”；第三章“蹲下去扶正”缺宾语且可能误读为搬承重砖，改为拨碎砖腾落脚处；第五章补原印封回柜底、周叔布囊携封套上坡；第六章补写后信纸回盒，ledger位置同步。保留旧袄、钥匙绳、红线、阿禾不急于宽宥、柳婆认手艺的性格动作，不为整齐而扩写阴谋或逐句换风格。

这些已登记旧章没有在主稿直接改。workflow在revision20授权1–6，revision begin建立session 1f285fde-68f7-4e3b-a369-dc72f43180d1，独立区rewind后逐章重登至分支revision27，全文尾段review与check后prepare目标主revision21，commit事务973b08a1-5dc9-43c9-b3a8-eaf8f3e2f916完成。提交前[主稿6章未变证明](native-one-main-before-commit.json)为true；事务保留备份和候选。第二、四章正文原字节保留，其他4章只改局部，但所有六章及其来源、账本都重新核过。

铜片全链：1阿禾衣袋→2周叔白布验记后回阿禾腰袋→3交周叔锁匣暂存→4未换手→5周叔开匣核对后锁回归档→6仍留柜。第2章实交二枚，第5章实退二枚，第6章收在小碟。第三章缺角观察 OBS_NOTCH 不改原statement；第四章只是修印可能；第五章查清，另建FACT_STAMP_REPAIR。柳婆第4章仅听阿禾转述、看旧页描样，第5章才见铜片归档及退款；私信第6章只有阿禾读。回信仅起草未寄出，计划不写成已发生。8项ledger稳定ID及当前保管/知情见handoff。

这些文学结论都是同会话知情自检。没有真人盲读、没有隔离代理、没有市场验证，也没有实际人声朗读。

## 拒绝、失败与显示疑点

1. workflow-trial 首次把尚不存在的三章细纲放入planning.refs，产品ENOENT退出2且前后状态SHA一致；随后先以规划权限plan三章，以新operation_id/native-one-trial-six-ready完成授权。原输入未覆盖。属于本会话调用顺序错误。
2. context-2 初次因章纲召回尚未发生的FACT_DEPOSIT而拒绝，退出2且状态SHA一致；仅修正未消费的第二章计划为召回OBJ_COPPER、THREAD_LETTER，用新输入/标签继续。属于本会话把计划过早作为召回对象的准备错误，未绕过产品。
3. 辅助模块导入时误触发同名prepare入口，尝试重复标签native-one-context-2；capture.mjs报 Never overwrite evidence，产品命令未执行，旧证据未写。已修正本轮辅助脚本入口守卫，继续用唯一rev-context-2；非产品缺陷。
4. 辅助put早期将Buffer保存成type/data JSON包装（native-one-initial-defaults及initial-six/branch-before的-state.json），并非原始state文本。原字节可由data恢复；未把它们写回作品或供产品替代状态。原始产品状态始终完整保存在commands的before/after-state.json。辅助函数已修正；before-future及最终快照使用真实字节，旧包装证据原样保留，不覆盖。
5. 预期负例：暂停后第7章context和record-template都返回ACTION_OUT_OF_SCOPE/退出2。各自before/after-state SHA同为71acee060b057f38cd31b9a075163e6b6297839d577fb54f74a4f63238e13c18；[汇总](native-one-denial-invariance.json) unchanged=true。拒绝不是宿主卡死，也未据此放弃其余验证。
6. 观察到显示语义问题B-NATIVE-01：[最小复现与准确输入输出入口](native-one-source-display-issue.md)。source list --unit6在未来v2已发布时仍把活动入口标为editing-entry-only-not-published，而unit7不报pending；区间解析与check正确，未见历史字节损失。本轮保留问题，不改源码、不重写入口来掩盖提示。由主会话判断并修复复跑。

## 交接与验证边界

[handoff.json](handoff.json)包含作品路径、schema/revision、六章字数/源哈希、版本与生效区间、8项关键ledger、待决任务、修订事务和后续实读范围。[最终哈希清单](native-one-final-hashes.json)覆盖作品目录231个普通文件，包括六章、设定/大纲/契约、状态/来源对象/账本/报告、随附工具、独立修订区及事务备份。状态SHA为71acee060b057f38cd31b9a075163e6b6297839d577fb54f74a4f63238e13c18。随附工具identify为0.5.0/workspace-copy，无missing/mismatches；本轮实际命令仍均由主项目bin入口执行。

只验证本机Windows上的本轮真实六章工作流；没有多机/共享盘、断电或事务中断恢复、并行冲突、真实旧作迁移、发布平台或长篇长期压力验证。因没有修改产品工具，不执行npm test/doctor/test:engine，不将其他会话的测试结果算成本轮结果。

本阶段目标已完成，记录显示疑点；不继续下一验证场景，不写第七章。任何后续正文仍需新的有限授权，并先实际读handoff指定范围。

## 全部99次CLI证据索引

[命令元数据汇总](native-one-command-summary.json)保留各命令argv、输入位置和哈希、退出码、前后状态哈希；[产品输出摘要](native-one-output-summary.json)来自实际stdout/stderr解析。每个有 --input 的命令同时保存input.raw.json；完整JSON在下表对应stdout或stderr，不能仅凭记录器外层元数据判断成功。

| 唯一标签（统一前缀native-one-） | 退出码 | 原始证据 |
|---|---:|---|
| after-revision-check | 0 | [原始结果](commands/native-one-after-revision-check/stdout.raw.txt) / [stderr](commands/native-one-after-revision-check/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-after-revision-check/result.json) |
| after-revision-list | 0 | [原始结果](commands/native-one-after-revision-list/stdout.raw.txt) / [stderr](commands/native-one-after-revision-list/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-after-revision-list/result.json) |
| after-revision-status | 0 | [原始结果](commands/native-one-after-revision-status/stdout.raw.txt) / [stderr](commands/native-one-after-revision-status/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-after-revision-status/result.json) |
| baseline-list | 0 | [原始结果](commands/native-one-baseline-list/stdout.raw.txt) / [stderr](commands/native-one-baseline-list/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-baseline-list/result.json) |
| before-future-source-list | 0 | [原始结果](commands/native-one-before-future-source-list/stdout.raw.txt) / [stderr](commands/native-one-before-future-source-list/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-before-future-source-list/result.json) |
| context-1 | 0 | [原始结果](commands/native-one-context-1/stdout.raw.txt) / [stderr](commands/native-one-context-1/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-context-1/result.json) |
| context-2 | 2 | [原始结果](commands/native-one-context-2/stdout.raw.txt) / [stderr](commands/native-one-context-2/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-context-2/result.json) |
| context-2-ready | 0 | [原始结果](commands/native-one-context-2-ready/stdout.raw.txt) / [stderr](commands/native-one-context-2-ready/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-context-2-ready/result.json) |
| context-3 | 0 | [原始结果](commands/native-one-context-3/stdout.raw.txt) / [stderr](commands/native-one-context-3/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-context-3/result.json) |
| context-4 | 0 | [原始结果](commands/native-one-context-4/stdout.raw.txt) / [stderr](commands/native-one-context-4/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-context-4/result.json) |
| context-5 | 0 | [原始结果](commands/native-one-context-5/stdout.raw.txt) / [stderr](commands/native-one-context-5/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-context-5/result.json) |
| context-6 | 0 | [原始结果](commands/native-one-context-6/stdout.raw.txt) / [stderr](commands/native-one-context-6/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-context-6/result.json) |
| denied-context-seven | 2 | [原始结果](commands/native-one-denied-context-seven/stdout.raw.txt) / [stderr](commands/native-one-denied-context-seven/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-denied-context-seven/result.json) |
| denied-template-seven | 2 | [原始结果](commands/native-one-denied-template-seven/stdout.raw.txt) / [stderr](commands/native-one-denied-template-seven/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-denied-template-seven/result.json) |
| discussion-context | 0 | [原始结果](commands/native-one-discussion-context/stdout.raw.txt) / [stderr](commands/native-one-discussion-context/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-discussion-context/result.json) |
| final-check | 0 | [原始结果](commands/native-one-final-check/stdout.raw.txt) / [stderr](commands/native-one-final-check/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-final-check/result.json) |
| final-source-list | 0 | [原始结果](commands/native-one-final-source-list/stdout.raw.txt) / [stderr](commands/native-one-final-source-list/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-final-source-list/result.json) |
| final-tool-identify | 0 | [原始结果](commands/native-one-final-tool-identify/stdout.raw.txt) / [stderr](commands/native-one-final-tool-identify/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-final-tool-identify/result.json) |
| freeze-position | 0 | [原始结果](commands/native-one-freeze-position/stdout.raw.txt) / [stderr](commands/native-one-freeze-position/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-freeze-position/result.json) |
| freeze-rules | 0 | [原始结果](commands/native-one-freeze-rules/stdout.raw.txt) / [stderr](commands/native-one-freeze-rules/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-freeze-rules/result.json) |
| freeze-rules-future | 0 | [原始结果](commands/native-one-freeze-rules-future/stdout.raw.txt) / [stderr](commands/native-one-freeze-rules-future/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-freeze-rules-future/result.json) |
| freeze-style | 0 | [原始结果](commands/native-one-freeze-style/stdout.raw.txt) / [stderr](commands/native-one-freeze-style/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-freeze-style/result.json) |
| freeze-v1 | 0 | [原始结果](commands/native-one-freeze-v1/stdout.raw.txt) / [stderr](commands/native-one-freeze-v1/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-freeze-v1/result.json) |
| freeze-v2 | 0 | [原始结果](commands/native-one-freeze-v2/stdout.raw.txt) / [stderr](commands/native-one-freeze-v2/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-freeze-v2/result.json) |
| future-check | 0 | [原始结果](commands/native-one-future-check/stdout.raw.txt) / [stderr](commands/native-one-future-check/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-future-check/result.json) |
| help | 0 | [原始结果](commands/native-one-help/stdout.raw.txt) / [stderr](commands/native-one-help/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-help/result.json) |
| impact-position | 0 | [原始结果](commands/native-one-impact-position/stdout.raw.txt) / [stderr](commands/native-one-impact-position/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-impact-position/result.json) |
| impact-rules | 0 | [原始结果](commands/native-one-impact-rules/stdout.raw.txt) / [stderr](commands/native-one-impact-rules/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-impact-rules/result.json) |
| impact-rules-future | 0 | [原始结果](commands/native-one-impact-rules-future/stdout.raw.txt) / [stderr](commands/native-one-impact-rules-future/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-impact-rules-future/result.json) |
| impact-style | 0 | [原始结果](commands/native-one-impact-style/stdout.raw.txt) / [stderr](commands/native-one-impact-style/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-impact-style/result.json) |
| impact-v1 | 0 | [原始结果](commands/native-one-impact-v1/stdout.raw.txt) / [stderr](commands/native-one-impact-v1/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-impact-v1/result.json) |
| impact-v2 | 0 | [原始结果](commands/native-one-impact-v2/stdout.raw.txt) / [stderr](commands/native-one-impact-v2/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-impact-v2/result.json) |
| init | 0 | [原始结果](commands/native-one-init/stdout.raw.txt) / [stderr](commands/native-one-init/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-init/result.json) |
| initial-status | 0 | [原始结果](commands/native-one-initial-status/stdout.raw.txt) / [stderr](commands/native-one-initial-status/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-initial-status/result.json) |
| long-enable | 0 | [原始结果](commands/native-one-long-enable/stdout.raw.txt) / [stderr](commands/native-one-long-enable/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-long-enable/result.json) |
| paused-status | 0 | [原始结果](commands/native-one-paused-status/stdout.raw.txt) / [stderr](commands/native-one-paused-status/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-paused-status/result.json) |
| plan-1 | 0 | [原始结果](commands/native-one-plan-1/stdout.raw.txt) / [stderr](commands/native-one-plan-1/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-plan-1/result.json) |
| plan-2 | 0 | [原始结果](commands/native-one-plan-2/stdout.raw.txt) / [stderr](commands/native-one-plan-2/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-plan-2/result.json) |
| plan-2-ready | 0 | [原始结果](commands/native-one-plan-2-ready/stdout.raw.txt) / [stderr](commands/native-one-plan-2-ready/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-plan-2-ready/result.json) |
| plan-3 | 0 | [原始结果](commands/native-one-plan-3/stdout.raw.txt) / [stderr](commands/native-one-plan-3/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-plan-3/result.json) |
| plan-4 | 0 | [原始结果](commands/native-one-plan-4/stdout.raw.txt) / [stderr](commands/native-one-plan-4/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-plan-4/result.json) |
| plan-5 | 0 | [原始结果](commands/native-one-plan-5/stdout.raw.txt) / [stderr](commands/native-one-plan-5/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-plan-5/result.json) |
| plan-6 | 0 | [原始结果](commands/native-one-plan-6/stdout.raw.txt) / [stderr](commands/native-one-plan-6/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-plan-6/result.json) |
| publish-position | 0 | [原始结果](commands/native-one-publish-position/stdout.raw.txt) / [stderr](commands/native-one-publish-position/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-publish-position/result.json) |
| publish-rules | 0 | [原始结果](commands/native-one-publish-rules/stdout.raw.txt) / [stderr](commands/native-one-publish-rules/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-publish-rules/result.json) |
| publish-rules-future | 0 | [原始结果](commands/native-one-publish-rules-future/stdout.raw.txt) / [stderr](commands/native-one-publish-rules-future/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-publish-rules-future/result.json) |
| publish-style | 0 | [原始结果](commands/native-one-publish-style/stdout.raw.txt) / [stderr](commands/native-one-publish-style/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-publish-style/result.json) |
| publish-v1 | 0 | [原始结果](commands/native-one-publish-v1/stdout.raw.txt) / [stderr](commands/native-one-publish-v1/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-publish-v1/result.json) |
| publish-v2 | 0 | [原始结果](commands/native-one-publish-v2/stdout.raw.txt) / [stderr](commands/native-one-publish-v2/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-publish-v2/result.json) |
| record-1 | 0 | [原始结果](commands/native-one-record-1/stdout.raw.txt) / [stderr](commands/native-one-record-1/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-record-1/result.json) |
| record-2 | 0 | [原始结果](commands/native-one-record-2/stdout.raw.txt) / [stderr](commands/native-one-record-2/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-record-2/result.json) |
| record-3 | 0 | [原始结果](commands/native-one-record-3/stdout.raw.txt) / [stderr](commands/native-one-record-3/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-record-3/result.json) |
| record-4 | 0 | [原始结果](commands/native-one-record-4/stdout.raw.txt) / [stderr](commands/native-one-record-4/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-record-4/result.json) |
| record-5 | 0 | [原始结果](commands/native-one-record-5/stdout.raw.txt) / [stderr](commands/native-one-record-5/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-record-5/result.json) |
| record-6 | 0 | [原始结果](commands/native-one-record-6/stdout.raw.txt) / [stderr](commands/native-one-record-6/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-record-6/result.json) |
| rev-check | 0 | [原始结果](commands/native-one-rev-check/stdout.raw.txt) / [stderr](commands/native-one-rev-check/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-rev-check/result.json) |
| rev-context-1 | 0 | [原始结果](commands/native-one-rev-context-1/stdout.raw.txt) / [stderr](commands/native-one-rev-context-1/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-rev-context-1/result.json) |
| rev-context-2 | 0 | [原始结果](commands/native-one-rev-context-2/stdout.raw.txt) / [stderr](commands/native-one-rev-context-2/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-rev-context-2/result.json) |
| rev-context-3 | 0 | [原始结果](commands/native-one-rev-context-3/stdout.raw.txt) / [stderr](commands/native-one-rev-context-3/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-rev-context-3/result.json) |
| rev-context-4 | 0 | [原始结果](commands/native-one-rev-context-4/stdout.raw.txt) / [stderr](commands/native-one-rev-context-4/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-rev-context-4/result.json) |
| rev-context-5 | 0 | [原始结果](commands/native-one-rev-context-5/stdout.raw.txt) / [stderr](commands/native-one-rev-context-5/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-rev-context-5/result.json) |
| rev-context-6 | 0 | [原始结果](commands/native-one-rev-context-6/stdout.raw.txt) / [stderr](commands/native-one-rev-context-6/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-rev-context-6/result.json) |
| rev-record-1 | 0 | [原始结果](commands/native-one-rev-record-1/stdout.raw.txt) / [stderr](commands/native-one-rev-record-1/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-rev-record-1/result.json) |
| rev-record-2 | 0 | [原始结果](commands/native-one-rev-record-2/stdout.raw.txt) / [stderr](commands/native-one-rev-record-2/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-rev-record-2/result.json) |
| rev-record-3 | 0 | [原始结果](commands/native-one-rev-record-3/stdout.raw.txt) / [stderr](commands/native-one-rev-record-3/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-rev-record-3/result.json) |
| rev-record-4 | 0 | [原始结果](commands/native-one-rev-record-4/stdout.raw.txt) / [stderr](commands/native-one-rev-record-4/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-rev-record-4/result.json) |
| rev-record-5 | 0 | [原始结果](commands/native-one-rev-record-5/stdout.raw.txt) / [stderr](commands/native-one-rev-record-5/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-rev-record-5/result.json) |
| rev-record-6 | 0 | [原始结果](commands/native-one-rev-record-6/stdout.raw.txt) / [stderr](commands/native-one-rev-record-6/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-rev-record-6/result.json) |
| rev-review-1-6 | 0 | [原始结果](commands/native-one-rev-review-1-6/stdout.raw.txt) / [stderr](commands/native-one-rev-review-1-6/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-rev-review-1-6/result.json) |
| rev-rewind | 0 | [原始结果](commands/native-one-rev-rewind/stdout.raw.txt) / [stderr](commands/native-one-rev-rewind/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-rev-rewind/result.json) |
| rev-template-1 | 0 | [原始结果](commands/native-one-rev-template-1/stdout.raw.txt) / [stderr](commands/native-one-rev-template-1/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-rev-template-1/result.json) |
| rev-template-2 | 0 | [原始结果](commands/native-one-rev-template-2/stdout.raw.txt) / [stderr](commands/native-one-rev-template-2/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-rev-template-2/result.json) |
| rev-template-3 | 0 | [原始结果](commands/native-one-rev-template-3/stdout.raw.txt) / [stderr](commands/native-one-rev-template-3/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-rev-template-3/result.json) |
| rev-template-4 | 0 | [原始结果](commands/native-one-rev-template-4/stdout.raw.txt) / [stderr](commands/native-one-rev-template-4/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-rev-template-4/result.json) |
| rev-template-5 | 0 | [原始结果](commands/native-one-rev-template-5/stdout.raw.txt) / [stderr](commands/native-one-rev-template-5/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-rev-template-5/result.json) |
| rev-template-6 | 0 | [原始结果](commands/native-one-rev-template-6/stdout.raw.txt) / [stderr](commands/native-one-rev-template-6/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-rev-template-6/result.json) |
| review-1-3 | 0 | [原始结果](commands/native-one-review-1-3/stdout.raw.txt) / [stderr](commands/native-one-review-1-3/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-review-1-3/result.json) |
| review-1-6-initial | 0 | [原始结果](commands/native-one-review-1-6-initial/stdout.raw.txt) / [stderr](commands/native-one-review-1-6-initial/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-review-1-6-initial/result.json) |
| revision-begin | 0 | [原始结果](commands/native-one-revision-begin/stdout.raw.txt) / [stderr](commands/native-one-revision-begin/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-revision-begin/result.json) |
| revision-commit | 0 | [原始结果](commands/native-one-revision-commit/stdout.raw.txt) / [stderr](commands/native-one-revision-commit/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-revision-commit/result.json) |
| revision-help | 0 | [原始结果](commands/native-one-revision-help/stdout.raw.txt) / [stderr](commands/native-one-revision-help/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-revision-help/result.json) |
| revision-prepare | 0 | [原始结果](commands/native-one-revision-prepare/stdout.raw.txt) / [stderr](commands/native-one-revision-prepare/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-revision-prepare/result.json) |
| source-current-six | 0 | [原始结果](commands/native-one-source-current-six/stdout.raw.txt) / [stderr](commands/native-one-source-current-six/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-source-current-six/result.json) |
| source-empty | 0 | [原始结果](commands/native-one-source-empty/stdout.raw.txt) / [stderr](commands/native-one-source-empty/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-source-empty/result.json) |
| source-future-seven | 0 | [原始结果](commands/native-one-source-future-seven/stdout.raw.txt) / [stderr](commands/native-one-source-future-seven/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-source-future-seven/result.json) |
| source-help | 0 | [原始结果](commands/native-one-source-help/stdout.raw.txt) / [stderr](commands/native-one-source-help/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-source-help/result.json) |
| template-1 | 0 | [原始结果](commands/native-one-template-1/stdout.raw.txt) / [stderr](commands/native-one-template-1/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-template-1/result.json) |
| template-2 | 0 | [原始结果](commands/native-one-template-2/stdout.raw.txt) / [stderr](commands/native-one-template-2/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-template-2/result.json) |
| template-3 | 0 | [原始结果](commands/native-one-template-3/stdout.raw.txt) / [stderr](commands/native-one-template-3/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-template-3/result.json) |
| template-4 | 0 | [原始结果](commands/native-one-template-4/stdout.raw.txt) / [stderr](commands/native-one-template-4/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-template-4/result.json) |
| template-5 | 0 | [原始结果](commands/native-one-template-5/stdout.raw.txt) / [stderr](commands/native-one-template-5/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-template-5/result.json) |
| template-6 | 0 | [原始结果](commands/native-one-template-6/stdout.raw.txt) / [stderr](commands/native-one-template-6/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-template-6/result.json) |
| volume-v1 | 0 | [原始结果](commands/native-one-volume-v1/stdout.raw.txt) / [stderr](commands/native-one-volume-v1/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-volume-v1/result.json) |
| volume-v2 | 0 | [原始结果](commands/native-one-volume-v2/stdout.raw.txt) / [stderr](commands/native-one-volume-v2/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-volume-v2/result.json) |
| workflow-planning | 0 | [原始结果](commands/native-one-workflow-planning/stdout.raw.txt) / [stderr](commands/native-one-workflow-planning/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-workflow-planning/result.json) |
| workflow-revision | 0 | [原始结果](commands/native-one-workflow-revision/stdout.raw.txt) / [stderr](commands/native-one-workflow-revision/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-workflow-revision/result.json) |
| workflow-structure-pause | 0 | [原始结果](commands/native-one-workflow-structure-pause/stdout.raw.txt) / [stderr](commands/native-one-workflow-structure-pause/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-workflow-structure-pause/result.json) |
| workflow-trial | 2 | [原始结果](commands/native-one-workflow-trial/stdout.raw.txt) / [stderr](commands/native-one-workflow-trial/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-workflow-trial/result.json) |
| workflow-trial-ready | 0 | [原始结果](commands/native-one-workflow-trial-ready/stdout.raw.txt) / [stderr](commands/native-one-workflow-trial-ready/stderr.raw.txt) / [元数据与状态哈希](commands/native-one-workflow-trial-ready/result.json) |
