import fs from 'node:fs';import crypto from 'node:crypto';
const W='D:/work/other/ai-writer/acceptance/20261020-release-readiness-090-u/scenario-final/东岸末班船';
const unit=String(process.argv[2]).padStart(4,'0'),folder=W+'/分段/'+unit+'/v1';
const parts=fs.readdirSync(folder).filter(n=>/^\d\d\.md$/.test(n)).sort().map(name=>{const raw=fs.readFileSync(folder+'/'+name),text=raw.toString('utf8');return {name,sha256:crypto.createHash('sha256').update(raw).digest('hex'),bytes:raw.length,body_han:[...text.replace(/^#{1,6}\s+.*(?:\r?\n|$)/gmu,'').matchAll(/\p{Script=Han}/gu)].length};});
console.log(JSON.stringify({unit,parts,total_body_han:parts.reduce((n,p)=>n+p.body_han,0)},null,2));
