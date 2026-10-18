# 本阶段辅助脚本错误记录

finalize.mjs首次执行在旧事件整理步骤报错：`TypeError: Cannot read properties of undefined (reading 'events')`。原因是辅助代码把实际的`source_events`误读为`source.events`。这是本会话辅助脚本错误，不是产品CLI返回，也不计入47次产品调用。

报错前已写出的CAS检查、原session/base副本、章节对比和旧版本保留文件均原样保留。修正只发生在本阶段辅助脚本：读取真实`source_events`绑定并核验对应事件字节；对已存在证据仅允许完全相同字节的复用，任何差异都拒绝覆盖。再次执行成功。未修改作品state、session/base、协议字段、正文或产品源码。

早期parent-start-tracking.json中的`sources`也因字段名称假设未输出；完整原始state仍在parent-start-state.raw.json，所有原source_hashes/版本可由原始state和真实source list恢复。最终source-events-comparison.json使用真实字段，保留12个旧事件及其完整内容和双方字节核验结果，未把早期辅助快照当作完整来源注册表。
