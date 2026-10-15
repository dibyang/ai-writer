# 《末班寄存柜》自有旧稿导入与文件恢复结果

2026-10-15。本次只覆盖指定两章导入、第3章原创续写与1–3章知情模型自检，不是整部长篇验收。

| 阶段 | 实际结果 |
| --- | --- |
| 初始化与索引 | 根工具初始化 `works/导入恢复`，title=末班寄存柜、kind=novel；随后全部使用该作品随附工具。long-enable从revision 0迁移为schema 2、revision 1，保留自动备份；保存定位、文风、权威规则、角色卡、1–3章分卷契约。import-index按指定清单冻结2章，角色为 `own-work-continuation-baseline`，不是对标。 |
| 读取 | 指定原文两章均实际完整阅读；import-next取到各章后又完整实读导入正文。两章各自在未登记前重复取章，分别仍返回unit 1、unit 2，同一路径与哈希，没有提前跳章。读取与索引分开记录。 |
| 登记 | 各章均保存细纲，取得并阅读context，保存record-template，填写真实summary/changes及本章引文证据，再record/check后进入下一章。第1章revision 2，第2章revision 3。物证交接登记 `previous_holder=何素琴`、新保管人郑来顺；未填箱主秘密。 |
| 续写 | 两章登记及import-status核查后，status恢复到next_unit=3；用recall、已实读正文和文件context恢复信息边界，按plan/context/template→正文→实读自检→record/check完成《第三章 原图还有吗》。正文474汉字，含标点不含空白558字符，均排除标题；revision 4。旧照比对受分辨率和遮挡限制，实际发出原图请求但尚无回复，没有定同箱、箱主或小满隐情。 |
| 连读与导出 | 最终1→2→3章完整连读后，保存[实读报告](../works/导入恢复/审查/1-3连读-20261015.md)，以 `model-self-review` 登记真实正文哈希。check：3章、findings=[]，有效覆盖1份、过期0份、欠审窗口为空。导出到全新同级目录[导入恢复-v1](../works/导入恢复-v1/manuscript.md)，包含manuscript.md与manifest.json，状态 `draft-export`。 |

## 哈希与覆盖核对

第1、2章原文件、冻结副本、导入正文已逐字节比较，均与指定provenance一致；原文未润色。冻结位置见作品 `.writer/import.json`。最终import-status：total=2、registered_units=[1,2]、baseline_registered_through=2、unchanged_baseline_units=[1,2]，unread_or_unregistered、changed_originals、changed_copies均为空。

| 对象 | 实测SHA-256 |
| --- | --- |
| 第1章原文／冻结副本／导入正文 | f4645ec0471b98527e14ecb5436abfd1eb1d58fe1ac15f2abd6d75c6d2f62424 |
| 第2章原文／冻结副本／导入正文 | f5824180fe99bdd92ab9bdbd9f4bde71036b48be2393597aae0f3a616ae40c94 |
| 第3章最终正文 | 99ba565500a803dac8f625ecf4b2cf1b4aed762f9020df7b9b184c724bc5be28 |
| 导出manuscript.md | 6ad7607ba3152c374b433b387b614e75c25374fe002cdf9c899a115fe381fe7f |

导出后三章源哈希均与manifest一致，合订稿按1–3顺序包含各章完整正文内容，合订稿实测哈希等于清单哈希。最终status：schema 2、revision 4、next_unit=4，stale_units与changed_sources均为空；没有创作第4章。

## 失败、未定与未覆盖

本轮执行未发生命令失败或状态/哈希拒绝，未确认产品问题；没有绕过保护或手改state。第3章登记前修正了动作与指代，并重读最终稿；第1–2章始终原样保留。第3章登记后出现的1–3欠审窗口已在实际连读并登记review后消除。

箱主、箱内、是否同箱及小满路线/湿衣/工作情况未定；原图请求尚无回复，T003保留partial与到期回查，未强行resolved。登记/check只证明文件追踪与覆盖，不证明文学质量验收；自检报告来自同一知情模型，没有真人盲读。未覆盖全书、跨卷长期恢复、故障注入、独立清空模型会话或跨机迁移。

未读取其他验收作品第3章、续写交接或剧情答案；没有修改工具/技能，没有另派代理、付费调用、上传、提交、推送或发布。作品仍是本地草稿。实际事件以外部执行器留档为准，本文件只记阶段结果。
