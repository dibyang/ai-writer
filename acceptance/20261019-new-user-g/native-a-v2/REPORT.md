# G轮新用户实跑A v2：建书、有限试写与暂停

本次为真实主Codex会话执行，不是子代理委派。所有本轮写入均在D:/work/other/ai-writer/acceptance/20261019-new-user-g/内；未修改主项目工具代码、技能、现有作品或其他acceptance。没有Git提交、推送、联网研究、上传或发布。首个native-a在宿主状态库权限处失败、没有产品调用的启动说明按用户提供保留，本次未替换或改写旧失败、未改Codex全局设置。

## 实际结果

新作品绝对路径：D:/work/other/ai-writer/acceptance/20261019-new-user-g/作品/雾港 来信。

schema6、long模式，最终revision=8，stage=paused，allowed_actions=[discuss,plan]，draft_range/revise_range均为null，next_unit=4仅为顺序。已登记1–3章，正文Han依次1225、1261、1272，总3758；去首行标题、以Unicode Script=Han计数。正文当前无未登记稿；早期未登记版本在read-versions按哈希保留，不混入正文。

已完成定位、人物/声音、核心承诺、六章粗骨架、第一卷1–3/第二卷4–6连续契约，以及近期1–3细纲。规划均标draft，不把代理普通细节写成真人逐项采纳。D_USER_SCOPE只登记用户明确要求，D_AGENT_SCHEME保持candidate并解释本次授权内选用。作者秘密和未决在研究/作者秘密-仅供规划.md，未登记成author_truth或角色所知。

实际CLI观察版本为0.7.4、Node v24.15.0；PLAN写0.7.3是既有背景，本次以原始输出为准。随附包doctor报告workspace-copy、source commit 1a23bcc821f13a1190f8119c255c34f46f272e39、dirty=true；不是声称干净提交制品。

## 从使用手册走通的路径

1. 完整阅读docs/quickstart.md、docs/user-guide.md、docs/long-form.md。按AGENTS读取writer-project、writer-novel、writer-review及长篇、悬疑连续性、通用审稿、自然语言模块；另查docs/workflow.md治理输入和docs/review-and-registration.md。交接整理阶段又补读悬疑审稿、物理操作、角色情绪和心理可读性模块，对已经完整读到的场面作补核，不称其为另一次全文阅读。
2. 先取总help和各不熟悉动作help；按init --path新目录 --kind novel --mode long初始化，status确认默认只允许讨论规划。
3. 在作品研究目录保存本轮用户原话转录与G轮PLAN原件；代理为普通作者准备真实JSON，证据SHA由文件实际计算，无消息ID伪造。
4. 根据已写实的规划文件登记trial范围1–3与停止条件；分别登记需求和代理候选；用volume登记连续两卷，用plan登记1–3细纲。volume/plan结果均是plan-only性质，不进正文事实ledger。观察到卷与章纲保存不推进治理revision，没有按猜测预填后续正文revision。
5. 每章依次context、写前record-template --out、实际原创正文、全文输出实读、自检/必要修改、填写真实summary/changes、record-preview、record。所有操作经capture.mjs调用真实bin/ai-writer.mjs，未直接import业务API。
6. 第三章登记到revision6后取review-template，实际一次连读当前1–3章，按长篇手册的最小review输入登记报告与三份哈希，revision7。章节功能和跨章比较写在实读报告；未把模板unknown占位表当作已填结构化审查，不声称本轮另验了结构化功能表门禁。
7. 按原请求workflow set正式paused到revision8；第4章draft context和record-template分别实际拒绝；discussion context仍能恢复。最后check、doctor、status及文件清点核查交付范围。

逐项原始命令、输入副本、退出码、stdout/stderr与前后state快照在../commands/a-v2-*/。invoke.mjs只是让记录器保存后的原始输出可读，产品执行仍为capture.mjs→真实CLI。普通文件脚本只准备JSON、计算哈希/字数、冻结读取字节与汇总证据；全部正文由本主代理逐章直接创作，没有脚本批量拼接正文。

## 卡点、失败与纠正

| 事件 | 实际观测 | 处理与留存 |
| --- | --- | --- |
| a-v2-help-init | --help仍不接受init的--project，退出码2，COMMAND_FAILED | 改用--path后a-v2-help-init-corrected成功；失败原始结果保留 |
| 规划补丁首次应用 | 初始化标题并非预期“作品定位”，apply_patch整体拒绝，无文件写入 | 核对真实模板后重新语义写入；不属于产品CLI失败，不伪造commands记录 |
| 第2章首稿 | 完整读后Han=1183，不足1200 | 在未登记稿补陶芷清点的具体责任并澄清“实物”，完整补读1261字；旧稿和报告保留 |
| 第3章首稿 | 只有顾姓信息，林柯却说“她寄的”，无性别依据 | 改为“姓顾的”，完整补读1272字；旧稿和报告保留 |
| a-v2-preview-3 | 机械通过仍存在摘要“迟到前”、估工日期和照片张数过度具体 | 新建record-3-corrected-tracking.json纠正；来源哈希不动，新preview后才record。原输入预览未覆盖 |
| 两个第4章入口 | 各退出码2、ACTION_OUT_OF_SCOPE，明确paused只许discuss/plan | 这是预期门禁结果，不改授权绕过；两次前后state哈希相同 |

