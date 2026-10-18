# G轮最终新建书回查E

结论：本次真实CLI规划与文件恢复用例通过。作品已登记0章，正文目录为空；完整规划已保存，当前只允许discuss/plan，下一会话仍须实际写作授权。结论仅覆盖本次E。

## 版本与入口

最终来源是source-build-g4.json，0.7.4，content ID=828109ec3ed7cd40564059ab42cc0fba82d72aa88ead15d880a6fda79406a71f，runtime ID=2caacf37df3842559663ef2ea380baaa33b85cd6bf29637e5ae45fe8e4cd1628。主项目与随附包的61项文件逐字节哈希/长度均匹配，随附doctor ok=true、help指向.writer/tool/docs。g3→g4仅docs/review-and-registration.md和docs/workflow.md改变；quickstart/user-guide/long-form的任务分离说明及运行模块不变。resources-check-final.json保存逐文件证据。

全部37次产品调用经原capture.mjs，标签以e-开头且唯一，每次启动新Node CLI进程；没有直接import业务API或手改state。最后三项status/doctor/help在作品目录使用.writer/tool入口完成。capture的runtime_guard_id只表示进程前后磁盘观测稳定，算法与正式runtime_id不同，不据此宣称已加载模块证明。

## 实际规划与恢复

读取真实初始化模板后才替换：定位标题为“纸桥书店”、文风标题为“作者声音”、规则标题为“权威规则”，初始占位字节在read-versions/initialized。现在定位、人物、文风与规则具有具体内容，全书十二章粗骨架完整；卷契约连续覆盖1–4、5–8、9–12，近期单元0001–0003为真实细纲，第4–12章仅粗骨架。四层planning=draft，代理普通细节D_E_AGENT_PROPOSAL=candidate、adopted_items为空；confirmed只记录用户真实指定的题名和十二章三卷规格。没有正文事实入账。

新进程e-status-final、e-workflow-final、e-discussion-final读取revision=4；status显示next_unit=1、plan_exists=true、registered_count=0、unregistered=[]。discussion成功恢复任务与候选，不自动读取三份设定全文，因此另用FastCtx完整实读最终设定与研究记录，不能将discussion回包当作已整读设定。

## 临时任务与长期设定

临时“只讨论/规划、不写正文”、规划齐备及取证交接后的停止点、下一会话必须获得实际新写作授权，均在正式workflow、.writer/state.json的governance及事件.writer/objects/a5dacb13-4593-4b01-a157-99172ff104ec.json保存；本地可读记录为研究/作者任务原话.md、研究/本轮任务与交接.md及native-e/handoff.md/json。初始和最终workflow的冻结来源与原话SHA都保留。

三份长期设定分别保存读者/核心冲突/视角/关系终局、叙述声音/对白/节奏、世界/物件/知情/经营因果约束，不含本轮停止点和下一会话权限。完整语义实读结论辅以scope-check.json中的词项检查；机械词项扫描不代替语义判断。

| 实际作品内路径 | 完整读取行与字节范围 | 字节数 | SHA256 |
| --- | --- | --- | --- |
| 设定/作品定位.md | 1–24；0–1747（末端不含） | 1747 | 2c3a522c53118bcc35ff10ff6cdf58500e4127785852eea8238508987a4258f9 |
| 设定/文风.md | 1–18；0–1288（末端不含） | 1288 | 96440f32c78817f3498c3fbe67e282eec747bbe90ff8fcb38f3be3527e8b2948 |
| 设定/权威规则.md | 1–20；0–1389（末端不含） | 1389 | dc9ff8cfb72e280f06bb86e1d2c7c3daee148606e10483f3e01a40e1e32102b6 |
| 研究/作者任务原话.md | 1–18；0–2700（末端不含） | 2700 | 0d8b9d1e2974620a4d3c6cfa424f9d616ef7b21fbae3050d359db71d5f77ecb0 |
| 研究/本轮任务与交接.md | 1–26；0–2255（末端不含） | 2255 | 13cc9362147290e5067b5b1d7fb58388b767ac5c6fcbf303b90a3c3fecc288a3 |
| .writer/objects/a5dacb13-4593-4b01-a157-99172ff104ec.json | 1–78；0–2550（末端不含） | 2550 | f4d97014de9715b053acbd58dd66014fca3d29d32e16c8173af0c8c65b4d26cf |

表内字节区间均从0起、末端不含；行号包含终止换行所对应空行。原字节在read-versions/final按实际相对路径保存，绝对路径、版本、范围及其他规划材料见readings.json。

## 有章纲不等于写作授权

第1章细纲已存在后，e-draft-context-1-rejected与e-record-template-1-rejected均真实返回退出码2、ACTION_OUT_OF_SCOPE；拒绝原因是未授权draft，而不是PLAN_REQUIRED或正文缺失。--out文件均未创建，正文目录无任何条目，没有生成测试正文。

两次调用各自before-state.json与after-state.json逐字节相等，且前后SHA均为cffe2f5f3128792f104fc14b153b35667e55b445e6985068db0862aab9c4a437。调用后新进程status仍为revision=4、已登记0章、未登记0份，字符状态和事实账本均为空。

## 保护边界与结果范围

保护基线记录了新作品初始化后、规划编辑前的2263个既存G轮文件，排除仅新native-e、新作品与commands/e-*；最终其中2262个文件SHA一致；final-audit.mjs与基线不同（最初严格检查的失败保存在checks-failure.json，前后SHA及当前字节另存audit-drift-note.json）。本执行未向该旧文件发出写操作，保留差异且不归因，不能宣称整个G目录无变化。原六章样稿A/B及既有消费来源在其余逐文件核对范围内，未回填、未改哈希。主项目g4清单内源码/技能/资源也逐项保持原字节；不宣称这份基线覆盖初始化前未快照的所有磁盘文件。没有提交、推送、联网、发布或正文导出。

本次16项证据检查通过，详见results.json；机械check仅核空正文规划状态的一致性。没有正文文学审查、真人新手研究、盲读、市场或发布验收，也没有预填其他轮次结论。未修改工具源码/技能/引擎，因此未运行npm test/doctor/engine总套件；本用例的真实随附doctor与check已保存。

## 交接五项

1. 作品完整路径：D:/work/other/ai-writer/acceptance/20261019-new-user-g/作品/纸桥书店 规划；正文目录为其下正文/，当前为空。
2. 已登记范围：0章；完成十二章三卷规划与前三章细纲，均为代理草案。
3. 实际读审范围：当前三份手册与技能、初始化真实模板、最终三份设定/人物/全书纲/三卷/前三章纲及任务记录；只做文件、范围和权限核查，无正文可审。
4. 未登记稿或阻断：0份未登记稿；draft context与record-template按未授权正文预期拒绝。
5. 当前任务与下一步：仅讨论/规划，取证和交接完成即停止；正文或试写须用户实际新授权并正式更新workflow。
