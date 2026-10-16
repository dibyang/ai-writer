import fs from 'node:fs';
import crypto from 'node:crypto';
const b='acceptance/20261016-expanded/session-b';
const p='acceptance/20261016-expanded/works/潮汐信号';
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const a=JSON.parse(fs.readFileSync(`${b}/audit.json`,'utf8'));
const s=JSON.parse(fs.readFileSync(`${p}/.writer/state.json`,'utf8'));
const manifest=JSON.parse(fs.readFileSync(`${b}/export/manifest.json`,'utf8'));
const manuscript=fs.readFileSync(`${b}/export/manuscript.md`,'utf8');
const logs=JSON.parse(fs.readFileSync(`${b}/cli-index.json`,'utf8'));
const issues=[];
const expected=[1,2,3,4,5,6,7,8];
if(JSON.stringify(manifest.included_units)!==JSON.stringify(expected)||manifest.units.length!==8)issues.push('included_units not exactly 1-8');
if(manifest.excluded_drafts.length||manifest.warnings.length)issues.push('export excludes/warnings');
if(sha(Buffer.from(manuscript))!==manifest.sha256)issues.push('manuscript digest mismatch');
const sections=manuscript.split(/(?=^# )/mu).filter(x=>/^# /u.test(x));
const matches=[];
for(let i=0;i<8;i++){
 const u=s.units[i],source=fs.readFileSync(`${p}/${u.draft}`,'utf8');
 const count=manuscript.split(source.trim()).length-1;
 const exported=manifest.units.find(v=>v.unit===u.unit);
 const ok=count===1&&sha(Buffer.from(source))===exported?.sha256;
 matches.push({unit:u.unit,occurrences:count,hash_matches:ok});
 if(!ok)issues.push(`export content mismatch unit ${u.unit}`);
}
if(sections.length!==8)issues.push('chapter heading count not 8');
const currentStateHash=sha(fs.readFileSync(`${p}/.writer/state.json`));
if(currentStateHash!==a.state_sha256)issues.push('state changed during read-only finalization');
const logHashes=[];
for(const m of logs){
 for(const file of [m.stdout,m.stderr]){
  if(!fs.existsSync(file))issues.push(`missing raw log ${file}`);
  else logHashes.push({path:file,sha256:sha(fs.readFileSync(file))});
 }
}
const logResults=logs.map((m,i)=>({sequence:i+1,command:m.argv[1],argv:m.argv,exit_code:m.exit_code,stdout:m.stdout,stderr:m.stderr}));
const reviewFiles=['审查/session-b-0001-0006连读.md','审查/session-b-0001-0008模型知情复核.md'];
const reportHashes=Object.fromEntries(reviewFiles.map(r=>[r,sha(fs.readFileSync(`${p}/${r}`))]));
const verify={time:new Date().toISOString(),issues,revision:s.revision,state_sha256:currentStateHash,manuscript_sha256:manifest.sha256,manifest_sha256:sha(fs.readFileSync(`${b}/export/manifest.json`)),included_units:manifest.included_units,chapter_heading_count:sections.length,chapter_matches:matches,excluded_drafts:manifest.excluded_drafts,warnings:manifest.warnings,cli_calls:logs.length,nonzero_cli_results:logResults.filter(m=>m.exit_code!==0),report_hashes:reportHashes,log_hashes:logHashes};
fs.writeFileSync(`${b}/verification.json`,JSON.stringify(verify,null,2)+'\n');
const rows=a.units.map(u=>`| ${u.unit} | ${u.draft} | ${u.han} | ${u.unit<=4?'恢复基线 r5 内既有记录，未重登':`r${u.recorded_revision-1} → r${u.recorded_revision}`} | ${u.sha256} |`).join('\n');
const pre=a.prewrites.map(v=>`| ${v.unit} | ${v.revision} | ${v.state_sha256} | ${v.omitted_ids.length} |`).join('\n');
const sourceRows=Object.entries(a.sources).map(([r,h])=>`| ${r} | ${h} |`).join('\n');
const cliRows=logResults.map(m=>`| ${String(m.sequence).padStart(3,'0')} | ${m.command} | ${m.exit_code} | ${m.stdout} / ${m.stderr} |`).join('\n');
const correctionRows=JSON.parse(fs.readFileSync(`${b}/corrections.json`,'utf8')).map(x=>`- 第${x.unit}章，首次登记前：${x.before} → ${x.after}。${x.reason}。`).join('\n');
const total=a.units.reduce((n,u)=>n+u.han,0),added=a.units.filter(u=>u.unit>=5).reduce((n,u)=>n+u.han,0);
const result=`# 潮汐信号 session-b 真实续写结果

已完成独立恢复、第5–8章创作与登记、第6章后的1–6滚动完整连读，以及结束后的1–8全稿完整连读和模型知情复核。作品当前revision=${s.revision}，next_unit=9，8章均登记。新增${added}正文汉字，整稿${total}汉字。字数口径：删除首行标题，以JavaScript Unicode \\p{Script=Han}逐码点计数，标点、数字和标题不计。结果为草稿，模型审查不等于真人盲读、文学定稿或正式产品验收。

## 实际读写边界

仓库cwd为D:/work/other/ai-writer。仅向作品acceptance/20261016-expanded/works/潮汐信号和acceptance/20261016-expanded/session-b/写入。辅助输入、恢复记录、CLI原始日志、结果、导出全部用完整阶段相对路径，没有写仓库根同名session-b或export。未使用子代理，未修改产品代码或作品内工具，未手改state/journal，未提交、推送、上传或发布。

实际完整读：恢复时现行1–4章；其后回查铜牌早证；每章创作后完整实读自检；第6章登记后重新完整读1–6；第8章登记后再次按1→8完整连读当前版本。另读当前writer.json、设定四文件、全书大纲、V1/V2卷契约、第4章现行章纲、当前state、当前作品内1–4报告，以及本轮新章纲/context/recall/当前账本。1–3章纲只采集来源哈希，没有把其未实读内容写成剧情依据。只读取现行状态，不读旧状态或旧journal补剧情。没有读取其他阶段请求/聊天/结果、测试README；当前报告中涉及历史过程的说明未用作剧情来源。恢复记录见recovery.md，初始实际来源哈希和10条基线ledger见initial-evidence.json。

作品写入包括：第5–8正文、通过plan生成的四份单元章纲、CLI产生的state/journal/review追踪，以及审查/session-b-0001-0006连读.md和审查/session-b-0001-0008模型知情复核.md。第1–4章正文、设定和原卷契约均未改，原证据哈希全部不变。

## 章节、修订号和当前正文哈希

| 章 | 文件（作品内） | 正文汉字 | 本阶段登记修订 | SHA-256 |
| --- | --- | --- | --- | --- |
${rows}

第1–4章没有重新登记，本报告不推测其更早的逐章修订历史。当前所有章节均处于r9整稿内。

## 写前来源留存

每章顺序为plan → context → record-template → 写正文 → 实读自检及必要修正 → 填changes → record → check。原始写前模板record-template-0005至0008.json、context-0005至0008.json和登记输入record-0005至0008.json均保留。模板的source_hashes逐字保留到record，没有写后重取哈希绕过来源检查。audit确认context/template来源一致。

| 章 | 写前revision | 写前state SHA-256 | context omitted_ids数 |
| --- | --- | --- | --- |
${pre}

恢复时以recall“沈禾”取得全部10条ledger，再006–015逐一显式召回主要稳定ID。进入V2又031–034召回T_EAST/O_NOTICE/P_NOTICE/T_INDEX；相关原文已完整读回。四章context均显式列入当时全部ID，omitted_ids为空；证据摘要的evidence_omitted并非丢弃，通过完整早章实读及当前ledger复核补齐。

## 人物知情和物件保管

- O_PLATE：原观察仍只有第2章沈禾亲见。第5章23/29行首次完整口述给周砚并注明沈禾述；第7章7/9行唐穗才首次获告。二人均未见牌；顾遥、罗敬、问讯员未获牌的完整内容。
- P_BOX：牌与棉布仍随唯一原箱，编织袋封装自第3章领回后未拆，沈禾保管在顾遥店后干燥顶架。沈→唐、唐→沈两次既有交接完整保留；顾遥只是收费空间提供者，无新增保管交接。
- O_KEY/P_KEY：原三角磨痕、红棉绳不变；沈禾背包内侧纸套封袋，未试锁，跨V1/V2保留。周、唐未被无据赋予钥匙信息。
- P_TAPE/T_TAPE：原盒与前层硬袋仍沈禾随身，原试听记录纸仍在外保护袋隔放。只保留第4章真实短听范围，未重播、转录、倒带或听全；第8章背包随身洗手、坐回搁腿边动作明确。
- O_NOTICE/P_NOTICE：第6章沈唐亲见无日期改候船残页；第7章沈只带正面工作照片，唐亲手夹回原件、明确管原件。第8章问讯员只看照片；周仅知消息/电话转述，未到客运厅。唐电话说原件未动，沈尚未返站复核。号码页不入镜、不外发。
- T_INDEX/O_CURRENT/T_MAP：目录两栏是周所示抄纸，仍周持有。现六号寄存和接驳图是沈亲见；周只听电话。问讯员建议找带年份旧图，不代表具体经手人或图已找到。

上述位置与引文绑定本表当前正文哈希；模型复核报告给出各章实际行号。69条ledger引文均另经audit核对SHA、行号、原句子串，无不符。

## 卷契约、未结与到期

V1已落实发现和保管旧资料、两次原箱交接、安全短听、基于有限资料的初始误判。V2已在第7章出发、第8章实地查访和初步排除，人物作了实际选择：先卸架、放弃修音时段与急活、走出去、等待服务、撤回无证定位；没有只延长手续。

T_EAST现为partial：排除当前六号窗口与旧六码头的数字直配，不能由今天箭头认定旧址；历史接续与旧东埠位置仍未知。T_SIGNAL pending due12；T_LAMP pending due9（下一章到期，应及时召回第4章实读，未证则保留）；P_TAPE active和T_TAPE partial均due18。到期数未延期，T_PRIVATE intentional-open，不补私因或author_truth。T_INDEX/T_MAP仍pending。T_HANDOVER active：第7日移交；第2日已交单，第3日上午卸架和电话通报已发生，下午回站与当日留存单仍未发生，不能记作完成。

## 错误与修复

${correctionRows}

这些均在各章首次record前修正。未发现已登记正文需改的硬错误，因此没有rewind或重登，也没有用手改state补洞。基线10项ledger均保留，原证据、人物键和due值未丢，原observation陈述不变；当前共16项。语义知情/保管边界经全文复核，保留正常未结，不为清零改resolved。

## 审查、工具与日志

第6章登记后先重读1–6，review 028登记当前滚动窗口，check 029无欠审。最后完整重读1–8，review 046登记模型知情全稿报告。最终check 048：8章、r9、findings=[]，3份有效报告、0过期、无pending_windows。status 047：next_unit=9、无stale_units/changed_sources/unregistered。doctor 049：Node v24.15.0、作品内工具0.3.0、7项skills、errors=[]、warnings=[]。CLI机械通过不冒充文学验收。

真实作品CLI共${logs.length}次，全部退出0，无非零结果被隐藏或改写。cli-index.json及logs/逐次json保留实际node executable、完整argv、cwd、起止时间、退出码及signal；stdout/stderr按子进程原始字节分别保存为.stdout/.stderr，空stderr也保留。外层日志提示不混入原始stdout。所有工具调用均使用本作品.writer/tool/bin/ai-writer.mjs，参数--project始终为完整作品相对路径。

## 导出核对

导出目录acceptance/20261016-expanded/session-b/export，含manuscript.md、manifest.json。manifest included_units恰为[1,2,3,4,5,6,7,8]；excluded_drafts=[]、warnings=[]。合订稿只有8个章标题，每章当前正文完整且各出现一次，各源哈希与manifest一致，无遗漏和重复。保持draft-export/quality_review=required状态，不称发布稿。

- 导出整稿SHA-256：${manifest.sha256}
- 导出manifest SHA-256：${verify.manifest_sha256}
- 恢复基线state SHA-256：075c151073383de8534be46bdc883cc0233e71bb5260a6c42b6ad4e063bd7723
- 最终state SHA-256：${currentStateHash}
- 1–6报告SHA-256：${reportHashes[reviewFiles[0]]}
- 1–8报告SHA-256：${reportHashes[reviewFiles[1]]}

独立验证结论：${issues.length?issues.join('; '):'无不符项'}。详细计数/锚点/初始条目保留核对见audit.json；导出完整性、原始日志哈希和报告哈希见verification.json。后续续写从第9章恢复，先处理T_LAMP到期回查，不能将待找图、下午返站、交单或最终广播答案当作已发生。

## 当前来源哈希

state单独列于上方；下表为当前已消费来源，旧历史state哈希只作为写前绑定值保留，不用于补剧情。

| 来源（作品内） | SHA-256 |
| --- | --- |
${sourceRows}

## 作品CLI逐次索引

完整argv见cli-index.json及logs/*.json，以下仅供定位，原始stdout/stderr未改写。

| 序号 | 命令 | 退出码 | 原始输出文件（仓库相对） |
| --- | --- | --- | --- |
${cliRows}
`;
fs.writeFileSync(`${b}/result.md`,result,'utf8');
console.log(JSON.stringify({verification:issues.length===0,result:`${b}/result.md`,revision:s.revision,cli_calls:logs.length,added_han:added,total_han:total,export_units:manifest.included_units,state_sha256:currentStateHash,manuscript_sha256:manifest.sha256,issues}));
if(issues.length)process.exitCode=1;
