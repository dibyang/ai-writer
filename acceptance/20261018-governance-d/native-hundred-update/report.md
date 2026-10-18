# D批百章原生 Codex 工具更新验证报告

本阶段已在 scale-hundred/work 完成隔离验证，正文暂停。实际完整阅读的是当前第95–100章六章；没有重新读完百章，没有新写百章，也没有第101章。这是知情模型抽样实读与工具治理验证，不是全书文学验收、真人盲读、市场验证或发布验收。

## 范围与恢复

只凭本地文件恢复。已读主项目 AGENTS、writer-project、writer-novel、writer-review、长篇与语言审查参考、docs/tool-updates.md，以及本副本 AGENTS、writer.json、handoff、准备阶段摘要、定位/文风/权威规则/续部总纲与V12/V13契约。历史报告不代替本次正文阅读。

原始 copy-manifest 逐字节复制的 schema2/revision371 到准备阶段显式迁移2→3→4→5及有限第100章修订授权，属于已有历史。本次恢复于 schema5/revision375；本轮原话覆盖旧“修订100”安排，本次没有 begin/rewind/replay/record 或正文修订。

合成作者原话完整保存在作品内“研究/D批百章工具更新授权.md”，明确标注 synthetic acceptance，并以真实原字节SHA、quote、locator进入启用、更新、暂停输入。只授权本副本与本地0.7来源，documents=[]，根资源保留。没有创建会话、子代理、对外消息或提交/推送/发布。

## 本次六章实读版本

|章|当前文件|完整覆盖行|SHA-256|
|---|---|---|---|
|95|正文/0095-先写今天这一页.md|1–78|93eb336cc249745f32b3884fbb4b79a9899cf3e767c85ac4744f3f0f0c5f5f01|
|96|正文/0096-听完以后出门.md|1–70|1c7aaa5031a6021cbea55dc59feb3912833154f7c141dec114499458dc860532|
|97|正文/0097-两张仍在一起.md|1–82|a88211ff494bf6024bc9c44a1d0fa71dae77fbf3f1f6d018d35ef47b69002ca9|
|98|正文/0098-到点以后椅子还在.md|1–80|0ba33184f1b846a0c06b405017e31c8bb81917e1d4d422cf3f6fdec44f97ab1b|
|99|正文/0099-饭后还有一会儿.md|1–86|390ab02ebfce519741c02cff1c633c65c55b74b4ddec75fa32561f87f3c490a4|
|100|正文/0100-念到这一页的末尾.md|1–74|6f7f439a1adf22655fc76510906bb88c9dd450a0051ea795d446485cae35c89e|

六份正文均由 FastCtx 实际完整展示，无长行截断。readings.json 记录逐章事件、引文/行号、物件与知情边界；另有第24/27/31/35/48/54/74/83/88/89/92/94章的匹配片段回查，逐条记录哈希和实际片段覆盖，不计作这些章节的完整阅读。

## 连续性观察与未决

- 95本机旧90秒/自页退出说明并未包办移动盘；96实际查盘对应备份后，98才补何获知。文件仍保原音原文，不把找到这一只盘推成所有载体已查清。
- 原31缺名两页与27单页是两个物件。31→35→48→54→83的已见片段支持先归沈、保细夹换宽夹、归邱及盒入下柜；97实开原盒，第二页仍缺名，宽夹合页、细夹留角，原袋及新外条归邱下柜。92上柜私册单页本次只回查旧片段，97/100没有重新取它；中间入册日期仍未知。
- 罗94才实际得唐何全读归还结果并停止新预看，95何/97唐各自获沈相应转述；100邱实际收到回声。何、唐没有由口述变成柜内亲见；周只获本章可知的私人安排，邱不知新半页内容，何不知之后沈邱电话已发生。
- V12空间安排在88限55—61；98末晨亲见收期限纸，不自动续固定空椅，葛回顾未见日不变成沈每日在场。公屋无新时段，旧两段钱与长期经费/人手仍未清，T_KEEPER_SHARE保留partial。
- 74月约及各住边界到99进一步成当前镇家选择；饭约、亲密、20:28各持钥离真实落地，不推同住、永久承诺或重起一月。100沈继续独自生活。
- 95新半页预看→98约定→100何仅一人实际听到末行，不录拍拷/不留稿，并明确当前不排公开；旧套照停。T_SELF_USE_95为本次私人用法阶段回收，T_VOICE_CONSENT/T_PAGE_PAIR仍partial，未强改due100或追补所有历史流转。
- 24已结的是广播片段班次与送门口交点人范围；96/100没有新来源证明钟/拖椅似声、男声、整带日期、剪者或目录命名用意。T_AUDIO_REMAINDER pending，罗私人失约intentional-open，不编答案。

### 真人语言别扭句

真人语言硬问题：没有。

风格偏好观察：95—98的否定和范围说明较密；做饼、枕套、茶铺装盒、99共饭及100眼镜闲谈仍有不同生活收益。本次没有授权改文，不据此扩成重写。对白复述、搭配、具体动作和模型默读节奏核对均不等于真人出声朗读或盲读。

## 旧包、来源与定制

旧工具实为0.3.0、7文件、无清单。7文件逐一与封存复制清单核同，并以 copyFileSync 保存完整字节、立即SHA复核。它们与当前来源有5个文件不同；完整内容比较有31项差异，全部见 legacy-and-customization-audit.json 和原始 compare 输出。没有未知工具文件或可信清单差异被跳过。无清单无法证明历史上无定制，legacy_target_acknowledged=true只接受这7文件及精确观察内容ID用于本次隔离验证。

