import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url));
const rows=[];
for(const [label,file] of [['zip','ai-writer-0.8.0.zip'],['checksums','SHA256SUMS.txt'],['manifest','release-manifest.json'],['notes','RELEASE_NOTES.md']]){
  const r=JSON.parse(fs.readFileSync(path.join(base,`upload-${label}.json`))),bytes=fs.readFileSync(path.join(base,'delivery-v2',file)),sha256=crypto.createHash('sha256').update(bytes).digest('hex');
  assert.equal(r.status,201);assert.equal(r.data.name,file);assert.equal(r.data.state,'uploaded');assert.equal(r.data.size,bytes.length);assert.equal(r.data.digest,'sha256:'+sha256);
  rows.push({file,id:r.data.id,bytes:bytes.length,sha256,github_digest:r.data.digest,url:r.data.browser_download_url});
}
fs.writeFileSync(path.join(base,'upload-verification.json'),JSON.stringify({ok:true,at:new Date().toISOString(),assets:rows},null,2)+'\n',{flag:'wx'});
fs.writeFileSync(path.join(base,'publish-request.json'),JSON.stringify({draft:false,prerelease:false,make_latest:'true'},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:true,assets:rows}));
