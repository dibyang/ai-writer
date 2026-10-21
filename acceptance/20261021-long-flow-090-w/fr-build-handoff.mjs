import fs from'node:fs';import path from'node:path';import crypto from'node:crypto';import assert from'node:assert/strict';import{fileURLToPath}from'node:url';
const W=path.dirname(fileURLToPath(import.meta.url)),P=path.join(W,'scenario/东岸末班船-规模验证'),read=f=>JSON.parse(fs.readFileSync(f)),hash=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex'),v=read(path.join(W,'f-title-repair-verification.json')),inv=read(path.join(W,'fr-current-inventory.json')),s=read(path.join(P,'.writer/state.json'));assert.equal(hash(path.join(P,'.writer/state.json')),v.state_sha256);assert.equal(v.issue.effective_status,'verified');
let doc=`# W-F同ID恢复：最终修复后当前入口

当前主r${v.revision}/schema6，24章，paused、仅discuss、draft_range=null、revise_range=null。I_F19_TITLE_TIME已真实采用→draft应用→新当前全24报告复核，effective_status=verified/context_changed=false。当前完整模型实读未发现新增高置信硬问题，节奏风险与optional_style仍如报告保留；不是作者定稿、真人/市场或正式发布。

## 权威入口与身份

W：${W}
P：${P}
当前state：P/.writer/state.json，SHA ${v.state_sha256}。fr-final-state-r113.json是本次原字节交接副本，恢复仍以P当前state.units为准，不能拼旧v1/旧分段或用旧报告认证新SHA。

工具始终P/.writer/tool/bin/ai-writer.mjs，所有本FR产品命令只经W/w-writer.mjs唯一fr-标签。generation=${v.identity.generation}；content=${v.identity.content_id}；runtime=${v.identity.runtime_id}；最终包archive SHA=${v.identity.archive_sha256}。fr-final-doctor/fr-final-identify实际缺失与不匹配均空，未换包。delivery-final的历史installed=false/regression_complete=false不作现状；最终构建/回归/安装仍由planning-build-verification.json、planning-guidance-update-verification.json及实际工具收据说明。generation2/e980及delivery-current/product-frozen-current仅D旧安装基线，均保留。

第一产品调用fr-entry-main-status核主r105，state与parent-first-f-state.json同字节；先读同F第一轮交接及f-root-issue19.md。原prompt-a-first.md整体授权与本次prompt-f-title-repair.md明确修订授权有效，新本地证据P/研究/FR标题修订真实授权.md只记录真实原话。未伪称作者亲自逐项采用。

## 唯一正文差异与保护

- 同历史路径：正文/0019-提前的两个钟头-v1.md。
- 首行旧：# 第十九章 提前的两个钟头
- 首行新：# 第十九章 提前的一个半钟头
- 旧SHA：${v.body_checks[18].before}
- 新SHA：${v.body_checks[18].after}

保留历史文件名是为了原意见同路径旧稿绑定；现行章题、当前正文SHA及manifest为准。标题后全部原字节一致，其他23正文一致，前18完整units对象一致。19原summary准确写16—18:30挪14:30—17、无错title字段，保留正确追踪；19—24正式重登产生新state消费身份，仅20的上一章正文依赖从19旧SHA转新SHA，没有一刀切刷新外部来源。snapshot的唯一派生差异为19引文证据SHA转新稿，人物/时间/事实与观察内容不改。

全部观察三字段仍：type=observation；statement“箱盖左后角有一块月牙形的白漆。”；author_truth“箱盖左后角确有月牙形白漆；它不是暗号，也不能单独充当排他归属证明。”。74既有config/设定/大纲/研究文件逐项原SHA，28旧报告与冻结对象保留，根产品冻结324项及P根定制42项仍匹配。根源码、原作者作品和旧封存未写；无代理、Git提交推送或上传发布。

备份：W/originals/f-title-repair，含r105完整state/units/snapshot/review_workflow、24正文和原意见版本；actual-base-state.json/actual-base.json/actual-session.json/actual-prepared.json为真实会话基线与最终元数据副本，追加时间在本次最终审计，未冒称它们全在r105时就生成。令牌与owner本地入口fr-session.json，勿复用D的committed token。

## 正式修订与意见闭环

主r105→workflow revision r106（discuss/plan/revise，draft=null，revise19—24）→主resolve adopted r107→begin新独立会话。采用actor为agent-within-authorized-scope，authorization绑定真实governance ${v.issue.resolution.authorization.ref} / ${v.issue.resolution.authorization.sha256}。采用基准仍旧19SHA，先于begin，非事后刷新基线。

修订ID：${v.session.id}；owner：${v.session.owner}；scope19—24；base_revision=${v.session.base_revision}；base-state SHA=${v.session.base_state_sha256}；base清单SHA=${v.session.base_file_sha256}；revision build_id=${v.identity.revision_build_id}。owner/token详fr-session.json及cli-logs/fr-revision-begin，身份与tool content/runtime分字段记录。

候选正式rewind19→首行改字→19→24各章完整原生阅读（19:1—210、20:1—198、21:1—350、22:1—231、23:1—203、24:1—234，每次≤100）→真实replay-input→六字段实读报告及draft_review两SHA→每章preview退出0后才record。六份报告P/审查/FR-19到24-标题修后实读重登.md，具体逐项路径/源SHA/标签在fr-source-check-19到24.json和总验证。18→19另原生回读18:127—226，核母衣/练布/灯/首课与次日换班接缝。

候选r114登记尾段review成功为r115，ref .writer/reviews/51801b91-a3e7-4389-a5a0-2641a829c2e9.json，报告审查/FR-19-24-标题修后当前完整尾段.md，SHA c6bbac8daacec3d426011c98df60b3e21fcdaa997264d20c16e87a122f14daf8。主prepare无冲突后commit：transaction_id=${v.transaction.transaction_id}，status=completed，主r108；commit_id=${v.commit.id}，branch_revision=${v.commit.branch_revision}。新会话committed，主r109正式apply，change_scope=draft，真实同路径旧新SHA改变，不用tracking绕门。

主r110暂停后本次全24新pass，r111登记新全稿review，r112正式verify resolved，r113最终paused。意见application绑定真实commit与completed事务，verification引用${v.review.ref}，记录SHA ${v.review.record_sha256}。当前effective verified/context_changed=false，不只是历史status字样。

## 新当前全文实读与报告

f-title-current before=${v.full_read_boundaries.before.at}，after=${v.full_read_boundaries.after.at}；state SHA=${v.full_read_boundaries.before.state_sha256}，units SHA=${v.full_read_boundaries.before.units_raw_sha256}，snapshot SHA=${v.full_read_boundaries.before.snapshot_sha256}，前后全部一致。原生FastCtx从state.units第1至24单调全读，每次limit100，Partial按提示offset101/201/301继续到末；没有中途写正文/state，没有以脚本SHA代读或用本次修订前六章阅读代替全pass。

新报告：P/${v.review.report}；SHA ${v.review.report_sha256}；冻结${v.review.frozen_report}；正式review ${v.review.ref}，当前全部24冻结正文与依赖匹配。120个goal/obstacle/choice/consequence/relationship_change字段和6组比较有本次当前引文。审查者同一模型知情，非真人/盲读/市场。

正文汉字总计${inv.total_body_han}（不含首行章题）；仅标题新增一汉字，正文体汉字数不变。所有当前路径、SHA和完整返回范围如下。

|章|当前P相对路径|正文汉字|SHA-256|原生FastCtx完整行|
|---|---|---:|---|---|
`;
doc+=inv.inventory.map(x=>`|${x.unit}|${x.draft}|${x.body_han}|${x.sha256}|${x.read_lines}|`).join('\n');doc+=`\n\n## 三链、三普通事实与新题实际承接\n\n晚课/工装：V6第13报名/半桌/90分钟；V7第18首课只练布；V8第21修袋只平边、厚处退针；V9第22洗布、23干后裁、24第二课误针自拆/重折/20:30收针，母实际穿弯伸和走取水后自归柜，色深/硬角/针眼保留。姑娘/母知情不混，余布女抽屉、补片随母衣、借针归老师、自针盒窄桌、灯床头。\n\n窄凳：V6第14先看料工60；V7第17弃坏端定90×27×44另料24、18未成架不坐；V8第21实交收84/试坐并付雨天挪筐成本；V9第23竖收失败换四脚侧收/拒今晚削2，24廖真坐吃几口、按侧位收/清葱皮，仍27，靠背椅/小板凳/盆筐各留用途。周先走不代知夜收。\n\n浅蓝袋：V6第15另存短帘折袋，V7第16四接头洗晾/18摸透干后父首次半水盒报门口短用，V8第20借损卸物坦告先得许可/21仅补白褶小段真还父验针轻用；V9第24修后真短行、父自己拒街口、上楼交沈换扶手/家返父卸空挂椅，毛点/原四带和伤脚仍保留。不是看ledger resolved就认完成，姑娘未亲见末次短行。\n\nD三事实：13每回2小时→1.5小时承18/24两次19—20:30；17宽28→27承18连接、21端锅/挪筐、23侧位拒削、24收肘露沿；21后天15:00→15:30承22的15:24到/15:30亲交/十几分钟收包/16点下班。原新历史见drr-actual-body-diff.md，本FR用当前全文实核。19新题1.5小时前移对应16:00→14:30和18:30→17:00，各90分钟；茶会14:45—16:45两小时另有所指，自洽排班不改。\n\n前12箱八具/80退押/35月底结/柜门81个人付均有限收束，不重开，原箱与单据/钱盒去向有动作。画册沈自购8元，借女非酬金，22大白纸随书回沈、小纸条归女，24沈再读；未知旅客终点/复航不造。详新全稿报告的时间/钱数/伤情/知情/物件及可选风格各节。\n\n## 所有审查记录与当前覆盖\n\n最终check rolling_review valid=${v.rolling_review.valid}、stale=${v.rolling_review.stale}，stale_without_current_coverage=0、pending_windows=[]、unpublished_records=[]。旧stale不删；新当前报告覆盖所有被变版本与窗口。文件存在不等于文学通过。\n\n|范围|记录|报告|报告SHA|当前覆盖|\n|---|---|---|---|---|\n`;
doc+=v.all_reports.map(r=>`|${r.from}—${r.to}|${r.ref}|${r.report}|${r.report_sha256}|${r.coverage_valid?'有效':'旧stale保留'}|`).join('\n');doc+=`\n\n## 暂停、负向、导出与历史去处\n\nfr-negative-context-25：context --purpose draft --unit 25；fr-negative-template-25：record-template --unit 25 --draft 正文/0025-越权测试.md；均无--out，ACTION_OUT_OF_SCOPE/2，前后state保持${v.state_sha256}。25单元纲与正文均不存在。fr-final-discussion成功且含r113暂停/仅讨论/两范围null/已verified及未来无权限/耐久真人未覆盖，next_unit25不是写作许可。\n\n新目录W/export-final-current-24-title-fixed原本不存在，实际export成功，仅manifest.included_units=1—24当前登记路径及各SHA/source_hashes；组合是当前每稿去BOM和首尾空白，用双换行横线连接末加换行，与manuscript逐字节相同。${v.export.manuscript_bytes}字节，manuscript SHA=${v.export.manuscript_sha256}；manifest SHA=${v.export.manifest_sha256}。实际manifest没有单独authoritative_source字段，权威依据为P/state.units及逐项匹配，未杜撰字段。状态draft-export/quality_review required，未上传发布。\n\n旧export-final-current-24、交接-最终当前入口.md、final-usability-observations.md、f-current before/after、新问题原报f-root-issue19.md及旧F报告保留原样，它们描述发现问题时r105/旧19SHA，不是修后当前认证。更早D/gen2、规划交接、旧分段与旧正文均留历史。9份未登记稿仍保留在P/正文并排除导出：\n\n`;
doc+=v.export.excluded_drafts.map(x=>`- ${x.draft}；SHA ${x.sha256}`).join('\n');doc+=`\n\nwarning不是清理指令。R=规划引用顺序-新用户验证的零正文bootstrap证据f-bootstrap-verification.json仍是第一F已完成技术验证，本FR不改R、不以它当文学完成。\n\n## 真实失败、最终检查与未做边界\n\n本FR54次产品调用，全部输入/双流/实际子码/前后state在cli-logs/fr-*，精确顺序见f-title-repair-verification.json calls。意外产品拒绝两次：尾段比较漏23引文→读help并补真实原句新输入成功；apply误填事务ID→核实际commit对象ID新输入成功，change_scope仍draft。辅助脚本两次结构假设错误（ledger对象/issue.resolution）均保留并改辅助读取后重核，不改业务state或伪造输出。详fr-failures.md。两个25拒绝是预期保护。无网络调用、网络中断或事务中断，不捏造recover。\n\n最终fr-final-status/check/doctor/revision list/review-issues list/tool identify均子码0，state不变，stale_units/changed_sources/impact_pending空；5会话committed、8事务completed，无活跃/待恢复，D旧事务仍completed。当前标题问题verified有效，全部新当前覆盖有效。根冻结324/包identity/定制42/前18/其他23/观察/外部来源和旧F文件已逐项核，验证主文件f-title-repair-verification.json SHA ${hash(path.join(W,'f-title-repair-verification.json'))}。\n\n本轮未新发现高置信硬问题；主题边界解释与连续晚饭归位有整体节奏风险，optional_style不升必改。没有做真人盲读/市场、跨平台/远程CI、真实工艺长期耐久/康复或正式发布。不改根README、不先封存、不写25，不承诺0.9发布、100章验收或文学定稿。正常退出，供根独立核验再决定封存。\n`;
fs.writeFileSync(path.join(W,'交接-最终修复后当前入口.md'),doc,{flag:'wx'});console.log(JSON.stringify({handoff:'交接-最终修复后当前入口.md',sha256:hash(path.join(W,'交接-最终修复后当前入口.md')),units:24,reports:v.all_reports.length,verification_sha256:hash(path.join(W,'f-title-repair-verification.json'))}));
