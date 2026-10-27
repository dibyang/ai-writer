import {put,read,sha,state} from './a-prepare.mjs';
const f1='分段/0025-A/01-晨衣-v1.md',f5='分段/0025-A/05-夜洗-v1.md';
let one=read(f1),five=read(f5);
const edits=[{old:'灯罩侧着，正照在枕边。开关摸过没有热，她没再按亮，窗外已经够看。',new:'灯罩朝着枕边。她将灯关好，窗外已经够看。',file:f1,kind:'局部指代澄清：朝向和发光分开，不靠摸开关温度认灯。'},{old:'放到冰箱，免得女儿回来以为可以直接下锅。',new:'放到冰箱，免得搁到晚上，切口干出一道白边。',file:f5,kind:'动作目的：冷藏防切口干，不会改变女儿是否直接下锅。'},{old:'她将空饭盒洗过、擦干，放回柜内留的那道位置，另一只手提着豆腐，便没立刻拿画册。',new:'她先把豆腐搁在灶边，将空饭盒洗过、擦干，放回柜内留的那道位置。水池边落了一点水，她又擦过，没立刻拿画册。',file:f5,kind:'双手占用：先放豆腐，再洗擦饭盒，给读者可实现的动作。'}];
for(const e of edits){let t=e.file===f1?one:five;if(t.split(e.old).length!==2)throw Error('edit target count');t=t.replace(e.old,e.new);if(e.file===f1)one=t;else five=t;}
put('审查/X-A-25初稿实读与纠正-v1.md','# 25初稿完整实读与纠正\n\n原稿正文/0025-衣袖落下来-v1.md；SHA '+sha(read('正文/0025-衣袖落下来-v1.md'))+'。FastCtx完整读1—100/101—200/201—290至Complete，limit100。五片段8621正文汉字。知情模型自检。\n\n两处确认的落地/因果问题及一处澄清，授权内另存新片段与新合章，不覆盖原稿：\n\n'+edits.map(e=>'- '+e.kind+'\n  原：'+e.old+'\n  新：'+e.new).join('\n\n')+'\n\n动作及因果两项在具体落地、动宾拆分/信息顺序与朗读改口时都有可复现的不顺；灯处作为澄清，不提升成审美硬伤。余下舒展长句、熟人玩笑和有效否定保留。修后稿必须再实读并另建最终报告，不能使用本报告认证。\n');
put('分段/0025-A/01-晨衣-v2.md',one);put('分段/0025-A/05-夜洗-v2.md',five);
const parts=['01-晨衣-v2.md','02-来货-v1.md','03-茶约-v1.md','04-看书-v1.md','05-夜洗-v2.md'].map(n=>({path:'分段/0025-A/'+n,sha256:sha(read('分段/0025-A/'+n))}));
put('.writer/a-inputs/assemble-25-v2.json',{unit:25,expected_revision:state().revision,draft:'正文/0025-衣袖落下来-v2.md',parts,separator:'\n\n'});
console.log(JSON.stringify({ok:true,edits,parts},null,2));
