import fs from 'node:fs';
import crypto from 'node:crypto';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const a=JSON.parse(fs.readFileSync('研究/AL-c-assemble118-candidate.json','utf8'));
a.draft='正文/V18-带着回话往下做/0118-先夹自己想吃的-核对稿.md';
for(const p of a.parts)p.sha256=sha(fs.readFileSync(p.path));
fs.writeFileSync('研究/AL-c-assemble118-final.json',JSON.stringify(a,null,2)+'\n',{flag:'wx'});
console.log('final input retained sources');
