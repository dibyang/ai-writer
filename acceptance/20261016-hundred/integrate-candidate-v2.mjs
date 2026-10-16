import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {createRunner} from './command-runner.mjs';
const base='acceptance/20261016-hundred', work=`${base}/works/潮汐信号`, out=`${base}/integration-v2`;
const sha=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const baseline=JSON.parse(fs.readFileSync(`${base}/source-baseline.json`));
for(const row of baseline.files)assert.equal(sha(row.file),row.sha256,row.file);
fs.mkdirSync(out,{recursive:false});
const state=sha(`${work}/.writer/state.json`), changes=[];
for(const file of ['lib/workspace.mjs','lib/help.mjs','tests/recovery-guidance.test.mjs']){
 const source=`${base}/candidate-v2/${file}`, old=fs.existsSync(file)?sha(file):null;
 if(old){const backup=path.join(out,'before',file);fs.mkdirSync(path.dirname(backup),{recursive:true});fs.copyFileSync(file,backup);}
 fs.copyFileSync(source,file);changes.push({file,before:old,after:sha(file)});
 if(file.startsWith('lib/')){const target=`${work}/.writer/tool/${file}`,backup=path.join(out,'embedded-before',file);fs.mkdirSync(path.dirname(backup),{recursive:true});fs.copyFileSync(target,backup);fs.copyFileSync(source,target);assert.equal(sha(target),sha(file));}
}
assert.equal(sha(`${work}/.writer/state.json`),state);
const files=[...baseline.files.map(row=>row.file),'tests/recovery-guidance.test.mjs'].sort().map(file=>({file,sha256:sha(file)}));
fs.writeFileSync(`${base}/source-baseline-v2.json`,JSON.stringify({commit:baseline.commit,created_at:new Date().toISOString(),candidate:'v2 mixed drift recovery guidance',files},null,2)+'\n',{flag:'wx'});
fs.writeFileSync(`${base}/active-candidate.json`,JSON.stringify({manifest:'source-baseline-v2.json'},null,2)+'\n',{flag:'wx'});
fs.copyFileSync(`${base}/sequence.mjs`,`${out}/sequence-before.mjs`);
let sequence=fs.readFileSync(`${base}/sequence.mjs`,'utf8');
sequence=sequence.replace("const a=spawnSync(process.execPath,[`${base}/audit.mjs`,phase,String(count)],", "const manifest=JSON.parse(fs.readFileSync(`${base}/active-candidate.json`)).manifest;\n const auditArgs=[`${base}/audit.mjs`,phase,String(count),manifest];\n const a=spawnSync(process.execPath,auditArgs,");
sequence=sequence.replace("argv:[`${base}/audit.mjs`,phase,String(count)]",'argv:auditArgs');
assert(sequence.includes('const auditArgs='));fs.writeFileSync(`${base}/sequence.mjs`,sequence);
fs.writeFileSync(`${out}/integration.json`,JSON.stringify({created_at:new Date().toISOString(),state_sha256_before_and_after:state,changes,files:files.length,sequence_after_sha256:sha(`${base}/sequence.mjs`)},null,2)+'\n',{flag:'wx'});
const runner=createRunner(out),results=[];
for(const [label,command]of[['canonical-test','npm test'],['canonical-doctor','npm run doctor']]){const r=runner.run('cmd.exe',['/d','/s','/c',command],label);results.push({label,exit_code:r.exit_code,files:r.files});console.log(JSON.stringify(results.at(-1)));}
fs.writeFileSync(`${out}/validation.json`,JSON.stringify({results,ok:results.every(r=>r.exit_code===0)},null,2)+'\n',{flag:'wx'});
assert(results.every(r=>r.exit_code===0));
