import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),repo=path.resolve(base,'../..');
const count=Number(process.argv[2]??47),label=process.argv[3]??`scale${count}`;
const source=path.resolve(process.argv[4]??path.join(repo,'.tmp/relocation-ai1/ai-writer-0.10.0'));
const old=path.join(repo,'.tmp/release090-01df-final/ai-writer-0.9.0'),root=path.join(base,'scenario',label);
let cli=path.join(old,'bin/ai-writer.mjs'),seq=0;
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),state=()=>JSON.parse(fs.readFileSync(path.join(root,'.writer/state.json')));
function write(file,value){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,typeof value==='string'?value:JSON.stringify(value,null,2)+'\n',{flag:'wx'});return file;}
function run(name,args,expected=0,env={}){const id=`${label}-${String(++seq).padStart(3,'0')}-${name}`;const r=spawnSync(process.execPath,[path.join(base,'capture.mjs'),id,process.execPath,cli,...args],{encoding:'utf8',windowsHide:true,env:{...process.env,...env},maxBuffer:2**20});assert.equal(r.status,expected,r.stderr||r.stdout);const d=path.join(base,'commands',id),raw=fs.readFileSync(path.join(d,expected===0?'stdout.raw.txt':'stderr.raw.txt'),'utf8');console.log(id,expected);return expected===0?JSON.parse(raw):raw;}
function call(name,command,action,input,extra=[],project=root,expected=0,env={}){const args=[command,...(action?[action]:[]),'--project',project];if(input)args.push('--input',write(path.join(base,'inputs',`${label}-${seq+1}-${name}.json`),input));return run(name,[...args,...extra],expected,env);}
function inventory(dir){const rows={};function walk(d,ref=''){for(const e of fs.readdirSync(d,{withFileTypes:true})){const r=ref?ref+'/'+e.name:e.name;if(e.isDirectory())walk(path.join(d,e.name),r);else rows[r]=sha(fs.readFileSync(path.join(d,e.name)));}}walk(dir);return rows;}
run('init',['init','--path',root,'--kind','novel','--title',`合成${count}章路径验证`,'--mode','long']);
const quote=`仅用于合成 ${count} 章验证：允许限定写作、工具更新、纯路径迁移、修订和明确的中断恢复。不是实际作品授权。`;
write(path.join(root,'研究/验证授权.md'),quote);const evidence={local_source:'研究/验证授权.md',source_sha256:sha(quote),quote,locator:'synthetic fixture line 1',recorded_by:'Codex synthetic CLI validation'};
let workflow=call('workflow','workflow','show').workflow;workflow.stage='trial';workflow.task='合成登记与迁移验证';workflow.authorization={allowed_actions:['discuss','plan','draft'],draft_range:{from:1,to:count+2},revise_range:null,stop_conditions:['限定合成作品，不触及现有作品']};
call('authorize','workflow','set',{expected_revision:state().revision,operation_id:label+'-authorize',workflow,author_evidence:evidence});
const ranges=count===36?[[1,20,'初卷'],[21,40,'续卷']]:[[1,7,'新朝入户'],[8,17,'谁能任事'],[18,25,'钱粮远行'],[26,37,'战争与重建'],[38,49,'再议号令']];
for(const [i,[from,to,title]]of ranges.entries())call('volume','volume',null,{id:`V${i+1}`,title,start:from,end:to,promises:['逐章核对登记'],constraints:[],reserved:[],arcs:[{id:`A${i+1}`,start:from,end:to,goal:'核对账册',payoff:'完成登记',forbidden:[]}]});
for(let n=1;n<=count;n++){
  call('plan','plan',null,{unit:n,title:`第${n}次交接`,goal:'核对本次清单',change:`登记第${n}处进展`,beats:['检查凭据','核对编号','登记交接'],cast:['阿禾'],setting_refs:[],research_refs:n>1?['正文/0001.md']:[]});
  call('context','context',null,null,['--unit',String(n),'--max-chars','250000']);
  const draft=`正文/${String(n).padStart(4,'0')}.md`,input=call('template','record-template',null,null,['--unit',String(n),'--draft',draft]);
  const body=`# 第${n}次交接\n\n`+Array.from({length:42},(_,i)=>`阿禾核对第${n}站第${i+1}项登记。柜上的木匣没有移动，他按清单取出对应的纸条，读过编号，再把纸条放回原位。值守的人在旁边补记了当日交接的时辰。`).join('\n\n')+'\n';write(path.join(root,draft),body);
  input.summary=`阿禾核对第${n}站交接清单`;input.changes.characters={阿禾:`第${n}站`};input.changes.timeline_append=[`第${n}站完成核对`];
  if(n===1)input.changes.ledger={O_BOX:{type:'object',statement:'木匣留在柜上',status:'active',custody:{holder:'值守人',location:'柜上',condition:'完好'},cast:['阿禾'],tags:['交接'],evidence:[{unit:1,quote:'柜上的木匣没有移动'}]}};
  call('preview','record-preview',null,input);call('record','record',null,input);
}
write(path.join(root,'审查/迁移前复核.md'),'# 合成流程复核\n仅检验覆盖绑定，不声明文学质量。\n');
call('review','review',null,{from:1,to:count,kind:'model-self-review',report:'审查/迁移前复核.md',source_hashes:Object.fromEntries(state().units.map(u=>[u.draft,u.sha256]))});
const before=state(),bodyBytes=before.units.reduce((n,u)=>n+fs.statSync(path.join(root,u.draft)).size,0),reviewBefore=call('before-check','check').rolling_review;
const exportBefore=call('before-export','export',null,null,['--out',path.join(base,`${label}-export-before`)]);
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
