# 根报告：metadata-only修订的审查意见apply被正文变更条件阻断

追踪修正已真实完成并正式提交，意见工具闭环未完成。不是写作问题仍未修，也不是可以宣称工具已关闭。

实际session：4b267c89-25a8-4fa0-a61b-06fd59f67561，owner=v-a-metadata-only-root-authorized，scope4—6，base_revision26。commit record ID：3ec56fe0-3fbc-4bfe-9cb1-2253bdf0db68。真实事务97c11e48-4f17-44c5-96de-5e087099eea0已completed，会话committed，主区revision27。

意见V_A_U5_TIME_METADATA在修订前依根本轮明确授权以agent-within-authorized-scope正式adopted（revision26），授权绑定本轮metadata-only workflow事件，不冒充人类逐字选择。正式独立区rewind4、逐章replay-input／实读报告／preview／record，完整尾段实读与review、prepare差异核对和commit均成功。四处summary/timeline日期文字已改；六章正文与根核验同SHA，人物和13条账本整体不变。

随后实际执行唯一父CLI的review-issues apply，输入保存于W/.writer/drafts/v-am-issue-apply.json，原字节、双流和实际子进程结果保存在cli-logs/am43-apply-issue/。输入绑定上述真实commit_id；reason明确这是追踪文字修正，不捏造正文改动。

实际诊断（stderr，stdout为空）：

```json
{"ok":false,"error":"没有对应原文的实际修改，不能把采用或保留登记为已修复","code":"REVIEW_CHANGE_REQUIRED"}
```

实际产品子进程退出码是2；外层PowerShell因停止依赖而返回1，不能把外层码冒充产品码。前后stateSHA均为e11cac3daca69b62a08a1986bb952ec8b0605e8dded4ffc7b347888067908dd1。没有发生应用状态写入。

已停止依赖verify，未尝试未文档化状态名、手改state或用正文改字凑条件。随后重新读取apply帮助和包内review-and-registration第70—74行、workflow第22—24行协议：apply要求至少一处对应原文实际变更，未列metadata-only应用路径。实际issue展开仍status/effective_status=adopted，application=null，verification=null，context_changed=true，原open事件与采用历史保留。

因此当前工具在本测试授权的“正文必须同字节、只修追踪”的条件下不能完成这个意见apply链。此处作为工具协议能力缺口报根；本会话不改产品、不换包、不绕过。已有修订不回滚，原错误追踪和旧报告继续保留。B须待根独立复核并处理此阻断，不由本会话直接开始。
