import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {packageFiles,fileRef} from '../../lib/tool-build.mjs';
import {sha,write} from './cli-support.mjs';
const base=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(base,'../..');
const source=path.join(base,'sources/package');assert.ok(!fs.existsSync(source),'Never overwrite frozen source');
const build=packageFiles(root);for(const row of build.files){const ref=fileRef(row),bytes=fs.readFileSync(path.join(root,ref));assert.equal(sha(bytes),row.sha256);write(path.join(source,ref),bytes);}
assert.equal(packageFiles(source).observed_content_id,build.observed_content_id);
write(path.join(base,'source-build.json'),build);
const original=path.resolve(base,'../20261018-governance-d/final-integration/work'),target=path.join(base,'native/work');assert.ok(!fs.existsSync(target));
// Preserve the entire isolated six-chapter fixture, including prior audit history.
fs.cpSync(original,target,{recursive:true});
function inventory(dir){const rows={};function walk(ref=''){for(const name of fs.readdirSync(path.join(dir,ref)).sort()){const r=ref?ref+'/'+name:name,f=path.join(dir,r),s=fs.lstatSync(f);assert.ok(!s.isSymbolicLink());if(s.isDirectory())walk(r);else rows[r]=sha(fs.readFileSync(f));}}walk();return rows;}
const before=inventory(original);assert.deepEqual(inventory(target),before);write(path.join(base,'native/source-inventory.json'),{original,target,files:before});
console.log(JSON.stringify({ok:true,source,content_id:build.observed_content_id,native_files:Object.keys(before).length}));
