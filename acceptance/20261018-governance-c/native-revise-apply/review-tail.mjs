import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { isDeepStrictEqual as same } from 'node:util';
import { stage, work, load, state, put, sha, cli, input } from './helpers.mjs';
const a=load(path.join(stage,'session-access.json')), w=a.workspace;
const old=load(path.join(stage,'before/work/.writer/state.json')), now=state(w);
const withoutEvidence=s=>{const out=structuredClone(s);for(const e of Object.values(out.ledger))delete e.evidence;return out;};
assert.deepEqual(withoutEvidence(old.snapshot),withoutEvidence(now.snapshot));
assert.deepEqual(old.units.slice(0,4),now.units.slice(0,4));
const diffs=[];
for(const [id,e] of Object.entries(old.snapshot.ledger)){
 const n=now.snapshot.ledger[id];assert.equal(e.evidence.length,n.evidence.length);
 e.evidence.forEach((b,i)=>{if(!same(b,n.evidence[i]))diffs.push({id,before:b,after:n.evidence[i]});});
}
assert.equal(diffs.length,6); assert.ok(diffs.every(d=>d.before.unit===5&&d.after.unit===5));
assert.equal(diffs.filter(d=>d.before.quote!==d.after.quote).length,1);
put(path.join(stage,'evidence-version-diff.json'),{fact_content_excluding_evidence_equal:true,characters_equal:true,timeline_equal:true,ledger_ids_preserved:Object.keys(now.snapshot.ledger),evidence_changes:diffs});
const report='审查/native-two-5-6最终尾段连读.md';
const hashes=Object.fromEntries(now.units.slice(4).map(u=>[u.draft,sha(fs.readFileSync(path.join(w,u.draft)))]));
put(path.join(w,report),`# 《渡口旧箱》5–6最终尾段连读

synthetic-acceptance；第二个独立原生Codex进程，知情模型实读。两章完成重登后，再以FastCtx按5→6顺序完整读取第5章1–34行、第6章1–44行；每次读到文件末尾，无截断、无摘要替读。本报告是本次完整尾段阅读的连贯结论，没有拼接旧短评。恢复阶段另已实读旧1–6，但并不据此宣称已正式复核全六章新稿。

最终第5章：${hashes[now.units[4].draft]}，2805字节，去标题800汉字。
最终第6章：${hashes[now.units[5].draft]}，3013字节，去标题844汉字。均为完整文件SHA256。

## 连续阅读判断

第五章从木条已干、周梅发现螺丝松进入具体劳动。小锤被放到一边，使修理无需人为制造难题；真正的阻力转为林禾的登记习惯。她先把小锤、螺丝刀都写进去，周梅问“锤子本来就是我的，也要领回去？”，林禾没有再替对方定规则，而是把纸转过去问“你看看，怎么记？”。周梅先收自己的工具才接着说只记拿走的物件，林禾实际划掉两项并保留有划痕的纸，选择产生了看得见的结果。修订只去掉第25行重复字，没有拿删对白来制造节奏收益。

章末钥匙清点、暂托、收袋入抽屉和挂锁留箱旁的次序清楚。钥匙尚未交付，约定是明早十点；周梅对纸样仍选择同放，免得找名字翻坏。谈豆角咸承接前夜分饭，两个人的口气仍有试探和熟悉，不因校对而变成审核说明。第六章恰在第三天十点兑现约定：先挪脚踏板，再用同一张有划痕的纸签单；纸套放稳后合盖，林禾从抽屉取袋、把钥匙倒掌心并递出，周梅接过后试锁。两人抬箱过门柱、落在腾出的矮架上，再由周梅把钥匙串到围裙口袋的小钩。第五章的暂托没有被摘要误写成提前交付，主体动作与物件位置都可连续还原。

箱的位置安顿后，第六章才转到黑伞。林禾承认自己丢伞却怪过周梅；周梅说“我也没全忘”，接着仍愿重缠伞柄。她没有被改成无条件谅解的功能人物，林禾也没有拿年幼替自己开脱。两人吃面时仍把费用交林秀回来再问，把是否帮看摊留在“若在”的条件里。末尾木架的空位和改衣摊挤出的半米位置各有现实动作支撑；一次交接完成，长期安排并未被补成结论。

## 事实与版本核对

旧与新snapshot的characters、threads、timeline，以及全部16项ledger去除evidence后的实际内容逐项相同。OBS_BLUE/OBS_LIST/OBS_REGISTER的statement、知识语境与解释条目均保留；老邵未在5–6现场，未新增后续所知。T_PATTERN/T_FUTURE仍intentional-open，T_CLAIM仅指本次交接resolved，R_LISTEN仍partial；不删未知、不延到期消除待办。

第5章的六条ledger证据因全文字节改变需要新版SHA：O_BOX、O_KEY、O_BOOK、T_CLAIM、R_LISTEN、O_PATTERN。只有O_KEY第25行引文从“布袋里里”到“布袋里”；其余五条引文文字和行号不变。第6章九条证据原文与SHA保持；它的重登来源消费了新第5章，来源版本不能假称仍等同旧消费。1–4全部登记对象和正文保持，旧journal/报告/意见冻结对象保留。

第5章旧摘要末尾的“控制重复字原句保留”已去掉，仍保留修箱、交记法、暂托和翌日交接的真实情节。仅第5章细纲同步新模拟授权，未改全局活动权威或分卷；其第一阶段控制任务作为历史记录保留，新原话和workflow优先。无第7章。

## 真人语言别扭句

有没有哪句话意思能够看懂，却让你觉得别扭、像为了写得漂亮硬拼出来，或者不像一个人当面会这样说？

### 真人语言硬问题

没有

当面说话核对：周梅从工具、菜、钱说起，林禾先想解释而后问办法，省略与两人的关系相符；动宾拆分：扶、拧、收套、倒掌心、试锁、串圈各自对象清楚；具体落地：时间、抬箱避门柱及脆纸承托可还原；逐句节奏核读：删掉控制重复字后此句可顺读，未出现另两项测试共同确认的语言硬伤。不把模型核读声称真人朗读。

第3/5/6的柔和收束是否需要调整仍是已延期意见；本次没有重新裁定它，也没有把第1章保留原句叫修复。作者已选的声音资产得到保留，无新增冲突或设定。

## 范围与下一阶段

本报告仅为5–6最终尾段的model-self-review，供正式prepare/commit的流程证据；不是作者定稿、真人盲读、市场验证或整产品验收。旧1–6功能表因第5章新稿及5–6重登依赖已过期，应保留其原件与范围；本报告5–6不能替代下一独立会话的1–6完整新稿连读。采用意见须实际主稿commit后再apply，本阶段不verify。应用绑定后正式暂停，不写第7章。
`);
const result=cli('native-two-21-review-final-5-6',['review','--input',input('review-final-5-6',{from:5,to:6,kind:'model-self-review',report,source_hashes:hashes}),'--revision-token',a.token],w);
put(path.join(stage,'final-tail-review-result.json'),result);
const base=load(path.join(work,`.writer/revisions/${a.id}/base.json`));
for(const [ref,hash] of Object.entries(base.files))assert.equal(sha(fs.readFileSync(path.join(work,ref))),hash,ref);
put(path.join(stage,'precommit-main-baseline-verification.json'),{main_revision:state(work).revision,base_revision:base.revision,all_baseline_files_unchanged:true,baseline_files_count:Object.keys(base.files).length,main_state_sha256:sha(fs.readFileSync(path.join(work,'.writer/state.json'))),checked_at:new Date().toISOString()});
put(path.join(stage,'branch-before-prepare-state.json'),state(w));
cli('native-two-22-prepare',['revision','prepare','--input',input('prepare',{id:a.id,token:a.token})]);
