import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import os from 'node:os';
import {spawnSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {isDeepStrictEqual} from 'node:util';

export const stage='D:/work/other/ai-writer/acceptance/20261018-recovery-e/native-recovery';
export const work='D:/work/other/ai-writer/acceptance/20261018-recovery-e/native/work';
export const source='D:/work/other/ai-writer/acceptance/20261018-recovery-e/sources/package';
export const external='D:/work/other/ai-writer/bin/ai-writer.mjs';
export const embedded=work+'/.writer/tool/bin/ai-writer.mjs';
export const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
export const read=f=>fs.readFileSync(f);
export const json=f=>JSON.parse(read(f).toString('utf8'));
function writable(f){const r=path.resolve(f);if(![stage,work].some(base=>{const rel=path.relative(base,r);return rel===''||(!path.isAbsolute(rel)&&rel!=='..'&&!rel.startsWith('..'+path.sep));}))throw Error('Write outside authorized paths: '+f);return r;}
export function put(f,b){writable(f);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,b,{flag:'wx'});}
export const putJSON=(f,x)=>put(f,JSON.stringify(x,null,2)+'\n');
export function inventory(root){const rows={};function walk(ref){const f=path.join(root,ref),s=fs.lstatSync(f);if(s.isSymbolicLink())throw Error('Unexpected symlink '+f);if(s.isDirectory()){for(const n of fs.readdirSync(f).sort())walk(ref?ref+'/'+n:n);}else {const b=read(f);rows[ref]={bytes:b.length,sha256:hash(b)};}}walk('');return rows;}
export function selected(root){const rows={};for(const ref of ['AGENTS.md','writer.json','正文','设定','大纲','docs','.agents/skills']){const f=path.join(root,ref);if(fs.statSync(f).isDirectory()){for(const [name,row] of Object.entries(inventory(f)))rows[ref+'/'+name]=row;}else {const b=read(f);rows[ref]={bytes:b.length,sha256:hash(b)};}}return rows;}
export function state(){return json(work+'/.writer/state.json');}
export function snapshot(dir){fs.mkdirSync(writable(dir),{recursive:true});put(dir+'/state.bin',read(work+'/.writer/state.json'));putJSON(dir+'/state.json',state());const lock=work+'/.writer/write.lock';if(fs.existsSync(lock))put(dir+'/write.lock',read(lock));const transactions={};const txdir=work+'/.writer/transactions';if(fs.existsSync(txdir))for(const id of fs.readdirSync(txdir).sort()){const f=txdir+'/'+id+'/transaction.json';if(fs.existsSync(f))transactions[id]=json(f);}putJSON(dir+'/transactions.json',transactions);putJSON(dir+'/tool-inventory.json',inventory(work+'/.writer/tool'));}
export function proof(){const ref='研究/E轮实际Codex实跑授权原文.md';return {quote:'允许在E轮六章隔离副本中更新工具、注入恢复中断、按原事务完成或回滚、模拟包资源损坏并精确还原；保留正文、事实、作者选择、暂停范围及根定制，不写新章。',local_source:ref,source_sha256:hash(read(work+'/'+ref)),locator:'本任务用户请求第9行的明确授权原话；仅适用于E轮隔离验证副本',recorded_by:'Codex actual local acceptance; no real author identity claim'};}
export function run(name,entry,args,env={}){const dir=stage+'/commands/'+name;fs.mkdirSync(writable(stage+'/commands'),{recursive:true});fs.mkdirSync(writable(dir),{recursive:false});const effective={...process.env};for(const k of Object.keys(effective))if(k.startsWith('AI_WRITER_TEST_'))delete effective[k];Object.assign(effective,env);const spec={entry,args,cwd:work,environment_overrides:env,removed_inherited_test_variables:Object.keys(process.env).filter(k=>k.startsWith('AI_WRITER_TEST_')),started_at:new Date().toISOString(),node:process.execPath,node_version:process.version,platform:process.platform,arch:process.arch,os_release:os.release()};putJSON(dir+'/command.json',spec);putJSON(dir+'/environment.json',effective);const idx=args.indexOf('--input');if(idx>=0){spec.input=args[idx+1];put(dir+'/input.raw.json',read(spec.input));}snapshot(dir+'/before');const r=spawnSync(process.execPath,[entry,...args],{cwd:work,env:effective,windowsHide:true,timeout:55000,maxBuffer:32*1024*1024});put(dir+'/stdout.raw.txt',r.stdout??Buffer.alloc(0));put(dir+'/stderr.raw.txt',r.stderr??Buffer.alloc(0));snapshot(dir+'/after');let output=null;try{output=JSON.parse((r.stdout??'').toString());}catch{}const result={...spec,finished_at:new Date().toISOString(),exit_code:r.status,signal:r.signal,error:r.error?.message??null,stdout_sha256:hash(r.stdout??''),stderr_sha256:hash(r.stderr??''),state_unchanged:hash(read(dir+'/before/state.bin'))===hash(read(dir+'/after/state.bin')),output};putJSON(dir+'/result.json',result);console.log(JSON.stringify({name,exit_code:r.status,error:r.error?.message??null,state_unchanged:result.state_unchanged,ok:output?.ok,code:output?.code,status:output?.status,can_update:output?.can_update,blockers:output?.blockers?.map(x=>x.code)}));return result;}
export function assert(x,msg){if(!x)throw Error(msg);}
export const projectArgs=['--project',work];
export function pending(){const dir=work+'/.writer/transactions';const tx=fs.readdirSync(dir).map(id=>json(dir+'/'+id+'/transaction.json')).filter(t=>t.kind==='tool-update'&&!['completed','rolled-back'].includes(t.status));assert(tx.length===1,'Expected exactly one pending tool transaction');return tx[0];}
export function txEvidence(label,tx){const dir=stage+'/observations/'+label;fs.mkdirSync(writable(dir),{recursive:true});putJSON(dir+'/transaction.json',tx);const rows=tx.plan.map((r,i)=>{const f=work+'/'+r.file,actual=fs.existsSync(f)?hash(read(f)):null;return {index:i,file:r.file,before:r.before,after:r.after,actual,is_old:actual===r.before,is_new:actual===r.after,old_backup_ok:r.before===null||hash(read(work+'/'+r.old_ref))===r.before,new_backup_ok:hash(read(work+'/'+r.new_ref))===r.after};});putJSON(dir+'/plan-observation.json',rows);const lock=json(work+'/.writer/write.lock');let alive=true;try{process.kill(lock.pid,0);}catch(e){if(e.code==='ESRCH')alive=false;else throw e;}put(dir+'/write.lock',read(work+'/.writer/write.lock'));putJSON(dir+'/lock-process.json',{lock,lock_sha256:hash(read(work+'/.writer/write.lock')),pid_alive:alive,checked_at:new Date().toISOString()});assert(!alive,'Previous lock PID must have ended');assert(rows.every(r=>r.old_backup_ok&&r.new_backup_ok),'Backup damage');return {rows,lock_sha256:hash(read(work+'/.writer/write.lock'))};}

