# 已采用跨章意见绑定窄范围提交：实际缺陷与候选修复

状态：候选实现与5项针对性回归已通过，新根doctor通过；全量npm test及新包长篇实跑仍待完成。本文不是最终验收结论。

## 实际缺陷

F当前60章全书复核发现廖师傅面摊距离问题，原意见I_AD_F21_DISTANCE引用9/21/42章，其中只有21有错。已在真实21—60修订中改21短语，其余39章原字节；提交eddba6bb-f619-4229-9c99-c191f14837ab，事务af1dcd6c-e7b5-432a-aad5-776cfe4a75a4 completed。原apply却因9不在提交范围内而报REVIEW_PUBLICATION_MISMATCH。原始CLI fr2-distance-apply双流/输入/前后state、意见与采用事件均保留，拒绝没有推进状态。

旧lib/review-workflow.mjs逐一要求resolution.basis_units全部位于commit.scope，混合了“取证参考”与“实际修改范围”。已有acknowledge只处理没有事前采用历史的情形，不能用于已采用意见，也不能先改为deferred/retained洗掉采用史。

## 最小修复

不增加必填输入。正式主稿apply从真实提交范围推导范围外参考，要求该提交具有可核哈希的前后状态归档，原采用稿与before匹配；范围外参考的完整登记、正文在before/after/当前保持。当前范围内各证据章登记也须匹配真实after。实际修改仍须落在原意见证据与该提交的交集，不能借无关提交闭环。

范围外参考记reference_units，实际正文或tracking变化记target_units；范围内未改正文的证据仍可随尾段合法重登。after_units保留全部原证据，verify报告仍须覆盖参考与目标，后续参考漂移仍显示needs-recheck。不删引文、不再采用、不改作者原话、不重建历史基线。原resolve授权限制、候选专用凭据、tracking默认门槛及acknowledge边界保留。

lib/review-workflow.mjs只抽出归档读取给既有tracking和新参考校验复用；旧的全范围apply不新增归档条件，保留兼容。lib/help.mjs、快速入门、使用手册、复核说明和未发布发行说明补充用法；版本仍0.9.0，由新构建指纹和后续显式generation区分。

## 回归证据

- local-checks/reference-apply-red：旧实现中同构用例失败，真实错误REVIEW_PUBLICATION_MISMATCH，预期red exit1；不是伪造成功。
- local-checks/reference-apply-focused：4项通过，覆盖事前采用/窄提交/参考与目标/原历史保留、当前复核覆盖、参考后改需重核、无实改、无关提交、参考在提交前后变化、参考同正文重登、归档损坏和拒绝不写状态/对象。
- local-checks/reference-apply-tracking：第5项通过，仅改摘要可显式tracking，默认正文门槛仍拒绝，正文SHA保持。
- local-checks/reference-evidence-full-tests：完整npm test进行中，不能预填通过。
- local-checks/reference-evidence-root-doctor：当前新代码doctor exit0，完整双流保存；指纹以该原始输出为准。

内置引擎未修改，不将接口测试包装成文学判断。F49误判仍retained，绝不借本修复改写正确正文。

## 待实跑验收

全量通过后生成新的只读包，从ZIP真实解压，按官方tool update-plan/update在AD独立60章副本显式更新，保留gen7及备份，不覆盖active-tool.json或旧封存。新工具启动从作品随附入口运行，重新读当前60章并真实退出/同ID恢复；用原距离意见和原提交直接apply/verify，不再采用。实际9/21/42证据必须全部保留。重测有效61范围拒绝、当前报告/旧8/13optional/49retained、草稿export；最终核源/新包/安装资源、全部原文/冻结对象/旧封存和完整审计。

60章的新增写作与40章距离修订发生在固定gen7；新构建不冒称重写这些章节。最终新包验收针对同一60章实际恢复、跨会话阅读、原意见闭环、范围保护和导出，配合未变模块的原实跑和新源码全量回归。当前正文不得为工具门禁增加一次无意义修改。


## 最终状态更新（2026-10-25T16:34:14.532Z）

本缺陷已在generation8实际独立作品中使用原采用与原提交完成apply/verify，全书387页新构建复读、有效61范围拒绝和草稿导出核验通过。229项源码测试为227通过、0失败、2项Windows权限跳过；仍为未发布开发候选。以上覆盖本文早期“尚待全量/实跑”等当时状态，原始证据保留。详见FINAL-REPORT.md及verification.json。
