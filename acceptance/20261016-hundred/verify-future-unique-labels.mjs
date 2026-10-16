import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const b='acceptance/20261016-hundred',origin=JSON.parse(fs.readFileSync(`${b}/future-unique-labels-backups.json`)),hash=x=>crypto.createHash('sha256').update(x).digest('hex'),rows=[];
for(const row of origin.files){const before=fs.readFileSync(row.backup),now=fs.readFileSync(row.file);assert.deepEqual(now.subarray(0,before.length),before);const suffix=now.subarray(before.length).toString('utf8');assert(suffix.startsWith('额外日志经验：')&&suffix.includes('executable/argv')&&suffix.includes('帮助输出是普通文本')&&suffix.endsWith('\n\n'));assert.equal(suffix.trim().split(/\r?\n/).length,1);assert.equal(hash(before),row.before_sha256);rows.push({...row,after_sha256:hash(now),only_one_appended_paragraph:true});}
fs.writeFileSync(`${b}/future-unique-labels-amendments.json`,JSON.stringify({at:new Date().toISOString(),ok:true,files:rows},null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({ok:true,unstarted_requests:rows.length}));
