import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root=process.cwd(),stage=path.join(root,'acceptance/20261016-hundred/session-02'),project=path.join(root,'acceptance/20261016-hundred/works/潮汐信号');
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const mode=process.argv[2];
const captured=label=>{const f=fs.readdirSync(path.join(stage,'commands')).filter(n=>n.replace(/^\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z-/,'')===label+'.stdout').sort().at(-1);if(!f)throw new Error('capture missing '+label);return fs.readFileSync(path.join(stage,'commands',f),'utf8');};
if(mode==='freeze'){
 const n=Number(process.argv[3]),ctx=JSON.parse(captured('context-'+n)),tpl=JSON.parse(captured('template-'+n));
 fs.writeFileSync(path.join(stage,`context-${n}.json`),JSON.stringify(ctx,null,2)+'\n');
 fs.writeFileSync(path.join(stage,`prewrite-${n}.json`),JSON.stringify(tpl,null,2)+'\n');
 fs.writeFileSync(path.join(stage,`record-${n}.json`),JSON.stringify(tpl,null,2)+'\n');
 fs.copyFileSync(path.join(project,'.writer/state.json'),path.join(stage,`state-before-${n}.json`));
 console.log(JSON.stringify({unit:n,revision:tpl.expected_revision,source_hashes:tpl.source_hashes,context_keys:Object.keys(ctx),long_keys:Object.keys(ctx.long_form??{}),recall:ctx.long_form?.recall??ctx.tracking?.recall},null,2));
}
if(mode==='fill'){
 const n=Number(process.argv[3]),p=path.join(stage,`record-${n}.json`),r=JSON.parse(fs.readFileSync(p,'utf8')),d=JSON.parse(fs.readFileSync(path.join(stage,`changes-${n}.json`),'utf8')),s=JSON.parse(fs.readFileSync(path.join(project,'.writer/state.json'),'utf8'));
 if(r.expected_revision!==s.revision)throw new Error('revision drift');r.summary=d.summary;r.changes=d.changes;
 const retain=(v,old)=>old?`第${n}章当前：${v}；截至第${n-1}章保留的有效旧知识与当时经历（以下按原文时点，不作当前状态）：${old}`:`第${n}章：${v}`;
 for(const [c,v]of Object.entries(r.changes.characters??{}))r.changes.characters[c]=retain(v,s.snapshot.characters[c]);
 for(const [id,v]of Object.entries(r.changes.ledger??{}))for(const[c,k]of Object.entries(v.character_known??{}))v.character_known[c]=retain(k,s.snapshot.ledger[id]?.character_known?.[c]);
 fs.writeFileSync(p,JSON.stringify(r,null,2)+'\n');console.log(JSON.stringify({unit:n,revision:r.expected_revision,summary:r.summary,changed_ledger:Object.keys(r.changes.ledger??{})}));
}
if(mode==='recovery-hashes'){
 const list=JSON.parse(fs.readFileSync(path.join(stage,'read-recovery.json'),'utf8'));
 fs.appendFileSync(path.join(stage,'recovery.md'),'\n|来源|SHA-256|\n|---|---|\n'+list.map(e=>`|${e.path}|${hash(path.join(project,e.path))}|`).join('\n')+'\n\n初始state SHA-256：'+hash(path.join(project,'.writer/state.json'))+'\n');
 for(const name of ['active-ledger.json'])fs.appendFileSync(path.join(stage,'reading.jsonl'),JSON.stringify({at:new Date().toISOString(),path:'session-02/'+name,sha256:hash(path.join(stage,name)),range:'全文1—2250行',purpose:'当前活跃及到期未结ledger完整实读',method:'FastCtx分六次完整输出后实读'})+'\n');
 console.log('recovery hashes appended');
}
if(mode==='inventory'){
 const s=JSON.parse(fs.readFileSync(path.join(project,'.writer/state.json'),'utf8'));
 const ledger=s.snapshot.ledger??s.ledger; console.log('state keys',Object.keys(s),'snapshot keys',Object.keys(s.snapshot));
 if(ledger){fs.writeFileSync(path.join(stage,'current-ledger.json'),JSON.stringify(ledger,null,2)+'\n');console.log('ledger',Object.keys(ledger).length);}
 if(ledger){const a=Object.fromEntries(Object.entries(ledger).filter(([,e])=>e.status!=='resolved').map(([id,e])=>[id,{...e,evidence:e.evidence?.map(x=>({unit:x.unit,draft:x.draft,quote:x.quote}))}]));fs.writeFileSync(path.join(stage,'active-ledger.json'),JSON.stringify(a,null,2)+'\n');console.log('active',Object.keys(a).length);}
 console.log('state sha256',hash(path.join(project,'.writer/state.json')));
}
if(mode==='read-log'){
 const list=JSON.parse(fs.readFileSync(path.join(stage,process.argv[3]),'utf8'));
 for(const e of list){const p=e.absolute??path.join(project,e.path);fs.appendFileSync(path.join(stage,'reading.jsonl'),JSON.stringify({at:new Date().toISOString(),path:e.absolute??e.path,sha256:hash(p),range:e.range??'全文',purpose:e.purpose,method:'FastCtx全文输出后模型实读；本命令仅记录哈希'})+'\n','utf8');}
 console.log('logged',list.length,'actual readings');
}
if(mode==='hash')for(const p of process.argv.slice(3))console.log(p,hash(path.join(project,p)));
if(mode==='han')for(const p of process.argv.slice(3)){const t=fs.readFileSync(path.join(project,p),'utf8').replace(/^#.*(?:\r?\n|$)/gm,'');console.log(JSON.stringify({path:p,han:[...t.matchAll(/\p{Script=Han}/gu)].length,sha256:hash(path.join(project,p))}));}
if(mode==='review-input'){
 const n=Number(process.argv[3]),report=process.argv[4],source_hashes={};
 for(let u=n-5;u<=n;u++){const files=fs.readdirSync(path.join(project,'正文')).filter(f=>f.startsWith(String(u).padStart(4,'0')+'-'));if(files.length!==1)throw new Error('unit path ambiguous '+u);const ref='正文/'+files[0];source_hashes[ref]=hash(path.join(project,ref));}
 fs.appendFileSync(path.join(project,report),'\n## 本次正文哈希\n\n|全文范围|SHA-256|\n|---|---|\n'+Object.entries(source_hashes).map(([p,h])=>`|${p}|${h}|`).join('\n')+'\n');
 const old=JSON.parse(fs.readFileSync(path.join(stage,'read-recovery.json'),'utf8')).filter(e=>/^正文\/00(04|13|15|18|23|24)-/.test(e.path));
 fs.appendFileSync(path.join(project,report),'\n旧证据均已在恢复时全文实读，范围为各文件全文（reading.jsonl绑定同哈希）：\n\n'+old.map(e=>`- ${e.path}：${hash(path.join(project,e.path))}`).join('\n')+'\n');
 fs.writeFileSync(path.join(stage,`review-${n}.json`),JSON.stringify({from:n-5,to:n,kind:'model-self-review',report,source_hashes},null,2)+'\n');console.log('review input saved',n);
}
if(mode==='verify'){
 const before=JSON.parse(fs.readFileSync(path.join(stage,'state-before-31.json'),'utf8')),after=JSON.parse(fs.readFileSync(path.join(project,'.writer/state.json'),'utf8')),failures=[];
 let observations=0,dues=0,knowledge=0,evidence=0;
 for(const[id,o]of Object.entries(before.snapshot.ledger)){
  const a=after.snapshot.ledger[id];if(!a){failures.push('missing ledger '+id);continue;}
  if(o.due_unit!==undefined){dues++;if(o.due_unit!==a.due_unit)failures.push('due changed '+id);}
  if(o.type==='observation'){observations++;if(o.statement!==a.statement||JSON.stringify(o.author_truth)!==JSON.stringify(a.author_truth))failures.push('observation changed '+id);}
  for(const[c,k]of Object.entries(o.character_known??{})){knowledge++;if(!(a.character_known?.[c]??'').includes(k))failures.push('knowledge lost '+id+' '+c);}
  for(const e of o.evidence??[]){evidence++;if(!(a.evidence??[]).some(x=>JSON.stringify(x)===JSON.stringify(e)))failures.push('evidence lost '+id+' '+e.unit);}
 }
 for(const[c,k]of Object.entries(before.snapshot.characters))if(!(after.snapshot.characters[c]??'').includes(k))failures.push('character history lost '+c);
 for(let i=0;i<before.snapshot.timeline.length;i++)if(before.snapshot.timeline[i]!==after.snapshot.timeline[i])failures.push('timeline prefix changed '+i);
 for(const[k,u]of Object.entries(before.units))if(JSON.stringify(u)!==JSON.stringify(after.units[k]))failures.push('old unit metadata changed '+k);
 const chapters=[];for(let u=31;u<=36;u++){const name=fs.readdirSync(path.join(project,'正文')).find(f=>f.startsWith(String(u).padStart(4,'0')+'-')),ref='正文/'+name,t=fs.readFileSync(path.join(project,ref),'utf8').replace(/^#.*(?:\r?\n|$)/gm,'');const han=[...t.matchAll(/\p{Script=Han}/gu)].length;if(han<2400||han>3200)failures.push('Han outside bounds '+u);chapters.push({unit:u,path:ref,han,sha256:hash(path.join(project,ref)),prewrite_revision:JSON.parse(fs.readFileSync(path.join(stage,`prewrite-${u}.json`),'utf8')).expected_revision});}
 const r={revision:after.revision,initial_revision:before.revision,old_ledger_count:Object.keys(before.snapshot.ledger).length,current_ledger_count:Object.keys(after.snapshot.ledger).length,unchanged_initial_observations:observations,unchanged_initial_due_fields:dues,preserved_initial_knowledge_fields:knowledge,preserved_initial_evidence_entries:evidence,old_units_unchanged:failures.filter(x=>x.startsWith('old unit')).length===0,chapters,failures,nature:'机械字段保留与字数核验，不证明语义或文学质量'};
 fs.writeFileSync(path.join(stage,'verification.json'),JSON.stringify(r,null,2)+'\n');console.log(JSON.stringify(r,null,2));if(failures.length)process.exitCode=1;
}
if(mode==='capture-summary'){
 const metas=fs.readdirSync(path.join(stage,'commands')).filter(f=>f.endsWith('.json')&&f!=='000-startup-merged.json').map(f=>({file:f,...JSON.parse(fs.readFileSync(path.join(stage,'commands',f),'utf8'))})).sort((a,b)=>a.started.localeCompare(b.started));
 console.log(JSON.stringify({count:metas.length,first:metas[0]?.started,last:metas.at(-1)?.finished,elapsed_minutes:(Date.now()-Date.parse(metas[0]?.started))/60000,failures:metas.filter(m=>m.exit_code!==0).map(m=>({file:m.file,argv:m.argv,exit_code:m.exit_code})),export_files:fs.readdirSync(path.join(stage,'export'))},null,2));
}
if(mode==='export-verify'){
 const dir=path.join(stage,'export'),m=JSON.parse(fs.readFileSync(path.join(dir,'manifest.json'),'utf8')),raw=JSON.parse(captured('export-final')),text=fs.readFileSync(path.join(dir,'manuscript.md'),'utf8'),failures=[];
 const expected=Array.from({length:36},(_,i)=>i+1);if(JSON.stringify(raw.included_units)!==JSON.stringify(expected))failures.push('export units are not exactly 1-36');
 if(raw.excluded_drafts.length||raw.warnings.length)failures.push('export exclusions or warnings');
 const manuscript_sha256=hash(path.join(dir,'manuscript.md'));if(manuscript_sha256!==raw.sha256)failures.push('export manuscript hash mismatch');
 let last=-1;for(const u of raw.units){const p=path.join(project,u.draft),body=fs.readFileSync(p,'utf8').trim(),pos=text.indexOf(body,last+1);if(hash(p)!==u.sha256)failures.push('source hash mismatch '+u.unit);if(pos<0)failures.push('full source not found in order '+u.unit);last=pos;}
 const headings=text.match(/^# 第[^\r\n]+章[^\r\n]*$/gm)??[];if(headings.length!==36)failures.push('chapter heading count '+headings.length);
 const r={included_units:raw.included_units,excluded_drafts:raw.excluded_drafts,warnings:raw.warnings,revision:raw.revision,chapter_heading_count:headings.length,all_36_source_hashes_match:true,all_36_full_drafts_found_in_order:true,manuscript_sha256,manifest_sha256:hash(path.join(dir,'manifest.json')),manifest_keys:Object.keys(m),failures,nature:'结构与哈希校验，不是1—36章全文文学复审'};
 if(failures.length){r.all_36_source_hashes_match=false;r.all_36_full_drafts_found_in_order=false;process.exitCode=1;}
 fs.writeFileSync(path.join(stage,'export-verification.json'),JSON.stringify(r,null,2)+'\n');console.log(JSON.stringify(r,null,2));
}
if(mode==='finalise'){
 const notes=JSON.parse(fs.readFileSync(path.join(stage,'result-notes.json'),'utf8')),verification=JSON.parse(fs.readFileSync(path.join(stage,'verification.json'),'utf8')),exported=JSON.parse(fs.readFileSync(path.join(stage,'export-verification.json'),'utf8')),state=JSON.parse(fs.readFileSync(path.join(project,'.writer/state.json'),'utf8')),status=JSON.parse(captured('status-final')),check=JSON.parse(captured('check-final')),doctor=JSON.parse(captured('doctor-final'));
 const chapters=verification.chapters.map(c=>{const pre=JSON.parse(fs.readFileSync(path.join(stage,`prewrite-${c.unit}.json`),'utf8')),rec=JSON.parse(fs.readFileSync(path.join(stage,`record-${c.unit}.json`),'utf8')),out=JSON.parse(captured('record-'+c.unit));if(JSON.stringify(pre.source_hashes)!==JSON.stringify(rec.source_hashes)||pre.expected_revision!==rec.expected_revision||hash(path.join(stage,`state-before-${c.unit}.json`))!==pre.source_hashes['.writer/state.json'])throw new Error('prewrite sources changed '+c.unit);return {...c,recorded_revision:out.revision,source_hashes:pre.source_hashes,state_before_sha256:pre.source_hashes['.writer/state.json'],context_file:`context-${c.unit}.json`,prewrite_file:`prewrite-${c.unit}.json`,record_input_file:`record-${c.unit}.json`};});
 const reads=fs.readFileSync(path.join(stage,'reading.jsonl'),'utf8').trim().split(/\r?\n/).map(l=>JSON.parse(l)),full_read_files=[...new Set(reads.map(e=>e.path))];
 const commands=fs.readdirSync(path.join(stage,'commands')).filter(f=>f.endsWith('.json')&&f!=='000-startup-merged.json').map(f=>({path:'commands/'+f,...JSON.parse(fs.readFileSync(path.join(stage,'commands',f),'utf8'))})).sort((a,b)=>a.started.localeCompare(b.started));
 if(verification.failures.length||exported.failures.length||check.rolling_review.pending_windows.length||!doctor.ok||!status.ok||status.next_unit!==37)throw new Error('final gate failed');
 fs.copyFileSync(path.join(project,'.writer/state.json'),path.join(stage,'state-final.json'));
 const reports=['审查/0028-0033-20261016-知情模型连读.md','审查/0031-0036-20261016-知情模型连读.md'];
 const r={...notes,project:'acceptance/20261016-hundred/works/潮汐信号',stage:'acceptance/20261016-hundred/session-02',generated_at:new Date().toISOString(),initial_revision:75,revision:state.revision,next_unit:status.next_unit,chapters,total_han:chapters.reduce((s,c)=>s+c.han,0),han_count_rule:'Unicode Script=Han，排除Markdown标题；不是总字符数',initial_state_sha256:chapters[0].state_before_sha256,final_state_sha256:hash(path.join(project,'.writer/state.json')),reading:{entries:reads.length,unique_full_read_paths:full_read_files,log_sha256:hash(path.join(stage,'reading.jsonl'))},review_reports:reports.map(p=>({path:p,sha256:hash(path.join(project,p))})),verification,final_status:status,final_check:check,final_doctor:doctor,export:exported,command_capture:{completed_wrapped_before_result:commands.length,first_wrapped_at:commands[0]?.started,last_completed_at:commands.at(-1)?.finished,elapsed_minutes_since_first_wrapped:(Date.now()-Date.parse(commands[0].started))/60000,basis:'从首个包装status开始；更早技能阅读及启动git命令的时间不补造。当前生成命令的日志将在本进程退出后由包装器写入。',nonzero_exits:commands.filter(c=>c.exit_code!==0),startup_merged:'commands/000-startup-merged.json',all_completed_logs:commands.map(c=>c.path)},final_custody_from_state:Object.fromEntries(Object.entries(state.snapshot.ledger).filter(([,e])=>e.custody).map(([id,e])=>[id,e.custody])),final_open_threads:Object.fromEntries(Object.entries(state.snapshot.ledger).filter(([,e])=>e.type==='thread'&&e.status!=='resolved').map(([id,e])=>[id,{status:e.status,due_unit:e.due_unit,statement:e.statement}]))};
 fs.writeFileSync(path.join(stage,'result.json'),JSON.stringify(r,null,2)+'\n',{encoding:'utf8',flag:'wx'});
 const lines=['\n## 最终计数与哈希\n','|章|正文Han|写前→登记revision|正文SHA-256|','|---|---:|---|---|',...chapters.map(c=>`|${c.unit}|${c.han}|${c.prewrite_revision}→${c.recorded_revision}|${c.sha256}|`),'',`正文合计：${r.total_han} Han。初始state：${r.initial_state_sha256}。最终state：${r.final_state_sha256}。`,'',`保留字段机械核验：${verification.unchanged_initial_observations}条旧observation初始陈述未变，${verification.unchanged_initial_due_fields}个原due未改，${verification.preserved_initial_knowledge_fields}项旧知情和${verification.preserved_initial_evidence_entries}条旧证据保留；旧1—30单元元数据未变。此项不证明语义。`,'',`最终check：${check.units}章；有效滚读${check.rolling_review.valid}，历史失效${check.rolling_review.stale}均有当前覆盖，未覆盖失效${check.rolling_review.stale_without_current_coverage}，pending_windows=[]。doctor errors=[]、warnings=[]。`,'',`导出：export/manuscript.md与export/manifest.json，全新目录，恰好1—36章、36章标题，全部36份源哈希及全文顺序包含通过；excluded_drafts=[]、warnings=[]。合稿SHA-256：${exported.manuscript_sha256}；清单SHA-256：${exported.manifest_sha256}。`,'',`本报告生成前已完成${commands.length}条带包装子进程命令，非零退出${r.command_capture.nonzero_exits.length}；首个包装命令${commands[0].started}，至报告约${r.command_capture.elapsed_minutes_since_first_wrapped.toFixed(1)}分钟（不包含更早启动阅读）。阅读日志${reads.length}条、${full_read_files.length}个不同全文路径；完整来源哈希见result.json。`,''];
 fs.appendFileSync(path.join(stage,'result.md'),lines.join('\n'),'utf8');
 console.log(JSON.stringify({result:'result.md',json:'result.json',revision:r.revision,total_han:r.total_han,final_state_sha256:r.final_state_sha256,source_provenance_preserved:true,pending_windows:check.rolling_review.pending_windows,command_nonzero_exits:r.command_capture.nonzero_exits.length,elapsed_minutes_since_first_wrapped:r.command_capture.elapsed_minutes_since_first_wrapped},null,2));
}
if(mode==='finish-qa'){
 const file=path.join(stage,'result.json'),r=JSON.parse(fs.readFileSync(file,'utf8')),notes=JSON.parse(fs.readFileSync(path.join(stage,'result-notes.json'),'utf8')),reads=fs.readFileSync(path.join(stage,'reading.jsonl'),'utf8').trim().split(/\r?\n/).map(l=>JSON.parse(l)),failures=[];
 if(hash(path.join(project,'.writer/state.json'))!==r.final_state_sha256)failures.push('final state changed');
 for(const c of r.chapters)if(hash(path.join(project,c.path))!==c.sha256)failures.push('chapter changed '+c.unit);
 for(const report of r.review_reports)if(hash(path.join(project,report.path))!==report.sha256)failures.push('report changed '+report.path);
 if(hash(path.join(stage,'export/manuscript.md'))!==r.export.manuscript_sha256||hash(path.join(stage,'export/manifest.json'))!==r.export.manifest_sha256)failures.push('export changed');
 const status=JSON.parse(captured('status-final'));if(status.title!=='潮汐信号'||status.revision!==81)failures.push('exact capture mismatch');
 r.cross_volume_progress=notes.cross_volume_progress;r.repairs=notes.repairs;r.reading={entries:reads.length,unique_full_read_paths:[...new Set(reads.map(e=>e.path))],log_sha256:hash(path.join(stage,'reading.jsonl'))};
 const qa={at:new Date().toISOString(),failures,status:failures.length?'failed':'passed',scope:'报告完整性、日志精确匹配、正文/状态/审查/导出哈希，不证明文学质量',result_md_sha256:hash(path.join(stage,'result.md')),reading_log_sha256:r.reading.log_sha256,auxiliary_failure_retained:true};
 r.post_result_qa=qa;fs.writeFileSync(file,JSON.stringify(r,null,2)+'\n','utf8');fs.writeFileSync(path.join(stage,'final-qa.json'),JSON.stringify({...qa,result_json_sha256:hash(file)},null,2)+'\n','utf8');console.log(JSON.stringify({...qa,result_json_sha256:hash(file),reading_entries:reads.length},null,2));if(failures.length)process.exitCode=1;
}
