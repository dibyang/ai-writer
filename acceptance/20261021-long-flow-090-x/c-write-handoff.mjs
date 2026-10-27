import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {fileURLToPath} from 'node:url';
const X=path.dirname(fileURLToPath(import.meta.url)),P=path.join(X,'scenario','东岸末班船-再扩展验证');
const read=f=>JSON.parse(fs.readFileSync(f,'utf8')),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const inv=read(path.join(X,'C首停当前稿清单.json')),exit=read(path.join(X,'C首停退出核验.json')),state=read(path.join(P,'.writer/state.json'));
const identify=read(path.join(X,'cli-logs/c-entry-identify/stdout.raw.txt'));
const template32=inv.templates[1],u31=state.units.at(-1),report32='审查/X-C32首停段稿自检-v1.md';
if(state.revision!==139||sha(path.join(P,'.writer/state.json'))!==exit.state_sha256)throw Error('state drift');
const text=`# X-C首次中途停点交接

当前新鲜C线程正常首停；当前运行界面未提供可核会话UUID，不编造。根应恢复本次实际同ID线程，不能复用A/B旧线程。本次不是三章完成或根验收。

X=${X.replaceAll('\\','/')}；P=${P.replaceAll('\\','/')}。首产品 **c-entry-status** 确认r134/30章，state SHA88f4c786044063002c0a5f8edacb19aad52a7044a584539d1d543ab016e3801f，与parent-before-c-state.json实际字节同。workflow/revision list/identify/doctor/discussion依次成功，无活跃修订或待恢复事务。

## 当前停点

当前revision **139**，登记1—31，next_unit32。state SHA **${exit.state_sha256}**。workflow为trial，有限draft_range31—33、revise_range=null，保留本轮授权及“本首次32两段首停不登记、同ID恢复32/33、33后28—33完整复盘、不创建34”的真实停止条件；没有误设paused抹掉中途任务。

工具generation3/0.9.0，content **${identify.observed_content_id}**，runtime **${identify.runtime_id}**。本次未更新工具。31收据内部tool_build_id实际 **${u31.tool_build_id}**，不手改成identify内容ID。全部产品调用通过X/x-writer.mjs、唯一c-标签，原始双流/输入/前后state见cli-logs/c-*/；没有另派代理、改根产品源码/原作品/旧封存、手改state/hash、封存导出、提交推送或付费。

## 真实读取、规划和第31章

共同边界prompt-common.md、author-request.md、continuity-watchpoints.md完整实读；提示不是已确认错误。交接-B完成.md完整读，当前P工具包writer-project/novel/review及long-form/chapter-delivery/general-review/natural-language-authenticity和workflow/long-form手册已读。实际作者原话沿用研究/作者请求-X-原文.md，本次有限原话新存研究/X-C有限执行指令-原文.md；执行细节由代理在授权内决定，未冒充作者逐项采纳。

**c-entry-current** before 2026-10-21T09:19:23.215Z / after09:20:53.269Z；r134当前25→30，原生FastCtx按章单调完整18页，逐次limit100、Partial精确续101/201，窗口内无状态/正文写。before/after state、units raw、snapshot和六稿SHA全同。尾空行分别至290/218/253/271/227/265，boundary少末空行属行数定义，未缺页。三链recall另核，first25/latest衣30/茶30/书27均实读。另完整读17的花板/剪枝及凳尺寸原锚。不以摘要、旧报告或统计冒充原生全文。

r135先正式outline/discuss+plan/null、真实plan31；r136采用已存在0031及新增大纲/X-C近期执行纲-31-33.md，trial31—33。扩大骨架-X/V10—V13/旧卷旧纲未改。31写前outline/context（显式70000）/template保存；24 omitted分类回查见31报告，不删边界压预算。

31《门外留一张纸》最终 **正文/0031-门外留一张纸-c-v2.md**，**8142正文汉字/六个实际事件段**，SHA **801eb7ebef168c48712cc9e8cd5ba141fcd416e4059cb81f34d0dfe62349f24e**。初五段7715不足，新增427字母亲实际买鱼冷藏/自己听戏短段，实际兑现她想吃鱼的小愿望；由五段自然变六段，旧已消费纲不改，报告如实记偏差。按六段真实SHA assemble，初合章c-v1及最终c-v2均原生完整1—100/101—200/201—245实读。最终报告 **审查/X-C31最终合章自检-v1.md** SHA **79d992fda9b985cbc54da551d223725c5d845b1d6bdea6dc0cf7b42271b831ff**，冻结.writer/objects/79d992fda9b985cbc54da551d223725c5d845b1d6bdea6dc0cf7b42271b831ff.draft-review。纲文回对/四语言测试、硬问题/风险/optional_style分列，知情自检非真人验收。

31原写前模板.writer/drafts/c-template-31-r136.json SHA${inv.templates[0].sha256}；context同目录c-context-31-r136.json。最终输入.writer/c-inputs/record31-final-v2.json SHA24c7d043def8c3ed2a14143cfdc6c123f4d3ae86b7ec123d72f01e417a37000c，c-preview31-final-v2=0 / c-record31-final=0，同一最终输入推进r137。v1预览也0但未record；v2保留各人此前仍有效知识并加本日消息，不把旧知识抹成只有当天，未刷新来源。

## 第32章未完成段

31登记后r138正式outline/discuss+plan/null并plan32，r139采用真实0032引用恢复有限31—33。32真实outline/context/template写前取得，context.writer/drafts/c-context-32-r139.json显式70000、遗漏27项；新增遗漏布/余料/鞋未在32新回收，仍是回查入口。原模板 **${template32.path}** SHA **${template32.sha256}**，11项写前来源当前全部匹配，完整映射在C首停当前稿清单.json；expected_revision139未变。最终完整目标正文/0032-茶慢慢凉下来-c-v1.md **尚不存在**。

${inv.unregistered32.parts.map(p=>`- **${p.path}**，${p.han}正文汉字，SHA **${p.sha256}**，${p.bytes}字节。`).join('\n')}

合计 **3034正文汉字**，仅两个实际事件段。两段原生完整1—62/1—52行读回。32**未assemble、未record-preview、未record，未写state/ledger/角色快照**。局部自检 **${report32}** SHA **${sha(path.join(P,report32))}**，只支持两段，不冒充完整章/滚动复盘。

段内已写：同一个第二十五日周四，周1:58到廖灰门、托蓝白两毛巾下进，坐里侧家椅，自带杯仍在椅旁布袋；两人实际花杯/字杯饮茶吃少许饼干，交换有限木片与午市消息。廖自己看花转一小盆，周喜欢大叶亮边而不替花架动工；谈自己窗台/杯/在家煎豆腐。当前真实停句在02-v3末：“准备给周岸讲讲那一小把到底怎么煮，和摊上那锅有哪里不同。”两人仍坐着，未到近四点，未告别、回铺、重开摊，未写第三段。

下一步从廖准备讲挂面这句接，别重写开场或把两段改称下一章。接完余下三段左右，让实际交流/静默/近四点取杯收场、各回工作有过程，完整32至少8000汉字，再真实SHAassemble新完整路径/原生全读/纲文语言自检/当前报告双SHA/同输入preview0后record。32模板若核到真实漂移须保留旧输入、实读变化再另取，不能只刷新哈希。随后才正式plan33，33至少10000汉字/至少五段；按实际故事日把真实多次穿洗反馈交回学习关系，保留长期耐用边界。完成33后当前28—33完整单调六章阅读、逐章五功能和至少两类每章引文的结构比较、正式review。**本轮不得创建34**。

## 钱时伤情、持有与各自知情

正式state只到31：周13:40关铺途中，廖已收摊归家备茶；女修裤穿身上至午间、仅她消息告诉沈取纸手不挂/钥匙包里；母只亲见早晨，不知女半天工作。沈只见黄袖饭盒照/一角裤，未亲摸；老板只知本店劳动与饭。母衣仍许柜，薄余布纸套/练布/针/记事纸均留女房，老师仍未知30周三新反馈。

31新木片收5找1净4，仅两片交付、不知安装挡猫效果；折椅男人带走未接未收钱，不能补造损失金额。鱼付款数未写、只冷藏未煎；晚上择葱/洗裤/缝枕套扣仍计划。旧箱80/门35/柜26+55=81/凳84/旧锅38/风扇16均有限结清，不重开。原凳90长27净宽44高不改，31收在面摊里墙，家中茶用原两把家椅。周六另一女人家8:30只是先看门，不能与30已修纱门混。父脚仍需垫/坐歇，未愈；未知旧问路人终点、复航新日期、父辈全史均未补造。

仅未登记32稿中：周花杯、廖字杯在托盘；热水壶/茶壶分开，饼干浅碟在小桌；周手机扣在手边可听来电、钱夹钥匙裤袋、自杯布袋椅旁，工具包仍铺柜后，铺外时段/电话纸仍留。廖由周本人话才知两木片/煎豆腐等有限事情，尚不知折椅客户全程；周仅听廖末客问汤，非亲见整场午市。以上不得在恢复前补写进state。

## 三链真实进度

- T_X_COAT_DAILY：first25/latest30 **partial** due33。25穿洗/26软角厚/27再穿久靠/28二洗/30周三真实再穿新纸反馈已给女，老师只见旧纸。31无新穿洗反馈，不假结案；33实际交回后才按范围判断。
- T_X_TEA_AFTER_WORK：first25/latest31 **pending** due32。25约下周四14—16；26/27改另一门至周六8:30和家椅壶准备；30向纱门客留周四；31真收摊归家、真关铺赴约途中。32两段中真到家坐饮已写，但未登记，当前state仍pending，不以词面或计划宣称跨卷已登记兑现。
- T_X_BOOK_COMPANY：first25/latest27 **pending** due35。25下下周日14、26/27分别准班（沈整日/女12:30交完午后不返），前日互告变动；31裤/饭闲聊不等于同行。书店未来营业、各选/自付尚未发生，不改成最近周日；due_unit不是故事日。33若跳日先按实际远约日重核，不强赶回收。

## 过程留存、失败和终检

全部旧片段/模板/报告/合章/失败材料保持。31原02-v1借凳经历未建立/“这一件”不明、03-v1“瓜影”无现场、05-v1广告答话时间别扭、04-v1“最后两碗”后又一份，各另存当前v2；初合章c-v1保留。assemble31-v1.json准备输入7715不足，未消费，另存v2加短段，再最终输入；不能把准备输入叫产品失败。

32原01-v1把被子味当周亲闻，17不支持，另存01-v2去除；邻铺怕锯的心理改为周亲做磨边。02-v1豆腐“前两天”改前些天，02-v2花摊“前两天”改昨天/拆清双壶，最终02-v3全读，所有前稿保留。产品非零调用 **0次**。最初工具编排曾因functions中未暴露FastCtx方法抛TypeError，未进入产品，随后直接原生FastCtx读取；该失败在本会话工具记录中保留，不冒充产品故障。

退出 **c-final-status/check/doctor/revisions全部0**，四次前后state SHA均为当前139不变。stale_units/changed_sources/impact_pending空；doctor errors/warnings空；5个修订均committed、8事务completed，无活跃/待恢复。check为mechanical-only、literary_quality=unreviewed；rolling valid14/stale18，其中18全有current coverage，stale_without_current_coverage0、pending_windows空、unpublished空。31—33未全完成，**没有创建新的28—33 review或声称未来窗口已覆盖**。

check的16条UNREGISTERED_DRAFT警告=入口旧15候选/旧修订稿+31初合章c-v1，全部保留。32在分段目录，不在正文清单，不能据status未列32断言没写段。

C首停保护核验.json/C首停退出核验.json确认原1—30全部完整unit对象逐对象相同、全部正文SHA相同（包含原24保护），原1项observation的type/statement/author_truth均同；不是只比较摘要。32写前11来源全部同当前，未创建32完整稿、33/34正式纲。C首停当前稿清单.json含全部当前31稿/报告/模板/未完段SHA。旧交接-B完成.md、A/B首停及原W绝对路径只作为历史入口，不拿旧分段拼回当前。

## 全部当前登记稿

下表由实际state与磁盘逐项核SHA生成，仅作路径/版本核对，不替代原生全文实读。

|章|当前路径|SHA256|正文汉字|
|---:|---|---|---:|
${inv.registered.map(u=>`|${u.unit}|${u.draft}|${u.sha256}|${u.han}|`).join('\n')}

本交接后正常退出等待根独立核首停，不再写正文或推进state。无封存、导出、提交推送。
`;
const f=path.join(X,'交接-C首停.md');fs.writeFileSync(f,text,{encoding:'utf8',flag:'wx'});
console.log(JSON.stringify({handoff:f,sha256:sha(f),report32_sha256:sha(path.join(P,report32)),state_sha256:sha(path.join(P,'.writer/state.json')),revision:state.revision},null,2));
