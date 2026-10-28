import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const read=r=>JSON.parse(fs.readFileSync(path.join(root,r)));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const recovery=read('session-b/owner-recovery.json'),work=recovery.workspace;
const input=JSON.parse(fs.readFileSync(path.join(work,'.writer/drafts/AN-c-replay-0119-raw.json')));
const context=read('commands/c-006-context119/stdout.raw.txt'),old=read('commands/a-017-record119/input.raw.json');
assert.equal(input.expected_revision,485);assert.equal(input.unit,119);assert.equal(context.unit,119);
assert.deepEqual(input.source_hashes,context.source_hashes);assert.deepEqual(input.summary,old.summary);
const normalizedOld=structuredClone(old.changes);
assert.equal(normalizedOld.ledger.P_DINNER_FOOD72_117.previous_holder,'沈禾');
assert.equal(context.continuity.author.P_DINNER_FOOD72_117.custody.holder,'沈禾');
assert.equal(normalizedOld.ledger.P_DINNER_FOOD72_117.custody.holder,'沈禾');
delete normalizedOld.ledger.P_DINNER_FOOD72_117.previous_holder;
for(const id of ['T_RADIO_JOB73_119','P_RADIO_SOURCES73_119','I_RADIO_PAY73_119']){assert.equal(normalizedOld.ledger[id].tags,undefined);normalizedOld.ledger[id].tags=[];}
assert.deepEqual(input.changes,normalizedOld);
const sourceChecks=Object.entries(input.source_hashes).map(([ref,expected])=>{const actual=sha(fs.readFileSync(path.join(work,ref)));assert.equal(actual,expected,ref);return{ref,sha256:actual};});
const draft=fs.readFileSync(path.join(work,input.draft)),text=draft.toString('utf8'),draftSha=sha(draft);assert.equal(draftSha,input._replay.draft_sha256);
const quotes=[];for(const [id,e] of Object.entries(input.changes.ledger))for(const a of e.evidence??[]){assert.equal(a.unit,119);const at=text.indexOf(a.quote);assert(at>=0,a.quote);quotes.push({id,unit:a.unit,quote:a.quote,line:text.slice(0,at).split('\n').length});}
const report='审查/AN-c-0119-重登六项实读.md';
const body=`# AN 独立恢复会话 C：119 重登六项实读

性质：独立于 A/B 的当前 Codex 会话，知情模型自检；不是独立盲读、真人验收、作者定稿或出版。未使用子代理。实际授权原话另存 AN/session-c/author-evidence.md；沿用 B 修订范围116—120及原 ID/token/workspace/base，本轮只重登119后停next120，不prepare/commit。

当前全文：${input.draft}
SHA256：${draftSha}
原登记正文SHA256：${input._replay.old_unit_sha256}
原修订ID：${recovery.id}
原基线revision481；base-state SHA256：${input._replay.base_state_sha256}
当前写前revision485；context与原生replay-input：commands/c-006-context119、c-007-replay119。来源逐项核字节一致，不刷新原生输入的source_hashes或_replay。

## 实际阅读范围

本会话完整实读当前候选116、117、118、119、120，依次完整读取；回查主副本103、107、109、115四章全文（已核这些主/候选同字节）。实读119当前正文、原生context正式章纲/来源/相关现态与召回、原119摘要/差量及120候选下游。没有将B报告或召回摘要冒充旧原文阅读，也没有重读全书120章。非本轮完整重读的历史人物串只保留原字节，逐项既有事实的全书真实性不在本次声明范围。

原始输入与原生回放差量存在四处结构差异，已单独保存逐路径对照：同一持有人沈禾未换手，回放不再输出P_DINNER_FOOD72_117的冗余previous_holder；三条新条目由产品规范化为tags空数组。没有人物所知、摘要、时间线、custody或引文的事实差异。初次辅助脚本误要求原始输入完全深相等而失败，原脚本及完整复现双流保留；v2只纠正比较依据，不修改原生输入或状态。

## 六项核读

1. summary：73日9:12顾问一段自己的收音机说明，10:20沈到店，实听2:43；顾本人对机确认后录3:19并补关机13秒。商定一段录剪160、预付80实查、余80未收，下午初剪、74午前交。沈归家炒热透余米、12:10吃净洗盒，13点后开工。119未发初剪、未收尾款、未把160约定当实收。原摘要符合这些已发生情节，保持。
2. characters：核沈与顾本章新增整段及原有效状态保留。沈取新素材副本、不代维修确认；顾确认步骤并本人录，机器仍在顾店，顾未收初剪。沈在店有问、在家听素材，未进入顾内心；对来送黑线者/箱子只记现场可见。历史段仍带原章时点，不将116顾仅局部听初版变成全听或收修后版，不因119新单追认109已成交。整段替换须保留未失效内容，当前草案未删旧状态。
3. timeline：72晚118余米冷藏及洗布→73早收布/粥→9:12询问→10:20到店→11:12重录齐并补句→12:10吃净洗盒→13点后初剪中。20多分钟到店不是一小时计费承诺；本单固定160。120的15:07初剪、补26秒、16:31修后、16:47电话、16:55交付和尾款均不得提前进入119时间线。原本章追加仅到开工，保持。
4. ledger：逐项核四个实际变更。P_DINNER_FOOD72_117持有人仍沈、冷藏余米已炒蛋吃净、盒已洗，鱼头骨/砂梗无新复用或外送；同一持有人更新状态不造交接。T_RADIO_JOB73_119是本次真实新录剪线程，active/due120，不能因下游已知交付而在119先resolved。P_RADIO_SOURCES73_119为顾保留源、沈取副本的三份新声，2:43/3:19/13秒分存，试剪十几秒移出待发；不挪唯一旧带或107自录。I_RADIO_PAY73_119只partial，当前进账80、尾80未收。旧240例价、旧480及未接720不混。四项原差量均有本章动作支持，保持；没有新增author_truth或改observation。
5. evidence：四项共${quotes.length}条本章引文逐条回到当前119原句及邻文，脚本再核连续匹配与行号；“总共一百六。”只证明报价，须与答做/消息确认/实查80连看，不拿一句报价证明已收160。“台上的机器没有跟她回来”在本章结尾的台上机器语境成立。原生来源共${sourceChecks.length}个文件逐项当前SHA匹配，context/replay身份一致。引文与真实推论均已核，脚本匹配本身不证明语义。
6. downstream：当前候选120全文已读。119原录将方向说错，顾对实机纠正并补关机句；120又发现开机前调低漏讲，三点多新补26秒，单独存放，不改写为119早已录齐所有操作。16:47整听/对机只是顾电话口述，16:55缩自身停顿2秒后顾消息称全听、实收尾80；最后同声改名只答收到，不推第二次亲见整听。另一机本次不添、外地转发/寄出/收件人会用未知。119午饭吃净与120新煮饭相接。120候选“得放在前头”修句自然且不改动作/步骤；本轮不重登120，不称整个修订尾段已完成。

## 跨卷回收与计划/未知

V15第107章自录试声及109用途/听辨意见与成品的区别，V18第116章收件端长名前缀和寻找困难，在V19成为实际取材、先问用途、价格和文件名前端的劳动选择。这是既有线索的阶段实践，非首次有偿工作：103已有核听480实收，720追加未接。115末只发远程询问，116才获答；116修后例只沈自测，119新任务不证明旧例已被顾验收。117/118晚饭后的布、椅距、余米接入119生活；葛相册两照、桥页及旧站原物都未用于新单。

V19合约、A19b的121—122职责仍是计划，无本轮续写；不拿主稿next121当授权。旧余带、未知男声/钟声/剪者/日期、罗私人原因及旧款等没有本章新证，保持原未决。context的omitted_ids已按相关性看类别；与本单钱款相关103已回到全文，其余旧站/钥匙/旧费用/路况等不由本章推进，不宣称全部历史锚点已实读。

## 真人语言别扭句

### 真人语言硬问题

没有

四项测试均以文本方式执行：当面复述核顾从“剪头尾十来分钟”到愿意为少讲电话付款的口气；动宾拆分核手机放布/重录/装箱/炒饭；具体落地核问左右、本人演机、预付及保留源文件；逐句节奏用文字模拟复读，未实际发声，不冒称真人朗读。正常“你先别替我加一样活”“箱子也没省下我”等应保留，不改成完整审查术语。

### 风格偏好观察与漏检复核

116—120累计仍有想解释/想获肯定→克制→家务收工的结构倾向，120剪辑细节偏密；119的到店受店务打断、顾议价/亲自重录、她预收后必须实际劳动提供新收益，不能按相同词或收饭结尾一律判重复。暂无有净收益且证据充分的新增局部修句，正文保持。回读手机垫布相邻动作、两只箱子变化、同名试剪移位与饭盒去向，未发现必须补造的动作。107“没有再来第四遍”和109相对日等旧needs-recheck未在本轮擅修或标为解决。

## 结论与边界

119原summary/changes实读核对后保留，candidate119仍与A主稿同字节；此次重登的收益是独立恢复同一修订、保留116修后依赖并核119事实，不声称本章文学提升。六项勾选和哈希是记录门禁，不是文学验收。本轮119登记后停next120；最终原生滚动review、120重登以及更多旧章修订/跨会话验证均仍待后续独立会话。不得prepare/commit。
`;
fs.writeFileSync(path.join(work,report),body,{flag:'wx'});
const reviewer='Codex-AN-session-c-independent-recovery-informed-self-review';
input.replay_review={reviewer,report,draft_sha256:draftSha,checked_fields:['summary','characters','timeline','ledger','evidence','downstream']};
input.draft_review={reviewer,report,draft_sha256:draftSha,report_sha256:sha(Buffer.from(body))};
fs.writeFileSync(path.join(root,'session-c/record-0119-v1.json'),JSON.stringify(input,null,2)+'\n',{flag:'wx'});
fs.writeFileSync(path.join(root,'session-c/input-validation.json'),JSON.stringify({sourceChecks,quotes,original_summary_equal:true,original_changes_equal_after_native_normalization:true,context_replay_sources_deep_equal:true,draft_sha256:draftSha,report,report_sha256:input.draft_review.report_sha256},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({unit:119,expected_revision:485,draft_sha256:draftSha,report,report_sha256:input.draft_review.report_sha256,evidence_count:quotes.length,source_count:sourceChecks.length,original_summary_equal:true,original_changes_equal_after_native_normalization:true}));
