// Evidence aggregation only. Reads actual CLI outputs and files; never edits product state.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const base=path.resolve('acceptance/20261019-new-user-g');
const local=path.join(base,'native-a-v2');
const project=path.join(base,'作品/雾港 来信');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const json=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const raw=label=>json(path.join(base,'commands',label,'stdout.raw.txt'));
const fail=label=>json(path.join(base,'commands',label,'stderr.raw.txt'));
const status=raw('a-v2-status-final'),check=raw('a-v2-check-final'),doctor=raw('a-v2-doctor-final');
const review=raw('a-v2-review-1-3');
const readings=json(path.join(local,'readings.json'));
const names=fs.readdirSync(path.join(project,'正文')).sort();
const manuscripts=names.map(name=>{
 const file=path.join(project,'正文',name),b=fs.readFileSync(file),text=b.toString('utf8');
 return {unit:Number(name.slice(0,4)),path:file,sha256:sha(b),body_han:(text.split(/\r?\n/).slice(1).join('\n').match(/\p{Script=Han}/gu)||[]).length};
});
const commands=fs.readdirSync(path.join(base,'commands')).filter(x=>x.startsWith('a-v2-')).sort().map(label=>{
 const dir=path.join(base,'commands',label),meta=json(path.join(dir,'result.json'));
 let stdout_json=null,stderr_json=null;
 try{stdout_json=json(path.join(dir,'stdout.raw.txt'));}catch{}
 try{stderr_json=json(path.join(dir,'stderr.raw.txt'));}catch{}
 return {label,directory:dir,exit_code:meta.exit_code,ok:stdout_json?.ok??stderr_json?.ok??null,error_code:stderr_json?.code??null,runtime_guard_id:meta.build_before?.runtime_guard_id,runtime_files_stable:meta.runtime_files_stable,state_unchanged:meta.before_state_sha256===meta.after_state_sha256,started_at:meta.started_at,expected_rejection:['a-v2-context-4-rejected','a-v2-template-4-rejected'].includes(label),actual_failure:meta.exit_code!==0&&!['a-v2-context-4-rejected','a-v2-template-4-rejected'].includes(label)};
});
const plan_units=fs.readdirSync(path.join(project,'大纲/单元')).filter(x=>/^\d+\.json$/.test(x)).map(x=>Number(x.slice(0,4))).sort();
const guards=[...new Set(commands.map(x=>x.runtime_guard_id))];
const frozen=fs.readdirSync(path.join(local,'read-versions')).sort().map(name=>({path:path.join(local,'read-versions',name),sha256:sha(fs.readFileSync(path.join(local,'read-versions',name)))}));
const context4=fail('a-v2-context-4-rejected'),template4=fail('a-v2-template-4-rejected');
const conditions={
 registered_only_1_3:status.draft_inventory.registered_count===3&&check.units===3&&manuscripts.map(x=>x.unit).join(',')==='1,2,3'&&manuscripts.every(x=>raw(`a-v2-record-${x.unit}`).sha256===x.sha256),
 han_lengths_in_requested_range:manuscripts.every(x=>x.body_han>=1200&&x.body_han<=1800),
 paused_discuss_plan_only:status.governance.stage==='paused'&&status.governance.authorization.allowed_actions.join(',')==='discuss,plan'&&status.governance.authorization.draft_range===null&&status.governance.authorization.revise_range===null&&status.next_unit===4,
 fourth_context_rejected:context4.ok===false&&context4.code==='ACTION_OUT_OF_SCOPE',
 fourth_record_template_rejected:template4.ok===false&&template4.code==='ACTION_OUT_OF_SCOPE',
 rejected_commands_did_not_change_state:commands.filter(x=>x.expected_rejection).every(x=>x.state_unchanged),
 no_fourth_draft_or_detail_plan:manuscripts.every(x=>x.unit<=3)&&plan_units.join(',')==='1,2,3'&&!manuscripts.some(x=>/第四章/.test(fs.readFileSync(x.path,'utf8'))),
 no_unregistered_manuscripts:status.draft_inventory.unregistered.length===0&&check.draft_inventory.unregistered.length===0,
 no_source_drift_or_active_revision:status.stale_units.length===0&&status.changed_sources.length===0&&status.revisions.sessions.length===0&&status.revisions.transactions.length===0,
 mechanical_check:check.ok===true&&check.findings.length===0,
 review_current_1_3:review.ok===true&&review.coverage.join(',')==='1,3'&&check.rolling_review.valid===1&&check.rolling_review.stale===0&&check.rolling_review.pending_windows.length===0,
 own_full_read_versions:manuscripts.every(m=>readings.readings.some(r=>r.read_id==='final-1-3'&&r.files.some(f=>f.sha256===m.sha256&&f.range.complete_file)))&&readings.readings.every(r=>fs.existsSync(r.report)&&fs.existsSync(r.raw_output)&&r.files.every(f=>sha(fs.readFileSync(f.read_version))===f.sha256)),
 frozen_files_unique_and_named_by_hash:frozen.every(x=>path.basename(x.path)===x.sha256+'.md')&&new Set(frozen.map(x=>x.sha256)).size===frozen.length,
 doctor:doctor.ok===true&&doctor.errors.length===0,
 runtime_observations_consistent:guards.length===1&&commands.every(x=>x.runtime_files_stable===true),
 no_unexpected_unresolved_cli_failure:commands.filter(x=>x.actual_failure).every(x=>x.label==='a-v2-help-init')
};
const paths={project,manuscript_directory:path.join(project,'正文'),manuscripts:manuscripts.map(x=>x.path),author_evidence:path.join(project,'研究/本轮作者依据.md'),plan_source:path.join(project,'研究/G轮PLAN原件.md'),positioning:path.join(project,'设定/作品定位.md'),characters:path.join(project,'人物/主要人物.md'),voice:path.join(project,'设定/文风.md'),rules:path.join(project,'设定/权威规则.md'),book_outline:path.join(project,'大纲/全书大纲.md'),promises:path.join(project,'大纲/核心承诺.md'),volumes:['V1','V2'].map(x=>path.join(project,'大纲/分卷',x+'.json')),plans:plan_units.map(x=>path.join(project,'大纲/单元',String(x).padStart(4,'0')+'.json')),author_only_planning:path.join(project,'研究/作者秘密-仅供规划.md'),self_reviews:['0001-实读自检.md','0002-实读自检.md','0003-实读自检.md'].map(x=>path.join(project,'审查',x)),rolling_report:path.join(project,'审查/0001-0003-整段连读.md'),review_registration:path.join(project,review.ref),state:path.join(project,'.writer/state.json'),readings:path.join(local,'readings.json'),read_versions:path.join(local,'read-versions'),read_outputs:path.join(local,'read-outputs'),inputs:path.join(local,'inputs'),commands:path.join(base,'commands'),report:path.join(local,'REPORT.md'),handoff_markdown:path.join(local,'handoff.md'),handoff_json:path.join(local,'handoff.json'),results:path.join(local,'results.json'),audit_script:path.join(local,'finalize-audit.mjs')};
const unresolved=[
 {id:'T_TEST15',last_confirmed:'第3章51–61行：周六9点阅览室十五分钟实测与留结果的约定，未实际执行',next:'只有新授权后，回读第1章首次请求、第3章最近约定和交接，再规划兑现；不要求长期走准'},
 {id:'T_SENDER',last_confirmed:'第1章海堤九月十二日邮戳；第3章27行旧簿顾姓，39行明确不能认定寄件人',next:'讨论回话方式和身份揭示边界；未查访代办所，不得宣称查明'},
 {id:'O_TAG27',last_confirmed:'第3章65行，陶芷帆布袋拉链内袋，借条留钟',next:'后续仍须核借牌归还，原牌与照片/借条分开'},
 {id:'O_CLOCK',last_confirmed:'第3章67行钟铺柜台后墙钩；短摆后停，未上弦清洗',next:'运钟、估工与材料钱、周五暂存核对和周六实测均待后续；不把计划当完成'},
 {id:'PLAN_OPEN',last_confirmed:'作者秘密-仅供规划.md中的代理候选，未获真人逐项采纳',next:'寄件者是否当面出现、材料费金额、搬迁后开放分工仍只讨论'}
];
const handoff={schema_version:1,created_at:new Date().toISOString(),project_path:project,state_revision:status.revision,state_sha256:sha(fs.readFileSync(paths.state)),stage:status.governance.stage,next_unit:status.next_unit,registered_range:{from:1,to:3},allowed_actions:status.governance.authorization.allowed_actions,draft_range:null,revise_range:null,task:status.governance.task,unregistered_drafts:status.draft_inventory.unregistered,active_revisions:status.revisions.sessions,pending_transactions:status.revisions.transactions,unresolved,next_step:'下一会话先通过记录器运行status及context --purpose discussion，读本交接和未决项；仅讨论/规划，不写第4章。收到新的明确有限正文授权后才可workflow set。',paths,manuscripts,review_scope:{from:1,to:3,kind:'model-self-review',report:paths.rolling_report,independent_or_human:false},boundary_tests:{context4:'a-v2-context-4-rejected',record_template4:'a-v2-template-4-rejected',code:'ACTION_OUT_OF_SCOPE'},limits:['仅三章有限试写和两卷粗骨架，小规模流程验证','第二卷未写未兑现；无六章、百章、跨新Codex会话恢复、修订提交或导出验收','无真人作者逐项文学采纳、真人盲读、市场或专业机芯核验','本轮未改工具，无Git提交/推送/联网/发布']};
const results={schema_version:1,created_at:handoff.created_at,attempt:'native-a-v2; separate restart; earlier native-a host permission failure untouched',outcome:Object.values(conditions).every(Boolean)?'bounded_run_requirements_observed':'needs_attention',conditions,observed_revision:status.revision,stage:status.governance.stage,tool_version:doctor.tool_version,node:doctor.node,manuscripts,total_body_han:manuscripts.reduce((n,x)=>n+x.body_han,0),registered_range:handoff.registered_range,read_sessions:readings.readings.length,file_read_entries:readings.readings.reduce((n,r)=>n+r.files.length,0),frozen_versions:frozen,command_count:commands.length,commands,runtime_guard_ids:guards,runtime_guard_limit:'Recorder disk-byte observations around fresh CLI processes; not loaded-module attestation or source cleanliness proof',review:check.rolling_review,paths,unresolved,failures_and_corrections:[{kind:'CLI parameter error',label:'a-v2-help-init',correction:'a-v2-help-init-corrected uses --path; failed result retained'},{kind:'underlength first manuscript',unit:2,first_body_han:1183,final_body_han:1261,old_read:'self-2',corrected_read:'self-2-corrected'},{kind:'unsupported gender in first manuscript',unit:3,old_read:'self-3',corrected_read:'self-3-corrected',correction:'Only 顾 surname known; no gender/identity inference'},{kind:'preview semantic overstatement',label:'a-v2-preview-3',correction:'a-v2-preview-3-corrected: corrected phone timing, no invented estimate date or photo count; original retained'}],not_done:handoff.limits,original_attempt_note:'No events or product calls from earlier native-a were rewritten or attributed to this run.'};
for(const [name,data] of [['handoff.json',handoff],['results.json',results]])fs.writeFileSync(path.join(local,name),JSON.stringify(data,null,2)+'\n',{flag:'wx'});
fs.writeFileSync(path.join(local,'inventory.json'),JSON.stringify({created_at:handoff.created_at,manuscript_files:manuscripts,detail_plan_units:plan_units,no_unit_4:conditions.no_fourth_draft_or_detail_plan},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({outcome:results.outcome,conditions,revision:status.revision,han:manuscripts.map(x=>x.body_han),read_sessions:results.read_sessions,frozen_versions:frozen.length,command_count:commands.length,actual_cli_failures:commands.filter(x=>x.actual_failure).map(x=>x.label)},null,2));
