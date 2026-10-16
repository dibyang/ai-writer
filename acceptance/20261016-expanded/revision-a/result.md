# 第一轮旧章修订与真实Codex恢复验证结果

本轮完成。作品：`acceptance/20261016-expanded/works/潮汐信号`。本次在真实Codex主会话中实读旧稿、执行实际CLI并恢复追踪；未调用子代理，未伪造CLI输出。

初次status实得revision **13**、已登记**1–12**、next 13、无漂移或未登记稿。权威规则含旧牌面/绳色，第1章source_hashes已经消费它，故正式执行`rewind --from 1 --expected-revision 13`，真实回退**1–12**，revision 14；按章plan/context/record-template/record后最终revision **26**。没有复用旧revision或source_hashes，没有手改state/journal。

## 逐章正文

|章|改动|最终汉字数|
|---|---|---|
|1|原字节保留；因第1章已消费权威规则而重登。|1554|
|2|牌面改西埠四号泊位，童年旧名联想到海湾西侧；东侧发现位置和箱外标签保留。|1551|
|3|标题、文件名及唯一原钥匙两处标识改蓝棉绳；未添加换绳事件，旧路径不在现行账本。|1579|
|4|原字节保留；灯语未核、原带交接/准备/短听/停机完整。|1573|
|5|向周砚首次完整告知的牌面和复述同步。其他红印保留。|1629|
|6|通知改西埠线；补足旧名带西、现路向东的查问因果，仍按现路寻找信息，不宣称到旧址。|1606|
|7|向唐穗首次完整告知的牌面及询旧址称呼同步，原行程保留。|1584|
|8|旧地名与询问同步；保留现六号寄存，去掉旧牌与现厅同为六的数字联想，改为想沿编号找到四号。|1626|
|9|【实读发现修复】14:40后原“还有二十来分钟”改为明确15:20以后才约、算上走路仍来得及。15:00出发与17分钟路程不改。|1553|
|10|维修图与查访方向同步西埠；一至六泊位示意仍六处，不替广播定年。|1642|
|11|牌面口述及图示转述同步；【实读发现修复】第3日客户“前天”改“昨天”，不补造第1日帮工。|1591|
|12|原字节保留；主线partial/due12及所有来源缺口、尚未发生约定保留。|1650|

第1、4、12章逐字节一致；全部12章在回退范围内完整重读、取得新context/template、顺序重登，完成后再次按1–12连读最终稿。完整原句对照见[manuscript-diff.md](manuscript-diff.md)，路径与哈希见[manuscript-line-diff.json](manuscript-line-diff.json)。每章均满足1500–2000汉字。

## 证据、来源及账本

20个ID、113条证据、119项消费来源哈希核验成功；每章原新增ledger字段、人物所知和同章证据逐项对齐，所有原新增证据数量一致。原引文仅按授权标识和第6章因果变化更换同章文本，其余引文逐条保留。全账本语义表和字段改前改后见[ledger-diff.md](ledger-diff.md)，机器明细见[audit.json](audit.json)。比较按字段和值，不按对象键顺序。

T_PRIVATE intentional-open、原4条证据和后续人物未知边界保留，无author_truth。T_LAMP pending/due9；T_SIGNAL partial/due12，尚缺声音连续来源、班次、剪者与消息接收证据；T_TAPE partial/due18和P_TAPE active/due18保持。物件实际交接及未交接边界完整，没有把第4日看箱/对单约定登记为已经发生。

## 审查与导出

当前全稿报告保存在作品[审查/revision-a-0001-0012-全稿知情复核-r26.md](../works/潮汐信号/审查/revision-a-0001-0012-全稿知情复核-r26.md)，真实review引用`.writer/reviews/290c3194-d65e-44e1-a73e-b5b29867464d.json`，覆盖1–12。四个窗口1–3、1–6、4–9、7–12全部覆盖：valid 1、旧stale 5但均有当前覆盖、pending_windows空。旧报告及review均原样保留。报告性质为模型知情自检。

最终status/check/doctor均退出0；无漂移、无未登记稿、check findings空、doctor errors/warnings空。

导出：[export/manuscript.md](export/manuscript.md)；[export/manifest.json](export/manifest.json)。恰好1–12，manifest绑定revision **26**，excluded_drafts与warnings均空。已按最终正文顺序重建合订文本逐字节比对导出并校验所有单元/来源哈希。合订稿SHA-256：`bbe5b7e36d3c8a1425ebd8c4ab2a35586515277762e2372e622bbbf42cc51de0`。导出仍是草稿。

## 证据留存与错误记录

修前作品、state、全部journal、已消费设定/卷纲/章纲、审查报告/review、原始session-a/b/c登记输入及日志，共685文件，保存在[before/](before/)，哈希清单[before-manifest.json](before-manifest.json)。旧字样在历史日志、输入和备份中保留。原journal、旧review、旧报告和作品内工具逐个核验未改。

真实产品CLI共**64**次，全部退出0；完整executable、argv、cwd、开始结束时间、退出码、stdout、stderr均在[cli-index.json](cli-index.json)及[cli/](cli/)中。工具显示输出截断不影响落盘原始日志。辅助审计曾因把T_PRIVATE正文哈希变化当语义变化退出1，失败证据保存在attempts/；修正阶段脚本后完整核验退出0。详见[errors.md](errors.md)和[script-logs/](script-logs/)。

章纲均通过plan落盘；除授权字样/地名因果外，第4章起点明确为等电扇继续检查，第12章把旧计划“页号在照片外”对齐正文实际可见纸边缺角无页号。未改变正文事件。

最终交付核验：[delivery-verification.json](delivery-verification.json)。未改产品，git产品差异检查退出0；保留初始已有.idea/和acceptance目录状态。未提交、推送或发布，未写第13章，所有本轮辅助文件/日志/备份/导出均使用完整acceptance/20261016-expanded/revision-a路径，根目录不存在revision-a。
