# 最小首批A：native-two独立恢复与最终微型作品实跑报告

本轮要求的两条流程均已实际执行：六章作品只读恢复、越权拒绝和构建核对；随后由当前主工具新建独立微型作品，走完初始化、有限授权、逐项决策、细纲、上下文、模板、写作、自检、正式登记、check和全部暂停。共37条产品CLI记录，30次成功、7次预期拒绝，真实CLI退出码均为0或2。另发现1项暂停后错误提示的引导问题，未修产品代码。不能据此判定产品全面验收或可发布。

原始命令证据在../commands/native-two-*/，每个标签唯一，保留stdout.raw.txt、stderr.raw.txt和result.json。本阶段输入、盘点、反馈和本报告均在native-recover；唯一授权写入的作品是本目录下的“最终微型作品”。JSON观察摘要为observations.json，含全部命令参数、真实退出码、stdout/stderr哈希及核查明细。

## 1. 资料与隔离边界

使用当前主项目writer-project、writer-novel、writer-review技能及其相关审查参考，读取docs/workflow.md；从“纸灯札记”的正式state、决策事件、冻结原话、作者指令和正文恢复。未读取前一个native-create的request/final/events，也未读取其他测试的预期答案。未使用记忆恢复答案，未启用子代理。

本会话未修改产品源码、capture包装器或既有六章作品，未迁移/更新真实小说，未写D:/work/小说/dzkxqxx，未提交、推送、上传或发布。当前主项目开始时已有未提交改动；本轮没有处理这些改动。未调用lib函数代替实际产品CLI；所有产品动作均经用户指定的capture入口启动真实node CLI。一用性盘点脚本仅使用Node内置模块做字节核查、输入准备和报告汇总。

本轮期间有一项环境观察：第一次读取capture.mjs为22行，后续复读为37行，后者额外保存input/build/前后state元数据；本会话没有修改它，也未推断修改者。最后观测副本和哈希见capture-observed.mjs.txt、capture-observed.json。早期命令仍保留真实退出码及全量输出，并由独立前后全树哈希补足不变性证据。主项目公共受管构建在前后identify中保持相同指纹。

## 2. 六章作品恢复出的正式任务

主入口与随附入口各自实际执行status、context --purpose discussion、decision current，结果一致：

| 项目 | 实际值 |
| --- | --- |
| 作品 | 纸灯札记，novel，state schema 3 |
| 已登记范围 | 第1—6章，均为draft-recorded；revision=12 |
| next_unit | 7，仅为登记顺序 |
| stage/task | structure；暂停正文，先讨论全书总纲 |
| allowed_actions | discuss、plan |
| draft_range / revise_range | null / null |
| stop_conditions | 不准备第7章细纲、不写第7章；总纲及新的有限授权未经明确确认，不恢复正文或修订 |
| 漂移及正文盘点 | stale_units=[]、changed_sources=[]；6份已登记正文，无未登记候选或unsafe_entries |
| 实际下一步 | 以discussion恢复并讨论全书总纲；不因next_unit=7推进正文 |

discussion上下文实际成功返回purpose=discussion、当前任务、允许范围、已选和候选项及无漂移诊断，不需要第7章细纲。本轮未进行新的总纲创作，只核实恢复入口并给出六章模型复读反馈。

逐项选择来自正式事件及作者原话，而非题材常识：

| 类别 | 正式内容 | 原话证据 |
| --- | --- | --- |
| 已确认 | D_SECT：青岚宗方向 | “宗门方向已选青岚宗，只确认这个方向，不确认经名、住舍人数和作息数字” |
| 已确认 | D_CRAFT：炼器先行 | “技艺路线已选炼器先行” |
| 候选 | D_FIRST_ITEM：小盾（仅推荐），adopted_items=[] | “首件法器仍未选，小盾仅推荐。” |
| 未决 | 经名、住舍人数、作息数字、首件法器 | 正式决策unresolved_items及原话明确排除采纳 |
| 草案/未决 | 定位、人物、文风、全书骨架、V1契约和1—6章细纲未获整体采纳；终局、篇幅、后续卷数待讨论 | governance.planning及研究/六章复盘与总纲讨论.md |

研究/作者指令.md和冻结原话对象的实际SHA-256均为f3985204320b2fcbde6d7cf23076d6ab36fe1fa4baf489d92b330ebf05b857b5，字节相同。5份治理事件逐份核对事件哈希、本地来源哈希、冻结哈希、quote在来源及冻结对象中存在，均匹配。当前workflow绑定到98c0f7c8-f332-4c94-a9dd-42da25b8fc24事件；三个决策与各自不可变事件对应。locator、recorded_by均实际读取，未编造消息ID；这证明绑定字节，不证明作者身份认证。

## 3. 六次真实越权请求及不变性

伪登记输入six-forbidden-record.json仅有unit=7、expected_revision=12、空来源、未存在的第7章路径、说明性摘要和空changes；没有正文，不制造细纲。两套入口各自执行下列三项，全部在授权检查处拒绝，而非以缺文件冒充越权拒绝。

