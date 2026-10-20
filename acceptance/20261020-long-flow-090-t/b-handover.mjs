import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {base,work,read,sha,state,write,save} from './common.mjs';
const v=JSON.parse(fs.readFileSync(path.join(base,'b-final-verification.json'),'utf8')),s=state();assert.equal(s.units.length,24);assert.equal(sha(read('.writer/state.json')),v.state_sha256);
const gates=[22,23,24].map(n=>{const m=JSON.parse(fs.readFileSync(path.join(base,`chapter-${n}-metrics.json`),'utf8')),r=JSON.parse(fs.readFileSync(path.join(base,`commands/record-${n}/result.json`),'utf8')),ref=`审查/T-${String(n).padStart(4,'0')}-纲文回对.md`;assert.equal(m.pre_record_review.sha256,sha(read(ref)));assert.equal(m.sha256,sha(read(`正文/${String(n).padStart(4,'0')}.md`)));const mtime=fs.statSync(path.join(work,ref)).mtimeMs;assert(mtime<Date.parse(r.started_at));return {unit:n,body_sha256:m.sha256,report_sha256:m.pre_record_review.sha256,report_mtime:new Date(mtime).toISOString(),record_started_at:r.started_at,report_saved_before_record:true};});
save('b-pre-record-order-verification.json',{gates,note:'File order/version only; actual reading is documented separately. 19 historical report-order failure remains preserved.'});
const review=JSON.parse(fs.readFileSync(path.join(base,'commands/review-24/stdout.raw.txt'),'utf8'));
const elapsed=Math.round((Date.now()-Date.parse(JSON.parse(fs.readFileSync(path.join(base,'b-entry-reading-before.json'),'utf8')).at))/60000);
write('交接/T-B-完成0024.md',`# T-B完成0024：文件恢复后停在24

2026-10-20，新原生B客户端按本轮自然语言授权，只从文件恢复，没有使用前客户端会话记忆、没有启动代理。入场实际status/workflow/tool identify/revision list/tool updates：21章、r59/schema6/generation4，全部旧修订committed、事务completed，无pending/漂移；旧A交接r58/gen3只是历史。现在**已登记24章、revision62、generation4、next25；本客户端正常结束，不开始25**。自入场阅读快照约${elapsed}分钟。退出回执/实际原生线程ID由父外层捕获，本文件不预造。

## 必须先看的未决

**H1仍未修**：滚动全文实读发现24第23行来前电话提前说何也来，何明确决定同行到第33行才发生，23没有此前同行约定。证据审查/T-0024-已登记硬问题-H1.md及审查/T-0019-0024.md。24已经登记，B没有改其主稿/段稿/state或刷新模板。父需正式revision从最早24起，覆盖届时真实末章与进行中25的来源影响；最小候选是收窄来前电话，不提前替何确认。24摘要/林与陶状态中电话获何来也需重核。没有预造父修订结果。机械绿灯不表示H1不存在或文学通过。

## 当前身份和机械结果

- tool 0.9.0/generation4，content ID ${v.tool_content_id}，runtime ID ${v.runtime_id}；与入场相同，identify missing/mismatches均空，tool_control未变。没有重装旧包或再次update。
- state SHA256 ${v.state_sha256}；24章/r62，stale_units/changed_sources/impact_pending均空、unregistered空。check findings=[]，rolling valid11/stale7、stale_without_current_coverage0、pending_windows=[]。doctor errors/warnings均空。无新修订/更新未决事务。
- 原1—21正文SHA及原21条units与入场一致；原1—18引入的23条旧ledger完整字节结构未变；workflow/decisions、作品根AGENTS/docs/skills哈希均保持父工具更新验证中的值。证据T/b-final-verification.json。是机械保留证明，不表示全文复审过1—16。
- 22/23/24分别用原写前模板r59/r60/r61，prepare→context/template实读→四段写作→最终合章实读/修正后复读→先存纲文回对及SHA→只summary/changes登记输入→flow record，实际preview/record/check成功。T/b-pre-record-order-verification.json核三章报告文件mtime先于record真实started_at、报告哈希与当时metrics一致；只证明顺序/版本，不代替实读。

## 实际正文、段目录及SHA

|章|Han|段数|当前正文SHA256|
|---|---:|---:|---|
${v.chapters.map(x=>`|${x.unit}|${x.han}|${x.segments.length}|${x.sha256}|`).join('\n')}

22/23/24新增正文共${v.chapters.filter(x=>x.unit>=22).reduce((a,x)=>a+x.han,0)} Han。普通章均5000—6500 Han/四段；19仍原六段长章。只有part01带章题，按文件名排序用两个LF精确合章，无trim或换行统一，最终重新机械核逐字节等于正文。每章初合稿及修正过程证据保留，不覆盖旧A段。

|当前段路径|Han|SHA256|
|---|---:|---|
${v.chapters.flatMap(x=>x.segments.map(t=>`|${t.ref}|${t.han}|${t.sha256}|`)).join('\n')}

19—21段表是本次实核当前拼装结果，未改；16—18继续沿既有-r6入口，不新声明1—3/5—6平铺段映射。

## 实际阅读与报告入口

入场18完整1—98，19 1—120/121—240/241—353，20 1—147，21 1—155；原19/20/21读前后SHA一致，范围见T/b-entry-reading-before.json与after.json。工具更新入口、A交接、current-tool-update-verification及T骨架首次实读在快照前，已如实说明；又另做了完整复读及前后SHA：T/b-handover-entry-read-before.json/after.json，实际范围8/75/288/13行均EOF，未补造初读前时间。

22 context实际1—232/233—582/583—939，23 1—180/181—580/581—976，24 1—180/181—580/581—919，模板均1—25 EOF；来源核证T/b-22/23/24-sources-read.json。召回稳定ID后相关旧原文实际读过，8项related_unchanged逐条判断各存审查/T-0022/0023/0024-未变候选判断.md；省略项不伪称全重读。未把旧明确历史点刷新成今天所知，许22新获原价已另更新。

最终单章完整读范围：22首读后修正，最终v3 1—90/91—167；23首读后修正，最终v3 1—159；24首读后修正，最终v3 1—153，均EOF；T/b-22-v3/23-v3/24-v3-read-before/after.json绑定最后字节。单章报告审查/T-0022/0023/0024-纲文回对.md保留当时判断；后来的六章读发现H1，**不倒改它们假装单章当时已发现**。

24登记后重新按19→24全文连读，19三页353行、20 147、21 155、22 167、23 159、24 153，均EOF，36011正文Han；前后SHA相同。审查/T-0019-0024.md SHA256 ${v.rolling_report_sha256}；实际review ref ${review.ref}、coverage19—24、quality=${review.quality}。报告含每章目标/选择/后果/关系、时日/费用/支撑/卸载/通路/各人来源、19五接点与重复风险，列H1/可选意见/未核范围。

## 实际故事日与义务

现在故事止**二十二日晚林在住处吃饭**；具体末时分未写，不编造。19十七日，20十八日，21十九日，22二十日，23二十一日，24二十二日；18有限收场十六日不是仍在进行。

|稳定ID|已发生/状态|原期限或下一步|
|---|---|---|
|T_RACK_INSPECTION|十八日检查/20已付，resolved|只结检查，不是修复。|
|T_RACK_SAMPLE_VISIT|十九日何真关店看样，resolved|许二十日晚才知原100/新订20；原历史不改。|
|T_RACK_TRIAL|二十日14点试配失败，旧件复原，订20结出工，resolved|原80没付；不把原“合总100抵20”改成失败也免费。|
|T_RACK_REPLACEMENT|二十一日陶报告自换错件并实展示齐件/联系何，resolved|路途仅陶口述，不冒充何林亲见。只结换件联系，不是安装。|
|T_FLAT_CART_RETURN|二十二日17:36林亲交陶、入铺里墙，原押50亲退何，resolved|原22日18点前期限保持，林17点到何店，17:15后实际关店走；无逾期/暗改期限。due24只是回查点。|
|T_RACK_INSTALL|pending，实际还没卸/装/付100|原约故事**二十三日14:30林何卸一只，15:00陶到装一对**；陶当日10点先自己送货、过午回铺。新100含两轮装好才付，旧检20/试20共40已花不抵；陶自己错件不再收出工，若架另有问题先停说、不擅改孔。due25为回查点，不是二十五日。|

下一卷仍须完成实际劳动，不提前判适配/修好；许已经明确23日下午留铺接自己答过的客，不能再次数他为劳力。何另一排营业，轻货用自有筐放原车位、重水箱等陶；未新借无用工具/车来满足远卷规划。车跨V7→V8已经回收，不为拖到28—30又无由延借；远卷兑现范围让父依后续真实稿安排。

## 各物当前保管与知情

- **O_FLAT_CART**：陶记里墙原放车侧，推把朝墙、前旧缺角朝外、车面空；陶亲核四轮/旧缺后亲收，不是留门口。原保管何→陶，林仅代推，何同行直到收。何林亲见去处，许仅先见出发、晚经林实告还车/里墙/退押；陶明早要自用，但尚未装货。
- **押50与押金纸**：50退何手后何钱包；原押纸陶写车收押退及二十二日，递回何钱包内格。不是给林代持、不计新100。两个旧20便笺仍何店收据夹/记页，24没有退款。何半箱货另多2已付；关店分别失去盐/洗衣粉等具体生意，不虚报亏损总额。
- **O_RACK_WHEELS**：何棚下原架带货、旧轮/砖/折纸板复原，仍未修。何林陶亲见20日试配失败，许20日晚才经何林转述；23展示齐件、24还车都不等于架好。
- **O_RACK_PAIR / O_RACK_PATTERN**：两新轮各包纸在陶柜旁上层纸盒；原纸样二十二日从陶柜旁小盒取出，入同盒盖内、合盒上层。陶本人收放，何林亲见，许未见新件/原样，也未获新100全部条款；没有交借或提前付款。
- **何自有两筐**：24已摆原车空位，一只散纸一只空，饭桌凳可拉出、灶水池与布柜路留着。只是实际空筐安排，明日全部卸货还没做。
- **旧物继承**：原片周柜下层左纸套/金属盒；原信右；节目单柜上层文件袋。周清稿家中桌边抽屉独立袋，林清稿住处纸夹前层，私人信摘抄后层干处。幕布何后间柜原层、两夹/凳旧借还已结束。不因B未出场观察而替周陈改22日位置/新知。旧片全史、邵全名/年未知，私抄/有限口述许可不扩大，不新开长期场。

## 保留偏差与未实施

B最初规划辅助脚本语法错误、随后PowerShell引号/下游缺文件失败已保留原脚本和原生工具输出，说明T/b-script-failures.md；后续用新v2修正成功再prepare，未拿这些当产品错误。另一次补稿apply_patch因原句不完整匹配失败，未写入，之后以完整段落新调用成功，原生输出保留。没有CLI产品拒绝或来源冲突，不伪造expected2/softfalse测试。所有label小写连字符、没有覆盖命令捕获或写后prepare刷新哈希。

旧A的19报告保存失败而先登记、后补报告偏差仍在A交接与旧报告，本轮新顺序门不追认19当时通过。22/23/24顺序门通过也不证明文学无错，H1即为连读后的实际漏检。

未改产品/S/Q/R/真实作品/Git/全局配置；未联网、发布、付费生成、封存、导出、提交或推送。根git status仍显示入场已有产品路径和.idea等，T/b-final-root-observation.json保存只读观测；未回退/暂存、不推断归属或宣称共享根干净。未完整重审1—16和全部旧备份/正式修订区；未真人/市场/现实承载验证。**父下一步可启动25长章及多点正式修订，本B不写25细纲/段稿，不预制修订结果。**
`);
save('b-handover-verification.json',{at:new Date().toISOString(),ref:'交接/T-B-完成0024.md',sha256:sha(read('交接/T-B-完成0024.md')),state_sha256:sha(read('.writer/state.json')),registered:s.units.length,revision:s.revision,hard_issue:'H1 unresolved, parent formal revision',chapter25_exists:false});
console.log(JSON.stringify({handover:'交接/T-B-完成0024.md',sha256:sha(read('交接/T-B-完成0024.md')),registered:s.units.length,revision:s.revision,elapsed_minutes:elapsed}));
