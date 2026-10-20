# 0.9.0 交付可靠性与新用户完整流程 U

状态：本轮 Windows 本地交付测试及隔离三章创作流程已完成。结项依据是 `verification.json`、`final-flow-verification.json` 和封存清单；最终包为 `candidate-delivery`，不是名称带final的历史中间候选。0.9.0仍开发中、未发布；本轮不是正式发布或全平台验收。

用户授权：按下一步建议推进，先本地提交上一轮，收敛易错操作，再用最终交付包从零做隔离新作品的完整流程；不推送，不修改现有作品。60/100章的进一步扩规模放在交付验收之后，本目录不将3章流程测试包装成百章实跑。

## 上一轮本地提交

`0c6d27abd3548dc99c1a72996b9b4f2e2ef5ccb4`，8497个路径（13个产品文件、8483个T证据文件含清单、1份外部封存回执），未推送。T封存核验通过，Git中8483份T文件与原工作字节一致，见 `t-local-commit-verification.json`。

T目录不因Git空白诊断重写：原始CRLF、行尾空格和空行受`.gitattributes * -text`及封存哈希保护，34646条诊断全部位于T，产品文件差异检查通过。原始输出在`t-staged-whitespace.raw.txt`，分类在同名JSON；本轮未把.idea纳入提交。

## 本轮实现

- `assemble`：当前有限授权/修订号、有序分段路径及SHA，全部预检后独占创建新完整章，不覆盖、不登记、不改state，保持原字节。硬链接在当前Windows沙箱不可用，改用COPYFILE_EXCL；不承诺断电原子性，中断后核稿并另存。
- 可选`draft_review`：报告实际保存且非空，绑定当前章及报告SHA，正式登记冻结报告；缺报告/版本不符写入前拒绝。补充诊断冻结对象缺失/篡改保护，封存前再核报告，保留真实阅读与文学判断边界。
- 账本type/status错误提供字段、允许值和稳定码，preview仍退出1、record异常仍退出2；模板/文档明确先报告保存、再preview、成功才record及失败停止依赖。
- 打包Git查询对ETIMEDOUT/EINTR/EAGAIN最多重试一次，持续或其他失败明确命令/status/error并停止，不伪造来源。
- 快速入门、使用手册、长篇/登记/技术说明与发行说明同步；CI增加macOS配置，不冒充已执行三平台结果。

## 候选与证据边界

|候选|用途/状态|
|---|---|
|candidate，a278…|初版功能；源码191项188通过/1 Git来源读取失败/2跳过；实际ZIP189通过/2跳过；原生初测只写两段2341汉字、未登记，不作最终完整流程|
|candidate-final，ff6c…|补齐报告完整性保护；源码193项190通过/1 Git来源读取失败/2跳过；ZIP191通过/2跳过；未用于最终新作|
|candidate-delivery，ff6c…|最终交付验收包，补打包诊断恢复/测试与发行说明；受管运行时/技能/手册与上一行相同，完整ZIP重建并逐文件核验；源码与实际ZIP各194项192通过/0失败/2 Windows跳过，最终全新scenario-final由此包创建|

交付包受管内容ID：`ff6cde0f1be3459f7d8a4249e3dd8ee3eec39d468df48f9c2f11308e5bd6641b`。ZIP SHA256：`a4d0263e42f9531a2ffb53ba6ff0d902ee334f3e1a7e833f7a822ea398d22d13`；325个文件、323份来源映射、324份冻结源码/CI条目。包来源为上述本地基线提交+dirty工作区，精确版本由内容和文件哈希绑定，不把它当已提交/已发布版本。

## 验证路径

