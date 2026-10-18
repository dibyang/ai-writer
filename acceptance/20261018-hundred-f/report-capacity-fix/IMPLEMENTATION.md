# 容量修复实现与边界

源修改在final-recover退出后执行，保留0.7.2原会话绑定到其prepared提交、幂等、恢复和导出结束，未原地重绑旧候选。

0.7.3普通审查在createLongform注入reportLimit=现有LIMIT，replay_review同样显式使用LIMIT；text仍先按UTF-8文件实际字节执行1MiB保护。全局string默认20,000未改，普通摘要/角色状态/比较及各项引文限制不变。非空、路径、范围、版本、来源、占用、冻结和当前性校验继续执行。无state迁移、无内置引擎修改。

四条旧版针对性回归全部复现拒绝，原件及结果在report-capacity-before.test.mjs和commands/report-capacity-regression-before。正式新回归在tests/review-report-capacity.test.mjs，覆盖结构化/兼容长报告、完整冻结与失效、精确1MiB UTF-8/超一字节/空报告、普通字段仍20k、重登长报告冻结及预览只读/超文件拒绝；4项通过。源码及测试最终字节另存final-source。最终全量152项，151通过/0失败/1环境skip，doctor成功；原0.7.2全部测试及首轮EPERM清理失败/重测均保留，不混成同版本结果。

最终冻结sources/package-v3共61文件，content_id=35b08ad04d03b52b7ea496db49864bb7ed93c4826000004e12b5b6fca3634cca，runtime_id=69b70a70ecb8a609c37c4e269faf32be911267739dcb42a73d5c591c6ca5e54a。加载守卫与runtime_id不是同一命名空间，以实际CLI记录为准。

upgrade-final已实际完成0.7.2→0.7.3/gen3→4与相同输入幂等，业务106章/units/snapshot保持；原D报告25,777字符已以原SHA335b9de80453557e3c2c2a619dcec719c924988d01b397e4a161126bef4c351a成功完整转录登记。原59章实读主体是D，新进程仅记录执行与其本人另读98–106；不伪称新进程再次全文读59。新会话剩余106长报告replay演练、暂停及最终导出仍以其实际完成结果为准，本文不预填通过。

最终补记：upgrade-final进程已正常结束，28,438字符/64,327字节报告完成重登预览与登记、错误令牌拒绝、正确恢复及中止；最终revision409、generation4、106章、暂停正文，107章context/template拒绝，106章草稿导出完成。父进程综合审计与阅读证明复验通过，最终结果以本轮README.md、final-verification.json及封存外部凭据为准。
