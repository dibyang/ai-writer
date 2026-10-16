import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { replaySnapshots } from './rebuild-utils.mjs';
const base='acceptance/20261016-hundred',phase=`${base}/session-12`,fix=`${phase}/repair-95`,work=`${base}/works/潮汐信号`,out=`${base}/intermediate-proofs/repair-at95`,read=p=>JSON.parse(fs.readFileSync(p,'utf8')),hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
assert(!fs.existsSync(out));const before=read(`${fix}/state-before.json`),current=read(`${work}/.writer/state.json`);assert.equal(before.revision,343);assert.equal(before.units.length,95);assert(current.units.length>=95);
const unit=current.units[94],snapshot=replaySnapshots(work,current)[95],old=before.snapshot,id='P_QIU_SINGLE_27';
assert.deepEqual(before.units.slice(0,94),current.units.slice(0,94));assert.deepEqual(before.baseline,current.baseline);assert.equal(unit.sha256,before.units[94].sha256);assert.equal(hash(`${work}/${unit.draft}`),unit.sha256);assert.equal(hash(`${fix}/draft-95-before.md`),unit.sha256);
assert.equal(hash(`${fix}/journal-95-before.json`),before.units[94].journal_sha256);assert.equal(hash(`${work}/${before.units[94].journal}`),before.units[94].journal_sha256);
const expected=structuredClone(old),changes=[];
for(const field of ['reader_known','character_known.沈禾']){
 const value=field==='reader_known'?snapshot.ledger[id].reader_known:snapshot.ledger[id].character_known.沈禾,previous=field==='reader_known'?old.ledger[id].reader_known:old.ledger[id].character_known.沈禾;assert.notEqual(value,previous);
 if(field==='reader_known')expected.ledger[id].reader_known=value;else expected.ledger[id].character_known.沈禾=value;
 changes.push({field:`ledger.${id}.${field}`,before:previous,after:value});
}
assert.deepEqual(snapshot,expected,'No other snapshot fields may change');
const index=fs.readFileSync(`${phase}/commands/index.jsonl`,'utf8').trim().split(/\r?\n/).map(JSON.parse),command=label=>{const row=index.findLast(x=>x.label===label);assert(row,label);assert.equal(row.exit_code,0);assert(row.argv[0].replaceAll('\\','/').endsWith('bin/ai-writer.mjs'));return row;};
const rewind=command('rewind-95-cli'),record=command('record-95-replay-cli'),context=command('context-96-after-replay-cli'),input=read(`${fix}/record-replay.json`),packet=read(context.files.stdout),oldContext=read(`${fix}/context-96-invalidated.json`);
assert.equal(read(rewind.files.stdout).revision,344);assert.equal(read(record.files.stdout).revision,345);assert.equal(input.expected_revision,344);assert.equal(input.unit,95);assert.deepEqual(input.source_hashes,unit.source_hashes);assert.equal(input.summary,unit.summary);assert.equal(packet.revision,345);assert.equal(packet.unit,96);assert.equal(oldContext.source_hashes['.writer/state.json'],hash(`${fix}/state-before.json`));
for(const key of ['reader_known','character_known']){const actual=key==='reader_known'?snapshot.ledger[id].reader_known:snapshot.ledger[id].character_known.沈禾,submitted=key==='reader_known'?input.changes.ledger[id].reader_known:input.changes.ledger[id].character_known.沈禾;assert.equal(submitted,actual);}
const again=read(`${work}/.writer/state.json`);assert.deepEqual(again.units[94],unit,'95 changed during proof');
fs.mkdirSync(out,{recursive:true});fs.copyFileSync(`${fix}/state-before.json`,`${out}/before-state.raw.json`);fs.copyFileSync(`${fix}/record-replay.json`,`${out}/input-95-replay.json`);fs.writeFileSync(`${out}/actual-after-snapshot95.json`,JSON.stringify(snapshot,null,2)+'\n',{flag:'wx'});fs.writeFileSync(`${out}/actual-unit95.json`,JSON.stringify(unit,null,2)+'\n',{flag:'wx'});
const proof={at:new Date().toISOString(),ok:true,scope:'Independent strict snapshot comparison and actual successful CLI binding for metadata repair; not a synthetic authority state or final phase audit',before_revision:343,repaired_revision:345,earliest:95,prefix_registrations_unchanged:94,body95_unchanged:true,all_other_snapshot_fields_exact:true,ledger_ids:Object.keys(snapshot.ledger).length,changes,actual_commands:{rewind:rewind.files.metadata,record:record.files.metadata,context96:context.files.metadata},actual_after95_journal:unit.journal,actual_after95_journal_sha256:unit.journal_sha256,context96_state_sha256:packet.source_hashes['.writer/state.json'],input_sha256:hash(`${fix}/record-replay.json`),following_input_binding_pending:true};
fs.writeFileSync(`${out}/proof.json`,JSON.stringify(proof,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({ok:true,changed_fields:changes.length,prefix:94,body_unchanged:true,context96_revision:packet.revision,ledger_ids:proof.ledger_ids}));
