import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)),root=JSON.parse(fs.readFileSync(path.join(here,'project.json'))).project,state=JSON.parse(fs.readFileSync(path.join(root,'.writer/state.json')));assert.equal(state.units.length,48);assert(fs.existsSync(path.join(here,'交接-E完成.md')));assert.equal(state.tool_control.generation,5);
const first=`AC F最终当前全书阅读首程。完整读COMMON.md、author-request.md、project.json、active-tool.json、交接-E完成.md、checkpoint-f-entry.json。只读AC独立副本及保存本地新报告，不操作真实作品、旧封存包、源码；不子代理/额外会话/后台写稿或向其他聊天发消息。

先用真实status/check/doctor和当前工具技能/手册恢复，核48章、E正式修订已完成、没有活跃事务或来源漂移。此全书阅读不是盲读，不能称人类阅读、市场验证或作者定稿。必须实际分页读取当前登记版本，不能脚本返回摘要/哈希/行数替代。按章节顺序完整实读1—24章，逐章保存简短阅读笔记，尤其旧修订事实、角色所知、物件/款项、伏笔种下和后来应回收的预期、重复结构及真正不同的收益。相关大纲和作者事实只作核对，不当成已发生情节。必要时recall再实读来源。

本进程到完整24章后停止，保存交接-F首停.md及F首程阅读笔记.md，列实际各章当前SHA与页数、未核查问题、下一25章；不要写正文、改来源或workflow，不提前读25—48冒充全书完成。整体任务是当前1—48全读，首停只是进程断点。发现确认问题先精确取证交根，随后按原授权正式独立修订；本次不锁外改稿。
`;
const resume=`AC F同ID恢复并完成最终当前全书阅读及草稿导出。先重读COMMON.md、author-request.md、project.json、active-tool.json、交接-F首停.md、checkpoint-f-first.json及首程阅读笔记，再实际status/check/doctor。核首停24章阅读所绑定的当前正文、状态和E修订结果未变；不能凭聊天记忆宣称已读。此前1—24实际公开分页记录可复用，若字节变动必须重读。

从25章继续实际逐页完整读到48，逐章笔记，另对E多处修改的因果链和跨卷回收作前后对照。全文结论需区分确认问题、连续性风险、可选风格，检查目标/选择/后果/人物关系变化及重复结构，不用关键词词频冒充判断。模型知情自检，不是人类/盲读/市场验收。发现确认问题不得淡化，保存精确原文和影响并停在安全点交根修复；没有确认问题再完成当前1—48完整报告、正式review绑定48章当前SHA。

在当前有限范围下实际尝试49章写作context或record-template，预期ACTION_OUT_OF_SCOPE并核状态不变；不写49章，不伪造无效输入碰巧失败当范围保护。核来源、pending/stale、活跃修订和未登记稿用途，保留旧稿不自动删除。按当前help实际运行export导出当前48章草稿，记录工具、范围、排除清单、草稿标记和输出路径/SHA；合并字节核验由根另做，不称正式出版。

最后status/check/doctor，保存交接-F完成.md及全部成功/失败。首程/恢复真实ID和公开事件保留；只在AC证据范围，不提交推送发布或发送其他聊天。
`;
for(const [name,body]of [['prompt-f-first.md',first],['prompt-f-resume.md',resume]])fs.writeFileSync(path.join(here,name),body,{flag:'wx'});console.log(JSON.stringify({ok:true,units:48,generation:5,next:'fresh native f-first'}));
