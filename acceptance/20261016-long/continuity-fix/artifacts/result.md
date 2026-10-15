# 雨线档案连续性修复实跑结果

确认第9章问题仍存在，已在授权范围内修复。最终revision **31**，仅第9章正文两段局部动作改变；1–8完整索引及正文、10–12正文原字节均保留。本轮为实际冻结CLI实跑，非纸面方案。只写指定作品与根目录continuity-fix/；未用子代理，未改产品源码或替换运行工具，未手改state/journal，未提交、推送、上传或发布。

## 修前证据与修后动作

修前第9章第15行：许澄“自己端往接待间”，林岚“跟在旁边”；第17行陆衡重锁后“才跟过来”。第9章旧journal `5eebf451-ff06-479d-bf90-0b009e6834c7.json`第173、197行的P_KEY after却称林岚亲见重锁、许澄在场见重锁，确认正文动作与人物知识登记不一致。同栋楼不能证明亲眼看见。第12章后来的字段覆盖不纠正第9章历史错误；旧全稿报告漏报该问题，不能继续用其结论保证当前稿。

修后第15行许澄“端稳后等在门边”，林岚“站在她旁边”；第17行陆衡“当着两人的面”关门重锁、轻拉确认、拔出原钥匙、回原袋压紧收包，签字后“三人才一起回接待间”。钥匙仍陆衡、维护册仍许澄，仍九号柜，真实开锁匹配、归档与钥匙回收结论不变。10–12未确认其他需改正文的同类问题，均保留原字节重新登记。

修前实际文件副本在[before/](before/manifest.json)：正文1–12、state、全部当时的journal、审查报告与review记录共50份文件，逐项SHA-256留档；没有删除旧证据。修前第9章SHA-256：`661021804fc06e86da0461b9f3e6b32ab289d7c0d78fa180d2c9702594c35780`；修后：`0aa78a0296a761baffadf8a6c85ca663da1d8abd166a6af2a4c8c89564874eda`。

## 实际阅读与语义复核

先完整逐章实读当前1–12章，再回读修后第9章。重登后又按1→12完整顺序连读，阅读捕获[final-read-1-12.txt](final-read-1-12.txt)共296行，读取1–180及181–296，无遗漏页；其哈希`d994eb7ee03f403069dc25b7056787a86a2ad2969edd0eccbf597d34ec37490e`。完整捕获为revision28，后补证据至31时正文12份逐字节一致，最终报告据此绑定同一全稿。

读取writer.json、作品定位、文风、权威规则、角色卡、全书大纲及新context内的第9–12章纲和V3卷/剧情单元契约；第9章context遗漏T_MISSED时另行recall，已实读第3章相关全文。技能使用writer-project、long-form、writer-novel、writer-review，以及对应悬疑、自然语言、物理操作模块。每章record前的语义判断留在[ledger-review.md](ledger-review.md)，引文存在校验没有被当成推论成立。

人物知识：纸签第2章仅林岚亲见，第5章陆衡、许澄获口述，不因保管或同场自动亲见内签；第9章现在有两人在门边亲见重锁的动作；第12章许澄未去镇办，不自动知道收件改样结果，陈师傅未被自动告知。

物件：封套许→林(2)→陆(4)→许(5)，以后未拆未换手；钥匙陈→林(1)→陆(7)→许(12)，每次有递接和签单。册始终许澄保管；副页由许澄衬纸平托取出、盘内比对、连衬纸回原夹袋，再随册归九号柜原格重锁。原记录仍林岚自带收包；三人新核验单林→经办留夹，收件条经办→林，均有实际动作，未复制原物。

## 正式回退与重登修订号

| 操作 | 输入revision | 输出revision |
| --- | ---: | ---: |
| rewind --from 9 | 23 | 24 |
| record 9 | 24 | 25 |
| record 10 | 25 | 26 |
| record 11（首次） | 26 | 27 |
| record 12（首次） | 27 | 28 |
| 补证据：rewind --from 11 | 28 | 29 |
| record 11b | 29 | 30 |
| record 12b | 30 | 31 |

