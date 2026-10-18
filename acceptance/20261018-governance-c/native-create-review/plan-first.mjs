import {base,project,json,cli} from './helpers.mjs';
const plans=[
 {unit:1,title:'木架空着一层',goal:'林禾接收渡口仓房旧箱并决定如何暂存',change:'木箱和钥匙分别由林禾保管，约定等认领而不随意送人',beats:['老邵手推车送来木箱与旧借物簿','林禾记外观与钥匙，看到箱底蓝布补角','周梅路过望见黄漆，林禾没有招呼她立即领走'],cast:['林禾','老邵','周梅'],arc_id:'A1',recall_ids:[],forbidden:['不证明旧箱归谁','不把蓝布来源写成已知']},
 {unit:2,title:'先放一夜',goal:'面对周梅认领，林禾查清现有描述够不够交箱',change:'不凭黄漆和共同记忆交付，周梅留下地址而不等在门口',beats:['周梅带母亲家用清单认领','两人对着黄漆和清单，林禾决定暂留','林禾承认也有可能认错，约好明天见老邵'],cast:['林禾','周梅'],arc_id:'A1',recall_ids:['O_BOX','O_KEY','OBS_BLUE'],forbidden:['不认定贪占','不把清单当排他证据']},
 {unit:3,title:'垫高两块砖',goal:'雨水进屋时保护旧箱，让周梅参与而非被挡在外面',change:'共同移箱，查借物簿得有限来历，约好次日解释蓝布',beats:['初秋阵雨，周梅返回帮垫箱','林禾把柜台内侧让给周梅，两人扶箱离墙','林禾翻老邵留下的旧簿，找到徐兰缝纫物一行，箱仍不打开'],cast:['林禾','周梅'],arc_id:'A1',recall_ids:['O_BOX','OBS_BLUE','T_CLAIM'],forbidden:['不以借物簿直接完成归属认定','不让纸样在开箱前出现']}
];
for(const p of plans){Object.assign(p,{setting_refs:['设定/人物声音.md','大纲/全书骨架.md'],research_refs:[]});const f=`${base}/inputs/plan-${p.unit}.json`;json(f,p);cli(`native-one-0${6+p.unit}-plan-${p.unit}`,['plan','--project',project,'--input',f]);}
cli('native-one-10-context-1',['context','--project',project,'--unit','1','--out','.writer/drafts/context-1-before-writing.json']);
cli('native-one-11-template-1',['record-template','--project',project,'--unit','1','--draft','正文/0001-木架空着一层.md','--out','.writer/drafts/record-1-before-writing.json']);
