# 第七章候选采纳修复交接

本记录只交接工具。真实小说仍由原小说会话核实备份、实时状态和来源后执行；本会话没有安装、升级、登记或改写真实作品。

## 唯一验收通过的交付包

使用 `final-fixed/ai-writer-0.9.0.zip`。此前 `fixed/` 是已知缺少普通 review 入口的中间包，已被取代，不得接入作品。

- ZIP SHA-256：`762a54ce16b27dc45f835503db9fb1d2df4dc863d9b54954c95734d0102f1d2c`
- 工具 content ID：`9a282a0b5b4f46759f3ddc5d99ec1d11d35bace7d736dfecd19e9a894a86d9ae`
- 版本：0.9.0 开发版；未发布、未提交、未推送。
- 解压入口：`D:/work/other/ai-writer/acceptance/20261024-candidate-continuation-fix-y/extracted-final/ai-writer-0.9.0/bin/ai-writer.mjs`

最终验收已完成，结果见本目录 verification-final.json：最终解压包 203 项测试，201 通过、2 项 Windows 链接权限相关跳过、0 失败；源码针对性与易用性 17 项通过，源码及最终包 doctor 通过。59 条兼容 CLI 加 3 条实际连读后的 review/scan/check 命令通过。ZIP、解压文件和全部发行输入源码逐项验哈希一致。未执行其他平台 CI，不把 Windows 跳过项算作通过。

## 现场操作顺序

1. 核对 ZIP 哈希、完整备份和实时状态。旧候选预计仍为 r432、六章；这只是交接基线，不替代实时读取。不要改原 `.writer/tool`、session、scope、token、state、清单或待登记稿。
2. 使用外部解压入口，对原候选执行 `revision continue --project <原候选绝对路径> --input <派生输入JSON>`。按固定制品的 docs/revision-and-sources.md 中“独立候选的下一章采纳”准备字段。expected_revision、state SHA、session SHA 和令牌都从真实现场取得；不要复用测试输入或测试令牌。
3. 目标选原作品之外的全新目录，例如 `D:/work/小说/dzkxqxx-ch7-continuation-20261024`，此处尚未创建。结果的新 parent/workspace/id/token 保存为本地审计记录。旧主稿、旧六章候选和旧会话继续保留。
4. 对新 workspace 使用普通 plan 建第七章细纲，带新 revision-token。只引用原始动笔前清单已有的公开来源；公开第七章细纲字节和私有准备附件不同，不宣称二者等价。私有附件保留为审计证据，不挂成正式来源。
5. `revision adopt --project <新workspace> --revision-token <新token> --input <采纳JSON>`，输入为 unit=7、新候选当前 expected_revision、draft=`正文/0007-下一回.md`（或明确的新正常正文路径）。返回未登记草案及 _adoption，将标准输出按 UTF-8 保存到新文件。每条命令非零立即停止，不能接着登记。
6. 实读封存正文、旧六章承接和来源，填写真实摘要、changes；新审查报告保存到新候选 审查/，绑定当前正文和报告哈希为 draft_review。保留 _adoption，先 record-preview，再带新令牌 record；登记后 check、普通 review 和必要扫描，结论按实际阅读记录，不把机械检查冒充文学通过。
7. 跨进程恢复对新 parent 用新 id/token 执行 revision resume。仅本候选第七章有效；旧六章只读，第八章、rewind/replay、prepare/commit 均拒绝。原小说会话完成登记后再向作者报告，本工具会话不会代为修改真实作品。

## 本次真实清单的选择

以下是位置提示，原字节和哈希必须实时核实：

- 原候选：`D:/work/小说/dzkxqxx/.writer/revisions/a250c807-0023-4bda-bf8b-188585d7abac/workspace`
- manifest.root：parent；ref：`.writer/drafts/rootless-ch7-draft-20261024/source-manifest-before-writing-final.json`
- draft：`.writer/drafts/rootless-ch7-pending-20261024/0007-下一回.md`
- 封存正文预期 SHA：`06e36d13a9bfa54504f41b9d4a554eb826e2b575fbc25be0fbc5e94e887d2858`
- audit_only_refs：`.writer/drafts/rootless-ch7-pending-20261024/第七章细纲依据.md` 和 `.writer/drafts/rootless-ch7-pending-20261024/作者授权.md`。
- 正式公开材料：`研究/作者授权-新版第七章独立候选-2026-10-24.md` 与 `大纲/新版第七章细纲-下一回-2026-10-24.md`，均已列于原清单。author_evidence 引用实际公开授权原话及该文件哈希，不伪造新作者确认。

## 失败与恢复

源和目标均加命令锁；CAS、完整旧基线、旧工具身份、封存稿和全部清单来源核验失败即停止。重复目标不覆盖。失败目标保留供核查，不能用作可用作品；查清原因后选择另一个新目标。不改哈希、不刷新旧基线、不抢占锁、不自动清理候选。

派生成功也不自动切主稿。此次不提供发布能力；以后需要发布时另行设计核查，不手工删 kind/scope 或把新候选伪装成旧修订。