没有伪称“全程无失败”。普通新用户无需自己写JSON，但执行代理需要看技术手册；子命令help对治理字段主要指向手册，对init参数则明确给出例外。record-preview能检版本与引文，不能发现所有语义夸大，这次确实由实读发现并修正。

## 实际读稿与审查范围

readings.json共8个读取事件，合10个文件覆盖项：第1章自检；第2章首稿和修后各一次；第3章首稿和修后各一次；最终1–3一次连读（三文件）；写第2、3章前分别从context.previous_ending全文回读前章各一次。后两次按真实输出范围登记，虽字段叫ending，实际装入整章。每次均记录正文文件、SHA256、实际完整行范围、报告和原始输出路径。

冻结原文按SHA去重保存5个版本：当前三章加第2、3章各一份旧稿。初稿与修稿报告不能互相冒充。read-manuscript.mjs只把全文输出并冻结字节，不自动写“理解已通过”；主代理读到完整输出并形成报告后，才追加readings记录。阅读JSON声明不单独证明理解，父审计可拿read-outputs和commands里的全文与报告引用比对。

最终连读报告：作品/雾港 来信/审查/0001-0003-整段连读.md。已经CLI登记为model-self-review，coverage=[1,3]，quality=review-recorded-not-acceptance。当前未发现需要立即改动的高置信硬问题；对章尾都落到私人时间的相近节奏，保留可选风格观察，不强行改稿制造差异。

晚补模块核读：小物件动作、展示顺序与保管连续性在文本范围内可还原；机芯型号、后盖内部可视结构及停摆故障原因未做专家核验，专业操作准确性保留caution。三人的同场反应依工时、名声、清点责任不同，未发现高置信性格冲突。没有把日常悬疑套成高危案件或强迫恐惧反应，也没有增加高压、谋杀或超自然。

## 连续性与跨卷交接

13条ledger由已写正文引文逐章登记。重点：O_LETTER、O_TAG27、OBS_TAG_NOTCH、O_REGISTER、OBS_CLOCK_PHOTO、O_CLOCK、OBS_CLOCK_FACE、O_RECEIPT27、O_TEST_PHOTOS及两个主要thread等。工具自动绑定真实单元、文件、哈希、行号；引文存在不等于推论成立，主代理另核每个角色的亲见、口述与未见。

T_TEST15由第1章来信请求变成第3章三人约周六9点一次实测和留结果，status=partial、due_unit=5；本轮仅约定，短摆不到半分钟不算兑现。T_SENDER仍pending、due_unit=6，仅有邮戳和顾姓线索，未查明身份。下一卷须回读首次请求、最近交接和实际兑现处，不强迫所有秘密结案。

最终保管：牌在陶芷拉链内袋；灰布簿与合影由陶收好；电子拍摄内容在陶手机、张数未明且未展示传送；钟在钟铺柜台后墙钩；信及签名借条在钟铺右抽屉。估工、旧账、周五核对、运钟、十五分钟实测和反馈尚未完成。

## 机械核查与范围证明

最终check：ok=true、scope=mechanical-only、3章、revision8、findings=[]、unregistered=[]、rolling_review.valid=1/stale=0/pending_windows=[]。doctor ok=true且无errors/warnings。status没有漂移、impact_pending、修订会话或待处理事务。以上不能单独证明文学质量。

a-v2-context-4-rejected和a-v2-template-4-rejected均以ACTION_OUT_OF_SCOPE拒绝，在缺少第4章细纲之前已由授权门禁拦住。native-a-v2/inventory.json列出正文目录仅0001/0002/0003，细纲仅1/2/3，正文中没有第四章标题；没有第4章正文或详细章纲。第4–6章仅保留全书粗骨架及卷契约。

results.json由finalize-audit.mjs在取得实际CLI输出和文件后计算，未预填通过。46次调用全部保留，运行文件前后磁盘观测一致且全程同一runtime_guard_id。它是记录器的磁盘字节观测，不是进程加载字节证明、供应链签名或干净提交声明。

开始git status已有docs/long-form、quickstart、user-guide、lib/help、revisions、workspace、package等未提交变动。结束时另出现README.md与docs/authoring-governance-status.md变动；本代理没有向这些路径写入，也没有回退它们。仅靠两次status不能证明整个工作树未发生其他变化，因此不把“本代理未改源码”升级为“外部工作树完全未变”。

## 未做、限制与下一步

未写4–6、未实际跨卷兑现、未做新Codex会话恢复、六章复核、旧章独立修订/提交或草稿导出；本请求在第3章收束，不沿PLAN较大范围越权。未运行npm test/test:engine，因为本轮没有修改工具或引擎，也不借用父轮测试冒充当前验收。没有真人盲读、真人作者逐项采纳、市场反馈、百章规模或发布验收。

下一会话先读handoff.json/.md，再通过记录器status、context --purpose discussion恢复。允许讨论未决项；没有新明确有限正文授权，继续不写第4章，不修改已登记正文。所有本地交接保留绝对路径、revision、已登记范围、允许动作、未决对象、下一步和实际产物入口。
