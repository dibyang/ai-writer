# F轮0.7.2切换与百章修订区doctor实际验证

状态：隔离候选实跑完成；不是正式发布或最终产品验收。主任务全套测试状态未在本进程确认。本进程只修改本campaign记录与work，不修改主源码或冻结源。

读取REQUEST/COVERAGE、D交接md/json、source-build-v2和branch-doctor-before/before-v2/after后执行。D交接0.7.1 / revision379 / generation2与本次0.7.2是明确版本切换，旧记录保持原样。

|实测阶段|结果|
|---|---|
|外部新进程初始status/workflow show/doctor/identify/check|100章，state精确匹配D交接；安装包为0.7.1，所有读取state不变|
|外部0.7.2 update-plan与显式update|来源sources/package-v2，documents=[]；真实F原话与实际来源SHA；revision379→380，generation2→3；无enable、无schema迁移|
|原输入立即重试|两份input.raw.json原字节相同；幂等返回，state原字节相同，无第二次revision/generation推进|
|新随附入口help/doctor/status/discussion/check/identify/compare|全部成功；安装包与package-v2 same_content=true，differences=[]，根定制不覆盖|
|临时workflow与begin|仅discuss/plan/revise，revise100—100，draft=null；代理执行范围具体化，无剧情选择；workflow推进至381，begin不推进业务revision|
|实际分支doctor|外部主0.7.2入口，新session记录器repair-upgrade-branch，默认main；ok=true，资源为父work与父.writer/tool；build_matches=true；分支无自带工具|
|错误/真实令牌resume|错误为REVISION_OWNER_REQUIRED；正确恢复原workspace/base_revision381；base.json、父/分支state原字节不变；实际分支status/context/check成功|
|abort与暂停|明确abort无改稿诊断候选，保留全分支/备份；只改协作元数据；workflow回paused，discuss/plan，两范围null，revision382|
|最终随附doctor/status/check/context及封存|全部ok；100正文、完整units/snapshot、全部原source_hashes和40项根定制（39项AGENTS/技能/手册及writer.json）完全相同；主源码与两份冻结源未变|

当前schema6 / revision382 / generation3 / 0.7.2。state SHA256=c1f622c00c42bf5fa5fdf040d932ee87f41da58d77113bbf94d45d2422a00f29。

内容ID=8f406f43e2e1bb3ee1a865fa77b947fecf39c8bed4d29c1fb3e20c8f07f71cc8；runtime_id=9f0f510436b85f240e834347defa7b916fc6a4e13e4010c0fe0f40f2c9be0d94；loaded/execution build_id=14639e86b1dce2ed6033f3a3c661517ebb4223ed1ec5db8b9e644ee62f9f02bf。三者口径不同，值及匹配布尔值均来自实际工具返回；未相互替换。

诊断ID=7fc0be19-6e2f-4822-a3b5-8eafb88c8429；base_revision=381；workspace=D:\work\other\ai-writer\acceptance\20261018-hundred-f\work\.writer\revisions\7fc0be19-6e2f-4822-a3b5-8eafb88c8429\workspace。已aborted，无活动令牌；原始令牌仅保存在本地revision-begin.json及原输入中，不删除。没有修改正文、rewind、record、prepare或commit。整个分支受管基线文件均与base.json相符。

共33条实际新产品CLI进程，所有argv、输入、原始stdout/stderr、父或目标state前后字节、构建观测见command-index.json和../commands。它们不是另一Codex会话。2次命令形式错误（workflow缺show、help带记录器project）及1次预期错误令牌均保留；3次记录脚本错误（git启动、Git路径引用、help文本解析）单独留档，不冒充产品缺陷。本次无新确认产品缺陷。

旧诊断三类严格分开：从C复制旧封存分支marker位置不匹配的REVISION_CORRUPT是正确拒绝；真实D分支缺.writer/tool导致ENOENT是此次主任务修复的问题；0.7.2读取绑定旧构建的D分支build_matches=false是正确保护。原档案本进程未操作、未改元数据、未拷运行包。

最终state只变化revision、governance/governance_binding/governance_events、operations、tool_control；其他文学与来源状态完全相同。既有工作文件仅7项变化，均为state或包内更新文件；新增协作/事务/备份材料完整保留。check为mechanical-only、literary_quality=unreviewed，rolling_review valid51/stale62原样保留，不新增文学审查。

下一实际进程draft-e必须从本交接恢复；按当时真实state和F原话重新登记有限101—103，随后下一进程104—106，每章3000—4000汉字并报告非空白字符。D的scenario-plan仍是计划，未知与物件/知情边界见D报告；本阶段不新增章纲和正文。四处旧章48/54/66/71候选尚未执行，续至106后另建正式保护分支及逐章实读/CAS。不要再使用379/gen2生成新输入。

未联网、未启动其他代理/Codex会话、未提交推送或发布。主任务全套测试未确认，来源仍为本地0.7.2候选。本次不运行或冒称仓库全套验收。
