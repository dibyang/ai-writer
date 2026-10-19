# R3客户端召回捕获label错误留档

2026-10-20。第11章独立预览成功后，调用common.run包装recall时将O_PROGRAM转为o_program，构成r3-client-recall-11-o_program。run.mjs校验label的正则为^[a-z][a-z0-9-]*$，因下划线抛出Error: label [--stdin-file file] exe args。该校验发生在启动实际CLI前；common.run随后因status=1而抛AssertionError。未执行recall，未触碰state。原终端错误保留在本轮原生工具记录中。

以新label r3-client-recall-11-o-program-retry1、r3-client-recall-11-o-curtain-retry1、r3-client-recall-11-o-grid-retry1逐项真实执行成功，commands/下捕获保留。未删除或覆盖失败日志、旧输入和备份。
