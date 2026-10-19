# 辅助快照首轮核验失败与修正

prepare-recovery.mjs的write助手对Buffer走JSON.stringify，故本阶段自行保存的start-state.bin实际是Buffer的JSON表示，而非原始state字节。verify-final.mjs首轮读取该辅助文件时在起始revision断言报undefined !== 417，命令exit1；尚未做任何产品写入。错误输出保存在本实际进程events命令原件，错误辅助文件原样保留。

修正只在本阶段辅助脚本：直接读取commands/draft-a-recover-status-start/before-state.json，并另存start-state-raw.bin原始字节。此文件SHA为cf15bc9027ff8f75a40d7ade94889645aa34588727956b62aec7bf64abf7960f，与父冻结state相同。end-state.bin同样为当前state原字节；原错误文件未覆盖。第二轮verify-final完整通过。此为过程材料序列化失误，不是产品state损坏、正文修订或服务容量中断。
