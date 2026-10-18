import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const stage=path.resolve('acceptance/20261018-governance-b/native-four'),base=path.dirname(stage);
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const session=read(path.join(stage,'session.json'));
const baseline=read(path.join(stage,'baseline.json'));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const source_hashes={};
for(const row of baseline.bodies.filter(x=>x.unit>=95)) {
 const h=sha(fs.readFileSync(path.join(session.workspace,row.draft)));
 if(h!==row.sha256)throw Error('read body changed');source_hashes[row.draft]=h;
}
const report='审查/native-four-0095-0100-真实模型连读.md';
const text=fs.readFileSync(path.join(stage,'rolling-report-body.md'),'utf8')+Object.entries(source_hashes).map(([ref,h])=>'- `'+ref+'`：`'+h+'`').join('\n')+'\n';
fs.writeFileSync(path.join(session.workspace,report),text,{flag:'wx'});
fs.writeFileSync(path.join(stage,'review.json'),JSON.stringify({from:95,to:100,kind:'model-self-review',report,source_hashes},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({report,report_sha256:sha(Buffer.from(text)),read_from:95,read_to:100}));
