import fs from 'node:fs';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const p='scenario/东岸末班船-规模验证/',sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const s=JSON.parse(fs.readFileSync(p+'.writer/state.json'));assert.equal(s.revision,88);
const x=JSON.parse(fs.readFileSync(p+'.writer/drafts/w-cr-review-16-21-template.json'));delete x._instructions;delete x.output;
x.operation_id='w-cr-actual-full-read-16-21-r88';x.report='审查/W-C续程-16-21完整连读.md';
const rows=[
[16,['照常返工、让父自己盛锅，并让纸盒适合具体使用者','今天锅留在面前'],['新盒扣严却不便母亲开、柜面与操作空间有限','她手有点不利索'],['虚合纸条留揭头和小袋分用，不全部接手教折','短舌折到盖内，盒子只虚合'],['父四带接头实成且洗晾仍湿，纸盒按用途区分','两条都固定在袋口厚褶上'],['父有坐着可做的事，沈可先看书，老板自己学折','没有将整张接过去']],
[17,['履14看料约，把旧板与摊内需求变成尺寸','这个做面。腿得另找干料。'],['坏端/薄翘板与预算、通道和靠背需要','它薄，又翘'],['舍坏端不硬凑腿、移盆筐定28、先询24再垫买','净宽二十八厘米'],['只备面未做腿，84仍应收，空间真正让出','面备好，腿未做'],['有价委托取代顺手免费，廖保留花板与旧椅','洗净手，翻出面钱给他']],
[18,['首课真实出门、袋真轻用、凳加工推进','她说想学补袖子'],['布缝皱、伤脚慢与窄接头/试装偏','两块布中间皱成一个小窝'],['女先练不剪母袖，父借臂只到门口，周撤面拆未固端','将尚未紧固的一端拆下'],['首课收结归家而衣未补，袋真用后回，凳仍未成','九点，老师开了门'],['母女可各吃各过夜，父能主动交袋借臂','汤我都喝了，豆腐还有']],
[19,['何为私会请求有限换时','没什么急事。就是坐坐。'],['许原午觉/送灯被挤，提前班真疲倦','午觉那一点不足'],['换14:30至17并真接钥匙，何必须按约接回','你今天两点半到五点'],['何16:56返、许早归但倦，灯未送；母介绍沈/布摊','四点五十六，老何到了。'],['何准时接回应许付出，母女共做饭许能坐歇','你也没迟。']],
[20,['午间保饭短休且面对借袋勾损责任','我现在吃。'],['笼布工时/加笼与老板替守后的不快','昨天你回去，我留到下午才吃。'],['不调追加一笼，饭轮看、下午裁洗两布，损袋如实还','今天下午不续了。'],['十份本店六外店四真实少卖，女只约明日看、袋仍未修','她说那边只有四份，把这里六份都给她'],['老板不快和父看自己针线都保留，沈不替人担保神速','我看一眼。拆还得拿针。']],
[21,['使未成凳进入营业、有限所学真实帮人','第二副端架紧好'],['雨中客脚货物与工作位竞争、厚褶扎不进','针身不动，指头倒疼'],['做成后交付，挪凳移筐；小段修而厚处退、按约赴家取书','她停下，将针退回来'],['84实结、雨天擦收/葱位付代价；袋补后父轻用，书借未归','葱筐从案边换到案下'],['从帮忙到共同兴趣借阅，父直言不齐后有限接纳','后天下午三点，送到糕店给我，行么？']]
];
x.chapter_functions=rows.map(([unit,...fields])=>Object.fromEntries([['unit',unit],...['goal','obstacle','choice','consequence','relationship_change'].map((k,i)=>[k,{status:'observed',text:fields[i][0],evidence:[{unit,quote:fields[i][1]}]}])]));
const pair=(units,judgment,differences,preserve,quotes,optional_adjustments=[])=>({units,judgment,differences,preserve,optional_adjustments,uncertainty:'知情模型实读16—21，不证明真人盲读/市场效果，22—24尚未写。',evidence:units.map((unit,i)=>({unit,quote:quotes[i]}))});
x.comparison={similar_structures:[
pair([16,20],'同写店务但冲突不同','16按顾客手部限制选包装；20拒加笼真少卖四份与老板不快','保留老板利益与沈休息选择，不把改工序写成无损',['她手有点不利索','那边只有四份，把这里六份都给她']),
pair([17,18,21],'同一木活链连续阶段并非重问报价','17定料尺度垫钱备面；18端架试偏未成；21装好交付实坐实移84实结','保留28约束及雨天真实营业代价',['面备好，腿未做','另一头还散着，面也没有装','葱筐从案边换到案下']),
pair([18,21],'都有针线却目标和关系不同','18首课失误/母独处而衣未补；21小段助人、厚退针、延至自己的画册兴趣','保留有限技能与父直言针不齐',['今天先在边角布上练固定','看得出来。'],['木活前半可选收紧，非必改']),
pair([19,20],'时间竞争的选择相反且均有代价','19许同意换时少睡；20沈拒挤午饭且老板少卖','答应/拒绝/不快都可成立，不套一个帮忙答案',['那我少睡点','我现在吃。']),
pair([18,20,21],'袋是连续使用史不是三次同义兑现','18父首次门口轻用；20借沈勾边还父；21一课小修真实回父轻用','初愿完成后仍有磨损，维修只保本次小段',['低头喝一口水','先还你，勾开了一点。','盒和报纸放进浅蓝布袋'])
],distinct_gains:['16纸盒适用与不代做的协作','17材料/钱/空间落实普通28宽事实','18首课与袋首次轻用，端架尚未成','19老何能为自己开口且按时归，许真少睡','20休息与少卖并存，承担借物损伤，建立有限看袋之约','21窄凳实用付代价、小修见效，画册借出形成新的普通还书约'],preserve:['慢节奏、人物误听/小窘/不快','事实按正文在场/转述，不让账本解决代替行动','17宽与21约均是普通事实，observation保护不放宽','父伤脚与有限手艺、明确持有和实付'],optional_adjustments:['21木工动作密/雨客局部陈列感可选调整','后续不宜每章都以同种吃饭收拾收束，此为节奏观察','21前两天口语可按未来正式授权精确为先前，现不判严格48小时硬伤'],limits:'r88登记后按16→21全文共6章真实连读；13—15本次为首次/最近相关段回读，前12正文未全文重读。功能30项为知情模型判断，脚本只核引文和SHA，不证明文学通过/真人或市场验收。22未写，普通还书约未来未兑现。'};
const files=new Map(s.units.map(u=>[u.unit,u.draft]));
const evidence=[];const check=e=>{const ref=files.get(e.unit);assert.ok(ref,`unit ${e.unit}`);const b=fs.readFileSync(p+ref),t=b.toString('utf8');assert.ok(t.includes(e.quote),`${e.unit}: ${e.quote}`);const at=t.indexOf(e.quote);evidence.push({...e,draft:ref,sha256:sha(b),line:t.slice(0,at).split('\n').length});};
for(const row of x.chapter_functions)for(const k of ['goal','obstacle','choice','consequence','relationship_change'])row[k].evidence.forEach(check);
for(const row of x.comparison.similar_structures)row.evidence.forEach(check);
[{unit:13,quote:'报名还有位置，已经报上了'},{unit:14,quote:'手工六十'},{unit:15,quote:'如今窗上那两幅不是它'},{unit:15,quote:'装半瓶水，也得夹胳膊底下'},{unit:17,quote:'凳面长九十厘米，净宽二十八厘米，做成的坐高四十四'},{unit:17,quote:'老板算了料和紧固的小件，一起二十四元'},{unit:17,quote:'廖还没有付'},{unit:18,quote:'老师给她换了一段短些的线'},{unit:18,quote:'许蓉接过工装，叠好放进自己的柜子'},{unit:21,quote:'行，三点。我下班过来。'},{unit:21,quote:'她把书装进自己包'},{unit:21,quote:'父亲从袋里拿出眼镜盒，又抽报纸'}].forEach(check);
for(const [ref,hash] of Object.entries(x.source_hashes))assert.equal(sha(fs.readFileSync(p+ref)),hash);
fs.writeFileSync('inputs/cr-review-16-21.json',JSON.stringify(x,null,2)+'\n',{flag:'wx'});
fs.writeFileSync('cr-review-evidence-manifest.json',JSON.stringify({revision:88,report:x.report,report_sha256:sha(fs.readFileSync(p+x.report)),source_hashes:x.source_hashes,full_read:{16:194,17:176,18:226,19:210,20:198,21:350},evidence},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({revision:88,functions:x.chapter_functions.length,fields:30,comparison_groups:x.comparison.similar_structures.length,report_sha256:sha(fs.readFileSync(p+x.report)),evidence:evidence.length}));
