# 《末班寄存柜》阶段B结果（2026-10-15）

本次实际完成第4—6章、跨卷线索回查、第1—6章完整连读与model-self-review登记、六章草稿导出。这只构成六章样稿与文件恢复验证，不构成完整长篇、真人、市场或出版验收。未使用上次进程exit 0作为完成依据。

## 执行环境与恢复依据

- 所有shell调用的cwd均为`D:\work\other\ai-writer`；本次`node --version`实测为v24.15.0，作品CLI亦实际成功执行。没有出现用户所述Windows sandbox/helper初始化失败，没有重装、删锁、删状态、关闭sandbox或修改全局配置。
- 所有作品命令显式传入目标`D:/work/other/ai-writer/acceptance/20261015-long/works/末班寄存柜`，使用本作品`.writer/tool/bin/ai-writer.mjs`。doctor接口不接收project参数，最终通过作品CLI绝对路径无参数调用，检查的是随附工具及七项技能。
- 实读任务书、作品AGENTS.md、writer.json、随附writer-project/writer-novel/writer-review及长篇流程；实读悬疑连续性、通用审稿、自然语言、物理操作及人物情绪一致性模块。未改随附工具或技能，也未调用根目录主工具、内置引擎、外部插件、付费服务或代理。
- 实读定位、文风、权威规则、角色卡、全书大纲、V1/V2契约、续写交接、阶段A连读报告、原创设计与技能使用记录，以及前三章原文。旧纲中“本会话只写1—3章”是旧阶段边界，本次明确授权4—6章优先；没有修改已消费的旧来源。
- 初始status：schema=2、revision=4、next_unit=4，stale_units和changed_sources均为空；初始check为3章、无findings、有效连读1份、过期0、无待审窗口。未读取state全量作为正文提示，未手改追踪。

## 实际CLI调用与顺序

以下`CLI`代表本作品CLI绝对路径，`P`代表上文作品绝对路径；每项均在本次实际执行，不是拟议命令。正常步骤只推进一章，未并行写章。

| 阶段 | 实际调用与结果 |
| --- | --- |
| 启动 | `node --version`成功；`node CLI status --project P`得下一章4；doctor按接口修正后成功；`check --project P`成功。 |
| 恢复 | `outline --project P --unit 4`读取V2/A2；`recall --project P --query 白线`召回O001等真实ID，随后实读证据第一章；第4章章纲含O001/P001/T001。 |
| 第4章 | `plan --project P --input P/.writer/plan-0004.json`→`context --project P --unit 4`→`record-template --project P --unit 4 --draft 正文/0004-钥匙还在他手里.md`，写前保存record-0004.json；正文→完整读回及自检→真实summary/changes合入原模板→`record`成功revision=5→`check`无发现。 |
| 第5章 | `recall --project P --query O001`，再完整重读第一章；`outline --unit 5`、`plan`、`context`、写前`record-template`，章纲显式O001，context为explicit+due；正文→读回自检→真实summary/changes→`record`成功revision=6→`check`无发现。 |
| 第6章 | `outline --unit 6`、`plan`、`context`、写前`record-template`，context的O001/T001/T002到期项均实际读取；正文→读回自检→真实summary/changes→`record`成功revision=7→`check`无findings，但出现1—6待连读窗口。完整context保存为context-0006.json，展示时仅省略已实读且未变化的settings及刚读过的前章文本。 |
| 连读 | 按1→6完整读取最终六章，保存`审查/0001-0006连读-20261015-stage-b.md`；计算真实SHA-256生成review-0001-0006-stage-b.json；`review --project P --input ...`成功，覆盖[1,6]。 |
| 最终核验 | `check`显示有效报告2、过期0、pending_windows=[]；再次status及分别recall O001/T001/T002/P001；实际`export --project P --out 同级末班寄存柜-v1`成功；导出后check仍无发现。 |

所有record均保留写前模板的expected_revision和source_hashes，仅填写summary/changes；没有写后重取来源哈希以绕过保护。记录由随附工具维护state/journal，无手改。没有发现需要修订的已登记正文，故未实施无收益rewind；该路径不计本次实测。

## 正文与实读覆盖

| 章 | 标题 | 正文汉字 | 连读覆盖 |
| --- | --- | ---: | --- |
| 1 | 五针白线 | 474 | 全部1—38行 |
| 2 | 先替我拿稳 | 490 | 全部1—40行 |
| 3 | 车棚里还有一辆 | 474 | 全部1—38行 |
| 4 | 钥匙还在他手里 | 467 | 全部1—32行 |
| 5 | 照片边上的人 | 459 | 全部1—28行 |
| 6 | 再盛半碗 | 502 | 全部1—38行 |

计数为去标题后Unicode Script=Han，不含标点空白；新写1428、全六章2866汉字，新增各章在450—650范围内。写后逐章实读，最终再按顺序连读全部214行；导出后又完整读回224行合订稿。章级自检分别保存在审查/0004、0005、0006-写后自检.md。文学结论是知情模型自检未确认需修的高置信硬问题，没有冒充真人阅读或正式定稿。

