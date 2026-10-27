# 现有第七章派生的受保护接管

状态：独立验收完成，verification-final.json 为ok。最终解压包213项测试：211通过、2项Windows链接权限相关跳过、0失败；源码及包doctor通过。旧Z故障重现与接管、新包直接序列均通过，包含普通review/scan/check。真实目录未修改，真实接管仍由原小说会话执行。

## 唯一最终包

- `final-fixed/ai-writer-0.9.0.zip`
- SHA-256：`15318629636a127490e225d26db3d715590d8c81f47a06f709fec7a78197756c`
- content ID：`ecd9719c1194e600c98516f8da6df70b905e73cfc658836788e058ffcbd80aef`
- 外部入口：`D:/work/other/ai-writer/acceptance/20261024-candidate-plan-handoff-fix-aa/extracted-final/ai-writer-0.9.0/bin/ai-writer.mjs`

AA 的 fixed/ 是中间候选包，不接入真实作品；只使用上面的 final-fixed。Y/Z 包及证据均保持原字节，新入口不会更新原派生的随附工具。

## 当前真实来源与前提

源 workspace：`D:/work/小说/dzkxqxx-ch7-continuation-20261024/.writer/revisions/dac9b7c1-8797-4098-a9ae-66bd30bc5e89/workspace`。

只读预检为 r433、六章，state原字节和协调目录库存匹配，唯一业务差异是 `大纲/单元/0007.json`；旧六章和原写前清单未消费它。执行前须重新核对这些前提；本会话没有锁定或修改真实目录，也没有读取含令牌的 run/adopt/continue 输入。

接管只接受尚未登记7、state原字节未变、差异仅此正式计划的可编辑续写候选。其他业务新增、旧来源变化、工具变更、state变化或已经登记7均拒绝。内部context草案保留在旧派生，不当作新会话写前模板。

## 新接管输入

另存新的本地JSON，不能把原continue输入直接交给本命令。字段如下，占位值不能原样执行：

```json
{
  "token": "现有dac9派生的所有者令牌，本地填写，不输出或转发",
  "expected_revision": 433,
  "expected_state_sha256": "源workspace/.writer/state.json的实时SHA256",
  "expected_session_sha256": "源协调目录/.writer/revisions/dac9.../session.json的实时SHA256",
  "expected_base_sha256": "同一dac9会话base.json的实时SHA256",
  "expected_plan_sha256": "源workspace/大纲/单元/0007.json当前实际SHA256",
  "target": "在原作品、原候选和现有派生之外的全新协调目录绝对路径",
  "owner": "本次操作者",
  "reason": "官方plan7/context7后adopt被旧计划哈希错误拦截，受保护复制接管"
}
```

token是现有dac9派生令牌，不是a250原六章修订令牌；expected_plan_sha256是当前官方plan7的哈希，不是旧基线计划哈希。哈希须使用小写完整SHA-256。目标不得是任何原目录或已有失败目标，不覆盖、不自动删除。

命令：`node <新外部入口> revision continue-repair --project <源workspace> --input <新接管JSON>`。

源与其协调目录加命令锁，核对所有者、四项文件CAS及revision、原协调库存、旧绑定构建、当前计划/context及原清单公开来源；复制结束再对两侧库存和原session/base做CAS。任一步失败立即停止，不改哈希、基线、scope、state或删除计划绕过。

## 成功后仅在新候选操作

1. 保存返回的新 parent/workspace/id/token并保护令牌。新候选完整承接旧六章登记链、事实、来源、当前官方plan7和封存正文对象；原派生原样保留。冻结审计同时保存旧基线、旧计划、当前状态、接管理由及当前上下文身份，不把新计划追认为动笔前模板。
2. 新workspace已有当前plan7。重新读取 `context --unit 7`；如确需调整，只有旧章及原清单均未消费的本章计划可用普通plan调整，仍限原清单公开来源。私有准备附件不升级为创作来源。
3. 对新workspace使用 `revision adopt`，带新token、当前revision、unit=7和正常正文目标，显式采纳封存稿。保存返回草案，保留_adoption；实读后填写真实summary/changes，保存审查报告并绑定draft_review，先record-preview，再带新token record。
4. 登记后review/check及必要扫描。新章登记后计划按实际消费哈希保护（含冻结版本），不能再当写前可变计划改变。跨进程用新parent/id/token恢复；原派生仍绑定旧Z工具，不在那里继续写或覆盖工具。
5. 第八章、旧章改写、rewind/replay、prepare/commit继续拒绝，不切主稿。原main360、原a250候选432及现有dac9派生均不由本工具会话改写。

若接管失败留下新目录，保留供核查，不作为可用作品；查明原因后另选新目标。不得对活跃旧目录执行全面tool update或手工替换模块。
