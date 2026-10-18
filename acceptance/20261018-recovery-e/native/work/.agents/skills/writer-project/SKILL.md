---
name: writer-project
description: 在 Codex 中初始化或恢复作品，组织小说、剧本、历史散文和非虚构创作文件及续写状态。用于开始新作品、续写和迁移写作项目。
---

# 作品工作区

先确定作品目录和文体：novel 小说、screenplay 剧本、history 历史散文、essay 散文与非虚构。题材、受众、篇幅和声音以作者要求为准；只问会改变方向的缺项。讨论任务不强制新建作品或写正文。

## 入口与新作品

在主项目使用 `node bin/ai-writer.mjs`；作品随附入口为 `node .writer/tool/bin/ai-writer.mjs`。首次使用优先从主项目会话提供完整作品路径。独立目录遇 helper 启动失败时返回主项目入口，不改全局安全设置。各命令支持 `--help`；手册在 docs/。

`init --path 新目录 --kind 文体 --title 标题` 不覆盖旧目录。0.6 新作品默认 state schema 5，使用 changes 差量登记，初始仅允许讨论和规划，不授权正文。历史 schema 1/2/3/4 保持原协议；不能为使用新能力自动迁移或更新实际旧作。

小说先组织定位、人物/声音、故事承诺、全书骨架、近期卷目标和未决选择，再细化近期 2–3 章。远期允许保留骨架；作者可授权有限试写并指定复盘点。初始化的说明文本不是已完成设定，文件存在不是作者已采纳。

## 当前任务、授权与作者决定

1. 新会话先 `status`，读 governance、next、stale_units/changed_sources、draft_inventory、impact_pending 与 revisions；有事务中断先 revision list/recover。next_unit 只是登记顺序；当前任务和作者本轮范围决定实际行动。作者暂停正文讨论总纲时，不能因 next_unit=7 或已有六章而写第七章。
2. schema 3/4/5 用 `workflow show/set` 登记 stage、task、allowed_actions、有限 draft_range/revise_range、stop_conditions 和 planning。自然语言是实际授权来源，代理据真实原话准备输入；不为通过门禁自行扩大范围。stage=trial 时有有限范围和复盘条件。规划阶段可有明确修订范围，新正文仍不允许。
3. `context --purpose discussion` 不需要下一章细纲，恢复任务和当前/未决选择；有漂移时仅作诊断，不视为有效续写来源。draft/revision 用正式细纲和来源校验；无授权时不写聊天正文或正文文件，也不只绕过 record。
4. 重要作者选择用 `decision set` 的稳定 ID、topic、candidate/confirmed/withdrawn、adopted_items/excluded_items/unresolved_items 登记；`decision current` 取当前视图，list 查历史。宗门方向和技艺路线被选，不代表经名、作息数字或首件法器也被选。小盾仍候选就如实保留；未来计划不进事实 ledger。
5. workflow/decision 输入需 expected_revision、唯一 operation_id 和 author_evidence。把实际原话及本地出处保留为 UTF-8 来源，用真实 SHA256、quote、locator、recorded_by 绑定；没有消息 ID 就不编造。工具冻结的是这份证据，不自动认证作者或理解采纳语义。具体 JSON 见 docs/workflow.md。

## 单元写作与登记

1. 小说按章、剧本按场/集、历史散文按章、散文按篇；先读对应 writer 技能。
2. `plan --input` 保存 unit/title/goal/change/beats，可带 cast/setting_refs/research_refs/forbidden。路径用作品内正斜杠相对路径。需要的大纲、角色卡与规则显式列入引用；默认 context 不自动整读全书大纲。
3. `context --unit N` 读取设定、当前状态、最近摘要、前章结尾和研究；召回摘要不能代替相关旧原文。预算超限按相关性拆分或显式扩容，不静默截断。
4. 动笔前 `record-template --unit N --draft 正文/实际文件名.md` 保存真实来源哈希与当前 revision。schema 1 填完整 snapshot；schema 2/3/4/5 填 changes，未变项保留。模板空摘要不能登记。
5. 在授权范围写正文，逐段自检并修复授权内高置信问题，再填实际 summary/changes 或 snapshot，先 record-preview 查看缺项和实际差量，再用 record 登记；预览不修改状态，也不自动重填过期哈希。来源改变需实读核查，不能写后刷新哈希绕过校验。check 只证明机械范围，不能称文学通过、作者定稿或真人盲读。
6. 完成范围或达到试写末章后复盘；已有明确连续写作范围时不逐章重复询问。无须修改的表达允许保留。