- 最终源码/实际ZIP：`commands/source-tests-delivery-bounded`、`package-tests-delivery-bounded`，各`npm.cmd test -- --test-concurrency=2`，194项192通过/0失败/2跳过，分别848032.4145ms/799680.8732ms。doctor为`source-doctor-delivery`及`package-doctor-delivery`均通过；随包引擎`package-engine-delivery`29项全通过。`build-delivery-verification.json`独立核全部结果、来源/实际解压文件/ZIP哈希与CI配置，明确仅为本地交付测试，不声称创作流程已完成。
- 原生Codex：初测`codex-a-first-authorized`已退出0，2段1135/1206汉字，revision3/登记0，见`preliminary-a-checkpoint.json`；最终流程使用`final-codex-*`及`scenario-final/东岸末班船`，初测只读、不复用稿件。
- 最终步骤已完成：最终A首停→同ID恢复完成1—2→新鲜B跨卷3/修订首停→同ID恢复完整尾段/正式提交→新鲜F完整读当前3章/审查/暂停/第4章拒绝/草稿导出。各阶段均有根会话独立版本与状态核验。
- Windows Node v24.15.0实际运行；2项符号链接权限测试预期跳过。CI配置Windows/Linux/macOS × Node20/24，本轮不推送、不触发远端，Linux/macOS及其他Node版本待执行。WSL初次查询权限拒绝、授权只读重查无发行版，未安装/修改系统。

## 失败和修正

见`initial-findings.md`、`regression-first-pass.md`、`report-integrity-findings.md`、`provenance-findings.md`及各commands原始双流。报告完整性新增两项故障测试先失败后通过；中间source-tests-retry运行中源码变化触发34项保护失败，不当作34项产品缺陷或最终回归。两次稳定运行的Git来源失败没有底层细节，不声称已证实超时；独立查询成功，新测试中的两条超时提示是受控注入，不是现场Git超时。

初始未包装的shell/工具调用保留于会话并在本目录摘要，不宣称每次初始调用都有独立双流文件。后续捕获命令、原生事件及作品输入/报告保留完整；包装器拒绝带`=`的npm参数先于子命令发生，改用明确入口，不绕过产品校验。新作installed=null的根验证假设错误已修正为实际tool identify，不改state来迎合验证脚本。

机械测试、模型知情自检、独立新鲜会话恢复及真人/市场验收分开。可选文学建议不能自动必改，交付仍为草稿。本轮新增修改和记录尚未提交，未推送；此前T本地提交保持不变。

## 最终实际创作结果

最终作品只位于本目录 `scenario-final/东岸末班船`，从实际解压交付包初始化；没有修改用户既有作品。当前revision13，schema6，3章、2卷、正文共13965汉字（去Markdown标题）：第1章5214、第2章3525、第3章5226。当前单章最少3500，第一、三章超过5000；不将此数值当成全书规模证明。

|原生阶段|实际结果|独立复核|
|---|---|---|
|A首停，01a157e1…|写两段后保留现场，未拼章/登记；首停两段最终1126/1215汉字|parent-a-first-verification.json|
|同ID A恢复|读取首停文件，分段完成第1/2章，assemble、保存报告、preview、record；缺报告负向输入实际退出1/2且state/objects/journal均未推进|parent-a-resume-verification.json|
|新鲜B，01a1581a…|文件恢复1—2，跨第二卷完成第3章；逐件点具、接箱、80元实交、分联凭据与到家后果|parent-b-verification.json、parent-three-original-verification.json|
|B修订首停|正式修订2—3范围，回退后只重登2；退出进程后主区仍受REVISION_OCCUPIED保护，state不变|parent-occupancy-verification.json|
|同ID B恢复|重登3，完整尾段复核，prepare/commit正式提交；主区revision11，单元2/3各自draft_review及replay_review绑定|parent-revision-verification.json、parent-revision-result-verification.json|
|新鲜F，01a15849…|当前1—3连续全文实读、功能比较、全文范围报告登记，正式暂停、越权拒绝、草稿导出；正文无新增修改|parent-final-verification.json、final-flow-verification.json|

B受控追溯修改把普通维修报价30改35：第2章报价与对老何转述、第3章同额小票共3处各插入一个“五”，其余正文同字节，第1章未变。它是验收输入要求，不是发现了报价产品bug。费用月底结、尚未支付，80元押金未受影响。原白漆观察type/statement/author_truth三项不变，第三章实际用其定向摆箱，未升格为排他归属证明。工具箱交给受托人并装车赴铺，未写到铺内；父辈全史及柜门安装仍未知，不能为了清表虚构完成。

全轮共7次原生启动尝试：1次因Codex状态数据库权限未启动，随后6次实际运行退出0，涉及4个独立thread（其中1个仅为初测）；最终流程5次运行、3个thread。A、B分别以同ID resume，不是用新会话冒充恢复。原生执行未派协作子代理。原始JSONL、双流、输入、实际CLI退出码与前后state均保留。

