import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const b='acceptance/20261016-hundred',target=`${b}/candidate-v4`,read=p=>JSON.parse(fs.readFileSync(p,'utf8')),hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),source=read(`${b}/source-baseline-v3.json`),draft=read(`${b}/documentation-next-manifest-v3.json`);
assert(!fs.existsSync(target));for(const row of source.files)assert.equal(hash(row.file),row.sha256,row.file);for(const row of draft.files)assert.equal(hash(path.join(b,'documentation-next',row.file)),row.after_sha256,row.file);
fs.mkdirSync(target);for(const row of source.files){const out=path.join(target,row.file);fs.mkdirSync(path.dirname(out),{recursive:true});fs.copyFileSync(row.file,out);}
for(const row of draft.files)fs.copyFileSync(path.join(b,'documentation-next',row.file),path.join(target,row.file));
const manifest={at:new Date().toISOString(),scope:'Isolated seven-file v4 source candidate; main and active writing runtime remain v3; no manuscript touched',target,files:source.files.map(row=>({file:row.file,before_sha256:row.sha256,sha256:hash(path.join(target,row.file))})),changed_files:draft.files.map(x=>x.file)};
for(const row of manifest.files)assert.equal(row.sha256,draft.files.find(x=>x.file===row.file)?.after_sha256??row.before_sha256);
fs.writeFileSync(`${b}/candidate-v4-source.json`,JSON.stringify(manifest,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({ok:true,candidate:target,source_files:manifest.files.length,changed_files:manifest.changed_files,main_applied:false}));
