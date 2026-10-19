# 范围审计失败与更正记录

2026-10-19，本次生成的 boundary-audit.mjs after 返回非零：209 个初始被观察文件与后续快照的并集为 546 个，phase 外出现文件增加或内容变化。原始 boundary-before.json、boundary-after.json、boundary-comparison.json 均保留，未覆盖或回滚外部文件。

随后的 verify-method-smoke.mjs 在第99行对“整个共享工作区不变”的断言失败。失败当场由执行工具返回；在改正前使用原脚本与原比较文件重现一次，并将执行工具返回对象（含输出、退出码和chunk_id）完整保存到 verification-attempt-1-reproduced.json。原 v1 脚本也保留。

另建 verify-method-smoke-v2.mjs，保留原有作品、CLI和样本断言；增加对冻结 package-0.7.7 子集的独立比对；将整个共享工作区发生变化如实记录为 boundary_observation，不再把它强断言为不变。此更正不改变产品授权、不改state、不改任何phase外文件，也不声称这些外部变化属于本次执行。

本次所有写入命令均只指向 method-smoke。本次没有写根工具源码、技能、H轮prepared或真实作品；phase外字节差异只能说明共享目录同期有变化，不能由哈希认定修改者。最终交接必须保留这个限制，不能把缩小后的断言当成整个工作区未变化的证明。
