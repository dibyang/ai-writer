import fs from 'node:fs';import path from 'node:path';
const stage=path.resolve('acceptance/20261016-hundred/revision-b');let code=fs.readFileSync(path.join(stage,'audit-final.mjs'),'utf8');
code=code.replace("x.path===id+'/statement'||x.path.includes('/evidence/')","x.path===id+'/statement'||x.path===id+'/evidence'");
code=code.replace("write('audit-final.json',result)","write('audit-final-v2.json',result)");
for(const name of ['final-han','final-changed-files','knowledge-preservation','observation-whitelist','snapshot-field-diff','anchor-audit','intentional-quote-replacements'])code=code.replace("write('"+name+".json'","write('"+name+"-v2.json'");
fs.writeFileSync(path.join(stage,'audit-final-v2.mjs'),code,{flag:'wx'});
const dif=JSON.parse(fs.readFileSync(path.join(stage,'snapshot-field-diff.json'),'utf8'));
console.log(JSON.stringify({reason:'复核四个观察的statement均只方向改变；两个evidence数组含已逐条核对的方向引文替换。比较器原将整个数组作为叶节点，修正精确路径匹配，不放宽其他字段。',field_differences:dif.length,paths:dif.map(x=>x.path)},null,2));
