# V实跑发现：仅追踪修正的意见闭环

状态：本轮修复候选设计；尚未改产品，待实际拒绝和红灯用例留证后实施。不是把既有八项功能标为未实现：既有正文意见采用→事务修改→复核闭环保持，本次补充正文不变、实际修正summary/timeline的范围。

## 证据与问题

V实际第5章正文正确，登记summary/timeline的“停航次日晚”错误。根确认权威规则第3行是检修停航前夜，4正文“第二天五点二十”和“今晚六点半”约量，6正文是停航第一天下午。正式修订4—6只澄清追踪日序，不应改正文凑条件。意见V_A_U5_TIME_METADATA已在修订前按真实授权adopted，原记录和原正文冻结。

lib/review-workflow.mjs apply当前仅当对应正文SHA变化才允许applied；手册也明确原文实际改变。本次实际调用将保留，不伪造已修复或改一个空格过门禁。

## 最小兼容方案

- apply增加可选`change_scope`，枚举draft/tracking，省略仍draft；原正文修改门槛及返回结构保持，旧调用不因source_hashes、报告、operation或治理变化而被算成修复。
- tracking必须显式声明，且绑定现有真实committed修订及completed事务、意见覆盖单元/旧稿/当前稿匹配。事务归档state旧/新字节仍由现有validateTx哈希验证，publication仅额外返回受校验的state引用。
- 对意见涉及单元，从归档旧/新state恢复该单元完成后的实际事实快照，与该单元summary组合计算稳定语义哈希；忽略对象键顺序，保留数组顺序。只换journal文件名、重建来源/报告或治理revision不算变化。正文可以保持同SHA。
- adopted时basis的draft/SHA/dependency必须匹配事务旧单位，当前单位及实际追踪必须匹配事务已发布新单位；不接受采用发生在修改之后的伪旧基线、无关/未提交事务或后来另次重登冒充本提交。
- tracking application保存commit/事务/归档state绑定及每单元摘要/快照变化哈希，不能只凭人填“已修”；后续仍须当前有效完整范围实读报告verify。脚本仅证明发生注册追踪变化，是否解决该意见仍由真实模型复核，不自动作文学/作者定稿结论。
- 不升schema、不自动迁移实际作品，不改原正文default gate或可选意见处置规则。新旧数据可读，新增显式tracking模式只能由新工具执行。

## 验收

1. 正文同字节、summary或timeline确改，经正式事务后tracking apply及当前报告verify成功，事件/幂等/作者授权绑定完整。
2. 同样追踪修正的默认draft apply仍REVIEW_CHANGE_REQUIRED，状态和事件对象不增加。
3. 纯等价重登（来源/报告/journal/revision变化但summary与事实快照相同）tracking apply仍拒绝，不发布状态。
4. 伪造、未提交/不相关或基线不符事务拒绝；后续再改追踪，旧verified显示needs-recheck，历史保留；坏模式拒绝。
5. 原正文修改闭环回归及完整npm test/doctor；若修改内置引擎另跑engine。冻结修后新包并实际解压测试，随后只对V隔离作品执行正式工具更新，用同一Codex会话完成实际tracking意见闭环，再从新鲜B继续扩到12章。U/T和实际作品只读。

本设计不把任意JSON路径或随意state编辑变成验收证据；事实快照重建使用已注册journal或旧完整快照，事务外的手工state变化不能靠本入口追认。
