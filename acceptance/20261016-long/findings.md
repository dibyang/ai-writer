# 实跑发现与处理

本轮发现与处理记录；最终范围和制品核验见README及verification-final.json。

## 正文与追踪

- session-a 自检修正第3章拖鞋部位措辞与清点提问衔接，发生在该章登记前，原始过程见该阶段日志。
- session-b 自检发现第7章双手抱托盘后直接记字，缺少腾手动作；该章已登记，因此按正式 rewind 回退、补写放稳托盘及托本动作、重登第7章并重新读取第8章上下文。已核对最终正文、revision11检查与checkpoint/b。
- 主会话实读第6章末：“许澄桌下的抽屉仍锁着，铜钥匙也仍在她内袋里。”最近的人名与“她”容易让读者把钥匙误归许澄，与本章及前章仍由林岚保管的事实产生歧义。通过指代/当面复述与具体物件归属两项核对确认；revision已改成“林岚包内袋”，不新增交接。最终revision19、正文哈希及52条账本引文均核对。该错误体现哈希校验不能代替语义审读。

## 工具展示修复

session-b真实报告指出：1–6审查报告修订后重新登记，已有当前有效覆盖，check却仅显示stale=1；无法区分历史失效记录和未恢复的阅读覆盖。revision后同样出现1份有效新报告覆盖1–8、4份旧报告失效的状态。

保留stale总数及全部旧记录，新增stale_with_current_coverage/stale_without_current_coverage；只有单份当前有效报告完整覆盖旧范围才算已有覆盖，不能拼接分段报告。pending_windows仍描述每三章的滚动连读欠覆盖，不改变哈希有效性、正文保护或导出条件。说明同步docs/long-form.md。

回归覆盖报告自身修改、旧章回退重登、分段报告不能替代连续阅读、第一章索引不变和历史保留；修改前17项中2项因缺少新字段失败，修改后17项全过，原始输出为review-status-before.txt/after.txt。实际作品刷新后valid=1、stale=4、with=4、without=0、pending=[]；state、8章正文及journal均与checkpoint/revision字节相同，详见tool-refresh/result.json。

## 第三卷复核

- session-c第11章自检发现自写旁栏时长数字与“半小时”不一致，在登记前修正，见原始events。第12章初稿565汉字、最终573汉字，以最终文件和哈希为准。
- 主会话独立读正文和账本确认第9章离场/见证不一致：许澄端册离开、林岚随行，随后陆衡重锁；账本却称两人亲见重锁。session-c最终revision23仍保留该稿，机械check和三次模型review没有发现它。原稿、当前知情记录和第9章journal已冻结在parent-audit/，另有checkpoints/c。continuity-fix正式回退9后最小修订两处：许澄端稳册子等在门边，陆衡当面重锁收钥匙后共同离开；9–12重登至revision28。主会话完整复读最终12章并绑定字节哈希，报告见parent-audit/final-review.md。
- continuity-fix补充新旧账本比较发现重建时遗漏T_MISSED第11、12章两条“仍未知、不入核验单”的证据锚点。语义与正文未变，但证据丢失不能接受；保留失败输出与revision28导出，正式rewind11并重登11–12至revision31，补齐锚点后15项补充核验通过。最终主核验还逐条检查修复前T_MISSED引文仍存在。没有手补state/journal。

## 验证辅助过程

- session-a 开场重复的只读 Git 预检中两次没有完整返回记录；27 次 ai-writer 调用完整留档。缺口不补造成功记录。
- session-b 哈希清单辅助命令将目录当文件读取，报 EISDIR；按普通文件筛选后修正。属于验证辅助命令问题，不能归为写作工具损坏。
- revision误给record-template传入--max-chars，CLI拒绝；去掉不支持参数后成功，原始错误见revision/errors.md。工具保护正常。
- session-c辅助CLI封装给help自动附带project参数而被拒绝；第9章尚无章纲时context拒绝。原始非零输出保留在session-c/cli/007与012，建立章纲后继续，未绕过保护。
- 主会话refresh-tool.mjs初次将docs/long-form.md误定位到.writer/tool/docs，ENOENT中断；保留已复制模块的旧版备份，修正为作品docs目录，从中断点恢复。完成后以checkpoint/revision核对正文、state和journal未变。此为验证辅助脚本错误，不是产品刷新功能缺陷。

异常保护探针4组、19次真实CLI均按预期通过，且主作品未变；见guard-probes/result.json。最终产品候选55项工具测试、doctor、29项内置引擎测试通过；最终作品制品核验另见verification-final.json。以上不代替文学与现实专业流程验收。
