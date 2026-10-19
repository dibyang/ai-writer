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

历史小修仍使用revision begin，独立区rewind后调用revision replay-input --unit N --revision-token TOKEN，恢复原摘要、原changes和引文，填入本次当前context哈希。实际核读新正文、旧事实与下游承接后修正草案，填写replay_review：reviewer、审查/下report、draft_sha256及checked_fields六项summary/characters/timeline/ledger/evidence/downstream。报告真实记录核查内容，不能凭勾选字段宣称无变化。先record-preview，再record；完成整个尾段复核后prepare/commit。改稿后旧草案hash失效，应重新生成并核对。

## 意见闭环

list --id I_EXAMPLE可展开该意见的取舍历史。作者明确选择持续保存在author_choice中，一般润色授权不能替换它；代理重复记录同一选择也不洗掉作者依据。继续落实已明确采用项可在原范围处理，不重复确认；改变选择须作者新原话。独立分支的意见新增/处置也核声明范围，扩展连读不等于可处置范围外意见。

已有真实修复提交后，又改了其他表达或来源，可用覆盖当前新稿及依赖的有效实读报告再次verify，保留原application和本次所读版本，不为闭环捏造第二次“实际修改”；问题仍在则not-resolved并按新基线修订。state发布失败的结构化审查只列unpublished_records，不计有效覆盖；重试可正式发布，孤儿不自动删除。预览在空摘要时也先列当前范围阻断。

issues每条输入id、type（correctness/continuity/readability/optional_style）、severity（critical/major/minor/suggestion）、confidence（high/medium/low）、statement、suggestion、evidence。optional_style只能标suggestion，不自动升为必改。

review-issues list查看原意见和当前状态。resolve输入expected_revision、operation_id、id、disposition（adopted/retained/deferred）、reason和decision_actor。author须完整author_evidence；agent-within-authorized-scope须authorization绑定当前governance事件，采用时检查revise范围。仅有审查或讨论授权不能借采用意见取得改稿权限；代理处置不伪称作者逐项确认。

采用后按现有独立修订流程实改并提交。apply输入commit_id和reason，核已完成事务、采用时旧稿与当前新稿、至少一处对应原文实际变更。它不改正文，不把候选分支算作已发布。正式提交后再CAS登记应用，防止意见先于正文标成已修复。verify输入review_ref、reviewer、conclusion（resolved/not-resolved）及reason，必须指向覆盖该意见章节的当前有效模型实读报告。resolved是模型复核声明，不是作者定稿。

再次修改正文、依赖或所绑定审查版本后，verified显示needs-recheck，旧记录及原话保留；retained保持“保留”，不冒充已修复。新一轮可重新resolve，绑定当时当前稿再修订。status和context只给简短意见摘要，不因可选建议阻断续写，不自动删句或隐去待定项。
