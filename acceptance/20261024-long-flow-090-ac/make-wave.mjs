import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)),letter=process.argv[2],config={b:{first:40,long:40,previous:'A'},c:{first:43,long:44,previous:'B'},d:{first:46,long:48,previous:'C'}}[letter];assert(config);const {first,long,previous}=config,upper=first+2,partial=first+1,upperLetter=letter.toUpperCase(),root=JSON.parse(fs.readFileSync(path.join(here,'project.json'))).project,s=JSON.parse(fs.readFileSync(path.join(root,'.writer/state.json')));assert.equal(s.units.length,first-1);assert(fs.existsSync(path.join(here,`交接-${previous}完成.md`)));
const supplement=letter==='d'?'、交接-C补登记完成.md':'';if(letter==='d'){assert.equal(JSON.parse(fs.readFileSync(path.join(here,'native/c-ack/result.json'))).exit_code,0);assert.equal(s.review_workflow.issues.I_AC_C45_MEAL_DISH.status,'verified');assert(fs.existsSync(path.join(here,'交接-C补登记完成.md')));}
const firstPrompt=`执行AC ${upperLetter}轮真实Codex创作，只到规定首停断点后退出。先完整读 COMMON.md、author-request.md、project.json、active-tool.json、交接-${previous}完成.md${supplement} 和 checkpoint-${letter}-entry.json。只操作AC独立副本，不改旧封存目录、真实作品、产品源码；不子代理/额外会话/后台写稿或向其他聊天发消息。

workflow.task要涵盖本组三章${first}—${upper}及“首程断点→同ID恢复→整组复核”的完整执行计划。长期stop_conditions写本组末章${upper}结束、不写${upper+1}和真实保护边界；不要把本次进程首停的“不写${upper}”写成整组永久禁止。单次进程的停止位置保存在本提示和首停交接，结构化有限范围始终与整组任务一致。它们是原作者总任务内的控制器安排，不冒充真人新增情节选择。恢复未完章时保持旧workflow和模板；本章完成后如需同步任务说明，在下一章取写前输入前完成。

新会话先实际status/check/doctor/discussion context，核当前工具generation${s.tool_control.generation}、绑定内容ID及真实已登记${first-1}章；判断无漂移、待恢复事务和未知未登记稿后再开始。读取当前包writer技能及必要references、定位、声音、人物和当前阶段骨架/卷契约。至少完整分页读当前${first-3}—${first-1}三章，旧承诺用recall定位再实读其相关旧原文，不能仅继承上一会话结论。不要把旧被冻结源或未来计划当当前事实。

本轮将${first}—${upper}组织成一卷/单元的实际推进窗口，近细纲滚动2—3章，远期保留骨架；沿用A实际建立的37—48骨架与未决项。只能在未消费未来卷纲或本轮新补充文件内落实计划，不改已被旧章消费的宏纲/规则以绕过来源保护。有差异写明实际调整，不凭计划强结伏笔。用项目研究/AC作者任务.md真实原话登记本轮trial授权：draft_range=${first}—${upper}，revise_range=${first}—${upper}，允许discuss/plan/draft/revise；planning只采用实际存在且实读采用的文件。遇范围外高置信问题保存证据交根，不能偷偷改旧章。

写并正式登记${first}章：先细纲/context与写前模板，再分段、assemble、完整分页回读和纲文回对、自检、preview/record。正文汉字至少${first===long?14000:10000}，不靠重复总结、空转对话或复制填充。用人物的具体选择、代价和关系变化展开，保留本书声音；实际人物所知/物件/时间/线索均从成稿取证。推进此前的跨卷承诺，同时保留未发生边界。

随后为${partial}章保存正式细纲、context和写前record-template，写前1—2个自然分段约3000—5000汉字后停，不合章、不登记${partial}，不写${upper}。停止时仍登记${first}章；不要再改workflow/来源使写前模板失效。保存交接-${upperLetter}首停.md，含真实状态/工具、已登记范围和正文汉字、未完分段/原模板路径及SHA、未回收旧承诺、下一步和全部失败。等同ID真实恢复后才继续。
`;
const resumePrompt=`继续本会话AC ${upperLetter}轮真实恢复，完成${partial}—${upper}及窗口复核后停止。重新读 COMMON.md、author-request.md、project.json、active-tool.json、交接-${upperLetter}首停.md、checkpoint-${letter}-first.json，再实际status/check/doctor，不能凭聊天记忆恢复。核对断点state、已登记${first}章和${partial}原写前context/template、分段字节与首停哈希一致。实际分页回读现有分段及相关原文，不重新写已保存片段或重取模板冒充恢复；来源改变先核影响，不能刷新旧哈希。

完成${partial}—${upper}。普通章正文汉字至少10000，若有第${long}章则至少14000。每章先完整长章分段/assemble、实际全章分页回读、纲文回对、自检和真实差量，再preview/record。推进/阶段回收可合理兑现的旧跨卷承诺，不把仍未知事项强改resolved，不把未来行动写进已发生事实。保留当前角色知识和旧版本来源，不复活旧章修复前的事实。

全部登记后完整连读当前${first-3}—${upper}六章，保存模型知情自检报告，用当前SHA正式review登记；比较目标/阻力/选择/后果/关系变化、重复结构与真正不同的阅读收益。确认问题按已授范围在正式独立区修订，不直接改已登记稿；可选风格保持建议。最终status/check/doctor，保存交接-${upperLetter}完成.md：状态与构建、正文统计、真实恢复字节证明、实际读稿范围、回收链证据、剩余线索/下卷接口、失败与未覆盖。只到${upper}，不写${upper+1}，不提交推送发布或发送其他聊天。
`;
for(const [name,body]of [[`prompt-${letter}-first.md`,firstPrompt],[`prompt-${letter}-resume.md`,resumePrompt]])fs.writeFileSync(path.join(here,name),body,{flag:'wx'});console.log(JSON.stringify({ok:true,letter,from:first,through:upper,long_chapter:long}));
