import fs from 'node:fs';
import path from 'node:path';
const session=path.resolve('acceptance/20261016-expanded/session-a');
const work=path.resolve('acceptance/20261016-expanded/works/潮汐信号');
const [action,n]=process.argv.slice(2);
if(action==='template'){
 const files=fs.readdirSync(path.join(session,'cli-logs')).filter(x=>x.endsWith('-record-template.stdout')).sort();
 const obj=JSON.parse(fs.readFileSync(path.join(session,'cli-logs',files.at(-1)),'utf8'));
 fs.writeFileSync(path.join(session,'inputs',`record-${n}.json`),JSON.stringify(obj,null,2)+'\n');
 console.log(JSON.stringify(obj,null,2));
}else if(action==='count'){
 for(const f of fs.readdirSync(path.join(work,'正文')).filter(x=>x.endsWith('.md')).sort()){
 const t=fs.readFileSync(path.join(work,'正文',f),'utf8').replace(/^#.*(?:\r?\n|$)/,'');
 console.log(JSON.stringify({file:f,han:[...t.matchAll(/\p{Script=Han}/gu)].length}));
 }
}else throw new Error('unknown action');
