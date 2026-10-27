import path from'node:path';import{base,j,write}from'./ef-lib.mjs';
const r=j(path.join(base,'e-revision-private.json')),x=j(path.join(r.workspace,'.writer/drafts/er1-replay-56.json'));
const replacements=[['料12','料16'],['58','62'],['68','72'],['50+10','50+20'],['交50一张+10一张共60','交50一张+20一张共70'],['收60','收70'],['交60','交70'],['付60','付70'],['找2','找8'],['回2','回8'],['五十八','六十二'],['料十二','料十六'],['报十二','报十六'],['买了十二元','买了十六元'],['五十元一张，十元一张','五十元一张，二十元一张'],['从钱夹找出两元，交到他手里。','从钱夹找出八元，一张五元和三张一元，交到他手里。']];
const fix=v=>typeof v==='string'?replacements.reduce((t,[a,b])=>t.replaceAll(a,b),v):Array.isArray(v)?v.map(fix):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,a])=>[k,fix(a)])):v;
const characters={};for(const id of ['周岸','柜门客户','柜门常用者','老何'])characters[id]=fix(x.changes.characters[id]);
characters['周岸']+=' 48已清点三张可用旧砂纸（一粗两细），本章不改库存数量、不添购料。';
characters['许蓉女儿']=x.changes.characters['许蓉女儿']+' 已从54母告知、55亲回述新灯72，本章无新增柜价知情。';
const ledger={};for(const id of ['T_D_CABINET_PHOTOS','T_AD_LIGHTING_CHOICE','P_AD_NEW_DESK_LAMP54','F_AD_CABINET_FEE55','P_AD_CABINET_NOTE55'])ledger[id]=fix(x.changes.ledger[id]);
write(path.join(base,'er1-delta-56.json'),{body_changed:true,summary:fix(x.summary),characters,ledger,timeline_append:fix(x.changes.timeline_append)});
write(path.join(base,'er1-notes-56.md'),`写前r336先取context、record-template、官方旧六字段参考；生效来源AD_E_S01_NEW冻结对象7ea36d6d7d85a1fe958c45bae0c036b784f1b7e497a13f4817efc02c2841d830完整1页实际返回，非旧活动计划。读取器原请求1—2，p1成功，p2超过实际页数被拒；保留失败，不计第二页、不充有效负例。正文写前18785字符11页完整读毕，必要数值/面额及找零句改后18797字符11页逐页完整复读。宽泛“十二”替换只dry_run，发现会碰六十二后改用明确料/报/支出词组，没有错误写入。

纲文、语言及连续性：周三依昨日9—10约回现场，两位真在；先检查胶稳，再取真实浅盒两原合页螺丝、男人托门定位复装原门，非直接从规划继承。空手开合仅这一处，女人实际从原位取浅盘/大碗两回并落桌，先坐写才显椅背/横档限制，获准小转桌角并本人选择日用盘靠外/小碟侧放。仍侧身、过路须招呼的余限保留；原门原漆原件全复用无外运，垫布/浅盒留户。不同意见、停手、普通笑话未大改文学风格。

钱在本章验用后才真实交付：70是50+20，找8是一张5加三张1，净62=工46+库存包料16；原55未收行保留、在旁补今日已收62，非另作新报价。回铺实数50/20仍在、8已出，实收62找8入收入，不把库存16当今日新采购支出。55全文始终未收，48库存不先收钱。summary/characters/timeline/ledger的所有原58/60交付/找2和旧料12逐项同步，新journal何“未知价格”的目标也改为72而不让何实知；灯仍母自用，女仍已知72。周的整条旧character参考不能覆盖48三张一粗两细，本次明确保留；本章未记砂纸耗用数。

其他六字段核对：沈与谭只试样盒旁/散块前，仍有漏听另装需补足，半时不证增销；腕紧不提重盆。沈父原8册仅临借再还床边，原袋轻提干桌到扶手、凳杖仍在，折报意见不同不强和解；女原14册留家。女孩真交自己工作、回家吃饭歇过、原布/针盒/两纸分装、小问题纸只添先看；48平小段/偏长针与52另侧硬尾均在，原反馈纸不改。母18:30真交何才获知其旧消息已读，何未问价/未见家中试用；母自己买一顿吃、新灯听戏，两空仍空，不跟课。老师仅问候，未触看原布/48夜行；同学经验不等老师判断，56止七点前，第六课57同夜19—20:40尚待实际发生。ledger每条真实evidence逐项与修后正文核存在，非仅自动quote匹配。

下游仍未知长期性能、以后反馈、第六课收尾结果、58/59使用与60回述，本章不能宣称无影响。完整授权48—60未完成，本程56断点后不触57—60正文/写前模板，不prepare/commit。原门总50、抽屉18、14/8册及未购18/未动20、O_BOX_PAINT、CR33与AC版本和旧意见application/commit保持；当前新依赖报告绑定真实最终正文和来源SHA。旧整条ledger/downstream有原值时必须逐章核继承，57—60继续此规则。
`);console.log('56 current semantic delta and notes saved');
