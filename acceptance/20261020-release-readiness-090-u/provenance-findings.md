# Git来源读取诊断与恢复

- 原始完整源码回归两次在release.test首项失败，第二次发生在受管运行时冻结后。原打包器仅返回通用错误，不能从它确认哪条Git命令或底层错误。
- 单独重建测试通过；保留两次原失败，不推断内容损坏，也不把猜测超时当事实。
- 独立运行相同Git status及no-optional-locks对照均在30秒内通过（provenance-probes原始结果）。单次对照不构成稳定性能收益，未引入该选项作为提速改动。
- 打包器现在对ETIMEDOUT/EINTR/EAGAIN最多重试一次；其他/持续失败仍中止并输出具体命令、status/error及有限stderr。未跳过Git来源、未把失败降级成unknown、未放宽打包一致性。
- 受控单元测试验证首轮ETIMEDOUT后恢复仍记录真实commit/dirty；连续失败最多两次，权限拒绝仅一次且保留具体原因。完整release.test三项通过。
- 此改动仅打包脚本/测试与发行说明，不改变ff6c受管运行时及随附手册/技能身份。最终仍重建candidate-delivery、从实际ZIP解压，并让新作品由该包从零初始化。candidate-final及其先前回归保留为中间记录。
