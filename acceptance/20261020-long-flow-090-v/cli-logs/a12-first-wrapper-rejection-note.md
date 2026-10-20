# 初次记录器调用失败说明

原始终端工具调用 chunk `021cae` 的最后一步调用了 `node V/v-log.mjs a12-volume-V3 node W/.writer/tool/bin/ai-writer.mjs volume --input W/.writer/drafts/v-a-volume-V3.json --project W`。V/W为本轮指定绝对目录。此前workflow与两项decision均成功；后续volume/plan循环当即throw停止。

失败源于记录器v-log.mjs第13行只接受小写标签；`a12-volume-V3`在创建日志目录和spawn产品子进程之前被拒，Node退出1。产品子进程没有启动，不能填产品退出码0或1。初次终端返回混合显示，记录器未创建该次独立双流文件，这是本次测试辅助记录器的证据缺口，不能把复现冒称初次原始双流。

原错误为：`Error: label [--stdin-file file] exe args`，调用栈指向v-log.mjs:13:53，Node v24.15.0。

随后在`a12-wrapper-rejection-reproduced/`用外层有效记录器包住同一失败调用，保存真实复现的完整stdout/stderr、argv、volume原输入、子进程exit_code=1及前后相同stateSHA：`810821fdcb15fc8991ea9d4ab2aa371f50847487f9e32f0426a7facb8cfc4956`。这份是明确标识的复现，不替代/抹掉初次失败。纠正仅将后续日志标签小写；产品入口、JSON原输入、正文、来源哈希与state不手改。
