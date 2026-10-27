import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const x=path.dirname(fileURLToPath(import.meta.url));
const sha=v=>crypto.createHash('sha256').update(v).digest('hex');
const j=f=>JSON.parse(fs.readFileSync(path.join(x,'cli-logs',f),'utf8'));
const pairs=[['a-context-25','a-context-25-v2'],['b-context28','b-context28-v2'],['brc-entry-discussion','brc-entry-discussion-v2']];
const proofs=[];
for(const [bad,good] of pairs){
  const rejected=j(bad+'/result.json'),retry=j(good+'/result.json');
  assert.equal(rejected.exit_code,2);assert.equal(retry.exit_code,0);
  const before=fs.readFileSync(path.join(x,'cli-logs',bad,'before-state.json'));
  const after=fs.readFileSync(path.join(x,'cli-logs',bad,'after-state.json'));
  assert.deepEqual(before,after);assert.equal(sha(before),rejected.before_state_sha256);
  assert.equal(sha(after),rejected.after_state_sha256);
  assert.equal(retry.before_state_sha256,retry.after_state_sha256);
  const error=j(bad+'/stderr.raw.txt'),args=j(good+'/argv.raw.json').argv;
  assert.equal(error.code,'COMMAND_FAILED');assert.equal(args[1],'context');
  if(bad==='brc-entry-discussion'){
    assert.equal(args[args.indexOf('--purpose')+1],'discussion');
    assert.match(error.error,/未知命令/);
  }else{
    assert(args[args.indexOf('--out')+1].startsWith('.writer/drafts/'));
  }
  proofs.push({failed_label:bad,actual_exit_code:2,error:error.error,state_sha256:sha(before),state_bytes_unchanged:true,retry_label:good,retry_exit_code:0,retry_state_unchanged:true,retry_argv:args});
}
const result={ok:true,at:new Date().toISOString(),scope:'actual known input-error rejection and corrected retries; state immutability only, not an OS-wide filesystem audit',cases:proofs};
fs.writeFileSync(path.join(x,'input-recovery-verification.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:true,cases:proofs.length,all_rejected2_then_corrected0:true,state_unchanged:true}));
