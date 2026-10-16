# 精确ID召回候选v3（已隔离验证，尚未合入）

在真实66章r197冻结稿中，`recall --query T_PAGE_PAIR --limit 1`首先返回T_PUBLIC_USE而非T_PAGE_PAIR；旧实现按账本插入顺序截取，关联条目中提到目标ID就可能排到前面。全部5项仍可在足够limit下取得，不能说原索引丢条目；问题是精确目标在限额或大回包截断时未优先暴露。

隔离候选candidate-v3-recall只改lib/longform.mjs和tests/longform.test.mjs：查询全串与账本ID一致（忽略大小写及前后空白）时提到首位，其余匹配顺序不变；多词继续AND，不改成语义检索或OR，不改变总数/omitted、上限或状态。

新增真实CLI回归原实现1/1失败（先返R_BEFORE），修后1/1通过，含大小写、空白、限额、多词AND、其余稳定顺序及状态只读断言。红绿原始输出在parent-commands/recall-priority-red、recall-priority-green；全量候选npm test **60/60，无skip**、doctor通过，原始argv/退出码/分流输出在candidate-v3-validation/，正常用户权限覆盖Windows链接测试，未改全局设置。

真实66章副本对照见recall-priority-real66/result.json：before_first=T_PUBLIC_USE，after_first=T_PAGE_PAIR，总5项/省略4保持，state SHA256仍db7e20f786e157d704fe2f82794e4f7638c917c66a53e3702da68336eb512905。该实验只证优先级和只读，不是速度收益或已合入最终版本证明。

活动创作仍用source-baseline-v2，主工具和作品内置代码尚未修改。计划90章停止点再合入并同步运行时、核对状态不变和候选来源，随后真实作者改稿及91—100章/最终新会话覆盖。若未完成后续，不得将本文件作为最终产品通过证据。
