import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),[before,after]=process.argv.slice(2);
if(![before,after].every(x=>/^[a-z0-9-]+$/.test(x??'')))throw Error('Use two checkpoints');
const prefix=path.join(base,'revision-comparisons',before+'--'+after+'-snapshot-timeline'),data=JSON.parse(fs.readFileSync(prefix+'.json'));
const groups=new Map();for(const row of data.rows){const key=row.field+'\0'+row.after;if(!groups.has(key))groups.set(key,{field:row.field,text:data.values[row.after],units:[]});const group=groups.get(key);if(!group.units.includes(row.unit))group.units.push(row.unit);}
const entries=[...groups.values()].sort((a,b)=>a.field.localeCompare(b.field)||a.units[0]-b.units[0]);
let text='# 修后逐单元变化文本阅读视图\n\n来自实际journal逐章重放。以下单元列表只属于after侧和该精确字段，不混入修前首次出现时点。文本重复归并不代表语义通过；原before/after关联保留在JSON。\n';
for(const [i,item]of entries.entries())text+=`\n## ${i+1}. ${item.field}\n\n修后登记单元：${item.units.join(', ')}；文本ID：${item.text.id}\n\n${item.text.defined?String(item.text.value):'[字段缺失]'}\n`;
fs.writeFileSync(prefix+'-reading.md',text,{flag:'wx'});console.log(JSON.stringify({groups:entries.length,characters:text.length,file:prefix+'-reading.md'}));
