import {read,stage,base} from './harness.mjs';import fs from 'node:fs';import path from 'node:path';
const v=read(path.join(stage,'verification.json')),h=v.hundred,f=v.fresh,c=read(path.join(stage,'field-comparison.json')),ci=read(path.join(stage,'command-index.json'));
const write=(file,text)=>fs.writeFileSync(path.join(stage,file),text,'utf8');
const metricRows=[['真实旧0.5 template',c.old05],['当前0.6 template',c.new06_template],['当前0.6 replay-input',c.new06_replay]];
const metricTable='|入口|三次进程毫秒|中位数毫秒|原始输出字符/UTF-8字节|紧凑输入字符/字节|摘要字符/字节|changes字符/字节|人物/时间/ledger/引文|\n|---|---|---|---|---|---|---|---|\n'+metricRows.map(([n,a])=>{const x=a[0];return '|'+[n,a.map(x=>x.elapsed_ms).join('/'),a.map(x=>x.elapsed_ms).sort((a,b)=>a-b)[1],x.raw_chars_codepoints+'/'+x.raw_utf8_bytes,x.input_compact_chars_codepoints+'/'+x.input_compact_utf8_bytes,x.summary_chars_codepoints+'/'+x.summary_utf8_bytes,x.changes_chars_codepoints+'/'+x.changes_utf8_bytes,[x.character_updates,x.timeline_entries,x.ledger_updates,x.quote_anchors].join('/')].join('|')+'|';}).join('\n');
const opRows=Object.entries(v.commands.by_command).map(([k,n])=>'|'+k+'|'+n+'|').join('\n');
const scoped={hundred:ci.commands.filter(x=>x.label.startsWith('native-four-hundred-')).length,fresh:ci.commands.filter(x=>x.label.startsWith('native-four-fresh-')).length,common:ci.commands.filter(x=>!x.label.startsWith('native-four-hundred-')&&!x.label.startsWith('native-four-fresh-')).length};
const raw='所有产品调用经主 bin/ai-writer.mjs 和本批 capture.mjs，唯一 native-four-* 标签。原始证据位于 ../commands/native-four-*/：result.json、stdout.raw.txt、stderr.raw.txt、带 --input 的 input.raw.json，以及带 --project 的完整 before-state.json/after-state.json。init 的正确入口只接受 --path，不带 --project；capture 因而无该次 state 路径，fresh-init-state.json 在初始化完成后立即保存完整结果。所有标签及路径、输入SHA、构建、前后state和退出码列于 command-index.json。';
write('report.md',`# 本批C第四个独立CLI实跑报告

完成状态：本机候选流程已走完并停止，未修改主源码/技能/手册，未Git提交或推送，未联网发布，未使用子代理或发送会话消息。所有文学阅读均为参与写作的同一Codex会话知情自检，不是真人盲读、市场验证或正式发布验收。

## 三种范围必须分开

|范围|实际完成|不能据此宣称|
|---|---|---|
|百章规模|既有100章登记链；仅100–100等价回放；100正文零修改|重写百章、V2从零创作百章、全书文学通过|
|百章实读|完整读95–100六章、100细纲与恢复的全部原增量、必要设定；重登后再从95连续读到100|1–94模型通读；其长历史字段不是原文替代|
|最终源码新创作|0.6/V2 init从零原创《关门以前》两章，767/717汉字初稿；修后767/716|把最初V1六章创作算作V2；把两章短篇算作长篇规模创作|

## 基线、范围与百章事务

实际开场schema5/revision375，完整state与 scale-hundred/before-native-state.json 逐字节相同；before-state.json保存开场完整状态，before-bodies.json保存全部100正文SHA。copy-manifest.json所列598个原始文件均在原封存目录只读复验，原目录598/598原SHA保持。授权副本中原598文件仅state变化，其余597字节保持。

研究/百章C模拟授权.md明确为合成验收，不是真实作者决策。既有治理允许且仅允许revise100–100。begin基线375，独立区rewind100后revision376、登记99章。在这个相同state上3次独立CLI record-template100、3次 replay-input100，六次before/after state同SHA，无覆盖样本。

未填 replay_review 的原始回放输入preview返回REPLAY_REVIEW_REQUIRED，退出1且state不变。完整阅读原100正文、原增量和95–99连接后，六项实核报告绑定真实稿SHA，再preview/record均成功。原摘要完全保留，原journal的39个patch与新journal逐项完全相同；含证据和updated_unit在内无事实差量改变。27条真实语义patch路径另列field-comparison.json；恢复输入中的97个叶字段含保留历史，不能算97个新故事变化。

登记后真正连读95–100，review-template逐章30项功能均有本章原文引文，比较两组相似结构及不同收益；issues为空，没有为验收制造文学问题，也未在分支登记/处置95–99意见。详见[真实读稿及五项功能表](真实读稿及五项功能表.md)、hundred-functions.json及原始review输入。

主作品prepare/commit成功，事务 ${h.commit.transaction_id}，主revision375→376，仅+1；重复commit返回unchanged=true，捕获的前后state同SHA。随后workflow暂停推进376→377，仅discuss/plan，draft_range/revise_range均null，没有101章。

100正文逐字节等于原副本，前99完整登记对象深度相同；snapshot SHA仍为 ${h.snapshot_sha256}。141条ledger（thread53/observation33/object40/relationship3/fact12），1157个逐ID+unit+quote+version锚点全部核正文SHA、引文及行号；统计及逐锚明细在hundred-ledger-anchor-audit.json。该机械核验不证明1–94文学或语义通读。

新replay_review报告入口与冻结对象SHA相同，六项字段齐全；当前95–100结构报告冻结正文/报告及引文均有效。check无findings、无未登记稿；rolling_review为valid48、stale66，63份旧stale有单份当前报告覆盖，3份仍uncovered：两份25–42报告与旧1–100全书报告。pending_windows=[]仅是旧窗口当前覆盖统计，不能升级成本轮百章文学通过；旧记录不删除、不重标有效。

## 0.5与0.6字段与成本观察

${metricTable}

字符口径为Unicode code point，字节为UTF-8；changes采用紧凑JSON，原始输出含格式与说明，紧凑输入包括协议字段。旧0.5对照报告的1395字节已按原stdout解析后紧凑JSON复现，不和1515原始stdout字节混用。具体三个样本逐次值及97条恢复字段名见field-comparison.json。

旧0.5本来自动填写路径/哈希，并有changes与增量ledger及保留未变项能力，这些不是本轮新增。新回放草案额外恢复253字符/715字节摘要、3项人物、1条时间、6项ledger及15条旧引文，仍须实际阅读。纯语义载荷（summary+changes且移除ledger引文）34115字符/92633字节，其中大部分是保留历史。恢复填表不等于判断无变化。

必须人工核的六项分别是：摘要是否仍准确；人物当前/历史所知；时间先后与计划/已发生；ledger状态、custody和未知边界；完整引文及版本；实际下游承接。具体本章实核记录在作品审查/native-four-100回放实核.md，并由CLI冻结。不能只抄六项名字当作完成。

以上毫秒只是不同协议、不同运行环境时段下的本机新进程启动+IO观察；仅3次样本，没有人工计时、填表工时、配对性能实验。不给提速百分比，也不宣称人工时间节省或产品性能提升。

## 从零短篇及意见闭环

见[fresh-report.md](fresh-report.md)、fresh-verification.json和fresh-handoff.json。顺序为init→骨架/一卷两章→计划1/context1/template1→创作实读1/preview/record1→计划2/context2/template2→创作实读2/preview/record2；没有先批量写稿。明确保留第2章人为“小车车”及完整原句ledger证据，写完即暂停，仅讨论审查。初始两章完整实读后，FRESH_C_TYPO为受控correctness/minor，FRESH_C_STYLE为第1章原句语义正确的optional_style/suggestion。

模拟作者新原话真实落文件、SHA冻结，采用2章重复字、保留1章偏好，仅revise2–2。独立区只删一个车；旧完整引文preview按预期拒绝且state不变，修正P_CART/T_RETURN两条完整引文后登记成功。修订尾段2完整实读，prepare/commit真实发布，主基线8→9；重复commit不变。实际publication ${f.publication.id}，随后才apply。再完整连读当前两章形成新有效报告，verify同一已应用项。最后revision13，typo verified、style retained；两个范围null、无第三章。

第1章正文SHA和完整登记对象保持，修第2章净删1个code point/3个UTF-8字节。移除ledger evidence后整个snapshot严格相同；证据版本SHA/完整引文改变，故全snapshot SHA不同，不能把证据版本差异说成事实改变，也不能说整个snapshot字节相同。当前两章报告及replay_review冻结对象有效。控制样本不代表自然检出率。

## 最终工具、导出与调用记录

主doctor正常；百章作品doctor退出1，只读发现随附0.3不支持schema5，未调用旧工具写状态、未更新。tool compare保留实际版本/指纹差异。fresh随附新0.6 doctor正常。75次产品调用都观察到同一0.6构建guard ${v.build.runtime_guard_id}，前后runtime文件稳定；这是磁盘观测，不是执行字节的密码学证明。

百章新目录导出included1–100、excluded=[]、warnings=[]；合订793463字节，SHA ${h.export.sha256}。短篇included1–2、excluded=[]、warnings=[]；合订5333字节，SHA ${f.export.sha256}。已独立重建并逐字节比较实际导出文本；每章先trim首尾空白，再用空行/分隔线拼接，不能称合订保留原始字节。manifest逐章正文SHA与source_hashes全部对应登记对象，仍为draft-export/quality_review required。

${raw}

共75次，71次退出0；2次预期preview拒绝、1次预期旧工具兼容诊断、1次操作者init误传--project导致退出2，后改用--path完成。百章标签${scoped.hundred}次、短篇${scoped.fresh}次、公共帮助/主工具诊断${scoped.common}次；21次捕获到state字节变化，plan/volume等其他文件写入不能只用state计数替代。record4次（百章重登1、短篇初登2/重登1），review4次（尾6章1、短篇初始/修订尾段/最终各1），真实commit2次及重复查询2次。

|CLI主命令|调用次数|
|---|---|
${opRows}

没有发现必须由父流程修源码的产品失败；门禁拒绝和旧工具兼容提示均保留最小可复现原始输入输出。验收辅助脚本曾把幂等commit输出误当带revision，独立断言报错；已改为核unchanged和before/after state同SHA，未重试或篡改产品事务。主工具未改，因此未运行npm test或test:engine；本阶段已执行主doctor、实际CLI流程和独立字节审计。产品调用与派生审计证据不能冒充正式产品发布验收。

停止：仅交接以上两个授权范围的结果，不继续作者创作。
`);
const r=read(path.join(stage,'fresh-current-functions.json')),keys=['goal','obstacle','choice','consequence','relationship_change'];
const ft='|章|目标|阻力|选择|后果|关系变化|\n|---|---|---|---|---|---|\n'+r.chapter_functions.map(row=>'|'+row.unit+'|'+keys.map(k=>row[k].text+'；“'+row[k].evidence[0].quote+'”').join('|')+'|').join('\n');
write('fresh-report.md',`# 《关门以前》当前V2从零短篇流程

完成两章原创虚构合成验收，出场仅顾宁、许姨，一个借车归还事件。当前0.6/V2 init --mode long从空目录起步，schema5/long_form=true；长篇入口只验登记骨架，不称两章为长篇创作。没有使用真实作品或此前测试正文，不把V1六章创作追认为V2结果。

## 顺序与创作实读

一卷两章契约、定位、声音、规则和骨架先建；随后plan1/context1/template1，实际创作第1章767汉字，逐段完整实读后preview/record。第一章登记完成才plan2/context2/template2，实际写第2章717汉字，完整实读后preview/record。操作时序已在command-index核验，初稿保留于fresh-initial/chapter-one.md与chapter-two.md；最终稿在fresh-final/同名文件。入口初次误传--project退出2、没有创建作品，原记录保留后按--path纠正。

写完按真实范围暂停到discuss/plan，使用review-template并完整连续读两章。初始报告审查/native-four-初始两章.md冻结旧全文；正文及ledger中原句均完整保留：

> ${f.change.old_full_quote}

FRESH_C_TYPO=correctness/minor/high，是明确受控重复字。FRESH_C_STYLE=optional_style/suggestion/low，原句“轮子越过门槛，响了一声。”语义正确；更紧的表达仅个人偏好，不构成硬伤。没有虚构读者理解损害。

## 模拟作者范围与实际一字修订

研究/模拟作者修订原话.md保存本次用户提供的模拟原话，注明合成验收、不是真实作品作者决策：

> 采用第2章重复字，只删这一字；第1章可选表达原样保留。只授权 revise2–2，正文不续写第三章，不改变事实或人物声音；真实提交及当前版本复核后暂停。

workflow范围仅2–2，resolve按author_evidence冻结原话：采用typo、保留style。author标签仅模拟角色输入，不声称认证真实作者。相关原话冻结与完整取舍历史见fresh-final-typo-detail.json、fresh-final-style-detail.json。

revision begin基线8、rewind2，回放前后均保存replay-input。独立正文只删1个车；新正文全文实读，旧增量、设定与第1章连接逐项核查。六项replay_review记录摘要、人物、时间、四条ledger事实、完整旧引文/新引文及无第3章下游。未改摘要和事实字段。旧完整quote在新正文不存在，preview退出1/RECORD_INPUT_INVALID，前后state同SHA；更新P_CART与T_RETURN两条完整原句后preview/record成功。

> ${f.change.new_full_quote}

重登后再次完整实读第2章尾段，仅登记2–2功能及空issues，没有处置第1章意见。prepare/commit真实完成，事务 ${f.commit.transaction_id}，主revision8→9，仅+1；重复commit unchanged=true且state同SHA。实际提交对象 ${f.publication.id}（与事务/会话ID分开）才用于apply FRESH_C_TYPO。随后在主作品重新从第1章完整读到第2章，形成当前审查/native-four-提交后当前两章.md，再verify同一应用项。保留项仍retained，不称修复；typo当前verified不等于作者定稿。

## 当前五项功能与比较

${ft}

第一章的收益是让顾宁接受许姨的真实自用需求、舍得付钱并失去肉面预算；第二章把付钱、存书、归还变成行动，并把喝茶从借物中分离。共同车把、时间对话属于单一事件的起承，不是失败—解释—再试—查验的复演。保留许姨短答、自己的用车需求和“不一定在店”限制；保留顾宁十二元的犹豫，不升级为无条件亲密或彻底性格改造。无陌生读者或市场证据。

## 保留、事实与证据版本

第1章初始/最终SHA：${f.chapters[0].final_sha256}，767汉字/2744字节不变，完整登记对象逐字段相同。保留意见的原句与author_choice在fresh-retained-evidence.json。第2章717→716汉字，2586→2583字节；仅删一个code point，所有其他正文UTF-8字节保持。

第2章旧SHA ${f.chapters[1].initial_sha256}；新SHA ${f.chapters[1].final_sha256}。当前facts（移除ledger evidence）全对象相同，独立哈希 ${f.fact_semantics_sha256}。支付12元、18:56交车、19点分路、书柜存、茶约未赴均不变。全snapshot SHA变化仅因引文/正文版本锚点更新；不能说整个snapshot字节不变。旧报告与初始冻结正文仍留存，不追改旧意见证据。

当前ledger4项、10个锚点，均核正文SHA/引文/行号；当前两章结构报告和replay_review的冻结对象有效。rolling valid2/stale1，旧初始报告stale有当前完整两章报告覆盖；不删除它来清零。

## 交付与停止

最终revision13，仅discuss/plan，draft_range=null、revise_range=null，正文目录仅两章，无第3章。check正常，无finding或未登记稿；作品doctor正常。主构建guard ${v.build.runtime_guard_id}，所有产品调用仍用主0.6入口，复制工具只用于只读构建比较。

新目录fresh-export包含1–2，excluded=[]、warnings=[]，manifest源码SHA逐项匹配。实际合订5333字节，SHA ${f.export.sha256}；已按每章trim首尾空白的实际配方逐字节重建比对，不称合订原字节。导出仍是草稿。

这是知情模型创作、自检及受控验收样本。重复字检出不代表自然查错率，两个功能表/脚本通过不代表长篇质量或正式发布验收。保存fresh-handoff.json交接后停止，不扩写。
`);
write('verification-development-notes.md','# 派生审计说明\n\nverify.mjs首次运行将幂等commit结果误当作含revision字段而断言失败。真实原始返回为ok/unchanged/id/transaction_id。修正派生审计为核unchanged=true及捕获前后state同SHA；原产品调用没有重复改写、撤销或篡改。派生审计可重建，commands内原始证据从未覆盖。\n');
console.log(JSON.stringify({report:'report.md',fresh_report:'fresh-report.md',commands:ci.total,scoped}));
