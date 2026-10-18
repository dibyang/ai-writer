import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {BASE,write,sha} from './cli-support.mjs';
const head='257c08ad6c6a74feb7f60df7ce7075393a812c66',refs=['LICENSE.md','examples/prompts.md','examples/history-fact-card.json','vendor/oh-story-reference/LICENSE','vendor/oh-story-reference-20261015/LICENSE','vendor/oh-story-deslop-reference/LICENSE','vendor/oh-story-deslop-reference/how-to-remove-ai-flavor-from-web-fiction.md'],files=[];
for(const ref of refs){const old=spawnSync('git',['show',head+':'+ref],{windowsHide:true,maxBuffer:4*1024*1024});assert.equal(old.status,0);const bytes=fs.readFileSync(ref);assert.deepEqual(bytes,old.stdout);write(path.join(BASE,'sources/common-resources',ref),bytes);files.push({file:ref,bytes:bytes.length,sha256:sha(bytes),baseline_sha256:sha(old.stdout)});}
write(path.join(BASE,'sources/common-resources/source-manifest.json'),{scope:'Supplement the seven unchanged package resources omitted by early source snapshot helper. Every byte equals baseline Git object and current source; early live CLI build file lists also bind these hashes. Old snapshots are not modified.',source_commit:head,files});console.log(JSON.stringify({ok:true,files:files.length,unchanged_from_baseline:true}));
