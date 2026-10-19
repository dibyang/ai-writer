// Anonymous downloads verify the published user-facing assets, without credentials.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),api='https://api.github.com/repos/dibyang/ai-writer';
const expected=JSON.parse(fs.readFileSync(path.join(base,'final-verification.json')));
const read=async url=>{const r=await fetch(url,{signal:AbortSignal.timeout(45000)});assert.equal(r.status,200,url);return r.json();};
const release=await read(api+'/releases/tags/v0.8.0');assert.equal(release.draft,false);assert.equal(release.prerelease,false);assert.equal(release.tag_name,'v0.8.0');
const ref=await read(api+'/git/ref/tags/v0.8.0'),tag=await read(api+'/git/tags/'+ref.object.sha);assert.equal(tag.object.sha,expected.commit);assert.equal(tag.object.type,'commit');
const dir=path.join(base,'public-downloads');fs.mkdirSync(dir);const rows=[];
for(const name of ['ai-writer-0.8.0.zip','SHA256SUMS.txt','release-manifest.json','RELEASE_NOTES.md']){
  const asset=release.assets.find(x=>x.name===name);assert.ok(asset,name);assert.equal(asset.state,'uploaded');
  const response=await fetch(asset.browser_download_url,{signal:AbortSignal.timeout(45000)});assert.equal(response.status,200,name);
  const bytes=Buffer.from(await response.arrayBuffer()),local=fs.readFileSync(path.join(base,'delivery-v2',name)),sha256=crypto.createHash('sha256').update(bytes).digest('hex');
  assert.deepEqual(bytes,local,name);assert.equal(asset.digest,'sha256:'+sha256);fs.writeFileSync(path.join(dir,name),bytes,{flag:'wx'});rows.push({name,bytes:bytes.length,sha256,url:asset.browser_download_url});
}
fs.writeFileSync(path.join(base,'public-download-verification.json'),JSON.stringify({ok:true,at:new Date().toISOString(),anonymous:true,release_id:release.id,url:release.html_url,published_at:release.published_at,tag_object:ref.object.sha,tag_commit:tag.object.sha,assets:rows},null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({ok:true,url:release.html_url,assets:rows}));
