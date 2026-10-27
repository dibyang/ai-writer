# X轮 A 首停交接

本次A首次执行在此主动停止，正常返回。当前作品P：D:/work/other/ai-writer/acceptance/20261021-long-flow-090-x/scenario/东岸末班船-再扩展验证。只写X；没有调用代理、修改根lib/bin/tests/docs、改其他acceptance/作品/W、Git提交推送、发布上传、付费或修改全局配置。根的独立首停核验尚待执行，本交接不冒充根验收。

## 权威、入口与真实停点

当前revision **117**，登记1—25，next_unit26。state SHA256 **37595726e6e37f6ac1b224cee3e355d90c85827a9879cce69a61b252ba054ee8**。25在r116登记，r117仅保存26有限首停任务；不是用next25覆盖旧paused任务。旧暂停事件完整保留，新授权来源是研究/作者请求-X-原文.md（原X/author-request第3行，SHA b1dc4eeeff37d1c97c97955931cf3ec2f98fe794730f4cd2265b84ecdb10d785）及研究/X-A有限执行指令-原文.md，没有消息ID不造。

工具generation3、0.9.0，content 553de8f8a42c7bc7ff5f04f78703ed423d17dd69c21ff640ebd8c5c11c570ec2，runtime 7fde4277424d98312d67d9db142301ee02d4805c6f5ae095b20b3d1544e0042f。实际source_commit d621093e83f844875ee350decbc9d1eeba923b1a、dirty=true，与environment中root source_head不同属来源元数据，不曾tool update。所有产品命令均由node X/x-writer.mjs a-唯一标签调用P/.writer/tool/bin/ai-writer.mjs，原argv/输入/双流/退出码/前后state在X/cli-logs各标签下。

工作流stage保留drafting，allowed_actions=discuss/plan/draft，draft_range25—27，revise_range=null；这是同ID续程的有限授权，当前执行已经按首停条件暂停。26尚未完成，不能把两段当一章或跳27。续完26、27后完整连读22—27复盘；本轮不继续28，不写37，28—36仅骨架。若要做旧章修改测试，另走正式revision授权，不先动主稿旧24。

1—24按state顺序、原生FastCtx每次limit100完整读至Complete，a-entry-current before/after完全相同。恢复报告：P/审查/X-A当前1-24完整恢复.md。P/研究/X-A恢复基线核对.json与X边界文件保存每章路径/SHA。A首停保护核验.json实核3919个原文件，仅.writer/state.json发生产品正式推进；全部24正文、完整units、V1—V9及原O_BOX_PAINT的type/statement/author_truth相同。

## 第25章：已登记当前稿

路径 **正文/0025-衣袖落下来-v2.md**，SHA **5bda90e0b1c2846ebe734aba5717ad6dff911a0ba8441b417177bae4c530ca69**，正文汉字 **8622**，30193字节。五个实际片段，六个场面；有序assemble仅用空白separator，实际合章字节与列入片段吻合。最初v1完整回读后发现冷藏目的/双手占用不清及灯朝向，保留v1及纠正报告，另存01/05 v2并重新assemble、最终原生FastCtx完整读1—290行。

当前五片段（旧v1保留为过程，不拼回当前稿）：

|路径|SHA256|正文汉字|
|---|---|---:|
|分段/0025-A/01-晨衣-v2.md|c28fb03c69fa5fb7fdc715be84059f69b7569943f693b146ccd2b5bf53493575|1531|
|分段/0025-A/02-来货-v1.md|18c732a11cea40a4bcec1ea2dcd0de031558f7f30f4a18a413911ec899ea9dcf|1639|
|分段/0025-A/03-茶约-v1.md|61683f5477b206fd55cee707ffb325e5b72ced0da42bc383e2fc5680b38da8c4|1620|
|分段/0025-A/04-看书-v1.md|4cdd0520019c5beb2c96c1dd46e273dcf63ac674d70bf4e3c9af864783b2f697|1614|
|分段/0025-A/05-夜洗-v2.md|a5861dc8c9d25f60317429984eb9b95fe2754f6af8ca5a80049d3d84f7bb2f8d|2218|

