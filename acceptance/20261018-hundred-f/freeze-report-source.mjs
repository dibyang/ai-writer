import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {packageFiles,fileRef} from '../../lib/tool-build.mjs';
const base=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(base,'../..'),target=path.join(base,'sources/package-v3'),build=packageFiles(root),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
assert.equal(build.tool_version,'0.7.3');assert.ok(!fs.existsSync(target));for(const row of build.files){const ref=fileRef(row),b=fs.readFileSync(path.join(root,ref));assert.equal(sha(b),row.sha256);const file=path.join(target,ref);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,b,{flag:'wx'});}assert.equal(packageFiles(target).observed_content_id,build.observed_content_id);fs.writeFileSync(path.join(base,'source-build-v3.json'),JSON.stringify(build,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({ok:true,source:target,version:build.tool_version,content_id:build.observed_content_id,runtime_id:build.runtime_id,files:build.files.length}));
