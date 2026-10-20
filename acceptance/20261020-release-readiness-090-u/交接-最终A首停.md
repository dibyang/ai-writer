# 交接：最终A首停

本次仅完成最终包新用户原生创作测试的首停。没有完成三章，没有真人盲读，没有正式产品验收或发布。原生会话ID：未知，未编造；workflow操作ID和对象UUID都不是原生会话ID。等待根会话核验后再在本原生会话恢复，当前进程不得继续写。

## 入口、身份与授权

- U：D:/work/other/ai-writer/acceptance/20261020-release-readiness-090-u
- P：D:/work/other/ai-writer/.tmp/U 最终交付验收包解压/ai-writer-0.9.0
- W：D:/work/other/ai-writer/acceptance/20261020-release-readiness-090-u/scenario-final/东岸末班船
- 初始化实际使用 P/bin/ai-writer.mjs init --kind novel --mode long；final-a-00-preflight-v2 记录 W 起初不存在。其前的失败辅助预检也保留，未在失败后直接初始化。
- 后续产品命令唯一入口：D:/work/other/ai-writer/acceptance/20261020-release-readiness-090-u/scenario-final/东岸末班船/.writer/tool/bin/ai-writer.mjs。
- doctor/identify 均成功。tool_version=0.9.0，profile=workspace-copy；content_id=ff6cde0f1be3459f7d8a4249e3dd8ee3eec39d468df48f9c2f11308e5bd6641b；runtime_id=9ed9031ff670f4c6e0ef5754b32e079e436d5e6de9576912b4742b6f541b138f；本次关闭时再次逐文件核对随附清单66项，无改变。来源身份为 U/zip-delivery-verification.json，SHA256=8f38a33041615cedfa4821fb94fed0eabdac678c1662c2705d036717df378e45。
- 当前 workflow=trial，revision=3，draft_range=1—3，allowed_actions=discuss/plan/draft，revise_range=null；首停文字限制明确禁止本进程写03、合章、record及2/3章。范围1—3不能解除当前首停。保持workflow不改为paused，避免为了交接推进revision使写前模板失效。
- 当前 state SHA256=371b6634ede8ca23aac6f7d951c8b9a04c447422ef7dc44820de6627304cb95f，与写前完全相同。next_unit=1，正式登记0章，人物和ledger条目0，活跃修订/事务0。
- 本轮所有题材、人物和借具关系均为代理在真实试验授权内作出的执行选择；没有冒充人类逐项指定。D_FINAL_EXECUTION 已选，D_FINAL_CANDIDATE 候选。confirmed/adopted 在此表示获授权代理本次采用，不是声称人类逐项拍板。
- 本次收到的任务原文按 UTF-8/LF 保存于 U/final-prompt.md 及 W/研究/最终测试原始prompt.md，SHA256=13b241bd13c94250186fa7bce194c13262acac110e581113759ebb6abd837a16。author_evidence 使用真实quote、local_source、source_sha256、locator及recorded_by，未伪造人类消息ID；未声称持有历史“按你的建议继续”消息本体。

## 写前输入、来源与片段

context：W/.writer/drafts/final-context-1.json，完整实读1—258行，stdout原始输出亦保留；record-template：W/.writer/drafts/final-record-1-before.json，expected_revision=3，summary尚空，不可直接登记。最终章预定路径为 W/正文/0001-灯下的箱子.md，当前不存在。

写前已冻结16份文件，原字节在 U/final-a-before/sources/，清单在 U/final-a-before/manifest.json。以下均相对W；本次结束逐一核对全部未变。模板和来源不刷新、不补新哈希：

