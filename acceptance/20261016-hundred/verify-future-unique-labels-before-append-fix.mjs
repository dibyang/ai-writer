import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const b='acceptance/20261016-hundred',origin=JSON.parse(fs.readFileSync(`${b}/future-unique-labels-backups.json`)),hash=x=>crypto.createHash('sha256').update(x).digest('hex'),rows=[];
for(const row of origin.files){const before=fs.readFileSync(row.backup),now=fs.readFileSync(row.file),text=now.toString('utf8'),at=text.indexOf('\n\n');assert(at>0);const prefix=text.slice(0,at);assert(prefix.startsWith('额外日志经验：')&&prefix.includes('executable/argv')&&prefix.includes('帮助输出是普通文本'));assert.equal(text.slice(at+2),before.toString('utf8'));assert.equal(hash(before),row.before_sha256);rows.push({...row,after_sha256:hash(now),only_one_prepended_paragraph:true});}
fs.writeFileSync(`${b}/future-unique-labels-amendments.json`,JSON.stringify({at:new Date().toISOString(),ok:true,files:rows},null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({ok:true,unstarted_requests:rows.length}));
