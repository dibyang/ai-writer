import fs from 'node:fs';
import crypto from 'node:crypto';
import {createRunner} from '../command-runner.mjs';
const stage='acceptance/20261016-hundred/session-03',project='acceptance/20261016-hundred/works/潮汐信号';const r=createRunner(stage);
const sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const x=r.run(process.execPath,['bin/ai-writer.mjs','status','--project',project,'--view','full'],'status-after-replay');if(x.exit_code!==0)throw Error(x.stderr);
const before=r.json('status-before-rewind').snapshot,after=JSON.parse(x.stdout).snapshot;
const errors=[],checks=[];
for(const [id,a] of Object.entries(before.ledger)){
 const b=after.ledger[id];if(!b){errors.push(id+' missing');continue;}
 for(const f of ['type','statement','status','due_unit','author_truth','introduced_unit','updated_unit'])if(JSON.stringify(a[f])!==JSON.stringify(b[f]))errors.push(id+' changed '+f);
 for(const [p,v] of Object.entries(a.character_known??{}))if(b.character_known?.[p]!==v)errors.push(id+' knowledge changed '+p);
 if(JSON.stringify(a.custody)!==JSON.stringify(b.custody))errors.push(id+' custody changed');
 const evidence=(e)=>JSON.stringify([e.unit,e.draft,e.line,e.quote]);
 for(const e of a.evidence??[]){const found=(b.evidence??[]).find(z=>evidence(z)===evidence(e));if(!found)errors.push(id+' evidence lost '+e.unit);else if(found.sha256!==e.sha256&&e.unit!==41)errors.push(id+' unexpected evidence hash '+e.unit);}
}
if(JSON.stringify(before.characters)!==JSON.stringify(after.characters))errors.push('character states differ');
if(JSON.stringify(before.timeline)!==JSON.stringify(after.timeline))errors.push('timeline differs');
if(JSON.stringify(before.threads)!==JSON.stringify(after.threads))errors.push('threads differ');
const file41=fs.readdirSync(project+'/正文').find(f=>f.startsWith('0041-')),file42=fs.readdirSync(project+'/正文').find(f=>f.startsWith('0042-'));
const old41=fs.readFileSync(stage+'/repair-41-before/正文__'+file41,'utf8'),new41=fs.readFileSync(project+'/正文/'+file41,'utf8');
if(old41.replace('别托她到了才讲要钱','别等他到了才讲要钱')!==new41)errors.push('41 change exceeded two characters');
const old42=sha(stage+'/repair-41-before/正文__'+file42),new42=sha(project+'/正文/'+file42);if(old42!==new42)errors.push('42 body changed');
const baseline=r.json('status-full').snapshot.ledger;
for(const [id,a]of Object.entries(baseline)){
 const b=after.ledger[id];if(!b){errors.push('initial missing '+id);continue;}
 if(a.type==='observation'&&(a.statement!==b.statement||JSON.stringify(a.author_truth)!==JSON.stringify(b.author_truth)))errors.push('initial observation changed '+id);
 if(a.due_unit!==b.due_unit)errors.push('initial due changed '+id);
 if(a.status==='resolved'&&b.status!=='resolved')errors.push('initial resolved reopened '+id);
 for(const [p,v]of Object.entries(a.character_known??{}))if(!b.character_known?.[p]?.includes(v))errors.push('initial knowledge lost '+id+' '+p);
 for(const e of a.evidence??[])if(!(b.evidence??[]).some(z=>z.unit===e.unit&&z.quote===e.quote&&z.sha256===e.sha256))errors.push('initial evidence lost '+id+' '+e.unit);
}
const result={ok:errors.length===0,errors,initial_ledger_count:Object.keys(baseline).length,before_rewind_ledger_count:Object.keys(before.ledger).length,after_ledger_count:Object.keys(after.ledger).length,checks:['All pre-rewind ledger IDs, statements, due, status, custody, knowledge and quote/unit/line anchors unchanged; only unit41 evidence hashes rebound','All character state strings, timeline and threads equal pre-rewind','41 body exactly two-character correction; 42 byte-identical','Initial 62 ledger IDs and valid old observations, due, evidence and knowledge preserved; initial resolved items not reopened'],old_41_sha256:sha(stage+'/repair-41-before/正文__'+file41),new_41_sha256:sha(project+'/正文/'+file41),unit42_sha256:new42,revision_after:JSON.parse(x.stdout).revision};
fs.writeFileSync(stage+'/replay-verification.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));if(errors.length)process.exitCode=1;
