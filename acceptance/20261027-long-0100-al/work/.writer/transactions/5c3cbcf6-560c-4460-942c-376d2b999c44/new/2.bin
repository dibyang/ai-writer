# 随附工具的本地安全更新

作者直接说明“从这份本地主项目更新此测试副本的随附工具，保留作品定制”。Codex负责检查和准备输入；不联网寻找最新版本，不自动升级其他作品。0.7新作品已使用schema6，已有作品的协议启用与工具替换分开进行。

先用主项目新入口 `tool update-plan --project 作品目录 --source 本地主项目`。计划只读，列完整模块/手册/许可、目标内容、定制和阻断，同时核当前规划授权、活跃修订、待处理影响及正文/消费来源漂移；不会把包完整等同于作品已可更新。缺模块、坏清单或链接要先解决；相同版本号不表示同一构建。作品根AGENTS、技能、手册默认保留，新工具所需原版资源随包放在.writer/tool内。

已有schema5须另行明确授权 `tool enable --input ...` 启用schema6代次保护，并保存原state；旧0.6会拒绝6。1–4先按原迁移流程到5。enable不是更新，也不写正文。随后重新plan，输入当前revision、source/target内容ID、plan_sha256、稳定operation_id和作者原话，再从被更新工具目录之外执行 `tool update --input ...`。无清单旧副本须明确接受精确观察到的旧基线；有清单但运行代码被改、或存在未知工具文件会阻断，不自动覆盖代码定制。

文档更新是显式选择：只允许未被定制且未被章节消费的受管手册；未知旧基线保留现状。更新不会迁移schema、重登章节或修改事实；成功只推进一次业务revision和工具generation，旧输入因此过期。

出现pending时停止普通读写，从外部新入口 `tool updates` 查事务，使用 `tool recover --input ...` 明确complete或rollback。遗留锁必须核原进程、锁SHA及作者恢复依据，不能按超时删除。恢复遇第三方字节保留旧/新/外部并停止。备份与失败材料不会自动清理。

0.7.1起，0.7随附包缺少build-manifest.json视为损坏，不能降为“无清单旧包”继续写入。安装后的完整资源身份还须与state中的安装记录一致：只重建清单不能追认变化。先用外部主入口运行doctor和tool identify，保留现场并核对原版或原事务备份；不要改state指纹、重建清单或使用legacy_target_acknowledged绕过。未更新过的旧无清单0.1–0.6副本仍按原观察基线处理。

complete或rollback执行途中再次中断时，原事务仍为pending，普通入口应继续拒绝。保留原事务和备份，核实新遗留锁后，从外部入口再次明确恢复方向；无需重新生成更新计划，也不要重跑enable。恢复完成后同方向重试不再推进revision/generation；终态不能反向回填。中途改变恢复方向也必须显式给出，且逐文件仍须属于原事务的旧/新字节；第三方改动会阻断两种方向。

## Codex准备输入与执行

从主项目运行（将作品与来源替换为实际绝对目录）：

```powershell
node bin/ai-writer.mjs tool update-plan --project 'D:/作品副本' --source 'D:/ai-writer'
node bin/ai-writer.mjs tool enable --project 'D:/作品副本' --input '启用.json'
node bin/ai-writer.mjs tool update-plan --project 'D:/作品副本' --input '计划选项.json'
node bin/ai-writer.mjs tool update --project 'D:/作品副本' --input '更新.json'
node bin/ai-writer.mjs tool updates --project 'D:/作品副本'
node bin/ai-writer.mjs tool recover --project 'D:/作品副本' --input '恢复.json'
```

已有schema6跳过enable；schema5启用后要重新计划。所有输入为UTF-8 JSON；作者用自然语言授权，Codex按实际文件读取值，不能抄示例假哈希。

| 输入 | 字段与来源 |
| --- | --- |
| 计划选项 | source为完整本地来源；documents可选手册相对路径数组，默认空；legacy_target_acknowledged默认false |
| 启用 | expected_revision、稳定operation_id、source、expected_source_build_id、expected_target_build_id、author_evidence；无清单旧包另需legacy_target_acknowledged=true |
| 更新 | 使用最终只读计划返回的request，补充author_evidence；原request包含当前revision、operation_id、两端构建ID、plan_sha256、documents和旧包接受选项。保留原输入供幂等重试，不因报错只刷新哈希 |
| 作者依据 | quote、local_source、source_sha256、locator、recorded_by；须为真实原话与作品内本地来源，工具冻结原字节，不认证身份 |
| 恢复 | transaction_id、direction为complete或rollback、author_evidence；若有遗留锁，另填实际lock_sha256，原进程须已结束。终态同方向重试可幂等，不能反向回填 |
| 撤销启用 | enable_id、author_evidence；仅适用下述精确无后续业务变化的边界 |

staging中的pre-transaction-candidate表示事务尚未发布，原工具和state尚未替换；先核现场。若仅遗留锁，可使用既有revision unlock，输入lock_sha256、author_evidence和reason，随后重新生成计划。它不会发布候选或清除备份。已发布事务必须tool recover，不能直接删锁后继续写。

回滚恢复旧工具及更新前state；若旧工具不支持已启用的6，继续使用主项目新入口重试。只有当前state精确等于enable后的原字节、generation仍0、没有其他业务写入，才可另行授权 `tool undo-enable` 恢复原5；不能在有新数据后改schema数字。成功更新后的撤销须创建新的兼容更新。

完成后实际从作品 `.writer/tool/bin/ai-writer.mjs` 执行help、doctor、status、discussion context，再按原授权创作或修订。pending检查、代次和运行文件检查保护同机协作；它们不是作者身份认证，也不能绝对拦住任意编辑器的锁外写入。

## 更新后新会话读取的技能

根AGENTS和`.agents/skills`可能保留旧流程或作者修改。新会话先遵守这些作者规则，再从随附入口help列出的“当前工具流程技能”读取当前包的writer-project，并按文体与任务读取同目录中的writer-novel、writer-review等；不要仅凭根技能文件存在，就认为它与新版工具相同。

doctor返回`skill_root`和`content_root`，分别是实际校验的技能与手册资源目录；`project_skill_root`指保留的作品根技能。0.7随附包的技能在`.writer/tool/.agents/skills`，修订区仍指向父作品安装包。校验通过只证明这些资源完整，不代表Codex已经阅读过它们；交接应记录本轮实际读取的位置与版本。工具流程参考不能覆盖作者约定，也不自动改变技能发现顺序或根文件。
