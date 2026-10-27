import fs from 'node:fs';
const a='acceptance/20261026-long-flow-090-ae/';
let s=fs.readFileSync(a+'b-resume-complete-audit.mjs','utf8');
const old="assert.equal(cut.ready,true);assert.equal(cut.ok,true);";
if(!s.includes(old))throw Error('audit source changed');
s=s.replace(old,"assert.equal(cut.ok,true);assert.equal(cut.pages,6);assert.equal(cut.no_new_part_file_at_capture,true);");
s=s.replace("actual_failures:[{scope:","actual_failures:[{scope:'auxiliary audit v1',exit_code:1,error:'AssertionError at line30: verification receipt has no ready field; actual undefined vs expected true',effect:'Read-only assertions stopped before output. Original script preserved; v2 checks the actual persisted ok/pages/no_new_part_file_at_capture fields, without altering or rerunning the original probe.'},{scope:");
fs.writeFileSync(a+'b-resume-complete-audit-v2.mjs',s,{flag:'wx'});
console.log('Prepared audit v2; failed original helper preserved; no product files or probe material changed.');
