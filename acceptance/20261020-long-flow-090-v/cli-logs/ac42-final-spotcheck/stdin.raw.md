import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {isDeepStrictEqual as eq} from 'node:util';
const v='D:/work/other/ai-writer/acceptance/20261020-long-flow-090-v',w=path.join(v,'scenario','东岸末班船-扩展验证');
const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const hash=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const log=(label,file='stdout.raw.txt')=>read(path.join(v,'cli-logs',label,file));
const s=read(path.join(w,'.writer/state.json')),before=read(path.join(v,'ac-before-state.json'));
const baseline=read(path.join(v,'ac-content-baseline.json')),parent=read(path.join(v,'parent-a-resume-verification.json'));
const status=log('ac36-final-status'),workflow=log('ac40-final-workflow');
const issue=log('ac37-final-issue').issues.find(x=>x.id==='V_A_U5_TIME_METADATA');
const updates=log('ac38-final-updates'),revisions=log('ac39-final-revisions'),check=log('ac41-final-check');
const reviewResult=log('ac30-review-4-6'),review=read(path.join(w,reviewResult.ref));
const changes=m=>Object.entries(m).filter(([ref,sha])=>hash(path.join(w,ref))!==sha).map(([ref])=>ref);
const bodyChecks=parent.units.map(u=>({unit:u.unit,draft:u.draft,sha256:hash(path.join(w,u.draft)),matches_parent:hash(path.join(w,u.draft))===u.sha256}));
const history=issue.history_events.map(x=>x.issue.status);
const result={revision:s.revision,state_sha256:hash(path.join(w,'.writer/state.json')),schema_version:s.schema_version,generation:s.tool_control.generation,installed:s.tool_control.installed,
 stage:status.governance.stage,allowed_actions:status.governance.authorization.allowed_actions,draft_range:status.governance.authorization.draft_range,revise_range:status.governance.authorization.revise_range,
 registered_count:s.units.length,no_unit7:s.units.every(x=>x.unit<=6)&&!status.draft_inventory.unregistered.some(x=>x.possible_unit>=7),
 snapshot_equal_to_before_upgrade:eq(before.snapshot,s.snapshot),units_equal_to_before_upgrade:eq(before.units,s.units),planning_preserved:eq(before.governance.planning,s.governance.planning),decisions_preserved:eq(before.decisions,s.decisions),
 observation_immutable_equal:['type','statement','author_truth'].every(k=>before.snapshot.ledger.O_BOX_PAINT[k]===s.snapshot.ledger.O_BOX_PAINT[k]),
 body_checks:bodyChecks,consumed_content_sources_checked:Object.keys(baseline.sources).length,consumed_content_source_changes:changes(baseline.sources),root_preserved_files_checked:Object.keys(baseline.root_preserved_files).length,root_preserved_changes:changes(baseline.root_preserved_files),
 stale_units:status.stale_units,changed_sources:status.changed_sources,impact_pending:status.impact_pending,
 update_transaction:updates.transactions,staging:updates.staging,active_revisions:revisions.sessions.filter(x=>!['committed','aborted'].includes(x.status)),pending_transactions:revisions.transactions.filter(x=>x.status!=='completed'),
 issue:{id:issue.id,status:issue.status,effective_status:issue.effective_status,change_scope:issue.application.change_scope,commit_id:issue.application.commit_id,transaction_id:issue.application.transaction_id,history_statuses:history,verification:issue.verification},
 review:{ref:reviewResult.ref,from:review.from,to:review.to,report:review.report,report_sha256:review.report_sha256,report_matches:hash(path.join(w,review.report))===review.report_sha256,frozen_report_matches:hash(path.join(w,review.frozen_report))===review.report_sha256},
 mechanical_check:{ok:check.ok,findings:check.findings,rolling_review:check.rolling_review},
 evidence:'cli-logs/ac01..ac41；完整原输入/双流/实际码/前后state由v-log保留；完整封存及总索引由根统一完成'};
const requireTrue=[result.no_unit7,result.snapshot_equal_to_before_upgrade,result.units_equal_to_before_upgrade,result.planning_preserved,result.decisions_preserved,result.observation_immutable_equal,result.review.report_matches,result.review.frozen_report_matches,...bodyChecks.map(x=>x.matches_parent)];
if(s.revision!==34||s.schema_version!==6||s.tool_control.generation!==1||s.tool_control.installed.source_content_id!=='ab14a65fc7677e8c76c03cbe8f7ec7c49203ad070ed0163e265cf5047500e626'||s.units.length!==6||requireTrue.some(x=>x!==true))throw Error('Final invariants failed');
if(status.governance.stage!=='paused'||!eq(status.governance.authorization.allowed_actions,['discuss'])||result.draft_range!==null||result.revise_range!==null)throw Error('Final governance mismatch');
for(const key of ['consumed_content_source_changes','root_preserved_changes','stale_units','changed_sources','impact_pending','staging','active_revisions','pending_transactions'])if(result[key].length)throw Error('Unexpected pending/change '+key);
if(updates.transactions.some(x=>x.status!=='completed')||issue.effective_status!=='verified'||issue.application.change_scope!=='tracking'||issue.application.commit_id!=='3ec56fe0-3fbc-4bfe-9cb1-2253bdf0db68'||issue.verification.conclusion!=='resolved'||issue.verification.review_ref!==reviewResult.ref||!history.includes('open')||!history.includes('adopted')||!history.includes('applied'))throw Error('Issue closure not retained');
if(!check.ok||review.from!==4||review.to!==6||workflow.revision!==34)throw Error('Review/check mismatch');
result.ok=true;
fs.writeFileSync(path.join(v,'ac-final-check.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:true,revision:result.revision,state_sha256:result.state_sha256,generation:1,body_matches:bodyChecks.filter(x=>x.matches_parent).length,consumed_sources_unchanged:result.consumed_content_sources_checked,root_files_preserved:result.root_preserved_files_checked,issue_effective_status:issue.effective_status,stage:result.stage,report:result.review.report,check_warnings:check.findings.length,remaining_review_windows:check.rolling_review.pending_windows},null,2));
