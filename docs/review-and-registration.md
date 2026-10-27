# 跨章复核、登记减负与意见闭环

本页能力从schema5起适用，0.7新作品默认schema6。已有作品先由新主项目入口只读检查，依次显式启用已有治理、来源/修订保护，再通过review-workflow preview/enable启用schema5；正文、事实和旧登记不因启用重写。需要更新随附工具时另按[安全更新手册](tool-updates.md)显式启用6并替换，不能只复制CLI。

普通作者直接说明“连读最近六章，比较目标、选择、后果和关系变化，保留真正不同的内容”“只审查，不改稿”或“按这几条意见在指定章节内润色”。Codex负责准备工具输入，不要求作者手写JSON。审查报告、意见采用和已修改是不同状态，工具不能代替实读。

## 跨章重复复核

用review-template取得绑定当前正文哈希的输入；实际完整阅读范围内所有章节，逐章填写goal、obstacle、choice、consequence、relationship_change。observed填写text与本章evidence（unit/quote）；unknown或none说明reason。填写comparison的similar_structures、distinct_gains、preserve、optional_adjustments、limits。每个相似结构至少比较两章，分别有引文，并说明差异和保留项。共词不等于重复，词频/功能表存在不等于文学通过。

review可带chapter_functions、comparison及issues，须expected_revision、稳定operation_id。完整正文及报告按原字节冻结，记录复用.writer/reviews，不另造文学评分器。修改正文或依赖后旧报告失效，重新连读范围应如实记录，不拼接零散短评充当六章连读。

### 命令输入：comparison的准确形状

先用review-template保留当前from/to、source_hashes和逐章功能表，再填写比较。下面仅是comparison片段，文字和引文均为占位说明，不能原样登记或当作已读结论：

```json
{
  "similar_structures": [
    {
      "units": [1, 2],
      "judgment": "填写这两章实际相似的结构；不等于自动判重复",
      "differences": "填写两章不同的选择、后果和阅读收益",
      "preserve": "填写应保留的差异与声音",
      "optional_adjustments": ["填写确有阅读收益的可选调整；没有则用空数组"],
      "uncertainty": "填写本次判断的具体边界",
      "evidence": [
        {"unit": 1, "quote": "替换为第1章实际原句"},
        {"unit": 2, "quote": "替换为第2章实际原句"}
      ]
    }
  ],
  "distinct_gains": ["填写逐章不同的实际收益"],
  "preserve": ["填写整体应保留的内容"],
  "optional_adjustments": [],
  "limits": "填写实际完整读过的范围、版本与未能证明的内容"
}
```

外层distinct_gains、preserve、optional_adjustments均为**字符串数组**，不是按章对象或对象数组；外层limits是非空字符串。similar_structures是对象数组，可以为空；每项只允许示例中的七个字段，units至少两个不同实读章号，evidence必须分别覆盖这些章。其内judgment、differences、preserve、uncertainty是非空**字符串**，只有optional_adjustments是字符串数组。不要自造pattern、description等字段，不要混淆内外两种preserve类型。

没有实际相似结构就保留空数组，不为填表制造文学重复。格式拒绝时保留原输入，按所报字段准备修正版；不改正文/来源哈希，不缩小实际声明范围来规避验证。普通作者不填这些字段，由Codex根据真实阅读准备。

## 登记减负

明确长篇或跨卷的新作可用init --mode long，先安排骨架、卷契约、近期细纲、试写范围和复盘点。旧作先long-enable-preview；不执行long-enable即不迁移。实际启用备份并验证原事实链。record-template自动填路径、revision、来源与版本绑定，未变事实不用重复誊写。

record-preview与record共用校验，显示缺项、实际事实差异和未变项，预览不登记、不生成journal、不刷新过期来源。空摘要或坏引文仍拒绝。可选--out .writer/drafts/名称.json写新可读入口，不覆盖旧文件；它是草案，不能作正式设定来源。

