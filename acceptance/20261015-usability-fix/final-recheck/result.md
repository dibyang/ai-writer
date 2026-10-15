# candidate-v4 CLI 交付复验

结果：本次 CLI 交付复验通过。实际 CLI 命令 19 条，非零退出 0 条；结构化核对 53 项，失败 0 项。

- 通过实际 CLI 创建 new-work 空 essay，再通过其随附 CLI 创建 sibling-work 空 essay；核对六份用户文档、主 LICENSE、三份来源清单、三份上游 LICENSE 和去味原文，重新计算两项来源 SHA-256，并运行各自随附 doctor。
- 三部既有作品均使用 new-work 的最终随附 CLI，执行 doctor --project、status、check、record --project 路径 --help 和 export；新导出仅写入本阶段 exports/ 的三个新目录。
- 核对登记单元与修订号 3/12、1/3、1/3，未登记稿和来源漂移，以及与 novel-b/genres 既有导出的 SHA-256 一致性。
- candidate-v4.json 所列 60 个产品文件前后核对；三部作品全部现有文件和三个旧导出均做前后字节哈希核对。

失败：无。

范围：这是工具维护的实际 CLI 与机械一致性复验；导出保持草稿状态，不代表文学质量通过、真人盲读或市场验证。本次未修改产品、作品状态、正文或旧导出，未运行额外代理，未提交、推送或发布。

证据：commands.jsonl 保存实际命令、工作目录、时间、退出码及原始 CLI 输出；checks.json 保存结构化核对；protected-before.json / protected-after.json 保存保护范围的前后哈希。
