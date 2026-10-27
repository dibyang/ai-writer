import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {base,j,sha,write,cli,state} from './ef-lib.mjs';
const n=Number(process.argv[2]),r=j(path.join(base,'e-revision-private.json')),root=r.workspace,token=r.token;
const p=cli(`ef-replay-final-${n}`,['revision','replay-input','--unit',String(n),'--out',`.writer/drafts/ef-replay-final-${n}.json`],{root,token,show:false});
const input=j(path.join(root,`.writer/drafts/ef-replay-final-${n}.json`));
const body=fs.readFileSync(path.join(root,input.draft),'utf8'),hash=sha(fs.readFileSync(path.join(root,input.draft)));
if(n===48){
 assert(input.summary.includes('周找到两张现有砂纸与可用碎角、备料未买'));
 input.summary=input.summary.replace('周找到两张现有砂纸与可用碎角、备料未买','周先见两张砂纸，翻垫底旧纸又找到第三张可用旧细砂纸，合计三张一粗两细及可用碎角、备料未买');
 assert(input.changes.characters['周岸'].includes('周三铺内找到现有两张粗细砂纸/可用碎角'));
 input.changes.characters['周岸']=input.changes.characters['周岸'].replace('周三铺内找到现有两张粗细砂纸/可用碎角','周三铺内先见两张砂纸，再翻垫底旧纸找到第三张可用旧细砂纸，合计三张一粗两细及可用碎角');
}
if(n===50){
 assert(input.changes.characters['周岸'].includes('卷尺现砂纸工具包原处。'));
 input.changes.characters['周岸']=input.changes.characters['周岸'].replace('卷尺现砂纸工具包原处。','卷尺、48确认的三张一粗两细旧砂纸与可用碎角、工具包仍原处；浅盒本章未打开，无新购或定量耗用。');
}
if(n===51){
 assert(input.changes.characters['周岸'].includes('不知其他家本日全程。'));
 input.changes.characters['周岸']=input.changes.characters['周岸'].replace('不知其他家本日全程。','承接48三张一粗两细及可用碎角的确认，本章无新购/定量耗用记录；不知其他家本日全程。');
}
const notes=fs.readFileSync(path.join(base,`ef-chapter-${n}-semantic.md`),'utf8');
const evidence=[];for(const [id,v]of Object.entries(input.changes.ledger||{}))for(const e of v.evidence||[]){assert.equal(e.unit,n);assert(body.includes(e.quote),`${id}: missing quote ${e.quote}`);evidence.push({id,...e});}
const reportRef=`审查/AD-E-replay-${String(n).padStart(4,'0')}.md`;
const context=path.join(root,`.writer/drafts/ef-context-${n}.json`),template=path.join(root,`.writer/drafts/ef-template-${n}.json`),replayOld=path.join(root,`.writer/drafts/ef-replay-${n}.json`),replayFinal=path.join(root,`.writer/drafts/ef-replay-final-${n}.json`);
const report=`# AD E 第${n}章当前正文与六字段实读复核\n\n本报告是本原生线程实际阅读和语义核对记录，不是作者定稿或真人盲读结论。根选择的普通事实仅为本次验收参数，不是作者新增原话，原值不作为创作错误。\n\n原生thread：${process.env.CODEX_THREAD_ID}\n独立revision：${r.id}\n当前候选revision：${state(root).revision}\n正文：${input.draft}\n正文SHA256：${hash}\n根采用方案SHA256：${sha(fs.readFileSync(path.join(base,'e-root-review.md')))}\n\n## 本次实际阅读及来源\n\n当前主稿1—60共387页在本线程正式门禁前完整返回，逐页日志、文件SHA及恢复页见AD/ef-formal-reading-coverage.json、read-logs；不引用前程74页或F报告代替。候选本章逐页实读日志前缀为 ef-candidate-before-${n}${n===48?' 与 ef-candidate-final-48':'（正文未改，同一路径同SHA的该次完整返回也是当前最终正文阅读）'}。正文变化后必须另读，48已重读全部10页。新来源对象各已在本进程真实返回，并按每次实时revision/impact.required_readings逐一对照旧正文同SHA证据；六份旧来源首次baseline均依法from=1，历史stage/publish的生效范围分别56/58/59/60/58/60。\n\n写前context SHA：${sha(fs.readFileSync(context))}\n写前record-template SHA：${sha(fs.readFileSync(template))}\n旧六字段参考 SHA：${sha(fs.readFileSync(replayOld))}\n当前官方replay-input SHA：${sha(fs.readFileSync(replayFinal))}\n\n${notes}\n\n## 逐项有效引文与当前依赖\n\n以下本章ledger引文逐条对照当前完整正文，实际存在；角色知识按亲见、转述及未见区分。没有把未来付款或原journal整条旧账覆盖当前继承值。\n\n\`\`\`json\n${JSON.stringify(evidence,null,2)}\n\`\`\`\n\n当前context/template/replay自动生成的完整source_hashes及source_bindings如下，未手工替换旧哈希或误将未来新源提前作用；48—51仍按各自真实生效区间使用已有版本。\n\n\`\`\`json\n${JSON.stringify({source_hashes:input.source_hashes,source_bindings:input.source_bindings},null,2)}\n\`\`\`\n\n完整修订仍为48—60，当前进程断点51，不缩减授权；52—60须逐章先取context/template再改必要正文、核当前增量后重登。历史原值和旧source_hashes由冻结对象保留，可复核。旧replay-input/旧journal整条ledger或人物/下游项可能夹带旧数量、价格、收款值；后续不得整条照搬覆盖已重登新值，未发生付款不得提前记入。\n`;
write(path.join(root,reportRef),report);const reportHash=sha(fs.readFileSync(path.join(root,reportRef)));
input.replay_review={reviewer:'Codex AD E current native reading',report:reportRef,draft_sha256:hash,checked_fields:['summary','characters','timeline','ledger','evidence','downstream']};
input.draft_review={reviewer:'Codex AD E current native reading',report:reportRef,draft_sha256:hash,report_sha256:reportHash};
delete input._instructions;
const file=write(path.join(base,'inputs',`ef-record-${n}.json`),input);
const preview=cli(`ef-record-preview-${n}`,['record-preview','--input',file],{root,token,show:false});
console.log(JSON.stringify({kind:'preview',unit:n,ok:preview.ok,revision:preview.revision,change_count:preview.changes?.length,findings:preview.findings,source_hashes:preview.source_hashes,replay_review:preview.replay_review,related_unchanged_ledger:preview.related_unchanged_ledger},null,2));
assert(preview.ok===true);
const result=cli(`ef-record-${n}`,['record','--input',file],{root,token,show:false});
console.log(JSON.stringify({kind:'record',unit:n,result},null,2));
write(path.join(base,`ef-record-result-${n}.json`),{unit:n,draft:input.draft,draft_sha256:hash,report:reportRef,report_sha256:reportHash,revision:state(root).revision,state_sha256:sha(fs.readFileSync(path.join(root,'.writer/state.json'))),preview,result});
