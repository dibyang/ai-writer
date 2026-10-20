import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {base,root,work,read,sha,state,save} from './common.mjs';
const facts=JSON.parse(fs.readFileSync(path.join(base,'c-checkpoint-facts.json'),'utf8'));
const s=state();
assert.equal(s.units.length,24);assert.equal(s.revision,62);assert.equal(sha(read('.writer/state.json')),facts.state_sha256);assert.equal(s.tool_control.generation,4);assert.equal(s.tool_control.installed.source_content_id,facts.content_id);
const exitStatus=JSON.parse(fs.readFileSync(path.join(base,'c-exit-status.json'),'utf8'));
assert.deepEqual(exitStatus.stale_units,[]);assert.deepEqual(exitStatus.changed_sources,[]);assert.deepEqual(exitStatus.impact_pending,[]);assert.ok(exitStatus.revisions.sessions.every(x=>x.status==='committed'));assert.ok(exitStatus.revisions.transactions.every(x=>x.status==='completed'));
const partRefs=['分段/0025/part-01.md','分段/0025/part-02.md'];
assert.deepEqual(fs.readdirSync(path.join(work,'分段/0025')).sort(),['part-01.md','part-02.md']);assert.ok(!fs.existsSync(path.join(work,'正文/0025.md')));
for(const n of ['0026','0027']){assert.ok(!fs.existsSync(path.join(work,'正文',n+'.md')));assert.ok(!fs.existsSync(path.join(work,'分段',n)));}
const metadata=ref=>{const file=ref.startsWith('T/')?path.join(base,ref.slice(2)):path.join(work,ref);const b=fs.readFileSync(file);return {ref,path:file,bytes:b.length,sha256:sha(b)};};
const parts=partRefs.map(ref=>({...metadata(ref),han:(read(ref).toString('utf8').replace(/^#.*$/gm,'').match(/\p{Script=Han}/gu)||[]).length,read_range:ref.includes('01.md')?'1—58 EOF':'1—60 EOF'}));
assert.equal(parts.reduce((n,p)=>n+p.han,0),3660);assert.equal((read(partRefs[0]).toString().match(/^# /gm)||[]).length,1);assert.equal((read(partRefs[1]).toString().match(/^# /gm)||[]).length,0);
const templateRef='.writer/drafts/t-record-25-c-first.json',contextRef='.writer/drafts/t-context-25-c-first.json';
const template=JSON.parse(read(templateRef));assert.equal(template.expected_revision,62);for(const [ref,hash] of Object.entries(template.source_hashes))assert.equal(sha(read(ref)),hash,ref);
const before=JSON.parse(fs.readFileSync(path.join(base,'c-25-two-parts-final-read-before-v2.json'),'utf8'));const after=JSON.parse(fs.readFileSync(path.join(base,'c-25-two-parts-final-read-after.json'),'utf8'));
for(const p of parts){assert.equal(before.files.find(x=>x.ref===p.ref).sha256,p.sha256);assert.equal(after.files.find(x=>x.ref===p.ref).sha256,p.sha256);}
const currentBefore=JSON.parse(fs.readFileSync(path.join(base,'c-current-reading-before.json'),'utf8'));const currentAfter=JSON.parse(fs.readFileSync(path.join(base,'c-current-reading-after.json'),'utf8'));for(const n of ['0021','0022','0023','0024']){const ref='正文/'+n+'.md';assert.equal(currentBefore.files.find(x=>x.ref===ref).sha256,sha(read(ref)));assert.equal(currentAfter.files.find(x=>x.ref===ref).sha256,sha(read(ref)));}
const sourceRefs=[...Object.keys(template.source_hashes),...partRefs,templateRef,contextRef,'交接/T-细纲-0025.json','交接/T-细纲-0026.json','交接/T-细纲-0027.json','交接/T-B-完成0024.md',facts.handover,...facts.reports,'研究/T轮验证授权.md','正文/0020.md','正文/0021.md','正文/0022.md','T/execution-guide.md','T/current-tool-update-verification.json','T/c-checkpoint-facts.json','T/c-current-reading-before.json','T/c-current-reading-after.json','T/c-related-reading-before.json','T/c-25-writing-sources-before.json','T/c-25-writing-sources-after.json','T/c-25-two-parts-final-read-before-v2.json','T/c-25-two-parts-final-read-after.json','T/c-entry-status.json','T/c-entry-workflow.json','T/c-entry-identify.json','T/c-entry-revisions.json','T/c-exit-status.json','T/c-exit-updates.json','T/c-exit-check.json','T/c-recall-install.json','T/c-recall-cart-return.json','T/c-recall-inspection.json'];
const git=spawnSync('git',['status','--short'],{cwd:root,encoding:'utf8',windowsHide:true});assert.equal(git.status,0);save('c-exit-root-git-status.raw.txt',git.stdout);sourceRefs.push('T/c-exit-root-git-status.raw.txt');
const checkpoint={...facts,captured_at:new Date().toISOString(),work,parts,total_body_han:3660,plans:['交接/T-细纲-0025.json','交接/T-细纲-0026.json','交接/T-细纲-0027.json'].map(metadata),context:metadata(contextRef),template:metadata(templateRef),source_hashes_from_original_template:template.source_hashes,sources:[...new Set(sourceRefs)].map(metadata)};
save('checkpoint-c-first.json',checkpoint);
const actual=JSON.parse(fs.readFileSync(path.join(base,'checkpoint-c-first.json'),'utf8'));for(const source of actual.sources)assert.equal(sha(fs.readFileSync(source.path)),source.sha256,source.ref);
save('c-first-verification.json',{ok:true,checked_at:new Date().toISOString(),registered:24,revision:62,state_sha256:sha(read('.writer/state.json')),generation:4,content_id:facts.content_id,total_body_han:3660,parts,checkpoint:metadata('T/checkpoint-c-first.json'),source_count:actual.sources.length,all_source_hashes_match:true,only_two_parts:true,no_chapter25_body:true,no_record25:true,no_26_27_drafting:true,nature:'mechanical evidence plus separately recorded informed self-reading; not literary acceptance'});
console.log(JSON.stringify({ok:true,registered:24,revision:62,total_body_han:3660,sources:actual.sources.length,parts,checkpoint_sha256:sha(fs.readFileSync(path.join(base,'checkpoint-c-first.json')))},null,2));
