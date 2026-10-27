import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {fileURLToPath} from 'node:url';
const X=path.dirname(fileURLToPath(import.meta.url)),P=path.join(X,'scenario/东岸末班船-再扩展验证');
const read=r=>fs.readFileSync(path.join(P,r)),j=r=>JSON.parse(read(r)),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const put=(r,v)=>{const p=path.join(P,r);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,typeof v==='string'?v:JSON.stringify(v,null,2)+'\n',{encoding:'utf8',flag:'wx'});};
const cmd=process.argv[2],s=j('.writer/state.json');
if(cmd==='pause-input'){
 const a=j('.writer/brc-inputs/workflow-adopt30.json'),w=structuredClone(a.workflow);
 w.stage='paused';w.task='X-B有限28—30试验完成：28保持首轮登记稿，29/30真实完成并登记，当前25—30完整稳定连读及正式review已登记。31未获当前会话授权，未创建下一章；下一新线程依据根的新有限任务恢复，本会话正常退出供根核验。';
 w.authorization={allowed_actions:['discuss'],draft_range:null,revise_range:null,stop_conditions:['30当前稿/报告与25—30正式review保持，31未授权，不创建下一章','茶32/衣反馈33/同行35为后卷未决，不假结案；后续须新线程有限任务','只读终检与保存本次交接，不导出/封存/提交推送，不改旧封存原作品根源码/手改state/hash']};
 w.planning.outline.unresolved_ids=['当前30有限试验及25—30复盘已完成；旧首次停点是历史，不再回停','茶pending32/衣partial33/书pending35；下一章31不在本会话授权','原两条A optional_style及新I_X_BRC_CLASS_SUMMARY均保留未改'];
 put('.writer/brc-inputs/workflow-paused-r133.json',{expected_revision:s.revision,operation_id:'x-brc-complete30-pause',author_evidence:a.author_evidence,workflow:w});console.log(JSON.stringify({revision:s.revision}));
}
if(cmd==='record30'){
 const t=j('.writer/drafts/brc-template-30-r131.json');delete t._instructions;delete t.output;t.draft='正文/0030-兜里留得下的手-brc-v2.md';
 t.summary='第二十四日周三：母工装二洗后星期一干透收柜，今日穿去值守/18:30交何钥匙回，夜亲述拿本子不别扭、久靠仍认角/出汗不同，衣归母柜；女记而不算长期结论。周13:30上门处理纱门松合页/装回原扣，物主夫妻持饭盒实际开合，14:50多付50找28实收22记本，旧短螺丝与换下旧件留客户，明日14—16朋友时间仍留未赴。女下班回家吃后去第三课，19—20:30实际90分钟；老师赠薄棉边料，自剪折疏缝后衬薄处/合外开线，借剪刀均还，自针归盒，练布及余布带回；同桌挪扣/裙衬仅记号各自不同。夜自己穿坐放纸手平，母女厚薄不同，实裤归女柜、薄余布另纸套，沈仅文字得知有限完成，互聊青菜/转母一则；茶书仍未赴，父脚未愈等旧未知不变。';
 const e=(...quotes)=>quotes.map(quote=>({unit:30,quote}));
 t.changes={characters:{许蓉:'第二十四日周三下午亲穿二洗已干工装值守，18:30钥匙交何回家换衣；夜亲述拿本子不别扭、久靠仍认角且出汗与前不同，翻一角后衣归自己柜。亲看女裤薄里衬/外线并摸，女转述老师仅看旧纸/示范由女实做；听女转述沈青菜趣事，未见课堂/周修门或沈家全貌。',许蓉女儿:'第二十四日周三按时交班回家吃后去第三课，19—20:30完整90分钟，老师赠浅米薄棉边料，自己先里衬再合外线/练收结，借剪刀两次都还、自针归盒。夜实际穿坐放纸手平仅眼前，裤入自己柜前，薄余布另纸套/旧练布分放/纸入簿。课中只向老师旧纸反馈，回家才听母当日二洗后穿感并如实记；只文字告沈裤有限完成，听沈菜趣事再转母，未赴书约。',周岸:'第二十四日13:30实际到纱门家，现场见上合页孔松、保留原扣与纱作有限处理，14:50后物主夫妻持饭盒开合认可，收50找28净22记本，旧件/两短螺丝留客户桌角，工具自包带回。亲答明日14—16去朋友家不留铺等，未真赴茶；另一女人周六8:30不变，花摊只看未买。',沈禾:'第二十四日夜消息问下课，姑娘文字告自己裤兜里衬/外线合、刚坐试手平，沈仅知这层未亲见/摸；回述自己菜落门外拾洗折根吃及父笑问，姑娘转母是另一侧动作，沈未必知道。父脚旧状态及书约未赴仍保持。',老何:'第二十四日18:30实际由许蓉交值班钥匙，未获女课堂/母女夜谈或周茶/修门全貌。'},timeline_append:['本章首次叙述：第二十二日周一午后母工装二洗后干透收柜；29未写该线，30才补此已发生小动作，不改旧章。','第二十四日周三13:30—14:50后：周到纱门现场处理松动/原扣复用，夫妻持饭盒实试，50找28净收22，旧件留客桌，工具自带走。','第二十四日周三18:30前后：许值守结束钥匙交何回家，工装脱下椅背，夜有限回告二洗后穿感/归母柜。','第二十四日19—20:30：女第三课，老师赠薄棉边料，自完成裤兜里衬与外缝，自针归盒/借剪刀归原盒，课按90分钟结束。','第二十四日夜许家：女穿坐/放纸试当前手感，母女谈不同需求与有限母衣用感并记录；薄余布分收、裤入女柜。女只文字告沈结果并听青菜小事，书约仍未来。'],ledger:{
 T_X_SCREEN_DOOR_ASK:{status:'resolved',reader_known:'30周三13:30实际上门、现场处理合页松动/原扣复用，夫妻持饭盒开合认可，50找28净22实收记本，旧件留客户。限本次纱门能合扣，不证永久无磨损；另厨房窗只说哪天再问，无新报价约日。',character_known:{周岸:'亲完成现场有限修理/实试/收22与交还旧件，知明日14—16留朋友，不知物主以后使用。'},evidence:e('工料二十二','周岸找给他二十八','周岸在本上记实收二十二')},
 T_X_TEA_AFTER_WORK:{reader_known:'原约周四14—16仍未赴；30周三修门后实际对客户说保留明日14—16朋友时间，不留铺等/若问另讲，客户应下。廖尚未获本次修门消息。',character_known:{周岸:'亲对纱门夫妻重申明日两点到四朋友时段不接等；尚未赴廖家。'},evidence:e('明天两点到四点自己去朋友家，铺里也不留人等')},
 T_W_EVENING_CLASS:{status:'partial',reader_known:'30真实第三次周三19—20:30：女自己的裤里薄布衬/外开线合，自剪缝/练结并夜穿坐试；不是母袖重拆，课程总期数仍未知/后续学习未完。',character_known:{许蓉女儿:'亲第三课并自实修/夜穿试，仅证明当晚手能入平；赠布属己/余料分收，借剪刀已归。',许蓉:'夜亲摸女裤并听女述课堂，未亲见课；听老师仅看旧用感纸/不全拆母袖。',沈禾:'夜仅消息听女里衬/外线完成及坐试手平，未见课/实物，不会据此教学。'},evidence:e('钟指到七点，老师将门虚掩','八点半，老师叫收针','说今晚缝的是自己的裤兜，里面垫薄布，外面那道线也合了')},
 P_W_COAT:{reader_known:'30叙述周一午后干透收柜；周三再穿值守/夜亲述二洗后软些、久靠仍认角/出汗不同，女新记纸，母翻一角看折边仍在后入自己柜，未改补处或证长期耐用。',character_known:{许蓉:'亲收干/再穿与夜回告，实际归柜，未亲见课堂。',许蓉女儿:'晨见衣柜及指角，课只向老师旧纸反馈，夜才听今日有限用感/记并念给母确认；未亲历母整下午。'},previous_holder:'许蓉',custody:{holder:'许蓉',location:'许家自己的柜内，30夜翻一角折边后叠入',condition:'第二次洗干后周三再穿，夜脱回/未再洗未拆改，角仍能认，长期耐用待后卷'},evidence:e('干透才取下','折好送进自己的柜')},
 T_X_COAT_DAILY:{status:'partial',reader_known:'30二洗干后真实再穿/夜有限用感交女，女将新反馈与旧纸分时记录；老师课中仅读此前旧纸，新周三反馈尚未传老师，33后卷多次使用/交还仍待，不以词面记结案。',character_known:{许蓉:'亲穿二洗干衣/回告软些与久靠角及出汗条件，知女记录后念回。',许蓉女儿:'夜亲听今日穿感并记周三穿/软些/久靠仍认/出汗，分钟数未知不填，老师尚未获此新条。'},evidence:e('周三穿，软些，久靠仍认得出；今日出汗','靠多久没有写，自己没有看过母亲的整个下午')},
 P_X_OWN_TROUSERS:{type:'object',statement:'姑娘28发现里外两处问题、30第三课实际有限补修的同一条自有裤',status:'active',cast:['许蓉女儿','许蓉','沈禾'],tags:['自己使用','裤兜','有限修补'],reader_known:'里薄处添浅米薄棉片/外开线用近灰线合，夜实际穿坐放纸手平；未证次日工作或长期承物。',character_known:{许蓉女儿:'自己实修与夜穿坐，选薄手感与母厚垫不同，明日拟穿尚未发生。',许蓉:'夜亲摸看/见女穿坐，听有限课堂转述。',沈禾:'只文字获知里薄片/外线合及坐试手平，未亲见。'},custody:{holder:'许蓉女儿',location:'许家姑娘自己柜内前边，30睡前叠好',condition:'局部薄衬/外线合，夜短试，未洗/未证长期'},evidence:e('放到自己柜内前边')},
 P_X_THIN_CLASS_CLOTH:{type:'object',statement:'30老师明确赠姑娘的浅米色薄棉边料，与原母衣余布/旧练布不同',status:'active',cast:['许蓉女儿','许蓉'],tags:['课堂赠料','分开收存'],reader_known:'老师赠予整边料，女剪一片衬入自裤，长条余布另纸套，碎角弃；不需还老师，剪刀另归原盒。首次建账无旧账本holder。',character_known:{许蓉女儿:'亲受赠剪用并收余，自针已归盒、剪刀已还。',许蓉:'夜见余料并听女转述老师明确赠，叫与旧余布分开。'},custody:{holder:'许蓉女儿',location:'一片随自裤入女柜，薄余料在女房干净小纸套，与旧练布分放',condition:'浅米薄棉边料已剪用/余条保留，非原母衣补布'},evidence:e('这块就是给你的。用不完的也拿回去。','将薄余布和原练布分放')}
 }};
 t.draft_review={reviewer:'同ID X-BRC知情执行代理',report:'审查/X-BRC30最终合章自检-v1.md',draft_sha256:sha(read(t.draft)),report_sha256:sha(read('审查/X-BRC30最终合章自检-v1.md'))};
 for(const v of Object.values(t.changes.ledger))for(const a of v.evidence)if(!read(t.draft).toString('utf8').includes(a.quote))throw Error('absent quote '+a.quote);
 put('.writer/brc-inputs/record-30-final-v1.json',t);console.log(JSON.stringify({review:t.draft_review,input_sha256:sha(read('.writer/brc-inputs/record-30-final-v1.json'))}));
}
if(cmd==='final30-input'){
 const a=j('.writer/brc-inputs/assemble-30-v1.json');const fixes={
 1:[['没有像前日说的那样顺手丢','没有顺手丢'],['院里有人叫吃饭没有，是男人的妻子。她拎着一只小饭盒出来，先放桌上','女人再从屋里出来，问两个人吃饭没有。她拎着一只小饭盒，先放桌上']],
 2:[['这块给你用。剩的也拿回去，不是借一件衣服。','这块就是给你的。用不完的也拿回去。']],
 5:[['母亲将手指伸直，自己的指肚压过她那一点，说原来不是长，是做针线的手捏得尖。她将两只手错开，笑母亲才摸过一块新布，就要将手也说成新学的。女儿应是，将裤子提起来','许蓉笑她捏针时总收着手指，摊开才认得清。姑娘将两只手错开，拿起裤子'],['她回到家了，想将课上拍的两张都发','她回了一句已经到家，想将课上拍的两张都发'],['沈禾也没有问老师能不能替自己家的袋再缝，姑娘不必把才学到的每一针立刻分给别人，起身时只是将母亲空了的橘皮碟端进厨房。','她向沈禾回一个笑，将母亲空了的橘皮碟端进厨房。碟沿还留一点甜汁，她把它冲净，倒扣到架上，出来时桌边的手机已经暗了。']]
 };
 for(const[k,pairs]of Object.entries(fixes)){const n=Number(k),old=a.parts[n].path;let v=read(old).toString('utf8');for(const[x,y]of pairs){if(v.split(x).length!==2)throw Error('nonunique '+x);v=v.replace(x,y);}const r=old.replace(/-v2\.md$/,'-v3.md');if(r===old)throw Error('path');put(r,v);a.parts[n]={path:r,sha256:sha(read(r))};}
 a.draft='正文/0030-兜里留得下的手-brc-v2.md';put('.writer/brc-inputs/assemble-30-v2.json',a);
 console.log(JSON.stringify({han:a.parts.reduce((n,p)=>n+(read(p.path).toString('utf8').replace(/^#.*$/gm,'').match(/\p{Script=Han}/gu)||[]).length,0),parts:a.parts}));
}
if(cmd==='assemble30-input'){
 const names=['01-两件衣服','02-门底那一点空','03-先把东西摊开','04-先缝里面','05-八点半收针','06-各自穿着'];
 const fixes={
 '02-门底那一点空':[['院里有人叫吃饭没有，是男人的妻子。','女人把小凳旁那两盆花挪到院里，底下原来积着一点水，端盆时沿着手腕滴。男人见了，说自己前几天才浇过，她答前几天是下雨，哪是他浇的。周岸手上压着合页，听见男人解释桶放在门后，提进来又忘，自己也笑了。女人没继续追问，将盆放到墙边能照太阳的地方，回屋取布把凳面擦干。那张凳终于空出，男人反而不知道还用来做什么，坐下，又因挡着门架起身，便索性站到周岸手边帮扶。\n\n院里有人叫吃饭没有，是男人的妻子。']],
 '03-先把东西摊开':[['她从钱夹里取出钥匙，放到常背的小包外格','她从上班包外格取出钥匙，放到常背的小包外格']],
 '04-先缝里面':[['教室里说话声少下去，各人的东西近了，钟仍往前走','教室里说话声少下去，各人又低下头，钟仍往前走']],
 '05-八点半收针':[['老师没在这时候给她盖一个全好的话','老师没急着说全好了'],['两只口袋的事情也终于能分别说清了','裤兜里外两处也终于能分别说清了']],
 '06-各自穿着':[['母亲说真论手大，应该先问父亲，话出口，屋里静了短短一瞬。她没有往下讲旧事，只将两只手错开，指着裤袋说自己问的是厚薄，不是要和她比个输赢。','母亲将手指伸直，自己的指肚压过她那一点，说原来不是长，是做针线的手捏得尖。她将两只手错开，笑母亲才摸过一块新布，就要将手也说成新学的。']]
 };
 const parts=names.map(n=>{let r='分段/0030-BRC/'+n+'-v1.md';if(fixes[n]){let v=read(r).toString('utf8');for(const[a,b]of fixes[n]){if(v.split(a).length!==2)throw Error('nonunique '+a);v=v.replace(a,b);}r='分段/0030-BRC/'+n+'-v2.md';put(r,v);}return{path:r,sha256:sha(read(r))};});
 const han=parts.reduce((n,p)=>n+(read(p.path).toString('utf8').replace(/^#.*$/gm,'').match(/\p{Script=Han}/gu)||[]).length,0);
 if(han<10500)throw Error('below target '+han);
 put('.writer/brc-inputs/assemble-30-v1.json',{unit:30,expected_revision:s.revision,draft:'正文/0030-兜里留得下的手-brc-v1.md',parts,separator:'\n\n'});console.log(JSON.stringify({han,parts}));
}
if(cmd==='plan30-inputs'){
 const source='研究/X-BRC容量恢复指令-原文.md';put(source,fs.readFileSync(path.join(X,'prompt-b-capacity-recovery.md'),'utf8'));
 const evidence={quote:'本次任务覆盖旧首次“29两段即停”的停点，明确继续已授权29余稿及30、25—30复盘后暂停。',local_source:source,source_sha256:sha(read(source)),locator:'X/prompt-b-capacity-recovery.md 第1行；根提供线程01a15d55-748a-7500-9016-ada8458f00a7，无新的作者消息ID',recorded_by:'同ID X-BRC执行代理，近期细节由代理在有限授权内选择，并非作者逐项采纳'};
 const workflow=structuredClone(s.governance);delete workflow.enabled;delete workflow.decisions;delete workflow.note;
 workflow.stage='outline';workflow.task='29已登记r129；仅规划第30章真实细纲，沿V11和B近期执行纲，随后真实采用及恢复原28—30有限写作范围。31未授权。';workflow.authorization={allowed_actions:['discuss','plan'],draft_range:null,revise_range:null,stop_conditions:['30细纲建成前不写正文；不改28/29登记稿及旧骨架来源','30完成后当前25—30完整连读正式复盘，paused仅discuss/null；不写31']};workflow.planning.outline={status:'draft',refs:[],unresolved_ids:['30细纲待实际plan；茶32/穿洗反馈33/同行35仍为未来']};
 put('.writer/brc-inputs/workflow-plan30-r129.json',{expected_revision:s.revision,operation_id:'x-brc-plan30-only',author_evidence:evidence,workflow});
 put('.writer/brc-inputs/plan30-v1.json',{unit:30,title:'兜里留得下的手',goal:'第三次周三课实修自己的裤兜，区分贴身手感与母衣的工作需求；周三上门兑现实物修理，保留周四朋友时间',change:'自己完成袋里薄处局部加衬与外缝合口，当晚穿试只证眼前；母衣二洗干后继续穿并有限回告，纱门原扣重新用上并收清本次工料；茶/书未赴',cast:['许蓉女儿','许蓉','周岸','沈禾','面摊主'],setting_refs:['设定/人物与声音.md','大纲/扩大骨架-X.md','大纲/X-B近期执行纲-28-30.md'],research_refs:['研究/X-B作者请求-原文.md',source],forbidden:['第二十四日周三，跳过未成章周二；第三课19—20:30共90分钟，不扩成两小时或自动多期','母工装旧补处保持，不带去拆改；母亲不全知课堂，沈只据实际消息知有限结果','纱门与26另一女人周六8:30房门不同；保留原扣可用性，现场判断，不万能翻新','茶为明日周四14—16/书为此前约定较远周日14，均未实际发生；不将due章号当日期','原24完整units正文及原观察三字段不变，不写31；正文目标10500—11500汉字至少10000/六段'],beats:['周三晨母女各备出门：工装已干收柜，女带自己裤/练布/针盒/旧用感纸，母明确自己的袖仍穿不拆；母女两种补法需求各有理由','周三13:30周实到纱门，现场试合发现松动所在，与物主选择保留旧扇原扣的有限修法；真实做完/收费交还，不让所有零件全换，明日朋友时段仍留','姑娘下班归家吃东西取袋去第三课，提前到场与同桌各自摊物，学员需求不同；教师给薄边料实际交代用途与归属，七点开课','19点后前半课看裤兜里外结构，练布与实裤不同，决定先铺里衬后合外缝；姑娘自己量取/剪折/固定，不让老师代做','后半课完成有限里衬及外缝，老师与同桌讨论用途而非统一正确手感；20:30收课，原针工具收回自盒、余布随女，母袖仅纸上反馈未改','夜归实际穿坐/手入兜试，母女谈各自手感与二洗后有限穿感；女记纸及发沈有限结果，沈按消息回应，生活各继续，后卷茶书未提前兑现'],recall_ids:['T_W_EVENING_CLASS','P_W_COAT','T_X_COAT_DAILY','T_X_SCREEN_DOOR_ASK','T_X_TEA_AFTER_WORK','T_X_BOOK_COMPANY'],arc_id:'A11'});
 console.log(JSON.stringify({revision:s.revision,workflow:'.writer/brc-inputs/workflow-plan30-r129.json',plan:'.writer/brc-inputs/plan30-v1.json'}));
}
if(cmd==='adopt30-input'){
 const prev=j('.writer/brc-inputs/workflow-plan30-r129.json');const w=prev.workflow;
 w.stage='trial';w.task='28—30有限试验：28/29已登记保持，实际采用30细纲后写第三课重点章，30record后当前25—30完整稳定连读/正式比较复盘，再paused仅discuss/null；31未获授权。';w.authorization={allowed_actions:['discuss','plan','draft'],draft_range:{from:28,to:30},revise_range:null,stop_conditions:['28/29不重写；只写30目标10500—11500至少10000汉字且六实际事件段','30真实合章/原生全读/双SHA报告/同输入preview0后record','30后新brc-window-current稳定完整25—30原生连读与正式review，再paused仅discuss/null，不创建31']};w.planning.outline={status:'adopted',refs:['大纲/单元/0028.json','大纲/单元/0029.json','大纲/单元/0030.json','大纲/X-B近期执行纲-28-30.md'],unresolved_ids:['旧首停条件已由实际续程授权覆盖，旧来源留历史；三链跨后卷结果仍未发生','所有新细节属执行代理有限选择，不称作者逐项采用']};
 put('.writer/brc-inputs/workflow-adopt30.json',{expected_revision:s.revision,operation_id:'x-brc-adopt30',author_evidence:prev.author_evidence,workflow:w});
 console.log(JSON.stringify({revision:s.revision,plan_sha256:sha(read('大纲/单元/0030.json'))}));
}
if(cmd==='record29'){
 const t=j('.writer/drafts/br-template-29-r128.json');delete t._instructions;
 t.draft='正文/0029-五点进门以后-brc-v1.md';
 t.summary='第二十二日周一沈4:10起/4:32离家，5点进店吃早糕并协作开柜，老板5:32离店；沈独守卖糕，10:40后送粉落干板，小包回拨核实、原款全付/单留，金额未露。父8点后自隔水热粥、关火分步端吃洗，伤脚仍垫，语音告沈；沈午饭后听结果。周傍晚见纱门实扣和视频，约周三13:30先看，原扣两螺丝随客带回，未收未修，与另一女人周六8:30不同。老板15:20回接柜，亲收单/收联/空钱袋入格，15:30叫沈走，沈买葱回家见净碗锅、设16:30睡醒，发早回消息姑娘仅知这层；厚帘未洗/画册白纸原位，衣茶书未新增兑现。';
 t.changes={characters:{沈禾:'第二十二日周一亲执行5—15:30早班；对单回拨实付送粉、留收联，15:20将原单/联/空袋交老板，接柜后15:30走。仅午饭后听父语音得知粥吃/碗洗，回家亲见净碗锅；买葱付款未写额、没拆厚帘，16:30睡醒发姑娘早回睡过。未亲见父热粥过程/老板乘车购物过程。',沈成林:'第二十二日八点后亲热冷藏粥、关火分步端吃/浸洗碗锅，脚需松鞋口及坐歇未愈；语音告女结果，回家听其粉款付/接柜走，调低电视让女睡。眼镜盒到小桌，袋仍空挂椅外；不知店内全对单过程。',谭老板:'第二十二日早亲与沈吃糕开柜，留单独粉款/原单/电话，5:32离店；电话确认落板与小包、收到付清消息，15:20返店亲见粉位、收原单收联空袋入格并接柜，15:30叫沈走/明日照常；不知道沈父具体热粥及姑娘消息。',周岸:'第二十二日傍晚亲见纱门旧扣/两短螺丝及关门视频，答需到场看框/合页，约周三13:30先看、不保证下班前大修；原物归客未收费。周四茶和另一女人周六8:30约未执行；晚买饭实付未写额。',许蓉女儿:'第二十二日下午仅收到沈今天早回睡过一阵，回述自己水凉后换热；未见店内送粉或沈父早餐过程。自己的裤/课与远书约仍待，未获周纱门信息。'},timeline_append:['第二十二日周一4:10—5点：沈起身/父床头喝水与灯，4:32出门4:58店前5点进；父粥仍冷藏，脚未愈。','第二十二日5—午后糕店：实吃早糕/老板5:32走，晨客实付；送粉10:40后落干板，小包回拨确认，原款全付无余/收联留，沈热午饭吃。','同日八点后沈家：父亲隔水热粥关火分步端吃，浸洗碗锅，语音告女；沈午饭后才听到。','第二十二日傍晚周铺：纱门客携扣和两短螺丝问，双方约周三13:30先看，客带回原物，未收费未修。','第二十二日15:20—16:30沈线：老板返接柜并收单/收联/空袋，15:30沈实际走，买葱回家见净碗锅/厚帘未洗，睡醒后告姑娘早回。'],ledger:{
 T_X_MONDAY_EARLY:{status:'resolved',reader_known:'29已实际5点进店/15:30交柜离店；早糕吃、老板外出、送粉落板款付、父自热并回告、沈实睡。限本次周一，不变成永久早开或父脚痊愈。',character_known:{沈禾:'亲执行早班/对款送粉/交接离店，父早餐仅听语音及回家见净碗锅。',谭老板:'亲见沈到班，电话核粉后回接柜/收单联空袋，叫15:30走。',沈成林:'亲自吃洗并告女；女回家说送粉款清/已接柜，见她回睡，不知店全貌。',许蓉女儿:'28知计划，29仅消息知早回睡过；无现场全部知识。'},evidence:[{unit:29,quote:'五点到了。'},{unit:29,quote:'她将原袋里的钱当面数出'},{unit:29,quote:'三点半，老板从柜前回头，叫她走吧'},{unit:29,quote:'粥吃了，碗也洗了。你回来别又给我热这一份。'}]},
 T_X_SCREEN_DOOR_ASK:{status:'partial',due_unit:30,reader_known:'29已按约再问，实扣/视频显示需看门框合页；约周三13:30上门先看，未收费未修，旧扣两短螺丝由客带回/另一半门框未拆。这是实际新增上门约，非未执行的状态自动延期。',character_known:{周岸:'亲见实扣/两螺丝和视频、核地址并记周三13:30先看；未现场诊断修好，不与周六另一女人门约混并。'},evidence:[{unit:29,quote:'说一点半先去看，人能在么。'},{unit:29,quote:'那两颗螺丝已经随人走了'}]}
 }};
 t.draft_review={reviewer:'同ID X-BRC知情执行代理',report:'审查/X-BRC29最终合章自检-v1.md',draft_sha256:sha(read(t.draft)),report_sha256:sha(read('审查/X-BRC29最终合章自检-v1.md'))};
 for(const v of Object.values(t.changes.ledger))for(const e of v.evidence)if(!read(t.draft).toString('utf8').includes(e.quote))throw Error('absent quote '+e.quote);
 put('.writer/brc-inputs/record-29-final-v1.json',t);console.log(JSON.stringify({input_sha256:sha(read('.writer/brc-inputs/record-29-final-v1.json')),review:t.draft_review}));
}
if(cmd==='restore'){
 const a=JSON.parse(fs.readFileSync(path.join(X,'capacity-stop-b.json'))),b=fs.readFileSync(path.join(X,'parent-b-capacity-stop-state.json')),t=j('.writer/drafts/br-template-29-r128.json');
 const files=a.files.map(v=>({path:v.file,same:sha(read(v.file))===v.sha256}));
 const sources=Object.entries(t.source_hashes).map(([r,h])=>({path:r,sha256:sha(read(r)),same:sha(read(r))===h}));
 if(!read('.writer/state.json').equals(b)||files.some(v=>!v.same)||sources.some(v=>!v.same))throw Error('checkpoint/source mismatch');
 put('研究/X-BRC容量恢复核验.json',{revision:s.revision,state_sha256:sha(b),byte_equal:true,capacity_failure:{invocation:a.failed_invocation,exit_code:a.actual_exit_code,thread_id:a.thread_id,reason:'Selected model is at capacity; external model capacity, not product failure or author pause'},files,sources,template_sha256:sha(read('.writer/drafts/br-template-29-r128.json')),influence:'r128已正式恢复28—30有限范围，无新的来源/治理变化，原模板仍有效；仅将目标输出指向新的brc完整稿，不重取、不更新source_hashes。',reading:'六段全部原生FastCtx<=100行读全，28当前收尾201—271；原模板1—30及29纲/V11/B近期纲实读。技能沿本同ID已读且当前包同指纹。'});
 console.log(JSON.stringify({ok:true,revision:s.revision,files:files.length,sources:sources.length,all_same:true}));
}
if(cmd==='fix29'){
 const fixes=[['03-送到干板上',[
 ['她说切好就给，没让一句能等变成自己从早到晚都能撑。','她说切好就给，将两只盒分开摆好。'],['回来碗里仍热。','回来盒里仍热。']]],['04-早饭慢一点',[
 ['沈禾出门时问几点，自己刚醒说不明白，如今八点已过','自己清早问过几点，沈禾答四点多，如今八点已过'],['比昨晚空着掂要沉','比空着时沉']]],['05-扣拿来了',[
 ['隔着这一点木头的照片','只看这个视频'],['并不是周岸下周六已记的另一家','并不是另一位女人约周六八点半的那家'],['周岸说原物带回，自己明日要找也认得，周三到门前再拆，省得家里只剩一根绳。','周岸说原物先带回，别把配套的另一半也拆了，周三到门前一块看。'],['下周四那杯茶仍在几天以后','约好的星期四还在几天以后']]],['06-三点半走出去',[
 ['两手提着空出的轻','提着轻了许多的包'],['那半小时已经真用在自己身上。','早走的那点工夫，已经真用在自己身上。']]]];
 for(const [name,pairs] of fixes){let v=read('分段/0029-B/'+name+'-br-v1.md').toString('utf8');for(const [a,b]of pairs){if(v.split(a).length!==2)throw Error('nonunique '+a);v=v.replace(a,b);}put('分段/0029-B/'+name+'-brc-v2.md',v);}
 const parts=['01-四点十分-v2.md','02-柜前先亮的灯-v2.md',...fixes.map(([n])=>n+'-brc-v2.md')].map(n=>'分段/0029-B/'+n);
 const stats=parts.map(r=>({path:r,sha256:sha(read(r)),han:(read(r).toString('utf8').replace(/^#.*$/gm,'').match(/\p{Script=Han}/gu)||[]).length}));
 put('.writer/brc-inputs/assemble-29-v1.json',{unit:29,expected_revision:s.revision,out:'正文/0029-五点进门以后-brc-v1.md',parts:stats.map(({path,sha256})=>({path,sha256})),separator:'\n\n'});
 console.log(JSON.stringify({parts:stats,han:stats.reduce((a,b)=>a+b.han,0)}));
}
