import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const b='acceptance/20261016-hundred',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),origin=read(`${b}/documentation-origin.json`),manifest=read(`${b}/documentation-next-manifest.json`),backup=`${b}/documentation-first-draft`;
assert(!fs.existsSync(backup));for(const row of manifest.files){assert.equal(hash(row.file),row.before_sha256);assert.equal(hash(path.join(origin.target,row.file)),row.after_sha256);}
fs.mkdirSync(backup);for(const row of manifest.files){const out=path.join(backup,row.file);fs.mkdirSync(path.dirname(out),{recursive:true});fs.copyFileSync(path.join(origin.target,row.file),out);}
assert.equal(hash('README.md'),read(`${b}/source-baseline-v3.json`).files.find(x=>x.file==='README.md').sha256);
fs.copyFileSync('README.md',path.join(origin.target,'README.md'),fs.constants.COPYFILE_EXCL);
fs.writeFileSync(`${b}/documentation-origin-v2.json`,JSON.stringify({...origin,at:new Date().toISOString(),scope:'Unapplied six-file documentation/help draft; prior five staged bytes retained in documentation-first-draft; active main unchanged',files:[...origin.files,{file:'README.md',sha256:hash('README.md')}]},null,2)+'\n',{flag:'wx'});
const verifier=fs.readFileSync(`${b}/verify-documentation-draft.mjs`,'utf8').replace('documentation-origin.json','documentation-origin-v2.json').replace('documentation-next-manifest.json','documentation-next-manifest-v2.json');
fs.writeFileSync(`${b}/verify-documentation-draft-v2.mjs`,verifier,{flag:'wx'});
fs.copyFileSync(`${b}/integrate-documentation.mjs`,`${b}/integrate-documentation.before-six-file.mjs`,fs.constants.COPYFILE_EXCL);
console.log(JSON.stringify({prepared:true,staged_files:6,prior_draft_backed_up:5,applied:false}));
