import fs from 'node:fs';import path from 'node:path';
const base=path.resolve('acceptance/20261024-long-flow-090-ac'),root=JSON.parse(fs.readFileSync(path.join(base,'project.json'))).project,folder=path.join(base,'d-inputs/46-before-read-fixes');fs.mkdirSync(folder,{recursive:true});
fs.copyFileSync(path.join(root,'正文/0046-盒里最后一块-ac-d-v1.md'),path.join(folder,'0046-盒里最后一块-ac-d-v1.md'),fs.constants.COPYFILE_EXCL);
for(const n of ['01','03','04','05','06','07'])fs.copyFileSync(path.join(root,'分段/AC-D-0046',n+'.md'),path.join(folder,n+'.md'),fs.constants.COPYFILE_EXCL);
