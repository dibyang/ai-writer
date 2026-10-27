import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),p=JSON.parse(fs.readFileSync(path.join(base,'project.json'))).project,sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=ref=>fs.readFileSync(path.join(p,ref),'utf8'),json=ref=>JSON.parse(read(ref)),save=(ref,x)=>fs.writeFileSync(path.join(p,ref),typeof x==='string'?x:JSON.stringify(x,null,2)+'\n',{flag:'wx'});
const draft='正文/0058-袋里放自己的-ad-d-v2.md',body=read(draft),hash=sha(Buffer.from(body)),han=(body.replace(/^#{1,6} .*$/gm,'').match(/\p{Script=Han}/gu)||[]).length;
assert(han>=12000);const x=json('.writer/drafts/ad-d-record-template58-original.json'),ctx=json('.writer/drafts/ad-d-context58-default.json');assert.equal(x.expected_revision,287);assert.deepEqual(x.source_hashes,ctx.source_hashes);
for(let n=1;n<=9;n++){const r=JSON.parse(fs.readFileSync(path.join(base,`read-pages/d-final58-p${n}.json`)));assert.equal(r.sha256,hash);assert.equal(r.text,body.slice((n-1)*1800,n*1800));}
for(const [ref,h]of Object.entries(x.source_hashes))assert.equal(sha(Buffer.from(read(ref))),h,ref);
const ev=(...quotes)=>quotes.map(quote=>{assert(body.includes(quote),quote);return {unit:58,quote};});
x.draft=draft;
x.summary='第46日周四。沈上工前误认父找昨日报及想下楼，问回后只将家中旧报移可及处；父自己找到另张院门报，重读昨日走错路短文，仍不喜欢未找到的结尾，却想念店里人先找钱的一段。沈在糕店听一位带杯/纸盒的女人找记忆口味，试样后买当下少份并实付，未替其母认效果；与谭对先介绍现有种类保留不同意见。四点后沈按父意摆同屋窗椅，杯另放、袋移干处，扶臂/杖让父短移坐稳垫伤脚；父自己选不下楼。沈带原8册自袋/杯出小广场独读，孩子自己等母/老人取药后歇坐，沈看人影又走看小狗，无购借书或新照。父用原浅蓝袋轻取盒报，从纸套自取单面旧纸空背，以硬报夹垫写没找到/店里的人先找钱/我还是想知道后来，笔帽掉地留待女拾，不冒险弯取。沈回家捡帽看纸，父重戴镜真实念出一段，沈起先追问然后后真听再念，也讲完顾客的事；保留不同评价不改报文后半。女扶父回原椅垫脚、笔归原桌，晚父把两报/记纸/盒分收自袋并轻提回扶手，临歇记纸添念过/她也讲了。女8册/原白纸回床边。两友文字约次日周五16:30小广场各取书后坐至约17:15，女答带原14册/有变先说，尚未见面。女只获报文有限文字，未得父记纸照片/未亲见其用袋；原课布/母衣/灯/旧图未新增动作。';
x.changes.characters={
'沈禾':'第46日周四在糕店实际接找旧味顾客/少份实付，与谭对先介绍现有糕保留意见。16点后回家按父意摆窗椅，扶臂/杖短移并垫脚，父自选不下楼；自己带原8册/杯到广场独读并看狗，返回听父念报/看父另写记纸，自己讲完顾客事。扶父回原椅/杯袋笔分拿，原8册和原白纸归床边，手腕仍紧不提重盆。文字与女约次日16:30小广场至约17:15各带书，有变先说，未发生见面。仍只知57女练布新空边有限变化/旧尾留、母衣未到，无新照或亲摸，不知母夜摸细节。',
'沈成林':'周四自己在家找院门旧报/重读昨日折报，分清喜欢的一段与仍不喜欢结尾。在女扶臂/杖帮助下同屋短移窗椅，脚仍垫凳，自己取消下楼；独读时用原浅蓝袋轻取盒报，个人单面旧纸记几句，女回捡帽后实看纸/听再念，他也听其顾客事。晚同样扶回原椅，盒/两报/个人记纸归自己浅蓝袋，记纸添念过/她也讲了；不曾持女8册或获其所有权，女书回床边。仍不等伤愈或袋耐重。',
'谭老板':'周四仍样盒旁/散糕前；同沈实际接旧味顾客，说清现有种类并让尝，少份实卖收款，仍认为可先讲现有选择。午饭只听沈说父找另一张院门报/看到找着了短消息，不知下午父换座、写纸或父女晚谈。保留56展示试行无增销保证，不知女课堂。',
'许蓉女儿':ctx.snapshot.characters['许蓉女儿']+' 周四文字自报手指较昨夜轻些/今晚想歇，听沈有限顾客语音并澄清自己说洒衣是自事；晚与沈约次日16:30小广场至约17:15，各回家取原册，若有变先说。只文字知父另找到院门篇/念原篇一段且仍想后来，没收到父纸照片，未见父换座/袋用或其晚记。'
};
x.changes.timeline_append=[
'第46日周四早：沈将家中旧报移父可及处后上工；父自行找院门一张，另重读原折报，不由沈替其找后半。',
'周四糕店：顾客以从前口味来问、尝样后选少份实付带走；沈与谭保留先荐现有种类的不同意见，午饭沈只讲父找报/给看找着了短消息。',
'周四16点后沈回家：按父选窗边稳椅/凳/杯袋分放，女扶臂/父杖同屋短移坐稳垫伤脚；父实际不下楼。',
'同日下午：沈带自原8册/杯广场独读与短走看狗；父窗边读两张自报、单面旧纸空背写三句/位置提示，原浅蓝袋只轻用盒报/记纸，笔帽掉地等女取。',
'周四沈归：拾帽/看父记纸，父重戴镜实念原文一段，女先急问然后又请再念，真讲完自己的糕店事；女扶父回原椅/垫脚，笔杯袋分拿。',
'周四晚：父两报/个人记纸/眼镜盒分归自袋并轻提椅扶手，临歇纸添念过/她也讲了；沈原8册原白纸归床边，窗椅空留，父仍凳杖。',
'周四晚两友文字：约次日周五16:30小广场各取书后坐至约17:15，女带原14册/有变先说；仅约定未见面，无新布/报纸照片。'
];
x.changes.ledger={
P_W_CURTAIN_BAG:{previous_holder:'沈成林',custody:{holder:'沈成林',location:'58周四夜沈家父原椅扶手，父自干桌轻提回',condition:'眼镜盒一侧，两张自有报/个人记纸另一侧；原白褶/毛点留，未重补/无湿重，今天未出门'},reader_known:'58父自选家中窗边读，女移袋/扶臂换座，父轻取盒报和个人纸再收回；只本次轻用，不等伤愈或永久承重。',character_known:{'沈成林':'本人轻取自报/盒/记纸、晚自提回扶手；今天同屋扶臂/杖短移且垫脚，不下楼。','沈禾':'亲移父袋/扶臂换座与回原椅，见父读报与另记纸/归袋；自书白纸仍自持。'},evidence:ev('今天没有带它下楼，他坐着用过几次','父亲自己把浅蓝袋从干桌轻提回椅扶手。','盒放一边，报和记纸在另一边')},
P_W_PICTURE_BOOK:{previous_holder:'沈禾',custody:{holder:'沈禾',location:'58周四晚沈自家床边，广场独读后带回',condition:'原8元旧册/原大白纸仍旧夹处，不借父或外人/不新买'},reader_known:'本日沈独带原8册去广场读画并自行带回，猜画未认定，原白纸保留；父不自动取得书。',character_known:{'沈禾':'自己携原8册独读后回床边，白纸未挪作父记纸。','沈成林':'亲听女说带自书去坐、回听有限看画说法，今天没接持实体。'},evidence:ev('八元画册还在床边。','沈禾把自己的书带回床边。','原白纸还在旧夹处')},
R_AD_FATHER_READING56:{reader_known:'58父找第二报对照仍不改原结尾，亲念自己喜欢一段；沈先追然后后再听，也讲完自己顾客事，父仍想后来，双方无须改成同一评价。',character_known:{'沈禾':'实看父个人记纸/两报并听重念；自己讲糕店事，父仍不喜欢原篇未找着。','沈成林':'实念且要求听完，自己也先急问买没买后听女讲完；保留末尾期待。'},evidence:ev('不是喜欢等。我想念给你听。','你再念一下。刚才我也只等你念完。','我还是想知道后来')},
P_AD_FATHER_READING_NOTE58:{type:'object',statement:'58父从家中纸套自取一张单面旧说明纸空背写个人读报意见，独立于女画册白纸及课堂纸',status:'active',cast:['沈成林','沈禾'],reader_known:'记纸写没找到/店里的人先找钱/我还是想知道后来及原报开头位置提示，临歇添念过/她也讲了；沈实看白日版本，女友只文字知有限报事无照片。',character_known:{'沈成林':'亲写/亲收/临歇加两短语，纸在自袋两报间。','沈禾':'下午看白日纸及旧说明背面，非自己白纸；未在场旁看临歇添字。'},custody:{holder:'沈成林',location:'58周四临歇折回父浅蓝袋，两报之间',condition:'单面旧说明空背自写，等字干折入，原报未剪/未改，未拍发或借出'},evidence:ev('纸套放在矮柜边','在旁边另写一小行：店里的人先找钱。','最下边他写：我还是想知道后来。','又在旁边补“她也讲了”')},
F_AD_FATHER_WINDOW58:{type:'fact',statement:'58父自己选不下楼、由女扶臂与杖帮助短移同屋窗椅，垫伤脚阅读后同样扶回',status:'active',cast:['沈成林','沈禾'],reader_known:'换座服务本人阅读欲望，保留凳杖/步行耗力；窗椅空留不保证明日再用，无康复结论。',evidence:ev('自己今天不想为坐太阳再折腾一回。','等她扶住胳膊，才把健脚放实，慢慢起身。','沈禾才把垫脚凳移回')},
F_AD_CAKE_TASTE58:{type:'fact',statement:'58糕店一位女人寻找记忆旧味、试样后购买眼前少份并实际付款，与沈和谭保留介绍选择的不同意见',status:'resolved',cast:['沈禾','谭老板'],reader_known:'只结本次售卖；顾客母亲未在场，没认定从前原味或她母亲喜欢，没有销量结论。',evidence:ev('女人付过，将袋拿起','那是后来。')},
T_AD_BOOK_MEET59:{type:'thread',statement:'58周四夜两友实际约次日周五16:30小广场各自回家取书后坐至约17:15，有变先说',status:'pending',cast:['沈禾','许蓉女儿'],due_unit:59,reader_known:'双方明确相约，尚未见面；原8与14各自持有，没承诺带糕/布/父记纸。',character_known:{'沈禾':'本人提出时间并收到同意，四点下工先回家取原8册。','许蓉女儿':'本人同意下工回家取原14册，若有事先说；只知沈文字有限父报事，没新照。'},evidence:ev('明日下午四点半去小广场坐行不行','能坐到五点一刻左右。','带十四元那本，真有事会先说。')}
};
const report='审查/AD-D-58整章纲文语言与连续性知情自检.md';
save(report,`# AD D 第58章整章知情自检

审查者：Codex，本次同一原生进程的模型知情自检，无子代理、无隔离盲读、非真人或作者定稿。当前稿 ${draft}；SHA256 ${hash}；去标题 Script=Han ${han}。d-whole58-p1—p9完整实读初版，修正后d-final58-p1—p9完整覆盖最终15408字符；各页同SHA/原切片实校。55—57当前登记稿28页此前实读，旧承诺补读范围见研究/AD-D滚动写前核对.md，未冒称全书实读或55—60完成复核。

写前原context默认40000预算实际成功，完整JSON序列化36649字符，continuity18174；这不是模型token数，也不把静态数说成内部计费。无需显式扩容，无删约束/静默截断。原模板r287早于正文分段，最终填写版只clone原模板改draft到v2并填实际变化，不刷新来源哈希。有效章纲SHA ${x.source_hashes['大纲/单元/0058.json']}；V21沿旧契约，历史规划进程权限文字依当前workflow解释，未改已消费入口。

## 纲文回对

|有效计划|本稿证据与判断|
|---|---|
|目标/变化，父亲自己的用途|“我想下午换个地方看。”、“不是喜欢等。我想念给你听。”；实际换座/亲读/自己写记纸/女再听后仍不统一结尾意见，已落实。|
|beats1—3：家中找报与日间各自生活|早晨沈只移旧报可及，父独自找到院门篇并重读另一篇；糕店客人买少份实付，老板仍认为可早讲现有选择。不是重复56摆柜试行或强制统一观点。|
|beats4—6：窗边、独处与轻物|父自选不下楼，女扶臂/杖短移垫脚；沈原8册独读/短走，父用袋取盒报并另取单面旧纸写几句。无24同样下楼/半瓶水流程，未以轻用证明耐重。|
|beats7—8：实际听见与归还|父真念、沈追然后→请求再念，沈也讲完自己的顾客事；两报/记纸/盒回父袋，8册/原白纸归沈床边，朋友只约明日未提前见面，已落实。|
|forbidden与保留|母衣、课堂原布、新灯、照片/旧图没有本章新处理；14/8/18未购20未动、旧门工40料10总50/抽屉18/新柜58和三宽条不改；父伤/复航/长期效果未结。|

## 六字段核查与下游

summary只记周四真正发生至夜歇；characters沈/父/谭/女分别写亲见、听述和未见界限，保留女57课堂有效状态；timeline七条按同日早/日间/16后/夜，不把章号当人物日期；ledger只七项实际变化、既有object custody核原holder，新记纸独立；evidence逐引文核本稿真实子串，下游只留周五16:30—约17:15相约未见面。女未亲见父换座/读报或拿到记纸照，谭只午间听报事；沈未见父临歇添字。后续59须实写消息/到场才能更新相约状态。T_W等课线无本章新事实，不整抄回旧知识。

物理逻辑/可操作性/小物动作/物件连续性：本次所读范围可行。短移有杖与扶臂，纸/杯分持/膝夹垫写，笔帽落地不冒险捡，父真读前重新戴镜；回原位前女拿袋杯笔，父两手可用。换座有腰累与明日可不再用，不替伤势作诊断。

## 真人语言别扭句

有没有哪句话意思能够看懂，却让你觉得别扭、像为了写得漂亮硬拼出来，或者不像一个人当面会这样说？

### 真人语言硬问题
没有

当面说话测试：沈快口顶回/会认听串，父急要结尾又愿念小段，谭在意卖货选择；不是人人说同一条原则。动宾拆分：纸取/折/夹、杖落/扶臂/坐稳可呈现；具体落地：付少份、独坐、等女听与再念均有动作和时间；逐句语感/朗读改口测试未发现同时受另一测试支持的确认硬伤。模型没有真人音频朗读。

### 风格偏好观察与保留
父亲读文/沈看画/顾客找旧味有主题回声，部分未拍照、未强结式旁白略显刻意；不是用哈希或词频判重复。保留父不喜欢结尾仍有一段愿念、女先出去再回来听、客人只买少份未寻回旧味的差别。换座拿放与折纸仍有细节密度，后三章合窗时需比较收益，当前不宣称市场追读或正式文学验收。口语“替他定下楼”有省略感，按人物急口暂保留为可选表达，不升级硬问题。

## 已做修正与未覆盖
合章前09另存，澄清个人记纸/原画册纸、笔的搬回与薄衣指代。初版全文实读后八项另存修正：02未写买书回述改为实际下楼误认，04纸套空/有纸矛盾，05未证父已知树下椅改为当场女说，06早晨改刚才，08戴镜与孩子意见转述，09说狗改看狗。原段/第一次合章全保留，v2又完整9页实读后才本报告。不是登记后改主稿，也没更改模板/规划源。

完整58—60及55—60六章复核须恢复程后另做，59只有首停分段尚未写。当前7 verified/13 open历史意见不在本章冒认新应用或复核；作者定稿、独立读者、长期生活/使用后果未证。
`);
x.draft_review={reviewer:'Codex AD D single-process informed self-review',report,draft_sha256:hash,report_sha256:sha(Buffer.from(read(report)))};
save('.writer/drafts/ad-d-record58-filled.json',x);
fs.writeFileSync(path.join(base,'d-58-review-evidence.json'),JSON.stringify({draft,sha256:hash,han,report,report_sha256:x.draft_review.report_sha256,checked_fields:['summary','characters','timeline','ledger','evidence','downstream'],characters:Object.keys(x.changes.characters).length,timeline:x.changes.timeline_append.length,ledger:Object.keys(x.changes.ledger).length,original_template_preserved:true,source_hashes_verified:true,final_read_pages:9},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:true,han,ledger:Object.keys(x.changes.ledger).length,report},null,2));
