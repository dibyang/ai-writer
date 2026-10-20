# 首轮完整回归

- 源码默认npm.cmd test：191测试，188通过/1失败/2 Windows符号链接跳过，耗时764345.7141ms。唯一失败为tests/release.test.mjs首项，buildRelease读取Git provenance时明确拒绝：`Cannot read release Git provenance reliably; retry after Git is available`。原日志未记录Git子命令的更底层状态，不推断为已证实的超时，也不推断ZIP内容错误。
- 相同源码单独运行release.test.mjs：2通过/0失败。保留首次失败，不用复跑覆盖。
- 实际ZIP解压目录默认npm.cmd test：191测试，189通过/0失败/2 Windows符号链接跳过，497179.704ms；未改源码重建来隐藏问题。
- 源码及实际ZIP doctor均通过；实际ZIP引擎测试通过（并未修改引擎）。
- 资源竞争是待核解释，首次运行同时存在两套全量回归和构建任务；本轮不凭一次环境拒绝放宽来源检查、延长超时或伪造unknown来源继续构建。随后安排同一冻结源码完整复跑。
