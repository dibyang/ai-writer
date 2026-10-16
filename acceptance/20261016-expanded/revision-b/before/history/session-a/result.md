# 《潮汐信号》扩大长篇真实验证：session-a

状态：1–4章原创草稿已完成、实读、登记并导出。连读报告已实际保存并列明源哈希，但真实review绑定受报告目录限制阻断，不能称全部要求完成或扩大验收通过。

## 目录与范围
作品唯一目录为 `acceptance/20261016-expanded/works/潮汐信号`。本次脚本、输入、原始CLI日志、审查结果与导出位于 `acceptance/20261016-expanded/session-a/`。未写仓库根session-a，未修改产品或其他作品，未手改state/journal，未使用子代理，未提交、推送或发布。

采用当前仓库CLI，冻结源码commit f76820deb5be6ff9304d894375721d1eab7c0e42；71个基线文件逐一SHA-256一致。未修改产品，因此未运行产品改动才要求的npm test/doctor/engine测试；本次真实验证对象是创作与追踪流程。所有人物、地点、事件为原创虚构，没有现实历史研究。

## 正文与阅读

|章|标题|正文汉字数|SHA-256|
|---|---|---:|---|
|1|六天的空位|1554|3b7caf64e475d1e34dd812133a10b122335992c8389482202b0e82401f0a71f6|
|2|箱子里面|1550|fde7038ca2797bd07fc5df0b3646d92cedcc919b7698b12fd79f2c0545d75cf2|
|3|红棉绳|1579|6c0bf8ef63f57702f6e43a1d0e01a290c977630ed54707e7f073b110842fd1b1|
|4|先停在这里|1573|c441029c91862cdc9a1b3d8d630854af8fbc6ec1df4a0d5cf3af92458d1429bd|

合计 6256 汉字。计数使用JavaScript正则 `\p{Script=Han}` 的Unicode模式，先去掉第一行标题，再计正文；不计标点和非汉字。每章均1500–2000。逐章先plan/context/record-template，保存模板原始来源与revision，再写正文、实读、changes增量record和check。模板输入在inputs/record-N.json，原模板在cli-logs对应stdout。只细化1–4，next_unit=5且第5章章纲不存在；四卷范围1–6、7–12、13–18、19–24均由volume建立为plan-only。

第3章后已按1→2→3完整连读；完成四章后又完整连读最终export/manuscript.md（1–4，共302行），并核对登记源哈希。[1–3报告](reviews/1-3-连读.md)、[1–4报告](reviews/1-4-连读.md)，审查性质均为知情模型自检，不是真人或独立盲读，不代表发布验收。每章短自检记录见self-check-1.md至self-check-4.md。

## 当前知情与保管

|人物|截至第4章的边界|
|---|---|
|沈禾|独自亲见铜牌“东埠六码头”、右下两短刻线、无日期；未拍照抄字，未完整告人。知道工作副本来源但未知日期班次；独听罗敬灯语未核；与顾遥只听原带钟声、背景和残字。保管三件唯一原物。|
|周砚|第1章亲听工作副本，知道沈禾告知的硬盘来源与缺日期；此所知在第4章更新沈禾/顾遥时被自动保留。尚未知铜牌、灯语和原带新内容。午后碰面只约定、未发生。|
|唐穗|实收并交回封箱，知道暂放处和联系号码；未在开箱现场，没见/没获告铜牌内容。仍在旧站交接工作中。|
|顾遥|提供收费空间而未受托封箱保管，未开箱未见牌；见原钥匙交沈禾，未认锁；共同短听原带但不知道钟声地点、完整话和副本关系；未听路上灯语。|
|罗敬|自愿交原钥匙与原带，来处是他的口述，未确认为作者真相；只向沈禾谈灯语；没有参加试听。承认私人失约但拒答私因。|

