import fs from 'node:fs';import path from 'node:path';import {isDeepStrictEqual as same} from 'node:util';
import {stage,work,read,write,hash,runner,cli,manifest} from './phase.mjs';
const action=process.argv[2];const statePath=path.join(work,'.writer/state.json');
if(action==='log-plans'){
 const entries=[];
 for(let n=41;n<=90;n++){
  const file=`大纲/单元/${String(n).padStart(4,'0')}.json`,b=fs.readFileSync(path.join(stage,'before/work',file)),sha=hash(b);
  const base=41+Math.floor((n-41)/10)*10,view=`plans-${base}-${base+9}.md`,text=fs.readFileSync(path.join(stage,view),'utf8');
  const marker=`## ${file} SHA256 ${sha}\n\n`,offset=text.indexOf(marker);if(offset<0||!text.slice(offset+marker.length).startsWith(b.toString('utf8')))throw Error('Frozen read view differs');
  const lines=b.toString('utf8').split(/\r?\n/).length;
  entries.push({at:new Date().toISOString(),file,sha256:sha,from:1,to:lines,total_lines:lines,coverage:'full',purpose:'before-full-read-consumed-plan',method:'explicit-delayed-log-of-model-full-read-frozen-concatenation-before-author-edits',source_copy:`before/work/${file}`,actual_read_view:view,view_from:text.slice(0,offset+marker.length).split('\n').length,view_to:text.slice(0,offset+marker.length+b.toString('utf8').length).split('\n').length,recorded_after_read:true});
 }
 fs.appendFileSync(path.join(stage,'reading.jsonl'),entries.map(x=>JSON.stringify(x)).join('\n')+'\n');console.log(JSON.stringify({logged_frozen_plans:entries.length,not_current_changed_plan_bytes:true}));
}
if(action==='fix-plan-view-ranges'){
 const f=path.join(stage,'reading.jsonl'),b=fs.readFileSync(f);fs.writeFileSync(path.join(stage,'reading-before-viewrange-correction.jsonl'),b,{flag:'wx'});
 const rows=b.toString('utf8').trim().split(/\r?\n/).map(JSON.parse);let count=0;
 for(const r of rows)if(r.purpose==='before-full-read-consumed-plan'){
  const text=fs.readFileSync(path.join(stage,r.actual_read_view),'utf8'),body=fs.readFileSync(path.join(stage,r.source_copy),'utf8'),marker=`## ${r.file} SHA256 ${r.sha256}\n\n`,offset=text.indexOf(marker);
  if(offset<0||!text.slice(offset+marker.length).startsWith(body))throw Error('View source mismatch');
  r.view_to=text.slice(0,offset+marker.length+body.length).split('\n').length;r.view_range_metadata_corrected_at=new Date().toISOString();count++;
 }
 fs.writeFileSync(f,rows.map(x=>JSON.stringify(x)).join('\n')+'\n');console.log(JSON.stringify({corrected_view_metadata:count,source_file_coverage_and_hash_unchanged:true}));
}
if(action==='checks'){
 const results=[];
 for(const name of ['status','check','doctor']){
  const before=hash(fs.readFileSync(statePath)),r=cli('final-'+name,[name]),after=hash(fs.readFileSync(statePath));
  if(r.exit_code)throw Error(r.stderr);const data=runner.json('final-'+name+'-cli');
  results.push({command:name,exit_code:r.exit_code,elapsed_ms:r.elapsed_ms,state_before:before,state_after:after,unchanged:before===after,data});
  console.log(JSON.stringify({command:name,data}));
 }
 write(path.join(stage,'final-checks.json'),results);
}
if(action==='projection'){
 const s=read(statePath),ids=['I_ROOM_VISIT_PRICE','P_DOOR_RECEIPT_42','O_PHOTO_WAIT_62','I_POST_WAIT_69','T_SHOP_SEAT_TRIAL_76','T_SHOP_SEAT_NEXT_80','T_SHOP_SEAT_WEEK_86','T_KEEPER_SHARE','T_SOUND_CONTEXT','T_PAGE_PAIR','T_VOICE_CONSENT'];
 const out={};for(const id of ids){const v=s.snapshot.ledger[id];out[id]={type:v.type,status:v.status,due_unit:v.due_unit,introduced_unit:v.introduced_unit,statement:v.statement,reader_known:v.reader_known,custody:v.custody};}
 write(path.join(stage,'final-focused-ledger.json'),out);console.log(JSON.stringify({file:'final-focused-ledger.json',ids}));
}
if(action==='export'){
 const name=process.argv[3]??'export';if(!/^[a-z0-9-]+$/.test(name))throw Error('Unsafe export directory');
 const out=path.join(stage,name);if(fs.existsSync(out))throw Error('Export already exists');
 const before=hash(fs.readFileSync(statePath)),r=cli('final-export',['export','--out',out]);if(r.exit_code)throw Error(r.stderr);
 const data=runner.json('final-export-cli');write(path.join(stage,'export-result.json'),{state_before:before,state_after:hash(fs.readFileSync(statePath)),data,manifest:manifest(out)});console.log(JSON.stringify({ok:data.ok,output:data.output,revision:data.revision,status:data.status,included_units:data.included_units,excluded_drafts:data.excluded_drafts,warnings:data.warnings,sha256:data.sha256}));
}
if(action==='freeze'){
 if(fs.existsSync(path.join(stage,'after/work')))throw Error('After already exists');
 fs.cpSync(work,path.join(stage,'after/work'),{recursive:true,errorOnExist:true,force:false});
 const live=manifest(work),frozen=manifest(path.join(stage,'after/work'));if(!same(live,frozen))throw Error('After copy mismatch');
 write(path.join(stage,'after/manifest.json'),live);write(path.join(stage,'after/freeze.json'),{at:new Date().toISOString(),revision:read(statePath).revision,units:read(statePath).units.length,state_sha256:live['.writer/state.json'],files:Object.keys(live).length});
 console.log(JSON.stringify({files:Object.keys(live).length,state_sha256:live['.writer/state.json']}));
}
