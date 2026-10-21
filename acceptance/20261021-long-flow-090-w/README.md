# 0.9.0 W轮扩大长篇实跑记录

当前状态：本轮Windows本地隔离流程验证完成，未修改现有作者作品，未提交、推送或发布。当前权威入口为[修复后交接](交接-最终修复后当前入口.md)、[总验证](verification.json)和[最终流程独立核验](final-flow-verification.json)。它不是作者定稿、真人盲读、市场验证或0.9.0正式发布验收。

## 实际规模

从前轮封存V复制12章/55307正文汉字，在新W样本继续实际创作至24章、9卷、137621正文汉字。新增13—24章普通章至少6000汉字，15/18/21/24至少8000，采用3—5段实际创作、合章、全文自检、当前输入preview通过后record。标题、旧候选、计划和技术场景不计入正文规模。当前逐章路径/SHA/汉字数见final-flow-verification.json。真实文学流程为24章，百章级合成回归仅证明机械追踪能力。

实际原生Codex共11次运行、5个独立线程、6次同ID恢复，其中10次正常退出；A一次遇网络故障到2小时上限SIGTERM，随后同ID恢复完成，保留原失败流。会话入口、提示、双流和真实子码见commands/codex-*；不是以包装脚本退出代替产品子码。

## 本轮结果

- 长章分段：实际分段SHA、顺序合章、预览与登记同输入、当前自检冻结绑定均有收据，旧片段作为历史保留。
- 跨会话恢复：A/B/C/D/F从各真实停点恢复，正式更新从generation1到2再到3；活跃D修订期间主区写命令实际REVISION_OCCUPIED拒绝，未改原稿。
- 跨卷回收：晚课补袖、窄凳造用和浅蓝袋损伤后有限修补三链，已由模型实读当前全文及具体动作、选择和后果。原箱/押金等既有有限收束保持，不补造未知旅客结局。
- 多处旧章修订：D将课程120分钟改90分钟、净宽28改27厘米、还书15:00改15:30；7章正文、26行发生必要变化，13—24正式重登/当前复核/prepare/commit，前12完整units和正文、不可变观察保持。外部来源版本不机械刷新，派生state及上一章正文SHA由实际回放更新。
- 真实审查问题闭环：首轮F发现第19章标题说提前两个钟头，正文实际提前90分钟。另建修订19—24，仅替换第19章首行标题为提前的一个半钟头，其余23章正文不变；意见I_F19_TITLE_TIME正式采用、绑定真实提交、当前全文复核后有效verified。保留历史文件名以满足同路径基线绑定，现行首行/SHA为准。
- 暂停恢复：最终r113仅允许discuss，draft/revise范围均null；context25和record-template25实际拒绝ACTION_OUT_OF_SCOPE/2，状态及全目录文件不变。discussion可正常读取当前停点。
- 当前草稿导出：[修后24章](export-final-current-24-title-fixed/manuscript.md)，manifest只含当前24已登记稿，逐字节重组匹配，draft-export/quality_review required。旧export-final-current-24保留发现章题问题时的历史，不能当修后当前稿。

## 产品修复与最终制品

仅7个根帮助/说明文件改动：同项目--out按写命令串行；合章separator只能空白、场景标记放实际片段；previous_holder为custody同级字段；新单元先outline阶段/空refs，再plan真实纲，再采用与有限正文授权。未放宽锁、真实来源、作者范围或哈希保护。

最终content ID为553de8f8a42c7bc7ff5f04f78703ed423d17dd69c21ff640ebd8c5c11c570ec2，ZIP SHA为04bc027b65ad6b0ae8532a887b8025ae7a2f31bd5ad8cd6568aa713d5b5502c5。源码和实际ZIP解压包各199项测试，197通过、0失败、2项Windows符号链接权限跳过，两者doctor通过。D使用generation2完成提交后才正式安装最终generation3。R新用户规划顺序场景从不存在目录实际init至正确上下文/模板后暂停，始终零正文/零登记；P24章保持。来源、包及原封存T/U/V均已独立核字节。

证据：[构建回归](planning-build-verification.json)、[正式更新](planning-guidance-update-verification.json)、[R独立核验](parent-bootstrap-verification.json)、[D修订核验](parent-d-complete-verification.json)、[章题修订核验](parent-title-repair-verification.json)、[当前完整实读](native-final-read-coverage.json)、[仓库边界](repository-at-close-verification.json)。未改内置引擎，未执行本轮Linux/macOS或远程CI。

## 记录完整性与历史口径

cli-logs保存实际产品argv/输入、双流、子码、前后state；commands保存实际原生Codex及构建/测试命令。公开工具输入输出另按原始会话偏移、源行SHA逐行核验，包含1496对工具调用，零未配对；排除私有消息、思考、系统/环境和内部元数据。见[公开工具核验](public-tool-record-verification.json)、[失败处置](failure-dispositions.json)、[根控制器错误摘要](root-failure-notes.json)。失败记录不删除，不把全部运行称为退出0；根控制器摘要不是操作系统全进程审计。个别模型收据中的network_interruptions=0未覆盖CLI服务连接重试：本次F修订原始stderr实际有一次responses_retry断开重连，随后正常继续，完整网络口径以原始错误流和failure-dispositions.json的runtime_notices为准。

delivery-final.json中的installed=false、planning-build-verification中的final_F_read_complete=false等为其生成阶段的真实历史快照；后续真实安装和完成由专门收据及本轮verification.json证明，旧快照未覆盖。第一F交接/报告与f-current边界保留发现问题时历史，当前入口仅修后交接/f-title-current完整pass及新导出。规划引用原始发现稿的待修表述也已加当前完成说明。行覆盖只证明全文文本送达模型；文学判断来自同模型知情实读，不能冒充真人盲读或市场反馈。

所有W写入结束后以evidence-manifest.json封存完整SHA树，封存和复核收据保存在W目录外的acceptance/20261021-long-flow-090-w-seal-receipt.json，避免递归自引用。
