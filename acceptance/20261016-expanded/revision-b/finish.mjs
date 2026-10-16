import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {json,write,walk,stage,project,root,hash} from './run.mjs';
const s=json(project+'/.writer/state.json'),a=json(stage+'/audit.json');
const m=json(stage+'/export/manifest.json'),e=json(stage+'/after/export-command.json');
assert.deepEqual(e.included_units,Array.from({length:20},(_,i)=>i+1));assert.equal(e.excluded_drafts.length,0);assert.equal(e.warnings.length,0);
const manuscript=fs.readFileSync(stage+'/export/manuscript.md','utf8');
assert.equal(hash(Buffer.from(manuscript)),e.sha256);
for(const u of s.units){const body=fs.readFileSync(project+'/'+u.draft,'utf8').trim();assert(manuscript.includes(body));assert.equal(manuscript.split(body).length-1,1);}
assert.equal((manuscript.match(/^# 第[^\r\n]+章/gm)??[]).length,20);
assert.equal(m.revision,s.revision);assert.deepEqual(m.included_units,e.included_units);
write(stage+'/after/export-verification.json',{ok:true,revision:s.revision,units:e.included_units,excluded:0,omitted:0,duplicates:0,body_contents:'20/20 exact trimmed body inclusion, once each',manuscript_sha256:e.sha256});
const sem=x=>{const y=structuredClone(x);for(const v of Object.values(y.ledger??{})){delete v.introduced_unit;delete v.updated_unit;v.evidence=v.evidence.map(e=>({unit:e.unit,quote:e.quote}));}return y;};
const old=json(stage+'/before/replayed-snapshots.json'),cur=json(stage+'/after/replayed-snapshots.json');
function diff(x,y,p='',out=[]){if(JSON.stringify(x)===JSON.stringify(y))return out;if(x&&y&&typeof x==='object'&&typeof y==='object'&&!Array.isArray(x)&&!Array.isArray(y)){for(const k of new Set([...Object.keys(x),...Object.keys(y)]))diff(x[k],y[k],p?p+'.'+k:k,out);}else out.push({field:p,before:x,after:y});return out;}
const per=s.units.map(u=>({unit:u.unit,changes:diff(sem(old[u.unit]),sem(cur[u.unit]))}));write(stage+'/replay-semantic-diff.json',per);
write(stage+'/replay-semantic-diff.md','# 逐章重放语义差异\n\n此表对照同一章修前与修后快照，不把第20章终态冒充第11–14章历史。完整字段前后值见 replay-semantic-diff.json。\n\n| 章 | 语义差异字段 |\n|---|---|\n'+per.map(x=>'| '+x.unit+' | '+(x.changes.map(c=>c.field).join('、')||'无；正文和登记保持原样')+' |').join('\n')+'\n');
const notes={7:'09:35→09:50，新增临走挪小车、卸装篷布、扎绳垫轮；保留早晨四个固定时点与电话承诺。',8:'入厅10:10→10:25；等8分钟、洗手4分钟、十一点刚过电话与后续饭后返站均原样保留。',11:'只告顾浅布窄牌与归属/责任，不报牌面；客户恢复前天扶微波炉挂门帘，单列审查误判纠正。',14:'唐16:54走、沈复封上架后，前台首次完整口述给顾并获回应；顾未亲见原牌。',20:'在宋拒长灯前，补沈实际问未拆整根可否暂放、展示原位工作照；宋只看照片，知识及证据同步。'};
const chapterTable=fs.readFileSync(stage+'/chapter-diff.md','utf8').split('\n\n## 每章处理')[0];
write(stage+'/chapter-diff.md',chapterTable+'\n\n## 每章处理\n\n'+a.chapterRows.map(r=>'- 第'+r.unit+'章：'+(notes[r.unit]??(r.unit<7?'正文、章纲及整个登记记录均保留。':'正文不改；按新来源和修订号重登原事实，继承已改知识传播记录，原证据完整保留。'))).join('\n')+'\n');
const diffs=[];for(const u of s.units){const before=fs.readFileSync(stage+'/before/work/'+u.draft,'utf8'),after=fs.readFileSync(project+'/'+u.draft,'utf8');if(before===after)continue;diffs.push('## 第'+u.unit+'章\n\n修前：\n\n'+before+'\n\n修后：\n\n'+after);}
write(stage+'/changed-chapters-before-after.md','# 五章修前修后全文对照\n\n'+diffs.join('\n\n'));
const git=spawnSync('git',['status','--short'],{cwd:root,encoding:'buffer'});fs.writeFileSync(stage+'/after/git-status.stdout',git.stdout);fs.writeFileSync(stage+'/after/git-status.stderr',git.stderr);write(stage+'/after/git-status.meta.json',{executable:'git',argv:['status','--short'],cwd:root,exit_code:git.status});assert.equal(git.status,0);
const gd=spawnSync('git',['diff','--name-only'],{cwd:root,encoding:'buffer'});fs.writeFileSync(stage+'/after/git-diff.stdout',gd.stdout);fs.writeFileSync(stage+'/after/git-diff.stderr',gd.stderr);write(stage+'/after/git-diff.meta.json',{executable:'git',argv:['diff','--name-only'],exit_code:gd.status});assert.equal(gd.status,0);assert.equal(gd.stdout.length,0);
const check=json(stage+'/after/check.json'),doctor=json(stage+'/after/doctor.json'),status=json(stage+'/after/status.json');
assert(check.ok&&doctor.ok&&status.ok);assert.equal(check.rolling_review.valid,1);assert.equal(check.rolling_review.pending_windows.length,0);assert.equal(check.rolling_review.stale_without_current_coverage,0);
const rows=a.chapterRows.map(r=>'| '+r.unit+' | '+r.han+' | '+r.before+' | '+r.after+' |').join('\n');
const failures=walk(stage+'/aux-logs').filter(x=>x.endsWith('.meta.json')).map(p=>({meta:path.relative(stage,p).replaceAll('\\','/'),...json(p)})).filter(x=>x.exit_code!==0);
write(stage+'/failures.json',{process_failures:failures,early_orchestration_error:json(stage+'/logs/initial-tool-error.json'),initial_backup_issue:'before-invalid-buffer-copy 保留，未用于回退或重登；before/work 171文件逐原字节hash验证通过',early_auxiliary_parse_failure:'见 early-parse-failure/。此失败发生在host包装器建立前；实际工具回包文本与argv已转录，非事后重跑冒充原始失败。'});
const result=`# 第二轮旧章改写与 Codex 恢复验证结果

实际基线 revision 44，已登记1–20章、next=21、无来源/正文漂移。正式 rewind --from 7 --expected-revision 44 后 revision45，7–20共14章逐章取得新 plan/context/record-template 后重新登记，最终 revision **59**。review 命令不增加 state revision，最终仍59。全程无子代理、不写21章、不手改state/journal、不提交推送发布；产品代码未改。

## 完成状态

- 正文只改第7、8、11、14、20章；1–6正文、章纲和完整登记对象逐字节/逐字段保持原样。
- 最早影响来源是第7章自身章纲，由7消费；拟改7/8/11/14/20各章纲均只由对应章消费。全局设定、权威规则、全书大纲、卷契约不改，未制造更早漂移。详细映射 source-impact.json。
- 当前20章，每章正文Script=Han计数1551–1701，均在1500–2000内；标题不计。五章原文全文对照见 changed-chapters-before-after.md，逐章说明见 chapter-diff.md。
- 修前完整作品171文件原字节快照 before/work、逐文件哈希 before/manifest.json，另保留此前请求、输入、报告、导出及验收历史到before/history。旧journal、rewind备份、review及报告均未删改。
- 全账本36稳定ID保留，所有类型/状态/due_unit/custody及observation.statement逐项相等。198条旧引文中196条不受影响的原引文保留并重绑现稿；仅替换7章09:35引文与11章顾提前知情引文2条，新增8条；最终204条全部核对正文hash、行号和quote。
- 旧20章和新20章journal均实际独立重放，与对应state一致。14次新登记expected_revision顺序45–58，逐项匹配当次真实context/template来源；逐章重建登记前state并核SHA-256，14/14一致，没有复用旧revision或伪造source_hashes。

## 知识迁移

| 重放截至章 | 顾遥实际所知 | 原牌亲见 |
|---|---|---|
| 11 | 浅色棉布、窄铜牌、归属未核且沈继续负责；不知铭文、刻线、日期信息 | 未见 |
| 12 | 继承11，正文无新增告知，快照无14章知识 | 未见 |
| 13 | 继承11，正文无新增告知，快照无14章知识 | 未见 |
| 14 | 唐16:54离店、沈复封上架后，在前台首次当面获完整西埠四号泊位、右下两短线、正反未找到日期，以及首日独开未拍抄边界 | 未见 |

详见 knowledge-migration.md（角色短状态、O_PLATE、P_BOX、真实journal路径/hash与引文），after/replayed-snapshots.json 与 after/snapshots/0011至0014。第15–20章保留完整口述知识，同时各自嵌套的截至13历史仍仅泛知箱内有牌，没有把所有11机械改成14。周5章、唐7章获告和唐14章首次亲见不变。当前原牌地点、唯一原箱及蓝棉绳均保持。

## 时间与话题来源

第三日08:35到站、09:00提醒、09:20拍通知、09:30工人到场均保留；临走助工挪小车、卸装篷布扎绳垫轮，09:50离站。09:50+12分钟=10:02蓝牌，+23分钟（含绕路）=10:25入厅。10:25至十一点刚过约36分钟，固定候问8分钟+洗手4分钟后尚有约24分钟容纳标识、两次问答、帮助旅客、电话周和休息，详见模型报告的可行分配（不是新增正文钟点）。十一点刚过通报早于11:30承诺；其后写本、买饭吃完11:25返程，18+12=30分钟约11:55回站；13:00、14:40、15:00、15:17、15:28、16:05、16:26、17:15等后续原时点成立，未无谓顺延。

第20章确认旧稿答长灯前只有箱照和归属说明。现稿先实际展示灯柱原位工作照并询问未拆整根可否暂放，再让宋拒收。他只看照片，不读门背字、不亲见灯、不自动获灯语或历史，不杜撰先前联系。同步角色沈/宋、T_LAMP、T_ARCHIVE、timeline和证据。

## 审查误判纠正（单列）

第2章61、65行第一天明确写扶微波炉、重新挂帘。第三日“前天”有依据；第11章正式恢复为“前天还见她帮着扶微波炉、挂门帘”。上一轮请求、结果与主会话撤回记录完整保留（before/history/findings.md及原请求/输出），不篡改旧历史、不解释成人物记错，不算产品缺陷修复。

## 检查与导出

status/check/doctor最终均ok；registered20、next21、stale_units=[]、changed_sources=[]、unregistered=[]。check findings=[]；有效模型review1份，旧失效12份全部有当前覆盖、欠审窗口=[]，旧报告仍保留。doctor errors=[]、warnings=[]。模型报告在作品审查/revision-b-0001-0020-模型知情复核-r59.md，已完整实读最终1–20并review绑定当前哈希；不冒充真人盲读或产品正式验收。

导出到完整路径 ${stage}/export。manifest包含恰好1–20，excluded_drafts=[]、warnings=[]，逐章正文完整出现一次，无遗漏重复；合订本SHA-256：${e.sha256}。export-verification见after/export-verification.json。状态仍draft-export。

## 未结状态

${a.pending.map(x=>'- '+x.id+'：'+x.status+(x.due_unit?'，due_unit='+x.due_unit:'')+'；'+(x.reader_known??'保留原有边界，未在本轮强行收束。')).join('\n')}

其他active条目完整保留。原签、余散页、最终班次/消息接收、正式接收箱灯仍缺；第20章14点补录、16点后查访、晚对单及饭约、明早问负责人均未兑现。

## 历史与失败记录

本轮CLI每次真实argv、cwd、退出码、原始stdout/stderr在logs；辅助执行在aux-logs，失败不会被过滤。辅助失败${failures.length}次：候选字数统计误读未复制1章、证据期望排序不一致、外部历史日志追加被严格相等检查捕获、PowerShell改变内联代码反引号导致归档命令语法失败，均保留首次失败且修正后成功，不算产品缺陷。最早一次函数编排TypeError无子进程argv；帮助输出被辅助脚本误当JSON解析的早期失败另在early-parse-failure转录。该次发生在host建立前，仅有工具回包文本，不能声称是进程原字节分流抓取。首次错误备份在before-invalid-buffer-copy原样保留，已由before/work原字节hash核验替代，不用于恢复。

作品外parent-reading.jsonl在任务期间被其他写入者追加；本轮未写该路径。旧${a.externalAppends[0]?.before_bytes??0}字节已核为现文件完整前缀，原历史保留；其余${a.history_files_unchanged}个历史文件hash相等。完整记录见audit.json.externalAppends。

## 逐章字数与修前后SHA-256

| 章 | 正文汉字 | 修前 SHA-256 | 修后 SHA-256 |
|---|---:|---|---|
${rows}

## 审计索引

- ledger-semantic-diff.md：全部36项终态字段差异及前后值。
- replay-semantic-diff.md / .json：1–20逐章快照语义差异，尤其11–14不混用终态。
- knowledge-migration.md：顾遥四个关键时点和真实journal证据。
- audit.json / after/evidence-anchors.json：来源、重放、逐引文锚点、保留计数。
- before/work、before/history、logs、aux-logs、inputs、contexts、templates、export：完整追踪材料。

Git最终无tracked文件差异；工作区仍有原先的.idea/与acceptance/未跟踪项，未stage、commit、push或发布。所有本轮文件写入限定作品目录与${stage}/。
`;
write(stage+'/result.md',result);
console.log(JSON.stringify({revision:s.revision,review_valid:check.rolling_review.valid,stale_covered:check.rolling_review.stale_with_current_coverage,export_units:e.included_units,sha256:e.sha256,process_failures:failures.length,git_status:git.stdout.toString()},null,2));