| 标签后缀 | 实际请求 | stderr.code | 真实CLI退出码 |
| --- | --- | --- | --- |
| six-main-draft-context | context --purpose draft --unit 7 | ACTION_OUT_OF_SCOPE | 2 |
| six-main-record-template | record-template --unit 7 | ACTION_OUT_OF_SCOPE | 2 |
| six-main-record | record，输入unit=7 | ACTION_OUT_OF_SCOPE | 2 |
| six-copy-draft-context | 同上，随附入口 | ACTION_OUT_OF_SCOPE | 2 |
| six-copy-record-template | 同上，随附入口 | ACTION_OUT_OF_SCOPE | 2 |
| six-copy-record | 同上，随附入口 | ACTION_OUT_OF_SCOPE | 2 |

标签均以native-two-开头。原始错误写于各自stderr.raw.txt，stdout为空；result.json保留真实exit_code=2。执行环境的外层命令回包可能显示非零为1，报告以包装器保存的子进程真实退出码为准。没有扩大workflow授权，没有取到有效写作模板，也没有建立第7章正文或细纲。

| 六章作品哈希 | 起点、只读恢复后、整轮结束时均相同 |
| --- | --- |
| state字节SHA-256 | 007a9b29a16b4006cd26facbbcb1f263399ac7cbe739d0fa1ef568a20fa861bd |
| 正文清单SHA-256 | aed0e3cc33581653e158e6eff8c358737fb404fdd49abe5ad57caed753832e29 |
| 全102文件清单SHA-256 | efbe83a83f41a5eb28df9f83ba70f8bb983e3bde588754907f27e6cfeb5dc097 |

正文清单由按路径排序的path/bytes/sha256数组计算；全树清单同法。six-before.json、six-after-recovery.json、six-after-all.json保存完整逐文件清单；无新增、删除或修改文件。没有向该作品写输入、报告、锁残留或状态。

## 4. 两个作品分别核对构建

两套入口对两个作品分别实际执行tool identify和tool compare。所有版本号均为0.4.0，支持state schemas 1/2/3；主项目profile=main，副本profile=workspace-copy。两份副本初始化清单各45项（content 7、runtime 9、skills 29），逐项读取实际字节和哈希，各45/45匹配，missing=[]、mismatches=[]。

| 对象 | observed_content_id | runtime_id |
| --- | --- | --- |
| 当前主项目 | 83053facf5ee9604e03a351688a66babe31181626743c4197fc4828b200241ae | 766354af4935d9dcc2fb9ec4088ef33ce6066eaac9881d6e6979f6f15d21c3a9 |
| 六章旧测试副本 | 4445d3b042df7ce080fa3bb84ed49b38adf67fa02fa1d4d8ed4ecb8313ac592c | f65e2bbbced61a4fa9df356eb5b2edcf9c784a1d65ae9350983fdbe107c5c61c |
| 最终微型作品新副本 | 与当前主项目相同 | 与当前主项目相同 |

六章副本与当前主项目same_version=true、same_content=false，真实公共受管差异为：docs/user-guide.md、lib/governance.mjs、lib/workspace.mjs、writer-project/references/long-form.md。两项为运行模块，一项文档，一项技能参考，完整双方SHA见six-build-summary.json。旧副本内部仍匹配其初始化清单，并非副本自身被破坏。

新微型副本与当前主项目same_version=true、same_content=true、differences=[]，初始化build_id也等于上述当前主项目内容ID。副本为manifest-present-not-a-signature，主项目为observed-source-tree；provenance均报告source_commit=36bd9c27797a43dd958e74b4e4b8f5b9713e140a、dirty=true。此指纹是磁盘观测，不是签名或干净发布证明。

完整质量引擎不属于本次公共受管内容比较，workspace-copy有意省略引擎；不将其判作缺陷，也未声称gate或完整引擎通过。没有升级、替换任何旧工具。

## 5. 六章复读与已有检查边界

本会话已完整实读六章、全部逐章差量journal、六份自检、两份滚动报告及相关追踪和设定。6份journal哈希、7条灯具ledger证据的正文哈希/行号引文，以及2份正式review的报告和正文绑定均匹配。主入口check实际成功：units=6、revision=12、findings=[]、rolling_review.valid=2、pending_windows=[]；同时明确scope=mechanical-only、literary_quality=unreviewed。

模型复读反馈见six-model-reread.md：灯具与人物认知连续，没有确认的连续性硬伤；第2—4章及后两章的“提问—提示—查验—归纳”节奏和维修边界说明有重复风险。陶娘承认漏看、补袖口和歪针脚应保留。第6章“从这句话起，灯才算正式交给陶娘保管”略有记录式口气，属风格观察，不据此改稿。此为模型复读，不是作者定稿或真人盲读；已纠正初读中对新补纸/旧纸样的误指，不把该误读列为作品问题。

## 6. 最终构建的新微型作品全流程