首次重建至28后，补充核验发现T_MISSED漏续记第11章“不入核验单”、第12章“仍不知道”两条证据。私人未知边界未变，但当前账本追踪不完整；因此再走正式rewind11补齐，而非改检查掩盖遗漏。失败输出与退出码1保留在[verification-r28-execution.json](verification-r28-execution.json)及[原失败核验](verification-r28-failed.json)。补齐后原严格检查通过，T_MISSED完整对象与修前最终账本一致。中间版本和导出保留在final-state-r28.json、export-r28/，旧r28报告不覆盖。

正式备份：`.writer/rewind-23-f6e88441-c2c7-4285-a30e-14a14450b17f.json`；`.writer/rewind-28-255b5862-b8a7-40d8-bebf-d6d3b06bdcc1.json`。9、10、11b、12b均重新取得context/template、来源哈希及revision；没有复用旧输入的revision/source_hashes。未变来源重新计算后值相同是正常结果。各输入和原始模板见record-09.json、record-10.json、record-11b.json、record-12b.json及cli/对应目录。

| 最终章 | 新journal | journal SHA-256 |
| --- | --- | --- |
| 9 | .writer/journal/5018d17d-469b-493a-8742-3868ff78baa2.json | 1ff98fbdd94b1c87de5757cd54637a85af4189328cb01eee2923609fe5d3ee28 |
| 10 | .writer/journal/f811e319-8edb-4a81-8332-d0098accbc4e.json | 2e8ed9d1a52887a66929e97913c685ae58ef6b2d574708b57ca7a0bf86c76a54 |
| 11 | .writer/journal/13dd0cee-2168-4350-80b1-95f80759e844.json | 078d40b0acc4b16b32e5bd510f3217d943eb5713ccd2b962f9d5c7d81d6f17ae |
| 12 | .writer/journal/9f26baf7-a355-4db3-bb87-8ac08426555f.json | 9e1655bd8e65f7b8cc61fd40be1dc913709a2e9a4dc845440ad5890fccf867e9 |

## 当前报告与验证

新报告：[1–12全稿修复后连读](../acceptance/20261016-long/works/雨线档案/审查/1-12连续性修复-20261016-r31.md)，SHA-256 `b4e47ee0f16dcec15b3eacb8ee2e2fb8a90e3c030902b5f589ec39ed18b15510`。review登记`.writer/reviews/3cc91080-712c-4372-8b7f-83d23950c7cb.json`覆盖1–12，涵盖全部滚动窗口1–3、1–6、4–9、7–12。旧报告原字节保留，旧终检SHA-256 `b74900f27a466844edadfed7d0b959a47afbf0e74ec73219e4a26426ad587b9e`。

最终冻结CLI status/check/doctor均ok、退出0；revision31，登记12章，next_unit13，无stale_units、changed_sources、未登记稿或unsafe_entries，check findings为空；doctor无错误或警告。当前review valid=3、stale=7、stale_with_current_coverage=7、stale_without_current_coverage=0、pending_windows=[]。历史失效不删除，由当前全稿覆盖。

[补充验证](verification.json)15项全部通过，包括全部当前ledger引文的真实哈希和行号、完整旧证据保留、冻结工具与产品源码/技能文件未变。1–8完整units索引（含summary/source_hashes/fingerprint/journal及其哈希）序列化前后SHA-256均为`bdce258a6c422f3bbedd01071c1ebc9e0e0698462f78ea7c8296bf9e3505d538`，逐字段一致；对应正文与journal也逐字节一致。

修前state SHA-256：`c8719405e3a9fd021e636aa711af498ca128382da599fa4f9ebee58cb45e0b44`；最终state：`fe3364e172de13fd1436fb6fa1e9b67baba64b6affd34748255e30c179dec9b0`。最终state只由正式CLI生成，副本为[final-state.json](final-state.json)。

