import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const a=path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=n=>JSON.parse(fs.readFileSync(path.join(a,n),'utf8'));
const file=n=>({ref:n,sha256:hash(fs.readFileSync(path.join(a,n)))});
const save=(n,o)=>fs.writeFileSync(path.join(a,n),JSON.stringify(o,null,2)+'\n',{flag:'wx'});
const manifest=read('fr-reading-manifest.json');
const six=read('fr-exit-six-state.json');
save('fr-inspection-failures.json',{
  at:new Date().toISOString(),native_id:manifest.native_id,
  current_run_body_page_failures:[],current_run_truncated_body_batches:[],official_six_product_failures:[],
  inspection_events:[
    {kind:'metadata_output_truncated',count:3,details:['Unbounded governance/decision metadata print (~94826 tokens).','Final six-state metadata print (~54691 tokens).','Final artifact schema probe printed first full doctor row (4040 tokens, max3000).'],handling:'Truncated metadata was not treated as read evidence. Complete artifacts are preserved; bounded field checks and relevant source reads were used. No prose page was in these batches.',exact_event_timestamps:null},
    {kind:'powershell_inline_parser_error',count:1,exit_code:1,detail:"Missing type name after '[' from inline quote regexp.",handling:'Replaced by standalone fr-quote-audit.mjs; final 125 literal quotes present, no literary pass inferred.',exact_event_timestamps:null},
    {kind:'wrong_guessed_path',count:1,detail:'FastCtx grep for guessed unit38 filename returned path nonexistent.',handling:'Read real registered path 正文/0038-带进灯下-ac-a-v1.md and relevant metadata.',exact_event_timestamps:null},
    {kind:'read_offset_past_eof',count:1,detail:'Read offset350 exceeded 151-line semantic note.',handling:'Actually read available lines130–151.',exact_event_timestamps:null},
    {kind:'apply_patch_context_mismatch',count:2,detail:'Embedded sentence and paragraph anchors did not match complete lines; no file writes occurred on failed attempts.',handling:'Corrected exact sentence using FastCtx replace; created separate language/impact note. Final notes and all baseline files independently hashed.',exact_event_timestamps:null}
  ],
  previous_native_capacity_failure:{run:'final-first',root_observed_exit_code:1,root_observed_elapsed_ms:1467764,error:'Selected model is at capacity',original_result_and_checkpoint_unchanged:true},
  this_native_exit:'pending root observation; no invented result'
});
const result={
  saved_at:new Date().toISOString(),activated_at:'2026-10-26T07:08:08.622Z',native_id:manifest.native_id,
  stage:'final-read-resume',stage_status:'current manuscript reading and impact analysis complete; awaiting separately activated formal revision',
  project:'scenario/东岸末班船-66章独立验证',unit_count:66,revision:396,generation:9,
  state_sha256:manifest.state_sha256,content_id:manifest.content_id,runtime_id:'fe8f9636393d1dbbc49689f495cf6aad46a939b5eec11ac993af35ff369b8efe',
  reading:{current_run_range:[37,66],current_run_complete_units:30,current_run_complete_pages:281,all_same_native_complete_range:[1,66],all_same_native_complete_units:66,all_same_native_unique_pages:462,page_size_utf16:1800,max_pages_per_same_chapter_batch:2,body_reading_completed_at:'2026-10-26T08:05:45Z',segments:manifest.segments,repeated_current_run_pages:manifest.repeated_current_run.length,unread_units:[],truncated_body_batches:[],original_unit25_partial_pages:manifest.original_unit25_partial_pages,old_first_stop_evidence_not_replaced:true,not_claiming_current_run_reread_of_1_36:true},
  units:manifest.units.map(({unit,draft,path,sha256,chars,pages,segment,complete})=>({unit,draft,path,sha256,chars,pages,segment,complete})),
  semantic_notes:manifest.notes,
  artifacts:['fr-reading-manifest.json','fr-preservation-verification.json','fr-effective-source-impact.json','fr-findings-and-impact.md','fr-exit-six-state.json','fr-inspection-failures.json','交接-全书读完待修订.md'].map(file),
  findings:[
    {id:'ROOT-03-SPEAKER',unit:3,status:'confirmed; not repaired',basis:'Unit2 Xu reminds He; unit3 incorrectly remembers He as reminder speaker. Unit2 stays unchanged.'},
    {id:'ROOT-60-TIME',unit:60,status:'confirmed; not repaired',basis:'Private first recording afternoon entry conflicts with multiple morning references; effective frozen plan specifies Saturday morning. Short sent speech and shared original song are distinct.'},
    {id:'F48_SHIFT_TIME',unit:48,status:'new high-confidence continuity issue; root decision required before added prose scope',basis:'Morning/09:50/noon work conflicts with regular16–18:30 shift and real18:30 handover. Current effective sources contain no added early shift.'},
    {id:'L55_TEACHER_PRONOUN',unit:55,status:'new high-confidence local typo candidate; root decision required',basis:'给他看 refers to established female teacher (unit18她, unit57她).'},
    {id:'L42_HEAR_COLOUR',unit:42,status:'medium local clarity candidate; not mandatory hard correction',basis:'只听得见熟没熟 omits report object; surrounding tasting context supports intended meaning, but guessability does not establish naturalness.'}
  ],
  language_review:{literal_quote_audit:{checked:125,missing:0,meaning:'literal existence only; not literary quality pass'},whole_book_style_risk:'Repeated withholding/help boundaries, negative explanatory summaries and object/light/rest closures remain optional structural/style risk despite different event benefits.',normal_metaphor_and_ellipsis_preserved:true,hidden_language_sample_expectations_not_read:true},
  revision_impact:{effective_source_audit:'fr-effective-source-impact.json',author_lock_review_complete:true,immutable_observation_preserved:'O_BOX_PAINT',static_dependency_closure_3:[3,66],closure_3_units:64,closure_60:[60,66],closure_60_units:7,legal_smaller_record_range_found:false,expected_next_formal_workflow_range:[3,66],currently_expected_prose_changes:[3,60],new_48_55_need_root_decision:true,no_begin_rewind_or_prose_change_this_run:true},
  final_six:six.rows.map(r=>({kind:r.kind,label:r.label,exit_code:r.result.exit_code,before_state_sha256:r.result.before_state_sha256,after_state_sha256:r.result.after_state_sha256,product_equal_to_first_stop:r.product_equal_to_first_stop,log_ref:'cli-logs/'+r.label})),
  preservation:read('fr-preservation-verification.json'),
  checkpoint:{status:'pending actual command and readback',planned_command:'node acceptance/20261026-long-flow-090-ae/checkpoint-main-complete.mjs final-read-complete 66',planned_readback_command:'node acceptance/20261026-long-flow-090-ae/check-main-reading-resume.mjs final-read-complete-readback checkpoint-final-read-complete.json',receipt_ref:'fr-checkpoint-receipt.json'},
  not_performed:['begin','rewind','prose revision','final all66 product review registration','old9 verify/apply/resolve/acknowledge','67 scope negative','export','root final audit/archive'],
  remaining:['Root observes actual exit and validates full checkpoint/read proofs/new findings.','Root activates formal revision after decisions on new48/55 findings; preserve original author locks and required source/version workflows.','Formal replay/record3–66 as required, complete tail reading/review/prepare/commit.','Final current all66 review, nine current verifies, valid67 range negative, real draft export/byte verification, root build/tests/command/archive audit.'],
  overall_acceptance_complete:false,final_review_registered:false,actual_native_exit:'pending root observation'
};
save('final-read-complete.json',result);
console.log(JSON.stringify({saved:true,units:result.units.length,complete_pages:result.reading.all_same_native_unique_pages,checkpoint:result.checkpoint.status}));
