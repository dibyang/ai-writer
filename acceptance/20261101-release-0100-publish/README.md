# 0.10.0 正式发布记录

- 发布于 2026-11-01 14:57:24（北京时间），[GitHub Release](https://github.com/dibyang/ai-writer/releases/tag/v0.10.0) ID `430413779`；线上回读为 `draft: false`、`prerelease: false`。
- 正常推送分支 `codex/initial` 至 `0309cdd97dc312a9c6bcaa53778acde3b9f2474c`，含完整验证记录；远端原位置为 `c4273d774bd93f74f5791528d35f12582fd5d68f`，为推送提交祖先。推送日志见 `push.log`。
- 注解标签 `v0.10.0` 的标签对象为 `32925fd1466739f8bc5282111318a1a47b8252df`，远端解引用为 `b7847b8ee736306e8d2fe36bf4540f92e4809307`，与干净候选包来源完全一致；标签未移动。见 `remote-tag.txt`。
- ZIP SHA-256 `8c9f9fdc7a675d65876156cb4d01dd8b5d93e1b63644d5d31e6a1a644bbd7eba`。四项发行资产上传后均回下载并逐项核对 SHA-256，见 `asset-verification.json`；草稿和正式回执分别见 `draft-release.json`、`published-release.json`。下载的 ZIP 仅保留本机，不纳入 Git。
- 干净候选包、Windows 回归、模型实跑及未覆盖范围见 [发布前验收](../20261101-release-0100-merged/README.md)。用户此前决定 Linux/macOS 实测不再作为本轮发布门槛；发布时 Windows 符号链接相关一项测试仍跳过，不能称其通过。
- 推送触发的 [分支 CI](https://github.com/dibyang/ai-writer/actions/runs/41282779694) 与 [标签 CI](https://github.com/dibyang/ai-writer/actions/runs/41282794258) 在 2026-11-02 回读均已完成且成功；两次运行各有 Windows、Ubuntu、macOS 与 Node 20、24 组成的六个矩阵任务，全部显示成功。此结论对应 CI 任务结果，不将测试中的环境跳过项记作通过，也不代替目标系统上的实际创作流程验证。

本记录在发布后补充，未修改发布标签和资产；未修改现有作品。