| 文件 | SHA256 |
| --- | --- |
| writer.json | 09427e05445c28cd172683fcfcf032a7387644f906d5ed9ada6d74b368026b8d |
| .writer/state.json | 371b6634ede8ca23aac6f7d951c8b9a04c447422ef7dc44820de6627304cb95f |
| 大纲/单元/0001.json | 3aab96e70065b5fc4b0257d07ef4175703cfa0054c381437fdc426a5744d7276 |
| 设定/作品定位.md | bd796918caf9c124df5a0e3ad18afa51edeba2279d5bad427b761aaa6b900abc |
| 设定/文风.md | b7d91538573ec3036e03075f1482241fe14398fe7c54b89b6e7a8e5507a6c140 |
| 设定/权威规则.md | 4655e29181ada961469b16e494fcc32b30c09a2592dc26de3b923ad5ec4c7ff7 |
| 设定/人物与声音.md | 3049b229dcce94ac5acdebd9e5904ca70ecfef76602b83b64765f940e5ee0c69 |
| 大纲/全书大纲.md | 8d3ba2b2b896dce6e1c85dde5fdbc4e73e39a68e041808fc3e000a9f36a1826c |
| 大纲/分卷/V1.json | f213008a93b0c0cd4f5db9b25d165d74b02b5476a98ef466357e657809ad8500 |
| 研究/最终测试原始prompt.md | 13b241bd13c94250186fa7bce194c13262acac110e581113759ebb6abd837a16 |
| 研究/试验选择说明.md | 82815cc91417433b03705a454f6e118fec21b3d79dc903c50b06124cea780b2e |
| 大纲/分卷/V2.json | b0b835bcc6eb95d1bcec62cb1dc3c0833b932800001de75a1005b2c5127b95a2 |
| 大纲/单元/0002.json | b4099834a3ae98f2551aca6cc6c46501f9743f26c72e1477b34aa70871a05bc2 |
| 大纲/单元/0003.json | 5242b4be06b6ee7200e0ac0df84f8a1ab36b70537dbab5c1d5e8bb4925c7a470 |
| .writer/drafts/final-context-1.json | 7b0f7174605ccbf772f666495e1e42fba8d78880f426e3679b8fedf23587ffd0 |
| .writer/drafts/final-record-1-before.json | e162d0ae80f942ae5289504e5d38d0683cfba50287c02459d269144f7fce131d |

当前两段版本v1，原文件完整实读后修复并再次完整实读；02无重复标题：

| 文件（相对W） | SHA256 | 正文汉字 |
| --- | --- | ---: |
| 分段/0001/v1/01.md | d66ee53d6e943f95e6630ad7fbc07bb02febd54f3c3e5e43069b29ca0cd33c49 | 1126 |
| 分段/0001/v1/02.md | 8993d508140ce38223d434274ff60617cef368bfef48a2adfa1a67939015f303 | 1215 |

合计2341正文汉字（去标题后 Unicode Script=Han），不是完整5000字首章。U/final-a-parts-verified/保存当前副本和清单。03不存在；正文目录为空；未执行assemble、record-preview或record。

## 实际已经发生

许蓉从长椅雨衣底下发现旧铁箱，挪至值班窗前矮桌，写了失物登记本的起头，照料旅客并处理西门、地面收尾。门要在十点锁上，当前具体钟点未写，不擅补精确时间。她已给女儿发消息，女儿回复锅里留饭。

周岸到场修西门松动插销，自用帆布工具包放在门内干地；短螺丝刀、垫片和螺丝在门边，扁铁盒已被许蓉推向墙边。他口述先前将雨棚下旧箱移进候船室，但没有见到最初放箱的人。只说与梁家旧箱相似，不能算已确认所有权。他给梁伯拨过电话，未接通；目前未取得代收或退钱授权，修门也尚未写成完工。

沈禾带折叠小拉车、蓝捆带、帆布袋和父亲的借具条到场，自称沈成林女儿；解释取箱后还店里。她抬箱试车未装成，由许蓉协助放回矮桌；原箱没有完成换手。借具条载梁记修配、借具一箱、押金八十元。她已给点心铺发了补糖量的消息，但尚未完成送备货单这趟生活任务。她给父亲打过手机，未接通。现在抱袋坐于桌边，把手机锁屏收起，借具条背面写了父亲号码；座机刚由许蓉挪至她面前，尚未写出用座机拨号。

