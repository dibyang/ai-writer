# 长篇默认卷目录与中断恢复补充

本轮用户明确要求：长篇正文按卷分目录，恢复中断、完成当前修订及0.9最终构建完整验收；现有作品不动，不提交、不推送。

实现采用当前章节有效卷纲的ID与卷名：正文/卷ID-卷名/全书章号-章名.md。outline给出draft_directory，context给出draft_path；省略draft的record-template和assemble共用规则，新导入同样入卷。显式旧路径不变，旧版已保存的平铺导入稿先核原字节后原位恢复。没有提供自动搬迁，也未移动66章验证作品已有正文或真实作品。跨平台非法字符替换、NFC归一化、标题60码点/160 UTF8字节限制，不修改原卷名或章名。默认模板不创建正文，写作时按需创建父目录；合章和导入创建父目录后独占创建目标，不覆盖冲突。

writer-project技能已仅更新一条写前路径指引，快速入门、使用手册、长篇说明、help和发行说明同步。未修改技能描述、权限或全局配置。

已完成的具体验证：volume-directory-focused为首个集成验证；volume-directory-regression覆盖4个测试文件，64项中63通过、0失败、1项Windows符号链接权限跳过。后续UTF8长度、旧平铺导入冲突与恢复等改动再由volume-directory-edge-quoted通过，最终整体结果以final-candidate-full-tests和final-candidate-doctor为准，不能将中间子集当最终验收。

验证命令错误保留：首次edge命令未给包含竖线的test-name-pattern加引号，PowerShell将其当管道，返回“旧平铺导入稿 not recognized”且exit1；检查没有创建volume-directory-edge目录，未启动产品验收或改作品。改为单引号并使用新label后成功。三次apply_patch由于文档上下文不匹配拒绝，核实未写入后按准确上下文重试；不归为产品缺陷。

中断恢复：原r-resume1/全量测试/构建均无退出记录，未伪造exit或正常断点。root-interruption-observation保存现场；checkpoint-r-interrupted-main有27581文件，workspace有1902文件，main66/r392及workspace54/r402。r-resume1-recovery使用原ID实际恢复、两区原字节核验后正式resume；native-entry证明同ID及实际入口。prior_run字段引用最近已完整退出的r-first，用于ID比较，并非声称中间r-resume1正常结束。当前修订继续绑定gen8，新代码仅在root，正式提交前不更新受保护工具。

进度脚本修正：无result时不再用启动至现在的墙钟间隔冒连续运行耗时；输出completion-unconfirmed、最后公开日志时间与独立time_since_launch_ms。PID存在只标身份未核，不直接当任务正常；原progress脚本保存在originals/progress-interruption/。这是验收辅助改进，不冒称产品运行时功能。

尚待完成：当前R修订剩余重登及尾读、最终新构建打包/安装、真实Codex按卷新作品验证、完整66章最终版本复核、旧意见核验、67越界负例、草稿导出、历史封存保持及本轮最终封存。此文为过程记录，不是完成声明。
