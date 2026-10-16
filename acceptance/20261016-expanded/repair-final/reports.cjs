const fs=require('fs'),path=require('path'),crypto=require('crypto');
const project=path.resolve(__dirname,'../works/潮汐信号');
const read=f=>JSON.parse(fs.readFileSync(path.join(__dirname,f),'utf8'));
const put=(f,v)=>fs.writeFileSync(path.join(__dirname,f),JSON.stringify(v,null,2)+'\n');
const state=read('after-state.json'),hashes=read('final-01-24.hashes.json');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const stateHash=sha(fs.readFileSync(path.join(__dirname,'after-state.json')));
const items=read('ledger-43-audit.json'),chars=read('characters-12-audit.json'),decisions=read('knowledge-repair-decisions.json');
const hashTable=Object.entries(hashes).map(([f,h])=>'| '+f+' | `'+h+'` |').join('\n');
const binding='作品：潮汐信号；当前 revision '+state.revision+'；state SHA-256 `'+stateHash+'`。本次读取哈希与最终24份正文逐一相同。审查者为同一主会话模型知情自检，不是隔离盲读、真人或市场验证。未使用子代理。\n';
const ledgerText='# 43项账本与12个人物知情复核（r67）\n\n'+binding+'\n本次是知情陈旧修复，没有新增正文创作，没有清零未知。18项账本的47个 character_known 字段修订（含新增赵瑛两项），snapshot.characters 只收窄罗敬当前头部。原值完整保留在修前JSON、逐字段差异和必要的历史范围中。观察 statement / author_truth、ID、due、status、reader_known、custody、证据原项均未删除或逆改。\n\n修前错误证据：T_HANDOVER沈“明早等唐交完”、唐“未正式交完”；T_ARCHIVE沈“明早仍待签收”、宋“先到候接”、唐“未获邱及日期”；其他旧字段见 before-ledger.json。session-f旧报告保持不变，此报告记录进一步发现的缺口。\n\n| ID | 本次动作 | 修改人物字段 | 逐项语义核对 |\n| --- | --- | --- | --- |\n'+items.map(x=>'| '+x.id+' | '+(x.result==='repaired'?'修复':'保留')+' | '+(decisions[x.id]||[]).map(d=>d.field).join('、')+' | '+x.semantic_note+' |').join('\n')+'\n\n## 人物快照逐人核对\n\n'+chars.map(x=>'- '+x.name+'：'+x.semantic_note+(x.modified?' 本次收窄当前头部。':' 现快照保留。')).join('\n')+'\n\n## 改前改后与证据\n\n完整修前修后分别为 repair-final/before-state.json 与 after-state.json、before-ledger.json 与 after-ledger.json、before-characters.json 与 after-characters.json。ledger-diff-complete.json / characters-diff-complete.json 给每个实际修改字段完整原值和新值；knowledge-repair-decisions.json 给逐字段语义说明。all-evidence-audit.json 保留并校验全部现有引文哈希、原文和行号。\n\n没有把顾陪运登记成亲见原牌/原签或正式签收；没有把罗周有限电话登记成所有物件交存通知；没有把周工作转录记成原物亲听；没有把唐签照记成原签现场或试听；没有把赵收封袋听试锁记录记成第16章亲见试锁。\n\n## 保留边界\n\nT_PRIVATE仍intentional-open；T_AUDIO_REMAINDER仍pending。原带其余段同日性、男声/钟源、剪者和目录用意、原通知残页日期、铜牌原挂牌点、2013完整交接链和整套图去向均未强结。\n';
const rolling='# 第19–24章本次完整滚动连读（r67）\n\n'+binding+'\n本次先完整读当前19–24章（recovery-19-24.read.txt全399行），再回读1–18章实证；重登后在全稿复读中再次完整读19–24章。不是复用session-f报告。\n\n19章局部比较与目录续表照片只给查询方向；20章册行不配音、空夹位不等丢失、宋仅示候问位置；21章补录起首分文件保留重叠、不补听不清处；22章邱自由叙述先于纸照音段、明确要求原签；23章周罗完整听工作转录、授权代存与次早计划尚未发生；24章原签在袋内纸套出现且原夹位仍空，核回记与调度后限到候船门口，物件按实际换手落位。各章承接成立。\n\n确定问题发生在修前追踪层：明早待交、未正式交完、未听音等旧字段仍占人物头部。已按本次43项逐项复核报告修复。未发现必须改正文的确定错误，全部24章字节未改。\n\n情绪与人物：沈从占用他人时间到按约等完并亲看归车；唐用摸架板确认干燥完成自己的职责；顾签前返店与收费退出保护其客户生活；罗换坐垫继续听而不补旧约；周给具体下班时间而未完成菜约。没有用调查结论清空各自生活。\n\n## 真人语言别扭句\n\n有没有哪句话意思能够看懂，却让你觉得别扭、像为了写得漂亮硬拼出来，或者不像一个人当面会这样说？\n\n### 真人语言硬问题\n\n没有\n\n按人物当面复述、动宾搭配、具体动作和语流改口四项检视，未找到两项测试共同支持且损害理解的确定硬问题。此处为模型文本自检，不声称真实音频朗读或真人反馈。\n\n### 风格偏好观察\n\n后段证据边界解释较密，符合本作谨慎调查声音；若未来另作商业节奏修订，可评估重复提醒的密度，本轮未据此改正文。\n\n## 未覆盖\n\n未做真人盲读、市场验证或发布裁定；机械check和review登记只证结构与覆盖。\n\n## 本次读取版本\n\n| 正文 | SHA-256 |\n| --- | --- |\n'+Object.entries(hashes).filter(([f])=>+f.slice(3,7)>=19).map(([f,h])=>'| '+f+' | `'+h+'` |').join('\n')+'\n';
const chapterNotes=[
'退票留下、有限副本与六日后交接压力建立，缺日期不借残表补。',
'独见原牌未拍抄；唐只按外标签暂管，初始观察不可倒算他人在场。',
'原箱正式领回后沈负责收费空间；罗交原钥、拒私人原因，钥未试。',
'罗只对沈说灯义；原带合理准备后短听即停，原物与副本不混。',
'首次完整告周牌字刻线无日期；周抄纸标沈述，唐仍未获内情。',
'通知残页无日期与现箭头形成待核误判；当日日单和空间责任仍落实。',
'完整告唐并承认迟告，不将归属未核当字样未知；只拍通知工作照。',
'六号寄存排除编号直配，现候船与登船分开；向周电话、向唐约回。',
'向唐转述灯语，保留现状并找实际经手人；不自动核实旧口述。',
'许只给2011维修复印单图，账不拍、原纸不领，图无今厅挂牌。',
'箱空间和看箱工时真实计费；试机异响用店带，原带安全仍待另查。',
'三人对照原通知与工作照，两个年份不贴声音；主线到期仍保留缺口。',
'断电查灯见原位铆片，岸端暂停修正船等推断；未定接收地不拆。',
'唐首次亲看原牌拍当次照；顾只在复封后听完整口述，不能登记亲见。',
'罗看照改口并保留首说，不将别次听喊与私因相配；矮柜约尚未兑现。',
'原钥实开现锁另立有限解释；只看可展检查页，原簿仍唐管，历史未全知。',
'顾修底盖用店带复测，工钱不买午饭；原带仍待另做准备。',
'原带两面续听实际发生但缺起首转录；识母语气不推日期接收或男声。',
'局部同源倾向和续表照片推进口信方向，周只看范围图没有提前听新带。',
'宋展现册不展余页，册行四号与录音四号不立刻合并；灯箱仍只候问。',
'补录起首与旧副本局部比较，分文件留重叠和问号；没有补造缺字。',
'邱先自由叙述再看照听片，不凭记忆认纸日，约次早查原签。',
'分盒与日单完成；周罗听完整工作转录，代存授权和次早交接仍为约。',
'原签调度与邱回记支撑主线有限回收；箱带纸钥灯实际交接，菜约仍未发生。'
];
const full='# 第1–24章本次全稿复核（r67）\n\n'+binding+'\n本次逐章完整复读当前1–24章，读取文件 final-01-24.read.txt 全1789行、47203字符（包含分隔标题）。工具分页实际覆盖为1–300、301–600、601–900、901–1200、1201–1500、1501–1779、1780–1789，没有略过中间页。读取后47个人物字段修复的最终r67正文哈希逐份相同，故本报告绑定该当前正文；r65到r67仅补P_SERVICE_BAG两个人物字段，无正文变化。\n\n全稿结论：没有发现必须修改正文的确定错误。本轮修复的是人物追踪知识陈旧，不是正文新创作。主线片段班次与送达路径有证据交叉，始终区别原物/转录/照片/转述以及物证接收与确权。第2章独见、第4章独听灯语、第14章顾不在开箱现场、第16章现锁用途、第23章工作转录完整听取、第24章有限电话的边界相容。\n\n| 章 | 本次实际阅读及跨章复核要点 |\n| --- | --- |\n'+chapterNotes.map((x,i)=>'| '+(i+1)+' | '+x+' |').join('\n')+'\n\n## 结构、人物和连续性\n\n开篇把返城决定改为留存责任，寻找声音逐步变成询人、等人、付出工时与确认去向。中段现箭头和年份对配失败、迟告伤害、灯义改口及钥匙只开现锁，均改变做事方式。终章通过把纸翻出来与等待实际交接收束主线，而沈留一个月和买菜仍是可执行的选择及将来约，没有提前登记共同生活。\n\n周先问来源又搬筐送夹子，唐先问空间又保留干燥位置，顾保障客户与工时，罗保留私事且愿听下去，邱有缝纫工作和记忆限度；配角没有因需要交线索而统一变成无生活的信息窗口。沈的有限视角不进入配角私心。\n\n物证链：箱牌原布唯一，2唐暂管→3沈领回收费暂放→14看箱复封→24沈交宋；原带4罗→沈，4/18/21分阶段实听转录→24宋独格；原钥3罗→沈，16只证现锁→24赵封袋随柜入新库；通知与簿由唐分盒→赵，号码页另存；灯不拆、范原位核签。原始观察、due和引文保留。\n\n19–24完整连读的发现另见本次滚动报告；43项ledger与12个人物快照逐项结果另见本次知情复核报告。修前session-f的通过报告未覆盖本次新发现，全部保留为原阶段证据，未覆写。\n\n## 真人语言别扭句\n\n有没有哪句话意思能够看懂，却让你觉得别扭、像为了写得漂亮硬拼出来，或者不像一个人当面会这样说？\n\n### 真人语言硬问题\n\n没有\n\n本次对人物说话复述、动宾搭配、动作落地和文本语流复读逐项检查，未找到两项共同证实且造成理解损失的高置信硬问题。模型文本语流检查不等于真实音频朗读或真人自然表达验收。\n\n### 风格偏好观察\n\n谨慎限定与自我纠正多次出现，后半证据说明密度偏高，可作为未来节奏审修的偏好观察；当前未形成需改正文的确定错误。保留具体人物的饭、工钱、坐垫、摸架板和归车等生活动作，它们承载了关系后果。\n\n## 保留未知与未覆盖\n\n不解释罗私人失约，不清零T_AUDIO_REMAINDER，不由主线为全带每段定日、原残页定日或铜牌定挂牌点；历史归属与2013全袋完整性也未被代存替代。此次是模型知情复核，不是独立盲读、真人验证、市场验证或现实发布；草稿状态仍保留。\n\n## 全稿版本清单\n\n| 正文 | SHA-256 |\n| --- | --- |\n'+hashTable+'\n';
const names={ledger:'审查/repair-final-43项知情核对-r67.md',rolling:'审查/repair-final-0019-0024连读-r67.md',full:'审查/repair-final-0001-0024全稿复核-r67.md'};
for(const [kind,body] of Object.entries({ledger:ledgerText,rolling,full}))fs.writeFileSync(path.join(project,names[kind]),body,'utf8');
put('review-19-24.json',{from:19,to:24,kind:'model-self-review',report:names.rolling,source_hashes:Object.fromEntries(Object.entries(hashes).filter(([f])=>+f.slice(3,7)>=19))});
put('review-1-24.json',{from:1,to:24,kind:'model-self-review',report:names.full,source_hashes:hashes});
put('read-coverage.json',{nature:'actual-model-reading-not-script-semantic-analysis',current_revision:67,full_read_file:'final-01-24.read.txt',full_read_ranges:[[1,300],[301,600],[601,900],[901,1200],[1201,1500],[1501,1779],[1780,1789]],chapters:chapterNotes.map((note,i)=>({unit:i+1,read_complete:true,note})),source_hashes:hashes});
put('report-manifest.json',Object.entries(names).map(([kind,file])=>({kind,file,sha256:sha(fs.readFileSync(path.join(project,file)))})));
let semantic='# 知情修复简明说明\n\nr63→r64 rewind→r65重登；最终逐字段复核补P_SERVICE_BAG后，r65→r66 rewind→r67重登。两次plan/context/template均为正式CLI；未改正文或旧阶段报告。第二次候选记录另存candidate-state-r65.json / candidate-record-r65.json。\n\n';
for(const [id,rows]of Object.entries(decisions)){semantic+='## '+id+'\n\n';for(const r of rows)semantic+='- '+r.field+'：'+r.reason+'\n';semantic+='\n';}
semantic+='snapshot.characters.罗敬：去掉把授权自动写成已知实际归宿的当前头部，保留23章完整工作转录与授权、4章未参加原带短听和私因边界；合法旧历史原样保留。\n';
fs.writeFileSync(path.join(__dirname,'semantic-changes.md'),semantic,'utf8');
console.log(JSON.stringify({reports:names,full_read_units:24,rolling_units:[19,20,21,22,23,24],ledger_reviewed:items.length,characters_reviewed:chars.length}));
