# 2026-10-20 约02:11 主会话检查点（任务尚未完成，继续推进）

继承01/02。目标仍S独立样例18章六卷，新增12章每普通>=3500Han、7/13>=7500/五段，完整原生Codex/修订/导出记录，不改真实作品、不自动Git提交推送。当前已登记12章。

R2已经0退出并完成正式事务：session见r2-session.json（新线程完整ID在commands/codex-r2/stdout.raw.txt），范围10—12，主r31→32授权→33commit→34恢复trial；正文仅第10章补何岚先问回来没有、林照明确说河西，再接送水，以及“邵师傅的全名”指代。B-DATA-01也已修：T_VISIT及相关条目/人物的当前知识按第九日回程、第十日向许转述、第十二日何才对应陈姓名分章补，正文11/12不动，旧证据保留。完整7—12候选读前后哈希一致，实际review/prepare/commit，旧12输入拒绝/state不变。交接/S-R2-修订后当前入口.md、最终审查/S-R2-0007-0012.md，r2-edit-operations.json真实正文替换清单。derive-r2-segments.mjs已成功：r2-current-segments.json、分段/0010-r2与当前正文完全同字节，旧10分段保留。不可重跑wx步骤。

B正常结束12章：10=4049、11=4032、12=3980 Han，各3段，r29/30/31。新增6章已成。B完成首1—9稳定哈希恢复复核、再7—12连读，已覆盖当前所需窗口但B-DATA待修，后R2修正并重核。B嵌套失败：outline --from/--to不支持，JSONL item42；help后--unit7成功；12首preview缺previous_holder，拒绝/state不变，以新b-*-12-retry1输入补正确林照并成功。当前父H10/B-DATA均已R2处理，原报告和错误输入不删。

本轮产品又发现/修复两点，实际当前主源码已12文件变更：
1. recordPreview新增related_unchanged_ledger最多8项/遗漏数/按角色关联，未变有据可保留，不语义判错/不改数据。新增tests/record-preview-related.test.mjs 2用例，静态历史说明也仅候选、source guard与只读、量有界。文档quick/user/review-registration/长篇技能reference与CHANGELOG/RELEASE同步。
2. R2实际发现replayInput把原后章整条旧character_known全填，可能覆盖前章刚修。先在S/replay-sparse-probe/source从source-frozen-current原字节复制320输入、不带生成manifest，新增合成接口tests/replay-sparse.test.mjs。sparse-before真实失败（林/周旧值出现），保留workspace-before.mjs；隔离改为按原before/after字段差异和逐人知情差异，sparse-after通过。等旧Root测试全退出后已将同补丁落Root lib/workspace.mjs，复制新测试到Root tests/replay-sparse.test.mjs，加入release/distribution.json白名单，文档同步；sparse-main-regression 8项全部通过。保持新条目必要字段/完整custody+previous_holder/来源/六项实读要求，不解析文学语义。Root当前这两个fix都已实现，不是仅实验。

注意历史包多代均保留，主最终应以 **candidate-delivery-v4**为准：
- candidate（原9e26...旧基线）、candidate-final（仅最初6文档2fcc...）各源码/包173/172pass/0fail/1skip已过，属于早期。
- candidate-preview-v2（关联hint实现但初次漏把新测试列进发行白名单，包173 vs源175），与candidate-current-v3（已补白名单）managed contentID同a9a0...但ZIP不同。preview-source-tests174pass0fail1skip、preview-package-tests172pass0fail1skip，current-source-tests/current-package-tests各174pass0fail1skip；都已结束。不能拿它们代替后续稀疏fix最终验收。
- **candidate-delivery-v4**含两个fix及两个新测试文件（关联2+稀疏1），src inputs321、frozen product12，zip323条目（以receipt实数为准），contentID **730a9e3eaffd691e1ef902722513ba548821ce9f077b35a4ff43bb52e0dbfecc**。zip-delivery-verification.json已CRC/逐payload hash/真实解压验证；最终解压 **D:/work/other/ai-writer/.tmp/长篇 0.9.0 S 最后交付解压/ai-writer-0.9.0**。source-frozen-delivery.json与product-frozen-delivery.json冻结，不再随便改源；更改必须另名重建重测。
- v4 source/package doctor均0。最终全套测试正在运行：PTY **26868** delivery-source-tests、**58985** delivery-package-tests，预期各176总/175pass/0fail/1权限skip。尚未读到最终结果，不提前声称通过。旧中间PTS29425/84919/87322/69443都已结束，不再poll。没有改engine，另套engine未跑。

