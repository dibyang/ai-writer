# T R1受控多点旧章修订计划

授权：研究/T轮验证授权.md第3—5行是原作者范围，原话含“多处旧章修改后的连续性，发现问题直接修复……暂不修改现有作品”。本客户端本轮用户另明确指定实验候选和正式修订流程。14:55、14:50、14:57、60是该范围内的代理试验落实数值，不冒充作者逐字选定，也不将其注入后产生的不一致称产品缺陷。

主稿入场r62，登记24篇，generation4，state SHA fa5e71b878db186bb96065aa1cad309ba30d337a27a25935e50195ac1fc277d2。实际四项CLI输出保存在r1-entry-*；revision list全为旧committed/事务completed，无新活跃修订。正式begin前未改主正文、未写25。原24篇正文、25两段与旧snapshot由begin冻结。本进程只登记15—20，21—24留同ID恢复。

## 实读与保护

已用FastCtx逐章全文读到EOF：15=1—90/91—167，16=1—90/91—122，17=1—90/91—120，18=1—90/91—98，19=1—70/71—170/171—270/271—353，20=1—80/81—147，21=1—85/86—155，22=1—90/91—167，23=1—85/86—159，24=1—85/86—153；C25 part01=1—58、part02=1—60。读前SHA/字节范围在r1-entry-reading-before.json；不是摘要/grep代读。C交接及checkpoint实读，25未安装/未付100，两段不先改。

相关ledger原值见r1-baseline-ledger.json、r1-ledger-exact-view.jsonl。O_CURTAIN/object，T_CURTAIN_RETURN/thread，T_SITE_RETURN/thread；O_RACK_WHEELS/object、T_RACK_INSPECTION/thread、O_RACK_PATTERN/object、T_RACK_SAMPLE_VISIT/thread、T_RACK_TRIAL/thread、O_FLAT_CART/object、T_FLAT_CART_RETURN/thread、T_RACK_REPLACEMENT/thread、O_RACK_PAIR/object、T_RACK_INSTALL/thread。基线只有O_GRID和O_LETTER_TEXT为observation；其type/statement原字及author_truth是否存在都冻结，本次均不改、不删、不增补author_truth。三项候选不碰这两项。旧信“上回托收的那盒片”及三格模糊观察不改；记忆/口误的解释不倒填原观察。原登记的summary及journal差量另留r1-baseline-registrations-15-24.json/r1-original-journal-view.jsonl，重登时还须逐章读工具新replay-input，不将其当已核结论。

## 三项普通事实实验及所有预期影响

1. 15借布期从故事十六日15:00收紧到14:55，何在店时间改14:50。原文位置15:39/41/63/131/149/165；逐条原句、新句见r1-text-edits.json。许14:30离铺、15:00前回铺的工作空档不变，15:123提醒不改；16:9/23何场地14:15—15:00不变。16按昨天话亲交、17在14:50散并收布均仍成立，18:17—21实际14:53交接不改。18:23周评说按新截止；相关15/16/18人物、timeline、O_CURTAIN reader_known与T_CURTAIN_RETURN各阶段statement/reader_known/character_known及证据引句逐项同步，不让后来旧changes恢复15:00。
2. 18自报回铺14:58→14:57，改18:44短信与18:81向周口述。林只收到短信，没有跟去亲见。相关summary/人物/timeline、T_CURTAIN_RETURN及O_CURTAIN的81行引句按候选字节同步。归布14:53、工作截止15:00、场地15:00均不变。19—24新故事日的预约不受此一分钟变化，不泛改所有时间。
3. 21车押50→60。21:50交一张五十加一张十元，两张叠好夹陶记账簿，52押纸写60，54本次订20加押60，112转告许；22:146何再说明押60。24:81—83抽出/亲退/捻开核50+10两张，138钱包两张自存并明确新100另备，142转告许退款60。各阶段characters/timeline、T_FLAT_CART_RETURN statement/reader_known/character_known与受影响引句相应改；O_FLAT_CART custody不因钱改造成林保管。23没写数额的押金提及不添数。何钱包原余额未写，只把原50改为从同钱包再取10，不凭空增加收入/转账/借钱。18日检查20已花，19订20在20日失败试配结出工，两笔共40不退；原100余80未付；23日新安装100装好付，均不拿押60抵。

候选24局部复读另确认140行“别明日掏另一半给自己”依赖原50为100一半的语境，受控押60后改为“明日那笔工钱也得自己出”，避免把60当新100一半；这是第三项普通事实变更的下游必要处，不另算产品缺陷。该项追加于同一r1-text-edits数组，旧新SHA更新保留v2证明，不覆写初次修改证据。

还车原期仍故事二十二日18点前亲交陶本人，陶二十三日早用；24实际17:36亲交、陶收入里墙不改。due_unit24是章回查点，不挪成故事24/25日。

## 真实硬问题H1，独立于三项试验

保留B的审查/T-0024-已登记硬问题-H1.md及T-0019-0024.md原字节。24:23“林照说何岚也来，自己送车，她领押金。”早于33何首次说“你推。我一道去……”。21/23没有同行还车约定。本次最小删除电话中这句和所接“陶应下”，保留何33自行决定，69陶抬头亲见何在才得知。到77何亲递押纸后才退钱，不在电话预分退押对象。相关24摘要/林陶状态/证据逐项核；不提前补不存在的承诺掩盖。r1-text-edits理由使用actual-hard-problem-H1，与controlled-author-fact严格分开。

## 执行与未核

先正式begin/rewind15，再只在返回独立workspace改15—24最小文本。逐章template→完整候选及replay-input实读→精确summary/changes补丁→候选六项报告→preview实读→record实读；本进程到20后停止。保留失败命令目录与唯一新retry label。入场误用ledger裸命令退出2，随后用common.run调用help因helper附加--project而报“help 只接受一个命令名”；--help成功。原记录保留，这两次均为本客户端调用失误，不能据此认定help提示不可执行或产品缺陷，详见r1-actual-issues.md。

尚未完成：候选逐章重登、21—24恢复重登、尾段最终完整连读、主稿锁占测试、prepare/commit、C恢复来源更新。无盲读/真人/市场/发布结论，不联网、不代理、不改产品或旧验证、不提交推送。
