import {base,project,readJson,json,cli} from './helpers.mjs';
const x=readJson(`${project}/.writer/drafts/record-4-before-writing.json`),e=quote=>[{unit:4,quote}];
x.summary='老邵解释徐兰把自有箱存入仓房，承认与另一只黄箱记混。三人开箱，周梅辨认回针和余料裁口，蓝布线索有了有限解释；纸样无名字、用途未定。周梅决定先留箱晾修，老邵取走旧簿，钥匙仍归林禾暂管。';
x.changes={characters:{林禾:'便民处；听老邵说明并实际开锁，知道纸样未标名；暂留箱晾修；钥匙收抽屉，旧簿已还老邵',周梅:'便民处后准备取工具；听老邵承认混箱，认出母亲缝布习惯，认为余料相接；纸样给谁不确定；选择先晾箱',老邵:'带旧簿离开便民处；承认混记两只黄箱，说明徐兰自带此箱存放；未断定纸样用途'},timeline_append:['第二天上午：老邵到场说明混箱与存放来历，林禾开锁，周梅核蓝布余料并决定晾修；旧簿还老邵。'],ledger:{
 O_BOX:{custody:{holder:'林禾',location:'便民处垫高长凳',condition:'已开锁、支盖晾风；箱底微潮右木条松'},reader_known:'老邵说明系徐兰带来，周梅认领但暂留晾修',character_known:{林禾:'听说明并开箱，暂留晾修',周梅:'认出母亲布料和针法，选择先晾',老邵:'自述记混公家另一黄箱'},evidence:e('箱底木条摸着有些潮，右边一根还松了。')},
 O_KEY:{custody:{holder:'林禾',location:'柜台抽屉内布袋',condition:'已成功开挂锁；钥匙收回，锁在箱旁'},reader_known:'开锁后仍由林禾保管',character_known:{林禾:'实际开锁并收回钥匙',周梅:'在场看到开锁',老邵:'在场指导按盖开锁'},evidence:e('林禾把钥匙收回布袋，仍放抽屉。')},
 O_BOOK:{previous_holder:'林禾',custody:{holder:'老邵',location:'离开便民处，腋下携带',condition:'原簿收回'},evidence:e('林禾把簿子递给老邵，看着他夹在腋下带走。')},
 I_BOX_ORIGIN:{type:'fact',statement:'老邵自述此箱由徐兰带来存缝纫物，他曾与公家另一黄箱记混',status:'active',cast:['林禾','周梅','老邵'],tags:['解释','关联OBS_REGISTER'],reader_known:'当事人解释与纸面记录合在一起支持本次交接，不等同独立司法证明',character_known:{林禾:'现场听见老邵解释',周梅:'现场听见，仍追问迟迟未叫她的原因',老邵:'承认自己混记'},evidence:e('“我把它跟公家的那只记混了。也是黄的，后来拿去装救生绳。这只，是你妈自己带来的。”')},
 I_BLUE:{type:'fact',statement:'周梅认出母亲在补角卷边回针三趟的习惯，箱内余料裁口与外补角轮廓可相接',status:'active',cast:['林禾','周梅'],tags:['解释','关联OBS_BLUE'],reader_known:'蓝布不再只有颜色关联，仍是现场辨认，非鉴定',character_known:{林禾:'扶箱看见周梅用余料比对，并听针法记忆',周梅:'实际看针法和裁口，认为是母亲的料'},evidence:e('两边参差的裁口隔着木板边缘，能看出相接的轮廓。')},
 T_BLUE:{status:'resolved',reader_known:'前卷蓝布线索由回针与余料比对得到生活层面的兑现',character_known:{林禾:'见比对并听周梅说明',周梅:'将布认作母亲的余料'},evidence:e('昨天只是蓝颜色，今天周梅终于把那片布叫作母亲留下的料。')},
 T_CLAIM:{status:'partial',reader_known:'来历获当事人说明，认领方向明确，箱尚未搬走',character_known:{林禾:'知道周梅选择先留箱晾修',周梅:'同意认领但暂不搬',老邵:'已当面说明旧簿和混记'},evidence:e('林禾问要不要找车，周梅说先别搬，关回去明天得生霉。')},
 O_PATTERN:{type:'object',statement:'箱内首次发现的一叠旧纸样及硬纸板',status:'active',cast:['林禾','周梅'],custody:{holder:'林禾',location:'便民处干燥柜台，硬纸板长边靠墙',condition:'脆，未强行压平；最上为无名童背心纸样'},reader_known:'无名，周梅猜给女儿但未认定',character_known:{林禾:'看见纸样并听周梅保留猜测',周梅:'未确定给谁，要求避免折洞'},evidence:e('她没把纸展开压平，连着底下的硬纸板一起取出，搁在柜台干燥的地方。')},
 T_PATTERN:{type:'thread',statement:'无名童背心纸样原给谁、是否复制留给更多人尚未确定',status:'intentional-open',cast:['林禾','周梅'],reader_known:'周梅猜给女儿又自我保留；未来使用未决定',character_known:{林禾:'听到不确定判断',周梅:'知道没有名字，无法确定原用途'},evidence:e('周梅说那像是给她女儿改的，话到一半又停下：“也不一定，没写名字。”')}
}};
json(`${base}/inputs/record-4-complete.json`,x);
cli('native-one-32-preview-4',['record-preview','--project',project,'--input',`${base}/inputs/record-4-complete.json`]);
cli('native-one-33-record-4',['record','--project',project,'--input',`${base}/inputs/record-4-complete.json`]);
cli('native-one-34-check-4',['check','--project',project]);
cli('native-one-35-context-5',['context','--project',project,'--unit','5','--out','.writer/drafts/context-5-before-writing.json']);
cli('native-one-36-template-5',['record-template','--project',project,'--unit','5','--draft','正文/0005-抽屉留条缝.md','--out','.writer/drafts/record-5-before-writing.json']);
