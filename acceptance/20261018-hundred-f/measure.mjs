import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),[start,end,project]=process.argv.slice(2),from=Number(start),to=Number(end),work=path.resolve(project??path.join(base,'work'));
assert.ok(Number.isSafeInteger(from)&&from>=1&&Number.isSafeInteger(to)&&to>=from);
const names=fs.readdirSync(path.join(work,'正文')).filter(n=>n.endsWith('.md')),rows=[];
for(let unit=from;unit<=to;unit++){
 const matches=names.filter(n=>Number.parseInt(n,10)===unit);assert.equal(matches.length,1,'Expected one actual manuscript file for '+unit);const ref='正文/'+matches[0],bytes=fs.readFileSync(path.join(work,ref)),text=bytes.toString('utf8').replace(/^\uFEFF/,''),lines=text.split(/\r?\n/),body=lines.filter((line,index)=>!(index===0&&/^#\s/.test(line))).join('\n');
 rows.push({unit,draft:ref,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length,total_utf16_characters:text.length,body_non_whitespace_characters:[...body.replace(/\s/gu,'')].length,body_han_characters:(body.match(/\p{Script=Han}/gu)??[]).length,lines:lines.length});
}
console.log(JSON.stringify({ok:true,project:work,from,to,units:rows.length,total_utf16_characters:rows.reduce((n,r)=>n+r.total_utf16_characters,0),body_han_characters:rows.reduce((n,r)=>n+r.body_han_characters,0),min_body_han:Math.min(...rows.map(r=>r.body_han_characters)),max_body_han:Math.max(...rows.map(r=>r.body_han_characters)),basis:'Actual UTF-8 manuscript bytes. Han and non-whitespace code point counts exclude first Markdown heading; UTF-16 total includes title and formatting. No literary quality inference.',rows},null,2));