- P_BOX：唯一灰绿原铁箱和内原铜牌。第2章沈禾独自发现、搬至窗前、开箱、原布复原、合搭扣、干纸垫底、编织袋封装，再实交唐穗锁入小库；第3章唐穗实交回沈禾，由沈禾厚布袋搬到顾遥店后隔间顶层干燥木架，仍封未拆。已发生两次合理交接；当前holder=沈禾，previous_holder=唐穗。店主提供位置不等于知内情或取得保管责任。
- P_KEY：唯一原铜钥匙，三角磨痕、红棉绳。第3章罗敬实交沈禾，新纸套与小封袋保护，现随身背包内侧拉链袋；未试任何锁。
- P_TAPE：唯一原标准紧凑型录音带，罗敬第4章连透明原盒实交沈禾；准备兼容卡座、试机、清洁干燥后短听，异响即停，未倒带未拉带，现原盒装入背包前层硬质小袋，与钥匙和铁箱分开。

## 未结与未来约束

|ID|当前状态|due_unit|未结边界|
|---|---|---:|---|
|T_SIGNAL|pending|12|日期、班次、剪辑经过、消息实际去向均未结；目录名不证明去向。第12章缺证继续保留pending/partial及原到期数；V4正文才完成。|
|T_LAMP|pending|9|罗敬黄灯连闪两下的口述未核，沈禾独听；V3前段须实物/记录/实际操作适当验证，9不后移。|
|T_TAPE|partial|18|仅钟声、背景、“麻烦”与疑似“给”，未完整听清、未确定说话者和与副本的关系；跨卷保管和实际听取尚待正文。|
|T_PRIVATE|intentional-open|无|私人原因不解释，不含author_truth，不从拒答定罪，允许最终保留。|
|O_KEY/P_KEY|active|无|形态观察与封袋保管成立，用途待核；跨至少两卷与真实试用后另建解释尚未发生。|
|O_PLATE|active|无|不可逆观察原文与初次登记完全一致；不能推定对应现有码头。第5章完整告周砚、第7章告唐穗尚为未来约束。|

T_HANDOVER仍active；其余未修改账本由CLI自动保留。时间线只有1–4章已发生事件，卷纲未来没有登记为事实。共10个稳定ID。各章context omitted_ids均为空；证据摘要在O_PLATE/P_BOX/T_PRIVATE中有省略，通过recall定位后完整回读第2/3章核对，不能把摘要当原文。所有已消费来源（排除正常演进的state输入）逐一复核无漂移。

## check、错误与导出
最终check：ok=true、scope=mechanical-only、findings=0，登记4章、无未登记稿、无过期正文、无来源漂移。rolling_review={"valid":0,"stale":0,"stale_with_current_coverage":0,"stale_without_current_coverage":0,"pending_windows":[{"from":1,"to":3}],"nature":"coverage-only-not-literary-pass"}。

