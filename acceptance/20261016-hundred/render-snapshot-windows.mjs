import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),[before,after]=process.argv.slice(2);
if(![before,after].every(x=>/^[a-z0-9-]+$/.test(x??'')))throw Error('Use two checkpoints');
const prefix=path.join(base,'revision-comparisons',before+'--'+after+'-snapshot-timeline'),data=JSON.parse(fs.readFileSync(prefix+'.json')),groups=new Map();
for(const row of data.rows){const key=row.field+'\0'+row.before+'\0'+row.after;if(!groups.has(key))groups.set(key,{...row,units:[]});groups.get(key).units.push(row.unit);}
let out='# 逐章变化窗口（定向复核材料）\n\n每组来自实际before/after字段，单位列表只指此精确字段和值对。省略部分已逐字相同；显示变化与前后120码点语境，不代表全文字段阅读。完整值与行映射保存在原JSON。\n';
for(const [i,row]of [...groups.values()].entries()){
 const old=data.values[row.before],current=data.values[row.after],a=Array.from(old.defined?String(old.value):'[字段缺失]'),b=Array.from(current.defined?String(current.value):'[字段缺失]');
 let left=0,right=0;while(left<a.length&&left<b.length&&a[left]===b[left])left++;while(right<a.length-left&&right<b.length-left&&a[a.length-1-right]===b[b.length-1-right])right++;
 const start=Math.max(0,left-120),oldEnd=Math.min(a.length,a.length-right+120),newEnd=Math.min(b.length,b.length-right+120),show=(chars,end)=>(start?'…':'')+chars.slice(start,end).join('')+(end<chars.length?'…':'');
 out+=`\n## ${i+1}. ${row.field} | 单元 ${row.units.join(',')} | 文本 ${row.before}→${row.after}\n\n旧：${show(a,oldEnd)}\n\n新：${show(b,newEnd)}\n`;
}
fs.writeFileSync(prefix+'-windows.md',out,{flag:'wx'});console.log(JSON.stringify({groups:groups.size,characters:out.length,file:prefix+'-windows.md'}));
