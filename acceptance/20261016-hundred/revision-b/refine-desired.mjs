import fs from 'node:fs';import path from 'node:path';
const stage=path.resolve('acceptance/20261016-hundred/revision-b');fs.mkdirSync(path.join(stage,'desired-v2'));
const changes=[];
function fix(v,p,n){if(typeof v==='string'){const x=v.replaceAll('撤一间','撤原并行时额外保留时段');if(x!==v)changes.push({unit:n,path:p,before:v,after:x});return x;}if(Array.isArray(v))return v.map((x,i)=>fix(x,p+'/'+i,n));if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,fix(x,p+'/'+k,n)]));return v;}
for(let n=0;n<=66;n++){const x=fix(JSON.parse(fs.readFileSync(path.join(stage,'desired',String(n).padStart(3,'0')+'.json'),'utf8')),'snapshot',n);fs.writeFileSync(path.join(stage,'desired-v2',String(n).padStart(3,'0')+'.json'),JSON.stringify(x,null,2)+'\n',{flag:'wx'});}
const summaries=fix(JSON.parse(fs.readFileSync(path.join(stage,'summaries.json'),'utf8')),'summaries',null);fs.writeFileSync(path.join(stage,'summaries-v2.json'),JSON.stringify(summaries,null,2)+'\n',{flag:'wx'});
fs.writeFileSync(path.join(stage,'scope-refinements.json'),JSON.stringify(changes,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({desired_version:'desired-v2',fields:changes.map(x=>({unit:x.unit,path:x.path})),extra_observation_changes:[]}));
