import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {packageFiles,fileRef} from '../../lib/tool-build.mjs';

const base=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(base,'../..');
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const before=JSON.parse(fs.readFileSync(path.join(base,'source-build-v2.json')));
const build=packageFiles(root);
assert.equal(build.tool_version,'0.7.5');assert.equal(build.runtime_id,before.runtime_id);
const old=new Map(before.files.map(row=>[row.group+'/'+row.file,row]));
const changed=build.files.filter(row=>old.get(row.group+'/'+row.file)?.sha256!==row.sha256).map(row=>({file:fileRef(row),before:old.get(row.group+'/'+row.file)?.sha256??null,after:row.sha256}));
assert.ok(changed.length>0);assert.ok(changed.every(row=>row.file.startsWith('docs/')));
const out=path.join(base,'sources/package-v3');assert.equal(fs.existsSync(out),false);fs.mkdirSync(out,{recursive:true});
for(const row of build.files){const ref=fileRef(row),bytes=fs.readFileSync(path.join(root,ref));assert.equal(sha(bytes),row.sha256);const target=path.join(out,ref);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes,{flag:'wx'});}
assert.equal(packageFiles(out).observed_content_id,build.observed_content_id);
const result={...build,scope:'Documentation-only candidate: distinguish context budget from Codex display truncation, preserve existing report anchor, clarify current revision/update/issue capabilities. Installed package-v2 remains unchanged until all protected revisions are closed.',expected_installed_generation:7,previous_content_id:before.observed_content_id,changed_resources:changed};
fs.writeFileSync(path.join(base,'source-build-v3.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:true,version:build.tool_version,content_id:build.observed_content_id,runtime_id:build.runtime_id,files:build.files.length,changed:changed.map(row=>row.file),installation:'not yet performed'}));