当前唯一原生写作 **PTY39871 codex-c-first**，thread **01a15556-0cb4-7823-a277-367ce8b8f139**，约02:04启动。S实际工具仍generation2/内容2fcc（R2全程用该冻结旧码，Root修改不影响S），主r34/12章。父prepare13、budget.mjs13已过，packet20370 chars，少1拒绝/exact等 payload/state不变。plans.json已保留前版并给13加真实ID recall O_FILM/F_CHEN_MEMORY/T_SHORT_ACCOUNT（还有O_GRID/O_PROGRAM/T_GRID）。C任务只写13前两段>=3200Han后交接S-C-中断.md正常退出，不合章/record；它实际读9—12及旧1/4/6/7，禁止旧观察/知识倒填。当前还未完成C checkpoint，后续核state34/units12不变、parts hash与body13不存在，保存checkpoint-c-first。

接续重要计划：13前半在旧gen2写，首进程正常退出，等待v4最终测试通过，再在**无活跃修订**时从外部最终包入口正式tool update S gen2→3（最新Runtime也变），主正文/units/snapshot/gov保持，r推进。旧install-final-tool.mjs是9章且candidate-final专用，不可复用；需要新installer用zip-delivery-verification+candidate-delivery-v4、检查r2session已committed/12章/无pending、外部CLI执行plan/update，真实quote发现问题直接修复；S当前common.cli已指随附入口，**不能从被替换包内执行update**，新installer要显式spawn最终解压包或Root外部CLI。保留旧delivery-switch.json/旧final-tool-update-verification.json为gen1→2历史；新写 **delivery-current.json / current-tool-update-verification.json**为gen2→3，别覆盖旧证据。

还要通过新包真正实跑稀疏replay（不能只有隔离单测）：建议新R3 session范围11—12做等价重登、真实逐字段草案/preview/record和尾段复核/prepare/commit，snapshot与正文完全相等，新代码应不在11草案重放未变的周伯知情等；保留原观察。全程知情模型实读，关联hint只是候选、正确历史知识应保留。新R3别resume旧已committed R1/R2或手改build/hash，Root新Runtime只有新session可用。R3会多推进revision但事实不变。当前尚未写R3 helper/prompt/installer，需继续做。可读7—12完整复核覆盖窗口，真实metadata等价不是新增小说。先完成这个新工具的真实修订后再C resume；若有更简单但完整的实跑做法也可，不能冒称新replay已经在长样例验过。

C resume同ID用prompt-c-resume.md（已更新说明工具升级/来源变化）：先status/真正新CLI/read新marker；旧13模板保持，用新label真正重新context和record-template到.writer/drafts/s-record-13-after-update.json，必须补后三段前实读判断旧片段仍有效。合成完整约8k后保存实际details，用旧模板+真实summary/changes新label c-old-template-13-refused record应拒绝r变且state不变，随后 **flow.mjs record 13 .writer/drafts/s-record-13-after-update.json**。flow已保留旧版并支持第三模板参数（正则限.writer/drafts ASCII名），不能用旧flow试record占成功label。14/15正常prepare/record，各3500—5000三段，13五段>=7500；review15读10—15/交接S-C完成，退出。Cfirst旧markers2fcc正确，Cresume要最新delivery-current，当前这个新marker还未生成。

其后D新会话16—18（prompt尚未写），按实际C新增跨卷cloth-return thread ID补16/18 recall，不预造ID。实际兑现借还与有限讲述许可，原片仍不播、全史保留未知；review18读13—18。最后当前全18章另稳定版本完整实读、final报告+绑定，scope闭环/paused19draft拒绝/discussion成功/草稿export/check doctor/no active/pending/窗口清零/源inputs321+产品12 SHA/所有当前分段组装准确（4-r1、8-r1、10-r2，其他原组，1老Q需标题+trim组装）、Q原封存只读verify不变、全部CLI和原生nested失败分类（不同层不混数字）。最终S README从进行中更新为实际完成与边界，verification.json须complete:true,registered_units:18，seal-evidence.mjs才允许seal；外置回执。不能现在结束或claim18完。

勘误/失败注意：父8初稿读取与取SHA间A正在改稿，旧引文第二句已登记前删除，已用0008-initial-notes-erratum.md明确，不再当R1删除。最终审查使用读前后稳定SHA或不可变拷贝。probe初建目录漏父目录导致ENOENT，未复制，后纠正；有一次只读目录Node括号错误，改FastCtx；ZIP早v1/v2错名/集合失败、原生外层沙箱启动拒绝、首次baseline from7拒绝改from1补读均保留；sparse-before是预期缺陷复现1fail，不是真正最终测试失败。R2另有context用途/范围拒绝、辅助打印snapshot不存在字段，原生JSONL有完整记录，均无状态写入。最终不要写全部命令全过。

Root主工作区改动12产品文件（含两个新测试），新S，.idea原样；无Git提交/推送/外部发布/真实作品改动。每60秒评论，长wait30秒以内，遇functions cellID先wait再其他工具。FastCtx先查本地，旧Q/R/N/O/P等不可写。记忆未改，若用了MEM155最终附citation。现在原生C和v4最终2套测试继续，先检查进度。
