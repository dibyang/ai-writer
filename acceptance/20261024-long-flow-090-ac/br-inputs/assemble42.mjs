import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const base=path.resolve('acceptance/20261024-long-flow-090-ac');
const project=path.join(base,'scenario/东岸末班船-48章独立验证');
const before=JSON.parse(fs.readFileSync(path.join(project,'.writer/drafts/AC-B-resume-record42-before.json')));
const parts=Array.from({length:8},(_,i)=>{const p=`分段/AC-B-0042/${String(i+1).padStart(2,'0')}.md`;return {path:p,sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(project,p))).digest('hex')};});
fs.writeFileSync(path.join(base,'br-inputs/assemble42.json'),JSON.stringify({unit:42,expected_revision:before.expected_revision,draft:before.draft,parts,separator:'\n\n'},null,2)+'\n',{flag:'wx'});
