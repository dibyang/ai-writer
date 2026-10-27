import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const base=path.resolve('acceptance/20261024-long-flow-090-ac'),root=JSON.parse(fs.readFileSync(path.join(base,'project.json'))).project,sha=b=>crypto.createHash('sha256').update(b).digest('hex'),get=p=>JSON.parse(fs.readFileSync(p)),info=ref=>{const b=fs.readFileSync(path.join(root,ref));return {bytes:b.length,sha256:sha(b),body_han:(b.toString('utf8').replace(/^#.*$/gm,'').match(/\p{Script=Han}/gu)||[]).length};},write=(ref,value)=>fs.writeFileSync(path.join(base,ref),JSON.stringify(value,null,2)+'\n',{flag:'wx'});
const stateBytes=fs.readFileSync(path.join(root,'.writer/state.json')),state=JSON.parse(stateBytes),entry=get(path.join(base,'cli-logs/d01-status/before-state.json')),checkpoint=get(path.join(base,'checkpoint-d-entry.json')),status=get(path.join(base,'cli-logs/d25-status-final/stdout.txt')),check=get(path.join(base,'cli-logs/d26-check-final/stdout.txt')),doctor=get(path.join(base,'cli-logs/d27-doctor-final/stdout.txt')),active=get(path.join(base,'active-tool.json'));
assert.equal(state.revision,211);assert.equal(state.units.length,46);assert.deepEqual(state.units.slice(0,45),entry.units);assert.equal(sha(stateBytes),sha(fs.readFileSync(path.join(base,'cli-logs/d24-template47/before-state.json'))));
for(const [ref,v] of Object.entries(checkpoint.files)){const actual=info(ref);assert.equal(actual.bytes,v.bytes,ref);assert.equal(actual.sha256,v.sha256,ref);}
for(const key of ['stale_units','changed_sources','impact_pending'])assert.deepEqual(status[key],[]);assert(status.revisions.sessions.every(x=>x.status==='committed'));assert(status.revisions.transactions.every(x=>x.status==='completed'));assert.equal(status.tool_control.generation,6);assert.equal(doctor.build.observed_content_id,active.content_id);assert.equal(doctor.build.runtime_id,active.runtime_id);assert.deepEqual(doctor.errors,[]);assert.deepEqual(doctor.warnings,[]);
const oldInventory=get(path.join(base,'cli-logs/d01-status/stdout.txt')).draft_inventory.unregistered.map(x=>x.draft),expectedInventory=[...oldInventory,'正文/0046-盒里最后一块-ac-d-v1.md'].sort();assert.deepEqual(status.draft_inventory.unregistered.map(x=>x.draft).sort(),expectedInventory);assert.deepEqual(status.draft_inventory.unsafe_entries,[]);
const draft46=state.units.at(-1).draft,i46=info(draft46);assert.equal(i46.sha256,state.units.at(-1).sha256);assert(i46.body_han>=10000);
const template47='.writer/drafts/AC-D-record47-before.json',context47='.writer/drafts/AC-D-context47.json',template=get(path.join(root,template47));assert.equal(template.expected_revision,211);for(const [ref,h] of Object.entries(template.source_hashes))assert.equal(info(ref).sha256,h,ref);assert.equal(fs.existsSync(path.join(root,template.draft)),false);
assert.equal(fs.readdirSync(path.join(root,'正文')).some(n=>/^004[78]/.test(n)),false);assert.equal(fs.readdirSync(path.join(root,'大纲/单元')).some(n=>/^0048\./.test(n)),false);
const partRefs=['分段/AC-D-0047/01.md','分段/AC-D-0047/02.md'],parts=partRefs.map(ref=>({ref,...info(ref)})),partCount=parts.reduce((n,x)=>n+x.body_han,0);assert(partCount>=3000&&partCount<=5000);assert.deepEqual(fs.readdirSync(path.join(root,'分段/AC-D-0047')).sort(),['01.md','02.md']);
const readEntries=fs.readdirSync(path.join(base,'read-pages')).filter(n=>n.startsWith('d-')).sort().map(n=>{const r=get(path.join(base,'read-pages',n));return {log:n,file:r.file,sha256:r.sha256,page:r.page,pages:r.pages};});
const verifyPages=(prefix,ref)=>{const b=fs.readFileSync(path.join(root,ref)),s=b.toString('utf8'),pages=Math.ceil(s.length/1800);for(let n=1;n<=pages;n++){const r=get(path.join(base,'read-pages',prefix+n+'.json'));assert.equal(r.sha256,sha(b));assert.equal(r.text,s.slice((n-1)*1800,n*1800));}return pages;};
assert.equal(verifyPages('d-approved46-p',draft46),7);verifyPages('d-part47-01-p1'.replace(/1$/,''),partRefs[0]);verifyPages('d-stop47-02-p',partRefs[1]);
const cliResults=fs.readdirSync(path.join(base,'cli-logs')).filter(n=>/^d\d\d-/.test(n)).sort().map(label=>({label,...get(path.join(base,'cli-logs',label,'result.json'))}));assert.equal(cliResults.length,27);const failures=cliResults.filter(x=>x.exit_code!==0);assert.deepEqual(failures.map(x=>x.label),['d16-assemble46-final','d18-assemble46-new-target']);for(const f of failures)assert.equal(f.before_state_sha256,f.after_state_sha256);
const files={};function walk(dir,relative=''){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const ref=(relative?relative+'/':'')+e.name;if(e.isDirectory()){if(ref==='.writer')continue;walk(path.join(dir,e.name),ref);}else if(e.isFile()){const b=fs.readFileSync(path.join(dir,e.name));files[ref]={bytes:b.length,sha256:sha(b)};}}}walk(root);
for(const folder of ['drafts','objects','journal','reviews']){const dir=path.join(root,'.writer',folder);if(!fs.existsSync(dir))continue;for(const name of fs.readdirSync(dir)){const f=path.join(dir,name);if(!fs.statSync(f).isFile())continue;const b=fs.readFileSync(f);files['.writer/'+folder+'/'+name]={bytes:b.length,sha256:sha(b)};}}
const result={ok:true,at:new Date().toISOString(),thread_id:process.env.CODEX_THREAD_ID,project:root,revision:211,state_sha256:sha(stateBytes),registered_range:{from:1,to:46},generation:6,content_id:active.content_id,runtime_id:active.runtime_id,chapter46:{ref:draft46,...i46,final_read_pages:7},chapter47:{assembled:false,registered:false,parts,total_body_han:partCount,template:{ref:template47,...info(template47)},context:{ref:context47,...info(context47)},final_target:template.draft,expected_revision:211},chapter48_written:false,entry_files_verified:Object.keys(checkpoint.files).length,old_units_1_45_preserved:true,template47_sources_matched:true,workflow_unchanged_after_template:true,unknown_unregistered_drafts:[],known_unregistered_drafts:expectedInventory,diagnostics:{status_exit:0,check_exit:0,doctor_exit:0,stale_units:[],changed_sources:[],impact_pending:[],doctor_errors:[],doctor_warnings:[],check_unregistered_warnings:check.findings.length,rolling_review:check.rolling_review},public_commands:{total:cliResults.length,successes:cliResults.length-failures.length,failures:failures.map(x=>({label:x.label,exit_code:x.exit_code,before_state_sha256:x.before_state_sha256,after_state_sha256:x.after_state_sha256}))},helper_failures:[{file:'d-inputs/failure-count-inline.json',exit_code:1,type:'agent-helper-syntax'}],read_page_calls:readEntries.length,protected_checkpoint_file_count:Object.keys(files).length,files};
write('checkpoint-d-first.json',result);fs.writeFileSync(path.join(base,'checkpoint-d-first-state.json'),stateBytes,{flag:'wx'});write('d-inputs/read-coverage.json',{nature:'actual-tool-page-output-coverage-not-literary-pass',entries:readEntries});
write('d-inputs/final-audit.json',{...result,files:undefined});
const handoff=`# AC D轮首停交接

本次达到规定首停后退出：46已正式登记，47只写前两个自然分段，未合章未登记，48未写。只操作AC独立副本及AC证据；没有改旧封存目录、真实作品、产品源码或全局配置；没有子代理、额外会话、后台写稿、向其他聊天发消息、外部写作服务、Git提交推送或发布。

## 实际会话、状态与工具

作品：${root}

本新D会话ID：${result.thread_id}，由实际CODEX_THREAD_ID取得；同ID真实恢复是下一次动作，当前不冒充已经恢复。入口revision209/schema6/登记1—45，state SHA ${checkpoint.state_sha256}；现revision211/schema6/登记1—46，state SHA ${result.state_sha256}。原字节另存checkpoint-d-first-state.json。checkpoint-d-entry的643项全部匹配，1—45 units与入口严格深相等。首停checkpoint-d-first.json保存${Object.keys(files).length}项当前作品非工具正文/分段/来源/写前输入与objects/reviews/journal字节，用于同ID恢复核对；不是人工实读每个散列，也未对AC外全盘作哈希扫描。

工具0.9.0 / generation6；content_id ${active.content_id}；runtime_id ${active.runtime_id}。active-tool、status和doctor实测一致。候选来源7961decef067a63453e05923d2a7512a103ff795 dirty=true；内容指纹不是签名或已发布结论。未更新或修改工具。

## 整组授权与单次断点

d12-workflow真实登记trial到210，原话绑定研究/AC作者任务.md第3行，SHA46ae5227965bc9dde9d937413796cb94dc49561e70d80845b6fafc747a658bb2。draft_range=46—48，revise_range=46—48，允许discuss/plan/draft/revise。task包含首程断点→同ID恢复→整组复核完整计划；长期stop_conditions为本组末章48完成及43—48复核后停，不写49，并写真实保护边界。不是永久禁止48。分组/篇幅/首停是作者总任务内控制器安排，非真人新增情节选择。

本次进程已停在47前两段。保持现workflow及47原模板；未完47时不修改workflow/来源，也不刷新来源哈希。47整章完成并登记后，如需同步task，在48取写前输入前完成。48未细纲，仍骨架；不要因next_unit=47就越过同ID恢复核验。

## 46实际完成

正式稿：${draft46}

正文汉字${i46.body_han}（剔章题），${i46.bytes}字节，SHA ${i46.sha256}。d13 context / d14写前模板r210后才动笔，七段→d15首次assemble→7页全读→局部自检修正→d19新v2合章→d-approved46-p1—p7最终7页完整阅读/纲文回对→报告审查/AC-D46-完整回读与纲文自检.md→d20 preview成功→d21 record到211。原模板.writer/drafts/AC-D-record46-before.json未刷新来源或revision，填报只改draft指向另存v2，原v1留稿。事实变化由成稿取证；字数/机械check不等于文学通过。

36日周一夜：沈自盒余饭移瓷碗与原剩馒头1同蒸，热透关火；原整芋头父明确想尝后分半且吃完，沈吃半及余饭配咸菜，父仍爱自己的馒头、杖凳未愈。盒空洗沥沈家架外侧、盖另放，无许家还碗债。女实投45垃圾与湿垫纸，母擦门侧；柜只理前部一层，厚巾左、宽套先右后实换母枕，退套待洗，窄口套另袋柜旁尚未处理，一薄巾干架。母当夜短试袖说仍认角，随后母女实洗漂压水、女托肩上架、绳下盆接，未干/未拆/未剪/未新针，母备另一件。沈真改回平常闹钟、余9收袋无新付，书移床边未翻。朋友只按文字得知对方有限后续，不约下次；许母只听女转父尝讯。

## 47未完分段与原写前输入

正式细纲大纲/单元/0047.json（d22按46实况滚动），SHA ${info('大纲/单元/0047.json').sha256}。未回改46已消费的D窗口、A骨架、V17或其他旧来源。近细纲46/47，48仍粗排。

原context：${context47}，SHA ${info(context47).sha256}。

原record-template：${template47}，SHA ${info(template47).sha256}，expected_revision211，预定最终正文${template.draft}。d23 context/d24 template均在47动笔之前真实取得；首停时全部source_hashes逐项匹配，state与d24前字节相同。模板目前保持原样空summary/changes，不能将半章填完登记。原workflow与模板未在分段后修改。

|未完段|正文汉字|字节|当前SHA256|
|---|---:|---:|---|
${parts.map(x=>'|'+x.ref+'|'+x.body_han+'|'+x.bytes+'|'+x.sha256+'|').join('\n')}

两段合计${partCount}正文汉字；01实际读1页，02原稿2页、局部修后d-stop47-02-p1—p2当前2页全读。没有47合章、没有47登记、没有48正文或单元细纲。

未登记稿内事实：37日周二沈照平常闹钟起，给父新做面/自己也吃，父仍凳杖；昨洗厚盒摸干合盖空带店。正常到店，老板当面说昨订单三点多已取/认包数、展示本上勾，沈此时才知道，不能补她昨天下午目击；老板说已回公开留言今天不做该糕、粉未备，后问取期再回待定。沈腕仍酸，老板接搬盘/洗盘，沈守前柜、盘中先后出售按本晨实际热度转换。许家女摸工装袖厚仍潮，母取备用上衣并说口袋位置不同；母倒盆水放回，衣仍绳上。新白粥早餐，母仅口述宽套夜用没觉滑，窄套仍另袋。女中午不回、晚饭量尚待午后问；母未定晚吃面或饭。女到工作处补清末行小记；首停最后为午间尚未到，手机只保存“我煮”未发送，仍在做手边这一叠。上述均只在未完47，不在正式snapshot/ledger。下一段从这份未发消息与真实午间/下工需求接，晚间自己的小餐/周收工尚未写，不能用计划补事实。

## 实际读取与未回收承诺

入口指定COMMON、author-request、project、active-tool、C完成、C补登记完成与checkpoint-d-entry完整读取；作品AGENTS/writer.json、当前包writer-project/novel/review及long-form、chapter-delivery、general-review、natural-language、physical-logic等必要references已读，根旧项目技能仅作者规则。status/check/doctor/discussion实际d01—d04，entry-verification保存。

正文43八页/44十页/45七页25页完整实读；recall后原25p5—6、38p4、39p1—2、37p5/p7、41p2—4、34p5/36p3共12页。46初稿7页、最终7页；47初/修前后累计5页。实际分页调用${readEntries.length}次，覆盖在d-inputs/read-coverage.json，不冒称全书已读。context/doctor大对象展示曾截断，完整stdout留唯一日志；相关未显示字段分块实读，不拿统计代替正文阅读。

T_X_COAT_DAILY仍partial：本夜新洗晾和仍认角有证，47湿衣目前尚潮，未干后试穿、未证明长期质量。T_D_CABINET_PHOTOS仍pending：34黑线不足、36人未归等侧图，无新资料不能强结。T_D_ROOM_DOOR_LOOK本次已resolved，41工40料8实48、细缝可接受，长期/冬天未知；不要再收钱。37饭约43—45有限resolved保持，46实际后续，不生造借碗。父伤、课程总期数、复航、父辈全史、问路人终点继续未知。写47周段前须再读41/42相关当前原文；本轮已读41本处，42整章未读，不能继承旧会话结论。

## 最终诊断与全部失败

d25 status/d26 check/d27 doctor均退出0；revision211，登记46，stale_units/changed_sources/impact_pending空，无活跃修订或待恢复事务；doctor errors/warnings空。check为mechanical-only，23份已知未登记留稿＝原22＋本次46修前v1，没有未知稿。rolling_review valid21、stale31均有当前覆盖、pending_windows空；并非已做43—48最终六章审查，后者待48完稿。

27次公开CLI：25成功，2次失败，所有原输入/stdout/stderr/前后state/退出码保留。

1. d16-assemble46-final：COMMAND_FAILED，产品退出1，目标v1已存在不覆盖。before/after state SHA相同，停止登记并读d17help。
2. d18-assemble46-new-target：COMMAND_FAILED，产品退出1，draft必须在正文下。试图另存分段目录被拒，before/after state相同；改正文新v2、d19成功。不是产品崩溃或借重取模板绕过保护。
3. 辅助inline统计命令多一个右花括号，Node SyntaxError退出1，未调用产品/未改state；failure-count-inline.json保留，文件脚本成功。最初未提交assemble输入草案使用output/字符串parts，调用前查现有格式改为draft/path/sha对象；原草案保留，不计产品执行失败。

模型稿前与回读修正：46父亲无依据拍照玩笑、过度解释父未起身、瓷碗引入顺序、父/母限知切换、手指酸未开口、扶锅回忆、朋友似隔空知道站姿、枕套“改口”歧义；47取杯次序和锅/碗先后、母亲不知道女先前“全芋头”想象改实际交流。全部修前稿在d-inputs对应before目录，最终版本已全读。没有据此偷偷改范围外旧章；本轮无已确认需立即改旧章的问题。可选玩笑密度风险留报告，不冒充作者采纳。

未做产品源码测试（本轮无产品源码改动）、真人盲读、市场/出版验收或现实操作实测。当前只是模型知情创作自检与机械诊断。此处保存交接和checkpoint后退出，等本ID真实恢复才续47，不写48。
`;
fs.writeFileSync(path.join(base,'交接-D首停.md'),handoff,{flag:'wx'});
write('d-first-stop-verification.json',{ok:true,thread_id:result.thread_id,revision:211,state_sha256:result.state_sha256,registered_units:46,chapter46_body_han:i46.body_han,chapter47_body_han:partCount,chapter47_registered:false,chapter48_written:false,template47_sha256:info(template47).sha256,context47_sha256:info(context47).sha256,entry_files_preserved:Object.keys(checkpoint.files).length,checkpoint_files:Object.keys(files).length,handoff_sha256:sha(fs.readFileSync(path.join(base,'交接-D首停.md')))});
console.log(JSON.stringify({ok:true,thread_id:result.thread_id,revision:211,state_sha256:result.state_sha256,chapter46:i46,chapter47:parts,total47:partCount,template47_sha256:info(template47).sha256,context47_sha256:info(context47).sha256,protected_files:Object.keys(files).length,read_page_calls:readEntries.length,commands:27,product_failures:failures.length,handoff:'交接-D首停.md'},null,2));
