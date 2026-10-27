# 新增规则语言诊断复核

本机Node可用，报告JSON与哈希校验用Node或PowerShell；不要依赖未配置的python入口，不安装环境。本提示不提供任何样本预期结论。

只读本提示指定资源与样本，输出AE/language-eval/updated-first.json、updated-final.json、updated-report.md。不得读取expected-root-only.json、其他受测结果、根聊天或未指定参考；不改样本、作品、产品源码、技能、全局配置、Git，不起子代理/新聊天。此为用户明确要求的本地Codex规则实跑，不是人类盲评。

AE=acceptance/20261026-long-flow-090-ae。使用冻结新包AE/extracted-final-candidate-v4/ai-writer-0.9.0里的writer-review/SKILL.md及其general-review、natural-language-authenticity、deslop、concrete-language-review参考，不读取root中可能正在更新的规则。实际读全AE/language-eval/writer.json和samples.json共16条。不要执行作品命令或续写。样本自带前文范围，不能假定未给出的信息，也不要因为是测试就强凑问题。

逐条做自然语言审查，先保存updated-first.json：cases数组每条id、verdict（issue/keep/context-needed）、逐字quote、具体理由、支持判断的语言测试、阅读代价、最小处理方向与保留项。issue只在确有具体损害时用；不确定要说明缺什么上下文，不能猜药物/灵力等设定。keep无需编造瑕疵或修改。

再依据所读规则复核首轮，保存updated-final.json（同字段）和report：有无漏检/误伤、哪些判断改了及证据、原规则路径和SHA、样本SHA、实际覆盖与限制。没有改变如实写没有，不制造遗漏。不读取隐藏预期或自报准确率。首轮原件保留。输出完整文件后正常结束，每60秒简短进度，预计5—10分钟。
