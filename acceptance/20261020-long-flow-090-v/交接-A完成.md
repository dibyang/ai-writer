# V 同一实际A会话恢复完成交接

本进程完成4—6章，到6停止，等待根独立核验和B新提示。未写7、未建7细纲、未开启正式修订。当前存在一项明确未修复的登记日期措辞问题，见下文。本文及证据索引不能代替根的独立核验。

## 入口、状态与真实授权

- V：`D:/work/other/ai-writer/acceptance/20261020-long-flow-090-v`
- W：`V/scenario/东岸末班船-扩展验证`；project_id仍为`a8035b97-80cf-4c77-80db-bdccf05c29bf`。
- 唯一CLI：`W/.writer/tool/bin/ai-writer.mjs`，始终显式传`--project W`。未从产品源码入口执行。
- 当前治理revision **24**，schema6；state SHA：`85ef095e7dceca979f0b46e44b644dfcbcd2a17bd64294175203848b253c057c`。
- 当前stage=`trial`，动作=`discuss/plan/draft`，draft_range=`4—6`，revise_range=`null`。task明确4—6整稿、报告、登记和1—6连读review已完成，到6等待B，7—9需根新提示。planning及decisions均原样保留。
- `next_unit=7`仅反映进度；status已提示试写范围到达、先复盘。当前不允许借此直接写7。
- 真实本提示保存在`W/研究/V-A-恢复限定原文.md`，SHA `83432f7e37086212de3e866c1a7014a9e6456e000c472002b0b7c0f277df3507`；`prompt-a-resume.md`另按字节保存为`研究/V-A-恢复任务.md`。workflow起止都引用实际原文和SHA。情节由代理在根整体有限试验授权内组织，不伪称人类逐字指定。
- 不知道实际Codex thread ID，未编造。列表中的已提交`8cf5ae0a-54f3-424b-b89e-61562f20d120`是继承的2—3章修订session，不是A的thread。本进程没有新开revision session。

## 工具身份与记录方式

最终正式`tool identify`结果在`cli-logs/ar47-final-identify/`：version0.9.0，workspace-copy；content_id=`ff6cde0f1be3459f7d8a4249e3dd8ee3eec39d468df48f9c2f11308e5bd6641b`，与delivery-start一致；runtime_id=`9ed9031ff670f4c6e0ef5754b32e079e436d5e6de9576912b4742b6f541b138f`。generation0、installednull表示未更新，不是假缺包。manifest身份记录不等于签名或正式发布验收。

产品CLI及辅助子进程使用`V/v-log.mjs`，每个标签新目录保存argv、输入原字节、stdout.raw.txt、stderr.raw.txt、实际退出码、前后state原字节和SHA。原失败和输入不覆盖。两个证据限制明示在下文，不声称记录链毫无缺口。

## 读取、写前来源和原片段

恢复阶段已从实际文件核对首停交接及根的`parent-a-first-verification.json`，正式status/workflow/revision list/identify恢复入口。完整读取随包writer-project、writer-novel、writer-review及chapter-delivery、general-review、natural-language-authenticity，以及quickstart、long-form、revision-and-sources、review-and-registration等说明；使用随包规则。逐章读写前context，消费骨架、V3契约、近期章纲及人物设定。

原revision17写前模板`.writer/drafts/v-a-record-4-before.json`仍在，SHA `2e3cb45be9b6c444e0a5d5d26dd76b37373e49227e380ffed04849698763ec09`。首停两个片段原字节保持：

|片段|正文汉字|SHA-256|
|---|---:|---|
|分段/0004/v1/01.md|1151|558eb60ce2c5d9b36c2ec753a4ef76132c544b683999d32c8c4db9aa53408113|
|分段/0004/v1/02.md|1158|a899d1299b90a1a628a3577943081f67f239ea2ed616f6c309b50874c3c19493|

先以`ar-before-governance-proof.json`证明原模板来源及两段无漂移，再正式workflow set收窄到4—6，revision17→18。`ar-governance-only-proof.json`证明除`.writer/state.json`外所有内容来源映射相同；state本身是被消费来源，治理修改后其SHA必然变化，不能声称整份source_hashes完全相同。第4章03写前才生成revision18的新context和`v-ar-record-4-r18-before.json`；没有写后刷新来源。5、6写前模板分别绑定revision19、20，原字节都保留。最终核对各模板的非state来源仍无漂移。

