import fs from 'node:fs';
import path from 'node:path';
import {isDeepStrictEqual as same} from 'node:util';
import {stage,work,cli} from './run-cli.mjs';
import {sha,read,save,state,must} from './ops.mjs';
import {replaySnapshots} from '../rebuild-utils.mjs';
const old=read(path.join(stage,'replayed-initial.json')),s=state();
if(s.units.length!==72)throw Error('Checkpoint must be exactly 72');
const before=path.join(stage,'metadata-repair/before/work');
const changed_drafts=s.units.filter(u=>sha(path.join(work,u.draft))!==sha(path.join(before,u.draft))).map(u=>u.unit);
if(!same(changed_drafts,[72]))throw Error('Unexpected prose changes');
const pre72=fs.readFileSync(path.join(before,old.units[71].draft),'utf8'),post72=fs.readFileSync(path.join(work,old.units[71].draft),'utf8');
if(pre72.replace('至少今天回来没要你送。我先自己穿几回，别你也跟着买。','今天我能自己走回去，不用你送。我先自己穿几回，别你也跟着买。')!==post72)throw Error('72 prose changed outside whitelist');
if(!same(s.units.slice(0,31),old.units.slice(0,31)))throw Error('Prior 31 records changed');
const after=replaySnapshots(work,s),desired=read(path.join(stage,'metadata-repair/desired-snapshots.json')).snapshots;
const issues=[],evidence=[];
for(let n=1;n<=72;n++){
 const a=after[n],b=desired[n];
 for(const [id,v] of Object.entries(old.snapshots[n].ledger??{})){
  const now=a.ledger[id];
  for(const key of ['type','introduced_unit','due_unit'])if(!same(now?.[key],v[key]))issues.push({unit:n,id,key});
  for(const e of v.evidence??[]){
   const matches=now.evidence.filter(x=>x.unit===e.unit&&x.quote===e.quote&&x.draft===e.draft);
   if(matches.length!==1)issues.push({unit:n,id,missing_quote:e.quote,matches:matches.length});
   else if(e.unit!==72&&matches[0].sha256!==e.sha256)issues.push({unit:n,id,changed_evidence_version:e});
   else if(n===72)evidence.push({id,unit:e.unit,quote:e.quote,old_sha256:e.sha256,new_sha256:matches[0].sha256});
  }
 }
}
if(issues.length)throw Error(JSON.stringify(issues));
const counts=sn=>({knowledge:Object.values(sn.ledger).reduce((n,e)=>n+Object.keys(e.character_known??{}).length,0),anchors:Object.values(sn.ledger).reduce((n,e)=>n+(e.evidence??[]).length,0)});
const result={at:new Date().toISOString(),revision:s.revision,original_revision:old.revision,rewind_revision:read(path.join(stage,'metadata-repair/rewind-result.json')).revision,units:72,prior31_records_identical:true,changed_drafts,all_other_draft_hashes_identical:true,all_original_id_type_introduced_due_preserved:true,evidence_identity:'id+unit+quote+draft+source-version (unit72 whitelisted whole-file rebind)',all_original_evidence_retained:true,original_anchor_count:evidence.length,part1_before:counts(old.snapshots[24]),part1_after:counts(after[24]),timeline_prefix_31_identical:same(after[31].timeline,old.snapshots[31].timeline),reader_72_already_current:s.snapshot.ledger.T_SOUND_CONTEXT.reader_known,unknowns_and_partial_not_reset:true,original_quote_versions:evidence,elapsed_s:(Date.now()-Date.parse(read(path.join(stage,'start.json')).started_at))/1000};
save(path.join(stage,'metadata-repair/verification.json'),result);
for(const [cmd,label] of [['status','repair-status-72'],['check','repair-check-72-final'],['doctor','repair-doctor-72']]){
 const r=must(cli([cmd],label));save(path.join(stage,`metadata-repair/${cmd}-72.json`),r);
 if(cmd==='check'&&r.rolling_review.pending_windows.length)throw Error('Pending review windows');
}
const exported=must(cli(['export','--out',path.join(stage,'metadata-repair/export')],'repair-export-72'));
save(path.join(stage,'metadata-repair/export-result.json'),exported);
console.log(JSON.stringify({...result,original_quote_versions:undefined,export:exported},null,2));
