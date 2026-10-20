import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {base,save,sha} from './common.mjs';
const phase=process.argv[2],b=JSON.parse(fs.readFileSync(path.join(base,'r1-session.json'))),before=JSON.parse(fs.readFileSync(path.join(base,phase==='initial-after'?'r1-resumed-initial-read-before.json':'r1-final-read-before.json')));
const files=before.files.map(f=>{const v=fs.readFileSync(f.path);assert.equal(sha(v),f.sha256);return {...f,after_sha256:sha(v),unchanged:true};});
save(phase==='initial-after'?'r1-resumed-initial-read-after.json':'r1-final-read-after.json',{files,actual_ranges:{15:'1—167 EOF',16:'1—122 EOF',17:'1—120 EOF',18:'1—98 EOF',19:'1—180/181—353 EOF',20:'1—147 EOF',21:'1—155 EOF',22:'1—167 EOF',23:'1—159 EOF',24:'1—153 EOF'},kind:phase==='initial-after'?'native same-client resume full candidate restoration reading':'native same-client final ordered 15-to-24 full candidate reading',scope:'model informed actual text read, not blind or human review'});
console.log(JSON.stringify({ok:true,phase,files:files.length,unchanged:true}));
