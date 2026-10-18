# 设定版本、影响分析与跨会话修订

0.7.3的普通审查及replay_review报告均按非空UTF-8文件校验，最多1 MiB；不再继承普通字符串的20,000字符默认值。路径、范围、原文引句、来源哈希、报告冻结及原观察保护继续生效；prepare仍要求最终字节上的完整尾段复核，较大的报告不能替代真实阅读。

本页原schema4保护同样适用于schema5/6；重登草案、登记预览及意见闭环见[复核专项手册](review-and-registration.md)。0.7新作品默认6，旧作品仅显式启用，不自动迁移；随附工具另按[本地安全更新](tool-updates.md)处理。

当前适用0.7.3本地候选，新作品默认state schema6；版本与独立修订保护自0.5.0/schema4引入，后续协议继续复用。普通作者用自然语言说明任务，由Codex准备输入和核验真实哈希。这里的命令不自动理解文学含义、作者身份或授权范围。

## 从任务开始

未来补充可这样说：

> 先恢复这个作品。准备第七章起使用的新规则，保留前六章实际消费的旧版本。实读旧输入、候选及相关正文，列出是否改变既有事实；存在矛盾就先报告并进入修订，不能把它标成无影响。

旧章修改可这样说：

> 将第二章押钱由两枚改为三枚，核查后文退钱、人物所知和物件交接。从最早影响章到现有末章建立独立修订区，修改、实读重登及复核完成后提交。不要直接改主稿或覆盖另一会话的候选。

新会话恢复可这样说：

> 先 status 和 revision list，恢复当前任务、未决决策、版本及活跃修订。我的修订 ID 和令牌保存在本地交接文件。恢复原分支，不刷新基线；如果主稿已变化，保留候选并比较新基线。

0.7.2支持从主项目入口对独立workspace运行doctor，资源来自其已核验的父作品，不要求分支自带.writer/tool。结果分别列project_root、resource_project_root和revision_context；当前执行构建与会话绑定不同会明确失败。保留候选并选择匹配入口或新基线，不复制运行包或篡改绑定。正文/来源完整性仍由check及提交前校验负责，doctor通过不等于文学或提交验收。

## 协议与兼容

- 0.5 新作品默认 schema 4；阶段/授权、作者决策和增量 changes 沿用上一批机制。long-enable 仅启用分卷契约，schema 4 不降为 2/3。
- 旧 schema 1/2/3 按原规则读取，不能假称已有本批保护。1/2 先显式 governance migrate 至 3；3 再 protection preview/enable 至 4。enable 输入 expected_revision 和 author_evidence，保存原状态备份、保留事实与旧 source_hashes。
- 启用 4 后旧 0.4 解析器拒绝状态；否则它会忽略版本和修订占用。doctor 会指出随附工具不兼容。使用新主项目入口，不手改 schema、不只复制 CLI、不自动更新工具或实际作品。
- schema 3 的直接 rewind 保留兼容行为；schema 4 的历史 rewind 必须位于正式独立修订区。已有正文授权不自动等于覆盖整个后续修订范围，Codex 必须依据作者实际指令准确登记。

## 设定版本流程

1. 用 status 恢复阶段和范围，source list 查看已有版本、区间、未发布入口差异和历史影响。
2. 在修改活动设定前 source freeze 冻结真实旧字节；首次 baseline 发布固定原输入。旧消费者的每条哈希必须与冻结字节完全相同。已经改了入口时，先找回可核旧字节，用 file 指向旧文件冻结，再 source bind 补充等价绑定；不能把当前新字节追认为旧章输入。
3. 编辑设定入口或另建候选文件，source freeze 产生新提案。冻结不等于发布，也不把未经核验的史料变成 verified。
4. source impact 只读列出版本、直接消费者、保守的间接范围和 required_readings；默认间接语义影响 unknown。Codex 实读这些字节及必要原文，写独立审查报告、记录报告哈希和所读文件哈希，说明结论和未解决项。脚本只核这些声明及字节，不证明模型读过或结论正确。

历史发布的 revision_from 是实际生效起点；review_from 可提前一章读承接，retained_prefix_consumers 明列保持旧版的前缀。读前文不等于必须回退前文。例如从第100章生效，授权和回退可以只覆盖100至当前末章，不能仅因同一规则文件被前99章消费就强制回退到1。如果实读发现更早矛盾，应报告并依据真实授权另调范围；若前缀仍是未固定的 live 输入且已经漂移，原哈希保护继续阻断，不能借此忽略它。

