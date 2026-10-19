import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url)), base=path.dirname(dir), project=path.join(base,'work');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=f=>JSON.parse(fs.readFileSync(f));
const write=(f,x)=>fs.writeFileSync(f,JSON.stringify(x,null,2)+'\n',{flag:'wx'});
function inventory(root){const rows=[];function walk(p){for(const e of fs.readdirSync(p,{withFileTypes:true})){const f=path.join(p,e.name);if(e.isDirectory())walk(f);else if(e.isFile()){const b=fs.readFileSync(f);rows.push({file:path.relative(root,f).replaceAll('\\','/'),bytes:b.length,sha256:sha(b)});}}}walk(root);return rows;}
const action=process.argv[2];
if(action==='prepare'){
 const prior=read(path.join(base,'read-b/parent-verification-v1.json')), proc=read(path.join(base,'read-b/process-result.json'));assert.equal(prior.ok,true);assert.equal(proc.exit_code,0);
 const bytes=fs.readFileSync(path.join(project,'.writer/state.json')),s=JSON.parse(bytes);assert.equal(sha(bytes),prior.state_sha256);assert.equal(s.units.length,106);
 fs.writeFileSync(path.join(dir,'restore-before-state.bin'),bytes,{flag:'wx'});
 write(path.join(dir,'before-inventory.json'),inventory(project));
 const captures=['doctor','status','workflow-show','identify'];for(const name of captures){const r=read(path.join(base,'commands/read-c-'+name+'/result.json'));assert.equal(r.exit_code,0);assert.equal(r.before_state_sha256,sha(bytes));assert.equal(r.after_state_sha256,sha(bytes));}
 write(path.join(dir,'prerequisite-verification.json'),{ok:true,previous_process_exit_code:proc.exit_code,parent_pass:'read-b/parent-verification-v1.json',tracker_stale:true,state_sha256:sha(bytes),revision:s.revision,restoration_unchanged:true});
 const evidenceText=fs.readFileSync(path.join(dir,'request.raw.md'),'utf8')+'\n\n原人类任务及代理安排：\n'+fs.readFileSync(path.join(base,'PLAN.md'),'utf8');
 const evidenceRef='研究/H轮read-c任务与代理范围.md';fs.writeFileSync(path.join(project,evidenceRef),evidenceText,{flag:'wx'});
 write(path.join(dir,'workflow-input.json'),{expected_revision:s.revision,operation_id:'h-read-c-discuss-plan-075-v1',author_evidence:{quote:'本阶段完整实际读取50–81章。50–54重叠，55–81为本进程新覆盖。',local_source:evidenceRef,source_sha256:sha(Buffer.from(evidenceText)),locator:'read-c/request.raw.md第5行；附H轮PLAN实际原话及代理安排；仅阅读范围，不代表作者文学采纳。',recorded_by:'Codex read-c actual process; parent-organized verification'},workflow:{...s.governance,task:'H轮 read-c：只读恢复0.7.5/generation6，完整阅读原正文50–81章；50–54重读、55–81新覆盖；下一实际进程read-d读77–106。仅讨论规划，不授权正文、细纲或卷契约。',stage:'paused',authorization:{...s.governance.authorization,allowed_actions:['discuss','plan'],draft_range:null,revise_range:null}}});
 console.log(JSON.stringify({prerequisite:true,restore_state_sha256:sha(bytes),files:inventory(project).length,revision:s.revision}));
}else if(action==='resources'){
 const doctor=read(path.join(base,'commands/read-c-doctor/stdout.raw.txt')),build=read(path.join(base,'source-build-v2.json'));
 const refs=['writer-project/SKILL.md','writer-novel/SKILL.md','writer-review/SKILL.md','writer-project/references/long-form.md','writer-novel/references/suspense-continuity.md','writer-review/references/general-review.md','writer-review/references/natural-language-authenticity.md','writer-review/references/suspense-review.md','writer-review/references/physical-logic-operability.md','writer-review/references/character-emotion-consistency.md','writer-review/references/architecture-continuity-review.md','writer-review/references/psychology-readability.md'];
 const freeze=(root,ref,range)=>{const file=path.join(root,ref),b=fs.readFileSync(file),hash=sha(b),dest=path.join(dir,'resource-read-versions',hash+'.md');fs.mkdirSync(path.dirname(dest),{recursive:true});if(!fs.existsSync(dest))fs.writeFileSync(dest,b,{flag:'wx'});return{file,sha256:hash,bytes:b.length,read_range:range??{from_line:1,through_line:b.toString('utf8').trimEnd().split(/\r?\n/).length},version_copy:path.relative(dir,dest).replaceAll('\\','/'),actual_output:'Actual mcp__fastctx.read in this process; independent event audit required'};};
 const current=refs.map(ref=>{const r=freeze(doctor.skill_root,ref);assert.equal(r.sha256,build.files.find(x=>x.group==='skills'&&x.file===ref).sha256);return r;});
 const preserved_root=['writer-project/SKILL.md','writer-novel/SKILL.md','writer-review/SKILL.md'].map(ref=>freeze(doctor.project_skill_root,ref));
 const manuals=[freeze(doctor.content_root,'docs/review-and-registration.md',{from_line:1,through_line:65}),freeze(doctor.content_root,'docs/workflow.md',{from_line:54,through_line:87})];
 write(path.join(dir,'resource-routing-proof.json'),{phase:'read-c',skill_root:doctor.skill_root,content_root:doctor.content_root,project_skill_root:doctor.project_skill_root,current,preserved_root,manuals,root_rules_continue:true,root_replaced:false,version:'0.7.5',source_content_id:build.observed_content_id});console.log(JSON.stringify({current:current.length,preserved:preserved_root.length}));
}else if(action==='reading-start'){
 fs.writeFileSync(path.join(dir,'reading-before-state.bin'),fs.readFileSync(path.join(project,'.writer/state.json')),{flag:'wx'});console.log('Reading state frozen');
}else throw Error('Unknown action');