最终自检报告 **审查/X-A-25最终合章自检-v2.md**，SHA **3e6a4899f8f40ce00981b12407475fcc11b049c9433600efd9ec42d08c77977b**；draft_review.draft_sha256=5bda90e0b1c2846ebe734aba5717ad6dff911a0ba8441b417177bae4c530ca69；冻结ref **.writer/objects/3e6a4899f8f40ce00981b12407475fcc11b049c9433600efd9ec42d08c77977b.draft-review**。报告有完整覆盖、有效纲文回对、四项语言测试、人物知情与物件连续性、未覆盖项。知情模型自检，不是独立盲读、真人朗读、作者定稿或市场/正式文学验收。

写前模板.writer/drafts/a-record-25-before-v1.json（r115）保留原样；最终输入.writer/a-inputs/record-25-final-v2.json，SHA b7fc7bf08f7d676ce5c68915b18a0f3897b4cd7ec60757f230aa425b941a3351。a-preview-25-final退出0后，同一SHA输入用于a-record-25-final，退出0/r116。没有用新模板替换旧哈希或拿v1报告认证v2。

25实际结果：母工装早买菜/下午值守穿用，靠桌略顶、走路不觉，夜亲洗湿晾四边合，尚未见干态；女纸条夹记事簿、自己的裤未拆放房椅。沈回糕店实际接提早来货，原备货信封归旧账格，午饭被客打断后吃完。周廖午面相约下周四14—16到家喝茶，周记本预留而未赴。姑娘买糕付款，向沈本人述第二课补袖/误针已拆，沈回述昨日父带袋小补仍合，互存号姓名但正文未展示姓名，暂约下下周日14点书店，各问班尚未准。晚母只听女、父只听沈有限述；沈空饭盒归柜、画册从门边椅归床头，白纸仍在，父袋取空挂椅/脚仍垫。

三项新稳定ledger ID均已绑定25实际引文：T_X_COAT_DAILY partial，first/latest25，due33/V12；T_X_TEA_AFTER_WORK pending，first/latest25，due32/V12；T_X_BOOK_COMPANY pending，first/latest25，due35/V13。后两项跨过新卷再兑现；远期未写不能resolved。计划链及旧证据回查在大纲/扩大骨架-X.md与研究/X-A新阶段承诺-25登记前.json。13卷的既有V1—V9未动，新增V10—V13四次实际volume已登记；近期25/26产品plan及27近程骨架已保存，远期仅粗排。

## 第26章：只有两段中间稿，未合章未登记

写前r117实际plan/context/outline/三项新承诺recall均已调用；相关旧正文14/17/23等在入口完整pass读过，25最终稿刚完整复读。context字符量31303，未超40000，无删限制或静默裁切。context保存.writer/drafts/a-context-26-before-v1.json；新模板.writer/drafts/a-record-26-before-v1.json（expected_revision117，摘要与changes仍空）。全部12个写前source_hashes目前匹配，见研究/X-A-26写前来源核对.json及A首停保护核验.json。续程先核来源；若改变，实读评估后另取新模板，不能只刷新SHA。

当前两段共 **3138正文汉字**（1568+1570），已各自原生FastCtx完整读至Complete；没有正文/0026完整稿，没有26的assemble/record-preview/record，也没有26事件进入state或ledger。

|当前可续段路径|SHA256|正文汉字|
|---|---|---:|
|分段/0026-A/01-铺门里的本子-v2.md|00020cb4cd69fc4e88365e9c3c402932fec933adec4f5886b323e1fff0dd55af|1568|
|分段/0026-A/02-家里的坐处-v2.md|174ca0f8e92923eb66175aa16cb76665ac835c503a663ef8bfe189b02a981e19|1570|

原始段v1也全部保留：

|原段路径|SHA256|正文汉字|
|---|---|---:|
|分段/0026-A/01-铺门里的本子-v1.md|82a2d458b5c11abb7fc24b10247c4437dd7e416beab3ba4079d7d3904b995d2d|1560|
|分段/0026-A/02-家里的坐处-v1.md|ec3b6a91e719bef00d6a474b68fab2a2d1a6745cfd5141e1c2e72c6691f78fdc|1576|

局部纠正记录：审查/X-A-26中间稿局部纠正记录.md。v2补清前后罩动作、未来六天时间指代、热气位置、葱筐后用、接剪刀动作/围裙用语；是局部自检，不是完整章报告或文学通过。后续按v2继续，原v1不删除。

