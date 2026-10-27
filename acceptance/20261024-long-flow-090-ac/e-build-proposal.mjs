import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url));
const read=f=>fs.readFileSync(f,'utf8'), json=f=>JSON.parse(read(f));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const a=json(path.join(base,'e-preflight-audit.json')),root=a.project;
const state=json(path.join(root,'.writer/state.json'));
const unit=n=>a.units.find(u=>u.unit===n);
const body=n=>read(path.join(root,unit(n).draft));
const lines=n=>body(n).split('\n');
const quote=(n,line)=>({unit:n,path:unit(n).draft,sha256:unit(n).sha256,line,verbatim:lines(n)[line-1]});
const source=ref=>({ref,sha256:hash(fs.readFileSync(path.join(root,ref))),direct_consumers:a.units.filter(u=>Object.hasOwn(u.source_hashes,ref)).map(u=>({unit:u.unit,consumed_sha256:u.source_hashes[ref]}))});
const pages=fs.readdirSync(path.join(base,'read-pages')).filter(f=>/^epre-read\d+-p\d+\.json$|^eold-\d+-p\d+\.json$/.test(f)).map(f=>({log:'read-pages/'+f,...json(path.join(base,'read-pages',f))}));
const coverage=[];
for(const n of [...new Set(pages.map(p=>a.units.find(u=>path.resolve(root,u.draft)===path.resolve(p.file))?.unit))].filter(Boolean).sort((x,y)=>x-y)){
 const u=unit(n),ps=pages.filter(p=>path.resolve(root,u.draft)===path.resolve(p.file)).sort((x,y)=>x.page-y.page);
 const ns=[...new Set(ps.map(p=>p.page))]; for(const p of ps){assert.equal(p.sha256,u.sha256);assert.equal(p.text,body(n).slice(p.from,p.to));}
 const full=ns.length===u.pages&&ns.every((p,i)=>p===i+1);
 coverage.push({unit:n,path:u.draft,sha256:u.sha256,pages_total:u.pages,pages_read:ns,full,logs:ps.map(p=>p.log)});
}
for(let n=34;n<=48;n++)assert.equal(coverage.find(c=>c.unit===n)?.full,true,'Missing full reading '+n);
const commonProtection=[
 '控制器受控试验变量，不是人类作者指定的新剧情；候选不表示当前正文有错。',
 'O_BOX_PAINT的type/statement/author_truth保持原字节；原箱白漆不是暗号或排他归属证明。所有旧观察原句、实物特征、母亲原纸、旧针脚和照片证据不作测试变量。',
 '80押金、35西门、26+55=81柜门、24+60=84窄凳等旧款不重开；窄凳29厘米、课程19:00—20:40/100分钟、伤脚限制及未定复航/课程总数保留。',
 '33正文、CR33_INITIAL和CR33_RECALL_ID_V2冻结源及原消费绑定不变；不能把当前入口历史INITIAL哈希改成V2以消除差异。',
 '人物知情只能来自本人所见/亲听/消息；不能让父母或周岸提前共享两姑娘场景。35以前前缀不重写、不重登。'
];
const proposals=[{
 id:'E_CTRL_35_FLOWER_PRICE',status:'proposed-not-selected-not-executed',unit:35,volume:'V13',path:unit(35).draft,current_sha256:unit(35).sha256,
 original_quotes:[quote(35,111),quote(35,113),quote(35,156),quote(35,158)],
 proposed_change:'仅将姑娘自购红花旧画册的售价和手机实付从12元改为14元。35章四处价格同步；不替换十二点半等时刻，不改沈禾18元未买、另留20元和旧8元册。',
 proposed_excerpt:'“十四，就这一册。”女人道。\n\n姑娘用自己的手机付了十四元。',
 reason:'普通日常消费，卷契约只要求各选各付/可不买，作者原话和当前设定未固定该价格。使原1—36章中的普通事实变化传到后续真实告知和追踪，最早从35回放，保留33V2与34。',
 protection_check:{observation:false,author_fixed_value:false,basis:['author-request.md','研究/AC作者任务.md','设定/权威规则.md','设定/人物与声音.md','大纲/分卷/V13.json','35正文完整分页'],protected:['原8元画册及白纸页签','18元薄书未购','沈禾20元未动','姑娘自费且书归姑娘','红花/白边/叶子识别等观察内容','27已确认12:30交班与14点书店约']},
 impact_types:['price','payment','reported-knowledge','tracking','consumed-source-version'],
 direct_affected_units:[35,36],downstream:[{unit:36,quotes:[quote(36,11),quote(36,68)],required_change:'母亲亲听姑娘报14元；沈父亲听沈禾报14元，两人仍只按原场景得知；18元未购不动。不可将知识提前至35或让父亲拿到姑娘实体书。'}],
 reread_tail:{from:35,to:48,combined:true},
 related:{ledger:['P_DR_FLOWER_BOOK','T_X_BOOK_COMPANY','P_W_PICTURE_BOOK','F_W_BOOK_RETURN'],characters:['许蓉女儿','沈禾','许蓉','沈成林'],tracking:['35/36 summary与timeline','两书所有权/位置','价格的reader_known和character_known','旧证据被改后逐条重定位，不只换SHA'],plans:['大纲/单元/0035.json','大纲/单元/0036.json','大纲/X-DR第36章执行纲.md','大纲/分卷/V13.json']},
 source_strategy:{mode:'historical-versioning-required',changes:[['大纲/单元/0036.json',36,'forbidden中姑娘12元花书改为14；保留18未购/20未动'],['大纲/X-DR第36章执行纲.md',36,'事实起点姑娘12元改14，不改变知识途径']].map(([ref,from,change])=>({...source(ref),publish_from:from,planned_change:change})),unchanged:['大纲/单元/0035.json','大纲/X-D近期执行纲-34-36.md','大纲/分卷/V13.json','全部设定/作者原话','AC扩大骨架及以后只提已同行的来源']},
 unresolved:['根控制器尚未选择本项。选择后按真实impact.required_readings逐条实读；本轮没有生成impact或source版本。','36知识遗漏旧意见须用修改后当前报告复核，不能伪造第二次application。']
},{
 id:'E_CTRL_40_MATERIAL_PRICE',status:'proposed-not-selected-not-executed',unit:40,volume:'V15',path:unit(40).draft,current_sha256:unit(40).sha256,
 original_quotes:[229,231,233,276,280,290,326,403].map(l=>quote(40,l)),
 proposed_change:'普通新木条材料8元改10元，39约定工费40元保持。40章报价获同意、实际支付、票据及主人所知同步；周岸交10元正好，不再收回两枚硬币。41章实收变50元，女主人付50元正好，不找2元；47回看料10。',
 proposed_excerpt:'周岸从钱夹取十块，正好付清，再将那张写着十元的小纸叠好，放进本子夹页。',
 reason:'不改变修门范围或主人是否接受，且有两次真实现金动作、总价与后来账目回看需要改变，可验证下游事实/行动和知识边界，不只是替换词语。净工费仍40元，不能把材料回收另算收益。',
 protection_check:{observation:false,author_fixed_value:false,basis:['author-request.md','研究/AC作者任务.md','大纲/分卷/V15.json','大纲/AC扩大骨架-37-48.md第9/20行','39—41与47完整正文'],protected:['工费40原承诺','旧80/35/81/84款及18抽屉款','取下裂条/旧钉/新余头所有权','有限开合/留风试用结论','未到图的另一柜门不强结','下午另一枚零钱仍是周岸自己的钱']},
 impact_types:['price','payment','cash-change-action','receipt','accounting','reported-knowledge','consumed-source-version'],
 direct_affected_units:[40,41,47],
 downstream:[{unit:41,quotes:[131,135,137,289,293].map(l=>quote(41,l)),required_change:'工40+料10=50；女主人拿50正好，去掉找两块的动作/母女转述；票据写料10/总50已收，归原主人；收支分列10和50、净劳务40。末段“今天门活那两块已找回主人”须改为本次门活付的正好，与下午个人零钱区别的自然表述，不能留下不存在的2元。'},{unit:47,quotes:[quote(47,132)],required_change:'回看本子料八改料十；40/41同步追踪中旧48改50。不增加新收款，抽屉18保持独立。'}],
 reread_tail:{from:40,to:48,combined_range:{from:35,to:48}},
 related:{ledger:['T_D_ROOM_DOOR_LOOK','F_AC_B_DOOR_PAYMENT','P_AC_B_NEW_DOOR_STRIP','P_AC_B_OLD_DOOR_STRIP','P_AC_B_DOOR_OFFCUT','T_D_CABINET_PHOTOS'],characters:['周岸','房门女主人','房门老人','女主人母亲'],tracking:['40/41/47 summary、timeline和现金动作','40材料先垫/未收主人款与41结清分开','客户/母亲知情实际时点','票据及引用新定位，证据不能只换SHA'],plans:['大纲/单元/0040.json','大纲/单元/0041.json','大纲/单元/0042.json','大纲/单元/0047.json','大纲/AC-B推进窗口-40-42.md','大纲/AC-C推进窗口-43-45.md','大纲/AC-D推进窗口-46-48.md','大纲/AC-D48-登记47后滚动细化.md']},
 source_strategy:{mode:'historical-versioning-required',changes:[['大纲/AC-B推进窗口-40-42.md',40,'拟料8改10'],['大纲/单元/0040.json',40,'报价、实付与小条8改10并移除找2动作要求（如有）'],['大纲/单元/0041.json',41,'继承料8改10，结账50且不找2；工40不变'],['大纲/单元/0042.json',42,'不重收41已收48改不重收50'],['大纲/AC-C推进窗口-43-45.md',43,'41实收48改50'],['大纲/AC-D推进窗口-46-48.md',46,'41实付48改50'],['大纲/单元/0047.json',47,'回看工40料8改工40料10']].map(([ref,from,change])=>({...source(ref),publish_from:from,planned_change:change})),unchanged:['大纲/分卷/V15.json','大纲/AC扩大骨架-37-48.md','全部设定/作者原话','39工费40的来源与正文'],historical_pin:{...source('大纲/AC-D48-登记47后滚动细化.md'),line:3,old_unit47_sha256:unit(47).sha256,decision:'保持该来源旧字节和revision212时的历史稿锚，不把旧SHA刷新成新SHA。它未写料8/总48，语义要求不变；48重登必须同时实读新47上下文。若根认为“当前稿”构成现行排他锚，则本项增加此来源V2：保留旧锚历史标签，另写新版回放事实锚；在47新登记后以真实字节做独立freeze/impact/stage/publish-from48，未决清零前不得执行/发布。不得预填未知新SHA。'}},
 unresolved:['根控制器尚未选择；7项来源的正式影响输出及所有required_readings尚未产生。','D48历史47稿锚的解释应由根在执行设计评审中确定；不能默默刷新旧锚，不能拿旧锚冒充新47。','当前F_AC_B_DOOR_PAYMENT的statement仍描述40未收，但其evidence含41结清；后续按实况重登/审查全部字段。现有reader_known可能补足，不能仅凭该statement判产品或剧情错误。']
},{
 id:'E_CTRL_44_WIDE_TOFU_COUNT',status:'proposed-not-selected-not-executed',unit:44,volume:'V16',path:unit(44).draft,current_sha256:unit(44).sha256,
 original_quotes:[68,70,84,88,199,214,253,312,353].map(l=>quote(44,l)),
 proposed_change:'沈禾当场要求从原两片豆干中留三条宽的，代替两条。44全章计数同步：先吃一条后母亲所见仍余两条；全章末仍吃一条半，但应余一条半。45对父亲转述及父亲询问改三条，姑娘夜里照原行动吃净所剩，不增购也不新增餐次。',
 proposed_excerpt:'“那我能留三条宽点的？”\n\n（44章末数量关系：三条宽豆干吃掉一条半，余下一条半混在软叶里。）',
 reason:'只是当餐份量/切法的普通选择，保留两片原料与分口味的关系收益；会影响盘中剩量和45转述，不以三项全换词充数。取44而非改冻存观察、芋头整块/半块的跨卷链。',
 protection_check:{observation:false,author_fixed_value:false,basis:['author-request.md','设定/人物与声音.md','大纲/分卷/V16.json','大纲/单元/0044.json','大纲/单元/0045.json','43—48完整分页'],protected:['43两片豆干2元/芹菜3元/两芋头6元与各自现金余5/9','原两片原料，不增买一片','芋头4完整块/余1整块/母半块及46父半块','45饭盒＋浅碟两物及沈自盒非借碗','47姑娘余5买3元豆腐余2、沈余9买4元饼余5','原衣/原纸/旧练针不改']},
 impact_types:['quantity','cutting-action','leftover-state','reported-knowledge','body-only-detail'],
 direct_affected_units:[44,45],downstream:[{unit:45,quotes:[quote(45,228),quote(45,230),quote(45,273)],required_change:'向父亲实际说三条、父亲问三条够不够；夜里所剩条数不写成半条，依44一条半与细条一起吃净。饭盒和浅碟仍为两种实物，不能为数量改动退回“两只空盒”。'}],
 reread_tail:{from:44,to:48,combined_range:{from:35,to:48}},
 related:{ledger:['T_AC_SHARED_MEAL','P_AC_C_MEAL_BOX'],characters:['许蓉女儿','沈禾','许蓉','沈成林'],tracking:['44/45剩菜分配和转述','T_AC_SHARED_MEAL如有数量摘要同步；无此数量不新造无关ledger对象','46只承接吃净事实、47自己的豆腐选择仍独立'],plans:['大纲/单元/0044.json','大纲/单元/0045.json','大纲/AC-C推进窗口-43-45.md','大纲/分卷/V16.json']},
 source_strategy:{mode:'body-only-sources-unchanged',changes:[],source_evidence:['大纲/单元/0044.json','大纲/单元/0045.json','大纲/AC-C推进窗口-43-45.md','大纲/分卷/V16.json'].map(source),reason:'执行纲固定的是原两片豆干、各自口味与实际剩食，不固定切成两条宽边；无需为了测试改来源。全部来源字节保持，重新取写前输入后以实际正文差量重登并连读44—48。'},
 unresolved:['根控制器尚未选择；三条在原两片中切出可行，但成稿必须自然调整切配及各人所剩份量，不作全文两→三替换。','44母亲询问段的计数时点应保留已吃完第一条这一先后关系；审查原段与新段的进食动作，不能只改最后合计。']
}];
const comparisons=[
 [34,'27日周六，8:30看同户门底，未拆未收；松椅20实收；第三洗工装未干；明日12:30/14点前日互告。','门约由26/33到现场仍受10点出门限制；36等新约、37重约。','周只见裂条/柜侧黑线，不能断内部；母女知各自工作与洗衣，沈旧8元书返自家、20未花。'],
 [35,'28日周日，姑娘12:30交班、14点同行；姑娘买12花册，沈18薄书未买且20未动。','25/27/33书约实际兑现，二人各自选；36才把售价告诉父母。','姑娘有实体花册，沈原8元书留家；父母不在书店。测试项一只动花册钱。'],
 [36,'母亲见花册听12/18；沈父听沈报12/18及看两张照片；第三洗衣周一干穿靠桌仍认角。','同行由计划变事实；书知识旧tracking修订已做；母新原纸等38老师实读。','老师此时未见周一新行；父亲没拿到姑娘实体书；新6—7练针未成学成。'],
 [37,'30日周二，母晚实交衣/原纸；周重约周四9—12未定价；姑娘和沈提出一次各做一菜并问厨房。','承接36有限用感，供38真实带衣；新饭约尚未买做。','母只许可一次；周未自动知饭约；旧20/18未改变。'],
 [38,'周三19—20:40第四课，原衣/三洗纸/原练布真到场；38未剪母袖。','33课外只看纸的限制到实看衣仍由主人选；抽屉漏回电承认后约18元周五交。','女17:40回家吃饭18:20出门18:50到，物不能同时两地；周备次日门。'],
 [39,'原衣回母，母试穿选择原样、老师建议有限；周四9点门工40、材料另议。','还衣与使用者决定兑现；沈先向老板问早半小时，待双方确认。','第一钉尚未出；柜图未齐；母/沈/周不跨场共享。'],
 [40,'旧加条拆成两段，小屑旧钉/新余头分开；获同意料8，周付10找2，主人尚未付款。','34待拆到40真拆；木况只限所见；材料条交主人待41结账。','工40不变、原门不承诺全冬不漏风；测试项二改材料/现金动作。'],
 [41,'实际试门/空盆/坐感仍有风，主人接受；付50找2，工40料8实收48。','门活当次有限结清；菜试煮不能算周一饭已做；母周一先吃歇。','收支分列8/48，净工40；下午另一枚零钱是自己。此处必须随项二连动。'],
 [42,'周五抽屉装好18实收10+5+3；双方预算女10/沈15，周六补2h，周日备父饭盒＋浅碟。','抽屉有限交付且来信有限；约定到双方真实承担，周一聚餐仍未发生。','父只提前试够取，不等于已热吃；眼镜目标/那恐怕已修；旧门款不得重收。'],
 [43,'周一女12点交班、沈12:30离；休过10分钟再买菜：女5元余5、沈芋头6元余9。','42父熟饭和浅碟由父文字证实已热吃，非沈远程亲见；买菜入户未开饭。','两片豆干2元、芹菜3元、两芋头6元；自家厚空盒随沈。'],
 [44,'分锅做吃，四整芋头块吃3留1，母另半块；两宽豆干吃1.5留0.5。','各自口味实际不同，母有限尝；剩食明确供45收与46热。','当餐切法非作者固定数；项三改宽条3、仍吃1.5留1.5，钱及芋头链不动。'],
 [45,'沈自盒装余饭＋1整芋头带回；姑娘两碗余菜晚吃净；盐罐复位、湿纸垃圾暂门边。','洗收实际有手腕/摆放代价；父饭盒＋浅碟已空，不是两盒；宽豆干向父亲转述。','沈知道父当日饭已吃/一馒头已吃需亲听；自己的厚盒不需虚构还碗。'],
 [46,'沈盒热饭芋头分父半块后自己吃余，洗空；女实际投门边垃圾/整理一层柜/母衣晚洗湿。','45剩食和家务真正完成，饭约有限resolved；母衣干湿尚待47。','厚毛巾/宽枕套/窄枕套位置有别；父要尝不等于喜欢软芋头、伤未好。'],
 [47,'周二新单3pm才从老板得知；女余5买3豆腐余2、沈余9买4饼余5；晚衣干短试仍碰。','自盒空返柜；母原纸空处添新话，旧字不改；周只回看门40+8/抽屉18不重收。','门料数字随项二；姑娘自家豆腐厚薄偏好不强跟沈；旧布未添针。'],
 [48,'38日周三母穿一日18:30交班；女19—20:40第五课新针拉皱/退新针重做，旧段保留。','课堂老师只见早前纸/早穿转述，母当日反馈女夜归才听并写回；周现有砂纸、空手休息。','沈余5/女余2未新花；母一点新余饭未吃；箱/柜图/复航/父史等未知不强结；不续49。']
].map(([unit,old_facts,payoff,knowledge_objects_cash])=>({unit,old_facts,payoff,knowledge_objects_cash}));
const verified=a.issues.filter(i=>i.status==='verified').map(i=>({...i,original_application_retained:true,recheck_obligation:({
 V_A_U5_TIME_METADATA:'原application是4—6 tracking，不是本轮新修。其原1—36报告会因35/36变旧：需另实读4—6当前正文/追踪并以当前有效报告覆盖本意见；只读35—48不能自称复核本意见。无需为复核rewind至4。',
 I_F19_TITLE_TIME:'原application仅19标题修复。原1—36报告会过期：另实读19当前标题与实际排班90分钟依据，当前报告覆盖19。不能重新改标题制造第二次application；本轮没有实读19全章。',
 I_X_DR36_BOOK_KNOWLEDGE:'原application为36 tracking，正文未改。项一改变数额后实读35/36当前正文、四人实际知情及新tracking，以新报告verify原应用效果；保留原commit和application。',
 I_AC_B_42_GLASSES_TARGET:'原42正文修复，实读42已是眼镜。35—48回放及来源绑定变化后用当前42报告核眼镜目标衔接，不再制造遥控→眼镜假修改。',
 I_AC_B_42_TYPO_KONGPA:'原42正文“那怕”→“那恐怕”已修。新绑定报告再核当前句，保留原应用历史。',
 I_AC_C45_MEAL_DISH:'原应用真正修改45，42/43是引用上下文，并非原应用覆盖42/43。用修改后当前42、43、45实读核饭盒＋浅碟，连35—48报告可覆盖；不再以第二次“修两盒”伪造闭环。'
})[i.id]}));
const nowInventory={};
function walk(dir){for(const d of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,d.name);if(d.isDirectory())walk(f);else if(d.isFile()){const b=fs.readFileSync(f);nowInventory[path.relative(root,f).replaceAll('\\','/')]={bytes:b.length,sha256:hash(b)};}else throw Error('Nonregular file '+f);}}
walk(root);
const mismatches=[...new Set([...Object.keys(a.inventory),...Object.keys(nowInventory)])].filter(f=>JSON.stringify(a.inventory[f])!==JSON.stringify(nowInventory[f]));
assert.equal(mismatches.length,0);assert.equal(hash(fs.readFileSync(path.join(root,'.writer/state.json'))),a.state_sha256);
const finalProof={at:new Date().toISOString(),project:root,state_revision:state.revision,registered_units:state.units.length,state_sha256:a.state_sha256,entry_checkpoint_files:a.checkpoint_files,entry_mismatches:a.mismatches,inventory_files:Object.keys(nowInventory).length,added_removed_or_changed:mismatches,scope:'AC project recursive byte inventory including installed tool and workflow; outside AC never written by this process; outside locations not rehashed'};
const finalLogs=['epre20-final-status','epre21-final-check','epre22-final-doctor'];
const cli=finalLogs.map(label=>({label,result:json(path.join(base,'cli-logs',label,'result.json')),stdout_sha256:hash(fs.readFileSync(path.join(base,'cli-logs',label,'stdout.txt')))}));
const p={schema:'ac-e-controlled-proposal-v1',generated_at:new Date().toISOString(),phase:'E-pre-read-and-design-only',status:'awaiting-root-controller-review',author_evidence:{verbatim:read(path.join(base,'author-request.md')),this_turn:'本轮只读及提出方案，可保存新报告/交接；不改正文、来源、workflow，不启动revision。',controller_variables_are_human_plot_quotes:false,root_selection_requires_no_new_human_plot_quote:true},project:root,baseline:{revision:216,schema:6,units:48,state_sha256:a.state_sha256,tool_generation:7,tool_content_id:'818438a541f3e518d5e88cd011e2e412df9ccd841390d243622164429726d265',tool_runtime_id:'2bbcca1280b6aef8d6d11762790f64ccb8dfaac5d1b377332f612c8484ab21b9',tool_note:'本次随附工具与安装工具实时核对，非联网最新版本或供应链签名。当前workflow仍46—48，未改。'},common_protection:commonProtection,proposals,chapter_comparison:comparisons,reading:{main_range:{from:34,to:48,chapters:15,pages:coverage.filter(c=>c.unit>=34).reduce((s,c)=>s+c.pages_read.length,0)},earlier_pages:coverage.filter(c=>c.unit<34).reduce((s,c)=>s+c.pages_read.length,0),coverage,recall_logs:['epre06-recall-book','epre08-recall-outing','epre09-recall-door','epre10-recall-coat','epre11-recall-fixed','epre12-recall-fixed84','epre13-recall-stool'],recall_limit:'recall仅定位，宽查询有omitted，不当完整检索；实际原文阅读范围以coverage为准。',source_read_scope:'七指定入口文件全部分页；当前随附writer技能/修订手册，相关35/36/40/41/42/44/45/47执行纲与X-DR、AC-B/C/D窗口，AC37—48骨架、V13/15/16、D48补充、33V2冻结源、权威/人物/文风。详见本轮FastCtx记录；未声称完整读所有来源。',uncovered:['1—32仅所列定向页面，非全书原文审查；4—6/19意见尚无本轮完整语义复核。','没有49授权和正文；未验证未写后果、真实市场/真人盲读或出版质量。','尚未产生正式source impact，未知其精确required_readings/replaced_ranges；执行前必须以真实输出追加实读。','未遍读全部历史审查报告正文、旧稿和每一旧源；已读当前意见索引并保留其application及verification引用。','未扫描或重新哈希AC之外封存/真实作品/源码；此进程未向这些位置写入。']},issues:{verified,open_optional:a.issues.filter(i=>i.status!=='verified'),actual_high_confidence_new_problems:[],actual_problem_conclusion:'在本次实际实读范围内，未发现可高置信认定的新连续性/错字硬问题。受控变量原值本身不是错误；不将所有未覆盖范围判无错。',human_language_hard_problems:'没有',optional_style:'否定式护栏旁白、归物坐歇和备餐流程局部重复，已有open意见；本轮不自动采纳、不修正文、不记为新硬问题。',current_verified_count:verified.length,reverification_is_not_second_application:true},execution_design:{executed:false,revision_started:false,new_chapter_authorized:false,source_protocol:[
 '根控制器先在原总授权内选择三项或部分；选择写为controller decision，不能伪造成真人逐项指定金额。当前纯预读没有扩充workflow或占用修订区。',
 '如执行三项，最早正文35、回放35—48，34及更早正文/units保持。由根在实际执行阶段按真实授权把有限revise范围设35—48；不扩draft到49。不因原4—6/19意见的复核把rewind无关提前。',
 '每个需改来源先核当前消费哈希与真实旧字节一致；freeze旧字节，baseline impact审查、publish原区间，再按等价哈希bind旧消费者。保留作者原话、历史文档、旧模板/审查/事件；不批量刷新旧source_hashes。每步重读revision，唯一operation_id。',
 '在AC另建候选来源，freeze新版并previous指旧版。historical impact给出直接消费者/保守尾段/replaced_ranges/required_readings，实读所有必需字节及正文后写独立带读源SHA的审查，未决项非空不stage/publish。不能用本预读报告冒充尚未产生的impact审查。',
 '在主项目source stage持久记录impact-pending，保存id和审查SHA。随后根才开独立revision；所有写操作仅在其workspace带token，rewind35。新源按原请求起点publish：36两项、40两项、41/42/43/46/47各一项；不得为了保守回读把新版提前到35。此前前缀仍取旧版。第44项本身不新增来源改动；三项组合时，共享AC-C窗口仅因第40项的门款变化走新版，豆干相关来源约束保持。',
 '若D48锚被认定需新现行版本，先保留旧历史锚；在47新稿与登记事实确定后另走来源冻结/影响/暂存/发布48，按届时revision/token和工具实际接口执行，未决未清不得越过。不能预造新稿哈希，也不能直接刷新历史锚。',
 '逐章重取真实context/record-template，旧正文无须变处保留原字节，重登以真实summary/characters/timeline/ledger/evidence/downstream差量；每章preview/record。所有消费来源绑定用正式解析版本，任何source变化都要审查，不能仅换哈希。',
 '全部回到48后完整分页连读35—48当前最终字节，并针对6条verified意见做所需前缀实读/当前报告核验。原application保留，verify只说明当前证据效果；不再apply假修改。若前缀未实读或报告范围不足，如实待复核。',
 '运行当前工具status/check/doctor，核所有pending、已知旧稿、滚动覆盖、意见和来源；prepare差异逐项核33V2/observations/旧款/1—34无变，再由根按授权commit独立修订。任何阶段未通过保持候选，不称已验收/发布；本轮不执行这些步骤。'
 ],acceptance:['三处旧事实与所有直接下游一致，尤其41无幽灵2元/47不重复收款、44/45三条的进食余量闭合。','35—48全尾段语义实读与当前SHA报告、依赖改变但正文未变的报告也重核。','原33V2绑定、旧观察三字段、80/35/81/84及人物限知均保持。','6条verified意见原application不覆盖/不重造；新报告覆盖真实evidence范围。','无active事务/impact-pending/遗漏尾段/未决来源锚后才可称此修订验收完成。']},cli_final_evidence:cli,immutability:finalProof,auxiliary_failures:[{kind:'local-output-parsing',description:'广泛recall输出显示被截断的Warning前缀导致一次辅助JSON解析失败；CLI本身exit0，改读完整stdout文件。'},{kind:'local-summary-command-syntax',description:'一次node -e汇总多余右括号，exit1；随后修正只读汇总成功，无产品命令失败或状态变动。'}],handoff:'交接-E提案.md'};
