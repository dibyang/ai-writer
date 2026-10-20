# D辅助脚本错误

28初次d-assemble退出0，但随后d-observe实际正文SHA/Han与拼装结果不符：写出的正文是Buffer的JSON序列化，15189行、0Han，而原四段拼装应为4343Han。原因是common.write对非字符串JSON.stringify，辅助脚本误传Buffer；不是产品CLI故障。未preview/record，无state变化。保留初次assembly与read-before观察，修脚本传UTF-8字符串，下一次拼装将异常原字节存d-history/d-28-corrected/0028.md，不能覆写抹掉失败。初稿也未达5000Han，补展开后另留版本实读；原sources不刷新。
