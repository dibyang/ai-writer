import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {isDeepStrictEqual as equal} from 'node:util';
import {applyDelta} from './work/.writer/tool/lib/journal.mjs';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)), main=path.join(base,'work');
const recovery=JSON.parse(fs.readFileSync(path.join(base,'session-d-recovery.json'))), branch=recovery.workspace;
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=(root,ref)=>fs.readFileSync(path.join(root,ref));
const json=(root,ref)=>JSON.parse(read(root,ref));
const save=(root,ref,obj)=>fs.writeFileSync(path.join(root,ref),JSON.stringify(obj,null,2)+'\n',{flag:'wx'});
const scan=(root,dir)=>fs.readdirSync(path.join(root,dir),{withFileTypes:true}).flatMap(e=>e.isDirectory()?scan(root,dir+'/'+e.name):[dir+'/'+e.name]);
const files=root=>Object.fromEntries(scan(root,'正文').map(ref=>[ref,sha(read(root,ref))]));
const mode=process.argv[2];
const patch=(root,row)=>{const b=read(root,row.journal);assert.equal(sha(b),row.journal_sha256);return JSON.parse(b).patch;};
function snapshot(root,s,n){let out=structuredClone(s.snapshot);for(const row of [...s.units].reverse()){if(row.unit<=n)break;out=applyDelta(out,patch(root,row),true,false);}return out;}
if(mode==='start'){
 const m=json(main,'.writer/state.json'), b=json(branch,'.writer/state.json'), s=json(main,`.writer/revisions/${recovery.id}/session.json`), status=json(base,'commands/f-002-status-at116/stdout.raw.txt');
 assert.equal(s.id,'dd6f0f3b-1f02-4db2-be4e-34fe7fe658c7');assert.equal(s.project_id,'cd8e8d32-f685-41b1-8f52-5447fe29d399');assert.equal(s.status,'editing');assert.equal(s.base_sha256,'407040ab54b5715c83e042afe6712135f880dd4a6c1340ec95d27d7fc78e0bf5');
 assert.equal(sha(read(main,`.writer/revisions/${s.id}/base.json`)),s.base_sha256);assert.equal(json(main,`.writer/revisions/${s.id}/base.json`).revision,473);
 assert.equal(m.revision,473);assert.equal(m.units.length,118);assert.equal(b.revision,480);assert.equal(b.units.length,115);assert.equal(status.next_unit,116);
 assert.equal(sha(read(main,'.writer/state.json')),'d0584647414d9bbc4c4fb3d0b8575fae7fcb46fab612120e2d2e3840d714205a');assert.equal(sha(read(branch,'.writer/state.json')),'383dc6c923892db1daba836614b6850d8abbcf715fc5c947aea2c935092e2c64');
 for(let n=110;n<=115;n++)assert.equal(b.units[n-1].replay_review.base.session_id,s.id);
 const freeze={created_at:new Date().toISOString(),id:s.id,base_sha256:s.base_sha256,main_state_sha256:sha(read(main,'.writer/state.json')),branch_state_sha256:sha(read(branch,'.writer/state.json')),main_units:m.units,branch_units:b.units,main_files:files(main),branch_files:files(branch),review_workflow:status.review_workflow};
 for(const n of [116,117,118])assert.equal(freeze.branch_files[m.units[n-1].draft],m.units[n-1].sha256);
 save(base,'session-f-start.json',freeze);console.log('Identity/base/next116 and all three retained tail hashes verified; start freeze saved.');
}else if(mode==='comparison'){
 const n=Number(process.argv[3]), v=json(branch,`.writer/drafts/AL-f-replay${n}-raw.json`), m=json(main,'.writer/state.json'),row=m.units[n-1],before=snapshot(main,m,n-1),after=applyDelta(before,patch(main,row));
 assert.equal(v.unit,n);assert.equal(sha(read(branch,v.draft)),row.sha256);assert.equal(v.summary,row.summary);assert.equal(v._replay.old_journal_sha256,row.journal_sha256);
 const quotes=[];for(const [id,item] of Object.entries(v.changes.ledger??{}))for(const e of item.evidence??[]){const source=m.units[e.unit-1].draft,b=read(branch,source),t=b.toString('utf8'),at=t.indexOf(e.quote);assert.ok(at>=0,`missing quote ${id}`);const old=after.ledger[id].evidence.find(x=>x.unit===e.unit&&x.quote===e.quote);assert.ok(old);assert.equal(sha(read(main,source)),old.sha256);assert.equal(sha(b),json(base,'session-f-start.json').branch_files[source]);quotes.push({id,unit:e.unit,draft:source,quote:e.quote,line:t.slice(0,at).split('\n').length,sha256:sha(b),old_evidence:old});}
 save(branch,`研究/AL-f-${n}-evidence-comparison.json`,{unit:n,old_summary:row.summary,current_replay_summary:v.summary,old_journal:row.journal,old_journal_sha256:row.journal_sha256,old_patch:patch(main,row),old_before:Object.fromEntries(Object.keys(v.changes.ledger??{}).map(k=>[k,before.ledger[k]??null])),old_after:Object.fromEntries(Object.keys(v.changes.ledger??{}).map(k=>[k,after.ledger[k]])),current_replay_changes:v.changes,quotes});
 const reading={unit:n,summary:v.summary,characters:Object.fromEntries(Object.entries(v.changes.characters??{}).map(([k,s])=>[k,s.split('；此前')[0]])),timeline_append:v.changes.timeline_append,ledger:v.changes.ledger,quotes,old_patch_paths:patch(main,row).map(x=>x.at),note:'当前人物状态首段实读；此前长历史不作为全书新实读，由旧journal及最终快照深比较保留。完整原差量在同名evidence-comparison.json。116早期semantic-reading的辅助old_patch_paths误取path显示null；原始完整old_patch的at正确保留，不改变原证据。'};
 save(branch,`研究/AL-f-${n}-semantic-reading.json`,reading);console.log(JSON.stringify({ok:true,unit:n,quotes:quotes.length,old_patch_operations:patch(main,row).length}));
}else if(mode==='input'){
 const n=Number(process.argv[3]),v=json(branch,`.writer/drafts/AL-f-replay${n}-raw.json`),report=`审查/AL-f-${n}-replay-review.md`;
 assert.ok(read(branch,report).length>1000);assert.equal(sha(read(branch,v.draft)),v._replay.draft_sha256);
 v.replay_review={reviewer:'AL-session-f-Codex-informed-semantic-review',report,draft_sha256:sha(read(branch,v.draft)),checked_fields:['summary','characters','timeline','ledger','evidence','downstream']};
 save(branch,`.writer/drafts/AL-f-record${n}.json`,v);console.log(JSON.stringify({ok:true,unit:n,report_sha256:sha(read(branch,report)),draft_sha256:v.replay_review.draft_sha256}));
}else if(mode==='preview-check'){
 const n=Number(process.argv[3]),label=process.argv[4],v=json(base,`commands/${label}/stdout.raw.txt`),m=json(main,'.writer/state.json'),c=json(branch,'.writer/state.json');
 const normalize=x=>JSON.parse(JSON.stringify(x).replaceAll(c.units[109].sha256,m.units[109].sha256).replaceAll(c.units[111].sha256,m.units[111].sha256));
 assert.equal(v.ok,true);assert.equal(v.writes,false);assert.deepEqual(v.findings,[]);assert.equal(v.source_hashes,'matched-current-context');assert.equal(v.unit,n);assert.ok(equal(normalize(v.changes),patch(main,m.units[n-1])));
 const result={ok:true,unit:n,preview:label,changes_equal_original_patch_after_two_D_hash_normalization:true,changes:v.changes.map(x=>x.at),unchanged:v.unchanged,related_unchanged_ledger:v.related_unchanged_ledger,findings:v.findings};
 save(base,`session-f-preview${n}-audit.json`,result);console.log(JSON.stringify(result));
}else if(mode==='manifest'){
 const units=[27,95,100,105,107,109,110,111,112,113,114,115,116,117,118],s=json(main,'.writer/state.json');
 save(branch,'研究/AL-f-reading-manifest.json',{reviewer:'AL-session-f-Codex-informed-model-self-review',complete_read_units:units,rows:s.units.filter(x=>units.includes(x.unit)).map(x=>({unit:x.unit,draft:x.draft,sha256:sha(read(branch,x.draft))})),note:'通过FastCtx完整实读上述正文。其余早章未全文读，不以state长串或机械hash审计冒称全书读完。'});console.log('Reading manifest frozen: 15 complete chapters including 110-118.');
}
