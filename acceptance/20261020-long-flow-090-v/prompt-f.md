V最终新鲜会话F：当前12章全文复核、暂停和草稿导出。V=D:/work/other/ai-writer/acceptance/20261020-long-flow-090-v；W=V/scenario/东岸末班船-扩展验证。只写V及W，U/T/产品/既有作品只读，不派代理，不Git提交/推送/上传。只用W随包CLI；修订区仍父入口+project/token。总体授权见prompt-a-first.md及本提示；不写13。所有CLI和辅助步骤原始输入/双流/实际子进程码/前后state留V/cli-logs，新标签不覆盖旧文件。

先status/workflow/revision list/identify/doctor，读交接-C完成.md、两项修订选择及当前定位/声音/骨架/卷契约/章纲与必要原始事实。身份核delivery-start.json；generation0/installednull不误报。读W随包writer-project、writer-review、general-review、natural-language-authenticity及review-and-registration/workflow。恢复事实必须按state.units[].draft和当前journal指针，不手选旧UUID或拼文件名，历史报告仅作线索不冒充当前稿。

真实全文阅读必须留一致边界：在任何正文1—12全文连读前，执行 `node acceptance/20261020-long-flow-090-v/read-boundary.mjs pass1 before`；其JSON marker须出现在实际原生命令输出中（可用记录器，但命令须包含read-boundary.mjs）。然后按当前state顺序1→12，FastCtx每次≤100行、Partial按精确offset续读，实际完整返回全部当前正文。不得用grep、提纲、交接、旧分段、脚本回显或脚本批量喂文本代替模型实读。读完12后、任何审查登记/治理写入前运行同脚本pass1 after，版本应同一。根会话会从实际原生事件逐行对当前正文核覆盖；报告勾选不等于实读。

实读后保存W/审查/V-最终当前稿-0001-0012.md，绑定全部12章真实当前SHA/范围/阅读性质（模型知情实读，非真人盲读）。重点：三条4—6种下、8/11/12兑现的真实动作和关系收益，逐条首次/最近/人物所知/是否真兑现；7/9两项追溯改动及全部下游；原箱/钱据/35月底费和各自后来实际发生的界限；每章目标/选择/后果/关系变化，辨认重复动作是否有不同收益；纲文回对、人物声音与语言、物理动作。原1—3及所有immutable observation三项不改，不能因清单齐就声称文学/市场通过。可选节奏/风格建议保留待作者选择，不自动必改；普通未知不靠补写13解决。

若发现4—12高置信硬问题，本测试授权在覆盖最早影响章到12的正式revision独立区修复、逐章replay+draft_review+实际尾段连读/prepare/commit，保留pass1及所有原输入。修后必须再用全新pass2 before→当前1—12完整模型实读→after，不能拼接不同版本的散读当完整当前稿。涉及1—3的疑点保留基线证据报告根，不越过本轮原三章不改边界。若无硬问题不为制造修复而改稿。

报告实际保存后，以正式review-template准备结构化逐章功能比较和comparison/范围12章/实际SHA，完成review登记；check应无当前缺覆盖/待review窗口，旧过期报告保留但已有当前有效覆盖。完整范围不能只登记7—12。保持现有planning/decisions内容，不把候选变确认。

正式workflow设paused，仅allowed_actions=['discuss']，draft_range和revise_range均null，task明确12章有限试验结束、13无授权。真实尝试context --unit 13 --purpose draft及record-template --unit 13 --draft 正文/0013-无授权.md，两项预期ACTION_OUT_OF_SCOPE/实际码2、state完全不变、不创建13正文；不能把PLAN_NOT_FOUND或缺文件当越权保护通过。允许context --purpose discussion恢复讨论。最后check/revision list/doctor均核当前，确认无活跃修订/待恢复事务。

导出到V/export-final-current-12新目录（不覆盖）：只included1—12，核manifest.units逐项当前SHA及source_hashes、excluded_drafts/warnings解释，独立按导出规则重组当前正文比合并稿字节/哈希；仍draft-export/quality_review required，保留旧未登记稿原件，不删、不混入导出。保存V/交接-最终当前入口.md、final-usability-observations.md和证据索引，明确真实已读/改/未改、文学可选/未知、实际CLI失败及修正、完整范围、暂停/导出和平台边界。正常结束给根复核，不声称真人新手、市场、全平台、60/100章或正式发布验收。
