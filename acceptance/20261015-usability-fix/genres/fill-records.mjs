import fs from 'node:fs';
const base='acceptance/20261015-usability-fix';
const phase=process.argv[2];
if(!['baseline','final'].includes(phase)) throw new Error('baseline|final');
const configs=[
 {title:'借一把椅子',kind:'screenplay',template:phase==='baseline'?'007-template-screenplay-baseline':'023-template-screenplay-final',context:phase==='baseline'?'005-context-screenplay-baseline':'021-context-screenplay-final',fixture:'screenplay.md',summary:phase==='baseline'?'原稿保真登记：许安借两把椅子，方姐要求借用单，明早十点归还；保留原稿心理总结与提示，待授权审修。':'修订稿：保留借两把、二十三把入库和二十五把总量，九点登记、十点归还及借用单交接；用原有别堵门收束，移除不可表演总结。',snapshot:{characters:{'许安':'社区活动室；持签到册；已在借用单写明早十点；两把椅子获准留室内，供明早九点老梁登记使用','方姐':'社区活动室；持库房钥匙并收好借用单；把一把椅子推到墙边，叮嘱别堵门','老梁':'未出场；仅由许安说明明早九点来登记，未叙述其实际行动或所知'},threads:[],timeline:['夜：二十五把椅子中二十三把已回库房，两把留室内借用，方姐只挪其中一把','明早九点是许安所说明的登记安排，十点是单上归还时间；均未写作已经发生']}},
 {title:'字放回格子里',kind:'history',template:phase==='baseline'?'008-template-history-baseline':'024-template-history-final',context:phase==='baseline'?'006-context-history-baseline':'022-context-history-final',fixture:'history.md',summary:phase==='baseline'?'原稿保真登记：转述沈括常用字备印、按韵标记木格保管与少量印制限制；保留原稿重复说明和泛化赞叹，待审修。':'修订稿：保留两处史料引文、之也备印数量、按韵标记木格保管，以及库存、耗时和人物心理的全部边界；压缩重复解释，删去文明梦想泛赞，以少量印制限定收束。',snapshot:{characters:{'沈括':'仅作为梦溪笔谈卷十八活版条的记述者；正文不补其现场动作或心理','毕昇':'仅在否定心理独白的限定中出现；不声称知道其思考过程'},threads:[],timeline:['本章依同一活版条解释备印、分类和再次取用；不新增历史年月或现场时序','史料记载若止印三、二本未为简易；不是现代计时实验，未量化库存和寻找耗时']}}
];
for(const c of configs){
 const p=`${base}/works/${c.title}`;
 const load=label=>JSON.parse(JSON.parse(fs.readFileSync(`${base}/genres/cli/${label}.json`,'utf8')).stdout);
 const t=load(c.template),context=load(c.context);
 if(JSON.stringify(t.source_hashes)!==JSON.stringify(context.source_hashes)||t.expected_revision!==context.revision)throw new Error('template/context mismatch');
 fs.writeFileSync(`${p}/.writer/record-template-${phase}.json`,JSON.stringify(t,null,2)+'\n',{flag:'wx'});
 if(phase==='baseline')fs.copyFileSync(`${base}/fixtures/${c.fixture}`,`${p}/${t.draft}`,fs.constants.COPYFILE_EXCL);
 delete t._instructions;
 t.summary=c.summary;t.snapshot=c.snapshot;
 fs.writeFileSync(`${p}/.writer/record-input-${phase}.json`,JSON.stringify(t,null,2)+'\n',{flag:'wx'});
}
console.log(`Prepared ${phase} inputs from actual CLI templates without changing source hashes`);
