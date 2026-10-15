# 最终候选恢复与交付复核

本次由当前 Codex 会话实际执行，检查区间（UTC）：2026-10-15T10:36:52.745Z 至 2026-10-15T10:41:02.504Z。随附工具、恢复及新导出复核通过，最终文件基线一致；以下保留过期审查记录和检查期间观察到的短暂目录差异。

实际调用四个作品各自的 `.writer/tool/bin/ai-writer.mjs`，共 19 次：doctor/status/check 各 4 次、recall 2 次、import-status 1 次、export 4 次。全部退出码 0、ok=true，stderr 为空；doctor 不带 --project，其余调用均显式指定作品目录，status 全部为默认 compact。原始 stdout/stderr、命令参数及退出码见 [commands](commands/)。

| 作品目录 | 文体 | revision | 已登记/导出单元 | next_unit | 有效/过期审查记录 |
| --- | --- | ---: | --- | ---: | --- |
| 末班寄存柜 | novel | 7 | 1–6 | 7 | 2/0 |
| 留一把椅子 | screenplay | 9 | 1–2 | 3 | 1/1 |
| 字散开以后 | history | 3 | 1–2 | 3 | 1/0 |
| 导入恢复 | novel | 4 | 1–3 | 4 | 1/0 |

四个 status 的 stale_units、changed_sources 均为空；check 的 findings、pending_windows 均为空。剧本仍有 1 份过期审查记录，不计为有效覆盖，本轮未重审或重登。check 仅为 mechanical-only，literary_quality=unreviewed，审查数量仅代表覆盖。doctor 均报告 7 个技能入口、engine=optional-in-workspace-copy；本轮未验证内置引擎。

恢复回读：

- 小说：recall 木箱定位 P001；实读 [第4章](../works/末班寄存柜/正文/0004-钥匙还在他手里.md)第25–27行与[第6章](../works/末班寄存柜/正文/0006-再盛半碗.md)第3–23、37行。箱已从郑来顺交回何素琴，现留旧站寄存室值班桌靠墙端；电话许可后局部开箱核对，合盖重拴灰带。周桂枝上午九点到站核验签领仅为预约，整箱尚未交还，原簿领物栏仍空，与 P001 当前 custody/未交还边界一致。
- 剧本：recall 07 定位 P07；实读[第2场](../works/留一把椅子/正文/0002.md)第5–49行。方叔松手后小许接椅入储物间，叠椅旁贴号朝外，库门已锁，与 custody 一致。下周五八点半摆椅及老梁日后能来仍是未来事项，不能写成已经到场。
- 导入：import-status 返回 total=2、registered_units=[1,2]、baseline_registered_through=2；未读/未登记范围、changed_copies、changed_originals 均为空。原文件、冻结副本、登记正文及 import.json 的两条哈希逐项一致；作品当前另有已登记第3章，导出1–3。本轮没有重新全文阅读或新写第3章；登记覆盖本身不是阅读质量证明。
- 历史散文：实际查看两份已存单元纲及 [研究/活版.json](../works/字散开以后/研究/活版.json)。两章 research_refs 均指向该卡，已登记 source_hashes 与当前卡哈希一致；卡内为两项 direct、一项 inference，均依赖《梦溪笔谈》同一活版条，网页与摘录不算独立互证。只核对引用链和登记，卡内 verified 是既有标记，本轮未访问史源或新增史学核验。

交付与保护：

- 对照 candidate-validation-v2.json：每个作品 5 个运行文件、7 个技能入口及长篇参考各 1 个，共 52 项随附文件全部匹配；根目录对应 13 项也匹配，共 65 项。检查前后均一致，候选清单自身哈希未变。见 [candidate-hashes.json](candidate-hashes.json)、[candidate-hashes-after-final.json](candidate-hashes-after-final.json)。
- 四次 export 均使用全新目录 `exports/作品目录名`，未覆盖既有导出。独立复算合订稿 SHA-256，核对 manifest 与当前 state/status 的 revision、全部单元顺序与范围、正文及 source_hashes，并验证合订内容等于已登记正文按序拼接；全部一致。均为 draft-export，quality_review=required。
- 原始保护基线始终保留：检查前 323 个作品/导入源文件全部保持 SHA-256、大小、mtime 不变，包括 13 个正文与 4 份 state；旧导出也未变。最终仍为 323 个文件，差异 0 项，见 [protected-comparison-final.json](protected-comparison-final.json)。首次比较曾观察到新增 `works/留一把椅子/审查/历史/1-2连读-rev6.md`；最终回查已不存在。写入与移除来源均未确认，本轮未操作该文件，也未重设基线；首次差异保留于 [protected-comparison.json](protected-comparison.json)。

| 新导出合订稿 | 实际 SHA-256 |
| --- | --- |
| [末班寄存柜](exports/末班寄存柜/manuscript.md) | 2d37d578411ee2aa57ae2c405e1f2db5bce6f64ea123fb41905da14f78d6e09a |
| [留一把椅子](exports/留一把椅子/manuscript.md) | 0b9e159dc020be95bd8733f2928eab5c7fdf1a7c6ae32bc8db944eb9423a578f |
| [字散开以后](exports/字散开以后/manuscript.md) | d9ac9d33124230985710a9a5173c7afe2874ef6e8d08cb0c8cfcda55b8ae1c47 |
| [导入恢复](exports/导入恢复/manuscript.md) | 6ad7607ba3152c374b433b387b614e75c25374fe002cdf9c899a115fe381fe7f |

详细交付核对见 [export-verification.json](export-verification.json)；导入原文/冻结副本及事实卡登记哈希见 [source-chain-audit.json](source-chain-audit.json)。

报告辅助脚本曾两次因模板字符串转义错误在解析阶段退出，另一次机械替换被拒且未写入；错误输出整理保留于 [report-helper-errors.json](report-helper-errors.json)。仅修正本目录新建辅助脚本后重新执行收尾，未改变原始保护基线，也未更新登记哈希绕过保护；这与上列19次成功的随附工具调用分开记录。

本轮没有创作新正文、修改工具/技能/原有稿件或状态，没有另派代理、提交、推送或发布。只新增本目录的复核记录与草稿导出；检查期间的短暂目录差异已单列说明。该结果仅为最终候选的 Codex 恢复、工具和交付复核，不是重新创作、真人盲读、市场验证或整部长篇验收。
