# 2026-10-20 约00:58：主会话运行检查点（未完成）

当前用户要求继续扩大0.9.0长篇真实Codex实跑，发现问题修复，保留完整记录，不改现有作品；本轮未授权Git提交/推送。基线提交9c741af4，只有.idea/原先未跟踪。

S独立副本从Q六章续至18章六卷的目标仍未全部完成。现已实际登记1—9：新增7=8412 Han/5段、8=3616/3段、9=3555/3段。真实原生A首进程正常停在7章两段，state r16/6章；同线程exec resume成功写7—9并连读4—9，当前主稿r25/9章（含后续治理和版本事件）。A线程01a154ef-0bd0-7fd3-ab2b-033308d9b4eb，两个进程均0退出；首段原哈希见checkpoint-a-first.json。原生进程完整JSONL/提示/最后答复均在commands/等。原先外层沙箱启动失败保留在codex-a-first，不算成功。

当前进行R1正式修订：旧4章“柜台上的饭桌”应改“后间的饭桌”，8章重复知情解释可最小减掉，V3仍是Q未授权占位契约需澄清。范围4—9，V3新版仅从7生效；先固定原版/等价bind，历史stage后独立区发布。main旧九章仍未改；session 6258de87-149a-44e3-871a-2bfc4ef53e05，真实路径/token见r1-session.json（不要改）。代码revision-one.mjs各phase；首次baseline错误设from7，被SOURCE_RANGE_INVALID拒绝，R原生客户端补读1—3、保存新label并从1成功，旧输入保留；后续stage/begin/rewind4/publish均0。不要重跑init/baseline/stage或覆盖wx证据。

正在运行的PTY：
- 4433：codex-r1-first（新线程01a15512-b0ca-7850-9cfc-8fb20e68aedd），任务prompt-r1-first.md。应只重登4—7并存交接/S-R1-中断.md后退出，勿与其同时改作品。
- 87808：final-source-test完整回归，319冻结输入及6产品文件见source-frozen.json/product-frozen.json。
- 47843：final-package-tests最终ZIP真实解压包完整回归。
旧A/source/package PTY已完成，不再poll旧ID。

R1首进程结束后，核主稿九章/旧字节不变、分支登到7，保存checkpoint；用同线程exec resume和prompt-r1-resume.md继续8/9重登、完整4—9连读、review/prepare/commit、恢复trial，输出交接/S-A-修订后当前入口.md。所有原生进程通过本轮run.mjs捕获，exe C:/Users/admin/AppData/Local/OpenAI/Codex/bin/896a0166b774037a/codex.exe；exec --json --sandbox workspace-write -C D:/work/other/ai-writer -o <S/last.md> -；resume参数照Q样例，加resume --json -o <...> <thread-id> -。必须require_escalated以创建客户端自己的本地会话DB，子CLI仍workspace-write。不要启动协作子代理。

R1完成后：原4/8分段未在修订事务复制/发布，保留旧字节另存当前分段（例如0004-r1/0008-r1），用最小替换从旧段派生并核按序join两个换行=当前正式正文。旧交接保留历史，新当前入口绑定当前r/正文哈希。r1-guard-verification.json已实测主稿并行plan10被REVISION_OCCUPIED拒绝，state不变、plan10不产生。

产品这轮已改6文件：chapter-delivery参考、quickstart、user-guide补修订后分段/交接版本提示；CHANGELOG、RELEASE_NOTES、README同步。未改runtime或engine。主源码+初始实际解压包先各173/172pass/0fail/1权限skip、doctor通过，baseline-verification.json保留，但它们早于6文件文档修改。最终重建candidate-final，内容ID2fccbf8acb1b68c91733fbbcea5ece952384b2a5131624a57202ea97b1f7664e；zip-final-verification.json给最终ZIP SHA/真实解压路径（.tmp/长篇 0.9.0 S 最终包解压/ai-writer-0.9.0）。最终源码/包doctor已过，完整回归仍运行。

R1结束、无活跃会话时须正式tool update把最终解压包安装进S样例（当前S随附仍是旧内容ID9e26...generation1），外部入口执行plan/request带真实author_evidence。别在R1活跃时换工具。源码/最终解压包/S随附最终身份要一致，源码319输入+6产品冻结不再改，若确需修复再新名重建/复测，保留旧包。

接续B新线程（prompt-b.md，应先补一句读交接/S-A-修订后当前入口.md，原S-A交接已历史），仅凭文件写10—12/每章3500—5000/3段/每章prepare在先，复读7—12/review12/交接S-B完成。父会话可在prepare13后跑budget.mjs 13，再C新线程prompt-c-first.md只写13章两段停，核checkpoint后同IDprompt-c-resume.md完成13五段约8000及14/15各3500，复读10—15/review15。随后D新线程写16—18每章3500并复读13—18。D提示尚未创建。第15幕布借还有限约定应据正文建thread到18，跨卷兑现。已追踪T_RETURN 9→10、T_SHORT_ACCOUNT 9→12（真实正文及账本已有，不再杜撰）。旧片全史保持未知，不强行闭环。多轮文件恢复/旧章后续连续性继续实际核对，发现硬问题正式修订，不能锁外改已登记稿。

之后当前全18章完整模型实读与终复核、预算边界/旧输入守卫、pause且19章拒绝/discussion成功、最终草稿export、check/doctor/rolling覆盖清零、无活跃会话或pending事务、全文件SHA/正文Han统计、真实会话成功ID/原始失败分类、Q原封存只读verify不变。source-final/product frozen核验，final verification通过后才更新S README完成态、seal-evidence（可复制Q脚本并改root），外置seal回执，封存后绝不写S。此时仍无Git提交/推送，用户若另发提交要求再精确提交。

S当前README/protocol写明进行中，不能直接称已通过全部目标。每60秒评论更新，长等待最多30秒；exec脚本若返回cellID先functions.wait。完整日志仅metadata短输出，不要dump大JSONL。FastCtx文件检查为先，PowerShell中文用UTF8，避免删除/覆盖/共享index。Q、R历史封存不可写，本轮不修改记忆文件。