for(const item of proposals)for(const q of [...item.original_quotes,...item.downstream.flatMap(d=>d.quotes)])assert.equal(lines(q.unit)[q.line-1],q.verbatim);
function writeNew(name,text){fs.writeFileSync(path.join(base,name),text,{flag:'wx'});}
writeNew('e-final-readonly-proof.json',JSON.stringify(finalProof,null,2)+'\n');
writeNew('e-proposal.json',JSON.stringify(p,null,2)+'\n');
const md=[];const add=s=>md.push(s);
add('# E受控修订提案\n\n状态：预读与设计完成，待根控制器审查；三项均未选择、未执行。没有revision、source freeze/stage/publish、workflow修改或49章写作。所有金额/数量候选均为控制器试验值，不是人类作者新增剧情原话。');
add('## 当前基线与范围\n\nAC独立副本：`'+root+'`。state r216/schema6，已登记48章，SHA `'+a.state_sha256+'`。七个指定入口文件已完整读完；当前随附generation7工具与安装工具指纹一致，content `'+p.baseline.tool_content_id+'`，runtime `'+p.baseline.tool_runtime_id+'`。D交接中的generation6是历史，不据此降级。本次“最新”指AC随附活动工具，不指网络版本。');
add('首尾status/check/doctor正常；最终check仅25条已知UNREGISTERED_DRAFT旧稿提示，valid22/stale31且31均有当前覆盖，stale_without_current_coverage=0，pending_windows与unpublished_records为空；changed_sources为空，doctor errors/warnings为空。原workflow仍为46—48，不能把该旧范围当作35—48当前写授权入口。CLI原输出保存cli-logs，不以终端截断替代全文。');
add('本轮当前34—48共15章、114页完整分页实读；更早定向实读'+p.reading.earlier_pages+'页，其中33章7页全读。read-pages JSON保存每页原文、文件SHA、页码和输出哈希。下表与JSON列出的页是实际阅读；辅助脚本只校验页覆盖和字节，不能代替语义实读。');
add('## 保护边界\n\n'+commonProtection.map(t=>'- '+t).join('\n'));
add('## 逐章旧事实、回收与限知核对\n\n|章|现行事实|后来回收/承诺|人物所知、物件与款项|\n|---|---|---|---|\n'+comparisons.map(c=>`|${c.unit}|${c.old_facts}|${c.payoff}|${c.knowledge_objects_cash}|`).join('\n'));
add('## 三项候选\n\n选35/V13、40/V15、44/V16，起点间隔5章与4章，跨不同后续卷；三项组合只需从35回放，不为测试把无关前缀重登。原事实均可成立，本轮并未发现“必须把12/8/两条纠正”的错误。');
for(const item of proposals){
 add(`### ${item.id}\n\n原章${item.unit}，${item.volume}；路径 \`${item.path}\`；当前SHA \`${item.current_sha256}\`。\n\n建议：${item.proposed_change}\n\n理由：${item.reason}`);
 add('原文逐字摘录（行号按当前稿，保留全文SHA）：\n\n'+item.original_quotes.map(q=>`- 第${q.unit}章第${q.line}行：\n\n> ${q.verbatim}`).join('\n\n'));
 add('拟改示意（仅报告文本，未写入作品）：\n\n'+item.proposed_excerpt.split('\n').map(l=>'> '+l).join('\n'));
 add('直接下游：\n\n'+item.downstream.map(d=>`- 第${d.unit}章：${d.required_change}\n\n${d.quotes.map(q=>`  当前第${q.line}行：${q.verbatim}`).join('\n\n')}`).join('\n\n'));
 add('影响类型：'+item.impact_types.join('、')+'。直接受影响章：'+item.direct_affected_units.join('、')+'；单项尾段'+item.reread_tail.from+'—48，组合必须完整实读35—48。\n\n受保护项核查：不是immutable observation，现有作者原话/设定/卷契约未固定此试验数值；依据'+item.protection_check.basis.join('、')+'。保持：'+item.protection_check.protected.join('；')+'。');
 add('相关追踪：ledger '+item.related.ledger.map(x=>'`'+x+'`').join('、')+'；人物 '+item.related.characters.join('、')+'；'+item.related.tracking.join('；')+'。相关计划：'+item.related.plans.map(x=>'`'+x+'`').join('、')+'。JSON保存相关来源SHA与原消费者哈希，后续仍须按正式impact核实。');
 if(item.source_strategy.changes.length)add('需正式版本化的已消费来源：\n\n|来源|当前SHA|现有直接消费者|新版生效起点/改动|\n|---|---|---|---|\n'+item.source_strategy.changes.map(s=>`|${s.ref}|\`${s.sha256}\`|${s.direct_consumers.map(c=>c.unit).join(',')}|${s.publish_from}；${s.planned_change}|`).join('\n'));
 else add('来源保持：'+item.source_strategy.reason+'\n\n'+item.source_strategy.source_evidence.map(s=>'- `'+s.ref+'` SHA `'+s.sha256+'`').join('\n'));
 if(item.source_strategy.historical_pin)add('D48历史锚：'+item.source_strategy.historical_pin.decision);
 add('未决项：\n\n'+item.unresolved.map(t=>'- '+t).join('\n'));
}
add('## 后续执行设计（本轮未执行）\n\n'+p.execution_design.source_protocol.map((t,i)=>`${i+1}. ${t}`).join('\n\n'));
add('source基线和新版分开：原35价格变化从35正文开始，但需要改的来源首次消费是36；门源分别从40/41/42/43/46/47开始，不能统一发布到35。冻结/基线绑定只绑定真实旧字节，后续branch正式重登才产生新消费哈希。原计划里的“保护前36/不改旧来源”是当时续写范围指令，应保留其历史字节；当前受控修改范围由根依原总授权明确记录，不能偷改历史作者原话或治理文档来规避。');
add('## 已verified意见与原application\n\n当前索引19项，其中6 verified、13 open可选。下列只复述现有状态，不在本轮做verify/apply。结构化JSON保留每项原application（commit/事务、change_scope、changes、after_units）和原verification引用。');
for(const i of verified){add('### '+i.id+'\n\n原问题：'+i.statement+'\n\n原application commit `'+i.application.commit_id+'`；原change_scope：`'+JSON.stringify(i.application.change_scope)+'`；原after_units：'+i.application.after_units.map(u=>u.unit).join('、')+'。原验证报告 `'+i.verification.review_ref+'`；范围 '+Math.min(...i.verification.units)+'—'+Math.max(...i.verification.units)+'。\n\n改动后义务：'+i.recheck_obligation);}
add('这6条当前有效、context_changed=false，是现行索引状态；改稿后是否继续verified要按当时当前报告和证据覆盖核实。本提案不是正式review，也不把已有application覆盖虚增为本轮修复。尤其C45原应用仅改45，42/43属于参照；须保留其先前未真实应用/延后/实际修复的审计历史。');
add('13条open可选意见（保留原意见，不当本轮授权修订清单）：\n\n'+p.issues.open_optional.map(i=>'- `'+i.id+'`：'+i.statement).join('\n'));
add('## 实际高置信问题（与试验变量分开）\n\n'+p.issues.actual_problem_conclusion+'\n\n### 真人语言别扭句\n\n真人语言硬问题：没有\n\n可选风格偏好：'+p.issues.optional_style+'\n\nF_AC_B_DOOR_PAYMENT的简短statement仍停留40，但含41证据；没有脱离reader_known/快照就判它是剧情错误。此次金额方案要核所有字段，不借此制造硬问题。');
add('## 实读证据与未覆盖\n\n|章|当前路径|SHA|已读页/总页|\n|---|---|---|---|\n'+coverage.map(c=>`|${c.unit}|${c.path}|\`${c.sha256}\`|${c.pages_read.join(',')} / ${c.pages_total}${c.full?'（全章）':'（局部）'}|`).join('\n'));
add('recall原输出：'+p.reading.recall_logs.map(x=>'`cli-logs/'+x+'/stdout.txt`').join('、')+'。更早原文实读包括15购8元原册、25同行邀约/母衣原用感、26周六8:30看门原约、27确认班/母用感、33纸/衣/老师/书约全章，以及2/10/11/21旧款相关页。固定80的本轮所读2章p3是原借具条，不冒称重新读过全部退押金流程。\n\n'+p.reading.source_read_scope+'\n\n未覆盖：\n\n'+p.reading.uncovered.map(t=>'- '+t).join('\n'));
add('## 只读核验与停点\n\n入口checkpoint的'+a.checkpoint_files+'文件全部匹配；对AC作品目录含安装工具、workflow、正文、来源的'+finalProof.inventory_files+'个文件做前后字节/SHA清点，新增/删除/修改均0；state始终r216/48章。证据 `e-preflight-audit.json` 与 `e-final-readonly-proof.json`。本轮新报告/脚本、read-pages和cli-logs均在AC证据根下，位于作品目录外。未对AC外作写操作，也未声称对AC外做完整前后清点。\n\n两次辅助失败已保留：一次读取截断显示导致辅助JSON解析失败；一次汇总命令多余括号，修正后成功。产品只读命令正常，作品无变更。没有运行npm测试，因为未改产品工具；状态/完整性检查不能当修订验收。\n\n停止于提案；等根控制器检查。根可在原授权范围选择控制方案，不需要伪造真人作者原话。本轮没有完成修订、没有发布，也没有新增49授权。');
writeNew('E受控修订提案.md',md.join('\n\n')+'\n');
writeNew('交接-E提案.md',`# E提案交接\n\n实际状态：预读与方案已保存，等待根控制器检查；未选择试验方案、未revision、未写正文/来源/workflow、未写49。\n\n项目：\`${root}\`。r216/schema6/48章，state SHA \`${a.state_sha256}\`。当前随附generation7，content \`${p.baseline.tool_content_id}\`，runtime \`${p.baseline.tool_runtime_id}\`，不回退到D历史generation6。\n\n当前34—48完整114页；33全7页及更早定向页面共${p.reading.earlier_pages}页。真实页记录见e-proposal.json reading.coverage与read-pages。实读范围内没有高置信新硬问题；三处受控变量不等于错误。6 verified原application和13 open可选均保留，未执行复核登记。\n\n候选：\n\n1. E_CTRL_35_FLOWER_PRICE，V13第35章：姑娘花册12→14，36父母实际告知/知识同步；2个已消费来源需正式版本化。\n2. E_CTRL_40_MATERIAL_PRICE，V15第40章：料8→10，工40不变；41总50且两次找零动作消失，47账目同步；7个已消费来源版本化，另有D48历史47SHA锚解释待根定。\n3. E_CTRL_44_WIDE_TOFU_COUNT，V16第44章：两宽条→三宽条，同两片原料，已吃1.5则余1.5；45转述/剩量同步，来源保持。\n\n详细逐字原文、当前SHA、消费者与生效点、人物/物件/钱款、受保护项、逐章比较和意见复核义务，见E受控修订提案.md与e-proposal.json。\n\n根若选三项，后续真实执行最早rewind35、回放并完整连读35—48。源修改先旧字节freeze/baseline/等价bind，再新版本freeze/impact/实读审查/stage；修订区rewind后在相应36/40/41/42/43/46/47起点publish，不刷新旧哈希。正式impact.required_readings尚未产生，本报告不能冒充那份审查。D48旧锚不静默刷新，若必须新增现行版本，在47新事实确定后另走48来源协议。\n\n现有workflow只许46—48，本轮未动；根执行时依原总授权记录有限35—48修订范围，控制器选择不充作作者新增剧情原话。35以前前缀保持，包括33V2。4—6/19旧意见若要新的verified结论需另实读，不能用35—48范围假覆盖，不必为此rewind到4。\n\n首尾status/check/doctor正常；25已知旧稿提示保留，滚动审查没有未覆盖缺口。AC项目${finalProof.inventory_files}文件前后字节无变化，入口${a.checkpoint_files}文件匹配，证据e-final-readonly-proof.json。两次辅助输出处理/命令语法失败保留，非产品失败；未修改工具，无npm测试需求。\n\n本轮只读提案不是已完成修订或正式验收。停止，不写49，不发外部消息、不提交推送；等根检查。\n`);
console.log(JSON.stringify({written:['e-final-readonly-proof.json','e-proposal.json','E受控修订提案.md','交接-E提案.md'],main_pages:p.reading.main_range.pages,earlier_pages:p.reading.earlier_pages,verified:verified.length,open:p.issues.open_optional.length,project_files:finalProof.inventory_files,changed:mismatches},null,2));
