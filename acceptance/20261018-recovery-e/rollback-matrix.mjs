import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {runner,BASE,write,readState,sha} from './cli-support.mjs';
import {writeBuildManifest,packageFiles,fileRef} from '../../lib/tool-build.mjs';
const r=runner(process.argv[2]),root=path.join(r.dest,'pending-work'),source=path.join(BASE,'sources/package'),tmp=path.resolve('.tmp/recovery-e-'+Date.now());
r.setup(root);const tool=path.join(root,'.writer/tool');assert.equal(path.dirname(fs.realpathSync(tool)),path.join(fs.realpathSync(root),'.writer'));fs.rmSync(tool,{recursive:true});
const previous=packageFiles(path.join(BASE,'../20261018-governance-d/sources/final-source-v2'));for(const row of previous.files)write(path.join(tool,fileRef(row)),fs.readFileSync(path.join(previous.tool_root,fileRef(row))));writeBuildManifest(tool);const old=readState(root);
const p=r.run(root,['tool','update-plan','--source',source]);assert.equal(p.can_update,true);r.run(root,['tool','update'],{...p.request,author_evidence:r.evidence(root)},97,{AI_WRITER_TEST_FAULT:'1',AI_WRITER_TEST_TOOL_STOP_PHASE:'prepared'});
const tx=r.run(root,['tool','updates']).transactions.find(x=>x.status==='prepared'),record=JSON.parse(fs.readFileSync(path.join(root,`.writer/transactions/${tx.id}/transaction.json`))),cases=[];
function request(work,direction){const lock=path.join(work,'.writer/write.lock');return {transaction_id:tx.id,direction,...(fs.existsSync(lock)?{lock_sha256:sha(fs.readFileSync(lock))}:{}),author_evidence:r.evidence(work)};}
// Stop after the final forward row, before terminal metadata. Every row is new.
r.run(root,['tool','recover'],request(root,'complete'),95,{AI_WRITER_TEST_FAULT:'1',AI_WRITER_TEST_TOOL_STOP_AFTER:String(record.plan.length)});
for(const row of record.plan)assert.equal(sha(fs.readFileSync(path.join(root,row.file))),row.after);
fs.mkdirSync(tmp,{recursive:true});
function copied(name){const work=path.join(tmp,name);fs.cpSync(root,work,{recursive:true});return work;}
async function remove(work){assert.equal(path.dirname(fs.realpathSync(work)),fs.realpathSync(tmp));await fs.promises.rm(work,{recursive:true,maxRetries:12,retryDelay:150});}
function verify(work,direction){for(const row of record.plan){const f=path.join(work,row.file),actual=fs.existsSync(f)?sha(fs.readFileSync(f)):null;assert.equal(actual,direction==='complete'?row.after:row.before,row.file);}const s=readState(work);assert.deepEqual(s.units,old.units);assert.deepEqual(s.snapshot,old.snapshot);assert.equal(r.run(work,['check']).ok,true);const before=sha(fs.readFileSync(path.join(work,'.writer/state.json')));assert.equal(r.run(work,['tool','recover'],request(work,direction)).unchanged,true);assert.equal(sha(fs.readFileSync(path.join(work,'.writer/state.json'))),before);return {state_sha256:before,generation:s.tool_control.generation,plan_files:record.plan.length};}
for(const direction of ['complete','rollback'])for(let n=1;n<=record.plan.length;n++){
 const work=copied(`${direction}-${n}`),start=Date.now();r.run(work,['tool','recover'],request(work,'rollback'),95,{AI_WRITER_TEST_FAULT:'1',AI_WRITER_TEST_TOOL_STOP_AFTER:String(n)});assert.equal(r.run(work,['status'],null,2).code,'TOOL_UPDATE_PENDING');r.run(work,['tool','recover'],request(work,direction));cases.push({initial_direction:'complete',first_recovery:'rollback',final_direction:direction,rollback_stop_after:n,...verify(work,direction),elapsed_ms:Date.now()-start});await remove(work);console.log(JSON.stringify({completed:cases.length,total:record.plan.length*2+2,last:{direction,n}}));
}
for(const phase of ['external-after-rollback','body-after-rollback']){
 const work=copied(phase);r.run(work,['tool','recover'],request(work,'rollback'),95,{AI_WRITER_TEST_FAULT:'1',AI_WRITER_TEST_TOOL_STOP_AFTER:'2'});const ref=phase.startsWith('external')?'.writer/tool/lib/journal.mjs':'正文/0001.md',bytes=Buffer.from('third-party bytes after interrupted rollback\n');write(path.join(work,ref),bytes);const before=sha(fs.readFileSync(path.join(work,'.writer/state.json'))),codes=[];
 for(const direction of ['complete','rollback']){const err=r.run(work,['tool','recover'],request(work,direction),2);codes.push(err.code);assert.equal(err.code,phase.startsWith('external')?'TRANSACTION_EXTERNAL_CONFLICT':'TOOL_BUSINESS_CHANGED');assert.deepEqual(fs.readFileSync(path.join(work,ref)),bytes);assert.equal(sha(fs.readFileSync(path.join(work,'.writer/state.json'))),before);}
 write(path.join(r.dest,phase+'.json'),JSON.parse(fs.readFileSync(path.join(work,`.writer/transactions/${tx.id}/transaction.json`))));cases.push({phase,codes,third_party_preserved:true,state_unchanged:true});await remove(work);console.log(JSON.stringify({completed:cases.length,total:record.plan.length*2+2,last:phase}));
}
assert.equal(fs.readdirSync(tmp).length,0);fs.rmdirSync(tmp);r.summary({cases,plan_files:record.plan.length,all_rollback_boundaries_both_final_directions:true,nature:'Fresh CLI process fault injection; no literary claims. Canonical fully-forward pending transaction retained. Disposable clones deleted only after exact verification; all raw commands, inputs and state snapshots retained.'});
