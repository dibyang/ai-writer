import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),parts=[1,2,3].map(n=>({ref:`sample-parts/part-${n}.md`,text:fs.readFileSync(path.join(base,`sample-parts/part-${n}.md`),'utf8')}));
const write=(ref,text)=>fs.writeFileSync(path.join(base,ref),text,{flag:'wx'});
write('scenario/draft-v1.md','# 归梯\n\n'+parts.map(x=>x.text.trim()).join('\n\n')+'\n');write('scenario/negative-omission.md','# 归梯（截去结尾的反例，不是最终正文）\n\n'+parts.slice(0,2).map(x=>x.text.trim()).join('\n\n')+'\n');
write('assembly-v1.json',JSON.stringify({parts:parts.map(x=>({ref:x.ref,sha256:crypto.createHash('sha256').update(x.text).digest('hex')})),nature:'Synthetic model-written sample; unregistered initial assembly and deliberately incomplete comparison.'},null,2)+'\n');console.log('Initial assembly and incomplete comparison saved, awaiting actual model reading.');
