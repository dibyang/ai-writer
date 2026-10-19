import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),entry=path.join(base,'seal-evidence.mjs'),receipt=path.resolve(base,'../20261019-hundred-h-seal-verification.json');
assert.equal(path.dirname(receipt),path.dirname(base));const r=spawnSync(process.execPath,[entry,'verify'],{encoding:'utf8',windowsHide:true,timeout:300000,maxBuffer:16*1024*1024});assert.equal(r.status,0,r.stderr);const result=JSON.parse(r.stdout.trim().split(/\r?\n/).at(-1));assert.equal(result.ok,true);fs.writeFileSync(receipt,JSON.stringify({ok:true,at:new Date().toISOString(),scope:'Read-only sealed-tree verification; receipt outside sealed directory',result,command:{entry,args:['verify'],exit_code:r.status,stdout:r.stdout,stderr:r.stderr}},null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({ok:true,receipt,...result}));
