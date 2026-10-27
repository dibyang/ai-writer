import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const base='D:/work/other/ai-writer/acceptance/20261027-hundred-0100-aj';
const work=base+'/work/.writer/revisions/5ec86233-b90a-4dca-aca0-b4268ab2547b/workspace';
const read=p=>fs.readFileSync(p),sha=p=>crypto.createHash('sha256').update(read(p)).digest('hex');
const save=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const v=JSON.parse(read(work+'/.writer/drafts/d-103-112-review-generated.json'));
assert.equal(v.expected_revision,465);
const rows=[
[103,
 ['完成眼前480元核听，并判断是否另接整片追加。','九点到十一点，四百八十，还是只核这一版声画和意见？'],
 ['字幕原文有边注、缺原录，午前交期与已约工时冲突。','声音要回原录。我手里只有这条，不知道叠住的那两句各从哪里出。'],
 ['另报下午三小时720且材料齐才估，不答午前整片交付。','我下午两点到五点，能另留三小时'],
 ['追加给别人，沈仍核完本次并收齐480，失落没有被抹掉。','两笔二百四十合成当前核听的四百八十'],
 ['周给晚间再听的时间，沈未在其上班间隙索求选择正确的保证。','晚上听她讲。']],
[104,
 ['葛清后架并兼顾可用空间；沈只顺路买物。','我来买洗涤液。经过。'],
 ['盒摞、热盘、桌面需求冲突，老人不愿站等。','我站着听十分钟，比走去那边还累。'],
 ['葛拒临加一份、自己整理，沈只帮当次不接日常清位。','往后的早上我不接。'],
 ['椅子当日腾出给另一客，老人未返；葛承担少一份的成本。','那人把外衣自己拿回，坐下以后，先将腰带松一格'],
 ['沈与葛帮助有明确限度，陶保留十一点离班。','一着急就想每天都能照这个样子。']],
[105,
 ['沈想写本人新页，何想把菜单真实份量与价说清。','她想写早上那把椅子，从老人站在门边开始。'],
 ['借他人故事作成长开头不实，漏水也记不准；菜单旧版互相干扰。','不确定的事不能因为难堪就变真。'],
 ['划借用开头，保留想被谢与720未接；不把何的空档占成读稿。','她将纸拿远，试着只读前面老人那段。'],
 ['新页与划头稿分前后层，旧半面另夹；菜仍带去晚饭。','新找一只窄纸夹，装今天重抄这一页。'],
 ['沈看到何自己的劳动和家庭日程，关掉未发邀读。','沈关掉对话框。']],
[106,
 ['按约吃饭，也想让周看新页。','你今天想看吗？'],
 ['周累、不想读字；沈期待落空。','今天不想看字'],
 ['沈收稿、说失望，仍愿同坐而不把整页背给他听。','我想再坐。没给你看成，也想。'],
 ['新页未交、当晚相处继续，回家只记实付，留次晨两小时。','今晚没有一张纸留在他的桌上。'],
 ['双方能说愿望与拒绝、同坐牵手，不靠作品评价换靠近。','先碰她指尖，等她转过掌心才握住。']],
[107,
 ['用预留9—11整理能交付什么的工作说明。','一个写听过以后给意见，一个写实际处理声音。'],
 ['熟悉内容造成记忆补声，导出选区错误和手机布局也妨碍使用。','导出的竟不是自己以为的整段。'],
 ['自录自试、保留缺点，不包修，十一点停下留报价待做。','没有往完成的说明里添一个随口估的价。'],
 ['说明成形未发客户，留用三段不等尝试总数；午前询何可否读页。','留下的三段试声也都有不好听的地方。'],
 ['沈向何提出明确当日请求，未发正文，未获回答。','想请你一个人看，今天有没有一段合适的时间？']],
[108,
 ['何想在14—15买鞋，沈也希望被读但选择陪同行。','下午想去买双鞋，你愿不愿陪一趟？'],
 ['何不想读、菜单还改；鞋的好看和舒适不能同时满足。','今天先不看，菜单那边又要改汤名'],
 ['何自行选合脚灰鞋付79；沈说扫兴但不交换审稿承诺。','灰的吧。我真穿这双走回去。'],
 ['三点前分别，页留家原样，自排67日上午报价例子。','那页今天先留我这里，你不用找空补看。'],
 ['拒读没有取消陪伴，也没有逼出明日补读。','她没有答明天看稿，也没为中午的回复补一串解释。']],
[109,
 ['把240一小时的自用听辨例子交付内容摆清，请顾试找。','只看收到什么，不问这价该收多少。'],
 ['顾误解修改一次、找不到用途，沈想为劳动辩解。','你这里说能改一次，是再给我一份声音？'],
 ['让顾独立使用，承认用途放后，改答问表述不包修。','放得太后了。'],
 ['得到有限使用反馈，顾不是客户；回家修版未获其验收。','她并没有收到他的一段待修录音。'],
 ['顾能直接指出误解并回维修，沈接受有限帮助不强索好评。','你得另答。']],
[110,
 ['沈只吃早饭，素姐等店开想歇与谈话，葛要兼顾生产。','我能在这儿赖一会儿吗？'],
 ['边折袋边听漏话；停工谈话令袋不足、饭凉。','倒像给你折袋子配个响。'],
 ['葛真坐十几分钟后承认不能一直听；沈吃完自离。','可你若接着讲，我未必都听得见。'],
 ['素姐当次不消费可靠坐，葛自担装袋慢，陶十一点离。','这两份今日是自己慢'],
 ['素姐能直接说不满，葛付出注意又给限度；沈不接陪聊常班。','今天没预备坐一上午。']],
[111,
 ['沈吃够自己的午饭；葛想吃饭并为自己剪发腾时间。','先把这后头剪短一点。'],
 ['店中收尾、想加一盘与怕少卖，沈把愿望误作省事。','我就想问好不好看。'],
 ['葛热饭加蛋吃完，放回盆、约洗剪锁门；沈改个人提醒只陪街口。','今天先不添了。'],
 ['饭真吃完，经营时段让出，剪发与回店尚待112实证。','一点半多，葛把碗往前推，终于空了。'],
 ['葛说出美观愿望，沈修正理解；帮助限于当次，不代看店。','不必等剪完。']],
[112,
 ['葛亲选发型并完成洗剪，沈自愿留下看后回自己的生活。','我等一会儿。'],
 ['前客、理发师午饭、发型维护和三点开店的惦记都要付时间。','得等多久。'],
 ['葛露后颈留两边，主动修一小尖自付35；沈分路不核开门。','两边别跟着全改。'],
 ['本次洗剪完成，开门销售未知；15:30自用说明仍无新客户。','门何时开、余下几块卖没卖，她没有跟过去看。'],
 ['沈看见葛自己的偏好并给具体评价，没有把她变读者。','后颈这条线好看。']]
];
const names=['goal','obstacle','choice','consequence','relationship_change'];
const bodies={};
for(const [ref,hash] of Object.entries(v.source_hashes)){assert.equal(sha(path.join(work,ref)),hash);const unit=Number(path.basename(ref).slice(0,4));bodies[unit]=read(path.join(work,ref)).toString('utf8');}
v.chapter_functions=rows.map(([unit,...fields])=>Object.fromEntries([['unit',unit],...fields.map(([text,quote],i)=>{assert(bodies[unit].includes(quote),`quote ${unit}: ${quote}`);return [names[i],{status:'observed',text,evidence:[{unit,quote}]}];})]));
v.operation_id='d-actual-read-103-112-r465-v1';v.report='审查/d-103-112-rolling-review.md';delete v.output;
v.comparison={similar_structures:[
 {units:[106,108],judgment:'同为新本人页未获阅读后继续相处，属于有意相近的关系试探。',differences:'106是私约中的周疲惫拒读，沈承认失望后仍同坐牵手；108是何主动另邀买鞋，物理试穿和客户来电持续，沈不以陪伴换明日读稿。',preserve:'保留周与何不同的生活需求、各自幽默和沈仍介意的残余，不合并为已经释然。',optional_adjustments:[],uncertainty:'只评本次十章中的两场；不推所有读者都不感重复。',evidence:[{unit:106,quote:'我想再坐。没给你看成，也想。'},{unit:108,quote:'她没有答明天看稿，也没为中午的回复补一串解释。'}]},
 {units:[104,110,111],judgment:'均有食品经营、座位/盒袋和主人时间的争夺，场景物件复现但后果不同。',differences:'104老人未能坐，葛拒加单并实移盒；110素姐当次靠坐和停工真谈使袋不足、饭凉；111葛吃完热饭、放回盆并关门外出，重点转主人自己。',preserve:'保留失败、有限使用、主人个人生活三步，不用新收入或老人回场替全线结案。',optional_adjustments:[],uncertainty:'长期店休、固定人手和全晨可用并未被正文证明。',evidence:[{unit:104,quote:'那我今天不添。'},{unit:110,quote:'这两份今日是自己慢'},{unit:111,quote:'今天先不添了。'}]},
 {units:[107,109,112],judgment:'三次回到工作说明、未有客户和240例价，存在可见的反复主题。',differences:'107解决自用定位和导出，109实际他人使用暴露用途与问答歧义，112将已成的说明放回未成交日常，不再扩写交付内容。',preserve:'保留方法自测、有限外部反馈、没有订单三层区别；112只短暂复开，不能改成再次从头做完。',optional_adjustments:[],uncertainty:'这种慢节奏是否适合更强商业追读需另有量尺；本轮没有市场或真人证据。',evidence:[{unit:107,quote:'没有往完成的说明里添一个随口估的价。'},{unit:109,quote:'放得太后了。'},{unit:112,quote:'今天没有人发来文件'}]}
],distinct_gains:rows.map(([u,...f])=>`${u}：${f[3][0]}`),preserve:['沈的有限第三人称与观察/转述分离。','普通愿望、失望与付出没有被手续清单替代。','两处测试变化只作字节变化验证，不包装成品质收益。'],optional_adjustments:[],limits:'完整实读103—112，补读30/76/95/98；仅当前SHA版本的模型知情复核，非真人盲读。未重读全书、72/79/83未覆核，不承认旧版引文为本次当前证据。无新稿113。'};
for(const s of v.comparison.similar_structures)for(const e of s.evidence)assert(bodies[e.unit].includes(e.quote));
save(work+'/.writer/drafts/d-103-112-review-reviewed.json',v);
const extraUnits=[30,76,95,98];
const manifest=JSON.parse(read(base+'/d-initial-audit.json')).candidate_drafts;
const readings=[...Object.entries(v.source_hashes).map(([draft,sha256])=>({unit:Number(path.basename(draft).slice(0,4)),draft,sha256,role:'complete rolling reading'})),...extraUnits.map(unit=>{const r=manifest.find(x=>Number(path.basename(x.draft).slice(0,4))===unit);assert.equal(sha(path.join(work,r.draft)),r.sha256);return {unit,...r,role:'complete earlier-context reading'};})];
save(base+'/d-reading-manifest.json',{reviewer:'Codex session D, model-informed',readings,not_claimed:'whole-book reading or human blind reading'});
console.log(JSON.stringify({review_input:'.writer/drafts/d-103-112-review-reviewed.json',input_sha256:sha(work+'/.writer/drafts/d-103-112-review-reviewed.json'),chapters:v.chapter_functions.length,evidence_fields:50,earlier_readings:extraUnits}));
