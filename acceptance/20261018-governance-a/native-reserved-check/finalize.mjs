import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const stage = path.resolve('acceptance/20261018-governance-a/native-reserved-check');
const commands = path.resolve('acceptance/20261018-governance-a/commands');
const work = path.join(stage, '最终交付重放作品');
const read = p => JSON.parse(fs.readFileSync(p,'utf8'));
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const write = (name,obj) => fs.writeFileSync(path.join(stage,name),JSON.stringify(obj,null,2)+'\n',{flag:'wx'});
const observations = fs.readdirSync(path.join(stage,'observations')).map(n=>read(path.join(stage,'observations',n))).sort((a,b)=>a.result.started_at.localeCompare(b.result.started_at));
const by = label => { const row = observations.find(o=>o.label===label); assert(row,label); return row; };
const stdout = label => read(path.join(commands,label,'stdout.raw.txt'));
const stderr = label => read(path.join(commands,label,'stderr.raw.txt'));
const expectedRefusals = observations.filter(o=>/-reserved-|-(draft2|discussion)-refused$/.test(o.label));
assert.equal(expectedRefusals.length,8);
for (const row of observations) {
  assert.equal(row.result.exit_code,expectedRefusals.includes(row)?2:0,row.label);
  assert.equal(row.capture_exit_code,row.result.exit_code,row.label+' capture process exit');
  if (row.result.input) {
    const actual = fs.readFileSync(path.join(commands,row.label,'input.raw.json'));
    assert.equal(sha(actual),row.result.input.sha256);
    assert(actual.equals(fs.readFileSync(row.result.input.file)));
  }
  for (const when of ['before','after']) {
    const statePath = path.join(commands,row.label,when+'-state.json');
    const expected = row.result[when+'_state_sha256'];
    if (expected) assert.equal(sha(fs.readFileSync(statePath)),expected,row.label+' '+when+' raw state');
  }
}
for (const row of expectedRefusals) {
  assert(row.state_unchanged && row.drafts_unchanged && row.work_files_unchanged,row.label+' rejection changed work');
  assert.equal(stderr(row.label).code,row.label.includes('-reserved-')?'INVALID_INPUT':'ACTION_OUT_OF_SCOPE');
}
const guards = expectedRefusals.filter(o=>o.label.includes('-reserved-')).map(o=>({label:o.label,id:read(path.join(commands,o.label,'input.raw.json'))[o.label.includes('-workflow-')?'operation_id':'decision']?.id ?? read(path.join(commands,o.label,'input.raw.json')).operation_id,exit_code:o.result.exit_code,code:stderr(o.label).code,state_unchanged:o.state_unchanged,drafts_unchanged:o.drafts_unchanged,work_files_unchanged:o.work_files_unchanged,before_state_sha256:o.before.state_sha256,after_state_sha256:o.after.state_sha256}));
assert.equal(guards.length,6);
for (const row of observations.filter(o=>o.label.startsWith('native-four-status-after-'))) {
  assert.equal(stdout(row.label).revision,0);
  assert.equal(stdout(row.label).ok,true);
}
const trialInput = read(path.join(stage,'workflow-trial.json'));
for (const id of ['prototype','constructor','__proto__']) {
  const bad = read(path.join(stage,'workflow-reserved-'+id+'.json'));
  assert.deepEqual({...bad,operation_id:'toString'},trialInput);
  const dBad = read(path.join(stage,'decision-reserved-'+id+'.json'));
  const dGood = read(path.join(stage,'decision-location.json'));
  assert.deepEqual(dBad.author_evidence,dGood.author_evidence);
  assert.deepEqual({...dBad.decision,id:dGood.decision.id},dGood.decision);
}
const replayLabels = ['native-four-trial-tostring-replay','native-four-decision-location-replay','native-four-decision-gift-replay','native-four-record-1-replay'];
const idempotency = replayLabels.map(label=>{const o=by(label);assert(stdout(label).unchanged);assert(o.state_unchanged && o.work_files_unchanged);return {label,unchanged:true,before_revision:o.before.revision,after_revision:o.after.revision,response_revision:stdout(label).revision};});
assert.equal(stdout('native-four-trial-tostring').operation_id,'toString');
assert.equal(by('native-four-trial-tostring').after.revision,1);
assert.equal(by('native-four-trial-tostring-replay').after.revision,1);
const decisions = stdout('native-four-decisions-unit1').decisions;
assert.deepEqual(decisions.current.map(d=>d.adopted_items),[['旧渡口方案']]);
assert.deepEqual(decisions.candidates.map(d=>d.options),[['纸签','铜铃']]);
assert.deepEqual(decisions.candidates[0].adopted_items,[]);
const copy = read(path.join(stage,'copy-evidence.json'));
assert.equal(copy.source_sha256,copy.target_sha256);
assert.equal(sha(fs.readFileSync(copy.source)),copy.source_sha256);
assert(fs.readFileSync(copy.source).equals(fs.readFileSync(copy.target)));
const template = stdout('native-four-template-1');
const record = read(path.join(stage,'record-1.json'));
assert.deepEqual(record.source_hashes,template.source_hashes);
assert.deepEqual(record.source_hashes,stdout('native-four-context-1').source_hashes);
assert.equal(record.expected_revision,template.expected_revision);
assert.equal(template.expected_revision,3);
assert.equal(stdout('native-four-record-1').sha256,copy.target_sha256);
assert(new Date(copy.copied_at) >= new Date(by('native-four-template-1').result.started_at));
const structure = stdout('native-four-structure-discussion');
assert.equal(structure.governance.stage,'structure');
assert.deepEqual(structure.governance.authorization.allowed_actions,['discuss','plan']);
assert.equal(structure.governance.authorization.draft_range,null);
assert.equal(structure.governance.authorization.revise_range,null);
assert.equal(structure.governance.planning.structure.status,'deferred');
const finalStatus = stdout('native-four-bundled-final-status');
const check = stdout('native-four-bundled-final-check');
assert.equal(finalStatus.schema_version,3);
assert.equal(finalStatus.revision,6);
assert.equal(finalStatus.next_unit,2);
assert.equal(finalStatus.governance.stage,'paused');
assert.deepEqual(finalStatus.governance.authorization.allowed_actions,[]);
assert.equal(finalStatus.governance.authorization.draft_range,null);
assert.equal(finalStatus.governance.authorization.revise_range,null);
assert.equal(finalStatus.governance.planning.structure.status,'deferred');
assert.deepEqual(finalStatus.stale_units,[]);
assert.deepEqual(finalStatus.changed_sources,[]);
assert.deepEqual(check.findings,[]);
assert.deepEqual(check.draft_inventory,{registered_count:1,unregistered:[],unsafe_entries:[]});
const pausedAdvice = stderr('native-four-paused-discussion-refused').next_action;
assert(pausedAdvice.includes('所有创作动作均暂停') && pausedAdvice.includes('只读') && pausedAdvice.includes('workflow show'));
assert(!pausedAdvice.includes('discuss、plan'));
assert(stdout('native-four-paused-status').next.command.includes('workflow show'));
const actualSuggested = by('native-four-suggested-workflow-show').result.argv;
assert.deepEqual(actualSuggested.slice(1,3),['workflow','show']);
assert.equal(path.resolve(actualSuggested[0]),path.resolve('bin/ai-writer.mjs'));
assert.equal(path.resolve(actualSuggested[actualSuggested.indexOf('--project')+1]),work);
const main = stdout('native-four-identify-main');
const bundled = stdout('native-four-identify-bundled');
const compare = stdout('native-four-compare');
assert.equal(main.observed_content_id,bundled.observed_content_id);
assert.equal(main.runtime_id,bundled.runtime_id);
assert.equal(bundled.declared_build_id,bundled.observed_content_id);
assert.deepEqual(main.files,bundled.files);
assert.deepEqual(compare.differences,[]);
assert(compare.same_content && compare.same_version && compare.read_only);
assert.deepEqual(bundled.missing,[]);
assert.deepEqual(bundled.mismatches,[]);
for (const o of observations) { assert.equal(o.result.build.observed_content_id,main.observed_content_id,o.label+' content'); assert.equal(o.result.build.runtime_id,main.runtime_id,o.label+' runtime'); }
const protectedComparison = read(path.join(stage,'protected-comparison.json'));
for (const v of Object.values(protectedComparison)) assert(v.unchanged);
const started = observations[0].result.started_at;
const finished = new Date().toISOString();
const build = {tool_version:main.tool_version,main_profile:main.profile,bundled_profile:bundled.profile,observed_content_id:main.observed_content_id,runtime_id:main.runtime_id,declared_build_id:bundled.declared_build_id,source_commit:main.provenance.source_commit,source_tree_dirty:main.provenance.dirty,managed_file_count:main.files.length,group_counts:Object.fromEntries(['content','runtime','skills'].map(g=>[g,main.files.filter(f=>f.group===g).length])),differences:compare.differences,bundled_missing:bundled.missing,bundled_mismatches:bundled.mismatches,governance_module:main.files.find(f=>f.file==='lib/governance.mjs'),all_captured_commands_same_build:true};
const rows = observations.map(o=>({label:o.label,command:['node','acceptance/20261018-governance-a/capture.mjs',o.label,o.result.exe,...o.result.argv],started_at:o.result.started_at,exit_code:o.result.exit_code,expected_rejection:expectedRefusals.includes(o),before_revision:o.before.revision,after_revision:o.after.revision,state_unchanged:o.state_unchanged,drafts_unchanged:o.drafts_unchanged,work_files_unchanged:o.work_files_unchanged,capture:'../commands/'+o.label,observation:'observations/'+o.label+'.json',input:o.result.input}));
write('commands-index.json',rows);
write('build-verification.json',build);
const notCovered = ['未重跑 npm test、npm run doctor 或内置引擎测试；本阶段未改实现，覆盖为所列最终CLI流程','未验证 supersedes 保留键、所有其他ID/Unicode边界或跨范围替代链','未做并发、中断、磁盘故障、锁外修改或长篇规模验证','未做旧作品迁移/更新、旧故障现场恢复、外部发布或联网验证','未做 Linux、其他 Node 版本或多机器验证','复用单章，不是新增文学创作、真人盲读、市场验证、作者定稿或正式发布验收'];
const summary = {result:'PASS_FOR_REQUESTED_LOCAL_CLI_REPLAY',stage:'native-reserved-check',started_at:started,completed_at:finished,platform:process.platform,node_version:process.version,work,command_count:rows.length,successful_commands:rows.filter(r=>r.exit_code===0).length,expected_nonzero_commands:expectedRefusals.length,unexpected_failures:[],reserved_key_refusals:{workflow_operation_id:3,decision_id:3,total:6,cases:guards,status_after_each_rejection_successful:true},idempotency,flow:{schema_version:3,stages:['direction','trial','structure','paused'],revision_path:[0,1,2,3,4,5,6],trial_range:{from:1,to:1},trial_stop_conditions:trialInput.workflow.authorization.stop_conditions,structure_deferred_reason:structure.governance.planning.structure.reason,selected_location:decisions.current[0],candidate_gift:decisions.candidates[0],formal_plan_context_template_record_check:true,structure_discussion_success:true,structure_unit2_draft_refused:true,paused_discussion_refused:true,paused_next_action:pausedAdvice,status_suggested_workflow_show_executed:true},source_replay:copy,build,final:{revision:finalStatus.revision,next_unit:finalStatus.next_unit,stage:finalStatus.governance.stage,allowed_actions:[],draft_range:null,revise_range:null,planning_structure:finalStatus.governance.planning.structure,draft_inventory:check.draft_inventory,findings:check.findings,literary_quality:check.literary_quality,state_sha256:by('native-four-bundled-final-status').after.state_sha256},protected:protectedComparison,implementation_changes:false,authoritative_state_hand_edits:false,old_work_migration_or_tool_update:false,network_used:false,subagents_used:false,commit_or_push:false,new_literary_han_characters:0,not_covered:notCovered,evidence:{commands_index:'commands-index.json',raw_commands:'../commands/native-four-*',observations:'observations/*.json',author_instruction:'author-instruction.txt',reading:'reading-evidence.json',source_copy:'copy-evidence.json',model_replay_review:'model-replay-review.md',build:'build-verification.json',protected:'protected-before.json + protected-after.json + protected-comparison.json'}};
write('summary.json',summary);
const guardTable = guards.map(g=>`| ${g.label.includes('-workflow-')?'workflow operation_id':'decision.id'} | ${g.id} | ${g.code} / ${g.exit_code} | 相同 |`).join('\n');
const report = `# 最终交付构建：保留键防护与完整流程重放\n\n本阶段要求的 Windows 本地 CLI 重放通过，未发现需交主会话修复的新问题。共 ${rows.length} 条真实产品 CLI：${summary.successful_commands} 条成功，8 条预期拒绝（退出码2），无意外失败。此结论仅覆盖下列流程，不是正式发布验收。\n\n## 边界与真实输入\n\n只写本阶段目录及 commands/native-four-*。不改实现，不启用子代理、不联网、不迁移或更新旧作品、不提交推送。当前主项目原有脏工作区保持原样。每条产品命令由 evidence.mjs 调用指定 capture.mjs，再启动真实 Node CLI；未导入 lib 替代产品操作。捕获器保留 argv、原始 stdout/stderr、真实退出码、输入原字节与哈希，以及带作品路径命令的前后 state 原字节。observations 另为每条命令记录作品前后 state 哈希、修订号、正文清单与全作品文件哈希清单。外层辅助脚本正常退出不代表被测CLI成功，计数均读取 capture 的 exit_code。\n\n已先读当前 writer-project 技能、docs/user-guide.md FAQ 及 docs/workflow.md 的 ID 约束。测试作者完整原话见 author-instruction.txt，作品内真实本地来源为“研究/本轮作者原话.txt”；workflow/decision 以该来源真实 SHA256、原话和本地定位绑定，没有编造消息 ID。所有治理、章纲及登记 JSON 输入均放在本阶段外层目录，未手改权威 state。\n\n## 保留键与普通字典索引\n\n| 输入位置 | ID | 真实结果 | state/正文及全作品清单 |\n| --- | --- | --- | --- |\n${guardTable}\n\n六次拒绝均在 revision=0，且每次之后实际 status 成功，未形成不可读状态。workflow 负例与正式有效 trial 输入只改 operation_id；decision 负例与后续正常地点决策的主体仅 ID 不同，CAS 修订号及操作号各按对应时点准备。\n\n普通 operation_id=toString 首次正常登记至 revision=1；相同原字节重放返回 unchanged，state 与全作品文件哈希不变，修订号未前进。地点、赠物决策及 record 的原输入也各重放一次，均 unchanged。地点决策重放响应保留历史 revision=2，当时权威 state 仍为 revision=3；它没有倒退状态。\n\n## 有限 trial 与来源重放\n\n最终主入口初始化“最终交付重放作品”，schema=3；补充了简短定位。trial 仅 draft 1–1，revise_range=null，有登记后复盘、转讨论再暂停的条件。planning.structure=deferred，原因保留作者允许暂缓且仅验证单章的边界。地点“旧渡口方案” confirmed；纸签、铜铃为 candidate，adopted_items=[]，没有替作者选赠物。\n\n复制前已通过 FastCtx 完整读完第三轮第1章《提手》18行，记录见 reading-evidence.json。实际按 plan → context → record-template → 字节复制 → 填真实 summary/changes → record → check 执行。模板和 context 均来自本轮 revision=3；source_hashes 原样保留，不读用旧 state、旧 source_hashes 或旧随附工具。changes 只登记许桥与老人的已发生状态及修灯时间线，未把候选赠物写入事实。record 推进至 revision=4，机械 check 无 findings、已登记1章、无未登记稿。\n\n复制源：native-final-check/最终回归微型作品/正文/0001-提手.md。\n\n复制目标：本阶段“最终交付重放作品/正文/0001-提手.md”。两者 SHA256 均为：\n\n\`${copy.source_sha256}\`\n\n共 ${copy.bytes} 字节、${copy.text_characters} 个 Unicode 字符（包含标题和空白）、${copy.han_characters} 个汉字（包含标题）。全部计为复用，新增文学创作0字。check 的 literary_quality 仍为 unreviewed，单章自读与机械检查不作为文学通过。\n\n## 讨论与全部暂停\n\n完成登记及复盘后，正式 workflow set 切到 structure（revision=5），仅 discuss/plan，draft_range 与 revise_range 都为 null，远期结构仍 deferred。discussion context 成功；unit2 draft context 返回 ACTION_OUT_OF_SCOPE/2，拒绝前后 state、正文和全作品清单完全相同。\n\n随后正式切到 paused（revision=6），allowed_actions=[]、两个范围 null。实际 status 的 next.command 指向 workflow show，已按该建议通过捕获器执行成功。随后真实 discussion context 返回 ACTION_OUT_OF_SCOPE/2；next_action 为：\n\n> ${pausedAdvice}\n\n没有建议继续讨论或规划。拒绝前后 state/正文及全作品清单相同。新随附入口的 workflow show、check、status 也实际成功。最终 next_unit=2 仅为登记顺序，当前任务仍是全部暂停；没有写第2章。\n\n## 最终构建\n\n主项目与新随附工具版本均为 ${build.tool_version}，profile 分别为 main / workspace-copy。tool identify 两边及 tool compare 的完整输出在对应 commands 下；本阶段全部捕获命令的内容/runtime 指纹都绑定同一构建。\n\n- observed_content_id：\`${build.observed_content_id}\`\n- runtime_id：\`${build.runtime_id}\`\n- 随附 declared_build_id：\`${build.declared_build_id}\`\n- 来源 commit：\`${build.source_commit}\`；dirty=true，不能将指纹归因于干净提交。\n\n共 ${build.managed_file_count} 个受管文件（content ${build.group_counts.content}、runtime ${build.group_counts.runtime}、skills ${build.group_counts.skills}）逐项一致；compare same_content=true、differences=[]，随附清单 missing=[] / mismatches=[]。治理模块 SHA256：\`${build.governance_module.sha256}\`。workspace-copy 有意省略完整引擎，这不是引擎发布包验收；指纹不是供应链签名或作者身份认证。旧随附副本没有更新。\n\n## 保护核对与未覆盖\n\nprotected-before/after/comparison 保存前后哈希清单：主工作区（排除 .git、node_modules、acceptance）${protectedComparison.workspace.before_files} 个文件相同；其他验收区域（排除本阶段及 native-four 标签）${protectedComparison.other_acceptance.before_files} 个文件相同，包含前三轮作品与故障现场；D:/work/小说/dzkxqxx（排除 .git）${protectedComparison.actual_work.before_files} 个文件相同。比较对象为路径、字节数和 SHA256，不宣称审计文件访问时间或 Git 内部元数据。\n\n${notCovered.map(s=>'- '+s).join('\n')}\n\n命令完整索引见 commands-index.json，机器摘要见 summary.json。最终状态为 paused/revision=6；本阶段验证完成后停止。\n`;
fs.writeFileSync(path.join(stage,'report.md'),report,{flag:'wx'});
const git = spawnSync('git',['status','--short'],{windowsHide:true,cwd:process.cwd(),encoding:'utf8'});
assert.equal(git.status,0);
fs.writeFileSync(path.join(stage,'final-git-status.txt'),git.stdout,{flag:'wx'});
write('evidence-validation.json',{ok:true,validated_at:new Date().toISOString(),commands:rows.length,successful:summary.successful_commands,expected_rejections:8,guards:6,idempotent_replays:4,checks:['raw captured exit codes','input raw bytes and SHA256','raw before/after state hashes','all rejection work inventories unchanged','six status recoveries','positive input controls','four replay state invariants','new context/template source hashes identical','source and destination byte equality','structure/paused scope and guidance','suggested workflow show actually invoked','managed files and runtime identical','all capture build IDs fixed','protected directory comparisons'],report_sha256:sha(fs.readFileSync(path.join(stage,'report.md'))),summary_sha256:sha(fs.readFileSync(path.join(stage,'summary.json')))});
console.log(JSON.stringify({ok:true,commands:rows.length,successful:summary.successful_commands,expected_rejections:8,reserved_key_rejections:6,idempotent_replays:4,final_revision:6,protected:protectedComparison,build}));