两段实际已写：第十九日星期五，周从架下取久搁的小风扇，向物主承认拖延，拆前后罩/清灰/取下磨坏外线，原件旧纸上、小螺丝浅盒、未通电；约午间回电，配件价未回、尚未报价修好/付款。新来女人希望下周四午后看母家刮地门，周明确私人喝茶半日不接，双方改约下周六8:30先看、10点她们仍出门，不先卸门；她实际发地址及新门底照片，未到场。午间廖少面收摊、先吃、凳侧收里墙，牌翻/卷门锁/钥匙裤袋，围裙带家；家里挪花盆/两椅小桌/软管，邻居借剪刀当场剪枯枝后归还，只听“下周四周岸两点喝茶”，没有拿她的搪瓷托碟。廖实际洗晾围裙，开始找桌底旧壶。

**精确停点**：廖在家小桌旁，竹筛已拖出到脚边，几只旧夹子已放桌上，小花盆挪椅旁，两手刚够进旧壶两侧；尚未将壶取出、未确认壶盖在哪/能否用。下一未完动作先接取壶、找盖/清洗或暂放的选择，不重开他从摊回家的开场；之后可自然转去沈午后问班及姑娘自己的询班，母衣晾后等尚未写处。周午间回电仍欠，不能默认已经修好或有配件数。

当前26写作层物件/知情：周铺风扇敞着罩里侧、旧线在旧纸、小螺丝浅盒，电话/回电纸眼前，茶约本柜上，包已挂；来问门女人只知周下周四去朋友家，不知廖姓名/两点茶约全貌。廖家两把椅围小桌，旧翘板仍砖上垫盆，软管门后、围裙门边晾，剪刀已归廖；邻居带盆/剪枝离开，无人交托碟。面摊凳在里墙/靠背椅在摊，不把它搬到家中；26前两段之外人物仍以25state为权威。尤其沈、女还没各问班，工装干态未写，父仍伤脚，原画册没有再借。

26本次停在中途，后续完整章目标至少8000汉字，27至少10000；本次不提前给未写的后半章填summary/changes。真正续完、合章、全文回读、四项测试与纲文回对后，再另存报告/最终登记输入并preview成功才record。

## 错误、检查与未覆盖

唯一非0产品调用a-context-25，实际退出2：--out误指.writer/a-inputs，产品要求.writer/drafts下新JSON。失败前后state同为718044dc6fc3da6424119e682df93abb876c521070ff49f64189d6e7d272f9fe。停止依赖后读context/record-template实际help，另存研究/X-A-context-25纠正输入.json，a-context-25-v2成功。所有失败输入/双流/子码保留；不是产品源码问题，本轮未改产品。另一次只读定位.writer/tool/skills目录不存在，已依实际glob纠正为.writer/tool/.agents/skills；没有将读取错误当成功。

最后四条产品调用：a-final-status、a-final-check、a-final-revisions、a-final-doctor，全部exit0且前后state不变。status stale_units/changed_sources/impact_pending均空；revision list只有历史committed/completed，无活跃修订或未完事务；doctor errors/warnings均空，身份未漂移。check为mechanical-only、literary_quality=unreviewed。10个UNREGISTERED_DRAFT warning中9个是入口已有旧候选，1个是保留的25-v1，均不删除、不合回；26分段不在正文清单，因此本交接显式列出。

rolling_review：valid12，stale18，18全部已有current coverage，stale_without_current_coverage0，pending_windows=[]。25—27尚未三章齐，工具尚未触发该新窗口；不能据空列表声称已读完25—27，更没有伪造该窗口报告。27完成后仍须实际读22—27。

终检摘要X/A首停最终检查摘要.json；保护核验X/A首停保护核验.json。25报告只支持其绑定字节；26只有局部复读。全天穿洗/多日袋耐久/长凳长期承重、真人读者及根独立验收都未证明。没有封存、导出、提交推送；留待根独立核首停并发同ID续程。

## 当前已登记1—25路径、SHA及正文汉字

旧1—24为保护基线，字数只作当前字节清单，不追溯套用新章8000门槛。正文汉字均去Markdown章标题再计Han。

