import {base,project,readJson,json,cli} from './helpers.mjs';
const x=readJson(`${project}/.writer/drafts/record-5-before-writing.json`),e=quote=>[{unit:5,quote}];
x.summary='第二天下午周梅拧紧箱底松螺丝，二人装纸样回箱。林禾把清点方式交周梅决定，划掉本属周梅的工具，只记待领物。周梅明确钥匙今夜仍由林禾保管，约次日十点连箱交接；控制重复字原句保留。';
x.changes={characters:{林禾:'便民处；扶木条，接受周梅只记拿走物的办法；纸样已回箱，钥匙抽屉布袋暂管，明早十点搬箱',周梅:'离开便民处叫卖豆腐的；修好松条，携自己的小锤与工具套；决定钥匙林禾今夜暂管，明早连箱取；无名纸样先同存'},timeline_append:['第二天下午：木条拧紧，纸样回箱；周梅决定清点方式，钥匙仍林禾暂管，约第三天十点交箱。'],ledger:{
 O_BOX:{custody:{holder:'林禾',location:'便民处垫高长凳',condition:'箱底干燥，松螺丝已紧，纸样与余料在箱内；盖可掀、锁未扣'},evidence:e('螺丝转了几下，木条重新贴紧，没闹出想象中那么大的动静。')},
 O_PATTERN:{custody:{holder:'林禾',location:'便民处木箱底，宽纸套连硬纸板承托',condition:'肩口折痕下垫纸，未强行摊平，与围裙带及余料分放'},evidence:e('两个人把纸样连着硬纸板收入宽纸套，放回晾干的箱底，围裙带和余料分放在旁边。')},
 O_KEY:{custody:{holder:'林禾',location:'自己柜台下抽屉的收口布袋',condition:'周梅已数过，今夜暂管；挂锁箱旁未扣'},reader_known:'周梅明确委托林禾暂管，明天十点连箱拿',character_known:{林禾:'自己取出供清点后收回袋入抽屉，暂管一夜',周梅:'数过钥匙，主动要求林禾今夜暂管'},evidence:e('林禾把钥匙放回布袋里里，收紧袋口，搁进自己柜台下的抽屉。')},
 O_BOOK:{character_known:{林禾:'已亲读旧簿，并在第四章听老邵解释存入方向；原簿已由老邵带走',周梅:'已亲读母名，并在第四章听老邵说明；簿现由老邵持有'},evidence:e('借物簿已经让老邵带走了，她只剩周梅留下的抄纸，夹页间那道折痕压得很深。')},
 T_CLAIM:{status:'partial',reader_known:'周梅约第三天十点正式取箱，今天只是修理和清点',character_known:{林禾:'约十点交接并先照周梅办法记清单',周梅:'改衣摊门窄须先挪脚踏板，十点连箱带钥匙取'},evidence:e('“就写拿走的。箱明天搬，今天不算。”')},
 R_LISTEN:{status:'partial',reader_known:'林禾把清点方式交周梅决定，周梅委托暂管钥匙；能谈菜咸',character_known:{林禾:'接受划掉多余工具，并把口味实话说出',周梅:'可以提出记法与保管要求，谈昨晚菜咸'},evidence:e('“你看看，怎么记？”她把纸转向周梅。')}
}};
json(`${base}/inputs/record-5-complete.json`,x);
cli('native-one-37-preview-5',['record-preview','--project',project,'--input',`${base}/inputs/record-5-complete.json`]);
cli('native-one-38-record-5',['record','--project',project,'--input',`${base}/inputs/record-5-complete.json`]);
cli('native-one-39-check-5',['check','--project',project]);
cli('native-one-40-context-6',['context','--project',project,'--unit','6','--out','.writer/drafts/context-6-before-writing.json']);
cli('native-one-41-template-6',['record-template','--project',project,'--unit','6','--draft','正文/0006-一碗面的位置.md','--out','.writer/drafts/record-6-before-writing.json']);
