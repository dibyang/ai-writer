import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const base='acceptance/20261016-hundred',origin=path.resolve('acceptance/20261016-expanded');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
assert.equal(read(`${base}/final-review/process-result.json`).exit_code,0,'Final native writer must stop');
assert(read(`${base}/audits/final-review.json`).ok,'Final independent audit must pass');
const bytes=fs.readFileSync(path.join(origin,'evidence-manifest.json'));
const expected='c0f61768d4b4ec0f3507eaf10e3cc0b749d7fcb666015f1f990947b0d3d8d07a';
assert.equal(hash(bytes),expected);
const manifest=JSON.parse(bytes),mismatches=[];
for(const row of manifest.files){try{const file=path.resolve(origin,row.file);assert(file.startsWith(origin+path.sep));const value=fs.readFileSync(file);if(value.length!==row.bytes||hash(value)!==row.sha256)mismatches.push(row.file);}catch(e){mismatches.push({file:row.file,error:e.message});}}
const result={at:new Date().toISOString(),scope:'Fresh original-campaign file verification after final native review; earlier origin-integrity.json is preserved as its own timestamped checkpoint.',ok:mismatches.length===0,checked:manifest.files.length,manifest_sha256:hash(bytes),mismatches};
fs.writeFileSync(`${base}/origin-final-integrity.json`,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(result));process.exitCode=result.ok?0:1;
