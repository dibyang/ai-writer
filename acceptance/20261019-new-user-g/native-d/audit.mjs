import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)),root=path.dirname(here),source=path.dirname(path.dirname(root));
const read=f=>JSON.parse(fs.readFileSync(f)),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const h=read(path.join(root,'native-c/handoff.json')),initial=read(path.join(here,'initial.json')),final=read(path.join(here,'final.json'));
const state=read(path.join(h.project_path,'.writer/state.json')),base=read(path.join(h.project_path,'.writer/revisions',h.revision_id,'base.json'));
const command=(label,file='stdout.raw.txt')=>read(path.join(root,'commands',label,file));
const g4=read(path.join(root,'source-build-g4.json')),installed=command('d-040-after-identify');
const oldFiles=Object.entries(base.files).map(([ref,expected])=>({ref,expected,actual:fs.existsSync(path.join(h.project_path,ref))?sha(fs.readFileSync(path.join(h.project_path,ref))):null}));
const oldChanges=oldFiles.filter(r=>r.expected!==r.actual);
const old2=fs.readFileSync(path.join(h.project_path,'.writer/objects',h.manuscripts[1].original_sha256+'.review-body'));
const new2=fs.readFileSync(path.join(h.project_path,h.manuscripts[1].draft));
const exact2=Buffer.from(old2.toString('utf8').replace('你是不是问他欠多少修理费了？','你问过他修理费要多少吗？')).equals(new2);
const sourceRows=g4.files.map(r=>{const file=r.group==='skills'?path.join(source,'.agents/skills',r.file):path.join(source,r.file);return {...r,actual:sha(fs.readFileSync(file))};});
const readings=read(path.join(here,'readings.json')),tail=readings.filter(r=>r.phase==='final-tail-1-6');
const exportDir=command('d-047-export-six').output,manifest=read(path.join(exportDir,'manifest.json')),manuscript=fs.readFileSync(path.join(exportDir,'manuscript.md'));
let cursor=0;const exportRows=state.units.map(u=>{const b=fs.readFileSync(path.join(h.project_path,u.draft)),text=b.toString('utf8').trim(),position=manuscript.toString('utf8').indexOf(text,cursor);cursor=position<0?cursor:position+text.length;return {unit:u.unit,sha256:sha(b),manifest_matches:manifest.units.find(v=>v.unit===u.unit)?.sha256===sha(b),full_text_present_in_order:position>=0};});
const issues=command('d-051-final-issue'),issue=issues.issues[0];
const denied=['d-044-deny-context-7','d-045-deny-record-template-7'].map(label=>({label,...command(label,'stderr.raw.txt'),capture:command(label,'result.json')}));
const commitRetry=command('d-022-commit-retry','result.json'),updateRetry=command('d-035-tool-update-retry','result.json');
const updateTransaction=read(path.join(h.project_path,'.writer/transactions',command('d-034-tool-update').transaction_id,'transaction.json'));
const manifestChange=oldChanges.find(r=>r.ref==='.writer/tool/build-manifest.json'),manifestPlan=updateTransaction.plan.find(r=>r.file==='.writer/tool/build-manifest.json');
const guards={
  original_base_revision_18:base.revision===18,
  base_manifest_unchanged:initial.base_manifest_sha256===final.base_manifest_sha256,
  main_state_preserved_until_commit:initial.main_state_sha256===read(path.join(here,'registered.json')).main_state_sha256,
  initial_main_and_branch_match_handoff:initial.main_state_sha256===h.state_hashes.main_final_state_sha256&&initial.branch_state_sha256===h.state_hashes.branch_final_state_sha256,
  only_expected_old_paths_changed:oldChanges.length===3&&oldChanges.every(r=>['.writer/state.json','.writer/tool/build-manifest.json',h.manuscripts[1].draft].includes(r.ref)),
  tool_manifest_changed_by_completed_update:!!manifestChange&&updateTransaction.status==='completed'&&manifestPlan.before===manifestChange.expected&&manifestPlan.after===manifestChange.actual,
  original_journals_preserved:oldFiles.filter(r=>r.ref.startsWith('.writer/journal/')).every(r=>r.expected===r.actual),
  ch2_exactly_one_expression:exact2,
  other_bodies_unchanged:final.texts.every((t,i)=>i===1||t.main_sha256===initial.texts[i].main_sha256),
  chapter1_record_preserved:JSON.stringify(state.units[0])===JSON.stringify(initial.main_units[0]),
  final_reading_versions_current:tail.length===6&&tail.every((r,i)=>r.sha256===state.units[i].sha256&&sha(fs.readFileSync(path.join(here,r.version)))===r.sha256),
  final_reading_after_all_records:tail.every(r=>r.shown_at>command('d-016-record-6','result.json').started_at),
  commit_retry_unchanged_state:commitRetry.before_state_sha256===commitRetry.after_state_sha256&&command('d-022-commit-retry').unchanged===true,
  update_retry_unchanged_state:updateRetry.before_state_sha256===updateRetry.after_state_sha256&&command('d-035-tool-update-retry').unchanged===true,
  update_preserved_units_and_snapshot:read(path.join(here,'update-comparison.json')).units_equal&&read(path.join(here,'update-comparison.json')).snapshot_equal,
  update_preserved_root_resources:read(path.join(here,'update-comparison.json')).retained_changes.length===0,
  installed_exact_g4:installed.observed_content_id===g4.observed_content_id&&JSON.stringify(installed.files)===JSON.stringify(g4.files),
  external_source_61_resources_unchanged:sourceRows.every(r=>r.sha256===r.actual),
  runtime_guard_stable:command('d-001-status','result.json').build_before.runtime_guard_id===command('d-049-final-status','result.json').build_before.runtime_guard_id,
  no_schema_migration:state.schema_version===6&&state.tool_control.enable_id===null,
  active_sessions_none:command('d-049-final-status').revisions.sessions.every(s=>['committed','aborted','conflicted'].includes(s.status)),
  all_transactions_complete:command('d-049-final-status').revisions.transactions.every(s=>s.status==='completed'),
  issue_verified_with_no_invented_author_choice:issue.effective_status==='verified'&&issue.resolution.decision_actor==='agent-within-authorized-scope'&&issue.resolution.author_choice===null,
  final_review_current:command('d-048-final-check').rolling_review.valid===1&&command('d-048-final-check').rolling_review.pending_windows.length===0,
  paused_discussion_only:state.governance.stage==='paused'&&JSON.stringify(state.governance.authorization.allowed_actions)===JSON.stringify(['discuss','plan']),
  chapter7_denied_without_state_changes:denied.every(r=>r.code==='ACTION_OUT_OF_SCOPE'&&r.capture.exit_code===2&&r.capture.before_state_sha256===r.capture.after_state_sha256),
  only_six_manuscripts:fs.readdirSync(path.join(h.project_path,'正文')).filter(f=>f.endsWith('.md')).length===6,
  export_manifest_six_current:JSON.stringify(manifest.included_units)==='[1,2,3,4,5,6]'&&exportRows.every(r=>r.manifest_matches&&r.full_text_present_in_order),
  export_hash_matches:sha(manuscript)===manifest.sha256,
  export_is_draft:manifest.status==='draft-export'&&manifest.quality_review==='required',
  export_no_exclusions_or_warnings:manifest.excluded_drafts.length===0&&manifest.warnings.length===0,
  export_outside_project_inside_g:!path.relative(h.project_path,exportDir).startsWith('.')?false:!path.relative(root,exportDir).startsWith('..')
};
const result={at:new Date().toISOString(),nature:'local-evidence-cross-check-not-literary-or-human-acceptance',ok:Object.values(guards).every(Boolean),guards,old_file_count:oldFiles.length,old_changes:oldChanges,original_journals:oldFiles.filter(r=>r.ref.startsWith('.writer/journal/')),final_readings:tail,export:{path:exportDir,manifest_sha256:sha(fs.readFileSync(path.join(exportDir,'manifest.json'))),manuscript_sha256:sha(manuscript),rows:exportRows,status:manifest.status,included_units:manifest.included_units,excluded_drafts:manifest.excluded_drafts,warnings:manifest.warnings},tool:{before_content_id:command('d-033-before-identify').observed_content_id,final_content_id:installed.observed_content_id,runtime_id:installed.runtime_id,guard_id:command('d-049-final-status','result.json').build_before.runtime_guard_id,version:installed.tool_version,generation:state.tool_control.generation},issue:{id:issue.id,status:issue.status,effective_status:issue.effective_status,decision_actor:issue.resolution.decision_actor,author_choice:issue.resolution.author_choice,application:issue.application,verification:issue.verification}};
fs.writeFileSync(path.join(here,process.argv[2]??'verification-final.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:result.ok,guards,old_changes:oldChanges.map(r=>r.ref),export:result.export.path,final_revision:state.revision},null,2));
if(!result.ok)process.exitCode=1;
