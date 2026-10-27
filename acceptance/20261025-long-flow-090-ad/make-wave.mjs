import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)),letter=process.argv[2],config={a:{first:49,long:null,previous:'规划'},b:{first:52,long:52,previous:'A'},c:{first:55,long:56,previous:'B'},d:{first:58,long:60,previous:'C'}}[letter];assert(config);const {first,long,previous}=config,last=first+2,partial=first+1,upper=letter.toUpperCase(),root=JSON.parse(fs.readFileSync(path.join(here,'project.json'))).project,state=JSON.parse(fs.readFileSync(path.join(root,'.writer/state.json')));assert.equal(state.units.length,first-1);const handoff=previous==='规划'?'交接-规划完成.md':`交接-${previous}完成.md`;assert(fs.existsSync(path.join(here,handoff)));assert.equal(state.tool_control.generation,JSON.parse(fs.readFileSync(path.join(here,'active-tool.json'))).generation);
const firstPrompt=`AD ${upper}组真实创作首程，整体组三章${first}—${last}，本进程在${partial}原模板与前两段处退出。先读COMMON.md、author-request.md、project.json、active-tool.json、${handoff}、ad-planning.json、planning-root-review.md、planning-process-cleanup-verification.json及checkpoint-${letter}-entry.json的状态摘要（完整清单供脚本，不逐哈希读）。规划报告保留整理前历史哈希；49/50当前细纲以正式plan整理后的实际文件为准。唯一AD独立副本，不子代理/额外会话/后台写稿/其他聊天，不改真实作品、源码或AC/X等封存，不Git提交推送发布。

先实际status/check/doctor/discussion context核当前${first-1}章、generation${state.tool_control.generation}及绑定内容ID，无来源漂移、事务或未知未登记稿。按当前包writer三技能/长章及相关引用恢复，实际完整读当前${first-3}—${first-1}三章；recall后实读本组旧承诺原文，不能只继承交接结论。已修长章以当前登记正文为准，旧分段是历史不自动同步，尤其AC14/10/50/三宽条事实不可被旧段/旧增量覆盖。

组织本组三章的卷契约/滚动细纲，沿用AD49—60已组织窗口与原远期骨架。允许正常细化未消费计划，不改旧消费入口；需版本改变时按source协议，不能写后刷新模板。用研究/AD作者任务.md真实quote继续推进与完整文件SHA登记trial有限授权：discuss/plan/draft/revise，draft_range/revise_range均${first}—${last}，planning只采用实际读过的文件。workflow.task写完整三章、首停→同ID恢复→整组复核，长期停止点${last}；单进程断点只写本提示/交接，不把它改成作者仅许${partial}半章。控制器数字不是作者新情节选择。

正式写/登记${first}：有效细纲/context预算诊断与必要显式扩容→动笔前record-template→自然分段→assemble到正文新文件→完整整章实读、纲文回对、语言与连续性自检→真实summary/characters/timeline/ledger/evidence/downstream变化及含真实reviewer报告→preview→record。正文去标题汉字>=${first===long?16000:12000}，增加篇幅来自新行动/交流/选择/代价/关系收益，不能重复工序、总结原则或拉空对白填字。平静/合作场面可有效，不制造强冲突/新阴谋强行差异。按本组当前实际证据推进或阶段回收旧跨卷承诺，保留照片/长期效果等未发生边界。

随后为${partial}保存正式细纲、当前context和原record-template，仅写前1—2自然分段约3500—5000汉字，不合章、不登记${partial}，不写${last}。首停仍正式登记${first}章，原partial模板/分段/来源保持，不在半章改workflow。保存交接-${upper}首停.md，列主state/构建、实际${first}字数、${partial}原分段目录/文件/顺序/路径/SHA、原context/template及目标章路径、已发生动作与未完选择/知识/物件、下一段、全部成功失败。到此退出，不提前启动恢复或下组。每60秒报告进度，真实工具缺陷留现场交根；普通输入错误查清后保留原失败另存修正继续。
`;
const resumePrompt=`AD ${upper}组同ID真实恢复，完成${partial}—${last}及六章窗口后退出。先读COMMON/author-request/project/active-tool、交接-${upper}首停.md和checkpoint-${letter}-first.json摘要。实际status/check/doctor，核登记${first}、state SHA/来源/构建、原${partial}context/template与分段字节。实际完整分页回读旧分段，再接未完行动，不重写原片段/重取模板冒充恢复。保持整组workflow和旧模板；${partial}完成后如需更新说明，在下一章写前输入前完成。来源真变化先核影响，不刷旧hash。

续写并完整登记${partial}、${last}，每章普通>=12000汉字${long?`、${long}>=16000`:''}。严格写前模板、实际长章分段/合章、整章分页实读、纲文回对、真实六字段增量、reviewer/报告、preview/record。原分段最后各一次且顺序相同；原稿旧版本保留。读当前有效来源和当前登记正文，不复活旧已修价格/知情/物件。没有证据的承诺不强结，当前自己选择有后果，角色不共享未告知信息。

全部登记后，本进程完整连读当前${first-3}—${last}六章，逐章比较目标/阻力/选择/后果/关系与重复的阅读代价和真正差异，保存模型知情自检报告并正式review当前SHA。高置信授权内问题走独立revision，读稿/修改/重登/尾段复核完整闭环，不直接改已登记主稿；范围外问题先取证交根。原意见不制造第二次修改，可选风格不自动必改。最后status/check/doctor，交接-${upper}完成.md列真实恢复字节证明、实际字数/覆盖、旧线回收证据、剩余接口、所有失败/纠正与未覆盖；到${last}止，不写${last+1}、不另起进程、不提交推送。只AD独立样本，每60秒进度。
`;
for(const [name,text]of [[`prompt-${letter}-first.md`,firstPrompt],[`prompt-${letter}-resume.md`,resumePrompt]])fs.writeFileSync(path.join(here,name),text,{flag:'wx'});console.log(JSON.stringify({ok:true,letter,from:first,through:last,partial,long_chapter:long,generation:state.tool_control.generation}));
