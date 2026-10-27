# X轮有限实跑计划与记录口径

本轮开始于2026-10-21，根HEAD7961dece。实际用户原话见author-request.md。W封存为只读起点，X是完整复制后的独立验证副本。未授权Git提交、推送、发布或现有作者作品修改。

目标24→36章。新增普通章至少8000正文汉字，27/30/33/36至少10000；预计新增至少104000正文汉字。实际数字只计state登记的当前正文，排除标题、纲、报告、未完段、旧候选及重复副本。达到字数不是文学质量证明，展开须增加行动、交流与后果，保留既有慢节奏声音。

执行分组：

1. A新线程完整恢复当前1—24，组织V10—V13骨架及至少三条跨卷阶段承诺；写25整章，停26真实分段；同ID恢复26/27，连读22—27并暂停。
2. B新线程恢复当前入口与真实旧锚点，写28整章、停29分段；同ID恢复29/30，连读25—30并暂停。
3. C新线程写31、停32；同ID恢复32/33，连读28—33并暂停。
4. D新线程写34、停35；同ID恢复35/36，连读31—36并暂停。
5. E新线程按真实正文选择至少三处普通旧事实变更，覆盖原24章及新下游，最早影响点至36建立正式独立修订。先冻结旧36字节和旧追踪，保留前三字段不可变观察；预期保护原前12完整units及正文。首停只完成一段重登，根实际验证主区占用拒绝，再同ID恢复全部尾段、完整连读与正式提交。具体变更不是预造bug，待36章完成后按正文证据确定，并明确为受控回归场景。真正发现的高置信问题另列，不与人为事实变更混算。
6. F新线程只从state当前入口完整实读修后1—36，每次不超过100行，前后状态/SHA一致；登记当前报告，核全部必要窗口覆盖与历史意见有效状态，再暂停仅discuss/null/null，实际拒绝37上下文与登记模板，导出当前36草稿到新目录。新高置信问题正式修订闭环后重读受影响当前范围；最终全36须有同一当前版本完整pass。

每轮第一调用status保存真实停点。--out也写锁，串行。preview与record须同一最终输入，原失败与重试均保留；新模板不能只刷新哈希。root helpers仅核原始字节、调用顺序与绑定，不代替模型全文阅读或文学判断。不会将“100章机械回归”描述为本轮100章实写。

产品修复若必要，在安全停点由根修改并测试，冻结新源码/包、正式更新隔离P、重启后才验证最终交付；不在活跃修订中换包。最终源码必须运行npm test/npm run doctor，内置引擎有变化才另跑test:engine。source与实际解压原包的基线套件已分别完成：各199项、197通过、0失败、2项Windows权限跳过，doctor均0；独立核验见baseline-regression-verification.json。后续若改产品源码，必须针对最终源码及真实交付包重新验证，不能复用旧通过结果。

每次原生调用记录prompt、argv、原始JSON输出流/错误流、实际子码/信号与中断。公开工具补充仅提取真实工具输入/输出及源行偏移/SHA，排除私有消息、思考、系统/环境/内部元数据；根控制器错误仅记录已知工具转录摘要，不冒充OS全进程审计。所有调用结束、失败处置和独立核验完成后才封存；原W及既有作品未改需复核。非真人盲读、市场、远程CI或正式发布验收。

## 根执行检查点（清单，不是完成收据）

当前A首轮与同ID续程均正常0，25/26/27分别8622/8071/10520字，当前登记27章/r123并暂停/null，22—27报告正式登记且根实读行覆盖通过。B新线程已启动，后续状态以state/真实收据更新。原生CLI路径为environment.json所记6257d9e8f63c0f2b目录，A线程01a15cf8-3c5c-7ff3-9389-f54d906bfd02；后续新线程ID必须从真实thread.started读取，不复用A。

