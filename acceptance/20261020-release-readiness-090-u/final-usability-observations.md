# U 最终F实际易用性观察

日期：2026-10-20。对象：U/scenario-final/东岸末班船，0.9.0最终包content_id=ff6cde0f1be3459f7d8a4249e3dd8ee3eec39d468df48f9c2f11308e5bd6641b。Windows/PowerShell，实际Node v24.15.0。本次是全新模型会话恢复、审查登记、暂停、越权拒绝和草稿导出；用户已提供准确目录、入口、包身份、交接名及详细操作边界。操作者具备CLI和JSON能力，不能代表真人新手的自主发现过程。

## 恢复与帮助的实际证据

| 实际动作 | 结果与证据 | 易用性判断及限度 |
| --- | --- | --- |
| 先status / workflow show / revision list / doctor / tool identify | final-f-commands/01—05，产品均退出0。主revision11，当前三章，无活跃修订/待恢复事务；identify与zip-delivery-verification一致。 | 状态将旧任务、当前物件及未登记稿并列，足够恢复，但要读交接才能理解旧首停任务为何已过时。 |
| 分辨generation0/installednull | status里确为这两个值；doctor/identify仍完整通过、工具资源在作品.writer/tool。 | 它们说明尚未工具更新，不能仅凭installednull报缺包。本轮有用户明确提示，未验证无提示的新人能否自行理解。 |
| 查review、workflow set、export帮助 | 06-help-review、07-help-workflow、08-help-export，均退出0。按帮助给出的包内docs继续读。 | review帮助给出简单范围/哈希示例，结构化功能比较还须review-template及review-and-registration准确形状。多层入口有认知成本，但本轮未出现产品格式拒绝。 |
| 用review-template准备结构化比较 | 11-review-template退出0，给出三章哈希、expected_revision、功能字段与comparison。先实读再填，保存不同final-f-review-input，不覆盖模板。 | 模板有效减少字段猜测；它仍不能代替文学判断。此次没有把帮助文本当JSON。 |
| 先存非空报告，再登记 | 12辅助核非空及当前版本，13-review登记退出0到revision12；14-check确认有效覆盖。 | 报告和冻结对象可核。UI/命令成功不证明阅读，正文原生FastCtx事件与pass1边界另存。 |
| 正式暂停与讨论恢复 | 16-workflow-pause到revision13，17返回paused/仅discuss/双null；25-discussion-recovery退出0。 | next_unit4仍在，但next指向讨论，discussion不靠第4章细纲即可恢复。原planning和decisions逐项相等。 |
| 第4章context和record-template负向尝试 | 18、19的实际产品退出码均2，code=ACTION_OUT_OF_SCOPE；stdout分别0字节，stderr2366/2374字节；前后stateSHA相等。 | 保护按授权拒绝，未先落成PLAN_NOT_FOUND；不是缺文件造成的假拒绝。两份命令和原回包都保留，没有作为产品缺陷或重新提交伪装成功。 |
| check/revision list/export/final doctor | 20—24分别成功；导出included=[1,2,3]，明确排除两份未登记旧稿。26辅助独立验字节与冻结对象。 | 排除清单减少误把旧稿打包的风险；未实际测试误覆盖目录的异常分支，不能从成功推断该分支已验收。 |

本轮共21次产品CLI调用：19次成功，2次预期越权拒绝。完整原始stdout/stderr、实际子进程退出码、命令argv和前后state文件在final-f-commands各编号目录；帮助仍按文本保存。PowerShell工具外层将两次非零原生命令显示为exit_code1，记录器spawnSync捕获的产品实际退出码是2，两层都保留，不把外层值改写成产品值。

doctor/identify等在对话工具返回中曾因显示预算截断；产品原始双流文件没有截断，终核从这些完整文件解析，未把截断显示当完整证据。全文阅读的FastCtx八次返回均完整，按确切offset接续，没有截断遗漏。

## 实际失败、输入与修正

除上述两项刻意越权测试外，本轮产品CLI没有出现格式/输入失败，也没有非预期产品门禁。没有编造一轮格式失败来展示纠错，所有原输入分别以新文件保留，旧模板和旧记录未覆盖。

确有一次辅助定位错误：机械核验时手工打开`.writer/journal/d25d1a59-b17e-4188-91f0-8119932330c2.json`的1—100行，内容仍是30元，识别为保留的旧第3章历史journal。这不是当前state.units[2].journal。原FastCtx调用和返回保留在本轮原生事件；不声称读完该827行历史对象，也未用它推断当前事实。

修正方法是从当前state.units定位，而不按手工选的UUID继续：当前第1/2/3章journal分别为4b2f3a3e-753c-4ed9-b883-ea0eb05591ca、d6780eb0-9373-4f20-b14f-67c52baec8b7、f256e214-77f2-40c6-935d-6b6e7baaea29。26-final-verification核各自SHA，按before/had/append长度仅在内存回放126项patch，精确重建当前snapshot，并核首次observation三项未变。这个辅助脚本证明机械链，不代替三章实际阅读或文学判断。

分类：这是代理编排/定位错误，不是产品返回了错误当前指针。产品允许历史journal并存有保留证据的价值；普通恢复应从status/state的当前指针走，不让作者手选UUID。一次路径误选不足以证明产品存在恢复缺陷。

另外，旧workflow仍有“只重登2、不prepare/commit”的历史文字；B正式提交终态和本次用户新指令已明确覆盖该停点，本轮没有因此重复开启修订。最终正式workflow已按本轮要求暂停，旧事件仍留历史。这是恢复时必须消解的文字时间差，暂记使用成本观察，不把“提交后不自动替作者改任务”直接判产品bug。

FastCtx含末尾换行时返回281/164/243行，边界脚本去末尾空项计280/163/242行，已解释并核同字节。这是工具行数呈现差异，不是产品丢正文。

## 已证明与未证明

本轮证据支持：操作者依据明确入口和交接可恢复当前三章；包身份可核；按包内帮助可准备完整审查输入、绑定报告/正文；正式暂停保留计划；越权正文入口拒绝且不推进；讨论恢复及新目录草稿导出成功。最终导出与三章独立重组相同，警告解释与库存一致。没有发现需要本轮修改产品的已确认新缺陷。

本轮不能证明：普通真人新用户在无指导下能顺利操作、所需时间/认知负担可接受、其他平台和Node版本可用、长篇规模与并发/崩溃恢复可靠，或文学节奏已获真人/市场认可。未测试上传/发布、付费生成、工具升级、令牌丢失、新修订及事务故障恢复；没有将顺利跑通升级为整个产品或所有平台验收。

本轮没有产品代码改动，没有执行产品测试套件来冒充该流程证据。未派代理、Git暂存/提交/推送或上传作品。作品内342份入场文件核对只有state因本轮review和workflow发生改变；全部正文、设定、工具、既有报告、历史分段和候选原文件同字节。仓库入场已有产品改动仍保留，Git暂存区最终为空。本轮写入局限于U及本scenario-final。
