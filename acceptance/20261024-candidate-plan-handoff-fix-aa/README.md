# 候选继承7号未消费计划与安全接管修复

状态：已通过独立验收，可交原小说会话核对现场后执行受保护接管。只处理 continue 后官方 plan7/context7 成功、adopt 被旧计划哈希错误拒绝的衔接；真实接管未由本会话执行。

保护规则：仅下一章正式计划、且旧六章及原始写前清单均未消费时允许写前改写；旧章、其他来源仍按旧哈希保护。新章登记后以登记行实际计划哈希保护，不再允许作为未消费计划改变。若原始写前清单或旧章已消费该计划，plan 在写入前拒绝。

接管：revision continue-repair 仅在尚未登记7、状态原字节未变且差异仅限该计划的现有续写候选中使用。核对所有者令牌、state/session/base/plan CAS、源协调目录库存和绑定工具；验证当前正式计划及原清单公开来源。复制到新协调目录/候选并绑定修复构建，冻结旧基线、旧计划、当前状态及接管审计。原派生、原工具和旧基线不变，不授予8、不提供发布。

必须保留 Y/Z 原包及封存证据原字节；新固定制品和完整记录单独保存。真实操作仍由原小说会话接管，本会话不安装或修改真实目录，不提交推送。

## 最终制品和结果

唯一交付包为 final-fixed/ai-writer-0.9.0.zip，SHA-256 `15318629636a127490e225d26db3d715590d8c81f47a06f709fec7a78197756c`，content ID `ecd9719c1194e600c98516f8da6df70b905e73cfc658836788e058ffcbd80aef`。fixed/ 是最终冻结来源兼容补充前的中间包，不交接。仍为0.9.0开发版，未发布；详细步骤见 HANDOFF.md。

- 最终解压包 npm test -- --test-concurrency=4：213项，211通过、2项Windows链接权限相关跳过、0失败，465210ms。未运行其他平台CI，不将跳过项算作通过。
- 源码候选及易用性26项复验通过；最后补充的冻结计划消费兼容用例1项通过。最终包全量覆盖所有最新代码和用例。源码与最终包doctor均通过。
- handoff/：封存旧Z包真实CLI创建继承未登记7号计划的派生，官方plan7/context7成功、adopt复现CONTINUATION_PREFIX_CHANGED；新包continue-repair复制接管，继承当前计划并登记7，旧派生、旧协调目录、session和base不变。共66条兼容CLI。
- direct/：新包直接完成 continue→plan7→context7→adopt→preview→record→check，另验证8章及prepare/commit拒绝，共62条CLI。
- 模型分别读取两组实际七章文本后，普通review、扫描保存和check各3条CLI均通过。合计134条CLI；预置登记报告仅为接口夹具，后续实际实读另记。样稿重复及旧锁缺前置仍列为文学问题，不宣称文学验收、真实小说登记或百章扩容完成。
- 接管负向用例覆盖错误令牌、state/session/base/plan CAS、额外正文、旧来源改变、登记state改变、复制后并发变化；已消费计划在写入前锁定，登记后按实际消费对象保护，包括冻结版本。
- real-preflight-before/after.json：真实dac9派生仍r433六章、登记state原字节不变、父库存及绑定构建匹配，唯一差异是7号计划；前后结果完全相同。未读取含真实令牌的操作输入，未写真实目录。
- 原作品33来源及7固定哈希匹配Z轮封存观察，Y/Z合计4583封存文件及ZIP/receipt/manifest原字节不变。未复验真实作品全部备份，此项仍由原小说会话负责。
- ZIP、327发行文件及326源码输入逐项验证一致；相对Z仅7个源码/文档/测试文件变更，见source-scope-sha256.json。没有修改引擎、提交或推送。

## 失败和中间记录

targeted-attempt-1.log为首轮11/11通过。targeted-final.log一项夹具断言失败：并发注入发生在源文件复制前，正确提前拒绝后目录尚未建成，测试却假定已存在。修正注入到第二次state落盘后，targeted-verified.log的26项全部通过，证明末尾CAS且不注册活跃候选。该失败日志保留，不计通过。

targeted-versioned.log补充验证冻结版本的实际消费对象，避免用活动入口哈希误报。最终全量均通过，详细断言见verification-final.json。源码与制品冻结后未再改动工具文件；完整证据另有records-manifest和外置seal receipt。
