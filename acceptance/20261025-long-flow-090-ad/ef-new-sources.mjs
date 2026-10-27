import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {base,j,sha,project,state,write,cli} from './ef-lib.mjs';
const pairs=[
 [['从55补固待装/58未收','从55补固待装/62未收'],['58为工46料12库存包价','62为工46料16库存包价'],['现场实际付58及真实找零方式由正文确定','现场实际付62；交70找8，钞票50+20；其余过程按实际正文核验']],
 [['新柜58各自独立','新柜62各自独立']],
 [['新柜58各自独立','新柜62各自独立']],
 [['新柜58各自独立','新柜62各自独立'],['原桌/68新灯下','原桌/72新灯下'],['不重新记58收入','不重新记62收入']],
 [['新柜工46料12实收58独立','新柜工46料16实收62独立']],
 [['原58已实收60找2，不重计','原62已实收70找8，不重计'],['新柜46+12=58','新柜46+16=62']]
];
for(let i=1;i<=6;i++){
 const old=j(path.join(base,'cli-logs',`ef-freeze-old-${i}`,'stdout.txt')).version;
 let doc=fs.readFileSync(path.join(project,old.object_ref),'utf8');assert.equal(sha(Buffer.from(doc)),old.sha256);
 for(const [a,b] of pairs[i-1]){assert.equal(doc.split(a).length-1,1,a);doc=doc.replace(a,b);}
 if(i>=5)doc+='\n## E受控版本说明\n\n上文D阶段的阅读页、当时正文SHA、r号及已完成动作声明保留为历史记录，只指D当时实际字节，不追认为D读过本E新数值。本文相关数值在E按根已审方案一致化，属本次普通受控验收参数而非作者新增原话，也不称原值创作错误。E本程重新完整读当前1—60和新冻结对象；实际历史回放范围48—60，54灯72/100找28，55工46料16总62仍未收，56交70找8净62，60仅回述已付62，付款各在本章真实发生。本程停51，52—60仍待后续同ID回放，不把本来源中的计划追认为正文已经改好。\n';
 const file=`研究/AD-E来源候选/S0${i}-new.${i<5?'json':'md'}`;write(path.join(project,file),doc);
 const out=cli(`ef-freeze-new-${i}`,['source','freeze'],{input:{expected_revision:state().revision,operation_id:`AD_E_FREEZE_S0${i}_NEW`,ref:old.ref,file,version_id:`AD_E_S0${i}_NEW`,previous:old.id},show:false});
 console.log(JSON.stringify({i,version:out.version,revision:out.revision}));
}
