import path from'node:path';import{base,j,write}from'./ef-lib.mjs';const r=j(path.join(base,'e-revision-private.json')),x=j(path.join(r.workspace,'.writer/drafts/er2-replay-60.json'));
const fix=v=>typeof v==='string'?v.replaceAll('原68','原72').replaceAll('58','62').replaceAll('亲交60收回2','亲交70收回8'):Array.isArray(v)?v.map(fix):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,a])=>[k,fix(a)])):v;
const characters={};for(const id of['周岸','柜门客户','柜门常用者'])characters[id]=fix(x.changes.characters[id]);characters['周岸']+=' 48已清点三张可用旧砂纸（一粗两细），此后不据模糊几片推定耗用/新采购；55工46库存包料16约62未收，56交70找8净62，60仅回述不二收。';
characters['许蓉女儿']=x.changes.characters['许蓉女儿']+' 54已听母告知并55回述新灯72，当前无柜价新知。';characters['老何']=x.changes.characters['老何']+' 仍未问/未受告新灯72价格，不因听唱新增知价。';
const lamp=fix(x.changes.ledger.P_AD_NEW_DESK_LAMP54),call=fix(x.changes.ledger.F_AD_CABINET_CALL60);call.evidence.push({unit:60,quote:'那六十二已经给过，自己不会再拿同一张纸让他找零。'});
write(path.join(base,'er2-delta-60.json'),{body_changed:true,summary:fix(x.summary),characters,ledger:{P_AD_NEW_DESK_LAMP54:lamp,F_AD_CABINET_CALL60:call},timeline_append:fix(x.changes.timeline_append)});
write(path.join(base,'er2-notes-60.md'),`写前r342context/template及官方旧六字段参考实际生成；当前写前18981字符11页全读，正文仅“那五十八已经给过”改“那六十二已经给过”，修后仍18981字符11页全部重新返回。AD_E_S04_NEW及AD_E_S06_NEW真实冻结对象各1页全文返回；AD_E_S05_NEW研究明确引用本进程58已完整返回的同对象同SHA1页。历史研究旧SHA/读页声明不改写、不冒新阅读。

summary/characters/timeline逐项实核：第48日周六两强线，许早自用新灯/半纸记找听时刻锣停后/起句弯线点，再加星期短线与唱起得早，原信封两空不补。何上午实际新发分享/位置后许才知异唱，口语听熟嘴不熟与母独存试唱文件不同；16点本班、18:30何读清问过接钥匙后才真听母现场半句，只认起头不评准，来人先服务。不把他猜原字/听两条私录或知灯72价格。午后第一条同一文件含静候与两次起，晚母请女持母手机先按录再问录了没，停后接留同一条，录完还母，两条本地不转。女晚听原声/现场后仍偏短、不跟唱，母接受才有限帮录，非学会/同口味；女此时亲口告昨晚遗杯母才知。

柜钱/知情重点：55工46+库存包料16=62只是约定未收；56真实70=50+20找8=5+3一元净62后纸旁收讫。60客户借手机来话后亲口回述62已经给过，周本章未再收、未进户，仅记录周六电话今未报再蹭。女人自己几日做饭/大碗仍侧与当早无松蹭，是回话非周新现场或长期保证；男原收讫纸仍台历自述。邻铺/原熟人只听周有限转述，无本章报价/金额告知，不新增收入/物料支出。客户旧character整条含交60收2和58，本次逐句改70收8与62；常用者净付62，周不重收62，并保留48三张一粗两细，F_CALL新增真实62回述引文。既有F_FEE/柜纸/现场thread当前62和已纠正客户付70收8继承不覆盖。母新灯ledger从原68改原72；女已知72保留，何/沈未被告价不得新知。原门50/抽屉18/14与8册、18未购20未动独立保持。

周与56原未名熟人13:30实约看棋，熟人恋棋周腿酸坐外墙，和棋后又看一阵再走，真付时间代价、各自买菜付钱、岔口分；周独河边坐，水壶物主自选提、未接修，少份热食实买自做菜咸些自己吃。熟人不强认廖/邻铺，无新订单，不拿余暇凑完成全书。普通动作与对话有误会、停顿、不同所好，未为受控数字大改文学风格。

ledger七项/evidence逐条核最终原句，半纸与旧信封、母衣反馈、小问题纸、书签均分明；原母衣靠桌仍认/旧灯未修/父凳杖等未被此章改写。摘要、characters、timeline、ledger、引文与downstream全核，旧参考中的68/58/交60找2不进入新journal/snapshot，current报告绑定新稿及当前source_hashes/bindings。长期衣感、灯耐用、父康复/全史、复航、所有外流旧图、课程总期等unknown均保持未证，不强结。全部record60后必须另从48至60严格串行每次≤2页完整尾读，正式review后才prepare/commit；本逐章页不充后登记门禁。
`);console.log('60 current incremental semantics saved');
