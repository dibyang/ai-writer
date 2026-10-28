import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const results=[];
for(const name of ['20261027-hundred-0100-aj','20261027-governance-relocation-ak']){
  const dir=path.join(base,'..',name), seal=JSON.parse(fs.readFileSync(path.join(dir,'seal.json'))), bytes=fs.readFileSync(path.join(dir,'seal-files.json'));
  assert.equal(sha(bytes),seal.manifest_sha256);const rows=JSON.parse(bytes);assert.equal(rows.length,seal.files);let total=0;
  for(const row of rows){const b=fs.readFileSync(path.join(dir,row.file));assert.equal(b.length,row.bytes,row.file);assert.equal(sha(b),row.sha256,row.file);total+=b.length;}
  assert.equal(total,seal.bytes);results.push({name,files:rows.length,bytes:total,manifest_sha256:seal.manifest_sha256,ok:true});
}
fs.writeFileSync(path.join(base,'prior-seals-verification.json'),JSON.stringify({ok:true,results},null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(results));
