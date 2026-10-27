import {fs,path,base,project,j,sha,assert,write,state} from './ef-lib.mjs';
const priv=j(path.join(base,'e-revision-private.json')),root=priv.workspace,s=state(root),main=state();
assert.equal(s.revision,343);assert.equal(s.units.length,60);assert.equal(main.revision,321);
const rd=r=>fs.readFileSync(path.join(root,r)),x=j(path.join(root,'.writer/drafts/er2-tail-review-template.json'));
const oldFiles=['ad-ar-review46-51-final-current.json','bbr-review49-54-filled.json','ad-cr-review52-57-filled.json','ad-dr-final-review55-60-filled.json'];
const history=oldFiles.map(f=>j(path.join(project,'.writer/drafts',f)));
const coverage=[],texts={};let pages=0;
for(let n=48;n<=60;n++){
 const u=s.units.find(u=>u.unit===n),b=rd(u.draft),t=b.toString('utf8');texts[n]=t;assert.equal(sha(b),u.sha256);
 const count=Math.ceil(t.length/1800),returns=[];
 for(let p=1;p<=count;p++){
  const ref=`read-pages/er2-tail${n}-p${p}.json`,v=j(path.join(base,ref));
  assert.equal(v.sha256,u.sha256);assert.equal(v.page,p);assert.equal(v.pages,count);assert.equal(v.from,(p-1)*1800);assert.equal(v.to,Math.min(p*1800,t.length));assert.equal(v.text,t.slice(v.from,v.to));
  returns.push({page:p,ref,sha256:sha(fs.readFileSync(path.join(base,ref)))});
 }
 coverage.push({unit:n,draft:u.draft,sha256:u.sha256,chars:t.length,pages:count,returns,source_hashes:u.source_hashes,source_bindings:u.source_bindings,notes:`er2-tail-notes-${n}.md`,notes_sha256:sha(fs.readFileSync(path.join(base,`er2-tail-notes-${n}.md`)))});pages+=count;
 let c;for(const h of history)c=h.chapter_functions.find(c=>c.unit===n)||c;
 assert(c);x.chapter_functions[n-48]=structuredClone(c);
}
assert.equal(pages,121);
const c=n=>x.chapter_functions.find(c=>c.unit===n);
c(48).consequence.text+='；周先认两张后掀底纸另见第三旧细张，一粗两细三张，不逆改31当次裁两张，也没有新购物料。';
c(54).obstacle.text='桌/杯/篮/线各占地方，48/82/72价与三款取舍，店光不等家光；亲人偏好不同且仍想获认同。';
c(54).choice.text='带自己信封/折纸真试，回家摆食具/休息后正常班，交班再买盒中新同款72、100找28、单票；电话问女后明确这一盏自己用。';
c(54).choice.evidence=[{unit:54,quote:'这一盏我用。'},{unit:54,quote:'数了二十八找给她。'}];
c(55).choice.text='双方同意本次原门补孔待稳复装，工46库存料16共62，先不收款。女保留硬尾待师，不接母袋当夜修。';
c(55).choice.evidence=[{unit:55,quote:'工四十六，料十六，合六十二。'},{unit:55,quote:'那做这一处。'}];
c(55).consequence.text='门墙边/原零件盒上干处、待周三9—10再验装，未收62；用者承担晚饭盖盒不顺。';
c(56).choice.text='原位浅盘/大碗真试、坐写/男亲坐/略转桌角并先招呼，用者自改摆放且接受侧身；交70找8净62。';
c(56).choice.evidence=[{unit:56,quote:'我要知道能不能拿，不是要天天拿。'},{unit:56,quote:'我找你八块。'},{unit:56,quote:'这回六十二。'}];
c(60).consequence.text+='柜主明确六十二已经给过，周不二收，只记今天未报再蹭；不把未报告当永久无故障。';
c(60).consequence.evidence.push({unit:60,quote:'那六十二已经给过'});
for(const f of x.chapter_functions)for(const k of ['goal','obstacle','choice','consequence','relationship_change'])for(const e of f[k].evidence)assert(texts[e.unit].includes(e.quote),`${e.unit} ${k} quote ${e.quote}`);
const limits='同一原生thread 01a1723a-0b10-7d13-bb86-eabb701c7e89 的模型知情自检，非独立读者、真人盲读、市场或作者定稿。r343最后record60成功之后，AD/read.mjs每页1800字符、每次最多两页，48整章完成后再49，依次至60，共121页全部完整返回并实读；不用存盘页、重排清单或重登前同SHA页代替。本证据文件校验页字节，实际返回先后由真实命令记录与根的native公共事件再核，不声称此辅助脚本证明认知阅读。全书1—60最终F尚未进行，本程没有再全文读主路径。';
x.operation_id='ad-e-r2-final-tail48-60-r343';x.report='审查/AD-E-48至60全部重登后完整尾段复核.md';
x.comparison={similar_structures:[
 {units:[48,57,59,60],judgment:'有限成果拿给亲近者看并期待回应，常有先等一句、再展开和承认想夸的相似结构。',differences:'48女练布回家嫌母只说一点；57在新角实退最后一下，先等母听完再直说想夸；59沈未见布只能肯定问与退的过程；60母成为不熟者，女愿听却拒合唱，母曾催后收回。',preserve:'保留位置交换、欲夸与真实限制，不把所有人写成一次就懂。',optional_adjustments:['边界解释与否定式旁白密集处可选精简，不自动改稿。'],uncertainty:'模型知情判断；不以共同词汇证明重复或市场效果。',evidence:[{unit:48,quote:'你不是说你会退了么'},{unit:57,quote:'那你能不能先说我做得还行？'},{unit:59,quote:'没猜到我得先夸。'},{unit:60,quote:'自己又不是来收两个人的节目'}]},
 {units:[50,55,56,60],judgment:'柜门线多次确认同意与实际使用，照片、电话、现场往返容易形成解释成本。',differences:'50常用者首次说半桌用途且地址待发；55现场两孔才知、定62仍未收且晚饭盖盒不顺；56复装原位试盘碗与坐写，交70找8净62；60客户自行几日使用来话，浅盘顺和大碗仍侧并存，只记今不二收。',preserve:'保留原门原件、本人实际试、有限交付与未收到实收的时间。',optional_adjustments:[],uncertainty:'不证明长期可靠或未来不再蹭。',evidence:[{unit:50,quote:'至于她手在里面如何碰到，视频并没有全照到。'},{unit:55,quote:'旁边添“未收”'},{unit:56,quote:'我要知道能不能拿，不是要天天拿。'},{unit:60,quote:'那六十二已经给过'}]},
 {units:[51,52,53,58,59],judgment:'收放书纸、留自己的时间和不代人做决定的动作反复出现。',differences:'51实际朋友共读各带回；52午睡和独读真的发生但厚边未干；53下工后真收挂而女孩迟交承担后果；58父亲自写个人读报纸，沈出门后回听；59迟15分共同时间真少，沈按时回家洗头，不因朋友晚而替老板多折盒。',preserve:'保留不同的损失、身体限制和未统一的趣味，不强造冲突。',optional_adjustments:['收物与解释边界的句群有可选压缩空间。'],uncertainty:'自检无法代表陌生读者耐心。',evidence:[{unit:51,quote:'我回去想先看看没夹着的。'},{unit:52,quote:'她没有定洗帘的闹钟。'},{unit:53,quote:'他来催的时候我还差两行。'},{unit:58,quote:'不是喜欢等。我想念给你听。'},{unit:59,quote:'我下工了。她晚，不是我晚。'}]}
],distinct_gains:x.chapter_functions.map(f=>`${f.unit}：${f.consequence.text}`),preserve:['母图/外流路径、信封两空、篮后物与画内动作未知仍未知。','48偏长针、52旧硬尾、57另空边新角分开；母衣未拆且靠桌仍认到。','14/8册、旧门总50/抽屉18、O_BOX_PAINT、CR33_RECALL_ID_V2与AC版本、旧意见application/commit历史保持。','三受控事实为本次验收参数，不是作者新增原话，不将原值说成创作错误。'],optional_adjustments:['原/自己/未的密度与边界说明可选自然化，本程不扩大风格修改。'],limits};
x.issues=[];delete x._instructions;delete x.output;
for(const a of x.comparison.similar_structures)for(const e of a.evidence)assert(texts[e.unit].includes(e.quote));
const dependencyRefs={};for(const v of Object.values(s.source_versions))if(v.object_ref)dependencyRefs[v.object_ref]=sha(rd(v.object_ref));
let report='# AD E 全部重登后48—60完整尾段模型复核\n\n'+limits+'\n\n';
report+='本程57—59正文未改；60仅五十八已给改为六十二已给。整个E正文变化仅48/54/55/56/60，其他正文包括58既有沈成林提问字节保持。48不倒改31两张、54付款不提前至48、55未收、56现场收款、60回述不二收。\n\n';
report+='## 完整当前版本与依赖\n\n'+coverage.map(v=>`${v.unit}：${v.draft}，${v.chars}字符/${v.pages}页，SHA ${v.sha256}；逐页输入输出与报告见${v.notes}。`).join('\n\n')+'\n\n';
report+='冻结来源对象及真实字节：\n\n'+Object.entries(dependencyRefs).map(([r,h])=>`${r} ${h}`).join('\n')+'\n\n';
report+='## 逐章目标、选择、后果与关系\n\n';
for(const f of x.chapter_functions){report+=`### ${f.unit}\n\n`;for(const k of ['goal','obstacle','choice','consequence','relationship_change'])report+=`${k}：${f[k].text} 引文：${f[k].evidence.map(e=>'“'+e.quote+'”').join('；')}。\n\n`;report+=fs.readFileSync(path.join(base,`er2-tail-notes-${f.unit}.md`),'utf8')+'\n\n';}
report+='## 比较与语言\n\n'+JSON.stringify(x.comparison,null,2)+'\n\n';
report+='有没有哪句话意思能够看懂，却让你觉得别扭、像为了写得漂亮硬拼出来，或者不像一个人当面会这样说？\n\n本次实读没有新增确认的语言硬问题。原8册、如今沈自己等标识偏硬，以及重复否定式边界/微笑/收放动作，列为可选自然化，未借正式修订顺手改文学风格。柜主急于收尾、常用者要真试、父亲仍等后来、沈嫌迟、谭仍想荐现有、何仍爱快落、母会催女后收回、女愿听不愿唱，各有不同需求与不完美。未做真人朗读/盲读，不把机械通过等同文学通过。\n\n';
report+='## 历史偏差、六字段与未证边界\n\n首次六份原字节freeze早于新workflow成功，根核旧plan许可后接纳原提案继续；planned_order_passed=false不变。正式publish/stage/begin均在新workflow之后。387页基线覆盖根已核，但额外严格返回顺序失败不计通过，不豁免本次121页逐章串行最终尾读。旧报告目录read-logs误称按ef-report-location-erratum.md，read-pages及冻结报告SHA不改。\n\n56初次r337虽机械成功，T_D_CABINET_PHOTOS客户仍写付70收2，已正式rewind至338再核六字段并record339修收8，正文SHA未改，旧输入/报告/状态完整保留。本程逐章核当前继承3张/72/62/70找8，未盲搬旧replay-input整条ledger或下游；57—60当前journal和snapshot应再作提交前语义传播核对。旧replay价格只在历史稿/报告允许存在；当前有效新来源/新journal/snapshot须一致。\n\n每章写前context/template及官方replay-input、全文前读/必要修后全文、summary/characters/timeline/ledger/evidence/downstream逐项报告和preview/record均已保存。未更改正文的章也核新依赖，旧报告没有冒用为当前依赖复核。source impact实际from与每次revision、required_readings及报告来自首程真实操作；本报告不把预读方案或F旧报告替代impact。首次from1完整1—60，随后各实际起点保留前缀；根可由e-first/e-second全部对象清单与冻结字节复核。\n\n八项历史已解决意见/13可选保留，受控事实不虚造issue采用/修改闭环。F须新会话实际读全书1—60后逐项当前报告verify，不伪造第二次修改。未导出、未写61、不代表整轮验收完结。\n';
write(path.join(root,x.report),report);write(path.join(root,'.writer/drafts/er2-tail-review-filled.json'),x);
write(path.join(base,'er2-tail-coverage.json'),{ok:true,at:new Date().toISOString(),revision_id:priv.id,candidate_revision:s.revision,last_record:'er2-record-60',read_mode:'serial chapters, at most two 1800-character pages per call; model read all actual returned pages',pages,coverage,dependency_objects:dependencyRefs,report:x.report,report_sha256:sha(Buffer.from(report)),native_order_verified_by_this_script:false,scope:limits});
console.log(JSON.stringify({ok:true,revision:s.revision,pages,chapters:coverage.length,report:x.report,report_sha256:sha(Buffer.from(report)),functions:x.chapter_functions.length,issues:x.issues.length}));
