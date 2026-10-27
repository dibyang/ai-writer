# F 服务容量故障与真实恢复

前程 f-resume 的原生结果：2026-10-25T11:28:51.106Z启动，elapsed 5697164ms，exit1、signal null、wrapper error null。公开末事件 turn.failed：Selected model is at capacity. Please try a different model.。这是服务容量错误，不是工具/小说连续性缺陷，也不是正常首停；不存在模型生成的首停交接，不补造。

故障时40章已重登，候选r368/60，main326/60尚未合入。修后21—46完整回读176页，47前2页返回后故障；完整304页当时未读完，不记通过。原始925公开事件和结果保持不变。

根之后独立创建原始checkpoint-f-capacity-stop.json（605项），再合并全部objects。一次误用原label导致wx/EEXIST防覆盖拒绝，未改原清单；另名checkpoint-f-capacity-stop-complete.json成功1460项。此为根验证辅助脚本调用错误，原生工具无此错误。原根工具调用返回保留在本次会话；这里是处置说明，不伪作原始双流文件。

根实际运行check-revision-resume f-capacity-root-audit，对1460项和主/候选state SHA只读核验。verify-f-capacity-recovery.mjs另核原生333个Shell command均有开始/结束，故障时悬空命令0、准确容量错误及原始日志hash。结果f-capacity-recovery-root.json明确normal_exit=false。

批次尾读验收器此前只允许前程exit0。此次没有删去退出检查或将1改0：仅增加这一个精确容量故障的审计分支，必须匹配完整原始结果/事件hash、无悬空写入证明、故障后完整checkpoint与新原生实际入口的主/候选SHA和1460文件数；其他非零失败仍拒绝。修改前用Node COPYFILE_EXCL真保存副本，harness-history/20261025-f-capacity/verify-f-distance-batch-before-capacity.mjs SHA d88c1f66729aa311e51f0953b247bafc0fde3347f176b5ee4c986acec834e139。没有改旧原始CLI-stdout验收器。

f-resume2使用同一thread、同一默认模型重试，未更换模型或新开会话。原生实际执行指定checkpoint核验，根native-entry-f-resume2-verification.json再核公开真实返回：同ID、1460项、candidate SHA9a6ae135cc18259574c581c94c95322cbe89ddc7501a54c7ecdbf56172c1a7d5、main SHAa7d8dad773e474835d47af0cf7ba38e497836712b8cf0be14ff75d8bc023a340，pass。

根还纠正了一项进度反馈偏差：13:03前最后一次完整进程检查后，两次只读页数，未及时查result，曾错误称仍在运行。随后已向用户明确纠正，并改为同时核进程结果与页数。没有将这几分钟计为新增有效阅读或成功运行。

本记录写于续程恢复刚通过时，剩余阅读、正式修订合入与最终验收仍待实际完成。最终结果不得据此预填；额外重读47只算衔接，不冒作新章节。
