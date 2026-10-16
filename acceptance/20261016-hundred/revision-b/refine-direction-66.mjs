import fs from 'node:fs';import path from 'node:path';
const stage=path.resolve('acceptance/20261016-hundred/revision-b'),changes=[];
fs.mkdirSync(path.join(stage,'desired-v4'),{recursive:false});
for(let n=0;n<=66;n++){
 const name=String(n).padStart(3,'0')+'.json',s=JSON.parse(fs.readFileSync(path.join(stage,'desired-v3',name),'utf8'));
 if(n===66){const item=s.ledger.T_ROUTE_COMMON,old=item.character_known['沈禾'];if(!old.includes('缺口朝车道'))throw Error('Expected residual absent');item.character_known['沈禾']=old.replace('缺口朝车道','缺口朝围挡');changes.push({unit:n,id:'T_ROUTE_COMMON',field:'character_known.沈禾',old,new:item.character_known['沈禾'],reason:'66当前同砖方向同步；不改其他历史知识或观察字段'});}
 fs.writeFileSync(path.join(stage,'desired-v4',name),JSON.stringify(s,null,2)+'\n',{flag:'wx'});
}
fs.writeFileSync(path.join(stage,'direction-66-refinement.json'),JSON.stringify(changes,null,2)+'\n',{flag:'wx'});
const old=fs.readFileSync(path.join(stage,'rebuild.mjs'),'utf8');fs.writeFileSync(path.join(stage,'rebuild-v4.mjs'),old.replaceAll('desired-v3','desired-v4'),{flag:'wx'});
console.log(JSON.stringify(changes,null,2));
