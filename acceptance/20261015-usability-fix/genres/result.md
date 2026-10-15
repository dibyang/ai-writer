# 两种文体去 AI 味流程验证结果

2026-10-15；主入口 `D:/work/other/ai-writer`；Node v24.15.0；ai-writer 0.3.0。

本次指定的两部单单元作品均完成真实 CLI 建档、定位/文风/细纲、原稿字节保全与首次登记、知情实读诊断、正式回退、定点润色、连读复核、重新登记、check 和最终草稿导出。两部均 revision=3，正文与来源追踪一致，未登记稿、来源漂移与导出排除列表均为空。发现随附来源/许可说明缺失，未改产品或补工具包掩盖问题；本结果不代表整个产品已验收或可发布。

## 最终草稿与版本证据

| 文体 | 新作品 | 最终导出 | 专项对照与复核 |
| --- | --- | --- | --- |
| screenplay | [借一把椅子](../works/借一把椅子/writer.json) | [screenplay-r3/manuscript.md](exports/screenplay-r3/manuscript.md) | [第 1 场最终复核](../works/借一把椅子/审查/去味-0001-最终复核-r3.md) |
| history | [字放回格子里](../works/字放回格子里/writer.json) | [history-r3/manuscript.md](exports/history-r3/manuscript.md) | [第 1 章最终复核](../works/字放回格子里/审查/去味-0001-最终复核-r3.md) |

| 文体 | 原稿 SHA-256 | 修订稿 / 导出 SHA-256 |
| --- | --- | --- |
| screenplay | `d06563b5b20c3535ca9e5d4b27453ff82f7af4b7ee6054f9584011a6b322aa3f` | `7f4552d282c2cb33d264fa82a80918fc31f145d9569ceb6fd4bfc76130a74775` |
| history | `ac8a4215c851bb416e8a6e3116766200f1bff2efdf8c817936d935ad865bb747` | `0b498a27903b39dae56b2d5c224ce9b27dcc3e92eded4f95d00c698e6cfe5987` |

两个 `审查/` 均保存原字节 before、修订 after、原稿诊断、真实完整 diff、前后哈希 JSON、最终改前改后报告和追踪/导出核对 JSON。首次登记 SHA 与输入一致；旧报告只支持旧哈希，不冒充新稿结论。正文目录仅放实际登记稿，备份未混进未登记稿盘点。

## 实际执行

先完整读 `docs/user-guide.md`、`docs/deslop.md` 与 writer-project，再读 writer-screenplay、writer-history（含 history-method）、writer-review（含 deslop）及两份完整素材、全部三条事实卡和引文。记录见 [阅读范围](read-coverage.json)。审修由同一会话按技能完成，CLI 负责文件与追踪；没有将 pattern scan 当作自动润色引擎或独立读者。

每部使用主 CLI 执行下列事务，全部显式传作品路径：

1. `init` 建空作品，完善作品定位、文风、权威规则和全书大纲；`plan` 保存单元 1 细纲。剧本按一场组织；历史按一章组织，research_refs 指向事实卡原字节副本。
2. 读 `context`，取 `record-template` 并保存实际模板；原稿原样复制到正文，用原摘要/完整 snapshot 登记至 revision=1。基线描述明确保留原稿待修问题，不假称原稿质量通过。
3. `status` 核对已登记范围；`style-scan` 仅定位候选。完整实读并保存原稿诊断；原始备份在修改前已存在。两部基线 `check` 均为无发现的机械检查。
4. 分别执行 `rewind --from 1 --expected-revision 1` 至 revision=2。旧状态由 CLI 备份，正文仍在；status 各显示一份回退留稿，实读确认用途后继续，没有删除正文或手改 state。
5. 重新完整读 context 和回退原稿，保存写前模板；定点修改后完整连读最终稿、核对实际 diff 与保护项。再填实际摘要/snapshot，`record` 至 revision=3。
6. 再跑 `check`、`status`，`export` 分别写入两个全新目录；完整读导出稿，并核对正文/manifest/source_hashes 与最终登记一致。

所有过程的 [真实 CLI 索引](cli-index.md)、[原始调用流](cli-executions.jsonl) 和 `cli/*.json` 均含 argv、cwd、起止时间、退出码及真实 stdout/stderr。共落盘 62 次调用，60 次退出 0；2 次是检查脚本误给 init 帮助传入不适用的 `--project`，退出 2。失败记录保留，另以正确参数补跑两次，均成功。入口说明阶段另运行主 CLI 四项帮助与 doctor，原输出在会话工具记录中。

## 实际修改与保留

剧本删两处重复的“缓缓开口”、无法给出具体目标的“眼中闪过一丝复杂”，以及末尾小说式内心总结；角色名和台词改为分行。没有新添动作来替代被删总结。全部 7 段对白、角色归属及顺序逐字保留，方姐仍讲公物数目与手续，许安仍解释借用理由。扫描仍命中的“深吸一口气”保留：这是原有可表演动作，处于追责转为给手续的转折，只有一次，有节拍作用。“这不是少两把，是我想借两把”承担澄清遗失与借用的功能，也保留。

剧本保护项：二十五把总量、二十三把已回库房、两把借出、只挪一把；夜间留一晚，明早九点登记、十点归还；签到册递出未接、借用单另取并收好、钥匙无交接。数量/时间序列与原稿一致，不因标题“借一把”误改借用数量。

