import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),project=JSON.parse(fs.readFileSync(path.join(base,'project.json'))).project;
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const save=(ref,x)=>{const f=path.join(project,ref);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,typeof x==='string'?x:JSON.stringify(x,null,2)+'\n',{flag:'wx'});};
const refs=['设定/人物与声音.md','大纲/AD扩大骨架-49-60.md'];
const common=['照片与转述不等亲见；母袖长期效果、父伤康复、复航和父辈全史均未定','保留14花册/原8册/18未购20未动；旧门工40料10总50与抽屉18、新柜58各自独立','浅蓝袋父有，另存短帘非窗上两幅；原毛点/白褶补针与四厚接头不倒回旧分段','不以每章一天为规则；从57实际第45日周三夜续；课堂19—20:40/100分钟与33周五非课保留'];
const mk=(unit,title,goal,change,cast,beats,recall_ids)=>({unit,title,goal,change,cast,setting_refs:refs,research_refs:['研究/AD-D滚动写前核对.md'],forbidden:common,beats,recall_ids,arc_id:'A21'});
const plans=[
mk(58,'袋里放自己的','第46日周四，沈成林为自己的阅读和坐处作实际选择，沈禾完成工作并留下一段自己的时间，父女到晚间真听见彼此不同的意见。','从56父借女画册/读走错路文章仍想找到的处境，到父不以出门远近计成绩、用自有报纸和轻物袋保留自己读到的内容；女有独处阅读并主动回来听。不是重新验袋或判伤愈。',['沈禾','沈成林','谭老板','许蓉女儿'],[
'周四早沈上工前，父想找回自己的旧报/读完昨日短文，先说明要看什么；沈误会成还要她买书或陪下楼，问回后只把家中可及纸放好，不代找一个满意结尾。',
'沈在糕店完成真实的一天；一次客人的口味/份量需要不能由漂亮摆法猜出，谭有自己的成本与选择，两人用实际售卖/交接相处，不重复洗盆流程。',
'父独处重读原折报，区分自己不喜欢的结尾和确实想读给女儿的一段；从自有低处旧纸另找参照，字看不清可以停，不在未见中补前史。',
'四点后女回家，父对原先楼门口念头改选家中窗边；椅脚/杖凳/过道真安排，在女扶臂下短移到同屋稳椅，伤脚仍垫。眼镜盒与折报轻放自袋，不另装半瓶水重演24。',
'女按自己愿望带原8册到近处坐一阵，父允许而非被哄睡；阅读遇到与自己想象不同的一页，有停留和走开的自由，无代购/借书/统一审美。',
'父在窗边自己用袋取报、折换阅读顺序，在自己另取的单面旧纸空背写几句想说的话，非女画册大白纸；保留不满意，想讲给女听而不变成长篇训示。',
'女回家后双方有听错/抢话与问回，父读出自己真正喜欢的一段而不替原文编后半，女也讲当日一件自己的事；能并坐却不必都说同一句结论。',
'夜父亲将个人记纸与折报分明收自袋，眼镜进盒，伤脚仍凳杖；女原8册回床边/原白纸不动。两友凭实际消息问下一次可见的时间，若约定只记约定，不提前算59见面。'
],['P_W_CURTAIN_BAG','P_W_PICTURE_BOOK']),
mk(59,'两本不必一样','父女周四阅读之后，两友在真实可重合的时段继续一次自己的交流，各自的迟到/等待和兴趣都有完整生活结果。','从51同坐时互看几页、57只有课堂文字，到新的相约与独看/实际交流。原8与14各归主；延迟的朋友主动说清，先到者也真做自己的事。',['沈禾','许蓉女儿','许蓉','老何'],[
'依58实际约定核日期和时间。周五下工女有自己已接工作需交清，确有延迟则主动告知；沈按消息决定先去坐或做自己的，不将等候写成惩罚。',
'先到者在约定地点独读自己原8册，有自己一页想看；朋友到场前不预知其课堂/母夜反馈，物件各自携带。',
'见面后双方不必先问针；女可只分享一点新练习，沈可以尚不懂/先看画；把误会讲清但不每句都说规则。两本书互看需实际递接，未借不换所有权。',
'许/何若使用母图与余1补图，只在当前当班现场核眼前实际来者的图/照片；原外流纸无新物就不制造回收，停航仍依告示。可以只承接普通交班，不强加新旅客。',
'两友各有一点仍不同意/想独看之处，真正收书分别、回家继续自己的事。相约到点的代价已发生，下一次不是必须聚餐/补偿/替人买书。'
],['P_W_PICTURE_BOOK','P_DR_FLOWER_BOOK','P_ROUTE_MASTER','T_W_EVENING_CLASS']),
mk(60,'窗边还留着光','依58—59实际结果，从最有后果的两三条生活线写一次有限落点，让已做安排被本人继续使用。','本组三章在各自可用/仍不同意见中形成可见结果，保留普通明天；不取消已付款或已完成交接，也不把本轮停止当全书终局。',['许蓉','许蓉女儿','沈禾','沈成林','周岸'],[
'写前按59实际结尾滚动核日历、班次、各人物/物件/尚待约定，选择已经有证据的两三条，不强全员同场。',
'许用新灯和自己的纸听戏/看字，有属于自己的时间；女兴趣或练习只据新需求，母衣原纸旧观察仍保留。',
'沈父女对阅读或取用继续各有意见，一次有限轻用仍是有限；女可做自己的事，不以父更远下楼给成长盖章。',
'周在已获准责任后的真实普通交流里花一点自己的时间；若柜使用者有消息只按所述回应，不补现场没见的内部与长期结论。',
'两友或父女落实一项可见收尾，钱/纸/书各归实主；对照片、外流图、长期舒适、复航等只留真实尚缺条件，不造结局或61新钩。'
],['P_W_CURTAIN_BAG','P_DR_FLOWER_BOOK','T_D_CABINET_PHOTOS','P_CR_FEEDBACK_PAPER'])];
for(const p of plans)save(`.writer/drafts/ad-d-plan${p.unit}-input.json`,p);
const pages=fs.readdirSync(path.join(base,'read-pages')).filter(n=>n.startsWith('d-')).map(n=>JSON.parse(fs.readFileSync(path.join(base,'read-pages',n))));
const coverage={};for(const p of pages){const ref=path.relative(project,p.file).replaceAll('\\','/');const v=coverage[ref]??={sha256:p.sha256,pages_total:p.pages,pages_read:[]};v.pages_read.push(p.page);}
for(const v of Object.values(coverage)){v.pages_read.sort((a,b)=>a-b);v.complete=v.pages_read.length===v.pages_total;}
save('研究/AD-D滚动写前核对.md',`# AD D写前核对\n\n知情自检与controller普通细化，不是作者逐项情节原话。作者quote为研究/AD作者任务.md第3行“继续推进”，完整文件SHA256 ${sha(fs.readFileSync(path.join(project,'研究/AD作者任务.md')))}。\n\n55—57当前登记稿完整28页已读：55 ac23345b98f61330d45b41ca85172aab0b838ab64023888a6e6d153bb18de332；56 29d3790d76c10fe950d01e4127679cd510d329d1b29110e00ffce54a6d5d9247；57 b197d7f08c49753eacf6e1465a2d89500e284412182b60db7846e8a6495c0bc2。修后正文为当前，旧段不回拼。57末是第45日周三夜，第六课实到20:40；新角仍厚但较散，48偏长针和52旧硬尾仍留。母亲仅家中摸布，沈只读文字，父只知56带布去课。\n\nrecall逐项定位P_W_CURTAIN_BAG/P_W_PICTURE_BOOK/P_DR_FLOWER_BOOK/T_W_EVENING_CLASS/P_ROUTE_MASTER后，实际补读15p4—6、21p4—6、24p1—2、35p3—5、51p2—5、52p6—7、12完整4页、6p2—4、13p1。其余旧章/页不冒称本程全文实读。袋原承诺来自15“装半瓶水”但为轻物，不必每次装水；21仅补薄边，24扶臂停喘/回家空袋，56原盒报各边/袋回扶手。原8册在沈床边，父要看需沈交付；父原报由父持。58可在家窗边用自物，不把外出当康复。\n\n35当前原文女实付14，18薄书未购、20仍在；51朋友树下互看后各自带回，自纸写细枝左边空着；57书签已移停页，不倒回永远淡花页。反馈纸、练习小纸、原8册大白纸、女14册夹纸分开。父新增个人记纸须从其自有纸出现，不偷用女白纸或反馈纸。\n\n6东岸两口亲走/母图/补3，12陪至桥头前两灯杆、余1加停稳，52只旧正面照片/新背面与告示拍照，原旧信封未拆，母图归簿、余1回盒。所有外流版和对岸到达仍未全核，不造老旅客报喜。\n\n沿AD49—60原窗口/V21与原全书方向。58父主动选择用途和意见，59朋友等待/独看/交流，60已做安排普通再用，不重演24下楼或51同一页讲解。V21及AD骨架的旧“本程不授正文”描述历史规划进程，当前权限由有效workflow决定，未改旧消费入口。普通细化在正式plan写前完成，若以后已消费源须变则走source协议。\n\n不动O_BOX_PAINT与全部不可变观察，80/35/81/84、29厘米、19—20:40/100分钟、33V2与E绑定。当前旧门工40料10总50、抽屉18、新柜工46料12实收58独立；三宽条/沈吃1.5女吃余1.5已净不倒回。照片/长期耐用/父伤/母衣效果和核心终局保留未证边界。\n`);
fs.writeFileSync(path.join(base,'d-before-planning-reading-coverage.json'),JSON.stringify({ok:true,coverage,entry_revision:285,old_consumed_sources_changed:false},null,2)+'\n',{flag:'wx'});
console.log('Saved three plan inputs, reading coverage and new research note; no state edits.');
