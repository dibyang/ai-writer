import fs from 'node:fs';import path from 'node:path';import {U,W,write,json,hash} from './final-b-run.mjs';
const session=json(path.join(U,'final-b-revision-session.json'));const B=session.workspace;const audit=json(path.join(U,'final-b-stop-audit-v2.json'));const bindings=json(path.join(U,'final-b-replay-first-binding.json'));const baseline=json(path.join(U,'final-b-main-revision-baseline.json'));const review=json(path.join(U,'final-b-commands/17-review-three/stdout.bin'));const list=json(path.join(U,'final-b-commands/30-main-list-first-stop/stdout.bin'));
const handoff=path.join(U,'交接-最终B修订首停.md');
write(handoff,`# 交接：最终B修订首停

本进程完成最终包新鲜恢复、第3章草稿及当前1—3全文连读，随后开始一次普通报价追溯小修，只重登最早影响章2，正常停在待重登3。这个停点是本次编排，不是放弃完整2—3修订。不继续第二个待重登章节，不prepare、不commit、不abort。没有另派代理、改产品、手编辑state、Git暂存/提交/推送或外部上传。自检不等于真人盲读、完整产品验收或发布。

## 路径与同一修订身份

- U=${U}
- 主稿W=${W}
- 独立区B=${B}
- 唯一实际产品入口：W/.writer/tool/bin/ai-writer.mjs；即使project=B也继续使用这个父入口，写命令必须带原revision-token。不复制运行包进修订区。
- 修订session ID：${session.id}
- owner：${session.owner}
- token：${session.token}
- base_revision：${session.base_revision}
- base state SHA256：${baseline.state_sha256}
- 会话base_sha256：${list.sessions[0].base_sha256}
- 当前session_sha256：${list.sessions[0].session_sha256}；status=${list.sessions[0].status}；transactions=[]。
- 原生Codex对话ID没有从本次可用接口取得，未编造；以上ID是产品正式修订session ID，不能混称原生对话ID。

身份核验：tool_version=0.9.0，observed_content_id=ff6cde0f1be3459f7d8a4249e3dd8ee3eec39d468df48f9c2f11308e5bd6641b，与U/zip-delivery-verification.json相同；runtime_id=9ed9031ff670f4c6e0ef5754b32e079e436d5e6de9576912b4742b6f541b138f。独立区tool identify实际返回resource_policy=parent-installed-package，bound/execution build_id=2703faece8d4b030927eaa8d2c02df5ca300d0ce918673da6ad2494976727734且build_matches=true，无缺失/不匹配。generation=0/installed=null只是未经过工具更新。

## 主稿完成范围

恢复时从state.units取出当前1—2路径并完整实读1—281、1—164行，再核设定、骨架、两卷契约、章纲、观察首见及人物知情。当前包的writer-project/novel/review、long-form、chapter-delivery、通用/自然语言和修订手册已读；未用初测故事或旧聊天补事实。

第3章先保留revision7写前context/template与来源副本，再按真实上段结尾写四段，保存所有v1—v4历史。实际调用assemble创建新完整稿，未覆盖旧合章；完整实读1—243行回对goal/change/六项beats/forbidden后先存报告，draft_review绑定实字节，preview/record均退出0，登记至revision8。主稿第3章5225正文汉字（去标题Unicode Script=Han）、18515字节。

| 主稿当前章 | 路径相对W | SHA256 |
| --- | --- | --- |
${audit.bodies.map(x=>`| ${x.unit} | ${x.draft} | ${x.main_actual_sha256} |`).join('\n')}

第3章跨卷实写：21:37周岸带钱袋/两联/维修票返回，底联照片实际展示；原白漆辅助转箱和站位，原句逐字重现；实际开箱按清单点八件，锤柄旧缝由照片及梁伯实际拨入外放确认。许蓉21:48交箱给周岸；50+10+10+10点清并实际给沈禾；两联分开，女儿得原借具条/下联，周岸留自己一联/空钱袋，许蓉留照片及失物本。梁伯回字确认看清收还消息，父亲收到女儿转述并在家实际收到80元/两纸。原箱装三轮往铺里，未声称已经入铺。许蓉22:00锁门。父亲全史仍未说。

O_BOX_PAINT原type/statement/author_truth保持；O、箱、归还、押金及返回按实际兑现，due_unit未延期。维修F_GATE_QUOTE主稿30元、票已带但月底未付，仍partial/due3。P_ORDER仍谭老板持有，原单未取回。每人亲见、电话/文字与转述分开核记，沈父不知白漆操作/报价/21:40承诺，梁伯未亲见现场，老何只知维修。

第3章登记后已按1→2→3再次完整连读当前三份正文，报告审查/final-b-0001-0003-连读.md，范围及全部三章SHA登记；review_ref=${review.ref}，结构化review推进至revision9。check退出0，rolling_review valid=2/stale=0，仅覆盖证明。已有历史未登记正文/0001-灯下的箱子.md与正文/0002-多跑的一趟.md继续保留警告，未删除或混入登记。

## 修订选择与本停点

具体选择及原句见U/final-b-revision-choice.md。代理在既有试验授权内选择将普通维修工料30改35，不冒充人类逐字指定，也不把原30说成剧情错误；不改80元押金及其他数字、不改人物声音或原观察。最早影响章2，因此workflow正常设revision/revise_range=2—3、draft_range=null，主revision10；begin建立上述唯一会话后主稿只读，未推进主业务revision。

独立区从2 rewind到revision11；修改正文前保存原2—3字节到U/final-b-revision-before。只修改第2章58/80行与第3章35行三处普通报价。修改后用父入口/原token调用revision replay-input --unit2，原summary/changes真实恢复；完整实读新2及新下游3，核原事实并修正摘要、许蓉/老何状态、报价时间线、F_GATE_QUOTE标签/四人所知/两条引文。其他changes及源哈希不改。

原replay草案与修正版均保留在B/.writer/drafts/final-b-replay-2-before.json及final-b-replay-2-valid.json；修正版SHA=${bindings.valid_input_sha256}。源哈希与工具原草案完全相同。实际保存六项报告，checked_fields=summary/characters/timeline/ledger/evidence/downstream，同时另附当前完整章draft_review；两个保护均已进入第2章正式记录及冻结对象，未互相替代。

- replay_review：${bindings.replay_report.path}，报告SHA=${bindings.replay_report.sha256}
- draft_review：${bindings.draft_review.report}，报告SHA=${bindings.draft_review.report_sha256}
- preview为final-b-commands/26-preview-replay-first，退出0；record为27-record-replay-first，退出0。
- 独立区当前revision=${audit.branch_revision}，state SHA=${audit.branch_state_sha256}；已登记1、2，next_unit=3。
- 已改候选2 SHA=${audit.bodies[1].branch_actual_sha256}，已重登。
- 已改候选3 SHA=${audit.bodies[2].branch_actual_sha256}，尚未生成本轮replay输入/重登。
- 第1章仍${audit.bodies[0].branch_actual_sha256}；本停点O_BOX_PAINT保持第1章active及原知情，等3重登才恢复第三章实际兑现状态，不能把当前回退态当丢失观察或偷补结清。

已读：主稿当前1—3完整；独立区新2—3完整及旧replay事实。已改：独立区2—3三处普通报价。已重登：仅2（保留原前缀1）。主稿仍3章原字节，主revision10、state SHA=${audit.main_state_sha256}；begin之后与会话基线完全一致。活跃editing会话仍占用，status.next指向恢复修订。遵守“主稿此时只读”，未额外发主稿写命令作拒绝测试，因此不声称本进程实测过写拒绝。

## 后续同ID恢复的未完成项

1. 先status/revision list，读取本交接与final-b-revision-session.json，核主稿基线、候选两章和当前revision12；用父入口revision resume恢复这个ID/token，不能begin另开或刷新基线。
2. 实读第3章候选及第2章真实新状态，再在B带原token用revision replay-input --unit3生成新可读草案。第3章原summary/状态/时间线/F_GATE_QUOTE还含三十元或30元，必须按35元实际正文修正；逐人核知情，保留80元、原白漆和全部交付动作。不能用旧整段状态覆盖回30，也不能只改哈希。当前第3章正文自本次核读后未再变，但后续恢复仍须实读。
3. 保存真实第3章replay_review六项报告和当前draft_review，再preview退出0后record。改正文会使草案失效，保留原输入，重新生成核读。
4. 所有尾段重登完成后，重新实际完整连读最终2—3（必要承接读1），保存并review登记真实哈希；本次主稿1—3报告不能代替修后尾段报告。
5. 后续按原完整试验授权，在核准相同基线后prepare/commit正式修订。这个进程没有执行它们，也没有abort。其后修后fresh审查、暂停仅discuss/实际拒绝4、新目录草稿导出仍未做，不应提前宣称。

## 证据与异常

本轮30次产品CLI的双流原字节、真实退出码、命令参数、输入原字节副本和前后state都在U/final-b-commands/，全部exit0。写前来源final-b-before-3/；有序片段清单final-b-parts-v4-manifest.json；会话/基线/字节改动/绑定分别见final-b-revision-session.json、final-b-main-revision-baseline.json、final-b-revision-edits.json、final-b-replay-first-binding.json。当前审查报告SHA和原观察三项逐项对比见final-b-stop-audit-v2.json。

没有非预期产品门禁。两项辅助异常已留证：最初FastCtx工具发现调用TypeError未触发文件/产品操作（final-b-orchestration-note.md）；初版收尾脚本exit1把外层动态日志当冻结文件（final-b-audit-failure.md及原final-b-stop-audit.json保留）。核因后精确证明原stdout前355096字节SHA与冻结值相同、仅追加，见final-b-live-log-prefix-proof.json；v2把此外层动态日志单列，其余13934受保护文件全部与原SHA一致，写前非state来源无漂移，未改原清单或追认来源。最终Git状态与入场列表相同，既有产品改动均未触碰。

本交接创建后正常结束，保持editing会话供下一进程同ID恢复。所有机械证据只支撑字节、范围和流程事实，不支撑真人盲读、文学定稿、完整验收或发布。
`);
write(path.join(U,'final-b-handoff-manifest.json'),{handoff,sha256:hash(handoff),main_state_sha256:hash(path.join(W,'.writer/state.json')),branch_state_sha256:hash(path.join(B,'.writer/state.json')),session_id:session.id,scope:{from:2,through:3},registered_revised_units:[2],next_replay_unit:3,not_executed:['prepare','commit','abort','unit4'],final_audit_sha256:hash(path.join(U,'final-b-stop-audit-v2.json'))});
console.log(handoff);console.log(hash(handoff));
