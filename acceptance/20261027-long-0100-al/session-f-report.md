# AL轮最后独立修订恢复会话F：证据失败停止报告

本轮未完成应用候选。已实际恢复原修订，完整实读候选110—118及六章早线索；116、117重登成功。118 replay、非空六项报告、产品preview已完成，但后续独立证据脚本的差量数组深比较失败，按本轮明确停止条件停下，未运行118 record、正式rolling review、revision prepare或revision commit。候选revision482、登记1—117、next118，原会话仍editing且无新事务。合成主稿仍revision473、118章，全部原基线文件未变。

没有新建修订、替换base、手改state、改正文、Git提交、推送、上传、付费生成或发布，没有访问真实作品，没有子代理。三章116—118及全部候选正文保持本轮起点字节。

## 原身份与恢复核验

- project_id：`cd8e8d32-f685-41b1-8f52-5447fe29d399`；writer.json为novel。
- 原revision ID：`dd6f0f3b-1f02-4db2-be4e-34fe7fe658c7`，owner仍`AL-session-d-independent-old-chapter-revision`，scope110—118。
- 原base_revision473；base SHA256：`407040ab54b5715c83e042afe6712135f880dd4a6c1340ec95d27d7fc78e0bf5`。原base-state和主state SHA256：`d0584647414d9bbc4c4fb3d0b8575fae7fcb46fab612120e2d2e3840d714205a`。
- 原token仍用父目录d-resume-input.json/session-d-recovery.json，本报告不抄令牌。恢复输入SHA仍`0afe26ca11fa5f910dc27fd8ac4242dde496b0cf0f902fbbad05dd24e8224920`。
- f-001真实revision resume返回原ID/workspace/base473、editing；f-002真实status为revision480、115章、next116、三份旧尾稿，符合E交接。session-f-start.json又核本地base文件SHA、身份、原110—115的replay绑定，才执行116。

候选原目录：`work/.writer/revisions/dd6f0f3b-1f02-4db2-be4e-34fe7fe658c7/workspace`，沿用同一workspace，没有transfer或刷新来源。

完整读取随附writer-project/novel/review、long-form、通用小说与自然语言模块、writer.json、D/E报告，并读定位/文风/权威规则。定位文件仍有早期“24章/只创作1—4”文字，本轮新授权只用于合成副本的原110—118恢复，未擅改旧作者资料或将旧规划升级定案。workflow保留D轮停止112的历史文字，不冒称其授权了本轮提交；本轮提交条件来自本次实际用户指令，但因证据停止未执行。

## 失败、定位与停止边界

失败命令为独立证据脚本 `node ../f-evidence.mjs preview-check 118 f-010-preview118`，exit1。断言：`equal(normalize(v.changes),patch(main,m.units[n-1]))`。原始工具返回保存在session-f-failure-tool-result.json，说明见session-f-evidence-failure.md。产品f-010-preview118自身exit0、ok=true、findings=[]、source_hashes=matched-current-context；这不是产品prepare失败，prepare根本没有运行。

停止后仅只读定位：旧patch和preview各26项；按相同`at`路径逐项比较，26项的before/after等内容全部一致。差异仅是P_BLUE_SHIRT72_117的4项排序：preview先character_known沈/葛再custody location/condition，原journal先custody再character_known。独立脚本要求数组顺序也一致，因而触发了过严的审计断言。定位证据及原数组见session-f-stopped-audit.json；没有改断言后重试、重排输入、改state或继续118登记来迎合它。

另有一项证据展示瑕疵：116 semantic-reading辅助字段old_patch_paths误取`path`而显示null，完整evidence-comparison的原patch及`at`始终正确保留。后续117/118展示读取`at`，原116文件未覆盖；此辅助清单不用于产品输入或门禁，不宣称其null为真实路径。

失败后仅执行f-011—014只读status/check/source list/主status，及父目录证据审计/本报告。原失败现场、输入、双流与正文均留存，不能据此报告“全部成功”或“已应用主稿”。

## 实际完整实读及当前SHA256

均通过FastCtx完整读取正文，另核真实磁盘SHA。15章清单见session-f-reading-manifest.json；未列章没有完整阅读，不把状态历史长串、扫描或1321文件字节审计冒称全书实读。

