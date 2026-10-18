# F轮阶段C：第三次文件恢复，完整实读46–75章

仅使用本轮campaign `D:/work/other/ai-writer/acceptance/20261018-hundred-f`。先读REQUEST.md、COVERAGE.md、read-b/handoff.md/json及实际读稿报告、reading-audit/read-b.json。你没有前会话隐藏上下文。作品目标是campaign/work，输出是本阶段read-c。原百章/A—E及真实作品不写；主项目、冻结来源只读。不提交、推送、联网或启动其他代理/会话。

按writer-project、writer-novel、writer-review和相关长篇/悬疑/自然表达规则恢复。先用新进程实际status/workflow/discussion context/tool identify/check，核交接revision、generation、构建与100章进度。以当前文件为准，差异先核实；不重复update/enable，不修改旧章，不写101。本阶段只读及审查，作者范围仍discuss/plan。

为减少编排错误，可使用已实测的 `../session-support.mjs`：

```js
import {session} from '../session-support.mjs';
const s=session('read-c');
const status=s.run('status',['status']).value;
// s.run(label,args,{input:真实对象,expected:实际预期码,env:{},entry:'main'或'embedded'})
// 自动加本F作品路径，原始命令在campaign/commands/f-c-*；s.write仅写本阶段新文件，不覆盖。
```

模型可以自行写helper，但所有产品CLI必须经capture或此记录器，唯一f-c-*标签；不能在脚本里自动产生文学“通过”。脚本仅保存实际模型判断、模板、计数与完整raw，FastCtx实际读稿不能被脚本摘要替代。

按顺序**完整读46–75章**：46–50是边界重读，51–75为新增25章覆盖。逐章检查Complete/续页/长行截断，必要时补齐。每章记录路径、实际SHA、工具实际展示的全行覆盖、原文引文、目标/选择/后果、关系与知情变化、物件动作、尚未证实的范围。状态百章末信息仅作索引，禁止倒灌给早章人物。主任务统一用已实测的reading-audit.mjs从本进程原始事件做逐行核验；无需另写行分割/空行计数算法，也不要主动运行该审计器抢先写同名结果。你的阅读判断和工具Complete元数据照实记录。

关注旧稿/新页/复制件是否混同、空间/钥匙/值守/费用的实际变化、公开使用与私人使用的范围、人物是不是靠选择承担后果。可能有不同收益的类似情节应保留；无问题不制造问题。依证据记录跨卷回收与未来应查的稳定ID，不能强收逾期线索或扩写阴谋。本阶段不采纳或修改旧章，修订候选留待百章完整读完后统筹。

保存简明REPORT.md、readings.json及真实读稿证据。包含“真人语言别扭句”，硬问题/偏好分开，有原句和实际阅读代价才判硬问题。无需复制大量全文到报告；原文及原始展示已有独立记录。报告存在不等文学验收。若确需登记新review，使用本次实际范围和当时revision/唯一operation_id，不刷新旧输入，不虚构chapter_functions。

结束生成handoff.md/json，列当前revision/generation/build及state SHA、已读范围/断点/哈希、角色知情/物件归属/未知、可核的跨卷链与旧章候选、全部失败。下一阶段完整71–100（71–75重读）。核100正文、units、snapshot、原来源及根定制未变；check并如实保留历史审查失效情况。

发现产品问题保存最小重现和正确/实际结果，报给主任务，不在本进程改产品或绕过保护。仅知情模型分批实读，不称盲读。每60秒以内报告已读数、当前内容、耗时和预计剩余；预计15–25分钟。
