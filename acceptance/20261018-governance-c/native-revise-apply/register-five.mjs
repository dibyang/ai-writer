import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { stage, load, state, put, sha, cli } from './helpers.mjs';
const a=load(path.join(stage,'session-access.json')), w=a.workspace;
const pending=load(path.join(w,'.writer/drafts/native-two-replay-5-pending.json'));
const body=fs.readFileSync(path.join(w,pending.draft));
assert.equal(sha(body),pending._replay.draft_sha256);
const oldQuote='林禾把钥匙放回布袋里里，收紧袋口，搁进自己柜台下的抽屉。';
const newQuote='林禾把钥匙放回布袋里，收紧袋口，搁进自己柜台下的抽屉。';
assert.equal(pending.changes.ledger.O_KEY.evidence[0].quote,oldQuote);
assert.ok(!body.toString('utf8').includes(oldQuote));
assert.ok(body.toString('utf8').includes(newQuote));
const report='审查/native-two-第5章重登核读.md';
put(path.join(w,report),`# 第5章重登核读（synthetic-acceptance）

审查者：第二个独立原生Codex进程，知情模型核读；不是作者身份认证、真人盲读或市场验收。
实际覆盖：本会话恢复时顺序完整阅读旧1–6；修改后FastCtx完整读取第5章1–34行。下游第6章在本会话完整读取1–44行，字节保持不变。核对旧state全部snapshot、units、原意见及产品replay-input恢复的原summary/changes；未用摘要代替正文。

新第5章SHA256：${sha(body)}；旧SHA256：${pending._replay.old_unit_sha256}。原journal SHA256：${pending._replay.old_journal_sha256}。

## 六项实际核查

1. summary：修箱、纸样回箱、林禾让出记法、工具划去、约翌日十点交接均仍发生。旧摘要末尾“控制重复字原句保留”是第一阶段任务说明，已不符本阶段新稿；只去掉这一附句，保留完整情节摘要，不把控制样本指令转成事实。
2. characters：林禾仍在便民处扶木条并暂管抽屉钥匙；周梅带走自己的工具、明确今夜暂托，未提前收箱；老邵未在场。两条本章人物变化原样保留，不增添老邵对5–6的所知。
3. timeline：仍是第二天下午，第三天十点为尚未发生的约定。原timeline_append原样保留；没有把明日约定写成当下交付。
4. ledger：逐项核O_BOX箱底已干且螺丝紧、锁未扣；O_KEY仍林禾抽屉收口布袋；O_BOOK已由老邵带走；T_CLAIM仍partial与原due_unit=4；R_LISTEN仍有限听取与谈菜；O_PATTERN在宽纸套/硬纸板上回箱，未展平且原用途未知。沿用产品恢复的这六项changes，未誊写全snapshot。OBS_BLUE/OBS_LIST/OBS_REGISTER三个statement与I_BLUE/I_BOX_ORIGIN解释均不改、不删。T_PATTERN/T_FUTURE及未来未决不删。
5. evidence：新稿唯一正文差异是第25行删去一个“里”。旧完整句“${oldQuote}”在新稿已不出现，未完成草案preview实际拒绝并保留原诊断；O_KEY本章改用“${newQuote}”。其余5条本章引文逐条与第3/7/15/13/17行核对仍存在，内容不改；产品将其全文证据SHA绑定到新第5章。不能要求这些SHA保持旧值。旧引文/旧正文/journal/意见原件及草案全部保留。
6. downstream：第6章从抽屉取布袋、掌心递钥匙、周梅接收试锁串圈，与第5章暂托完整衔接；纸套随箱，清单沿用划痕，锁从箱旁到扣上有动作；旧伞认错与“我也没全忘”、未来费用/回县/纸样用途仍开放。第6章不因校对小修新增信息或改字，后续还须独立等价重登。

## 真人语言别扭句

有没有哪句话意思能够看懂，却让你觉得别扭、像为了写得漂亮硬拼出来，或者不像一个人当面会这样说？

### 真人语言硬问题

没有

四项检查按本书声音核对：熟人对白省略自然，动宾与具体拿取次序清楚，行动未被抽象解释替代，逐句节奏核读未发现须在本次授权外修改的问题。不声称真人朗读。谈菜及抽屉收束原样保留，节奏疑问已延期。

本报告只支持第5章重登与第6章承接核查；最终5–6完整尾段review另作，本阶段不做全六章新稿正式复核，不verify意见。
`);
const reviewed=structuredClone(pending);
reviewed.summary='第二天下午周梅拧紧箱底松螺丝，二人装纸样回箱。林禾把清点方式交周梅决定，划掉本属周梅的工具，只记待领物。周梅明确钥匙今夜仍由林禾保管，约次日十点连箱交接。';
reviewed.changes.ledger.O_KEY.evidence[0].quote=newQuote;
reviewed.replay_review={reviewer:'native-two independent Codex; informed model reread; synthetic-acceptance',report,draft_sha256:sha(body),checked_fields:['summary','characters','timeline','ledger','evidence','downstream']};
const ref=path.join(w,'.writer/drafts/native-two-replay-5-reviewed.json'); put(ref,reviewed);
put(path.join(stage,'inputs/replay-5-reviewed.json'),reviewed);
const pv=cli('native-two-15-preview-5-reviewed',['record-preview','--input',ref,'--revision-token',a.token],w);
assert.equal(pv.ok,true);
cli('native-two-16-record-5',['record','--input',ref,'--revision-token',a.token],w);
put(path.join(stage,'after-record-5-state.json'),state(w));
cli('native-two-17-replay-input-6',['revision','replay-input','--unit','6','--revision-token',a.token,'--out','.writer/drafts/native-two-replay-6-pending.json'],w);
