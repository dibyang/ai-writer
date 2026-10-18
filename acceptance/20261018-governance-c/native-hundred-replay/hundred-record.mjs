import {read,put,run,stage,hundred,sha,state} from './harness.mjs';import path from 'node:path';import fs from 'node:fs';
const b=read(path.join(stage,'hundred-session.json')),p=b.workspace,x=read(path.join(stage,'samples/replay-1.json'));
const report=`# 第100章等价回放实核（native-four）

审查者：同一Codex会话知情自检。合成验收，不是真实作者决策。完整实读95–100六章正文、100细纲、恢复的全部原summary/changes（含长历史人物串）及定位、声音、规则、人物、续部、V13契约。1–94没有模型通读；长历史字段阅读不等于重读对应正文。

正文100 SHA256：${x._replay.draft_sha256}。本次所有正文保持原字节。旧增量阅读视图为native-hundred-replay/reading/100-old-changes.txt，逐字符保留，插入换行供阅读。

|实核字段|实际核查及证据|结论和边界|
|---|---|---|
|summary|62日热99余饭，59半页含午饭照吃，14:30何到、沈读至末行、15:09何离；100原句“昨晚同周说的新话没有写在这里。”“目前就到今天，不打算把这一份拿去排一场公开的。”；随后电话回邱|旧摘要保留；未把何菜单交付、邱开火当亲见|
|characters|沈、邱、何三项逐字核旧历史保留，100仅追加当前；何离场前不知道之后沈邱电话，邱未获新半页内容，周未在100出场|三项原值等价回放；99周袜子消息与各家钥匙不逆改|
|timeline|唯一追加为62日私读及回声；与95预看、96核盘、97开盒/告唐、98告何约读、99饭约的先后对照|日期不提前；14:50多作决定不等未来公开许可|
|ledger|逐项读T_VOICE_CONSENT/P_QIU_WORK_PAGES/T_PAGE_PAIR/R_SHEN_QIU_LIFE/P_SELF_PAGE_95/T_SELF_USE_95；邱盒未再开，P_SELF_PAGE仍沈持，新说明另纸夹外|仅T_SELF_USE_95按本次私读resolved；其statement保留初始95时点“盘…未核”，current reader_known已有96核盘，不误当当前待办；两个partial及due100原样保留|
|evidence|六条目共15条本章旧引文逐句对照100；“何也已经听到第六十日开原盒核两页两夹的新结果”是转述结果，非何目击；“一颗跟壳走了，自己先捡。”是电话听到|引文无需更改，仍交CLI严格校验正文/锚点/历史链；子串存在不作语义充分证明|
|downstream|100为实际末章，无101；95原半页不补99关系话；97两页缺名与上柜单页分开，98何获核存不等取纸权；旧余带钟问号未解|本次不改变事实、未来设定及原摘要/增量；无更早修订授权，不登记95–99意见|

真人语言别扭句：真人语言硬问题：没有。依照当面复述、主谓动宾、行动落地和默读改口四项检查，何对酸李/眼镜/菜单的语言与自己的工作生活一致；未把正常比喻或个人压缩偏好列为硬伤。六章重复边界说明较密，后续结构比较保留实际不同收益及不确定性。本报告仅回放核验及尾段自检，不是百章文学通过、真人盲读或正式发布验收。
`;
put(path.join(p,'审查/native-four-100回放实核.md'),report);
x.replay_review={reviewer:'Codex native-four informed self-review',report:'审查/native-four-100回放实核.md',draft_sha256:sha(fs.readFileSync(path.join(p,x.draft))),checked_fields:['summary','characters','timeline','ledger','evidence','downstream']};
run('hundred-preview-reviewed',['record-preview','--revision-token',b.token],p,x);
run('hundred-record',['record','--revision-token',b.token],p,x);
const after=state(p);console.log({snapshotEqual:JSON.stringify(after.snapshot)===JSON.stringify(state(hundred).snapshot),units:after.units.length});
const rt=run('hundred-review-template',['review-template','--from','95','--to','100','--revision-token',b.token],p);
put(path.join(stage,'hundred-review-template.json'),rt);console.log(JSON.stringify(rt));
let text='';for(const u of after.units.slice(94)){text+=fs.readFileSync(path.join(p,u.draft),'utf8')+'\n';}
put(path.join(stage,'reading/post-record-95-100.txt'),text.replace(/[^\n]{1,100}/gu,'$&\n'));
