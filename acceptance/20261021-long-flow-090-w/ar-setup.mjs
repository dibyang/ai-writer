import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import{fileURLToPath}from'node:url';
const W=path.dirname(fileURLToPath(import.meta.url)),P=path.join(W,'scenario/东岸末班船-规模验证');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),read=f=>JSON.parse(fs.readFileSync(f,'utf8')),save=(f,v)=>fs.writeFileSync(f,JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const s=read(path.join(P,'.writer/state.json'));if(s.revision!==58||s.units.length!==12)throw Error('Unexpected resume baseline');
const expected=['b28a81e6e72da383f84fa46b8c05c2701ebd19f183fce6c4a64de54f5a2bb59c','a3cf9fb4bcef741789df6f0515a0f8be7dcab00ab4a7180a2956ce6303eb485a'];
for(let i=0;i<2;i++)if(sha(fs.readFileSync(path.join(P,'分段/0013/v1/0'+(i+1)+'.md')))!==expected[i])throw Error('Part changed');
fs.writeFileSync(path.join(W,'ar-start-state.json'),fs.readFileSync(path.join(P,'.writer/state.json')),{flag:'wx'});
const raw=fs.readFileSync(path.join(W,'prompt-a-resume.md')),rel='研究/W-A-续程授权原文.md';fs.writeFileSync(path.join(P,rel),raw,{flag:'wx'});
const evidence={quote:raw.toString('utf8').split('\n')[0],local_source:rel,source_sha256:sha(raw),locator:'W/prompt-a-resume.md第1行授权同ID完成13—15后停，第5/9/11行规定写读登记、10—15连读及最终paused；原文同字节复制',recorded_by:'同一W-A原生Codex会话续程；非伪造人类消息ID'};
const prev=read(path.join(W,'inputs/a-workflow-official-refs.json')).workflow;
const workflow={...prev,task:'W-A同ID续程：根已核验首停；完成13—15分段/合章实读登记及10—15完整连读review后暂停，等待新鲜B恢复16；整体W仍仅13—24计划',authorization:{allowed_actions:['discuss','plan','draft'],draft_range:{from:13,to:15},revise_range:null,stop_conditions:[
 '本次完成13—15后停；13/14各至少6000正文汉字与3段，15至少8000与4段，每段约1800—2400真实连续正文。原首停已完成，不再将旧首两段限制用于本续程。',
 '逐段实读、CLI assemble、完整成章实读回对有效细纲，报告绑定正文和报告真实SHA；preview退出0才record。旧报告不认证新字节。',
 '15登记后完整实读当前10—15并正式review；最终workflow paused仅discuss，draft_range和revise_range均null，等下一新鲜B，不写16不导出。',
 '前12正文及state.units对象和全部observation type/statement/author_truth不变；若需动1—12则停止说明。',
 '只写W，不改根产品或V/U/T，不另派代理、不Git提交/推送或上传；失败停止依赖，旧/失败输入和原稿不覆盖，禁止手改state/hash或绕过产品。',
 '13/14/15分别真实种下晚课、窄凳、旧布用途；后文18/21/24仍是计划，不预支事实或知情。后续D普通事实修订不在本次提前执行。'
 ]}};
save(path.join(W,'inputs/ar-workflow-continue.json'),{expected_revision:s.revision,operation_id:'w-a-resume-complete-13-15-then-pause',author_evidence:evidence,workflow});
for(const n of [13,14,15]){const relPlan='大纲/单元/'+String(n).padStart(4,'0')+'.json',rawPlan=fs.readFileSync(path.join(P,relPlan));fs.writeFileSync(path.join(W,'originals/ar-plan-'+n+'-before.json'),rawPlan,{flag:'wx'});const p=JSON.parse(rawPlan);p.forbidden=p.forbidden.slice(1);p.forbidden.unshift('本续程只完成13—15后暂停，不写16，不预执行B/D；原首停已核验完成，当前授权见W-A续程原文');p.research_refs.push(rel);if(n===13)p.beats[2]=p.beats[2].replace('；01/02实写到此过程的具体中断，按停点退出','；保留已写01/02的具体人物状态继续推进');save(path.join(W,'inputs/ar-plan-'+n+'.json'),p);}
save(path.join(W,'ar-resume-baseline-check.json'),{revision:s.revision,parts_sha256:expected,old_units_sha256:sha(JSON.stringify(s.units)),author_source:rel,author_source_sha256:sha(raw),note:'Parts and original inputs preserved. Only execution-stop text and additional current authorization reference are planned changes to unregistered outlines; story goal, beats choices and existing parts stay effective.'});
console.log(JSON.stringify({revision:s.revision,parts_match:true,author_source_sha256:sha(raw),created:'workflow and three new plan inputs; no CLI mutation yet'}));
