# AL轮后续核验会话G交接

已完成本次授权：原ID恢复、118原输入重新preview及同字节record、完整110—118滚动连读登记、原会话prepare通过后原生revision commit到合成主稿。原session现为committed，事务3cd96ef2-cb69-48e2-b114-152fd5e95f4b为completed；主稿revision474、118章、next119。候选保留revision483、118章。这里的commit是产品修订事务，不是Git提交。没有Git提交、推送、上传、付费生成或对外发布，未访问真实作品，未使用子代理。

## 原身份和实时基线

project_id：cd8e8d32-f685-41b1-8f52-5447fe29d399；原修订ID：dd6f0f3b-1f02-4db2-be4e-34fe7fe658c7；owner仍AL-session-d-independent-old-chapter-revision；scope110—118。沿用父目录d-resume-input.json原token，未新begin/transfer或刷新base。恢复输入SHA仍0afe26ca11fa5f910dc27fd8ac4242dde496b0cf0f902fbbad05dd24e8224920。

原base_revision473，base.json SHA 407040ab54b5715c83e042afe6712135f880dd4a6c1340ec95d27d7fc78e0bf5；base-state及开始主state SHA d0584647414d9bbc4c4fb3d0b8575fae7fcb46fab612120e2d2e3840d714205a；开始候选482/117章/next118，state SHA 5f7ba7a6d5364068eee85fb3b469238082197b21cecaf70d06005d5a7be49e58。g-001实际resume、g-002实际status与独立字节核验一致。主稿1321个base inventory文件在record前及prepare后均逐项不变。

最终主state SHA：4f7aded75dd43bc8181bc27828322a14b653624e9d32a14896ee4b15a3366628；候选state SHA：345feeae58a602b06f503ccfa9af226fae4ee330999dbf64ca6026cf00bb8383。base.json/base-state和原恢复文件仍保持原哈希。原作者资料保留；workflow中的D轮停112历史文字没有被篡改成本轮授权，本轮继续和应用授权来自本次用户实际指令。

## 独立证明：保留F失败，确认排序差别

完整读writer-project/novel/review技能及long-form、general-review、natural-language-authenticity，读writer.json、定位/文风/权威规则及D/E/F交接、F失败定位记录和源脚本。f-evidence.mjs第44行使用整个数组deep equal，F当时在118 preview后exit1，原失败不撤销、不覆盖、不改写成成功。f-order-independent-check.mjs原先导入主项目lib；G独立证明改用本合成目录随附的当前journal.mjs，源码SHA为590220142c6918b901544f419e80066a57e0d8886195ae23e8eff74d177fde5d，未执行或修改旧检查脚本。

G从实际原118 journal与F preview取26项，以当前候选117末snapshot为相同基线。只在比较内存中按sha256字段重锚110/112的实际新正文SHA，不改磁盘锚或来源。两组路径各26条且唯一，逐路径操作全部深相等；两两检查无祖先/子孙重叠。两种顺序应用后深相等，结果JSON SHA为7cae88c4c39b5b5af298370b79a071a9faf2d30c7c2e939955734a699cca6f61；还独立等于仅重锚110/112后的原118终snapshot。原117终snapshot重锚后也等于当前候选基线。排序区别仅P_BLUE_SHIRT72_117的character_known沈/葛两项与custody location/condition两项互换先后。

证明保存在session-g-start-audit.json与g-audit.mjs；原f-order-independent-check.json的结果被独立复现，不是凭其ok字段继续。g-003重新preview的changes与F preview连顺序也完全一致。session-g-preflight.json另外核实两处正文差别严格只有D轮既定替换。所有F输入、双流、失败报告与stopped-audit保留。

## 真实实读与版本

完整实读候选110—118九章，并回读27、95、100、105、107、109，共15章；均通过FastCtx全文读取。没有完整读其余早章，不把1303条引文机械核对说成全书实读。正文G轮零改动。详细逐章判断、118六项依据、自然语言审查和未知事项在合成主稿及候选均有：审查/AL-g-110-118-rolling-review.md，SHA b684269badf7f8e45829062a1b4c5665cc108b98e7c6e0ecfeea82ce2a725c2a。