先完整实读当前章、写完并保存报告，再preview；退出0才record。需要机械保证报告已保存且对应本稿时，添加 `draft_review`：`reviewer`、`report`（审查/下.md或.txt）、`draft_sha256`、`report_sha256`。工具核非空报告与两项实际SHA256，正式登记冻结报告对象；缺失、空白或版本变化先于状态/journal/报告对象写入拒绝。冻结对象后来缺失或被改写时诊断报 `DRAFT_REVIEW_CORRUPT`，保留现场，不追认新字节；报告原路径之后的正常编辑不覆盖原冻结版本。此字段可选，旧输入兼容；它不证明模型读过或文学通过，不替代 `replay_review` 和完整尾段复核。改稿或改报告后保留原输入，实读新版本后另存，不只刷新哈希。

账本 `type` 允许 `fact/thread/object/relationship/observation`，`status` 允许 `active/pending/partial/resolved/intentional-open`，不要填 `open`。错误 `LEDGER_VALUE_INVALID` 带具体字段及 `allowed_values`，按实际语义选择，不自动转换。preview阻断退出1，record异常退出2；保存真实退出码和双流，在失败处停止依赖步骤。

0.9预览另有related_unchanged_ledger：按输入显式更新的角色，以及变化条目里的角色，列出有共同知情角色、但本次未更新的条目；最近证据优先，最多8条，附总量和遗漏数。它不读懂“尚未”等语句，不判语义错误，不要求补齐所有候选。模型应按ID召回、实读正文，区分当前知情和带明确日期的历史描述；一项约定兑现不自动刷新另一项或同项未改子字段。需要更新时另存真实changes和引文后再预览，不换来源哈希；无变化有据可保留。

0.9重登草案按原登记前后的结构差异恢复ledger变化字段，character_known逐人保留真正变化的项；原本未变的知识不再整表写回，避免覆盖前章刚修好的字段。新条目仍给完整必要内容，物证换手仍核完整custody及previous_holder。已有条目的previous_holder与custody同级，取当前账本的保管人，不放在custody内；新保管去向及本章引文按真实正文填写。结构差量不是语义合并：角色整段状态、实际变化的说明和物证去向仍须实读核查，不自动认定原差量在新上下文中正确。

重登不会重置原观察保护。prepare、commit及中断后的complete会核对原会话基线中已有的observation：不能删除、改为其他类型，或改写statement/author_truth（含向原来未填的author_truth补值）。知情、状态及另建的解释可按实际新稿记录；若因原观察不符而阻断，保留原记录并新增修正，不把退回首次出现之前当作覆盖入口。rollback仍按原备份恢复。

历史小修仍使用revision begin，独立区rewind后调用revision replay-input --unit N --revision-token TOKEN，恢复原摘要、原changes和引文，填入本次当前context哈希。实际核读新正文、旧事实与下游承接后修正草案，填写replay_review：reviewer、审查/下report、draft_sha256及checked_fields六项summary/characters/timeline/ledger/evidence/downstream。报告真实记录核查内容，不能凭勾选字段宣称无变化。先record-preview，再record；完成整个尾段复核后prepare/commit。改稿后旧草案hash失效，应重新生成并核对。

## 意见闭环

list --id I_EXAMPLE可展开该意见的取舍历史。作者明确选择持续保存在author_choice中，一般润色授权不能替换它；代理重复记录同一选择也不洗掉作者依据。继续落实已明确采用项可在原范围处理，不重复确认；改变选择须作者新原话。独立分支的意见新增/处置也核声明范围，扩展连读不等于可处置范围外意见。

已有真实修复提交后，又改了其他表达或来源，可用覆盖当前新稿及依赖的有效实读报告再次verify，保留原application和本次所读版本，不为闭环捏造第二次“实际修改”；问题仍在则not-resolved并按新基线修订。state发布失败的结构化审查只列unpublished_records，不计有效覆盖；重试可正式发布，孤儿不自动删除。预览在空摘要时也先列当前范围阻断。

issues每条输入id、type（correctness/continuity/readability/optional_style）、severity（critical/major/minor/suggestion）、confidence（high/medium/low）、statement、suggestion、evidence。optional_style只能标suggestion，不自动升为必改。

