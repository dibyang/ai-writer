import fs from 'node:fs';
import path from 'node:path';
const session=path.resolve('acceptance/20261016-expanded/session-a');
const lines=fs.readFileSync(path.join(session,'events.jsonl'),'utf8').split(/\r?\n/);
const events=lines.flatMap(s=>{try{return [JSON.parse(s)];}catch{return [];}});
const original=events.find(e=>e.type==='item.completed'&&e.item?.type==='command_execution'&&e.item.command?.includes('session-a/finalize.mjs')&&e.item.exit_code===1&&e.item.aggregated_output?.includes('Unexpected end of JSON input'));
if(!original)throw new Error('尚未找到完整的原始脚本失败执行事件，不改写转存文件');
fs.writeFileSync(path.join(session,'helper-error-finalize.json'),JSON.stringify({note:'由events.jsonl直接提取的原始命令执行事件；aggregated_output为工具合并输出，不冒称分离stdout/stderr。',original_event:original},null,2)+'\n');
console.log(JSON.stringify({preserved:true,id:original.item.id,exit_code:original.item.exit_code}));
