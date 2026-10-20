# T轮原生Codex执行约束

本轮为用户授权的工具开发实跑；作品仅是T轮副本《雨棚后的灯》，文体novel。写入只能在acceptance/20261020-long-flow-090-t内，产品疑似缺陷保存证据后报父进程，不改源代码/全局配置/Git/S/Q/R/真实作品，不启动代理，不联网发布。

common.mjs提供base/work/cli/state/read/sha/write/save/input/run/evidence。run(label,args,expected=0,project=work,tool=cli)经run.mjs捕获命令/输入/前后state/原始stdout-stderr；label只用小写字母数字连字符，已用名不可覆盖。expected2读stderr的CLI抛错JSON；expected1读stdout的ok:false；成功--help返回文本，不当JSON。save/write只接受文本字符串或JSON对象；原始Buffer必须用fs.writeFileSync写字节或显式decode成UTF-8字符串，不能将Buffer传给write而误序列化为JSON。脚本异常与CLI拒绝不是同一个退出码，保留每次失败并换新标签重试。

多行中文报告或含中文引号的JS用apply_patch保存为文件后再运行，避免把长文本嵌进PowerShell的node -e。CLI错误对象只暴露声明的字段，不假设API异常上的自定义属性都会序列化；依据实际code、error及正式文档判断，辅助断言错误不冒充产品故障。

优先用CLI help确认参数；work/.writer/tool/bin/ai-writer.mjs是随附入口。不得编辑state、伪造source_hashes或移除保护。已复制的旧committed修订和绝对路径仅是历史，不resume它们，不朝旧workspace写。发现待决事务先真实list分类型。

flow.mjs prepare N [tag]读取作品交接/T-细纲-NNNN.json，执行plan、context和写前template；这些必须先于动笔。只细化近期三章，记录计划与已发生事实区别。新正文依正文/NNNN.md，分段/NNNN/part-01.md等按文件名排序以两个LF精确合章；不要trim/统一换行破坏原始字节。普通章四段、至少5000正文Han（目标5000—6500）；19/25六段、至少10500（目标10500—12500），不是逐段登记。只有part01带章题。

flow.mjs record N [tag]读取作品交接/T-登记-NNNN.json（只含summary和changes），填入原写前模板，校对篇幅、段数、合章，再preview/record/check；失败保留输入，语义修正用新tag，旧模板不刷新哈希。tag模板路径须与prepare时对应；若需以新tag重试登记但不改变已核context，应另用原模板与新输入调用common.run，不能写后重新prepare规避来源校验。

第21章后本轮编排增设登记前顺序门：先保存审查/T-NNNN-纲文回对.md，含当前正文SHA，再运行flow record；指标保存当时报告的哈希。这只核文件顺序和版本，不能证明实际实读或文学通过。19章曾因报告保存命令失败后编排仍往下运行而先登记、后补报告，原始偏差必须保留；不得补造更早时间或追认它当时通过此新门。

每章合成后用FastCtx完整读正文至EOF，再保存纲文回对（各beat实际引文及主动调整/未写），修复高置信问题后再次完整读最终稿。普通词频/字数/脚本不能证明文学或连续性。登记必须按实际正文，人物所知与读者所知分开；object custody每次完整列holder/location/condition，换手须previous_holder。related_unchanged_ledger只供召回/实读，不自动改值。

每三章完整实读最新六章（到21读16—21，到24读19—24等），保存审查/T-0016-0021.md格式报告，再flow.mjs review 21。旧章修订前后报告与段稿不可混用；继承1—3/5—6以当前登记正文为准，旧平铺段稿不声明当前映射。4/8用-r1、10用-r2、15用-r5、16—18用-r6。新章正式修订后新建当前段版本及拼装证明，保留旧段。

中断交接列实际段路径/SHA、当前正文数、stateSHA、有效写前来源和未完动作，不能用摘要替代恢复后的实际原段阅读。原会话退出后由父进程用真实threadID resume。来源或revision变化时保存旧输入，先实际核差异及旧文，再取新context/template，并证明已完成段字节不变；不直接替换旧哈希。

报告列清“硬问题/可选意见/未核范围”。若发现已登记旧章问题，停止修改主稿，报告最早影响和证据给父会话走正式revision；未登记新章内的授权修正可直接完成。第30章后停止。所有原始失败、候选和历史报告保留，未经父最终总审计不能宣称本轮完成或封存。
