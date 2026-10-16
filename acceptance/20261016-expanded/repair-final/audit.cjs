const fs=require('fs'),path=require('path'),crypto=require('crypto'),util=require('util');
const {pathToFileURL}=require('url');
const root=path.resolve(__dirname,'../../..'),project=path.resolve(__dirname,'../works/潮汐信号');
const json=f=>JSON.parse(fs.readFileSync(f,'utf8')),read=f=>json(path.join(__dirname,f));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),same=util.isDeepStrictEqual;
const put=(f,v)=>fs.writeFileSync(path.join(__dirname,f),JSON.stringify(v,null,2)+'\n');
(async()=>{
const before=read('before-state.json'),after=json(path.join(project,'.writer/state.json'));
const checks=[],check=(name,pass,detail)=>checks.push({name,pass,...(detail===undefined?{}:{detail})});
fs.copyFileSync(path.join(project,'.writer/state.json'),path.join(__dirname,'after-state.json'));
put('after-ledger.json',after.snapshot.ledger);put('after-characters.json',after.snapshot.characters);
const B=before.snapshot.ledger,A=after.snapshot.ledger;
function diff(b,a,at=[]){if(same(b,a))return [];if(b&&a&&!Array.isArray(b)&&!Array.isArray(a)&&typeof b==='object'&&typeof a==='object')return [...new Set([...Object.keys(b),...Object.keys(a)])].flatMap(k=>diff(b[k],a[k],[...at,k]));return [{path:at.join('.'),before:b,after:a}];}
const ledgerDiff=diff(B,A),characterDiff=diff(before.snapshot.characters,after.snapshot.characters);
put('ledger-diff-complete.json',ledgerDiff);put('characters-diff-complete.json',characterDiff);
check('revision_67_and_exact_units_1_24',after.revision===67&&same(after.units.map(x=>x.unit),Array.from({length:24},(_,i)=>i+1)));
check('ledger_43_same_ids',Object.keys(A).length===43&&same(Object.keys(B).sort(),Object.keys(A).sort()));
check('units_1_23_entire_registration_unchanged',same(before.units.slice(0,23),after.units.slice(0,23)));
check('baseline_unchanged',same(before.baseline,after.baseline));
check('timeline_threads_unchanged',same(before.snapshot.timeline,after.snapshot.timeline)&&same(before.snapshot.threads,after.snapshot.threads));
check('ledger_only_knowledge_evidence_and_update_marker_changed',ledgerDiff.every(d=>/^[^.]+\.(character_known\.|evidence$|updated_unit$)/.test(d.path)));
check('snapshot_only_luo_head_changed',characterDiff.length===1&&characterDiff[0].path==='罗敬');
const idChecks=Object.keys(B).map(id=>{
 const b=B[id],a=A[id],changes=ledgerDiff.filter(d=>d.path.startsWith(id+'.'));
 const keepKeys=['type','statement','author_truth','due_unit','status','custody','previous_holder','reader_known','introduced_unit','cast','tags'];
 const kept=keepKeys.every(k=>same(b[k],a[k]));
 const evidence=b.evidence.every(e=>a.evidence.some(x=>same(x,e)));
 const knowledge=Object.entries(b.character_known||{}).every(([n,v])=>a.character_known[n]===v||a.character_known[n].includes(v));
 return {id,reviewed:true,result:changes.length?'repaired':'retained',modified_fields:changes.map(d=>d.path.slice(id.length+1)),fixed_fields_preserved:kept,all_old_evidence_preserved:evidence,all_old_knowledge_preserved_or_time_scoped:knowledge,semantic_note:read('ledger-review.json')[id]};
});
put('ledger-43-audit.json',idChecks);
check('all_43_have_individual_semantic_review',idChecks.length===43&&idChecks.every(x=>!!x.semantic_note));
check('all_fixed_facts_status_custody_due_preserved',idChecks.every(x=>x.fixed_fields_preserved));
check('all_old_knowledge_preserved_with_historical_scope',idChecks.every(x=>x.all_old_knowledge_preserved_or_time_scoped));
check('all_old_evidence_preserved',idChecks.every(x=>x.all_old_evidence_preserved));
const evidence=[];
for(const [id,item]of Object.entries(A))for(const e of item.evidence){const bytes=fs.readFileSync(path.join(project,e.draft)),text=bytes.toString('utf8'),at=text.indexOf(e.quote);evidence.push({id,unit:e.unit,draft:e.draft,quote:e.quote,hash_valid:sha(bytes)===e.sha256,quote_valid:at>=0,line_valid:at>=0&&text.slice(0,at).split(/\r?\n/).length===e.line});}
put('all-evidence-audit.json',evidence);
check('all_current_evidence_hash_quote_line_valid',evidence.every(e=>e.hash_valid&&e.quote_valid&&e.line_valid),{count:evidence.length,old_count:Object.values(B).reduce((n,x)=>n+x.evidence.length,0)});
const drafts=Object.entries(read('before-draft-hashes.json')).map(([f,h])=>({draft:f,before:h,after:sha(fs.readFileSync(path.join(project,f)))}));
put('draft-byte-audit.json',drafts);check('all_24_draft_bytes_unchanged',drafts.length===24&&drafts.every(x=>x.before===x.after));
const finalRead=read('final-01-24.hashes.json');check('final_full_read_bound_to_current_drafts',drafts.every(x=>finalRead[x.draft]===x.after));
const oldManifest=read('before-file-manifest.json');
const protectedFiles=Object.entries(oldManifest).filter(([f])=>!f.startsWith('.writer/state.json')&&!f.startsWith('.writer/journal/')&&!f.startsWith('.writer/reviews/'));
const protectedDiff=protectedFiles.filter(([f,h])=>!fs.existsSync(path.join(project,f))||sha(fs.readFileSync(path.join(project,f)))!==h);
check('existing_reports_settings_plans_tool_and_other_project_files_unchanged',protectedDiff.length===0,{files:protectedFiles.length,changed:protectedDiff.map(x=>x[0])});
const {applyDelta}=await import(pathToFileURL(path.join(root,'lib/journal.mjs')).href);
let replay=structuredClone(after.baseline);const journal=[];
for(const row of after.units){const b=fs.readFileSync(path.join(project,row.journal));const saved=JSON.parse(b);const valid=sha(b)===row.journal_sha256;check('journal_hash_unit_'+row.unit,valid);replay=applyDelta(replay,saved.patch);journal.push({unit:row.unit,path:row.journal,sha256:sha(b),operations:saved.patch.length});}
put('journal-replay-snapshot.json',replay);put('journal-replay-units.json',journal);check('journal_full_replay_matches_state',same(replay,after.snapshot));
const priorJournal=before.units.slice(0,23).every(row=>sha(fs.readFileSync(path.join(__dirname,'before-journal',path.basename(row.journal))))===sha(fs.readFileSync(path.join(project,row.journal))));
check('journal_1_23_bytes_unchanged',priorJournal);
const rec=read('record-24.json'),context=read('logs/context-24-r66.stdout');
check('record_uses_regenerated_context_sources_revision',rec.expected_revision===66&&same(rec.source_hashes,context.source_hashes)&&context.revision===66);
const added=Object.keys(A).filter(k=>!Object.hasOwn(B,k));check('no_added_deleted_ledger_ids',added.length===0&&Object.keys(B).every(k=>Object.hasOwn(A,k)));
const charNotes={
 '沈禾':'24亲查核签听片，亲交宋箱带、赵钥，亲见新库及范灯交接；旧未交只是历史。',
 '周砚':'23亲听工作转录，24仅电话班次纸邱送达及未知；无原物亲听或全物件归宿知情。',
 '唐穗':'24签照与沈述，箱凭据去向，现场灯纸钥柜及随车补签；没有原签现场或试听。',
 '顾遥':'24陪封箱至门内即返，收费空间结束；未见原牌原签正式接收人，不同步班次结论。',
 '罗敬':'23完整工作转录与授权，24有限电话，未告全部物件交存；4未参加原带短听仍真，私因不外说。',
 '客运厅问讯员':'8现厅业务、通知照及建议仍有效；正文无后续通知，不同步新调查。',
 '许成':'10复印图、13原灯用法片与来由仍有效；无后续获班次或交接消息。',
 '宋俭':'24亲展签调度听相关工作片，亲接箱带；非2013亲历、不确权。',
 '邱阿兰':'24凭纸认回签日期及送门口，限相关工作片，不认末签、人人登船、男钟剪者。',
 '范勤':'24核接收范围并签灯原位保留，不等于历史用法见证。',
 '林秀':'24负责人核箱亲见原牌、准待核代存，不等确权或知全带。',
 '赵瑛':'24收盒钥封袋并实际入库；听试锁记录不等亲见试锁或开袋认原钥。'
};
put('characters-12-audit.json',Object.entries(after.snapshot.characters).map(([name,value])=>({name,reviewed:true,modified:characterDiff.some(d=>d.path===name),knowledge_head:value.split('；此前')[0],semantic_note:charNotes[name]})));
const out={nature:'mechanical-audit-plus-explicit-model-semantic-decisions-not-human-acceptance',revision:after.revision,ledger_count:43,ledger_items_repaired:idChecks.filter(x=>x.result==='repaired').length,knowledge_fields_repaired:ledgerDiff.filter(d=>d.path.includes('.character_known.')).length,character_heads_repaired:characterDiff.length,checks,pass:checks.every(x=>x.pass),created_at:new Date().toISOString()};
put('machine-audit.json',out);console.log(JSON.stringify({pass:out.pass,revision:out.revision,ledger_items_repaired:out.ledger_items_repaired,knowledge_fields_repaired:out.knowledge_fields_repaired,checks:checks.length,failures:checks.filter(x=>!x.pass)},null,2));
process.exitCode=out.pass?0:1;
})().catch(e=>{fs.writeFileSync(path.join(__dirname,'audit-exception.txt'),e.stack);console.error(e);process.exitCode=1;});