原箱仍在值班窗前矮桌，临管人为许蓉，两只搭扣合拢，未开箱未清点工具。沈禾的旧汗衫折在空车托板上，车已靠稳，捆带在车把上；借具条和号码在桌边。八十元仅纸条数额和待核关系，没有现场交钱、退款或结清。沈父与梁伯都未在场，两通电话没接，不能让他们知道现场后续。

唯一已写可见箱体细节原字：“箱盖左后角有一块月牙形的白漆。”位于01第7行，许蓉明确看见；不得逆改。未来完整章登记时拟用O_BOX_PAINT observation，并分别记录人物知情；当前正式ledger为空，不能说已完成immutable登记。P_TOOLBOX、T_RETURN、T_DEPOSIT也仍是规划ID，不是已登记事实。第三章跨卷兑现只在计划中，尚未发生。

## 自检、失败及证据

当前自检报告：W/审查/final-a-首停自检.md，SHA256=9e4af5d20031bdcc3eba4aa4164e7ee2d1b13a8087bd534b725667297647b225。这是同会话知情自检，只覆盖两个片段，未用review命令登记完整章。保留实际温暖动作及不同人物口气；修复消息已发/未发的时序冲突，补足第一段收尾动作和第二段借座机的用途。

三次失败均为辅助检查：final-a-00-preflight 将技能相对路径当包根路径（ENOENT，退出1），修为final-a-preflight-v2后重跑通过；final-a-18-parts-before-review 因01为1087字断言退出1；final-a-19-parts-after-review 因02为1093字断言退出1。修改后 final-a-20-parts-verified 完整列出1126/1215并退出0。失败没有当作产品异常退出码2或preview阻断退出1的实测。产品CLI本阶段调用均退出0；帮助按文本处理，没有按JSON解析帮助。

完整双流、退出码、输入原字节和前后state副本均在 U/final-commands/final-a-*/。辅助断言失败时已保存片段字节，分别在 U/final-a-parts-before-review/、U/final-a-parts-after-review/；最终稿另存verified目录，旧目录未覆盖。来源复核见 final-a-21-sources-check；当前状态、workflow、decision分别见 final-a-22/23/24日志。辅助脚本都在U且final-a-前缀，未执行旧a-run.mjs，未读取或复制初测正文、规划、片段或state。

## 未完与当前可行下一步

当前唯一下一步：正常结束本进程，等待根会话核验。不得在本进程继续03、合章、登记或第2/3章；不修改workflow或state以制造完成。

根会话核验并明确恢复后，同ID先读status、此交接、写前模板和实际01/02全文，逐一核对上述SHA及revision=3，再从02实际末尾的座机/待核通话续写第1章后段，不重写开场。新段应接沈禾尚未拨出座机、周岸仍修门、许蓉仍临管的处境。还需核实箱子来路、借还关系及实际联系，完成至少5000正文汉字的完整第1章；当前还差至少2659字，不能把两段当完整章登记。

若revision或来源改变，停止依赖步骤，保留旧输入，读清真实变更并报告；不得只刷新旧模板哈希。其后合章、全文实读、纲文回对、报告保存、preview退出0再record须依当前实际授权逐步执行。这些是恢复后的待办，本进程未执行。

两卷跨越、第2/3章、观察正式登记与跨卷兑现、普通报价/日程的追溯修订、独立区实读重登/尾段连读/prepare/commit、新鲜会话完整审查、暂停仅discuss、实际拒绝第4章及新目录草稿导出均未测试，不升级为已完成或正式验收。

只写了本轮scenario-final作品及final-*记录，外加本条明确要求的交接文件；产品、旧scenario/candidate/T封存保持只读。没有另派代理、Git暂存/提交/推送、外传或发布。
