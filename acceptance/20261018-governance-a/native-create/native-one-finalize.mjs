import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
const b='acceptance/20261018-governance-a',p=`${b}/works/纸灯札记`,out=`${b}/native-create`;
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const commandDirs=fs.readdirSync(`${b}/commands`).filter(x=>x.startsWith('native-one-'));
const commands=commandDirs.map(label=>({label,...read(`${b}/commands/${label}/result.json`)})).sort((a,b)=>a.started_at.localeCompare(b.started_at));
const response=label=>read(`${b}/commands/${label}/stdout.raw.txt`);
const status=response('native-one-status-compact'),full=response('native-one-status-full'),check=response('native-one-check'),discussion=response('native-one-discussion'),decisions=response('native-one-decisions-current'),doctor=response('native-one-bundled-doctor');
const before=read(`${out}/native-one-reject-before.json`);
const checkpoints=['context','template','record'].map(type=>{
 const after=read(`${out}/native-one-reject-after-${type}.json`),label=`native-one-reject-u7-${type}`;
 const result=commands.find(x=>x.label===label);
 const stderr=fs.readFileSync(`${b}/commands/${label}/stderr.raw.txt`,'utf8');
 const stdout=fs.readFileSync(`${b}/commands/${label}/stdout.raw.txt`,'utf8');
 const error=JSON.parse((stderr.trim()?stderr:stdout));
 const comparison={probe:type,label,exit_code:result.exit_code,code:error.code,state_sha256:after.state_sha256,state_unchanged:after.state_sha256===before.state_sha256,drafts_unchanged:JSON.stringify(after.drafts)===JSON.stringify(before.drafts),all_work_files_unchanged:JSON.stringify(after.files)===JSON.stringify(before.files)};
 if(comparison.code!=='ACTION_OUT_OF_SCOPE'||comparison.exit_code===0||!comparison.all_work_files_unchanged||!comparison.state_unchanged) throw Error(`probe evidence mismatch: ${type}`);
 return comparison;
});
const chapters=Array.from({length:6},(_,i)=>{
 const unit=i+1,record=read(`${out}/native-one-u${unit}-record.json`),body=fs.readFileSync(`${p}/${record.draft}`,'utf8').replace(/^# .*\r?\n/,'');
 const count=(body.match(/\p{Script=Han}/gu)||[]).length;
 if(count<400||count>700) throw Error(`chapter ${unit} count`);
 const actual=read(`${out}/native-one-u${unit}-actual.json`),plan=read(`${out}/native-one-u${unit}-plan.json`);
 return {unit,title:plan.title,draft:record.draft,body_han:count,sha256:hash(fs.readFileSync(`${p}/${record.draft}`)),record_revision:response(`native-one-u${unit}-record`).revision,summary:actual.summary,goal:plan.goal,change:plan.change};
});
const unexpected=commands.filter(x=>x.exit_code!==0&&!x.label.startsWith('native-one-reject-u7-'));
if(unexpected.length) throw Error('unexpected product failures must be manually reviewed');
if(status.next_unit!==7||status.next.action!=='暂停正文，先讨论全书总纲'||status.governance.stage!=='structure'||status.governance.authorization.draft_range!==null||status.governance.authorization.revise_range!==null||JSON.stringify(status.governance.authorization.allowed_actions)!==JSON.stringify(['discuss','plan'])) throw Error('final governance mismatch');
if(check.findings.length||check.rolling_review.pending_windows.length||check.draft_inventory.unregistered.length||!doctor.ok) throw Error('final validation mismatch');
if(Object.keys(full.snapshot.ledger).some(id=>id.startsWith('D_'))||decisions.decisions.current.length!==2||decisions.decisions.candidates.length!==1||decisions.decisions.candidates[0].adopted_items.length) throw Error('decision/ledger separation mismatch');
const stateSha=hash(fs.readFileSync(`${p}/.writer/state.json`));
if(stateSha!==before.state_sha256) throw Error('state changed after probes');
const git=spawnSync('git',['status','--short'],{encoding:'utf8',windowsHide:true});
fs.writeFileSync(`${out}/native-one-final-git-status.txt`,git.stdout+git.stderr,'utf8');
const summary={fixture:'纸灯札记',run:'native-one',kind:'novel',project:path.resolve(p),schema_version:status.schema_version,revision:status.revision,registered_range:{from:1,to:6},registered_count:6,body_han_total:chapters.reduce((n,c)=>n+c.body_han,0),chapters,stage:status.governance.stage,task:status.governance.task,authorization:status.governance.authorization,next_unit:7,next_action:status.next.action,decisions:decisions.decisions,planning:status.governance.planning,mechanical_check:check,bundled_tool:{version:doctor.tool_version,profile:doctor.build.profile,observed_content_id:doctor.build.observed_content_id,runtime_id:doctor.build.runtime_id,errors:doctor.errors,warnings:doctor.warnings},state_sha256:stateSha,rejection_probes:checkpoints,product_commands:commands.length,success_commands:commands.filter(x=>x.exit_code===0).length,expected_rejected_commands:checkpoints.length,unexpected_product_failures:unexpected.length,non_product_failure:{kind:'apply_patch preparation rejected before writing',error:'apply_patch verification failed: invalid patch: multiple operations target D:\\work\\other\\ai-writer\\acceptance\\20261018-governance-a\\works\\纸灯札记\\设定\\作品定位.md',recovery:'改用授权的一次性 Node 脚本 native-one-prepare.mjs；未重试产品命令或刷新哈希'},independent_recovery:'not-run; wait for a separate new session',quality:'draft; model-self-review only; no human/market/final-release acceptance',commands};
fs.writeFileSync(`${out}/native-one-completion.json`,JSON.stringify(summary,null,2)+'\n',{flag:'wx'});
const cmdRows=commands.map(c=>`| ${c.label} | ${c.exit_code} | ${c.argv.map(x=>x.replaceAll('|','\\|')).join(' ')} |`).join('\n');
const chapterRows=chapters.map(c=>`| ${c.unit} ${c.title} | ${c.body_han} | ${c.record_revision} | ${c.summary} |`).join('\n');
const report=`# 真实 Codex 独立作品创作过程报告：native-one

本轮以当前主项目 CLI 从空目录创建《纸灯札记》，完成有限六章试写及治理转段。当前为 schema 3、revision ${status.revision}，登记范围1—6，正文共${summary.body_han_total}汉字。任务正式保存为“暂停正文，先讨论全书总纲”，stage=structure，仅 discuss/plan，draft_range 与 revise_range 均 null。next_unit=7 只是顺序，next.action 明确指向总纲讨论。独立新会话恢复尚未执行，交接后停止。

## 授权和写入范围

仅写本作品目录、本阶段 native-create 下 native-one 命名的资料，以及 commands/native-one-*。不改产品实现，不运行额外代理，不联网、提交、推送、发布；不运行 npm test；不访问或迁移真实旧作，不改旧封存目录。原项目开始时已有未提交实现改动，未由本会话处理；最终 git status 原始输出保存在 native-one-final-git-status.txt。本轮目录外无主动写入。

先实读主项目 writer-project、writer-novel、docs/workflow.md 创作治理段及长篇参考；依据 writer-project 使用正式 CLI 初始化、启用分卷和逐章登记。初始化随附技能、许可、来源清单与工具 build-manifest 保留。仅用文件和正式 CLI，不导入 lib 函数，不编辑 state 或 journal。

## 作者证据、采纳与规划

作者原话逐字复制在作品“研究/作者指令.md”第5行；UTF-8 实际字节 SHA256 为 ${read(`${out}/native-one-author-evidence.json`).source_sha256}。所有治理 quote 都取原话子串，来源绑定真实哈希；没有可核消息ID，locator 明写本轮请求与本地行位置，不伪造ID。workflow 输入从 workflow show 返回的 workflow 原型整理，没有把 governance 展示对象当输入。

治理变更独立 operation_id：native-one-trial-001、native-one-decision-sect-001、native-one-decision-craft-001、native-one-decision-first-item-001、native-one-pause-structure-001。各项均一次执行成功，无复用ID或幂等重试。plan/volume/record/review 按其正式接口调用，使用各自唯一命令标签记录，没有擅加这些接口未要求的 operation_id。

定位、文风、人物、简洁全书骨架及卷契约均小而具体；V1/旧灯试修显式覆盖1—6章，A1覆盖1—3，A2覆盖4—6。规划采纳状态始终 draft，未把文件存在和完成写稿当作作者已采纳。

正式决策为：D_SECT confirmed，只采纳青岚宗方向，经名/住舍人数/作息数字未决；D_CRAFT confirmed，只采纳炼器先行；D_FIRST_ITEM candidate，adopted_items=[]，首件法器仍未选、小盾仅推荐。事实 ledger 仅 O_LAMP，记录正文发生的修灯与保管交接，不登记作者选项为正文事实。

## 逐章执行与实际结果

每章依序 plan → 完整读取 context → record-template → 实际写稿 → 逐段自检 → 填真实 summary/changes → record。模板原 revision 和完整 source_hashes 保留，写后未重取模板刷新来源；没有手改 state。正文标题以外用 Unicode Script=Han 计汉字，标点、换行不计。

| 章节 | 正文汉字 | 登记revision | 实际变化 |
| --- | ---: | ---: | --- |
${chapterRows}

第3章后完整重读1—3章并登记 model-self-review；第6章后完整重读1—6章并登记同类型报告，后一次实读覆盖整六章。两份 review 的输入一次列齐真实正文路径与当前字节哈希；未伪称真人盲读。模型复盘保留第6章交接句稍显记录式的非阻断建议；原稿未改，既无哈希漂移，也无回退或重登。

第6章 record 成功至 revision 11 后，立即用新 workflow set 转 structure 至 revision 12，再完成六章复盘登记。未生成第7章细纲或正文；讨论入口保存于“研究/六章复盘与总纲讨论.md”，只有总纲问题，不预写后续事件。

## 实跑验证与拒绝证据

status compact/full 均显示 next_unit=7、next.action=暂停正文，先讨论全书总纲；plan_exists=false，registered_count=6，unregistered=[]，stale_units=[]，changed_sources=[]。context --purpose discussion 不需第7章细纲且成功恢复当前任务；decision current 实际返回两条确认与一条候选。

check：scope=mechanical-only，findings=[]，rolling_review valid=2、stale=0、pending_windows=[]；literary_quality 仍 unreviewed，不把机械通过当文学验收。

作品随附入口实际运行 doctor 成功：Node ${doctor.node}、tool ${doctor.tool_version}，workspace-copy；missing/mismatches/errors/warnings 均空，7个技能；引擎为 optional-in-workspace-copy。observed_content_id=${doctor.build.observed_content_id}；runtime_id=${doctor.build.runtime_id}。这是随附拷贝的实际诊断，未替换工具或把指纹当签名。

第7章探针实际执行 context、record-template 与伪 record，三者都返回 ACTION_OUT_OF_SCOPE，包装器 result.json 中真实退出码均为2。伪 record 输入仅是门禁测试 envelope，引用不存在的第7章路径，未写第7章内容、摘要剧情或细纲；未为通过校验创建正文。

探针前及每次探针后的 state 原始字节副本和全作品文件哈希清单，分别保存于 native-one-reject-before*、native-one-reject-after-context*、native-one-reject-after-template*、native-one-reject-after-record*。四处 state SHA256 一致：${stateSha}。正文始终只有1—6章，六份细纲也未增减；逐项全作品文件路径、字节数和哈希均相同，未出现锁遗留、journal 增写或未授权文件。只读检查在探针前完成，探针后的全文件不变证据证明其对应内容未变。

## 失败、修正与未覆盖

产品 CLI 共${commands.length}条：成功${summary.success_commands}条、预期越界拒绝3条；意外产品失败0条、产品重试0次。每条均用既有 capture.mjs、唯一 native-one-* 标签保存真实 argv、开始时间、退出码与完整 stdout/stderr，并回显。随附 doctor 同样经包装器，实际 argv 指向随附入口而非主入口。

非产品编辑工具失败1次：最初 apply_patch 将同一路径同时作 Delete/Add，工具返回“invalid patch: multiple operations target ...作品定位.md”，在校验阶段拒绝，未落盘。随后按本轮许可改用 native-one-prepare.mjs 一次性写准备资料；无产品行为变更。原失败记录保留于本会话工具轨迹，本段为明确标注的人工转记，不伪造 product CLI 日志。未发现需要修改实现的产品问题。

未覆盖：独立新会话只凭文件恢复、真人阅读/文学验收、市场验证、发布、外部环境、真实旧作迁移、完整 npm test 或引擎回归；本轮仅本机真实 Codex 创作与 CLI 治理验收路径。角色热状态含“当前无后续正文任务”的操作备注，不作为人物知情或剧情事实；恢复任务只以 governance 为权威。

未决项：全书终局、篇幅、后续卷数、定位与骨架整体采纳、首件法器（小盾仅推荐）、经名、住舍人数、作息数字。后续应先讨论总纲，不能因登记序号7而写正文或修订旧章。

## 路径与下一会话入口

- 作品：${path.resolve(p)}
- 作者原话：作品/研究/作者指令.md
- 正文：作品/正文/0001—0006；实际完整文件名与SHA见 native-one-completion.json
- 治理权威：作品/.writer/state.json 与不可变事件；不要手改
- 逐章自检与连读：作品/审查/
- 命令原始证据：acceptance/20261018-governance-a/commands/native-one-*/
- 本过程报告：native-one-process-report.md
- 完成摘要：native-one-completion.md 和 native-one-completion.json
- 拒绝快照与state副本：native-one-reject-*.json

下一独立会话先 status、context --purpose discussion、decision current，读取作品/研究/六章复盘与总纲讨论.md；当前只讨论和规划。该恢复尚待另一个新会话实际执行，本会话到此停止。

## 全部产品命令清单

每行完整 argv 和真实退出码均来自各命令 result.json，原始 stdout/stderr 就在同标签目录。

| 唯一标签 | 产品退出码 | 实际 argv |
| --- | ---: | --- |
${cmdRows}
`;
fs.writeFileSync(`${out}/native-one-process-report.md`,report,'utf8');
const completion=`# native-one 完成摘要

新作品《纸灯札记》已用正式 CLI 创建为 schema 3 并显式启用分卷。1—6章均完成 plan/context/模板/实际写稿与自检/真实差量 record；正文汉字依序为456、453、469、446、454、471，合计2749。1—3、1—6两次实读已登记 model-self-review，均绑定当前正文哈希。

当前 revision=12，stage=structure，任务=暂停正文，先讨论全书总纲；allowed_actions=[discuss,plan]，draft_range=null，revise_range=null。next_unit=7，行动仍是讨论总纲。无第7章细纲或正文。

两条 confirmed 只采纳青岚宗方向、炼器先行；首件法器 candidate，小盾仅推荐。经名、住舍人数、作息数字、总纲、篇幅、后续卷数与规划草案采纳继续未决。

status compact/full、discussion context、decision current、check、随附 doctor 均成功。check findings=[]；有效滚动审查2，欠审窗口空。第7章 context/template/伪record 三次真实拒绝均为 ACTION_OUT_OF_SCOPE、产品退出码2，拒绝前后整个作品目录清单与字节哈希不变。

最终 state SHA256：${stateSha}

产品命令${commands.length}条，${summary.success_commands}成功、3预期拒绝，无意外产品失败或重试；另有一次准备资料补丁校验失败，未落盘后改用授权 Node 脚本。细节及证据见[过程报告](native-one-process-report.md)、[机器摘要](native-one-completion.json)。作品位于 ../works/纸灯札记，原始命令在 ../commands/native-one-*。

未改产品实现、未运行额外代理或npm test、未联网/提交/推送/发布、未迁移或改动真实旧作。独立新会话恢复尚未执行；模型自查与机械通过均不代表真人或最终产品验收。现已停止，留待另一个新会话只凭文件恢复。
`;
fs.writeFileSync(`${out}/native-one-completion.md`,completion,'utf8');
console.log(JSON.stringify({commands:summary.product_commands,success:summary.success_commands,expected_rejections:3,body_han_total:summary.body_han_total,stage:summary.stage,next_unit:7,next_action:summary.next_action,state_sha256:stateSha,rejection_checks:checkpoints,files:['native-one-process-report.md','native-one-completion.md','native-one-completion.json']},null,2));
