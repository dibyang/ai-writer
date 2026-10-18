import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
export const stage=path.dirname(fileURLToPath(import.meta.url));
export const work=path.resolve(stage,'../work');
export const base=path.resolve(stage,'../..');
export const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
export const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
export const state=()=>read(path.join(work,'.writer/state.json'));
export const write=(name,obj)=>fs.writeFileSync(path.join(stage,name),JSON.stringify(obj,null,2)+'\n',{flag:'wx'});
export const evidence=()=>{const local_source='研究/D批更新授权原话.md';const bytes=fs.readFileSync(path.join(work,local_source));return {quote:bytes.toString('utf8').split('\n')[4],local_source,source_sha256:sha(bytes),locator:'研究/D批更新授权原话.md:5，完整合成作者原话；本轮用户指定文本，无消息ID',recorded_by:'native-d-one Codex; synthetic acceptance recorder'};};
if(process.argv[2]==='workflow'){
 const s=state(),workflow=structuredClone(s.governance);delete workflow.enabled;
 workflow.stage='structure';workflow.task='synthetic acceptance：D副本仅讨论/规划及本地工具更新验证；保留未决选择，正文暂停，不写第7章；本会话停在prepared';
 workflow.authorization={allowed_actions:['discuss','plan'],draft_range:null,revise_range:null,stop_conditions:['正文暂停，不写第7章，不改六章；候选不当事实或确认扩店','本会话工具事务prepared后停止，不recover/unlock；后续须另会话核锁与进程并显式恢复']};
 write('workflow-input.json',{expected_revision:s.revision,operation_id:'native-d-one-workflow',author_evidence:evidence(),workflow});
}
if(process.argv[2]==='decision')write('decision-input.json',{expected_revision:state().revision,operation_id:'native-d-one-candidate',author_evidence:evidence(),decision:{id:'D_PATTERN_NEXT_VOLUME',topic:'旧纸样的未来核查',status:'candidate',options:['旧纸样可留给下一卷核查'],adopted_items:[],excluded_items:[],unresolved_items:['是否下一卷核查、何时及如何核查未定','FUTURE_STAY：林禾是否留镇常住未定','FUTURE_COST：费用分担未定','FUTURE_PATTERN：纸样是否复制给更多人未定','不确认扩店或任何经营安排'],effective_range:{from:7,to:null}}});
if(process.argv[2]==='freeze')write('freeze-input.json',{expected_revision:state().revision,operation_id:'native-d-one-freeze-pattern',ref:'研究/D批旧纸样候选备忘.md',version_id:'D_PATTERN_MEMO_V1',previous:null});
