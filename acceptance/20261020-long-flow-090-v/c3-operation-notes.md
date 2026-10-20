# C3 调用及过程说明

所有本次产品CLI均由v-writer→v-log运行，普通实际argv带--project W，独立区明确返回workspace和真实token；产品调用实际退出码均0。辅助Node脚本均由v-log保留stdin脚本、真实argv、双流、退出码和目标state快照。没有覆盖旧输入或旧失败日志。

会话内非产品工具探路记录：首次试图在functions内并行调FastCtx时，工具名未暴露，返回TypeError后改为直接FastCtx；首次按tool/skills路径读随包技能报不存在，随即用精确glob定位tool/.agents/skills；一次apply_patch因上下文匹配失败未应用，后重新准备正确patch。它们不是作品CLI失败，未用后续成功覆盖或改写原工具回包。

分段初测10为4791、11为3262、12为4854，均在登记前继续展开真实后果，未拿不足篇幅的稿登记。第10/11/12初合章v1完整回读后各有局部高置信修正，分别另存v2片段并再次CLI assemble、全文回读；各v1/旧输入保留。报告10粗数说明见c3-report-count-note.md。

未使用代理，未改产品/U/T/外部作品，未提交/推送/上传。未建立整树冻结或目录索引，最终完整包/源码/命令库存和主12原稿独立保存留给根。当前仅必要正文/输入/报告及SHA核对。
