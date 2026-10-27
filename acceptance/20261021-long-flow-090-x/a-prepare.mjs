import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
export const X=path.dirname(new URL(import.meta.url).pathname).replace(/^\/(\w:)/,'$1');
export const P=path.join(X,'scenario/东岸末班船-再扩展验证');
export const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
export const read=f=>fs.readFileSync(path.join(P,f),'utf8');
export const state=()=>JSON.parse(read('.writer/state.json'));
export function put(f,v){const p=path.join(P,f);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,typeof v==='string'?v:JSON.stringify(v,null,2)+'\n',{flag:'wx',encoding:'utf8'});return sha(fs.readFileSync(p));}
export const evidence=()=>({quote:'继续通过 Codex 扩大 0.9.0 的长篇实跑规模，在24章基础上增加章节数量和单章篇幅，重点验证多轮跨会话恢复、跨卷伏笔回收和多处旧章修改后的连续性，发现问题直接修复，保留完整验证记录，暂不修改现有作品。',local_source:'研究/作者请求-X-原文.md',source_sha256:sha(fs.readFileSync(path.join(P,'研究/作者请求-X-原文.md'))),locator:'X/author-request.md 第3行；2026-10-21 本聊天用户消息，无可用消息ID',recorded_by:'X-A 原生 Codex，依据本地实际作者请求记录；不作作者身份认证'});
if(process.argv[1]&&path.resolve(process.argv[1])===path.resolve(new URL(import.meta.url).pathname.replace(/^\/(\w:)/,'$1'))){
 put('研究/作者请求-X-原文.md',fs.readFileSync(path.join(X,'author-request.md'),'utf8'));
 put('研究/X-A有限执行指令-原文.md',fs.readFileSync(path.join(X,'prompt-a-first.md'),'utf8'));
 const s=state(),base=JSON.parse(fs.readFileSync(path.join(X,'baseline-state.json'))),wt=JSON.parse(fs.readFileSync(path.join(X,'baseline-worktree.json')));
 if(JSON.stringify(base)!==JSON.stringify(s))throw Error('baseline drift');
 put('研究/X-A恢复基线核对.json',{at:new Date().toISOString(),revision:s.revision,units:s.units.map(u=>({unit:u.unit,draft:u.draft,sha256:sha(fs.readFileSync(path.join(P,u.draft)))})),baseline_equal:true,worktree_manifest:{at:wt.at,head:wt.head,source:wt.source,project:wt.project,file_count:wt.files.length},environment:JSON.parse(fs.readFileSync(path.join(X,'environment.json'))),author_evidence:evidence(),scope_source_sha256:sha(fs.readFileSync(path.join(P,'研究/X-A有限执行指令-原文.md')))});
 const layers={positioning:{status:'adopted',refs:['设定/作品定位.md','设定/文风.md','设定/权威规则.md','设定/人物与声音.md'],unresolved_ids:[]},structure:{status:'deferred',refs:[],unresolved_ids:['扩大至36的远期骨架待建立'],reason:'保留W骨架历史，本轮只滚动细化25—27'},volume:{status:'deferred',refs:[],unresolved_ids:['V10—V13待登记'],reason:'V1—V9保持原字节'},outline:{status:'draft',refs:[],unresolved_ids:['待plan建立25细纲']}};
 put('.writer/a-inputs/workflow-outline-r113.json',{expected_revision:s.revision,operation_id:'x-a-outline-25-36',author_evidence:evidence(),workflow:{stage:'outline',task:'依据本轮扩大授权恢复后规划25—36；A首次仅25整章与26前两段，先建25细纲，当前尚不写正文。旧paused任务作为历史保留，next25不是授权来源。',authorization:{allowed_actions:['discuss','plan'],draft_range:null,revise_range:null,stop_conditions:['A首次止于25登记及26前两段3000—4500正文汉字，26不合章不record；正常保存真实交接退出。','有限后续授权25—27，27完成后复盘；28—36只留骨架，本轮不写37。','保护全部旧24正文与units及原observation三项；不改根产品、其他作品、W、全局配置；不派代理/不提交推送/不发布付费。']},planning:layers}});
 console.log(JSON.stringify({ok:true,revision:s.revision,author_evidence:evidence(),baseline_files:wt.files.length},null,2));
}
