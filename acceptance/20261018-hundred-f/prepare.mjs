import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {packageFiles,fileRef} from '../../lib/tool-build.mjs';
const base=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(base,'../..'),source=path.resolve(base,'../20261018-governance-d/scale-hundred/work'),work=path.join(base,'work');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
function write(ref,b){const f=path.join(base,ref);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,Buffer.isBuffer(b)||typeof b==='string'?b:JSON.stringify(b,null,2)+'\n',{flag:'wx'});}
function inventory(dir){const rows=[];function walk(ref=''){for(const name of fs.readdirSync(path.join(dir,ref)).sort()){const r=ref?ref+'/'+name:name,f=path.join(dir,r),s=fs.lstatSync(f);assert.ok(!s.isSymbolicLink());if(s.isDirectory())walk(r);else{assert.ok(s.isFile());const b=fs.readFileSync(f);rows.push({file:r,bytes:b.length,sha256:sha(b)});}}}walk();return rows;}
assert.ok(!fs.existsSync(work));const before=inventory(source);fs.cpSync(source,work,{recursive:true});assert.deepEqual(inventory(work),before);write('original-inventory.json',{source,work,files:before});write('baseline-state.bin',fs.readFileSync(path.join(source,'.writer/state.json')));
const build=packageFiles(root);for(const row of build.files){const ref=fileRef(row),b=fs.readFileSync(path.join(root,ref));assert.equal(sha(b),row.sha256);write('sources/package/'+ref,b);}assert.equal(packageFiles(path.join(base,'sources/package')).observed_content_id,build.observed_content_id);write('source-build.json',build);
fs.copyFileSync(path.join(base,'REQUEST.md'),path.join(work,'研究/F轮用户授权与执行范围.md'),fs.constants.COPYFILE_EXCL);
const state=JSON.parse(fs.readFileSync(path.join(work,'.writer/state.json')));assert.equal(state.units.length,100);assert.equal(state.schema_version,6);assert.equal(state.tool_control.generation,1);
write('preparation.json',{ok:true,source,work,copied_files:before.length,source_content_id:build.observed_content_id,baseline:{schema:state.schema_version,revision:state.revision,generation:state.tool_control.generation,units:state.units.length},note:'All original files byte-equal before adding this new task authorization; no original archive or real work written.'});console.log(JSON.stringify({ok:true,files:before.length,revision:state.revision,source_content_id:build.observed_content_id}));
