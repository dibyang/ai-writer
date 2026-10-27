# 卷ID大小写覆盖的真实反例与候选替换

按卷默认目录实现后，进一步检查跨平台ID边界。在Windows独立合成作品中先保存V1（第1章），再保存v1（第2章）：原代码未拒绝，并覆盖原V1卷纲。修复前脚本probe-volume-id-case.mjs、原文件字节和两次输入全部保留，local-checks/volume-id-case-before实际exit1（预期反例失败），stdout明确blocked:false/original_volume_preserved:false。未修改真实作品。

lib/longform.mjs现明确拒绝仅大小写不同的卷ID，代码VOLUME_ID_COLLISION；跨平台行为统一。新回归验证原卷纲和state不变、目录不新增别名文件，同时精确原ID可继续合法更新未消费卷纲。修复后同一独立反例使用新目录，volume-id-case-after实际exit0。手册及发行说明已同步。

此前CID32f118cc6ace63d95742b240be17bd4a00a162eba108e98d1a03891e0513ecf7的候选及234项测试真实有效于当时字节，但未覆盖此后修复，保留为已替代历史候选，不安装为最终版。未改第一版package-generation9.json或旧实际命令证据。

后续选用package-generation9-v2.json、generation9-package-verification-v2.json、cli-g9-v2-source.mjs；预定仍是作品实际更新第9代，因为第一候选从未安装。第二版完整测试/doctor/build/extract/包核验均用final-candidate-v2唯一label；实际结果完成后才可声明通过。当前R受保护会话继续第8代，正式提交后才更新。第一次候选实际CLI前缀负例也保留，第二版包再独立复跑。
