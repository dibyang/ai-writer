import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {isDeepStrictEqual as same} from 'node:util';
import {createRunner} from '../command-runner.mjs';
import {changesBetween,replaySnapshots} from '../rebuild-utils.mjs';
const stage=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(stage,'../../..');
const work=path.resolve(stage,'../works/潮汐信号');
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const hash=t=>crypto.createHash('sha256').update(t).digest('hex');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const state=()=>read(path.join(work,'.writer/state.json'));
const pad=n=>String(n).padStart(4,'0');
const write=(rel,v)=>{const p=path.join(stage,rel);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,typeof v==='string'?v:JSON.stringify(v,null,2)+'\n',{flag:'wx'});return p;};
const runner=createRunner(stage);
function cli(label,args){const r=runner.run(process.execPath,[path.join(root,'bin/ai-writer.mjs'),...args],`inner-final-${label}`);if(r.exit_code!==0){process.stdout.write(r.stdout);process.stderr.write(r.stderr);throw Error(`CLI ${label} exit ${r.exit_code}; raw ${r.files.metadata}`);}return {r,value:JSON.parse(r.stdout)};}
export default function main(args){
 const [action,...rest]=args;
 if(action==='inspect'){
  const s=state();console.log(JSON.stringify({state_sha256:sha(path.join(work,'.writer/state.json')),revision:s.revision,quotes:Object.entries(s.snapshot.ledger).flatMap(([id,v])=>(v.evidence??[]).filter(e=>e.unit>=91&&e.unit<=96).map(e=>({id,...e})))},null,2));
 }else if(action==='prepare'){
  const s=state();if(s.revision!==350||sha(path.join(work,'.writer/state.json'))!=='c3ab9e7d347d720c41480441ee6996f3ed012998c292aa6d5d5bbd4c390ce6b9')throw Error('Authority drift');
  const bodyEdits={
   91:[['她今天是在向老人说，不把一间铺里的耳朵全登记到同一行。',''],['他说那天去问了，没带回来，怕回家不在，下午人又来找，自己还得再跑。','他说那天去问了，没带回来，怕再去扑空，还得多跑一趟。']],
   92:[['第三十一章两页','后来新印的缺名两页']],
   93:[['，当下这句不会沿着一条无形的线，自动回到她或邱那里。','。']],
   94:[['九点五十八，他们在楼下分路。','九点五十八，他们在门外分路。'],['沈答应，没有借这一声听见了替自己结出全镇都已告的尾句。','沈答应。']],
   95:[['第三十一章两页','后来新印的缺名两页']],
   96:[['眼前自家椅脚下垫着薄片，挪开会有响；','']]
  };
  const old=read(path.join(stage,'before/work/.writer/state.json'));
  const texts={},body=[];
  for(const u of s.units){const t=fs.readFileSync(path.join(work,u.draft),'utf8');let next=t;for(const [a,b] of bodyEdits[u.unit]??[]){if(next.split(a).length!==2)throw Error(`Body target not unique ${u.unit}:${a}`);next=next.replace(a,b);}texts[u.unit]=next;if(next!==t){const han=(next.replace(/^#.*(?:\r?\n|$)/,'').match(/\p{Script=Han}/gu)??[]).length;if(han<2400||han>3200)throw Error(`Han outside ${u.unit}:${han}`);write(`candidate/${u.draft}`,next);body.push({unit:u.unit,path:u.draft,before_sha256:hash(t),after_sha256:hash(next),han,edits:bodyEdits[u.unit]});}}
  const fixes=[];
  for(let n=91;n<=100;n++){
   const snap=read(path.join(stage,`replay-before/${pad(n)}.json`));const before=structuredClone(snap);
   if(n>=93){
    snap.characters.罗敬=snap.characters.罗敬.replaceAll('唐何读后具体结果待当面未获','唐37读完还沈无拷的结果40已获；何40完成结果仍待明日当面获知');
    snap.ledger.T_RO_VISIT_93.character_known.罗敬=snap.ledger.T_RO_VISIT_93.character_known.罗敬.replaceAll('本人答约，未获具体读后结果。','本人答约；唐37读完还沈无拷的结果40已获，尚未获何40读后完成结果。');
   }
   if(n>=94){
    snap.characters.罗敬=snap.characters.罗敬.replaceAll('59日9:58楼下分路','59日9:58门外分路');
    snap.timeline=snap.timeline.map(t=>t.replace('59日9:30—9:58罗家及楼下','59日9:30—9:58罗家及门外'));
    snap.ledger.T_VOICE_CONSENT.statement=snap.ledger.T_VOICE_CONSENT.statement.replace('罗归宿说明不同37沈自页，当前后续待现场核。','罗归宿说明不同37沈自页；92时后续待核，94亲见罗从票夹取认后按原痕折回内层、夹回原抽屉，仍由罗保管，沈未接走。此前翻票日期与以后流转未核。');
    if(n===94)snap.ledger.T_VOICE_CONSENT.evidence.push(...snap.ledger.P_RO_LOCATION_NOTE_27.evidence.map(e=>structuredClone(e)));
   }
   if(n>=97){snap.characters.唐穗=snap.characters.唐穗.replaceAll('60日16前电话','60日午后沈回家后的电话');snap.timeline=snap.timeline.map(t=>t.replace('回家16前六分多电话','午后回家后六分多电话'));}
   if(n>=98)snap.characters.素姐=snap.characters.素姐.replaceAll('无旧纸音知情。','本场未谈旧纸或声音，未新增相关知识登记。');
   for(const [id,l] of Object.entries(snap.ledger))for(const e of l.evidence??[]){
    if(e.unit===95)e.quote=e.quote.replace('第三十一章两页','后来新印的缺名两页');
    if(e.unit===94)e.quote=e.quote.replace('九点五十八，他们在楼下分路。','九点五十八，他们在门外分路。');
    if(e.unit>=91&&e.unit<=96){const text=texts[e.unit];const lines=text.split(/\r?\n/);const i=lines.findIndex(line=>line.includes(e.quote));if(i<0)throw Error(`Missing actual quote ${n}/${id}/${e.unit}:${e.quote}`);e.line=i+1;e.sha256=hash(text);}
   }
   write(`desired/${pad(n)}.json`,snap);
   const diffs=[];function diff(a,b,p){if(same(a,b))return;if(a&&b&&typeof a==='object'&&typeof b==='object'&&!Array.isArray(a)&&!Array.isArray(b)){for(const k of new Set([...Object.keys(a),...Object.keys(b)]))diff(a[k],b[k],`${p}.${k}`);}else diffs.push({path:p,before:a,after:b});}diff(before,snap,'snapshot');
   fixes.push({unit:n,changes:diffs});
  }
  const changedPaths=new Set(body.map(x=>x.path));
  const consumers=s.units.filter(u=>Object.keys(u.source_hashes).some(p=>changedPaths.has(p))).map(u=>({unit:u.unit,sources:Object.entries(u.source_hashes).filter(([p])=>changedPaths.has(p))}));
  const originalInputs=s.units.filter(u=>u.unit>=91).map(u=>({unit:u.unit,registration:u,journal_sha256:sha(path.join(work,u.journal)),journal:read(path.join(work,u.journal))}));
  write('original-91-100-inputs.json',originalInputs);
  write('desired-diff.json',fixes);
  const plan={prepared_at:new Date().toISOString(),authority_sha256:sha(path.join(work,'.writer/state.json')),revision:s.revision,earliest_body:91,earliest_tracking:93,rewind_from:91,body,tracking:['93及后续历史：罗40已获唐读完，何结果94才获','94及后续：归宿纸实际取收；楼下改门外','97及后续：午后回家后的电话，不擅定16前结束','98及后续：素姐仅本场未新增登记，不断言全然不知'],consumers,original_inputs_file:'original-91-100-inputs.json',original_inputs_sha256:sha(path.join(stage,'original-91-100-inputs.json')),preserve_fixed:old.units.slice(0,24).map(u=>({unit:u.unit,path:u.draft,sha256:u.sha256,journal:u.journal,journal_sha256:u.journal_sha256})),frozen_complete_manifest:'before-manifest.json',source_runtime:{main:sha(path.join(root,'lib/longform.mjs')),embedded:sha(path.join(work,'.writer/tool/lib/longform.mjs'))}};
  write('fix-plan.json',plan);console.log(JSON.stringify(plan,null,2));
 }else if(action==='build-record'){
  const n=Number(rest[0]),pass=rest[1]??'1',folder=pass==='1'?'inputs':`inputs-pass${pass}`,s=state(),old=read(path.join(stage,'before/work/.writer/state.json'));
  fs.mkdirSync(path.join(stage,folder),{recursive:true});
  if(s.units.at(-1).unit!==n-1)throw Error('Sequential record guard');
  const u=old.units.find(u=>u.unit===n),candidate=path.join(stage,'candidate',u.draft);
  if(fs.existsSync(candidate)){if(![u.sha256,sha(candidate)].includes(sha(path.join(work,u.draft))))throw Error('Unexpected body drift');fs.copyFileSync(candidate,path.join(work,u.draft));}
  const attempt=fs.readdirSync(path.join(stage,folder)).filter(f=>f.startsWith(`${pad(n)}-context`)).length+1;
  const ctx=cli(`context-${n}-pass-${pass}-attempt-${attempt}`,['context','--project',work,'--unit',String(n),'--max-chars','1000000']);
  write(`${folder}/${pad(n)}-context-attempt-${attempt}.json`,ctx.value);
  const instruction=ctx.value.continuity?.instruction??ctx.value.context?.continuity?.instruction;
  if(typeof instruction!=='string'||!instruction.includes('章节号')||!instruction.includes('正文'))throw Error('Final runtime continuity instruction not present');
  const tpl=cli(`template-${n}-pass-${pass}-attempt-${attempt}`,['record-template','--project',work,'--unit',String(n),'--draft',u.draft]);
  write(`${folder}/${pad(n)}-template.json`,tpl.value);
  const input=tpl.value;delete input._instructions;input.summary=u.summary;
  input.changes=changesBetween(s.snapshot,read(path.join(stage,`desired/${pad(n)}.json`)),n);
  const desired=read(path.join(stage,`desired/${pad(n)}.json`));
  for(const [id,item]of Object.entries(input.changes.ledger))if(!Object.hasOwn(s.snapshot.ledger,id))item.evidence=desired.ledger[id].evidence.map(e=>({unit:e.unit,quote:e.quote}));
  const target=write(`${folder}/${pad(n)}-record.json`,input);
  const binding={unit:n,before_revision:s.revision,before_state_sha256:sha(path.join(work,'.writer/state.json')),draft:u.draft,draft_sha256:sha(path.join(work,u.draft)),context:ctx.r,template:tpl.r,input:target,input_sha256:sha(target),runtime:{main:sha(path.join(root,'lib/longform.mjs')),embedded:sha(path.join(work,'.writer/tool/lib/longform.mjs'))},instruction};
  write(`${folder}/${pad(n)}-binding.json`,binding);
  console.log(JSON.stringify({unit:n,expected_revision:input.expected_revision,draft:u.draft,draft_sha256:binding.draft_sha256,context_keys:Object.keys(ctx.value),instruction,input:target,changed_characters:Object.keys(input.changes.characters),timeline_append:input.changes.timeline_append,ledger_ids:Object.keys(input.changes.ledger),input_sha256:binding.input_sha256,runtime:binding.runtime},null,2));
 }else if(action==='commit-record'){
  const n=Number(rest[0]),pass=rest[1]??'1',folder=pass==='1'?'inputs':`inputs-pass${pass}`;const input=path.join(stage,`${folder}/${pad(n)}-record.json`);
  const r=cli(`record-${n}-pass-${pass}`,['record','--project',work,'--input',input]);write(`${folder}/${pad(n)}-result.json`,{result:r.value,raw:r.r});console.log(JSON.stringify(r.value,null,2));
 }else if(action==='freeze-pass1'){
  const s=state(),before=read(path.join(stage,'before/work/.writer/state.json'));
  const target=path.join(stage,'before-pass2/work');if(fs.existsSync(target))throw Error('Pass2 freeze exists');fs.mkdirSync(path.dirname(target),{recursive:true});fs.cpSync(work,target,{recursive:true,errorOnExist:true,force:false});
  const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
  const missing=[];for(const [id,l] of Object.entries(before.snapshot.ledger))for(const e of l.evidence??[]){let q=e.quote;if(e.unit===95)q=q.replace('第三十一章两页','后来新印的缺名两页');if(e.unit===94)q=q.replace('九点五十八，他们在楼下分路。','九点五十八，他们在门外分路。');if(!(s.snapshot.ledger[id].evidence??[]).some(f=>f.unit===e.unit&&f.quote===q))missing.push({id,...e});}
  const result={frozen_at:new Date().toISOString(),revision:s.revision,state_sha256:sha(path.join(work,'.writer/state.json')),missing_original_evidence:missing,earliest_affected_registration:Math.min(...missing.map(e=>before.snapshot.ledger[e.id].introduced_unit)),files:walk(target).map(p=>({path:path.relative(target,p).replaceAll('\\','/'),sha256:sha(p),bytes:fs.statSync(p).size}))};write('before-pass2-manifest.json',result);console.log(JSON.stringify({...result,files:result.files.length},null,2));
 }else if(action==='review-range'){
  const spec=read(path.join(stage,rest[0])),s=state();
  const units=s.units.filter(u=>u.unit>=spec.from&&u.unit<=spec.to);
  if(units.length!==spec.to-spec.from+1)throw Error('Incomplete unit set');
  const records=fs.readFileSync(path.join(stage,'reading.jsonl'),'utf8').trim().split(/\r?\n/).map(JSON.parse);
  const bindings=units.map(u=>{const hash=sha(path.join(work,u.draft)),lines=fs.readFileSync(path.join(work,u.draft),'utf8').trimEnd().split(/\r?\n/).length;
   const rows=records.filter(r=>r.path===u.draft&&r.sha256===hash&&r.from<=r.to);const seen=new Set(rows.flatMap(r=>Array.from({length:r.to-r.from+1},(_,i)=>r.from+i)));
   if(Array.from({length:lines},(_,i)=>i+1).some(i=>!seen.has(i)))throw Error(`Unread line record ${u.unit}`);
   return {unit:u.unit,path:u.draft,sha256:hash,total_lines:lines,ranges:rows.map(r=>({from:r.from,to:r.to,date:r.read_at,raw_command:r.raw_command,raw_stdout:r.raw_stdout}))};});
  const report=`审查/${spec.slug}.md`;
  const detail=spec.compact?`完整实际返回记录另存阶段 reviews/${spec.slug}-reading-bindings.json 及 reading.jsonl。\n\n|章|实际路径|SHA256|完整行范围|\n|---|---|---|---|\n${bindings.map(b=>`|${b.unit}|${b.path}|${b.sha256}|1—${b.total_lines}|`).join('\n')}`:`\`\`\`json\n${JSON.stringify(bindings,null,2)}\n\`\`\``;
  if(spec.compact)write(`reviews/${spec.slug}-reading-bindings.json`,bindings);
  const content=`# ${spec.title}\n\n模型实读记录时间：${new Date().toISOString()}。登记前版本 r${s.revision}，state SHA256 ${sha(path.join(work,'.writer/state.json'))}。范围 ${spec.from}—${spec.to}，当前原生模型已实际完整阅读所绑定的正文；行覆盖脚本只检查记录完整。非真人盲读、市场测试或正式发布验收。\n\n${spec.note}\n\n## 正文版本与返回记录\n\n${detail}\n`;
  fs.writeFileSync(path.join(work,report),content,{flag:'wx'});
  const source_hashes=Object.fromEntries(bindings.map(b=>[b.path,b.sha256]));
  if(Object.keys(source_hashes).length!==spec.to-spec.from+1||!same(Object.keys(source_hashes).sort(),units.map(u=>u.draft).sort()))throw Error('Review source set differs');
  const input={from:spec.from,to:spec.to,kind:'model-self-review',report,source_hashes};
  const file=write(`reviews/${spec.slug}.json`,input);
  const result=cli(`review-${spec.slug}`,['review','--project',work,'--input',file]);
  write(`reviews/${spec.slug}-result.json`,{result:result.value,raw:result.r,constructed_sources_before_call:Object.keys(source_hashes),count:Object.keys(source_hashes).length});
  console.log(JSON.stringify({report,report_sha256:sha(path.join(work,report)),source_count:Object.keys(source_hashes).length,...result.value},null,2));
 }else if(action==='validate'){
  const s=state(),old=read(path.join(stage,'before/work/.writer/state.json')),plan=read(path.join(stage,'fix-plan.json'));
  const snaps=replaySnapshots(work,s);const semantic=x=>JSON.parse(JSON.stringify(x,(k,v)=>['evidence','updated_unit'].includes(k)?undefined:v));
  const expected=read(path.join(stage,'desired/0100.json'));
  if(!same(semantic(s.snapshot),semantic(expected)))throw Error('Final semantic snapshot differs from approved desired state');
  for(let n=91;n<=100;n++){if(!same(semantic(snaps[n]),semantic(read(path.join(stage,`desired/${pad(n)}.json`)))))throw Error(`Replay semantic mismatch ${n}`);}
  if(!same(s.baseline,old.baseline)||!same(s.units.slice(0,90),old.units.slice(0,90)))throw Error('Fixed earlier registration chain changed');
  const bodies=s.units.map(u=>{const hash=sha(path.join(work,u.draft));if(hash!==u.sha256)throw Error(`Body binding ${u.unit}`);const text=fs.readFileSync(path.join(work,u.draft),'utf8');const han=(text.replace(/^#.*(?:\r?\n|$)/,'').match(/\p{Script=Han}/gu)??[]).length;if(u.unit>=25&&(han<2400||han>3200))throw Error(`Han ${u.unit}:${han}`);return {unit:u.unit,path:u.draft,sha256:hash,before_sha256:old.units[u.unit-1].sha256,han,changed:hash!==old.units[u.unit-1].sha256};});
  if(!same(bodies.filter(b=>b.changed).map(b=>b.unit),plan.body.map(b=>b.unit)))throw Error('Unexpected changed body set');
  let evidenceCount=0,preserved=0;const sameLineDifferentQuotes=[];
  for(const [id,l] of Object.entries(s.snapshot.ledger)){
   const previous=old.snapshot.ledger[id];if(!previous)throw Error(`Unexpected new ID ${id}`);
   if(l.introduced_unit!==previous.introduced_unit||l.due_unit!==previous.due_unit)throw Error(`ID timing changed ${id}`);
   for(const e of l.evidence??[]){evidenceCount++;const u=s.units.find(u=>u.unit===e.unit);const lines=fs.readFileSync(path.join(work,u.draft),'utf8').split(/\r?\n/);if(e.sha256!==u.sha256||e.draft!==u.draft||!lines[e.line-1]?.includes(e.quote))throw Error(`Evidence invalid ${id}:${e.unit}:${e.line}:${e.quote}`);}
   for(const e of previous.evidence??[]){let q=e.quote;if(e.unit===95)q=q.replace('第三十一章两页','后来新印的缺名两页');if(e.unit===94)q=q.replace('九点五十八，他们在楼下分路。','九点五十八，他们在门外分路。');if(!(l.evidence??[]).some(f=>f.unit===e.unit&&f.quote===q))throw Error(`Evidence lost ${id}:${e.unit}:${q}`);preserved++;}
   const grouped=Object.groupBy(l.evidence??[],e=>`${e.unit}:${e.line}`);for(const [key,v]of Object.entries(grouped))if(new Set(v.map(x=>x.quote)).size>1)sameLineDifferentQuotes.push({id,key,quotes:v.map(x=>x.quote)});
  }
  if(!same(Object.keys(s.snapshot.ledger),Object.keys(old.snapshot.ledger)))throw Error('Ledger ID set/order differs');
  const instructions=Array.from({length:10},(_,i)=>read(path.join(stage,`${i===0?'inputs':'inputs-pass2'}/${pad(i+91)}-binding.json`)));
  if(instructions.some(x=>x.runtime.main!==plan.source_runtime.main||x.runtime.embedded!==plan.source_runtime.embedded))throw Error('Runtime SHA drift');
  const report={validated_at:new Date().toISOString(),revision:s.revision,state_sha256:sha(path.join(work,'.writer/state.json')),units:s.units.length,ledger_ids:Object.keys(s.snapshot.ledger).length,evidence_count:evidenceCount,preserved_old_evidence:preserved,same_line_distinct_quotes_preserved:sameLineDifferentQuotes,fixed_1_24_chain:true,unchanged_1_90_chain:true,active_journal_replay:true,desired_semantics_match_all_91_100:true,runtime_bindings:instructions.length,bodies};write('post-rebuild-validation.json',report);console.log(JSON.stringify({...report,bodies:report.bodies.filter(b=>b.changed)},null,2));
 }else if(action==='notes'){
  const files=fs.readdirSync(path.join(work,'审查')).filter(f=>/^final-review-reading-.*-before\.md$/.test(f)).sort();
  for(const f of files){const t=fs.readFileSync(path.join(work,'审查',f),'utf8');console.log(f+'\n'+t.split('## 实际阅读绑定')[0]);}
 }else if(action==='compact-overall'){
  const spec=read(path.join(stage,'overall100.json'));spec.compact=true;spec.slug+='-complete';write('overall100-compact.json',spec);main(['review-range','overall100-compact.json']);
 }else if(action==='refresh-reviews'){
  for(const f of ['rolling93','rolling96','rolling99','tail100']){const spec=read(path.join(stage,`${f}.json`));spec.slug+='-pass2';spec.title+='（完整首锚链）';spec.note+='\n\nr371复核补记：第二次从92正式回退只修正辅助输入对新建物件早章首锚的继承，所有正文SHA与上次实读版相同。27原场景61—97行再次实读，P_QIU_SINGLE_27与P_RO_LOCATION_NOTE_27的全部最终物件/人物字段及27/92/94引文已实际返回重读；1155条旧引文全部保留，94总线另加两条不同引文。同一行不同证据未合并。此处以原真实阅读日期和SHA作当前版本依据，不倒填新的正文阅读时间，不恢复任何旧失效报告。';write(`${f}-pass2.json`,spec);main(['review-range',`${f}-pass2.json`]);}
 }else if(action==='reading-audit'){
  const s=state(),file=path.join(stage,'reading.jsonl'),raw=fs.readFileSync(file,'utf8');write('reading-original-uncurated.jsonl',raw);
  const paths=new Set(s.units.map(u=>u.draft)),rows=raw.trim().split(/\r?\n/).map(JSON.parse),valid=rows.filter(r=>paths.has(r.path)&&r.from>=1&&r.from<=r.to&&r.to<=r.total_lines),other=rows.filter(r=>!valid.includes(r));
  write('auxiliary-reading-and-invalid-ranges.jsonl',other.map(r=>JSON.stringify(r)).join('\n')+'\n');fs.writeFileSync(file,valid.map(r=>JSON.stringify(r)).join('\n')+'\n');
  const coverage=s.units.map(u=>{const text=fs.readFileSync(path.join(work,u.draft),'utf8'),lines=text.trimEnd().split(/\r?\n/).length,rs=valid.filter(r=>r.path===u.draft&&r.sha256===u.sha256),covered=new Set(rs.flatMap(r=>Array.from({length:r.to-r.from+1},(_,i)=>r.from+i))),missing=Array.from({length:lines},(_,i)=>i+1).filter(x=>!covered.has(x));return {unit:u.unit,path:u.draft,sha256:u.sha256,total_lines:lines,missing_lines:missing,actual_ranges:rs.map(r=>({from:r.from,to:r.to,read_at:r.read_at,raw_command:r.raw_command,raw_stdout:r.raw_stdout,raw_stderr:r.raw_stderr}))};});
  const baseline=read(path.join(stage,'../source-baseline-v4.json'));const products=baseline.files.map(f=>({path:f.file,expected:f.sha256,actual:sha(path.join(root,f.file))}));if(products.some(p=>p.expected!==p.actual))throw Error('Product baseline differs');
  const result={audited_at:new Date().toISOString(),scope:'Record coverage only; no script assertion of semantic reading',body_command_ranges:valid.length,nonbody_or_invalid_ranges_preserved:other.length,complete_current_chapters:coverage.filter(c=>!c.missing_lines.length).length,total_current_lines:coverage.reduce((n,c)=>n+c.total_lines,0),complete_current_lines:coverage.reduce((n,c)=>n+c.total_lines-c.missing_lines.length,0),all_product_baseline_files_match:products.length,products,coverage};write('reading-coverage.json',result);console.log(JSON.stringify({...result,products:result.products.length,coverage:result.coverage.map(c=>({unit:c.unit,lines:c.total_lines,missing:c.missing_lines.length}))},null,2));
 }else if(action==='stage-read'){
  const [rel,from='0',count='8000']=rest;const p=path.resolve(stage,rel);if(!p.startsWith(stage+path.sep))throw Error('Stage path escape');const t=fs.readFileSync(p,'utf8');const end=Math.min(t.length,Number(from)+Number(count));console.log(JSON.stringify({path:rel,sha256:sha(p),from_char:Number(from),to_char_exclusive:end,total_chars:t.length}));console.log(t.slice(Number(from),end));console.log(`[${end===t.length?'Complete':'Partial'} next_char=${end}]`);
 }else throw Error(`Unknown fix action ${action}`);
}