const mode=process.argv[2];
if(mode==='baseline'){
  const dir=stage+'/baseline';assert(!fs.existsSync(dir),'Baseline already exists');fs.mkdirSync(writable(dir));const rows=selected(work);for(const ref of Object.keys(rows))put(dir+'/files/'+ref,read(work+'/'+ref));putJSON(dir+'/protected-files.json',rows);put(dir+'/state.bin',read(work+'/.writer/state.json'));for(const k of ['units','snapshot','governance','decisions'])putJSON(dir+'/'+k+'.json',state()[k]);putJSON(dir+'/all-work-files.json',inventory(work));putJSON(dir+'/frozen-source-inventory.json',inventory(source));const main={};for(const ref of ['package.json','bin','lib','docs','.agents/skills']){const f='D:/work/other/ai-writer/'+ref;if(fs.statSync(f).isDirectory()){for(const [n,r]of Object.entries(inventory(f)))main[ref+'/'+n]=r;}else main[ref]={bytes:read(f).length,sha256:hash(read(f))};}putJSON(dir+'/main-readonly-inventory.json',main);putJSON(dir+'/environment.json',{env:process.env,node:process.version,execPath:process.execPath,os:os.release(),created_at:new Date().toISOString()});put(work+'/研究/E轮实际Codex实跑授权原文.md',read(stage+'/request.md'));putJSON(stage+'/inputs/author-evidence.json',proof());console.log(JSON.stringify({baseline_files:Object.keys(rows).length,state_sha256:hash(read(dir+'/state.bin')),author_source_sha256:proof().source_sha256}));
}
if(mode==='initial'){
  run('01-external-doctor',external,['doctor',...projectArgs]);
  run('02-external-identify',external,['tool','identify',...projectArgs]);
  run('03-external-status',external,['status',...projectArgs]);
  run('04-external-discussion-context',external,['context',...projectArgs,'--purpose','discussion']);
  const p=run('05-external-update-plan',external,['tool','update-plan',...projectArgs,'--source',source]);assert(p.exit_code===0&&p.output.can_update,'Initial plan blocked');putJSON(stage+'/inputs/update.json',{...p.output.request,author_evidence:proof()});
}
if(mode==='prepared'){
 const r=run('06-update-prepared-stop',external,['tool','update',...projectArgs,'--input',stage+'/inputs/update.json'],{AI_WRITER_TEST_FAULT:'1',AI_WRITER_TEST_TOOL_STOP_PHASE:'prepared'});assert(r.exit_code===97,'Expected prepared 97');const tx=pending();putJSON(stage+'/transaction-id.json',{id:tx.id,plan_length:tx.plan.length});txEvidence('prepared',tx);run('07-status-prepared-pending',external,['status',...projectArgs]);run('08-tool-updates-prepared',external,['tool','updates',...projectArgs]);
}
if(['complete-stop','rollback-stop','complete-final'].includes(mode)){
 const tx=pending(),before=txEvidence(mode+'-before',tx),direction=mode==='rollback-stop'?'rollback':'complete',stop=mode==='complete-stop'?tx.plan.length:mode==='rollback-stop'?Math.floor(tx.plan.length/2):null;
 const input=stage+'/inputs/'+mode+'.json';putJSON(input,{transaction_id:tx.id,direction,lock_sha256:before.lock_sha256,author_evidence:proof()});
 const names={'complete-stop':'09-recover-complete-all-rows-stop','rollback-stop':'11-recover-rollback-middle-stop','complete-final':'14-recover-complete-final'};
 const r=run(names[mode],external,['tool','recover',...projectArgs,'--input',input],stop===null?{}:{AI_WRITER_TEST_FAULT:'1',AI_WRITER_TEST_TOOL_STOP_AFTER:String(stop)});assert(r.exit_code===(stop===null?0:95),'Unexpected recovery exit');
 if(stop!==null){const observed=txEvidence(mode+'-after',pending());if(mode==='complete-stop')assert(observed.rows.every(x=>x.is_new),'Not all rows new');run(mode==='complete-stop'?'10-status-all-new-pending':'12-status-rollback-pending',external,['status',...projectArgs]);if(mode==='rollback-stop')run('13-tool-updates-rollback-pending',external,['tool','updates',...projectArgs]);}
}
if(mode==='final-checks'){
 const id=json(stage+'/transaction-id.json').id;
 const retry=run('15-recover-same-input-idempotent',external,['tool','recover',...projectArgs,'--input',stage+'/inputs/complete-final.json']);assert(retry.exit_code===0&&retry.output.unchanged&&retry.state_unchanged,'Idempotency failure');
 const input=stage+'/inputs/terminal-rollback.json';putJSON(input,{...json(stage+'/inputs/complete-final.json'),direction:'rollback'});const denied=run('16-terminal-rollback-rejected',external,['tool','recover',...projectArgs,'--input',input]);assert(denied.exit_code!==0&&denied.state_unchanged,'Terminal rollback protection failed');
 run('17-embedded-help',embedded,['--help']);run('18-embedded-doctor',embedded,['doctor',...projectArgs]);run('19-embedded-status',embedded,['status',...projectArgs]);run('20-embedded-discussion-context',embedded,['context',...projectArgs,'--purpose','discussion']);run('21-embedded-check',embedded,['check',...projectArgs]);run('22-external-identify-installed',external,['tool','identify',...projectArgs]);
}
if(mode==='damage'){
 const dir=stage+'/damage-original';fs.mkdirSync(writable(dir));for(const ref of ['build-manifest.json','docs/quickstart.md'])put(dir+'/'+ref,read(work+'/.writer/tool/'+ref));putJSON(dir+'/tool-inventory.json',inventory(work+'/.writer/tool'));put(dir+'/state.bin',read(work+'/.writer/state.json'));put(stage+'/inputs/legal-existing-unit-plan.json',read(work+'/大纲/单元/0006.json'));
 fs.unlinkSync(writable(work+'/.writer/tool/build-manifest.json'));fs.appendFileSync(writable(work+'/.writer/tool/docs/quickstart.md'),'\nE轮隔离验证：测试追加行，仅用于完整资源身份损坏保护实跑。\n');
 run('23-damaged-embedded-doctor',embedded,['doctor',...projectArgs]);run('24-damaged-embedded-plan',embedded,['plan',...projectArgs,'--input',stage+'/inputs/legal-existing-unit-plan.json']);run('25-damaged-external-identify',external,['tool','identify',...projectArgs]);run('26-damaged-external-update-plan',external,['tool','update-plan',...projectArgs,'--source',source]);
}
if(mode==='rebuild-manifest'){
 const {writeBuildManifest}=await import(pathToFileURL('D:/work/other/ai-writer/lib/tool-build.mjs'));
 const original=json(stage+'/damage-original/build-manifest.json');snapshot(stage+'/observations/manifest-rebuild-before');const out=writeBuildManifest(work+'/.writer/tool',original.provenance,original.workspace_baselines);putJSON(stage+'/observations/rebuilt-manifest.json',out);snapshot(stage+'/observations/manifest-rebuild-after');
 run('27-rebuilt-external-identify',external,['tool','identify',...projectArgs]);run('28-rebuilt-embedded-doctor',embedded,['doctor',...projectArgs]);run('29-rebuilt-embedded-plan',embedded,['plan',...projectArgs,'--input',stage+'/inputs/legal-existing-unit-plan.json']);run('30-rebuilt-external-update-plan',external,['tool','update-plan',...projectArgs,'--source',source]);
}
if(mode==='restore'){
 snapshot(stage+'/observations/damage-before-restore');for(const ref of ['build-manifest.json','docs/quickstart.md'])fs.writeFileSync(writable(work+'/.writer/tool/'+ref),read(stage+'/damage-original/'+ref));assert(isDeepStrictEqual(inventory(work+'/.writer/tool'),json(stage+'/damage-original/tool-inventory.json')),'Package restoration differs');snapshot(stage+'/observations/damage-after-restore');run('31-restored-embedded-doctor',embedded,['doctor',...projectArgs]);run('32-restored-embedded-check',embedded,['check',...projectArgs]);run('33-restored-external-identify',external,['tool','identify',...projectArgs]);run('34-restored-external-update-plan',external,['tool','update-plan',...projectArgs,'--source',source]);
}
