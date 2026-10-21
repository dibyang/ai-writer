import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),label=process.argv[2]??'source-full-tests-r2',dir=path.join(base,'commands',label),out=path.join(dir,'stdout.raw.txt'),text=fs.existsSync(out)?fs.readFileSync(out,'utf8'):'';
const result=fs.existsSync(path.join(dir,'result.json'))?JSON.parse(fs.readFileSync(path.join(dir,'result.json'),'utf8')):null;
console.log(JSON.stringify({label,finished:!!result,exit_code:result?.exit_code??null,bytes:Buffer.byteLength(text),pass_lines:(text.match(/^(?:ok \d+|✔ )/gm)??[]).length,fail_lines:(text.match(/^(?:not ok \d+|✖ )/gm)??[]).length,skip_lines:(text.match(/^﹣ /gm)??[]).length,tail:text.split(/\r?\n/).slice(-15)},null,2));
