import fs from 'node:fs';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const U='D:/work/other/ai-writer/acceptance/20261020-release-readiness-090-u',W=U+'/scenario-final/东岸末班船';
const read=f=>JSON.parse(fs.readFileSync(f,'utf8')),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const t=read(W+'/.writer/drafts/final-record-1-before.json'),content=read(W+'/.writer/drafts/final-a-content-1.json');
assert.equal(t.expected_revision,3);for(const [ref,h]of Object.entries(t.source_hashes))assert.equal(sha(fs.readFileSync(W+'/'+ref)),h);
const report='审查/final-a-controlled-missing-report-do-not-create.md';assert.equal(fs.existsSync(W+'/'+report),false);assert.equal(fs.existsSync(W+'/审查/final-a-0001-完整章自检.md'),false);
const input={...t,...content,draft_review:{reviewer:'受控测试：只验证报告存在性，不是文学审稿',report,draft_sha256:sha(fs.readFileSync(W+'/'+content.draft)),report_sha256:'0'.repeat(64)}};delete input._instructions;
fs.writeFileSync(W+'/.writer/drafts/final-a-record-1-missing-report.json',JSON.stringify(input,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({ok:true,expected_revision:t.expected_revision,draft_review:input.draft_review}));
