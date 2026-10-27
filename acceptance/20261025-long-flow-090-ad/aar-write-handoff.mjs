import fs from'node:fs';import path from'node:path';import crypto from'node:crypto';import assert from'node:assert/strict';import{fileURLToPath}from'node:url';const b=path.dirname(fileURLToPath(import.meta.url)),a=JSON.parse(fs.readFileSync(path.join(b,'aar-completion.json'))),r=JSON.parse(fs.readFileSync(path.join(b,'project.json'))).project,s=JSON.parse(fs.readFileSync(path.join(r,'.writer/state.json'))),sha=x=>crypto.createHash('sha256').update(x).digest('hex'),open=Object.values(s.review_workflow.issues).filter(x=>x.status==='open');assert(open.every(x=>x.type==='optional_style'));const cp=JSON.parse(fs.readFileSync(path.join(b,'checkpoint-a-complete.json')));assert.equal(cp.state_sha256,a.final_state_sha256);
const p=(ref)=>`${r}\\${ref.replaceAll('/','\\')}`;const text=`# AD A组完成交接

完成范围：唯一AD独立样本A组三章49—51。首程49已登记；本次同ID恢复完成50、51及46—51窗口模型知情自检，当前正式登记止于51。到此退出，不写52，不启动下组。所有正文/工具调用在同一native线程内完成，无子代理、额外原生会话或后台写稿。没有修改真实作品、工具源码或AC/X封存，没有Git提交、推送、导出上传或发布。

## 主状态与构建

- 作品：${r}
- native thread/session均为01a170a4-a05a-7e12-b8e3-168d0597c8cc。入场证明aar-restore-byte-proof.json是本次写前真实核验，不是事后重构。
- 入场49章/r266/state SHA ${a.entry_state_sha256}；完成51章/r274/state SHA ${a.final_state_sha256}。
- generation7，0.9.0，content ${a.content_id}，runtime ${a.runtime_id}。实际最终status/check/doctor均exit0，无构建不匹配、来源漂移、stale unit或impact pending，无活跃revision、未完成事务。
- workflow整组任务/49—51 draft及revise授权与首停逐字等同，没有把半章断点改作作者限章。原stop文本作为首程历史保留，长期止点仍51。控制器章号不构成作者新情节选择。
- check仅27项UNREGISTERED_DRAFT：入场26项历史留稿加本次50未登记v1；unknown与unsafe均零。不得删掉它们“清警告”。rolling valid23、stale39，39均有当前覆盖，未覆盖stale0、pending_windows空；历史报告与哈希不追改。现有${open.length}项open全为optional_style；不把保留或未处理风格冒充已修。
- checkpoint-a-complete.json与-state.json：753项脚本清单，供脚本核验，不逐哈希朗读。aar-completion.json含完整命令清单、读页索引、来源与增量凭据摘要。

## 恢复的字节证明

入场checkpoint-a-first.json的714项全部匹配；完成审计再次核714项仍全部匹配。主state当然按真实登记/审查前进，首停清单未把它作为静态稿件混同。原1—49章登记行与首停完全相同，当前正式正文/旧版本字节均未动；规划51在尚未消费时正式细化，未改任何旧消费入口或原哈希。

原50context：${p(a.original50.context.path)}，${a.original50.context.bytes} bytes，SHA ${a.original50.context.sha256}。

原50record-template：${p(a.original50.template.path)}，${a.original50.template.bytes} bytes，SHA ${a.original50.template.sha256}，expected_revision266。没有取第二张模板冒充恢复，正式填充件继承其source_hashes/source_bindings全等。

原50两段均在续写前真实完整分页回读（aar-c50-original01/02-p1、p2），未重写：

|顺序|原文件|字节|汉字|原SHA|最终出现次数/字节偏移|
|---|---|---:|---:|---|---|
${a.original50.parts.map(x=>`|${x.order}|${x.path}|${x.bytes}|${x.han}|${x.sha256}|${x.final_occurrences}/${x.final_byte_offset}|`).join('\n')}

它们在正式50合章仍是首两段，完整字节各一次、顺序相同。来源map与写前原模板相同，不将已登记后新的state反刷回旧模板。原目标正文/0050-照片外的一侧-ad-a-v1.md完整保留，正式稿为另存v2。

## 正文、字数与覆盖

汉字计数去Markdown标题，普通正文；不以UTF-8字节、标点或报告算篇幅。

|章|当前登记正文|汉字|完整分页|SHA256|
|---:|---|---:|---:|---|
${a.chapters.map(x=>`|${x.unit}|${x.draft}|${x.han_without_title}|${x.pages}|${x.sha256}|`).join('\n')}

50从原3671汉字续接，新增03—07自然分段；04/06/07修正副本在分段/AD-AR-0050-修正，原片段留存。assemble50-v2七段真实合章，整章8页实读、纲文回对/语言连续性报告、真实summary/10角色/6时间线/11账本及引文，preview-v2→record r267。旧03—07和原合章v1不自动与新稿同步。

51正式细纲先plan，再显式60000字符预算context（实际约48041），写前模板expected_revision267，于新分段之前生成；原context ${p(a.original51.context)}，SHA ${a.original51.context_sha256}；原模板 ${p(a.original51.template)}，SHA ${a.original51.template_sha256}。九段自然分段在分段/AD-AR-0051，06追加实际母女听唱选择的副本在分段/AD-AR-0051-修正；原06保留。实际assemble到新正文，完整9页回读，真实summary/11角色/6时间线/9账本/22引文及报告，preview→record r268。初稿11956汉字，增加189汉字真实交流后12145；不是重复工序补足。

51同路径文件名v1在正式revision后仍沿用路径，当前SHA已经改变，不能凭文件名取旧稿。原合章SHA ${a.original51.first_assembled_sha256}；当前SHA ${a.original51.current_sha256}。原正文完整副本：${a.original51.original_body_copy}；正式事务before备份也保留。原分段01中的旧称谓是历史，不自动同步新登记稿。

## 六章连读与独立修订闭环

全部初次登记后，本进程按46→51实际完整连读51页（7/7/10/10/8/9），证据read-pages/aar-window46至51，非旧交接结论、摘要或机器计数代读。报告审查/AD-AR-46至51窗口连读初检.md，正式review ${'.writer/reviews/4596e4e1-146c-4bf4-8f9f-84be7b33e577.json'}。逐章目标/阻力/选择/后果/关系及比较均附真实引句。

首轮新发现51“何阿姨”与48—50男性老何/49已有“何师傅”不符；51单章自检漏检，原报告不追改。I_AD_AR51_HE_TITLE先正式采用，再独立revision51—51：begin b610e59f-be9f-43f0-a5bc-2098f541a683→读原稿/确认主分支同字节→rewind→实际context及修改前template r271→只替换何阿姨为何师傅一次→新稿9页实读→replay-input六字段完整实核→preview→record→重登后完整9页尾段实读→正式review→prepare→commit。事务db48dd08-ee13-47e9-be6a-bff610801515 completed，commit对象1c94d798-93e9-4379-8da0-0bd179343820；apply后verify，最终effective_status=verified、context_changed=false。不伪称作者逐项采纳，不复改已修旧意见。

最终报告审查/AD-AR-46至51窗口最终知情自检.md，正式review ${a.formal_final_review.ref}，绑定当前全部六SHA。阅读口径明确：首轮完整六章，加修订前/后完整51尾段；没有虚称修订后又读过一次六章，也没有拼接零散短评充当连读。

真正差异：46结余饭与有限柜层用途；47自做普通饭/干衣再穿、周自己吃饭；48亲手退针重走接受一小段；49为自己唱词送灯和问班；50常用者桌用途亲述、陪梁自选鞋、问班获准和实约；51实际取灯/实际共读、父自己读报/轻袋使用、下一半日条件安排。阅读代价也如实保留：反复收手、确认、晚间消息和未发生限定句偏密；51翻原夹页之外和黄枝留白在47/49已有，不能冒充第一次自主兴趣。压缩为可选，不自动必改，不因平静合作硬造新冲突。

## 旧线实证与未发生边界

- 本次recall后实读旧承诺：21当前v2第4—5页浅蓝袋与借原8册，22当前v1第1—2页原大白纸/女孩另纸/实际还书；证据aar-old21/22对应读页。没有从交接直接继承“已解决”。同一native较早已实读13/19旧灯、15原册、35买14册/18未买等相关原文，完整页索引另存；不把本次局部回读说成全读1—45。
- 灯：13/19拖延接口→49本人提原灯线实送/费用先问留物条→50本人问得本店接不了/未修未换不收→51认条认原物实取。只结本轮问取任务，灯柜下干放未通电，未另修/买新/宣布永久无救。留物条母自己小包；唱词旧信封床边、两个空仍无证不补。
- 书与关系：21借/22还的原8册/大白纸/旧水痕不变，35原14册非18元未买册，47自夹纸非反馈纸。50真约周六16:30各取书→51真实公共处坐约一小时、各自携回；女孩自纸新记留白，沈不强认暗角，两人喜好不同仍可共处。未再购/代付/新借，朋友教不了未告知内容。
- 帘与袋：旧短帘早成父袋，49清楚只要洗另一未洗幅；50正式准周日12:30后半日/按平常到，周六16正常另算；51只查晾处/挪门障、商定先饭坐歇和能晾才拆，睡着不叫起来洗。未拆洗、未担保干挂/明日必成。父脚未好，袋只家内盒报，不装女书/湿帘重物，不替长期承重或伤愈作证。
- 柜门：旧等侧图→50本人称返家实拍补光/柜前图、常用者亲话/使用短视频，内部手仍遮；51实收地址文字/新旧牌照片、本人复认/常用女人另亲认周二9—10在、11后有事。约先看量，留部分台面，非全搬桌、报价收款/现场诊断/拆修。周地图只认路口，没有去过。
- 已修事实继续：花册14；旧房门工40/料10总50分项，非柜门新价；旧餐三宽条事实不被旧段覆盖。母衣坐桌仍认旧角，不将“没注意”写成“没碰”；48老师只见课中纸上当时内容，晚间新反馈未送老师。旧观察/月牙白漆不逆改。梁本人试/付鞋款，只家中干地有限反馈，外穿长期不证；无新父辈史、复航/长期效果结论。

## 所有失败与纠正

正式工具未见真实缺陷。以下普通输入/辅助错误原失败保留，全部另存修正后继续，无刷hash绕过：

1. FastCtx先查细纲/0051.json未找到；正式文件为大纲/单元/0051.json，后完整读，未发生写入。
2. aar-recall-book-picture-before-tail将O_BOX_PAINT误作位置参数，exit1；实际读help后aar-recall-book-picture-corrected以--query成功。固定白漆观察未改。
3. aar-51-assemble用相对input，包装层copy ENOENT，正式工具未启动，目录无result.json保留；aar-51-assemble-absolute完整路径成功。
4. aar-51-preview误用preview，exit1未知命令；核50原成功调用后aar-51-preview-corrected以record-preview成功，输入未换来源。
5. 50登记前新段四项修正：过细“顶灯”回灯光、梁吃饭夹子回筷子、下午走路回白天、母明日已取回句改条件。原分段/原v1保留，另副本合v2并全章读。50初preview关联提示第二幅帘知识仍旧，实际recall核后另存filled-v2加明确批准而未洗知识，再preview成功登记。
6. 51达到11956字后新增189字母女听唱实际选择，原06存留，不重复操作凑字。51称谓漏检在窗口后按正式修订处理，见上，未直接改登记主稿。
7. 修订六字段报告引文数误写24，实际22；记录count-before副本，修正报告后另filled-v2与再次preview成功才登记。该报告改动未变正文，原报告/旧填充输入仍存。

本次49个aar包装调用，成功46、失败2、包装层失败1；逐项标签/退出码如下，完整args/双流/前后state见cli-logs和aar-completion.json（令牌只在本地操作记录，不入本文）。

|标签|结果|
|---|---|
${a.commands.map(x=>`|${x.label}|${x.incomplete_wrapper?'包装层失败，原目录保留':x.exit_code===0?'成功0':`失败${x.exit_code}`}|`).join('\n')}

所有模型写稿/报告/审计脚本成功结果均有当前字节实核，工具stdout较大的呈现有截断时读取保存JSON的所需字段；小说正文分页没有用截断/摘要替代。

## 未覆盖与退出

这是知情创作模型自检与工具机械流程完成，不是独立真人盲读、市场验证、作者定稿或可出版验收。46/47历史章分别10159/10086汉字，本次只完整读，未擅改以满足50/51门槛；新49/50/51均达12000。未全量重审1—45、未测试或修改工具代码，未把npm测试代替文学阅读。可选风格意见原状保留，其他长期线须有实际证据再推进。

长期止点51已到。工具next_unit=52仅数字提示，不是授权；本进程未写52，未另起原生进程或下组。接收者先核本交接、aar-completion.json及checkpoint-a-complete.json真实字节；不把51旧分段或旧合章哈希当当前登记稿。到此退出。
`;
fs.writeFileSync(path.join(b,'交接-A完成.md'),text,{flag:'wx'});const receipt={ok:true,at:new Date().toISOString(),state_sha256:a.final_state_sha256,revision:274,units:51,stop_at:51,files:['交接-A完成.md','aar-completion.json','checkpoint-a-complete.json','checkpoint-a-complete-state.json'].map(f=>({file:f,bytes:fs.statSync(path.join(b,f)).size,sha256:sha(fs.readFileSync(path.join(b,f)))}))};fs.writeFileSync(path.join(b,'aar-completion-receipt.json'),JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});console.log({ok:true,handoff:'交接-A完成.md',bytes:Buffer.byteLength(text),state_sha256:a.final_state_sha256,revision:274,open_optional:open.length,commands:a.commands.length,stop_at:51});
