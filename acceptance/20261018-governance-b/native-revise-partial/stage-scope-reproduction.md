# stage保守范围行为：最小复现

场景：主稿6章均消费RULES_V1，新版从2持续生效，第一章保留旧规则；真实impact列direct_consumers1–6和possible_indirect_from=1。

1. 输入inputs/workflow-revision.json登记2–6。
2. inputs/freeze-rules-v3.json及impact-rules-v3.json经真实CLI取得revision26/from2/historical的impact。
3. inputs/stage-rules-v3.json提交完整8项实读与报告，返回ACTION_OUT_OF_SCOPE，要求revise1–6。准确产品JSON：../commands/native-two-stage-rules-historical/stderr.raw.txt；前后state均cdf6161115acf5896344c9ec85bac0bfbe9f47fb58df3c55996cb8a1daf24900。
4. 未改impact协议字段。依据用户“根据消费关系”的授权，真实workflow登记1章为原字节保守复核前缀，重新impact后stage成功；requested_from仍2，blocked_range1–6。

分类：文件消费关系引出的保守范围问题/限制，不能声称产品能按语义缩到2–6。影响是必须重登未变第1章；没有观察到正文或旧版本丢失。未改源码或绕过pending。若产品预期应允许from2且仅2–6授权，应由后续主维护会话判断缺陷；本会话仅留复现。
