import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const U='D:/work/other/ai-writer/acceptance/20261020-release-readiness-090-u',W=U+'/scenario-final/东岸末班船',dest=U+'/final-a-before-2';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const t=read(W+'/.writer/drafts/final-a-record-2-before.json'),c=read(W+'/.writer/drafts/final-a-context-2.json');
assert.equal(t.expected_revision,4);assert.deepEqual(t.source_hashes,c.source_hashes);assert.equal(fs.existsSync(W+'/分段/0002/v1/01.md'),false);
fs.mkdirSync(dest,{recursive:false});const sources=[];
for(const ref of [...Object.keys(t.source_hashes),'.writer/drafts/final-a-context-2.json','.writer/drafts/final-a-record-2-before.json']){const b=fs.readFileSync(W+'/'+ref),h=sha(b);if(t.source_hashes[ref])assert.equal(h,t.source_hashes[ref]);const target=path.join(dest,'sources',ref);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,b,{flag:'wx'});sources.push({ref,sha256:h,bytes:b.length,copy:target});}
fs.writeFileSync(dest+'/manifest.json',JSON.stringify({ok:true,revision:4,created_at:new Date().toISOString(),sources,context_read:'all lines 1-442; previous current full chapter read 1-281'},null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({ok:true,revision:4,sources:sources.length,template_sha256:sha(fs.readFileSync(W+'/.writer/drafts/final-a-record-2-before.json'))}));
