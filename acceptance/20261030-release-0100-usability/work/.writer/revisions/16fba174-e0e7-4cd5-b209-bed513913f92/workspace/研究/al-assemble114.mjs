import fs from 'node:fs';
import crypto from 'node:crypto';
const t=JSON.parse(fs.readFileSync('研究/AL-a-record114-template.json','utf8'));
const parts=['分段/AL-a-0114/01.md','分段/AL-a-0114/02.md'].map(path=>({path,sha256:crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex')}));
fs.writeFileSync('研究/AL-a-assemble114.json',JSON.stringify({unit:114,expected_revision:t.expected_revision,draft:t.draft,parts,separator:'\n\n'},null,2)+'\n');
console.log(JSON.stringify({revision:t.expected_revision,draft:t.draft,parts}));
