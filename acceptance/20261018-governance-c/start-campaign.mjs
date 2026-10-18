import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
const root=process.cwd(),base=path.join(root,'acceptance/20261018-governance-c');
fs.mkdirSync(base);
for(const name of ['capture.mjs','snapshot.mjs','baseline.mjs']) fs.copyFileSync(path.join(root,'acceptance/20261018-governance-b',name),path.join(base,name),fs.constants.COPYFILE_EXCL);
const files=['package.json','bin/ai-writer.mjs',...['workspace','journal','longform','help','style','governance','tool-build','sources','revisions'].map(n=>`lib/${n}.mjs`)];
const rows=[];
for(const ref of files){const bytes=execFileSync('git',['show',`HEAD:${ref}`]);const dest=path.join(base,'fixtures/tool-0.5',ref);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,bytes,{flag:'wx'});rows.push({file:ref,sha256:crypto.createHash('sha256').update(bytes).digest('hex')});}
fs.writeFileSync(path.join(base,'fixtures/tool-0.5/source-manifest.json'),JSON.stringify(rows,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({base,old_runtime_files:rows.length}));
