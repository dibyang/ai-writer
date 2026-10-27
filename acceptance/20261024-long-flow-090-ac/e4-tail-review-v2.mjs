import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {base,main,j,sha,state,save,cli} from './e1-ops.mjs';
const root=j(path.join(base,'e-repaired-first-execution.json')).revision.workspace;
const rows=[
[31,['把两点茶约落实为可出门空时','午后照原来的两点到。'],['工作习惯会让离店又变接活','工具包放回柜后。'],['明示归时、联络、只提自杯','两点至四点外出'],['真实锁门出发尚未喝茶','一点四十分，走过去不必快。'],['廖让吃过来不以招待多劳动','不用带东西，吃过饭来。']],
[32,['实际喝完一次有头尾的茶','一点五十八'],['职业习惯把来电变现场工作','三点一刻过了一点。'],['回铺再接柜门询问','自己回铺有本子，写着也不容易漏。'],['四点前回铺并补记真答复','四点也还没到。'],['不拿待修活作来家条件','不用先把一项活摆在人中间。']],
[33,['将真实有限用感送老师','我先回了家，是特地过来看的'],['纸上用感不等于见衣可剪','衣边有没有变化，要看衣才说得准。'],['保持母原话及自己的旧布','原字还在，自己只在边上补了说明。'],['原纸原布带回、没有新缝成品','夜里这一趟没有缝成新东西。'],['母亲听实报仍自己决定衣','下周的事到时再看，今夜不搬']],
[34,['给周日书店各留一段空','明日周日，两点，原来那家旧书店门前。'],['家中一顿饭与工作交班仍须落实','十二点半交完，路上不买菜'],['周不为今天赶成刨原门','今天先不卸。'],['椅真实交还20入账，门另待约','二十元从钱夹里取出，是一张整的。'],['朋友各看各选不替父买','你翻完叫我。']],
[35,['两人真正到店各找想看的','我们约来的。'],['自己喜好不等于另一人的花页','自己还是喜欢前面挤一些的'],['女付14、沈18薄书先不拿','姑娘用自己的手机付了十四元。'],['书归姑娘、沈20仍在','原先备的二十也仍在钱夹内。'],['听对方意见不必随之改变','我想听你说。又不是听完就得换。']],
[36,['把出游收益带回各自生活','今天翻到纸边，才发现自己没有在数还剩几张。'],['用感仍限靠桌、洗后未来未知','靠桌还认角'],['女旧布旁新针不拆全段','没把整块旧练布拆回一片白。'],['母自己追加三洗条，父真实此刻知14','姑娘买一本花，十四'],['独看也能继续分享不混新旧册','不是新看的那本，是家里八块那册']],
[37,['把一起做饭愿望说具体','不如找个都空的半天一起做。'],['灶具不是候船室、借用需本人答应','候船室不是家里的灶台'],['各做一道先问母厨房','我先问我妈'],['母真实许借一次但未定日期','哪天得先说，我也有我的事'],['母旧衣本人交女、使用权保留','那我这件还是想穿的。']],
[38,['真实衣、纸与新练段在课上相遇','下面是她周一写的。'],['厚角有因，不凭别人的胳膊代母','你这只胳膊同你妈不一样。'],['原衣先不拆、练自己的边','那今天先不拆。我还想把这条边缝明白。'],['旧段留、新六针有边界的进步','自己手里多的这六针'],['老师不代做，学员自己辨拉线','你刚才是想拉住布，还是想收线？']],
[39,['把已学带回使用者选择','老师看了？'],['想修好与母仍要穿并不等同','今天还没到非拆不可。'],['母先穿，沈为友饭真问老板','那天我早来半小时。'],['单方班暂成、门工40同意未动钉','第一根钉还在木头里。'],['母决定体感，女不每饭问三回','我要真不讲，你早饭问三回也听不着。']],
[40,['拆清旧条选真正可用新料','这一根十块，我付了。'],['地面非齐平、主人又要挡风','细的留吧。我不是要把你们关在里头。'],['主人知10且同意，周实付10整','十块就十块，别最后一算又多一样。'],['料试夹后取下未固定，女换班有真代价','我能接周六最后两小时。'],['留旧物/余头与先休息由本人说','想先坐十分钟喝点水。']],
[41,['固定后让使用者亲试并结账','周岸答工四十、料十，合起来正好五十。'],['收漆小边、有限细缝仍有风','脚这里还有一点。'],['不强封风，由母女各推一次','这回不用我踢。'],['50整收票记清、友饭日期由各方真确认','工料共五十已收'],['母先吃想歇可歇不做评菜席','我先吃我的，想歇我就进屋。']],
[42,['抽屉真交付与兑现补班/留父饭','一共十八，推到周岸手边。'],['原柜旧卡未亲试、伤脚一大盒不稳','一只大的一歪，怕饭掉出来'],['女实补两小时、父饭菜分小盒浅碟','我今天接后头两小时。'],['18实收归家用是客户消息；父饭已冷藏','一起收进冰箱中层。'],['父能自取，朋友饭不包办家中全流程','我的肚子可替不了她。']],
[43,['交班后真正相聚、各买一项','交好了。我这就过去'],['订单迟到/厨房窄/买大把可能老','一把卖，我也省你在那里挑半天。'],['女选3菜2豆干、沈两芋6，不花满预算','就六块，不添了。'],['沈余9女余5，料已洗尚未开火','厨房里还没开火'],['先坐够十分钟、不把好友当人手','今天我来吃饭，书又不会饿。']],
[44,['做成且吃过各有口味的一顿','三条宽点的'],['芋黏、饭有硬芯/软硬口味不同','自己更爱粉的'],['两片中留三宽，四整芋留、不全压','没再添一片。'],['宽条吃1.5余1.5、母半芋独留','还留一条整的和半条'],['不让量米失准强迫多吃','别我吃完自己的，还要替量米那一下收尾。']],
[45,['洗收、剩食和物件各归其位','先把吃的找地方吧。'],['窄池/腕酸/盐临时挪挡常用','我明早得找。'],['自盒带米整芋、女孩自留菜','盒是她自己的，不用回来还'],['父此刻听三条、女孩夜吃净1.5','她先吃半条，再将整条咬作两口'],['可分别想歇，不假添行程','倒省得各在椅上替另一个醒着。']],
[46,['吃净余食、洗自盒并歇手','先把带回来的热了'],['中心要热透、仍腕酸不硬举','中间还要热'],['父自愿尝半芋仍选馒头','父亲把面前半块芋头吃完'],['余食净厚盒归自家，垃圾真实丢','盒子不再住在冰箱里。'],['母只收一层、衣先洗不趁累拆','今晚只留这一层']],
[47,['回常班并选择自己今日饭与工作','今日午后并没有约着一扇门等她'],['休息未抹去腕酸、衣早潮不强穿','这里还没干。'],['独立钱买今日豆腐/饼，门账据实回看','工四十、料十那两行，下面记着实收五十'],['门无找零、抽屉18独立、衣晚干短试记原纸','自己没有另掏零钱。'],['父坐着干择搅蛋、母最后厚块自己想吃','不是替她清盘。']],
[48,['独立完成自己的新空截','自己要做的只有这一截。'],['三针皱、漏底层，旧针不得全拆','第三针一拉才起。'],['自己定位退后两针并容一针稍远','后面两针怕都得退'],['新小截放手不缩，20:40收针原纸旧段在','新那一段仍没有拱起。'],['母午间用衣夜才告女，朋友图片先明示新段','先写明新的是哪一小截']]
];
const keys=['goal','obstacle','choice','consequence','relationship_change'];
const coverage=[];
for(let n=31;n<=48;n++){const ref=state(root).units[n-1].draft,pages=[];let all='';for(let p=1;;p++){const f=path.join(base,'read-pages',`e4-tail-c${n}-p${p}.json`);const q=j(f);assert.equal(q.page,p);pages.push(path.relative(base,f).split(path.sep).join('/'));all+=q.text;if(p===q.pages)break;}const b=fs.readFileSync(path.join(root,ref));assert.equal(all,b.toString('utf8'));const h=sha(b);for(const log of pages)assert.equal(j(path.join(base,log)).sha256,h);coverage.push({unit:n,path:ref,sha256:h,pages:pages.length,logs:pages});}
assert.equal(coverage.reduce((s,c)=>s+c.pages,0),133);
const funcs=rows.map(([unit,...vals])=>({unit,...Object.fromEntries(vals.map(([text,quote],i)=>{assert(fs.readFileSync(path.join(root,state(root).units[unit-1].draft),'utf8').includes(quote),`${unit}:${quote}`);return[keys[i],{status:'observed',text,evidence:[{unit,quote}]}];}))}));
const scope=process.argv[2];assert(['31-36','35-48'].includes(scope));const[from,to]=scope.split('-').map(Number),input=j(path.join(root,`.writer/drafts/e4-review-${scope}-template.json`));assert.equal(input.expected_revision,state(root).revision);
input.operation_id=`E4_FINAL_CONTINUOUS_REVIEW_${from}_${to}`;input.report=`审查/E4-${scope}-当前连续实读正式报告.md`;input.chapter_functions=funcs.filter(f=>f.unit>=from&&f.unit<=to);
const ranges=from===31?[[31,32],[33,34,35,36]]:[[35,36],[37,39,40,41,42,43,44,45,46],[38,39,47,48],[40,41,42,47]];
const descriptions=from===31?[
['从留纸赴约到完整喝茶，空时有实作前后','31退开工具/留归时走向廖家；32真正坐到将近四点回铺才接电话，不是再约一遍。'],
['用感和日程的确认指向不同动作','33真送纸无实衣，34班/门/椅分行，35真成行且各自买或不买，36回家独看/互告/练针。14在35产生36告知，非父母先知。']
]:[
['两人出游与各家回看有不同收益','35同店各选；36各家用书与明确区分18薄书未买、8原册及14花册，观看不全等于买。'],
['共饭线多次确认但每次推进新的实际条件','37意愿和厨房许可；39单方早班；40换周六两小时；41日期落本；42劳动兑现/父饭小份；43真实交班休坐买料；44做吃；45洗收及告父/女孩吃净；46余饭归家热吃净。没有把后章收益提前记入前章。'],
['旧衣/原纸/旧针和本人的新练段各自有边界','38老师首次实衣看后不拆；39决定还母；47洗后短试只新纸行；48纸保旧话、本人新段退两针重做，不将没注意说成没碰，不替未到的母日间体验提前教给老师。'],
['门和抽屉都有修配收款，但对象与结论不同','40主人同意10、周付10；41固定/母女真试/50整收/票归主人；42抽屉18独立且原柜旧卡未亲见；47本子回看50不再收，柜门照片仍待。']
];
input.comparison={similar_structures:ranges.map((units,i)=>({units,judgment:descriptions[i][0],differences:descriptions[i][1],preserve:'保留每次实际行动、本人选择、知情和所有权边界；不因共同词句判成剧情重复。',optional_adjustments:[],uncertainty:'模型知情实读仅对所列当前字节作判断，不能代替真人陌生读者评价。',evidence:units.map(n=>funcs.find(f=>f.unit===n).choice.evidence[0])})),distinct_gains:input.chapter_functions.map(f=>`${f.unit}：${f.consequence.text}`),preserve:['三项为controller受控试验值，作者依据保持原human原话；14花册/10料/50实收/3宽条按实际行动回收。','原8册、18未买、20未动、旧80/35/81/84、33V2、箱漆不可变观察及各人知识和款物所有权。','课程19:00—20:40共100分钟、有限衣感和旧纸/旧针、父伤脚、照片pending与未约成下次。','六旧意见原application不变，E不假造新采纳或二次修复，F新ID全读1—48后逐IDverify。'],optional_adjustments:[],limits:`本进程在48正式登记r279后依次实际完整返回当前31—48全文133页；本报告${scope}逐章绑定当前SHA。31—34只读没有重登；35—48实际完整108页，不借早程SHA假称本次连读。Codex模型知情自检，非人类/盲读；未完整阅读1—30，本轮不作全书文学/市场/作者定稿/出版验收。`};input.issues=[];
const notes=['e4-tail-observations-31-34.md','e4-tail-observations-35-43.md','e4-tail-observations-44-48.md'].map(f=>fs.readFileSync(path.join(base,f),'utf8')).join('\n\n');
let report=`# E4 ${scope} 当前连续实读正式报告\n\n${input.comparison.limits}\n\n## 逐章目标、选择、后果和关系\n\n`;
for(const f of input.chapter_functions){report+=`### ${f.unit}\n\n`;for(const k of keys)report+=`- ${k}：${f[k].text}。原文：“${f[k].evidence[0].quote}”。\n`;report+='\n';}
report+='## 当前字节与实际读页\n\n'+coverage.filter(c=>c.unit>=from&&c.unit<=to).map(c=>`- ${c.unit}：${c.path}；SHA ${c.sha256}；${c.pages}页。`).join('\n')+'\n\n## 结构比较\n\n'+input.comparison.similar_structures.map(c=>c.judgment+'。'+c.differences).join('\n\n')+'\n\n## 实际因果/知情/款物审查现场记录\n\n'+notes+'\n\n## 真人语言别扭句\n\n没有\n\n## 真人语言硬问题\n\n没有\n\n四项模型自检：逐句顺口读的表达在当前场景可理解；对话对象能按本人所知接话；动作有前后物理落点；心理有当前行动与有限信息支撑。未发现必须改稿的新高置信语言/连续性问题。反复确认和日常慢节奏保留为可选风格观察，本轮不据此制造假修改。此处“没有”限本轮模型检视，不冒充真人语言验收。\n';
for(const[ref,h]of Object.entries(input.source_hashes))assert.equal(sha(fs.readFileSync(path.join(root,ref))),h);
fs.writeFileSync(path.join(root,input.report),report,{flag:'wx'});const out=path.join(root,`.writer/drafts/e4-review-${scope}.json`);fs.writeFileSync(out,JSON.stringify(input,null,2)+'\n',{flag:'wx'});save(`e4-review-${scope}-audit.json`,{coverage:coverage.filter(c=>c.unit>=from&&c.unit<=to),full_continuous_range:[31,48],full_pages:133,tail_pages:108,report:input.report,report_sha256:sha(Buffer.from(report)),kind:'Codex informed model self review, not human or blind',current_revision:state(root).revision});cli(`e4-review-${scope}`,['review'],{root,input:out,token:true,brief:true});
