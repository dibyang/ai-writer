import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const W=path.dirname(fileURLToPath(import.meta.url)),ROOT=path.resolve(W,'../..'),P=path.join(W,'scenario/东岸末班船-规模验证');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),hashFile=f=>fs.existsSync(f)?sha(fs.readFileSync(f)):null;
const json=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const original=json(path.join(W,'a-start-state.json')),current=json(path.join(P,'.writer/state.json'));
const baseline=json(path.join(W,'baseline-worktree.json')),product=json(path.join(W,'product-frozen-start.json'));
const compareFiles=(root,files)=>files.map(f=>({file:f.file,expected:f.sha256,actual:hashFile(path.join(root,f.file))})).filter(f=>f.expected!==f.actual);
const wChanged=compareFiles(P,baseline.files),vChanged=compareFiles(baseline.source,baseline.files),productChanged=compareFiles(ROOT,product.files);
const contextRel='.writer/drafts/w-a-context-13.json',templateRel='.writer/drafts/w-a-record-template-13.json';
const context=json(path.join(P,contextRel)),template=json(path.join(P,templateRel));
const contextSources=Object.entries(context.source_hashes).map(([file,expected])=>({file,expected,actual:hashFile(path.join(P,file))}));
const protectedUnits=original.units.map((u,i)=>({unit:u.unit,draft:u.draft,units_object_unchanged:JSON.stringify(u)===JSON.stringify(current.units[i]),draft_sha256:hashFile(path.join(P,u.draft))}));
const start=json(path.join(W,'a-start-baseline.json'));
for(let i=0;i<protectedUnits.length;i++)protectedUnits[i].draft_unchanged=protectedUnits[i].draft_sha256===start.units[i].sha256;
const commandResults=fs.readdirSync(path.join(W,'cli-logs')).filter(n=>n.startsWith('a-')).map(label=>{const r=json(path.join(W,'cli-logs',label,'result.json'));return {label,exit_code:r.exit_code,elapsed_ms:r.elapsed_ms,before_state_sha256:r.before_state_sha256,after_state_sha256:r.after_state_sha256};});
const status=json(path.join(W,'cli-logs/a-final-status/stdout.raw.txt')),check=json(path.join(W,'cli-logs/a-final-check/stdout.raw.txt'));
const parts=json(path.join(W,'a-parts-final-measure.json'));
const relevant=['大纲/扩展骨架-W.md','大纲/近期细纲-W-13-15.md',...[6,7,8,9].map(n=>'大纲/分卷/V'+n+'.json'),...[13,14,15].map(n=>'大纲/单元/'+String(n).padStart(4,'0')+'.json'),contextRel,templateRel,'研究/W-A-测试授权原文.md','审查/0013-前两段-A首停.md'];
const sourceArtifacts=relevant.map(file=>({file,sha256:hashFile(path.join(P,file))}));
const rootSkillEquality=['writer-project','writer-novel','writer-review'].map(name=>({name,root_sha256:hashFile(path.join(P,'.agents/skills',name,'SKILL.md')),package_sha256:hashFile(path.join(P,'.writer/tool/.agents/skills',name,'SKILL.md'))}));
const missingStopFiles=['分段/0013/v1/03.md','正文/0013-桌边留一半-v1.md'].map(file=>({file,exists:fs.existsSync(path.join(P,file))}));
const report={at:new Date().toISOString(),project:P,revision:current.revision,units:current.units.length,state_sha256:hashFile(path.join(P,'.writer/state.json')),units_sha256:sha(JSON.stringify(current.units)),units_unchanged:JSON.stringify(current.units)===JSON.stringify(original.units),snapshot_unchanged:JSON.stringify(current.snapshot)===JSON.stringify(original.snapshot),protectedUnits,
 inherited_w_files:{total:baseline.files.length,changed:wChanged,only_state_changed:wChanged.length===1&&wChanged[0].file==='.writer/state.json'},
 sealed_v_files:{total:baseline.files.length,changed:vChanged},frozen_root_files:{total:product.files.length,changed:productChanged},rootSkillEquality,
 context:{file:contextRel,sha256:hashFile(path.join(P,contextRel)),revision:context.revision,sources:contextSources},template:{file:templateRel,sha256:hashFile(path.join(P,templateRel)),revision:template.expected_revision,same_source_hashes_as_context:JSON.stringify(template.source_hashes)===JSON.stringify(context.source_hashes)},
 status:{ok:status.ok,revision:status.revision,stage:status.governance.stage,next_unit:status.next_unit,stale_units:status.stale_units,changed_sources:status.changed_sources,impact_pending:status.impact_pending,registered_count:status.draft_inventory.registered_count},check:{ok:check.ok,scope:check.scope,units:check.units,findings:check.findings,rolling_review:check.rolling_review},parts,sourceArtifacts,commandResults,stop_files:missingStopFiles,note:'Mechanical comparisons only. Literary reading and judgments are in a-recovery-reading.md and the current two-part review. U/T and other seals were not written by this process; no new complete seal verification is claimed for them.'};
report.ok=report.units_unchanged&&report.snapshot_unchanged&&protectedUnits.every(u=>u.draft_unchanged)&&report.inherited_w_files.only_state_changed&&vChanged.length===0&&productChanged.length===0&&contextSources.every(f=>f.expected===f.actual)&&report.template.same_source_hashes_as_context&&commandResults.every(r=>r.exit_code===0)&&missingStopFiles.every(f=>!f.exists)&&current.units.length===12&&parts.parts.length===2&&parts.parts.every(p=>p.body_han_characters>=1800&&p.body_han_characters<=2400)&&status.stale_units.length===0&&status.changed_sources.length===0&&check.ok;
fs.writeFileSync(path.join(W,'a-final-audit.json'),JSON.stringify(report,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:report.ok,revision:report.revision,units:report.units,state_sha256:report.state_sha256,units_sha256:report.units_sha256,units_unchanged:report.units_unchanged,snapshot_unchanged:report.snapshot_unchanged,inherited_w_files:report.inherited_w_files,sealed_v_files:report.sealed_v_files,frozen_root_files:report.frozen_root_files,context:{sha256:report.context.sha256,revision:report.context.revision,sources:contextSources.length,mismatches:contextSources.filter(f=>f.expected!==f.actual)},template:report.template,sourceArtifacts,commands:commandResults.map(r=>({label:r.label,exit_code:r.exit_code})),stop_files:missingStopFiles},null,2));
if(!report.ok)process.exitCode=1;
