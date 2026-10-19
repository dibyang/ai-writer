import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {identifyBuild,packageFiles,fileRef,writeBuildManifest,sourceProvenance} from '../../lib/tool-build.mjs';
const here=import.meta.dirname,root=path.resolve(here,'../..'),out=path.join(here,'source-0.8.1');
assert.equal(fs.existsSync(out),false);
const before=packageFiles(root);assert.equal(before.tool_version,'0.8.1');
for(const row of before.files){const ref=fileRef(row),target=path.join(out,ref);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(root,ref),target);}
writeBuildManifest(out,sourceProvenance(root));
const frozen=identifyBuild(out);assert.equal(frozen.ok,true);assert.equal(frozen.observed_content_id,before.observed_content_id);
fs.writeFileSync(path.join(here,'source-build.json'),JSON.stringify(before,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:true,tool_version:before.tool_version,resources:before.files.length,content_id:before.observed_content_id}));
