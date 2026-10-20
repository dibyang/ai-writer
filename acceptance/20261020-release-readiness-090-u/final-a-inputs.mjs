import fs from 'node:fs';import crypto from 'node:crypto';
const U='D:/work/other/ai-writer/acceptance/20261020-release-readiness-090-u',W=U+'/scenario-final/东岸末班船';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const put=(file,obj)=>fs.writeFileSync(file,JSON.stringify(obj,null,2)+'\n',{flag:'wx'});
const dest=W+'/.writer/drafts';fs.mkdirSync(dest,{recursive:true});
const mode=process.argv[2];
if(mode==='plans'){
 fs.copyFileSync(U+'/final-prompt.md',W+'/研究/最终测试原始prompt.md',fs.constants.COPYFILE_EXCL);
 const refs=['设定/人物与声音.md','大纲/全书大纲.md'];
 const volumes=[
 {id:'V1',title:'灯下认箱',start:1,end:2,promises:['找对旧工具箱的借用、代还和受托收还关系','形成能在关门前执行的归还安排'],constraints:['领用安排不算已经交箱','押金承诺不算退款','原箱由许蓉暂管至实际换手'],reserved:['实际归还与押金交付留到第二卷','沈父与梁伯旧事可未明'],arcs:[{id:'A1',start:1,end:2,goal:'从口头取箱要求查到可执行的收还关系',payoff:'梁伯明确授权周岸代收、退押金；周岸须实际往返',forbidden:['提前写成箱钱两清','以一个可见特征断定排他归属']}]},
 {id:'V2',title:'门关以前',start:3,end:3,promises:['将原箱实际交到受托收还人周岸手中','清点借具并实际退还八十元押金','兑现首章箱体观察'],constraints:['开箱清点、交箱、交钱分写','逐人知情须有来源','有限收束'],reserved:['父亲未说的旧事不强行交代'],arcs:[{id:'A2',start:3,end:3,goal:'完成可见的归还与生活收尾',payoff:'原箱、押金和收还凭据各到应到的人手中',forbidden:['逆改首章观察','把电话许诺当作现金交付','强行父女大和解']}]}
 ];
 for(const v of volumes)put(dest+'/final-volume-'+v.id+'.json',v);
 const plans=[
 {unit:1,title:'灯下的箱子',goal:'在候船室关门前为旧工具箱找到能接着办的归还路径',change:'三个原先各忙各的人对上同一件借物，约定核实真正收还关系；箱仍由许蓉暂管',beats:['许蓉收拢候船室散物，从雨衣旁移出旧铁箱；写出可见原句：箱盖左后角有一块月牙形的白漆。','周岸带自己的帆布工具包来修西门插销，说明自己只是先前替人把箱挪进候船室；信息须在现场说出','沈禾带父亲的布袋和押金纸条到场，先想直接把箱提去修理铺，因另一层传话才停下','通过实物、借具条和真实通话逐步核同一只箱；保留打不通、听错或需要补问带来的实际行动，不反复讲规则','许蓉安顿候船旅客、周岸修门、沈禾送备货单等生活事项与核箱并行，等待有实际代价','本章末把联系落到一个可继续的动作，未完成梁伯委托与押金退款；原物位置写清'],cast:['许蓉','周岸','沈禾'],setting_refs:refs,research_refs:[],forbidden:['本章不完成实际归还或退款','不要将父亲往事补成全史','不要把箱体特征写成秘密编号或唯一身份证','不把待写段落记成已发生事实'],arc_id:'A1',recall_ids:[]},
 {unit:2,title:'多跑的一趟',goal:'核清借还关系并取得真实受托收还安排',change:'梁伯明确委托周岸代收原箱并退押金，周岸去铺里取钱和凭据，留下等待的成本',beats:['接住首章实际末尾，先回读再安排通话；沈父说明借具和押金，梁伯说明谁能收还','沈禾查备货单与自家回程安排，承担这次等待的后果；不能凭空让她放下全部工作','周岸与许蓉谈一项普通维修报价，留可追溯的生活数额；不是观察或作者秘密','梁伯实际授权周岸取回原押金钱袋和还箱收据；通话内容只对实际听见的人有效','周岸离开去修理铺，许蓉保管原箱，沈禾留下纸条；卷末只写可执行安排，不写已经交钱'],cast:['许蓉','周岸','沈禾'],setting_refs:refs,research_refs:[],forbidden:['卷末不得预支第三章实际归还','周岸未返回不能知道候船室新发生的事','不借梁伯长篇电话公开父辈全史'],arc_id:'A1',recall_ids:['O_BOX_PAINT','P_TOOLBOX','T_RETURN','T_DEPOSIT']},
 {unit:3,title:'把手朝外',goal:'关门前将原箱交给真正受托领用人，并实际完成退款与凭据',change:'许蓉解除临管、周岸接箱，沈禾收到八十元与收还凭据；父亲旧事仍有限开放',beats:['回读第一卷原文、观察及卷末真实位置，周岸带实际钱袋和凭据返回','在许蓉与沈禾面前开启原箱，照借具清单清点，不用辨认箱体代替验工具','重现原句：箱盖左后角有一块月牙形的白漆。白漆位置帮助三人在挪箱时保持对同一原物的辨认；不可夸成排他证据','许蓉实际交箱给周岸，周岸把八十元交到沈禾手里，清楚处理凭据两联；从承诺到交付各有动作','周岸带箱离开去铺里，沈禾把归还凭据与退款带回；许蓉完成关门。未到场者只获实际转述范围','尾声以有限生活后果收束，不强迫全史解释和情绪大团圆'],cast:['许蓉','周岸','沈禾'],setting_refs:refs,research_refs:[],forbidden:['不改变 observation 原字、类型和 author_truth','不可把未兑现承诺写成已结清','不让父亲知道未经转述的现场','不续出第4章'],arc_id:'A2',recall_ids:['O_BOX_PAINT','P_TOOLBOX','T_RETURN','T_DEPOSIT']}
 ];
 for(const p of plans)put(dest+'/final-plan-'+p.unit+'.json',p);
 console.log(JSON.stringify({ok:true,generated:5,prompt_sha256:sha(fs.readFileSync(W+'/研究/最终测试原始prompt.md'))}));
}else{
 const state=JSON.parse(fs.readFileSync(W+'/.writer/state.json','utf8'));
 const evidence={quote:'本次工具试验方案由主会话在用户“按你的建议继续”的授权内选择，不冒充人类逐项指定的人物与情节，不影响现有作品。',local_source:'研究/最终测试原始prompt.md',source_sha256:sha(fs.readFileSync(W+'/研究/最终测试原始prompt.md')),locator:'本次收到的用户任务，第4自然段首句；未获原生会话或消息ID',recorded_by:'本次原生Codex执行代理；在用户试验授权内作选择，非人类逐项指定'};
 const input={expected_revision:state.revision,operation_id:'final-a-'+mode,author_evidence:evidence};
 if(mode==='chosen')input.decision={id:'D_FINAL_EXECUTION',topic:'本次试验代理已选方案与细节',status:'confirmed',options:['在授权内执行眼前归还故事'],adopted_items:['代理选定：三章两卷、温暖克制的现实归还故事；不是人类逐项指定','代理选定：沈父借箱，沈禾代还，许蓉临管，周岸须获梁伯明确委托后代收','代理选定：八十元押金，原物与退款分开兑现','代理选定：首章可见箱体观察，第三章跨卷实际使用；父亲全史保留'],excluded_items:['犯罪反转','通过编造人类消息ID证明采纳'],unresolved_items:['父亲旧交背景不承担本故事闭合'],effective_range:{from:1,to:3}};
 else if(mode==='candidate')input.decision={id:'D_FINAL_CANDIDATE',topic:'末章父亲是否到场与生活尾声候选',status:'candidate',options:['沈父亲自到场','沈禾带回收据即可','点心铺热汤尾声'],adopted_items:[],excluded_items:[],unresolved_items:['沈父亲自到场尚未采纳，不安排他的交通或现场知情','热汤尾声仅候选，依正文节奏取舍'],effective_range:{from:1,to:3}};
 else if(mode==='trial'){
 input.author_evidence.quote='本进程只做到首停：';
 input.author_evidence.locator='本次用户任务的“本进程只做到首停”及其1—5项；同时参照“完整测试授权”段落';
 input.workflow={stage:'trial',task:'最终包原生创作试验：总范围1—3；当前进程仅写第1章v1前两个片段后首停，等待根会话核验再同ID恢复',authorization:{allowed_actions:['discuss','plan','draft'],draft_range:{from:1,to:3},revise_range:null,stop_conditions:['当前进程写完分段/0001/v1/01.md和02.md并全文自检即停，禁止03、合章、record及第2/3章','首停交接保存后正常结束，等待根会话核验再同ID恢复；不能凭总范围自动越过首停','第3章完成后暂停复盘；后续追溯修订、fresh审查、仅discuss和导出按完整测试授权分阶段执行']},planning:{positioning:{status:'adopted',refs:['设定/作品定位.md','设定/文风.md','设定/权威规则.md','设定/人物与声音.md','研究/试验选择说明.md'],unresolved_ids:[]},structure:{status:'adopted',refs:['大纲/全书大纲.md'],unresolved_ids:[]},volume:{status:'adopted',refs:['大纲/分卷/V1.json','大纲/分卷/V2.json'],unresolved_ids:[]},outline:{status:'adopted',refs:['大纲/单元/0001.json','大纲/单元/0002.json','大纲/单元/0003.json'],unresolved_ids:[]}}};
 }else throw Error('Unknown input mode');
 put(dest+'/final-'+mode+'.json',input);console.log(JSON.stringify({ok:true,mode,expected_revision:state.revision,path:dest+'/final-'+mode+'.json'}));
}
