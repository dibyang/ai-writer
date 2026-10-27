# AB最终验收与接管入口

AB验收完成且已封存，2822文件SHA复核一致。固定外部入口及真实作品拥有者的操作顺序见 [HANDOFF](20261024-registered-seven-revision-ab/HANDOFF.md)。真实小说未修改或重登，仍由作品会话接管；不读/转发真实令牌，不全面升级，不写第八章，不切换主稿。

**更正封存HANDOFF中的一处记录文件名引用**：完整最终差异和源码/包身份应查看 [boundaries-final-verification.json](20261024-registered-seven-revision-ab/boundaries-final-verification.json)，不是其历史 boundaries-verification.json。后者是文档链接修复前的尝试，保留历史证据。封存原文件不回写；本外部说明作为当前交接补充。

最终包：[ai-writer-0.9.0.zip](20261024-registered-seven-revision-ab/verified-fixed/ai-writer-0.9.0.zip)，SHA256 `6b1e8523ee26fe3a347e21b5bf41dfbc5a2c0c535c8bee44bbef63e327696d1a`，content_id `52156ccdc8d1fc7a728215ced690e6c1e58d1653cda828fcc8313e0e6df7e47c`。外部入口在 extracted-verified/ai-writer-0.9.0/bin/ai-writer.mjs。不要使用历史 final-fixed/extracted-final。

最终解压包218项：216通过、0失败、2项Windows链接权限跳过；两侧doctor无errors/warnings，最新包跨构建真实CLI流程闭合。验证包括源七章/原会话/基线/旧六章保护、封存SHA重登、当前新报告/local-proof、两条意见apply/verify、跨进程恢复、旧报告/八章/主稿发布拒绝。完整证据见 [README](20261024-registered-seven-revision-ab/README.md)、[机器结论](20261024-registered-seven-revision-ab/verification.json) 和 [封存回执](20261024-registered-seven-revision-ab-seal-receipt.json)。这是独立短样本及Windows本机工具验收，不是实际小说小修完成、文学定稿或跨平台发布验收。
