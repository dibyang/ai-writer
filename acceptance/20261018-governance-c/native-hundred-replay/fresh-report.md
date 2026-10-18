# 《关门以前》当前V2从零短篇流程

完成两章原创虚构合成验收，出场仅顾宁、许姨，一个借车归还事件。当前0.6/V2 init --mode long从空目录起步，schema5/long_form=true；长篇入口只验登记骨架，不称两章为长篇创作。没有使用真实作品或此前测试正文，不把V1六章创作追认为V2结果。

## 顺序与创作实读

一卷两章契约、定位、声音、规则和骨架先建；随后plan1/context1/template1，实际创作第1章767汉字，逐段完整实读后preview/record。第一章登记完成才plan2/context2/template2，实际写第2章717汉字，完整实读后preview/record。操作时序已在command-index核验，初稿保留于fresh-initial/chapter-one.md与chapter-two.md；最终稿在fresh-final/同名文件。入口初次误传--project退出2、没有创建作品，原记录保留后按--path纠正。

写完按真实范围暂停到discuss/plan，使用review-template并完整连续读两章。初始报告审查/native-four-初始两章.md冻结旧全文；正文及ledger中原句均完整保留：

> 顾宁把小车车推到许姨手边，松开了握着车把的手。

FRESH_C_TYPO=correctness/minor/high，是明确受控重复字。FRESH_C_STYLE=optional_style/suggestion/low，原句“轮子越过门槛，响了一声。”语义正确；更紧的表达仅个人偏好，不构成硬伤。没有虚构读者理解损害。

## 模拟作者范围与实际一字修订

研究/模拟作者修订原话.md保存本次用户提供的模拟原话，注明合成验收、不是真实作品作者决策：

> 采用第2章重复字，只删这一字；第1章可选表达原样保留。只授权 revise2–2，正文不续写第三章，不改变事实或人物声音；真实提交及当前版本复核后暂停。

workflow范围仅2–2，resolve按author_evidence冻结原话：采用typo、保留style。author标签仅模拟角色输入，不声称认证真实作者。相关原话冻结与完整取舍历史见fresh-final-typo-detail.json、fresh-final-style-detail.json。

revision begin基线8、rewind2，回放前后均保存replay-input。独立正文只删1个车；新正文全文实读，旧增量、设定与第1章连接逐项核查。六项replay_review记录摘要、人物、时间、四条ledger事实、完整旧引文/新引文及无第3章下游。未改摘要和事实字段。旧完整quote在新正文不存在，preview退出1/RECORD_INPUT_INVALID，前后state同SHA；更新P_CART与T_RETURN两条完整原句后preview/record成功。

> 顾宁把小车推到许姨手边，松开了握着车把的手。

重登后再次完整实读第2章尾段，仅登记2–2功能及空issues，没有处置第1章意见。prepare/commit真实完成，事务 c3009152-f31a-4744-955d-7b37de9f3577，主revision8→9，仅+1；重复commit unchanged=true且state同SHA。实际提交对象 a79e8eaf-5211-45e0-8123-7f7308fc40ad（与事务/会话ID分开）才用于apply FRESH_C_TYPO。随后在主作品重新从第1章完整读到第2章，形成当前审查/native-four-提交后当前两章.md，再verify同一应用项。保留项仍retained，不称修复；typo当前verified不等于作者定稿。

## 当前五项功能与比较

|章|目标|阻力|选择|后果|关系变化|
|---|---|---|---|---|---|
|1|想在关店前还车又继续借一晚；“我还想借一晚。”|许姨今晚同样需要小车运自家电扇；“我今晚也想省这点力气。”|接受不续借，选择付费寄存而不将对方的晚上继续借走；“那我去存书。七点前回来，来得及吗？”|失去带肉面预算，仍持车出门去落实，未冒充已寄存；“今天得换成家里那袋挂面了。”|从含混的今天改为明确的七点，接受许姨具体需要；““七点。”许姨说，“不是今天。””|
|2|将选择做成付费存书与实际还车；“她点下付款，听见柜锁轻轻弹开，才将纸箱从车上抱下来。”|书的重量与自己的预算没有消失，次日仍需承担；“明天取出来仍得搬，今天付的十二元只替她留住这一夜。”|按时松手还车，并直接提出不附借物的喝茶请求；“顾宁把小车推到许姨手边，松开了握着车把的手。”|车归许，双方各走，书留柜中，茶约仍须问且未赴；“她推车向左，顾宁的新屋在右，两个人在门前分开。”|顾宁可只为喝茶来，许姨仍有自己的不在场安排；“来以前问一句。我未必在店里。”|

第一章的收益是让顾宁接受许姨的真实自用需求、舍得付钱并失去肉面预算；第二章把付钱、存书、归还变成行动，并把喝茶从借物中分离。共同车把、时间对话属于单一事件的起承，不是失败—解释—再试—查验的复演。保留许姨短答、自己的用车需求和“不一定在店”限制；保留顾宁十二元的犹豫，不升级为无条件亲密或彻底性格改造。无陌生读者或市场证据。

## 保留、事实与证据版本

第1章初始/最终SHA：d90689cfe8e2dc6f31b8bf095772a27288f0f0f8413b9b62f2236d2e44f49622，767汉字/2744字节不变，完整登记对象逐字段相同。保留意见的原句与author_choice在fresh-retained-evidence.json。第2章717→716汉字，2586→2583字节；仅删一个code point，所有其他正文UTF-8字节保持。

第2章旧SHA 6ac6517c7f7b314666d8db3aeff75a72649cc0cdc97e61c206786e618007315f；新SHA 9e9f6467807491dda490e40bb3729101f383e4cf1c0cd8ae45713a2c10a87410。当前facts（移除ledger evidence）全对象相同，独立哈希 324941dc01e18b701bd4657933562df7dcbdc6f3bf5f188a7484a4db80ba340c。支付12元、18:56交车、19点分路、书柜存、茶约未赴均不变。全snapshot SHA变化仅因引文/正文版本锚点更新；不能说整个snapshot字节不变。旧报告与初始冻结正文仍留存，不追改旧意见证据。

当前ledger4项、10个锚点，均核正文SHA/引文/行号；当前两章结构报告和replay_review的冻结对象有效。rolling valid2/stale1，旧初始报告stale有当前完整两章报告覆盖；不删除它来清零。

## 交付与停止

最终revision13，仅discuss/plan，draft_range=null、revise_range=null，正文目录仅两章，无第3章。check正常，无finding或未登记稿；作品doctor正常。主构建guard c9c6ca170c19b518a26782e6aae044c27c84f4ca0c5d88830aba1a44ddc7e0ec，所有产品调用仍用主0.6入口，复制工具只用于只读构建比较。

新目录fresh-export包含1–2，excluded=[]、warnings=[]，manifest源码SHA逐项匹配。实际合订5333字节，SHA f23ee52a1bdab1261464933186ac26b3df26de3ef8df9a12763b89bcec3a5b67；已按每章trim首尾空白的实际配方逐字节重建比对，不称合订原字节。导出仍是草稿。

这是知情模型创作、自检及受控验收样本。重复字检出不代表自然查错率，两个功能表/脚本通过不代表长篇质量或正式发布验收。保存fresh-handoff.json交接后停止，不扩写。
