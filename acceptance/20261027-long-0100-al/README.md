# 0.10.0 长篇合成副本 AL 实跑记录

本轮根据用户要求，在 AJ 已封存的 112 章合成副本上续写与验证；复制前逐项核对原封存，真实作品未修改。初始副本含 16,625 个作品文件、408,634,807 字节。原任务授权记录在 `work/研究/AL轮真实任务授权.md`。本目录是本地验证材料，不是正式作品、发布或 Git 提交。

## 规模与内容

独立 Codex 会话 A、B、C 将合成副本从 112 章扩至 118 章，跨 V17、V18。113—118 章去掉标题后的汉字数依次为 2997、2900、3543、4093、4085、4100，平均 3619.7；相同统计方法下 107—112 章平均约 3386，增长约 6.9%。113、114 章比此前近期章节短，115 章未达到 4000 字目标，不能称每章均已增幅。详见 `final-independent-check.json` 与各会话报告。

实际阅读并回查跨卷来源，例如 105 章的纸页在 114 章由何亲自接、读、归还；117—118 回应 111—112 的生活细节。各会话实读范围和逐章判断见 `session-a-report.md`、`session-b-report.md`、`session-c-report.md`、`session-g-report.md`，不声称重读了全部 112 章。创作中发现的动作、时间、数量和引用问题均在登记前修正，并保留此前候选。

## 更新、迁移与修订恢复

从 generation 11 更新至 12，再在修复后更新至 13；两次均通过原生 tool update-plan/update，登记正文与快照哈希保持不变，验证包不复制正文。详见 `update-verification.json`、`update3-verification.json`。此前平铺路径作为历史引用保留，真实路径按迁移事件解析；`session-g-alias-diagnosis.json` 对 1303 条账本引文核验了路径、行号和哈希，其中 1198 条使用历史别名。该检查不代替对全部正文的文学实读。

会话 D 在隔离副本对 110、112 章做受控微调，用来测试多处旧章修订，并非文学改进或作者接受；按原产品修订会话回退、重登 110—118。独立会话 E、F、G 多次以原 ID、原 base 恢复，核对各章和引文后继续。117 对 112 的证据引用重新绑定正文哈希，原文与行号不变。G 实读 110—118 并回读 27、95、100、105、107、109，真实登记滚动复核，然后执行原生 prepare/commit，事务 completed，合成主稿 revision 474、118 章。产品内部修订 commit 与 Git 提交无关。准备清单和全部备份核对见 `session-g-final-audit.json`。

F 的独立辅助审计误以数组顺序断言独立 patch，停止在 118 预览后；G 独立比较 26 项路径、重叠关系并用本副本实际 applyDelta 证明两种次序结果一致，原失败与恢复证据保留。G 首次附加审计因未使用历史路径解析器访问旧路径失败，停止写入；再用产品原生解析器重新核验并另存审计脚本，失败记录未覆盖。其他如 update2 的脚本参数笔误、默认上下文预算拦截、已存在候选覆盖保护、Windows helper 初始化问题及网络重连均保留在对应命令和会话日志中，不把脚本问题归为产品缺陷或掩盖失败。

## 修复和测试

实跑发现 record-template 对人物状态的提示容易让人误以为填写项也会自动合并；实际填写的人物状态会整体替换。已在 `lib/workspace.mjs` 明示保留有效旧信息，并更新使用手册、登记指南和变更记录；原生 preview 可先核对。`template-warning-check.json` 保留针对性证据。修复后的源码 `npm test -- --test-concurrency=4`：256 项、255 通过、0 失败、1 项因 Windows 符号链接权限跳过；`npm run doctor` 通过。原始日志为 `template-npm-test.log` 和 `template-doctor.log`。未声称跨平台 CI 已通过。

最终候选 0.10.0 工具内容 ID `33b3e95b7e04d77b186353171d81c284e0821486bdec701f6f0ab24b3f0f3faa`，ZIP SHA-256 `7556b7fb64c1c6cef2cbba9cfa655e69e878340ad413b68c606d9acf25cd3a2c`；源 HEAD `3703eb584eca48b70aaf2d63466da5c5d38a6f9b` 且工作树有未提交内容。包文件核验见 `template-package-verification.json`。

## 最终边界与复核

最终主稿原生 status/check/source list 通过；118 章登记哈希逐一匹配，导出文本与逐章正文拼接逐字节一致，导出状态为 `draft-export`、`quality_review: required`，详见 `final-independent-check.json` 和 `commands/final-export`。AJ 和 AK 旧封存逐文件哈希均通过，详见 `prior-seals-verification.json`。

保留 5 个 needs-recheck 意见和 5 个旧滚动审查窗口（97—102、100—105、103—108、106—111、109—114）。边界解释偏密和生活叙事重复风险仍需实读判断；本次模型自检不等于真人盲读、市场验证、作者定稿或出版。原始 Codex JSONL、提示、stderr、每条产品命令输入与双流、前后状态、错误及审查记录均保留；`seal.json` 和 `seal-files.json` 是本目录本地完整性清单，不代表发布验收。
