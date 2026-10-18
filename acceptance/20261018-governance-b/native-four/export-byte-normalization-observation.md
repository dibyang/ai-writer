# 原生合订导出与章节原始字节：最小复现

状态：产品限制/候选缺陷，交主会话裁定；本轮没有改源码或协议。本轮“章节原始字节导出”的严格口径不由原生合订稿单独满足。

在主项目 cwd 执行的真实产品调用为 `commands/native-four-29-export`（通过本轮 capture.mjs），其 stdout.raw.txt 完整 JSON 已解析并逐项比较。产品成功导出100章至 native-four/export-final，清单保存100份源正文原始SHA256，excluded_drafts和warnings均为空。manifest与实际manuscript的总哈希相符。

复现无需再写正文：对该导出的 `manuscript.md` 按 `\n\n---\n\n` 分成100段（末尾单独导出换行去除），取任意一章例如100，与副本 `正文/0100-念到这一页的末尾.md` 的原始Buffer比较。原始SHA256为6f7f439a1adf22655fc76510906bb88c9dd450a0051ea795d446485cae35c89e。段落内容与源文本.trim()完全相同，但与源Buffer不相同；100章均有边缘空白归一化。只读检查当前export实现也确认先trim各章再拼接。不是100正文被改，也不是哈希清单错误；这是格式化合订导出的行为，不能声称每章原字节已原样装入合订稿。

精确复核表见 export-verification.json，每章列source_bytes、native_segment_bytes和三方hash。为完成本阶段原字节保全，另在全新目录 export-byte-preserved/正文 用本阶段核验脚本逐文件复制原100篇并读回Buffer逐字节比较，附独立manifest.json。该补充是验收侧原字节导出，不冒充原生CLI新增能力；原生export-final未改动。未来是否需要产品原字节单章导出选项，由主会话处理。
