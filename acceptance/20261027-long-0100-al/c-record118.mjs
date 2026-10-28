import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p,'utf8')),put=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const t=read('研究/AL-c-record118-template.json'),c=read('../commands/c-020-context118/stdout.raw.txt'),length=read('../session-c-length118-final.json');
if(JSON.stringify(t.source_hashes)!==JSON.stringify(c.source_hashes))throw Error('sources differ');
for(const [src,dst,hash] of [[t.draft,'分段/AL-c-0118/initial-product-output.md','e27c0fe68d4ab30c9bc4cfc0e540d13917808cb608ec62ba3fb9a2f2956bcd3f'],['正文/V18-带着回话往下做/0118-先夹自己想吃的-复读稿.md','分段/AL-c-0118/intermediate-product-output.md','a8d4f56c1bf766c7600ba575bd545655be6a0cfe7285f62fd9d6102f5d499e73']]){
 for(const p of [src,dst])if(!path.resolve(p).startsWith(path.resolve('.')+path.sep))throw Error('outside');
 if(sha(fs.readFileSync(src))!==hash||fs.existsSync(dst))throw Error('archive mismatch');fs.renameSync(src,dst);
}
t.draft=length.draft;
put('../session-c-118-comparison.json',{initial:read('../session-c-length118.json'),intermediate:read('../session-c-length118-reread.json'),chosen:length,complete_read_all_three:true,source_hashes_refreshed:false});
put('研究/AL-c-context118-omitted-review.json',c.continuity.recall.omitted_ids.map(id=>({id,disposition:id==='I_PRICE_EXAMPLE_109'?'109已完整实读；例价仍自用，未交易':id==='T_PAGE_READ71_113'?'113/114已实读，原新约完成不重开':id==='T_SELF_WALK70_112'?'112/113已完整实读，旧晨走已兑现':'本章未调用，不据省略推解决，原状态及未知保留'})));
t.summary='72日晚承接117鱼入锅，沈亲做饭菜、取出砂菜梗/延蒸令鱼偏老，葛只按请挪垫/留路不接灶；两人按各自口味实吃且各添半碗，葛选鱼尾并吃掉临放小块。沈只口述昨日扶伞/湿裤，葛本次才听，不知修成；桥边页想取未取未读。葛主动用本人手机请拍两张蓝衫短发照，沈拍后交回，葛两张自留未传沈。19:15起身、19:18楼口分开，沈仅见过街角前未证到家；返屋丢头骨/砂菜、余米冷藏并洗餐具。工作修后仍仅自测不发，无新单款/公开/旧谜新证。';
t.changes.characters={沈禾:'第118章：72日晚本人完成饭菜/当次相处，承认鱼偏老但不撤整顿；只请葛挪桌垫留通道，未接其做饭。两人各添半碗实吃，本人晚后洗碗/余米冷藏；口述115扶伞/湿裤但没取原纸。按葛本人要求借其手机拍两张后交回，不留副本。19:18楼门外分开只见街角前，不补到家；本人回屋保留工作修后仅自测，不再发或求认可，无新订单。；此前有效状态及知识按原章时点保留：'+c.snapshot.characters.沈禾,葛筠:'第118章：本人当晚沈家只主动帮挪垫/扶盘边/让路，不默认接灶；承认鱼略老仍选自己要的尾部、吃掉临放一小块并添半碗饭吃净。只本次从沈口述知71日扶伞/湿裤，非现场亦未读桥页。主动请沈用本人手机拍坐/站两张后收回，自留不传沈；19:15起身、19:18楼口自离，后续到家未知。蓝衫本人穿/小包自己带，不获沈工作价或私人稿全文。；此前有效状态及知识按原章时点保留：'+c.snapshot.characters.葛筠};
t.changes.timeline_append=['第72日18:10后—19:18后：沈家当晚鱼蒸偏老/砂菜剔除，两人实吃各添半碗；葛从沈口述才知昨日扶伞湿裤，未读桥页。本人手机请沈拍两张蓝衫短发照后收回私留；19:18楼口分开不补到家，沈返屋丢头骨/砂菜、余米冷藏/洗碗，修后工作版仍未发。'];
const e=(unit,quote)=>({unit,quote}),ledger=t.changes.ledger;
const oldKnown=id=>Object.fromEntries(Object.entries(c.continuity.characters).filter(([k,v])=>v[id]).map(([k,v])=>[k,v[id]]));
ledger.T_DINNER72_117={statement:'72日当晚新邀请18:10到场后，沈做饭、葛按明确请求有限帮挪垫，双方实吃各添半碗，19:18楼口分开；当次晚饭完成不预定再约。',status:'resolved',reader_known:'118实际吃饭/拍照/按时分开完成本次邀请；非今后常例、非工作认可。',character_known:{沈禾:'本人买做并吃完当次饭，见葛吃饭/拍照/离楼口，未知其到家。此前117邀约与到场事实保留。',葛筠:'本人接受并到场/实吃，不变成默认厨工或读者；按自己时段走。此前117口味/时间和不接灶要求保留。'},evidence:[e(118,'两人将各自碗里最后一点饭吃净'),e(118,'七点十八分，两人在楼门外分开。')]};
ledger.P_DINNER_FOOD72_117={status:'resolved',previous_holder:'沈禾',custody:{holder:'沈禾',location:'沈家当次餐食已两人吃；头骨/砂菜在垃圾袋，少量余米在冷藏小盒',condition:'鱼熟但偏老，肉吃完；当次青菜除砂梗后吃完，各自碗饭吃净，不以垃圾当可复用食材，无对外打包'},evidence:[e(118,'桌上只剩鱼头和骨'),e(118,'骨和头收进垃圾袋，有砂的菜梗也丢掉'),e(118,'米饭剩一点，她自己分到小盒，稍散热便收进冷藏')]};
ledger.P_BLUE_SHIRT72_117={previous_holder:'葛筠',custody:{holder:'葛筠',location:'本人穿着离沈家，19:18楼口后亲见到街角前',condition:'同一灰蓝衫，袖口水淡/折痕仍有；未转交未新买，不补离场后到家'},character_known:{...oldKnown('P_BLUE_SHIRT72_117'),沈禾:oldKnown('P_BLUE_SHIRT72_117').沈禾+'；118本次亲拍并见她穿走，仅到街角前。',葛筠:oldKnown('P_BLUE_SHIRT72_117').葛筠+'；118本人说出门领口顾虑，实穿并主动请留照片。'},evidence:[e(118,'葛将小包带换到另一侧，衫下摆在风里离开腰边一点')]};
ledger.P_BLUE_PHOTOS72_118={type:'object',statement:'72日晚应葛本人要求，沈用葛本人手机实际拍成坐着与站着两张蓝衫短发照片；两张均留葛相册，未传沈。',status:'active',cast:['沈禾','葛筠'],custody:{holder:'葛筠',location:'本人手机相册，手机装回本人小包后带离楼口',condition:'第一张未删、第二张也留；沈未留副本，场内未见发送；后续外发/备份未知，不推云端'},reader_known:'这次只为葛本人看看衣发，不是公开/录音/私人稿授权。',character_known:{沈禾:'亲借葛手机拍两张并交回，获葛只先自己留看答复，不接收照片。',葛筠:'本人提出并看两张，选择自留先看，不交沈复制。'},evidence:[e(118,'葛用自己的手机点开相机，递给沈'),e(118,'沈把手机交回葛手里，两张都留在她的相册。'),e(118,'葛摇头，说先在自己这里，哪天想给人看，自己找。')]};
ledger.I_BRIDGE_TOLD72_118={type:'fact',statement:'72日晚沈只口述71日帮陌生男人扶自家伞/裤膝湿及铁套在毛巾内的经历，葛从本次口述才知；原页未取未读，后续修伞仍未知。',status:'active',cast:['沈禾','葛筠'],character_known:{沈禾:'本人71日现场经历与115亲写已知；今只口述，不交桥边页。',葛筠:'仅本次听沈讲扶伞/湿裤/湿砂，不是71日现场见证、不知男人后来修成与否；未读桥边稿。'},evidence:[e(115,'原来只是湿砂。'),e(118,'找见一点亮的，结果只是湿砂'),e(118,'答自己走时还没有，后来不知道。')]};
ledger.I_MEAL_ECHO72_118={type:'fact',statement:'111葛口述先前剩饭最好一块最后倒的遗憾，在118获得本日有限回应：主动选鱼尾/吃临放小块，沈没有把吃饭变成劝诫；非首次吃完或永久习惯改善。',status:'active',cast:['沈禾','葛筠'],evidence:[e(111,'专门留的，最后专门倒。'),e(118,'葛先把那块吃掉'),e(118,'我就是要那头。你别给我换了。')]};
t.draft_review={reviewer:'session-c同会话知情模型自检',report:'审查/AL-c-118-完整实读与纲文回对.md',draft_sha256:length.sha256,report_sha256:sha(fs.readFileSync('审查/AL-c-118-完整实读与纲文回对.md'))};
put('研究/AL-c-record118.json',t);console.log('record118 prepared with frozen sources, reports and historical drafts preserved');