## 实际已写与正式登记

|章|当前登记整稿（W相对路径）|正文汉字|登记后revision|
|---|---|---:|---:|
|4|正文/0004-少蒸的两笼-v1.md|5820|19|
|5|正文/0005-门板靠墙-v1.md|3845|20|
|6|正文/0006-走一遍再画-v2.md|5124|21|

计数去Markdown标题后按Unicode Script=Han；新增三章14789，当前六章28754。4用5个顺序片段、5用4段、6最终用5段，其中6的01和04另存v2纠正，未覆盖v1。整章均由CLI assemble创建新文件，实际全文实读后分别保存`审查/V-A-恢复-0004-完整章自检.md`、`审查/V-A-恢复-0005-完整章自检.md`、`审查/V-A-恢复-0006-完整章自检.md`，record带draft_review的正文和报告SHA，preview成功才record。当前正文、原报告与冻结报告对象SHA都相符，详见`ar-final-verification.json`和`ar-evidence-index.json`。

在逐章实读之后，又按当前state.units对应的1—6整稿顺序完整连读。功能比较报告为`审查/V-A-恢复-0001-0006-连读功能比较.md`，正式review：`.writer/reviews/ab4336d4-512a-4261-8ad8-fe5bd086091b.json`，绑定全部六章SHA，revision22。真实功能比较区分代送、营业工时、家庭使用和公共出行，不将机械check当文学通过。可选建议集中在后续减少图纸说明段落、让真实交付和使用产生后果，不自动成为本轮必改。

最终status核出登记时间问题后另存补记、正式review到revision24：`.writer/reviews/90a6ef24-4a8a-421b-810b-62f2714a6b83.json`，正文六SHA与前次相同。报告`审查/V-A-恢复-0001-0006-连读补记-时间登记问题.md`及意见`V_A_U5_TIME_METADATA`保留真实问题；初次报告与review未覆盖。

## 必须带入B的未修复登记问题

**第5章record的summary和timeline两处“停航次日晚”是本代理措辞错误，正确应为“停航首日晚／末班船次日晚”。** 第4章下午收到周岸“今晚六点半”回字；第5章18:28承接同一晚；第6章首句明确停航第一天下午四点，是与5晚间并行的许蓉线。不存在已过去又一个停航日，不能据错词推定次晨取糕已发生。

已用正式review登记continuity/minor/high意见，当前为未修复。正文并无这个日期句，不需要因此重写正文。本阶段明确不启正式修订，故未手改state、原record或旧来源SHA，也未把解释当作数据已修好。根应独立判断正式纠正登记的授权与路径；B读取context时必须连同本补记处理，不能静默沿用错日序。

## 已发生状态与跨卷线索

|线索|首次／最近|当前已写、知情边界|尚待兑现|
|---|---|---|---|
|T_EARLY_BATCH，劳动工时|4／5，pending，due8|陈秀下午确认两包、各两块、每包4元，5:45—5:50自取、拿到再付。沈禾与谭老板约五点到店换下午早走半小时。许蓉只参与上午商量、实买和中午包装反馈，没见下午确认；沈父晚饭获告五点、两包、换工时，未听精确价格／窗口。|次晨实际到店、首单交付、下午早走和收热笼均未写；8需真实营业与时间后果，不能只再电话说一遍。|
|T_SHELF_USE，家庭使用|5／5，partial，due11|三人当面量柜并试放饭盒、碗；父亲同意按女儿饭盒留位，周岸有短痕和便笺。父女共同择豆芽、父亲先装女儿饭盒已发生。|柜门、层板未安装，11需真实回装、承重和再次取放，关系变化落实为共同使用。|
|T_ROUTE_STEP，出行照料|6／6，partial，due12|许蓉亲上石阶，老何留阶脚；后二人实走粮油店侧缓坡到东岸桥头，未过桥。检票同事只看母图听述未同行。问路妇人只从图和口述得知入口，离室向药店，未见走完。|12需具体出行或接手照料后果；不把看懂图等同抵达，也不凭本次路线延伸对岸站或全线验证。|

关键物件、钱和人物：

