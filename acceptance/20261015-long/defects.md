# 本轮发现与处理

以下为观测记录，原始CLI事件见各阶段events.jsonl，最终测试日志见workspace-tests-final-v2.txt。

| 问题 | 证据/原因 | 处理与核验 |
| --- | --- | --- |
| 长篇每章保存整份前后快照，历史重复增长 | 原格式100单元约1.69MB；时间线每章被复制 | 显式备份迁移schema2、可逆差量与单文件提交点；100单元同数据追踪约0.176MB，恢复/回退/导出均验证 |
| context和status默认读入完整当前状态 | 长篇角色/时间线多时预算增长，status又把完整状态装回会话 | 长篇status默认compact，context按卷/章/人物/线索取段；必需项不丢，可选12条；遗漏ID和证据省略数量公开 |
| 作者真相、读者/人物所知和物证保管易混合 | 原字符串列表无稳定ID与证据约束 | ledger及知识分区、正文引文哈希、不可变观察、custody/previous_holder；回归覆盖缺引文、未来证据、错保管人和账本误删 |
| 交接字段层级不易发现 | novel-stage-a把previous_holder写入custody，record被拒绝，状态未推进 | 同一模板修正字段位置后重试成功；补同级JSON示例，错误指出ledger.ID.previous_holder路径与当前保管人 |
| JSON对象键重排使迁移后的链误报不一致 | 新增“旧稿角色键顺序变化”测试先复现失败：差量链与当前快照不一致；值相同但序列化顺序不同 | 改用Node内置isDeepStrictEqual比较语义结构，保留数组顺序；同一用例转绿，最终全回归40项，无手改状态 |
| 嵌套作品目录启动Codex失败 | novel-stage-b的shell及写文件均报helper_unknown_error/setup refresh；进程exit0但没有推进正文 | 保留失败日志；从已可用根目录显式--project恢复，novel-stage-b-retry完成4–6章；不改全局配置、不关闭sandbox、不把失败算通过 |
| 收尾时TLS断流 | stage-b-retry原始事件有tls handshake eof、WebSockets→HTTPS与等待网络 | CLI自动恢复后完成结果落盘和导出核验；保留重连事件，未重置/重装环境或删作品状态 |
| 剧本两个可见动作缺口 | “让一步”与挡路方向混淆；23把椅子只说靠墙，清场缺少位置承接 | 只改为“挪一步”并补清23把已在储物间；两次真实rewind/重登，旧审查失效为stale，重审绑定新哈希；最终v2导出，旧v1保留 |

这些修复不证明小说语义永不出错。长篇合成容量、六章语义样稿、导入样稿、剧本与历史散文回归，以及真人/市场/排演的未覆盖范围在主报告分别列明。