review-issues list查看原意见和当前状态。resolve输入expected_revision、operation_id、id、disposition（adopted/retained/deferred）、reason和decision_actor。author须完整author_evidence；agent-within-authorized-scope须authorization绑定当前governance事件，采用时检查revise范围。仅有审查或讨论授权不能借采用意见取得改稿权限；代理处置不伪称作者逐项确认。

采用后按现有独立修订流程实改并提交。apply输入commit_id和reason，核已完成事务、采用时旧稿与当前新稿、至少一处对应原文实际变更。它不改正文，不把候选分支算作已发布。正式提交后再CAS登记应用，防止意见先于正文标成已修复。verify输入review_ref、reviewer、conclusion（resolved/not-resolved）及reason，必须指向覆盖该意见章节的当前有效模型实读报告。resolved是模型复核声明，不是作者定稿。

已采用的跨章意见可以只修错误章。引用9章对照21章、仅21章有错时，真实修订可从21开始；apply自动识别范围外的9章参考，不新增必填参数。它要求归档可核、采用基线匹配，并确认参考章在真实提交前、提交后及当前的完整登记和原文均未改变；范围内仍须有对应意见的实际修改。应用记录另列reference_units、target_units和归档依据，after_units仍包含全部证据章，verify不能只读21章。参考变化、当前目标已再次重登、无关提交或等价重登均不能冒充该次修复；旧意见、采用原话和历史事件保持。

正文正确、只有登记摘要或时间线写错时，仍先采用意见，再在正式独立修订区从最早影响单元回退、实读修正追踪、重登完整尾段并提交；原稿可保持同字节。此时apply的JSON额外设置`"change_scope": "tracking"`，其余expected_revision、operation_id、id、commit_id和reason照常准备。省略或写`draft`仍要求正文实际改变，不能改空格来凑条件。

tracking模式核对真实事务归档的前后状态、采用时旧登记和当前已发布登记；对应章的摘要或章末事实快照必须实际改变。对象键顺序、来源哈希、报告、journal引用或修订号变化均不能单独算修复。应用记录保存前后追踪哈希与事务依据，随后仍须覆盖相关章节的当前有效实读报告verify，联合核对正文和追踪是否一致。工具只证明有实际登记变化，不理解日期或判定意见已经解决。

再次修改正文、依赖或所绑定审查版本后，verified显示needs-recheck，旧记录及原话保留；retained保持“保留”，不冒充已修复。新一轮可重新resolve，绑定当时当前稿再修订。status和context只给简短意见摘要，不因可选建议阻断续写，不自动删句或隐去待定项。

### 已实际修好、原意见未先采纳

跨章证据不等于每章都需修改。代理resolve采用授权仍按全部引文章节保守检查；例如42章提供正确器物作为参考、只修45章，而本轮只授权43—45，原采纳会拒绝42—45范围。保留真实引文和失败输入，不缩证据、扩大授权或伪称作者逐条采用。普通45—45独立修订仍可按原授权完成。已经事先采用的意见则走前述apply，不用acknowledge改写采纳历史。

实际修订提交后，可用`review-issues acknowledge --project 作品目录 --input 补登记.json`。由Codex填写当前`expected_revision`、唯一`operation_id`、原意见`id`、真实`commit_id`、递增无重复的`target_units`、`reason`、`decision_actor: "agent-within-authorized-scope"`及当前`authorization`绑定。目标须来自原意见证据且在现有revise范围内；仅open或代理延期且没有任何既有采纳历史、高置信的correctness/continuity可用。代理延期的原因和原事件保留；已采用、作者保留/延期、可选润色、tracking-only或候选内部均不可用。

工具核原意见的旧稿与真实事务before，目标正文必须确有改变并匹配当前after；非目标参考章须在修前、修后及当前完全不变。新意见不能借旧提交认领修复；等价重登、伪造或损坏归档、修后又改变的版本均拒绝，保留诊断。补登记的新事件明确`phase=after-actual-repair`和`prior_adoption_recorded=false`，保存实际修复与当前接受的不同时间，状态只到applied。随后仍须现有verify，用覆盖**全部原证据章**的当前有效模型实读报告判resolved/not-resolved；不把补登记、机械校验或旧报告当文学验收，也不为闭环再制造一次错误。
