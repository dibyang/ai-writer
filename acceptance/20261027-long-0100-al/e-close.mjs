import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {isDeepStrictEqual as equal} from 'node:util';
const base=path.dirname(fileURLToPath(import.meta.url)),main=path.join(base,'work');
const b=p=>fs.readFileSync(p),sha=x=>crypto.createHash('sha256').update(x).digest('hex'),j=p=>JSON.parse(b(p));
const recovery=j(path.join(base,'session-d-recovery.json')),root=recovery.workspace,old=j(path.join(main,'.writer/state.json')),now=j(path.join(root,'.writer/state.json'));
const initial=j(path.join(base,'session-e-start.json')),audit=j(path.join(base,'session-e-audit.json')),resume=j(path.join(base,'d-resume-input.json'));
if(resume.id!==audit.id||resume.token!==recovery.token)throw Error('original recovery changed');
if(sha(b(path.join(base,'d-resume-input.json')))!==sha(b(path.join(base,'commands/e-001-resume/input.raw.json'))))throw Error('resume bytes changed');
const stateAtEnd=j(path.join(base,'commands/e-014-final-status/stdout.raw.txt')),check=j(path.join(base,'commands/e-015-final-check/stdout.raw.txt'));
if(now.revision!==480||now.units.length!==115||stateAtEnd.next_unit!==116||check.units!==115||!check.ok)throw Error('end state drift');
const rows=[];
for(const [n,replay,preview,record]of [[113,'e-003-replay113','e-004-preview113','e-005-record113'],[114,'e-006-replay114','e-007-preview114','e-008-record114'],[115,'e-009-replay115','e-010-preview115','e-011-record115']]){
 const raw=j(path.join(base,`commands/${replay}/stdout.raw.txt`)),input=j(path.join(root,`.writer/drafts/AL-e-record${n}.json`)),p=j(path.join(base,`commands/${preview}/stdout.raw.txt`)),r=j(path.join(base,`commands/${record}/stdout.raw.txt`));
 const {replay_review:filled,...actual}=input,{replay_review:empty,...original}=raw;
 if(!equal(actual,original))throw Error('raw replay changed beyond reviewed fields');
 if(!p.ok||p.writes!==false||p.findings.length||!r.ok||r.unit!==n)throw Error('preview/record not successful');
 const preBytes=b(path.join(base,`commands/${preview}/input.raw.json`)),recBytes=b(path.join(base,`commands/${record}/input.raw.json`));
 if(sha(preBytes)!==sha(recBytes)||sha(recBytes)!==sha(b(path.join(root,`.writer/drafts/AL-e-record${n}.json`))))throw Error('input bytes changed');
 const oldJournal=b(path.join(main,old.units[n-1].journal)),newJournal=b(path.join(root,now.units[n-1].journal));
 if(!equal(JSON.parse(oldJournal).patch,JSON.parse(newJournal).patch))throw Error('journal patch changed');
 const reportBytes=b(path.join(root,filled.report)),frozen=b(path.join(root,now.units[n-1].replay_review.frozen_ref));
 if(sha(reportBytes)!==sha(frozen)||sha(reportBytes)!==now.units[n-1].replay_review.report_sha256)throw Error('report binding changed');
 rows.push({unit:n,draft_sha256:r.sha256,input_sha256:sha(recBytes),source_and_replay_identity_untouched:true,old_journal_sha256:sha(oldJournal),new_journal_sha256:sha(newJournal),patch_deep_equal_without_normalization:true,report:filled.report,report_sha256:sha(reportBytes)});
}
const tail=[];for(const row of old.units.filter(x=>x.unit>=116)){const digest=sha(b(path.join(root,row.journal)));if(digest!==row.journal_sha256)throw Error('candidate retained tail journal changed');tail.push({unit:row.unit,journal:row.journal,retained_candidate_journal_sha256:digest});}
for(const cmd of audit.commands)if(cmd.exit_code!==0||cmd.stderr_bytes!==0||cmd.runtime_files_stable!==true)throw Error('product command incomplete');
const output={ok:true,scope:'bindings-and-byte-verification-only',id:resume.id,base_revision:473,token_original_retained:true,resume_input_sha256:sha(b(path.join(base,'d-resume-input.json'))),candidate_revision:480,next_unit:116,rows,tail,product_commands:audit.commands.length,all_product_exit_zero:true,all_product_stderr_empty:true,runtime_files_stable:true,check_scope:check.scope,literary_quality:check.literary_quality,rolling_review:check.rolling_review,unregistered:check.draft_inventory.unregistered};
fs.writeFileSync(path.join(base,'session-e-bindings.json'),JSON.stringify(output,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({ok:true,rows:rows.map(x=>({unit:x.unit,patch_equal:x.patch_deep_equal_without_normalization,report_sha256:x.report_sha256})),tail_journals_preserved:tail.length,commands:output.product_commands}));
