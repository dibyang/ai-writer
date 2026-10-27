import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)), parent=path.dirname(here);
const label=process.argv[2];assert(/^[a-z][a-z0-9-]*$/.test(label??''));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const groups=[
 ['20261021-long-flow-090-x','evidence-manifest.json',false],
 ['20261024-candidate-continuation-fix-y','records-manifest.json',true],
 ['20261024-candidate-parent-addition-fix-z','records-manifest.json',true],
 ['20261024-candidate-plan-handoff-fix-aa','records-manifest.json',true],
 ['20261024-registered-seven-revision-ab','records-manifest.json',true],
 ['20261024-long-flow-090-ac','evidence-manifest.json',false]
], results=[];
for(const [name,manifestName,skipTmp] of groups){
 const root=path.join(parent,name), manifestBytes=fs.readFileSync(path.join(root,manifestName));
 const manifest=JSON.parse(manifestBytes), receiptBytes=fs.readFileSync(root+'-seal-receipt.json'), receipt=JSON.parse(receiptBytes);
 assert.equal(sha(manifestBytes),receipt.manifest_sha256??receipt.sealed?.manifest_sha256,name);
 const expected=new Map(manifest.files.map(row=>[row.file,row]));assert.equal(expected.size,manifest.files.length);
 let count=0,bytes=0,last=Date.now();
 function walk(ref=''){
  for(const entry of fs.readdirSync(path.join(root,ref)).sort()){
   const file=ref?ref+'/'+entry:entry;
   if(file===manifestName||skipTmp&&entry.startsWith('.tmp'))continue;
   const absolute=path.join(root,file), stat=fs.lstatSync(absolute);assert(!stat.isSymbolicLink(),file);
   if(stat.isDirectory()){walk(file);continue;}
   assert(stat.isFile(),file);const row=expected.get(file);assert(row,`${name}: unexpected non-excluded file ${file}`);
   const b=fs.readFileSync(absolute);assert.equal(b.length,row.bytes,file);assert.equal(sha(b),row.sha256,file);
   count++;bytes+=b.length;
   if(count%2000===0||Date.now()-last>30000){console.error(JSON.stringify({name,files:count,total:expected.size,bytes}));last=Date.now();}
  }
 }
 walk();assert.equal(count,expected.size);assert.equal(count,receipt.files??receipt.verified?.files,name);
 results.push({name,ok:true,files:count,bytes,manifest_sha256:sha(manifestBytes),receipt_sha256:sha(receiptBytes),excluded_generated_tmp_subtrees:skipTmp});
 console.error(JSON.stringify({verified:name,files:count}));
}
const result={ok:true,at:new Date().toISOString(),groups:results,scope:'Read-only manifests, files, and external seal receipts. No historical seal/build script executed. Existing temporary-fixture exclusions remain exclusions.'};
fs.writeFileSync(path.join(here,'prior-seals-'+label+'-verification.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:true,groups:results.length,files:results.reduce((n,x)=>n+x.files,0)}));
