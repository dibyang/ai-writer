import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url)), dir=path.join(root,'session-d');
const read=r=>JSON.parse(fs.readFileSync(path.join(root,r))), sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const put=(r,v)=>fs.writeFileSync(path.join(dir,r),JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const checkpoint=read('session-c/checkpoint.json'), ws=checkpoint.workspace;
const raw=JSON.parse(fs.readFileSync(path.join(ws,'.writer/drafts/AN-d-replay-0120-raw.json'))), original=read('commands/a-022-record120/input.raw.json');
const state=JSON.parse(fs.readFileSync(path.join(ws,'.writer/state.json'))), main=read('work/.writer/state.json');
assert.equal(state.revision,486);assert.equal(state.units.length,119);assert.equal(main.revision,481);
const draft=fs.readFileSync(path.join(ws,raw.draft)), text=draft.toString('utf8');assert.equal(sha(draft),checkpoint.candidate120.candidate_sha256);
const context=read('commands/d-005-context120/stdout.raw.txt');assert.deepEqual(raw.source_hashes,context.source_hashes);assert.deepEqual(raw.source_bindings,context.source_bindings);
const sources=Object.entries(raw.source_hashes).map(([ref,h])=>{const actual=sha(fs.readFileSync(path.join(ws,ref)));assert.equal(actual,h,ref);return {ref,expected:h,actual};});
const quotes=[];for(const [id,change]of Object.entries(raw.changes.ledger)){for(const e of change.evidence??[]){assert.equal(e.unit,120);assert.ok(text.includes(e.quote),id+': '+e.quote);quotes.push({id,...e,line:text.slice(0,text.indexOf(e.quote)).split('\n').length,draft_sha256:sha(draft)});}}
const diffs=[];function diff(a,b,p=''){if(JSON.stringify(a)===JSON.stringify(b))return;if(a&&b&&typeof a==='object'&&typeof b==='object'&&!Array.isArray(a)&&!Array.isArray(b)){for(const k of new Set([...Object.keys(a),...Object.keys(b)]))diff(a[k],b[k],p+'/'+k);}else diffs.push({path:p,original:a,replay:b});}diff({summary:original.summary,changes:original.changes},{summary:raw.summary,changes:raw.changes});put('replay120-original-diff.json',diffs);
const report='审查/AN-d-0120-重登六项实读.md';
const reportText=`# 120 重登六项实读（会话 D）

知情 Codex 自检，非真人盲读、作者定稿或文学验收。D 线程 ${process.env.CODEX_THREAD_ID??'未提供'}。本次已按章序完整读候选116—120，另完整回查主稿103、107、109、115；这些旧章与候选同字节。120当前SHA256 ${sha(draft)}。本轮不改正文，保留B的“放开→放在”，未用分段覆盖。原修订 ${checkpoint.id}，基线481，重登前候选486；原生resume和replay身份均保留。

## summary

逐段核120全章：13点后剪新声，15:07发送2:06初剪，15:23获漏句反馈，15:40多新26秒；15:52电话讨论另一机而未接。16:31完整修后，16:43顾说从头，16:47电话称全听/对机，沈电脑外放听停顿；16:55自修2秒交付，顾再消息称全听并实付尾80。17:07归档同声异名两份，买豆腐2葱1、新饭实吃。原摘要与以上相符，保留。

## characters

核沈/顾当前段及继承历史：顾对机/全听仅电话与消息，沈在家不亲见；最后去日数名版只新知收到。另一机今天未添，真要做再问，不等明日已接单。沈只制作口述，无维修鉴定权。旧107/109/116自用例与新委托分开，顾仍未收72修后样例。人物长状态保留“各原章时点”的历史，119尾未收80不是120当前余额。未填写角色完整不变，不因本单更新葛、何、周。

## timeline

73日上午119的2:43原录、3:19完整重录、13秒关机句与下午26秒分存。16:31稿→16:47电话→16:55稿→改名同声稿有先后；2秒是16:55相对16:31，不能据2:06初剪推最后绝对长度。74午前原期限已提前完成，顾称明日打包仍是计划。118冷藏余米→119炒热透吃净洗盒→120新煮饭相接。

## ledger

T_RADIO_JOB73_119仅本次向顾交付且160齐标resolved，不将外地效果结案；I_RADIO_PAY73_119本次预80+尾80，独立于109自用240、103本次480及未接720、旧58沈付顾80。P_RADIO_SOURCES73_119原三份加26秒，沈持副本/工程，顾手机持源件，previous_holder沈与现账本相符，未将广播后停顿自修变成原录真实动作。P_RADIO_DELIVERY73_120新建交付副本，顾持收到的各版/沈留工程，本体收音机始终留顾。未改变原observation。原生差量不因自动带出即视为正确，本次逐项核对后保留。

## evidence

四个变化条目共${quotes.length}条120引文已逐条查正文实际语境和字面，位置/正文哈希另存input-validation.json。顾“从头到关掉都听过”是顾消息；“一百六到这里才齐”与实际点开到账相邻，支持本单实收；“那先不添”限制本次。13/26秒不同日期段与保留各版有原文，不凭文件名推内容；未补造新引用。来源9项与当前context及磁盘完全一致，没有刷新旧基线哈希。

## downstream

120是当前末章，候选与主稿无121及以后已登记正文；121—122只有V19/A19b未来职责、无正式细纲或正文。未将转发、寄出、收到机器、外地人会操作、长期获客写为事实。回查103已收钱防“首次有偿”，107留用三段不推尝试总数，109用途/意见与成品不同，115仅询问→116才答；116修句不改变不换播放器、初版局部听取与仅沈自测的修后版边界。跨卷兑现是劳动选择的阶段落实，余带男声/钟声/日期、罗私因、旧款等无新证不收束。五条旧needs-recheck与历史欠审不清零。

## 真人语言别扭句

### 真人语言硬问题

没有

“那个先拧小，得放在前头”经模拟当面复述、动宾拆分指向提醒的位置；相邻句“开了以后”说明不能硬拖旧句，修正自然且保留顾自承漏讲。116“今天不必换播放器”与56/95行一致，无新增软件操作。四项语言测试以文本复述/搭配/具体动作/逐句节奏模拟执行，没有实际发声或真人测试。漏检复核回看指代、步骤、电话/电脑外放及版本，未新增高置信问题；防误伤保留“第一句能自己站住”等职业听感比喻。120技术过程较密、各章求认可后收工结构有累计风险，仅记录，不为过流程强行改写。

报告只证明本次模型判断及绑定版本，预览/登记另外核机械结果。
`;
fs.writeFileSync(path.join(ws,report),reportText,{flag:'wx'});
const input=structuredClone(raw);delete input.output;
input.replay_review={reviewer:'Codex AN independent session D informed self-review',report,draft_sha256:sha(draft),checked_fields:['summary','characters','timeline','ledger','evidence','downstream']};
input.draft_review={reviewer:'Codex AN session D informed self-review',report,draft_sha256:sha(draft),report_sha256:sha(Buffer.from(reportText))};
for(const k of ['summary','changes','source_hashes','source_bindings','_replay'])assert.deepEqual(input[k],raw[k],k);
put('record-0120-v1.json',input);put('input-validation.json',{at:new Date().toISOString(),sources,quotes,report,report_sha256:input.draft_review.report_sha256,draft_sha256:sha(draft),original_structural_differences:diffs,original_summary_equal:original.summary===raw.summary,preserved_fields:['summary','changes','source_hashes','source_bindings','_replay']});
const coverage=[103,107,109,115,116,117,118,119,120].map(n=>{const u=main.units.find(x=>x.unit===n),b=fs.readFileSync(path.join(ws,u.draft));return {unit:n,draft:u.draft,sha256:sha(b),full_text_read:true,reader:'informed Codex D',source:n>=116?'candidate':'main full text; candidate bytes verified equal',order:n>=116?n-115:null};});
put('read-coverage.json',{at:new Date().toISOString(),ordered_tail:[116,117,118,119,120],tail_read_before_record:true,items:coverage});
console.log(JSON.stringify({report,report_sha256:input.draft_review.report_sha256,sources:sources.length,quotes:quotes.length,diffs:diffs.map(x=>x.path),input_sha256:sha(fs.readFileSync(path.join(dir,'record-0120-v1.json')))}));
