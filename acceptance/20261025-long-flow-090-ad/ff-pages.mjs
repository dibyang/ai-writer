import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {spawnSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),root=JSON.parse(fs.readFileSync(path.join(base,'project.json'))).project;
const [n0,p0,count0='2',suffix='']=process.argv.slice(2),n=Number(n0),p=Number(p0),count=Number(count0);
if(!Number.isInteger(n)||n<1||n>30||!Number.isInteger(p)||p<1||![1,2].includes(count))throw Error('Only first thirty chapters, one or two pages');
const s=JSON.parse(fs.readFileSync(path.join(root,'.writer/state.json'))),u=s.units.find(x=>x.unit===n),file=path.join(root,u.draft),bytes=fs.readFileSync(file);
if(crypto.createHash('sha256').update(bytes).digest('hex')!==u.sha256)throw Error('Current draft drift');
const total=Math.ceil(bytes.toString('utf8').length/1800);if(p+count-1>total)throw Error('Page batch exceeds chapter');
for(let page=p;page<p+count;page++){
 const label=`ff-u${String(n).padStart(2,'0')}-p${String(page).padStart(2,'0')}${suffix}`;
 const r=spawnSync(process.execPath,[path.join(base,'read.mjs'),label,file,String(page)],{encoding:'utf8',maxBuffer:1024*1024,windowsHide:true});
 process.stdout.write(r.stdout);process.stderr.write(r.stderr);if(r.status!==0){process.exitCode=r.status||1;break;}
}
