import path from 'node:path';
import fs from 'node:fs';
import { stage, work, state, put, sha, cli, input } from './helpers.mjs';
const quote = '采用第五章‘布袋里里’的重复字意见，只做该处最小修正；可选风格意见保留原句，结构复演/节奏疑问延期，不借这次修订删去人物声音或增添冲突。授权独立修订范围5–6，第六章只核承接和等价重登，不另改正文，不写第七章。保持既有事实、观察statement、人物所知、物件位置和伏笔结论，更新与新稿相符的证据版本。完成实际提交及应用绑定后暂停，下一独立会话再做全六章复核。';
const local_source = '研究/第二阶段模拟作者取舍.md';
put(path.join(work,local_source),'# 第二阶段模拟作者取舍\n\n性质：synthetic-acceptance。本次用户明确指定的本地模拟作者原话，不是现实作品作者决定，不含伪造消息ID。记录者：第二个独立原生Codex进程。仅适用于本批《渡口旧箱》。\n\n“'+quote+'”\n\n该新指令优先于第一阶段暂留控制样本的历史任务记录；历史任务、全局活动设定与旧证据原件保留，不将历史指令改写为新事实。三项作者选择均来自上段明确模拟指令。\n');
const evidence = { quote, local_source, source_sha256:sha(fs.readFileSync(path.join(work,local_source))), locator:'第二阶段模拟作者取舍.md 第5行完整模拟原话；来源为本轮用户明确指定文本，无消息ID', recorded_by:'native-two Codex; synthetic-acceptance local recorder' };
put(path.join(stage,'author-evidence.json'), evidence);
const s=state();
cli('native-two-05-workflow-revise',['workflow','set','--input',input('workflow-revise',{expected_revision:s.revision,operation_id:'native-two-revise-5-6-author',author_evidence:evidence,workflow:{stage:'revision',task:'synthetic-acceptance：仅修第5章布袋里里，独立重登5–6；第6章正文不变，提交和apply后暂停，不写7',authorization:{allowed_actions:['discuss','plan','revise'],draft_range:null,revise_range:{from:5,to:6},stop_conditions:['实际commit及采用意见apply绑定后正式暂停；下一独立会话再全六章复核；不verify，不写第7章']},planning:s.governance.planning}})]);
const choices=[
 ['06-resolve-adopted','NATIVE_C_READABILITY_01','adopted','模拟作者明确采用第五章布袋里里重复字意见；只删此处一个里，按5–6独立修订重登后再绑定实际提交。'],
 ['07-resolve-retained','NATIVE_C_STYLE_02','retained','模拟作者明确可选风格意见保留原句；第一章不在正文修订范围，保留不等于修复。'],
 ['08-resolve-deferred','NATIVE_C_PACING_03','deferred','模拟作者明确结构复演/节奏疑问延期；不删谈菜段，不改变人物声音或增加冲突，等待下一独立会话全六章复核。']
];
for(const [label,id,disposition,reason] of choices) cli('native-two-'+label,['review-issues','resolve','--input',input(label,{expected_revision:state().revision,operation_id:'native-two-'+label,id,disposition,reason,decision_actor:'author',author_evidence:evidence})]);
put(path.join(stage,'pre-begin-state.json'),state());
cli('native-two-09-issues-before-begin',['review-issues','list']);
