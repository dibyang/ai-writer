# E基线全页覆盖通过，额外严格返回顺序检查未通过

2026-10-25 09:03—09:05 UTC，根运行verify-reads e-baseline-full-current e-first 1 60成功，当前60章387页逐页实际全文、SHA、区间、总长一致，原生返回均保留。随后额外调用verify-read-order同label退出1：`missing current reading 3/1 after previous chapter`。该失败未生成通过receipt，不删除、不改称顺序通过。

原始事件first-five审计显示完整第1章在event105返回，第3章在107，第2章在109，第5章在112，第4章在113；全部实际页有独立完整覆盖。启动/完成区间另存baseline-order-first-five-audit-intervals.json以核实是否并发，不从输出顺序推测模型认知顺序。旧单JSON解析低估和本次严格返回顺序拒绝是两个独立事项，不能混同。

本程source baseline要求实际完整阅读required_readings，并未要求各章工具返回严格串行；E首程提示同样仅要求基线全书完整分页实读。因此本次387页完整覆盖满足阅读范围要求，额外严格返回顺序不计通过，不能宣传“基线全文严格顺序读完”。不为消除失败重写原始事件或放宽验序脚本，也不以哈希或存盘页代替实际返回。

E全部重登后的48—60尾段和F新会话全1—60明确要求按章完成再下一章，将继续用原严格read-order规则分别验收；本处处置不能豁免后续要求。最终文学判断、作者定稿与发布仍不由机械全页覆盖证明。