|章|本轮实读正文SHA256（最终主稿与候选相同）|
|---|---|
|27|c7b9105e0b8ee7589ae4db62c1707228dedc6f13d91c351c47b8d05cc2a81755|
|95|93eb336cc249745f32b3884fbb4b79a9899cf3e767c85ac4744f3f0f0c5f5f01|
|100|6f7f439a1adf22655fc76510906bb88c9dd450a0051ea795d446485cae35c89e|
|105|8f8c80b30b9e117e6e0f60bd065459890426b81b1f032ef68dd17fafb32a691b|
|107|d6c99f4523f1672f7a5335e5da4f185ecf2ef8fe2708af79864ba4e035c5eae6|
|109|6e5a548bab62681fceaef4a8e76329f6db1baa545750098a1675a98bd7cc38f9|
|110|6cee6a5f054e6d5f9d907b8f4e51fe03f8d1344efec2ce3bd5792817d22e6907|
|111|cbc97a650146b666a82778ae04ea4922d7a508c8e05ed8aaa2e74c2fa75fc0e1|
|112|edb4f3bdb8342de8fb07ca34a4acafdc114ebc3d948b67656785ee44111e96c1|
|113|d434a40fe31ccb106b74ba1675a322ad7c629f584430114ca1620f87c1c6c704|
|114|3e183ae32f8444ec332c359448141f9f133dcd5cda3e67c301098c7593ab171d|
|115|e1aea5f98804223d75542a21ca54cb44d25c6ed5f02e92c9ab4df5dd3b7cf829|
|116|22550dc370f4f72a781de47d98a98e039f939b99ae56b3a86bb04a6d43398ead|
|117|5865649be73eb9e7179db221504a11e30fc6f8ab34032c20314e585f0df357b2|
|118|6541555378cb613d60e8da5cf8fa3cd70b53c515a7ff8f11b5148de668d960d0|

重点结论：110“接问”→“接着问”仍是想问未问，素姐63行才自己说班主任；112第31行改语序仍仅沈觉得等待不长，不削掉葛看手机/问时间的着急。111第47行口述“专门留的，最后专门倒”才是118“三天前她讲”的69日锚，不是110的68日沈亲见倒饭。

116 journal解析内容与原journal完全相同，SHA不同仅为JSON序列化差异；117唯一字段差别为patch[4].after.evidence[0].sha256随112正文从3a6b74df44cfe9747e0b60e7351195a9364beeb31b5c76578c8ba2543f8a7c84变为edb4f3bdb8342de8fb07ca34a4acafdc114ebc3d948b67656785ee44111e96c1。112第37行蓝衫引文原字/行号不变，117第133行葛点头才确认；没有伪称116也有新增跨章引用。

118：菜砂剔除、鱼老仍承认且吃、各自添饭，葛只有限帮挪垫/扶盘/让路；葛只听115扶伞口述，未读桥页，后来修成未知。照片用葛自己手机拍成两张后归葛自留，沈无副本；蓝衫始终葛穿持。19:18楼口后只见街角前，到家未知。116工作初版到顾、修后仅沈自测的版本边界到118仍在，240无订单/认可。

## 118 preview/record与rolling绑定

原AL-f-record118.json未过期：g-003产品preview exit0、ok=true、findings空、source_hashes matched-current-context；全部来源逐项实时hash相符，原F118报告SHA仍1184c90de137fc599d5fb0427adc3e36c6122bb5740f072ec5830bcbf67a0c6a。G实读完整输入和报告，逐项核摘要/人物/时间线/账本/引文/下游六项，不重建或手改来源哈希。原六项checked_fields保留，另以G完整报告记本次独立核读依据。

g-004实际record复用同一文件、同字节输入SHA f9f330e1763e3fa9b2b2068ae5e1ed8720da24c3ed97f3279a4ac9574bd1f7c2，与g-003的input.raw完全一致，候选482→483。record journal 26项逐路径等于preview，实际终snapshot等于preview对原候选基线的应用结果。118报告已原生冻结绑定；旧F报告不改署名为G。

g-005 review真实登记110—118，记录.writer/reviews/b742c305-d873-45c0-bc52-6ebbef528916.json，revision_session绑定原ID、九章SHA和报告SHA都已核对；quality=review-recorded-not-acceptance。报告在118实际record前写成，在record后按最终同字节正文登记；不声称写报告时prepare/commit已发生。

## prepare、事务与最终主稿验收

g-006/007/008核候选check/来源/status。g-009原revision prepare成功：status prepared、base473、target474；session-g-prepared-audit.json独立核整棵准备树及57项清单，已有文件只改变110/112正文和state，另外54项为新增journal、冻结报告、review记录和阅读证据，无删除。

