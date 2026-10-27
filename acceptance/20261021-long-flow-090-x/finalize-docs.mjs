import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const x=path.dirname(fileURLToPath(import.meta.url)),j=f=>JSON.parse(fs.readFileSync(path.join(x,f),'utf8'));
const v=j('verification.json'),flow=j('final-flow-verification.json'),audit=j('audit-final.json'),f=j('failure-dispositions.json');assert(v.ok&&v.complete&&flow.ok&&f.final);
const old=path.join(x,'README.md');if(fs.existsSync(old))fs.copyFileSync(old,path.join(x,'originals/README-before-final.md'),fs.constants.COPYFILE_EXCL);
const count=flow.current.filter(u=>u.unit>=25),rows=count.map(u=>`| ${u.unit} | ${u.body_han} | ${u.draft} |`).join('\n');
const runs=audit.native.map(n=>`| ${n.label} | ${n.thread_id} | ${n.exit_code} | ${(n.elapsed_ms/60000).toFixed(1)} |`).join('\n');
const readme=`# 0.9.0 长篇扩大实跑 X：24 → 36 章

本轮已完成 Windows 本机真实 Codex 长篇流程验证：从封存 W 的 24 章副本继续写到 36 章、13 卷，共 ${flow.body_han} 正文汉字（剔除 Markdown 标题）。新增 12 章共 ${flow.new_chapters_body_han} 汉字，普通章至少 8000，27/30/33/36 至少 10000。最终当前稿已在全新 F 会话中按章完整回读、正式登记全书模型审查并草稿导出，导出字节与当前 36 章重组完全相同。

创作、修订及主要验证记录均位于本 X 隔离目录；实际 ZIP 临时解包位于仓库忽略目录 .tmp/X 原包解压/，封存回执另存 X 目录外。用户现有作品和产品源码未改动，未 Git 提交、推送、发布。0.9.0 仍是开发候选；结果不等于作者定稿、真人盲读、市场验证或跨平台发布验收。最终状态暂停且仅允许讨论，正文/修订授权范围均为空，没有第 37 章。

## 最先看什么

- [最终机器结论](verification.json)：完成范围、实际统计、限制与未执行事项。
- [最终当前流程核验](final-flow-verification.json)：正文/登记/覆盖/草稿导出/角色与源版本绑定。
- [F 完成交接](交接-F完成.md)：当前全书语义判断、高置信问题与可选建议。
- [E 完成交接](交接-E完成.md)、[受控改动选择](e-choice.json)、[24 章重登核验](e-complete-verification.json)：旧章修订怎样影响新章。
- [全部失败及处置](failure-dispositions.json)、[原始命令总审计](audit-final.json)、[根控制器说明](root-failure-notes.json)：保留失败，不把重试成功写成一次通过。
- [仓库与制品边界](repository-final-verification.json)、[源码及真实 ZIP 回归](baseline-regression-verification.json)：最终交付字节和回归边界。
- [原生公开工具证据核验](public-tool-record-verification.json)：只留公开工具调用/输出，不含私有推理或全局会话完整复制。

## 本轮确实验证了什么

1. A/B/C/D 四个全新 Codex 会话分别续写 25—27、28—30、31—33、34—36；各自先停在下一章分段进行中，退出后同 ID 恢复，核对既有正文、分段、来源与入口状态。B 恢复曾真实遭遇模型容量不足退出 1，保存断点后用原模型/同 ID 成功恢复，失败原件仍在。
2. 新增三条跨卷线索：衣物实穿/洗后反馈至 33 章完成阶段反馈（仍 partial）；下班喝茶约定在 32 章实际兑现；共同去书店在 35 章实际兑现。未把未来承诺、未知旅客去向或伤脚状态强行结清。
3. E 独立修订会话在原登记路径改课程、凳面净宽与还书约定，候选回退至 13，重登 13—18 后真实退出。根实际测试主区写入被占用门拒绝，全部项目文件字节不变；再同 ID 恢复 19—36，逐章 replay/preview/record、完整当前 13—36 尾段回读后 prepare/commit。完整前 12 章及不可变观察保护。实际改正文的章节为 ${v.changed_body_units.join('、')}；其他章仍真实重登下游语义与追踪。
   E 在重登到 30 章、生成窗口模板后又遭遇真实网络/环境中断并被超时终止。根冻结主 r168/36、候选 r192/30；再次同 ID 恢复，先重读 25—30、补齐窗口审查，再继续 31—36。前 30 章完整单位与正文保持，原 SIGTERM 结果、网络重试及长时钟间隙不改写为成功，见 [真实网络断点](e-network-stop.json) 和 [再次恢复核验](e-network-recovery-verification.json)。
4. C 的 33 章细纲错误引用 P_X_COAT，被 context/template 实际拒绝。通过冻结旧源、只改 recall ID、模型影响复核、正式发布 from33 的 V2 修复；E 回退/恢复后保留两份源与活动范围，当前 33 使用已发布 P_W_COAT 版本。物理 canonical 旧文件按设计保留，不以刷新旧 hash 掩盖差异。
5. D 全文回读自然发现 36 章账本的两位家长知情停留在 35 章，已用独立正式 36—36 修订重登修复，正文未变。E 的 replay-input 使用最新修复 journal，最终父母已知购书结果没有退回。
6. F 是新的会话 ID，读取 E 提交后的全 36 章当前文件。实际返回分页与前后 SHA/状态稳定性独立核验；机械字节证明和模型文学判断分开。最终全书 review、旧已修意见当前复核、越权第 37 章拒绝、当前稿导出均保留原始收据。

## 正文规模

| 新章 | 正文汉字 | 当前登记路径 |
| --- | ---: | --- |
${rows}

## 真实原生运行

共 ${v.actual_native_runs} 次进程调用、${v.unique_threads} 个独立会话 ID、${v.same_thread_resumes} 次同 ID 恢复；${v.native_normal_exits} 次正常退出，另有一次容量失败和一次网络/环境中断后超时，两次均随后同 ID 真实恢复。E 中断期间有长时间时钟及心跳间隙，下表是墙钟时间，不能当作持续执行耗时；具体环境原因未确定。

| 调用 | 真实会话 ID | 退出码 | 墙钟分钟（含中断） |
| --- | --- | ---: | ---: |
${runs}

## 问题与修复边界

已修复隔离稿的追踪遗漏、33 章细纲引用和实际输入/操作脚本问题；保留全部失败、被保护机制拒绝的输入、修正版本及返回页。受控数值变更是测试变量，不记作原稿 bug。共同操作指引澄清了 discussion 的实际命令、有效 out 目录、真实 schema/文档路径、停止错误依赖及独立脚本引用规则；旧版指引和实际已下发提示词不回写。没有发现需要修改本轮产品源码的新错误，未把验证指导修正包装为产品功能修复或提速收益。

另有一处来源表述澄清：E 冻结文件标题“作者暂停要求”实际逐字来自验证控制器的操作指令，不能因 CLI user 角色就认作真人新增原话。已独立匹配实际来源、保留冻结原件并要求 F 阅读[来源澄清](e-authorization-provenance-clarification.json)；真人原始任务仍以 author-request.md 为准，不虚构数值批准或新增作者决定。

当前源码与实际 ZIP 各跑 199 项：197 通过、0 失败、2 项 Windows 权限相关跳过；两侧 doctor 的 errors/warnings 均空。最终源码、ZIP 和已安装运行文件仍与被测字节相同，因此没有另造一个未经回归的新包。未改内置引擎，本轮无需因源码变更重跑 engine；本轮未执行 Linux/macOS CI、真人文学验收或发布。

包 content_id：\`${flow.content_id}\`；runtime_id：\`${flow.runtime_id}\`；ZIP SHA256：\`${flow.archive_sha256}\`。包原有 source_commit=d621093e…/dirty=true 历史来源保留；当前 Git HEAD 为 7961dece…，不能改写历史包为当前新构建。W 原封存树再次 SHA 核验通过。原有 .idea 未暂存或清理。

F 最初导出清单对应 r174；随后只发生报告人名校正与意见复核，正文仍相同。根另以真实产品命令生成 r178 新导出作为最终结果，旧导出不覆盖；[补充导出核验](parent-current-export-verification.json) 证明正文逐字节相同且最终状态号明确。[报告校正核验](f-report-correction-verification.json) 同时保存两份冻结报告及实际重新登记记录。

## 记录与封存

\`commands/\`、\`cli-logs/\` 保存实际 argv、输入、stdout/stderr、退出码和状态快照；\`originals/\` 保存旧稿/断点/来源字节；\`read-boundaries/\` 与 \`read-proof-*.json\` 绑定实际完整返回页；\`native-tool-events/\` 保存公开工具事件；\`scenario/\` 是唯一创作/修订样本；[最终草稿导出](${flow.export.directory}/manuscript.md) 仅包含当前 36 章。旧阶段文件中的“待完成/首停/规划”是相应时点的历史记录，最终状态以本 README 与 verification.json 为准，不删除历史失败。

\`evidence-manifest.json\` 将在最终文档生成后封存本目录（排除清单自身），外部 \`../20261021-long-flow-090-x-seal-receipt.json\` 保存封存和复核结果；封存后不再向 X 写入。仓库本地提交留待用户明确要求。
`;
fs.writeFileSync(old,readme,'utf8');
console.log(JSON.stringify({ok:true,readme:'README.md',units:36,body_han:flow.body_han,actual_native_runs:v.actual_native_runs}));
