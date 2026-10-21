# W实跑操作指引完善与最终候选边界

这是已捕获使用问题的最小指引修正，不改变锁、字段校验、合章原字节保护或schema。B已正常结束、18章/r76/paused后才修改源码，前面的冻结核验是各自当时的真实结果。初始ab14/generation1及其记录保留；当前候选e980bf0574feaa9851c430f91f8a545da3f1cd8e6a4198fad7b28cddb07d9d2d尚须最终检查后正式安装到本轮隔离作品，不能提前当作已更新。

1. `br-template-eighteen`与`br-context-eighteen`分别在23:53:29.859Z/29.863Z启动，前者110ms内被写锁拒绝，后者385ms成功。两者都带--out；模板在前命令结束后串行重试成功。拒绝前后state相同，未删锁。补明草案保存也有写锁，避免把不同输出路径当纯读取并发。
2. `br-assemble-eighteen`把非空白场景标记用作separator，实际退出2，未创建合章目标或改变state；标记加入另存分段、再按真实SHA及空白separator执行成功。原v1与修正v2均保留，提示应明确“标记写在片段”。
3. `br-preview-eighteen`将已有外套交接的previous_holder放错层级，实际退出1/writes=false，提示须与custody同级并等于当前保管人。新输入修正后preview0才record0。新增字段位置指引，原保管链校验不放宽。

源码只改lib/help.mjs、quickstart/user-guide/workflow/review-and-registration及两份发行说明，共7个文件。未改业务校验、状态协议、引擎或作者作品。实际ZIP解压核CRC/清单/源映射；最终源码与实际包分别npm test/npm run doctor通过后，使用外部新入口正式tool update本隔离P，核18章全文/units/snapshot和根作者定制不变，再由新鲜C读取新包继续19—24。初始与当前构建的完整字节清单分别为product-frozen-start.json与product-frozen-current.json，后续源码边界以current为准；旧记录不改写。

此处“通过后更新”是执行约束，实际终态以guidance-build-verification.json及guidance-update-verification.json为准。候选、安装、写作流程完成和正式发布分别核验；0.9.0仍开发中，未推送或发布。
