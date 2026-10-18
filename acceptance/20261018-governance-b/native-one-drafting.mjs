import {base,project,read,put,input,rev,cli,evidence} from './native-one-helper.mjs';
import {pathToFileURL} from 'node:url';
export const drafts=['','正文/0001-铜片的耳.md','正文/0002-两枚押钱.md','正文/0003-缺掉的一角.md','正文/0004-柳婆的抽屉.md','正文/0005-旧印归柜.md','正文/0006-信纸背面.md'];
const plans=[null,
{unit:1,title:'铜片的耳',goal:'阿禾凭母亲留下的铜片询问信件',change:'柜面疑是冒领凭据，须查旧簿；阿禾接受次日借验手续',beats:['补衣时发现母亲留下的铜片与领信便条','到桥头驿柜问周叔，展示折耳浅痕','周叔查到旧铜凭仍须借验，铜片暂由阿禾带回'],cast:['阿禾','周叔'],forbidden:['不提前出现缺角印解释','铜片不得无交接入柜']},
{unit:2,title:'两枚押钱',goal:'交押钱并借铜凭对验旧物',change:'阿禾交两枚押钱，铜片由周叔保管后交回阿禾带往旧柜核验',beats:['次晨柜前逐枚交两枚押钱并取收条','周叔核对铜片折耳浅痕，写借验号','周叔交回铜片，阿禾带着去旧库房'],cast:['阿禾','周叔'],forbidden:['不收三枚','不跳过铜片保管动作']},
{unit:3,title:'缺掉的一角',goal:'在旧库房找出与铜凭相关的信件记录',change:'阿禾见待核信封右下缺角印，周叔指出可问柳婆；铜片留柜',beats:['周叔开旧柜并翻出待核信封','观察缺角印与旧页印样相似，不作定罪','阿禾将铜片交周叔锁存，自己带描样去找柳婆'],cast:['阿禾','周叔'],forbidden:['不能认定柳婆偷信','不取走信件和原账']},
{unit:4,title:'柳婆的抽屉',goal:'请柳婆核验描样，取得能复验的解释',change:'柳婆认为像自己修过的旧印，带留存试印纸回柜，结论仍待对验',beats:['承接阿禾携描样到修锁铺','柳婆示出修印试纸，讲补角经历','阿禾请她亲到柜面核验'],cast:['阿禾','柳婆'],forbidden:['柳婆不能已知押钱或铜片现保管人','不能凭一张描样宣布排他结论']},
{unit:5,title:'旧印归柜',goal:'现场查清缺角印、领信并退两枚押钱',change:'旧印补角高差解释缺角；信件因柜号错列搁置，铜片归档，阿禾退得两枚',beats:['柳婆当周叔和阿禾面用原印复验','对旧簿与铜片划痕定位错列信件','周叔留铜片归档，将两枚押钱退给阿禾并交信'],cast:['阿禾','周叔','柳婆'],forbidden:['不逆改右下缺角观察','不把旧规倒改三枚','不把信件误列说成偷盗已定案']},
{unit:6,title:'信纸背面',goal:'读迟信并完成阿禾的选择',change:'阿禾知姨母当年寄来母亲旧托信，决定以信纸背面写回信；铜片仍在柜中',beats:['回家收妥两枚退钱，拆信','由信中普通嘱咐看到母亲并非只有操劳','写出给姨母的回信开头，停在六章'],cast:['阿禾'],forbidden:['不出现第七章情节','不把铜片凭空带回家','不能让不在场者知道私信内容']}];
export function planUnits(ns){for(const n of ns){const p=plans[n];cli('plan-'+n,['plan','--input',input('plan-'+n,{...p,arc_id:n<=3?'A1':'A2',recall_ids:n===1?[]:['OBJ_COPPER','OBS_NOTCH','THREAD_NOTCH','FACT_DEPOSIT'].filter(id=>n>3||id!=='OBS_NOTCH'&&id!=='THREAD_NOTCH'),setting_refs:['大纲/全书大纲.md'],research_refs:[]})]);}}
export function prepare(n,suffix=''){cli('context-'+n+suffix,['context','--unit',String(n)]);const template=cli('template-'+n,['record-template','--unit',String(n),'--draft',drafts[n]]);put(base+'/native-one-inputs/template-'+n+'.json',template);}
if(import.meta.url===pathToFileURL(process.argv[1]).href){
if(process.argv[2]==='start'){
const old=read(project+'/.writer/state.json').governance;
cli('workflow-trial',['workflow','set','--input',input('workflow-trial',{expected_revision:rev(),operation_id:'native-one-trial-six',author_evidence:evidence('创建原创小说《铜桥来信》，只在本轮验证目录试写六章，每章正文600–900汉字，两卷各三章；先规划后登记有限授权，到第六章停止。'),workflow:{stage:'trial',task:'仅试写并登记第1至6章；每三章实读复盘；第六章后停止正文',authorization:{allowed_actions:['discuss','plan','draft'],draft_range:{from:1,to:6},revise_range:null,stop_conditions:['每三章连读最近六章，未解决问题进入独立修订','第六章完成后停止正文，不写第七章']},planning:{positioning:{status:'draft',refs:['设定/作品定位.md','设定/文风.md','设定/权威规则.md'],unresolved_ids:[]},structure:{status:'draft',refs:['大纲/全书大纲.md'],unresolved_ids:[]},volume:{status:'draft',refs:['大纲/分卷/V1.json','大纲/分卷/V2.json'],unresolved_ids:[]},outline:{status:'draft',refs:['大纲/单元/0001.json','大纲/单元/0002.json','大纲/单元/0003.json'],unresolved_ids:[]}}}})]);
planUnits([1,2,3]);prepare(1);
}
if(process.argv[2]==='prepare')prepare(Number(process.argv[3]));
if(process.argv[2]==='second'){planUnits([4,5,6]);prepare(4);}
}
