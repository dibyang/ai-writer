# 12 章跨卷、恢复与修订实跑

状态：本轮限定范围验证完成。基线提交4ab0d27，最终作品revision31；本轮未提交、推送或发布。

本轮通过独立 Codex exec 会话创建并维护小说《雨线档案》，12 章、三卷（1–4、5–8、9–12），每章目标 450–700 汉字。用压缩篇幅验证长篇机制，不把它称为完整商业长篇或百章文学验收。

最终正文6353汉字（去标题，Unicode Script=Han），每章507–573汉字。五个真实CLI会话均退出0，具有不同thread_id，原始运行共4388秒。主会话另行完整复读最终1–12章，并与最终交付逐章哈希绑定。

## 最终结果

| 关注项 | 实跑结果 |
| --- | --- |
| 跨卷续写 | 4→5、8→9两处卷界实际续写；outline确认卷契约，旧物件和未解线索延续。 |
| 跨会话恢复 | 五个独立exec会话；session-c只读当前作品恢复出九号柜、人物知情及保管人，没有读取前阶段请求/结果来补剧情。 |
| 伏笔回收 | 第9章实际试锁，第10章实际取副页，第11章逐项比对，第12章归档、送单、改待发简报样稿后T_COPY才resolved。到期6在第6–8章没有推迟或假结案。 |
| 旧章修改 | 从2正式回退，将纸签七号改九号并重登2–8；第1章完整索引不变，3/4/8原文不变。再续写未复活旧柜号。 |
| 语义缺陷修复 | 修正第6章钥匙指代、第7章抱托盘写字、第9章离场后却登记亲见重锁；补回重登遗漏的第11/12章私人线索证据。正式回退与失败过程均保留。 |
| 工具修复 | check区分失效历史中已有当前完整阅读覆盖与尚无覆盖的数量，不删除历史、不降低哈希保护。 |
| 最终覆盖 | 有效报告3、失效历史7；7份旧范围均已有当前覆盖，未覆盖失效数0，pending_windows为空。 |

最终制品验证[verification-final.json](verification-final.json)：**379项检查通过，98个已消费来源哈希、98条正文引文匹配**，journal重放与当前快照一致；正文、来源、证据、最终导出、根工具与作品内工具一致。主核验再次通过作品内工具导出至[final-export/manuscript.md](final-export/manuscript.md)，恰好1–12章、无排除稿或警告，SHA-256为`7bc455492c6c4195de1587d197aba7349b85139defe3ba2913fe9c9031530eae`，与修复会话最终revision31导出相同。

产品候选[validation-final.json](validation-final.json)：**npm test 55/55、npm run doctor通过、npm run test:engine 29/29**。异常探针[guard-probes/result.json](guard-probes/result.json)：4组、19次真实CLI，旧正文/卷纲漂移、旧模板、错误保管人、改写不可变观察及伪引文等均按预期拒绝，主作品未被改动。真实回退revision24还验证了新增分类：stale7中已有覆盖4、未恢复覆盖3；恢复完成后变为7/0。

详细问题与处理见[findings.md](findings.md)，主会话全稿语义复核见[parent-audit/final-review.md](parent-audit/final-review.md)。机械绿灯和同会话review曾漏掉第9章见证问题，本轮如实保留，不宣称自动审查可靠发现所有错误。

## 场景与检查点

1. session-a 写 1–4：设定、分卷、稳定线索 ID、章内证据、物件交接、1–3 连读报告，卷末保留未解问题。
2. session-b 新会话仅按作品文件恢复，写 5–8：卷界切换、旧线索 recall 和正文回读、人物知情更新；到期线索仍缺兑现条件时保留 pending/partial，不自动结案；登记 1–6 连读。
3. revision 新会话把第 2 章纸签柜号从七改九：先保存旧稿、检查修订范围，通过 rewind 从第 2 章回退；保留第 1 章，完整重读并重登 2–8。涉及旧观察的更新由回退重建完成，不篡改不可变 observation。旧报告失效应可见，补新的滚动审查。
4. session-c 再开新会话写 9–12：按修订后的来源找对柜号，实际回收纸签、缺口钥匙和副页线索；不能带回旧柜号或偷用未告知人物的信息。分别登记 4–9、7–12 连读并最终导出。
5. continuity-fix 针对主会话独立复核发现的第9章“先离场却登记为亲见重锁”问题，保存session-c原始成功检查和稿件，通过正式回退修复，再重登9–12并全稿复读。session-c的机械绿灯不作此问题已解决的证据。

各阶段记录真实命令、输出、退出码、原稿/状态/来源哈希和报告。另做旧模板、未经回退正文漂移、伪证据/错误保管人、卷纲变更、旧审查过期等异常检查；异常注入在独立副本进行，不污染正文权威状态。自动化检查只证明结构/保护成立，正文语义需要实际连读。

发现产品或技能问题由主会话修复，保留修复前失败；产品版本更新在运行进程退出后进行，更新测试作品工具时保留旧副本并证明正文/state 未改。最终在交付版本重跑必要测试及实际流程，不把历史绿灯当最终证据。本轮不自动提交、推送或发布。

版本边界：session-a、session-b、revision使用基线4ab0d27；session-c与continuity-fix使用[candidate-final.json](candidate-final.json)绑定的最终工具候选。中间只修复审查状态展示，71个候选源文件哈希及工具刷新前后证据均保留。产品候选与测试后、最终作品核验时完全一致。

## 证据入口与边界

- 每阶段目录含request、events.jsonl、process-result和final；阶段结果分别见session-a/result.md、session-b/result.md、revision/result.md、session-c/result.md、[continuity-fix/artifacts/result.md](continuity-fix/artifacts/result.md)。历史稿不是最终交付，尤其session-c机械通过后仍有待修正语义问题。
- checkpoints/a、b、revision、c、final保留来源及状态；旧稿、回退备份、journal和失效报告不删除。修复会话初次revision28导出保留为continuity-fix/artifacts/export-r28，最终revision31为其export。
- 修复请求中的相对证据路径被CLI按仓库cwd解释为根continuity-fix/；会话退出后将202个文件原字节迁入continuity-fix/artifacts/，映射和哈希见relocation.json。原始日志中旧路径不重写，不覆盖任何历史证据。
- 这是12个短章的长篇机制验证，不覆盖百章/百万字语义稳定性、商业节奏、真人盲读、真实档案专业流程或市场效果。陈师傅私人原因、纸签作者、副页不可辨落款及当年作业实况仍明确未知，均未强编答案。导出仍为草稿。
