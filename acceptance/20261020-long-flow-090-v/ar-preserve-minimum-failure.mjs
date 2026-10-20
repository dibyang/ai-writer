import fs from 'node:fs';import crypto from 'node:crypto';
const v='D:/work/other/ai-writer/acceptance/20261020-long-flow-090-v',w=v+'/scenario/东岸末班船-扩展验证';
const dir=v+'/ar-before-minimum-fix';fs.mkdirSync(dir,{recursive:true});
for(const name of ['01.md','02.md','03.md','04.md','05.md']){const raw=fs.readFileSync(w+'/分段/0006/v1/'+name);fs.writeFileSync(dir+'/'+name,raw,{flag:'wx'});console.log(JSON.stringify({name,sha256:crypto.createHash('sha256').update(raw).digest('hex')}));}
