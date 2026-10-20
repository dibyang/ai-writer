import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const U=path.dirname(fileURLToPath(import.meta.url)), W=path.join(U,'scenario','东岸末班船');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const put=(file,b)=>{fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,b,{flag:'wx'});};
const json=(name,v)=>put(path.join(U,'inputs',name+'.json'),JSON.stringify(v,null,2)+'\n');
const ok=label=>{const r=JSON.parse(fs.readFileSync(path.join(U,'commands',label,'result.json'),'utf8'));if(r.exit_code!==0)throw Error('Failed prerequisite: '+label);};
const revision=()=>JSON.parse(fs.readFileSync(path.join(W,'.writer','state.json'),'utf8')).revision;
const actor='Codex 本轮默认代理；隔离工具验收；非人类作者逐字选择';
const evidence=(rel,quote,locator)=>({quote,local_source:rel,source_sha256:sha(fs.readFileSync(path.join(W,rel))),locator,recorded_by:actor});
const mode=process.argv[2];
if(mode==='initial'){
  ok('a04-init');if(revision()!==0)throw Error('Expected unconsumed initial workspace');
  put(path.join(W,'研究','验收prompt-A原文.md'),fs.readFileSync(path.join(U,'prompt-a-first.md')));
  put(path.join(W,'研究','试验代理选择-A.md'),fs.readFileSync(path.join(U,'试验代理选择-A.md')));
  json('volume-v1',{id:'V1',title:'谁来领',start:1,end:2,promises:['找到旧箱的保管链和下一领用关系','分清周岸原押金、沈长年新押金及沈禾代领责任'],constraints:['尚未归还不写成已交到父亲手中','每人信息来自亲见或实际转述'],reserved:['实际跨河交接','父亲离开渡口的旧事'],arcs:[{id:'A_FIND',start:1,end:2,goal:'由误放箱找对领用人与委托',payoff:'明确前一借用人周岸、下一借用人沈长年、代领沈禾',forbidden:['父亲旧事自动查明','提前完成西岸签收']}]});
  json('volume-v2',{id:'V2',title:'过河',start:3,end:3,promises:['完成退旧押金、另行借出和西岸实际交箱','箱盖黄漆箭头得到具体使用上的兑现'],constraints:['不能临时加班船或放无票者越检票口','周岸留东岸，不能亲见西岸归还','观察原字不逆改'],reserved:['父亲离开渡口的具体缘由'],arcs:[{id:'A_RETURN',start:3,end:3,goal:'把核实过的借用落实成实际交接',payoff:'沈长年收到箱并用箭头方向推正偏口合盖；各人知情有别',forbidden:['以外观独自证明借用权','自动查清父亲全史']}]});
  const refs=['设定/人物.md','大纲/全书骨架.md'];
  json('plan-1',{unit:1,title:'长凳下的箱子',goal:'许蓉要在收班前为误放旧箱找到负责接手的人，沈禾要代父取箱',change:'箱子被稳妥保管，周岸与沈禾各有来取理由，大家决定等核实而不是直接搬走',beats:['许蓉整理候船室，回顾亲见老丁把箱放在长凳下，移到值班窗前并看见箱盖黄漆箭头','沈禾来到公共候船室出示父亲简短语音，询问取箱和押金；许蓉说明尚未核实不能直接领走','周岸到场认箱，说明自己借过、托老丁带回合作点，承认误放交代不清；两人分别说明眼前要办的事','联系老陶和沈长年暂未接通，核对各自确知信息；许蓉拿出候船安排让沈禾决定是否留下','沈禾选择等核实，周岸承诺不自行取走，实际说出关门前送到沈长年手中的有限约定；箱仍在许蓉保管处'],cast:['许蓉','沈禾','周岸'],setting_refs:refs,research_refs:[],arc_id:'A_FIND',recall_ids:[],forbidden:['不揭开箱内所有工具或凭外观确认授权','不把老陶未回电话写成已经核实','不退押金、不跨河、不兑现交箱','不查明父亲旧事'],notes:'目标至少5000正文汉字。分段是同一章中间稿，继续时实读上一段；当前进程停点由workflow约束。'});
  json('plan-2',{unit:2,title:'两笔押金',goal:'核实前后借用关系与沈禾代领授权，给赶船留出真实可行的时间',change:'老陶核对借用册、父亲通过实际电话确认代领，资金责任分开，三人知道该怎样完成交接但尚未交父亲',beats:['接续箱仍由许蓉保管、两人等待的现场，老陶回电话说明旧借用尚未销账','周岸出示自己交押金的凭据，老陶核旧册确认退给原交款人；沈禾问清自己是否还须垫款','沈长年实际接通电话，说明已约借长套筒修邻家水泵并委托女儿，沈禾说出赶船和搬运困难','父亲与老陶确认新的二百元押金另行办理，不挪用周岸的钱；周岸决定备小推车并等正式交接','老陶回合作点取册和核账，约在检票截止前到候船室办交接；三人留下能做的准备'],cast:['许蓉','沈禾','周岸','沈长年','老陶'],setting_refs:refs,research_refs:[],arc_id:'A_FIND',recall_ids:['T_DELIVER','P_BOX','O_BOX_ARROW'],forbidden:['不把约好交接写成实际签收','不把电话信息同步给不在通话旁的人','不新增必须解开的父亲旧案'],notes:'目标至少3500正文汉字。依据实际第1章登记与原文再核细纲，未来计划不是事实。'});
  json('plan-3',{unit:3,title:'过河以后',goal:'在正常末班条件下完成借还手续，把旧箱交到沈长年手中',change:'实际交接和旧箱使用完成；东岸的人只知道其实际收到的转述，父女留下可做的日常安排',beats:['实读早期箭头和约定原文，接住卷一已核实关系；老陶到候船室清点收回旧箱，旧押金实际退周岸','确认沈长年新押金与代领后，老陶正式把箱借给沈长年、交沈禾代领；许蓉记录物件离开保管处','沈禾买票，推车在公共通道到检票口按要求换手提箱，合规赶上末班；周岸因检修留东岸','西岸沈长年带手推车在公共出口接应，女儿亲手交箱；他试开合盖时沿黄漆箭头推正偏口，用一次实际动作兑现细节','沈禾回电许蓉报已交父亲，周岸何时得到转述须在文中落地；父女推车回去商量明日水泵与饭，父亲旧事有限未明'],cast:['许蓉','沈禾','周岸','沈长年','老陶'],setting_refs:refs,research_refs:[],arc_id:'A_RETURN',recall_ids:['O_BOX_ARROW','T_DELIVER','P_BOX'],forbidden:['不逆改观察statement/type/author_truth','不把看照或听述写成亲见','不临时加船、不让父亲瞬移','不自动查清父亲全史'],notes:'目标至少5000正文汉字。渡船时程、搬运可行性、两笔押金和逐人知情需实读核验。'});
}else if(mode==='plan-shape'){
  ok('a17-plan-help');
  for(const n of [1,2,3]){
    const original=JSON.parse(fs.readFileSync(path.join(U,'inputs',`plan-${n}.json`),'utf8'));
    const {notes,...supported}=original;
    json(`plan-${n}-cli`,supported);
  }
}else if(mode==='direction'){
  ok('a04-init');
  const quote='已选择：以虚构东岸/西岸渡口为场景，许蓉开场限知；旧箱属于东岸修理合作点，周岸为前一借用人、沈长年为下一借用人、沈禾为受委托代领人；两笔二百元押金分开核实，上一笔退原交款人；末班二十点五十分开、二十点四十五分停检、候船室二十一点十分关门；首章箱体观察拟用“箱盖右后角画着一支黄漆箭头，箭头朝向提手。”，第三章以推正偏口合箱兑现；周岸留在东岸，只能通过实际转述得知西岸归还。';
  json('decision-direction',{expected_revision:revision(),operation_id:'U_A_DIRECTION',author_evidence:evidence('研究/试验代理选择-A.md',quote,'代理选择记录第5行；非人类消息；授权见验收prompt-A原文.md第7、9行'),decision:{id:'D_U_DIRECTION',topic:'隔离试验的场景与关系编排',status:'confirmed',options:['合作点前后两次借用、沈禾代领的现实场景'],adopted_items:['采用上述代理选择作为本测试的写作计划；不是人类作者逐字指定','温暖克制、许蓉开场限知；普通劳动推进','前借周岸、后借沈长年、代领沈禾；两笔押金分开','黄漆箭头为首章观察候选，第三章用推正偏口兑现'],excluded_items:['外观直接证明所有权','父亲旧事自动全部查明'],unresolved_items:['父亲离开渡口的缘由未选定','实际观察与约定须待正文出现后登记'],effective_range:{from:1,to:3}}});
}else if(mode==='unresolved'){
  ok('a10-decision-direction');
  const quote='未决：沈长年年轻时离开渡口的具体缘由，不选真相；是否在收束时给父女增加一句关于旧事的对白，保留为候选，不承诺解释全史。具体逐句措辞仍以授权范围内实际正文为准。';
  json('decision-unresolved',{expected_revision:revision(),operation_id:'U_A_UNRESOLVED',author_evidence:evidence('研究/试验代理选择-A.md',quote,'代理选择记录第7行；代理未决项，非人类消息'),decision:{id:'D_U_OLD_STORY',topic:'父亲旧事的保留方式',status:'candidate',options:['只保留一次停顿或未答的日常问话','不在此次故事展开旧事'],adopted_items:[],excluded_items:[],unresolved_items:['离开渡口的缘由不选真相','收束是否提及一句旧事，仍待实际情节决定'],effective_range:{from:1,to:3}}});
}else if(mode==='workflow'){
  for(const label of ['a10-decision-direction','a11-decision-unresolved','a12-volume-v1','a13-volume-v2','a14-plan-1','a15-plan-2','a16-plan-3'])ok(label);
  const quote='4. 不合章，不record，不写第3段，不写第2/3章。保存本地交接U/交接-A首停.md，列W、实际工具身份/路径、workflow、当前revision、写前模板、片段路径/SHA、实际未完成项、原会话ID若可从外部得知（不知道就不编造）。正常结束进程，供同ID恢复。不要把停点自动变成新授权。';
  json('workflow-trial-a',{expected_revision:revision(),operation_id:'U_A_TRIAL_FIRST_STOP',author_evidence:evidence('研究/验收prompt-A原文.md',quote,'本次用户验收prompt第11—15行，quote为第15行；无作者消息ID'),workflow:{stage:'trial',task:'《东岸末班船》隔离工具验收A：规划已备，有限试写整体1—3；本进程仅第1章前两个分段，完成实读修复及交接后正常结束，禁止合章/record/第3段/第2—3章',authorization:{allowed_actions:['discuss','plan','draft'],draft_range:{from:1,to:3},revise_range:null,stop_conditions:['本进程只写分段/0001/v1/01.md、02.md，每段约1100—1500正文汉字，完整实读、修复高置信问题并保存交接后结束','本进程不合章、不record、不写第3段、不写第2/3章；下一进程先核对同ID、交接、当前workflow、真实片段和写前模板，不以停点自动取得新授权','后续整体试写完成第3章后复盘；修订、连读、暂停、负向第4章和导出按原prompt后续编排执行，本进程均不执行']},planning:{positioning:{status:'draft',refs:['设定/作品定位.md','设定/文风.md','设定/权威规则.md','设定/人物.md'],unresolved_ids:[]},structure:{status:'draft',refs:['大纲/全书骨架.md'],unresolved_ids:['D_U_OLD_STORY']},volume:{status:'draft',refs:['大纲/分卷/V1.json','大纲/分卷/V2.json'],unresolved_ids:[]},outline:{status:'draft',refs:['大纲/单元/0001.json','大纲/单元/0002.json','大纲/单元/0003.json'],unresolved_ids:[]}}}});
}else throw Error('Unknown one-off preparation mode');
console.log(JSON.stringify({ok:true,mode,state_revision:revision(),note:'New inputs only; no state edits and no source refresh after drafting'}));
