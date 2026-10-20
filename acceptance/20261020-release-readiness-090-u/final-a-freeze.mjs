import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const U='D:/work/other/ai-writer/acceptance/20261020-release-readiness-090-u',W=U+'/scenario-final/东岸末班船';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const out=U+'/final-a-before',mode=process.argv[2];
if(mode==='before'){
 assert.equal(fs.existsSync(W+'/分段/0001/v1/01.md'),false);assert.equal(fs.existsSync(W+'/分段/0001/v1/02.md'),false);
 const template=JSON.parse(fs.readFileSync(W+'/.writer/drafts/final-record-1-before.json','utf8'));
 const context=JSON.parse(fs.readFileSync(W+'/.writer/drafts/final-context-1.json','utf8'));
 assert.equal(template.expected_revision,3);assert.deepEqual(template.source_hashes,context.source_hashes);
 fs.mkdirSync(out,{recursive:false});const sources=[];
 const extra=['研究/最终测试原始prompt.md','研究/试验选择说明.md','大纲/分卷/V2.json','大纲/单元/0002.json','大纲/单元/0003.json','.writer/drafts/final-context-1.json','.writer/drafts/final-record-1-before.json'];
 for(const ref of [...Object.keys(template.source_hashes),...extra]){const raw=fs.readFileSync(path.join(W,ref)),hash=sha(raw);if(template.source_hashes[ref])assert.equal(hash,template.source_hashes[ref]);const copy=path.join(out,'sources',ref);fs.mkdirSync(path.dirname(copy),{recursive:true});fs.writeFileSync(copy,raw,{flag:'wx'});sources.push({ref,sha256:hash,bytes:raw.length,copy});}
 const manifest={ok:true,created_at:new Date().toISOString(),W,revision:3,state_sha256:template.source_hashes['.writer/state.json'],sources,actual_reading:'context: all lines 1-258 read; no previous prose exists; package quickstart/user-guide/writer-project/writer-novel/chapter-delivery/workflow read in full. Sources authored in this run, not imported from initial scenario.'};
 fs.writeFileSync(out+'/manifest.json',JSON.stringify(manifest,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(manifest,null,2));
}else if(mode==='check'){
 const manifest=JSON.parse(fs.readFileSync(out+'/manifest.json','utf8'));
 const changed=manifest.sources.filter(s=>sha(fs.readFileSync(path.join(W,s.ref)))!==s.sha256).map(s=>s.ref);
 assert.deepEqual(changed,[]);assert.equal(JSON.parse(fs.readFileSync(W+'/.writer/state.json','utf8')).revision,3);
 console.log(JSON.stringify({ok:true,revision:3,state_sha256:sha(fs.readFileSync(W+'/.writer/state.json')),checked_sources:manifest.sources.length,changed_sources:changed}));
}else throw Error('before|check required');
