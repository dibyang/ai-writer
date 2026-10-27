import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),root=JSON.parse(fs.readFileSync(path.join(base,'project.json'))).project;
const state=JSON.parse(fs.readFileSync(path.join(root,'.writer/state.json'))),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const rows=[
 [43,
 ['两友交班后真正相见并按各自预算买回菜料','今天我来吃饭，书又不会饿。'],
 ['迟取货未到、空闲仍需真实交班，摊上大把并不适合两人','客人晚来，老板看过接住'],
 ['沈先坐够再走，两人各挑自己想做的一项','再坐一小会儿'],
 ['菜料实付到厨房，沈余九元，米未量火未开','原先备的十五还剩九。'],
 ['沈愿等姑娘做，不以熟练接管其选择','我不知道，所以等你做。']],
 [44,
 ['两人做出都能吃的一顿且保留不同口味','自己还是爱脆的'],
 ['芋头实际偏黏，姑娘喜欢整块；菜软硬与蒜味不同','这只黏些。'],
 ['菜分批起，另留整块，尝过后不再全拌','自己先捞一半'],
 ['饭实际吃过，三宽条由原两片来，沈吃一条半余一条半','三条宽豆干吃掉一条半'],
 ['朋友可自己说不够或不要，不把迁就当共同口味','不够我自己再说。你先留着你这口。']],
 [45,
 ['分清余食去处并让主人第二天真能用厨房','先把吃的找地方吧。'],
 ['腕酸、粘锅与盐被藏低处造成实际麻烦','我明早得找。'],
 ['重新腾出盐罐原处，由母自己放回','许蓉把盐罐放回'],
 ['沈自盒带余饭整芋回家；女夜吃余宽条净','她先吃半条，再将整条咬作两口'],
 ['能直说想躺与想回，各自不强撑陪坐','自己有些想躺一会儿']],
 [46,
 ['沈将自选余饭热透吃完，许家只收一层柜并洗衣','先把带回来的热了'],
 ['米芯不热、腕酸，母衣角仍在，窄枕套并非想修','靠到这儿，还是认得'],
 ['续蒸再尝米芯，宽枕套保留而窄口另放','那今晚先洗。'],
 ['芋一整块分半父女吃净，原厚盒清洗沥干；湿衣留绳','芋头还是黏的。我爸尝半块'],
 ['父尝完仍想自己的馒头，母记得女手指酸','自己方才折布时说的']],
 [47,
 ['回普通班次，做自己想吃的饭并准备下一次课','今日不用两个人都站在锅前'],
 ['豆腐有一边煎硬，母衣晨潮晚干，旧处仍碰','坐着，这儿还碰得着。'],
 ['母实试后决定明早照穿，原纸另记而不把旧顶改轻','她另起一行写'],
 ['女豆腐支3余2；沈两饼支4余5，自厚盒晚归柜','袋里还剩五元。'],
 ['母愿洗碗让女歇，父参与蛋汤却保留自己的份','不是替她清盘。']],
 [48,
 ['女在第五课为自己练布走一小段，余人各过自己一天','今天想自己走一段'],
 ['拉皱、漏带一层、松圈和偏长针各需自己辨认','针只穿外面薄的一层'],
 ['退本次后两针再走，允许一针跨远保留','别将上回做的也一路拆走'],
 ['小段放手平、收结齐针，20:40离课，原纸夜听母后才添','墙上钟走到八点四十'],
 ['母不替补齐，女承认做得少却学会退针；朋友仅据标注照片回应','你不是说你会退了么。']]
];
const fields=['goal','obstacle','choice','consequence','relationship_change'];
const input=JSON.parse(fs.readFileSync(path.join(root,'.writer/drafts/adp-review43-48-template.json')));
input.expected_revision=state.revision;input.operation_id='AD_PLANNING_REVIEW_43_48';input.report='审查/AD-43-48当前实读与规划风险.md';
input.chapter_functions=rows.map(([unit,...cells])=>{const u=state.units.find(x=>x.unit===unit),text=fs.readFileSync(path.join(root,u.draft),'utf8');assert.equal(sha(Buffer.from(text)),u.sha256);return {unit,...Object.fromEntries(cells.map(([description,quote],i)=>{assert(text.includes(quote),'quote missing '+unit+' '+quote);return [fields[i],{status:'observed',text:description,evidence:[{unit,quote}]}];}))};});
input.comparison={similar_structures:[
 {units:[44,46],judgment:'都在桌边尝过再说口味，也有加热/等待；连续看时容易形成相似节奏。',differences:'44是两个朋友把同锅菜变为可共存的脆软口味，46是父尝女自选带回物后仍选择自己的馒头；关系方向不同。',preserve:'保留44芋偏黏/蒜过量的真实不甘心，保留46父并不因女带来就喜欢同样晚饭。',optional_adjustments:['未来新章不再逐次详写每次洗碗端杯，不回改本程正文。'],uncertainty:'仅为当前六章知情自检的结构风险，不是确认重复错误。',evidence:[{unit:44,quote:'这只黏些。'},{unit:46,quote:'芋头还是黏的。我爸尝半块'}]},
 {units:[45,48],judgment:'都把细小操作铺开，末尾收齐/归位的预期较强。',differences:'45盐罐找不到牵涉主人真使用路径，48自己发现漏层并退针牵涉初学者如何判断；不是相同一次整理。',preserve:'保留主人找盐的后果与女自己识错、教师不代做、跨远一针暂留。',optional_adjustments:['49—60改用消费取舍、资料提供者责任、兴趣交流及使用者试用供给，不每章一套收手纠错。'],uncertainty:'可以保留有效慢热，不能从共词或操作密度直接推出文学不合格。',evidence:[{unit:45,quote:'我明早得找。'},{unit:48,quote:'针只穿外面薄的一层'}]}
 ],distinct_gains:rows.map(([unit,...cells])=>unit+'：'+cells[4][0]),preserve:['44朋友真有不合口、蒜添多与不必说好','45母亲实际取盐及可直接说想躺','46母亲记女指酸、父口味独立','47换普通饭仍有失手和酸累，48学习量小而选择有后果'],optional_adjustments:['后续减少无新判断的重复工序，容许次要人物说不全、没立刻正确；不强加争吵。'],limits:'本进程完整实读当前43—48共49页；旧章仅ad-planning.json登记页，AC F报告仅参考。模型知情自检，默读与文本复述/语序节奏检查，不是人声朗读、真人盲读、市场或文学通过。47自己的书/白纸仅可选指代风险，未确认原纸瞬移。'};
