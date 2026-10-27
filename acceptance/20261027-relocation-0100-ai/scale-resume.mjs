import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),repo=path.resolve(base,'../..');
const count=Number(process.argv[2]??47),label=process.argv[3]??`scale${count}`;
const source=path.resolve(process.argv[4]??path.join(repo,'.tmp/relocation-ai1/ai-writer-0.10.0'));
const old=path.join(repo,'.tmp/release090-01df-final/ai-writer-0.9.0'),root=path.join(base,'scenario','scale47-first');
let cli=path.join(old,'bin/ai-writer.mjs'),seq=0;
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),state=()=>JSON.parse(fs.readFileSync(path.join(root,'.writer/state.json')));
function write(file,value){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,typeof value==='string'?value:JSON.stringify(value,null,2)+'\n',{flag:'wx'});return file;}
function run(name,args,expected=0,env={}){const id=`${label}-${String(++seq).padStart(3,'0')}-${name}`;const r=spawnSync(process.execPath,[path.join(base,'capture.mjs'),id,process.execPath,cli,...args],{encoding:'utf8',windowsHide:true,env:{...process.env,...env},maxBuffer:2**20});assert.equal(r.status,expected,r.stderr||r.stdout);const d=path.join(base,'commands',id),raw=fs.readFileSync(path.join(d,expected===0?'stdout.raw.txt':'stderr.raw.txt'),'utf8');console.log(id,expected);return expected===0?JSON.parse(raw):raw;}
function call(name,command,action,input,extra=[],project=root,expected=0,env={}){const args=[command,...(action?[action]:[]),'--project',project];if(input)args.push('--input',write(path.join(base,'inputs',`${label}-${seq+1}-${name}.json`),input));return run(name,[...args,...extra],expected,env);}
function inventory(dir){const rows={};function walk(d,ref=''){for(const e of fs.readdirSync(d,{withFileTypes:true})){const r=ref?ref+'/'+e.name:e.name;if(e.isDirectory())walk(path.join(d,e.name),r);else rows[r]=sha(fs.readFileSync(path.join(d,e.name)));}}walk(dir);return rows;}
const quote=fs.readFileSync(path.join(root,'研究/验证授权.md'),'utf8');
const evidence={local_source:'研究/验证授权.md',source_sha256:sha(quote),quote,locator:'synthetic fixture line 1',recorded_by:'Codex synthetic CLI validation'};
const ranges=[[1,7,'新朝入户'],[8,17,'谁能任事'],[18,25,'钱粮远行'],[26,37,'战争与重建'],[38,49,'再议号令']];
const before=state(),bodyBytes=before.units.reduce((n,u)=>n+fs.statSync(path.join(root,u.draft)).size,0),reviewBefore=call('before-check','check').rolling_review;
const exportBefore=call('before-export','export',null,null,['--out',path.join(base,label+'-export-before')]);
cli=path.join(source,'bin/ai-writer.mjs');
const updatePlan=call('update-plan','tool','update-plan',{source,validation_mode:'in-place-readonly'});assert.equal(updatePlan.can_update,true,JSON.stringify(updatePlan.blockers));
const updated=call('update','tool','update',{...updatePlan.request,author_evidence:evidence});assert.equal(updated.status,'completed');assert.deepEqual(state().units,before.units);
const validation=path.join(root,'.writer/tool-updates',updated.transaction_id,'validation');assert.equal(Object.keys(inventory(validation)).some(r=>r.startsWith('正文/')),false);
cli=path.join(root,'.writer/tool/bin/ai-writer.mjs');
const directories=ranges.map(([from,to,title],i)=>({volume_id:`V${i+1}`,directory:`正文/V${i+1}-${title}`,from,to}));
const mapping=before.units.map(u=>({unit:u.unit,from:u.draft,to:directories.find(d=>d.from<=u.unit&&u.unit<=d.to).directory+'/'+path.basename(u.draft),sha256:u.sha256}));
const initialInventory=inventory(root),proposed=call('migration-plan','draft','relocate-plan',{mapping,directories});assert.deepEqual(inventory(root),initialInventory);
const input={...proposed.request,author_evidence:evidence};
call('migration-interrupt','draft','relocate',input,[],root,94,{AI_WRITER_TEST_FAULT:'1',AI_WRITER_TEST_RELOCATE_STOP_AFTER:String(Math.floor(count/2))});
call('pending-status','status',null,null,[],root,2);
const recoveryView=call('recovery-view','status',null,null,['--view','task']);assert.ok(recoveryView.next.command.includes('draft relocations'));
const tx=call('migration-list','draft','relocations').transactions.find(t=>t.status==='applying');
call('migration-recover','draft','relocate-recover',{transaction_id:tx.id,direction:'complete',lock_sha256:tx.lock_sha256,author_evidence:evidence});
call('migration-idempotent','draft','relocate',input);
const after=state(),check=call('after-check','check');assert.equal(check.ok,true);assert.equal(check.findings.length,0);assert.deepEqual(check.rolling_review,reviewBefore);assert.equal(after.units.length,count);
for(let i=0;i<count;i++){const u=after.units[i];assert.equal(sha(fs.readFileSync(path.join(root,u.draft))),before.units[i].sha256);assert.equal(fs.existsSync(path.join(root,before.units[i].draft)),false);assert.deepEqual(u.source_hashes,before.units[i].source_hashes);assert.equal(u.journal_sha256,before.units[i].journal_sha256);}
const exportAfter=call('after-export','export',null,null,['--out',path.join(base,`${label}-export-after`)]);assert.equal(exportAfter.sha256,exportBefore.sha256);
call('discussion-resume','context',null,null,['--purpose','discussion','--max-chars','250000']);
call('next-plan','plan',null,{unit:count+1,title:'下一次交接',goal:'继续核对',change:'下一步',beats:['继续'],research_refs:['正文/0001.md']});
const context=call('next-context','context',null,null,['--unit',String(count+1),'--max-chars','250000']);assert.ok(context.draft_path.startsWith(directories.at(-1).directory+'/'));
// Old official runtime must refuse schema7, not silently reinterpret the moved work.
const installedCLI=cli;cli=path.join(old,'bin/ai-writer.mjs');call('old-runtime-refusal','status',null,null,[],root,2);cli=installedCLI;
const result={ok:true,chapters:count,body_bytes:bodyBytes,body_sha_unchanged:true,source_hashes_unchanged:true,journals_unchanged:true,review_coverage_unchanged:true,manuscript_sha256:exportAfter.sha256,update_body_copies:0,migration_body_copies:0,interrupted_after:Math.floor(count/2),recovered:true,old_runtime_refused:true,next_path:context.draft_path,source,root,scope:'synthetic CLI mechanical verification only; no real works accessed or changed'};
write(path.join(base,`${label}-verification.json`),result);console.log(JSON.stringify(result));
