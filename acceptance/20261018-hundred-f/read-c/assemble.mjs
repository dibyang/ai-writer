import fs from 'node:fs';
import path from 'node:path';
import {session,sha,BASE,ROOT,readJSON} from '../session-support.mjs';
const s=session('read-c');
const groups=['46-50','51-55','56-60','61-65','66-70','71-75'];
const notes=groups.flatMap(g=>readJSON(path.join(s.stage,'notes-'+g+'.json')));
const corrections=[{unit:66,issue:'草记将章名混列为事件引句，且残留一句尚未执行的编辑指示；章名虽真实存在，不当作场景引文。',action:'readings.json移除该章名引句，并改为实际文学判断。原notes保留。'},{unit:72,issue:'草记judgment含写作记录口吻，不是文学证据。',action:'readings.json仅留其袋位复述偏好判断，不改quotes与原稿。'}];
notes.find(n=>n.unit===66).quotes=notes.find(n=>n.unit===66).quotes.filter(q=>q!=='这把椅子先给人坐');
notes.find(n=>n.unit===66).judgment='3行同两块与48/54重复同一轻微语言用字摩擦，候选F-C-L66-01。门口椅先后坐人与双筐转弯有真实动作，未来维护未因此解决。';
notes.find(n=>n.unit===72).judgment='何获滑页两夹知识的增量明确；27/73行袋位复述可选缩减，不能合并60与72的告知。';
s.write('note-corrections.json',corrections);
const rawEvents=fs.readFileSync(path.join(s.stage,'events.jsonl'));
s.write('reading-events.snapshot.jsonl',rawEvents);
const events=rawEvents.toString('utf8').trim().split('\n').map(JSON.parse);
const reads=events.filter(e=>e.type==='item.completed'&&e.item?.type==='mcp_tool_call'&&e.item.server==='fastctx'&&e.item.tool==='read'&&e.item.arguments?.file_path?.replaceAll('\\','/').includes('/work/正文/'));
for(const n of notes){
 const matching=reads.filter(e=>e.item.arguments.file_path.replaceAll('\\','/').endsWith('/'+n.path));
 n.tool_evidence=matching.map(e=>{const item=e.item,raw=item.result.content.filter(c=>c.type==='text').map(c=>c.text).join('\n');const ref='read-raw/'+String(n.unit).padStart(4,'0')+'-'+item.id+'.fastctx.txt';s.write(ref,raw);return {event_id:item.id,arguments:item.arguments,raw:ref,raw_sha256:sha(Buffer.from(raw)),complete_marker_observed_by_model:true,shown_from:1,shown_to:n.shown_end};});
 n.coverage=n.tool_observation.coverage;
}
const totals={chapters:notes.length,boundary_reread:5,new_coverage:25,displayed_lines_as_observed:notes.reduce((a,n)=>a+n.shown_end,0),han_characters_including_titles:notes.reduce((a,n)=>a+(fs.readFileSync(path.join(s.project,n.path),'utf8').match(/\p{Script=Han}/gu)||[]).length,0),exact_line_audit:'pending-main-task-reading-audit.mjs; not executed here',nature:'text exposure metadata and model judgments are separate; no script literary pass'};
s.write('readings.json',{phase:'read-c',work:s.project,from:46,to:75,order:notes.map(n=>n.unit),totals,readings:notes});
s.write('read-evidence-index.json',{events_snapshot:'reading-events.snapshot.jsonl',sha256:sha(rawEvents),read_event_count:reads.length,rows:notes.map(n=>({unit:n.unit,path:n.path,sha256:n.sha256,coverage:n.coverage,tool_evidence:n.tool_evidence})),audit_status:'reserved-for-main-task'});
const state=s.state();
const ids=['O_PAGE_PAIR','O_PAGE_SLIP_48','P_QIU_WORK_PAGES','T_PAGE_PAIR','T_QIU_TAKE_BACK','P_PUBLIC_PAGES','P_QIU_LARGE_PAGES','P_RO_WORK_PAGES','T_VOICE_CONSENT','P_READING_ROOM_DUTY_KEY','P_READING_ROOM_SPARE_KEY','I_ROOM_THREE_MORNINGS','T_HE_OLD_PAY','T_ROOM_AFTER33','T_NEW_ROOM_COST','P_NEW_ROOM_RECEIPT','P_LONG_LEAD_58','O_LEAD_DROP_58','P_CITY_THREE_AUDIO','O_PHOTO_WAIT_62','T_SOUND_CONTEXT','T_POST_LISTEN_67','T_LOCAL_MENU_SOUND','P_SHOP_PLAN_66','P_SHOP_CHAIR_66','O_RAIN_TILE','O_RAIN_DURING_42','O_ZOU_ACCOUNT_48','O_ROUTE_PASS_54','O_ROUTE_RAIN_71','T_ROUTE_CONTACT_71','T_ROUTE_TRIAL_73','T_ROUTE_COMMON','P_LAMP','P_ZHOU_FISH_BOX','T_RETURN_MONTH','R_SHEN_ZHOU','T_MONTH_TALK_70','T_RIVER_EVENING_74','T_AUDIO_REMAINDER','T_PRIVATE'];
s.write('stable-id-index.json',{basis:'Current state used only to locate actual IDs and anchors through75. Future statements/status/knowledge deliberately not copied as early-chapter facts.',rows:ids.map(id=>({id,exists:!!state.snapshot.ledger[id],evidence_units_through75:[...new Set((state.snapshot.ledger[id]?.evidence??[]).map(e=>e.unit).filter(u=>u<=75))]}))});
s.write('failures.json',{product_failures:[],recording_and_inspection_issues:[{kind:'missing-directory',tool:'FastCtx glob',path:'read-a',actual:'Path does not exist',impact:'Unused optional lookup; no product call, no file changed.'},...corrections],protocol_limitations:[{kind:'recovery-order',detail:'Initial reading used installed workspace root skills; later inspection found preserved work writer-project/review/long-form differ. Actual preserved versions subsequently fully read, no work changes or migration commands executed. Novel and common review modules same hashes; current protocol uses captured CLI. No incompatible action was taken.'}],inherited_history:'B helper path, blank-line audit false alarm and quote corrections remain in read-b/failures.json; not erased or reclassified as product bugs.'});
s.write('assembly-summary.json',{totals,read_events:reads.length,quotes_checked:true,script_literary_verdict:false});
console.log(JSON.stringify({totals,read_events:reads.length,thread_id:events.find(e=>e.type==='thread.started')?.thread_id},null,2));
