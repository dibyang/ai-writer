import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const V=path.resolve('acceptance/20261020-long-flow-090-v');
const W=path.join(V,'scenario/东岸末班船-扩展验证');
const read=p=>fs.readFileSync(p,'utf8');
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const put=(p,x)=>{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,typeof x==='string'?x:JSON.stringify(x,null,2)+'\n',{flag:'wx'});};
const s=JSON.parse(read(path.join(W,'.writer/state.json')));
const auth=['prompt-a-first.md','prompt-c-first.md','prompt-c-first-v2.md','prompt-c-first-v3.md','recording-project-note.md','b-rolling-window-note.md'].map(f=>`# 本地授权来源 ${f}\n\n${read(path.join(V,f))}`).join('\n\n');
put(path.join(W,'研究/V-C3-实际授权来源.md'),auth+'\n\n# 本次用户补充原话\n\n原授权、当前ab14身份、10—12创作、三线兑现、正式7—12修订区只重登7首停全部不变。以check实际列出的窗口为准；局部7—9/7—12报告不自动覆盖4—9。\n\n# 本执行代理选择\n\n日历普通细节选择：停航第三日正逢月底，第10章当日；第11章停航第四日16:30，第12章第五日。不改变既有日序。费用与修订选择由执行代理在授权范围内组织，不冒充人类逐项指定。\n');
const evidence={quote:'原授权、当前ab14身份、10—12创作、三线兑现、正式7—12修订区只重登7首停全部不变。',local_source:'研究/V-C3-实际授权来源.md',source_sha256:sha(path.join(W,'研究/V-C3-实际授权来源.md')),locator:'本次用户补充原话及以上逐份保留的本地验收提示；无可用消息ID',recorded_by:'V-C3实际Codex执行会话'};
put(path.join(V,'inputs/c3-workflow-trial.json'),{expected_revision:s.revision,operation_id:'v-c3-trial-10-12',author_evidence:evidence,workflow:{stage:'trial',task:'完成10—12实际分段创作、逐章完整自检登记与当前滚动窗口；再进入正式7—12修订，改7/9普通事实并仅重登7后首停',authorization:{allowed_actions:['discuss','plan','draft'],draft_range:{from:10,to:12},revise_range:null,stop_conditions:['第10/12至少5000正文汉字，第11至少3500；各至少两个真实顺序片段经assemble，完整回读修正/报告/draft_review后preview成功才record。','第11/12实写柜位与路线后果，回看首次/最近/知情链；完成12后当前7—12完整连读正式review，并按check补齐实际应有窗口。','完成主12及报告后另正式workflow转revision：draft_range null，revise_range 7—12；独立区修改7/9及必要下游。','本进程独立区只重登7到candidate1—7后首停；不重登8，不prepare/commit/abort，主区12章原字节只读；根核验后同ID续8—12。','只写V；不派代理，不改产品/U/T，不提交推送上传；保留所有旧稿/输入/失败和真实双流。'],},planning:s.governance.planning}});
const common={arc_id:'A5',setting_refs:['设定/人物与声音.md','大纲/扩展骨架-V.md'],research_refs:['研究/V-C3-实际授权来源.md'],forbidden:['逆改1—3与不可变观察','把约定或远程获告当亲见','强解父辈旧事或复航日期','重复电话解释填篇幅']};
const plans=[
{unit:10,title:'月底的三十五块',goal:'月底第三日把西门原35元真正结付，让交班后的许蓉回家参与一顿饭',change:'周岸亲收35元；老何接后段核票记付，许蓉与女儿实际做饭坐吃，原80和沈家76不动',cast:['许蓉','老何','周岸','许蓉女儿'],recall_ids:['F_GATE_QUOTE','T_ROUTE_STEP','P_ROUTE_MASTER'],beats:['停航第三日正逢月底，许蓉清点本月零支现金并核原票；钱来自值班备用零钱，不由她个人代垫','周岸到场，实际试原西门插销；核原35元票，许蓉交20+10+5，周亲数收，双方在维修页记已付，原票仍夹本','周岸回铺保留次日第四日16:30的沈家约；不在本章提前安装或收76，其他活只说明实际范围','老何接值班簿/母图/钥匙；当日两椅由检修人实送回并核数，不推定此前已还','许蓉回家，女儿择菜而她烧锅；两支旧勺/饭盒只在本章实见洗过才核；共同做饭，吃时不再抢替对方刷锅']},
{unit:11,title:'盒子放进去',goal:'第四日真实装回柜门、补木托，让沈禾的饭盒能顺手拿且关得上门',change:'父女共同挪桌/摆碗，周岸实际安装、返旧样，沈父实付总76；使用位置由父亲询问女儿后确定',cast:['沈禾','沈成林','周岸'],recall_ids:['T_SHELF_USE','P_HINGE_SAMPLE','P_CABINET_MATERIALS','F_CABINET_APPOINTMENT','T_EARLY_BATCH'],beats:['停航第四日16:20沈禾回家，与父亲共同挪饭桌；16:30周岸带自己包与材料到场，不替脚伤父亲安排独搬','周岸返旧样、核票与配件，拆松木托补原孔并新装；沈父坐着递物，沈禾扶门板','实际试盒/摆碗/关门，发现扣耳与碗位相碍；父亲先问她的手怎么拿，调层板和碗位而非劝放桌上','反复试开关稳固、扫屑归工具；沈父从另一钱包取现金76实交，80原退款与钱据不动；周数清留收款字样','沈禾自己装取饭盒一次；父亲承担坐着擦碗这份活，女儿留出坐下吃饭时间，不做强行和解']},
{unit:12,title:'沿着坡走',goal:'第五日一位推车旅客真正使用入口补注到坡/桥头，老何接手使许蓉能按时离开',change:'具体东岸出行困难被当事人与老何处理，母图转到接班人手上发挥作用；沈禾不承诺接早取，周岸按约止工，生活各留时间',cast:['许蓉','老何','问路旅客','沈禾','周岸'],recall_ids:['T_ROUTE_STEP','P_ROUTE_MASTER','T_EARLY_BATCH','T_SHELF_USE','F_GATE_QUOTE'],beats:['第五日下午仍停航，许蓉/老何同班交替时一位推小车的旅客带未补旧图来，明确不是6章妇人；核图给当前两张之一','老何在许蓉接窗时陪走东岸，旅客先错把药店阶当入口，自己认字比较粮油店；沟边停下收好滑动货袋，慢推上坡到桥头','旅客自行继续过桥只写实际目见范围；老何返候船室回告自己实见段落，许蓉获告而非同行；新旅客不代表旧外流图全收','实际交班母图簿/钥匙给老何，许蓉离岗；沈禾另场拒次晨临时加早份、按正常收工到家，柜位真正使用','周岸在铺结束已约一段，留未接新活；许蓉与女儿在家吃，末章保留父辈留白/复航未知和小安排的有限效果']}
];
for(const p of plans)put(path.join(V,`inputs/c3-plan-${p.unit}.json`),{...common,...p});
console.log(JSON.stringify({prepared:true,revision:s.revision,auth_sha256:evidence.source_sha256,plans:plans.map(x=>x.unit)}));
