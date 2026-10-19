# K轮：Apache-2.0授权与分发验证

日期：2026-10-19。状态：**授权已落实，本轮有限范围的本地验证通过**。本轮仅修改工具与许可说明，不改现有作品、不Git提交或推送、不自动发布npm或插件包。

## 授权与范围

用户在确认story-gate-studio来自本地自研项目后，明确要求“那就用Apache 2.0 授权”。本轮将ai-writer自有代码、技能、规则、文档、原创示例及随附story-gate-studio按Apache-2.0授权。权利声明见根NOTICE；既有验证归档中的自有内容也适用当前分发授权，原封存字节和历史说明保持，不把第三方内容改许可。已有作品及私有研究的权利不因使用工具而改变。

Apache官方原文来自https://www.apache.org/licenses/LICENSE-2.0.txt，下载原件保存在apache-license-2.0.txt；URL、SHA-256与起始Git提交见baseline.json。主项目和内置引擎的LICENSE.md均与下载原件逐字节一致。第三方oh-story原文、版权与MIT许可保持；Chinese-WebNovel-Skill仍只采用独立表达的方法，不随包分发其无明确许可的原文。

## 实际变更

- 版本0.8.0→0.8.1，主项目、引擎package.json及引擎插件元数据声明Apache-2.0。private:true保留为防止误发npm的保护，不限制软件许可。
- 增加主项目和引擎NOTICE，更新授权/来源说明、快速入门及使用手册。原商业试用档位改为可选支持服务，移除试用不得再分发和软件激活限制；历史商业设计仅保留背景。
- 新版轻量工具增加NOTICE与docs/license-transition.json两项受管资源，共65项。旧0.7.x与0.8.0按原资源形状识别，不追溯要求新文件；0.8.1缺失NOTICE会被诊断拒绝。
- docs/source-manifest.json原始导入清单保持；10项自有引擎导入文件的原/现SHA与变更理由单独记录于docs/license-transition.json，第三方文件仍核原始哈希。本轮未修改引擎执行脚本或原开发目录。

## 已执行的流程

update-smoke.mjs使用J轮冻结的真实0.8.0最终包初始化隔离essay作品，再从主项目外部入口执行正式update-plan/update。实测更新成功，schema/units/snapshot/governance/decisions保持，根AGENTS、定制技能、未选择的attribution和旧LICENSE副本保持；快速入门/使用手册按本次授权刷新。新受管包带当前LICENSE/NOTICE/迁移清单；原输入重试幂等，未授权113章写作拒绝且state不变。随后用更新后的随附入口再次初始化新作品，作品根和工具包均携带许可资料，doctor/check通过。见update-verification.json及commands/update-*原始捕获。这是许可与工具更新流程，不是新的小说实读验收。

引擎通过原build-private-package命令构建独立交付包，产物包含引擎LICENSE.md与NOTICE，构建自带验收通过。原命令名称保留，不表示附加私有软件许可。引擎回归29/29通过。

## 记录与边界

命令输入、stdout/stderr、退出码、状态前后SHA位于commands/；针对性26项中25通过/0失败/1环境跳过；完整npm test共165项，164通过/0失败/1环境跳过，npm run doctor通过；引擎29/29通过。新包初始化、旧包正式更新、幂等、门禁、二次初始化及引擎独立打包均实际通过。本轮未发现需修复的产品失败。

当前65资源的完整身份见source-build.json，内容ID为efbdf6f4055979e21eb7a3339adf0b88f9c058d5d8137c09b122259f4ad94618，实际冻结副本位于source-0.8.1。最终核验由verify-final.mjs生成verification.json；H/J旧封存另做只读复验，结果保存在commands/prior-*-seal。最终封存清单为evidence-manifest.json，清单自身不纳入其树，外部只读复验凭据位于同级20261019-apache-license-k-seal-verification.json。

本次许可决定不等于新产品正式发行、真人文学验收、平台上架或承诺特定创作效果。此前H/J结果仍对应各自冻结版本，本轮不重跑或冒称新的百章创作。维护后的当前状态入口与历史报告分开；已有作品不自动升级。
