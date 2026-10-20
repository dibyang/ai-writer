import fs from 'node:fs';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const U='D:/work/other/ai-writer/acceptance/20261020-release-readiness-090-u',W=U+'/scenario-final/东岸末班船',sha=b=>crypto.createHash('sha256').update(b).digest('hex');
if(process.argv[2]==='copy'){
 fs.mkdirSync(W+'/分段/0002/v2',{recursive:false});for(const n of ['01','02','03'])fs.copyFileSync(W+'/分段/0002/v1/'+n+'.md',W+'/分段/0002/v2/'+n+'.md',fs.constants.COPYFILE_EXCL);console.log('Copied v1 parts to new v2; original complete chapter retained.');
}else if(process.argv[2]==='input'){
 const old=JSON.parse(fs.readFileSync(W+'/.writer/drafts/final-a-assemble-2.json','utf8')),input={...old,draft:'正文/0002-多跑的一趟-v2.md',parts:old.parts.map(p=>{const ref=p.path.replace('/v1/','/v2/');return {path:ref,sha256:sha(fs.readFileSync(W+'/'+ref))};})};
 fs.writeFileSync(W+'/.writer/drafts/final-a-assemble-2-v2.json',JSON.stringify(input,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(input,null,2));
}else if(process.argv[2]==='verify'){
 const input=JSON.parse(fs.readFileSync(W+'/.writer/drafts/final-a-assemble-2-v2.json','utf8')),raw=fs.readFileSync(W+'/'+input.draft),joined=Buffer.concat(input.parts.flatMap((p,i)=>i?[Buffer.from(input.separator),fs.readFileSync(W+'/'+p.path)]:[fs.readFileSync(W+'/'+p.path)]));assert.ok(raw.equals(joined));
 const info={ok:true,path:input.draft,sha256:sha(raw),bytes:raw.length,body_han:[...raw.toString('utf8').replace(/^#{1,6}\s+.*(?:\r?\n|$)/gmu,'').matchAll(/\p{Script=Han}/gu)].length,exact_byte_join:true,parts:input.parts};assert.ok(info.body_han>=3500);
 fs.writeFileSync(U+'/final-a-assembly-2-v2-verification.json',JSON.stringify(info,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(info,null,2));
}else throw Error('copy|input|verify');
