import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const base='acceptance/20261016-hundred',backup=JSON.parse(fs.readFileSync(`${base}/future-cli-request-backups.json`)),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const rows=backup.rows.map(row=>{
 assert(!fs.existsSync(`${base}/${row.phase}/events.jsonl`),'Request already started');
 const old=fs.readFileSync(row.backup),current=fs.readFileSync(row.source),text=current.toString('utf8');
 assert.equal(sha(old),row.sha256);
 const pattern=/\r?\n\r?\n已验证的CLI使用经验：[^\r\n]*/gu,matches=[...text.matchAll(pattern)];assert.equal(matches.length,1);
 assert.equal(text.replace(pattern,''),old.toString('utf8'),'Only the CLI-use paragraph may change');
 return {...row,after_sha256:sha(current),added_characters:matches[0][0].length};
});
fs.writeFileSync(`${base}/future-cli-request-amendments.json`,JSON.stringify({at:new Date().toISOString(),ok:true,scope:'Only unstarted requests changed; exact old bytes retained',rows},null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({ok:true,amended:rows.length}));
