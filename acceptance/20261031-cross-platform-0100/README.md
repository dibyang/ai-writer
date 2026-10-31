# 0.10.0 跨平台验收记录（未完成）

## 身份和边界

- 源码提交：`681659a34deda5df914d039ae07ac9209d63b090`。
- 从本机隔离的干净稀疏检出构建；排除 `acceptance/` 和 `works/`。隔离副本使用 Git 对象共享，只是本机临时材料，不是独立备份。
- 候选 ZIP：`candidate-clean/ai-writer-0.10.0.zip`，SHA-256：`e27e2bb86dddd385f366bdbcd0d7df84d654e4ded0560727b45956fee793d23c`。
- 内容标识：`0e43580b6c1b38ec873e905071851f7857f2dfd72052489241388c5f08521a0f`；包内清单记录源码提交和 `dirty: false`。该内容标识与前一轮最终候选一致，ZIP 哈希因来源信息不同而变化。
- 本轮不修改现有作品，不推送。真实 Linux、macOS 测试尚未执行，不能据此认定跨平台验收或发布前验收通过。

## 环境与准备

本机为 Windows，未发现 Docker、Podman 或已配置的 WSL 发行版。项目 GitHub Actions 定义 Windows、Ubuntu、macOS 和 Node 20、24 的矩阵，但该配置不等于此提交已运行或通过。首次创建本地副本时 Git 的 shell 因沙箱限制失败；随后使用隔离执行成功。首次稀疏检出遇到历史文件中的 Windows 保留名称，在新建副本中按现有 CI 设置 `core.protectNTFS=false`、`core.longpaths=true` 后成功；上述设置没有应用到原仓库或系统全局。

## Linux 和 macOS 后续执行

在每个真实系统上分别使用 Node 20 和 24，将上述 ZIP 放到全新的隔离目录，确认 SHA-256 后解压。切勿在现有作品目录中运行。分别保存系统信息、Node 版本、三项命令的完整输出和退出码，并回传记录；命令均须在解压得到的 `ai-writer-0.10.0` 目录运行：

可使用本目录的 `run-unix.sh` 辅助保存日志：`sh run-unix.sh /绝对路径/ai-writer-0.10.0.zip /绝对路径/尚不存在的结果目录`。脚本会检查固定的候选包 SHA-256，并拒绝覆盖已有结果目录。脚本本身尚未在 Linux 或 macOS 上验证，其成功执行及日志也只能证明实际运行到的命令结果。

Windows Git Bash 下已做 `bash -n` 语法检查，并用本 README 作为错误输入验证哈希不匹配时退出码为 2、未创建结果目录，见 `shell-negative.log` 和 `shell-negative-result.txt`；这不是 Linux/macOS 兼容性验证。

```sh
uname -a
node --version
npm test
npm run doctor
npm run test:engine
```

分别记录四组（Linux/Node 20、Linux/Node 24、macOS/Node 20、macOS/Node 24），包括失败和跳过，不以某一组结果代替其他组。包的哈希可通过 `shasum -a 256 ai-writer-0.10.0.zip` 核对。除这三项回归外，还需按发布前验收要求在目标系统验证两条实际使用主路径；脚本绿灯不等于完整产品验收。

## Windows 候选包回归

对候选 ZIP 解压后的内容执行三项命令，并保存全部输出与退出码：`candidate-verification.json` 记录了 ZIP 哈希及解压后清单中 336 个文件的逐项哈希核对，全部匹配。

- 首次在受限沙箱中执行：`npm test` 共 257 项，241 通过、14 失败、2 跳过，退出码 1；失败涉及迁移所需硬链接的 `EPERM`。见 `windows-npm-test.log` 和 `windows-progress.txt`。
- 同次 `npm run doctor` 退出码 0；`npm run test:engine` 29 项通过，退出码 0。见 `windows-doctor.log`、`windows-engine.log` 和 `windows-progress.txt`。
- 在具有本机文件操作权限的隔离环境中，对迁移和任务视图执行针对性重跑，21 项全部通过，见 `windows-relocation-elevated.log` 和 `windows-relocation-elevated-result.txt`。该对照支持先前失败由沙箱权限导致；保留失败证据，不将其涂改为通过。
- 同一解压候选包的完整工作区重跑：257 项，256 通过、1 跳过、0 失败，退出码 0；见 `windows-npm-test-elevated.log` 和 `windows-npm-test-elevated-result.txt`。Windows 的符号链接保护测试因本机权限限制跳过，须在目标系统继续覆盖。