## 跨卷承接和信息/物证边界

第三章母女提的是车棚布袋，第四章将其放椅下；木箱没有随母女出屋。第三章等司机→第四章返站交钥匙及口述遗留流程；第二章找旧照→第五章找到原片；第五章只告知有箱并要求先描述→第六章独立描述与许可核对。V1/A1到V2/A2的承接有正文动作，不把未来契约当已发生。

O001在第4章前已召回且读证据，第5章又实际召回并重读第一章；statement/author_truth保持原五针、第三针跨月牙焦痕。第五章另建F003解释年代并关联O001，旧照不承担唯一认主。O001仍pending、due=5，缺口为焦痕成因及后续流转，不能只因到期改resolved。

P001第2章何→郑的已发生交接沿用原文；第4章郑→何使用顶层previous_holder=郑来顺，与完整custody及本章准确引文登记：“何素琴把双手伸到箱底，托稳了才说：‘好了。’郑来顺松手，她把整箱放回桌靠墙端，灰带没解，箱扣也没碰。”（登记JSON保留正文原中文双引号。）第5章未换手；第6章先听独立描述、得到“解吧，瞧完替我盖上”许可，再开扣检查红格小被、蓝枕套与翘角，随后合盖重拴；最终何保管、桌靠墙端、整箱未交出，内物未取离。P002一直何保管，夹纸记候选和待签领，原簿领物栏仍空。

T001为partial、due=6：联系与内容相合有阶段结果，周口述在换车处找过，但本人到站证件核验、签名及实际交付未发生。约上午九点到旧站侧门，下一续写先回查第6章，不把电话联系写成已还物。

F001作者真相未变：主动辞工、等结工资、借车返家。母亲前3章仅知借车和离店，4—5章未越权知道工钱；第6章由到账记录及“我自己辞的。等钱结清才走”对白更新读者和母亲所知。胡此时已回家，郑在门边未被默认听清。T002为partial、due=6：暂住几天、自己找工形成共识，职业、长期关系及借车归还待后续，下一续写回查3、6章。

## 导出与真实核验

导出到全新同级目录`D:/work/other/ai-writer/acceptance/20261015-long/works/末班寄存柜-v1`，未覆盖旧目录。含manuscript.md、manifest.json，manifest.status=draft-export、quality_review=required、revision=7、units=6。

合订稿SHA-256：`2d37d578411ee2aa57ae2c405e1f2db5bce6f64ea123fb41905da14f78d6e09a`。六章来源哈希、按序合并内容及manifest的合订哈希均实测相符；已消费外部来源文件未漂移（历史state哈希仅为写前版本，不与最终state机械比较）。新报告文件及六章绑定哈希均有效。最终status为next_unit=7、revision=7，无stale_units或changed_sources；最终check有效连读2份、过期0、待审窗口空，scope=mechanical-only，literary_quality仍为unreviewed。

证据文件：

- `.writer/stage-b-baseline.json`：本次工具、技能、前三章36文件基线。
- `.writer/stage-b-audit.json`：六章实际汉字、行数、哈希；baseline_changed=[]。
- `.writer/stage-b-final-verification.json`：导出、来源、连读报告、基线与最终custody复核，ok=true。
- `.writer/stage-b-evidence/`：最终status、各次recall、export、check真实输出；主调用另存invocation与stderr。最终P001召回亦保存原输出。
- `.writer/reviews/232b54a6-56ff-40fe-8538-80cdecb2a70f.json`：真实model-self-review登记，报告哈希`1066fe9685bd4d9cd42d7d46102364a982186228d7d8659623038d57443f1f6a`。

## 失败、未覆盖及操作范围

本轮有已纠正的调用失配：首次doctor附`--project`被拒，随后`doctor --help`也被拒；读随附CLI参数表后按无参数doctor成功。这是本轮传参错误，不判为helper失败或正文完成。首次在尚未建0004章纲前调用context报ENOENT，按plan→context顺序后成功。另一次试图由functions编排发现FastCtx读工具返回空列表并报TypeError，未读写文件，随后直接用FastCtx入口正常完成；不算作品工具故障。没有明确产品工具阻塞，故未创建stage-b-issues.md，也未修改工具或技能。

未覆盖：完整长篇、大规模召回/性能、旧稿导入、rewind重登实操、真实行业程序、真人及独立读者、市场和正式出版验收；上午九点实际签领、小满就业和借车归还、被角旧名来历亦未发生或未写。没有为测试编造错误、偷改已消费来源或刷新哈希规避保护。

本轮只生成目标作品的新章纲、正文、登记输入、工具维护的追踪、审查/证据及同级草稿导出；未改主工具，因而未触发修改工具所要求的npm test/doctor及内置引擎测试流程。作品随附doctor/check已实际执行。根仓库开始时已有大量未跟踪目录，不能称工作区干净；本轮不提交、推送、发布、上传或付费调用。
