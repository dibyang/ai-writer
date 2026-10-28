import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
const out=path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'));
const al=path.resolve(out,'../20261027-long-0100-al');
const work=path.join(al,'work');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const mode=process.argv[2];
function walk(root,base=root){return fs.readdirSync(root,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(root,e.name),base):[path.relative(base,path.join(root,e.name)).replaceAll('\\','/')]);}
const inventory=walk(al).sort().map(file=>{const b=fs.readFileSync(path.join(al,file));return {file,bytes:b.length,sha256:sha(b)};});
fs.writeFileSync(path.join(out,`al-${mode}-inventory.json`),JSON.stringify(inventory,null,2)+'\n');
if(mode==='before'){
 const seal=JSON.parse(fs.readFileSync(path.join(al,'seal-files.json')));
 const actual=new Map(inventory.map(x=>[x.file,x]));
 const differences=seal.filter(x=>actual.get(x.file)?.sha256!==x.sha256||actual.get(x.file)?.bytes!==x.bytes);
 fs.writeFileSync(path.join(out,'seal-verification.json'),JSON.stringify({files:seal.length,manifest_sha256:sha(fs.readFileSync(path.join(al,'seal-files.json'))),differences},null,2)+'\n');
 for(const [label,args] of [['status',['status','--view','full']],['issues',['review-issues','list']],['check',['check']],['revisions',['revision','list']]]){
  const before=sha(fs.readFileSync(path.join(work,'.writer/state.json')));
  const r=spawnSync(process.execPath,[path.join(work,'.writer/tool/bin/ai-writer.mjs'),...args,'--project',work],{encoding:'utf8',maxBuffer:50*1024*1024});
  fs.writeFileSync(path.join(out,`${label}.stdout.json`),r.stdout??'');
  fs.writeFileSync(path.join(out,`${label}.stderr.txt`),r.stderr??'');
  const meta={args,exit:r.status,error:r.error?.message??null,state_before:before,state_after:sha(fs.readFileSync(path.join(work,'.writer/state.json')))};
  fs.writeFileSync(path.join(out,`${label}.result.json`),JSON.stringify(meta,null,2)+'\n');
  console.log(label,JSON.stringify(meta));
  if(r.status!==0)break;
 }
 const state=JSON.parse(fs.readFileSync(path.join(work,'.writer/state.json')));
 fs.writeFileSync(path.join(out,'state-shape.json'),JSON.stringify(Object.fromEntries(Object.entries(state).map(([k,v])=>[k,Array.isArray(v)?{length:v.length,sample:v[0]}:typeof v==='object'&&v?{keys:Object.keys(v)}:v])),null,2)+'\n');
}else{
 const before=JSON.parse(fs.readFileSync(path.join(out,'al-before-inventory.json')));
 fs.writeFileSync(path.join(out,'unchanged-verification.json'),JSON.stringify({before:before.length,after:inventory.length,identical:JSON.stringify(before)===JSON.stringify(inventory)},null,2)+'\n');
}
console.log('inventory',inventory.length);
