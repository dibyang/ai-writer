import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const base='acceptance/20261016-hundred',dir=`${base}/parent-findings/knowledge75`,sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const input=`${base}/session-09/new-inputs/75-record.json`,state=`${base}/session-09/new-inputs/75-state-after.json`;
const command=`${base}/session-09/commands/2026-10-16T10-18-45-601Z-cac8f714-5b9f-4fb6-8e8a-d926b10c2b54-record-75.json`;
const body=`${base}/parent-reading-copies/at75/0075-车筐转过来以后.md`,tx=JSON.parse(fs.readFileSync(input,'utf8'));
assert(tx.changes.characters.邹秀琴.includes('仅听现场两车试意向前段'));
const text=fs.readFileSync(body,'utf8'),leave=text.indexOf('她将布边按好，自己解刹推走'),trial=text.indexOf('那就先试这两车');assert(leave>=0&&trial>leave);
assert.equal(JSON.parse(fs.readFileSync(command)).exit_code,0);
fs.mkdirSync(`${base}/parent-findings`,{recursive:true});fs.mkdirSync(dir,{recursive:false});const rows=[];
for(const[file,name]of[[input,'75-record.json'],[state,'75-state-after.json'],[command,'record-command.json'],[body,'75-body.md']]){const bytes=fs.readFileSync(file);fs.writeFileSync(`${dir}/${name}`,bytes,{flag:'wx'});rows.push({source:file,copy:`${dir}/${name}`,sha256:sha(bytes)});}
fs.writeFileSync(`${dir}/evidence.json`,JSON.stringify({at:new Date().toISOString(),scope:'Actual registered input and manuscript source, not an automatic semantic verdict',issue:'Zou leaves before the two-truck trial is agreed; her chapter75 character summary says she heard its earlier part',rows},null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({captured:rows.length,input_revision:tx.expected_revision,body_leave_before_trial:true}));
