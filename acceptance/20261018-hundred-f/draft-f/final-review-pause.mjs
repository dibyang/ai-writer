import fs from 'node:fs';import path from 'node:path';import {session} from '../session-support.mjs';import {rows,functions,comparison} from './review-data.mjs';
const s=session('draft-f');const report=`# F-F 最终101—106完整连读

在104—106保护修订CAS到主revision399以后，本进程再次按101、102、103、104、105、106顺序完整展示并连读当前主稿，六次FastCtx均从1至末行Complete；不是把此前六章及分支三章拼成一次最终连读。知情模型自检，非真人盲读、作者定稿、市场验证或正式文学验收。SHA由最终measure及本次review-template绑定，详draft-f/metrics-final.json和readings.json。

|章|实际目标、选择和后果|不同收益与保留项|
|---|---|---|
|101|旧记指错文件，沈另做索引并退出重开找回，不能找回人名|能使用的私人查找，不是新史实；保留空处的不甘与裂果真实麻烦|
|102|周输球、沈夸错球想走；沈留下，周承急，饭时说眼下需要|真看成球且相处不顺，不倒改旧球约；保留沈想被招呼与周运动欲|
|103|梁真发新版，沈核两处交付，追加另报转别人，480实到|有价劳动与未接720的不甘，不是欠款或整片修好；保留差点不吃饭的犹豫|
|104|原椅盒占/后架整理与临单相撞，老人先离；葛拒一加份、自重排，沈不接每天清位|阶段办法真能结束；老人不必返回替作者凑圆满，陶11实走，椅后给另一人|
|105|新稿借老人葛作证的开头实划去，重抄本人想被谢/盼挽留；何自己核菜单|写本人不好看且无人评仍留；保留划头原稿，新页与95半面分开，何有独立劳动|
|106|周今天不读字，沈纸推中央未交便实收回；说失望仍愿留下，共坐再各归|拒读不取消相处；没有公开或以后必读约，保留双方笨拙与疲累，不用完美理解作奖品|

结构相似而收益不同：101与103都工作后吃饭，但一个可用回查且答案仍空，一个交付给现客户且有失单代价；102与106均不顺后相处，但106不再演输球道歉，而由“不看也想留”直接改变当晚收碗/离开趋向；104与105都有限帮助，但葛的空间决策与何的样张劳动各有主语，不为沈当评委。详细比较引文随当前review登记。应保留这些不同因果，不为了“每章不同”强加秘密和事故。

## 真人语言别扭句
### 真人语言硬问题
没有

四项实际测试：对话当面复述核周不读与沈失望、葛答快了/陶在岗意见，声口仍有区别；动宾拆分核106炒蛋盛出再让灶、纸推收、桌上碗端至厨房；具体落地核104盒仍占到95露坐面、105新开头真的划线、106未交纸便收夹；逐句内读未再确认需要修改的搭配/指代损害。风格偏好观察：锅碗、纸袋、湿干小动作及否定说明仍偏密，当前有效因果不机械删；此为可选后续风格议题，不自动升级硬伤。

本次修订确认：104“刚才那把空着的椅子”改“那把被盒占着的椅子”；106两处“店里”改“站里”，符合角色卡渡口调度员。正式保护区104—106全文核对重登、尾段连读、prepare/CAS已完成，105正文SHA不变。只这些局部字改，不改物件观察/author_truth/statement。原1—103不改。初轮有问题报告和历史stale均保留。

101待核说明结论：parent-101-interim描述的是中间疑句；观察快照实际85行已为“摸到家里还剩的半包面”，SHA与最终101一致。当前77行家有半包/不买大包与85行取家中半包衔接，问题已澄清，不登记为仍在、不改101。102修后“低头将汤面那点油吹开”在69行已搁勺后自然，不重新改。

物件：27邱改词单页在其上柜私薄册，31原缺名两页经35连细夹交沈、48宽夹/细夹袋角、54归邱、97原序与新条归下柜干布格；与95本人半面及105新页不同。106新页仅沈持推至桌中，周手在碗边未接，沈拉回/夹/包/带归，归属始终沈，无虚假换手。椅仍葛管，同持有人位置条件变动，未转公屋。宋原带、母原盘及旧纸未在本批换手。

知情：周104晚只听追加未接/不甘，106知沈口述新页范围与想被谢，未读原稿/新页全文；何只在105请沈辨眼前价，不知新页；老人只知晨初占位，不知后腾椅；葛陶只知各自现场，不补62—64。何菜单新样只获正在看、劳务款未知，沈没有替她批准。余带来源、罗私事、长期经费人手、旧款、公屋新时段、雨季通路都没有新结论。

有限兑现：66/76/80/86/98空间链落实为65日冲突而非永久服务；27/31/35/48/54/89/92/95/97/100纸链落实新写本人和允许不读，旧退出不恢复。87周家桌短/画册自留等基线已全文回读。全程不把D未来方案当成发生，新增续纲明确引用，旧消费来源未改。

篇幅过程如实保留：104首稿2640、105首稿2841、106首稿3396汉字；前两章未达到本轮希望的首稿3500—3700，首次登记前已补足真实场面。最终各章达到3000—4000，非空白字符另计。104最终微修前计数3386；最终精数以measure为准。计数只证明篇幅，不证明文学质量。

结论：当前101—106无确认问题待在本阶段修改；可选语言密度观察保留。只写到106，正式暂停；下一阶段四处“同两块→那两块”候选仍未改，须从48—106另建独立修订分支，逐章实读重登。
`;
const ref='审查/F-F-101-106最终完整连读.md';fs.writeFileSync(path.join(s.project,ref),report,{flag:'wx'});s.write('final-literary-review.md',report);
const t=s.run('final-review-template-101-106',['review-template','--from','101','--to','106'],{entry:'embedded'}).value;Object.assign(t,{report:ref,operation_id:'draft-f-final-101-106-r399',chapter_functions:functions(),comparison});const r=s.run('final-review-101-106',['review'],{input:t,entry:'embedded'});s.write('final-review-result.json',r.value);console.log(r.value);
const st=s.state(),workflow={...st.governance,stage:'paused',task:'F轮draft-f完成104—106、开写前97—103完整连读登记、保护修订104椅指代/106站里及104—106重登尾段CAS、最终当前101—106全文连读登记；106停止。本阶段自检非定稿。下一真实会话再按总授权进入48—106旧章正式分支，本进程不再写正文。',authorization:{allowed_actions:['discuss','plan'],draft_range:null,revise_range:null,stop_conditions:['不写107；不再改本轮稿。','下一真实会话才可建48—106正式旧章修订分支，四处同两块候选留交接，不在这里改。','保留历史stale与所有失败，不伪称真人/文学定稿。']}};
console.log(s.run('workflow-final-paused',['workflow','set'],{input:{expected_revision:st.revision,operation_id:'draft-f-pause-after106',author_evidence:s.evidence(),workflow},entry:'embedded'}).value);
for(const [label,args] of [['doctor',['doctor']],['check',['check']],['status',['status']],['workflow',['workflow','show']],['discussion',['context','--purpose','discussion']],['identify',['tool','identify']]]){const r=s.run('final-'+label,args,{entry:'embedded'});s.write('final-'+label+'.json',r.value);console.log({label,ok:r.value.ok,revision:r.value.revision,units:r.value.units,rolling_review:r.value.rolling_review});}