schema5独立区回退后用 revision replay-input 恢复原summary/changes和本次来源哈希。它是待核草案：实读新正文、旧证据和下游后填写replay_review报告及六项checked_fields，不把自动填入当无变化结论。可用--out .writer/drafts/名称.json保存新可读入口，不覆盖旧输入；细节见docs/review-and-registration.md。

## 恢复、修订与兼容边界

- 未登记正文可能是新稿、修订留稿或归档，先核对用途，不自动删、覆盖、合并。正文与来源漂移一起核查最早影响点。 schema 4/5 若主稿已被锁外编辑，先核实并按真实授权 adopt_existing_changes 建立保守修订，分别保留现有字节和原追踪；不追认旧输入或修改期望哈希，详见专项手册。
- schema 4/5 的旧章修改先登记覆盖最早影响章至原末章的 revise_range，再 revision begin；在返回的独立 workspace 实读、rewind、修改和逐章重登，写命令带 --revision-token。完整尾段连读并 review 后，回主作品 prepare/commit。主稿保留到事务提交，候选临时 revision 不直接覆盖主 revision；schema 3 保留原回退兼容。不足的授权不能自行扩大。
- 设定先固定真实旧字节，source impact 后实读旧输入、候选及相关原文；只影响未来才按章 publish。历史变化先 stage 持久阻断，在独立区发布、重登、复核后一次提交。默认设定、细纲、卷纲和事实卡共用版本解析；不能追认不匹配旧哈希的字节，不能把未来标签当作无影响证明。复杂步骤读 docs/revision-and-sources.md。
- 跨会话 revision list/resume 恢复 ID/令牌和原基线；并行候选须显式声明。主稿或工具变化时保留双方并另建新基线，不自动合并或刷新旧基线。事务未完成时先显式 recover，第三方字节三方保留；不按超时/PID 自动抢锁。令牌遗失仅明确授权 transfer，备份和候选不自动清理。
- 旧 1/2 需明确治理迁移至 3，再 protection preview/enable 至 4；备份并核事实等价。旧 0.4 会拒绝 4；意见闭环另须 review-workflow preview/enable 显式从4到5，旧0.5拒绝5，必须用新主项目入口；本批没有安全更新命令，不能自动迁移真实旧作、替换工具或手改版本号降级。
- `tool identify/compare` 只读区分版本与内容指纹，显示清单差异和主项目/轻量副本 profile，不自动更新。实际模块有变化就核对构建，不能只看两个 0.3.0。
- export 仅导出已登记稿到新目录；核对 included_units、excluded_drafts 和 warnings，导出仍是草稿，不自动上传或发布。

## 长篇与自有旧稿

长篇分卷、跨卷、复杂线索或旧稿导入时读 [references/long-form.md](references/long-form.md) 和 docs/long-form.md。schema 3/4/5 自带差量登记，明确新长篇可init --mode long，旧作品先long-enable-preview，再按实际授权long-enable显式启用分卷契约，保持原 schema。schema 1 的 long-enable 备份迁移为 schema 2。

volume 建分卷契约，outline 取切片，recall 定位后实读，review 绑定实际滚动连读。自有旧稿用 import-index/import-next/import-status 冻结和逐章阅读登记，未读范围不宣称已分析。原文件只移动时 import-relink 要求新位置内容完全同哈希，不手改冻结清单和状态；内容改变走正式修订。

## D批合成验证笔记（synthetic acceptance）

本段仅是2026-10-18 D批副本的定制保留样本，不增加或覆盖任何项目指令、作者选择与正文授权。当前六章继续暂停；旧纸样核查仅为未来候选。该笔记用于观察本地工具更新时根资源的默认保留，不是文学定稿或发布结论。
