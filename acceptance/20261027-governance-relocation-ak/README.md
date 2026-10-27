# 0.10.0 治理规划旧正文路径兼容验证

## 问题和修复

已登记正文分卷后，治理阶段的 `planning.*.refs` 可能保留迁移前正文地址。原 `workflowData` 直接读取旧路径，使 `status`、`check`、`source list` 等在项目加载时报 ENOENT。现在治理校验通过既有迁移事件解析路径，保留规划引用原字节，并继续在旧地址被重新占用时拒绝；路径安全检查仍生效。没有修改真实作品、历史记录或其 state。

`reproduce.txt` 是修复前合成样本的同栈 ENOENT；`targeted-first.txt` 是修复后测试自身错误地假设 status 返回字段所导致的失败，已更正；`targeted-second.txt` 是更正后的通过记录。`fixture47.log` 是第一版历史样本缺少事实卡的失败，现场保留在 `work/`；v2 增加合成事实卡后通过。

## 隔离验证

- `fixture47-v3-result.json`：用旧 ai6 初始化 47 篇合成历史散文，34 条规划引用、5 个卷目录，迁移到 schema 7；47 个正文哈希及快照保持、正文复制数 0。
- `commands/old-*`：旧安装的 `status`、`check`、`source list` 三项退出 2，状态不变；候选外部入口的 `tool update-plan` 与 `tool update` 通过，更新后作品安装入口三项退出 0。`upgrade47-result.json` 记录 47 篇哈希、引用、快照与验证目录无正文副本。`old-task.*` 和 `new-task.*` 是任务视图旧失败、新成功对照。
- `history-audit.json`：迁移及更新前后的 47 个单元记录除 draft 外相同，47 个 journal、3 个治理事件哈希有效；来源与历史索引相同。`frozen-source-result.json` 是另一个含真实冻结对象和事件的合成回归，其冻结版本与事件在迁移后保持，check、source list 通过；`frozen-source-work/` 是经字节核对的证据副本，与工具更新的不复制正文要求无关。
- `tests/relocation.test.mjs` 新增旧引用读取、原引用不变、路径穿越拒绝及旧地址遮蔽拒绝测试；另有既有迁移、中断恢复、历史审查、来源和工具更新回归。
- `package-verification.json` 核对固定候选来源与载荷；源码和 ZIP 解压包的完整测试分别为 256 项、255 通过、0 失败、1 跳过（Windows 测试账户未承诺符号链接权限），两处 doctor 均通过。`build.log` 和各测试/doctor 日志保留退出结果；未运行 Linux/macOS CI。候选不是正式版，来源为带未提交修改的工作树。

`采用方案.md` 仅供后续作者授权后参考；合成 47 篇与真实现场的版本代次及材料不同，不把样本成功称为真实作品验收。旧版本被拒绝和更新前后所有命令输出均保留。没有提交、推送、发布或自动安装到真实作品。
