# 《末班寄存柜》阶段A结果

实际完成**3章正文**，合计**1438汉字**；只做六章样稿的前半阶段。两卷各3章、共两个剧情单元已保存，4—6章只有骨架，未写第4章。不是六章完成或完整长篇验收。

| 章 | 正文汉字数 | 登记 |
| --- | ---: | --- |
| 1 五针白线 | 474 | revision 2 |
| 2 先替我拿稳 | 490 | revision 3 |
| 3 车棚里还有一辆 | 474 | revision 4 |

字数按去掉标题后的Unicode Script=Han统计，不含标点、空白；真实SHA-256与字符数在[final-file-audit.json](final-file-audit.json)。作品入口为[续写交接.md](../works/末班寄存柜/续写交接.md)，最终正文在其同级“正文”目录。

定位、文风、权威规则、角色卡、全书大纲、V1/A1与V2/A2、近期1—3章细纲已落盘。每章依次plan/context/record-template→实写→自检→真实summary/changes→record/check；模板、来源哈希、命令输出均留存。没有手改state，写后没有改已消费的设定、卷纲、全书大纲或用重取哈希绕过变化。

## 当前追踪

| 项目 | 实际状态 |
| --- | --- |
| P001木箱 | 第2章何素琴交郑来顺；ledger顶层previous_holder=何素琴，custody.holder=郑来顺；桌靠墙端，灰带未解、箱未开；第3章未交回 |
| P002登记簿、O002 | 何素琴保管，摊桌近身侧夹空纸；九天前六十一号车转下、存十六号柜、领物栏空，不证明箱主 |
| O001五针观察 | pending，due_unit=5；第一章原句与照片证据固定，第三针跨月牙焦痕；解释另建条目，不逆改观察 |
| T001箱主及未领原因 | pending，due_unit=6；等胡建民返站核对，照片未找到、箱主未联络 |
| F001人物知识 | 作者/小满知道主动辞工、等结工资、借车；读者/母亲仅知道借车和离店，工钱等仍未知；郑未听车棚谈话 |
| T002返家与安排 | partial，due_unit=6；交通及离店部分披露，母女没有全面和解，未来职业未结案 |

## 实际工具与审查

根工具只用于初始化：

```text
node bin/ai-writer.mjs init --path acceptance/20261015-long/works/末班寄存柜 --kind novel --title 末班寄存柜
```

随后均在作品目录使用 `node .writer/tool/bin/ai-writer.mjs`；阶段runner仅转发并保存原始输出，未修改随附工具。实际执行了：

```text
--help
status --project .
long-enable --project . --expected-revision 0
volume --project . --input .writer/volume-V1.json   （V2同式）
outline --project . --unit 1
plan --project . --input .writer/plan-0001.json     （0002、0003同式）
context --project . --unit 1                       （2、3同式）
record-template --project . --unit 1 --draft 正文/0001-五针白线.md
record --project . --input .writer/record-0001.json （2、3同式，模板正文路径依章）
check --project .
recall --project . --query O001
review --project . --input .writer/review-0001-0003.json
doctor
```

完整参数、次序、退出码、原stdout/stderr见[commands.jsonl](commands.jsonl)与evidence/。写前原模板保存在对应record-template输出，完成输入保存在作品.writer/，未覆盖失败现场。

已完整连读最终1—3章并保存[model-self-review报告](../works/末班寄存柜/审查/0001-0003连读-20261015.md)，绑定真实正文哈希。末次check：units=3、revision=4、findings=[]，rolling_review.valid=1、stale=0、pending_windows=[]；末次status：next_unit=4、stale_units=[]、changed_sources=[]。check的literary_quality仍为unreviewed，review登记只证明覆盖，不是质量或作者验收。doctor：Node v24.15.0、skills=7、errors=[]。

七项技能均已读并留下具体使用/分流记录；主流程实际使用project/novel/review，research用于选题，history/essay/screenplay用于事实、声音及体裁边界裁定，未另写这些文体。见[技能使用记录](../works/末班寄存柜/参考拆解/原创设计与技能使用.md)，不冒称七文体全部实写。

## 失败、范围与未覆盖

第二章record首次将previous_holder放在custody内部，被拒；核实随附实现后移至条目顶层，用同一模板及源哈希重试成功。原失败输入和输出完整保留。另有FastCtx编排名称、参考路径、补丁格式三项本次操作输入错误，均在写作CLI之外修正。没有已确认产品缺陷，详见[issues.md](issues.md)。

本轮所有写入限于acceptance/20261015-long，没有提交、推送、发布、付费调用或代理。根目录存在同期变化，未回退或覆盖；作品随附33个工具/技能文件相对冻结清单未变，版本与来源哈希保存在copied-provenance.json。工具许可沿用根LICENSE.md的本地内部候选状态，没有改写许可。

未覆盖新Codex会话真正恢复并续写、第二卷正文、第五章实际到期回查、第六章认领与签领、完整长篇规模召回/性能、导入/rewind/导出、独立盲读、市场及出版验证。未修改产品代码，未运行npm产品回归测试；本阶段证据是最终随附版本的实际小说流程、check与doctor。到此停止。
