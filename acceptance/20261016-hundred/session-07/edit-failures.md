# 辅助编辑失败记录

第62章补写时，apply_patch尝试匹配独立行“一点回楼，才换房。”；该句实际位于长段首部，工具报Failed to find expected lines。原文件未变。随后使用真实整段定位插入。此为助手补丁定位错误，非产品CLI缺陷；原工具合并回包见本会话，不虚构stdout/stderr分流。