- 原箱4开头已实际合扣入梁家铺架下纸板；周岸那联与空钱袋夹借具本最后，梁伯看照片回语音。5章沈禾、沈父由周岸口述获知，非亲见；许蓉尚未获本次铺内到达消息。周自用帆布包与原箱八工具分开。
- 原80元退款及借具条、下联在沈家钱盒的3章闭环不重开；原西门35元工料月底未付，不把due3私自顺延。O_BOX_PAINT的type／statement／author_truth原三项相同，白漆不成新谜团。
- 沈父脚伤未愈，柜门仍靠墙，短螺丝在酱碟、饭后进柜旁小抽屉。旧合页一片获准随周岸入自用包侧袋下楼，便笺分裹；新件未买、材料工费与回装日期未定。周只电话约去拿电饭煲，未写取到。后续回装要交代旧样去向。
- 5章结尾沈禾饭盒装菜入冰箱；次晨父亲自己热饭仅约定。6章许蓉饭盒与两支勺吃后放挎包旁，女儿次晨洗盒仅约定；女儿已取包裹是手机回字，不是许蓉亲见。
- 入口母图夹候船室值班簿；三张补图一张在问路妇人外套袋，两张在窗台茶叶盒；未补旧图封旧信封“入口未补，先别发”放抽屉，已流出旧图及沈禾照片未收回。代班钥匙返许蓉，同事带笔杯离开接孩子；老何离室未写回家到达。两把椅借检修仅约收工摆回，尚未写返。

## 失败、纠正与证据限制

1. `ar26-prepare-assemble-6`实际退出1：初始五段4879汉字，依赖assemble停止，state未变。先保留五段原字节到`ar-before-minimum-fix/`，增加实际母女交流，重新计数再assemble；不复制旧段补数。
2. 第6章整稿v1实际全文实读发现将2章许蓉“漏写明早”误作老人“漏看”，以及同日回指写“前晚”。实读旧2/3后另存v2/01与v2/04、CLI创建v2整稿；v1整稿和所有原段均保留。`ar-0006-v1-to-v2.json`保存差异与SHA。
3. `ar37-prepare-stop`实际退出1：辅助脚本错读stdout.txt；核读v-log实际stdout.raw.txt后新建v2脚本和ar38标签，原脚本／失败不覆盖，workflow依赖在纠正成功后才执行。两次失败都不是产品缺陷。
4. 首停a12原包装器拒绝缺现场独立双流，原说明与复现保留，不将复现冒称首次。恢复过程中一次多余Get-Location只读命令未用统一记录器，实际工具合并返回另存`cli-logs/ar33a-location-inspection.json`；缺该次独立双流及瞬间stateSHA，ar33和ar34状态相同可核但不能冒充现场快照。该证据限制如实保留。
5. `ar51-evidence-index`辅助脚本多一个右括号，编译退出1，索引未生成、state未变；核明后另存`ar-close-evidence-v2.mjs`并以新标签生成索引，原脚本及双流保留。该次在ar50版本核对之后发生，终端索引与收据包含它，ar50的早先失败清单并非最终完整清单。

## 最终核对与后续入口

`ar-final-verification.json`的integrity_ok=true指版本与范围核对，不表示文学／产品验收。核对349个原W文件，仅state经正式CLI变化；原1—3单位记录和正文原字节相同；首停两段、revision17模板相同；原观察三项相同。U复制来源的349文件无变化、无新增；产品冻结清单324文件无变化。未向U/T或其他作品写入，未修改产品、提交、推送或上传。

当前stale_units、changed_sources、impact_pending为空；draft_review和两次连读冻结正文／报告均核SHA；planning与decisions保留。未登记旧1／2稿及第6章v1仅作历史留稿，不合并，不导出。F阶段的全文终审、pause仅discuss、13章负向测试和草稿导出均未执行。

根独立核验后，B的新提示应先处理本交接中的日期登记问题与正确日序，再正式收窄下一阶段治理。7—9仍只有上层骨架，没有细纲；可从停航第二日清晨的早班真实执行接续，具体场面仍由获授权代理组织，8落实有限早取与工时后果。11柜位、12路线兑现及之后7／9普通事实的隔离追溯修订属于后续，不属于本进程。既有骨架候选中的复航日、长期频次、材料工费等未选内容仍未决。

交接与可核证据索引：`ar-evidence-index.json`；返回后state收据：`ar-return-receipt.json`。本进程正常结束，到6等待根复核，不续7。
