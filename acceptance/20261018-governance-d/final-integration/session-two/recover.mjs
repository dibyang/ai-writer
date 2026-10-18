import fs from 'node:fs';
import {read,hash,sha,save,dir,work,base,run,snapshot,input} from './ops.mjs';
const one=base+'/final-integration/session-one', h=read(one+'/handoff.json');
const txfile=work+'/.writer/transactions/'+h.prepared_transaction.id+'/transaction.json',t=read(txfile);
const lockfile=work+'/.writer/write.lock',lock=read(lockfile);
let alive=true,probe_error=null;try{process.kill(lock.pid,0);}catch(e){if(e.code==='ESRCH')alive=false;probe_error={code:e.code,message:e.message};}
const rows=t.plan.map(x=>({...x,current:hash(work+'/'+x.file),old_backup:x.old_ref?hash(work+'/'+x.old_ref):null,new_backup:hash(work+'/'+x.new_ref)}));
const protected_rows=Object.entries(t.protection.files).map(([ref,expected])=>({ref,expected,current:hash(work+'/'+ref)}));
const checks={transaction_sha_matches:hash(txfile)===h.prepared_transaction.sha256,lock_sha_matches:hash(lockfile)===h.prepared_transaction.lock.sha256,all_targets_old:rows.every(x=>x.current===x.before),all_backups_valid:rows.every(x=>x.old_backup===x.before&&x.new_backup===x.after),protection_matches:protected_rows.every(x=>x.current===x.expected),plan_hash_valid:sha(JSON.stringify(t.plan))===t.plan_sha256,process_dead:!alive,original_exit97:read(base+'/commands/native-d-one-21-update-prepared/result.json').exit_code===97,fault_environment_empty:!process.env.AI_WRITER_TEST_FAULT&&!process.env.AI_WRITER_TEST_TOOL_STOP_PHASE,author_source_valid:hash(work+'/'+h.author_evidence.local_source)===h.author_evidence.source_sha256};
save(dir+'/recovery-preflight.json',{observed_at:new Date().toISOString(),transaction:txfile,lock,lock_sha256:hash(lockfile),probe:'signal zero only; no termination',alive,probe_error,checks,rows,protected_rows});
console.log(JSON.stringify(checks));if(Object.values(checks).some(x=>!x))throw Error('Stop preflight');
const updates=run('01-updates',['tool','updates'],{entry:'bin/ai-writer.mjs'});console.log(JSON.stringify(updates));
const recovery=input('recover-complete',read(one+'/recovery-complete-input.suggested.json'));
console.log(JSON.stringify(run('02-recover-complete',['tool','recover','--input',recovery],{entry:'bin/ai-writer.mjs'})));
snapshot('after-original-recovery');
console.log(JSON.stringify(run('03-recover-idempotent',['tool','recover','--input',recovery],{entry:'bin/ai-writer.mjs'})));