|章|当前路径|SHA256|正文汉字|
|---:|---|---|---:|
|1|正文/0001-灯下的箱子-v2.md|6b7dda66e606b753b75cbebeab8af536b797b0060a9c14048932da58a6709893|5214|
|2|正文/0002-多跑的一趟-v2.md|78ff1a743694ce4ca1fb0dcca7a7d94dab5f36b7305d2ba078522f408653d886|3525|
|3|正文/0003-把手朝外-final-b.md|3647db1243db710d9942db1df904aa301f349fc7ae050ce25803c2f18f20a221|5226|
|4|正文/0004-少蒸的两笼-v1.md|9ccb0b8e5eb4e5631555fa280b706f9a53639500773ebbec611c0efd0db169f4|5820|
|5|正文/0005-门板靠墙-v1.md|2386bbb6cb98237842871a1274afa5b33df113b1373dae177bcc1ce61a4832bb|3845|
|6|正文/0006-走一遍再画-v2.md|7d94bf2d87f925e43001c88e7ce7b7d60968ad93a9cc54e5322bbbdf7310fb91|5124|
|7|正文/0007-先留出两包-v1.md|44c39f40f7a22b3ef500e4948066303e27407b4f0d426daeedfdbb88781d9a04|3661|
|8|正文/0008-半个钟头-v2.md|5c1f40674da30b617367171ec44a72a6972ae9e87add5db3f26b761df8b0cfc5|3646|
|9|正文/0009-留给明天的活-v2.md|77d7210e10d8f2c662cacff742755d096ea6d890a762af56231491f881dde48e|5438|
|10|正文/0010-月底的三十五块-v2.md|773cf058337c048165bbb6afab2c00edf860068ebdef986902b94110d6cac52d|5077|
|11|正文/0011-盒子放进去-v2.md|2410d684c6a0d2de7f0cdd0e25b20814af22dca213dfb66f2e804cd111bac075|3607|
|12|正文/0012-沿着坡走-v2.md|973c82b824598d71120d881c9c5b8dc87c8ded132d82643bffd89c92c579fc42|5124|
|13|正文/0013-桌边留一半-v1.md|64ed099bd718907e34724d7fff80a3d59583cffd843848311000ac0d97abb20a|6036|
|14|正文/0014-坐下再量-v1.md|85bc3fd6b6b6476011ed17bc0cc505800100b570fbcc6430ec59498d6c2664da|6019|
|15|正文/0015-一幅一幅洗-v1.md|e30513d5c0914e5d0de0c477c26ffae47e5a9f06d8c645bc22d54503d7f66d83|8011|
|16|正文/0016-早饭留在锅里-v1.md|1900edd2c9ef5cd0ea1c7de4728182352da57d78894cbc2fdbc9effbe2ac6cd2|6052|
|17|正文/0017-板头留一截-v1.md|f57febae9fc7593bf007905c026a259fb3084d4bae9bbb1d35cbde96b88c0189|6056|
|18|正文/0018-灯下第一排-v1.md|7d836f6084742e30e29ed24fa3f4d21f97f634e242fa2f197e4e10da1985af54|9327|
|19|正文/0019-提前的两个钟头-v1.md|a3334a28a0bc613daaae24de8f75ca7d6b4ea35dd2e303615b2acaa2bcf4a2d5|6112|
|20|正文/0020-少做的一笼-v1.md|4756e72fe81cfb4b05edabffcb12fae2d92e3036dccee36af1313f49f7bc6b87|6156|
|21|正文/0021-雨落在门檐外-v2.md|c7de5d065543543b3a28810a8a14670beb2a1946c377ec28303ab0fba0988887|8211|
|22|正文/0022-书里那张白纸-v1.md|dae0d3c1274197e71244b0c9ee300b1556a8edab9ed32075d7143a9f2ab6ed06|6112|
|23|正文/0023-收摊以前-v1.md|361d2a16759d18e2cde01386e0ab7e0b099a588df98aff7b7b0fa591ac1df84e|6192|
|24|正文/0024-门给你留着-v1.md|c35b5fe13d4d6ee08414896906dadb0bc03ed6743ff6f027e24abd0e3a80d2ca|8030|
|25|正文/0025-衣袖落下来-v2.md|5bda90e0b1c2846ebe734aba5717ad6dff911a0ba8441b417177bae4c530ca69|8622|