一次 publish 表示从指定起点持续生效；impact.replaced_ranges 明列将切分或取代的原区间，包括已经安排但尚未消费的未来版本。实读时核对这些安排是否仍应保留，不能只看直接消费者。旧区间和提案事件仍保留在历史记录中。
5. 确认只涉及未来且没有未解决矛盾时，source publish 从尚未登记的单元生效。旧章保留旧绑定及原 source_hashes；下一章解析新版。旧消费者除 bind 外仍须先发布 baseline 原区间，确保将来回放也取旧版。未来版本不能倒填旧章；同起点尚未消费的版本，只能用 previous 明确指向原版本后显式替换。
6. 改变历史时 source stage 写入持久 impact-pending。受影响续写、登记、召回和导出阻断，旧报告标依赖待复核。随后使用独立修订流程；未生效方案可 source cancel，须授权和理由，提案/事件保留，不能把取消说成已修复。

版本来源限设定/、大纲/、研究/中的 UTF-8 md/txt/json，包括三份默认设定、单元细纲、分卷 JSON、研究事实卡。context/outline/record 走同一版本解析。writer.json、正文承接和状态继续原规则。活动文件是编辑入口；已发布版本的冻结对象才是相应章节输入。入口变动可显示为未发布差异；冻结对象缺失或变化仍直接报错。

### 输入约定

source freeze 输入：

```json
{
  "expected_revision": 12,
  "operation_id": "freeze-rules-v1",
  "ref": "设定/权威规则.md",
  "file": "研究/真实旧规则副本.md",
  "version_id": "RULES_V1",
  "previous": null
}
```

file 可省略，默认等于 ref；previous 可省略。数字和哈希由实际作品取得。source impact 输入 version_id、from、mode（baseline/future/historical）。输出中的完整 impact 对象作为 publish/stage 的 impact；该输入还需 expected_revision、唯一 operation_id、author_evidence、review。review 包括 report、report_sha256、readings（与 required_readings 完全对应）、conclusion、unresolved。未解决项非空不能发布/执行。

source bind 输入 expected_revision、operation_id、author_evidence、version_id、from、through。它只补充与原消费哈希等价的绑定，不改原 source_hashes，也不擅自安排未来生效区间。

freeze/bind/publish/stage/cancel 使用稳定 operation_id，完全相同输入可幂等重放；同 ID 不同输入拒绝。先重新读取 revision，再准备新操作，不偷换过期影响预览中的 revision。

## 独立修订流程

1. 在主作品登记 revise 授权，覆盖最早影响章至当前末章。首版保守核查整个后续尾段，through 必须为当前末章；不自动推断某几章“肯定不受影响”。
2. revision begin 输入 expected_revision、owner、from、through。返回 id、随机 token、workspace、base_revision。把 ID/令牌妥善保存在本地交接文件；list 不返回令牌。令牌只防误操作，不对同用户文件读取提供强安全隔离。

如果建立会话前主稿/活动来源已经被锁外编辑，默认 begin 仍拒绝漂移。先核实真实修改及最早影响范围；有明确授权时可加 adopt_existing_changes=true 和 author_evidence，把当前字节与原追踪分别固定到独立区，再从最早影响章保守重登。不能改原哈希“修好”状态，也不能用它接纳损坏的冻结对象或跳过影响章；没有找回的旧输入只保留原哈希，不能声称已恢复原字节。正常修订应先 begin 再改稿。
3. 主稿保留原样，原业务 revision 不因 begin/resume 或所有权元数据前进。已有活跃修订时普通写命令拒绝；明确 parallel_candidate=true 可从相同基线另建候选，不抢占原会话。即使两者直接改动不同，最终仍按全局 revision 和相关文件 CAS。
4. 从主项目入口把 --project 指向返回的 workspace。实读旧稿；写命令带 --revision-token TOKEN，在区内 rewind，然后从最早影响章逐章实读修改、检查、用 context/record-template/record 重登。正文、分卷、增量账本和旧哈希规则都继续有效；正文不是硬链接。
5. 如有已 stage 的历史版本，在 rewind 后、重登前，在区内 source publish，输入 expected_revision、operation_id、author_evidence、impact_id。版本在所请求起点生效；为保守核查而提前回读的前缀仍用旧版。主稿的 pending 不提前消失。
6. 重登到原末章，核对人物所知、伏笔、物件和后果。对整个修订尾段实际连读，写新报告并 review 登记；机械合成测试报告不等于模型实读。依赖绑定改变时，即使正文哈希不变，旧报告也需重核。不能只删审查目录消除待办。
7. 在主作品 revision prepare（id、token）：核主基线、工具、范围、候选、账本、完整重登和一次完整尾段复核，返回待发布文件/哈希与目标 revision。它只表示机械及流程就绪，不表示文学通过。prepared 后编辑器再改候选会使 commit 拒绝；先 resume、重新检查和 prepare。
8. revision commit（id、token）：加短锁重新比较主业务与所有相关字节；成功后多文件事务发布，主 revision 只比基线增加一次，保留分支 revision/head 与提交清单。分支临时 revision 不直接覆盖主 revision。相同已提交会话可幂等查询结果。

