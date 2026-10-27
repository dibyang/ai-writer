# AE 原生流程边界

所有写入限本目录及其scenario独立作品，不写真实作品、旧AD/AC等封存、Git、全局Codex配置或外部服务。不用子代理，不创建/发消息到app聊天，不换模型/effort；唯一原生运行由根按串行exec/resume启动。

产品命令必须经过 `node acceptance/20261026-long-flow-090-ae/cli.mjs 唯一label 命令 ... --project 独立作品`，真实入口为AE作品`.writer/tool/bin/ai-writer.mjs`。label和operation_id不复用；先核支持参数，不猜命令。wrapper保存原始输入、完整双流及前后state，外层执行工具exit可能与原始产品exit不同，以cli-logs/result.json为产品值。元数据界面截断用完整双流另行审计，不当作正文读页。

正文实读用 `node acceptance/20261026-long-flow-090-ae/read.mjs 唯一label 完整本地文件路径 页号`，每页1800UTF16，同章至多两页一批并给足输出预算；遇Warning/截断批，不计已读，换唯一label完整返回。按章完整读完再进入下一章；原文/页返回SHA/来源版本真实保存。摘要、目录、grep命中和哈希不是原文阅读，不称真人/盲读。

初始60章/r351/gen8；权威`.writer/state.json`只能通过产品命令写，禁止手改或刷新来源哈希绕过旧输入。不修改AE工具源码、root源码或受管资源；发现真实产品问题保存最小复现/失败/状态并交根修工具，不编造“错误”证明能力。文学高置信硬问题在已授权独立范围内用正式修订处理；optional维持选择，保留误判和采用/retained历史。

真实作者quote见`研究/AE作者任务.md`，本次原话“继续推进”及更早完整任务分别真实引用，测试规模/具体方向来自控制器不是新作者原话。AE正文范围61—66、旧章修订1—66仅在正式workflow与修订范围足够时使用；规划程禁止正文。不得因next_unit=61或有计划就取正文模板/创作。未来骨架不进既有facts，不自动复航、治愈脚伤、揭父旧事或填戏词两空。

不改原13optional与49retained处置来清待办；旧9verified随新上下文变成needs-recheck可如实保留待最终全书再verify，不二次apply或重做采用。不把source list中33旧editing-entry-only-not-published强行清零，消费仍是CR33_RECALL_ID_V2冻结版本。O_BOX_PAINT原观察、类型和作者真相不可重写。

长命令/任务开始前说明阶段和预计耗时，每60秒以内更新真实进度。每个原生进程尽量在90分钟内完成指定断点，100—105分钟仍未完成则保存真实完整checkpoint/未完成范围和交接，正常退出供根同IDresume；两小时wrapper上限不是产品验收截止。只有本进程结束后根能确认exit，不预填正常。容量等失败保留，不伪称完成。恢复首项用指定checkpoint字节脚本，实际读回原分段后再续写，不重取模板洗来源。token仅必要本地文件保存，不公开打印。

最终export草稿需新目录、逐章字节核验，保留excluded_drafts和warnings。check只是机械门禁，不是文学合格；只有根最终验证和封存之后才说整轮完成。当前不提交、推送、打标签或发布。
