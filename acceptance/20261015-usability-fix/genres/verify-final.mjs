import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const base='acceptance/20261015-usability-fix',out=`${base}/genres`;
const load=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const save=(p,v)=>{const text=typeof v==='string'?v:JSON.stringify(v,null,2)+'\n';if(fs.existsSync(p)){assert.equal(fs.readFileSync(p,'utf8'),text,`existing evidence changed: ${p}`);return;}fs.writeFileSync(p,text,{flag:'wx'});};
const cli=label=>{const e=load(`${out}/cli/${label}.json`);assert.equal(e.exit_code,0);return JSON.parse(e.stdout);};
const findings=[];
const check=(name,fn)=>{fn();findings.push({name,ok:true});};
const result={created_at:new Date().toISOString(),cwd:process.cwd(),scope:'最终版本来源、追踪、导出、随附工具与只读边界机械核对，不代表文学或产品整体验收',checks:findings,works:[],manuals:[],observations:[]};
for(const [kind,title,prefix] of [['screenplay','借一把椅子','027'],['history','字放回格子里','028']]){
 const p=`${base}/works/${title}`;
 const hashes=load(`${p}/审查/去味-0001-前后哈希.json`),state=load(`${p}/.writer/state.json`);
 const record=cli(`${prefix}-record-${kind}-final`);
 const mainStatus=cli(kind==='screenplay'?'031-status-screenplay-final':'032-status-history-final');
 const checked=cli(kind==='screenplay'?'029-check-screenplay-final':'030-check-history-final');
 const manifest=load(`${out}/exports/${kind}-r3/manifest.json`);
 check(`${kind}:final hash chain`,()=>{assert.equal(sha(hashes.current_draft.path),hashes.after.sha256);assert.equal(sha(hashes.after.path),hashes.after.sha256);assert.equal(record.sha256,hashes.after.sha256);assert.equal(state.units[0].sha256,record.sha256);assert.equal(state.revision,3);});
 check(`${kind}:status and check clean`,()=>{assert.equal(checked.ok,true);assert.equal(checked.revision,3);assert.deepEqual(checked.findings,[]);for(const k of ['stale_units','changed_sources'])assert.deepEqual(mainStatus[k],[]);assert.deepEqual(mainStatus.draft_inventory.unregistered,[]);assert.deepEqual(mainStatus.draft_inventory.unsafe_entries,[]);assert.equal(mainStatus.draft_inventory.registered_count,1);});
 const context=cli(kind==='screenplay'?'021-context-screenplay-final':'022-context-history-final');
 check(`${kind}:record and context source maps equal`,()=>assert.deepEqual(state.units[0].source_hashes,context.source_hashes));
 const sources=[];
 for(const [rel,expected] of Object.entries(state.units[0].source_hashes)){
  if(rel==='.writer/state.json'){sources.push({path:rel,sha256:expected,note:'写前 revision=2 的真实状态哈希；登记后状态必变，已与写前 context 对照'});continue;}
  const actual=sha(path.join(p,rel));assert.equal(actual,expected);sources.push({path:rel,sha256:actual});
 }
 findings.push({name:`${kind}:all non-state consumed source hashes current`,ok:true});
 check(`${kind}:export exactly final draft with no exclusions`,()=>{assert.equal(manifest.revision,3);assert.equal(manifest.status,'draft-export');assert.deepEqual(manifest.included_units,[1]);assert.deepEqual(manifest.excluded_drafts,[]);assert.deepEqual(manifest.warnings,[]);assert.equal(manifest.sha256,sha(`${out}/exports/${kind}-r3/manuscript.md`));assert.equal(manifest.sha256,hashes.after.sha256);assert.deepEqual(manifest.units[0].source_hashes,state.units[0].source_hashes);});
 const rewind=cli(kind==='screenplay'?'017-rewind-screenplay':'018-rewind-history');
 const rewindPath=path.join(p,rewind.backup),old=load(rewindPath);
 check(`${kind}:rewind retains original baseline`,()=>{assert.equal(old.revision,1);assert.equal(old.units[0].sha256,hashes.before.sha256);assert.equal(sha(hashes.before.path),hashes.before.sha256);});
 const doctor=cli(`bundled-${kind}-doctor`),bundledStatus=cli(`bundled-${kind}-status`);
 check(`${kind}:bundled doctor uses its own tool root`,()=>{assert.equal(doctor.ok,true);assert.equal(doctor.tool_version,'0.3.0');assert.equal(path.resolve(doctor.tool_root),path.resolve(`${p}/.writer/tool`));assert.deepEqual(doctor.errors,[]);assert.deepEqual(doctor.warnings,[]);});
 check(`${kind}:bundled status matches main status`,()=>{const a=structuredClone(mainStatus),b=structuredClone(bundledStatus);delete a.next.command;delete b.next.command;assert.deepEqual(a,b);});
 const helps=[];
 for(const command of ['init','plan','context','record-template','record','rewind','style-scan','check','export','status','doctor']){
  const label=command==='init'?`bundled-${kind}-init-help-corrected`:`bundled-${kind}-${command}-help`;
  const e=load(`${out}/cli/${label}.json`);
  check(`${kind}:${command} help valid local path`,()=>{assert.equal(e.exit_code,0);assert(e.stdout.includes(`ai-writer 0.3.0 / ${command}`));assert(e.stdout.includes(path.resolve(`${p}/docs/user-guide.md`)));assert(e.stdout.includes(path.resolve(`${p}/.writer/tool/bin/ai-writer.mjs`)));});
  helps.push({command,evidence:`cli/${label}.json`,exit_code:e.exit_code});
 }
 const manuals=[];
 for(const file of ['user-guide.md','quickstart.md','workflow.md','deslop.md','long-form.md']){
  const local=`${p}/docs/${file}`,text=fs.readFileSync(local,'utf8');
  check(`${kind}:${file} readable and equals root manual`,()=>{assert(text.trim().length>0);assert(!text.includes('\uFFFD'));assert.equal(sha(local),sha(`docs/${file}`));});
  manuals.push({path:local,bytes:fs.statSync(local).size,sha256:sha(local),readable_utf8:true});
 }
 const guide=fs.readFileSync(`${p}/docs/user-guide.md`,'utf8');
 check(`${kind}:all local user-guide Markdown links exist`,()=>{for(const m of guide.matchAll(/\]\(([^)#]+)(?:#[^)]*)?\)/g))if(!/^[a-z]+:/i.test(m[1]))assert(fs.existsSync(path.resolve(p,'docs',m[1])));});
 result.manuals.push(...manuals);
 const parity=[];
 for(const dir of ['bin','lib'])for(const name of fs.readdirSync(dir).filter(s=>s.endsWith('.mjs'))){const src=`${dir}/${name}`,copy=`${p}/.writer/tool/${src}`;assert.equal(sha(src),sha(copy));parity.push({path:src,sha256:sha(copy)});}
 for(const file of ['writer-project/SKILL.md','writer-screenplay/SKILL.md','writer-history/SKILL.md','writer-history/references/history-method.md','writer-review/SKILL.md','writer-review/references/deslop.md'])assert.equal(sha(`.agents/skills/${file}`),sha(`${p}/.agents/skills/${file}`));
 const provenance=[];
 for(const f of ['LICENSE.md','docs/sources.md','docs/usability-sources.json']){
   const exists=fs.existsSync(`${p}/${f}`);
   provenance.push({path:f,present_in_work:exists,root_sha256:sha(f)});
   if(exists)assert.equal(sha(f),sha(`${p}/${f}`));
   else result.observations.push({kind,code:'BUNDLED_PROVENANCE_ABSENT',path:`${p}/${f}`,impact:'不阻断本次本地CLI流程；单独迁走作品时无法在随附目录读取这些来源及许可说明',patched:false});
 }
 findings.push({name:`${kind}:bundled CLI/modules and applicable skills equal root`,ok:true});
 result.works.push({kind,title,revision:state.revision,final_sha256:record.sha256,baseline_sha256:hashes.before.sha256,sources,rewind_backup:{path:rewindPath,sha256:sha(rewindPath)},bundled_doctor:doctor,helps,tool_files:parity,provenance});
 save(`${p}/审查/去味-0001-追踪与导出复核.json`,result.works.at(-1));
}
const protectedBefore=load(`${out}/protected-before.json`);
const modified=protectedBefore.files.filter(f=>!fs.existsSync(f.path)||sha(f.path)!==f.sha256).map(f=>({...f,current_sha256:fs.existsSync(f.path)?sha(f.path):null}));
const list=spawnSync('git',['ls-files','--cached','--others','--exclude-standard','-z'],{encoding:'utf8'});
assert.equal(list.status,0);
const allowed=p=>p.startsWith(`${base}/genres/`)||p.startsWith(`${base}/works/借一把椅子/`)||p.startsWith(`${base}/works/字放回格子里/`)||p.startsWith('.tmp/');
const known=new Set(protectedBefore.files.map(f=>f.path));
const unexpectedAdded=[...new Set(list.stdout.split('\0').filter(Boolean))].filter(p=>!allowed(p)&&!known.has(p)&&fs.existsSync(p)&&fs.statSync(p).isFile());
result.write_scope={snapshot_at:protectedBefore.created_at,protected_file_count:protectedBefore.files.length,modified,unexpected_added:unexpectedAdded};
const coreOrInput=p=>!p.startsWith('acceptance/')||p.startsWith(`${base}/fixtures/`);
check('product and input protected files unchanged',()=>{assert.deepEqual(modified.filter(f=>coreOrInput(f.path)),[]);assert.deepEqual(unexpectedAdded.filter(coreOrInput),[]);});
if(modified.length||unexpectedAdded.length)result.observations.push({code:'OTHER_ACCEPTANCE_DRIFT_OBSERVED',modified,unexpected_added:unexpectedAdded,attribution:'本轮命令仅写指定两作品及genres；这些文件本轮未写，外部变更来源未确认，不回退或覆盖。',whole_workspace_zero_drift:false});
const executions=fs.readFileSync(`${out}/cli-executions.jsonl`,'utf8').trim().split('\n').map(s=>JSON.parse(s));
result.recorded_cli_calls={total:executions.length,successful:executions.filter(e=>e.exit_code===0).length,nonzero:executions.filter(e=>e.exit_code!==0).map(e=>({argv:e.argv,exit_code:e.exit_code,stderr:e.stderr}))};
assert.equal(result.recorded_cli_calls.nonzero.length,2);
assert(result.recorded_cli_calls.nonzero.every(e=>e.argv.includes('init')&&e.argv.includes('--project')));
save(`${out}/git-status-final.txt`,spawnSync('git',['status','--short'],{encoding:'utf8'}).stdout);
result.ok=true;
save(`${out}/verification-final.json`,result);
console.log(JSON.stringify({ok:true,checks:findings.length,works:result.works.map(w=>({kind:w.kind,revision:w.revision,sha256:w.final_sha256,help_count:w.helps.length})),manual_count:result.manuals.length,write_scope:result.write_scope,cli_calls:result.recorded_cli_calls},null,2));