1. A续程正常0后，运行`verify-read-pass.mjs ar-window-current codex-a-resume`、`checkpoint.mjs a-complete`，核实际暂停/null范围及交接-A完成.md。已生成的entry/creation证明不覆盖重写；尤其a-fresh-start证明是首启时截面，后来出现同IDresume后不重复运行来误判“不新鲜”。
2. `prepare-next-wave.mjs b`要求真实27章/paused/discuss/null并保存父停点。用新Codex exec、prompt-b-first.md启动codex-b-first；首条b-entry-status后`verify-fresh-start.mjs b codex-b-first parent-before-b-state.json b-entry-status`。追加实际会话源路径到native-session-sources.json，等B所有轮次结束再提取公开工具，避免补提造成漏行。
3. B首次正常0后，在任何B恢复进程建立之前运行`archive-source-stop.mjs b`，再`prepare-resume.mjs b`，使用输出的真实同ID和prompt-b-resume.md启动codex-b-resume。首条br-entry-status后核`verify-resume-start.mjs b codex-b-first codex-b-resume parent-b-first-stop-state.json br-entry-status`。结束后核br-window-current完整pass、29/30真实创建收据及暂停。C/D同理，冷启动基数30/33、续程完成33/36。
4. 保存36阶段全部原稿、units/snapshot及外部来源哈希后才准备E受控变更，不预先改作者事实。E新独立区及同ID恢复、主区占用拒绝、24章尾段重登/读稿和真实提交全部须有收据；具体范围及参数依实际原文确定。源变化走真实版本，不更新旧SHA掩盖。
5. F完整当前36pass、当前有效报告、必要意见verify、paused/null、37两条实际拒绝与全目录不变、新目录草稿导出逐字节核。全部原生调用闭合、公开工具输入/输出原行逐项匹配、所有非0/语义阻断处置、原W封存/根Git边界/源码包静态字节复核后，才生成complete总记录和SHA树。

原A首停源目录未由根整目录备份，但原生代理在修改26细纲之前保存了旧原字节；根已核原模板及全部12来源对应字节，证明在ar-first-stop-preservation-verification.json。后续B/C/D在resume前用额外源目录归档补强，不把这种记录方式差别掩盖成全阶段同一种快照。

## 2026-10-21 08:52 UTC 后续执行入口

B首次正常0，b-entry-current完整实读、b28创建、首停来源/全部正文片段归档均已根核。原codex-b-resume首条br-entry-status与r127停点相同，同ID入口证明resume-start-b.json已保存；它只证明入口，不声明该进程完成。该进程在写完29六段后遇到模型容量错误退出1，creation-controller.result.json为真实失败且保留，C/D没有被原执行器启动。

capacity-stop-b.json冻结实际r128和所有当前28稿/分段/来源，state SHA与最后成功br-template29收据相同。原模型/原B线程01a15d55-748a-7500-9016-ada8458f00a7以新调用codex-b-resume-capacity-recovery恢复，唯一CLI前缀brc。29已登记8279字；checkpoint-brc29-current.json核到29章/181986字/r129。当前继续30，实时状态仍以真实state/流为准。新执行器continue-creation-after-capacity.mjs等待本次正常0后验证brc-window-current、实际29—30创建、b-complete；然后串行C首次→同ID续程、D首次→同ID续程，源归档、实读和检查失败则停止。其独立结果为creation-controller-after-capacity.result.json；不重写原失败。

36创作完成后、E改稿前，先运行verify-creation-transitions.mjs，核各个真实历史state（含B容量中断r128）的完整units前缀、所有首停片段原字节及容量中断备份，保存pre-revision36-state.json；再snapshot-before-revision.mjs，备份36当前稿、来源和全目录清单为pre-revision36.json。两个脚本目前仅完成语法检查，尚未执行，不是36章已完成的证据。E选择普通事实需以届时实际正文为准；30已开始写周三课堂，不能用“每章必隔一天”推测影响章号。

guard-probe.mjs仅在E首停及最终F完成后分别执行occupied/final-context/final-template，全部真实主区文件前后同字节，37不得获授权。verify-public-tools.mjs按X计划的六个线程设计（实际来源须最终逐项核验），capture-tool-events.mjs必须等所有同ID调用结束再提取；不得提前生成封存。classify-failures.mjs包含实际B容量退出1及error/turn.failed两个独立事件规则，最终审计仍须逐项检查新的未知失败，不能预写零失败。

新增seal-evidence.mjs和seal-with-external-receipt.mjs只接受36章最终完整证明、失败闭环、源包/仓库证明等齐备后封存，当前只语法检查通过，未封存。源产品本轮仍未修改；基线source/package各199项197通过2跳过及doctor0继续以最终静态字节同一为前提，不能因恢复进程正常而宣称本轮已验收。

## 2026-10-21 10:11 UTC 更新及E/F必须检查的新增场景

