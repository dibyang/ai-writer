# 父Codex R2与辅助审计纠错

C同ID恢复进程实际退出0，elapsed2988339ms；主27/r69/gen5。父先真实完整读C交接/22—27报告、原27:1—169及24:1—17、25:1—13和24:150检索原句，再正式建立R2（7dd6a70d-af7c-428e-90ef-c10b2a890156，范围27—27）。这是父Codex实际操作，不算另一个原生CLI子进程或真人作者逐项批准。

R2修复C27-H1：原27把24、25已明确读完的杂志又写未读完；同时原夹纸24已取放桌边，27应重新拿。仅27:158两处文字变，5034→5039 Han、正文SHA a775fcaf...→05daf2b72055707c46950e2483f20018acd58096f43d59dfa5a04f5ef6a8e41b。原稿/旧段/旧报告保留，前26登记及正文无变化。

先完整读写前context1—969、replay-input1—118，改候选后完整读1—169 EOF并存读前后SHA；按官方replay-input语义在改后另取当前正文身份绑定，严格核source_hashes/source_bindings/expected_revision/summary/changes与原写前输入相同，未手工改哈希。正式preview/record成功后再次实际完整读候选27:1—169 EOF，写尾段报告、review、prepare。父实际读准备响应1—51、commit对象1—14、review对象1—19。语义snapshot除27引文正文SHA重绑外完全相同；原观察字段均包含在此断言内。

parent-r2-approve首次退出1：辅助脚本把CLI响应的target_revision误当prepared.json字段，报undefined !== 71。当时是approve分支、还没保存approval或调用commit；脚本原件r2-publish-before-prepared-field-fix.mjs及失败stdout/stderr留存。改读p.target_state.revision之后换唯一label parent-r2-approve-v2，所有原断言继续执行并成功；包含主state仍与r2-begin后0635b102...相同、全部主正文仍旧SHA，证明失败未变主稿。这是父辅助断言错误，不是产品缺陷。

精确8文件prepare通过：新journal/冻结重登报告/commit对象/尾段review对象/两报告/正文27/state，原文件覆盖仅正文27与state，不改设置/细纲/配置/原不可变对象。parent-r2-publish实际0，commit主r71，再workflow恢复trial r72。新分段0027-t-r2四份精确拼当前正文；旧四份保留。chapter-27-r2-metrics.json代表当前版，旧chapter-27-c-resume-r1-metrics.json及native-c-resume-window-read.json保留原C阶段版本，不能拿旧27 SHA声称当前阅读覆盖。D/F将再读正式新27。

最终gen5构建在这个实际活动R2候选执行tool identify成功，r2-candidate-identity.json，直接验证父资源继承和绑定；不复制.writer/tool、不改绑定。R2事务终态committed，未引入新产品代码修改，不重复已冻结源/包185项测试。
