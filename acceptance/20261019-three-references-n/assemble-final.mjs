import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const parts=[1,2,3].map(n=>fs.readFileSync(path.join(base,`sample-parts/part-${n}.md`),'utf8'));
function replace(i,oldText,newText){assert.equal(parts[i].split(oldText).length,2);parts[i]=parts[i].replace(oldText,newText);}
replace(0,'林岚没有马上递回笔。','老周把笔递过来，林岚却没有接。');
replace(2,'想起阳台上还有一盆花没搬','想起换好盆的花还要放回架上');
replace(2,'“那盆花还能再待几天。”','“那两盆花在地上再放几天也没事。”');
replace(2,'她掏钥匙开自行车锁时，那张借条没有再跟着钥匙一起掉出来。','她掏出钥匙，开了自行车锁。');
for(const i of [0,2])fs.writeFileSync(path.join(base,`sample-parts/part-${i+1}-final.md`),parts[i],{flag:'wx'});
const final='# 归梯\n\n'+parts.map(x=>x.trim()).join('\n\n')+'\n',draft=path.join(base,'scenario/归梯样例/正文/0001-归梯.md');fs.writeFileSync(draft,final,{flag:'wx'});
fs.writeFileSync(path.join(base,'assembly-final.json'),JSON.stringify({sha256:sha(final),han_characters:(final.match(/[\u3400-\u9fff]/g)||[]).length,changes:['递笔动作补齐','两盆花都已搬下，后续改为放回架上','删除没有前文支持的再次掉借条回指'],source_parts:parts.map((x,i)=>({part:i+1,sha256:sha(x)})),reviewer:'same Codex session, informed self-review; not independent or human reading'},null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({ok:true,draft,sha256:sha(final),han_characters:(final.match(/[\u3400-\u9fff]/g)||[]).length}));
