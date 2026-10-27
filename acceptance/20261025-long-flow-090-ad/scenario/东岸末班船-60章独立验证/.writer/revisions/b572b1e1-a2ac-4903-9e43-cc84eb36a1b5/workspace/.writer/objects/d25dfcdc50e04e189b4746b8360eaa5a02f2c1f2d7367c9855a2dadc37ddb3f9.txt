继续最终修正版同一个原生Codex会话的U轮新用户端到端测试，不另派代理、不改工具源码、不提交Git、不推送。你上次只完成了规划和第1章前两个分段后正常退出；本次从实际文件恢复，保留原片段及所有失败记录，不依赖旧聊天补写事实。初测scenario、a-*.mjs及旧交接只读，日志和辅助脚本使用新的final-a-*前缀，不能执行指向初测W的旧a-run.mjs。最终包身份ff6cde0f1be3459f7d8a4249e3dd8ee3eec39d468df48f9c2f11308e5bd6641b。

U=D:/work/other/ai-writer/acceptance/20261020-release-readiness-090-u，W=U/scenario-final/东岸末班船。工具使用W/.writer/tool/bin/ai-writer.mjs，来源候选是实际ZIP解压P=D:/work/other/ai-writer/.tmp/U 最终交付验收包解压/ai-writer-0.9.0。包身份必须与U/zip-delivery-verification.json一致。只写U与W，已有其他作品、T封存记录及仓库源码只读。

先status/workflow show/tool identify/revision list，实际读取U/交接-最终A首停.md、W既有设定/全书骨架/卷契约/章纲、两个原片段及它们的写前模板/context。核片段当前SHA等于交接停点；核原写前模板expected_revision及source_hashes仍有效，保留原输入，不在写后刷新哈希来规避。若实际入口名不同，先列实际路径再读，不能编造文件名。继续按P或W当前包内的writer-project、writer-novel、writer-review/长章交付流程及docs执行。

本进程只完成第1和2章：第1章至少5000正文汉字，现有前两段原字节保留，接续后续片段而非重写开头；第2章至少3500正文汉字，按实际事件分段（至少2段），所有分段不逐段record。计数按去掉标题行后的Unicode Script=Han，标点数字英语不算；不足靠有意义的行动/选择/后果展开，不靠重复解释或填句。每一续段前实读实际上段结尾，全文不向角色泄露章号/账本ID/审查结论。

逐章流程必须实际使用新能力：
1. 动笔前有有效细纲、context、record-template。第1章用原写前模板，第2章在第1章正式登记后取新的；不为了测试任意改来源。
2. 按实际片段顺序及SHA准备assemble输入，unit/expected_revision/新正文路径齐全。使用CLI assemble，只创建新稿不登记。检查输出SHA、byte数和片段字节连接相等；原片段不变。不用自写Buffer合章代替产品入口；若需改稿可在授权内改未登记完整稿，保留修改前稿并同步另存对应片段版本，不让陈旧片段成为恢复权威。
3. 完整实际阅读最终完整章，逐项从正文回对有效goal/change/beats/forbidden，核时间空间/各人物所知/物件去向/约定与实际兑现/自然语言。报告按实际版本写到审查/，先保存成功再登记，不用脚本声称已审。
4. 每个新登记输入都必须包含draft_review={reviewer,report,draft_sha256,report_sha256}，两项SHA来自实际当前正文及已保存报告。保留原写前source_hashes/expected_revision，填写真实summary/changes，ledger原观察不可改写，status仅active/pending/partial/resolved/intentional-open。
5. 先record-preview退出0再record；任何依赖失败立即停止，先保存失败原输入/双流/退出码，按实际原因另存修正版。不要失败后继续登记，不凭脚本成功等于文学通过。

在第1章完整稿已经实读、真实报告保存前，做一次受控保护验证：准备指向一个尚不存在的审查路径且draft_sha256正确、report_sha256为占位64hex的draft_review，使用实际CLI record-preview应退出1、record应退出2且都返回DRAFT_REVIEW_INVALID；核前后state、journal与objects列表不变，保存原始回包。它只测试报告保存门禁，不是假文学报告。然后保存真实报告、另存正确绑定输入，正常预览/登记。若测试返回异常结果，先停止并报告根会话，不改产品或手改state。

跨卷伏笔应只埋/延续至第2章，不提前写第三章兑现；第1章已有观察原字/作者真相不逆改，第2章的thread/object/各角色知情以实稿证据更新。明确一处普通报价或日程及其人物转述，为后续小范围追溯修改留下正常承接，不故意制造错误；这只是测试场景，普通选择标代理在授权范围内，不冒充人类逐项确认。

结束前完整实读当前1—2，保存报告并review登记真实范围/全部正文hash（报告保存先于review）。保存U/交接-最终A恢复完成.md，包含已登记范围、当前revision、两章路径和SHA/分段版本、源模板和实际记录输入、待第三章跨卷回收的原观察/约定/物件/谁知道什么、原始约定到期边界；记录临时错误和修正。保持原1—3有限授权，不开始第3章，不暂停到让下一进程丢失原范围（停点记录在交接）。本进程正常退出。不得称三章完成、真人盲读或正式发布。
