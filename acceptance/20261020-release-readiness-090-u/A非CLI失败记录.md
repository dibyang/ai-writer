# A 首停非 CLI 工具失败

首次尝试通过 functions.exec 的 ALL_TOOLS 查找 FastCtx read 并批量读取包文档，返回 TypeError: Cannot read properties of undefined (reading 'name')。ALL_TOOLS 未暴露 FastCtx 工具，此次没有调用任何产品 CLI，没有写入作品或状态。

停止该读取依赖后核因：ALL_TOOLS 中 FastCtx 列表为空。修正为直接调用已提供的 mcp__fastctx.read，逐份完整读取。原始失败保留在本次会话工具记录；本文不冒称其为产品故障或伪造 exit_code。
