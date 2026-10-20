import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const U=path.dirname(fileURLToPath(import.meta.url)),W=path.join(U,'scenario','东岸末班船');
const P='D:/work/other/ai-writer/.tmp/U 最终交付解压/ai-writer-0.9.0';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const readJson=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const put=(p,s)=>{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,s,{flag:'wx'});};
const evidence=[];
for(const dir of fs.readdirSync(path.join(U,'commands')).filter(s=>/^a[0-9]{2}-/.test(s)).sort()){
  const base=path.join(U,'commands',dir),r=readJson(path.join(base,'result.json'));
  if(r.exit_code!==0)throw Error('CLI failed: '+dir);
  for(const name of ['stdout.raw.txt','stderr.raw.txt','argv.raw.json','stdin.raw.bin'])if(!fs.existsSync(path.join(base,name)))throw Error('Missing raw evidence '+dir+'/'+name);
  for(const input of r.inputs){if(sha(fs.readFileSync(path.join(base,'input.raw.json')))!==input.sha256)throw Error('Input evidence mismatch '+dir);}
  evidence.push({label:dir,exit_code:r.exit_code,before_state_sha256:r.before_state_sha256,after_state_sha256:r.after_state_sha256});
}
if(evidence.length!==25)throw Error('Expected exactly 25 recorded product CLI calls');
const status=readJson(path.join(U,'commands','a24-status-stop','stdout.raw.txt'));
const check=readJson(path.join(U,'commands','a25-check-stop','stdout.raw.txt'));
const workflow=readJson(path.join(U,'commands','a23-workflow-stop','stdout.raw.txt'));
const freeze=readJson(path.join(U,'写前-A.json'));
const currentStateSha=sha(fs.readFileSync(path.join(W,'.writer','state.json')));
if(status.revision!==3||workflow.revision!==3||check.units!==0||status.draft_inventory.registered_count!==0||currentStateSha!==freeze.state_sha256)throw Error('Unexpected final tracking state');
for(const s of freeze.sources)if(sha(fs.readFileSync(path.join(W,s.ref)))!==s.sha256)throw Error('Prewrite source changed '+s.ref);
for(const v of [freeze.context,freeze.template])if(sha(fs.readFileSync(path.join(W,v.ref)))!==v.sha256)throw Error('Prewrite input changed '+v.ref);
const manuscriptFiles=fs.readdirSync(path.join(W,'正文'),{recursive:true});
if(manuscriptFiles.length)throw Error('Unexpected assembled manuscript');
const partFiles=fs.readdirSync(path.join(W,'分段','0001','v1')).sort();
if(JSON.stringify(partFiles)!==JSON.stringify(['01.md','02.md']))throw Error('Unexpected part files');
const parts=partFiles.map((name,i)=>{
  const ref='分段/0001/v1/'+name,b=fs.readFileSync(path.join(W,ref)),s=b.toString('utf8');
  const body=s.replace(/^#.*(?:\r?\n|$)/gm,'');
  const count=(body.match(/\p{Unified_Ideograph}/gu)||[]).length;
  const headings=(s.match(/^#/gm)||[]).length;
  if(count<1100||count>1500||headings!==(i===0?1:0))throw Error('Part length/title check failed '+ref+' '+count);
  return {ref,sha256:sha(b),bytes:b.length,body_han:count,headings};
});
const promptSha=sha(fs.readFileSync(path.join(W,'研究','验收prompt-A原文.md')));
if(promptSha!==freeze.prompt.sha256||promptSha!==sha(fs.readFileSync(path.join(U,'prompt-a-first.md'))))throw Error('Prompt evidence differs');
const doctor=readJson(path.join(U,'commands','a09-workspace-doctor','stdout.raw.txt'));
const packageDoctor=readJson(path.join(U,'commands','a02-package-doctor','stdout.raw.txt'));
if(!doctor.ok||doctor.build.observed_content_id!==packageDoctor.build.observed_content_id)throw Error('Tool identity mismatch');
const preflight=readJson(path.join(U,'A前置核对.json'));
const total=parts.reduce((n,p)=>n+p.body_han,0);
const manifest={checked_at:new Date().toISOString(),scope:'A-first-stop-only',W,P,revision:3,state_sha256:currentStateSha,parts,total_body_han:total,count_method:'去除Markdown标题行后，按Unicode Unified_Ideograph计正文汉字；标点、阿拉伯数字与其他字符不计。',prewrite_sources_unchanged:true,prewrite_inputs_unchanged:true,registered_units:0,assembled_manuscripts:0,tool:{version:doctor.tool_version,entry:path.join(W,'.writer/tool/bin/ai-writer.mjs'),content_id:doctor.build.observed_content_id,runtime_id:doctor.build.runtime_id},prompt_sha256:promptSha,external_thread_id:preflight.thread_id,cli_calls:evidence,nature:'机械校验；文学结论另见知情自检；不是三章全流程验收完成'};
put(path.join(U,'A首停校验.json'),JSON.stringify(manifest,null,2)+'\n');
const table=parts.map(p=>`| ${p.ref} | ${p.body_han} | ${p.sha256} |`).join('\n');
const report=`# A首两段：当前版本知情自检

审查者：执行写作的同一Codex默认代理，知情自检。不是隔离代理、真人盲读或市场验证。实际完整读取writer.json及最终01.md全部42行、02.md全部76行，并按01→02顺序连续复读；本报告不覆盖未写的后半章。

revision 3；state SHA256：${currentStateSha}。

| 实读路径 | 正文汉字 | 当前SHA256 |
| --- | ---: | --- |
${table}

计数口径：${manifest.count_method} 合计${total}字，首章仍未达到5000字目标，不是完整章。

## 实读结果与计划回对

第1段落实了许蓉亲见老丁放箱、移箱与具体箱体观察；第2段落实沈禾到场、播放语音、问押金、拨父亲电话未接及周岸到场。周岸暂松提手，箱子未换保管人。空间在公共候船室，尚未买票、未越检票口。第1章goal/change与最后两项beats尚未完成，不能凭规划登记成事实。

当前第1章细纲SHA256：${freeze.sources.find(s=>s.ref==='大纲/单元/0001.json').sha256}；卷一SHA256：${freeze.sources.find(s=>s.ref==='大纲/分卷/V1.json').sha256}。成稿把计划中的“托老丁带回合作点”具体展开成“先放检修棚门边，周岸下工再带去合作点还”，让临时存放和正式归还有区别；这是一般转运路径的合理细化，原细纲及写前哈希未改。章末核实、约定与后续兑现均缺正文，明确留待后续实际授权与执行。

许蓉的关照通过找药、搬箱、放稳、留出窗口与被耽误的饭呈现；沈禾问钱、先不买票、主动打电话；周岸找箱并说明自己的押金。保留温和合作和普通口气，不为增加戏剧性将任何人改成嫌疑人。

## 已修正与改前证据

| 问题 | 原句或初检 | 最小修正与结果 | 原稿证据 |
| --- | --- | --- | --- |
| 第1段篇幅不足 | 初稿1037正文汉字 | 补清理木凳与落脚处的实际动作；最终${parts[0].body_han}字 | U/过程稿-A/01-初稿-未达段长.md及01-初稿核对.json |
| 报修指代 | “这声响终于可以写进报修本” | 改为“正好请人修修窗扣”，报修对象明确 | 同上 |
| 补写引入揭示顺序错误 | 泥印在箱子尚未搬开时已“露出” | 将泥印显露移到搬箱之后，最终全文复读 | U/过程稿-A/01-r1-泥印时序待修.md |
| 第2段初稿不足目标区间 | 初稿1087正文汉字 | 补沈禾问清收款处、先不买票与候船位置的行动；最终${parts[1].body_han}字 | U/过程稿-A/02-初稿-路径对白待修.md及两段初检.json |
| 对白指代和转运路径含混 | “哪个是不是哪个”；“带回合作点，放修理棚门边” | 改为“是不是眼前这一只”；明确先搁棚边，再带去合作点还 | 同上 |
| 补写后的旧指代残留 | “原本已经伸进挎包，听见这话”与新增对话脱节 | 删除残留动作；沈禾仍站窗口，再明确走近箱子 | U/过程稿-A/02-r1-指代承接待修.md |

## 真人语言别扭句

针对“有没有意思能懂却像硬拼出来或不像当面会说的话”，对最终两段逐句做当面说话测试、动宾拆分、具体落地和模型文本试读的朗读改口测试；没有真人发声或录音。改前“哪个是不是哪个”同时造成当面复述改口、指代辨认负担；报修“声响”在动宾及具体落地测试中错指对象，均已修正。其余正常比喻、停顿和长句保留。

### 真人语言硬问题

没有

## 物理逻辑与知情

物理逻辑、可操作性、显露顺序、小物动作、物件状态在这两段的模型实读中未见继续阻断的问题。钢箱先从凳下拖出再双手搬数步、放稳后擦盖；泥印后显，未开箱；搭提手不等于交接。药片用纸片取起，手机始终由沈禾持有。上述是局部知情判断，不是产品或作品正式验收。

黄漆箭头仅许蓉在正文中明确观察，读者已见。沈禾看过盖子，但没有证据说她注意或理解箭头；周岸熟悉箱子也不能自动升级为知道该细节用处。父亲与老陶尚未参加通话。后续应分别登记O_BOX_ARROW、T_DELIVER、P_BOX的真实证据及每人所知，当前ledger为0。

## 未覆盖

首章后半、约定原句、完整章5000字、正式observation保护、thread/object登记、同ID恢复、章2/3、跨卷兑现、独立修订、prepare/commit、三章新会话连读、暂停只discuss、负向第4章与导出均未执行。本次只完成A首停。
`;
const reviewRef='审查/A-首两段-知情自检.md';
put(path.join(W,reviewRef),report);
const handoff=`# 交接-A首停

本进程已经到达用户明确停点并结束工作。此交接用于同ID恢复核对，不是新的写作授权。正文只有第1章前两个分段；没有合章，没有record，第3段及第2/3章均未写。

## 路径和工具身份

- U：${U.replaceAll('\\','/')}
- W：${W.replaceAll('\\','/')}
- P：${P}
- 实际初始化入口：P/bin/ai-writer.mjs；此后25次记录中的后续产品调用均使用W/.writer/tool/bin/ai-writer.mjs（P前置调用除外）。
- 当前随附入口：${manifest.tool.entry.replaceAll('\\','/')}；版本${doctor.tool_version}，profile workspace-copy；Node ${doctor.node}。
- P与W observed_content_id：${manifest.tool.content_id}；runtime_id：${manifest.tool.runtime_id}。doctor无missing/mismatches；指纹不是供应链签名。
- 来源包声明source_commit：${doctor.build.provenance.source_commit}，dirty=${doctor.build.provenance.dirty}。这是候选包声明，不是本轮新提交；没有Git提交或推送。

## 原会话与任务来源

外部环境CODEX_THREAD_ID与CODEX_SESSION_ID实际读到相同值：${preflight.thread_id}。证据为U/A前置核对.json；不是作者消息ID，不用它伪造author_evidence。

原prompt：U/prompt-a-first.md；作品内逐字节副本：研究/验收prompt-A原文.md。SHA256：${promptSha}。quote/locator/hash已经通过workflow/decision正式输入保存，详见U/inputs与commands各次input.raw.json；prompt第11—15行为本进程明确停点，第9行保存整体后续编排。

具体人物、关系、金额、船期、外观原字来自U/试验代理选择-A.md及作品研究/同名副本，来源标注为试验代理选择，不是人类作者逐字指定，也不是用户已有作品指示。D_U_DIRECTION为本测试计划confirmed；D_U_OLD_STORY仍candidate，父亲离开渡口的原因未定。

## 当前workflow和revision

revision **3**；schema6；stage=trial；allowed_actions=[discuss,plan,draft]；整体有限draft_range=1—3；revise_range=null。本进程stop_conditions已触发：仅01/02、实读修复、交接后正常结束，禁止合章/record/第3段/第2—3章。

state SHA256：${currentStateSha}。正式workflow事件见commands/a18-workflow-trial/stdout.raw.txt；当前只读结果见commands/a23-workflow-stop/stdout.raw.txt。不要把next_unit=1或draft_range的工具级区间当作跨越本进程停点的许可。保留trial状态以保留写前版本，不自行改成后续阶段或刷新旧输入。

status/check：已登记0章，next_unit=1，characters=0、ledger=0，活跃修订和事务为空；stale_units、changed_sources、impact_pending为空。正文目录为空，draft_inventory.unregistered为空只说明没有正文目录候选，不说明分段不存在。check的mechanical-only/units=0不证明文学质量或三章验收完成。

## 写前输入及分段版本

- 写前context：W/${freeze.context.ref}；SHA256 ${freeze.context.sha256}。
- 写前record-template：W/${freeze.template.ref}；SHA256 ${freeze.template.sha256}；expected_revision=3，summary仍为空，不可拿来登记半章。
- 写前来源完整副本及真实哈希：U/写前来源-A/与写前-A.json。最终比对九个来源、context及模板都未变化，未写后重取模板或刷新哈希。
- 预定完整章路径为W/正文/0001-长凳下的箱子.md，当前不存在。

| 片段（W内相对路径） | 正文汉字 | SHA256 |
| --- | ---: | --- |
${table}

计数口径：${manifest.count_method} 合计${total}字，距离首章至少5000字还差至少${5000-total}字，章1未完成。第1段唯一标题，第2段无章标题。当前实际末句：“周岸的手松开了。沈禾又把手机点亮，站回木凳旁边。”恢复时实读两片段当前全文，不能凭status空正文重新写开头。

## 已发生事件和人物/物件现状（交接摘要，未正式ledger）

1. 当晚18:50开场；老丁放箱约在十来分钟前。沈禾和周岸的具体到场钟点没有写死，不把规划中的估计时间当正文事实。许蓉→沈禾→周岸为实际到场顺序。
2. 许蓉亲见老丁把箱放长凳下，只听他说“周岸那个，先放一下”。随后许蓉搬到值班窗外靠墙木凳并看管，未开盖。周岸只搭过提手后松开，未提走、未完成交接；沈禾没有拿箱。
3. 箱盖观察实际原字：“箱盖右后角画着一支黄漆箭头，箭头朝向提手。”拟ID O_BOX_ARROW/type observation。现阶段未record，保护机制尚未实测；下一完整章登记须承接这段原字，不能逆改观察来配合第三章。许蓉明确看到；沈禾只明确看过盖子；周岸没有在正文解释箭头。
4. 沈禾播放她称为父亲的语音：“下班到合作点，取那个绿铁箱。我跟老陶说过了。你看好钟，别误了末班。”许蓉听见；周岸到场较晚，没听这段语音，当前只听许蓉说姑娘也来取箱，尚未在文中听到沈长年或沈禾姓名。
5. 沈禾转述先到合作点发现门锁、问到拉车人说箱送渡口。许蓉据车把白毛巾等听着像老丁，但没有亲见姑娘在路口与他交谈。周岸自述让老丁先放修理棚门边，自己下工再带去合作点归还；“棚门边”是否听成“船门边”仍是周岸猜测，未核老丁。
6. 父亲电话已拨一次、未接。老陶号码刚输完被周岸到场打断，未拨出，老陶没有在电话里确认任何事。父亲、老陶不能自动知道候船室现状。
7. 许蓉说明一般借箱押二百，未掌握父亲与老陶具体安排。周岸自称老陶处有自己的二百元押金，许蓉与沈禾在场听见，尚未核对凭据或退钱。沈长年新押金未确认/未支付；沈禾未垫款。船票另计，沈禾明确选择暂不买票，没有登船、未越检票口。
8. T_DELIVER关门前送到父亲手中的约定尚未在正文说出；P_BOX物件ID也只是规划，不能把约定或下一保管人提前写进权威账本。当前箱由许蓉看管，在东岸候船室木凳，闭盖、右扣微翘，内物未查。周岸那卷电线放门边干地，与旧箱不是同物。

## 尚未完成及恢复检查点

只有当后续进程按原测试编排被实际调度继续时，先使用同一外部会话ID，运行随附入口status、workflow show，实读本交接、原prompt、两片段、写前输入并比对state/来源。若有漂移，保留旧输入，先核因及实读影响；不能只刷新哈希。不要自动启动正文。

首章剩余行动：三人相互说清身份和各自理由；实际联系老陶、父亲并保留未接/延迟边界；作出等候选择；真实说出有限交箱约定。之后首章仍须达到至少5000正文汉字，完整展开、保留原片段，合章、全文实读、纲文回对、报告绑定、preview退出0才record。当前进程这些步骤一概未执行。

全试验剩余：同ID在章1/2之间恢复、章2≥3500字、跨卷章3≥5000字、observation/thread/object实际登记与跨卷回读知情；授权的一处普通报价或日程独立修订及最早影响章至3重登、尾段完整连读、prepare/commit（工具修订事务，不是Git提交）；新鲜会话完整读当前1—3并审查，暂停只discuss，负向第4章，导出至U下新目录。父亲旧事允许不明，不因清单而自动结案。

## 证据和边界

25次产品CLI均实际调用，完整stdout/stderr、argv/空stdin原字节、输入JSON原字节、actual exit_code和前后state副本/SHA保存在U/commands/a01— a25的各自目录，全部exit_code=0。本阶段没有执行preview、record、assemble或负向第4章；不能宣称已验证其拒绝语义。

执行代理失败与修正原稿见U/A非CLI失败记录.md、A输入核对修正.md及过程稿-A/。包含一次工具发现接口失败、未提交的notes字段输入修正、两段初稿字数不足和局部改写引入问题，均保留改前字节，不只保留最终结果。它们不是虚构的产品CLI失败。

最终两段完整实读的知情自检：W/${reviewRef}；SHA256 ${sha(Buffer.from(report,'utf8'))}。最终机械校验：U/A首停校验.json。全部结论仅到A首停，不是正式发布、真人盲读、市场验证或三章端到端全流程通过。
`;
put(path.join(U,'交接-A首停.md'),handoff);
console.log(JSON.stringify({ok:true,revision:3,parts,total_body_han:total,registered_units:0,cli_count:evidence.length,report:reviewRef,handoff:'交接-A首停.md',handoff_sha256:sha(Buffer.from(handoff,'utf8')),state_sha256:currentStateSha}));
