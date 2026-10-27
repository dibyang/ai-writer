import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
const A=path.dirname(fileURLToPath(import.meta.url)),P=JSON.parse(fs.readFileSync(path.join(A,'project.json'))).project,sha=b=>crypto.createHash('sha256').update(b).digest('hex'),r=ref=>fs.readFileSync(path.join(P,ref));
const tb=r('.writer/drafts/ae-a-record63-original.json'),input=JSON.parse(tb),s=JSON.parse(r('.writer/state.json'));
assert.equal(sha(tb),'bdd6cd6b6805ed30d7b408c8a5375d49b905628afee9e975f00da90cd399d471');assert.equal(s.revision,357);assert.equal(s.units.at(-1).unit,62);for(const[ref,h]of Object.entries(input.source_hashes))assert.equal(sha(r(ref)),h,ref);
const draft='正文/0063-轮到自己落一子-ae-a-v2.md',bytes=r(draft),body=bytes.toString('utf8');assert.equal(sha(bytes),'dbe17e536db263e383a79ee7b072dc050f3a2f8e861c0957097109d5d28b2b52');const ev=q=>{assert(body.includes(q),q);return[{unit:63,quote:q}];};
delete input._instructions;delete input.output;input.draft=draft;
input.summary='第51日周二。周主动约56/60未名熟人10点街口，真坐一盘，落子吃亏想悔被拒、有急话和难堪，仍下到认输收局。二人午饭各付；柜女人再电话问免侧身，原补仍轻只是本人回述，周说新结构需再现场另报，女暂不约，无新单钱，旧62不重收。午后周等理发付10找2净8，主动约周四10点同熟人再一盘/对方11点多走，临有活前晚告知，未来棋未下；晚真洗衣。女主动愿借14，沈仍想看并改借到周五晚19:30女家楼下还；双方今日各吃后同地19:30前见，女取原自写夹纸留房桌浅抽最上字朝上，原字不添，实际交14与普通干袋给沈。楼前同读：沈先看虫女盼枝，有限不甘仍互讲，沈新知女周日另买纸画白杯两张/口述缺陷，未见画/无图/不知母评。沈带14回房干台/袋折底，8与大白纸仍床边；父仅口述知借到/周五19:30/纸留女家，未看持14。父自读另一栏谈锅，不重逼昨夜全文；沈为阅读关门留父电视，后开门才听问水。女空手归家、原夹纸仍抽内，两画不新画/不添字；许只听已交及期限/取纸，手机两录不转，沈知情不增。';
input.changes={characters:{
'周岸':s.snapshot.characters['周岸']+' 第51日周二10点街口真下棋一盘，对56/60未名熟人认输；新柜开法电话问但未约未报无新单/钱/亲验。午后理发交10找2净8，约周四10点同地一盘/友11点多走，临有活前晚说，尚未下；晚洗衣，未靠代修挽面子。',
'许蓉女儿':s.snapshot.characters['许蓉女儿']+' 第51日周二主动愿借14，原夹纸取留自己房桌浅抽最上字朝上不添字；19:30前楼下真交14及普通干袋沈，约周五19:30同地还。告沈周日另纸画白杯两张及口述缺陷，无图/未给看/未讲母评价；仍想友注意自己喜欢的枝，夜承认有点想听花但不追催。晚两画原收不新画、纸仍抽内，母只门边远看未细看首画。',
'沈禾':s.snapshot.characters['沈禾']+' 第51日周二今日接单先问清，早下工，知女今天愿借14，19:30前女家楼下真接书，约周五19:30同地还/临变先电话，夜记提醒。原女夹纸未随，只听在女桌浅抽，未见墨字；自己8与大白纸床边，14普通袋带回房干台，父未持看。先记虫与女盼枝不同，未为了借书夸全页。新文字/当面知女周日另纸画白杯两张及口述缺陷，无图/原画/母评，录音知识未增。',
'沈成林':s.snapshot.characters['沈成林']+' 第51日周二自读另一报栏谈锅，女出门/归后仅口述知14实借及周五19:30女楼下还，纸留女家，自己未持/看14。女读书需安静，自己电视降一格难听清，许女关门，有事可电话，未重逼昨日全文；脚伤历史不变。',
'许蓉':s.snapshot.characters['许蓉']+' 第51日周二归家听女说今天愿借14/周五19:30楼下还、原夹纸取留，女归后口述确认已交；未在交接、未读小纸字/新页，门边远看画认不清不进房拿。仍自己手机听，不给沈文件或内容。'
},timeline_append:[
'第51日周二晨周约原未名茶友10点街口，等上一局后真下一盘，想悔被拒/有急话，最终认输收棋；午饭各付。',
'同日午柜女人真实再问免侧身，口述原补处仍轻，周未亲验，新结构须另现场报价，女暂不约，无新订单新收。午后周理发实交10找2净8，真约周四10点一盘/友11点多走，晚洗衣。',
'同日晚女主动愿借14，沈仍要看，约周五晚19:30女家楼下还，临变先电话。今日各吃后19:30前同地女真交14/普通干袋；夹纸原字不添留女房桌浅抽。',
'同日晚楼前同读有虫/枝偏好差异，沈新知女另纸画白杯两张及口述缺陷无原画；沈带14回房干台，8/大白纸仍床边，父未看持14仅知口述期限。女空手归/夹纸仍抽内/两画旧收；母手机两录不外流。'
],ledger:{
F_AE_CHESS63:{type:'fact',statement:'63周二周岸10点街口真与56/60同一未名熟人下一盘并认输收局；熟人不让反复悔，周仍难堪，午饭各自付款',status:'resolved',cast:['周岸'],reader_known:'熟人与廖/邻铺不同，无姓名身世接口，不是围观预演或维修挽尊。',evidence:ev('算自己输了')},
T_AE_CHESS_NEXT63:{type:'thread',statement:'63午后双方真约周四10点街口一盘，熟人11点多要走；周临有活前晚告知，未来棋未下',status:'pending',cast:['周岸'],reader_known:'仅本次约定，未自动每周/未未来赢棋。',evidence:ev('周四十点能，仍只一盘')},
F_AE_CABINET_QUERY63:{type:'fact',statement:'63柜女人新电话问免侧身，原补处仍轻仅本人回述；周说明新结构须另现场报价，女暂不约，无新单/报价/钱/亲验；原62不重收',status:'resolved',cast:['周岸'],reader_known:'原柜有限交付保留，女可再觉得不够顺，不以保修免费改结构。',character_known:{'周岸':'亲接本人新问及口述原处仍轻，未新现场/新图；回铺只记另问未约未报。'},evidence:ev('今日先不约')},
F_AE_HAIRCUT63:{type:'fact',statement:'63周输棋后午后真等理发，交10找2净付8，与原柜62无重收关系',status:'resolved',cast:['周岸'],evidence:ev('他从钱夹取出十元，等对方找两元')},
P_DR_FLOWER_BOOK:{custody:{holder:'沈禾',location:'63周二夜沈房干台，普通袋折在底下',condition:'原属女14册本夜19:30前女楼下实借，周五晚19:30同地还；原自写夹纸已由女取留自己房桌浅抽最上字朝上，细枝/左边空着旧字不添，不随借；沈不折角不挪原8册大白纸'},reader_known:'61本次拒借成立；63女今日另自愿真交，沈看虫与女盼枝不同，仍能各读。期限为周五晚19:30，未到期未还/无默认续。',character_known:{'许蓉女儿':'本人取纸留抽/真交书与普通干袋沈，双方约周五19:30自楼下还，今日空手归，未承诺续。','沈禾':'亲接14/带回/自读，听纸在女浅抽并见书无纸，未读夹纸墨字，约周五19:30还并设提醒；8原白纸仍自己册。','许蓉':'亲听女说取纸/愿借/周五19:30，女归后口述已交，未在现场/未看书纸。','沈成林':'亲听女借到14及周五19:30期限、纸留女家及画虫，未持/看14页或纸。'},evidence:[...ev('女孩将书从袋里取出，封面朝上，交到她两手间。'),...ev('周五晚上七点半在你家楼下还'),...ev('十四册放回干台，普通袋在底下')]},
T_AE_LOAN_RETURN63:{type:'thread',statement:'63周二实借女14册给沈，到第54日周五晚19:30在女家楼下归还；临变沈先电话，不自动续借',status:'pending',cast:['许蓉女儿','沈禾'],reader_known:'周五实际还书尚未发生，64—66骨架不可记成事实。',evidence:ev('周五晚上七点半在你家楼下还')},
P_AE_DRAW61:{custody:{holder:'许蓉女儿',location:'63周二夜女房桌内原收处，两画仍隔旧包装纸',condition:'63自看原两画，第一张一侧觉较松；不新画/不擦改不添字，原8空白仍未用。母门边远望认不清未近拿，沈无图/未看原画'},reader_known:'63女向沈新口述周日另买普通纸画白杯两张及缺陷，不给图/原画，不把母评价借友改判。',character_known:{'沈禾':'63楼下本人首次告周日另买普通纸画白杯两张及口沿/胀底/缺口口述，未见画/照片，不知母具体评语。','许蓉女儿':'告沈有限画事，仍不出示；夜自看第一侧较松不改，仍想被看见。','许蓉':'63门边见两张摊着但远处认不清未进拿/细看第一；不等重审61首画。'},evidence:ev('另买的普通白纸，铅笔，画自己家里那只白杯，画了两张')}
}};
const report='审查/AE-A-63-完整实读与纲文回对.md';input.draft_review={reviewer:'AE A同一原生Codex知情创作自检',report,draft_sha256:sha(bytes),report_sha256:sha(r(report))};
fs.writeFileSync(path.join(A,'a-record63-input.json'),JSON.stringify(input,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({ok:true,revision:357,unit:63,draft,original_template_preserved:sha(tb),sources_matched:Object.keys(input.source_hashes).length}));
