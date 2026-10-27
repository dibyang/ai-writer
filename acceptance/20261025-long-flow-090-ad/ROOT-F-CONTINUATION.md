# F 根控制器续程记录（进行中）

2026-10-25，约12:58 UTC。整轮尚未验收或封存；不要提交、推送、发布或修改真实作品。此前 E 已发布的固定证明仍有效，不要在 F 后盲重跑固定 r322 的 E 证明脚本。

## 已完成

- f-first 正常 exit0，同一原生thread `01a172ad-3e1d-7063-a856-7dfbbcbc0c66`，完整1—30章143页及严格章节顺序均 root pass。
- f-resume 正在运行，统一从 native/f-resume/launch.json 计时。真实恢复986文件/151冻结对象，native-entry-f-resume-verification.json 已通过，勿重跑 wx。
- f-resume 完整31—60章244页，与首程合60章387页。read-proof-f-baseline-current1-60.json 和 read-order-f-baseline-current1-60.json 已通过，勿重跑 wx；这是修前主稿阅读，不能代替修后尾段。
- 根实核9/14/17/21/42证据，廖摊近邻距离冲突成立。正式报告已登记、意见采用、工作范围记入治理。main 326/60 尚保留修前正文。
- 修订 `51e5e0e9-0860-4ab7-a733-9d3ac9e08b1d`，begin真实CLI label `fr-distance-begin`。会话文件 fr-distance-session.json 含token，勿向工具输出/用户打印。workspace 为独立项目 `.writer/revisions/51e5e0e9-0860-4ab7-a733-9d3ac9e08b1d/workspace`。
- 21—60全40章已正式重登，只有21正文“两条街”→“两家门面”，其余39章正文原字节。候选当前r368/60，最后record60为r367。保留原21 `fr-distance-before21.md`。
- 原核查误将21原引文SHA变化判成事实变化，已保留失败及纠正版；纠正只在unit21/原draft/原SHA且quote仍真实匹配时更新SHA，共33条，其余完整snapshot深等于原同章。源定义/区间不能刷新。

## 第49章误判必须保留和更正

原生与根曾因35—36没买书及49“带回一本”局部原句，将49误列问题并正式采用。补查15后确认49是谈上回洗帘；15确首次洗帘、买8元册、父女看鞋页。49正确，不修改、不建49修订、不apply。已通过候选CLI fr-book-retained-corrected 正式处置retained，保留原报告/issue/采用事件。根读49完整语境和15关键原句，独立同意，见 f-book-recall-root-disposition.md；不能把误判写成修复成绩。原13optional仍可选。

## 修后阅读与验收接口

当前候选21—60修后尾段共304页正在真实逐章读。12:57 root live已读到40章130页；以实时 reading-progress 和原生事件为准，不拿本文件当最终进度。100—105分钟未完应正常保留断点、完整checkpoint及交接后退出，由根同ID再续，不强塞完成。

本次批量记录 helper fr-distance-register-v3.mjs 57 60 公开输出逐章摘要，没有逐字打印原CLI stdout。旧 verify-tail-read-after-replay 的精确stdout规则保留不改；不要伪造stdout、改名日志或冒称旧规则通过。根新增 verify-f-distance-batch.mjs：

- `boundary` 已实际通过，生成 f-distance-final-record-boundary.json，勿重跑wx。actual公开event item_326、最后record60/r367，四条完整摘要逐一匹配原CLI输入/结果及连续before/after-state SHA，验证同步helper源码并保存hash。该证明明确是复合批次边界，不是公开原始CLI输出。
- `tail f-resume[,真实后续run]` 待304页全部返回后运行，严格逐章当前精确全文且只允许该批次结束后事件。同ID续进程需 native-entry-RUN-verification.json 真正核验通过，前程exit0、原ID及prior_run匹配。输出 f-distance-post-batch-tail-reading.json，勿在未读完时预填成功。
- 最终还应 verify-read-order 对候选21—60严格顺序、verify-branch-publication label独特/begin fr-distance-begin/runs实际列表/21 60，原生prepare/commit必须真实完成。
- root新增 verify-f-published-integrity.mjs 尚未运行。它只在正式合入后校验正文仅21一个短语变化、另外59章含49原字节、前20登记项完全不变、全snapshot仅33条21引文SHA变化、32源/31区间/24绑定、8原application与旧commit前缀以及新距离application。若断言失败先查真实差异，不能为了pass放宽事实保护。

## 尚未完成

最终304页实读与正式review、prepare/commit、旧8项意见当前再次verify、旧窗口/14报告当前覆盖、第61章有效范围负例、真实CLI export及根逐章trim分隔拼接、最终source/package/installed parity、doctor、45,716旧封存只读复核、全部native退出/audit/最终文档及AD封存。先前商品源仍generation7，未确认新工具缺陷，源码未因F变动。复制重用的224项测试是原同字节记录，不冒称本轮新跑。

## 根侧偏差补记

- 误读 stderr.log 路径不存在，按提示读真实 stderr.txt；没有文件或状态变更。
- 根一次查看批次公开摘要的工具输出预算不足，显示3240 token元数据截断。未把该显示计作正文阅读；边界验收直接解析原生原始完整四条摘要并通过，未重写原事件。
- 第49章过早断言已确认，已公开纠正并保留独立原文复核说明。
- 一条口头耗时报78分钟，实际日志约74—76，已公开改为统一从本程launch计时，不据口估验收。

所有既有失败/修前报告/纠正报告不覆盖，不删除旧正文和原片段；最终仍为知情模型自检和草稿，不等于真人、市场、作者定稿或出版。