本作品位于native-recover/最终微型作品，是当前主工具实际init的新目录，不是旧六章作品的更新。作者原话原样保存在研究/作者指令.md，SHA-256=f01560be09145236215d9e947e1037543ba953236afc5f54d02336d136df3fc1；4份治理事件的来源、冻结原话、引文和事件哈希全部匹配。未给无来源的消息ID。

按实际执行顺序，全部标签为native-two-final-开头：

| 动作 | 结果 |
| --- | --- |
| init、initial-status | schema 3、revision=0，无登记正文，默认仅discuss/plan |
| workflow-trial | revision=1，trial，仅plan/draft，draft_range=1—1、revise_range=null；完成本章后全部暂停 |
| decision-location | revision=2，D_LOCATION confirmed，仅采纳河埠 |
| decision-ending-prop | revision=3，D_END_PROP candidate，雨伞/铜铃均候选，adopted_items=[]，明确结尾道具未选 |
| plan | 实际保存单元1；短篇，不启用long-form，不分卷 |
| draft-context、record-template | 实际读取revision=3写作来源，8项source_hashes完整一致，模板在写前取得 |
| 写正文、写后自检 | 第1章365正文汉字；陈岑雨后点灯、照阶、交还，未加阴谋，未选雨伞或铜铃 |
| record | 使用写前模板原来源，changes差量登记，revision=4，draft-recorded；未刷新哈希绕门禁 |
| check | units=1，findings=[]，mechanical-only；literary_quality=unreviewed，quality_review仍required |
| workflow-paused | revision=5，paused，allowed_actions=[]，draft_range=null、revise_range=null |

正文SHA-256=474ee6ef68df8ca4f460bd13d4d6aa8e47a4cc0098292e531d3bbb4e503bdb87。完整模型自检存于该作品审查/0001-写后自检.md；只修改过新稿自身两处措辞，由初稿361字调整为365字。作品的正式decision持续保留河埠已选、结尾道具未定；事实changes只记本章发生的动作，没有把候选道具写进事实。

## 7. 暂停后的可执行建议、拒绝与哈希

主入口和新随附入口的最终status一致：next_unit=2，但stage=paused、allowed_actions=[]、两范围null，不存在第2章细纲或正文。各自next.command都指向本入口的只读workflow show，未指向已禁用的discussion。两条建议按输出的实际绝对路径和参数经包装器执行，逐token核对与建议一致，均exit_code=0，workflow仍为paused。

之后的一次显式拒绝探针：native-two-final-discussion-denied，context --purpose discussion，真实stderr.code=ACTION_OUT_OF_SCOPE，exit_code=2，错误正确指出不允许discuss。它是本验收要求的拒绝测试，没有开展讨论内容或改变授权。

| 微型作品暂停后哈希 | status、建议命令、拒绝探针及构建核对前后相同 |
| --- | --- |
| state字节SHA-256 | 1e4b310699a6dcc1609c08c5af3d2575348cbb793941d8accf663f0a4b5977db |
| 正文清单SHA-256 | 80f0327883e535be37eb229424614ce1f77a203a3f2a5f273f9e9b6dff4aab99 |
| 全74文件清单SHA-256 | 5af188f6a8e8b3f028172cfecc0db22b23dd604d83a63bdf9aaf760d83ae6d5e |

完整清单在final-paused-before-readonly.json与final-after-readonly.json。暂停后作品全74文件均无新增、删除或字节变化。暂停后没有执行任何写作、规划、修订或决策写入。

## 8. 发现的问题与复现

F1，操作提示问题，未修：全部暂停时discussion确实被拒绝，但错误回包的next_action仍写“按当前任务继续讨论/规划；只有作者另有明确指令时才更新范围。”这与同一回包内allowed_actions=[]矛盾。最终status的workflow show建议本身正确，正式授权保护未被绕过。

复现直接使用当前最终微型作品，不修改其状态：

```powershell
node acceptance/20261018-governance-a/capture.mjs native-two-f1-reproduce-001 node bin/ai-writer.mjs context --project "acceptance/20261018-governance-a/native-recover/最终微型作品" --purpose discussion
```

复现时须保持标签唯一；现有真实证据无需重跑，位于../commands/native-two-final-discussion-denied/stderr.raw.txt。建议主会话将该阶段错误引导改为只读workflow show或等待作者新指令。本会话不修源码，也不为消除错误改授权。

## 9. 未覆盖项与停止状态

未测试迁移、回退修订、安全工具更新、并发写作事务、崩溃恢复、完整引擎、发布/导出、长篇规模或其他文体；没有声称这些能力通过。本次只在Windows当前Node/本地文件环境实跑。未修改工具，故未进行产品源码变更所要求的npm全套或engine回归；现有实跑不能代替全量产品回归。

六章旧作品仍是structure、仅discuss/plan、原102文件不变。最终微型作品仍为paused、allowed_actions=[]、两个范围null、已登记第1章365字、全74文件在暂停后不变。验收报告和JSON摘要完成后停止，不恢复创作。
