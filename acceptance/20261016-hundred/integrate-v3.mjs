import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const base='acceptance/20261016-hundred',mode=process.argv[2],book=`${base}/works/潮汐信号`,dir=`${base}/integration-v3`;
assert(['apply','activate'].includes(mode),'apply or activate');
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const source=read(`${base}/candidate-v3-source.json`),origin=read(`${base}/candidate-v3-origin.json`),candidate=origin.target;
assert.deepEqual(source.changed.map(x=>x.file).sort(),['lib/longform.mjs','tests/longform.test.mjs']);
const completed=read(`${base}/session-11/process-result.json`),audit=read(`${base}/audits/session-11.json`);
assert.equal(completed.exit_code,0);assert(audit.ok&&audit.units===90);
assert.equal(read(`${base}/sequence-audits/session-11.result.json`).exit_code,0,'Wait until the independent audit process is fully closed');
const statePath=`${book}/.writer/state.json`,state=read(statePath);assert.equal(state.units.length,90);
assert.equal(hash(statePath),hash(`${base}/checkpoints/session-11/files/.writer/state.json`));
for(const x of source.files)assert.equal(hash(path.join(candidate,x.file)),x.sha256,`Candidate changed: ${x.file}`);
if(mode==='apply'){
 assert(!fs.existsSync(dir),'Preserve existing integration');
 for(const x of origin.files)assert.equal(hash(x.file),x.sha256,`Main changed since candidate origin: ${x.file}`);
 const embedded=`${book}/.writer/tool/lib/longform.mjs`;
 assert.equal(hash(embedded),source.changed.find(x=>x.file==='lib/longform.mjs').before_sha256);
 fs.mkdirSync(dir,{recursive:true});
 const backups=[];
 for(const p of [...source.changed.map(x=>x.file),embedded]){
  const dest=`${dir}/before/${p}`;fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(p,dest);
  backups.push({file:p,backup:dest,sha256:hash(p)});
 }
 write(`${dir}/before.json`,{at:new Date().toISOString(),units:90,revision:state.revision,state_sha256:hash(statePath),backups});
 for(const x of source.changed)fs.copyFileSync(path.join(candidate,x.file),x.file);
 fs.copyFileSync('lib/longform.mjs',embedded);
 assert.equal(hash(statePath),read(`${dir}/before.json`).state_sha256);
 write(`${dir}/applied.json`,{at:new Date().toISOString(),state_unchanged:true,files:source.changed,embedded_sha256:hash(embedded)});
 console.log(JSON.stringify({applied:true,units:90,revision:state.revision,state_unchanged:true,files:source.changed.map(x=>x.file)}));
}else{
 const before=read(`${dir}/before.json`);assert.equal(hash(statePath),before.state_sha256);
 for(const x of source.files)assert.equal(hash(x.file),x.sha256,`Main differs from validated candidate: ${x.file}`);
 assert.equal(hash(`${book}/.writer/tool/lib/longform.mjs`),hash('lib/longform.mjs'));
 const commandDir=`${base}/parent-commands`,test=read(`${commandDir}/integrated-v3-test/result.json`),doctor=read(`${commandDir}/integrated-v3-doctor/result.json`);
 assert.equal(test.exit_code,0);assert.equal(doctor.exit_code,0);
 const testOutput=fs.readFileSync(`${commandDir}/integrated-v3-test/stdout.raw.txt`,'utf8');
 const summary=(key,count)=>new RegExp('(?:^|\\n)[#ℹ] '+key+' '+count+'(?:\\r?\\n|$)').test(testOutput);
 assert(summary('tests',60)&&summary('pass',60)&&summary('fail',0)&&summary('skipped',0),'Need all 60 real main-version tests');
 write(`${base}/source-baseline-v3.json`,{commit:origin.commit,created_at:new Date().toISOString(),candidate:'v3 exact ledger ID recall plus v2 recovery guidance',scope:'246 complete candidate-origin source and fixture files; historical v2 manifest covered 72 selected files',files:source.files});
 const old=read(`${base}/active-candidate.json`);write(`${dir}/prior-active-candidate.json`,old);
 fs.writeFileSync(`${base}/active-candidate.json`,JSON.stringify({manifest:`${base}/source-baseline-v3.json`,candidate:'v3',activated_at:new Date().toISOString()},null,2)+'\n');
 write(`${dir}/activated.json`,{at:new Date().toISOString(),source_files:source.files.length,state_sha256:hash(statePath),revision:state.revision,main_tests:60,doctor_exit:0});
 console.log(JSON.stringify({activated:true,source_files:source.files.length,state_unchanged:true}));
}
