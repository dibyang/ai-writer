# M轮：0.8.0首次正式发布

授权：本地提交发布准备及完整验证记录并推送；核对跨平台CI，修复后才打v0.8.0标签并发布。本轮不修改现有作品。

L轮已封存的准备记录保持原始字节。本目录保存线上CI、最终提交、干净构建、发布资产和发布回执；0.8.0已正式发布，匿名下载核验通过。

首次核查发现此前线上工作流在Windows checkout阶段失败：历史记录路径含保留名aux；没有运行测试。修正为非cone稀疏检出产品源码、技能、文档和tests/fixtures，排除acceptance及works，历史证据仍保留在Git中。关闭矩阵fail-fast以取得全部四组结果。此问题与后续测试结果分开记录。

首次修正后Ubuntu两组已进入测试，Windows仍拒绝把保留路径写入索引（即使不展开文件）。本机隔离工作树复现，并验证仅为稀疏检出的临时环境关闭protectNTFS、启用longpaths即可正常checkout；CI相同设置只应用于一次性Windows runner，仍排除历史路径。没有改动本机主仓库配置或历史文件。

第二次CI发现Windows/Node20不会展开测试脚本通配符，原npm test在启动时失败。新增scripts/test.mjs显式枚举对应目录内的测试文件，主套件与内置引擎均通过同一入口调用Node测试器；该入口也列入发行清单。初版delivery及其包测试保留为修复前记录，最终发行另建delivery-v2。

## 最终发行

- 发行提交：`27a20edd7db6234a6651d647d5c626808e45cd24`。准备提交`863d90a4`、检出修复`ef0c7867`及最终测试入口修复均已推送。发布后的记录/说明补交不移动该标签。
- 标签：`v0.8.0`；注释标签对象`be204dce48645f8c6e52fcb8193a4236679194ec`；[首个正式版本](https://github.com/dibyang/ai-writer/releases/tag/v0.8.0)，发布ID为417121876，非草稿、非预发布，设为最新稳定版。
- 最终资产：`delivery-v2/ai-writer-0.8.0.zip`，1,064,059字节、319个文件；SHA-256为`cf6a30bf7ddfc3f79eab3b2abdff3bb40568bd3ae6fab7a72ec2c7541180d0ce`。
- 内容ID：`80bbd61092bbd0acf91cb1a7337f358e9f5dadc986357f558ae076ce3d2c6aac`；Apache-2.0资源配置，65项受管资源。从同一提交的干净稀疏工作树构建，`dirty=false`；ZIP、校验表、外部清单和发行说明四附件均上传后核对GitHub服务端SHA，再匿名下载逐字节比对。最终下载副本见`public-downloads/`。

## CI与最终包验证

提交[CI 39230635249](https://github.com/dibyang/ai-writer/actions/runs/39230635249)和标签[CI 39231533859](https://github.com/dibyang/ai-writer/actions/runs/39231533859)两轮四组均成功；逐步骤回执及八份完整日志分别保存在ci-*文件。

| 环境 | 主回归 | doctor | 内置引擎 |
| --- | --- | --- | --- |
| Windows / Node20 | 167通过、0失败、0跳过 | 通过 | 29/29 |
| Windows / Node24 | 167通过、0失败、0跳过 | 通过 | 29/29 |
| Ubuntu / Node20 | 163通过、0失败、4项Windows专用测试跳过 | 通过 | 29/29 |
| Ubuntu / Node24 | 163通过、0失败、4项Windows专用测试跳过 | 通过 | 29/29 |

实际最终ZIP独立解压至包含中文及空格的新路径，Python zipfile核对CRC、每个载荷SHA、安全路径及隐藏技能。随后包内完整npm test：167项中166通过、0失败、1项本机符号链接环境跳过；doctor通过，引擎29/29，实际CLI init→workflow→plan→context→record-template→record→check→export通过。`commands/`保留完整输入输出和退出信息，`smoke-final/`保存合成样例最终文件、状态与导出；该样例只验证文件流程。

发布前门禁见`final-verification.json`；服务端上传核验见`upload-verification.json`；发布回执见`published-release.json`；无凭据下载、标签剥离提交及四附件逐字节核验见`public-download-verification.json`。部分早期命名为final的轮询仍显示进行中，最终标签状态以`tag-ci-final-v2.json`及`tag-ci-jobs-final.json`为准。

## 边界与记录完整性

本轮未修改现有作品，未新跑百章文学创作，也未将L/H/J/K旧结果移到新身份；历史百章证据仍对应其冻结构建。L封存1310个文件只读复验通过。Windows本机符号链接跳过与CI实际执行结果分别列明，不当作本机通过。修复前delivery、其完整包测试以及三份线上故障日志均保留，不能作为最终发行产物。

`github.mjs`仅调用本仓库端点，凭据从Git凭据管理器读取至进程内使用，不写入文件或日志；匿名下载不使用凭据。初次仓库根接口多了斜杠导致404，保留repo.json，正确端点在repo-v2.json返回200。所有下载资产与证据树以evidence-manifest.json封存；清单自身哈希另存目录外复验回执。
