import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url)), base=path.dirname(dir);
const args=process.argv.slice(2), mode=args[0], project=path.resolve(args[args.indexOf('--project')+1]);
assert.equal(project,path.join(base,'work'));
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const read=f=>fs.readFileSync(f), json=f=>JSON.parse(read(f));
const write=(name,obj)=>fs.writeFileSync(path.join(dir,name),JSON.stringify(obj,null,2)+'\n',{flag:'wx'});
function tree(root,rel=''){let rows=[];for(const ent of fs.readdirSync(path.join(root,rel),{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){const ref=path.posix.join(rel,ent.name);assert.ok(!ent.isSymbolicLink());if(ent.isDirectory())rows.push(...tree(root,ref));else if(ent.isFile()){const bytes=read(path.join(root,ref));rows.push({file:ref,bytes:bytes.length,sha256:sha(bytes)});}}return rows;}
if(mode==='baseline'){
 const bytes=read(path.join(project,'.writer/state.json')), state=JSON.parse(bytes), rows=tree(project);
 fs.writeFileSync(path.join(dir,'recovery-before-state.bin'),bytes,{flag:'wx'});
 write('recovery-before-inventory.json',{at:new Date().toISOString(),project,revision:state.revision,state_sha256:sha(bytes),files:rows});
 const old=json(path.join(base,'read-a-update/before-update-inventory.json'));
 const oldRows=old.root.map(r=>({...r,current_sha256:sha(read(path.join(project,r.file)))}));
 const command=tag=>({result:json(path.join(base,'commands',tag,'result.json')),stdout:read(path.join(base,'commands',tag,'stdout.raw.txt')).toString(),stderr:read(path.join(base,'commands',tag,'stderr.raw.txt')).toString()});
 const orig={};for(const tag of ['ra-update-execute','ra-update-retry','ra-workflow-set','parent-capacity-status','parent-interrupted-reading-proof'])orig[tag]=command(tag);
 write('original-operation-attribution.json',{at:new Date().toISOString(),basis:'Read-only inspection of original captures; no update executed by recovery',original_process:json(path.join(base,'read-a-update/process-result.json')),original:orig});
 const compare=json(path.join(base,'commands/read-a-recover-compare/stdout.raw.txt'));
 const refs=['general-review.md','natural-language-authenticity.md'];
 const skill_reference_identity=refs.map(ref=>({ref,root_sha256:sha(read(path.join(project,'.agents/skills/writer-review/references',ref))),package_sha256:sha(read(path.join(project,'.writer/tool/.agents/skills/writer-review/references',ref)))}));
 const summary={ok:true,state_sha256:sha(bytes),files:rows.length,old_original_root_files:oldRows.length,old_original_root_files_unchanged:oldRows.every(r=>r.sha256===r.current_sha256),units_unchanged_from_before_original_update:sha(JSON.stringify(state.units))===old.units_sha256,snapshot_unchanged_from_before_original_update:sha(JSON.stringify(state.snapshot))===old.snapshot_sha256,chapter107_files:rows.filter(r=>/^正文\/0107/.test(r.file)),skill_reference_identity,compare};
 write('recovery-baseline-checks.json',summary);
 console.log(JSON.stringify({...summary,compare_keys:Object.keys(compare),compare:undefined}));
} else if(mode==='final'){
 const old=json(path.join(dir,'recovery-before-inventory.json')),current=tree(project), before=new Map(old.files.map(r=>[r.file,r.sha256])), after=new Map(current.map(r=>[r.file,r.sha256]));
 const changed=current.filter(r=>before.get(r.file)!==r.sha256),removed=old.files.filter(r=>!after.has(r.file));
 const bytes=read(path.join(project,'.writer/state.json'));fs.writeFileSync(path.join(dir,'recovery-after-state.bin'),bytes,{flag:'wx'});
 const readings=json(path.join(dir,'readings.json'));
 const rows=readings.map(r=>({unit:r.unit,sha256:r.sha256,lines:r.to_line,bytes:r.bytes,version:r.version,current_matches:sha(read(r.file))===r.sha256,frozen_matches:sha(read(path.join(dir,r.version)))===r.sha256}));
 const result={ok:changed.length===0&&removed.length===0&&old.state_sha256===sha(bytes)&&rows.length===27&&rows.every(r=>r.current_matches&&r.frozen_matches),project_files_unchanged:changed.length===0&&removed.length===0,changed,removed,project_file_count:current.length,state_before_sha256:old.state_sha256,state_after_sha256:sha(bytes),readings_sha256:sha(read(path.join(dir,'readings.json'))),read_range:[1,27],rows,basis:'File identity and helper records only; actual model exposure is separately audited from events by parent'};
 write('final-verification.json',result);console.log(JSON.stringify(result));assert.ok(result.ok);
} else throw Error('baseline or final required');
