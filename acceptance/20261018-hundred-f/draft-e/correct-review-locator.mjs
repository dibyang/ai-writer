import fs from 'node:fs';import {session,sha} from '../session-support.mjs';
const s=session('draft-e'),old='审查/F-E-98-103最终连读.md',report='审查/F-E-98-103最终连读-日期勘误.md';
const text=fs.readFileSync(s.project+'/'+old,'utf8').replace('仅何95日次看/100章当次听','仅何在第95章（第59日）看过、第100章（第62日）当次听过');
fs.writeFileSync(s.project+'/'+report,text+'\n本版仅纠正上版把章号95误写成95日的报告定位，不改正文，不新增阅读覆盖。原报告及review保留。\n',{flag:'wx'});
const source_hashes={};for(const u of s.state().units.filter(x=>x.unit>=98&&x.unit<=103))source_hashes[u.draft]=sha(fs.readFileSync(s.project+'/'+u.draft));
const r=s.run('review-date-locator-corrected',['review'],{entry:'embedded',input:{expected_revision:s.state().revision,operation_id:'f-e-current-98-103-review-locator-erratum-v1',from:98,to:103,kind:'model-self-review',report,source_hashes}});s.write('current-review-corrected-result.json',r.value);console.log(r.value);
for(const [label,args] of [['end-check',['check']],['end-status',['status']],['end-discussion',['context','--purpose','discussion']]]){const r=s.run(label,args,{entry:'embedded'});console.log({label:r.label,ok:r.value.ok,revision:r.value.revision,next_unit:r.value.next_unit,stage:r.value.governance?.stage});}
