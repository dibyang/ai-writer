import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
const base=path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'));const project=path.resolve(base,'../works/雨线档案');
const [a,b,label]=process.argv.slice(2);const hashes={};let text='';
for(let n=+a;n<=+b;n++){const names=fs.readdirSync(path.join(project,'正文')).filter(f=>f.startsWith(String(n).padStart(4,'0')+'-'));if(names.length!==1)throw Error('ambiguous unit '+n);const rel='正文/'+names[0];const bytes=fs.readFileSync(path.join(project,rel));hashes[rel]=crypto.createHash('sha256').update(bytes).digest('hex');text+=`\n===== ${rel} SHA256 ${hashes[rel]} =====\n`+bytes.toString('utf8');}
fs.writeFileSync(path.join(base,label+'.txt'),text);fs.writeFileSync(path.join(base,label+'.hashes.json'),JSON.stringify(hashes,null,2)+'\n');console.log(JSON.stringify({from:+a,to:+b,files:Object.keys(hashes).length,text:label+'.txt'}));
