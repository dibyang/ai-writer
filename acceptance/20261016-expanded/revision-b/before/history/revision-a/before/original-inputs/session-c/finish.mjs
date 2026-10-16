import fs from 'node:fs';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
const b='acceptance/20261016-expanded/session-c',p='acceptance/20261016-expanded/works/潮汐信号';
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const argv=[b+'/audit.mjs'];
const r=spawnSync(process.execPath,argv,{cwd:process.cwd(),encoding:null,maxBuffer:32*1024*1024});
fs.writeFileSync(b+'/audit-final.stdout',r.stdout??Buffer.alloc(0));fs.writeFileSync(b+'/audit-final.stderr',r.stderr??Buffer.alloc(0));
fs.writeFileSync(b+'/audit-final-command.json',JSON.stringify({executable:process.execPath,argv,cwd:process.cwd(),exit_code:r.status,signal:r.signal},null,2)+'\n');
if(r.status!==0)throw new Error('audit failed; raw result preserved');
const a=JSON.parse(fs.readFileSync(b+'/audit.json','utf8'));
const manRaw=fs.readFileSync(b+'/export/manuscript.md'),man=manRaw.toString('utf8');
const m=JSON.parse(fs.readFileSync(b+'/export/manifest.json','utf8'));
const exp=JSON.parse(fs.readFileSync(b+'/cli/final-export.stdout','utf8'));
const seq=Array.from({length:12},(_,i)=>i+1);
const checks={exact_range:JSON.stringify(exp.included_units)===JSON.stringify(seq),excluded_empty:exp.excluded_drafts.length===0,warnings_empty:exp.warnings.length===0,export_hash:sha(manRaw)===exp.sha256,source_occurrences:[],heading_count:(man.match(/^# 第[^\n]*章 /gm)||[]).length,template_fidelity:[]};
let last=-1,residue=man;
for(const u of a.units){const source=fs.readFileSync(p+'/'+u.draft,'utf8').trim();let ix=man.indexOf(source),count=0,pos=0;while((pos=man.indexOf(source,pos))>=0){count++;pos+=source.length;}
 checks.source_occurrences.push({unit:u.unit,count,ordered:ix>last});last=ix;residue=residue.replace(source,'');
}
checks.remaining_export_header=residue.trim();
for(const u of [9,10,11,12]){const n=String(u).padStart(4,'0'),n2=String(u).padStart(2,'0');const t=JSON.parse(fs.readFileSync(`${b}/cli/u${n2}-template.stdout`,'utf8')),rec=JSON.parse(fs.readFileSync(`${b}/record-${n}.json`,'utf8'));checks.template_fidelity.push({unit:u,expected_revision:rec.expected_revision,source_hashes_unchanged:JSON.stringify(t.source_hashes)===JSON.stringify(rec.source_hashes)&&t.expected_revision===rec.expected_revision});}
checks.ok=checks.exact_range&&checks.excluded_empty&&checks.warnings_empty&&checks.export_hash&&checks.heading_count===12&&checks.source_occurrences.every(x=>x.count===1&&x.ordered)&&checks.template_fidelity.every(x=>x.source_hashes_unchanged);
fs.writeFileSync(b+'/export-verification.json',JSON.stringify({manifest_keys:Object.keys(m),...checks},null,2)+'\n');
if(!checks.ok)throw new Error('export verification failed');
const status=JSON.parse(fs.readFileSync(b+'/cli/final-status.stdout','utf8')),check=JSON.parse(fs.readFileSync(b+'/cli/final-check.stdout','utf8')),doctor=JSON.parse(fs.readFileSync(b+'/cli/final-doctor.stdout','utf8'));
const cli=fs.readdirSync(b+'/cli').filter(n=>n.endsWith('.json')).map(n=>({ref:`cli/${n}`,...JSON.parse(fs.readFileSync(b+'/cli/'+n,'utf8'))}));
fs.writeFileSync(b+'/cli-index.json',JSON.stringify(cli,null,2)+'\n');
const sources={};for(const u of [9,10,11,12]){const t=JSON.parse(fs.readFileSync(`${b}/record-${String(u).padStart(4,'0')}.json`,'utf8'));sources[u]={expected_revision:t.expected_revision,source_hashes:t.source_hashes,template_stdout:`cli/u${String(u).padStart(2,'0')}-template.stdout`,record_input:`record-${String(u).padStart(4,'0')}.json`};}
fs.writeFileSync(b+'/writing-sources.json',JSON.stringify(sources,null,2)+'\n');
const gitArgv=['status','--short'];const g=spawnSync('git',gitArgv,{encoding:null});fs.writeFileSync(b+'/git-status.stdout',g.stdout??Buffer.alloc(0));fs.writeFileSync(b+'/git-status.stderr',g.stderr??Buffer.alloc(0));fs.writeFileSync(b+'/git-status-command.json',JSON.stringify({executable:'git',argv:gitArgv,cwd:process.cwd(),exit_code:g.status},null,2)+'\n');
const hpaths=['.writer/state.json','审查/session-c-0004-0009连读.md','审查/session-c-0001-0012模型知情复核.md',...a.units.map(u=>u.draft)];
const hashes=Object.fromEntries(hpaths.map(q=>[p+'/'+q,sha(fs.readFileSync(p+'/'+q))]));for(const q of ['export/manifest.json','export/manuscript.md','recovery.md','recovery-sources.json','writing-sources.json','audit.json','export-verification.json'])hashes[b+'/'+q]=sha(fs.readFileSync(b+'/'+q));
fs.writeFileSync(b+'/delivery-hashes.json',JSON.stringify(hashes,null,2)+'\n');
const lines=[];
lines.push('# 《潮汐信号》session-c 实跑结果','',`完成第9–12章草稿、逐章正式登记与check。恢复revision9，最终revision${status.revision}，next_unit=${status.next_unit}；本阶段未rewind，无已登记正文改动。作品内status/check/doctor均正常，未登记稿/漂移/欠审窗口均为空。不是文学定稿、真人盲读、市场验证或产品正式验收。`,'','## 实际范围','',`恢复时完整实读当前1–8章，分别recall全部16个稳定ID，并回读第2、3、4章早期证据；第12章写前再次recall主线和目录/图纸，实读第1章及第5、10章相关正文。第9章登记后完整连读4–9；第12章登记后按1→12完整连读最终版本。本阶段只新增9–12章章纲和正文、CLI生成的state/journal/review，以及作品审查报告；阶段辅助文件都在 ${b}/。未读其他阶段请求/聊天/结果、测试README或历史旧状态补剧情。`,'','## 字数与修订','', '| 章 | 正文汉字 Script=Han，不含标题 | 写前revision → 登记revision | SHA-256 |','| --- | --- | --- | --- |');
for(const u of a.units){const rev=u.unit>=9?`${u.unit} → ${u.unit+1}`:'本阶段未重登';lines.push(`| ${u.unit} | ${u.han} | ${rev} | ${u.sha256} |`);}
lines.push('','9–12章每章均先plan/context/record-template，原始写前模板及来源哈希未改，再写正文、完整实读自检、填写changes、record/check。真实写前state哈希与全部source_hashes见 writing-sources.json；所有context omitted_ids=[]，证据摘要省略部分由独立recall及原文实读补足。','','## 知情、保管与回收边界','','- 铜牌：只有沈禾第2章亲见，周第5、唐第7、顾第11章分别听完整口述，仍未亲见。许成未获内牌全信息。灯语：罗→沈第4章、沈→唐第9章；周顾未获。原带：沈顾第4章共听有限片段，周唐未获带内容，罗未参加播放。第12章唐才获电脑副本明确来源，未试听。','- 原箱仍沈禾负责顾店后顶架，内牌棉布随箱未拆；第2章沈→唐、第3章唐→沈的两次交接均保留。看箱预约不是转管，顾只收费空间。第11章续费到第6日早晨，移交仍第7日。钥匙内侧封袋未试、原带前层原盒硬袋未再播、试听记录纸外保护袋隔放。','- 原通知唐管旧站窗边筐；第12章取桌又夹回，没有交沈周带离，号码页白纸隔开未外发。维修复印纸许成收匣，沈只拍获准工作照，第12章发周；目录原纸未到场，周出示并发沈一页工作照，旧抄件仍周自持；唐只是看屏幕。','- T_SIGNAL=partial / due_unit=12；仍缺声音连续来源、日期班次、剪辑者与消息给谁/是否收到的证据。T_LAMP=pending / due_unit=9，仍缺灯义实证。两项到期均及时检查、不延期、不清零。T_TAPE=partial及P_TAPE=active / due18，店试机带复现机器异响不证明原带安全。T_PRIVATE=intentional-open，私因不设作者答案。','- T_INDEX/T_MAP/T_EAST均partial：可见资料范围有新增，续页、整套原图、实际转存、旧六码头精确位置和今旧沿革仍未知。第4日15:30交单与16:30–17看箱尚未发生。许成当天是否来过，只有唐称没见人，不能全知认定。','','## 错误与修复','','登记前修复第10章背包安置、第11章电话两端误置同场与原带故障措辞、第12章抄件划痕正反面、发送/放回手机、整袋包子递接、周获看箱约信息的来源；具体修前修后及当前行见 corrections.md。第9–11章字数不足的初稿均在登记前补入责任、查访缺口、角色时间选择等实际场景。最终完整连读未发现必须回退的已登记正文硬错误，因此未触发rewind；没有直接补state。','','## 账本与审查证据','',`当前${a.ledger_count}条ledger、${a.evidence_count}条evidence；逐条核对当前正文SHA-256、实际行和引文均匹配。恢复时16条旧项、旧证据、人物键和到期值全保留，原始observation未逆改；新增O_MAP/P_MAP/O_DECK/O_INDEX_PAGE。机器核对仅证字段/锚点，语义复核见作品内《session-c-0001-0012模型知情复核》。`,'','已登记本阶段两份新报告：审查/session-c-0004-0009连读.md；审查/session-c-0001-0012模型知情复核.md。全稿报告覆盖7–12欠审窗口，未借旧有效报告替代阅读。',`最终check：findings=${check.findings.length}，valid_reviews=${check.rolling_review.valid}，stale=${check.rolling_review.stale}，pending_windows=${check.rolling_review.pending_windows.length}。doctor：Node ${doctor.node}，tool ${doctor.tool_version}，errors=${doctor.errors.length}，warnings=${doctor.warnings.length}。`,'','## CLI原始记录和导出','',`共${cli.length}次作品内CLI调用，全部exit_code=0；每次真实executable/argv/cwd/起止时间/退出码保存在cli/*.json，原始stdout/stderr以字节写入同名前缀.stdout/.stderr，未修改非零结果（本阶段没有非零作品CLI）。初次组合ID检索返回空匹配但退出0，随后逐ID召回，原空结果保留。工具展示长度限制不影响磁盘原始输出。完整索引见cli-index.json。`,'',`导出：${b}/export/manuscript.md，状态draft-export，revision13。included_units恰好1–12，excluded_drafts=[]，warnings=[]；每章源文本在合稿中逐字恰好出现一次且顺序正确，章标题数12，无遗漏；核对见export-verification.json。`,'',`最终state SHA-256：${a.state_sha256}`,`导出manuscript SHA-256：${sha(manRaw)}`,`导出manifest SHA-256：${sha(fs.readFileSync(b+'/export/manifest.json'))}`,'','完整来源与交付哈希见 recovery-sources.json、writing-sources.json、delivery-hashes.json。只读核对当前工具，未改产品、未跑产品测试、未手改state/journal、未用子代理、未提交/推送/发布。');
fs.writeFileSync(b+'/result.md',lines.join('\n')+'\n');
console.log(JSON.stringify({ok:true,revision:status.revision,next:status.next_unit,cli_calls:cli.length,evidence:a.evidence_count,chapters:checks.source_occurrences,export_sha256:sha(manRaw),state_sha256:a.state_sha256,result:b+'/result.md',git_exit:g.status,git_stdout:g.stdout?.toString('utf8')},null,2));
