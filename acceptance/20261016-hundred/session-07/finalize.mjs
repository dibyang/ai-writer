import fs from 'node:fs';
import {stage,project,runner,hash,write,cli} from './session.mjs';
const git=runner.run('git',['--no-optional-locks','status','--short','--untracked-files=no'],'git-status-final');
console.log(JSON.stringify({git_exit:git.exit_code,git_stdout:git.stdout,git_stderr:git.stderr}));
const status=cli('status-final',['status']);
const exact=runner.json('status-final');if(exact.revision!==165||exact.next_unit!==67)throw Error('Final exact status is unexpected');
const check=cli('check-final',['check']);const doctor=cli('doctor-final',['doctor']);
if(!check.ok||check.units!==66||check.findings.length||check.rolling_review.pending_windows.length)throw Error('Final check not clean');
const s=JSON.parse(fs.readFileSync(project+'/.writer/state.json','utf8'));const before=runner.json('status-full').snapshot;
const missing=[];let evidenceCount=0,knowledgeCount=0,dueCount=0;
const identity=(id,x)=>JSON.stringify([id,x.unit,x.quote,x.sha256??null]);
for(const [id,old] of Object.entries(before.ledger)){
 const now=s.snapshot.ledger[id];if(!now){missing.push({id,reason:'missing-id'});continue;}
 if(old.type==='observation'&&(old.statement!==now.statement||old.author_truth!==now.author_truth))missing.push({id,reason:'observation-changed'});
 if(old.due_unit!==undefined){dueCount++;if(now.due_unit!==old.due_unit)missing.push({id,reason:'due-changed'});}
 const bag=new Map();for(const e of now.evidence??[]){const k=identity(id,e);bag.set(k,(bag.get(k)||0)+1);}
 for(const e of old.evidence??[]){evidenceCount++;const k=identity(id,e);if(!bag.get(k))missing.push({id,reason:'old-evidence-missing',e});else bag.set(k,bag.get(k)-1);}
 for(const [name,k] of Object.entries(old.character_known??{})){knowledgeCount++;if(!now.character_known?.[name]?.includes(k))missing.push({id,name,reason:'old-knowledge-missing'});}
}
const chapters=[];for(let i=61;i<=66;i++){
 const input=JSON.parse(fs.readFileSync(stage+'/record-'+i+'.json','utf8'));const p=project+'/'+input.draft;const body=fs.readFileSync(p,'utf8').replace(/^#.*(?:\r?\n|$)/,'');const han=(body.match(/\p{Script=Han}/gu)||[]).length;
 if(han<2400||han>3200)throw Error('Han count outside range: '+i);
 for(const [source,h] of Object.entries(input.source_hashes)){if(source!=='.writer/state.json'&&hash(project+'/'+source)!==h)missing.push({unit:i,source,reason:'consumed-source-drift'});}
 chapters.push({unit:i,draft:input.draft,han,expected_revision:input.expected_revision,recorded_revision:runner.json('record-'+i).revision,sha256:hash(p),source_hashes:input.source_hashes,input_sha256:hash(stage+'/record-'+i+'.json'),template_sha256:hash(stage+'/template-'+i+'.json')});
}
const audit={nature:'机械保留核对，不证明语义',initial_revision:159,final_revision:s.revision,old_ledger_ids:Object.keys(before.ledger).length,final_ledger_ids:Object.keys(s.snapshot.ledger).length,evidence_identity:'multiset ID + unit + quote + sha256; line is not identity',old_evidence_checked:evidenceCount,old_character_known_checked:knowledgeCount,original_due_checked:dueCount,missing,chapters,state_sha256:hash(project+'/.writer/state.json'),status_files:runner.last('status-final').files,check_files:runner.last('check-final').files,doctor_files:runner.last('doctor-final').files};
write(stage+'/final-audit.json',audit);
if(missing.length)throw Error('Preservation audit failed; inspect final-audit.json');
if(fs.existsSync(stage+'/export'))throw Error('Export directory exists; do not overwrite');
const exported=cli('export-final',['export','--out',stage+'/export']);write(stage+'/export-response.json',exported);
console.log(JSON.stringify({status,check,doctor,audit:{...audit,chapters:chapters.map(({unit,han,recorded_revision,sha256})=>({unit,han,recorded_revision,sha256}))},exported},null,2));
