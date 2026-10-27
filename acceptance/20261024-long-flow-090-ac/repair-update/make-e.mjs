import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)),root=JSON.parse(fs.readFileSync(path.join(here,'project.json'))).project,state=JSON.parse(fs.readFileSync(path.join(root,'.writer/state.json')));assert.equal(state.units.length,48);assert(fs.existsSync(path.join(here,'交接-D完成.md')));assert.equal(state.tool_control.generation,5);
const prompt=`AC E阶段预读及受控旧章修改设计。先完整读COMMON.md、author-request.md、project.json、active-tool.json、交接-D完成.md、checkpoint-e-entry.json。只在AC独立副本，不动封存样本、源码、真实作品；不子代理/额外会话/后台写稿，不对外发消息。

这是原用户已授权的长篇连续性试验。先status/check/doctor，核当前48章、最新随附工具，读当前writer技能和修订手册。此进程只读和提出方案，不修改正文、来源、workflow，不启动revision。你可保存新报告和本地交接。

实际完整分页读当前34—48章；用recall定位相关更早承诺后实读原文。逐章比较旧事实、后来回收、人物所知和物件/款项等，不能只凭ledger猜剧情。提出三处相隔较远的普通事实受控修改，至少一处在原1—36章中、另外两处在后续不同卷；优先34—36、40附近、44附近，减少无关前缀重登，但没有适合的就如实说明，不强改冻结观察。至少一项必须有具体下游事实/行动变化，不能三处仅换词。可选日常数量、时间、费用等普通非核心设定，先核是否属于不可变observation或作者固定数值；保留旧80/35/81/84等固定事实、原33章V2来源绑定和知识边界，不为了测试改作者核心选择。不能把这些控制器试验值伪记为人类指定剧情。

报告保存E受控修订提案.md及结构化e-proposal.json。每项列稳定id、原章/路径/当前sha、逐字原文、建议修改及理由、受保护项核查、直接受影响章和需回读尾段、相关source/plan/ledger/character项、影响类型和未决项。如果需改已消费来源，先设计freeze/impact/stage/publish，不能计划刷新旧哈希；如只改正文普通细节，明确来源保持并据此回读。另列本次实读范围、实际高置信问题（与测试变量分开）、未覆盖范围。

停止后等根控制器检查提案；根在原授权范围内选方案不是新增真人作者原话。不把本轮纯预读当作已完成修订，交接-E提案.md保存实际状态。没有新增49章授权，不写49。
`;
fs.writeFileSync(path.join(here,'prompt-e-propose.md'),prompt,{flag:'wx'});console.log(JSON.stringify({ok:true,units:48,generation:5,next:'fresh native e-propose'}));