## 最终阅读、暂停与导出

F在pass1 before/after同一正文及snapshot版本内，按第1/2/3章顺序用8次FastCtx读取全部685行（280/163/242）。根会话从原生事件提取每一返回行，与当前正文逐行比较，见 `native-final-read-coverage.json`；仅忽略确由文件末尾换行产生的一行空项。该证明说明模型收到了完整当前文本，不能证明文学理解，更不代表真人盲读。

报告在 [U-最终当前稿-0001-0003.md](scenario-final/东岸末班船/审查/U-最终当前稿-0001-0003.md)：按细纲/分卷承诺、逐人知情、物件/钱据链、动作、目标/选择/后果/关系变化及语言实读。未发现本轮必须开启新修订的高置信硬问题；饼干计量、快语中的照片指代和开场细节密度保留为可选意见，没有自动变成必改。审查记录绑定当前三章及真实非空报告，滚动审查pending为空，旧范围记录保留但已有当前有效覆盖。

作品正式paused，仅允许discuss，draft_range/revise_range均null；原planning和作者决策保留。F的context/record-template第4章与根会话重复负向核验均ACTION_OUT_OF_SCOPE、实际退出2、state不变，未生成第4章。没有活跃修订或待恢复事务。

`export-final-current-3`只纳入当前1/2/3章，排除两份旧未登记稿并保留原件。合并稿49633字节，与当前3章按导出规则独立重组逐字节一致，manifest及SHA一致，状态仍draft-export/quality_review=required。作者入口见 [交接-最终当前入口.md](交接-最终当前入口.md)，实际易用性边界见 [final-usability-observations.md](final-usability-observations.md)。

## 证据归类和收尾

`command-native-audit-complete.json`覆盖commands、final-commands、final-b-commands及final-f-commands，共249份已结束命令回执；18份非零逐项归类于 `failure-classification.json` 和 `failure-classification.md`。中间 `command-native-audit.json`只覆盖161份，不作为完整库存。`commands/source-tests-delivery`是包装器拒绝参数后留下的未启动目录，不是仍在运行的测试。辅助审计v2不识别F的stdout.txt而失败，v3又未覆盖A的final-commands容器，最终v4统一命名/退出码别名和容器；历史脚本与结果均保留。

最终阅读核验v1把FastCtx末尾空行判为版本不匹配而失败；v2仅按实际文件末尾换行排除对应空项，再核全部正文，685行全匹配，无重写正文或回填阅读记录。A首停的错误技能路径、两次分段篇幅不足、B动态日志被误纳入保护清单、F一次手选旧journal及根会话定位错误均明确记为辅助/编排问题，保留原证据和后续修正，未包装成产品缺陷。早期未包装调用只保留会话证据及摘要，不声称所有工具调用都有独立双流目录。

`repository-final-verification.json`核当前HEAD仍0c6d27ab、暂存区为空、产品git diff --check通过、324份冻结源码/CI条目未变，T的8482份原封存条目及清单SHA仍一致。`.idea/`未动、未加入提交。本轮产品15个文件（14份已有修改、1份新测试）及U证据均未提交、未推送；未打标签、发布或上传作品。

`verification.json`绑定各证明、报告与导出；封存工具只在该文件本地范围complete后生成 `evidence-manifest.json`，对U普通文件逐项SHA256，清单本身除外。封存后不再写入U，最终复核回执放在目录外 `../20261020-release-readiness-090-u-seal-verification.json`。较早 `build-delivery-verification.json`的creative_flow_complete=false是当时只完成构建测试的快照，保留历史原值，当前流程结论由最后verification给出。

## 暂缓范围

- Linux/macOS及Node20等矩阵只增加配置，本轮未远端执行；Windows的两项链接权限测试仍跳过，不升级成全平台验收。
- 60/100章新增实跑、更多旧章并行修改、持续长稳及真实工具升级链留待下一轮；既有百章/上一轮30章证据仍是其各自版本，不能移作本轮最终包的规模认证。
- 本轮新鲜模型获得明确路径、交接和操作边界，具备CLI/JSON能力；没有验证无指导真人新手的自主发现、耗时或认知负担。
- 真人盲读、真实朗读、作者定稿、市场验证和正式0.9.0发布均未进行。未改既有作品，未上传、付费生成或推送。
