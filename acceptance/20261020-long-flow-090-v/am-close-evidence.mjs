import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const v='D:/work/other/ai-writer/acceptance/20261020-long-flow-090-v';
const w=v+'/scenario/东岸末班船-扩展验证';
const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const hash=f=>sha(fs.readFileSync(f));
const mode=process.argv[2];
const audit=read(v+'/am-final-verification.json');
if(!audit.integrity_ok||hash(w+'/.writer/state.json')!==audit.state_sha256)throw Error('Final state changed');
function walk(base,rel=''){
 return fs.readdirSync(path.join(base,rel),{withFileTypes:true}).flatMap(e=>{
  if(e.isSymbolicLink())throw Error('Unexpected symlink');
  const ref=rel?rel+'/'+e.name:e.name;
  return e.isDirectory()?walk(base,ref):[ref];
 }).sort();
}
function entry(base,ref){return {ref,bytes:fs.statSync(path.join(base,ref)).size,sha256:hash(path.join(base,ref))};}
if(mode==='index'){
 const state=read(w+'/.writer/state.json');
 const old=read(v+'/am-main-before.json');
 const retained=read(v+'/ar-final-verification.json').retained_proof;
 const retainedProof=[];
 for(const x of retained){const actual=hash(w+'/'+x.ref);if(actual!==x.expected)throw Error('A-first retained bytes changed '+x.ref);retainedProof.push({...x,actual});}
 const oldHistory=[];
 for(const u of old.units){
  if(u.journal){const actual=hash(w+'/'+u.journal);if(actual!==u.journal_sha256)throw Error('Old journal changed');oldHistory.push(entry(w,u.journal));}
  if(u.draft_review){for(const ref of [u.draft_review.report,u.draft_review.frozen_ref]){if(hash(w+'/'+ref)!==u.draft_review.report_sha256)throw Error('Old report changed');oldHistory.push(entry(w,ref));}}
 }
 const refs=new Set(['.writer/state.json','研究/V-A-追踪修正授权原文.md','.writer/drafts/v-am-workflow-start.json','.writer/drafts/v-am-issue-adopt.json','.writer/drafts/v-am-begin.json','.writer/drafts/v-am-issue-apply.json','.writer/drafts/v-am-workflow-stop.json']);
 for(const x of retained)refs.add(x.ref);
 for(const x of oldHistory)refs.add(x.ref);
 for(const u of state.units){
  refs.add(u.draft);
  for(const ref of Object.keys(u.source_hashes))refs.add(ref);
  if(u.unit>=4){refs.add(u.journal);for(const r of [u.draft_review,u.replay_review]){refs.add(r.report);refs.add(r.frozen_ref);}}
 }
 const session=read(v+'/cli-logs/am13-begin/stdout.raw.txt');
 const sessionRel='.writer/revisions/'+session.id;
 for(const name of ['session.json','base.json','base-state.json','prepared.json'])refs.add(sessionRel+'/'+name);
 for(const ref of walk(session.workspace,'.writer/drafts').filter(r=>path.basename(r).startsWith('v-am-')))refs.add(sessionRel+'/workspace/'+ref);
 const prepared=read(w+'/'+sessionRel+'/prepared.json');
 for(const x of prepared.changes)refs.add(x.file);
 const review=read(w+'/'+audit.tail_review.ref);
 refs.add(audit.tail_review.ref);refs.add(review.frozen_report);
 for(const u of review.units)refs.add(u.frozen_ref);
 const labels=fs.readdirSync(v+'/cli-logs',{withFileTypes:true}).filter(e=>e.isDirectory()&&/^am\d/.test(e.name)&&fs.existsSync(v+'/cli-logs/'+e.name+'/result.json')).map(e=>e.name).sort();
 const logs=labels.map(label=>({label,result:read(v+'/cli-logs/'+label+'/result.json'),files:walk(v+'/cli-logs/'+label).map(ref=>entry(v+'/cli-logs/'+label,ref))}));
 const evidence=fs.readdirSync(v,{withFileTypes:true}).filter(e=>e.isFile()&&e.name.startsWith('am-')&&!['am-evidence-index.json','am-return-receipt.json'].includes(e.name)).map(e=>e.name);
 evidence.push('交接-A追踪修正完成.md','交接-A完成.md','parent-a-resume-state.json','parent-a-resume-verification.json','product-frozen-start.json','baseline-worktree.json');
 const index={at:new Date().toISOString(),phase:'A-metadata-only-revision-4-6',revision:audit.revision,state_sha256:audit.state_sha256,tracking_commit_completed:true,issue_closed:false,blocker:audit.blocker,session_id:session.id,commit_id:prepared.commit.id,transaction:audit.transaction,retainedProof,oldHistory,project_files:[...refs].sort().map(ref=>entry(w,ref)),evidence_files:evidence.sort().map(ref=>entry(v,ref)),closed_logs:logs,note:'am54索引进程自身日志尚未闭合，am55返回收据另绑定其实际结果；am55自身退出码与前后state见其独立日志，避免自引用。历史A记录缺口未追认为已补齐。'};
 fs.writeFileSync(v+'/am-evidence-index.json',JSON.stringify(index,null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify({revision:audit.revision,state_sha256:audit.state_sha256,project_files:index.project_files.length,evidence_files:index.evidence_files.length,closed_logs:logs.length,retained_old_history_files:oldHistory.length,retained_first_stop:retainedProof.length,index_sha256:hash(v+'/am-evidence-index.json')}));
}else if(mode==='receipt'){
 const index=read(v+'/am-evidence-index.json');
 let count=0;
 for(const [base,entries]of [[w,index.project_files],[v,index.evidence_files]])for(const x of entries){if(hash(path.join(base,x.ref))!==x.sha256)throw Error('Indexed file drift '+x.ref);count++;}
 for(const log of index.closed_logs)for(const x of log.files){if(hash(path.join(v,'cli-logs',log.label,x.ref))!==x.sha256)throw Error('Log drift '+log.label);count++;}
 const terminal=read(v+'/cli-logs/am54-evidence-index/result.json');
 if(terminal.exit_code!==0||terminal.after_state_sha256!==index.state_sha256)throw Error('Index process not successful');
 const receipt={at:new Date().toISOString(),revision:audit.revision,state_sha256:audit.state_sha256,handoff_sha256:hash(v+'/交接-A追踪修正完成.md'),index_sha256:hash(v+'/am-evidence-index.json'),audit_sha256:hash(v+'/am-final-verification.json'),files_verified:count,tracking_commit_completed:true,session_id:index.session_id,commit_id:index.commit_id,transaction:index.transaction,issue_closed:false,issue_status:audit.issue.status,blocker:audit.blocker,nonzero_processes:index.closed_logs.filter(x=>x.result.exit_code!==0).map(x=>({label:x.label,exit_code:x.result.exit_code,before_state_sha256:x.result.before_state_sha256,after_state_sha256:x.result.after_state_sha256})),terminal_index_log_result_sha256:hash(v+'/cli-logs/am54-evidence-index/result.json'),stop:'paused discuss；两个范围null；B须根处理阻断并新提示；未写7',note:'真实失败和旧历史保留；不宣称意见已闭环。am55日志在退出后独立保存。'};
 fs.writeFileSync(v+'/am-return-receipt.json',JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify(receipt,null,2));
}else throw Error('Mode must be index or receipt');
