import fs from 'node:fs';
import path from 'node:path';
import {identifyBuild,fileRef} from '../../lib/tool-build.mjs';
const root=path.resolve(import.meta.dirname,'../..'),out=path.join(import.meta.dirname,'sources/package-0.8.0-v2');
if(fs.existsSync(out))throw Error('frozen source already exists');
const b=identifyBuild(root);if(!b.ok)throw Error(JSON.stringify(b));
for(const r of b.files){const ref=fileRef(r),to=path.join(out,ref);fs.mkdirSync(path.dirname(to),{recursive:true});fs.copyFileSync(path.join(root,ref),to,fs.constants.COPYFILE_EXCL);}
fs.writeFileSync(path.join(import.meta.dirname,'source-build-080-v2.json'),JSON.stringify(b,null,2)+'\n',{flag:'wx'});
const after=identifyBuild(out);if(after.observed_content_id!==b.observed_content_id)throw Error('freeze differs');
console.log(JSON.stringify({files:b.files.length,content_id:b.observed_content_id,version:b.tool_version}));
