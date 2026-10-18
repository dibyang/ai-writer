import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {BASE,sha,write} from './cli-support.mjs';
const source=path.resolve('acceptance/20261018-governance-c/native-create-review/work'),target=path.join(BASE,'final-integration/work');
assert.equal(fs.existsSync(target),false);const files=[];
function visit(root,ref=''){for(const name of fs.readdirSync(path.join(root,ref)).sort()){const r=ref?ref+'/'+name:name,f=path.join(root,r),s=fs.lstatSync(f);assert.equal(s.isSymbolicLink(),false);if(s.isDirectory())visit(root,r);else{assert.ok(s.isFile()&&s.nlink===1);files.push({file:r,bytes:s.size,sha256:sha(fs.readFileSync(f))});}}}visit(source);
fs.cpSync(source,target,{recursive:true});for(const r of files){assert.equal(sha(fs.readFileSync(path.join(source,r.file))),r.sha256);assert.equal(sha(fs.readFileSync(path.join(target,r.file))),r.sha256);}
const state=JSON.parse(fs.readFileSync(path.join(target,'.writer/state.json')));assert.equal(state.schema_version,5);assert.equal(state.units.length,6);
write(path.join(BASE,'final-integration/copy-manifest.json'),{source,target,files,units:6,schema:5,original_state_sha256:sha(fs.readFileSync(path.join(source,'.writer/state.json'))),scope:'Verified byte-for-byte isolated copy of sealed C novel including audit/history dependencies. Old candidate marker paths are historical evidence only; never resume their original C paths. Create all new sessions in this D copy. No new writing yet.'});
console.log(JSON.stringify({ok:true,target,files:files.length,schema:5,units:6}));
