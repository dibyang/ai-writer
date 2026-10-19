import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const base=import.meta.dirname,entry=path.join(base,'seal-evidence.mjs'),receipt=path.resolve(base,'../20261019-release-080-l-seal-verification.json');
const r=spawnSync(process.execPath,[entry,'verify'],{encoding:'utf8',windowsHide:true,timeout:60000,maxBuffer:2**20});assert.equal(r.status,0,r.stderr);
const result=JSON.parse(r.stdout.trim());assert.equal(result.ok,true);
fs.writeFileSync(receipt,JSON.stringify({ok:true,at:new Date().toISOString(),scope:'Read-only sealed-tree verification; receipt outside sealed directory',result},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:true,receipt,...result}));
