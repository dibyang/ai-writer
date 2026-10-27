import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
export const base=path.dirname(fileURLToPath(import.meta.url));
export const main=JSON.parse(fs.readFileSync(path.join(base,'project.json'))).project;
export const j=f=>JSON.parse(fs.readFileSync(f));
export const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
export const state=(root=main)=>j(path.join(root,'.writer/state.json'));
export function save(ref,value){const f=path.join(base,ref);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,typeof value==='string'?value:JSON.stringify(value,null,2)+'\n',{flag:'wx'});return f;}
export const author=()=>{const ref='研究/AC作者任务.md',b=fs.readFileSync(path.join(main,ref));const quote='继续完成当前尚未验收的工具修改，再用最新 0.9.0 从36章继续扩大长篇实跑，重点验证多轮跨会话恢复、跨卷伏笔回收和多处旧章修改后的连续性，发现问题直接修复，保留完整验证记录，暂不修改现有作品。';assert(b.toString('utf8').includes(quote));return {quote,local_source:ref,source_sha256:sha(b),locator:'2026-10-24 ai-writer原用户授权；E控制器选择与执行范围另见AC本地e-controller-selection.md及本次用户消息，不冒充真人新增剧情',recorded_by:'Codex AC E same native session'};};
export function cli(label,args,{root=main,input,token=false,brief=false,expect=0}={}){
 const actual=[...args,'--project',root];if(input)actual.push('--input',input);if(token){const own=j(path.join(base,'e1-private/ownership.json'));actual.push('--revision-token',own.token);}
 const r=spawnSync(process.execPath,[path.join(base,'cli.mjs'),label,...actual],{encoding:'utf8',windowsHide:true,maxBuffer:64*1024*1024,timeout:120000});
 const folder=path.join(base,'cli-logs',label),meta=j(path.join(folder,'result.json'));
 let out;try{out=JSON.parse(r.stdout);}catch{out=r.stdout;}
 const clean=v=>{if(Array.isArray(v))return v.map(clean);if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,/token/i.test(k)?'[local-private]':clean(x)]));return v;};
 console.log(JSON.stringify({label,exit_code:r.status,revision:state(root).revision,before_state_sha256:meta.before_state_sha256,after_state_sha256:meta.after_state_sha256,output:brief?{ok:out?.ok,id:out?.id,version_id:out?.version_id,impact_id:out?.impact_id,review_from:out?.review_from,revision_from:out?.revision_from,from:out?.from,code:out?.code}:clean(out)},null,2));
 if(r.stderr)console.error(r.stderr);assert.equal(r.status,expect,'Unexpected CLI exit: '+label);return out;
}
if(process.argv[2]==='entry'){
 const p=j(path.join(base,'e-proposal.json')),s=state();assert.equal(s.revision,216);assert.equal(s.units.length,48);assert.equal(sha(fs.readFileSync(path.join(main,'.writer/state.json'))),p.baseline.state_sha256);
 const status=j(path.join(base,'cli-logs/e1-001-status/stdout.txt')),doctor=j(path.join(base,'cli-logs/e1-003-doctor/stdout.txt'));assert.equal(status.changed_sources.length,0);assert.equal(doctor.build.observed_content_id,p.baseline.tool_content_id);assert.equal(doctor.build.runtime_id,p.baseline.tool_runtime_id);assert.deepEqual(doctor.errors,[]);assert.deepEqual(doctor.warnings,[]);
 for(const c of p.reading.coverage){assert.equal(sha(fs.readFileSync(path.join(main,c.path))),c.sha256);for(const log of c.logs)assert.equal(j(path.join(base,log)).sha256,c.sha256);}
 save('e1-entry-proof.json',{at:new Date().toISOString(),revision:s.revision,units:s.units.length,state_sha256:p.baseline.state_sha256,tool_content_id:doctor.build.observed_content_id,tool_runtime_id:doctor.build.runtime_id,reading_reuse:p.reading.coverage,controller_selection_sha256:sha(fs.readFileSync(path.join(base,'e-controller-selection.md')))});
 const input={expected_revision:s.revision,operation_id:'E1_WORKFLOW_REVISION_35_48',author_evidence:author(),workflow:{stage:'revision',task:'AC E控制器在原human长篇工具验收授权内选择三项受控修改：35花册12→14及36告知；40料8→10/41总50无找零/47账；44原两片豆干留三宽条及45后续。选择为controller试验值，不是新增作者剧情原话；只在AC独立区来源历史版本协议后回放35—48。首程到候选39登记即停、主区保留48未提交，根同ID恢复40—44再45—48。D48的旧47SHA仅revision212历史锚，旧字节不刷新。',authorization:{allowed_actions:['discuss','plan','revise'],draft_range:null,revise_range:{from:35,to:48},stop_conditions:['首程候选登记至39后保存checkpoint及交接停止，不继续40或prepare/commit；这是35—48整体修订任务断点。','只AC独立副本，35以前正文和登记单元及33V2绑定不改不重登；不可变观察与固定旧款和知识边界保持。','不写49，不提交推送或向其他聊天发消息，不子代理/额外会话/后台写稿。']},planning:s.governance.planning}};
 const f=save('e1-inputs/workflow.json',input);cli('e1-007-workflow-set',['workflow','set'],{input:f});
}
