import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const x=path.dirname(fileURLToPath(import.meta.url)),p=path.join(x,'scenario/东岸末班船-再扩展验证');
const j=f=>JSON.parse(fs.readFileSync(path.join(x,'cli-logs',f),'utf8'));
const sha=v=>crypto.createHash('sha256').update(v).digest('hex'),cases=[];
for(const [bad,good] of [['cr-context33','cr-context33-v2'],['cr-template33','cr-template33-v2']]){
  const a=j(bad+'/result.json'),b=j(good+'/result.json'),error=j(bad+'/stderr.raw.txt');
  assert.equal(a.exit_code,2);assert.equal(b.exit_code,0);assert.match(error.error,/P_X_COAT/);
  const before=fs.readFileSync(path.join(x,'cli-logs',bad,'before-state.json')),after=fs.readFileSync(path.join(x,'cli-logs',bad,'after-state.json'));
  assert.deepEqual(before,after);assert.equal(sha(before),a.before_state_sha256);assert.equal(a.before_state_sha256,a.after_state_sha256);
  const state=JSON.parse(before);assert.equal(state.revision,143);assert.equal(state.units.length,32);
  const args=j(bad+'/argv.raw.json').argv,out=args[args.indexOf('--out')+1];
  assert(!fs.existsSync(path.join(p,out)),'Rejected output unexpectedly exists');
  cases.push({failed:bad,failed_exit_code:2,error:error.error,state_sha256:sha(before),revision:143,units:32,state_bytes_unchanged:true,rejected_output_absent:out,retry:good,retry_exit_code:0,failed_started_at:a.started_at,failed_elapsed_ms:a.elapsed_ms});
}
const context=j('cr-context33/result.json'),template=j('cr-template33/result.json');
assert(Date.parse(template.started_at)>=Date.parse(context.started_at)+context.elapsed_ms);
const publish=j('cr-publish33/result.json');assert.equal(publish.exit_code,0);
assert(Date.parse(j('cr-context33-v2/result.json').started_at)>=Date.parse(publish.started_at)+publish.elapsed_ms);
assert(Date.parse(j('cr-template33-v2/result.json').started_at)>=Date.parse(publish.started_at)+publish.elapsed_ms);
const result={ok:true,at:new Date().toISOString(),scope:'actual invalid-recall rejection, future-version repair and successful new inputs; not a preplanned negative scenario',cases,source_fix:'source33-publish-verification.json',operator_deviation:{observed:true,detail:'After the first context failure, a dependent template request was still attempted and rejected for the same cause; calls were serial, not overlapping. This unnecessary second request violated the intended stop-on-error workflow and is retained rather than relabeled as a planned test.',effect:'Both guards rejected without state mutation or failed output files; only corrected source version and successful new inputs were used for chapter33.'}};
fs.writeFileSync(path.join(x,'source33-recovery-verification.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:true,rejected2_then_retried0:cases.length,original_32_unchanged:true,unnecessary_dependent_request_disclosed:true}));
