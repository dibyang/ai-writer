import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const base='D:/work/other/ai-writer/acceptance/20261016-expanded';
const stage=path.join(base,'revision-a');
const dest=path.join(stage,'before');
if(fs.existsSync(dest)) throw new Error('backup exists');
fs.mkdirSync(dest,{recursive:true});
const entries=[];
function copy(src,target){fs.mkdirSync(target,{recursive:true});for(const d of fs.readdirSync(src,{withFileTypes:true})){const a=path.join(src,d.name),b=path.join(target,d.name);if(d.isDirectory())copy(a,b);else if(d.isFile()){const data=fs.readFileSync(a);fs.writeFileSync(b,data);entries.push({source:a.replaceAll('\\','/'),backup:path.relative(stage,b).replaceAll('\\','/'),bytes:data.length,sha256:crypto.createHash('sha256').update(data).digest('hex')});}else throw new Error('unsafe entry '+a);}}
copy(path.join(base,'works/潮汐信号'),path.join(dest,'work'));
for(const session of ['session-a','session-b','session-c'])copy(path.join(base,session),path.join(dest,'original-inputs',session));
fs.writeFileSync(path.join(stage,'before-manifest.json'),JSON.stringify({time:new Date().toISOString(),entries},null,2)+'\n');
console.log(JSON.stringify({files:entries.length,bytes:entries.reduce((a,x)=>a+x.bytes,0),manifest:path.join(stage,'before-manifest.json')}));
