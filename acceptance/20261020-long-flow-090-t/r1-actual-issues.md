# T R1真实问题与调用偏差

这些条目与受控三项作者事实变更分开，不将14:55/14:57/60的人工改稿称产品缺陷。

- H1：B原报告审查/T-0024-已登记硬问题-H1.md保留。基线24 SHA adb0d5050589039ffc7679ea9f0d512c603ce0188a2617f571d6eeba88a8ec3a，23电话提前替何报同行/领押，33何才决定。候选删来前预知并在69陶实际抬头见何，文本修复及理由在r1-text-edits.json；24正式重登/摘要/人物/evidence核仍留恢复进程，不能当已完成。
- R-M20：原20登记人物林照写“十八日先收干长裤/整屋、午饭，再实告许卸架”，timeline开头亦把整屋吃饭排前；当前20正文SHA f02b4f8ecdc61bc04255c55e40c03caab2ceddce64b66e6c5214d225bfc67dd6第3行收裤早饭，第5—23行上午告许，第25行才回住处整屋/午饭。原作者/代理登记的顺序错误，不是产品产生的事实判断。候选20精确修这两处changes，保留摘要/正文、原journal和replay-input；不扩大故事设定。
- 调用失误：r1-entry-ledger裸ledger不属于CLI命令，退出2。随后用common.run调用help时，该helper自动附加--project，实际错误为“help 只接受一个命令名”（commands/r1-entry-help），并非未知help。--help成功（r1-entry-help-v2）。两个失败均保留，主state入场SHA未变。第二次没有按help_command原样执行无project命令，不能声称该提示不可执行或据此认定产品缺陷；这是本客户端把help套入会附加project的helper造成的参数错误。后续CLI全部走common.run，固定label不重跑。
- 编排注意：preview18外层exec曾返回可恢复session_id，随后只读预览重排在poll完成前运行；已用write_stdin真实取到exit0，预览与重排的raw SHA绑定，登记18在核完退出值和实读预览后才执行。未删除日志。后续依赖在前步exit0后再执行。
