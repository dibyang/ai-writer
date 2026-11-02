# 0.11.0 新增特性：审查与复测完成记录

这是发布前该轮候选的历史快照；后续兼容修复和发行验证见 [发布验证记录](../20261102-release/README.md)，不以本页的未发布描述判断后续发行状态。

本轮结论：明确审查与验证范围内未发现未解决问题。当前仍为本地未发布开发候选，非真人、市场或排演验收。

修正3处指引缺口/误伤风险：常规写作、自检及全稿审查显式核对相关四项；缺席人物允许经照片、记录和合理推断获知；区分故事内制度限制与客观行动能力，并明确有依据的有限和解、自愿帮助不应被规则误伤。共修改小说/剧本/审查SKILL、narrative-causality共享参考、手册和CHANGELOG六个文件。

- [完整审查与复测报告](C:/Users/admin/.codex/visualizations/2026/11/02/01a19aaa-ef65-7410-b561-9819472a547f/ai-writer-review-0110/acceptance/review/README.md)
- [逐项审计结果](C:/Users/admin/.codex/visualizations/2026/11/02/01a19aaa-ef65-7410-b561-9819472a547f/ai-writer-review-0110/acceptance/review/audit.json)
- [1429项关键证据索引](C:/Users/admin/.codex/visualizations/2026/11/02/01a19aaa-ef65-7410-b561-9819472a547f/ai-writer-review-0110/acceptance/review/evidence-index.json)
- [本轮候选ZIP](C:/Users/admin/.codex/visualizations/2026/11/02/01a19aaa-ef65-7410-b561-9819472a547f/ai-writer-review-0110/acceptance/review/package/ai-writer-0.11.0.zip)

ZIP SHA256：`99e88d64c11abf67bef39426957a9d3f4807c730c105452d60fa4eb1b96fe44d`。368个源码输入与原目录逐文件哈希一致，约3.2MB独立副本；包来源Git为unknown，以实际内容指纹绑定，不伪称原提交。包内清单和共享资源/相对链接核验通过。

验证：隔离副本npm test退出0，257项中256通过、0失败、1按既有Windows symlink权限边界跳过；npm run doctor退出0。最终包内入口完成独立新案例：小说3章、剧本3场，含普通提示下的知情、和解、低压劳动、有意越权及资源限制，10组误伤/漏检对照；原六项和上一轮四项也从同一包新建回归。全部完成登记、连读、check/doctor及导出，超范围正文context/template拒绝且状态不变。内置引擎未改，未跑test:engine。

本轮还修正了新验收输入的许可措辞歧义与过粗证据定位。使用正式独立区从1—3单元实读重登、review、prepare及内部revision commit，全部正文哈希不变，未手改状态或旧哈希。第一次小说prepare因控制文件被误建在主作品目录触发BASELINE_CONFLICT，已abort保留候选，移控制输入到作品外并从新基线重做成功；无活动修订或未完成事务。此处revision commit为隔离合成作品内部发布，不是Git提交。

验收生成器同步修正，原版本与失败记录保留；从全新目录重跑后，事实快照与正式修订后完全一致，正文相同，证据定位问题未复发。

未修改真实作品或旧验收作品；未做Git提交、推送或发布。没有在原仓库运行Git扫描或全量测试。原仓库Git监视卡顿的暂停操作仍另行处理，不能把本轮特性复测通过当作运维问题已解决。
