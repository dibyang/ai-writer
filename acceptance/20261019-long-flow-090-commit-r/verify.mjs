import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const base=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(base,'../..'),mode=process.argv[2];
assert.ok(['prepare','stage','committed'].includes(mode));
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const json=ref=>JSON.parse(fs.readFileSync(path.join(root,ref)));
const product=['.agents/skills/writer-novel/references/chapter-delivery.md','CHANGELOG.md','README.md','RELEASE_NOTES.md','docs/quickstart.md','docs/user-guide.md','lib/workspace.mjs','tests/context-budget.test.mjs'];
const expected=new Set(product),seals=[];
const git=args=>{const r=spawnSync('git',args,{cwd:root,encoding:'utf8',windowsHide:true,maxBuffer:64*1024*1024});assert.equal(r.status,0,r.stderr);return r.stdout;};
function walk(ref){return fs.readdirSync(path.join(root,ref)).sort().flatMap(name=>{const next=ref+'/'+name,s=fs.lstatSync(path.join(root,next));assert.equal(s.isSymbolicLink(),false,next);return s.isDirectory()?walk(next):[next];});}
for(const ref of ['acceptance/20261019-three-references-n','acceptance/20261019-version-090-o','acceptance/20261019-long-flow-090-q']){
  const manifest=json(ref+'/evidence-manifest.json'),rows=walk(ref).filter(x=>x!==ref+'/evidence-manifest.json');
  assert.equal(rows.length,manifest.file_count);assert.equal(rows.length,manifest.files.length);
  const actual=new Set(rows.map(x=>x.slice(ref.length+1)));
  for(const row of manifest.files){assert.ok(actual.delete(row.file),row.file);const bytes=fs.readFileSync(path.join(root,ref,row.file));assert.equal(bytes.length,row.bytes);assert.equal(sha(bytes),row.sha256,row.file);}
  assert.equal(actual.size,0);
  if(ref.endsWith('-q')){for(const file of walk(ref))expected.add(file);expected.add(ref+'-seal-verification.json');}
  seals.push({directory:ref,files:rows.length,manifest_sha256:sha(fs.readFileSync(path.join(root,ref,'evidence-manifest.json')))});
}
const inputs=json('acceptance/20261019-long-flow-090-q/source-frozen.json');
for(const row of inputs)assert.equal(sha(fs.readFileSync(path.join(root,row.file))),row.sha256,row.file);
const own=path.relative(root,base).replaceAll('\\','/');
for(const file of ['README.md','verify.mjs','verification.json'])expected.add(own+'/'+file);
if(mode==='prepare'){
  assert.equal(git(['diff','--cached','--name-only']).trim(),'','Unexpected existing staged content');
  const files=[...expected].sort().filter(x=>x!==own+'/verification.json').map(file=>({file,sha256:sha(fs.readFileSync(path.join(root,file)))}));
  const result={ok:true,scope:'Local commit only; no push, tags, release or existing-work changes.',base_commit:git(['rev-parse','HEAD']).trim(),frozen_product_inputs:inputs.length,seals,expected_staged_files:expected.size,files,receipt_excluded_from_own_hash:own+'/verification.json'};
  fs.writeFileSync(path.join(base,'verification.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
  console.log(JSON.stringify({ok:true,mode,expected_files:expected.size,frozen_inputs:inputs.length,seals}));
}else{
  const receipt=json(own+'/verification.json');for(const row of receipt.files)assert.equal(sha(fs.readFileSync(path.join(root,row.file))),row.sha256,row.file);
  const names=mode==='stage'?git(['diff','--cached','--name-only','-z']):git(['diff-tree','--no-commit-id','--name-only','-r','-z','HEAD']);
  assert.deepEqual(names.split('\0').filter(Boolean).sort(),[...expected].sort());
  if(mode==='committed')assert.equal(git(['rev-parse','HEAD^']).trim(),receipt.base_commit);
  const algorithm=git(['rev-parse','--show-object-format']).trim();
  const entries=mode==='stage'?git(['ls-files','--stage','-z']):git(['ls-tree','-r','-z','HEAD']);
  const index=new Map(entries.split('\0').filter(Boolean).map(x=>{const tab=x.indexOf('\t');return [x.slice(tab+1),x.slice(0,tab).split(' ')];}));
  for(const file of expected){const bytes=fs.readFileSync(path.join(root,file)),blob=crypto.createHash(algorithm).update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex'),row=index.get(file);assert.ok(row,file);if(mode==='stage'){assert.equal(row[1],blob,file);assert.equal(row[2],'0',file);}else{assert.equal(row[1],'blob',file);assert.equal(row[2],blob,file);}}
  console.log(JSON.stringify({ok:true,mode,verified_files:expected.size,head:git(['rev-parse','HEAD']).trim(),frozen_inputs:inputs.length,seals}));
}