|章|当前候选正文SHA256|
|---|---|
|27|c7b9105e0b8ee7589ae4db62c1707228dedc6f13d91c351c47b8d05cc2a81755|
|95|93eb336cc249745f32b3884fbb4b79a9899cf3e767c85ac4744f3f0f0c5f5f01|
|100|6f7f439a1adf22655fc76510906bb88c9dd450a0051ea795d446485cae35c89e|
|105|8f8c80b30b9e117e6e0f60bd065459890426b81b1f032ef68dd17fafb32a691b|
|107|d6c99f4523f1672f7a5335e5da4f185ecf2ef8fe2708af79864ba4e035c5eae6|
|109|6e5a548bab62681fceaef4a8e76329f6db1baa545750098a1675a98bd7cc38f9|
|110|6cee6a5f054e6d5f9d907b8f4e51fe03f8d1344efec2ce3bd5792817d22e6907|
|111|cbc97a650146b666a82778ae04ea4922d7a508c8e05ed8aaa2e74c2fa75fc0e1|
|112|edb4f3bdb8342de8fb07ca34a4acafdc114ebc3d948b67656785ee44111e96c1|
|113|d434a40fe31ccb106b74ba1675a322ad7c629f584430114ca1620f87c1c6c704|
|114|3e183ae32f8444ec332c359448141f9f133dcd5cda3e67c301098c7593ab171d|
|115|e1aea5f98804223d75542a21ca54cb44d25c6ed5f02e92c9ab4df5dd3b7cf829|
|116|22550dc370f4f72a781de47d98a98e039f939b99ae56b3a86bb04a6d43398ead|
|117|5865649be73eb9e7179db221504a11e30fc6f8ab34032c20314e585f0df357b2|
|118|6541555378cb613d60e8da5cf8fa3cd70b53c515a7ff8f11b5148de668d960d0|

## 116—118重放、报告与登记实际结果

|章|replay / preview / record|结果|引文项|
|---|---|---|---|
|116|f-003 / f-004 / f-005|480→481，成功登记|15|
|117|f-006 / f-007 / f-008|481→482，成功登记|7，含112原引文|
|118|f-009 / f-010 / 未执行|产品预览成功，独立证据比较失败后停|15，含111/115原引文|

三章原始replay保存在候选`.writer/drafts/AL-f-replayN-raw.json`；填写输入为`.writer/drafts/AL-f-recordN.json`，六项checked_fields均为summary、characters、timeline、ledger、evidence、downstream。摘要、changes、source_hashes、_replay均保留原生草案，只有replay_review填写；这不是自动认同，有逐章报告实际正文、时间、知情、物件和下游依据。

三章非空报告及SHA：

|报告|SHA256|正式登记状态|
|---|---|---|
|审查/AL-f-116-replay-review.md|c26d754c92f73269d00604779b7628e102adb469e319e78fdc056a9580f1cb24|record已冻结绑定|
|审查/AL-f-117-replay-review.md|5147fb69c2f18871e2a3436e839b9736a329ec911ea7aee918d4f589b3451117|record已冻结绑定|
|审查/AL-f-118-replay-review.md|1184c90de137fc599d5fb0427adc3e36c6122bb5740f072ec5830bcbf67a0c6a|仅preview输入绑定，未record|

每章`研究/AL-f-N-evidence-comparison.json`保存旧摘要、原journal/patch、相关旧前后账本和当前全部引文。116/117已生成journal的patch仅在比较内存里把D轮110/112两个证据SHA映回旧SHA后，与原patch深相等；没有改磁盘旧锚或来源。117对112第37行蓝衫引文实际核原字/行号不变，整章SHA因D轮第31行语序改动而由产品重新锚定。116/117的preview/record输入完全同字节。118不套用“登记完成”结论。

## 全尾段实读结论与正式rolling review未完成项

本节绑定上表110—118实际正文，记录本轮连读所得；因118证据停止，没有生成或登记正式rolling review，本节不能替代原生review记录、prepare的整尾段门禁或旧欠审窗口。

|章|实读推进与承接|
|---|---|
|110|68日葛清原木椅供素姐不消费坐；真正停工听话导致袋不足/冷饭代价。沈想接话但也想回家，未成常驻照料。|
|111|69日葛亲完成盒单、炒热加蛋吃完饭；口述昨日饭最后倒。自己决定不添一盘、约剪发并自锁门，钥匙未交沈。|
|112|葛本人选后颈/两侧、镜后只修一处并自付35；14:49分路只见往铺走，不补开门销售。蓝衫仍是本人说家有。|
|113|70日实走桥、未录托盘、只问路不强问陌生女人；面5元/蛋4元实购。何次日看105新页仅约成，尚未读。|
|114|71日何亲接105新页读到末行再全还；720误读与有点烦是具体回应，何关于66日有点烦的回忆此时才告沈。另纸记回话。|
|115|不改105或追索夸奖，桥页另写；扶伞先误托骨再扶柄，铁套在毛巾中，扣响未证明修好。另夹本人独读；向顾只问次晨能否试，尚未获答。|
|116|72日顾才新答时段并用自己手机收初版；窄列表/17秒拖动出现具体困难。沈留初版另修自测，顾未收修后，无成交或定价认可。|
|117|沈新问葛晚饭，葛定时/口味/不默认做饭，沈买23元鱼菜姜亲备。18:10到场后葛才点头确认112旧蓝衫，鱼只入锅未吃。|
|118|菜砂/鱼老的成本仍在，双方各选吃并添饭；葛只听扶伞口述，未读桥页。本人要求两张照片且自留手机，19:18分开、到家未知；沈独自善后。|

早线索回读：27第43行“那你写你自己听”并非115才首次做到，95已另写本人半面、何只当次看还，100又仅何当面听末行；105另页与划头原稿一前一后，114回话外夹，115桥页另夹，不能把三种纸混成同一份。107自录、109自用报价/沈手机当场试，与116顾手机远程接收是不同环境；240始终例价，不从有反馈推外部验收或订单。

