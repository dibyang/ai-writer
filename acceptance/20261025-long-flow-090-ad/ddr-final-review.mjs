import {fs,path,base,project,sha,assert} from './c-utils.mjs';
const mode=process.argv[2];assert(['tail','main'].includes(mode));
const priv=JSON.parse(fs.readFileSync(path.join(base,'ddr-revision-private.json'))),root=mode==='tail'?priv.workspace:project;
const rd=r=>fs.readFileSync(path.join(root,r),'utf8'),j=r=>JSON.parse(rd(r));
const put=(r,v)=>fs.writeFileSync(path.join(root,r),typeof v==='string'?v:JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const orig=JSON.parse(fs.readFileSync(path.join(project,'.writer/drafts/ad-dr-review55-60-filled.json')));
const state=j('.writer/state.json');
const template=mode==='tail'?'.writer/drafts/ad-dr-revtail-review-template.json':'.writer/drafts/ad-dr-final-review55-60-template.json';
const x=j(template);assert.equal(x.expected_revision,state.revision);
const coverage=[];const texts={};
for(const c of orig.chapter_functions){const u=c.unit;const ref=Object.keys(orig.source_hashes).find(r=>r.includes('/'+String(u).padStart(4,'0')+'-'));const t=rd(ref),h=sha(Buffer.from(t));texts[u]=t;const labels=[];let at=0;
 for(let n=1;n<=Math.ceil(t.length/1800);n++){const label=u<58?`ddr-window${u}-p${n}`:`ddr-revtail${u}-p${n}`,v=JSON.parse(fs.readFileSync(path.join(base,'read-pages',label+'.json')));assert.equal(v.sha256,h);assert.equal(v.from,at);assert.equal(v.text,t.slice(v.from,v.to));at=v.to;labels.push(label);}assert.equal(at,t.length);
 for(const k of ['goal','obstacle','choice','consequence','relationship_change'])for(const e of c[k].evidence)assert(t.includes(e.quote));
 coverage.push({unit:u,ref,sha256:h,chars:t.length,han:(t.replace(/^#.*$/gm,'').match(/\p{Script=Han}/gu)||[]).length,pages:labels});}
assert(texts[58].includes('沈成林问老板怎么说，他听到自己问的那句'));assert(!texts[58].includes('沈禾问老板怎么说，他听到自己问的那句'));
for(const[r,h]of Object.entries(x.source_hashes))assert.equal(sha(Buffer.from(rd(r))),h);
x.operation_id=mode==='tail'?'ad-dr-revtail58-60-r296':'ad-dr-final-window55-60-r'+state.revision;
x.chapter_functions=orig.chapter_functions.filter(c=>c.unit>=x.from&&c.unit<=x.to);
const commonLimit='同ID创作模型知情自检，非独立读者或真人验收。主r290登记60后实际连续实读55—60共56页，96971字符/82442汉字；仅58问话人修正后增加1字符/1汉字。全部重登至60后，再完整连读修订区58—60共28页/48622字符/41148汉字，逐页SHA与切片已实核。55—57正文保持原SHA，不冒称修后又全文重读这三章；55—60当前覆盖为本进程前述全六章阅读加完整修后尾段。未做全书1—60全文、真人盲读、市场或实物长期验证。';
if(mode==='tail'){
 x.comparison={similar_structures:[
 {units:[58,59],judgment:'均有看画、停页、先独处再交谈，收书/杯水有反复阅读成本。',differences:'58是父另纸形成自己的意见并要求重听，沈扶父后真独坐且回来听；59是本人错行交清造成迟到、共同时间实少十五分，朋友只夸未见实物的过程，沈按时回家洗头。',preserve:'保留父仍想后来、两友不同喜好与迟到损失，不为差异强增冲突。',optional_adjustments:[],uncertainty:'模型知情判断。',evidence:[{unit:58,quote:'不是喜欢等。我想念给你听。'},{unit:59,quote:'我下工了。她晚，不是我晚。'}]},
 {units:[59,60],judgment:'都展示一小点并期待回应，解释想被听后微笑的形式有接近处。',differences:'59女直接求朋友夸，朋友未见布只肯定问/退过程；60母自己录下不熟，女愿听却不愿跟唱，母曾催才收回，晚录含静候问话还留本人机中。',preserve:'保留身份位置交换及女的拒绝，不把愿听等于必须会唱。',optional_adjustments:['边界解释旁白可选精简，不升级必改。'],uncertainty:'模型知情判断。',evidence:[{unit:59,quote:'没猜到我得先夸。'},{unit:60,quote:'自己又不是来收两个人的节目'}]}
 ],distinct_gains:orig.comparison.distinct_gains.slice(3),preserve:orig.comparison.preserve,optional_adjustments:orig.comparison.optional_adjustments,limits:commonLimit};
}else{x.comparison=structuredClone(orig.comparison);x.comparison.limits=commonLimit+' 修订正式合入后逐项核主稿与本次已读SHA完全一致。';}
x.issues=[];
const report=mode==='tail'?'审查/AD-DR-revision-58至60重登后完整尾段复核.md':'审查/AD-DR-55至60六章当前SHA知情连读-完成.md';x.report=report;
let r=`# AD D ${mode==='tail'?'独立revision重登后58—60完整尾段':'55—60当前SHA六章完成'}复核\n\n审查者：Codex，原生同ID 01a1719b-d587-7672-bb36-49be0acfa08d；唯一AD样本，模型知情自检。\n\n${x.comparison.limits}\n\n`;
r+='|章|去标题汉字|实读页数|当前SHA256|\n|---|---:|---:|---|\n'+coverage.map(c=>`|${c.unit}|${c.han}|${c.pages.length}|${c.sha256}|`).join('\n')+'\n\n';
for(const c of orig.chapter_functions){r+=`## ${c.unit}章目标、阻力、选择、后果、关系\n\n`;for(const k of ['goal','obstacle','choice','consequence','relationship_change'])r+=`- ${k}：${c[k].text} 原文：${c[k].evidence.map(e=>'“'+e.quote+'”').join('；')}。\n`;r+='\n';}
r+='## 六章相似结构与真实差异\n\n';for(const c of orig.comparison.similar_structures){for(const e of c.evidence)assert(texts[e.unit].includes(e.quote));r+=`### ${c.units.join('/')}\n\n${c.judgment}\n\n${c.differences}\n\n保留：${c.preserve}\n\n可选建议：${c.optional_adjustments.join('；')||'没有新增。'}\n\n`;}
r+='## I_AD_DR58_SPEAKER逐字修订与后续影响\n\n修前原稿保存：58 SHA772badfddd9c7a820c07b604bceaf5f3df402b330d1723a3236d6e0d38fc9c40，修订区.writer/drafts/ad-dr-rev58-before.md。主稿r292为基线，独立revision 6fa1ada9-fcb9-4f06-abd3-cfcf0fff7693内只把“沈禾问老板怎么说”改为“沈成林问老板怎么说”，其后“他听到自己问的那句”和“她笑着点头”现在与父问女答相合。沈成林没有被写成亲历糕店，不新增共享知识。59/60正文逐字未变。58—60分别重新取区内写前context/template、实读全文、逐项核summary/characters/timeline/ledger/evidence/downstream、preview及record；这不是重取59首停模板冒称恢复。原59写前材料及冻结段始终保留。\n\n'+(mode==='tail'?'此处仅报告独立候选已核，尚待主稿prepare/commit及意见apply/verify，未提前宣称主稿意见已闭环。':'正式合入结果及同字节核对另见ddr-revision-commit-proof.json；本报告供当前主SHA正式review及随后意见verify。')+'\n\n';
r+='## 旧线的实际推进与未发生边界\n\n55未收58→56现场补孔固/原门复装、两人原位盘碗坐写实试、60找2净58归台历→60本人电话有限日用，周只记今、未到场、未重收。柜浅盘顺而大碗仍侧并存，绝非长期包好。55/56课前硬尾→57师实读48/旧纸、只退新角最后一下，自收仍厚→59沈只听述且实获女转告母笑夸，尚未见新布照。56父借8册当日已还→58本人用轻袋取盒/两报/个人纸并真重念→59父看女出门归家，无新借册。58明约59→59女主动报晚、先独看后真相见到五点十一收书并分别，只结此一次见面。59何讲自己再找→60实际新分享、母听后认异唱；夜母口述才添女所知。59遗杯只告沈→60夜女亲口告母，之前母未知。60早录/晚录只有母女听文件，何仅口语和交班后现场半句；晚条先按录再问，手机临持已还母，两条不删不转外人。\n\n原14/8、门料10总50/抽屉18/柜46+12实58、三宽条各1.5吃净、母原信封两空、父纸与女白纸/夹纸、48旧段/52旧尾/57新角均守当前登记版本；旧分段不自动同步。原路线图全部流向、照片外侧、母衣永久舒适、父伤康复、灯柜长期、复航与父辈全史均未证不强结。\n\n';
r+='## 真人语言别扭句\n\n有没有哪句话意思能够看懂，却让你觉得别扭、像为了写得漂亮硬拼出来，或者不像一个人当面会这样说？\n\n### 真人语言硬问题\n\n本次修后尾段没有新增确认硬问题；已列I_AD_DR58_SPEAKER本次仅修一次。自己/原/未以及否定式边界旁白密度、“原8册”“如今沈自己”“他把纸接近些”仍属可选自然化建议：当前物件、指称及转手可追，不自动必改。没有为了原意见再造第二次修改。\n\n按当面说话、动宾拆分、具体落地、默读改口核：父仍想后来，沈晚十五分仍不快，谭仍想荐现有口味，熟人恋棋，何不唱，女愿听不跟唱，母会催后认自己也需准备；没有将他们都改成懂同一道理的旁白人。父杖/扶臂/健脚落稳、凳与杯纸分拿，课堂针收齐才托无针边，59临递册后各还，60先按录后问并交还手机均可实做。未真人朗读，不把check或报告字段校验冒称文学/作者验收。\n\n';
put(report,r);put(mode==='tail'?'.writer/drafts/ad-dr-revtail-review-filled.json':'.writer/drafts/ad-dr-final-review55-60-filled.json',x);
fs.writeFileSync(path.join(base,mode==='tail'?'ddr-revtail-coverage.json':'ddr-final-window-coverage.json'),JSON.stringify({mode,revision:state.revision,coverage,report,report_sha256:sha(Buffer.from(r)),tail_reread_after_all_records:true},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:true,mode,revision:state.revision,report,coverage:coverage.map(c=>({unit:c.unit,han:c.han,pages:c.pages.length})),issues:0}));
