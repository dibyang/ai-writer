# 百章静止点v4正式合入核对

- 原生13已正常结束并由独立audit冻结100章r350，再应用七个隔离验证过的文件；before目录保留主和内置旧源码，applied/activated保存实际时间与文件SHA。
- 主版本 `npm test` 60通过、0失败/跳过；`npm run test:engine` 29通过、0失败/跳过；`npm run doctor` ok。原始结果为 `../parent-commands/integrated-docs-{test,engine,doctor}/`，非只引用隔离候选。
- source-baseline-v4包含246来源；激活时逐一校验，作品内置help/longform同步。作品state SHA c3ab9e7d347d720c41480441ee6996f3ed012998c292aa6d5d5bbd4c390ce6b9未变。后续正式rewind会改变state，不能把该静止点身份扩大到整个最终修订期间。
- 实际主CLI context/recall/review帮助已分别调用并全文读，输出保存在 `../parent-commands/integrated-help-*`：context默认40000/最低1000；recall完整ID优先、AND、limit1—100；review示例from1/to1与单份哈希相符，多章要列全。
- longform仅补一条上下文写作指引，提示作者追踪编号与人物可知事实分开，不能当成自动语义检测器。最终原生已从此来源完成100章复查，10份实际context与正式登记消费的来源/修订号对应，见native-context-proof.json；主和内置SHA一致、全部246源未变。修后六章已实际全文读，最终CP绑定通过，单凭提示出现不推导自动语言效果。
- 本报告确认合入、回归和帮助可见性，不声称百章最终文学质量通过。
