import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const W=path.dirname(fileURLToPath(import.meta.url)),P=path.join(W,'scenario/东岸末班船-规模验证'),R=path.join(W,'scenario/规划引用顺序-新用户验证');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const phase=process.argv[2];
const write=(file,data)=>fs.writeFileSync(file,typeof data==='string'?data:JSON.stringify(data,null,2)+'\n',{flag:'wx'});
const source='研究/F技术场景真实授权-v2.md';
if(phase==='outline-v2')fs.writeFileSync(path.join(R,source),fs.readFileSync(path.join(W,'prompt-f-final.md')),{flag:'wx'});
const evidence={quote:'R只验证真实引用与权限顺序，不写正文、不record或导出，不把技术试验当文学完成。',local_source:source,source_sha256:sha(fs.readFileSync(path.join(R,source))),locator:'prompt-f-final.md 第7行；本会话用户同文授权；本地原样副本',recorded_by:'W-F当前同一模型知情执行者'};
const state=JSON.parse(fs.readFileSync(path.join(R,'.writer/state.json')));
const positioning={status:'draft',refs:['设定/作品定位.md','设定/文风.md','设定/权威规则.md'],unresolved_ids:['技术样例仅供本轮门禁测试，不宣称作者采用整书']};
const deferred={status:'deferred',refs:[],unresolved_ids:['整书与分卷尚未创作'],reason:'本轮仅验证第1章规划引用与来源门禁，不写正文；有限1—1取模板后即暂停，复盘引用存在性、来源SHA与授权范围后再考虑任何创作。'};
if(phase==='plan'){
 write(path.join(W,'inputs/f-bootstrap-plan.json'),{unit:1,title:'尺子交到谁手里',goal:'林禾准备把借用木尺当面交还店主',change:'在清点货物与归还物件之间选择先问后等，形成清楚交接',beats:['林禾带尺到店，见店主正在点货','询问交接对象，得知不能随意搁在货箱上','林禾等店主点完一箱，再当面交尺并确认'],cast:['林禾','店主'],setting_refs:['设定/权威规则.md'],research_refs:[],forbidden:['不引入东岸末班船人物','不把规划行动写成已发生事实']});
} else {
 const stage=phase.startsWith('outline')?'outline':phase==='trial'?'trial':'paused';
 const auth={allowed_actions:stage==='outline'?['discuss','plan']:phase==='trial'?['discuss','plan','draft']:['discuss'],draft_range:phase==='trial'?{from:1,to:1}:null,revise_range:null,stop_conditions:['本轮只取第1章context与record-template，不创建正文、不record、不导出。','取模板后立即paused，复盘引用顺序、来源SHA和零正文结果。']};
 const outline=stage==='outline'?{status:'draft',refs:[],unresolved_ids:['待建立1章细纲']}:{status:'adopted',refs:['大纲/单元/0001.json'],unresolved_ids:['仅代理按真实技术验证授权采用样例细纲；不是作者采纳整书']};
 write(path.join(W,`inputs/f-bootstrap-${phase}.json`),{expected_revision:state.revision,operation_id:`f-bootstrap-${phase}-20261021`,author_evidence:evidence,workflow:{stage,task:stage==='outline'?'零正文规划顺序验证：先规划后建真实第1章单元纲':phase==='trial'?'零正文技术门禁验证：有限1—1，只取当前来源context及模板后暂停':'规划引用顺序技术验证结束，保持零正文，仅讨论复盘；不写1或2',authorization:auth,planning:{positioning,structure:deferred,volume:deferred,outline}}});
}
console.log(JSON.stringify({phase,revision:state.revision,R}));
