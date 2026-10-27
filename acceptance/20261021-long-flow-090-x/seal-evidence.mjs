import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const base=path.dirname(fileURLToPath(import.meta.url)),mode=process.argv[2];
assert(['seal','verify'].includes(mode));
const manifest=path.join(base,'evidence-manifest.json'),files=[];
const sha=v=>crypto.createHash('sha256').update(v).digest('hex');
let bytes=0;
function walk(dir,ref=''){
  for(const name of fs.readdirSync(dir).sort()){
    const next=ref?ref+'/'+name:name,file=path.join(dir,name);
    if(next==='evidence-manifest.json')continue;
    const s=fs.lstatSync(file);assert(!s.isSymbolicLink());
    if(s.isDirectory())walk(file,next);
    else{assert(s.isFile());const raw=fs.readFileSync(file);assert.equal(raw.length,s.size);files.push({file:next,bytes:raw.length,sha256:sha(raw)});bytes+=raw.length;}
  }
}
if(mode==='seal'){
  const j=f=>JSON.parse(fs.readFileSync(path.join(base,f),'utf8'));
  const v=j('verification.json'),flow=j('final-flow-verification.json');
  assert(v.ok&&v.complete);assert.equal(v.registered_units,36);
  assert.equal(v.scope,'windows-local-thirty-six-chapter-expanded-flow');
  assert.equal(v.formal_release_acceptance,false);
  assert(v.public_tool_record_supplement.ok);
  assert(flow.ok);assert.equal(flow.registered_units,36);
  assert(j('failure-dispositions.json').complete_for_snapshot&&j('failure-dispositions.json').final);
  assert(j('repository-final-verification.json').ok);
  assert(j('baseline-regression-verification.json').ok);
  assert(!fs.existsSync(manifest),'Never overwrite a sealed tree');
}
walk(base);
if(mode==='seal'){
  fs.writeFileSync(manifest,JSON.stringify({format:'sha256-tree-v1',at:new Date().toISOString(),root:'acceptance/20261021-long-flow-090-x',excluded:['evidence-manifest.json'],file_count:files.length,bytes,files},null,2)+'\n',{flag:'wx'});
}else{
  const m=JSON.parse(fs.readFileSync(manifest,'utf8'));
  assert.equal(m.file_count,files.length);assert.equal(m.bytes,bytes);assert.deepEqual(m.files,files);
}
console.log(JSON.stringify({ok:true,mode,files:files.length,bytes,manifest_sha256:sha(fs.readFileSync(manifest))}));