两处旧章改动均仅D轮保留：110第43行“接问”→“接着问”，仍是想问未问出；112第31行改成“沈没觉得那七八分钟特别长”，仍仅沈感受，不推出葛不急。候选110/112与主稿不同，其余116—118及所有正文在F轮零变化。118“三天前她讲”指111的69日口述，不指110的68日亲见倒饭；照片、蓝衫、纸页和工作副本的保管/阅读范围逐步有据。

文学观察：配角保留自身选择与成本——素姐不是只要一句安慰，葛要好看/清淡/鱼尾，何给不合意但具体回应，顾要早餐和送件时间。存在慢叙事以及“想解释—停手—生活收束”的累计重复，文件与许可边界解释偏密；当前未确认需改正文的语言硬问题，不宣称文学提升或过线。语言核对使用当面复述、动宾、行动落地和默读语流；未实际人声朗读、无真人盲读或市场验证。

## 终态、保护和未决事项

- 主稿仍473/118章。主state SHA仍`d0584647414d9bbc4c4fb3d0b8575fae7fcb46fab612120e2d2e3840d714205a`；118条原登记与起点一致。原base inventory共1321文件逐项SHA全部不变，包含原作者资料及正文；没有新资料应用到主稿。
- 候选482/117章/next118。候选state SHA为`5f7ba7a6d5364068eee85fb3b469238082197b21cecaf70d06005d5a7be49e58`；前115条登记完全不变，116/117重登，118原正文/原journal仍在。主/候选全部118份正文各自与起点完全同字节。原116—118旧journal SHA在候选仍匹配，没有覆盖旧不可变对象。
- 原会话实际editing，未prepared/committed，无transaction_id；本轮没有新事务，旧事务状态保留。原ID/base/token均不改，不能用新begin绕过此断点。
- 最后check：ok=true、mechanical-only、literary_quality=unreviewed，117章，1项118 UNREGISTERED_DRAFT警告。stale_units/changed_sources/impact_pending空；source list的entry_differences/pending_edits/impact_pending空。
- rolling valid24/stale121；旧欠审97—102、100—105、103—108、106—111、109—114保留，另有112—117欠审。没有用实读清单或本报告虚盖窗口。
- 五项意见原样needs-recheck：H107_RETAINED_VOICE_COUNT_CANDIDATE、H109_RELATIVE_DAY_DRIFT、H72_REPEATED_KNOWLEDGE、H79_SINGLE_BRICK_REFERENCE、H83_REPEATED_PHONE_EXCLUSION。没有标applied，最终status逐项与起点相等。
- 未证事项保留：旧声未知男声/钟声/是否同日、剪者/日期/历史载体/受话人、残通知日期/挂牌点、罗私人原因、旧款押金；素姐修镜、葛69日开门销售、何71日取送样结果、花衫女人去向、伞最终修成、顾72日送件到达、工作修后外部效果、葛72日晚到家也无新证。未知不等于未发生。

未完成的必要工作为118原生record、绑定当前110—118的正式rolling review、原revision prepare及其成功后原生revision commit。按本轮“遇证据失败须停止”没有继续这些依赖步骤；不把可解释的数组顺序差异自行改判为继续授权。

## 产品命令与原始证据

全部14条产品命令经父capture.mjs、唯一f-标签、串行；产品exit全部0，stderr全部0字节，runtime_files_stable全部true。凡有--input，capture原始输入与当时SHA匹配。前后state、输入、stdout/stderr及产品result都在commands/f-*。f-run.mjs只是携原workspace/token调用单条capture；没有绕过capture。独立证据脚本exit1单列上述失败，不以产品全0掩盖它。

|标签|实际动作|
|---|---|
|f-001-resume|原会话真实恢复|
|f-002-status-at116|核115/480/next116|
|f-003-replay116 / f-004-preview116 / f-005-record116|116闭环完成|
|f-006-replay117 / f-007-preview117 / f-008-record117|117闭环完成|
|f-009-replay118 / f-010-preview118|118到预览；随后独立证据断言失败|
|f-011-stopped-status|停止后只读候选终态|
|f-012-stopped-check|停止后只读机械检查/欠审|
|f-013-stopped-sources|停止后只读来源|
|f-014-main-stopped-status|停止后只读主稿与会话/事务|

首次普通Get-Location在capture前实际helper_unknown_error，未执行产品，原文保存session-f-sandbox-error.md。后续仅授权合成目录单条require_escalated审批，无审批绕过或自动审查拒绝遗留。运行工具仍0.10.0，无修改工具，不运行与本次恢复无关的npm测试。

主要证据：session-f-start.json、session-f-reading-manifest.json、session-f-preview117-audit.json、session-f-failure-tool-result.json、session-f-stopped-audit.json、session-f-final-audit.json及commands/f-*。以上为本轮停止现场和语义自检，不是文学验收、作者定稿、正式出版或任务全部完成。
