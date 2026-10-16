import fs from 'node:fs';
import path from 'node:path';
import {isDeepStrictEqual as same} from 'node:util';
import {changesBetween} from '../rebuild-utils.mjs';
import {stage,work,read,save,hash,cli,logRead,runner} from './stage.mjs';
const [action,ns,pass]=process.argv.slice(2),n=Number(ns),draft=read(path.join(stage,'drafts-manifest.json')).find(x=>x.unit===n);
const out=pass?path.join(stage,pass):stage,label=s=>pass?`${pass}-${s}`:s;
if(!draft)throw Error('Expected chapter 25—42');
const input=path.join(out,'inputs',`${n}.json`);
function ok(r){if(r.exit_code!==0)throw Error(`${r.label}: ${r.stderr}`);return JSON.parse(r.stdout);}
if(action==='prepare'){
 const state=read(path.join(work,'.writer/state.json'));if(state.units.length!==n-1)throw Error('Sequential only');
 ok(cli('plan',['--input',path.join(stage,'plans',`${n}.json`)],label(`plan-${n}`)));
 const context=ok(cli('context',['--unit',String(n),'--max-chars','160000'],label(`context-${n}`)));save(path.join(out,'contexts',`${n}.json`),context);
 const template=ok(cli('record-template',['--unit',String(n),'--draft',draft.draft],label(`template-${n}`)));save(input,template);
 console.log(JSON.stringify({unit:n,revision:context.revision,expected_revision:template.expected_revision,source_hashes:template.source_hashes,context_keys:Object.keys(context),continuity_keys:Object.keys(context.continuity??{}),omitted_ids:context.continuity?.omitted_ids,plan:context.plan}));
}
if(action==='commit'){
 const template=read(input),state=read(path.join(work,'.writer/state.json')),desired=read(path.join(stage,'desired-snapshots.json'))[n];
 if(state.units.length!==n-1||template.expected_revision!==state.revision)throw Error('Fresh template required');
 const manifest=read(path.join(stage,'drafts-manifest.json'));
 if(hash(draft.staged)!==draft.sha256||draft.han<2400||draft.han>3200)throw Error('Draft candidate changed or length invalid');
 const changes=changesBetween(state.snapshot,desired,n);save(path.join(out,'changes',`${n}.json`),changes);
 template.summary=read(path.join(stage,'summaries.json'))[n];template.changes=changes;delete template._instructions;save(input,template);
 const target=path.join(work,draft.draft);fs.copyFileSync(draft.staged,target);
 if(draft.old_draft!==draft.draft){const old=path.join(work,draft.old_draft);if(fs.existsSync(old)){if(hash(old)!==draft.old_sha256)throw Error('Old rename source drift');fs.unlinkSync(old);}}
 logRead(draft.draft,'本章全文已读、与摘要/changes核对后登记','after');
 ok(cli('record',['--input',input],label(`record-${n}`)));
 const checked=ok(cli('check',[],label(`check-${n}`)));
 const current=read(path.join(work,'.writer/state.json'));save(path.join(out,'actual-snapshots',`${n}.json`),current.snapshot);
 console.log(JSON.stringify({unit:n,revision:current.revision,han:draft.han,changed_ledger:Object.keys(changes.ledger),check_ok:checked.ok,findings_count:checked.findings?.length,non_temporary_findings:checked.findings?.filter(x=>!['UNREGISTERED_DRAFT','ROLLING_REVIEW_PENDING'].includes(x.code)),rolling_review:checked.rolling_review}));
}
