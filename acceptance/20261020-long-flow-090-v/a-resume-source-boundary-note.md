# 根会话恢复提示的来源边界说明

根会话在A恢复开始后核对首停交接时，确认record-template.source_hashes包含`.writer/state.json`。`prompt-a-resume-v2.md`中“前后source_hashes相同”表述过严：正式workflow更新必然改变治理revision及state原字节，不能要求state这一项SHA相同。

正确验收是保留原17模板、原01/02及其SHA，正式记录治理变更，证明unit/snapshot/正文/设定/卷纲/章纲未漂移，再在继续03之前取得新revision写前模板。新模板除state哈希/expected_revision等真实治理元数据外，实际消费来源应不变。不能伪造state同SHA、回填旧输入、写后刷新来源或绕过保护。

此文件是根会话的核验解释及编排错误记录，不是对运行中执行器偷偷替换的指令；原stdin、提示和日志均保留。运行中的A若识别矛盾应按真实差异报告，根会话依实际时序与来源核验，不将这一提示表述错误算作产品bug。
