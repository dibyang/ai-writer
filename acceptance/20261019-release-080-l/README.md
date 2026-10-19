# L轮：首个正式版本0.8.0发布准备

日期：2026-10-19。状态：**本地发布准备完成，最终ZIP复验通过**；未提交、推送、打标签或创建GitHub Release。现有作品未修改。历史0.8.0与0.8.1候选保持原名和封存，按作者要求首个正式版本统一为0.8.0。

## 发布资产与身份

最终候选为delivery-v2/ai-writer-0.8.0.zip，1063016字节、318个文件，SHA-256为9d0452e6d19914024880b18f9cd99ef9017f4b56337d1fc48c6961007e207eb7。SHA256SUMS.txt、release-manifest.json、RELEASE_NOTES.md与展开目录同存；初版delivery及失败原件保留，不能与最终v2混用。

65项受管资源的内容ID为1a9b7e8edcf0fb0b5bcd2c6b7e6ed732b61de78d65e6167e8f11660e34b052f8。正式0.8.0通过package.json中aiWriter.resourceProfile=apache-2.0-v1识别许可资源；旧无标记的内部0.8.0按63项原资源形状识别，内部0.8.1按其65项许可形状识别。工具不凭相同版本号追认相同构建。

构建按release/distribution.json明确列出的316项输入复制，含运行代码、七项技能、引擎、许可、产品手册、回归测试与反馈入口；根README来自release/README.md。排除作品、验收目录、.git、.idea和临时目录。公开参考索引仅以元数据镜像补齐，不把整个历史验收目录加入ZIP。source_commit为准备时基线50bbead6，dirty=true明确反映尚未提交，不能当作已打标签来源。

## 实际验证与失败修复

- ZIP由独立Python标准库读取，全部CRC、318项条目、载荷SHA和路径安全通过；隐藏技能保留。实际解压到中文空格目录后运行完整回归、doctor及CLI smoke。
- 初版root-regression为167项164通过/2失败/1跳过：旧测试同步清理遇Windows EPERM；重建测试Git状态读取超时变unknown而改变ZIP。诊断脚本精确重建失败SHA，见reproducibility-diagnosis.json；ZIP压缩本身确定。清理改有界异步重试，构建Git读取延长并在真实仓库读取失败时停止，不借父仓库身份。
- 初版package-regression为167项165通过/1失败/1跳过：测试读取了未分发acceptance内的来源索引。新docs镜像与原审计SHA相同，测试改读镜像；最终包复验另记，不把原失败抹掉。
- upgrade-smoke第一次少传--draft，返回缺参数而非授权门禁；v1脚本、产品捕获和父说明保留。v2从已实际完成的旧0.8.0更新继续，不手改state，再实跑内部0.8.1更新。两条路径更新、定制保护、幂等、规划期两写入口拒绝与check通过。
- 上述更新使用初版解压CLI；最终v2的全部65运行/资源字节与初版相同，由终审逐项证明。最终v2另跑完整回归、doctor和smoke。引擎29/29的两份实跑也与最终包引擎文件逐项绑定，不把构建脚本修复冒称引擎新功能验证。

全部命令输出和退出码在commands/；最终结果由verify-final.mjs生成verification.json。H/J/K旧封存只读复验。本轮不新增百章模型实读，不把Windows/Node24通过称为Linux、Node20或真人文学验收。

最终主项目与实际解压包的完整回归各167项，166通过/0失败/1环境跳过；doctor和实际CLI smoke通过，引擎两份实跑各29/29通过。验证错误及初版产物不删除。最终审计同时核当前源码、原始ZIP、展开目录和实跑副本，并逐项证明沿用的65资源更新证据及引擎字节一致。问题表单经PyYAML解析通过。

验证后的完整delivery-v2另复制到dist/0.8.0，SHA与载荷逐项复核，见delivery-export-verification.json；根dist被Git忽略，证据内保留同一资产。最终封存清单为evidence-manifest.json，清单自身另计，外部只读凭据位于同级20261019-release-080-l-seal-verification.json。

## 尚待正式发布动作

用户授权的提交/推送、选定最终提交后的来源重建与校验、v0.8.0标签及GitHub Release尚未执行。远端标签查询为空，未复用标签。跨系统/Node矩阵已有CI配置，但未取得本轮线上运行结果。

发布说明、更新记录、维护流程及反馈/贡献/安全入口已备妥。完整历史证据保留仓库；GitHub自动源码归档可能包含验收历史，用户应优先下载专门的ZIP。
