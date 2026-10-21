import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.resolve('.'),base=path.dirname(fileURLToPath(import.meta.url)),prior=path.join(root,'acceptance/20261020-long-flow-090-v'),source=path.join(prior,'scenario/东岸末班船-扩展验证'),work=path.join(base,'scenario/东岸末班船-规模验证');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const run=(exe,args)=>{const r=spawnSync(exe,args,{encoding:'utf8',windowsHide:true,timeout:55000,maxBuffer:8*1024*1024});assert.equal(r.status,0,r.stderr||r.stdout);return r.stdout;};
const save=(ref,value)=>fs.writeFileSync(path.join(base,ref),JSON.stringify(value,null,2)+'\n',{flag:'wx'});
assert(!fs.existsSync(work),'Do not overwrite a previous scenario');
const sealed=JSON.parse(run(process.execPath,[path.join(prior,'seal-evidence.mjs'),'verify']));
assert.equal(sealed.manifest_sha256,'c876d78927f6ca14089748b52418450023e6ea18460ef68bd70a368f18dff0b6');
function inventory(dir,rel='',rows=[]){for(const n of fs.readdirSync(dir).sort()){const ref=rel?rel+'/'+n:n,f=path.join(dir,n),s=fs.lstatSync(f);assert(!s.isSymbolicLink(),f);if(s.isDirectory())inventory(f,ref,rows);else{assert(s.isFile());const b=fs.readFileSync(f);rows.push({file:ref,bytes:b.length,sha256:sha(b)});}}return rows;}
const files=inventory(source);fs.cpSync(source,work,{recursive:true,force:false,errorOnExist:true});
assert.deepEqual(inventory(work),files);
const state=JSON.parse(fs.readFileSync(path.join(work,'.writer/state.json'),'utf8'));
assert.equal(state.units.length,12);assert.equal(state.revision,55);assert.equal(state.governance.stage,'paused');
const frozen=JSON.parse(fs.readFileSync(path.join(prior,'product-frozen-current.json'),'utf8'));
for(const f of frozen.files)assert.equal(sha(fs.readFileSync(path.join(root,f.file))),f.sha256,f.file);
save('baseline-worktree.json',{ok:true,at:new Date().toISOString(),head:run('git',['rev-parse','HEAD']).trim(),prior_seal:sealed,source,work,files,state_revision:state.revision,units:state.units,snapshot:state.snapshot});
save('product-frozen-start.json',frozen);
save('plan.json',{status:'planned-not-completed',at:new Date().toISOString(),source_units:12,target_units:24,new_units:{from:13,through:24},minimum_han:6000,larger_units:[15,18,21,24],larger_minimum_han:8000,minimum_parts:3,larger_minimum_parts:4,source_body_and_tracking_preserved_through:12,stages:['A: chapter13 two parts then same-thread resume through15','B: fresh thread16-17 then same-thread resume18','C: fresh thread19-20 then same-thread resume21','D: fresh thread22-24 then revision13-24 first replay stop','D-resume: same revision/token replay14-24 and current full-tail reviews/prepare/commit','F: fresh current full read1-24, pause, denied25, draft export'],revision_choices:{ordinary_non_observation_origins:[13,17,21],require_real_downstream:true,minimum_changed_body_chapters:6},scope:'isolated acceptance sample only',exclusions:['existing author works','prior sealed evidence','Git commit/push','release','human blind read','remote cross-platform CI']});
for(const file of ['run-long.mjs','v-log.mjs','v-writer.mjs']){
 const target=file==='v-log.mjs'?'w-log.mjs':file==='v-writer.mjs'?'w-writer.mjs':file;
 let text=fs.readFileSync(path.join(prior,file),'utf8').replaceAll('东岸末班船-扩展验证','东岸末班船-规模验证').replaceAll('v-log.mjs','w-log.mjs').replaceAll('v-writer','w-writer').replaceAll('within V','within W');
 fs.writeFileSync(path.join(base,target),text,{flag:'wx'});
}
save('bootstrap-verification.json',{ok:true,work,files:files.length,source_units:12,revision:55,source_same_bytes:true,source_frozen_files:frozen.files.length,at:new Date().toISOString()});
console.log(JSON.stringify({ok:true,base,work,files:files.length,units:12,revision:55}));
