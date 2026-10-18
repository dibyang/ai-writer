import fs from 'node:fs';
import {root,work,dir,base,run,save,read,hash,sha,input,evidence,snapshot,state} from './ops.mjs';
const quote='允许D批副本先按第一会话的冻结事务完成恢复，再从D:/work/other/ai-writer这份本地主项目检查构建差异，显式更新到修复预览问题后的最终0.7候选。保留原恢复记录、两轮备份和根定制；不改正文、原units或事实，不把同版本当同构建。';
const ref='研究/D批最终构建更新授权.md';save(work+'/'+ref,'# D批最终构建更新授权\n\nsynthetic acceptance：用户指定的合成授权；不是现实作者身份认证；无消息ID。\n\n'+quote+'\n');
const initial=read(dir+'/initial-invariants.json'),recovered=read(dir+'/after-original-recovery-invariants.json');
const one=read(base+'/final-integration/session-one/handoff.json');
const checks={snapshot_same:initial.snapshot_sha256===recovered.snapshot_sha256,units_same:initial.units_sha256===recovered.units_sha256,bodies_same:JSON.stringify(initial.bodies)===JSON.stringify(recovered.bodies),customizations_match:one.customizations.every(x=>hash(work+'/'+x.ref)===x.final_sha256),schema6:state().schema_version===6,revision30:state().revision===30,generation1:state().tool_control.generation===1};
save(dir+'/original-recovery-invariants-check.json',checks);if(Object.values(checks).some(x=>!x))throw Error('invariant failed');
const plan=run('09-final-update-plan',['tool','update-plan','--source',root],{entry:'bin/ai-writer.mjs'});save(dir+'/final-plan-parsed.json',plan);
console.log(JSON.stringify({keys:Object.keys(plan),can_update:plan.can_update,blockers:plan.blockers,request:plan.request,source:plan.source?.observed_content_id,target:plan.target?.observed_content_id},null,2));
if(!plan.can_update)throw Error('Stop final plan blockers');
const request={...plan.request,author_evidence:evidence(ref,quote)};save(dir+'/final-request-original.json',plan.request);
const update=input('final-update',request);console.log(JSON.stringify(run('10-final-update',['tool','update','--input',update],{entry:'bin/ai-writer.mjs'})));
snapshot('after-final-update');
for(const [label,args] of [['11-final-help',['--help']],['12-final-doctor',['doctor']],['13-final-status',['status']],['14-final-discussion',['context','--purpose','discussion']],['15-final-check',['check']]]){const out=run(label,args);save(dir+'/'+label+'-parsed.json',out);}
