# 导出辅助校验修复

第一次result生成真实退出1（commands/2026-10-16T03-27-18-701Z-result-write.*），没有生成最终通过报告。30个章节数量、源哈希、included_units及合稿SHA均通过；按标题切片的正文比较失败。

实查export/manuscript.md第83行和各章间有标准`---`分隔行，标题切片把分隔符计入前章正文。错误来自本阶段辅助校验，不是导出改了正文。修前deliver脚本完整保留deliver-before-export-check-fix.mjs；修后按明确的`\n\n---\n\n`分章，再逐段trim比较当前源文。原导出不修改、不覆盖、不重新生成，失败命令日志保留。

之后补做git-status-final时，captured(status-final)的后缀匹配误选Git输出，result-write再次真实退出1（commands/2026-10-16T03-29-29-384Z-result-write.*）。修前脚本另存deliver-before-label-fix.mjs；改为时间戳之后的完整命令标签精确匹配，避免把git-status-final当status-final。仅修辅助汇总，不改作品、状态或导出。
