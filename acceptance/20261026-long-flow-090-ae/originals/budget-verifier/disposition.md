# 根预算回执核验脚本的out字段假定纠正

原local-checks/a61-budget-root退出1，完整stderr/stdout保留；before.mjs是修前真实复制。产品四命令的预算数值、有效授权、exit、state前后字节和失败out不存在均已通过，随后辅助脚本错误要求磁盘保存文件也含stdout新增的output定位字段。

已核主源码lib/workspace.mjs outputDraft：先atomic(target,value)，后return {...value,output:out}。保存的是原始payload，stdout才加定位，属于既定行为；context和record-template均同一包装。不改产品或原输出，仅将根对比改为保存payload与去掉output定位字段的stdout严格深等，仍核预算44191、12来源/原模板及全部原state字节。重试使用新local-check label保留原失败。
