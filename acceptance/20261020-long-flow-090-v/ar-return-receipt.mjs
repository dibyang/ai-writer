import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
const v='D:/work/other/ai-writer/acceptance/20261020-long-flow-090-v',w=v+'/scenario/东岸末班船-扩展验证';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),hash=f=>sha(fs.readFileSync(f)),read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const index=read(v+'/ar-evidence-index.json'),state=read(w+'/.writer/state.json'),last=read(v+'/cli-logs/ar52-evidence-index-v2/result.json');
if(state.revision!==24||hash(w+'/.writer/state.json')!==index.state_sha256||last.exit_code!==0||last.before_state_sha256!==last.after_state_sha256)throw Error('Return state mismatch');
let checked=0;
for(const [base,entries] of [[w,index.project_files],[v,index.evidence_files]])for(const x of entries){if(hash(path.join(base,x.ref))!==x.sha256)throw Error('Indexed file changed '+x.ref);checked++;}
for(const item of index.closed_logs)for(const x of item.files){if(hash(path.join(v,'cli-logs',item.label,x.ref))!==x.sha256)throw Error('Log changed '+item.label+'/'+x.ref);checked++;}
const results=[...index.closed_logs.map(x=>x.result),last];
const nonzero=results.filter(x=>/^ar\d/.test(x.label)&&x.exit_code!==0).map(x=>({label:x.label,exit_code:x.exit_code,before_state_sha256:x.before_state_sha256,after_state_sha256:x.after_state_sha256}));
const receipt={at:new Date().toISOString(),status:'A-prose-4-6-complete-waiting-root-verification-with-unfixed-metadata-issue',revision:state.revision,state_sha256:index.state_sha256,handoff_sha256:hash(v+'/交接-A完成.md'),index_sha256:hash(v+'/ar-evidence-index.json'),audit_sha256:hash(v+'/ar-final-verification.json'),index_and_files_verified:true,files_verified:checked,terminal_index_log:{label:last.label,exit_code:last.exit_code,result_sha256:hash(v+'/cli-logs/ar52-evidence-index-v2/result.json')},resume_nonzero_processes:nonzero,known_unfixed_issue:index.known_unfixed_issue,evidence_limitations:index.limitations,registered_units:state.units.map(x=>({unit:x.unit,draft:x.draft,sha256:x.sha256})),next_requires_new_root_prompt:true,wrote_unit7:false,opened_new_revision_session:false,note:'ar53记录器将在此进程结束后保存实际退出码与前后state；不以本收据循环引用自身日志。'};
fs.writeFileSync(v+'/ar-return-receipt.json',JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(receipt,null,2));
