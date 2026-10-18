import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {runner,BASE,write,readState,sha} from './cli-support.mjs';
import {writeBuildManifest} from '../../lib/tool-build.mjs';
const r=runner(process.argv[2]),root=path.join(r.dest,'prepared-work'),tmp=path.resolve('.tmp/governance-d-faults-'+Date.now());
r.setup(root);
const tool=path.join(root,'.writer/tool');assert.equal(path.dirname(fs.realpathSync(tool)),path.join(fs.realpathSync(root),'.writer'));fs.rmSync(tool,{recursive:true});fs.cpSync(path.join(BASE,'fixtures/tool-0.6'),tool,{recursive:true});fs.unlinkSync(path.join(tool,'source-manifest.json'));const old=readState(root);old.schema_version=5;delete old.tool_control;write(path.join(root,'.writer/state.json'),old);writeBuildManifest(tool);
let p=r.run(root,['tool','update-plan','--source',process.cwd()]);assert.equal(p.can_update,false);
r.run(root,['tool','enable'],{expected_revision:old.revision,operation_id:'d-matrix-enable',source:process.cwd(),expected_source_build_id:p.source.content_id,expected_target_build_id:p.target.content_id,author_evidence:r.evidence(root)});
p=r.run(root,['tool','update-plan','--source',process.cwd()]);assert.equal(p.can_update,true);r.run(root,['tool','update'],{...p.request,author_evidence:r.evidence(root)},97,{AI_WRITER_TEST_FAULT:'1',AI_WRITER_TEST_TOOL_STOP_PHASE:'prepared'});
const tx=r.run(root,['tool','updates']).transactions.find(x=>x.status==='prepared'),record=JSON.parse(fs.readFileSync(path.join(root,`.writer/transactions/${tx.id}/transaction.json`))),cases=[];
fs.mkdirSync(tmp,{recursive:true});
async function remove(work){assert.equal(path.dirname(fs.realpathSync(work)),fs.realpathSync(tmp));await fs.promises.rm(work,{recursive:true,maxRetries:12,retryDelay:150});}
function copied(name){const work=path.join(tmp,name);fs.cpSync(root,work,{recursive:true});return work;}
function request(work,direction){const lock=path.join(work,'.writer/write.lock');return {transaction_id:tx.id,direction,...(fs.existsSync(lock)?{lock_sha256:sha(fs.readFileSync(lock))}:{}),author_evidence:r.evidence(work)};}
function verify(work,direction){for(const row of record.plan){const f=path.join(work,row.file),actual=fs.existsSync(f)?sha(fs.readFileSync(f)):null;assert.equal(actual,direction==='complete'?row.after:row.before,row.file);}const s=readState(work);assert.deepEqual(s.units,old.units);assert.deepEqual(s.snapshot,old.snapshot);assert.equal(r.run(work,['check']).ok,true);return {state_sha256:sha(fs.readFileSync(path.join(work,'.writer/state.json'))),generation:s.tool_control.generation,plan_files:record.plan.length};}
for(const direction of ['complete','rollback'])for(let n=1;n<=record.plan.length;n++){
 const work=copied(`${direction}-${n}`),start=Date.now();r.run(work,['tool','recover'],request(work,'complete'),95,{AI_WRITER_TEST_FAULT:'1',AI_WRITER_TEST_TOOL_STOP_AFTER:String(n)});assert.equal(r.run(work,['status'],null,2).code,'TOOL_UPDATE_PENDING');r.run(work,['tool','recover'],request(work,direction));cases.push({direction,stop_after:n,...verify(work,direction),elapsed_ms:Date.now()-start});await remove(work);console.log(JSON.stringify({running:true,completed:cases.length,total:record.plan.length*2,last:{direction,n}}));
}
for(const phase of ['validated','enospc','external-unchanged','validation-tamper','business-change']){
 const work=copied(phase);
 if(phase==='validated'){r.run(work,['tool','recover'],request(work,'complete'),96,{AI_WRITER_TEST_FAULT:'1',AI_WRITER_TEST_TOOL_STOP_PHASE:'validated'});r.run(work,['tool','recover'],request(work,'complete'));cases.push({phase,...verify(work,'complete')});}
 if(phase==='enospc'){const target=record.plan.find(x=>x.file.startsWith('.writer/tool/')&&x.file.endsWith('.mjs')).file;r.run(work,['tool','recover'],request(work,'complete'),2,{AI_WRITER_TEST_FAULT:'1',AI_WRITER_TEST_RENAME_TARGET:target,AI_WRITER_TEST_RENAME_ERROR:'ENOSPC'});r.run(work,['tool','recover'],request(work,'rollback'));cases.push({phase,target,...verify(work,'rollback')});}
 if(phase==='external-unchanged'){write(path.join(work,'.writer/tool/lib/journal.mjs'),'third-party untouched module');const error=r.run(work,['tool','recover'],request(work,'rollback'),2);assert.equal(error.code,'TRANSACTION_EXTERNAL_CONFLICT');assert.equal(fs.readFileSync(path.join(work,'.writer/tool/lib/journal.mjs'),'utf8'),'third-party untouched module');write(path.join(r.dest,'external-case.json'),JSON.parse(fs.readFileSync(path.join(work,`.writer/transactions/${tx.id}/transaction.json`))));cases.push({phase,code:error.code,third_party_preserved:true});}
 if(phase==='validation-tamper'){fs.appendFileSync(path.join(work,`.writer/tool-updates/${tx.id}/validation/writer.json`),' ');const error=r.run(work,['tool','recover'],request(work,'complete'),2);assert.equal(error.code,'TOOL_VALIDATION_FAILED');assert.equal(r.run(work,['status'],null,2).code,'TOOL_UPDATE_PENDING');cases.push({phase,code:error.code,pending_preserved:true});}
 if(phase==='business-change'){fs.appendFileSync(path.join(work,'正文/0001.md'),'third-party manuscript');const error=r.run(work,['tool','recover'],request(work,'complete'),2);assert.equal(error.code,'TOOL_BUSINESS_CHANGED');cases.push({phase,code:error.code,body_preserved:true});}
 await remove(work);
}
assert.equal(fs.readdirSync(tmp).length,0);fs.rmdirSync(tmp);r.summary({cases,plan_files:record.plan.length,all_file_boundaries_both_directions:true,nature:'Mechanical fresh-process fault injection, not model reading. Canonical prepared transaction, all inputs/stdout/stderr/state snapshots retained; disposable clones removed only after exact old/new verification.'});
