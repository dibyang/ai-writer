import fs from 'node:fs';
import {json,write,stage,project,hash} from './run.mjs';
const s=json(stage+'/before/work/.writer/state.json');
for(const u of s.units.slice(6)){
 const candidate=fs.readFileSync(project+'/'+u.draft);
 if(!fs.existsSync(stage+'/candidates/'+u.draft))write(stage+'/candidates/'+u.draft,candidate);
 fs.copyFileSync(stage+'/before/work/'+u.draft,project+'/'+u.draft);
}
let snap=structuredClone(s.baseline);const snaps=[structuredClone(snap)];
for(const u of s.units){
 for(const p of json(stage+'/before/work/'+u.journal).patch){
  let v=snap;for(const k of p.at.slice(0,-1)){if(!v[k])v[k]={};v=v[k];}const k=p.at.at(-1);
  if(p.append){v[k]??=[];v[k].push(...structuredClone(p.append));}
  else if(p.has)v[k]=structuredClone(p.after);else delete v[k];
 }
 snaps.push(structuredClone(snap));
}
if(JSON.stringify(snap)!==JSON.stringify(s.snapshot))throw Error('Old journal replay mismatch');
write(stage+'/before/replayed-snapshots.json',snaps);
for(let n=1;n<=20;n++)write(stage+'/before/snapshots/'+String(n).padStart(4,'0')+'.json',snaps[n]);
write(stage+'/reading/old-knowledge.md',snaps.slice(7).map((v,i)=>'## '+(i+7)+'\n'+JSON.stringify({characters:v.characters,O_PLATE:v.ledger.O_PLATE,P_BOX:v.ledger.P_BOX},null,2)).join('\n'));
const plans={};for(const u of s.units.slice(6))plans[u.unit]=json(stage+'/before/work/大纲/单元/'+String(u.unit).padStart(4,'0')+'.json');
plans[7].beats[3]='保留08:35到站、09:00提醒、09:20拍通知和09:30工人到场；临走帮工人卸装篷布并挪小车清通道，09:50离站，12分钟到蓝牌；仍约11:30前电话，不能凭晚出发宣称按时。';
plans[8].beats[0]='从第7章巷内继续步行，10:25抵现客运厅，自蓝牌23分钟含绕路；先候问讯不越作业区。后续等待8分钟、洗手往返4分钟、电话周和11点刚过电话唐均能成立，原约11:30前。';
plans[11].beats[0]='第3日从河街21分钟回顾店，客户当面取冰箱；客户说前天帮扶微波炉、挂门帘，明确对应第1日第2章，作为上一轮审查误判的正式纠正。';
plans[11].beats[1]='沈仅说明箱内浅布与窄铜牌、归属未核、暂放仍自己负责，不报铭文刻线或日期信息；顾在收费与客户优先边界内同意次日看箱空间，不以预知牌面为条件。';
plans[11].forbidden.push('不得向顾遥报铭文、刻线、无日期或暗示他已获完整牌面');
plans[14].beats[4]='唐16:54离店，沈自行复封上架后回前台，首次完整口述西埠四号泊位、右下两短线、正反未找到日期及首日独开未拍抄；顾始终前台未入开箱现场、未亲见原牌，首次口述后承接原对话与罗次早取扇。';
plans[14].change+='；唐离店、复封上架后沈在前台首次完整告顾牌面观察，顾仍未亲见';
plans[20].beats[4]='沈展示原箱当次照说明首日独见、发现点东侧非西埠、归属未核，宋只让看候问桌角。沈随后实际展示灯柱原位工作照，问未拆整根灯可否暂放，宋只看整根照片未读门背字，才答长灯不收；不杜撰先前联系。';
for(const [n,p]of Object.entries(plans))write(stage+'/inputs/'+n.padStart(4,'0')+'-plan.json',p);
write(stage+'/source-impact.json',{baseline_revision:44,earliest:7,targets:[7,8,11,14,20].map(n=>({path:'大纲/单元/'+String(n).padStart(4,'0')+'.json',consumed_by:s.units.filter(u=>('大纲/单元/'+String(n).padStart(4,'0')+'.json')in u.source_hashes).map(u=>u.unit)})),unchanged_1_6:true,global_rules_unchanged:true});
console.log('Old 20 journals replay exactly; candidates retained; original drafts restored for per-unit context/template/edit/record.');
console.log(s.units.slice(6).map(u=>({unit:u.unit,han:(fs.readFileSync(stage+'/candidates/'+u.draft,'utf8').replace(/^#.*\r?\n/,'').match(/\p{Script=Han}/gu)??[]).length})));
