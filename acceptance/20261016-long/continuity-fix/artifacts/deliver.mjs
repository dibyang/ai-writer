import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const out=import.meta.dirname,root=path.resolve(out,'..'),p=path.join(root,'acceptance/20261016-long/works/雨线档案');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),hash=f=>sha(fs.readFileSync(f)),json=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const v=json(path.join(out,'verification.json'));if(!v.ok)throw Error('verification failed');
const state=json(path.join(p,'.writer/state.json')),pre=json(path.join(out,'before/.writer/state.json')),reading=json(path.join(out,'final-reading.json'));
const cli=json(path.join(out,'cli-index.json')),check=json(path.join(out,'cli/final-check-r31/stdout.txt'));
const report='审查/1-12连续性修复-20261016-r31.md',oldReport='审查/1-12终检-session-c.md';
const index=v.checks.find(c=>c.name==='units_1_8_complete_index_identical').details;
const chapters=v.checks.find(c=>c.name==='only_chapter_9_text_changed').details;
const changes=state.units.slice(8).map(u=>`| ${u.unit} | ${u.journal} | ${u.journal_sha256} |`).join('\n');
const table=chapters.map(r=>`| ${r.unit} | ${r.han} | ${r.unchanged_from_before?'原字节保留':'两段局部修订'} | ${r.sha256} |`).join('\n');
const result=`# 雨线档案连续性修复实跑结果

确认第9章问题仍存在，已在授权范围内修复。最终revision **31**，仅第9章正文两段局部动作改变；1–8完整索引及正文、10–12正文原字节均保留。本轮为实际冻结CLI实跑，非纸面方案。只写指定作品与根目录continuity-fix/；未用子代理，未改产品源码或替换运行工具，未手改state/journal，未提交、推送、上传或发布。

## 修前证据与修后动作

修前第9章第15行：许澄“自己端往接待间”，林岚“跟在旁边”；第17行陆衡重锁后“才跟过来”。第9章旧journal \`5eebf451-ff06-479d-bf90-0b009e6834c7.json\`第173、197行的P_KEY after却称林岚亲见重锁、许澄在场见重锁，确认正文动作与人物知识登记不一致。同栋楼不能证明亲眼看见。第12章后来的字段覆盖不纠正第9章历史错误；旧全稿报告漏报该问题，不能继续用其结论保证当前稿。

修后第15行许澄“端稳后等在门边”，林岚“站在她旁边”；第17行陆衡“当着两人的面”关门重锁、轻拉确认、拔出原钥匙、回原袋压紧收包，签字后“三人才一起回接待间”。钥匙仍陆衡、维护册仍许澄，仍九号柜，真实开锁匹配、归档与钥匙回收结论不变。10–12未确认其他需改正文的同类问题，均保留原字节重新登记。

修前实际文件副本在[before/](before/manifest.json)：正文1–12、state、全部当时的journal、审查报告与review记录共50份文件，逐项SHA-256留档；没有删除旧证据。修前第9章SHA-256：\`${pre.units[8].sha256}\`；修后：\`${state.units[8].sha256}\`。

## 实际阅读与语义复核

先完整逐章实读当前1–12章，再回读修后第9章。重登后又按1→12完整顺序连读，阅读捕获[final-read-1-12.txt](final-read-1-12.txt)共296行，读取1–180及181–296，无遗漏页；其哈希\`${reading.read_capture_sha256}\`。完整捕获为revision28，后补证据至31时正文12份逐字节一致，最终报告据此绑定同一全稿。

读取writer.json、作品定位、文风、权威规则、角色卡、全书大纲及新context内的第9–12章纲和V3卷/剧情单元契约；第9章context遗漏T_MISSED时另行recall，已实读第3章相关全文。技能使用writer-project、long-form、writer-novel、writer-review，以及对应悬疑、自然语言、物理操作模块。每章record前的语义判断留在[ledger-review.md](ledger-review.md)，引文存在校验没有被当成推论成立。

人物知识：纸签第2章仅林岚亲见，第5章陆衡、许澄获口述，不因保管或同场自动亲见内签；第9章现在有两人在门边亲见重锁的动作；第12章许澄未去镇办，不自动知道收件改样结果，陈师傅未被自动告知。

物件：封套许→林(2)→陆(4)→许(5)，以后未拆未换手；钥匙陈→林(1)→陆(7)→许(12)，每次有递接和签单。册始终许澄保管；副页由许澄衬纸平托取出、盘内比对、连衬纸回原夹袋，再随册归九号柜原格重锁。原记录仍林岚自带收包；三人新核验单林→经办留夹，收件条经办→林，均有实际动作，未复制原物。

## 正式回退与重登修订号

| 操作 | 输入revision | 输出revision |
| --- | ---: | ---: |
| rewind --from 9 | 23 | 24 |
| record 9 | 24 | 25 |
| record 10 | 25 | 26 |
| record 11（首次） | 26 | 27 |
| record 12（首次） | 27 | 28 |
| 补证据：rewind --from 11 | 28 | 29 |
| record 11b | 29 | 30 |
| record 12b | 30 | 31 |

首次重建至28后，补充核验发现T_MISSED漏续记第11章“不入核验单”、第12章“仍不知道”两条证据。私人未知边界未变，但当前账本追踪不完整；因此再走正式rewind11补齐，而非改检查掩盖遗漏。失败输出与退出码1保留在[verification-r28-execution.json](verification-r28-execution.json)及[原失败核验](verification-r28-failed.json)。补齐后原严格检查通过，T_MISSED完整对象与修前最终账本一致。中间版本和导出保留在final-state-r28.json、export-r28/，旧r28报告不覆盖。

正式备份：\`.writer/rewind-23-f6e88441-c2c7-4285-a30e-14a14450b17f.json\`；\`.writer/rewind-28-255b5862-b8a7-40d8-bebf-d6d3b06bdcc1.json\`。9、10、11b、12b均重新取得context/template、来源哈希及revision；没有复用旧输入的revision/source_hashes。未变来源重新计算后值相同是正常结果。各输入和原始模板见record-09.json、record-10.json、record-11b.json、record-12b.json及cli/对应目录。

| 最终章 | 新journal | journal SHA-256 |
| --- | --- | --- |
${changes}

## 当前报告与验证

新报告：[1–12全稿修复后连读](../acceptance/20261016-long/works/雨线档案/${report})，SHA-256 \`${hash(path.join(p,report))}\`。review登记\`.writer/reviews/3cc91080-712c-4372-8b7f-83d23950c7cb.json\`覆盖1–12，涵盖全部滚动窗口1–3、1–6、4–9、7–12。旧报告原字节保留，旧终检SHA-256 \`${hash(path.join(p,oldReport))}\`。

最终冻结CLI status/check/doctor均ok、退出0；revision31，登记12章，next_unit13，无stale_units、changed_sources、未登记稿或unsafe_entries，check findings为空；doctor无错误或警告。当前review valid=${check.rolling_review.valid}、stale=${check.rolling_review.stale}、stale_with_current_coverage=${check.rolling_review.stale_with_current_coverage}、stale_without_current_coverage=0、pending_windows=[]。历史失效不删除，由当前全稿覆盖。

[补充验证](verification.json)15项全部通过，包括全部当前ledger引文的真实哈希和行号、完整旧证据保留、冻结工具与产品源码/技能文件未变。1–8完整units索引（含summary/source_hashes/fingerprint/journal及其哈希）序列化前后SHA-256均为\`${index.before_sha256}\`，逐字段一致；对应正文与journal也逐字节一致。

修前state SHA-256：\`${v.before_state_sha256}\`；最终state：\`${v.final_state_sha256}\`。最终state只由正式CLI生成，副本为[final-state.json](final-state.json)。

## 章长与最终正文哈希

正文汉字计数排除首行标题，统计Unicode Script=Han，不计标点；所有12章在450–700内。

| 章 | 正文汉字 | 变动 | SHA-256 |
| --- | ---: | --- | --- |
${table}

## CLI原始证据与导出

冻结入口始终为作品内\`.writer/tool/bin/ai-writer.mjs\`（0.3.0），7份工具文件的修前/修后哈希一致。所有${cli.length}次ai-writer CLI调用均保留在[cli-index.json](cli-index.json)：真实executable、argv数组、cwd、起止时间、退出码、stdout/stderr哈希；cli/各次目录内保存未截断stdout.txt、stderr.txt、execution.json。工具界面截断不影响磁盘原始日志。正式CLI全部退出0；补充核验脚本的首次失败单列保留，不混成CLI成功。

最终[导出稿](export/manuscript.md)与[清单](export/manifest.json)为revision31草稿，included_units恰好1–12，excluded_drafts=[]、warnings=[]；合稿SHA-256：\`7bc455492c6c4195de1587d197aba7349b85139defe3ba2913fe9c9031530eae\`。r28导出另存export-r28/作历史，最终交付目录为export/。完整证据清单见[evidence-manifest.json](evidence-manifest.json)，其自身校验值单列evidence-manifest.sha256，避免自引用。

## 剩余边界

知情模型自检与CLI机械一致性通过，不是独立盲读、真人验收或产品整体发布验收。故事内三人逐项比对只确认纸面材料对应，不是证明历史维护实际发生的独立证据；六月四日换件试机是副页记载。褪色落款仍不可辨，实际作业及个人责任未证；陈师傅私人原因、纸签作者未定，不编造答案。T_COPY完成的是找齐核清副页、归档和实际改待发样稿；不代表简报正式发布，周五复核只作约定。未运行产品源码测试，因为本轮没有源码变更且用户要求冻结工具实跑。
`;
fs.writeFileSync(path.join(out,'result.md'),result,{flag:'wx'});
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const files=walk(out).filter(f=>!['evidence-manifest.json','evidence-manifest.sha256'].includes(path.basename(f))).concat([path.join(p,report),path.join(p,'.writer/state.json'),...state.units.slice(8).map(u=>path.join(p,u.journal)),path.join(p,'.writer/reviews/3cc91080-712c-4372-8b7f-83d23950c7cb.json')]);
const artifacts=[...new Set(files)].sort().map(f=>({path:path.relative(root,f).replaceAll('\\','/'),bytes:fs.statSync(f).size,sha256:hash(f)}));
const manifest=path.join(out,'evidence-manifest.json');fs.writeFileSync(manifest,JSON.stringify({created:new Date().toISOString(),revision:31,self_excluded:true,artifacts},null,2)+'\n');
fs.writeFileSync(path.join(out,'evidence-manifest.sha256'),hash(manifest)+'  evidence-manifest.json\n');
console.log(JSON.stringify({result_sha256:hash(path.join(out,'result.md')),evidence_manifest_sha256:hash(manifest),artifacts:artifacts.length,cli_calls:cli.length,revision:31},null,2));
