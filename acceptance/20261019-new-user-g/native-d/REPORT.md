# G轮 native-d 实跑报告

状态：指定新作品本地流程完成，正文已暂停，交付仍是草稿。最终核验见 verification-corrected.json；原失败 verification-final.json 保留。所有产品操作经 capture.mjs 使用唯一 d- 标签，原输入、stdout/stderr、状态前后SHA和运行身份见 commands.json（52项，含只读Git状态）。没有直接import业务API。

## 恢复与修订

作品：D:\work\other\ai-writer\acceptance\20261019-new-user-g\作品\雾港 来信；正文：D:\work\other\ai-writer\acceptance\20261019-new-user-g\作品\雾港 来信\正文。
仅从native-c/handoff及本作品恢复，未扫描其他acceptance业务输入。实核主18、分支21、同ID 42162d65-14b2-46fa-89ea-c9cb66bbfb0b，原base_revision18、base指纹 e8046c3a51ecea97f95d41371c726cc6d0f4bb03f1dc2ec539078c2552c10ab1。resume没有刷新基线或更换令牌；主稿在全部重登前始终为原字节。C原初主15是历史信息，不是本次提交基线。

C已重登2–3；D完整实读候选2–6、原摘要/人物/时间线/19项ledger与引文及实际下游。第4章8项/11处引文、第5章7项/12处、第6章10项/18处均有六项replay_review报告，先preview后record，分支21→22→23→24。第1章不重登，原单位记录与6份原journal均逐字节保留。

实际净收益改动存在：第2章39行“你是不是问他欠多少修理费了？”→“你问过他修理费要多少吗？”。整文件等于原稿仅作此一次替换，未增金额或付款事实。第1及3–6章正文完全原字节。C把第3章摘要的签借条者澄清为陶芷，此次保留；不是改写第3章剧情。主snapshot相对原基线只有6项ledger中7处第2章引文SHA按正式重登换绑，原句、观察、人物知识、物件、到期和状态其余相同。原文件88项核对，除主state、第2章正文及正式工具更新替换的build-manifest外均保留；第三项有已完成更新事务的旧/新SHA证明。

## 最终完整阅读与正式提交

全部2–6最终登记且停止正文修改后，发出指定阅读标记，随后依序完整显示并阅读最终1/2、3/4、5/6章，全部路径+SHA+行号正文无截断。包含尾段2–6和前缀1；不是把前面的重登读稿拼成六章报告。实际读稿版本在readings.json、read-versions；父模型事件才可证明曝光，自声明与核验脚本不能替代理解或真人阅读。

报告：D:\work\other\ai-writer\acceptance\20261019-new-user-g\作品\雾港 来信\审查\0001-0006-D最终完整连读.md。review from1/to6正式登记于 .writer/reviews/3f6e87ca-6ffb-49c0-8611-fe51f774e898.json，分支24→25。主作品prepare后事务 81dd7355-9b24-4be3-9a9c-33605b6288af completed，主18→19。提交对象commit_id=56812ed3-72bb-4dfc-818e-fb0abea306b3；相同commit输入重试unchanged，state SHA未变。主稿仅第2章正文变化，第1章记录原样，旧观察/物件与知识链连续；旧报告3份仍保留，当前完整报告1份，pending_windows空。

意见 I_C_CH2_REPAIR_FEE_DIRECTION：原adopted为agent-within-authorized-scope、author_choice=null。主事务完成后才apply至20，再以主作品当前有效六章报告verify至21，最终仍effective_status=verified。最初误把transaction_id当commit_id，apply拒绝；随后错误预期20的verify也拒绝。两个失败未改state，原输入原输出均保留；读正式publication对象后新输入d-028成功，再d-029复核，没有假报候选已应用或虚构真人取舍。

## g4资源更新与真实入口

已读PACKAGE-STAGES及四份source-build。初包→final→g3→g4仅6份文档变化；四阶段runtime_id均为 2caacf37df3842559663ef2ea380baaa33b85cd6bf29637e5ae45fe8e4cd1628。旧包content_id=d672568ec98345708756c40d7f1d490c301089b6134b429106dda2dfe62d7e1f，新包content_id=828109ec3ed7cd40564059ab42cc0fba82d72aa88ead15d880a6fda79406a71f，版本都0.7.4，未把同版本当同内容。

仅在原修订committed、无活跃会话后，从外部主入口针对当前最终源码update-plan；source的61项与source-build-g4完全相同、无blocker、根39项政策全preserve，documents=[]。按本轮真实用户原话准备授权输入并正式update，事务9823844e-f137-4c79-9770-91788baf4e2f completed，主21→22、generation0→1。相同输入重试unchanged、state SHA不变。没有enable、schema仍6，没有手动重建清单。

更新前后正文/units/snapshot完全一致；58个根AGENTS、技能、手册、设定与大纲资源保持。旧根手册有意保留，随附入口help指向.writer/tool/docs最新手册。更新后实际从随附入口运行help、doctor、status、discussion context、identify和与冻结g4的compare：doctor无errors/warnings，compare same_content=true，61项身份一致。主项目当前61份资源逐项仍同g4；源码运行模块未修改，Git工作区已有改动原样保留。

## 暂停与导出

正式workflow paused于主revision23，allowed_actions=discuss/plan，无正文或修订区间。第7章draft context、record-template均ACTION_OUT_OF_SCOPE且state SHA未变；未创建第7章。暂停后的discussion恢复也成功。当前6章已登记、无未登记稿、无活跃会话或pending事务；check只代表机械一致性。

新导出：D:\work\other\ai-writer\acceptance\20261019-new-user-g\exports\雾港来信-D-r23-草稿。manifest实际纳入1–6，excluded_drafts=[]、warnings=[]，status=draft-export、quality_review=required。逐章正文完整按序存在于manuscript，哈希 11fc6e1caf72ae601bb8dfcb1626c4c98cb3fcff1767e04eb4cad0ece3aadfb5 与manifest吻合，不覆盖旧导出。后续只讨论/规划，无新明确授权不写下一章。

## 失败纠正与边界

除意见标识误用外，收尾自有审计首次把正式更新build-manifest误判为不允许变化，保留verification-final.json。修正版核对completed更新事务的旧/新SHA后通过，见verification-corrected.json；没有改产品状态求绿灯。第4章报告草稿计数12→11在record之前纠正，正式登记冻结的是纠正稿。部分大型元数据输出截断，原capture完整保存并用聚焦摘要补核；最终六章正文曝光全部完整。支持文档副本是在先前实际FastCtx/CLI阅读之后补存，support-readings.json明示时间性质。

寄件者身份/动机、旧材料账/金额/付款、周一搬钟及新墙/新址开放、月底取阅回访仍未核或未做。文学判断为知情模型自检，不称全书文学无误、真人盲读、作者定稿、市场或专业修理验收。未联网研究、付费生成、上传、Git提交/推送或发布。没有修改主产品模块，故未运行主项目测试；辅助审计通过不代替产品完整测试。原A/B/C档案、包、阅读记录和报告未改。