真实CLI共36次，失败2次。每次的真实executable/argv/cwd/起止时间/退出码记录在cli-logs/*.meta.json，原始stdout和stderr按字节分别保存；[索引](cli-index.json)另含日志哈希。失败原文完整保留，没有补造成功。

- [cli-logs/032-review.meta.json](cli-logs/032-review.meta.json)：退出码 2；[原始 stdout](cli-logs/032-review.stdout)、[原始 stderr](cli-logs/032-review.stderr)。
  实际错误：report 必须在 审查/ 下
- [cli-logs/035-review.meta.json](cli-logs/035-review.meta.json)：退出码 2；[原始 stdout](cli-logs/035-review.stdout)、[原始 stderr](cli-logs/035-review.stderr)。
  实际错误：report 必须在 审查/ 下

绑定阻断原因：当前lib/longform.mjs要求report必须在作品“审查/”下；本次用户约束要求全部辅助结果留在session-a。实际提交报告路径为../../session-a/reviews/...，CLI拒绝。未复制报告进作品、未改产品、未用路径穿越/链接绕过、未手工制造reviews状态。1–3与1–4报告虽含正文真实哈希，尚没有成功CLI review记录；1–3欠审窗口仍在。

导出[manuscript.md](export/manuscript.md)恰好包含[1,2,3,4]，excluded_drafts=[]、warnings=[]，status=draft-export、quality_review=required。导出正文SHA-256=378d75de522f7ee17a0e0c23fc8896a4c1296ee262caa8b799a14510b860fe23；[manifest.json](export/manifest.json) SHA-256=b1b94994b660925451485f17aabd70b3aee96c7492c2f91df148c2b5ed62096d。即使review未绑定，export仍成功；本次实测如实记录该行为，不把导出成功升级为审查或正式验收通过。

## 状态与来源哈希
当前 .writer/state.json SHA-256：075c151073383de8534be46bdc883cc0233e71bb5260a6c42b6ad4e063bd7723，schema=2、revision=5、next_unit=5。每次消费的历史state输入哈希保留在inputs/record-N.json及export/manifest.json，不能以最新状态哈希替换旧来源。

|当前来源（作品内相对路径）|SHA-256|
|---|---|
|writer.json|e9e0f74ae90e3c008d6ef2d090f14bbba908709a1db9ad564622597d6d4008b3|
|.writer/state.json|075c151073383de8534be46bdc883cc0233e71bb5260a6c42b6ad4e063bd7723|
|大纲/单元/0001.json|7f6bde37b8724ec2c218640064c2ad60a694f2eb011d81dbeb08c49a29d2db5f|
|设定/作品定位.md|1149a87c65fe312b292e6879909c7c27ed83b466211a313be9aa22783e510e94|
|设定/文风.md|2fdc05792c2bb688acbf0d1fef354e9cb70ce24bee3a535d056328ba7c5f382c|
|设定/权威规则.md|42d83dfbfcba4b6eead41d557d4e420be8b28d74fea48c26e4c7b4558dfcb6e6|
|设定/角色卡.md|944495ced492696613e970d574e1ea07dd636cb38c56170a2bf9d80f7041e21e|
|大纲/全书大纲.md|0f936435e2b4946d4abe9607d53c9e903c097623490ae248ad228cbaa67d8ef9|
|大纲/分卷/V1.json|54d5f5ae832f07656ac8955546a3c050925d0d7ae07ff6bfe05c039ed1228f2c|
|大纲/单元/0002.json|c4e1f8853e6ae096e670b10e5b91f4cedc19cf6a7fcaad4adab02c653e892726|
|正文/0001-六天的空位.md|3b7caf64e475d1e34dd812133a10b122335992c8389482202b0e82401f0a71f6|
|大纲/单元/0003.json|9e229faddb97fc57068ba67e73333bcdc6ff62d6a98306ca566c714a1165c1bc|
|正文/0002-箱子里面.md|fde7038ca2797bd07fc5df0b3646d92cedcc919b7698b12fd79f2c0545d75cf2|
|大纲/单元/0004.json|6c80ae197958d29bce713ac7b32f8cda74d2361ecb67578e50096c66c71e9bbe|
|正文/0003-红棉绳.md|6c0bf8ef63f57702f6e43a1d0e01a290c977630ed54707e7f073b110842fd1b1|
|大纲/分卷/V2.json|2cbff269ea6ffd0adccf60c4351958221dca8aceb6f99d443b9f9a6c026c7cb5|
|大纲/分卷/V3.json|7571fe6a635f17f9b459a88f21f93fe66f9c5212f0937951bc0c4532a1412723|
|大纲/分卷/V4.json|fff67c49779ad5430242ce66d30afdd3fcd05087b1cefb58649d714c1d84e0ce|

[完整可审计数据](audit.json)包含逐章来源、基线复核、当前状态哈希、错误原始文件引用和导出信息。脚本断言用于核对计数、哈希、范围、合并保留与固定到期状态，不能替代本次已执行的全文阅读。后续跨卷保留、到期未结召回、第5/7章告知与最终兑现均未在本轮四章中实际验证。

辅助汇总脚本finalize.mjs首次运行退出1：误将review失败的空stdout当JSON解析，得到Unexpected end of JSON input；已改为读取非空stdout或stderr后重新运行。首次工具返回的合并输出另存helper-error-finalize.json，并在events.jsonl保留原始执行事件；该辅助错误不计入上文ai-writer CLI调用数。未据此重跑、伪造或覆盖review失败日志。
