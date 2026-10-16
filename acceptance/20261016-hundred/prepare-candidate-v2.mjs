import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
const base='acceptance/20261016-hundred',target=path.resolve(base,'candidate-v2');
if(fs.existsSync(target))throw Error('Preserve prior candidate');
fs.mkdirSync(target,{recursive:true});
const paths=execFileSync('git',['ls-files','-z'],{maxBuffer:30*1024*1024}).toString('utf8').split('\0').filter(x=>x&&!x.startsWith('acceptance/')&&!x.startsWith('.idea/')&&!x.startsWith('.codex/'));
const files=[];
for(const ref of paths){if(path.isAbsolute(ref)||ref.split('/').includes('..'))throw Error(ref);const stat=fs.lstatSync(ref);if(!stat.isFile()||stat.isSymbolicLink())throw Error(ref);const dest=path.join(target,ref);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(ref,dest);files.push({file:ref,sha256:crypto.createHash('sha256').update(fs.readFileSync(dest)).digest('hex')});}
fs.writeFileSync(base+'/candidate-v2-origin.json',JSON.stringify({at:new Date().toISOString(),commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),target,files},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({target,files:files.length}));
