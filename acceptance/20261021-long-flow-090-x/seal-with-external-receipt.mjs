import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const x=path.dirname(fileURLToPath(import.meta.url));
const receipt=path.join(x,'../20261021-long-flow-090-x-seal-receipt.json');
assert(!fs.existsSync(receipt));
const run=mode=>{
  const r=spawnSync(process.execPath,[path.join(x,'seal-evidence.mjs'),mode],{encoding:'utf8',windowsHide:true,maxBuffer:1024*1024});
  assert.equal(r.status,0,r.stderr||r.stdout);return JSON.parse(r.stdout);
};
const sealed=run('seal'),verified=run('verify');
assert.equal(sealed.manifest_sha256,verified.manifest_sha256);
const sha=v=>crypto.createHash('sha256').update(v).digest('hex');
const out={ok:true,at:new Date().toISOString(),scope:'external receipt; no files inside X changed after sealing',sealed,verified,verification_sha256:sha(fs.readFileSync(path.join(x,'verification.json')))};
fs.writeFileSync(receipt,JSON.stringify(out,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({...out,receipt}));
