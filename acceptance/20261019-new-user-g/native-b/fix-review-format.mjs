import fs from 'node:fs';
const base='acceptance/20261019-new-user-g/native-b/inputs/';
const r=JSON.parse(fs.readFileSync(base+'review-final-1-6.json','utf8'));
r.operation_id='b-review-final-1-6-format2-r13';
r.comparison.distinct_gains=r.comparison.distinct_gains.map(x=>`第${x.unit}章：${x.text} 原文：${x.evidence[0].quote}`);
r.comparison.preserve=r.comparison.preserve.map(x=>`${x.units.map(n=>'第'+n+'章').join('/')}：${x.text} 原文：${x.evidence.map(e=>e.quote).join('；')}`);
fs.writeFileSync(base+'review-final-1-6-format2.json',JSON.stringify(r,null,2)+'\n',{flag:'wx'});
