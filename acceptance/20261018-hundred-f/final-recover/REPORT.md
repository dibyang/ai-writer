# F轮0.7.2保护提交、恢复与草稿导出阶段报告

本阶段已完成，campaign未封存。本报告仅属于冻结0.7.2的保护提交与恢复阶段，不是全任务最终验收。后续仍须主任务在本进程退出后按report-capacity-fix/PLAN.md修0.7.3、回归、冻结v3并启动upgrade-final真实进程。主源码、包、手册及构建绑定均未改。

实际起止：2026-10-18T14:35:28.490Z → 2026-10-18T14:50:22.237Z，耗时14.90分钟（从本进程首次环境核查计）。唯一作品D:\work\other\ai-writer\acceptance\20261018-hundred-f\work；阶段输出D:\work\other\ai-writer\acceptance\20261018-hundred-f\final-recover。真实作品、来源百章、A—E历史只读；未Git提交、push、发布、外传、启动代理或其他会话。

## 当前状态与构建

- schema6 / 0.7.2 / generation3 / 主revision405；106章，next_unit107仅顺序，paused只discuss/plan，draft_range/revise_range均null。
- state SHA：7c4a2031b5d224f80d2343e0a9ff3a69b390dc2d0b5dbd7af04561092df848a9。
- content_id：8f406f43e2e1bb3ee1a865fa77b947fecf39c8bed4d29c1fb3e20c8f07f71cc8。
- runtime_id：9f0f510436b85f240e834347defa7b916fc6a4e13e4010c0fe0f40f2c9be0d94。
- loaded_id / execution guard：14639e86b1dce2ed6033f3a3c661517ebb4223ed1ec5db8b9e644ee62f9f02bf。此值来自本进程branch main doctor的execution_build_id，root fresh CLI的捕获记录另核相同磁盘runtime guard；root doctor本身不另暴露loaded字段。它与content/runtime不是同命名空间，也不宣称模块字节签名。
- snapshot/ledger/source_versions/source_ranges及106消费来源清单摘要在final-audit.json，当前报告记录/来源/账本绑定另有current-full-tail-review-validation.json；source-build-v2的61项在主源码、package-v2、随附包三处逐项同哈希。

## 原prepared直接提交及重试

原id 16d38509-69a6-42ef-8766-7a8f88a2ca0d，owner和token在本地results/handoff保留；未resume，未换基线或改候选。初始主403、base403、branch467、prepared target404，base/session/prepared及251文件before/after全核相同后，用root embedded直接commit。真实transaction 915b8b83-4a9c-4aad-afa9-422d838773b6 completed，主只403→404；467不写回主revision。随后完全相同id/token重试返回unchanged=true，state SHA在重试前后均f0ed23b77fb5ee710d605111be50bad4206c132c36da768ed26fc4f09ce81651，字节完全相同。之后workflow暂停单独404→405，不混成正文提交增加两次。完整文件清单、提交结果、幂等及备份保留。

251项为59 journal、118冻结对象、4 review记录、65审查文件、4正文和1目标state。候选终态SHA仍23f8f450ce14ce876e21506582fd6e4e87bad7ff2abe8ae11561dc54b9c182a9；原base、prepared与committed分支保留，不清理、不重新resume。

## 四旧章与六新章真实差异

与原百章baseline-state.bin逐项比较，96原章相同，仅下列四篇变化；与提交前403的106篇比较也仅相同四字。全部106实际路径、原/候选/当前SHA与字数在final-body-manifest-106.json。汉字为去首标题Unicode Han，非空白字符含标点；不把二者混称。

