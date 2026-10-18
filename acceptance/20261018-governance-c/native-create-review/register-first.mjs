import fs from 'node:fs';
import {base,project,readJson,json,cli,sha} from './helpers.mjs';
const template=readJson(`${project}/.writer/drafts/record-1-before-writing.json`);
// Negative sample keeps the untouched product template, including empty summary.
cli('native-one-12-empty-summary-rejected',['record-preview','--project',project,'--input',`${project}/.writer/drafts/record-1-before-writing.json`],{expect:1});
const e=quote=>[{unit:1,quote}];
template.summary='初秋下午老邵从渡口仓房送来锁着的黄漆木箱和旧借物簿，林禾暂收、分别保管钥匙与箱子；箱底有蓝布补角，来历未知。周梅路过认出黄漆但未提出正式认领。';
template.changes={characters:{林禾:'便民处；暂收木箱，独自保管钥匙和旧借物簿；看见蓝布但不知来历，知道老邵要求认领时叫他',老邵:'离开便民处；知道从仓房移来旧箱，不记得蓝布谁补，要求认领时在场',周梅:'经过便民处后去取皮带；看见黄漆木箱，说黄漆还在；尚未公开认领依据'},timeline_append:['初秋第一天下午：老邵从渡口仓房把旧箱和簿册交林禾暂存，钥匙进林禾柜台抽屉。'],ledger:{
 O_BOX:{type:'object',statement:'从渡口仓房送来的一只锁着的半米长黄漆木箱',status:'active',cast:['林禾','老邵','周梅'],custody:{holder:'林禾',location:'便民处木架上层',condition:'旧黄漆；左底缺角有蓝布，挂锁未开'},reader_known:'老邵送来，等待认领',character_known:{林禾:'暂存物，归属未知',老邵:'来自仓房，认领时要在场',周梅:'看见黄漆，尚未说明认领依据'},evidence:e('放稳前，老邵托住箱头，让她看底下。')},
 O_KEY:{type:'object',statement:'木箱小铜挂锁的一把钥匙',status:'active',cast:['林禾','老邵'],custody:{holder:'林禾',location:'自己柜台下抽屉的布袋',condition:'一把；未试开'},reader_known:'老邵交来，林禾装袋保存',character_known:{林禾:'知道存放位置，尚未开箱',老邵:'知道已交钥匙给林禾'},evidence:e('林禾把钥匙装进一只空布袋，放进自己柜台下的抽屉。')},
 O_BOOK:{type:'object',statement:'老邵留下的旧借物簿',status:'active',cast:['林禾','老邵'],custody:{holder:'林禾',location:'柜台下抽屉右边',condition:'薄簿；尚未翻读'},evidence:e('旧借物簿另搁在抽屉右边，跟她的寄存本隔开。')},
 OBS_BLUE:{type:'observation',statement:'箱底外侧有蓝布补住左边缺角',status:'active',cast:['林禾','老邵'],tags:['蓝布','木箱'],reader_known:'可见蓝布，来源未知',character_known:{林禾:'亲眼看到，没扯布',老邵:'见着时已有，不记得谁补'},evidence:e('黄漆掉得斑驳，箱底外侧钉着一块蓝布，补住了左边的缺角。')},
 T_CLAIM:{type:'thread',statement:'旧箱等人认领，外观与记忆是否足够尚待查问',status:'pending',cast:['林禾','老邵','周梅'],due_unit:4,reader_known:'老邵要求认领先叫他',character_known:{林禾:'不能急着送人',老邵:'明天从县里回来',周梅:'仅在门口看见箱子'},evidence:e('她没有开锁，老邵也没催，只叮嘱有人认领先叫他来一趟。')}
}};
json(`${base}/inputs/record-1-complete.json`,template);
cli('native-one-13-preview-1',['record-preview','--project',project,'--input',`${base}/inputs/record-1-complete.json`]);
cli('native-one-14-record-1',['record','--project',project,'--input',`${base}/inputs/record-1-complete.json`]);
cli('native-one-15-check-1',['check','--project',project]);
cli('native-one-16-context-2',['context','--project',project,'--unit','2','--out','.writer/drafts/context-2-before-writing.json']);
cli('native-one-17-template-2',['record-template','--project',project,'--unit','2','--draft','正文/0002-先放一夜.md','--out','.writer/drafts/record-2-before-writing.json']);
