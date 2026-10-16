import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const b='acceptance/20261016-hundred',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),manifest=read(`${b}/candidate-v4-source.json`);
for(const row of manifest.files){assert.equal(hash(row.file),row.before_sha256,'Main changed: '+row.file);assert.equal(hash(path.join(manifest.target,row.file)),row.sha256,'Candidate changed: '+row.file);}
const test=read(`${b}/parent-commands/candidate-v4-test/result.json`),doctor=read(`${b}/parent-commands/candidate-v4-doctor/result.json`);assert.equal(test.exit_code,0);assert.equal(doctor.exit_code,0);
const output=fs.readFileSync(`${b}/parent-commands/candidate-v4-test/stdout.raw.txt`,'utf8'),count=key=>Number(output.match(new RegExp('(?:ℹ|#)\\s+'+key+'\\s+(\\d+)'))?.[1]);assert.equal(count('tests'),60);assert.equal(count('pass'),60);assert.equal(count('fail'),0);assert.equal(count('skipped'),0);
const rawDoctor=fs.readFileSync(`${b}/parent-commands/candidate-v4-doctor/stdout.raw.txt`,'utf8'),detail=JSON.parse(rawDoctor.slice(rawDoctor.indexOf('{')));assert(detail.ok);assert.deepEqual(detail.errors,[]);assert.deepEqual(detail.warnings,[]);
const result={at:new Date().toISOString(),ok:true,scope:'Isolated regression only; main v3 unchanged; instruction effectiveness and final delivery require actual native workflow',source_files:manifest.files.length,changed_files:manifest.changed_files,tests:60,pass:60,fail:0,skip:0,doctor:detail,source_manifest_sha256:hash(`${b}/candidate-v4-source.json`),native_validation_pending:true,applied_to_main:false};fs.writeFileSync(`${b}/candidate-v4-verification.json`,JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({ok:true,tests:60,pass:60,fail:0,skip:0,source_files:manifest.files.length,main_unchanged:true,applied:false}));
