import fs from 'node:fs';
const base='acceptance/20261019-new-user-g/native-b/inputs/';
const r=JSON.parse(fs.readFileSync(base+'review-final-1-6-format2.json','utf8'));
const similarities=r.comparison.similar_structures;
r.operation_id='b-review-final-1-6-format3-r13';
r.comparison.distinct_gains.push(...similarities.map(x=>`实际比较${x.units.join('/')}章：${x.text} 引文：${x.evidence.map(e=>e.unit+'章 '+e.quote).join('；')}`));
r.comparison.similar_structures=[];
r.comparison.limits+=' 当前help/template未说明similar_structures对象字段；两次格式拒绝已留存。该空数组仅代表本次未投未获说明的对象形状，实际三项相似结构比较完整保存在报告、原始结构化分析和distinct_gains字符串内，不代表未发现共同结构。';
fs.writeFileSync(base+'review-final-1-6-format3.json',JSON.stringify(r,null,2)+'\n',{flag:'wx'});
