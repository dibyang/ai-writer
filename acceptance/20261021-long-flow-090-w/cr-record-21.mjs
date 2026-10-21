import fs from 'node:fs';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const p='scenario/东岸末班船-规模验证/',sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const s=JSON.parse(fs.readFileSync(p+'.writer/state.json'));assert.equal(s.revision,87);
const before=JSON.parse(fs.readFileSync('cr-start-state.json'));assert.deepEqual(s.units,before.units);
const x=JSON.parse(fs.readFileSync(p+'.writer/drafts/w-cr-record-template-21-v2.json'));delete x._instructions;delete x.output;
const draft=fs.readFileSync(p+x.draft),text=draft.toString('utf8'),ev=quote=>{assert.ok(text.includes(quote),quote);return{unit:21,quote}};
const body_Han=(text.replace(/^#.*\r?\n/,'').match(/\p{Script=Han}/gu)||[]).length;assert.ok(body_Han>=8000);
x.summary='第十三日周岸实从18散端收正、接长撑紧固装面找平试坐，失去一笔要中午拿的急活；午前实交廖，60工+24料合84付收，另付面钱金额未写。28厘米窄凳实际双人/客坐，雨披水泥、顾客伸脚、雨斜入，廖往墙里挪并将葱筐案边移案下，擦收/摘葱位置付代价，靠背椅保留。沈晨经父亲手接袋，女从窄桌带针盒并当面告母，店内沈转父许可，上午忙改一点再来。女仅按一课所学平铺短线收尾合白褶小段，厚处退针、四提带接头未动/毛点留，针剪线收妥，袋返沈。沈按20新布工序收干布、营业内抽时，16点下班按约带女赴家取自己的八元旧画册，父收到消息/介绍才见她。父亲接回袋亲看补针，后装眼镜盒/报纸提换椅另一侧再取用，地湿不下楼脚仍垫。画册实借女包带离，本章首度约后天下午三点在糕店归还，尚未兑现；母衣未补/第二课未上，22未写。';
x.changes={characters:{
'周岸':'承前物件与账目；第十三日从未紧端架收正、接长撑装面并找平，实际双人试坐；因制凳没接中午要拿的锄柄急活。交廖真收84且面钱另付未写数额；亲见早段客坐/水印后返铺，不知后来廖移葱筐与伸脚客，不知沈家借书/袋修。',
'面摊主':'第十三日亲收成凳、端水锅与周实试通道，付工60加垫料24合84，面钱另收。周走后自己接客擦泥水，雨斜进把凳往墙里挪、葱筐移案下，盆仍水槽下、靠背椅保留；摘葱位被挤，有实际清擦与起坐代价。未知沈家/修袋女事。',
'许蓉女儿':'仅一课平铺短线收尾，母工装仍柜、未补第二课未上；第十三日从窄桌带针盒，当面告母去沈店看父袋，上午听沈转父许可，忙先离/回家饭买豆腐、一点再来。实际只缝白褶松小段，厚处退针毛点留，针脚不齐、自己收针剪线，没修提带。四点按约与沈同行首次到沈家经介绍见父，听父认针、实借沈画册装包带离，答后天下午三点糕店还且手机记下；返还尚未来。只知道眼前沈店/家有限事实，不知周廖凳或老何私事。',
'许蓉':'承13报名、18首课归家有限转述及工装还自己柜，19见练布结；第十三日当面听女去糕店看沈父袋，提醒不要挡生意/答留饭，收女回家午饭消息并请带豆腐。不亲见店缝补、沈父见面或画册约，不倒填她知道课堂所有操作。',
'沈禾':'承19/20班时休息与少卖、新布、父伤脚、画册八元等；第十三日晨亲接父浅蓝袋带店转告许可，自己的饭袋已干装饭，十一点收昨天两新布，上午店忙与女改一点。亲见女只补袋白褶小段、厚处退针、接头毛点未改，收袋未付钱，糕没塞成自己下午吃。16点正常走，事先发父消息并带女取自有画册，回家还袋父说明限制；书实际由自己床头衣下取、白纸书签随借，约后天下午三点糕店还未兑现。听女说昨日零头布颜色不合，不以自己亲见购买结果；未知周廖新凳当日事。',
'沈成林':'仍伤脚坐椅垫小凳；第十三日早亲递袋给沈带看，仅听姑娘一课愿看旧信息。下午读沈消息并答知道，经介绍首次见姑娘；亲接修后袋、看白褶新针听厚处/提带未动，直说针不齐但合住。亲在家装眼镜盒报纸提换椅侧再取用，因地湿不下楼；在场听借沈自有画册/后天下午三点糕店还，不掌握店内修针全过程与课堂全貌。',
'谭老板':'第十三日店忙时亲见女来找沈/纸袋、腾矮板避开切糕板，沈十一点收昨日干透新笼布；下午营业中让出一小段修袋时间，约一点女来，自己误听汤/添错糕后拿出，沈吃完接台自己短歇。只知道店内及沈下班走，不知道沈父家实借画册、袋轻用/课堂细节。'
},timeline_append:[
'第十三日星期六清晨至九点：沈从父椅旁亲接浅蓝袋带店、用已干自有饭袋。周收正余端/连撑装面找平双人实坐，未接急锄柄小活，约十点后送凳。',
'第十三日九点后至十一点：许女从家携盒当面告母，在店听父许可，上午忙湿暂离、回家饭买豆腐约一点；沈十一点收20两新布，小雨始。',
'第十三日中午前至近一点：周实交成凳廖、84付收且面钱另付，客真坐；雨大周返，廖因雨/菜袋/脚挪凳移葱筐/擦水，椅保留盆原位。',
'第十三日一点：女再来仅修白褶小段、厚处退针、收妥针盒返袋沈；误认画册照片触发借书兴趣，约四点店口往沈家取，沈先消息父。',
'第十三日16点下班后：女取鞋后赴店按约与沈同路，由沈介绍父；父接修后袋，沈取自有画册实际借出，双方首约后天下午三点糕店归还。父后轻装眼镜盒报纸换椅侧再取用，地湿不出门，晚饭仍按食量煮。'
],ledger:{
T_W_NOODLE_STOOL:{status:'resolved',reader_known:'21从18未成架真实完成装面坐试、交廖营业使用，84真实付收；雨天还须收脚擦收/移筐挪凳，靠背椅不替代。有限首次交付完成不代表后续免维护。',character_known:{'周岸':'亲完工试坐交付收84、见离开前客坐水印；不知自己走后廖挪筐。','面摊主':'亲收/付/营业坐挪，承担雨水泥和改变摘葱位后果。'},evidence:[ev('第二副端架紧好'),ev('四只脚终于都落住'),ev('收到钱夹里'),ev('葱筐从案边换到案下')]},
P_W_STOOL_MATERIALS:{status:'active',previous_holder:'周岸',reader_known:'原受托旧板/干料已成90长28宽约44高窄凳，21实际交廖并营业使用；84结清，周纸样柜、料票原本不随交付。',character_known:{'周岸':'亲做并交，已收84，纸样柜/票本保留。','面摊主':'亲接成凳并付款，后实际擦收内挪/移筐。'},custody:{holder:'面摊主',location:'面摊内更靠墙处；盆水槽下、葱筐案下、旧靠背椅仍内侧',condition:'21真完成端架/长撑/装面/找平/双人试坐后交付；净宽28；客已坐，雨天擦水/往里挪有代价，84实结，不保证长期耐久'},evidence:[ev('才把九十厘米长的凳子转过来靠墙放好'),ev('凳面净宽二十八厘米'),ev('八十四元放到桌角'),ev('他没有把凳子再搬回原来那一线')]},
F_W_STOOL_WIDTH:{reader_known:'17首定净宽28的普通设计事实在21装面手位、坐端锅收脚、雨天内挪/移葱筐真实约束；不是observation、不是故意错误。',character_known:{'周岸':'按净宽28做完，亲见实坐端锅要收脚。','面摊主':'亲受宽约束，日内挪放仍要移葱筐/收脚。'},evidence:[ev('凳面净宽二十八厘米'),ev('行。还是得脚往里点。'),ev('葱筐从案边换到案下')]},
P_W_CURTAIN_BAG:{previous_holder:'沈成林',reader_known:'21晨父亲手递沈→店中女修松白褶小段返沈；16点后女途中短拎装袋纸袋、随沈回家，沈取袋交父；父已轻装眼镜盒/报纸提移再取用。厚处/四带未改，毛点还在，末空干留椅旁，仍父所有。',character_known:{'沈禾':'亲携/看修/带返交父、见轻用；知道小修限度不保证耐久。','沈成林':'亲递出和接回，看针听未修厚处，自己轻用；不知每针过程。','许蓉女儿':'亲补平处/厚退针，见父接，带离的是借画册和自有针盒，布袋已归父；未见离后父椅侧轻用。'},custody:{holder:'沈成林',location:'沈家父亲椅旁伸手可够处',condition:'21袋口松白褶小段已补、针脚不齐/毛点留；四带接头未改/袋身好，未重洗，父轻装眼镜盒报纸提移后取出，末空干，父脚仍垫凳'},evidence:[ev('父亲拿起看了一眼，递给她'),ev('她停下，将针退回来'),ev('白褶不再张着一小片'),ev('父亲自己接过去'),ev('盒和报纸放进浅蓝布袋'),ev('父亲从袋里拿出眼镜盒，又抽报纸')]},
T_W_BAG_EDGE_REPAIR:{status:'resolved',reader_known:'20拟看已由21有限修白褶小段、返父亲看轻用真实兑现；厚处未穿、接头无改、毛点留，耐久未验证。',character_known:{'许蓉女儿':'亲完成小修/厚退针后返沈、见父接纳，不承诺几天不松。','沈禾':'见小修并返父，厚处和提带未动。','沈成林':'亲看新针与使用，听沈说明限制。'},evidence:[ev('我不知道用几天会不会又松'),ev('沈禾跟他说厚处没有动，提带接头也没动'),ev('新缝的白褶没有张开')]},
T_W_EVENING_CLASS:{status:'partial',due_unit:24,reader_known:'18首课是唯一已上课，21平铺短线收尾第一次助别人小修；母工装未剪补、第二课未上。有限所学实际用到，不把总学习计划标全结。',character_known:{'许蓉女儿':'首课小布保留、带针真实小修，只到平处/收尾，厚处不行。','许蓉':'只亲听女今日去看沈父袋，仍不知课堂完整内容和本次补后/借书。','沈禾':'亲看姑娘平铺短线/收尾与厚处退针，知道学习有限，未亲见首课。','沈成林':'亲见补后不齐小针而非课堂，听沈有限转述，接纳小帮助。'},evidence:[ev('小的这里还能看见原来的针眼。这里厚的，我不弄。'),ev('另一只手压平布'),ev('结贴住了'),ev('母亲的旧工装仍在衣柜里，她没有再拿')]},
F_W_CLOTH_ROTATION:{reader_known:'20少加一笼/少卖四份历史不改，21十一点收实际两新布入干净格、按新营业量，不认为昨日少卖损失被修袋抵消。',character_known:{'沈禾':'亲收干两布，营业中抽时/午饭后接台老板短歇。','谭老板':'亲与沈按新日量经营，不包永远休息时间固定。'},evidence:[ev('她从晾绳上收下昨天洗的两幅新笼布'),ev('替自己守十分钟')]},
P_W_PICTURE_BOOK:{type:'object',statement:'沈禾15自购八元旧画册，21实际借给许蓉女儿，白纸书签随书',status:'active',cast:['沈禾','许蓉女儿','沈成林'],tags:['画册','自有兴趣','借阅'],due_unit:24,reader_known:'21自沈床头衣下取出，实际交女翻看后入女包带离，未归还。所有沈，父未代送。',character_known:{'沈禾':'书原价八元自购，亲取借出/见带离，白纸随书。','许蓉女儿':'亲翻入包带离，按本次约定暂借，不当修袋报酬。','沈成林':'在场见沈借出，不是自己所有物赠人。'},custody:{holder:'许蓉女儿',location:'姑娘随身包内，沈见其护到伞下离开',condition:'沈自有旧画册/夹干净白纸，实借未归；未混鞋袋/针盒未遗落'},evidence:[ev('八块钱买的旧书，在电影院旁边那家'),ev('书压在床头那叠干净衣服下面'),ev('她把书装进自己包'),ev('看她将书包护到伞下')]},
F_W_BOOK_RETURN:{type:'fact',statement:'21首度当面约定画册于后天下午三点送到糕店归还沈禾，女答应并手机记录，实际归还尚未发生',status:'active',cast:['沈禾','许蓉女儿','沈成林'],tags:['普通约定','画册','未来真实承接'],due_unit:24,reader_known:'是本章首度真实成立的普通非observation约定，沈按原安排16点下班可在15点接；22—24待实际归还或有因果改约，不提前登记兑现/不故意写错。',character_known:{'沈禾':'亲提出后天下午三点糕店、听答应；尚未收回。','许蓉女儿':'亲答三点记手机，拿书离开；后天班后拟还。','沈成林':'在场听约并见借出；许母周廖老板未获此消息。'},evidence:[ev('后天下午三点，送到糕店给我，行么？'),ev('行，三点。我下班过来。'),ev('姑娘用手机记了一下')]}
}};
x.draft_review={reviewer:'W-C续程实际写作模型知情完整章实读自检',report:'审查/0021-W-C续程完整章自检.md',draft_sha256:sha(draft),report_sha256:sha(fs.readFileSync(p+'审查/0021-W-C续程完整章自检.md'))};
fs.writeFileSync('inputs/cr-record-21.json',JSON.stringify(x,null,2)+'\n',{flag:'wx'});
const assembly=JSON.parse(fs.readFileSync('inputs/cr-assemble-21-v4.json'));const comparisons=assembly.parts.map(q=>{let n=q.path.split('/').at(-1),a=fs.readFileSync('originals/cr-parts-21/'+n,'utf8'),b=fs.readFileSync(p+q.path,'utf8');return{path:q.path,original_sha256:sha(a),current_sha256:sha(b),original:a,current:b,changed:a!==b}});
fs.writeFileSync('cr-corrections-21.json',JSON.stringify({scope:'only unregistered chapter21',originals:'originals/cr-parts-21',first_assembly:'originals/cr-assembled-first.md',final_assembly:x.draft,parts:comparisons},null,2)+'\n',{flag:'wx'});
fs.writeFileSync('cr-draft-21-manifest.json',JSON.stringify({revision:s.revision,draft:x.draft,draft_sha256:sha(draft),body_Han,all_Han:(text.match(/\p{Script=Han}/gu)||[]).length,parts:assembly.parts.map(q=>({...q,body_Han:(fs.readFileSync(p+q.path,'utf8').replace(/^#.*\r?\n/,'').match(/\p{Script=Han}/gu)||[]).length})),draft_review:x.draft_review},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({body_Han,draft_review:x.draft_review,ledger_ids:Object.keys(x.changes.ledger)}));
