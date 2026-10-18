import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const stage=path.dirname(fileURLToPath(import.meta.url)),base=path.dirname(stage),work=path.join(base,'work'),sha=x=>crypto.createHash('sha256').update(x).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const audit=read(path.join(stage,'final-audit.json')),r=read(path.join(stage,'readings.json')),update=read(path.join(base,'commands/f-a-008-update/stdout.raw.txt')),retry=read(path.join(base,'commands/f-a-009-update-idempotent/stdout.raw.txt')),check=read(path.join(base,'commands/f-a-018-final-check/stdout.raw.txt')),input=read(path.join(stage,'inputs/tool-update.json')),state=read(path.join(work,'.writer/state.json')),now=new Date();
const required=['REQUEST.md','work/研究/F轮用户授权与执行范围.md','read-a-update/handoff.md','read-a-update/handoff.json','read-a-update/review.md','read-a-update/readings.json','read-a-update/failures.json','read-a-update/final-audit.json','work/writer.json','work/AGENTS.md','work/.agents/skills/writer-project/SKILL.md','work/.agents/skills/writer-novel/SKILL.md','work/.agents/skills/writer-review/SKILL.md','work/设定/权威规则.md','work/设定/角色卡.md','work/设定/文风.md','work/设定/续部人物与场所.md','work/大纲/全书大纲.md','work/大纲/续部总纲.md','work/.writer/tool/docs/tool-updates.md','work/.writer/tool/docs/review-and-registration.md'];
const handoff={phase:'F-A-read-1-25-and-real-tool-update',status:'complete-for-this-phase-only',completed_at:now.toISOString(),phase_started_at:audit.evidence_log_created_at,elapsed_ms:now-fs.statSync(path.join(stage,'events.jsonl')).birthtime,elapsed_basis:'本阶段events.jsonl创建时间至交接生成；包括准备、实读、报告，非仅CLI时间',work:work.replaceAll('\\','/'),schema:state.schema_version,revision:state.revision,generation:state.tool_control.generation,tool_version:state.tool_control.installed.version,build_id:state.tool_control.installed.source_content_id,runtime_id:state.tool_control.installed.runtime_id,state_sha256:sha(fs.readFileSync(path.join(work,'.writer/state.json'))),update:{...update,idempotent_retry:retry,source:'sources/package',input:'read-a-update/inputs/tool-update.json',author_evidence:input.author_evidence,before_state:'read-a-update/before-update-state.json',after_state:'read-a-update/after-update-state.json',final_state:'read-a-update/final-verification-state.json'},read_units:r.chapters.map(x=>({unit:x.unit,path:x.path,sha256:x.sha256,coverage:x.coverage,quote:x.quote,checkpoint:'read-a-update/checkpoints/'+String(x.unit).padStart(4,'0')+'.json',raw:'read-a-update/'+x.tool_evidence.raw})),reading_totals:r.totals,unread_units:{from:26,to:100},next_phase:{read_only_units:{from:26,to:50},optional_boundary_reread:[24,25],must_record_actual_reread:true,no_old_chapter_edit:true,no_chapter_101_or_new_draft:true,do_not_start_other_agents_or_sessions:true},required_files:required,volume_index:audit.volume_index,knowledge_boundary:'早章角色所知以readings逐章记录为准；state当前含100章信息只能作回查索引，不回灌。截止25章的对象和人物边界见review.md。',unresolved:['余带是否同日、男声与钟确源','剪者与未送达目录命名人及意图','残通知日期、铜牌原挂牌点、2013完整历史接收链和整套原图','罗私人失约原因不设答案，intentional-open','第11日有偿交稿、下次相处及公开使用截至25均未发生或授权'],recommended_checks:['26起公开请求不能把代存当许可，逐人核受话与传播范围','后续调用宋/赵/范保管原物必须有实际动作','观察查纸-播音-保留限制的结构是否持续替代生活冲突','完整读完100后才决定三处跨卷局部修订，继续正式独立区和CAS流程'],registered_new_review:false,registration_note:audit.review_registration_reason,active_revision:null,revision_token:null,tool_transaction_pending:false,check,failures:'read-a-update/failures.json',evidence:'read-a-update/command-index.json',implementation_modified:false,body_modified:false,new_chapter_written:false,committed:false,pushed:false,network_used:false,subagents_started:false,scope_limit:'仅本campaign；主项目实现、冻结来源与既有封存档案只读。下一阶段不是续写授权。'};
fs.writeFileSync(path.join(stage,'handoff.json'),JSON.stringify(handoff,null,2)+'\n',{flag:'wx'});
const table=r.chapters.map(n=>`|${n.unit}|${n.path}|${n.coverage[0][0]}—${n.line_count}|\`${n.sha256}\`|`).join('\n');
const mins=(handoff.elapsed_ms/60000).toFixed(2);
const md=`# F轮阶段A交接：仅完成更新与1—25章实读

完成时间：${now.toISOString()}（UTC）；实际阶段耗时${mins}分钟，从本阶段日志创建${audit.evidence_log_created_at}计至交接生成。CLI首次调用${audit.product_first_command_at}；工具update本身8,688毫秒。包括准备、25章阅读和报告，不把CLI耗时当全阶段耗时。

唯一作品：\`${handoff.work}\`。当前schema **6**，revision **379**，generation **2**，随附工具 **0.7.1**。

- build_id/content_id：\`${handoff.build_id}\`
- runtime_id：\`${handoff.runtime_id}\`
- state SHA256：\`${handoff.state_sha256}\`
- 更新事务：\`${update.transaction_id}\`，completed；没有活跃修订、pending工具事务或需传递令牌。

## 真实授权、输入及更新结果

先读campaign的REQUEST.md、work/研究/F轮用户授权与执行范围.md与read-a-update/request.md。本次用的author_evidence是副本研究文件第5行真实用户原话，SHA为\`${input.author_evidence.source_sha256}\`；第7—13行限定隔离副本。本阶段的更窄直接指令只准更新、阅读与报告，已遵守；不借未来101—106计划提前写新文。

输入：read-a-update/inputs/tool-update.json；expected_revision=378，operation_id=\`${input.operation_id}\`；documents=[]，保留根定制；schema6未enable/迁移。冻结来源为sources/package，build从8a9e937e5942887d25339fe5189a8f96374df389215721d82f0a6aac9e974167变为上列da84…，revision378→379、generation1→2。原输入幂等重试返回unchanged=true，state原字节未再变。

外部doctor/status/discussion/identify/compare/update-plan/update和随附help/doctor/status/discussion/check/identify均实际执行。全部产品CLI经过原capture.mjs；20次产品调用与2次只读git命令均用唯一f-a标签。命令、输入副本、原始stdout/stderr、前后state及构建观测在../commands/f-a-*；索引在command-index.json。产品JSON取相应stdout.raw.txt，不解析capture元信息。

更新前后原state：before-update-state.json、after-update-state.json；最终原state：final-verification-state.json。before SHA d3350cf15c93376c5e7e2f7e6b6aac661e92f9a4454b9bb0937034146836f75d，after/final如上。最终检查仅revision/tool_control变化：100章正文、units、snapshot、100个units内source_hashes、根AGENTS/技能/手册/设定/总纲及其余根文件均未变。冻结61个受管来源文件逐项哈希未变，final compare same_content=true。早期helper顶层source_hashes标志不足为证，最终实际比较嵌套100章字段，保留纠正说明。

check findings=[]，registered_count=100、unregistered=[]；stale_units/changed_sources/impact_pending均空。继承的rolling_review valid=51、stale=62、pending_windows=[]不是本次文学结论；literary_quality仍unreviewed。本阶段不重复登记旧报告，也未生成伪chapter_functions；新实读报告只保存在本目录。

## 本次完整覆盖

25章、1,852行、41,182汉字含标题。每章原始回包Complete，无缺页或截断长行；最长160字符。readings.json与checkpoints逐章含引文、选择后果、知识/物证/未证边界；read-raw保留实际工具回包，read-tool-evidence.json逐行核对一致。仅1—25是本次已读；26—100不得因state或旧摘要存在就宣称读过。

|章|work内路径|全行覆盖|SHA256|
|---|---|---|---|
${table}

## 文学判断与边界

review.md没有确认高置信硬问题；记录重复的阅读代价和应保留的人物收益，真人语言硬问题为“没有”，压缩宾语/容易句等列风格偏好。无旧章改动，无新章。原箱含牌布、原带已实际分别交宋俭；原通知/检查簿/号码页与原钥已交赵瑛至新库，原钥锁值班柜；整灯原位由范勤附件接管，不通电不拆片。沈留工作转录/移动盘/凭据，母亲原盘家中抽屉。后续不得让空背包自动取回原物。

24章仅支持2012-09-17西埠14:40改15:20转候船通知，邱送到旧小厅门口交人数，不证每人登船。残通知日期、余带同日性、男声钟、剪者和目录意图、原牌原位等仍不定。罗私因intentional-open不设答案。25章只兑现两人菜约、做饭及沈接有偿活/定金；不是交稿完成、同居、固定每晚或公开许可。

铜牌知情顺序（沈2亲见→周5口述→唐7口述→唐14亲见/顾14口述→周19看照→宋24亲见）不可被全书state倒灌。其余逐章信息见readings和review表。

## 下一阶段：只读26—50

1. 在新的实际阶段按上方唯一work恢复；本进程不启动下一代理或会话。先读本handoff、REQUEST、授权、review/readings、writer.json、AGENTS、保留的根技能/设定/总纲/卷纲索引；新协议细节查.writer/tool内手册，不覆盖根旧定制。
2. 所有产品CLI仍用campaign/capture.mjs及新的唯一f-b标签，输入放下一阶段目录；只指向此work。先status、discussion context、doctor核revision/generation/build和漂移。
3. 可为承接完整重读24—25并如实记重复范围，然后顺序完整读26—50；每章保留实际SHA、行覆盖、引文、选择/后果、知情与物证/未知。下一轮不以本handoff替代原文，不宣称一次连读百章。
4. 观察公开使用是否经当事人选择、代存不等授权、第11日工作是否实际交付、宋/赵/范保管物是否有领取返还，以及程序叙述是否持续挤压生活冲突。
5. **仍禁止自行修改旧章或写101。**完整旧文读后再在正式治理范围内讨论/执行有限续写与跨卷修订，独立区、令牌恢复、replay_review及CAS不能绕过。

## 失败与交付限制

failures.json保留全部已知失败：compare误用--source（退出2，改--other成功）、首次嵌套FastCtx不可调用、第23章文件名少“留”字；另留末尾空行与顶层source_hashes校验元数据修正。未发现需向主任务提交最小复现的产品缺陷，未改主产品代码。未执行npm测试（无产品实现变更），以实际更新入口/幂等/根定制/完整素材/漂移/check验证本阶段。

未联网、上传、付费、提交、推送、发布；未启动其他代理或会话。主仓库git diff --exit-code为0，git status仍仅预有.idea与本campaign未跟踪项。本阶段是知情模型阅读与隔离工程验证，不能据25章判全书、真人、市场或正式发布验收完成。
`;
fs.writeFileSync(path.join(stage,'handoff.md'),md,{flag:'wx'});
const engineering={completed_at:now.toISOString(),elapsed_minutes:Number(mins),commands:22,product_commands:20,git_read_only_commands:2,update,unchanged_retry:retry,author_evidence:input.author_evidence,build:audit.build_id,verification:'final-audit.json',failures:'failures.json',initial_git_status:'?? .idea/\n?? acceptance/20261018-hundred-f/\n',final_git_status:fs.readFileSync(path.join(base,'commands/f-a-021-final-git-status/stdout.raw.txt'),'utf8'),final_git_diff_exit:read(path.join(base,'commands/f-a-022-final-git-diff/result.json')).exit_code};
fs.writeFileSync(path.join(stage,'engineering-report.json'),JSON.stringify(engineering,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({handoff:'read-a-update/handoff.md',revision:handoff.revision,generation:handoff.generation,elapsed_minutes:Number(mins),chapters:handoff.read_units.length,build_id:handoff.build_id}));
