# W-D同ID续程失败与处理

产品实际失败共2次，均是本会话输入/命令构造错误，不是已确认产品缺陷。每次均立即停止依赖，保留原输入/完整argv、stdout.raw.txt、stderr.raw.txt、真实子码2、前后state；失败前后state SHA相同。
1. drr-review13-18-record：REVIEW_RANGE_INVALID，比较单位包含窗口外章节。原输入inputs/drr-c-review13-18.json及原报告保留；实读包内review-workflow.mjs 71—81行，另存v2输入，按窗口内实际比较并为每章给引文，drr-review13-18-v2-record成功。完整跨窗口比较另登记13—24成功。
2. drr-pause-template：COMMAND_FAILED，workflow只有show/set，没有本次所猜template --out。原argv和双流保留；drr-workflow-help查实际帮助，按真实授权另存inputs/drr-pause.json，workflow set成功r98→99。
辅助读写错误（不是产品调用）：FastCtx replace第一次含${tag}的replacement因undefined capture拒绝且无写入，改成工具规定$$后成功；drr-preprepare.mjs初次误读stdout.txt导致ENOENT、exit1，没有生成prepare输入也没发产品prepare，按实际stdout.raw.txt修正重跑成功；试读inputs/d-revision-workflow.json不存在，随后按工具提示实读d-workflow-revision.json。辅助原错误在本次工具对话中保留，这里是忠实摘要，不伪称为原生双流文件。
前一D进程失败继续保留d-failures.md；不改其历史记录。无transfer、abort、recover、换CLI、工具更新、重建基线、手改state/hash、删除旧字节或根产品补丁。

交接生成字段笔误：初版会话build误取begin返回未含字段，显示undefined；回读后以实际doctor/prepared.commit一致build更正，初版报告字节保留。不是产品状态或会话绑定错误；未改state、包或冻结清单。
