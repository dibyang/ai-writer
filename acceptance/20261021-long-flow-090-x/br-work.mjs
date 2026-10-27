import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {fileURLToPath} from 'node:url';
const X=path.dirname(fileURLToPath(import.meta.url)),P=path.join(X,'scenario/东岸末班船-再扩展验证');
const read=r=>fs.readFileSync(path.join(P,r)),j=r=>JSON.parse(read(r)),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const put=(r,v)=>{const p=path.join(P,r);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,typeof v==='string'?v:JSON.stringify(v,null,2)+'\n',{encoding:'utf8',flag:'wx'});};
const s=j('.writer/state.json'),cmd=process.argv[2];
if(cmd==='restore'){
 const a=JSON.parse(fs.readFileSync(path.join(X,'parent-b-first-stop-archive.json'))),old=j('.writer/drafts/b-template-29-r127.json');
 const files=a.files.map(v=>({path:v.file,same:sha(read(v.file))===v.sha256}));
 const sources=Object.entries(old.source_hashes).map(([r,h])=>({path:r,same:sha(read(r))===h,sha256:sha(read(r))}));
 if(files.some(v=>!v.same)||sources.some(v=>!v.same)||s.revision!==127)throw Error('first stop protection mismatch');
 put('研究/X-BR首停恢复核验.json',{revision:s.revision,archive_count:files.length,files,template_sources:sources,original_template_sha256:sha(read('.writer/drafts/b-template-29-r127.json')),parts:['分段/0029-B/01-四点十分-v2.md','分段/0029-B/02-柜前先亮的灯-v2.md'].map(r=>({path:r,sha256:sha(read(r))})),reading:'原生FastCtx完整01:1—40、02:1—44、28当前v2:201—271；模板14来源入口均同。工作流将因新续程变更，旧模板保留；只治理授权变化，无正文/人物事实变更。'});
 const source='研究/X-BR续程指令-原文.md';put(source,fs.readFileSync(path.join(X,'prompt-b-resume.md'),'utf8'));
 const evidence={quote:'本新任务覆盖首轮“停在未完段”的本地停点指令，现明确授权在既有有限28—30范围内继续至末章复盘，别再停回同一首停。',local_source:source,source_sha256:sha(read(source)),locator:'X/prompt-b-resume.md 第1行，本聊天同ID续程执行指令；实际线程01a15d55-748a-7500-9016-ada8458f00a7由根提供，无作者逐项采用细节的消息凭据',recorded_by:'同ID X-B原生Codex执行代理，按真实扩大请求与本续程任务记录'};
 const w={stage:'trial',task:'同ID X-B续程：28已登记且保持；接29首停真实两段补完29/30，30后当前25—30完整连读/正式复盘，最后paused仅discuss/null，不写31。本指令覆盖旧首停本地停止条件。',authorization:{allowed_actions:['discuss','plan','draft'],draft_range:{from:28,to:30},revise_range:null,stop_conditions:['28当前稿/报告/冻结引用保持；只接29真实首停，不重写开头或29旧段。','29>=8000且4—6段；30目标10500—11500至少10000/至少5段；各合章完整原生读/报告/preview0后record。','30后新完整单调25—30窗口/正式review，再paused仅discuss且两范围null，不写31。','保护原24完整units/正文及所有原观察三字段；只写X，不另派代理/改旧封存原作品根源码/导出提交推送发布付费。']},planning:structuredClone(s.governance.planning)};
 w.planning.outline.unresolved_ids=['29从首停两段继续；原细纲内本首次停点已由本续程明确覆盖，旧字节留为历史，余四beat仍可执行','30待真实plan；32茶/33穿洗反馈/35同行保留未来；原optional_style未采纳未改'];
 put('.writer/br-inputs/workflow-resume-r127.json',{expected_revision:s.revision,operation_id:'x-br-resume-29-30',author_evidence:evidence,workflow:w});
 console.log(JSON.stringify({ok:true,revision:s.revision,archive:files.length,all_same:files.every(v=>v.same),sources:sources.length}));
}
