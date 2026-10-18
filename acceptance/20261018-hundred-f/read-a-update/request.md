# F轮阶段A：实际更新与完整重读1–25章

用户已授权百章规模实跑及发现问题直接修复。先读 `acceptance/20261018-hundred-f/REQUEST.md`（本轮真实原话与有限范围），只写该campaign目录。作品唯一目标为其 `work`；绝不把任何命令指向原D、原百章或真实作品。主项目产品实现、冻结来源、已有封存档案只读；不提交、推送、联网或启动其他代理/会话。

主入口 `D:/work/other/ai-writer/bin/ai-writer.mjs`；冻结0.7.1来源 `D:/work/other/ai-writer/acceptance/20261018-hundred-f/sources/package`；副本目前100章、schema6/revision378/generation1、工具0.7.0。本阶段目录 `D:/work/other/ai-writer/acceptance/20261018-hundred-f/read-a-update`。

本阶段先依据文件恢复，读取writer-project、writer-novel、writer-review及必要悬疑/长篇/语言参考，以及副本writer.json、AGENTS、设定、总纲、卷纲索引和当前状态。保留根作者定制，不因它是旧版技能就覆盖。当前新任务优先于历史“暂停”，本阶段只更新工具、阅读与报告，暂不修改旧章、不写101章。作者证据使用副本 `研究/F轮用户授权与执行范围.md` 中实际用户原话（不要引用其他书合成授权）。

所有产品CLI经 `node acceptance/20261018-hundred-f/capture.mjs 唯一f-a-标签 node 主入口 参数...` 执行，或自建helper调用同一capture入口，确保输入、原始stdout/stderr、前后state、退出码和构建观测保留；不得覆盖已有标签。新的JSON输入放本阶段inputs，所有分步失败保留。不要把.capture元信息输出当产品JSON；解析该标签保存的stdout.raw.txt即可。可简化展示但保存全部raw，不打印整个state或全书snapshot以免污染上下文。

1. 外部doctor、status、discussion context、tool identify/compare，核基线；外部update-plan指冻结来源，补真实author_evidence并tool update（本轮明确授权该隔离副本更新）。schema6不再enable/迁移。成功后保留原输入幂等重试，新随附入口实际help、doctor、status、discussion context/check。验证100正文、units、snapshot、原source_hashes、根定制原字节不变，仅revision/tool_control应正常变化。实际保存更新前后原state与新构建ID。
2. **按顺序完整阅读第1–25章原文**，不能用recall、摘要、旧审查或脚本采样替代。每次read确保无Partial未读续页、无截断长行；需要就分页。记录每章文件路径、实际SHA、完整行覆盖、至少一条真实引文、当章选择/后果、人物所知、物件/线索变更及尚未证实的边界。25章约6万字，允许在本进程内压缩上下文，但保存逐章断点，不宣称未读内容。
3. review报告区分正文确认事实/角色推测/未解项、跨章重复真实阅读代价与应保留内容，包含“真人语言别扭句”及硬问题/偏好分栏。可以没有硬问题。不为测试制造大剧情变更。已有全书追踪可作回查索引，但不能把26–100章状态倒灌进早章角色知情。不要据本次25章就判全书通过。
4. 若有可复现工具问题，保存最小重现证据并报告给主任务；不要改主项目代码或绕过state/hash保护。旧文疑点先记录，不修改本阶段正文。
5. 保存报告和 `readings.json`（逐章实际覆盖），必要时按实际完整范围登记review（schema6须expected_revision和唯一operation_id；不能伪造chapter_functions）；不为了绿灯重复登记未经本次阅读的旧报告。
6. 保存handoff.md及handoff.json：当前revision/generation/build_id、已读1–25清单与SHA、实际工具更新结果、未决与建议回查点、下一阶段只读26–50、仍禁止自行写101。将可核的授权/输入路径与下一会话需读文件写清。末尾核state/body/source漂移与check；报告实际耗时和全部失败。

这是一轮知情模型实读与工程验证，不是盲读、真人评价或正式发布。至少每60秒给阶段进度；预计本阶段约15–25分钟。
