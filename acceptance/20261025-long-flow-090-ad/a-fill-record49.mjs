import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url));
const root=JSON.parse(fs.readFileSync(path.join(base,'project.json'))).project;
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const original=JSON.parse(fs.readFileSync(path.join(root,'.writer/drafts/ad-a-record-template-49-original.json')));
const context=JSON.parse(fs.readFileSync(path.join(root,'.writer/drafts/ad-a-context-49-before.json')));
assert.deepEqual(original.source_hashes,context.source_hashes);assert.deepEqual(original.source_bindings,context.source_bindings);
const input=structuredClone(original);
delete input.output;delete input._instructions;
input.draft='正文/0049-柜角那盏灯-ad-a-v2.md';
const body=fs.readFileSync(path.join(root,input.draft),'utf8');
assert.equal(sha(body),'07b42624e104a0d3507c916610e3fe492cd926592bb58c7f9e3302c0a83f3c5f');
assert.equal(JSON.parse(fs.readFileSync(path.join(root,'.writer/state.json'))).revision,265);
const ev=(...quotes)=>quotes.map(quote=>{assert(body.includes(quote),'Missing real quote: '+quote);return{unit:49,quote};});
input.summary='第39日周四：许为自己抄戏词的桌边光想用旧灯，亲问原杂货店，约十一点左右实际提去，将灯/线/插头留店柜内，取留物条，约明午后先问、任何费用先联系本人；无诊断修价付款取回，空宽袋带回/护纸垫灯。午后睡、16点这班、来人亲指两份表的前后完成该签，何17:15告眼镜已取不迟、18:30实接页钥匙；何只听许有限送灯话。沈父想未洗幅别同已洗幅差太多，父女晨谈休息与收挂限制；沈实际问周日，谭等早取数未准，约周五午前答；沈消息/晚饭才讲给父，仍未拆洗、脚凳杖。母女夜读留物条，共小灯母抄词女读14册，女实说锣声打断，母关声写已知，女继续读/移自己夹纸后取自灯回房；母信封归枕旁听戏。沈家父已关饭火、女煎蛋实吃，晚再谈帘不预许，女取原8册读叶/原白纸仍原处，无新饭/书约。柜本章未出场，无新图或本人答复。';
input.changes={
 characters:{
  '许蓉':'周四为自己抄戏词想用原旧灯，亲拍照问杂货店、约十一点左右实际带去，原灯线插头留柜内靠墙格，护纸垫灯/空宽袋带回；收留物条本人持，约周五午后先发字问，任何费用先问，无诊断/支付/取回。午后睡、16点到班，来人亲摆两纸/签本处，何17:15告可准时、18:30亲交页钥匙，才口述灯给何。袖肘靠桌原厚处仍在，未拆改。夜亲给女看条取回，借女小灯共桌，抄自己旧信封背戏词，未辨两字留空/另抄候选不作确定；女说反复锣声扰读后关声写，女取灯回房；信封放自己枕旁再听。原反馈纸未取用，不知沈家帘/柜全程。',
  '许蓉女儿':'周四早听母需灯/助拍照但母自己问送；布原纸针盒留桌内、今天未添针。文字听母灯已留店、约明午后问，晚亲读留物条再交回，未亲见店内交接/检修；知母只问新灯价未买。夜与母共自有小灯，读自14元花册黄枝/留白，原夹纸不作反馈纸；实说反复锣声打断，母关声后自己继续看，移自夹纸至停页，拔自灯带回房。无新课堂/朋友书约，老师未获48夜新反馈。',
  '老何':'周四16点把当日页/来人号码向许交代；想桥后取眼镜或迟十分钟但17:15实告已取可原时到，18:30实接页钥匙，听许说两纸前后与已签本处；当面问眼镜外观。此时才听许上午把搁久灯送杂货店仍留，知家小灯暂借，不知全部留条/费用/母女晚共灯或沈家。',
  '沈禾':'周四晨父问未洗另一幅，自己先急后问动机，拉半幅父调光，脚凳杖仍在；说想读书休息而不许洗日。午间真问谭本周日半日，早取量未准，12:30后只候选，谭下工时约周五午前给准话；发父今天未定、夜再讲细节。晚路上电话亲听父淘米下锅，归家见已关火，女煎现蛋/咸菜配饭实吃，无新采购，余5未动。父仍想洗又承认不能爬收，女不预允；拿自8元册回房从昨叶再读两页，原白纸原处不改用途，无书/饭新约，不知许送灯全程。',
  '沈成林':'周四晨仍伤脚垫凳/杖旁，只想未洗幅别同已洗的差太多，知旧印不必重洗；与女谈午后洗提议但无准日，白天只在可及处将半幅再带一点调报纸光。消息知女已问但未定，晚才听谭等周日早取数/明午前答。自电话说淘米开锅，女归见关火；仍坐位吃饭，未逞强爬收，明确湿团不抱膝/雨来不能代收；问女看书，听看法但未接实体书或知道友约。'
 },
 timeline_append:[
  '第39日周四晨：母欲抄戏词、与女认13/19原灯，亲问原店；沈父女谈另一幅仅调半幅光/先问班，未拆洗，父伤脚凳杖不变。',
  '周四约十一点左右：许先电话核午前在/午后送货，自己宽袋带旧灯线插头实交店内柜格，护纸留垫/袋带回，取留物条；只约周五午后先问，费用先联系，无诊断修理付款。午饭后真睡再赴16点这班。',
  '周四午间至下工：沈真问本周日半日，谭需早取数最后确认，12:30后候选未准；下工听取货仍待确认，谭约周五午前答，沈消息告父未定，余5无新支出。',
  '周四16点后至18:30：许接何当日页及来人待认一栏，来人亲摆原纸/签本处、原纸自持，何17:15消息已取眼镜无需迟班，18:30实接页钥匙，才听许有限灯留店话。',
  '周四夜许家：女亲看留条交回；母自旧信封抄戏词/两字未准仍空，与女自14册共小灯。女说锣声反复扰读，母关声写、女继续看/移自夹纸，女取灯回房，母信封归枕旁听戏；原反馈纸布盒不新用。',
  '周四夜沈家：沈归家见父饭已关火，煎现蛋配咸菜实吃，告父问班未准；父说想两帘色差小却不能高处代收，未洗未约新日。沈拿自册回房读昨叶后两页，白纸仍原处，父坐位低电视后应女略调回。'
 ],
 ledger:{
  'P_AD_OLD_DESK_LAMP':{type:'object',statement:'许蓉13转头会闪、19延期未送的原旧台灯，49由本人带交杂货店留看',status:'active',cast:['许蓉','许蓉女儿','杂货店店主'],tags:['旧灯','留看'],custody:{holder:'杂货店店主',location:'49周四午前杂货店柜内靠墙空格',condition:'原灯/线/插头一同，未插电检修，罩护纸留垫；非女床头小灯'},reader_known:'49许亲自问、带交并取条，当前只受理留看；未诊断/报价/付款/取回，不保证可修。',character_known:{'许蓉':'本人交灯线插头，知明午后先问且费用先联系，未看到检修。','许蓉女儿':'助拍照、文字及晚亲读留物条获知母说已留店；未到店亲见交接或检修。','杂货店店主':'本人接灯，听许述转头闪/关拔后未用及本人未摔，不知道搬动是否碰过。','老何':'49交班时才听许说送原旧灯留店，未检查。'},evidence:ev('他没有插电，自己把线圈同灯拢到一处，移去柜内靠墙的空格。','“还没看。总算不在柜角了。”')},
  'T_AD_LAMP_FOLLOWUP':{type:'thread',statement:'49旧灯已受理留店，约次日午后先联系，费用须问本人，等待真实检查及物主决定',status:'partial',cast:['许蓉','杂货店店主'],tags:['旧灯','待答复'],due_unit:50,reader_known:'送达步骤已做，明午后仅先问而非取好；能否修/价/付款/取回及使用效果仍未发生。',character_known:{'许蓉':'亲听明午后先发字，任何费用先问，自己尚未答修。','杂货店店主':'已收物且约明午后先联系，未承诺当天或明天修好。'},evidence:ev('小票上记旧台灯一盏、先看后联系、费用先问。','“明午后先来字，不先过来，对吧？”')},
  'P_AD_LAMP_RECEIPT':{type:'object',statement:'49杂货店给许蓉的原旧灯留物条，店主另写一张自留',status:'active',cast:['许蓉','许蓉女儿','杂货店店主'],custody:{holder:'许蓉',location:'许家；晚从自包内格取出给女读后女已交回',condition:'记旧台灯一盏/先看后联系/费用先问，名字重写清、电话后四位；不是付款或完修证明'},reader_known:'午前取条，晚女读后交回许；店内自留另一张。',character_known:{'许蓉':'亲收原条，费用未结；给女看后取回。','许蓉女儿':'晚亲读条，只表明留看。'},evidence:ev('许蓉答好，把小票折一次，放自己包的内格。','女儿将条交回，问店主是不是说不贵，许蓉摇头，自己还没有听到一个价。')},
  'P_AD_LYRIC_ENVELOPE':{type:'object',statement:'49许蓉取自存旧信封背面抄戏词，独立于女原反馈纸与书签',status:'active',cast:['许蓉','许蓉女儿'],custody:{holder:'许蓉',location:'49夜许家许蓉枕旁干处',condition:'本人几行戏词、两处未辨字留空，另一候选行另抄；未抹原字、不宣称歌词已核准'},reader_known:'母自己抄写/夜与女共灯后持回床边，女未代填全词。',character_known:{'许蓉':'自己听记，另找版本仍未确定。','许蓉女儿':'见母用旧信封，助听不能辨全，夜只知母另记候选。'},evidence:ev('转而去取自己收的旧信封。','她将信封放到自己枕旁的干处')},
  'T_AD_SECOND_CURTAIN':{type:'thread',statement:'49沈父重新提出只洗仍未洗的另一幅，父女谈明动机及休息/收挂限制，尚无洗日',status:'pending',cast:['沈禾','沈成林'],tags:['另一幅窗帘','半日取舍'],due_unit:52,reader_known:'父希望两幅差别小，洗过有印那幅不重洗；沈想休息/读书，父不能爬收湿帘，只白天调可及半幅；未拆未洗未获班。',character_known:{'沈禾':'亲听父动机，自己说想留一阵休息，脚凳杖限制与天气/晾处还未落实。','沈成林':'亲谈只动未洗幅，仍想洗但承认不能雨来高处收，知女问班未准。'},evidence:ev('“有印那幅不必再算。我是看这边。”','“我怕一说歇，就只有它等着。”','“那这回也照能拿的来。你出去时，我看着天，真下雨，我也不能替你爬出去收。”')},
  'T_AD_DAY_OFF':{type:'thread',statement:'49沈禾实际向谭问本周日可歇半日，需认早取量，次日午前待正式答复',status:'pending',cast:['沈禾','谭老板','沈成林'],tags:['问班','周日候选'],due_unit:50,reader_known:'12:30后只候选；下工时取货者仍未定数，谭约周五午前给准话，不是已批班。',character_known:{'沈禾':'亲问/看页/听最后未定与明午前答，尚无批准。','谭老板':'有早取量与前后守柜成本，未答准本周日半日，自己约明午前给话。','沈成林':'消息知今天未定，夜才听女转述周日候选与明午前答，非自己听老板。'},evidence:ev('“说你问了。别说我准了。我得等这边一句。”','明天上午认完，午前给她个准话')},
  'F_W_CURTAIN_WASH':{reader_known:'15只洗挂有印一幅的历史结果保持。49父女只谈另一幅，洗过那幅原印仍在/不重洗，未洗幅未拆洗，仅拉半幅调光；新待办另记T_AD_SECOND_CURTAIN。',character_known:{'沈禾':'亲做15一幅，49再次亲见两幅差别/旧印，另一幅仍未洗。','沈成林':'知道15一幅已做，49明确旧印那幅不重洗，仅提出仍未洗的另一幅。'},evidence:ev('她看窗边，两幅合近，没洗那边颜色深，洗过那边旧印也还留着')},
  'P_W_COAT':{previous_holder:'许蓉',custody:{holder:'许蓉',location:'49周四候船室由许穿用，晚归仍母自持未转交',condition:'旧厚角靠桌仍能认到，未新拆剪针洗，不推永久舒适'},reader_known:'49母在值守仍认袖肘原厚处，仅换前臂位置，未借本章送灯再拆母衣。',character_known:{'许蓉':'值守亲觉旧处仍在，未新拆改；女未陪全程。'},evidence:ev('她坐下，袖肘靠到桌边，那一点厚处仍认得出。')},
  'T_X_COAT_DAILY':{reader_known:'48晚原反馈仍有效，老师未见该夜新增。49母值守靠桌仍认原厚处，未新改衣或检验长期质量，女找笔并非新一轮试衣。',character_known:{'许蓉':'49自己值守仍碰原处，未新增衣的试验或让女拆。'},evidence:ev('她坐下，袖肘靠到桌边，那一点厚处仍认得出。')},
  'P_DR_FLOWER_BOOK':{previous_holder:'许蓉女儿',custody:{holder:'许蓉女儿',location:'49周四夜许家窄桌，女自取自看并移自己的夹纸至当晚停页',condition:'原14元册未添改，无新借/转交；原夹纸不是反馈纸'},reader_known:'49女与母共灯读自己14册黄枝，仍觉空但看到母指枝梢；母只旁看并指，没有接走。',character_known:{'许蓉女儿':'亲读黄枝/留白，听母指枝梢，保留自己审美；移动自夹纸。','许蓉':'亲看女该页并说自己喜欢的枝梢，女说仍空；非拿走书。'},evidence:ev('姑娘取来自己的十四元花册','她将夹纸移到今晚停处，问灯拿进去行不行。')},
  'P_W_PICTURE_BOOK':{previous_holder:'沈禾',custody:{holder:'沈禾',location:'49周四夜沈家沈禾房内床头，自取回房续读',condition:'原8元册与原白纸原处保留，未新借友/交父/买18册'},reader_known:'49父女只谈看法，父未接实体；沈夜自读昨叶再后翻两页，原白纸不用于问班。',character_known:{'沈禾':'49自己取自册读叶及后两页，原白纸留原处；未约朋友。','沈成林':'49只听女说看叶可盯着好看、并非判懂，未接书读新页。'},evidence:ev('她拿自己的画册回房，先翻到昨晚发过照片的叶，原白纸仍夹原处')}
 }
};
const report='审查/AD-A-49完整自检与纲文回对.md';
input.draft_review={reviewer:'Codex AD A same native process; informed self-review; final v2 full10 pages, not blind/human/market acceptance',report,draft_sha256:sha(body),report_sha256:sha(fs.readFileSync(path.join(root,report)))};
assert.deepEqual(input.source_hashes,original.source_hashes);assert.deepEqual(input.source_bindings,original.source_bindings);
fs.writeFileSync(path.join(root,'.writer/drafts/ad-a-record-49-filled-v2.json'),JSON.stringify(input,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:true,unit:49,expected_revision:input.expected_revision,draft:input.draft,han:(body.replace(/^#.*(?:\r?\n|$)/gm,'').match(/\p{Script=Han}/gu)||[]).length,characters:Object.keys(input.changes.characters).length,ledger:Object.keys(input.changes.ledger),review:input.draft_review,source_hashes_unchanged:true},null,2));
