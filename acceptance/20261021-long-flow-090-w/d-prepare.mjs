import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const W=path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/,'$1'),P=path.join(W,'scenario/东岸末班船-规模验证');
const put=(f,v)=>fs.writeFileSync(path.join(W,f),typeof v==='string'||Buffer.isBuffer(v)?v:JSON.stringify(v,null,2)+'\n',{flag:'wx'}),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const s=JSON.parse(fs.readFileSync(path.join(P,'.writer/state.json')));assert.equal(s.revision,90);assert.equal(s.units.length,21);assert.equal(s.governance.stage,'paused');
const src=fs.readFileSync(path.join(W,'prompt-d-first.md'));put('scenario/东岸末班船-规模验证/研究/W-D-授权原文.md',src);
const evidence={quote:'W轮新鲜D：完成22—24及跨卷兑现，再正式修订三处普通旧事实，独立区仅重登13后停。',local_source:'研究/W-D-授权原文.md',source_sha256:sha(src),locator:'真实本轮用户prompt同字节保存，第1行首句；第5—13行载明篇幅、修订和首停；整体人类原话及代理规模选择见W/prompt-a-first.md第3行。无可用消息ID，不编造。',recorded_by:'W-D本次实际Codex执行会话；具体日常行动与普通事实修订是代理在授权内的测试选择，不冒充人类逐字设定'};
put('d-author-evidence.json',evidence);
put('scenario/东岸末班船-规模验证/大纲/执行细纲-W-D-22-24.md',`# W-D近期执行细纲22—24

新增来源，仅从22起消费；既有13—21正文、旧纲和消费哈希不覆写。当前事实至第十三日星期六，画册实借后约第十五日星期一15点糕店还，父袋已归父椅旁，凳已交廖结84。远骨架已完成的事不重演。

22《书里那张白纸》：直接进入第十五日。姑娘从自己包取借书核好带出，上班后按约15点亲还糕店沈禾，实际换手，白纸随书。以两人对画里物件的不同看法发展平等来往，不把画册当缝补教材或报酬。沈16点下班实带书回床头；父只听沈本人转述归还。晚间母女从母允许的旧料里选深色补片试比，借衣与下一课携出要告知；不当晚全补好。四段分担借书读后的处境、准时归还与店中正常营业、沈家收书及父轻物安排、母女选择补片和出门准备，各有变化而不反复验货。

23《收摊以前》：第十六日星期二。廖营业后要独自清场，窄凳仍90×28/44，靠背椅保留，葱筐案下挡摘葱；自己试竖放发现不稳，改落地侧置在里墙干位，毛巾/盆各有去处，转角和收腿仍有限制。周只按亲见听述知道新摆位，不把已结84重付，也不为收摊加一套新机关；周决定按原约收工，拒当晚另改尺寸，代价是客人另找。沈家分配次日休息半日：父只坐着理轻物、沈不把外出看书日变成全天家务。浅蓝袋保持父所有，装报/盒用途延伸，不许独自登高或伤愈。姑娘在家实际剪出补片试料，留未缝，明晚带旧练布；母女各自安排晚饭，不重复首课整套问答。三至四段，主推进为收摊而非结账。

24《门给你留着》：第十七日星期三，第二课按13既定19点起、每周一次；本章不先修改旧事实。至少四段，拟五段：姑娘出门前从母柜亲接工装与获准深色补片，练布/针盒带好；许18:30正常交班后自行买食/安排休息，不因女上课空等。姑娘第二课以旧练布受检再练固定，把补片压到结实处，先有一处小错拆回，自己完成母袖有限补片，不写成学成所有技艺。同桌为自己裤兜做选择；课堂不全是边界说明。沈父按体力只到楼门口，袋装半瓶水/盒/报，出入有扶臂或停歇，回家取出归椅旁；沈有一段自己的阅读，未洗另一幅帘。廖按23试出的方式真实收凳和再开营业，28宽的收腿/擦收成本仍在，客人真坐，廖自己也坐吃几口而非全作好人；周按自己收工走，不全员集合。末母女实交回补衣、母穿弯肘试用，颜色仍显、需要以后用看，工装归母柜；女针盒/练布归窄桌、灯回房，明天照常，不强结父辈与复航。

小说声音温暖克制，不用报告标题、重复旧段、解释限制或抽象总结凑字。各章context/template来源真实保存；片段完整实读、CLI纯空白separator合章，完整合章回对本纲和正式plan、两SHA draft_review、preview0才record。登记24后完整19—24正式review，再按新阶段独立修订，主稿不能先改。
`);
const planning=structuredClone(s.governance.planning);planning.outline={status:'adopted',refs:['大纲/执行细纲-W-D-22-24.md','大纲/单元/0022.json','大纲/单元/0023.json','大纲/单元/0024.json'],unresolved_ids:['复航/父辈全史/小风扇结果未选，不为本卷收束强补','24完成后才进入13—24普通事实修订，独立区仅重登13停']};
put('inputs/d-workflow-draft.json',{expected_revision:s.revision,operation_id:'w-d-authorize-22-24',author_evidence:evidence,workflow:{stage:'trial',task:'W-D有限完成22—24长章及19—24完整连读review，之后另正式登记revision范围13—24，仅重登13首停。具体日常行动为代理授权内选择。',authorization:{allowed_actions:['discuss','plan','draft'],draft_range:{from:22,to:24},revise_range:null,stop_conditions:['22/23≥6000正文汉字至少3段，24≥8000至少4段；完整逐段/合章实读、纲文回对及当前两SHA报告，preview0才record','24登记后完整19—24连读正式review；之后才正式workflow revision13—24并建立新独立区，主稿旧正文不先改','仅W，不派代理/提交/推送/改产品，不改前12正文units及observation三字段，保留全部旧字节与失败；最终仅重登13停，不prepare/commit/abort/重登14']},planning}});
put('inputs/d-decision.json',{expected_revision:91,operation_id:'w-d-execution-choice',author_evidence:evidence,decision:{id:'D_W_EXECUTION_D',supersedes:'D_W_EXECUTION_CR',topic:'W13—24本轮代理执行选择',status:'confirmed',options:['完成末卷日常兑现后独立修订首停'],adopted_items:['22第十五日按21约定亲还画册，沈收回家；23收摊与家务选择；24第二课有限补母袖和凳袋实际后续','晚课继续不等于全部学成，父脚仍伤、凳需收脚擦收、未洗帘和复航保留','后续13/17/21普通事实测试须真实下游至少六章合理实改，独立区本次只重登13'],excluded_items:['直接改主稿旧章或source_hashes','修改任何observation三字段','强结父辈/全员全知/用ledger状态替正文'],unresolved_items:['三项普通事实的最终选值须在24后实读选择报告确定','复航、小风扇与对岸结果'],effective_range:{from:13,to:24}}});
const common={setting_refs:['设定/人物与声音.md','大纲/扩展骨架-W.md','大纲/执行细纲-W-D-22-24.md'],research_refs:[],arc_id:'A9',forbidden:['不改前21正文及已消费来源，当前revise_range=null','观察三字段与前12正文units保护','不宣告全员困难消失、不强收父辈/复航、不把未来计划记事实']};
const plans=[
{unit:22,title:'书里那张白纸',goal:'按真实约定还书并把新往来留在各自日常中',change:'书实归沈并收回家，母女选到可带下一课的有限补料',cast:['许蓉女儿','许蓉','沈禾','沈成林','谭老板'],beats:['姑娘从借书阅读转到携书赴约，母仅听女有限述修袋/借书','第十五日15点糕店真实当面还书，沈亲接保管且正常营业，书不是报酬或教材','16点后沈带书回家床头，父只听当日转述，袋仍父手边','母女同意深色补片试比并留下一课处理，工装尚未补'],recall_ids:['P_W_PICTURE_BOOK','F_W_BOOK_RETURN','P_W_COAT','T_W_EVENING_CLASS','P_W_CURTAIN_BAG']},
{unit:23,title:'收摊以前',goal:'为收摊和各自休息做一次可用的安排',change:'廖试出可落地侧置的收凳位，周按自己时间收工；沈家有限分工不侵占整日休息',cast:['周岸','面摊主','沈禾','沈成林','许蓉女儿','许蓉'],beats:['廖面对雨后窄凳和葱筐位置的收摊代价，实试竖放不妥后改落地侧置','周听见/亲见后只答眼前安排，拒今晚另改尺寸，已结84不重付','沈父只坐着理轻物，沈留次日半日自己安排，父袋所有与持有清楚','女儿准备深色补片和旧练布，母不先包办，第二课仍未来'],recall_ids:['T_W_NOODLE_STOOL','F_W_STOOL_WIDTH','P_W_STOOL_MATERIALS','P_W_CURTAIN_BAG','T_W_EVENING_CLASS']},
{unit:24,title:'门给你留着',goal:'让第二次晚课、窄凳收放和父轻物袋继续产生真实生活后果',change:'女完成母袖有限补片并亲还试穿归柜，父袋短程带用后取空归椅，廖按收放安排自己坐吃，个人时间有实得亦有限制',cast:['许蓉女儿','许蓉','沈禾','沈成林','面摊主','周岸','老何'],beats:['星期三第二课前女亲接母工装带补料/旧练布出门，母正常18:30交班自行吃休','第二课检查旧练布再做补片，试错拆回后有限完成母袖，不写全能','沈父带浅蓝袋轻装短出门有扶臂停歇，归家取空留椅旁；沈自己阅读未包全天家务','廖按23实际收放凳及客坐收腿擦收，靠背椅保留，自己也有坐吃片刻；周按时走','女返家交衣母试穿弯肘，颜色仍显，衣归母柜、针盒练布归窄桌；未来困难保留'],recall_ids:['T_W_EVENING_CLASS','P_W_COAT','T_W_NOODLE_STOOL','F_W_STOOL_WIDTH','P_W_STOOL_MATERIALS','T_W_CURTAIN_BAG','P_W_CURTAIN_BAG','T_W_BAG_EDGE_REPAIR']}
];
for(const p of plans)put(`inputs/d-plan-${p.unit}.json`,{...common,...p});
put('d-recovery-reading.md',`# D恢复阅读与保护

已先读delivery-current/product-frozen-current/guidance-update-verification，再经w-writer串行status/workflow/revision list/identify/doctor：r90、21章paused、generation2/e980、runtime3f669f82，无活跃修订或未完事务，doctor无错。入口保护见d-start-baseline.json（含完整state、正文清单、观察三字段），此清单不是实读证明。

原生FastCtx已完整实读19 L1—210、20 L1—198、21 L1—350；13完整1—238；14三链首次L101—198；15画册和袋首次L137—237；17完整1—176；18完整1—226。已读当前人物/声音/稳定规则、W扩展骨架、V6—V9卷契约、当前角色/三链账本首最近证据，以及包内writer-project/novel/review、长章/长篇/general/natural-language、修订与复核手册。未宣称再全文读前12或14/15非相关前半。

恢复事实：21第十三日星期六；书在女包，21首约后天下午三点；22将进入第十五日星期一。父袋已21亲接/轻用，不再重造初次使用；凳已21真实结84交付，17净宽28首次确认、14工60不能冒充17首次事实。18首课19—21点，未补母衣，21姑娘只补袋口小段。各人只按在场/转述知情。前12正文和完整units、所有观察三字段全程保护。
`);
console.log({ok:true,evidence_sha256:sha(src),plans:plans.map(x=>x.unit)});
