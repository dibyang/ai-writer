import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {main,j,sha,cli} from './e1-ops.mjs';
const root=path.join(main,'.writer/revisions/46029167-c62a-44f9-b591-e053ddc01bbb/workspace');
const input=j(path.join(root,'.writer/drafts/e2-review-34-39-template.json'));
const data=[
 [34,
  ['为看书约与修门腾出现实时间，同时过自己的周六','明日周日，两点，原来那家旧书店门前。我中午回家吃过再去。'],
  ['房门拆清耗时与主人十点出门冲突，不能仅因到场就拆','今天没卸不算做完。'],
  ['保留主人出门，另约半天；不凭柜门黑线买料','今天不凭这条黑线给他买料。'],
  ['松椅实际交回并收到20，腾出铺位；书约前日互告确认','二十元从钱夹里取出，是一张整的。'],
  ['父亲还画册，双方各自选书不替对方带任务','那你先翻，我在旁边找我的。你翻完叫我。']],
 [35,
  ['兑现一次共同选书，同时各留选择','姑娘用自己的手机付了十四元。'],
  ['各自审美不一致，想带回几页不等于整本必须买','自己带的钱够，二十取出还能剩两块'],
  ['女儿自付14买花册，沈看18薄书后仍不购','沈禾的布袋仍空着，折起来比来时多一道横印'],
  ['花册纸包进入女儿袋，20留款仍在沈夹内','原先备的二十也仍在钱夹内。'],
  ['可同行而不统一喜欢的画，分路后也不强定下次','自己还是喜欢前面挤一些的']],
 [36,
  ['让买回的书与洗穿的衣进入真实生活使用','周一，三洗后穿，靠桌还认角'],
  ['练布折平但拉线令布缩，穿洗不自动消角','整段看起来仍不整齐，六七针就能认出好几处差别'],
  ['女儿试少量新针后停，保留旧段；母自行写本次反馈','周一，三洗后穿，靠桌还认角'],
  ['同张纸新增周一条，未交师；母与父分别亲听14元告知','她坐到旁边，说姑娘买一本花，十四'],
  ['母亲能分享自己的戏与使用话，女儿不把她只当反馈提供者','我坐一下午，不是只为了回来交这两句。']],
 [37,
  ['安置实衣/原纸/练针并提出共同做饭的意愿','母亲将衣领递给她，让她接好，自己松手。'],
  ['厨房属于母亲日常空间，班与具体日都未定','哪天得先说，我也有我的事'],
  ['先问许可且各做一项，不替母亲答应','不如找个都空的半天一起做。'],
  ['一次厨房许可成立，原衣实交入袋，门活重约九到十二','问过了，厨房可以借一回。各做一点，收好。哪天我们再看班。'],
  ['朋友从各自饭盒走向可合作意愿，母亲保留独立安排','我也有我的事']],
 [38,
  ['把实衣、新条与旧练布真正带到老师灯下','老师把纸转向灯，读到“三洗后穿”'],
  ['摸见折厚不等于替使用者体验，拉线牵动连续旧针','她靠桌怎么觉着，还是她说的算。'],
  ['先不拆母衣，自己练四针松第一再两针','那今天先不拆。我还想把这条边缝明白。'],
  ['真实第四课100分钟结束，原物由女带到家门口未交母','八点四十，老师叫收针'],
  ['老师等学习者自己认线，能保留做得不齐的一小段','别从布里抓。先认线。']],
 [39,
  ['将实衣和有限意见还给使用者，使门活到场并付出排班选择','先穿着吧。这两天我换一件，口袋老摸空'],
  ['母仍认角、沈午间交班需代价、门下木况未见','九点刚过，第一根钉还在木头里。'],
  ['母自主先穿；沈愿早半小时争取单方半天；周先商工料','四十工，料你给我看再说。'],
  ['原衣真返母、沈获附条件窗口，房门尚未拆修付钱','下周一我早来半小时，十二点半交完能走，你那边怎样？'],
  ['女儿允许母决定不拆；朋友说真愿意和成本，不统一生活','角真叫我难受，我跟你说。今天还没到非拆不可。']]
];
const keys=['goal','obstacle','choice','consequence','relationship_change'];
input.operation_id='E2_REPAIRED_FIRST_REVIEW_34_39';
input.chapter_functions=data.map(([unit,...vals])=>({unit,...Object.fromEntries(vals.map(([text,quote],i)=>[keys[i],{status:'observed',text,evidence:[{unit,quote}]}]))}));
input.comparison={similar_structures:[{units:[36,38,39],judgment:'三章都含摸布/看袖与克制停手，存在可识别的近似动作链。',differences:'36是母自行穿用后的书面反馈与女儿在家初试；38老师首次把实衣/新条/新针相遇而不代母判断；39是将决定还给母亲并停针听戏。知识与所有权的变化逐章不同。',preserve:'保留有限使用结果、老师不代答与母亲自主，不能为了去同词删掉行动证据。',optional_adjustments:[],uncertainty:'模型知情连读，不能代替陌生读者对慢节奏的接受程度。',evidence:[{unit:36,quote:'周一，三洗后穿，靠桌还认角'},{unit:38,quote:'那今天先不拆。我还想把这条边缝明白。'},{unit:39,quote:'角真叫我难受，我跟你说。今天还没到非拆不可。'}]},{units:[34,37,39],judgment:'修门线反复发生确认时间/留下空间，但有不同阶段功能。',differences:'34实看到裂条却保留主人出门；37本人来电落实周四半天；39双方实际在场并说定40工、材料另看，第一钉未起。不是三次等价的空承诺。',preserve:'保留主人与老人自己的安排以及现场先问价，旧木条未拆的边界。',optional_adjustments:[],uncertainty:'40以后拆修是否足以兑现不在本报告的新版本覆盖中。',evidence:[{unit:34,quote:'今天没卸不算做完。'},{unit:37,quote:'答九点到，上午先留到十二点。'},{unit:39,quote:'九点刚过，第一根钉还在木头里。'}]}],distinct_gains:['34真实交椅收20/归还原8册并确认远约，门只看不修。','35兑现共同选看且各留审美，女实付14、沈18未购。','36买书后实际阅读/拍图与三洗实穿新反馈，两个家庭各自被告知。','37实交衣并取得一次厨房许可、落实修门半天。','38老师真读新条/看衣，学习者新六针有有限改善而不必拆衣。','39母亲实收并自己选穿，沈问得有早到代价的单方窗口，周按约到场说清工料。'],preserve:['温暖克制的慢热生活与合作对白，各人有不同口味、速度和安排。','价格变更只35/36受控花册；1—34、33V2、箱漆、旧80/35/81/84及原8册/20留款不动。'],optional_adjustments:[],limits:'当前34—39共41页全读：34六页、35六页、36七页、37八页、38七页、39七页。35—39在本次恢复过程中实际返回，34为审查补读；均以当前同SHA页面复用，不拼接旧版本短评。Codex模型知情自检，非人类/盲读/文学验收；未覆盖40—48新版和全书本次重读。38/39细纲保留历史首停措辞，不伪称已刷新。'};
input.issues=[];
input.report='审查/E2-34-39-当前六章连读.md';
let report='# E2 当前34—39六章连读\n\nCodex模型知情自检，同一原生会话，非人类/盲读。\n\n'+input.comparison.limits+'\n\n';
for(const f of input.chapter_functions){report+=`## ${f.unit}\n\n`;for(const k of keys)report+=`- ${k}：${f[k].text}；原文“${f[k].evidence[0].quote}”。\n`;report+='\n';}
for(const c of input.comparison.similar_structures)report+=c.judgment+c.differences+c.preserve+'\n\n';
report+='实际高置信新剧情问题：本窗口未发现控制变量以外必须新增改稿项。历史细纲首停范围残留已在38/39单章报告单独记录；不借此改旧来源。价格14元是controller试验，不是作者原话。六条旧verified意见仍需整体新版复核，原application不新造。\n';
for(const [ref,h] of Object.entries(input.source_hashes))assert.equal(sha(fs.readFileSync(path.join(root,ref))),h);
for(const f of input.chapter_functions){const ref=Object.keys(input.source_hashes).find(x=>x.startsWith(`正文/${String(f.unit).padStart(4,'0')}-`));const b=fs.readFileSync(path.join(root,ref),'utf8');for(const k of keys)assert(b.includes(f[k].evidence[0].quote),`${f.unit} ${k} quote absent`);}
fs.writeFileSync(path.join(root,input.report),report,{flag:'wx'});
const out=path.join(root,'.writer/drafts/e2-review-34-39.json');fs.writeFileSync(out,JSON.stringify(input,null,2)+'\n',{flag:'wx'});
cli('e2-review-34-39',['review'],{root,input:out,token:true,brief:true});