根AGENTS、技能、手册等41个现有资源均逐字节保持；update-plan明确列39项根资源保留。documents=[]。新包原版手册/技能/许可证/来源记录随.writer/tool安装；61文件均已保存原始来源副本并立即核SHA，新清单另生成。来源是本地工作树，provenance dirty=true，不称为干净提交构建。

旧目标内容ID：f8babc96d6773e3e782e5165f2df2097f8373e52015af59a280cacc0f1ce1481

来源及最终内容ID：8a9e937e5942887d25339fe5189a8f96374df389215721d82f0a6aac9e974167

最终只读计划SHA：58a4911984e5f01e4681146d6a81af7ea50297d93b1699739dd62fb9ed3f957d

来源树旁证限制：开始与结束的源保护清单发现 1 项变化，详见 source-scope-observation.json。观察到 docs/authoring-governance-design.md 变化，不在更新包内，本次没有写命令指向它；哈希不能单独归因。不能声称整棵源码树未变。更新涉及61文件的冻结来源、当前来源与已安装包三者逐项一致，最终tool compare differences=[]。

## 协议、事务和幂等

|操作|schema|revision|generation|结果|
|---|---|---|---|---|
|恢复基线|5|375|未启用|100章|
|外部tool enable|6|376|0|工具未替换|
|重新计划后外部tool update|6|377|1|completed|
|相同完整更新输入重试|6|377|1|unchanged=true，state原字节不变|
|新入口workflow set登记正文暂停|6|378|1|仅discuss/plan，两范围null|

启用ID：825322c6-f169-4540-9e46-1912267366eb。原state备份 .writer/tool-enables/825322c6-f169-4540-9e46-1912267366eb/before-state.bin 与本阶段state.raw.json完全同SHA。更新事务ID：82326b4d-13f3-4377-bc2d-5f168d01c165，终态completed，无pending/staging；完整输入、请求SHA、计划SHA、事务计划SHA和每个旧/新.bin备份见 protocol-and-transaction.json。62项事务变更的全部适用旧/新备份均重算SHA核同。事务自带候选验证是工具内部步骤；后续还从真实作品随附入口另行执行了命令。

## 实际入口与停止状态

全部33条直接产品命令都经本批capture.mjs及唯一native-d-hundred-*标签；实际结果在各目录 stdout.raw.txt/stderr.raw.txt，完整参数、cwd、输入原字节和state前后字节见command-index.json。

新作品入口实际独立运行 --help、doctor、status三次、context --purpose discussion、check、outline --unit 100、recall --query T_VOICE_CONSENT、tool identify/compare；cwd为作品目录。help指向包内手册，doctor errors=[]/warnings=[]，轻量包引擎标optional-in-workspace-copy，不声称引擎或全套产品回归验收。

旧0.3入口status真实以exit2/COMMAND_FAILED“追踪状态损坏”拒绝schema5，未降级。辅助runner最初预期exit1，实际2导致断言错误；保留原记录并另存说明，没有重写输入或产品源码。未经legacy acknowledgment的只读计划保留TOOL_LEGACY_ACK_REQUIRED和TOOL_PROTOCOL_REQUIRED阻断；接受精确基线后仅余协议阻断，再显式enable。

末尾stage=paused、allowed_actions=[discuss,plan]、draft_range=null、revise_range=null。next_unit=101仅表示顺序。真实新入口context --unit 101与record-template --unit 101 --draft 正文/0101-越权验证不得创建.md均exit2/ACTION_OUT_OF_SCOPE，前后state SHA一致，未创建正文。final discussion context仍可用。

## 百章保持与归档

全部100正文与100journal原字节、100个完整unit对象/原source_hashes、所有非state消费来源及snapshot均与本次基线核同，units/snapshot还与原schema2封存state深等。历史消费的.writer/state.json哈希保持原值，未与当前迁移state混同、未为了check重填。copy-manifest中598个原始来源文件复核仍同封存哈希。

现有副本文件只变化6个：state及旧工具中5文件；新增749文件均为工具完整资源、协议证据、事务备份/验证副本和本次授权。现有审查、输入、原正文与journal未动；没有复制旧修订分支历史。两个早期state归档实际自检均为正确原字节，本次另保存schema5/schema2正确raw副本，未发生Buffer经JSON序列化的问题。

最终check：ok=true、findings=[]、100 registered、unregistered=[]；rolling_review valid=51、stale=62、stale_without_current_coverage=0、pending_windows=[]。这是机械覆盖状态，旧stale报告不被重刷，本次六章报告也未为“变绿”写入文学登记。

source/技能/手册没有本次写命令；C封存、原百章及真实作品未被写入。C/真实作品没有全树前后哈希审计，本报告不虚构这一证据。所有本阶段落盘路径都在D批根内；保留全部原始输出、输入、备份、观察到的源变化副本和失败说明。

## status观测

|标签|耗时ms|stdout字符（UTF-16长度）|state字节|
|---|---:|---:|---:|
|pre-status-1|226|3671|1098321|
|pre-status-2|237|3671|1098321|
|pre-status-3|223|3671|1098321|
|new-status-1|239|5528|1100026|
|new-status-2|238|5528|1100026|
|new-status-3|234|5528|1100026|

前三次为外部主0.7入口/schema5，后三次为新随附0.7入口/schema6且暂停登记前。均为新进程墙钟耗时，含启动与I/O；本任务有其他并行I/O，协议、输出和入口不同，只描述观测，不计算或宣称加速。

交付：report.md、handoff.json、command-index.json、readings.json、hundred-preservation.json、timings.json；另附protocol-and-transaction.json、定制审计、来源范围观察及raw基线。下一步只允许讨论/规划；没有正文待续写动作。
