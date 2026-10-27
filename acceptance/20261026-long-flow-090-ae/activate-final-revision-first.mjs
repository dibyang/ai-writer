import fs from'node:fs';import path from'node:path';import assert from'node:assert/strict';import{fileURLToPath}from'node:url';
const A=path.dirname(fileURLToPath(import.meta.url)),j=n=>JSON.parse(fs.readFileSync(path.join(A,n))),r=j('native/final-read-resume/result.json'),v=j('final-read-root-verification.json');assert.equal(r.exit_code,0);assert(v.ok);assert.equal(v.thread_id,r.thread_id);assert(j('reading-resume-final-read-root-verification.json').ok);
const prompt=`# 正式修订首程：3—66保护范围，先完成3—24真实登记断点

延续同一原生ID ${r.thread_id}。根已观察final-read-resume实际exit0/5164698ms并核final-read-root-verification：当前全66正文462页真实回包、后程281页；原正文/state不变，main66/r396/gen9。完整CP29876文件/175对象已由根实际回核。现在开始正式修订，不再重复整个只读阶段。预计60—100分钟；100—105分钟若未到24，必须在真实完整登记边界保存断点，不强塞完成。

先实际执行 node acceptance/20261026-long-flow-090-ae/check-main-reading-resume.mjs final-revision-first checkpoint-final-read-complete.json，再读COMMON-G9、交接-全书读完待修订.md、fr-findings-and-impact.md、ROOT-03-SPEAKER-REVIEW.md、ROOT-60-TIME-REVIEW.md、**ROOT-48-55-REVIEW.md**及实际当前随包技能。恢复已有语义笔记，必要末章边界读回，不称这程重新读过全66。

## 更新后的正文修订范围

根已定向复核并根据用户“发现问题直接修复”采纳F48班次及L55老师指称。正式保护范围仍3—66，预期正文改3、48、55、60四章。3明确许提醒何；55同一女性老师他→她或老师；60首录入口与有效上午计划一致，不创造第三条录音。48必须按ROOT-48-55逐场景最小修正，不新加临时早班，不机械全局替换时词。许蓉16—18:30常班、姑娘19—20:40课及他人时段各守其事实；当日吃饭/消息/日页/夜间原纸回述必须核连贯。后续实际引用若需连带变更，保存准确位置/原因，不悄悄扩大文风修改。当前先到24，48/55/60实际改稿留后续恢复，但现在须明确源影响和修订计划，不能到末章才发现必须更早发布的源。

复用当前正式workflow/revision/source保护入口。先保存真实基线、核有效来源/不可变观察和author locks；按实际需要允许revise_range3—66、begin独立revision并保存所有权凭据到AE私有JSON（不打印token）。源确需改变时走真实版本/影响/stage/publish；无须改变的不强改，更不能覆盖旧消费源或刷新哈希。不要把根实施措辞伪称作者逐字选择。任何产品失败保存真实输入/双流/状态，再修原因；工具源码和冻结v5只由根维护，本程不改。

## 本程操作与停点

在正式workspace读回当前第3章及第2章相关原段，核与基线同字节；rewind3后对3实际最小改写、保存差异并完整回读改后3及邻段，分别核语言、提醒主体、动作对象、35未付和原箱80纸物事实。用真实原输入身份逐章replay-input、summary/characters/timeline/ledger/evidence/downstream六字段检查、preview/record，推进到24。未改章节正文保持原字节；先前同ID全章实读及当前字节一致性可以用于恢复语义，但不能把旧自检报告说成新审查或跳过六字段实际核对。新变化、上下文疑问必须读回对应完整段；最终修后3—66完整尾读留链恢复到66后真实执行，不冒称本程已做。

每章产品调用使用cli-g9.mjs/受支持工作区参数的唯一fvr1-标签，保留真实原输入和失败；如果现有wrapper不足，可新增AE内小型日志wrapper复用官方CLI，不导入副作用脚本、不手写状态或复刻产品算法。开始先读help/现有正确例，不猜命令与文件名。源变更导致的旧输入/来源漂移须真实解决，不用旧报告洗过。

实际24完整登记后正常停；不要继续25、不要prepare/commit，不登记最终全66review，不verify旧9、不做67负例/export。本程可以更早整章停，必须标注实际章号和原因。保存 final-revision-first-stop.json 与交接-全书修订首停.md，写明主区/分支真实revision、revision会话ID、凭据文件路径但不展示秘密、已改正文SHA/差异、逐章六字段语义、真实失败及其处置、下一步四项问题剩余范围。保存下一章原context/replay-input/来源映射及所有原身份，不能恢复时重取刷新来掩盖变化。两区完整CP分别命名checkpoint-final-revision-first-main.json与checkpoint-final-revision-first-workspace.json或按实际停点清楚命名；实际verify后CP之后不写作品。

原1—2登记、O_BOX_PAINT原字/type/author_truth、原9意见应用和提交、13optional/49retained、全部旧来源与报告历史保持。第二批P1语言改写闭环补充材料已排队在本66修订终验之后，本程不展开、不读隐藏语言判据。机械check不是文学通过。根将核实际exit和CP后再同ID恢复25以后。每60秒进度；不改真实作品、旧封存、Git、全局配置，不提交推送、不起子代理/其他会话、不换模型。激活时间${new Date().toISOString()}。
`;
fs.writeFileSync(path.join(A,'prompt-final-revision-first.md'),prompt,{flag:'wx'});console.log(JSON.stringify({ok:true,prompt:path.join(A,'prompt-final-revision-first.md'),thread_id:r.thread_id}));
