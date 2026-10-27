import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const b='acceptance/20261024-long-flow-090-ac',session=JSON.parse(fs.readFileSync(b+'/cli-logs/cr19-begin45/stdout.txt')),p=session.workspace,input=JSON.parse(fs.readFileSync(p+'/.writer/drafts/AC-CR-replay45-before.json')),sha=v=>crypto.createHash('sha256').update(v).digest('hex'),body=fs.readFileSync(path.join(p,input.draft),'utf8'),hash=sha(body);
for(const [f,h]of Object.entries(input.source_hashes))assert.equal(sha(fs.readFileSync(path.join(p,f))),h,f);const labels=Array.from({length:7},(_,i)=>`cr-revise45-p${i+1}`);labels.forEach((l,i)=>{const v=JSON.parse(fs.readFileSync(`${b}/read-pages/${l}.json`));assert.equal(v.sha256,hash);assert.equal(v.text,body.slice(i*1800,(i+1)*1800));});
assert.equal(input._replay.draft_sha256,hash);assert(input.changes.characters['沈禾'].includes('亲见旧盒已空'));input.changes.characters['沈禾']=input.changes.characters['沈禾'].replace('亲见旧盒已空','亲见旧饭盒和菜碟已空');
input.changes.ledger.T_AC_SHARED_MEAL.evidence.push({unit:45,quote:'装菜的小碟也已空'});
const report='审查/AC-C45-独立修订六项回放自检.md',text=`# AC C45 独立修订六项回放自检

知情模型Codex，在正式45—45独立区（b572b1e1-a2ac-4903-9e43-cc84eb36a1b5）修订，不直接改主稿；原主45仍73cc31d8…保留。新稿SHA${hash}，全文cr-revise45-p1至p7实际读完。42—44相关原文已在本轮49页连读中完整读过，42浅碟/43消息碟好拿明确。

实际改动：45原“另一个装菜的也已空…这两只空盒”改“装菜的小碟也已空…眼前空了的盒和碟”，保留饭盒＋浅碟两器物。只改该段；不补父亲中午怎么端洗，眼前空器皿仍不证明过程。新正文10126汉字，字数未靠增写其他剧情补齐。原自由分段没被正式修订区复制，仍保留原初合章版本，不冒充最终稿分段；本次两处短语在受管完整正文实改，原文旧字节由正式修订基线/备份保留。

## summary

逐项对全章复读：余饭自盒带回冷藏、许母半块亲吃、女两菜晚些亲吃、做吃洗/散场均不变；原摘要没有“两空盒”的错误词，保留原摘要，不凭模板宣称全部不变。

## characters

许、女、父三人实际知情现状与原输入相同。沈的现状将“亲见旧盒已空”明确为“亲见旧饭盒和菜碟已空”，与本章及42一致；父热饭/下午馒头热吃只本人所说，未复活早晨已吃或伤愈。

## timeline

三项时间线逐读：许家两点多洗收、快三点半散场、沈到家和许家傍晚，未用错误器物称谓，保留。未把垃圾投放、沈饭热吃、订单客后来取货写成发生。

## ledger

T_AC_SHARED_MEAL仅本次阶段resolved，保留其此前引文及角色差量，增本稿“装菜的小碟也已空”实证。P_AC_C_MEAL_BOX是沈自己的另一只厚盒，自带余饭冷藏，和父亲的饭盒/浅碟分开，保持active与未热吃。其他未变子字段、工装/柜侧照等历史边界保留，不整表刷新。

## evidence

原证据在当前稿均逐字存在，路径仍同原登记45路径；正式工具会以当前SHA定位，新增引文也在修后段。原_replay凭据不改；本次context205/旧消费来源与当前逐一匹配。不是重取原44模板或刷新旧哈希。

## downstream

45为实际末章，正文46不存在；下游尾段只有本章。仍须重登后完整读尾段并正式review后prepare/commit。扩展40—45当前全文复核会再次读49页，届时用新报告，不复用首轮旧45报告。跨章证据意见I_AC_C45_MEAL_DISH的采纳命令因42—45范围被拒，相关链停止，原意见/原证据不删、不冒充应用或verified；本次直接依用户现有45授权走正常独立修订，不改变43—45结构范围。

## 真人语言别扭句

### 真人语言硬问题

没有

四项对白接续、动作/位置、限知和因果均复核。可选解释性旁白风格仍保持建议，非本次必改。此自检不是盲读、真人或文学验收。
`;
fs.writeFileSync(path.join(p,report),text,{flag:'wx'});input.replay_review={reviewer:'Codex AC-C 45独立区六项实读',report,draft_sha256:hash,checked_fields:['summary','characters','timeline','ledger','evidence','downstream']};input.draft_review={reviewer:'Codex AC-C 45独立区完整回读',report,draft_sha256:hash,report_sha256:sha(text)};delete input.output;delete input._instructions;
fs.writeFileSync(b+'/cr-inputs/replay45-filled.json',JSON.stringify(input,null,2)+'\n',{flag:'wx'});fs.writeFileSync(b+'/cr-inputs/45-revised-audit.json',JSON.stringify({sha256:hash,bytes:Buffer.byteLength(body),han:(body.replace(/^#{1,6} .*$/gm,'').match(/\p{Script=Han}/gu)||[]).length,pages:7,read_labels:labels,revision_id:session.id,scope:[45,45],report},null,2)+'\n',{flag:'wx'});console.log({hash,han:(body.replace(/^#{1,6} .*$/gm,'').match(/\p{Script=Han}/gu)||[]).length,report});
