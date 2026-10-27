import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {runClosure} from './run-closure.mjs';
const here=path.dirname(fileURLToPath(import.meta.url)),mode=process.argv[2];
assert(['seal','verify'].includes(mode));
const manifestPath=path.join(here,'evidence-manifest.json'),receiptPath=here+'-seal-receipt.json';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const verificationBytes=fs.readFileSync(path.join(here,'verification.json')),verification=JSON.parse(verificationBytes);
assert(verification.ok&&verification.complete);assert.equal(verification.registered_units,66);
assert.equal(verification.formal_release_acceptance,false);
for(const name of fs.readdirSync(path.join(here,'native'))){
 runClosure(here,`native/${name}`);
}
const files=[];let bytes=0,last=Date.now();
function walk(ref=''){
 for(const name of fs.readdirSync(path.join(here,ref)).sort()){
  const file=ref?ref+'/'+name:name;if(file==='evidence-manifest.json')continue;
  const absolute=path.join(here,file),stat=fs.lstatSync(absolute);assert(!stat.isSymbolicLink(),file);
  if(stat.isDirectory()){walk(file);continue;}
  assert(stat.isFile(),file);const b=fs.readFileSync(absolute);assert.equal(b.length,stat.size,file);
  files.push({file,bytes:b.length,sha256:sha(b)});bytes+=b.length;
  if(files.length%1000===0||Date.now()-last>30000){console.error(JSON.stringify({stage:'inventory',files:files.length,bytes}));last=Date.now();}
 }
}
walk();
if(mode==='seal'){
 assert(!fs.existsSync(manifestPath));assert(!fs.existsSync(receiptPath));
 const manifest={format:'sha256-tree-v1',at:new Date().toISOString(),root:'acceptance/20261026-long-flow-090-ae',excluded:['evidence-manifest.json'],file_count:files.length,bytes,files};
 fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n',{flag:'wx'});
 let checked=0;
 for(const row of files){
  const actual=fs.readFileSync(path.join(here,row.file));assert.equal(actual.length,row.bytes,row.file);assert.equal(sha(actual),row.sha256,row.file);
  if(++checked%2000===0)console.error(JSON.stringify({stage:'verify',files:checked,total:files.length}));
 }
 fs.writeFileSync(receiptPath,JSON.stringify({ok:true,at:new Date().toISOString(),files:files.length,bytes,manifest_sha256:sha(fs.readFileSync(manifestPath)),verification_sha256:sha(verificationBytes),note:'External receipt; no post-seal AE writes. Literature remains model self-review and exported draft.'},null,2)+'\n',{flag:'wx'});
}else{
 const m=JSON.parse(fs.readFileSync(manifestPath)),r=JSON.parse(fs.readFileSync(receiptPath));
 assert.equal(m.file_count,files.length);assert.equal(m.bytes,bytes);assert.deepEqual(m.files,files);
 assert.equal(sha(fs.readFileSync(manifestPath)),r.manifest_sha256);assert.equal(sha(verificationBytes),r.verification_sha256);
}
console.log(JSON.stringify({ok:true,mode,files:files.length,bytes,manifest_sha256:sha(fs.readFileSync(manifestPath)),receipt:receiptPath}));
