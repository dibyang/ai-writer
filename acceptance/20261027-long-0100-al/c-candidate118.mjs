import fs from 'node:fs';
import crypto from 'node:crypto';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const t=JSON.parse(fs.readFileSync('研究/AL-c-record118-template.json','utf8'));
const parts=['01','02','03'].map(p=>{const ref=`分段/AL-c-0118/${p}.md`;return{path:ref,sha256:sha(fs.readFileSync(ref))}});
fs.writeFileSync('研究/AL-c-assemble118-candidate.json',JSON.stringify({unit:118,expected_revision:t.expected_revision,draft:'正文/V18-带着回话往下做/0118-先夹自己想吃的-复读稿.md',parts,separator:'\n\n'},null,2)+'\n',{flag:'wx'});
fs.copyFileSync(t.draft,'分段/AL-c-0118/assembled-before-reread.md',fs.constants.COPYFILE_EXCL);
console.log('new candidate input and first assembly preserved');
