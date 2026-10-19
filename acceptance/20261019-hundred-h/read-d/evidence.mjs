import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url)),base=path.dirname(dir),project=path.join(base,'work');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),read=f=>JSON.parse(fs.readFileSync(f));
const write=(f,x)=>fs.writeFileSync(f,JSON.stringify(x,null,2)+'\n',{flag:'wx'});
function inventory(root){const rows=[];function walk(p){for(const e of fs.readdirSync(p,{withFileTypes:true})){const f=path.join(p,e.name);if(e.isDirectory())walk(f);else if(e.isFile()){const b=fs.readFileSync(f);rows.push({file:path.relative(root,f).replaceAll('\\','/'),bytes:b.length,sha256:sha(b)});}}}walk(root);return rows;}
const action=process.argv[2];
if(action==='prepare'){
 const prior=read(path.join(base,'read-c/parent-verification-v1.json')),proc=read(path.join(base,'read-c/process-result.json'));assert.equal(prior.ok,true);assert.equal(proc.exit_code,0);
 const bytes=fs.readFileSync(path.join(project,'.writer/state.json')),s=JSON.parse(bytes);assert.equal(sha(bytes),prior.state_sha256);assert.equal(s.units.length,106);
 fs.writeFileSync(path.join(dir,'restore-before-state.bin'),bytes,{flag:'wx'});write(path.join(dir,'before-inventory.json'),inventory(project));
 for(const name of ['restore-doctor','restore-status','restore-workflow','restore-context','restore-identify','restore-compare']){const r=read(path.join(base,'commands/read-d-'+name+'/result.json'));assert.equal(r.exit_code,0);assert.equal(r.before_state_sha256,sha(bytes));assert.equal(r.after_state_sha256,sha(bytes));}
 fs.writeFileSync(path.join(dir,'restore-after-state.bin'),bytes,{flag:'wx'});
 write(path.join(dir,'prerequisite-verification.json'),{ok:true,previous_process_exit_code:proc.exit_code,parent_pass:'read-c/parent-verification-v1.json',state_sha256:sha(bytes),revision:s.revision,restoration_unchanged:true,allowed_actions:s.governance.authorization.allowed_actions});
 const evidenceText=fs.readFileSync(path.join(dir,'request.raw.md'),'utf8')+'\n\n原人类任务及代理安排：\n'+fs.readFileSync(path.join(base,'PLAN.md'),'utf8'),evidenceRef='研究/H轮read-d任务与代理范围.md';fs.writeFileSync(path.join(project,evidenceRef),evidenceText,{flag:'wx'});
 write(path.join(dir,'workflow-input.json'),{expected_revision:s.revision,operation_id:'h-read-d-discuss-plan-075-v1',author_evidence:{quote:'本人完整实际读取77–106章，77–81为重叠、82–106为新增阅读覆盖，统一助手每1–2章并保存实际版本。',local_source:evidenceRef,source_sha256:sha(Buffer.from(evidenceText)),locator:'read-d/request.raw.md及H轮PLAN实际原话与代理范围；只阅读讨论，不代表作者采纳文学建议。',recorded_by:'Codex read-d actual process; parent-organized verification'},workflow:{...s.governance,task:'H轮 read-d：恢复0.7.5/generation6，完整阅读77–106章；77–81重叠、82–106新增，必要旧文补读另列。梳理承诺矩阵、旧章候选及107–112粗建议；仅讨论规划，无正文/细纲/卷契约授权，父核后draft-a才可有限创作。',stage:'paused',authorization:{...s.governance.authorization,allowed_actions:['discuss','plan'],draft_range:null,revise_range:null}}});console.log(JSON.stringify({prerequisite:true,revision:s.revision,state_sha256:sha(bytes)}));
}else if(action==='resources'){
 const doctor=read(path.join(base,'commands/read-d-restore-doctor/stdout.raw.txt')),build=read(path.join(base,'source-build-v2.json'));
 const refs=['writer-project/SKILL.md','writer-novel/SKILL.md','writer-review/SKILL.md','writer-project/references/long-form.md','writer-novel/references/suspense-continuity.md','writer-review/references/general-review.md','writer-review/references/natural-language-authenticity.md','writer-review/references/suspense-review.md','writer-review/references/physical-logic-operability.md','writer-review/references/character-emotion-consistency.md','writer-review/references/architecture-continuity-review.md','writer-review/references/psychology-readability.md'];
 const freeze=(root,ref)=>{const file=path.join(root,ref),b=fs.readFileSync(file),hash=sha(b),dest=path.join(dir,'resource-read-versions',hash+'.md');fs.mkdirSync(path.dirname(dest),{recursive:true});if(!fs.existsSync(dest))fs.writeFileSync(dest,b,{flag:'wx'});return{file,sha256:hash,bytes:b.length,read_range:{from_line:1,through_line:b.toString('utf8').trimEnd().split(/\r?\n/).length},version_copy:path.relative(dir,dest).replaceAll('\\','/'),actual_output:'Actual numbered read in this process; independent event audit required'};};
 const current=refs.map(ref=>{const r=freeze(doctor.skill_root,ref);assert.equal(r.sha256,build.files.find(x=>x.group==='skills'&&x.file===ref).sha256);return r;});
 const preserved_root=['writer-project/SKILL.md','writer-novel/SKILL.md','writer-review/SKILL.md'].map(ref=>freeze(doctor.project_skill_root,ref));
 const manuals=['docs/review-and-registration.md','docs/workflow.md'].map(ref=>freeze(doctor.content_root,ref));
 write(path.join(dir,'resource-routing-proof.json'),{phase:'read-d',skill_root:doctor.skill_root,content_root:doctor.content_root,project_skill_root:doctor.project_skill_root,current,preserved_root,manuals,root_rules_continue:true,root_replaced:false,version:'0.7.5',source_content_id:build.observed_content_id});console.log(JSON.stringify({current:current.length,preserved:preserved_root.length}));
}else if(action==='reading-start'){fs.writeFileSync(path.join(dir,'reading-before-state.bin'),fs.readFileSync(path.join(project,'.writer/state.json')),{flag:'wx'});console.log('Reading state frozen');}else throw Error('Unknown action');
