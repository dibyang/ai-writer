import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const base=path.resolve('acceptance/20261019-new-user-g/native-b');
const read=n=>JSON.parse(fs.readFileSync(path.join(base,n),'utf8'));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const results=read('results.json'),handoff=read('handoff.json'),readings=read('readings.json');
const errors=[];
for(const m of results.manuscripts)if(sha(fs.readFileSync(m.path))!==m.sha256)errors.push('manuscript drift '+m.unit);
const currentState=sha(fs.readFileSync(results.paths.state));
if(currentState!==results.state_sha256||handoff.state_sha256!==currentState)errors.push('state drift');
const registered=JSON.parse(fs.readFileSync(results.paths.review_registration,'utf8'));
if(registered.report_sha256!==sha(fs.readFileSync(results.paths.literary_report)))errors.push('report drift');
for(const s of readings.sessions){
 if(!s.report||!fs.existsSync(s.report)||!fs.existsSync(s.output))errors.push('reading refs '+s.id);
 for(const e of s.entries)if(sha(fs.readFileSync(e.frozen_path))!==e.sha256)errors.push('read bytes '+e.path);
}
const noProject=results.commands.filter(c=>c.before_state_sha256===null).map(c=>c.label);
const captureLimit={unscoped_help_commands:noProject,note:'8次help未带--project，capture状态字段为null，未逐次保存作品状态副本；原argv/stdout/stderr/exit/build均保留。带--project的33次操作（含全部状态变更、边界拒绝及上下文/登记/审查/核验）均保存实际state原字节。不得宣称41次都有作品状态副本。'};
results.capture_limitations=captureLimit;handoff.capture_limitations=captureLimit;
results.concurrent_workspace_observation={final_status_additional_modified:['docs/authoring-governance-b-implementation.md','docs/authoring-governance-c-implementation.md','docs/authoring-governance-d-implementation.md','docs/authoring-governance-design.md','docs/recovery-hardening-e.md','docs/review-and-registration.md','docs/revision-and-sources.md','docs/verification.md','docs/workflow.md','scripts/codex-acceptance.mjs'],attribution:'本轮所有显式写入均在G目录，未改动或回退这些主项目文件。不以git status证明外部工作区冻结。运行时guard在本轮各次磁盘观测一致。'};
for(const s of readings.supporting_sources)s.freeze_timing='end-of-run supporting source snapshot; original presentation via FastCtx earlier; literary sessions separately freeze before display';
readings.supporting_sources_limit='辅助手册/技能在收尾冻结，不声称初次阅读时逐次即时冻结。正文各次读取先冻结该次实际字节再完整输出，最终1–6实读版本一致。';
for(const [name,data]of [['results.json',results],['handoff.json',handoff],['readings.json',readings]])fs.writeFileSync(path.join(base,name),JSON.stringify(data,null,2)+'\n');
const qa={checked_at:new Date().toISOString(),errors,state_sha256:currentState,registered_report_sha256:registered.report_sha256,chapter_functions:registered.chapter_functions.length,capture_limitations:captureLimit,core_files:['REPORT.md','results.json','handoff.md','handoff.json','readings.json','recovery-checkpoint.md','recovery-checkpoint.json']};
fs.writeFileSync(path.join(base,'delivery-verification.json'),JSON.stringify(qa,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(qa,null,2));if(errors.length)process.exitCode=1;
