# 已登记第七章限章修订与候选意见闭环

状态：Windows 本机最终固定包验收完成。工具提供已登记第七章续写候选的小修入口和本地候选意见闭环；真实小说未修改、未重登，仍由拥有者会话按 HANDOFF.md 接管。旧六章、来源、原七章候选、基线与工具保留，不写8、不发布、不全面升级、不提交推送。

最小接口：revision continue-revise 根据新作者证据、当前来源CAS及封存修订稿SHA，在原作品之外构建限7修订区；成功前仅存在独立暂存现场。复用rewind/replay-input/record/review，正文必须匹配本次批准SHA，旧六章及来源只读。revision local-proof 冻结旧/新正文及当前版本报告，作为未发布候选凭据；review-issues apply使用local_revision_id，与主稿commit_id严格区分，verify必须引用当前新稿报告。

实际完成：独立旧AA工具已登记七章+两份旧版合成报告 → 最新固定包 continue-revise → 采用两条指定意见 → rewind7/context固定来源 → 仅两处封存小修 → preview/record及幂等重试 → 当前六七章模型实读review → local-proof及幂等重试 → apply/verify → 新进程resume/status/check/doctor。旧报告不能支持新稿，第八章及主稿prepare/commit拒绝。旧六章完整登记和事实快照保留；源候选、原协调目录、会话和基线逐文件核对不变。来源引导与旧报告属于合成夹具，最终六七章和新稿复核由本次Codex实际阅读；不称真实作品完成或文学验收。

## 最终制品与验证

- 接管入口与完整步骤：[HANDOFF.md](HANDOFF.md)。普通使用仍沿用常规作品修订，不扩展本作授权。
- 最终ZIP：[verified-fixed/ai-writer-0.9.0.zip](verified-fixed/ai-writer-0.9.0.zip)，SHA256 `6b1e8523ee26fe3a347e21b5bf41dfbc5a2c0c535c8bee44bbef63e327696d1a`；content_id `52156ccdc8d1fc7a728215ced690e6c1e58d1653cda828fcc8313e0e6df7e47c`。0.9.0仍为开发候选，未发布。
- [最终机器结论](verification.json)、[解压包完整回归](verified-package-tests.log)：218项，216通过、0失败、2项本机符号链接权限跳过；源码与包doctor均无errors/warnings。未改内置引擎，不重复engine回归；未执行跨平台CI或发布验收。
- [最终真实CLI场景](final-flow/native-verification.json)、[命令与输入](final-flow)、[当前状态](final-flow/final-status.json)、[当前意见](final-flow/final-issues.json)。实际每条CLI调用均为新进程；这不是对真实作品的操作。
- [来源及制品边界](boundaries-final-verification.json)：最终包327份来源与当前源码完全一致，相比AA只有11份来源变化（其中5个runtime模块）；Y/Z/AA共6977封存文件及其回执、ZIP复核一致。X封存也经独立原脚本复核13213文件一致。

## 失败和保护

首次完整回归215通过、1失败、2跳过：新手册链接未随作品携带。现将完整入口放回已有revision-and-sources.md并保持原资源识别表不变；最终全量重新通过。失败包保留在 final-fixed/extracted-final，不能用于接管。首轮3项定向有一次fixture漏token，后来3/3和5/5通过；本次嵌套拒绝错误码断言和日志路径/PowerShell引用问题均为控制器问题，原件与处置保留于 operation-failures.json，不冒充产品缺陷。

五项新增定向测试覆盖：错误所有者、CAS、授权原话和原稿SHA拒绝；复制中来源/授权变化只保留暂存现场、不暴露可用目标；不扩大范围、旧六章/来源只读、封存SHA与原路径要求；候选凭据不能伪造主稿提交；旧报告拒绝、实际新旧稿和报告归档损坏后不可保留有效意见核验。原功能回归在最终解压包完成。

records-manifest.json 与本目录外的封存回执固定完整证据（排除可再生.tmp测试夹具）；封存后不再向本目录写入。后续36→48章实跑使用另一个AC目录，不改本轮制品和记录。
