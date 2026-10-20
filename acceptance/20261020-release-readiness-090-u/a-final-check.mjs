import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const U=path.dirname(fileURLToPath(import.meta.url)),W=path.join(U,'scenario','东岸末班船');
const P='D:/work/other/ai-writer/.tmp/U 最终交付解压/ai-writer-0.9.0';
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const j=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const base=j(path.join(U,'A首停校验.json'));
for(const p of base.parts)if(sha(path.join(W,p.ref))!==p.sha256)throw Error('Part changed '+p.ref);
const freeze=j(path.join(U,'写前-A.json'));
for(const s of freeze.sources)if(sha(path.join(W,s.ref))!==s.sha256)throw Error('Source drift '+s.ref);
for(const s of [freeze.context,freeze.template])if(sha(path.join(W,s.ref))!==s.sha256)throw Error('Prewrite input drift');
const toolChecks=[];
for(const [root,label] of [[P,'a02-package-doctor'],[path.join(W,'.writer/tool'),'a09-workspace-doctor']]){
  const d=j(path.join(U,'commands',label,'stdout.raw.txt'));
  for(const f of d.build.files){
    const target=path.join(root,f.group==='skills'?'.agents/skills':'',f.file);
    if(sha(target)!==f.sha256)throw Error('Tool drift '+target);
  }
  toolChecks.push({root,files_checked:d.build.files.length,unchanged:true});
}
const report=path.join(W,'审查/A-首两段-知情自检.md'),handoff=path.join(U,'交接-A首停.md');
if(!fs.readFileSync(handoff,'utf8').includes(sha(report)))throw Error('Handoff report hash mismatch');
const stateSha=sha(path.join(W,'.writer/state.json'));
if(stateSha!==base.state_sha256)throw Error('State drift');
const result={ok:true,checked_at:new Date().toISOString(),revision:3,registered_units:0,state_sha256:stateSha,parts:base.parts,tool_checks:toolChecks,report_sha256:sha(report),handoff_sha256:sha(handoff),document_corrections:['自检报告将转运路径转述中的检修棚更正为正文的修理棚，并同步交接中的报告SHA','交接明确25次CLI分布为a01— a04用P，a05— a25用W'],historical_creation_evidence:'commands/a-close/stdout.raw.txt保留初存文档哈希；当前文档哈希以本附证为准。初存文档字节保留在过程稿-A/报告初存.md、交接初存.md。',git_status_note:{ref:'commands/a-git-stop/stdout.raw.txt',additional_paths_observed_since_first_status:['scripts/build-release.mjs','tests/release.test.mjs'],cause:'未核；本轮未向这些路径发出写命令，未处理。候选P与随附W文件已单独核对未变化。'},scope:'仅A首停，未完成三章端到端验收'};
fs.writeFileSync(path.join(U,'A终检-附证.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(result));
