import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {spawnSync}from'node:child_process';import {fileURLToPath}from'node:url';
const x=path.dirname(fileURLToPath(import.meta.url)),p=path.join(x,'scenario/东岸末班船-再扩展验证'),raw=fs.readFileSync(path.join(p,'.writer/state.json'));
for(const [source,label]of[['f-final-status','parent-final-status'],['f-final-check','parent-final-check'],['f-final-revision-list','parent-final-revisions'],['f-final-issues','parent-final-issues'],['f-final-doctor','parent-final-doctor'],['f-final-tool-identify','parent-final-identify']]){
 const a=JSON.parse(fs.readFileSync(path.join(x,'cli-logs',source,'argv.raw.json'),'utf8'));assert(!a.argv.includes('--input'));
 const r=spawnSync(process.execPath,[path.join(x,'x-writer.mjs'),label,...a.argv.slice(1)],{windowsHide:true,encoding:'utf8',maxBuffer:4*1024*1024});assert.equal(r.status,0,r.stderr);assert.deepEqual(fs.readFileSync(path.join(p,'.writer/state.json')),raw);console.log(JSON.stringify({label,exit_code:0,state_bytes_unchanged:true}));
}
