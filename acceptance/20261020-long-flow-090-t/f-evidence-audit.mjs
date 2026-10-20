import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {base,work,read,state,sha,save} from './common.mjs';
const s=state(),baseline=JSON.parse(fs.readFileSync(path.join(base,'r1-baseline-ledger.json'),'utf8'));
const observation_ids=Object.keys(baseline).filter(id=>baseline[id].type==='observation');
for(const id of observation_ids)assert.deepEqual(s.snapshot.ledger[id],baseline[id]);
const inherited=JSON.parse(fs.readFileSync(path.join(base,'inherited-current-segments.json'),'utf8'));
const r1=JSON.parse(fs.readFileSync(path.join(base,'r1-current-segments.json'),'utf8'));
const segmentRows=[];
for(let n=1;n<=30;n++){
 const pad=String(n).padStart(4,'0');let refs,provenance;
 if([1,2,3,5,6].includes(n)){segmentRows.push({unit:n,body:s.units[n-1].draft,sha256:s.units[n-1].sha256,current_parts:null,note:'Current registered body is authority. No claim that inherited flat historical parts assemble current body.'});continue;}
 if(n>=15&&n<=24){refs=r1.chapters.find(r=>r.unit===n).current_parts.map(r=>r.ref);provenance='r1-current-segments.json';}
 else if([4,8,10].includes(n)){refs=inherited.chapters.find(r=>r.unit===n).current_parts.map(r=>r.ref);provenance='inherited-current-segments.json';}
 else{const dir=n===27?'0027-t-r2':pad;refs=fs.readdirSync(path.join(work,'分段',dir)).filter(x=>/^part-\d+\.md$/.test(x)).sort().map(x=>`分段/${dir}/${x}`);provenance=n===27?'R2 current directory':'current chapter directory';}
 const text=refs.map(ref=>read(ref).toString('utf8')).join('\n\n');assert.equal(text,read(s.units[n-1].draft).toString('utf8'));
 let line=1;const parts=refs.map((ref,i)=>{const t=read(ref).toString('utf8'),count=(t.match(/\n/g)||[]).length;const row={ref,sha256:sha(read(ref)),start_line:line,last_text_line:line+count-(t.endsWith('\n')?1:0),han_without_heading:(t.replace(/^#.*$/gm,'').match(/\p{Script=Han}/gu)||[]).length};line+=count+(i<refs.length-1?2:0);return row;});
 if(n>=19)assert.equal(parts.length,[19,25].includes(n)?6:4);
 segmentRows.push({unit:n,body:s.units[n-1].draft,sha256:sha(Buffer.from(text)),provenance,exact_assembly:true,part_count:parts.length,current_parts:parts});
}
save('f-current-segments-verification.json',{ok:true,join:'two LF; no trimming or newline normalization',chapters:segmentRows});
const plans=s.units.map(u=>{const ref=`大纲/单元/${String(u.unit).padStart(4,'0')}.json`,b=read(ref),p=JSON.parse(b);return {unit:u.unit,ref,sha256:sha(b),consumed_sha256:u.source_hashes[ref],root_matches_consumed:sha(b)===u.source_hashes[ref],title:p.title,goal:p.goal,change:p.change,beats:p.beats,forbidden:p.forbidden};});
save('f-current-plan-view.json',plans);
const commands=fs.readdirSync(path.join(base,'commands')).flatMap(label=>{const file=path.join(base,'commands',label,'result.json');if(!fs.existsSync(file))return[];const r=JSON.parse(fs.readFileSync(file,'utf8'));return [{...r,dir:path.dirname(file)}];});
const failures=commands.filter(r=>r.exit_code!==0).map(r=>{let out;for(const name of ['stderr.raw.txt','stdout.raw.txt']){try{const v=JSON.parse(fs.readFileSync(path.join(r.dir,name),'utf8'));if(v.code||v.error){out={code:v.code,error:v.error};break;}}catch{}}return {label:r.label,started_at:r.started_at,exit_code:r.exit_code,...out};});
const mainRecords=commands.filter(r=>r.args[1]==='record'&&r.exit_code===0&&r.args[r.args.indexOf('--project')+1]===work).flatMap(r=>{const file=path.join(r.dir,'input.raw.json');if(!fs.existsSync(file))return[];const i=JSON.parse(fs.readFileSync(file,'utf8'));if(i.unit<19||i.unit>30)return[];const frozen=JSON.parse(fs.readFileSync(path.join(r.dir,'before-state.json'),'utf8'));return [{unit:i.unit,label:r.label,started_at:r.started_at,input_sha256:sha(fs.readFileSync(file)),captured_input_matches_result:sha(fs.readFileSync(file))===r.input.sha256,source_state_matches_captured_before:i.source_hashes['.writer/state.json']===r.before_state_sha256,expected_revision:i.expected_revision??i.revision,before_revision:frozen.revision,after_revision:JSON.parse(fs.readFileSync(path.join(r.dir,'after-state.json'),'utf8')).revision,body_current_equal:i.draft_sha256===s.units[i.unit-1].sha256,report_ref:`审查/T-${String(i.unit).padStart(4,'0')}-纲文回对.md`}];});
save('f-command-evidence-view.json',{scope:'Read-only index of existing captured command evidence; not a reconstruction of native reading logs or a new execution of historical commands.',command_count:commands.length,failures,main_records_19_30:mainRecords});
save('f-state-semantic-view.json',{revision:s.revision,schema:s.schema_version,generation:s.tool_control.generation,state_sha256:sha(read('.writer/state.json')),immutable_observations_equal_r1_baseline:true,observation_ids,observations:Object.fromEntries(observation_ids.map(id=>[id,s.snapshot.ledger[id]])),characters:s.snapshot.characters,threads:s.snapshot.threads,timeline:s.snapshot.timeline,ledger:s.snapshot.ledger});
console.log(JSON.stringify({ok:true,observation_ids,segment_chapters_exact:segmentRows.filter(r=>r.exact_assembly).length,unmapped_current:[1,2,3,5,6],plan_root_mismatches:plans.filter(r=>!r.root_matches_consumed).map(r=>r.unit),command_count:commands.length,failure_count:failures.length,main_records:mainRecords.map(r=>({unit:r.unit,label:r.label,source_state_matches:r.source_state_matches_captured_before}))},null,2));
