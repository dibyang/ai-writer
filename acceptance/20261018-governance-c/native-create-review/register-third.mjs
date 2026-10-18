import {base,project,readJson,json,cli} from './helpers.mjs';
const x=readJson(`${project}/.writer/drafts/record-3-before-writing.json`),e=quote=>[{unit:3,quote}];
x.summary='雨夜墙根进水，周梅带砖来帮林禾把箱子移到长凳垫高。两人读借物簿见徐兰黄漆箱存缝纫物，但借存方向不明；免提电话约老邵明早八点半到，箱锁未开。林禾邀周梅端菜来分饭。';
x.changes={characters:{林禾:'便民处；与周梅移箱，看到旧簿文字，听老邵约明早八点半；开始让周梅参与保管动作，留饭等菜',周梅:'回家端菜；已看箱底蓝布，认为像母亲围裙布但承认同店布不能定主；亲读簿中母名，电话约老邵',老邵:'县里接免提电话；答应次日八点半到便民处，尚未当面核簿'},timeline_append:['第一天雨夜：林禾周梅共同移箱防潮，读借物簿并电话约见老邵，准备分饭。'],ledger:{
 O_BOX:{custody:{holder:'林禾',location:'便民处离墙长凳，砖与旧毛巾垫高',condition:'挂锁未开；暂避墙根渗水'},evidence:e('两人把砖摆平，又在上面铺了折叠的旧毛巾。')},
 O_BOOK:{custody:{holder:'林禾',location:'便民处抽屉，读后收好',condition:'读到徐兰一行；含义待老邵解释'},reader_known:'出现徐兰黄漆箱存缝纫物一行',character_known:{林禾:'亲读文字，但不知借走借来',周梅:'亲读母亲姓名，等老邵说明'},evidence:e('林禾收好簿子，把湿抹布拧进水桶，周梅扶着桶沿，免得她连桶一起提起来。')},
 OBS_REGISTER:{type:'observation',statement:'借物簿折角页写徐兰，黄漆箱一个，存缝纫物',status:'active',cast:['林禾','周梅'],reader_known:'原簿文字有相关记载，但方向未明',character_known:{林禾:'亲读，不知道借走还是借来',周梅:'亲读，确认母名'},evidence:e('林禾翻到一张折角页，上面写着“徐兰，黄漆箱一个，存缝纫物”。')},
 T_BLUE:{type:'thread',statement:'蓝布补角是否与徐兰的围裙旧布有关',status:'pending',cast:['林禾','周梅','老邵'],due_unit:4,reader_known:'周梅只说像，未认定',character_known:{林禾:'听周梅说像围裙布，也听见她否认凭颜色定主',周梅:'看见布色，尚未核对具体裁缝痕迹'},evidence:e('周梅说颜色像母亲以前做围裙剩的，随即又摇头：“镇上买布都去那一家，光看蓝色，算不了。”')},
 T_CLAIM:{status:'partial',reader_known:'有簿册相关记录，等老邵当面说明；明早八点半见',character_known:{林禾:'知道簿中文字与时间，尚无借存方向',周梅:'见母名但未领箱',老邵:'已答应到场，须戴眼镜核簿'},evidence:e('老邵在电话里应了，说八点半到，别忙着撬，锁能用。')},
 R_LISTEN:{status:'partial',reader_known:'从认领时隔柜台询问走到共同防潮、约着分饭',character_known:{林禾:'接受周梅帮忙并留饭',周梅:'帮忙移箱，准备端菜分饭'},evidence:e('她留了一半饭在锅里，让周梅回去端菜。')}
}};
json(`${base}/inputs/record-3-complete.json`,x);
cli('native-one-23-preview-3',['record-preview','--project',project,'--input',`${base}/inputs/record-3-complete.json`]);
cli('native-one-24-record-3',['record','--project',project,'--input',`${base}/inputs/record-3-complete.json`]);
cli('native-one-25-check-3',['check','--project',project]);
