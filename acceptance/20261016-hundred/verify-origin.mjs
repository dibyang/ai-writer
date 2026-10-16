import fs from 'node:fs';
import crypto from 'node:crypto';
const base='acceptance/20261016-expanded/';
const manifestBytes=fs.readFileSync(base+'evidence-manifest.json'),manifest=JSON.parse(manifestBytes);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const mismatches=[];
for(const item of manifest.files){try{const b=fs.readFileSync(base+item.file);if(b.length!==item.bytes||sha(b)!==item.sha256)mismatches.push(item.file)}catch(e){mismatches.push({file:item.file,error:e.message})}}
const expected='c0f61768d4b4ec0f3507eaf10e3cc0b749d7fcb666015f1f990947b0d3d8d07a';
const result={created_at:new Date().toISOString(),checked:manifest.files.length,manifest_sha256:sha(manifestBytes),expected_manifest_sha256:expected,mismatches,ok:!mismatches.length&&sha(manifestBytes)===expected};
fs.writeFileSync('acceptance/20261016-hundred/origin-integrity.json',JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(result));process.exitCode=result.ok?0:1;
