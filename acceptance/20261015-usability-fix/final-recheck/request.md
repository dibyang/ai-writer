验证 ai-writer 最终候选 candidate-v4.json 的实际 CLI 交付，不做新的文学审修。只读产品及三部已有作品，可写本阶段 final-recheck/ 和必要的 .tmp。无需读取以前运行的聊天日志或复制长篇报告。

1. 通过实际 CLI init 在本阶段的 new-work 创建一个空 essay 作品，再用它的随附 CLI init 在本阶段 sibling-work 创建另一空作品。核对两者含六份用户文档、LICENSE.md、三份历史/当前来源清单、三份上游 LICENSE 及去味原文；重新计算 usability-sources.json 中所列两个文件的 SHA-256。运行随附 doctor，预期通过。不要修改产品或绕过缺文件错误。
2. 对 acceptance/20261015-usability-fix/works 下 雨后失物、借一把椅子、字放回格子里，分别用最终随附工具执行 doctor --project、status、check、record --project 路径 --help，并导出到本阶段 exports 下三个不同新目录。确认登记单元分别为 3/1/1、修订号 12/3/3，未登记稿/来源漂移为空，导出 SHA-256 与 novel-b/genres 的先前对应导出一致。导出只能新建目录，禁止修改作品状态、正文和旧导出。
3. 检查 candidate-v4.json 所列产品文件的哈希未改变。仅把本阶段真实命令、退出码和结构化核对结果保存到本阶段，写简短 result.md，列出失败（如有）和范围。不要为了格式反复读取整份日志或生成重复报告，不运行额外代理、不提交/推送/发布。

这是工具维护复验，不触发新创作；不要将机械一致性称为文学质量通过。预计 3–5 分钟，依 AGENTS 持续反馈。
