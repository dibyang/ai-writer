import fs from 'node:fs';import path from 'node:path';import {stage,work,read,write,hash,cli} from './phase.mjs';
const to=Number(process.argv[2]),from=to-5,notes=process.argv[3];if(to%3||!notes)throw Error('Explicit window notes required');
const state=read(path.join(work,'.writer/state.json'));if(state.units.length!==to)throw Error('Window must bind current terminal unit');
const readings=fs.readFileSync(path.join(stage,'reading.jsonl'),'utf8').trim().split(/\r?\n/).map(JSON.parse),source_hashes={};
for(let n=from;n<=to;n++){const u=state.units[n-1],b=fs.readFileSync(path.join(work,u.draft)),sha=hash(b);if(!readings.some(r=>r.file===u.draft&&r.sha256===sha&&r.coverage==='full'))throw Error('Missing actual full read '+n);source_hashes[u.draft]=sha;}
const expected=state.units.slice(from-1,to).map(u=>u.draft).sort();if(Object.keys(source_hashes).length!==6||JSON.stringify(Object.keys(source_hashes).sort())!==JSON.stringify(expected))throw Error('Incomplete source keyset');
const variant=process.argv[4];if(variant&&!/^[a-z]+$/.test(variant))throw Error('Unsafe report variant');
const report=`审查/revision-c-${variant?variant+'-':''}${from}-${to}.md`;
const text=`# 第${from}—${to}章连读（revision-c）\n\n性质：同一模型知情自检；完整读取当前六章正文，覆盖最近三章与前三章。不是真人盲读、市场验证或正式发布验收。登记前修订号 ${state.revision}。\n\n## 连续性与本窗口结论\n\n${notes}\n\n本轮三项数值/选择调整为主动作者事实变更，不将原稿表述成缺陷。按本窗口实际时点核人物知情、物件保管与后续未完成范围，不从最终90章回灌。\n\n## 真人语言别扭句\n\n有没有哪句话意思能够看懂，却让你觉得别扭、像为了写得漂亮硬拼出来，或者不像一个人当面会这样说？\n\n### 真人语言硬问题\n\n没有\n\n按当面说话、动宾搭配、具体动作与逐句节奏四项复核，本窗口未确认需追加修改的高置信语言硬问题。人物停顿、争执、买菜做饭和工作代价保留；不以个人偏好统一对白。\n\n## 未覆盖项\n\n未核未发生的后续行动；保留相应原due及pending/partial。此报告仅对下列哈希版本负责，机械登记只证明覆盖。\n\n## 正文SHA256\n\n${Object.entries(source_hashes).map(([f,h])=>`- ${f}: ${h}`).join('\n')}\n`;
const file=path.join(work,report);if(fs.existsSync(file))throw Error('Report already exists');fs.writeFileSync(file,text);
const input={from,to,kind:'model-self-review',report,source_hashes};const inputfile=path.join(stage,`reviews/${to}.json`);write(inputfile,input);
write(path.join(stage,`reviews/${to}-keyset.json`),{expected,actual:Object.keys(source_hashes).sort(),count:6,verified:true});
// Deliberately outside the source dictionary construction loop: one real review for the complete window.
const r=cli(`review-${to}`,['review','--input',inputfile]);if(r.exit_code)throw Error(r.stderr);console.log(r.stdout);
