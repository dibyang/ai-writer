# DR续程实际失败与定位偏差

1. dr-assemble35-v2：实际exec返回exit_code=1，x-log.mjs:27读--input时报ENOENT，目标D:\work\other\ai-writer\.writer\drafts\dr-assemble35-v2.json。原因是输入相对路径按工作区根解析，产品尚未启动。cli-logs/dr-assemble35-v2/argv.raw.json存在；包装层在建立stdout/result之前异常退出，未伪补产品result.json。原输入P/.writer/drafts/dr-assemble35-v2.json保留。纠正dr-assemble35-v2-absolute用其绝对路径，实际exit_code=0，before/after state相同。此处为本会话工具返回的整理，不冒充包装层原始stderr文件。

2. 原生FastCtx初次猜25路径0025-各留半下午-x-v1.md不存在，工具提示真实v1，随后读了历史v1。按正式recall确认当前25为v2后又实际原生读v2 101—200/201—290。v1阅读只作为历史，不冒充当前源锚点。未删除旧稿迁就文件名。

3. 36初次登记漏补T_X_BOOK_COMPANY两项知情，是实际已确认追踪错误，已报告根并完成正式独立区tracking修订、真实commit对象4940f163-50c0-4289-a95d-a7af0daa030f、事务68e1d789-e95d-414a-8054-b5beea4832c8 completed、apply/当前六章新pass/review/verify。不叫预设负向测试，不以会话最终0抹掉它。