|旧章|当前汉字|正文非空白|before SHA|after SHA|差异|
|---|---:|---:|---|---|---|
|48|2462|2790|e5e6f9687a25dfd701402bdbc3fa064ee8bca9ab06396258ade0506ac232154d|5d5a5641bf0bbc45a3b37df4ae0d4ac05f8dbb2456654b5ccf8f08e6704d39ce|同→那一字，字节差0|
|54|2500|2817|badfd6927b047e7bffd636f24f5d305ae9c1862eacd3055c826d5d37f0f52943|dc06448b4b3cd657758c3381e56a8bd2b90fe7ff921b40d4b6f9283baf1a061d|同→那一字，字节差0|
|66|2525|2849|d5d0b18dbc2090695210c638395b1ca6c63ef887fe8140c34b5095b542c5637f|6838679c0afa7ddac4b95fd4a5bd0243b586ad3a3835cc11b8bdb7cbb1250f43|同→那一字，字节差0|
|71|2483|2806|e9274767be6021cbc028ac31e40c2469a39dfb4dee50f6f2c2330434ae1d234f|3663dcb219a72ba50a6f322b55d1061600a1c3dab8ae3d72240e3b8f8dbb2038|同→那一字，字节差0|

四处为同组minor readability指代澄清，原句整句、行/偏移来自本轮字节核并与A保留的修前原字节核同，详body-differences-exact.json；不是四种剧情事实错误。天气、半月缺口、白罩/围挡、筐宽、亲见和转述不变。

|新章|正文汉字|正文非空白|当前SHA|本次变化|
|---|---:|---:|---|---|
|101|3049|3444|81547abfa4da96569119bd4ad43bd701a4f71df9244502407fe2dbd05acd5e7f|本次候选及提交无变化|
|102|3164|3633|024a110095e5220a0d2020ce04279a7f7282177110af77934b13149c357fced0|本次候选及提交无变化|
|103|3188|3604|75e4d23f9b35abfebe8a3daca30d275dd978d4a4b95a872adbd267666d3f552e|本次候选及提交无变化|
|104|3386|3881|f0faab7bbbe4fa334f43cc65097a8791da0414b99ace37fb569cfb750b2660ea|本次候选及提交无变化|
|105|3492|3961|8f8c80b30b9e117e6e0f60bd065459890426b81b1f032ef68dd17fafb32a691b|本次候选及提交无变化|
|106|3548|4078|fc7793413ef2e51d8f1cfa72d8020445fb5ad0b9b2a908002b6a921ed81d0008|本次候选及提交无变化|

六章共19827汉字/22601非空白字符，当前全106正文248114汉字/283082非空白字符。新章历史自检另分：101大包/半包及汤底在E首登前澄清，当前85行半包与77行未买大包成立；中间观察未同步冻结原SHA的归属勘误保留，不倒填。E保护修订102吹汤；F保护修订104椅子指代及106两处站里，既有CAS证据见draft-e/f交接。这些不是本次四旧字提交新增改动。

登记层单独核58顾遥：沈叫后才来，获掉盘说明并看外观，瞬间非亲见；本次最终snapshot已继承，未被旧replay复原。58正文无变化，36条原观察statement/author_truth全部相同（含O_LEAD_DROP_58）。按ledger稳定键及unit.replay_review复核，正式证据semantic-final.json；旧辅助0观察/null审计错误已明确废弃保留。

## 恢复、重登与本进程复读

A/B/C/D跨实际进程累计48–106重登59章，原59份六项replay_review、冻结报告/journal/正文SHA全部对应。D在106重登后本人完整顺读最终59章并一次登记完整报告，本进程读完整D详细报告并核有效登记版；不是拼报告充当本人59章连读。

本进程全文按98–106顺读9章，再全文4/19/24；另外9篇仅片段（27/31/48/54/58/66/71/76/86），精确范围、读后时刻及SHA在readings-chronological.json/read-versions，共12篇全文与9篇片段，不能相加称21章全文。知情模型判断见model-review.md，非真人盲读/作者定稿/市场验证。未确认须再开修订的事实矛盾，本阶段没有改正文。

