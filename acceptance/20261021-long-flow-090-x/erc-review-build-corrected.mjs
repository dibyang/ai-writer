import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
const X=path.dirname(fileURLToPath(import.meta.url)),h=JSON.parse(fs.readFileSync(path.join(X,'cli-logs/e-begin/stdout.raw.txt'),'utf8')),W=h.workspace,key=process.argv[2],j=f=>JSON.parse(fs.readFileSync(f,'utf8')),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const input=j(path.join(W,`.writer/drafts/er-review${key}-template.json`)),data=j(path.join(X,`er-reviewdata${key}-corrected.json`)),s=j(path.join(W,'.writer/state.json'));
assert.equal(input.expected_revision,s.revision);for(const [r,v]of Object.entries(input.source_hashes))assert.equal(sha(fs.readFileSync(path.join(W,r))),v);
input.operation_id=`X_ER_current_${key.replaceAll('-','_')}_r${s.revision}`;
input.chapter_functions=data.chapters.map(c=>Object.fromEntries([['unit',c.unit],...['goal','obstacle','choice','consequence','relationship_change'].map(k=>[k,{status:'observed',text:c[k][0],evidence:[{unit:c.unit,quote:c[k][1]}]}])]));
assert.deepEqual(input.chapter_functions.map(c=>c.unit),Array.from({length:input.to-input.from+1},(_,i)=>input.from+i));
input.comparison=data.comparison;input.report=`审查/X-ER当前${key}完整连读.md`;
let report=`# X-ER当前${key}完整连读\n\nCodex知情模型自检。原生FastCtx每次<=100行，按Partial精确续页直到EOF。${data.reading}\n\n绑定r${s.revision}，state SHA ${sha(fs.readFileSync(path.join(W,'.writer/state.json')))}。\n\n`;
for(const c of input.chapter_functions){const u=s.units.find(u=>u.unit===c.unit);report+=`## ${c.unit} ${u.draft}\n\nSHA ${u.sha256}。\n\n`;for(const k of ['goal','obstacle','choice','consequence','relationship_change'])report+=`${k}：${c[k].text} 引句：“${c[k].evidence[0].quote}”\n\n`;}
report+=`## 比较\n\n${JSON.stringify(data.comparison,null,2)}\n\n${data.notes}\n\n## 真人语言别扭句\n\n### 真人语言硬问题\n\n${data.hard??'没有'}\n\n### 风格偏好观察\n\n${data.style}\n\n${data.limitation}\n`;
function check(v){if(Array.isArray(v))for(const x of v)check(x);else if(v&&typeof v==='object'){if(v.quote&&v.unit){const u=s.units.find(u=>u.unit===v.unit);assert(fs.readFileSync(path.join(W,u.draft),'utf8').includes(v.quote),`quote absent ${v.unit}: ${v.quote}`);}for(const x of Object.values(v))check(x);}}check(input);
fs.writeFileSync(path.join(W,input.report),report,{flag:'wx'});fs.writeFileSync(path.join(X,`er-review${key}-final.json`),JSON.stringify(input,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({range:key,report:input.report,report_sha256:sha(Buffer.from(report)),units:s.units.length}));
