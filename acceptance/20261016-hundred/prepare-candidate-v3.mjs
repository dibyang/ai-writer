import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
const base='acceptance/20261016-hundred',target=path.resolve(base,'candidate-v3-recall');
if(fs.existsSync(target))throw Error('Preserve prior candidate');
const tracked=execFileSync('git',['ls-files','-z'],{maxBuffer:30*1024*1024}).toString('utf8').split('\0').filter(x=>x&&!x.startsWith('acceptance/')&&!x.startsWith('.idea/')&&!x.startsWith('.codex/'));
const paths=[...new Set([...tracked,'tests/recovery-guidance.test.mjs','acceptance/20261015-long/reference-inventory.json'])].sort();
const files=[];fs.mkdirSync(target,{recursive:true});
for(const ref of paths){
 if(path.isAbsolute(ref)||ref.split('/').includes('..'))throw Error(ref);
 const stat=fs.lstatSync(ref);if(!stat.isFile()||stat.isSymbolicLink())throw Error(ref);
 const dest=path.join(target,ref);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(ref,dest);
 files.push({file:ref,sha256:crypto.createHash('sha256').update(fs.readFileSync(dest)).digest('hex')});
}
fs.writeFileSync(`${base}/candidate-v3-origin.json`,JSON.stringify({at:new Date().toISOString(),commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),target,scope:'Isolated current v2 source plus real reference-inventory fixture; main and active book unchanged',files},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({target,files:files.length}));
