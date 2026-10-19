import fs from 'node:fs';
const h='acceptance/20261019-hundred-h',d=h+'/draft-b',w=h+'/work';
const t=JSON.parse(fs.readFileSync(h+'/commands/draft-b-review-template/stdout.raw.txt'));
const a=JSON.parse(fs.readFileSync(d+'/review-data.json'));
t.operation_id='H-draft-b-review103-110-r424-v1';t.report='审查/H轮draft-b-103-110连读.md';
const keys=['goal','obstacle','choice','consequence','relationship_change'];
t.chapter_functions=a.functions.map(r=>({unit:r.unit,...Object.fromEntries(keys.map(k=>[k,r[k]?{status:'observed',text:r[k][0],evidence:[{unit:r.unit,quote:r[k][1]}]}:{status:'none',reason:r.relationship_reason}]))}));
t.comparison=a.comparison;t.issues=[];
for(const r of t.chapter_functions){const file=Object.keys(t.source_hashes).find(p=>p.startsWith('正文/'+String(r.unit).padStart(4,'0')+'-'));const body=fs.readFileSync(w+'/'+file,'utf8');for(const k of keys)if(r[k].status==='observed'&&!body.includes(r[k].evidence[0].quote))throw Error('quote mismatch '+r.unit+' '+k);}
fs.writeFileSync(d+'/review-input.json',JSON.stringify(t,null,2)+'\n',{flag:'wx'});
let report=fs.readFileSync(d+'/review-prose.md','utf8');
report+='\n## 当前版本\n\n|章|SHA-256|\n|---|---|\n'+Object.entries(t.source_hashes).map(([p,sha])=>'|'+p+'|'+sha+'|').join('\n')+'\n';
report+='\n## 逐章功能\n\n|章|目标|阻力|选择|后果|关系变化|\n|---|---|---|---|---|---|\n';
for(const r of t.chapter_functions)report+='|'+r.unit+'|'+keys.map(k=>r[k].status==='observed'?r[k].text+'；“'+r[k].evidence[0].quote+'”':r[k].reason).join('|')+'|\n';
report+='\n## 相似结构与不同收益\n\n'+t.comparison.similar_structures.map(s=>'### '+s.units.join('、')+'\n\n'+s.judgment+'\n\n'+s.differences+' 保留：'+s.preserve+'\n\n'+s.evidence.map(e=>e.unit+'：“'+e.quote+'”').join('；')+'\n\n边界：'+s.uncertainty+(s.optional_adjustments.length?'\n\n后续观察：'+s.optional_adjustments.join('；'):'')).join('\n\n')+'\n';
fs.writeFileSync(w+'/'+t.report,report,{flag:'wx'});
console.log({input:d+'/review-input.json',report:w+'/'+t.report,units:t.chapter_functions.length});