## 章长与最终正文哈希

正文汉字计数排除首行标题，统计Unicode Script=Han，不计标点；所有12章在450–700内。

| 章 | 正文汉字 | 变动 | SHA-256 |
| --- | ---: | --- | --- |
| 1 | 523 | 原字节保留 | 2232c3542b7c153b7d39534dcec189361efe66d1881b35bad654d6275607448d |
| 2 | 509 | 原字节保留 | 6bd808fd5207d8b0ac5e61c638ab98fcc3b7d3e3f2b6d7cf16742630c2fb56aa |
| 3 | 534 | 原字节保留 | ffea4b0bcf78324fb8730a2b3a1d887a42d834592ce080ef60717f54365a6639 |
| 4 | 519 | 原字节保留 | 8d36322983b01b06d51df3c83024a60fd5e463625a0d45bb5966148d661acbac |
| 5 | 513 | 原字节保留 | be9c98f75ac5c7ebeb64c636aea108b52ec2e7f3c025669373f0696071e49683 |
| 6 | 526 | 原字节保留 | 913c0d95f2caf6031f98bb89ad31a7a41854d63ebdfb3d9aee249c16c62cb799 |
| 7 | 566 | 原字节保留 | 4298c06d3fd9f4475a6790c103fbac6a59f40186b3f122eade8a0a3ab4068a08 |
| 8 | 546 | 原字节保留 | 1bedc669d89cca42c2a33be8e1972cf8e663c4f4f6d98cebbce67c4a9d6164a2 |
| 9 | 516 | 两段局部修订 | 0aa78a0296a761baffadf8a6c85ca663da1d8abd166a6af2a4c8c89564874eda |
| 10 | 507 | 原字节保留 | b68f03a3537d7c490cfadfe77582d462aa7c89571acd0b879c4690b889bdf5fc |
| 11 | 521 | 原字节保留 | 50d76e8ac7646d5dfcff4392260d2e69ca7676c5d579e51547f658cbdf53fede |
| 12 | 573 | 原字节保留 | ee13358d4b599a9f779fbfab0a881676d7e54f6c70a7365c838324349f07ce37 |

## CLI原始证据与导出

冻结入口始终为作品内`.writer/tool/bin/ai-writer.mjs`（0.3.0），7份工具文件的修前/修后哈希一致。所有36次ai-writer CLI调用均保留在[cli-index.json](cli-index.json)：真实executable、argv数组、cwd、起止时间、退出码、stdout/stderr哈希；cli/各次目录内保存未截断stdout.txt、stderr.txt、execution.json。工具界面截断不影响磁盘原始日志。正式CLI全部退出0；补充核验脚本的首次失败单列保留，不混成CLI成功。

最终[导出稿](export/manuscript.md)与[清单](export/manifest.json)为revision31草稿，included_units恰好1–12，excluded_drafts=[]、warnings=[]；合稿SHA-256：`7bc455492c6c4195de1587d197aba7349b85139defe3ba2913fe9c9031530eae`。r28导出另存export-r28/作历史，最终交付目录为export/。完整证据清单见[evidence-manifest.json](evidence-manifest.json)，其自身校验值单列evidence-manifest.sha256，避免自引用。

## 剩余边界

知情模型自检与CLI机械一致性通过，不是独立盲读、真人验收或产品整体发布验收。故事内三人逐项比对只确认纸面材料对应，不是证明历史维护实际发生的独立证据；六月四日换件试机是副页记载。褪色落款仍不可辨，实际作业及个人责任未证；陈师傅私人原因、纸签作者未定，不编造答案。T_COPY完成的是找齐核清副页、归档和实际改待发样稿；不代表简报正式发布，周五复核只作约定。未运行产品源码测试，因为本轮没有源码变更且用户要求冻结工具实跑。
