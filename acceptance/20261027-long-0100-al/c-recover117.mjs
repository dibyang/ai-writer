import fs from 'node:fs';
const a=JSON.parse(fs.readFileSync('研究/AL-c-assemble117-reread.json','utf8'));
a.draft='正文/V18-带着回话往下做/0117-不必带一盘来-复读稿.md';
fs.writeFileSync('研究/AL-c-assemble117-candidate.json',JSON.stringify(a,null,2)+'\n',{flag:'wx'});
console.log(a.draft);
