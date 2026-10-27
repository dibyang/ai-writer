# G 新构建最终验收续程（进行中）

2026-10-25约14:52 UTC。整轮尚未完成/封存，不提交推送发布，不改真实作品。原E/F证据均保留；不能在G新包实跑未完成时结束任务。

- F最后native f-resume2正常exit0/2484666ms，main337/60、candidate369/60，交接-F续停-距离意见门禁.md已根完整读50行。F已完成304页实际post-record尾读、真实距离提交、完整60报告、旧8verify、有效61拒绝/草稿导出，但距离apply被gen7范围门禁拒绝，因此F明确未完成。
- 真实缺陷：已采用I_AD_F21_DISTANCE证据9/21/42，只有21正文实改，正式提交scope21—60；gen7 apply错误要求所有证据均在scope。原输入/exit2 REVIEW_PUBLICATION_MISMATCH/state未变保留。不能删9/42、重新采用或acknowledge洗历史。
- 已修lib/review-workflow.mjs：范围外参考须真实before/after/current完整登记和原文保持，原采用基线匹配、归档hash有效；范围内当前登记匹配实际after，仍须正文/显式tracking实际变化。自动保存reference_units/target_units，after_units全部证据，后续参考变化仍重核。旧resolve/候选/acknowledge边界保留。lib/help.mjs及3份手册、RELEASE_NOTES补充。
- 新5项有意义回归全部pass；旧代码red已复现。完整本轮npm test **229/227pass/0fail/2skip**，耗时701769ms，双流和结果local-checks/reference-evidence-full-tests。两skip均Windows符号链接权限；本轮未跑其他平台。新根doctor pass（local-checks/reference-evidence-root-doctor）；内置引擎未改未重跑。测试开始后源码未修改，发布来源mtime核无晚于测试起点，不伪称有事前Merkle快照。
- 已冻结新包reference-evidence-fixed/ai-writer-0.9.0.zip，SHA **0e4ca99dc86cc8d5c794dc3072aac22394227c61bca1d3dcdfffe75dd13ec48b**；真实Expand-Archive到extracted-reference-evidence/ai-writer-0.9.0。源码327和实际包329文件全部hash匹配。CID **91a5eb61844e85102cd61fede4ddba142191a879e1722e92e42db323cf09612c**，RID **819a50b3d460176db6d36a05e1cb2f161a34ac61ee2a5705bb81bc9d032ae652**。generation8-package-verification.json已pass，勿重跑wx。
- 旧active-tool.json/cli.mjs保留gen7。新package-generation8.json是源包身份；**active-tool-generation8.json**是实际安装选择，**cli-g8.mjs实际执行作品.writer/tool/bin/ai-writer.mjs**；cli-g8-source.mjs仅外部更新入口。不得再用旧cli/旧build-parity脚本验证新最终版本。
- 官方workflow设置暂停正文、仅discuss/plan，保留4类已采纳planning。原planned stage误填planning被INVALID_INPUT拒绝，原输入/脚本保留；v2按实际枚举paused成功。主338后update-plan可更新/无阻断，选3手册；实际更新事务 **08981fb2-3048-4f2f-9802-4ab53c18e0c4** completed→main **339/60/gen8**。generation8-update-verification.json已pass：60全部unit/body、baseline/snapshot/32源/31range/旧意见/commit完全未变，66受管资源匹配，39未选本地文件保持，11事务目标/10old备份通过。勿重跑wx。
- 根最初误用活跃revision checkpoint checker读取main-only F2完整cp，TypeError无修改；正确check-main-reading-resume g-pre-update-main通过3541files/151objects。原F2cp不改。另一次根更新plan摘要展示截断，只是元数据，原CLI全双流在，不计读稿。
- **checkpoint-g-entry.json**由checkpoint-main-complete.mjs真实遍历完整项目 **23615files**（含历史/更新验证区），stateSHA **e32b720575c7697c507bbc9e069700aac4e1263c829c8421272cf20a6011a4c2**。main检查器可直接用此schema；原revision专用检查器不可用。
- 当前**g-first**原生新thread **01a17384-9035-7833-9acc-311b647abef1**，exec session90517，started约14:43:49Z，正常运行；用progress.mjs每次同时检查done/exit及实际读页，不能只看页数而误报活跃。14:51 root已核1—4完整15/143页。新首程只读当前1—30，保存AD笔记/半本报告，不注册全书、不apply，不改正文/state；30后checkpoint-main-complete g-first 60（注册60≠已读30），正常退出再同ID恢复31—60。
- fresh-g-entry-verification.json已pass，**实际新thread、安装入口、全原生23615byte-check、r339/gen8**，勿重跑wx。status界面首次提示截断，另名重取；原CLI事件aggregated_output两次均有完整原JSON，helper已按原始公开事件/原双流深匹配，不计为正文读页。check/doctor/source/revision/issues均exit0，指纹一致。

## 下一步必须完成

1. g-first完整1—30/143页与真实首停；root verify-reads/read-order独特label后正常同IDg-resume。使用完整checkpoint、check-main-reading-resume实际公开核再verify-main-reading-entry；新CLI仍cli-g8。source/bodies必须仍原字节，不把旧F阅读替代G新包实读。
2. g-resume完整31—60/244页，合新包当前60共387页。用原id、原commit **eddba6bb-f619-4229-9c99-c191f14837ab**直接apply，原事务 **af1dcd6c-e7b5-432a-aad5-776cfe4a75a4**；保留原三证据和原采用。输入不新增target_units（自动派生），当前expected_revision/新operation_id/commit_id/reason即可。实际应范围外reference9、正文target21、42在尾段合法重登且正文不变，after_units覆盖9/21/42。不要重新采用/造新正文改动。
3. 当前G全1—60正式模型报告，9项（旧8+距离）verify，原8 application/commit/origin/resolution保持，49retained误判纠正、13optional可选；旧窗口/旧报告当前覆盖，不删除。
4. 用真实原授权先切合法drafting、允许draft但范围止60来测61，否则当前paused仅discuss/plan会先ACTION_OUT_OF_SCOPE但不是有意义draft范围验收。保留既有planning，61计划已由F2正式建立未消费。正确context --purpose draft --unit61与record-template有效输入均ACTION_OUT_OF_SCOPE、exit2、state字节不变、无61正文。实际export新目录，不用draft-export伪命令；根逐章trim+分隔符合并比对manifest。
5. G最新6类CLI、完整交接/正常exit。root最终原文/数据/source32/ranges31/24bindings、全部原application/commit、更新备份、当前完整387读稿/顺序、新包/源码/安装parity、doctor、旧6封存45716只读核、全audit/失败处置/README/verification.json后seal-evidence。最终版本不标正式发布，no commits/push。

根已写verify-f-published-integrity.mjs尚未run，待G距离application真实产生后（没有新增小说revision的前提）可run：预期only正文21短语改变、前20登记项不变、其余59正文含49不变、snapshot只33个21引文SHA变化、32源31range24bindings、旧8 application不变、F commit只增1。最终Gbody总汉字应542804，新49—60仍161066，实际run结果为准。旧固定r322的verify-e-published-integrity不可重跑；旧build-parity也固定gen7不可用于G，需新最终parity对G8选择并引用本轮229测试。

完整源包创作新增49—60及F尾段修订发生gen7，新包G8不冒称重写60章；G8实际覆盖同一60章更新恢复、跨会话完整阅读、真实原意见闭环、范围保护与导出，结合未改模块旧实跑及新全量回归。文学仍模型知情自检，非真人/盲读/市场或作者定稿。
