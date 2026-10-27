import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import{fileURLToPath}from'node:url';
const A=path.dirname(fileURLToPath(import.meta.url)),P=path.join(A,'scenario','东岸末班船-60章独立验证'),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const R=f=>JSON.parse(fs.readFileSync(path.join(A,f),'utf8')), W=(f,v)=>fs.writeFileSync(path.join(A,f),JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const reading=R('g-current60-reading.json'),rows=fs.readFileSync(path.join(A,'g-functions.tsv'),'utf8').trim().split(/\r?\n/).map(x=>x.split('\t'));
const fields=['goal','obstacle','choice','consequence','relationship_change'];
const bodies=new Map(reading.chapters.map(c=>[c.unit,c.pages.map(p=>R(p.evidence).text).join('')]));
const quote=(unit,needle)=>{let p=bodies.get(unit).split(/\n\s*\n/).find(p=>!p.trim().startsWith('#')&&p.includes(needle));assert(p,`quote ${unit}: ${needle}`);return p.trim().slice(0,500)};
const preserved=path.join(A,'g-current60-reading-before-function-refinement.json');
if(!fs.existsSync(preserved))fs.copyFileSync(path.join(A,'g-current60-reading.json'),preserved,fs.constants.COPYFILE_EXCL);
else assert.equal(sha(fs.readFileSync(preserved)),sha(fs.readFileSync(path.join(A,'g-current60-reading.json'))),'Original pre-refinement bytes must still match');
for(const c of reading.chapters){const row=rows[c.unit-1],q=quote(c.unit,row[6]);c.functions=Object.fromEntries(fields.map((f,i)=>[f,{status:'observed',text:row[i+1],evidence:[{unit:c.unit,quote:q}]}]));}
reading.function_evidence_note='结构表引文为该章实际场景锚点，完整因果/知情/钱物与判断边界见逐章笔记；不以自动抽取场景锚点代替语义阅读。57/58概括已对照本程笔记精确化。';
reading.refined_at=new Date().toISOString();fs.writeFileSync(path.join(A,'g-current60-reading.json'),JSON.stringify(reading,null,2)+'\n');
const input=R('cli-logs/g-review-template-current60/stdout.txt');assert.equal(input.expected_revision,339);input.operation_id='g-current60-informed-review-r339';input.report='审查/G-当前60章完整知情实读.md';input.chapter_functions=reading.chapters.map(c=>({unit:c.unit,...c.functions}));input.issues=[];
const comp=(units,judgment,differences,preserve,needles,optional=[])=>({units,judgment,differences,preserve,optional_adjustments:optional,uncertainty:'仅为本同ID两程387页当前版本的模型知情判断，非读者/市场验收；可选不自动必改。',evidence:units.map((unit,i)=>({unit,quote:quote(unit,needles[i])}))});
input.comparison={similar_structures:[
comp([9,21,42],'近邻送面反复出现，当前地理相容','9先立两家门面；21真实送凳遇雨；42廖隔几步问饭，是工作日回声而非三次同一交付','保留9/21/42全部证据与距离采用史',['两家门面','两家门面','廖隔着几步']),
comp([24,30,38,48,57],'六回课堂中多回有退针、留错针','24错带另一面退两针；30自己兜里外分治；38母衣反馈与新段；48退最后两针；57旧段不拆，退新段最后一下','保留不同对象/错误来源/使用反馈，不能按共同收针就删课',['八点四十','八点四十','针','针','针'],['30等处可选择压缩事后解释，原optional仍open']),
comp([35,51,59],'并排看书均保留不同喜好','35买14而18未买；51实物书页与未知图意；59来迟损失15分钟、各自准时回家','8元册与14元册及各自纸签、不同审美',['十四','书','半个钟头']),
comp([43,44,45,46],'饭食操作连续多章，细节密度高','43下工与预算，44实际火候和分份，45原厨房归位，46父女温热最后一块而仍爱馒头','购买/制作/携回/食用不同阶段及不完美口感',['芹菜','芋','饭盒','馒头'],['旧饭食细节和解释句仅供可选减密，不合并不同金额/份额']),
comp([41,56,60],'让使用人确认好用反复出现','41门主推门仍留缝；56柜主独立拿碗且窄路仍在；60电话只报告今日状态，周自己另有社交与做饭','限定改善与亲眼/转述边界，62不重复入账',['五十','六十二','六十二']),
comp([32,54,60],'休闲、口味和自己位置是贯穿主题','32朋友喝茶可不同味；54母为自己文字选灯；60自己录音与朋友看棋分开享受','慢热声音、别人不必全部同意、愿意相处不等于代办',['茶','七十二','录音'],['段尾不替人/自己/停一停的解释可由作者统一减密，现不改正文'])
],distinct_gains:reading.chapters.map(c=>`${c.unit}：${c.functions.choice.text}；${c.functions.consequence.text}；关系：${c.functions.relationship_change.text}`),preserve:['O_BOX_PAINT原观察/类型/作者真相与转箱相对位置','各笔现金、等待胶干布干与使用人亲试','正式课堂18/24/30/38/48/57以及课外反馈之别','原距离采用/三证/原提交，49 retained纠错史，13 optional','戏字两空、不同审美和拒绝有成本的日常声音'],optional_adjustments:['保留旧13条open可选；解释密度和主题用词回声由作者选择，不新造必改或同义意见'],limits:'实际全读当前1—60共387页；1—30为同ID首程143页恢复，31—60为本进程244页。无正文改动，非盲读/真人/市场/作者定稿；引用抽取只做场景定位，不代替完整阅读。'};
delete input._instructions;
let report=fs.readFileSync(path.join(A,'g-current60-report-body.md'),'utf8');
report+='\n\n## 当前逐章SHA、页数与功能\n\n|章|当前稿与SHA256|页|目标/阻力|选择/后果/关系|\n|---|---|---|---|---|\n';
for(const c of reading.chapters){const f=c.functions;report+=`|${c.unit}|${c.draft}<br>${c.sha256}|${c.pages.length}|${f.goal.text}；${f.obstacle.text}|${f.choice.text}；${f.consequence.text}；${f.relationship_change.text}|\n`;}
report+='\n## 逐章原实读笔记\n';for(const c of reading.chapters)report+='\n\n'+fs.readFileSync(path.join(A,c.notes),'utf8');
fs.writeFileSync(path.join(P,input.report),report,{flag:'wx'});W('g-current-full-review-input.json',input);
W('g-review-preparation-receipt.json',{at:new Date().toISOString(),report:input.report,report_sha256:sha(Buffer.from(report)),input:'g-current-full-review-input.json',input_sha256:sha(fs.readFileSync(path.join(A,'g-current-full-review-input.json'))),reading_sha256:sha(fs.readFileSync(path.join(A,'g-current60-reading.json'))),units:60,pages:387,source_hashes:input.source_hashes,body_unchanged:reading.chapters.every(c=>sha(fs.readFileSync(path.join(P,c.draft)))===c.sha256)});
console.log(JSON.stringify({at:new Date().toISOString(),elapsed_ms:Date.now()-Date.parse(reading.launch.started_at),report:input.report,report_bytes:Buffer.byteLength(report),input_sha256:sha(fs.readFileSync(path.join(A,'g-current-full-review-input.json'))),reading_sha256:sha(fs.readFileSync(path.join(A,'g-current60-reading.json'))),functions:input.chapter_functions.length,body_unchanged:true},null,2));
