import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const x=path.dirname(fileURLToPath(import.meta.url)),p=path.join(x,'scenario/东岸末班船-再扩展验证');
const j=f=>JSON.parse(fs.readFileSync(path.join(x,f),'utf8')),sha=v=>crypto.createHash('sha256').update(v).digest('hex');
assert.equal(j('commands/codex-e-network-recovery/result.json').exit_code,0);
assert.equal(j('commands/codex-e-resume/result.json').signal,'SIGTERM');
assert.equal(j('e-network-recovery-verification.json').ok,true);
assert.equal(j('e-first-verification.json').ok,true);assert.equal(j('parent-guard-occupied-verification.json').ok,true);
assert.equal(j('resume-start-e.json').ok,true);
for(const phase of ['before','after'])assert.deepEqual(fs.readFileSync(path.join(x,`cli-logs/er-candidate-entry-status/${phase}-state.json`)),fs.readFileSync(path.join(x,'parent-e-first-stop-candidate-state.json')));
assert.equal(j('read-proof-er-window-current.json').ok,true);
const h=j('cli-logs/e-begin/stdout.raw.txt'),old=j('pre-revision36-state.json');
for(const label of ['er-resume','er-prepare','er-commit'])assert.equal(j(`cli-logs/${label}/result.json`).exit_code,0);
const before=j('cli-logs/er-commit/before-state.json'),after=j('cli-logs/er-commit/after-state.json');
assert.deepEqual(before.units,old.units);assert.deepEqual(before.snapshot,old.snapshot);assert.equal(before.revision,h.base_revision);
assert.equal(after.units.length,36);assert.equal(after.revision,h.base_revision+1);assert.deepEqual(after.units.slice(0,12),old.units.slice(0,12));
const raw=fs.readFileSync(path.join(p,'.writer/state.json')),s=JSON.parse(raw);
assert.deepEqual(s.units,after.units);assert.deepEqual(s.snapshot,after.snapshot);assert.equal(s.governance.stage,'paused');assert.deepEqual(s.governance.authorization.allowed_actions,['discuss']);assert.equal(s.governance.authorization.draft_range,null);assert.equal(s.governance.authorization.revise_range,null);
const replays=[];
for(let n=13;n<=36;n++){
 const pref=n<=18?'e':'er',label=`${pref}-record${n}`,rp=j(`cli-logs/${pref}-replay${n}/result.json`),pv=j(`cli-logs/${pref}-preview${n}/result.json`),r=j(`cli-logs/${label}/result.json`);
 assert.equal(rp.exit_code,0);assert.equal(pv.exit_code,0);assert.equal(r.exit_code,0);assert.deepEqual(pv.inputs,r.inputs);assert.equal(pv.before_state_sha256,pv.after_state_sha256);assert.equal(pv.after_state_sha256,r.before_state_sha256);
 const b=j(`cli-logs/${label}/before-state.json`),a=j(`cli-logs/${label}/after-state.json`);assert.equal(b.units.length,n-1);assert.equal(a.units.length,n);assert.deepEqual(a.units.slice(0,n-1),b.units);
 const u=a.units[n-1],final=s.units[n-1];assert.deepEqual(u,final);
 const review=u.replay_review;assert(review);assert.deepEqual([...review.checked_fields].sort(),['summary','characters','timeline','ledger','evidence','downstream'].sort());assert.equal(review.base.session_id,h.id);assert.equal(review.base.old_unit_sha256,old.units[n-1].sha256);assert.equal(review.base.old_journal_sha256,old.units[n-1].journal_sha256);
 const body=fs.readFileSync(path.join(p,u.draft));assert.equal(sha(body),u.sha256);assert.equal(review.draft_sha256,u.sha256);
 for(const check of [u.draft_review,review]){const report=fs.readFileSync(path.join(p,check.report));assert.equal(sha(report),check.report_sha256);assert.deepEqual(fs.readFileSync(path.join(p,check.frozen_ref)),report);}
 replays.push({unit:n,label,input_sha256:r.inputs[0].sha256,current_sha256:u.sha256,old_journal_sha256:review.base.old_journal_sha256,changed_body:u.sha256!==old.units[n-1].sha256});
}
for(const [id,o] of Object.entries(old.snapshot.ledger).filter(([,v])=>v.type==='observation'))for(const k of ['type','statement','author_truth'])assert.deepEqual(s.snapshot.ledger[id]?.[k],o[k]);
for(const [id,v] of Object.entries(old.source_versions)){assert.deepEqual(s.source_versions[id],v);assert.equal(sha(fs.readFileSync(path.join(p,v.object_ref))),v.sha256);}
assert.deepEqual(s.source_ranges,old.source_ranges);
const binding=s.units[32].source_bindings['大纲/单元/0033.json'];assert.equal(binding.version_id,'CR33_RECALL_ID_V2');assert.equal(binding.sha256,old.source_versions.CR33_RECALL_ID_V2.sha256);
assert.equal(sha(fs.readFileSync(path.join(p,'大纲/单元/0033.json'))),old.source_versions.CR33_INITIAL.sha256);
const book=s.snapshot.ledger.T_X_BOOK_COMPANY;assert.equal(book.status,'resolved');assert.match(book.character_known.许蓉,/36/);assert.match(book.character_known.沈成林,/36/);assert.equal(s.snapshot.ledger.T_X_TEA_AFTER_WORK.status,'resolved');assert.equal(s.snapshot.ledger.T_X_COAT_DAILY.status,'partial');
// The untouched generated replay draft is retained separately from the final edited input.
const replayArg=j('cli-logs/er-replay36/argv.raw.json').argv,outAt=replayArg.indexOf('--out');assert(outAt>=0);
const generatedRef=replayArg[outAt+1],generatedPath=path.isAbsolute(generatedRef)?generatedRef:path.join(h.workspace,generatedRef);
const generated=JSON.parse(fs.readFileSync(generatedPath,'utf8'));
for(const name of ['许蓉','沈成林'])assert.equal(generated.changes.ledger.T_X_BOOK_COMPANY.character_known[name],old.snapshot.ledger.T_X_BOOK_COMPANY.character_known[name]);
assert.equal(s.units[35].replay_review.base.old_journal_sha256,old.units[35].journal_sha256);
assert.equal(sha(fs.readFileSync(path.join(p,old.units[35].journal))),old.units[35].journal_sha256);
const changed=replays.filter(v=>v.changed_body).map(v=>v.unit);assert(changed.some(n=>n<=24));assert(changed.some(n=>n>=25));
for(const n of [13,17,21,22,30])assert(changed.includes(n));
const v={ok:true,at:new Date().toISOString(),scope:'actual E full13-36 replay and committed revision; mechanical checks complement model reading',id:h.id,workspace:h.workspace,base_revision:h.base_revision,commit_revision:after.revision,final_revision:s.revision,final_state_sha256:sha(raw),protected_complete_prefix:12,original_observations_immutable:true,replayed_units:replays,changed_body_units:changed,source_versions_preserved:Object.keys(old.source_versions),source33_active_binding:binding,source33_canonical_historical_preserved:true,latest_D36_journal_preserved:true,generated_replay36:{file:generatedPath,sha256:sha(fs.readFileSync(generatedPath)),note:'raw generated content retained; model E report must also verify both parents knowledge semantics'},current_book_character_known:book.character_known,read_proof:'read-proof-er-window-current.json',formal_release_acceptance:false};
assert(fs.existsSync(path.join(x,'交接-E完成.md')));fs.writeFileSync(path.join(x,'e-complete-verification.json'),JSON.stringify(v,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:true,replayed:24,changed_body_units:changed,revision:s.revision,source33:binding.version_id,latest_D36_journal_preserved:true}));
