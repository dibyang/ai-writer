import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const W=path.dirname(fileURLToPath(import.meta.url)),P=path.join(W,'scenario/东岸末班船-规模验证');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const pre=JSON.parse(fs.readFileSync(path.join(W,'pre-revision-current.json'))),state=JSON.parse(fs.readFileSync(path.join(P,'.writer/state.json')));
if(state.revision!==96||state.units.length!==24)throw Error('unexpected main');
const choices=[
 {unit:13,old:'一回两个钟头。也不全坐那儿听，我问过了，得自己拿针。',next:'一回一个半钟头。也不全坐那儿听，我问过了，得自己拿针。',affected:[13,18,24],why:'首次由姑娘在13当面转述课程长度；每周三19点开课、报名/赴课和有限练习成立。改为90分钟后，18首课和24次课都须在20:30收针；练习仍有询问、拆回及重折角，不能只改课长而保留21点下课。',keep:'开课日期/周三19点/每周一次，13还未上课、18真实首课、24真实第二课；衣服与针盒借还、灯与旧练布位置、母女所知和有限手艺不变。'},
 {unit:17,old:'最后两人在桌边定下，凳面长九十厘米，净宽二十八厘米，做成的坐高四十四。',next:'最后两人在桌边定下，凳面长九十厘米，净宽二十七厘米，做成的坐高四十四。',affected:[17,18,21,23,24],why:'净宽由17试纸样后首次商定，不是14早已说定的工60，也不是observation。缩1厘米仍留窄凳与收腿/端汤限制；17纸样与划边、18横撑内收、21实际成凳、23试收、24营业收凳都要按27实改。',keep:'长90/高44、14工60、17另料24与21实结84；廖有旧板、纸样/内收脚/靠背椅、18仅一端架、21才完成交付，不让已成立工序凭空消失。'},
 {unit:21,old:'“后天下午三点，送到糕店给我，行么？”',next:'“后天下午三点半，送到糕店给我，行么？”',affected:[21,22],why:'21借出沈自购画册时首次约定，非旧章观察。仍是第十五日星期一、沈16点下班前在糕店本人接书。22须改为15:24到店、15:30长针到六时交接，并把交接后搁书时长从半个多钟头改十几分钟，留得出16点离店。',keep:'借书非报酬/赠送，白纸随书且仍沈所有；21父只亲见借出，22老板只见还书、父仅听沈转述；姑娘买布/湿料测试、沈回家带书及父不出门保持。'}
];
const backup=path.join(W,'originals/d-revision-main24');fs.mkdirSync(backup,{recursive:true});
for(const d of pre.drafts){const src=path.join(P,d.draft),b=fs.readFileSync(src);if(sha(b)!==d.sha256)throw Error('draft drift');const dest=path.join(backup,d.draft);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,b,{flag:'wx'});}
fs.writeFileSync(path.join(backup,'state-r96.json'),fs.readFileSync(path.join(P,'.writer/state.json')),{flag:'wx'});
const lines=['# W-D 普通事实修订测试选择','',`选择时间：${new Date().toISOString()}。基于24登记及19—24正式review后的r96；完整state/24章路径、SHA、字数与全部observation三字段见pre-revision-current.json。24章原正文旧字节另存originals/d-revision-main24。`,'','三项均为本次代理在真实授权内选择的合理回溯测试，不是原稿bug，也不是人类逐字设定。修改只在稍后返回的独立workspace进行；主稿24章正文与units不提前覆盖。',''];
for(const c of choices){const d=pre.drafts.find(x=>x.unit===c.unit);if(!fs.readFileSync(path.join(P,d.draft),'utf8').includes(c.old))throw Error('quote mismatch');lines.push(`## ${c.unit}章`, '',`原路径：${path.join(P,d.draft)}`,`原SHA-256：${d.sha256}`,'',`原句：${c.old}`,`新句：${c.next}`,'',`合理回溯：${c.why}`,`实际影响：${c.affected.join('、')}章。`,`必须保留：${c.keep}`,'');}
lines.push('## 七章的实际必要变动','', '13课长；17纸样/初整尺寸；18横撑尺寸及首课钟点；21实做尺寸及首约/复述还书时间；22实际赴约、交接钟面和接书后搁放时长；23试收/削窄讨论的既定净宽；24第二课过程钟点和营业/收凳净宽。共7章，不为六章门槛改无关句。14、15、16、19、20保留旧正文。','', '## 纲文差异与来源边界','', '已登记正文的普通事实修订，保留旧计划记录当时构思；不编辑任何既消费设定/大纲/卷契约，不发布伪造新版，不改source_hashes。与旧计划中“两小时、28宽、15点”不同之处，由本报告逐项明确作为当前修订后的实际正文值。原计划不是已发生情节。无需为表格把旧计划强改成新意图；若后续确需改变已消费规则/大纲入口，必须先真实冻结旧字节、impact并在独立区正式发布，本轮不做这种更改。', '', '已实读计划：近期细纲-W-16-18.md含18两小时及17/18宽28；近期细纲-W-19-21.md含19—21课19—21/宽28；执行细纲-W-C-21.md及0021.json含15点首约；执行细纲-W-D-22-24.md含15点/宽28。相应计划文义与新正文差异如上，不用新哈希追认消费。', '', '前12正文和units完整保护；所有原有observation的存在、type、statement、author_truth一律不变。特别O_BOX_PAINT三字段及箱漆非排他归属证明边界不变。父辈/复航不强收，伤脚与未完困难不抹平。','', '本轮正式修订范围13—24，改稿7章但需保守逐章重登整段。此进程只完成候选13重登；14—24留同ID下次恢复；不prepare、commit、abort，也不重登14。');
fs.writeFileSync(path.join(W,'d-revision-choice.md'),lines.join('\n')+'\n',{flag:'wx'});
fs.writeFileSync(path.join(W,'d-revision-choice.json'),JSON.stringify({choices,baseline_revision:96,originals:backup,planned_changed:[13,17,18,21,22,23,24]},null,2)+'\n',{flag:'wx'});
const prior=JSON.parse(fs.readFileSync(path.join(W,'inputs/d-workflow-draft-v2.json')));
prior.expected_revision=96;prior.operation_id='w-d-authorize-revision-13-24-first-stop';
prior.workflow.stage='revision';prior.workflow.task='W-D三项普通非observation事实合理回溯测试：13课长90分钟、17凳净宽27、21后天15:30还书；独立修订13—24，本进程仅重登13后停。';
prior.workflow.authorization={allowed_actions:['discuss','plan','revise'],draft_range:null,revise_range:{from:13,to:24},stop_conditions:['主稿24正文/units和前12全部字节不改；全部observation三字段保留；仅独立区真实改稿，不重写消费哈希。','使用本次revision begin实际ID/owner/token/base/workspace，不复用V历史。','本进程仅重登13，候选应1—13；14—24未重登；不prepare/commit/abort。']};
prior.workflow.planning.outline.unresolved_ids=['修订测试见W/d-revision-choice.md；旧计划留历史意图，普通事实纲文差异真实说明','14—24由根核占用后同ID恢复，本进程不得继续重登14'];
fs.writeFileSync(path.join(W,'inputs/d-workflow-revision.json'),JSON.stringify(prior,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({choices:path.join(W,'d-revision-choice.md'),old_drafts_backed_up:24,input:'inputs/d-workflow-revision.json'}));
