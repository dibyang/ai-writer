import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import crypto from 'node:crypto';
const a=path.dirname(fileURLToPath(import.meta.url));
const read=n=>JSON.parse(fs.readFileSync(path.join(a,n),'utf8'));
const hash=n=>crypto.createHash('sha256').update(fs.readFileSync(path.join(a,n))).digest('hex');
const verification=read('reading-resume-final-read-complete-readback-verification.json');
if(!verification.ok||verification.revision!==396||verification.registered_units!==66||verification.verified_files!==29876||verification.frozen_source_and_report_objects_verified!==175||verification.checkpoint_sha256!==hash('checkpoint-final-read-complete.json'))throw Error('actual checkpoint/readback mismatch');
const receipt={
  saved_at:new Date().toISOString(),native_id:'01a176d2-2255-7e80-9c37-d825387a4fef',
  checkpoint_command:{command:'node acceptance/20261026-long-flow-090-ae/checkpoint-main-complete.mjs final-read-complete 66',exit_code:0,stdout:{ok:true,label:'final-read-complete',revision:396,registered_units:66,generation:9,files:29876},stderr:''},
  readback_command:{command:'node acceptance/20261026-long-flow-090-ae/check-main-reading-resume.mjs final-read-complete-readback checkpoint-final-read-complete.json',exit_code:0,stdout:verification,stderr:''},
  checkpoint:{ref:'checkpoint-final-read-complete.json',sha256:hash('checkpoint-final-read-complete.json')},
  checkpoint_state:{ref:'checkpoint-final-read-complete-state.json',sha256:hash('checkpoint-final-read-complete-state.json')},
  readback:{ref:'reading-resume-final-read-complete-readback-verification.json',sha256:hash('reading-resume-final-read-complete-readback-verification.json')},
  project_writes_after_checkpoint:0,actual_native_exit:'pending root observation',overall_acceptance_complete:false
};
fs.writeFileSync(path.join(a,'fr-checkpoint-receipt.json'),JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
const result=read('final-read-complete.json');
result.checkpoint={status:'actual checkpoint creation and actual readback passed',receipt_ref:'fr-checkpoint-receipt.json',receipt_sha256:hash('fr-checkpoint-receipt.json'),checkpoint:receipt.checkpoint,checkpoint_state:receipt.checkpoint_state,readback:receipt.readback,verified_files:verification.verified_files,frozen_source_and_report_objects_verified:verification.frozen_source_and_report_objects_verified,project_writes_after_checkpoint:0};
result.saved_at=new Date().toISOString();
fs.writeFileSync(path.join(a,'final-read-complete.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({ok:true,checkpoint_sha256:receipt.checkpoint.sha256,stage_sha256:hash('final-read-complete.json'),project_writes_after_checkpoint:0}));
