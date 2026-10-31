# 0.10.0 最终候选包两条主路径实跑

本轮使用现有最终开发候选 `candidate-0.10.0/ai-writer-0.10.0`，zip SHA-256 `ff3bf3f93623e3abc4914b8b308c839763324c17d3e755e3416d5e85779daa2f`，内容标识 `f7e9bce10c691f005a36dcb02362aea31381fd8b3c0ecd133632e93c27539933`。候选从未提交源码构建，标记 dirty；本轮不是正式发布或跨平台CI。用户授权原文在合成副本 `研究/本轮用户授权.md`，没有修改真实作品、Git提交或推送。

`bootstrap.mjs` 从 AO 已封存122章基线逐项校验和复制21,748个作品文件，复制后逐项复核；起点 revision 489。原AO和上轮实跑副本没有修改。按用户授权以 `in-place-readonly` 更新隔离副本的随附工具：计划无阻塞，事务 `2e573c29-4eb4-4fee-a23b-e7820f8315fa` completed，revision 491、generation 14；安装后的 `tool identify` 内容标识与候选一致，更新验证目录的正文目录为空。所有调用的构建前后运行指纹稳定；不能把目录为空替代其他目录和备份的全量审计。

续写：读121、122最终正文和近期规划，重用上轮实跑形成的 V20 和123规划作为待验证输入，而非冒称重新独立规划。第123章授权确定后，候选包任务视图主动显示 `extend-draft-directory` 和 `DRAFT_DIRECTORY_REQUIRED`，无需先执行注定失败的 context。预览空 mapping 并扩展未来目录后，context/template、全新正文、实读回对、record-preview与record均完成；新章含标题汉字1108，属于流程实跑候选而非长章篇幅或文学定稿。

旧章修订：原生设置122—123范围、begin、rewind，在独立候选把122的“问出口，她没把它换成写得清不清，葛也没急着答喜欢”改为“话一出口，她没有改问写得清不清楚，葛也没急着说喜不喜欢”。122的10条账本引文逐条核对；122、123按序 replay-input、填实读报告、preview、record；连读尾段并按当前正文哈希登记 model-self-review。prepare列16项变更，正文仅122一项；修订事务 `6b56d51c-8928-4617-af13-852f4858c3af` completed，隔离主稿 revision 496。这里的 revision commit 是产品内部提交，不是 Git 提交。

最终check成功且findings空，status与revision list成功，无活动修订会话；123章正文全部与登记哈希一致，1—121章与AO正文哈希一致，122确有变化，123与首次登记稿一致。[独立核验](final-audit.json)包含30条产品调用的退出码、耗时及运行构建观测；各命令完整输入、stdout、stderr、前后state和退出码保存在 `commands/q-*`。原有5条 needs-recheck 和8个滚动审查欠窗保留；模型实读、哈希、check和导出均不等于真人盲读、文学验收或市场验证。未声称本轮存在独立跨会话恢复；未测试异常中断或修改后的全新参考作品适应性。

本轮两条主路径未发现新的产品阻断，任务视图修复在真实122章基线上复验通过。未创建或发布正式包；上轮最终源码完整回归256通过、1跳过，候选包及本轮实跑只覆盖当前Windows环境。

## 继续：下载包与发布边界

独立解压原候选 ZIP，337个文件与包内发布清单逐项匹配、无额外文件；解包版 doctor 通过。静态Markdown相对链接扫描发现 `docs/release.md` 指向未分发的本地 acceptance 记录，已修为说明该记录仅在维护者本地。扫描及原证据保留在 `package-link-audit.json`；该扫描未检查网络链接、锚点或完整Markdown语法。

修正文档后重新构建开发候选 `candidate-v2`，ZIP SHA-256 `45afd9c5df61f4b8afca85e9ab1beff5fc3326c5ae7bd1b60660bbfb4ed1ac12`，其内容标识仍为 `f7e9bce10c691f005a36dcb02362aea31381fd8b3c0ecd133632e93c27539933`。新旧候选336个清单载荷对照只有 `docs/release.md` 不同，见 [对照](candidate-comparison.json)；新版解包337文件全量核验、doctor、三项发布资产SHA均通过，见 `package-v2-verification.json`、`commands/q-032` 和 `candidate-v2-sums.json`。新版入口对本轮隔离作品的 status 成功，revision 496、next 124、state未变（`commands/q-033`）。两条完整创作路径使用原候选；新版仅改维护者文档，运行内容ID和逐文件对照未变，不能误称新版ZIP重新完整创作两章。

新版ZIP内完整工作区测试257项：256通过、1跳过、0失败；跳过项为Windows测试账户未承诺符号链接权限的场景，Linux/macOS CI仍需执行。包内引擎测试29项全部通过。原始输出与退出码见 `package-v2-test.*`、`package-v2-engine.*`。新版静态链接扫描剩余194项：181项位于第三方参考摘录，13项位于同时被复制为包根 README 的 `release/README.md` 构建模板，以其模板目录直接阅读时相对路径不成立；包根 README 的同一组相对链接正常。这些摘录和模板的未解析链接没有声称全部修复；不擅自改第三方内容。CI 配置为 Windows/Linux/macOS、Node 20/24，但当前没有推送或触发，不能称已通过。沙箱内 WSL 查询返回访问拒绝（`wsl-list.*`），无法据此判断本机Linux环境；macOS未验证。

## 2026-10-31 最新候选

核对来源说明发现其仍称0.9.0为当前开发候选，已改为0.10.0未发布，并说明第三方原文是按清单保留的摘录、上游未收录文件的相对链接可能不可用；发行说明补记新卷目录任务视图提示。重新构建 `candidate-v3`，zip SHA-256 `a23dc7bfb4d4e543ff1c7a81928b336caf6dc9115117338bbcf254a1aa6741e7`，内容标识 `0e43580b6c1b38ec873e905071851f7857f2dfd72052489241388c5f08521a0f`，来源仍为dirty。

独立解包后337文件逐项匹配发布清单，与 v2 对照只有 `RELEASE_NOTES.md`、`docs/attribution.md` 和由内容标识变化产生的 `build-manifest.json` 不同，见 `candidate-v3-verification.json`；运行模块指纹仍为 `a8462c56d49ac053e938241969e9f236a1874b4f3bbba549b845a0175724715e`。解包 doctor 成功，q-035 使用新版入口只读恢复本轮合成作品且state前后哈希相同。新版资产三项SHA核验见 `candidate-v3-sums.json`。对干净解包目录扫描相对链接，仍有第三方摘录181项和 README 构建模板13项未解析；`package-v3-clean-link-audit.json` 是干净包扫描，`package-v3-link-audit.json` 因测试时临时目录产生额外扫描项而保留为中间结果。

最新版 ZIP 内完整工作区测试257项：256通过、1跳过、0失败；引擎测试29项通过、0失败；原始输出与退出码见 `package-v3-test.*`、`package-v3-engine.*`。Windows跳过项为符号链接权限相关场景。沙箱外只读 WSL 查询退出0且未列出发行版（`wsl-list-real.*`）；没有可用本机 Linux 验证，macOS未验，六组跨平台CI尚未运行。两条完整创作路径仍是此前候选上的实跑，新版仅文档和构建清单变化，不宣称已对新版完整重跑两条路径。未修改真实作品、未提交、未推送或发布。