D当前完整尾段ref .writer/reviews/78147e86-5026-4762-adc2-0a043f5640cc.json，report 审查/F-revise-d-48-106完整尾段复核登记版.md，SHA 3fff39dca406077397577e461cf5d0a38898b1cf3f1463779965792920371c14，48–106共59章正文及dependency全匹配，索引已发布。详细版335b9de80453557e3c2c2a619dcec719c924988d01b397e4a161126bef4c351a保留。最终check机械ok/106/findings=[]，rolling valid20/stale105、pending_windows=[]、unpublished=[]；stale有102被当前单份报告覆盖，3仍无完整同范围覆盖，历史不删除。提交前branch valid42/stale83变为主commit后20/105，反映旧无dependency报告被实际提交失效，不称文学退步或洗绿。

实际review-issues list为空（0），原四字小修为授权内agent执行选择但未登记意见；未伪造原采用时间、apply或verify。不是“意见已resolved”，闭环登记不适用，真实修复由本次commit及当前有效D报告核对。

## 暂停与导出

正式workflow paused后，实际context draft107及record-template107都exit2/ACTION_OUT_OF_SCOPE，提示仅discuss/plan；两个请求前后state SHA均7c4a2031b5d224f80d2343e0a9ff3a69b390dc2d0b5dbd7af04561092df848a9，无107稿。实际最终status/discussion均在暂停之后保存，完成106及未解范围写入当前task，next107无写作授权。

export实际成功到D:\work\other\ai-writer\acceptance\20261018-hundred-f\final-recover\draft-export（作品外、campaign本阶段目录内，符合冻结CLI实际边界，没有../绕过）。manifest.json SHA b394540d74e5421633f6886ac61521775bdf0906b17860b024a057ec2c0b4532，manuscript.md SHA f8d0740ac04fe670c93a3171b07cd1231e3148fd2b8cd8665b9eea4fc7fe1edd，862183字节。manifest included_units精确1–106，excluded_drafts=[]、warnings=[]、status=draft-export、quality_review=required。整份导出与登记正文trim后按原顺序拼接逐字一致；逐章标题、原正文SHA、导出片段SHA、汉字计数见export-validation.json。无未登记正文混入，未更改工具生成文件，草稿/仍需质量审查标记保留，不是作者定稿，不外传。

## 命令、失败与测试证据

本阶段产品CLI 29条，root embedded 27、branch main+原token 2，全部session-support/capture记录参数、原输入输出、退出码、前后state/build及SHA；runtime_files_stable全true，环境无新增覆盖。非零仅上述2次预期107保护拒绝。辅助失败、错误审计和显示截断逐项在failures.json，原文件/输入/事件不删除。暂停驱动误预期1而实际2已改用顺续驱动，未重新设置暂停；其余辅助错误无产品写入。

主任务真实npm test记录commands/final-tests-v2：2026-10-18T11:36:57.712Z、304437ms、exit0、148 tests/147 pass/0 fail/1 skipped；npm run doctor记录commands/final-doctor：2026-10-18T11:30:20.136Z、10185ms、exit0。已核原始meta/stdout并保存SHA于parent-test-evidence.json。本阶段未改工具，未重复开发测试或test:engine；以上是0.7.2实际记录，不能替代待实施0.7.3最终回归/upgrade-final或父任务总审计。

仍保留文学观察与未知：范围说明/否定句及锅碗纸袋微动作偏密、告知流程感和厨房收尾重复，未扩大润色。余带源头、录制日期、男声/钟声/缺名人、罗私事、27中途入册日期、何旧款/长期经费人手、公屋新时段、永久椅位、老人药膏与再来、何菜单交付收款、新页未来阅读/公开和下月安排仍未定。原声未猜成答案、私人页未默认公开、期限椅位未变永久服务。

下一步仅由父任务在本进程退出后处理0.7.3。原committed分支不可resume或重绑；本阶段报告/导出/全部失败保留，campaign不封存。
