import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const X=path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/,'$1'));
const P=path.join(X,'scenario/东岸末班船-再扩展验证');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=r=>fs.readFileSync(path.join(P,r));
const put=(r,v)=>{const p=path.join(P,r);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,typeof v==='string'?v:JSON.stringify(v,null,2)+'\n',{encoding:'utf8',flag:'wx'});};
const s=JSON.parse(read('.writer/state.json'));
const cmd=process.argv[2];
if(cmd==='entry'){
  for(const [src,dst] of [['author-request.md','研究/X-B作者请求-原文.md'],['prompt-b-first.md','研究/X-B首次执行指令-原文.md'],['continuity-watchpoints.md','研究/X-B连续性核查提示-原文.md']])put(dst,fs.readFileSync(path.join(X,src),'utf8'));
  const old=JSON.parse(fs.readFileSync(path.join(X,'parent-before-b-state.json')));
  if(s.revision!==123||JSON.stringify(s)!==JSON.stringify(old))throw Error('entry mismatch');
  const ev={quote:'本次仅写28整章及29约前两段，29不合章/不登记；完成真实分段中途停点正常退出，之后根同ID恢复29/30。',local_source:'研究/X-B首次执行指令-原文.md',source_sha256:sha(read('研究/X-B首次执行指令-原文.md')),locator:'X/prompt-b-first.md 第1行；本聊天执行任务，无可用消息ID；真人扩大请求另存X-B作者请求-原文.md',recorded_by:'X-B新鲜原生Codex执行代理；细节为授权内实现选择，非作者逐项采纳'};
  const planning=structuredClone(s.governance.planning);
  planning.outline={status:'draft',refs:[],unresolved_ids:['建立28真实细纲后采用；29按28实际后果再plan；30仅近期计划，本首次不写','32茶/33穿洗反馈/35同行尚未兑现；两条optional_style未采纳未改']};
  put('.writer/b-inputs/workflow-outline-r123.json',{expected_revision:123,operation_id:'x-b-outline-28-first',author_evidence:ev,workflow:{stage:'outline',task:'X-B先规划28—30；仅本首次写28整章及29前两段后真实中断，根同ID恢复29/30；末章30后连读25—30复盘；不写31。',authorization:{allowed_actions:['discuss','plan'],draft_range:null,revise_range:null,stop_conditions:['先plan28再采用真实引用与有限28—30授权','本首次只28整章及29前两段，不合章/登记29，不写30/31；正常退出供根核首停','保护原24完整units/正文和全部原observation三字段；不改已消费旧来源，不提交推送导出封存或另派代理']},planning}});
  put('大纲/X-B近期执行纲-28-30.md','# X-B近期执行纲：留到下个星期\n\n沿扩大骨架-X与V11/A11，不覆盖V10—V13任何旧字节。本文件是代理在真实扩大授权内的近期实施选择，不代表作者逐项采纳。\n\n28拟第二十一日星期日，接27夜：母洗工装第二回并自己出门挑鞋；女按已交换的本周日班去工作，自己的裤仍备课未修；沈处理平常营业并落实明日五点进店的准备，父亲只听她实际告知；周留一段关铺步行时间，和许在候船室相遇只谈眼前。五个事件段靠不同欲望/具体代价展开，不把每线写成查验重复。末尾工装尚晾、自己的裤新问题留课堂。\n\n29拟第二十二日星期一，早晨兑现26已约5—15:30：先沈在家与父安排早餐/实际早行进店，再糕店开早门与老板实际去进货；首次只写这两个约3000—4500汉字事件段，停在白日仍在继续，原模板及来源全留。后段同ID恢复，不能将早段算30，不能预登全天结果。\n\n30仅近期方向：允许跳过未成章的星期二，第三课到下一个星期三19—20:30；女带自己裤和旧练布处理袋口/里布不同需求，母衣继续有限穿洗，不将母衣拆改。朋友时间与工作安排的选择继续留至未来茶约，不提前让周廖赴家喝茶或姑娘同行选书。真实细纲留待同ID恢复实际plan。30重点至少10000正文汉字、至少5段，之后当前25—30六章完整连读/结构比较/正式review。\n\n首停边界：本首次只28完整至少8000汉字并record，29仅两段，不assemble不record，正常退出。不创建30单元纲或正文、不写31。下次按根同ID指令核实际来源再接29后段及30，不重写28或29既成段。\n\n三链：T_X_COAT_DAILY first25/latest27 partial due33；T_X_TEA_AFTER_WORK first25/latest27 pending due32；T_X_BOOK_COMPANY first25/latest27 pending due35。首次/最近真实锚点已按ledger回查25:141—230/231—290、27:179—253及此前完整22—27；书约27:38—48同在稳定实读。约日语义优先双方手机指认/实际话语，due_unit不是日期。本次不把核查提示认作错误。\n');
  put('.writer/b-inputs/plan-28.json',{unit:28,title:'走远一点的路',goal:'让第二十一日各人的工作和自己的事占到真实时间，为下一周留下可执行的安排',change:'许完成第二次洗衣并实买自己合脚的鞋；沈落实明早五点进店准备；周实际留出关铺步行的一小时；女保留自己的裤及新课堂问题，不重修母袖',beats:['星期日晨母洗工装第二回，女按已经换过的班出门，两人各有今日要做的事','沈在糕店平常营业中处理分装客人与明日早来安排，老板实际问妥送货帮挪条件；沈晚间回家仅告父所需','许独自去外街挑布鞋、付清38元，新鞋走回家，旧鞋带回；午后工装未透干，另穿旧衣值守','周下午实际关铺一小时，买洗衣皂并走河边，遇问活者另约，后在候船室同许短谈眼前再回铺','晚母女处理自己的裤新问题与各自周三安排；沈与父亲定明早早餐取用，远书约与茶约保留未来，工装仍晾不宣布耐用'],cast:['许蓉','许蓉女儿','沈禾','沈成林','谭老板','周岸','老何'],setting_refs:['设定/人物与声音.md','大纲/扩大骨架-X.md','大纲/X-B近期执行纲-28-30.md'],research_refs:['研究/X-B作者请求-原文.md','研究/X-B首次执行指令-原文.md','研究/X-B连续性核查提示-原文.md'],recall_ids:['T_X_COAT_DAILY','T_X_TEA_AFTER_WORK','T_X_BOOK_COMPANY','P_W_COAT','P_W_PATCH_BLUE','P_W_NEEDLE_KIT','P_W_PRACTICE','P_W_BOOK'],arc_id:'A11',forbidden:['本章至少8000正文汉字，五实际事件段；不是填表或相同纠错套路','不改变旧24完整units/正文及全部原observation三字段；不动25—27当前稿','27第二十日周六→28第二十一日周日；本周日不是原约下下周日，茶是原25下周四14—16','不提前第三课/茶约/选书，不新增复航通知或旧旅客真正终点','父伤脚仍需垫，不因家务自行痊愈；人物只知道亲见/听述/消息所及','工装不再拆袖；第二回洗后未干不等于新使用结论；自己的裤只发现问题未修；原押金/门费/柜费/凳钱不重开']});
  put('研究/X-B入口实读与三链核对.md','# X-B入口核对\n\n入口parent-before-b-state逐字节同当前r123/27章，SHA878e45ef62f9658d76636f4c58025091a06843d80c429ff720b7842db46a128f。首产品b-entry-status，其后workflow/revision/identify/doctor/discussion均0，五个历史committed修订、八completed事务，无活跃修订/待恢复事务。工具generation3/content553de8f8a42c7bc7ff5f04f78703ed423d17dd69c21ff640ebd8c5c11c570ec2/runtime7fde4277424d98312d67d9db142301ee02d4805c6f5ae095b20b3d1544e0042f。\n\n当前22→27原生FastCtx逐章单调完整读，每次limit100、Partial精确续页。before07:24:06.303Z→after07:27:16.525Z，state/units/snapshot/六章正文SHA一致，窗口间无状态/正文写入。不是旧A报告替代。\n\n三链分别真实recall后重读25:141—230/231—290、27:179—253；27:38—48在稳定全文中已读。衣first25实际半班并洗/27洗干再穿具体久靠感partial；茶first25下周四14—16/27互告准备pending；书first25下下周日14/27两方问准但店营业未知pending。不把到期章号当日期，不从读图/约定判已兑现。22还书15:30与旧店临关门时刻各有自己的日子。\n\n需写到的旧线：24课堂补四边还借针已在完整实读；浅蓝袋24短行使用与归父/伤脚仍垫；23/24成凳搬收及27营业位已读。原箱押金80/门35/柜26+55=81/凳84均旧有限结清，不重开。25—27旧v1/v2和全部分段、A交接为历史，不合回当前。\n\n两条optional_style仍open，未经采纳未改；核查提示未升级为已确认旧章错误。下一步正式规划后取本章outline/context/template，另核预算遗漏。\n');
  console.log(JSON.stringify({ok:true,revision:s.revision,files:'new B sources, outline input, plan28 and entry notes'}));
}
if(cmd==='adopt28'){
  const base=JSON.parse(read('.writer/b-inputs/workflow-outline-r123.json'));
  base.expected_revision=s.revision;base.operation_id='x-b-adopt-28-trial';
  base.workflow.stage='trial';base.workflow.task='X-B有限28—30及30末复盘；本首次仅写28整章与29两段真实首停；根同ID恢复29/30，不提前31。';
  base.workflow.authorization.allowed_actions=['discuss','plan','draft'];base.workflow.authorization.draft_range={from:28,to:30};
  base.workflow.planning.outline={status:'adopted',refs:['大纲/单元/0028.json','大纲/X-B近期执行纲-28-30.md'],unresolved_ids:['29待按实际28后果plan；30待同ID恢复plan，首次不写','32/33/35未兑现；常规细节由代理负责，不伪称作者逐项采纳']};
  put('.writer/b-inputs/workflow-adopt28-r124.json',base);console.log(JSON.stringify({ok:true,revision:s.revision}));
}
if(cmd==='assemble28'){
  const names=fs.readdirSync(path.join(P,'分段/0028-B')).filter(n=>n.endsWith('-v2.md')).sort();
  if(names.length!==6)throw Error('six parts required');
  const parts=names.map(n=>({path:'分段/0028-B/'+n,sha256:sha(read('分段/0028-B/'+n))}));
  const t=JSON.parse(read('.writer/drafts/b-template-28-r125.json'));
  const checks=Object.entries(t.source_hashes).map(([r,h])=>({ref:r,same:sha(read(r))===h}));
  if(checks.some(v=>!v.same))throw Error('source changed before assembly');
  put('.writer/b-inputs/assemble-28-v1.json',{unit:28,expected_revision:s.revision,draft:t.draft,parts,separator:'\n\n'});
  put('研究/X-B28组装前来源与片段.json',{revision:s.revision,checks,parts,body_han:parts.map(v=>({path:v.path,han:(read(v.path).toString('utf8').replace(/^# .*\r?\n/,'').match(/\p{Script=Han}/gu)||[]).length})),context_chars:JSON.stringify(JSON.parse(read('.writer/drafts/b-context-28-r125.json'))).length});
  console.log(JSON.stringify({ok:true,revision:s.revision,parts}));
}
if(cmd==='assemble28-v2'){
  const a=JSON.parse(read('.writer/b-inputs/assemble-28-v1.json'));
  a.draft='正文/0028-走远一点的路-v2.md';
  a.parts[5]={path:'分段/0028-B/06-明早的那一点-v3.md',sha256:sha(read('分段/0028-B/06-明早的那一点-v3.md'))};
  put('.writer/b-inputs/assemble-28-v2.json',a);
  console.log(JSON.stringify({ok:true,parts:a.parts}));
}
if(cmd==='record28'){
  const t=JSON.parse(read('.writer/drafts/b-template-28-r125.json'));
  delete t.output;delete t._instructions;
  t.draft='正文/0028-走远一点的路-v2.md';
  const evidence=q=>({unit:28,quote:q});
  t.summary='第二十一日星期日，许第二次洗补工装/窗边晾，独往外街选深灰鞋付100找62净38、旧鞋带回/米实付，穿新鞋值守，18:30交何钥匙，晚工装肘仍凉留一夜；女照本周换过班至5点多，自己买饼吃付、回煮粥，发现自己裤兜里布也薄，记里外两问题/拍照，裤练布针盒仍袋未拆修。沈正常糕店分装收糕款，听老板回告明日送粉帮落干板有到车条件，另出买干货；再次确认明日5—15:30，晚亲告父、做一份粥冷藏父拟自热，闹钟4:10，未执行次日。姑娘消息此时才知沈早班并发裤照，沈看清但不会修；自有画册合归床头里侧白纸原页。周16点关铺买皂实付沿河步行，遇纱门问者未跟去/另问约明日18前，收照片未修未报价，16:40后候船室短遇许只谈鞋/步行，16:58回开门。茶/书远约未赴，父仍脚酸需垫。';
  t.changes={characters:{
    '许蓉':'第二十一日周日晨第二次洗补工装窗边晾；自己外街选灰鞋付100找62净38，旧鞋带回门边纸/米实付。下午别衣/新鞋在候船室值守，16:40后遇周只听关一小时走河边/买皂，18:30交何钥匙，回家喝女煮粥，亲看女裤里布薄/说自己旧垫法鼓，听自己的戏。工装晚仍凉换向留绳一夜未再穿；女记录星期日又洗。未知周茶约/纱门交谈及沈家全貌。',
    '许蓉女儿':'第二十一日按已换本周日班到5点多，穿另条裤上工，买一饼吃并付、回煮粥/洗盒。见母灰鞋/亲听38及店家小事，亲发现备课裤里布也薄，问母知旧垫法会鼓、记里外两位置拍照，裤旧练布扣针盒仍备课袋未拆修；旧纸记星期日又洗，母工装仍晾无新洗后穿感。28晚消息才知沈周一5—15:30，发裤照沈回看清但须问老师，没见店内/父早餐准备；远书约仍未赴。',
    '沈禾':'第二十一日糕店正常营业分装两家糕/收款，听老板回述明日送粉帮落店内干板有午前到车条件，知老板另早出买干货、再次确认明日5—15:30/店吃热糕未执行。晚亲告父早班与分糕小事，煮一人份粥有柄碗冷藏/咸菜桌角，父拟隔水热；父站久脚酸仍垫。画册合归床头里侧白纸原页，闹钟设4:10未响；28晚收到姑娘裤照及未拆说明，回看清/不会修/问老师，告自己早班，未知其母当班/鞋店全事。',
    '沈成林':'第二十一日晚亲听沈明日5点进店/3:30下班不是旧两包早糕；亲指有柄碗和低架布，试开咸菜盖，站久脚酸回椅垫，未痊愈。见女备一份粥冷藏，计划明早自隔水热尚未做；听分糕客小事/说自己旧吃饼习惯。浅蓝袋空挂椅侧/新纸盒用，未获姑娘裤照/店内全部送货通话。',
    '谭老板':'第二十一日正常营业收分糕款由沈办理，亲电话问送粉者同意明日午前若到车帮落干板后走，回告沈；另早出买干货不混同车，记少买。再次给沈看本上明日5—15:30，答店留热糕，两人未执行明日早班/进货/粉送；不知道沈家早餐及姑娘裤照。',
    '周岸':'第二十一日16点真实关铺贴五点回纸，只带口袋手机钱钥匙，买一块皂付清/沿河步行；钓鱼男人问纱门未跟去，留号约明日18前带照再问、未报价未修；后收照片回好。16:40后遇许只听买鞋多走/见灰鞋，不知价钱或衣课堂；16:58返铺开门，听戴草帽者曾来看门身份意图未知，纸收入柜，皂入包；茶约和26下周六8:30门约均保持未来。',
    '老何':'第二十一日16:40后在候船室端擦窗布盆出，见周点头，无交谈全貌；18:30亲接许值班钥匙。未知许衣用感/书约/周茶约。'
  },timeline_append:[
    '第二十一日周日晨：许实际第二洗工装挂窗边/女另裤上本周已换班，衣夜仍晾；许独往外街灰鞋100找62净38、米另付，旧鞋带回。',
    '第二十一日糕店：沈分两家糕实装收款；老板实际电话问送粉帮落板条件，回述午前到车才办，干货另早出；明日沈5—15:30再次确认仍待。',
    '第二十一日16—16:58周：关铺买皂实付/河边步行，拒立即随钓鱼人看纱门，留号收照另约明日18前问；16:40后遇许只谈眼前鞋和走路，回铺开门。',
    '第二十一日18:30后许家：钥匙交何/回家粥，女实际裤里布薄并记两处、拍照归袋未修；母继续听戏，工装仍凉留绳一夜。',
    '第二十一日晚沈家：沈告父明日早班/做一份粥有柄碗冷藏，父拟自热/脚酸仍垫；姑娘此时才消息知沈5—15:30并发裤照，沈仅看清不会修；书合归床头，设4:10未到次日。'
  ],ledger:{
    'P_W_COAT':{previous_holder:'许蓉',custody:{holder:'许蓉',location:'许家窗边晾衣绳，28晚换向留一夜',condition:'28晨第二次洗过/四边未再拆；右肘晚仍凉，未收干未再穿'},reader_known:'28晨从27浴室外挂取下实际第二洗挂窗边，晚右肘仍凉换向留一夜；没有第二洗干后新穿用结论。',character_known:{'许蓉':'28亲二洗/晾/晚摸仍凉换向留一夜，待干认；旧穿感有效未改袖。','许蓉女儿':'见母28晨洗/晚换向留绳，旧纸添星期日又洗，未见第二洗后穿感，不拆母袖。'},evidence:[evidence('提到窗边能接风的那根绳。'),evidence('母亲过来收窗边的衣架，工装右肘摸着仍比左边凉。')]},
    'T_X_COAT_DAILY':{status:'partial',reader_known:'28第二洗真实发生，衣夜仍凉留绳，女如实记星期日又洗；25/27两次穿用反馈保留，未宣第二洗干后新反馈或耐用，33/V12仍待。',character_known:{'许蓉':'25一次穿洗/27再穿具体久靠感已亲述；28第二洗后夜仍凉，未再穿，新反馈未有。','许蓉女儿':'听过25/26/27有限反馈，28亲见洗晾并记星期日又洗，不将第二洗记新穿感；自己裤里外问题待课。'},evidence:[evidence('她便在那张旧用感纸边添上“星期日又洗”，没写洗后穿着怎样')]},
    'T_W_EVENING_CLASS':{status:'partial',reader_known:'两次真实课/24补母袖还针历史保留；28女实际发现自己的裤兜里布也薄，记录里外两问题/拍照归袋未拆修，第三课未到。',character_known:{'许蓉女儿':'亲上两次课；28仅看清自己裤外缝/里布不同、记画拍照，听母旧垫法鼓，待周三老师，未修未第三课。','许蓉':'24亲试/25及27有限用感仍真；28亲看女裤薄里布、说自己旧垫法鼓，回听戏，未代修或亲见课堂。','沈禾':'21见有限袋小修/25听第二课补母袖；28晚仅看女裤近照听未拆，回看清但不会教法，未见课堂或摸实物。'},evidence:[evidence('才发现里布也薄，开口并非全在那道缝上。'),evidence('裤子叠回袋中，白纸仍放到能一眼看见的那端')]},
    'P_W_PICTURE_BOOK':{previous_holder:'沈禾',custody:{holder:'沈禾',location:'沈禾房内床头里侧，28夜合起',condition:'自有画册/白纸原页，旧干水印保持；明早拟不带店里'},reader_known:'28沈合起画册送床头里侧，白纸留昨夜页/旧印干；没有再借出或新购。',character_known:{'沈禾':'本人合书归床头里侧，白纸原页，拟明早不带；未新增购书。'},evidence:[evidence('她将书合好，送到床头里侧，给手机和小杯腾地方。')]},
    'F_X_GREY_SHOES':{type:'fact',statement:'第二十一日许蓉自选深灰鞋实付38元并穿回，旧鞋带回',status:'resolved',cast:['许蓉','许蓉女儿','周岸'],tags:['日常消费','不同款项'],reader_known:'28付100找62净38，新鞋穿回及值守，旧鞋门边纸上未刷；不证长期合脚。',character_known:{'许蓉':'亲选/实付/走回及穿班，鞋纸内格、旧鞋留门边待刷。','许蓉女儿':'晚亲见新鞋/听母38与有限店家小事，未亲见付钱。','周岸':'候船室仅见灰鞋听上午多走/买鞋，不知价钱与选鞋全程。'},evidence:[evidence('许蓉付一张一百，女人将五十、十和两张一元摆到柜面'),evidence('三十八。你别又把它当块布，问是不是折得厚。')]},
    'T_X_MONDAY_EARLY':{type:'thread',statement:'26约周一沈禾5—15:30，28为次日早班和父早餐作具体准备',status:'pending',cast:['沈禾','沈成林','谭老板','许蓉女儿'],tags:['早班','有限约定','X'],due_unit:29,reader_known:'28再次确认5—15:30、老板电话问送粉帮落板条件/另早出干货，沈煮父一份粥冷藏、设4:10；28夜消息才告姑娘早班。29真实进店/交班/送粉/父热粥仍未来。',character_known:{'沈禾':'知老板本上明日5—15:30及送粉条件，准备父粥冷藏/自己店吃、设4:10；未执行。','谭老板':'亲重认明日5—15:30/答留早糕，亲打送货电话后回述条件，未走未送。','沈成林':'28晚听沈明日5点进店/3:30下班非旧两包，知一碗粥冷藏拟自热/布低架，未热。','许蓉女儿':'直到28晚沈消息才知明日5—15:30，不亲见店/父早餐或明日过程。'},evidence:[evidence('沈禾回早到早走，五点进店，三点半走'),evidence('她将父亲那份装入有柄深碗，盖好收进冷藏')]},
    'T_X_SCREEN_DOOR_ASK':{type:'thread',statement:'28河边钓鱼男人向周岸问自家纱门扣不住，留照约明日18前再问',status:'pending',cast:['周岸'],tags:['普通待问','纱门'],due_unit:29,reader_known:'周没随即上门，留号后收到照片，只约明日18前下班问/若上门再约，不是26另一女人下周六8:30房门约；未报价未修。',character_known:{'周岸':'亲听纱门诉求/见照片，未到场，答明日18前店内问，有需上门再约。'},evidence:[evidence('今天这会儿不去了。我出来走这一段。'),evidence('河边那人晚一点发来纱门照片，还带一句明天下午下班再问。')]}
  }};
  const report='审查/X-B28最终合章自检-v2.md';
  t.draft_review={reviewer:'X-B原生Codex同会话知情自检',report,draft_sha256:sha(read(t.draft)),report_sha256:sha(read(report))};
  const body=read(t.draft).toString('utf8');
  for(const [id,v] of Object.entries(t.changes.ledger))for(const e of v.evidence||[])if(!body.includes(e.quote))throw Error('quote missing '+id+':'+e.quote);
  for(const [r,h] of Object.entries(t.source_hashes))if(sha(read(r))!==h)throw Error('source changed '+r);
  put('.writer/b-inputs/record-28-final-v2.json',t);
  console.log(JSON.stringify({ok:true,revision:s.revision,draft_review:t.draft_review,characters:Object.keys(t.changes.characters),ledger:Object.keys(t.changes.ledger)}));
}
if(cmd==='plan29'){
  put('.writer/b-inputs/plan-29.json',{unit:29,title:'五点进门以后',goal:'兑现已约周一早班的实际劳动与离店交接，让早来的成本和早走的结果分别发生',change:'沈按时早到并在店吃早餐、老板真实外出；后续送粉、下午交接、父亲早餐与周的纱门待问只能按实际续段处理，本首次绝不预登',beats:['第二十二日周一4:10闹钟响，沈在家轻声起身/父只作短交流仍需顾脚，父早餐原碗留冷藏，沈按时实际走到糕店门前；首次先写此段','沈5点进店与老板分工摆早柜/两人吃热糕、第一批客买卖，老板实际外出买干货，沈继续早间营业；首次写此段后停在上午未过完','同ID续程：照28已问条件应对午前送粉，搬落位置、实际帮忙与付款/签单按新正文，不假装准备已执行','父亲早餐若另场实际写就按其视点；沈只可听到真实回告所及，父仍伤脚；许工装干态/鞋刷等按真实日间进展，不替33长期反馈结案','周按28纱门照片另问约与人对话，明确与26另一房门下周六8:30分开，结果不预设万能修好','沈15:30真实交接后才走，回家见/听父有限早餐结果，下一周三第三课仍未发生；具体后段展开留同ID恢复'],cast:['沈禾','沈成林','谭老板','许蓉女儿','周岸','许蓉'],setting_refs:['设定/人物与声音.md','大纲/扩大骨架-X.md','大纲/X-B近期执行纲-28-30.md'],research_refs:['研究/X-B作者请求-原文.md','研究/X-B首次执行指令-原文.md','研究/X-B连续性核查提示-原文.md'],recall_ids:['T_X_MONDAY_EARLY','T_X_SCREEN_DOOR_ASK','T_X_COAT_DAILY','T_X_TEA_AFTER_WORK','T_X_BOOK_COMPANY','P_W_COAT','P_W_CURTAIN_BAG','T_W_EVENING_CLASS','P_W_PICTURE_BOOK'],arc_id:'A11',forbidden:['本首次只两段3000—4500正文汉字，保留同章未完，不assemble不record29，不建30/31单元纲或正文','未写全天交接/送粉/父热粥不得提前算完成；最终完整29另至少8000正文汉字/4—6场，按实际调整而非凑填','第28第二十一日周日→29第二十二日周一；不把原下下周日书约缩到刚过周日，due章不是日期','5点进店与15:30走是26实际约定，原19换班/21还书时刻不同，不改旧值','父亲伤脚仍在，白纸原页/母工装仍晾待干/裤未拆的旧持有延续','不提前第三课/茶约/同行选书/复航/父辈全史，不改旧24正文/units或原观察三字段']});
  console.log(JSON.stringify({ok:true,revision:s.revision}));
}
if(cmd==='adopt29'){
  const a=JSON.parse(read('.writer/b-inputs/workflow-adopt28-r124.json'));
  a.expected_revision=s.revision;a.operation_id='x-b-adopt-29-first-stop';
  a.workflow.task='X-B28已登记，29已plan；本首次仅写29前两段3000—4500汉字真实首停，29不合章不登记。根同ID恢复29后段/30及30末25—30复盘；不写31。';
  a.workflow.planning.outline={status:'adopted',refs:['大纲/单元/0028.json','大纲/单元/0029.json','大纲/X-B近期执行纲-28-30.md'],unresolved_ids:['29仅前两段后真实停，后段未写不入事实；30待同ID恢复实际plan','32/33/35未兑现；常规实施代理负责，不冒称作者逐项采纳']};
  put('.writer/b-inputs/workflow-adopt29-r126.json',a);console.log(JSON.stringify({ok:true,revision:s.revision}));
}
