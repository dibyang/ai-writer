import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const base=import.meta.dirname,manifestFile=path.join(base,'evidence-manifest.json'),mode=process.argv[2];
assert.ok(['seal','verify'].includes(mode));
const sha=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const files=[];let bytes=0;
function walk(dir,ref=''){
  for(const name of fs.readdirSync(dir).sort()){
    const next=ref?ref+'/'+name:name,file=path.join(dir,name);if(next==='evidence-manifest.json')continue;
    const s=fs.lstatSync(file);assert.equal(s.isSymbolicLink(),false,next);
    if(s.isDirectory())walk(file,next);else{assert.equal(s.isFile(),true,next);files.push({file:next,bytes:s.size,sha256:sha(file)});bytes+=s.size;}
  }
}
walk(base);
if(mode==='seal'){
  assert.equal(JSON.parse(fs.readFileSync(path.join(base,'verification.json'))).ok,true);
  fs.writeFileSync(manifestFile,JSON.stringify({format:'sha256-tree-v1',at:new Date().toISOString(),root:'acceptance/20261019-release-080-l',excluded:['evidence-manifest.json'],file_count:files.length,bytes,files},null,2)+'\n',{flag:'wx'});
}else{
  const expected=JSON.parse(fs.readFileSync(manifestFile));assert.equal(files.length,expected.file_count);assert.equal(bytes,expected.bytes);assert.deepEqual(files,expected.files);
}
console.log(JSON.stringify({ok:true,mode,files:files.length,bytes,manifest_sha256:sha(manifestFile)}));
