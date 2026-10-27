import fs from 'node:fs';import crypto from 'node:crypto';
const X='D:/work/other/ai-writer/acceptance/20261021-long-flow-090-x',P=X+'/scenario/东岸末班船-再扩展验证';
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
let s=fs.readFileSync(P+'/分段/0032/05-cr-v1.md','utf8').replace('才把凳展开，压稳四只脚。','才把长凳摆正，确认四只脚都稳稳落地。').replace('一个熟客坐上折凳，先把两边脚踏踩一遍','一个熟客坐上长凳，先低头看一眼凳脚');
fs.writeFileSync(P+'/分段/0032/05-cr-v2.md',s,{flag:'wx'});
const parts=['01-c-v2','02-c-v3','03-cr-v1','04-cr-v1','05-cr-v2'].map(n=>({path:'分段/0032/'+n+'.md',sha256:sha(fs.readFileSync(P+'/分段/0032/'+n+'.md'))}));
const input={unit:32,expected_revision:140,draft:'正文/0032-茶慢慢凉下来-cr-v1.md',parts,separator:'\n\n'};
fs.writeFileSync(P+'/.writer/cr-inputs/assemble32-v1.json',JSON.stringify(input,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(input,null,2));
