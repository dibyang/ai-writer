import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const base=path.resolve('acceptance/20261024-long-flow-090-ac'),root=JSON.parse(fs.readFileSync(path.join(base,'project.json'))).project,sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const parts=Array.from({length:7},(_,i)=>`分段/AC-D-0047/${String(i+1).padStart(2,'0')}.md`).map(p=>({path:p,sha256:sha(fs.readFileSync(path.join(root,p)))}));
assert.equal(parts[0].sha256,'af51ce7d186b2c2946a2edd4d4ed740369625c9b2f5fb24e1b0cab33a26b267d');assert.equal(parts[1].sha256,'6478bce7e27d435a76b1d6958067c0ea288916f584b7eb8f64bb447a0c5fd9c6');
const body=parts.map(p=>fs.readFileSync(path.join(root,p.path),'utf8')).join('\n\n');
const han=(body.replace(/^#.*$/gm,'').match(/\p{Script=Han}/gu)||[]).length;assert(han>=10000,`Han=${han}`);
fs.writeFileSync(path.join(base,'dr-inputs/assemble47.json'),JSON.stringify({unit:47,expected_revision:211,draft:'正文/0047-留一口自己的-ac-d-v1.md',parts,separator:'\n\n'},null,2)+'\n',{flag:'wx'});
fs.writeFileSync(path.join(base,'dr-inputs/aux-count-failure.json'),JSON.stringify({kind:'auxiliary-shell',state_changed:false,product_invoked:false,exit_code:1,error:'Invalid regular expression: overescaped Unicode property escape in inline count command',recovery:'saved prepare-assemble47.mjs uses Unicode Script=Han; no original part rewritten'},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({parts:parts.length,body_han:han,characters:body.length,pages:Math.ceil(body.length/1800),original_parts_unchanged:true}));
