import fs from 'node:fs';import crypto from 'node:crypto';
const v='D:/work/other/ai-writer/acceptance/20261020-long-flow-090-v',w=v+'/scenario/东岸末班船-扩展验证',sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=ref=>JSON.parse(fs.readFileSync(w+'/'+ref,'utf8')),template=read('.writer/drafts/v-ar-record-6-before.json'),payload=read('.writer/drafts/v-ar-changes-6.json');
for(const [ref,expected] of Object.entries(template.source_hashes))if(sha(fs.readFileSync(w+'/'+ref))!==expected)throw Error('Original write-before source changed: '+ref);
const draft='正文/0006-走一遍再画-v2.md',report='审查/V-A-恢复-0006-完整章自检.md';
const input={...template,draft,summary:payload.summary,changes:payload.changes,draft_review:{reviewer:'同一实际V-A恢复Codex执行代理；完整章知情自检',report,draft_sha256:sha(fs.readFileSync(w+'/'+draft)),report_sha256:sha(fs.readFileSync(w+'/'+report))}};
const raw=JSON.stringify(input,null,2)+'\n';fs.writeFileSync(w+'/.writer/drafts/v-ar-record-6-filled-v2.json',raw,{flag:'wx'});console.log(JSON.stringify({expected_revision:input.expected_revision,original_template_retained:true,source_hashes_unchanged:true,actual_draft:draft,sha256:sha(Buffer.from(raw))}));
