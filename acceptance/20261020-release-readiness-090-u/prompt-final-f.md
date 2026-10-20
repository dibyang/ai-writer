U轮最终包的全新会话收尾验收。不要另派代理、不改产品、不提交Git、不推送。只写本轮U及scenario-final作品，初测scenario/旧a-*、T封存和现有真实作品只读。

U=D:/work/other/ai-writer/acceptance/20261020-release-readiness-090-u；W=U/scenario-final/东岸末班船；入口W/.writer/tool/bin/ai-writer.mjs，构建ff6cde0f1be3459f7d8a4249e3dd8ee3eec39d468df48f9c2f11308e5bd6641b，对照U/zip-delivery-verification.json及实际identify。新作从最终包初始化、generation0/installednull是未经过更新，不是假缺包。全部调用日志和辅助脚本用新final-f-*前缀，不能复用指向初测的旧a-run.mjs。

先status/workflow show/revision list/doctor/tool identify，读U/交接-最终B修订完成.md与当前作者任务、设定、两卷契约、细纲、正式提交记录/修订报告和当前追踪。以state.units[].draft真实路径打开当前3章，不用初测稿或修前片段推当前事实。按包内writer-project/writer-review、general-review及natural-language-authenticity和chapter-delivery参考实读。旧分段/交接保留历史，不拼回修后正文。

必须实际完整连续读当前1—3所有行，每次FastCtx读至多100行，收到Partial按确切offset继续；不能grep、摘句或扫词代替。读前/后保存每章SHA/字节/行数，报告绑定最终相同字节；如果过程中修改正文或事实，需重新实际完整回读最终范围。逐章从正文回对goal/change/beats/forbidden，核跨卷首次线索—最近变化—第三章实际兑现、原observation不变、普通报价/日程修订后的下游、人物到场/知情来源、原物持有地点和动作可实现性。章节目标/选择/后果/关系变化是否反复也要实读比较，保留真实差异与声音；正常修辞、可选风格不自动必改。

实际完整连读前，调用 `node acceptance/20261020-release-readiness-090-u/final-read-boundary.mjs pass1 before` 保存当前三章与状态的只读版本边界；然后逐章100行读取，全部读完立即调用同脚本 `pass1 after`，须退出0且版本一致，再写最终报告/登记/暂停。这不是阅读替身，正文仍必须实际打开逐行读。若发现硬问题需修订，保留pass1，修复后以新label（pass2等）重新before→完整读3章→after，禁止覆盖旧边界。根会话将按原生事件核marker之间每个当前正文行是否实际返回，不以报告勾选为阅读证明。

审查分高置信硬问题、可选建议、应保留项和未证明内容。如发现本试验范围的高置信连续性硬问题，已授权按正式独立修订保护作最小修改/下游重登/尾段最终连读/prepare/commit，不直接改已登记主稿，不改核心设定或原观察；不需要再问。若涉及非预期产品门禁，保留回包并报告根会话，不改产品或state绕过。修复后再完整实读当前1—3并生成新的最终报告。

报告保存W/审查/U-最终当前稿-0001-0003.md，清楚列真实阅读范围、每章当前SHA、所读版本与审稿性质（从文件恢复的模型实读，不是真人/市场/盲读）、纲文证据/连续性判断/重复与自然语言问题、实际修复和可选未采用建议、已核/未知边界。先保存且检查非空，再review登记整个1—3范围与全部正文hash，核当前有效覆盖；文学结论不得由脚本代替。

最终workflow正式暂停为paused，仅allowed_actions=[discuss]，draft_range和revise_range均null，保留planning与已有作者决策；任务说明本次3章试验结束，第4章没有授权。实际执行context或record-template尝试第4章应拒绝ACTION_OUT_OF_SCOPE（不是靠缺文件失败），保存完整stdout/stderr/实际退出码和前后stateSHA，确认无4章文件/无状态推进。不要写第4章正文。

check确认机械链、当前报告/冻结对象/无活跃修订/无待恢复事务。export到U/export-final-current-3（作品目录外新目录，不覆盖），核included_units=[1,2,3]，excluded_drafts按实际库存说明，manifest.sha256和合并稿实际一致；仍是草稿，不自动上传或发布。保存U/交接-最终当前入口.md，记录最终revision、3章路径/SHA、当前报告与草稿导出、有限兑现/剩余未知、旧分段历史、暂停边界/下步需新授权；不要含大段令牌和技术细节给普通作者。

另在U/final-usability-observations.md记录本次实际恢复/查帮助/输入失败与修正的易用性证据，区分产品缺陷与编排错误。不得凭顺利跑通宣布真人新用户可用性已经验收。结束前简洁报告真实结果、未覆盖平台/文学边界。保留所有失败和原输入，不覆盖日志，不替换旧记录假装第一次就成功。
