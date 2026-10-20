import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {fileURLToPath}from'node:url';
const V=path.dirname(fileURLToPath(import.meta.url)),W=path.join(V,'scenario/东岸末班船-扩展验证'),file=path.join(W,'审查/V-最终当前稿-0001-0012.md');
const old=fs.readFileSync(file),input=JSON.parse(fs.readFileSync(path.join(V,'inputs/f2-review-current-1-12.json'),'utf8'));
fs.writeFileSync(path.join(V,'f2-report-before-wording.raw.md'),old,{flag:'wx'});
const replacements=[['临时三包客赶车、老板次日进货、热笼未洗','临时三包客赶车、老板拟次日进货、热笼未洗'],['发锤柄照片确认后照清单收八件，再交钱','照清单点八件并发锤柄照片确认，再收箱交钱']];
let report=old.toString('utf8');for(const[a,b]of replacements){assert.ok(report.includes(a));report=report.replace(a,b);}
input.chapter_functions[7].obstacle.text=replacements[0][1];input.chapter_functions[2].choice.text=replacements[1][1];
fs.writeFileSync(file,report);fs.writeFileSync(path.join(V,'inputs/f2-review-current-1-12-v2.json'),JSON.stringify(input,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:true,report_sha256:crypto.createHash('sha256').update(report).digest('hex'),report_wording_only:replacements,old_report_preserved:'f2-report-before-wording.raw.md',old_input_preserved:true,body_changed:false}));
