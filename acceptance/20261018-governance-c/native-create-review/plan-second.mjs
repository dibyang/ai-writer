import {base,project,json,readJson,state,cli} from './helpers.mjs';
const s=state();
json(`${base}/inputs/review-1-3.json`,{from:1,to:3,kind:'model-self-review',report:'审查/1-3连读.md',source_hashes:Object.fromEntries(s.units.map(u=>[u.draft,u.sha256]))});
cli('native-one-26-review-1-3',['review','--project',project,'--input',`${base}/inputs/review-1-3.json`]);
const plans=[
 {unit:4,title:'盖子打开以后',goal:'老邵到场说明来历后，三人共同开箱，检验前卷蓝布线索',change:'来历获当事人说明；纸样首次可见，周梅选择先留箱晾修而非立刻运走',beats:['老邵承认曾将两只黄箱记混，当面解释簿中文字','林禾开锁，在场者一起看蓝布裁口与箱内余料、纸样','周梅说明母亲缝布习惯，选择先晾箱，不决定纸样发给谁'],cast:['林禾','周梅','老邵'],arc_id:'A2',recall_ids:['O_BOX','O_KEY','O_BOOK','OBS_BLUE','OBS_REGISTER','T_BLUE','T_CLAIM'],forbidden:['不逆改蓝布可见事实','不把记忆说成司法鉴定','不预定纸样未来用途']},
 {unit:5,title:'抽屉留条缝',goal:'清点工具时由林禾练习交出核对的主动权',change:'同样桌边核查，这次周梅作决定；钥匙经真实动作仍回林禾暂管，双方约次日交箱',beats:['周梅带修箱用的小锤与螺丝刀，晾干后处理松木条','林禾列清物品，周梅改为只记拿走的','周梅明确今夜钥匙仍由林禾保管；保留指定控制句'],cast:['林禾','周梅'],arc_id:'A2',recall_ids:['O_BOX','O_KEY','O_PATTERN','R_LISTEN'],forbidden:['不修布袋里里控制句','不创造大冲突','不开启7章授权']},
 {unit:6,title:'一碗面的位置',goal:'把木箱和钥匙交到周梅手里，并给旧争执一个有限回应',change:'周梅领走箱与钥匙，林禾承认当年伞的误怪；两人能一起吃面，但未来安排未定',beats:['纸样留在箱里，双方明确取走清单','真实交出箱钥匙，周梅自行锁箱搬至改衣摊','林禾说起旧伞，周梅给有限回应，费用留待林秀回来；暂停正文'],cast:['林禾','周梅'],arc_id:'A2',recall_ids:['O_BOX','O_KEY','O_PATTERN','O_COPY','T_CLAIM','R_LISTEN'],forbidden:['不强行全然和好','不决定留镇常住或长期费用','不写第7章']}
];
for(const p of plans){Object.assign(p,{setting_refs:['设定/人物声音.md','大纲/全书骨架.md'],research_refs:[]});const f=`${base}/inputs/plan-${p.unit}.json`;json(f,p);cli(`native-one-${23+p.unit}-plan-${p.unit}`,['plan','--project',project,'--input',f]);}
cli('native-one-30-context-4',['context','--project',project,'--unit','4','--out','.writer/drafts/context-4-before-writing.json']);
cli('native-one-31-template-4',['record-template','--project',project,'--unit','4','--draft','正文/0004-盖子打开以后.md','--out','.writer/drafts/record-4-before-writing.json']);
