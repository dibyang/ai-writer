import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url));
const before=JSON.parse(fs.readFileSync(path.join(base,'protected-before.json'))),after=JSON.parse(fs.readFileSync(path.join(base,'protected-final.json')));
assert.equal(before.root,after.root);
const a=new Map(before.files.map(r=>[r.file,r])),b=new Map(after.files.map(r=>[r.file,r])),differences=[];
for(const file of [...new Set([...a.keys(),...b.keys()])].sort()){const x=a.get(file),y=b.get(file);if(!x||!y||x.bytes!==y.bytes||x.sha256!==y.sha256)differences.push({file,before:x??null,after:y??null});}
const result={at:new Date().toISOString(),root:before.root,scope:'all recursively inventoried regular files including .git; no exclusions; contents and bytes, not access times',before_files:a.size,after_files:b.size,differences};
fs.writeFileSync(path.join(base,'protected-comparison.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:differences.length===0,before_files:a.size,after_files:b.size,differences:differences.length}));
if(differences.length)process.exitCode=1;
