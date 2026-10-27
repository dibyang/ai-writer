import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import{fileURLToPath}from'node:url';
const A=path.dirname(fileURLToPath(import.meta.url)),P=JSON.parse(fs.readFileSync(path.join(A,'project.json'))).project,sha=b=>crypto.createHash('sha256').update(b).digest('hex'),read=f=>JSON.parse(fs.readFileSync(path.join(A,f)));
const m=read('final-first-reading-manifest.json'),six=read('final-first-exit-six-state.json'),cp=read('checkpoint-final-first-capacity.json'),stateBytes=fs.readFileSync(path.join(P,'.writer/state.json')),s=JSON.parse(stateBytes);
assert.equal(sha(stateBytes),cp.state_sha256);const changed=[],added=[],now=[];
function walk(r=''){for(const n of fs.readdirSync(path.join(P,r))){const ref=r?r+'/'+n:n,st=fs.lstatSync(path.join(P,ref));if(st.isDirectory())walk(ref);else now.push(ref);}}walk();
for(const ref of now){const old=cp.files[ref];if(!old)added.push(ref);else if(sha(fs.readFileSync(path.join(P,ref)))!==old.sha256)changed.push(ref);}const missing=Object.keys(cp.files).filter(r=>!now.includes(r));
assert.deepEqual(changed,['审查/AE-final-first-语义笔记.md']);assert.deepEqual(added,[]);assert.deepEqual(missing,[]);
assert.equal(sha(fs.readFileSync(path.join(P,m.semantic_notes.ref))),m.semantic_notes.sha256);
const get=k=>six.rows.find(r=>r.kind===k).product,doctor=get('doctor'),status=get('status'),check=get('check'),sources=get('sources');
const refs=['COMMON-G9.md','prompt-final-first.md','final-first-entry-audit.json','final-first-reading-manifest.json','read-proof-final-first-partial.json','reading-resume-final-first-recovery-verification.json','checkpoint-final-first-capacity.json','final-first-exit-six-state.json','ROOT-60-TIME-REVIEW.md'].map(ref=>({ref,sha256:sha(fs.readFileSync(path.join(A,ref)))}));
const stop={schema:1,saved_at:new Date().toISOString(),native_id:m.native_id,project:P,full_author_review_scope:[1,66],completed_first_stage_scope:[1,36],unread_prose_scope:[37,66],counted_complete_pages:181,page_size_utf16:1800,segments:[{name:'final-first',native_id:m.native_id,termination:'root-observed exit1 capacity failure',elapsed_ms:1467764,error:'Selected model is at capacity',completed_units:[1,24],completed_pages:105,partial_unit25_pages:[1,4],result_preserved:'native/final-first/result.json'},{name:'same-id-recovery',native_id:m.native_id,resume_verified_at:read('reading-resume-final-first-recovery-verification.json').at,reread:[{unit:24,pages:[5,6]}],completed_units:[25,36],complete_pages:76,labels:'ffr-',exit_observation:'pending root actual observation; this file is not a process exit result'}],revision:s.revision,registered_units:s.units.length,generation:s.tool_control.generation,content_id:doctor.build.observed_content_id,runtime_id:doctor.build.runtime_id,state_sha256:sha(stateBytes),product_state:{stale_units:status.stale_units,changed_sources:status.changed_sources,impact_pending:status.impact_pending,mechanical_check_ok:check.ok,literary_quality:check.literary_quality,unregistered_drafts:42,source_versions:Object.keys(sources.versions).length,source_ranges:sources.ranges.length,entry_differences:sources.entry_differences.length,unpublished_entries:sources.pending_edits.length,issue_counts:get('issues').counts,revision_sessions:get('revisions').sessions.length,revision_transactions:get('revisions').transactions.length},capacity_checkpoint_comparison:{changed,added,missing,all_other_project_files_unchanged:true},semantic_notes:m.semantic_notes,reading_manifest:'final-first-reading-manifest.json',evidence:refs,open_findings:['F03_HANDOVER_REMINDER: local high confidence candidate, source/author adoption still pending','ROOT-60-TIME-REVIEW: required later full60/source review and formal revision closure, not optional','31-34 cabinet customer identity: pending, different jobs plausible but not specified','first36 recurring boundary narration and quiet ending template: optional whole-prose risk, not full66 verdict'],forbidden_actions_performed:false,remaining:['same-ID restoration check and reread notes/necessary36 last pages before37','read37-66 fully','recheck old9 applications without erasing13 optional and49 retained history','close real hard findings through authorized official revision if confirmed','effective67 scope negative case','draft export and byte verification','original archives/build/command total audit'],next_checkpoint:'checkpoint-final-first.json',checkpoint_readback_receipt:'reading-resume-ffr-final-readback-verification.json',completion_claim:'first-stage actual reading complete only; full66 review and acceptance incomplete; no export/seal/complete'};
fs.writeFileSync(path.join(A,'final-first-stop.json'),JSON.stringify(stop,null,2)+'\n',{flag:'wx'});
const table=m.units.map(u=>`|${u.unit}|${u.draft}|${u.sha256}|${u.pages}/${u.pages}|${u.segment==='original-capacity-failed-segment'?'final-first':'ffr'}-u${u.unit}-p01…p${String(u.pages).padStart(2,'0')}|`).join('\n');
const text=`# 全书首停交接：1—36实读完成，1—66审查未完成

原生ID ${m.native_id}。本次是原final-first容量失败段加同ID恢复段，共同构成首程，不是前程正常退出。根已观察原exit1、1467764ms、Selected model is at capacity；原native结果及容量CP均保持原样。本文件保存时，恢复进程的实际退出仍待根观察，未自造exit0。原任务激活2026-10-26T06:07:11.820Z；恢复完整CP核验时间${stop.segments[1].resume_verified_at}；本交接保存${stop.saved_at}。时间没有扩大阅读范围，也不把前程容量时间冒作恢复耗时。

实际完整当前1—24章105页来自原段；原25仅前4/6页不计完成。恢复先完整读回原笔记、24章5—6页，再25从第1页全6页重新读，至36全部完成76页。合计36整章181页（1800 UTF16/页，同章最多两页一批）；24复读2页及25原半章4页均不重复加数。此前1—20口算88已纠正83。37—66正文从未在本首程读取，不能说全66已读。

全部路径/SHA/页证及每个回包的output SHA和证据文件SHA见final-first-reading-manifest.json；下表是实际阅读范围。字节核对仅证实已返回页覆盖，不代替逐章文学阅读。语义笔记为作品内审查/AE-final-first-语义笔记.md，各章目标/选择/后果/关系分别引句，含知情/钱物/时间/语言/重复。主要四项引句已逐字核当前正文，错误转述已在笔记纠正；不改小说。没有借A/B/R页证或旧AD路径抵本ID阅读。

|章|当前登记路径|SHA256|实读页|页证前缀|
|---|---|---|---|---|
${table}

## 当前构建与六类末态

r396，66登记，gen9；CID ${stop.content_id}；RID ${stop.runtime_id}。用最终交付安装工具cli-g9，ffr-final-doctor/status/check/sources/revisions/issues均exit0，前后state SHA一致，doctor无错误/警告。状态stale_units/changed_sources/impact_pending均空。check是mechanical-only，literary_quality仍unreviewed，42旧未登记草稿仍警告；滚动valid11/stale65、13待覆盖窗口仍原状，不能当全书文学通过。

source44版本/35区间，20入口差异中5仅未发布编辑入口（33、54、AE规划研究、V22、V23），15匹配历史发布区间，非漂移待处理。16 revision会话/25事务保持。旧9应用needs-recheck、13optional open、49误判原retained一项保持，未verify/resolve/apply。旧5、19、21、36本程已读到当前证据，但正式应用复核尚未登记；42/45/51/58未读。完整作者任务仍1—66，36只是本进程断点。

对根容量CP逐文件核：只语义笔记改变，零新增/删除作品文件；所有66当前正文SHA、源码/安装资源、来源及冻结报告对象、旧报告封存、状态均未改。初始审计未重取覆盖。六类详证final-first-exit-six-state.json。

## 接续必须知道的物账与日期

36末故事到停航第29日周一夜；28日周日书约已兑现，29日沈正常上班、许16—18:30值守。下一周三缝补课尚未到，不把章次当日次。父伤脚一直需垫凳/松鞋/歇，不凭能热饭/读书推康复。船仍停，未开航；许何只走东岸到桥头入口，旧发图事实不能抹掉，新图限实际所走。

原灰绿工具箱左后角月牙白漆观察不可改：梁所有→周受托9:48从许收→4章铺架下合扣并梁回照；八件点清，锤原缝梁确认。原押80（50+10×3）沈交父钱盒，借/还双纸盒底；不能拿此80充81柜修。公款门修35（20+10+5）第3日月底许交周签簿，凳柜81（料26工55）第4日父钱包50+20+10+1另付。新凳24料+60工=84第13日实收，旧薄翘板廖自留、凳宽29高44长90，廖改四脚内存放不强立窄。风扇第20日16实收20找4；纱门第24日22实收50找28，原扣留、旧双螺丝随物主。第25日邻铺薄木4实收5找1；松椅第26上胶拟20未收→27日胶稳实坐20实收物主包脚带走。另27日8:30女人家木门只看裂的后加木条、柜已挪，未卸未修未收费，正式半天待约；柜门照片/尺寸另一活，36物主未归侧图待补，未接物未报价。不得把这些所有门/椅混成一案。

沈原8元旧画册从15章买（父当日已知并看鞋）→21借姑娘→23第15日15:20还沈；大白纸两面无字原夹内，姑娘自己小纸条已取走。33父再借原册、34还沈床头，35日未带书外出，36周一携原册独袋到店午休读后傍晚带回。姑娘末页短信误认长巷，沈已明确是原8元册纠正，不能以女应预知为错；旧36意见仍待正式复核。35姑娘花册手机付14并带回，沈18薄书未买仍架，预留20钱夹内格仍在。花册包纸折入女衣袋，旧信封反面画两花；不把该信封、包纸、用感纸和沈白纸互换。红花/叶白照片给沈、沈拿自己手机给父看，父没有实读姑娘花册。

父浅蓝旧短帘做袋，两柄四加固口；20铁角只钩白边两三针，未裂布未坏柄；21姑娘平补该边，父不吹捧也接受，后袋父椅边/提水报下楼无新断。母工装原右肘薄磨；24第二课四边实补角厚、误贯双层两针已拆；25工作靠桌认角走路不觉；27/30/33持续穿洗反馈，33女专程见老师只纸/旧练布，未带衣，原纸交阅后还。周六第三洗，周一领根/夹层摸干后穿，靠桌仍认角，夜母自记“周一，三洗后穿，靠桌还认角”；不报从此都软/不碍，衣母椅背。女自己裤内薄赠布外灰线，周四整天穿后洗→周五夜干收→周日再穿，钥匙仍包不测重载。36新六七针仅在旧练布旁，松紧仍不齐，收针自盒/剪合，赠薄余布纸套仍柜。师未见当前衣/裤耐久，后课开放。母旧桌灯未修，不把可转读书灯自动当那盏旧灯修好。

周廖25日1:58至近16点喝茶已发生；周杯自带未用仍干，廖家花/字杯洗留，未变借杯。28日周午后真关铺、买两弯茄私费无数搭断葱、热昨夜饭炒茄吃和午睡；不是只口头休息，也未确定照廖煮清面。两女互留电话/照片，母只知道女当面转述/所给照片，不自动知道全部短信。母听戏自主，36老何误听尾字后自认听错，女只晚饭听母讲。

## 真人语言别扭句与未决证据

局部高置信候选F03_HANDOVER_REMINDER：3章p4“她想起老何让明早接班看一眼”，2章p2许对何说“明早你接的时候看一眼”。前句回指归属反转，读者需回翻谁让谁/谁接班，朗读也需补宾语。当前SHA分别见上表，原句位置见各页证。保留完整发现，后程核有效来源及作者采用边界；方向只纠归属，不擅改情节。本程未修，也未当工具缺陷。

全篇风格风险（基于已读1—36，后半未下结论）：反复伸手欲帮→收住→问清条件→做到够用→各物归位→坐下/灯结尾，人物职业不同确实带来不同后果，但情绪曲线及旁白结算仍同形。例如6“她没有替女儿算那条近路该省几分钟”、9同章两个拒绝镜像、32“不用先把一项活摆在人中间”、33纸布/针盒/关灯、34又衣物归位关灯。阅读代价是多次解释已由动作表明的分寸，长筹备延后兑现，人物容易共享同一种懂边界声音；属可选收紧，不以事件不同排除风险，也不自动升必改。35审美不同互问、36孩子手影/何听错、自主翻书给真实收益，不能只算模板词频。

正常文风保留：1“这根只认角度”有松插头实物前因；6“我得先把人家的半个钟头还上”有真实代班；32“嘴又没跟我签过哪一种”有家面与店面口味；35两书日头/屋檐比喻有颜色支撑；36“衣袖也像跟着站着”有柜前劳动及晾衣画。对象、动作、搭配、因果能由原场景直达，正常省略/比喻/职业安排不误伤。没有以“能猜意思”给全书自然语言通过，更未读取隐藏预期或拿样本文字改小说。

待核柜门来客：31上午邻铺补柜底两薄木4已完；32p5提“上午来问柜门的人”未量，33继续开口缺厚薄，34等侧图、36人未归。柜底防猫薄木和柜门本可不同物/不同客，正文未明示相同，不能硬判同一活回退；也不替作者发明新客来消疑。33有效CR33_RECALL_ID_V2未指定此人，作为身份清晰度待核。34p6“若她要出门”近处欠名词，35女告母“若店主要走，再出来”补出店主，时间矛盾排除，本地指代停读为可选清晰度。

根ROOT-60-TIME-REVIEW.md必须保留：首录入口181“午后许蓉将纸收起来时”，185—195首次私人录存未发；其后多处自己“上午那条录音”/早晨录唱写。62—64发何“听得熟。嘴还不熟”短语音不是私人唱段首录，372/402老何分享原声又另一条；78临近中午仅听原声，199唱起得早不能倒补未叙述首录。没有精确分钟不能排除上午/午后冲突。本首程未读60正文，以上是根发现原样保留，不是本ID全文核实或已修。后程全读60、核真实旧有效源/作者约束，确认需改须独立revision、影响重登/尾读/prepare/commit，限定验证副本；不藏为可选润色或已通过。

## 失败、恢复及下一步

原capacity失败与25半章证据原样保留；恢复CP完整通过才继续。辅助引句核对一次PowerShell引号解析失败（exit1、无文件改动），改独立ffr-quote-audit.mjs后完成核对；元数据摘要有一次输出截断，已缩小字段重取，不是正文截断，未拿截断元数据冒充页读。初始1—20口算错误已更正，181只按实际完整回包长度计。

最后完整CP使用checkpoint-main-complete final-first 66，随后实际check-main-reading-resume ffr-final-readback回核；结果见同名receipt，不能只信本交接预期。容量CP不得覆盖。CP后作品内不再写文件。恢复段实际退出由根观察；随后必须同ID先核完整CP、读本笔记与36必要末页（建议p6—7，必须确认原书/新花书/工装第三洗/新针脚状态），再从37p1开始逐章整读至66。本首程不读37，不登记全66报告、不verify旧9、不导出、不complete/封存。后程还需全66实读、旧应用复核、新硬问题正式闭环、有效67范围负例、草稿导出/字节校验、原封存/构建/命令总审计。真实作品、源码与Git未动，不创建代理/其他聊天、不换模型。
`;
fs.writeFileSync(path.join(A,'交接-全书首停.md'),text,{flag:'wx'});
console.log(JSON.stringify({ok:true,saved_at:stop.saved_at,revision:s.revision,project_changes:changed,all66_prose_unchanged:true,manifest_pages:181}));
