import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const b='acceptance/20261016-hundred',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),origin=read(`${b}/documentation-origin-v2.json`),prior=read(`${b}/documentation-next-manifest-v2.json`),backup=`${b}/documentation-second-draft`;
assert(!fs.existsSync(backup));for(const row of prior.files){assert.equal(hash(row.file),row.before_sha256);assert.equal(hash(path.join(origin.target,row.file)),row.after_sha256);}
fs.mkdirSync(backup);for(const row of prior.files){const out=path.join(backup,row.file);fs.mkdirSync(path.dirname(out),{recursive:true});fs.copyFileSync(path.join(origin.target,row.file),out);}
const file='lib/longform.mjs';assert.equal(hash(file),read(`${b}/source-baseline-v3.json`).files.find(x=>x.file===file).sha256);fs.copyFileSync(file,path.join(origin.target,file),fs.constants.COPYFILE_EXCL);
fs.writeFileSync(`${b}/documentation-origin-v3.json`,JSON.stringify({...origin,at:new Date().toISOString(),scope:'Unapplied context guidance and six help/manual files; prior six draft bytes retained, active main unchanged',files:[...origin.files,{file,sha256:hash(file)}]},null,2)+'\n',{flag:'wx'});
fs.copyFileSync(`${b}/integrate-documentation.mjs`,`${b}/integrate-documentation.before-context-guidance.mjs`,fs.constants.COPYFILE_EXCL);
console.log(JSON.stringify({prepared:true,files:7,applied:false,prior_draft_preserved:true}));
