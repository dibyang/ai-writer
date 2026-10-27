import fs from 'node:fs';
import path from 'node:path';
import {X,P,state,read,sha} from './a-prepare.mjs';
const s=state(),verify=JSON.parse(fs.readFileSync(path.join(X,'A首停保护核验.json'))),u=s.units.at(-1);
const loadLog=n=>JSON.parse(fs.readFileSync(path.join(X,'cli-logs',n,'stdout.raw.txt'),'utf8'));
const status=loadLog('a-final-status'),check=loadLog('a-final-check'),revisions=loadLog('a-final-revisions'),doctor=loadLog('a-final-doctor');
const checks=['a-final-status','a-final-check','a-final-revisions','a-final-doctor'].map(label=>({label,...JSON.parse(fs.readFileSync(path.join(X,'cli-logs',label,'result.json')))}));
const active=revisions.sessions.filter(v=>v.status!=='committed'&&v.status!=='aborted'),pending=revisions.transactions.filter(v=>v.status!=='completed'&&v.status!=='rolled-back');
if(checks.some(c=>c.exit_code!==0||c.before_state_sha256!==c.after_state_sha256)||!status.ok||!check.ok||!doctor.ok||active.length||pending.length)throw Error('final checks not clean');
const summary={at:new Date().toISOString(),revision:s.revision,next_unit:status.next_unit,state_sha256:sha(read('.writer/state.json')),checks:checks.map(c=>({label:c.label,exit_code:c.exit_code,started_at:c.started_at,before:c.before_state_sha256,after:c.after_state_sha256})),stale_units:status.stale_units,changed_sources:status.changed_sources,impact_pending:status.impact_pending,active_revision_sessions:active,unfinished_transactions:pending,doctor_errors:doctor.errors,doctor_warnings:doctor.warnings,tool:{generation:s.tool_control.generation,content_id:doctor.build.observed_content_id,runtime_id:doctor.build.runtime_id,provenance:doctor.build.provenance},rolling_review:check.rolling_review,unregistered_drafts:check.draft_inventory.unregistered,literary_quality:check.literary_quality,draft_review:u.draft_review};
fs.writeFileSync(path.join(X,'A首停最终检查摘要.json'),JSON.stringify(summary,null,2)+'\n',{flag:'wx'});
const fmt=v=>`|${v.path}|${v.sha256}|${v.body_han}|`;
const all=s.units.map(v=>{const t=read(v.draft);return {unit:v.unit,path:v.draft,sha256:sha(t),body_han:(t.replace(/^#.*$/gm,'').match(/\p{Script=Han}/gu)||[]).length};});
const handoff=`# X轮 A 首停交接

本次A首次执行在此主动停止，正常返回。当前作品P：${P.replaceAll('\\','/')}。只写X；没有调用代理、修改根lib/bin/tests/docs、改其他acceptance/作品/W、Git提交推送、发布上传、付费或修改全局配置。根的独立首停核验尚待执行，本交接不冒充根验收。

## 权威、入口与真实停点

当前revision **${s.revision}**，登记1—25，next_unit26。state SHA256 **${sha(read('.writer/state.json'))}**。25在r116登记，r117仅保存26有限首停任务；不是用next25覆盖旧paused任务。旧暂停事件完整保留，新授权来源是研究/作者请求-X-原文.md（原X/author-request第3行，SHA b1dc4eeeff37d1c97c97955931cf3ec2f98fe794730f4cd2265b84ecdb10d785）及研究/X-A有限执行指令-原文.md，没有消息ID不造。

工具generation3、0.9.0，content ${summary.tool.content_id}，runtime ${summary.tool.runtime_id}。实际source_commit ${summary.tool.provenance.source_commit}、dirty=${summary.tool.provenance.dirty}，与environment中root source_head不同属来源元数据，不曾tool update。所有产品命令均由node X/x-writer.mjs a-唯一标签调用P/.writer/tool/bin/ai-writer.mjs，原argv/输入/双流/退出码/前后state在X/cli-logs各标签下。

工作流stage保留drafting，allowed_actions=discuss/plan/draft，draft_range25—27，revise_range=null；这是同ID续程的有限授权，当前执行已经按首停条件暂停。26尚未完成，不能把两段当一章或跳27。续完26、27后完整连读22—27复盘；本轮不继续28，不写37，28—36仅骨架。若要做旧章修改测试，另走正式revision授权，不先动主稿旧24。

1—24按state顺序、原生FastCtx每次limit100完整读至Complete，a-entry-current before/after完全相同。恢复报告：P/审查/X-A当前1-24完整恢复.md。P/研究/X-A恢复基线核对.json与X边界文件保存每章路径/SHA。A首停保护核验.json实核3919个原文件，仅.writer/state.json发生产品正式推进；全部24正文、完整units、V1—V9及原O_BOX_PAINT的type/statement/author_truth相同。

## 第25章：已登记当前稿

路径 **${u.draft}**，SHA **${u.sha256}**，正文汉字 **${verify.chapter25.body_han}**，30193字节。五个实际片段，六个场面；有序assemble仅用空白separator，实际合章字节与列入片段吻合。最初v1完整回读后发现冷藏目的/双手占用不清及灯朝向，保留v1及纠正报告，另存01/05 v2并重新assemble、最终原生FastCtx完整读1—290行。

当前五片段（旧v1保留为过程，不拼回当前稿）：

|路径|SHA256|正文汉字|
|---|---|---:|
${verify.chapter25.parts.map(fmt).join('\n')}

最终自检报告 **${u.draft_review.report}**，SHA **${u.draft_review.report_sha256}**；draft_review.draft_sha256=${u.draft_review.draft_sha256}；冻结ref **${u.draft_review.frozen_ref}**。报告有完整覆盖、有效纲文回对、四项语言测试、人物知情与物件连续性、未覆盖项。知情模型自检，不是独立盲读、真人朗读、作者定稿或市场/正式文学验收。

写前模板.writer/drafts/a-record-25-before-v1.json（r115）保留原样；最终输入.writer/a-inputs/record-25-final-v2.json，SHA ${verify.chapter25.record_input_sha256}。a-preview-25-final退出0后，同一SHA输入用于a-record-25-final，退出0/r116。没有用新模板替换旧哈希或拿v1报告认证v2。

25实际结果：母工装早买菜/下午值守穿用，靠桌略顶、走路不觉，夜亲洗湿晾四边合，尚未见干态；女纸条夹记事簿、自己的裤未拆放房椅。沈回糕店实际接提早来货，原备货信封归旧账格，午饭被客打断后吃完。周廖午面相约下周四14—16到家喝茶，周记本预留而未赴。姑娘买糕付款，向沈本人述第二课补袖/误针已拆，沈回述昨日父带袋小补仍合，互存号姓名但正文未展示姓名，暂约下下周日14点书店，各问班尚未准。晚母只听女、父只听沈有限述；沈空饭盒归柜、画册从门边椅归床头，白纸仍在，父袋取空挂椅/脚仍垫。

三项新稳定ledger ID均已绑定25实际引文：T_X_COAT_DAILY partial，first/latest25，due33/V12；T_X_TEA_AFTER_WORK pending，first/latest25，due32/V12；T_X_BOOK_COMPANY pending，first/latest25，due35/V13。后两项跨过新卷再兑现；远期未写不能resolved。计划链及旧证据回查在大纲/扩大骨架-X.md与研究/X-A新阶段承诺-25登记前.json。13卷的既有V1—V9未动，新增V10—V13四次实际volume已登记；近期25/26产品plan及27近程骨架已保存，远期仅粗排。

## 第26章：只有两段中间稿，未合章未登记

写前r117实际plan/context/outline/三项新承诺recall均已调用；相关旧正文14/17/23等在入口完整pass读过，25最终稿刚完整复读。context字符量31303，未超40000，无删限制或静默裁切。context保存.writer/drafts/a-context-26-before-v1.json；新模板.writer/drafts/a-record-26-before-v1.json（expected_revision117，摘要与changes仍空）。全部12个写前source_hashes目前匹配，见研究/X-A-26写前来源核对.json及A首停保护核验.json。续程先核来源；若改变，实读评估后另取新模板，不能只刷新SHA。

当前两段共 **${verify.chapter26.body_han}正文汉字**（1568+1570），已各自原生FastCtx完整读至Complete；没有正文/0026完整稿，没有26的assemble/record-preview/record，也没有26事件进入state或ledger。

|当前可续段路径|SHA256|正文汉字|
|---|---|---:|
${verify.chapter26.parts.map(fmt).join('\n')}

原始段v1也全部保留：

|原段路径|SHA256|正文汉字|
|---|---|---:|
${verify.chapter26.v1_preserved.map(fmt).join('\n')}

局部纠正记录：审查/X-A-26中间稿局部纠正记录.md。v2补清前后罩动作、未来六天时间指代、热气位置、葱筐后用、接剪刀动作/围裙用语；是局部自检，不是完整章报告或文学通过。后续按v2继续，原v1不删除。

两段实际已写：第十九日星期五，周从架下取久搁的小风扇，向物主承认拖延，拆前后罩/清灰/取下磨坏外线，原件旧纸上、小螺丝浅盒、未通电；约午间回电，配件价未回、尚未报价修好/付款。新来女人希望下周四午后看母家刮地门，周明确私人喝茶半日不接，双方改约下周六8:30先看、10点她们仍出门，不先卸门；她实际发地址及新门底照片，未到场。午间廖少面收摊、先吃、凳侧收里墙，牌翻/卷门锁/钥匙裤袋，围裙带家；家里挪花盆/两椅小桌/软管，邻居借剪刀当场剪枯枝后归还，只听“下周四周岸两点喝茶”，没有拿她的搪瓷托碟。廖实际洗晾围裙，开始找桌底旧壶。

**精确停点**：廖在家小桌旁，竹筛已拖出到脚边，几只旧夹子已放桌上，小花盆挪椅旁，两手刚够进旧壶两侧；尚未将壶取出、未确认壶盖在哪/能否用。下一未完动作先接取壶、找盖/清洗或暂放的选择，不重开他从摊回家的开场；之后可自然转去沈午后问班及姑娘自己的询班，母衣晾后等尚未写处。周午间回电仍欠，不能默认已经修好或有配件数。

当前26写作层物件/知情：周铺风扇敞着罩里侧、旧线在旧纸、小螺丝浅盒，电话/回电纸眼前，茶约本柜上，包已挂；来问门女人只知周下周四去朋友家，不知廖姓名/两点茶约全貌。廖家两把椅围小桌，旧翘板仍砖上垫盆，软管门后、围裙门边晾，剪刀已归廖；邻居带盆/剪枝离开，无人交托碟。面摊凳在里墙/靠背椅在摊，不把它搬到家中；26前两段之外人物仍以25state为权威。尤其沈、女还没各问班，工装干态未写，父仍伤脚，原画册没有再借。

26本次停在中途，后续完整章目标至少8000汉字，27至少10000；本次不提前给未写的后半章填summary/changes。真正续完、合章、全文回读、四项测试与纲文回对后，再另存报告/最终登记输入并preview成功才record。

## 错误、检查与未覆盖

唯一非0产品调用a-context-25，实际退出2：--out误指.writer/a-inputs，产品要求.writer/drafts下新JSON。失败前后state同为718044dc6fc3da6424119e682df93abb876c521070ff49f64189d6e7d272f9fe。停止依赖后读context/record-template实际help，另存研究/X-A-context-25纠正输入.json，a-context-25-v2成功。所有失败输入/双流/子码保留；不是产品源码问题，本轮未改产品。另一次只读定位.writer/tool/skills目录不存在，已依实际glob纠正为.writer/tool/.agents/skills；没有将读取错误当成功。

最后四条产品调用：a-final-status、a-final-check、a-final-revisions、a-final-doctor，全部exit0且前后state不变。status stale_units/changed_sources/impact_pending均空；revision list只有历史committed/completed，无活跃修订或未完事务；doctor errors/warnings均空，身份未漂移。check为mechanical-only、literary_quality=unreviewed。10个UNREGISTERED_DRAFT warning中9个是入口已有旧候选，1个是保留的25-v1，均不删除、不合回；26分段不在正文清单，因此本交接显式列出。

rolling_review：valid12，stale18，18全部已有current coverage，stale_without_current_coverage0，pending_windows=[]。25—27尚未三章齐，工具尚未触发该新窗口；不能据空列表声称已读完25—27，更没有伪造该窗口报告。27完成后仍须实际读22—27。

终检摘要X/A首停最终检查摘要.json；保护核验X/A首停保护核验.json。25报告只支持其绑定字节；26只有局部复读。全天穿洗/多日袋耐久/长凳长期承重、真人读者及根独立验收都未证明。没有封存、导出、提交推送；留待根独立核首停并发同ID续程。

## 当前已登记1—25路径、SHA及正文汉字

旧1—24为保护基线，字数只作当前字节清单，不追溯套用新章8000门槛。正文汉字均去Markdown章标题再计Han。

|章|当前路径|SHA256|正文汉字|
|---:|---|---|---:|
${all.map(v=>`|${v.unit}|${v.path}|${v.sha256}|${v.body_han}|`).join('\n')}
`;
fs.writeFileSync(path.join(X,'交接-A首停.md'),handoff,{flag:'wx',encoding:'utf8'});
console.log(JSON.stringify({handoff:path.join(X,'交接-A首停.md'),sha256:sha(handoff),revision:s.revision,units:s.units.length,chapter25_han:verify.chapter25.body_han,chapter26_han:verify.chapter26.body_han,final_checks:summary.checks,stale:summary.stale_units,changed_sources:summary.changed_sources,active_revisions:active.length,unfinished_transactions:pending.length,doctor_errors:doctor.errors,rolling_review:check.rolling_review},null,2));
