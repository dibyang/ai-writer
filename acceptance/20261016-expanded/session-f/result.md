# 潮汐信号 session-f 实跑结果

完成本轮授权：独立恢复当前1–20章，创作登记21–24章；最终再次完整连读1–24章。作品保持草稿状态，未现实发布。起始revision59，结束revision63，next_unit25只是工具顺序指针，不代表本轮要写第25章。耗时约31.9分钟。

## 实际范围与流程

作品路径：acceptance/20261016-expanded/works/潮汐信号/。辅助记录、CLI原始日志、结果和导出均在acceptance/20261016-expanded/session-f/；作品审查与review追踪文件正常写入作品内。未读其他阶段请求/聊天/结果、测试README或历史state/journal补剧情；baseline-state-r59.json为本次status后复制的当前状态。只读当前设定、总纲、各卷契约、正文、当前状态、当前有效报告与recall。未改1–20章、产品或引擎，未使用子代理，未手改state/journal，未提交/推送/上传/发布。

每章均按真实plan→context→record-template→正文→完整实读自检→changes/record→check执行；写前revision和来源未在写后重取覆盖，原模板原始stdout永久留存。16–21窗口到期后已完整实读并review，24章后全稿1–24实读报告覆盖19–24窗口。

## 正文汉字数与登记

计数为Unicode Script=Han，不含首行标题，不以总字符数代替。

| 章 | 正文汉字 | 写前修订号 | 登记修订号 | 正文SHA-256 |
|---|---:|---:|---:|---|
| 21 | 1613 | 59 | 60 | 87a504ba036f2df2b1266bd4aebd5908bc17f0cb6498c095ea4c4149bd7812ee |
| 22 | 1617 | 60 | 61 | e5349b39d7e7a827df65fa4e918cbe30b3f83a2bd875bfaf6a3305c22440a517 |
| 23 | 1641 | 61 | 62 | 6055a8774339c7dc512f27b9f8de6ed7c5aa2a8cb0ad08bebc87737e0cda0253 |
| 24 | 1726 | 62 | 63 | 9285cbde3bc6bec030c90ef3eb0bd27ca6c9816ba0bc2d2f9435397841428a53 |

本轮四章合计6597汉字，全部1500–2000。1–24章完整实际计数另见acceptance/20261016-expanded/session-f/audit-current.json。来源包、omitted_ids与写前哈希见acceptance/20261016-expanded/session-f/writing-provenance.json及acceptance/20261016-expanded/session-f/omitted-ids-review.md。

## 知情、消息与保存

第21章补齐原带起首、核重叠并实做局部比较；第22章先听邱自己的记忆再示照播音，不先喂日期；第23章周罗实际完整听工作转录，罗同意代存但未解释旧失约；第24章实展余页纸套找到原签、邱认背签、相关录音回放和同日调度纸相互核对。广播对应2012/9/17西埠线原14:40改15:20班的转候船通知，消息经广播桌、候船室至当年客运小厅的接人处；没有把送到门口写成每人登船。

T_SIGNAL/T_TAPE本轮在这些正文动作兑现后标resolved，原due12/18保留；T_LAMP在原位保存实际核签后resolved、due9保留。男声钟的确源、剪者、目录用意、整带其余段是否同日仍T_AUDIO_REMAINDER pending；T_INDEX/T_MAP/T_EAST与局部比较I_AUDIO_ALIGN保留partial；T_PRIVATE intentional-open，无author_truth。原牌挂处、原通知残页日期、原物确权未强行判定。

| 原物 | 最终实际保管 |
|---|---|
| 唯一原箱、原棉布及窄铜牌 | 沈→宋俭，服务室里间干板桌角，复封留旧标签，待核代存不确权 |
| 唯一原带及原透明盒 | 沈→宋俭，另置服务室干燥独立柜格，不入铁箱；原硬盘和工作副本沈留 |
| 蓝绳三角磨痕原钥 | 沈原封袋→赵瑛，随柜运抵新库，登记袋实际锁入值班柜，沈内袋已空 |
| 原通知及灯具检查簿 | 唐→赵，分别硬盒实到新库资料架；号码页另存不外发 |
| 原整灯柱 | 范勤现场核图签接管，原位围挡保护、原片不拆不接电；未执行拆运报价 |
| 维修附图复印纸 | 仍许成原文件匣，未冒领 |

周罗只电话获第24章纸证结果；唐看工作签照及听说明，顾陪运不在开箱现场；宋林此时才亲见原牌。赵未见第16章试锁，范不自动知道历史灯况。沈选择留一个月在家接活，并与周定今晚买菜时间；未来行为没有记成已经发生。

## 错误、修复与证据核验

未发现必须rewind的已登记正文错误。登记前修正21章停点时间用语、22章车铃与尾音、23章唐获知鱼的话题桥接，24章补实到新库上架锁柜。已登记后未直接补改正文或state。

当前43项账本保留原有36项的全部ID、statement、due、旧证据和人物旧所知；256条引用均核当前正文SHA-256、实际行及原句匹配。全部来源比较和旧账本逐项差异见acceptance/20261016-expanded/session-f/audit-current.json，逐证据明细见acceptance/20261016-expanded/session-f/evidence-current.json。机械核验不等文学验收。

两次最初辅助shell命令退出1：recall帮助文本误当JSON、内联导出校验多闭括号。原始合并工具回传与原命令保存在acceptance/20261016-expanded/session-f/helper-failures.json；为保留分离原始stdout/stderr，另作两次受控重现，均如实退出1，日志在acceptance/20261016-expanded/session-f/helper-cli/failed-*-reproduction.*，未用其替换最初记录。改用文件脚本后导出核验和证据审计均退出0。最初工具仅返回合并输出，不能冒称保留了其当次分离字节流。

作品CLI共52次调用，全部真实退出0；每次executable/cwd/argv、原始stdout、原始stderr（空流也留空文件）与退出状态均在acceptance/20261016-expanded/session-f/cli/，非零重现日志在helper-cli单独保留。终态status/check/doctor为ok，24章无未登记或漂移、无来源变化、欠审窗口空；有效报告3份，12份历史失效报告均有当前覆盖。

## 版本及交付

- 写前state SHA-256：47f52d24590826adbcde5a709c8d5b1aeaf37df707a7b555764616505aea7c71
- 最终state SHA-256：1bf97d4624cc892c67d60a838c7011e22f08e4b4fa82165571a84d270352bcfd
- 全稿知情报告：acceptance/20261016-expanded/works/潮汐信号/审查/session-f-0001-0024模型知情复核-r63.md
- 报告SHA-256：9b8a5ef579990c9d52f86cd82e8450979b1bb7e2c8d264e0a0d06c79f57f1ba5
- 1–24正文源哈希：acceptance/20261016-expanded/session-f/final-source-hashes.json
- 完整写前来源包：acceptance/20261016-expanded/session-f/writing-provenance.json
- 草稿合稿：acceptance/20261016-expanded/session-f/export/manuscript.md
- 合稿SHA-256：3693e568514339d680a179c5e7f99b3badb27272bd81faa6730775018d2ad96e
- 导出清单：acceptance/20261016-expanded/session-f/export/manifest.json
- 清单SHA-256：bccc2980a061c807ac1aa7f3309d4c6ac1c0ef3deca758fec904b766e6bde658

导出恰好1–24章，excluded_drafts=[]、warnings=[]；逐章正文逐字匹配一次且顺序正确，无遗漏或重复。见acceptance/20261016-expanded/session-f/export-verification.json。结果属于真实本地Codex作品实跑和模型知情复核，未声明产品正式验收、真人盲读或作者定稿。