input.issues=[];delete input._instructions;delete input.output;
const sourceTable=state.units.filter(x=>x.unit>=43&&x.unit<=48).map(u=>'|'+u.unit+'|'+u.draft+'|'+u.sha256+'|'+Math.ceil(fs.readFileSync(path.join(root,u.draft),'utf8').length/1800)+'|').join('\n');
const funcTable=rows.map(([u,...cells])=>'|'+u+'|'+cells.map(([t,q])=>t+'（“'+q+'”）').join('|')+'|').join('\n');
const report=`# AD 当前43—48实读与规划风险

2026-10-25；审查者为本次Codex，同一进程知情模型自检。当前六章已完整经AD/read.mjs实读49页，短末页也返回；不是借用AC F阅读量，不是隔离/真人盲读、市场验证、文学通过或作者定稿。没有修改正文、登记新章或重新制造六项原修复application。

## 实读源版本

|章|当前state入口|SHA256（脚本绑定）|实际页数|
|---|---|---|---:|
${sourceTable}

## 逐章功能及收益

|章|目标|阻力|选择|后果|关系变化|
|---|---|---|---|---|---|
${funcTable}

43—45同一顿饭的出门/做/收是连续发生，44真正口味不同、45盐罐归位影响母使用；不能只因都有取放而判同章重复。46把带回的饭变成沈的晚饭，父尝过仍想馒头；47转入普通饭与母衣晨潮晚干；48由女自己辨认拉皱/漏层/松圈，最终接受一针略远。本程未确认必须启动修订的高置信错误。

## 连续性与动作

AC E落实的三宽来自原第二片豆干边，44沈吃1.5余1.5，母只见当时余2，45女夜先半后整吃净；两只芋分出四整块不是四芋，45末整1随沈自有厚盒带回，46父/沈各半吃净，47空盒归柜48没带。工料40+10=50为旧门本记录非47新收；花册14/沈原8册/18未购/原20未动分开。47沈余5、女余2截至48无新支，不能当后续全部家用资产。

母衣靠桌仍碰，48女早见穿出不等整日体验，晚听母话才同原纸加行，老师第五课仅见到48晨；48练布新旧段分开，退的是当次后两针，偏长一针留下，针/剪刀收齐后才归家。沈父脚仍凳杖，48只坐挑黄叶，不因参与家事就好。周48无新侧图，空手去岸边锁铺时工具包留内，不拿旧分段补回修前细节。

物理逻辑与可操作性：本程未确认硬性失败；保留衣厚、热饭芯、门口狭处、针尖/漏层等真实限制。小物与状态连续性：就实读范围有动作支持；照片只能见页边/新段，不代表别人亲见实体或课堂。旧源的首次/最近页已在研究/AD规划与旧线证据.md逐项给出，未扩大为全书连续性通过。

## 真人语言别扭句

提问：有没有哪句话意思能够看懂，却让你觉得别扭、像为了写得漂亮硬拼出来，或者不像一个人当面会这样说？

### 真人语言硬问题

没有

本次做了对白当面复述、动宾搭配、抽象语句能否落到行动、文本逐句停顿/改口检查；没有人声朗读或真人听审。未取得至少两类测试共同支持明确理解代价的句子，不以审稿人偏好冒充硬问题。

### 风格偏好观察

后段过多慢动作、反复确认/收手/归位形成节奏预期；次要人物也常及时说清不必代做的边界，口气有趋同风险。这与F参考报告相近，本程按49页实际再看，保留44的口味分歧/不甘、45的主人取盐、48的自认错误等不同收益。不是自动必改项，本程不resolve/apply/acknowledge。新规划用需求差异、信息提供、消费取舍、兴趣交流和决定后的后果改善供给；不以每章制造新冲突作区别。

47许女“取自己的书。夹着页的白纸没有挪”没有点书名/纸来历，读者可能联想沈原纸；但本程回读15/21/22/35/36及48，原8册仍沈、许家只收叶页照，14册归女。没有同物转交的正文证据，故只是可选指代风险，不先判瞬移。原反馈纸在护纸中另收，不混到书签。

## 结论与未覆盖

本报告支持正式review绑定本程43—48当前版本和规划风险说明，不给文学分数或出版结论。1—42只按证据表列页回读，未称全读；远期规划尚未写，容量/承接须逐组实际成稿核验。原六已修意见不制造新apply，本程报告未覆盖其全部证据章，留最终当前全60报告再verify。复航/父伤/长期耐用/外流旧图等继续未完，不为展示回收强结。
`;
fs.writeFileSync(path.join(root,input.report),report,{flag:'wx'});
fs.writeFileSync(path.join(base,'planning-inputs/review43-48.json'),JSON.stringify(input,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:true,report:input.report,range:[43,48],pages:49,functions:input.chapter_functions.length,report_sha256:sha(Buffer.from(report))}));