历史散文只删“这意味着……”的重复解释和“命运的齿轮……文明梦想”的泛赞，另用已给书名卷篇补一行史源。不补新历史细节。块引文、行内引文、“之”“也”、二十多枚/二十馀印、三、二本，及完整库存/耗时/心理限定段落逐字保留。终稿仍命中的“不是现代字库……而是沈括……”用于限定证据性质，有必要，不能按句式删掉。

两部扫描前后候选分别为 6→1、2→1，仅报告候选数量变化，不视为质量评分或改善幅度。13 项 [内容保护核对](content-preservation.json) 支持对白/数值/引文/限定/事实卡保全；实际文学判断另外由全文实读提供。

## 来源与追踪

历史事实卡 SHA-256 为 `86bc3e5aa30634ec2d7cd5da27108eaec89df3745d03fe34ac27b0418b2ad43a`，作品内副本与输入完全相同，三条 claim 的引文、boundary、source_dependency、checked_at 及既有 verified 声明均未变。三条依同一《梦溪笔谈》活版条，不能算三份互证。已完整读给定引文，但未重新访问网页、oldid 或古籍，不把用户已有 verified 声明当成本轮独立外部核验。给定材料中的奇字、胶泥、拆印、大印量等未扩展成新增正文段落。

最终 state 中的正文哈希、record 返回、after 快照和导出哈希相同；非状态的全部已消费来源与当前文件哈希一致。source_hashes 中 `.writer/state.json` 是写前 revision=2 的真实哈希，已与 context 对照；登记后状态必然推进，未错误要求它与 revision=3 文件相等。

两个 export manifest 均为 `draft-export`，`included_units=[1]`、`excluded_drafts=[]`、`warnings=[]`。原稿备份不是待交付正文，不在排除列表中；没有漏导本次需要的正文。CLI 的 `quality_review=required` 和 check 的 `mechanical-only / literary_quality=unreviewed` 仍如实保留，本会话复核报告另存，不更改产品质量状态。

## 随附工具、手册与发现项

两部完成后，始终从当前根目录，用各自 `.writer/tool/bin/ai-writer.mjs` 显式路径运行 doctor、status 和帮助；有效的作品命令还显式传 `--project`。各 doctor 为 0.3.0、skills=7、errors/warnings 均空，tool_root 确认指向自己的随附目录。status 与主 CLI 的追踪内容相同（命令路径自然不同）。每部 11 项有效帮助：init、plan、context、record-template、record、rewind、style-scan、check、export、status、doctor，均有自身 CLI 及本地手册路径。

两部 `docs/user-guide.md` 已通过 FastCtx 从头到尾读取；随附 quickstart、workflow、deslop、long-form 共 10 个手册文件均可按 UTF-8 读取、与根手册字节一致，用户手册内本地 Markdown 链接目标存在。CLI/modules 与本次实际使用技能均与主项目哈希一致。最终 53 项 [来源/追踪/工具/导出核对](verification-final.json) 完成。

| 发现 | 证据与影响 | 本轮处理 |
| --- | --- | --- |
| 随附来源/许可说明缺失（已确认） | 两部生成目录均无 LICENSE.md、docs/sources.md、docs/usability-sources.json；只读查看 init 复制清单，确未包含这些文件。去味参考提及的主项目来源记录不会随作品迁走；doctor 仍为 ok，不说明来源随附完整。 | 记录未修，不往随附工具包补文件掩盖现象。阶段 [provenance](provenance/manifest.json) 另存根许可、来源说明、去味来源登记和参考 MIT 许可的原字节快照及哈希。 |
| init 帮助通用尾注存在歧义（可用性观察） | init 用法明示 --path，但通用尾注仍写“在作品目录运行时可省略 --project”；该参数实际被 init 拒绝。有效 init --help 可正常读取。 | 不把我的参数错误当作 init 功能失效；保留失败和补验记录，产品不改。 |
| 额外验证脚本两次退出 1 | 首次假定随附 LICENSE 存在而遇 ENOENT；第二次全工作区零漂移断言发现范围外验收文件变化。 | [异常记录](validation-incidents.json) 保留实际原因；改成分别记录分发缺口、产品/输入保护和其他验收变化，不改变作品状态或 CLI 结果。 |

## 写入边界与未覆盖范围

本轮命令的持久写入仅在指定两部作品与 `genres/`；无产品修改、提交、推送、发布、联网补史、额外代理或付费服务。产品源码已有的用户改动保留，未运行 npm 产品测试；本轮仅做实际流程与证据核对。主 doctor 和两部随附 doctor 已实际运行。

在写入创作资料前，建立 1420 个写入范围外文件的保护哈希快照。最终产品与输入文件均未漂移，但整个工作区存在以下变化：`acceptance/20261015-usability-fix/README.md`、`defects.md`、`verify-artifacts.mjs` 三文件哈希变化，另新增 `manual-verification.md`。本轮未写这些路径，来源未确认，未覆盖或回退它们；前后哈希和新增路径在 verification-final.json 的 write_scope 中。不能据此宣称全工作区零变化。

未覆盖演员排演、布景实测、实拍与实际成片时长；剧本 1—3 分钟只是规划估计。未覆盖历史外部版本/异文/出版页码核验、真人盲读、市场或外部检测器、跨场/跨章长篇连续性、换机独立安装、随附引擎 gate、异常保护的系统性回归或正式发布验收。本次是两种短素材、当前本地版本的完整授权审修流程验证，交付仍为草稿。
