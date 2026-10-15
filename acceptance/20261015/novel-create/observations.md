# 《夜班退件》真实创作验收观察

## 范围与执行性质

仅写指定作品目录、本记录目录和用户明确指定的导出目录。使用项目随附 writer-project、writer-novel、writer-review 技能及 node bin/ai-writer.mjs；本会话自行创作，不另开代理。没有读取项目外作品、凭据或环境变量，没有调用外部生成服务，没有提交或推送。

初始化前查看 git status --short，已有大量未跟踪项目文件，保持原状。本目录原有 events.jsonl、process-result.json、request.md 未改。

## 当前实际遇到的情况

1. 用户前一句限写作品和记录两处，末句另要求导出到 acceptance/20261015/exports/夜班退件-v1。按具体导出指令作为唯一交付例外执行，已在开始时说明。
2. writer-review 主技能说无明确量尺不默认总分；其 publication-gate 参考模块默认严格分数及市场分。本任务是验收样稿，不是发布/市场判定，按主技能与用户要求记录知情自检、具体问题和未覆盖项，不制造外部冷读分数。
3. 文件编辑工具 apply_patch 拒绝同一补丁先 Delete 再 Add 相同路径，报 multiple operations target；该补丁未写入。读取初始化说明后改用 Update File 就地更新，CLI及状态不受影响。不是 CLI 故障，没有修改工具或绕过校验。
4. 已完成13条归档的CLI流程命令，全部exit_code=0；没有CLI运行错误或校验阻断，没有修改工具或绕过校验。不为验收故意制造失败。
5. export实测只输出manuscript.md与manifest.json，不复制审查报告，也不在合稿开头自动添加作品总标题。作品名在目录名和manifest.title内，正文保留两章标题。保持CLI原生导出及其哈希，在验收结果中单独链接审查报告，没有手改导出文件冒充原生结果。这是交付行为/可用性观察，不是本轮导出失败。
6. 两章完成后的status给出next_unit=3；该字段是顺序写作指针，CLI没有本次“两章完结”的任务语义。按正文和大纲确认范围已完成，没有手工改state来制造“完结”状态。

## 证据约定

命令结果 JSON 保存真实 stdout、stderr 与退出码。context 来源哈希直接从真实输出复制到 record 输入，不手填或伪造。快照只记正文已发生事项。导出、哈希检查和字数统计仅是机械证据，不代替文学阅读。

## 实际修复与未走的路径

第一章登记前修正八点收件/锁门时间冲突、无前文依据的“反复问”以及观察位置；第二章登记前明确照片操作主语、补实际交托出门。逐段实读与最小改动记录在05、10和作品审查报告中。

两章首次record后没有再修改正文；因此未调用rewind，也没有验证rewind后的重新登记路径。若后续作者修订已登记单元，仍须先status，再以当前revision运行rewind。本轮不将未走的路径报成已测。

最终status无stale_units或changed_sources；最终check明确为mechanical-only/literary_quality=unreviewed。人工性质的审查另存最终源哈希绑定报告，标明同一会话知情自检。17-delivery-verification.json确认源文、state、manifest、报告绑定及合稿内容一致；这些证据不构成文学验收。