主作品的 plan/volume/record/rewind/workflow/decision/迁移/审查/导入等写入口共用占用检查；style-scan 带输出文件也受保护。只读 status、source list、revision list 可以辅助恢复；事务中断期间普通读取也阻断。

独立区只复制受管作品目录与实际消费依赖，不嵌套其他分支、事务和随附工具。当前首版不发布文件删除、章节改名、新增正文或配置/授权/决策改变；这些应在主作品先确定或另建明确流程。未登记新稿不会悄悄进入修订发布。

## 冲突、恢复与移交

- A 提交后，B 即使改不同章节也会冲突。保留 B 候选，不刷新其 base_revision，不把新主状态复制进旧分支。按新基线另建会话、实读迁移需要的改动。revision abort 需 id、token、reason，只结束占用，原分支保留。

冲突返回前50个变化路径和完整 conflict_ref；主状态、字节或工具差异分别保留，不能只凭“revision相同”忽略锁外编辑。source list 将未发布编辑与“入口匹配另一已发布版本”分开展示；例如查询第6章时，入口可能已经对应第7章的未来版，不能把它当未发布草稿。
- 跨会话用 revision resume（id、token）恢复原分支，不自动抢占、不改基线。conflicted/committed/aborted 不可 resume；prepared 的 resume 会取消准备状态，需重新 prepare。
- 令牌遗失时可显式 revision transfer：输入 id、expected_session_sha256（list 返回）、owner、author_evidence、reason；核作者证据后返回新 token，旧 token 失效，候选和原基线保留。移交证据冻结在协作目录，不写主业务来源；不存在超时自动接管。
- commit 先写同步的事务清单和旧/新字节备份，再替换目标，最后替换 state。未完成事务出现时普通读写返回 TRANSACTION_PENDING；revision list 返回事务 ID。操作系统不提供多文件天然原子性，也不声称获得断电级持久保证。
- revision recover 输入 transaction_id、token、direction=complete/rollback，按清单补完新集或回滚旧集。已完成事务不能反向回填旧 state；撤销已提交内容须新建逆向修订。
- 实际进程中断可能留下 write.lock。工具不按超时或 PID 不在就自动删锁；恢复需额外明确作者授权、实际 lock_sha256，且原锁进程不可仍存活。不要关闭全局安全设置或盲删锁。
- 若中断早于事务创建，可 revision unlock：输入 lock_sha256、author_evidence、reason；有活跃会话时还需其 id/token。锁原文与授权保留在协作恢复目录。unlock 只处理该锁；已有未完成事务仍阻断普通读写，须继续 recover。
- 发现第三方字节时，恢复预检停止；旧、新、外部版本及冲突列表保留，绝不直接用备份覆盖第三方稿。人工比较三方后，只有目标回到已知旧/新字节集合，才可再次按清单恢复。文件缺失也会作为第三方状态核查。

分支、事务与孤儿对象不自动清理。list 用于盘点状态，删除前另行明确确认范围；不要以“过期”判断可覆盖或可清理。

新登记保留当时的作者决策消费引用和授权事件，并验证其哈希及生效范围。后来撤回/取代作者计划不抹去旧章当时确认依据；新旧绑定损坏不能只因当前阶段正常就通过检查。迁移来的未知历史授权不伪造补填。

会话的 build_id/tool_build_id 是启动时模块集合的守卫摘要，按 RUNTIME_FILES 声明顺序对路径与原始哈希计算；它与 tool identify 的受管内容 ID、按文件清单计算的 runtime_id 是不同命名空间。它用于同构建会话提交，不能作为作者身份、供应链签名或执行字节的密码学证明。

## 验收边界

当前保护面向同机本地文件系统。应用命令锁不能阻止任意编辑器或旧程序写文件；隔离、提交前重复比对和三方冲突保留降低损失，但不宣称排除最后一次比对后的全部锁外竞态。共享盘/NFS、跨机协作、自动合并、安全工具更新和审查意见级闭环不在本批。

保留既有分卷、changes/journal 增量链、不可变观察、物证交接、滚动连读和来源哈希。文学影响与语言判断仍由 Codex 实读并说明范围；不能把脚本、自检或报告字段检查包装为真人验收。