B容量恢复已正常0并完成全部根核，capacity-recovery-b-verification.json确认28稿及188个旧分段版本同字节，旧来源仅state正式推进。C首轮正常0，31章8142字；C同ID续程正在32—33，checkpoint-cr32-current.json核到32章208690字，32为8018字。33当前10524字候选尚未因此自动算登记。C真实线程01a15dc1-084b-7b70-a1d3-4f5e124033f1及原始会话路径已列native-session-sources.json。现运行的continue-creation-after-capacity.mjs会等C续程正常0和窗口/创建/检查点核验后，再自动串行D首次及同ID恢复到36；E/F仍未开始。

C纠正新33细纲中的召回ID：P_X_COAT→P_W_COAT，实际JSON差异仅recall_ids.1。正式source freeze/propose/impact实读/publish从33生效；source33-publish-verification.json独立确认发布前后1—32完整units及snapshot不变。版本CR33_INITIAL的object_ref为.writer/objects/c90f0d78c76dbb9dc6bc6d7ed56c68b589f3470940cf222011244101a0913129.source；CR33_RECALL_ID_V2为.writer/objects/bbc56b1c15e97bb9d22895d04979687543f7a5b93b710ebf36d8df02b6b95858.source，previous指回INITIAL，range为大纲/单元/0033.json、from33/to null。根snapshot-before-revision.mjs现同时备份实际source_versions对象及每章draft_review冻结文件。E从13回退重登到36之后，必须额外核对这两个不可变源对象、既有from33版本范围和当前33绑定仍正确，不得因回退丢掉未来发布，不手改state重建它。原source_publish报告明确只算可观察关系，语义由真实阅读负责。

input-recovery-verification.json独立核完三项输入错误：a-context-25/b-context28目录不合规、brc-entry-discussion误用独立命令，均实际拒绝2/状态同字节后正确重试0。prompt-common.md已把discussion明确成context --purpose discussion，旧共同指令保留在originals/controller-guidance，变更收据execution-guidance-clarification.json；这是X执行指令澄清，不是产品源码修复。所有旧失败、原控制器失败、B原进程失败均保留。最终classify-failures.mjs已移除不属于X的W专用SIGTERM推断，新实际错误必须逐项新增证据处置，不能用泛化规则推成恢复成功。

当前仍只完成创作阶段的一部分：36完整、E受控多处修订、E中途锁拒绝/同ID恢复/尾段重登、F全36当前实读/负向37/草稿导出、所有公开工具补充与最终封存均不能先写成已完成。不得提交推送或触碰现有作者作品/旧封存。

当前33登记已实核source_hashes[大纲/单元/0033.json]=bbc56...，source_bindings指CR33_RECALL_ID_V2及同SHA冻结对象；物理canonical大纲/单元/0033.json仍为旧c90f...，这是合法已发布版本覆盖，不是漂移。最终来源验证必须按unit.source_bindings解析冻结object_ref，不能把全部source_hashes盲比物理同名文件；.writer/state.json本来就是各次登记当时的历史上下文，不盲比最终state。所有原始.source对象、既有版本及from33范围须在E后保留。

## D续程自然发现的追踪问题（不同于计划E受控回溯）

D登记36及首次31—36连读后，发现T_X_BOOK_COMPANY中母亲/沈父的两条character_known仍停在35末“尚不知道”，但36正文已写到他们获知本次购书。D已走正式36—36独立修订，正文不改，修追踪并重新读当前31—36；当前已观察到r167/paused，D进程尚在退出核验，不能先写成本组全部完成。已存在第一遍dr-window-current，修后第二遍标记为dr-window-current-final；最终D验收应额外核第二遍，不把追踪修前的旧state边界当作当前修后证明。初创分段/预检/登记证明仍保留其历史口径。

后续E必须在D及根核真正完成后取pre-revision36，保留D修好的最新unit36.journal及角色知情。实际replay-input36应从该最新已提交journal恢复，而非最初dr-record36漏项输入；原草案输出和最终36追踪都要检查，发现工具恢复错误应报根修复，不人工填对后假称工具已正确恢复。E建议事实回溯不应让这两条购书知情回退。

D补读三链时也识别出曾读取25-v1历史候选，已改读当前25-v2；这一误选是操作记录，不得把旧候选读稿当当前实读。用户作品及W等旧封存未授权修改，E仍只在X新独立区、原前12保护。Git提交/推送仍未授权。