g-010原revision commit成功；事务3cd96ef2-cb69-48e2-b114-152fd5e95f4b原生completed，backups_preserved=true，原session为committed。session-g-final-audit.json逐项核全部57个事务目标/new备份、3个old备份及主state与prepared.target_state深相等。原1321个base文件保留，其中1318个字节未变、3个按准备清单改变；全部旧不可变对象/旧journal/旧review仍在。主稿118份正文逐项等于候选，只有110和112相较base变化；1—109原登记逐项不变。候选和原base/token/全部历史事务均保留。

g-011/012/013在最终主稿重新status/check/source list：revision474、118章、next119；check ok=true、findings空、无未登记稿，stale_units/changed_sources/impact_pending空；source entry_differences/pending_edits/impact_pending空。工具仍0.10.0，13条产品命令runtime_files_stable全部true，没有修改工具或运行无关npm测试。

## 未决事项

rolling valid25/stale121；pending_windows仍97—102、100—105、103—108、106—111、109—114。没有为清零删旧报告；112—117窗口被真实110—118覆盖。五项needs-recheck保持：H107_RETAINED_VOICE_COUNT_CANDIDATE、H109_RELATIVE_DAY_DRIFT、H72_REPEATED_KNOWLEDGE、H79_SINGLE_BRICK_REFERENCE、H83_REPEATED_PHONE_EXCLUSION。

旧声未知男声/钟声/同日与否、剪者/日期/历史载体/受话人、残通知日期/挂牌点、罗私人原因、旧款押金仍保留。素姐修镜、葛69日开门销售、何71日取送样、花衫女人去向、伞修成、顾72日到件、修后版外部效果、葛72日晚到家未获新证。慢叙事和“想解释—收手—生活收束”的累计重复，以及边界解释偏密仍为文学风险。只是知情模型自检；没有真人盲读、市场验证、实际人声朗读、作者定稿或正式发布。机械和流程通过不等于文学验收。

## 命令与本轮失败保留

所有产品命令只经父capture.mjs，唯一g-标签、严格串行，保存输入raw、双流、前后state及产品退出码。g-run.mjs只携原workspace/token转发单条capture；不把其进程码当独立文学结论。

|标签|产品exit|stderr字节|runtime稳定|
|---|---|---|---|
|g-001-resume|0|0|true|
|g-002-candidate-status|0|0|true|
|g-003-preview118-original-reviewed|0|0|true|
|g-004-record118|0|0|true|
|g-005-review110-118|0|0|true|
|g-006-candidate-check|0|0|true|
|g-007-candidate-sources|0|0|true|
|g-008-candidate-status-complete|0|0|true|
|g-009-prepare|0|0|true|
|g-010-commit|0|0|true|
|g-011-main-final-status|0|0|true|
|g-012-main-final-check|0|0|true|
|g-013-main-final-sources|0|0|true|

最初普通Get-Location及一条误发空命令在产品前实际helper_unknown_error。此后每条执行仅请求授权合成目录的require_escalated审查，没有关闭/绕过审批；无自动审查拒绝遗留。记录session-g-sandbox-error.md。

G新增g-precommit.mjs首次exit1也保留：检查全历史ledger时直接按e.draft旧物理路径读第1章而ENOENT，未生成成功审计。此时立即停止产品写入，未prepare/commit，做只读诊断。随附relocation.mjs第25—27行原生resolve会按哈希校验的迁移事件映射历史路径；session-g-alias-diagnosis.json用该原生函数核1303条引文/行号/SHA全部一致，其中1198条为历史别名，无旧路径影子文件，主稿仍原hash。确认没有内容/引用/基线不符后，另存g-precommit-v2.mjs而保留失败原脚本，v2全部通过才继续prepare。该修正只作用于证据脚本，不改正文、来源或state。详session-g-precommit-first-failure.md、session-g-precommit-audit-v2.json。F原数组断言失败与G寻址脚本错误分别列示，不合并掩盖。

## 恢复入口与保管

本修订已committed、事务已completed，无中断恢复待办；不要再resume尝试重开已完成会话或新begin替换原base。只读核验入口示例：在本work用新唯一标签，node ../capture.mjs <新g标签> node .writer/tool/bin/ai-writer.mjs status --project .；revision list同理。当前原token仍在父d-resume-input.json，仅本地受管证据保管，报告不抄出。

如以后发现事务异常，先只读核session/transaction/57项计划与实际字节，保留现场；本报告不授权逆向修订、Git提交或发布。原合成候选在work/.writer/revisions/dd6f0f3b-1f02-4db2-be4e-34fe7fe658c7/workspace；新检查须使用新标签，不覆盖commands/g-*或历史D/E/F记录。
