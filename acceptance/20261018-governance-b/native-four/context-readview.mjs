import fs from 'node:fs';
import path from 'node:path';
const base=path.resolve('acceptance/20261018-governance-b'),stage=path.join(base,'native-four');
const raw=path.join(base,'commands/native-four-16-context/stdout.raw.txt');
const data=JSON.parse(fs.readFileSync(raw,'utf8'));
const old=JSON.parse(fs.readFileSync(path.join(base,'commands/hundred-rebuild-v2-6-record/input.raw.json')));
const known=[];
function strings(v,p){if(typeof v==='string')known.push([p,v]);else if(v&&typeof v==='object')for(const[k,x]of Object.entries(v))strings(x,p+'/'+k);}
strings(old,'旧登记草案（已完整读完的old-record-readable.txt）');
const root=path.join(base,'scale-hundred/work');
for(const ref of ['writer.json','设定/作品定位.md','设定/文风.md','设定/权威规则.md','设定/角色卡.md','设定/续部人物与场所.md','大纲/分卷/V13.json','大纲/单元/0100.json','大纲/续部总纲.md','正文/0099-饭后还有一会儿.md'])known.push([ref,fs.readFileSync(path.join(root,ref),'utf8')]);
const substitutions=[];
function compact(v,p){
 if(typeof v==='string'&&v.length>100){const k=known.find(([ref,t])=>t.includes(v));if(k){substitutions.push({json_pointer:p,already_read_source:k[0],characters:v.length});return '【逐字已读引用：'+k[0]+'；该字符串为其中连续原字，共'+v.length+'字符】';}}
 if(Array.isArray(v))return v.map((x,i)=>compact(x,p+'/'+i));
 if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,compact(x,p+'/'+k)]));return v;
}
const text=JSON.stringify(compact(data,''),null,2);
const lines=['Context full JSON parsed from '+raw,'Only exact character sequences already read above are cross-referenced. All other fields follow in full.'];
for(const line of text.split('\n'))for(let i=0;i<Math.max(line.length,1);i+=130)lines.push(line.slice(i,i+130));
fs.writeFileSync(path.join(stage,'context-readable.txt'),lines.join('\n')+'\n',{flag:'wx'});
fs.writeFileSync(path.join(stage,'context-already-read-exact-strings.json'),JSON.stringify(substitutions,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({raw_characters:fs.readFileSync(raw,'utf8').length,readview_characters:text.length,lines:lines.length,cross_references:substitutions.length,keys:Object.keys(data)}));
