import fs from 'node:fs';import path from 'node:path';
const b=path.resolve('acceptance/20261024-long-flow-090-ac'),p=path.join(b,'dr-inputs/record47-filled.json'),t=JSON.parse(fs.readFileSync(p));
t.changes.ledger.P_AC_C_MEAL_BOX.character_known={'沈禾':'47亲认干空带店，夜开看仍空净、回自柜盖不压紧。','沈成林':'47在场听女说包内盒空，见其取盒回柜；仍不涉及许家借物。'};
t.changes.ledger.P_W_COAT.character_known={'许蓉':'47晨厚边潮穿备用；夜认干短试，亲说坐桌旧处碰/站取杯未注意，自己选明早穿，挂回自钩。','许蓉女儿':'47亲摸晨潮夜干，亲见母短试/听有限原话，同纸新记，不带母明早衣去课；不推长期效果。'};
t.changes.ledger.P_CR_FEEDBACK_PAPER.character_known={'许蓉女儿':'47夜原纸空处新添真实洗晾/短试，旧行不改，新句能字划去，等干折回护纸。','许蓉':'47亲口允许女记本次，听女说一字写多，提醒今日说今日；未逐字阅读女全部新增行。'};
const q='看一株画得很低的花。';t.changes.ledger.P_W_PICTURE_BOOK={status:'active',reader_known:'47周二夜沈从房取自己的画册，开后页先看低花一幅，未转给旁父；不是许家12元红花书。',character_known:{'沈禾':'47夜自己取书读后页低花，父在旁喝水未探看。'},evidence:[{unit:47,quote:q}]};
fs.writeFileSync(path.join(b,'dr-inputs/record47-final.json'),JSON.stringify(t,null,2)+'\n',{flag:'wx'});
