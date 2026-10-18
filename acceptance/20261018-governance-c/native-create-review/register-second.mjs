import {base,project,readJson,json,cli} from './helpers.mjs';
const x=readJson(`${project}/.writer/drafts/record-2-before-writing.json`),e=quote=>[{unit:2,quote}];
x.summary='周梅凭母亲清单和黄漆记忆认领，承认不记得箱底。林禾守约等老邵，承认自己也可能想错；周梅带回原清单，留下抄纸和联系方式，约明早再看。';
x.changes={characters:{林禾:'便民处；看过周梅家清单，仍不能确认归属；把抄纸夹在寄存本，承诺明早叫周梅；钥匙未取',周梅:'回家；说明母亲在箱中放剪刀布头的记忆，不记得箱底；原清单带回，留下抄纸与现用电话；感到被怀疑但约好再来'},timeline_append:['第一天傍晚：周梅认领，林禾未凭清单和黄漆交箱；双方约第二天等老邵到场。'],ledger:{
 T_CLAIM:{status:'partial',reader_known:'周梅清单有黄漆木箱，但无年月地点；认领尚未完成',character_known:{林禾:'见到清单，不足以独自交箱；等老邵',周梅:'明天见老邵，不记得箱底'},evidence:e('没有年月，也没写箱子后来放在哪里。')},
 OBS_LIST:{type:'observation',statement:'周梅家清单最下面写黄漆木箱，字旁有小钩，无年月和去处',status:'active',cast:['林禾','周梅'],reader_known:'清单文字可见，不能单凭它确认此箱',character_known:{林禾:'在灯下读过原件',周梅:'提供家存原件并带回'},evidence:e('纸上写着米缸、棉被，最下面是黄漆木箱，字旁有个小钩。')},
 O_COPY:{type:'object',statement:'周梅抄写认领描述并留下联系方式的纸',status:'active',cast:['林禾','周梅'],custody:{holder:'林禾',location:'寄存本夹页',condition:'抄纸，非原清单'},evidence:e('她走后，林禾把抄纸夹进寄存本，没压在箱上。')},
 R_LISTEN:{type:'relationship',statement:'林禾承认自己可能想错，周梅仍愿次日再来',status:'partial',cast:['林禾','周梅'],reader_known:'有小幅缓和，未和好',character_known:{林禾:'知道周梅不想被当成捡便宜',周梅:'听见林禾承认自己也不了解箱子'},evidence:e('“也可能是我想错了。你知道这箱，我不知道。”')}
}};
json(`${base}/inputs/record-2-complete.json`,x);
cli('native-one-18-preview-2',['record-preview','--project',project,'--input',`${base}/inputs/record-2-complete.json`]);
cli('native-one-19-record-2',['record','--project',project,'--input',`${base}/inputs/record-2-complete.json`]);
cli('native-one-20-check-2',['check','--project',project]);
cli('native-one-21-context-3',['context','--project',project,'--unit','3','--out','.writer/drafts/context-3-before-writing.json']);
cli('native-one-22-template-3',['record-template','--project',project,'--unit','3','--draft','正文/0003-垫高两块砖.md','--out','.writer/drafts/record-3-before-writing.json']);
