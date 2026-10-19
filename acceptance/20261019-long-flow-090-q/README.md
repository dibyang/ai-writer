# Q轮：0.9.0长篇创作流程实跑

日期：2026-10-19。独立验证作品《雨棚后的灯》，未修改现有作品，未做Git提交、推送、打标签或发布。本轮已完成，最终范围及结果见verification.json和原始命令日志。作品内的保护修订commit是本地修订事务，不是Git提交。

规划十二章四卷，本轮有限试写前两卷六章。第1、4章采用分段合章，验证未登记中间稿、实际正文回对细纲、上下文预算超限与扩容、跨会话恢复、跨卷召回、登记/滚动复核/暂停和草稿导出。模型阅读与机械结果分开记录，不冒充真人、市场或百章文学验收。

已复现并修复大于100万字符、来源单文件合法的上下文显式扩容成功后，record-template/record仍被内部固定预算阻断的问题。原始复现及失败记录保留，不改变文件容量、授权、来源和哈希保护。

## 实现与最终版本

- lib/workspace.mjs将对外上下文显示预算与内部完整来源核验分开；record-template/record-preview/record仍保留授权、文件容量、来源/引文、修订和顺序校验。新增一项跨百万字符登记回归，旧哈希继续拒绝。
- chapter-delivery技能参考、快速入门和手册补充中间分段目录、实际交接路径、模板/修订变化后的重读恢复；不把status的正文库存当全项目中间稿库存。
- 319项打包输入在冻结后全部保持不变。最终0.9.0开发候选321文件、66受管资源，内容ID为`9e26ebbf6120c9b49d31bfeee56099da843618010e0451ee658c8adacb7f532c`；ZIP SHA-256为`24d6e48ee798f00848954a3e9880406aea028c176556e509e8b255d507ba35e9`。来源提交464722e950df36d052dc2495e39fa228e9fecc45，dirty=true，未发布。
- 初始模板和修复前容量探针保留原代码/字节；最终ZIP实际校验并解压。样例随附工具通过同版本正式更新，最终六章登记、修订、导出与修复后的大上下文CLI流程都使用最终构建，主项目/解压包/样例内嵌工具身份一致。

## 实跑结果

| 项目 | 实际覆盖 |
| --- | --- |
| 规模 | 规划12章4卷；实写6章2卷，正文14791汉字（去除标题后按Unicode Han计数），非百章/全书完结 |
| 长章 | 第一章5433汉字、第四章3656汉字，分别三段合章；最终字节拼接核对，无漏段/重复标题 |
| Codex | 本机0.163.0-alpha.10.2，3次成功原生进程：首次分段、同ID exec resume、另一个全新ID只凭文件恢复读稿；完整JSONL/最后答复/提示词均保存 |
| 预算 | 开篇及跨卷两次精确边界；少1字符拒绝、精确预算重试载荷不丢；显式召回和未结线索保留，失败不改state/不生成out；最终解压包schema6完成合法超百万上下文扩容与登记 |
| 纲文回对 | B实读修前1—4章与第四章三段，发现“准备交给/明早拿”不是实际交接，并发现日期与时空待核。保留负稿及报告，不自动关键词判通过；第2章未独立实演的计划内容如实列缺证/实际收拢，不补造映射 |
| 连续性修订 | 3—3正式修文与重登；4—5正式重登关联当前知识而不改正文/原观察；两次完整尾段复读及事务prepare/commit。三个旧模板分别因来源或revision变更拒绝 |
| 最终恢复状态 | r15/paused，下一单元7，正文未授权；discussion可恢复，draft请求拒绝。3份有效审查覆盖，pending_windows=[]，无活跃修订或未完成事务 |
| 导出 | 六章最终草稿included_units=[1..6]、excluded_drafts=[]；修前3章导出明确排除未登记第四章。分段/备份不充作正文 |

最后整体读稿阶段按FastCtx要求连续读完合稿1—403、404—749、750—794行；final-reading-complete.json绑定真实当前字节。最终合稿SHA-256为`6faf02a202b49bc3a1c19ad61a9b91291c120f4206dd9f8c56eade344adb6ed6`。修前、修后及当前报告分开，报告存在/脚本绿灯不等于文学无误。

## 完整测试与命令统计

源码运行Node完整测试启动器（npm test对应脚本）`node scripts/test.mjs workspace --test-concurrency 2`；最终实际ZIP解压包运行`npm test -- --test-concurrency 2`。两套均173项、172通过/0失败/1项本机符号链接权限跳过；源码约9分37秒，解压包约7分56秒。两套doctor、5项预算专项、技能格式检查、ZIP CRC及逐载荷SHA检查通过。内置引擎未改，未另跑引擎回归，未新增跨平台CI。

169条捕获命令：148退出0，14次预期业务拒绝，5次验证脚本/输入失败与2次环境失败均保留并完成后续纠正/替代验证。没有把非零退出隐藏成“全部成功”。详见failures-and-boundaries.md；其中环境2次是旧npm Codex的配置/模型协议不兼容，不是ai-writer缺陷。

## 证据入口

- commands/：完整stdout/stderr、参数、输入副本、退出码、耗时及涉及作品的state前后快照；run.mjs提供30秒进度。
- prompt-a.md、prompt-a-resume.md、prompt-b.md及codex-*-last.md：真实客户端请求与结果；线程ID及输出哈希见verification.json。
- scenario/雨棚后的灯/：六章、六段、来源、章纲/卷纲、增量账本、作者范围、两套独立修订及事务/备份；最新入口为交接/本轮结束-当前入口.md。
- chapter-3-before.md、chapter-4-original/、chapter-4-correction-v1/、knowledge-before-state.json：修前字节与中间稿；B原报告留在作品审查/中，仍绑定其旧版本。
- large-registration-before/及large-registration-before.json：修复前合法容量缺陷；large-registration-after/及相应JSON：最终解压包schema6真实CLI复测。x重复文本仅是容量探针，不算文学素材。
- exports/：修前历史导出、最终整体复读稿、最终六章草稿及manifest。
- source-start.json、source-frozen.json、candidate/、zip-verification.json、verification.json、continuity-final.json：构建、冻结、载荷、来源与最终核验；verify-final.mjs检查元数据和固定样例期望，不自动判断文学。
- evidence-manifest.json：完成后的目录封存清单；只读核验回执另存本目录外同名前缀seal-verification.json。封存后不要原地重跑会写入的脚本。

未改现有作品，原N/O封存核验通过，无关.idea/保持原样。没有真人/市场/全文逐字校对/后六章或正式发布验收。本轮对最终构建完成的本地流程和声明范围之外不扩大结论。
